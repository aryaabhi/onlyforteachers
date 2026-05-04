'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AskForm({ userEmail = '', userName = '' }) {
  const [questionText, setQuestionText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!questionText.trim()) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('community_questions')
      .insert({
        question_text: questionText.trim(),
        name: userName || null,
        email: userEmail || null,
      })

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank you!</h2>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Your question has been submitted. We review all questions and the best ones
          will appear in future surveys.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Your question <span style={{ color: '#C94F2C' }}>*</span>
        </label>
        <textarea
          id="question"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          required
          rows={4}
          placeholder="What question would you like asked to UK teachers?"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 resize-none"
          style={{ '--tw-ring-color': '#C94F2C' }}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Questions must be relevant to UK teachers and their profession.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !questionText.trim()}
        className="w-full sm:w-auto px-8 py-3 rounded-full text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#C94F2C' }}
      >
        {loading ? 'Submitting…' : 'Submit Question'}
      </button>
    </form>
  )
}
