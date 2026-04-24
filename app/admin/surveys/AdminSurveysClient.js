'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSurveyAction, addQuestionAction } from '@/app/actions/admin'

const QUESTION_TYPES = [
  { value: 'likert_scale', label: 'Likert Scale (Strongly Agree → Strongly Disagree)' },
  { value: 'checkbox', label: 'Checkbox (multiple choice)' },
  { value: 'textarea', label: 'Text Area (long answer)' },
  { value: 'text', label: 'Text (short answer)' },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminSurveysClient({ initialSurveys, completionCounts }) {
  const [surveys, setSurveys] = useState(initialSurveys)
  const [activeSurveyId, setActiveSurveyId] = useState(null)
  const [surveyQuestions, setSurveyQuestions] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createError, setCreateError] = useState('')
  const [questionError, setQuestionError] = useState('')
  const [isPendingCreate, startCreate] = useTransition()
  const [isPendingQuestion, startQuestion] = useTransition()
  const router = useRouter()

  async function handleCreateSurvey(e) {
    e.preventDefault()
    setCreateError('')
    const formData = new FormData(e.target)
    startCreate(async () => {
      const result = await createSurveyAction(formData)
      if (result?.error) {
        setCreateError(result.error)
      } else if (result?.survey) {
        router.push(`/admin/surveys/${result.survey.id}/questions`)
      }
    })
  }

  async function handleAddQuestion(e) {
    e.preventDefault()
    setQuestionError('')
    const formData = new FormData(e.target)
    startQuestion(async () => {
      const result = await addQuestionAction(formData)
      if (result?.error) {
        setQuestionError(result.error)
      } else if (result?.question) {
        setSurveyQuestions(prev => ({
          ...prev,
          [activeSurveyId]: [...(prev[activeSurveyId] ?? []), result.question],
        }))
        e.target.reset()
      }
    })
  }

  const activeSurvey = surveys.find(s => s.id === activeSurveyId)
  const activeQuestions = surveyQuestions[activeSurveyId] ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
        <button
          onClick={() => setShowCreateForm(v => !v)}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#CA9662' }}
        >
          {showCreateForm ? 'Cancel' : '+ New Survey'}
        </button>
      </div>

      {/* Create survey form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Create New Survey</h2>
          <form onSubmit={handleCreateSurvey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="title"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#CA9662' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 resize-none"
                style={{ '--tw-ring-color': '#CA9662' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#CA9662' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  name="startTime"
                  type="time"
                  required
                  defaultValue="09:00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#CA9662' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  name="endDate"
                  type="date"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#CA9662' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  name="endTime"
                  type="time"
                  required
                  defaultValue="23:59"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#CA9662' }}
                />
              </div>
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Points Value</label>
              <input
                name="pointsValue"
                type="number"
                min="1"
                defaultValue="100"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#CA9662' }}
              />
            </div>
            {createError && <p className="text-sm text-red-500">{createError}</p>}
            <button
              type="submit"
              disabled={isPendingCreate}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#CA9662' }}
            >
              {isPendingCreate ? 'Creating…' : 'Create Survey'}
            </button>
          </form>
        </div>
      )}

      {/* Surveys table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Starts</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Ends</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Responses</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {surveys.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No surveys yet
                  </td>
                </tr>
              )}
              {surveys.map(survey => (
                <tr key={survey.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-gray-900">{survey.title}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(survey.starts_at)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(survey.ends_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      survey.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {survey.status ?? 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {completionCounts[survey.id] ?? 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/surveys/${survey.id}/edit`}
                        className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/surveys/${survey.id}/questions`}
                        className="text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: '#CA9662' }}
                      >
                        Questions
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add questions panel */}
      {activeSurvey && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Questions for: {activeSurvey.title}
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            {activeQuestions.length} question{activeQuestions.length !== 1 ? 's' : ''} added
          </p>

          {activeQuestions.length > 0 && (
            <div className="mb-5 space-y-2">
              {activeQuestions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-xs font-semibold text-gray-400 mt-0.5 w-6 shrink-0">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">{q.question_text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{q.question_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AddQuestionForm
            surveyId={activeSurveyId}
            nextPosition={activeQuestions.length + 1}
            onSubmit={handleAddQuestion}
            isPending={isPendingQuestion}
            error={questionError}
          />
        </div>
      )}
    </div>
  )
}

function AddQuestionForm({ surveyId, nextPosition, onSubmit, isPending, error }) {
  const [questionType, setQuestionType] = useState('likert_scale')

  return (
    <form onSubmit={onSubmit} className="space-y-4 border-t border-gray-100 pt-5">
      <input type="hidden" name="surveyId" value={surveyId} />
      <input type="hidden" name="position" value={nextPosition} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
        <input
          name="questionText"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': '#CA9662' }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
        <select
          name="questionType"
          value={questionType}
          onChange={e => setQuestionType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 bg-white"
          style={{ '--tw-ring-color': '#CA9662' }}
        >
          {QUESTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {questionType === 'checkbox' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options <span className="text-gray-400 font-normal">(one per line)</span>
          </label>
          <textarea
            name="options"
            rows={4}
            placeholder={"Option A\nOption B\nOption C"}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 resize-none font-mono"
            style={{ '--tw-ring-color': '#CA9662' }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#CA9662' }}
      >
        {isPending ? 'Adding…' : 'Add Question'}
      </button>
    </form>
  )
}
