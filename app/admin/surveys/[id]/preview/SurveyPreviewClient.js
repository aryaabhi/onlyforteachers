'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'

const LIKERT_OPTIONS = [
  'Strongly Agree',
  'Agree',
  'Neutral',
  'Disagree',
  'Strongly Disagree',
]

export default function SurveyPreviewClient({ survey, questions }) {
  const [answers, setAnswers] = useState({})
  const [toastVisible, setToastVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const total = questions.length
  const answeredCount = questions.filter(q => isAnswered(q, answers)).length
  const progressPct = total > 0 ? (answeredCount / total) * 100 : 0

  function handleCheckboxChange(questionId, option) {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : []
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option]
      return { ...prev, [questionId]: updated }
    })
  }

  function handleRadioChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function handleTextChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function handleSubmit() {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 4000)
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      {/* Preview banner */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between gap-4" style={{ backgroundColor: '#C94F2C' }}>
        <Link
          href="/admin/surveys"
          className="text-sm font-medium text-white opacity-90 hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          ← Back to admin
        </Link>
        <p className="text-sm text-white font-medium text-center">
          Preview mode — this is how teachers will see this survey. Responses cannot be submitted in preview mode.
        </p>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-sm font-medium text-white opacity-90 hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Share preview'}
        </button>
      </div>

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

        {questions.length === 0 && (
          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center" style={{ borderColor: '#E8DDD0' }}>
            <p className="text-[#6B6B6B]">No questions have been added to this survey yet.</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className="bg-white rounded-2xl border shadow-sm p-6"
              style={{ borderColor: '#E8DDD0' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#C94F2C' }}>
                Question {i + 1}
              </p>
              <p className="text-base font-semibold text-[#1B3A2D] mb-4">
                {q.question_text}
                {q.is_required === false && (
                  <span className="ml-2 text-xs font-normal text-[#9A8F82]">(optional)</span>
                )}
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

              {q.question_type === 'radio' && (
                <div className="space-y-3">
                  {(q.options ?? []).map((option, index) => (
                    <label key={`${q.id}-${index}-${option}`} className="flex items-center gap-3 cursor-pointer group">
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
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 rounded-full text-white font-semibold transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: '#C94F2C' }}
          >
            Preview only
          </button>
          {survey.points_value && (
            <p className="text-sm text-[#6B6B6B]">
              Teachers will earn {survey.points_value} points for completing this survey.
            </p>
          )}
        </div>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium" style={{ backgroundColor: '#1B3A2D' }}>
          This is a preview. Teachers will be able to submit responses when the survey is active.
        </div>
      )}
    </main>
  )
}

function isAnswered(q, answers) {
  const a = answers[q.id]
  if (q.question_type === 'checkbox') return Array.isArray(a) && a.length > 0
  return a !== undefined && a !== ''
}
