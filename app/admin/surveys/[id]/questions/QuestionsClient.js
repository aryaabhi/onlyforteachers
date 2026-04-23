'use client'

import { useState, useTransition } from 'react'
import { addQuestionAction, deleteQuestionAction, setSurveyReadyAction } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

const QUESTION_TYPES = [
  { value: 'likert_scale', label: 'Likert Scale (Strongly Agree → Strongly Disagree)' },
  { value: 'checkbox', label: 'Checkbox (multiple choice)' },
  { value: 'textarea', label: 'Text Area (long answer)' },
  { value: 'text', label: 'Text (short answer)' },
]

export default function QuestionsClient({ survey, initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [questionType, setQuestionType] = useState('likert_scale')
  const [addError, setAddError] = useState('')
  const [readyMsg, setReadyMsg] = useState('')
  const [readyError, setReadyError] = useState('')
  const [isPendingAdd, startAdd] = useTransition()
  const [isPendingReady, startReady] = useTransition()
  const router = useRouter()

  async function handleAddQuestion(e) {
    e.preventDefault()
    setAddError('')
    const formData = new FormData(e.target)
    startAdd(async () => {
      const result = await addQuestionAction(formData)
      if (result?.error) {
        setAddError(result.error)
      } else if (result?.question) {
        setQuestions(prev => [...prev, result.question])
        e.target.reset()
        setQuestionType('likert_scale')
      }
    })
  }

  async function handleDelete(questionId) {
    const result = await deleteQuestionAction(questionId)
    if (!result?.error) {
      setQuestions(prev => prev.filter(q => q.id !== questionId))
    }
  }

  function handleSetReady() {
    setReadyMsg('')
    setReadyError('')
    startReady(async () => {
      const result = await setSurveyReadyAction(survey.id)
      if (result?.error) {
        setReadyError(result.error)
      } else {
        setReadyMsg(`Survey marked as "${result.status}".`)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{survey.title}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {questions.length} question{questions.length !== 1 ? 's' : ''} added
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={handleSetReady}
              disabled={isPendingReady || questions.length === 0}
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#16a34a' }}
            >
              {isPendingReady ? 'Saving…' : 'Survey is Ready'}
            </button>
            {readyMsg && <p className="text-xs text-green-600 mt-1">{readyMsg}</p>}
            {readyError && <p className="text-xs text-red-500 mt-1">{readyError}</p>}
          </div>
        </div>

        {questions.length > 0 && (
          <div className="space-y-2 mb-6">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-400 mt-0.5 w-6 shrink-0">
                  {i + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{q.question_text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.question_type}</p>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddQuestion} className="space-y-4 border-t border-gray-100 pt-5">
          <input type="hidden" name="surveyId" value={survey.id} />
          <input type="hidden" name="position" value={questions.length + 1} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <input
              name="questionText"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <select
              name="questionType"
              value={questionType}
              onChange={e => setQuestionType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 bg-white"
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
              />
            </div>
          )}

          {addError && <p className="text-sm text-red-500">{addError}</p>}

          <button
            type="submit"
            disabled={isPendingAdd}
            className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#CA9662' }}
          >
            {isPendingAdd ? 'Adding…' : 'Add Question'}
          </button>
        </form>
      </div>
    </div>
  )
}
