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
  const progressPct = total > 0 ? (answeredCount / total) * 100 : 0

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      {/* Hero header */}
      <div className="py-12 px-4 text-center text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2 opacity-70">
          This Week&apos;s Survey
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">{survey.title}</h1>
        {survey.description && (
          <p className="mt-2 text-sm opacity-70 max-w-xl mx-auto">{survey.description}</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#2C2C2C]">
              {total} question{total !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-[#6B6B6B]">
              {answeredCount}/{total} answered
            </span>
          </div>
          <div className="w-full bg-[#E8DDD0] rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: '#C94F2C', width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className="bg-white rounded-2xl border shadow-sm p-6 transition-colors"
              style={{ borderColor: unanswered.has(q.id) ? '#dc2626' : '#E8DDD0' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#C94F2C' }}>
                Question {i + 1}
              </p>
              <p className="text-base font-semibold text-[#1B3A2D] mb-4">
                {q.question_text}
              </p>

              {q.question_type === 'checkbox' && (
                <div className="space-y-3">
                  {(q.options ?? []).map((option, index) => (
                    <label key={`${q.id}-${index}-${option}`} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(answers[q.id] ?? []).includes(option)}
                        onChange={() => handleCheckboxChange(q.id, option)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: '#C94F2C' }}
                      />
                      <span className="text-sm text-[#2C2C2C] group-hover:text-[#1B3A2D]">{option}</span>
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
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: '#C94F2C' }}
                      />
                      <span className="text-sm text-[#2C2C2C] group-hover:text-[#1B3A2D]">{option}</span>
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
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 resize-none transition-colors"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                />
              )}

              {q.question_type === 'text' && (
                <input
                  type="text"
                  value={answers[q.id] ?? ''}
                  onChange={e => handleTextChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 transition-colors"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
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
            className="w-full py-4 rounded-full text-white font-semibold transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#C94F2C' }}
          >
            {isPending ? 'Submitting…' : 'Submit survey →'}
          </button>

          {survey.points_value && (
            <p className="text-sm text-[#6B6B6B]">
              You&apos;ll earn {survey.points_value} points for completing this survey.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
