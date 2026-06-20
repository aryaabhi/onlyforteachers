'use client'

import { useState } from 'react'

const LIKERT_OPTIONS = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
const TEXT_PAGE_SIZE = 20

function BarRow({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500 text-xs">{pct}% ({count})</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: '#CA9662' }}
        />
      </div>
    </div>
  )
}

function QuestionResult({ question, responses }) {
  const [textPage, setTextPage] = useState(1)
  const isAggregate = question.question_type === 'likert_scale' || question.question_type === 'checkbox' || question.question_type === 'radio'
  const options = question.question_type === 'likert_scale'
    ? LIKERT_OPTIONS
    : (question.options ?? [])

  const qResponses = responses.filter(r => r.question_id === question.id)

  if (isAggregate) {
    const counts = {}
    for (const opt of options) counts[opt] = 0
    for (const r of qResponses) {
      const ans = r.answer_array ?? r.answer
      if (Array.isArray(ans)) {
        for (const a of ans) if (a in counts) counts[a]++
      } else if (typeof ans === 'string' && ans in counts) {
        counts[ans]++
      }
    }
    const total = qResponses.length

    return (
      <div>
        {options.map(opt => (
          <BarRow key={opt} label={opt} count={counts[opt] ?? 0} total={total} />
        ))}
        <p className="text-xs text-gray-400 mt-2">{total} response{total !== 1 ? 's' : ''}</p>
      </div>
    )
  }

  const textAnswers = qResponses
    .map(r => (typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)))
    .filter(Boolean)

  const totalPages = Math.ceil(textAnswers.length / TEXT_PAGE_SIZE)
  const paged = textAnswers.slice((textPage - 1) * TEXT_PAGE_SIZE, textPage * TEXT_PAGE_SIZE)

  return (
    <div>
      <div className="space-y-2">
        {paged.length === 0 && (
          <p className="text-sm text-gray-400 italic">No responses yet.</p>
        )}
        {paged.map((ans, i) => (
          <div key={i} className="bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
            {ans}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-2 mt-3">
          <button
            disabled={textPage === 1}
            onClick={() => setTextPage(p => p - 1)}
            className="px-3 py-1 rounded text-xs border border-gray-200 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-500 self-center">
            Page {textPage} of {totalPages}
          </span>
          <button
            disabled={textPage === totalPages}
            onClick={() => setTextPage(p => p + 1)}
            className="px-3 py-1 rounded text-xs border border-gray-200 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2">{textAnswers.length} response{textAnswers.length !== 1 ? 's' : ''}</p>
    </div>
  )
}

function downloadCSV(survey, questions, responses) {
  const completionGroups = {}
  for (const r of responses) {
    const ts = r.submitted_at ?? r.created_at ?? ''
    const key = `${r.user_id}_${ts.slice(0, 10)}`
    if (!completionGroups[key]) completionGroups[key] = { date: ts, answers: {} }
    const existing = completionGroups[key].answers[r.question_id]
    const rawAns = r.answer_array ?? r.answer
    const ans = Array.isArray(rawAns) ? rawAns.join('; ') : (rawAns ?? '')
    if (!existing) completionGroups[key].answers[r.question_id] = ans
  }

  const headers = ['submission_date', ...questions.map((q, i) => `question_${i + 1}`)]
  const rows = Object.values(completionGroups).map(g => {
    const date = g.date ? new Date(g.date).toLocaleDateString('en-GB') : ''
    const cols = questions.map(q => {
      const val = g.answers[q.id] ?? ''
      return `"${String(val).replace(/"/g, '""')}"`
    })
    return [`"${date}"`, ...cols].join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `survey-${survey.id}-results.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ResultsClient({ survey, questions, responses, totalSubmissions }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => downloadCSV(survey, questions, responses)}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1B3A2D' }}
        >
          Download CSV
        </button>
      </div>

      {questions.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
          No questions found for this survey.
        </div>
      )}

      {questions.map((q, i) => (
        <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Question {i + 1}
          </p>
          <h3 className="text-base font-semibold text-gray-900 mb-4">{q.question_text}</h3>
          <QuestionResult question={q} responses={responses} />
        </div>
      ))}
    </div>
  )
}
