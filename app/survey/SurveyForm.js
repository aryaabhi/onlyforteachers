'use client'

import { useState, useTransition } from 'react'
import { submitSurveyAction } from '@/app/actions/survey'

const LIKERT_OPTIONS = [
  'Strongly Agree',
  'Agree',
  'Neutral',
  'Disagree',
  'Strongly Disagree',
]

export default function SurveyForm({ survey, questions }) {
  const [answers, setAnswers] = useState({})
  const [unanswered, setUnanswered] = useState(new Set())
  const [submitError, setSubmitError] = useState('')
  const [isPending, startTransition] = useTransition()

  const total = questions.length

  function isAnswered(questionId) {
    const q = questions.find(q => q.id === questionId)
    if (!q) return false
    const a = answers[questionId]
    if (q.question_type === 'checkbox') return Array.isArray(a) && a.length > 0
    return a !== undefined && a !== ''
  }

  function handleCheckboxChange(questionId, option) {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : []
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option]
      return { ...prev, [questionId]: updated }
    })
    setUnanswered(prev => { const next = new Set(prev); next.delete(questionId); return next })
  }

  function handleRadioChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setUnanswered(prev => { const next = new Set(prev); next.delete(questionId); return next })
  }

  function handleTextChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (value.trim()) {
      setUnanswered(prev => { const next = new Set(prev); next.delete(questionId); return next })
    }
  }

  function handleSubmit() {
    const missing = new Set(questions.filter(q => !isAnswered(q.id)).map(q => q.id))
    if (missing.size > 0) {
      setUnanswered(missing)
      setSubmitError('Please answer all questions before submitting.')
      const firstMissing = questions.find(q => missing.has(q.id))
      if (firstMissing) {
        document.getElementById(`q-${firstMissing.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setSubmitError('')
    startTransition(() => {
      submitSurveyAction(survey.id, answers)
    })
  }

  const answeredCount = questions.filter(q => isAnswered(q.id)).length

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          {survey.description && (
            <p className="mt-1 text-gray-500 text-sm">{survey.description}</p>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {total} question{total !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-gray-400">
              {answeredCount}/{total} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: '#CA9662',
                width: total > 0 ? `${(answeredCount / total) * 100}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* All questions */}
        <div className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className={`bg-white rounded-2xl border shadow-sm p-6 transition-colors ${
                unanswered.has(q.id) ? 'border-red-300' : 'border-gray-100'
              }`}
            >
              <p className="text-base font-semibold text-gray-900 mb-4">
                {i + 1}. {q.question_text}
              </p>

              {q.question_type === 'checkbox' && (
                <div className="space-y-3">
                  {(q.options ?? []).map(option => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(answers[q.id] ?? []).includes(option)}
                        onChange={() => handleCheckboxChange(q.id, option)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                        style={{ accentColor: '#CA9662' }}
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.question_type === 'likert_scale' && (
                <div className="space-y-3">
                  {LIKERT_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleRadioChange(q.id, option)}
                        className="w-5 h-5 border-gray-300 cursor-pointer"
                        style={{ accentColor: '#CA9662' }}
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.question_type === 'textarea' && (
                <textarea
                  value={answers[q.id] ?? ''}
                  onChange={e => handleTextChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ '--tw-ring-color': '#CA9662' }}
                />
              )}

              {q.question_type === 'text' && (
                <input
                  type="text"
                  value={answers[q.id] ?? ''}
                  onChange={e => handleTextChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#CA9662' }}
                />
              )}

              {unanswered.has(q.id) && (
                <p className="mt-2 text-sm text-red-500">Please answer this question.</p>
              )}
            </div>
          ))}
        </div>

        {submitError && (
          <p className="mb-4 text-sm text-red-500 text-center">{submitError}</p>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full sm:w-auto px-8 py-3 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#CA9662' }}
          >
            {isPending ? 'Submitting…' : 'Submit Survey'}
          </button>

          {survey.points_value && (
            <p className="text-sm text-gray-400">
              You&apos;ll earn {survey.points_value} points for completing this survey.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
