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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [validationError, setValidationError] = useState('')
  const [isPending, startTransition] = useTransition()

  const total = questions.length
  const current = questions[currentIndex]

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
    setValidationError('')
  }

  function handleRadioChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setValidationError('')
  }

  function handleTextChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setValidationError('')
  }

  function handleNext() {
    if (!isAnswered(current.id)) {
      setValidationError('Please answer this question before continuing.')
      return
    }
    setValidationError('')
    setCurrentIndex(i => i + 1)
  }

  function handleBack() {
    setValidationError('')
    setCurrentIndex(i => i - 1)
  }

  function handleSubmit() {
    if (!isAnswered(current.id)) {
      setValidationError('Please answer this question before submitting.')
      return
    }
    const unanswered = questions.find(q => !isAnswered(q.id))
    if (unanswered) {
      setValidationError('All questions must be answered before submitting.')
      return
    }
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

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentIndex + 1} of {total}
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
                width: `${((currentIndex + 1) / total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-base font-semibold text-gray-900 mb-4">
            {currentIndex + 1}. {current.question_text}
          </p>

          {current.question_type === 'checkbox' && (
            <div className="space-y-3">
              {(current.options ?? []).map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(answers[current.id] ?? []).includes(option)}
                    onChange={() => handleCheckboxChange(current.id, option)}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: '#CA9662' }}
                  />
                  <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {current.question_type === 'likert_scale' && (
            <div className="space-y-3">
              {LIKERT_OPTIONS.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    value={option}
                    checked={answers[current.id] === option}
                    onChange={() => handleRadioChange(current.id, option)}
                    className="w-5 h-5 border-gray-300 cursor-pointer"
                    style={{ accentColor: '#CA9662' }}
                  />
                  <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {current.question_type === 'textarea' && (
            <textarea
              value={answers[current.id] ?? ''}
              onChange={e => handleTextChange(current.id, e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ '--tw-ring-color': '#CA9662' }}
            />
          )}

          {current.question_type === 'text' && (
            <input
              type="text"
              value={answers[current.id] ?? ''}
              onChange={e => handleTextChange(current.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#CA9662' }}
            />
          )}

          {validationError && (
            <p className="mt-3 text-sm text-red-500">{validationError}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Back
          </button>

          {currentIndex < total - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#CA9662' }}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#CA9662' }}
            >
              {isPending ? 'Submitting…' : 'Submit Survey'}
            </button>
          )}
        </div>

        {survey.points_value && (
          <p className="mt-4 text-center text-sm text-gray-400">
            You'll earn {survey.points_value} points for completing this survey.
          </p>
        )}
      </div>
    </main>
  )
}
