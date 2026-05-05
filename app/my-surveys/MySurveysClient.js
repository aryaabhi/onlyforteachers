'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function BarChart({ options, counts, total }) {
  return (
    <div className="space-y-2 mt-2">
      {options.map(opt => {
        const count = counts[opt] ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={opt}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#2C2C2C]">{opt}</span>
              <span className="text-[#6B6B6B]">{pct}% ({count})</span>
            </div>
            <div className="h-2 rounded-full bg-[#F5EDE0] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: '#C94F2C' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function MySurveysClient({ completions, userId }) {
  const [expandedId, setExpandedId] = useState(null)
  const [resultsCache, setResultsCache] = useState({})
  const [loading, setLoading] = useState(null)

  async function loadResults(surveyId) {
    if (expandedId === surveyId) {
      setExpandedId(null)
      return
    }
    setExpandedId(surveyId)
    if (resultsCache[surveyId]) return

    setLoading(surveyId)
    const supabase = createClient()

    const [{ data: questions }, { data: myResponses }, { data: allResponses }] = await Promise.all([
      supabase.from('questions').select('*').eq('survey_id', surveyId).order('position'),
      supabase.from('responses').select('*').eq('survey_id', surveyId).eq('user_id', userId),
      supabase.from('responses').select('question_id, answer, answer_array, user_id').eq('survey_id', surveyId),
    ])

    const myAnswerMap = {}
    for (const r of myResponses ?? []) {
      myAnswerMap[r.question_id] = r.answer_array ?? r.answer
    }

    const aggregateMap = {}
    for (const r of allResponses ?? []) {
      if (!aggregateMap[r.question_id]) aggregateMap[r.question_id] = {}
      const ans = r.answer_array ?? r.answer
      if (Array.isArray(ans)) {
        for (const a of ans) {
          aggregateMap[r.question_id][a] = (aggregateMap[r.question_id][a] ?? 0) + 1
        }
      } else if (typeof ans === 'string' && ans) {
        aggregateMap[r.question_id][ans] = (aggregateMap[r.question_id][ans] ?? 0) + 1
      }
    }

    const totalRespondents = new Set((allResponses ?? []).map(r => r.user_id)).size || 1

    setResultsCache(prev => ({
      ...prev,
      [surveyId]: { questions: questions ?? [], myAnswerMap, aggregateMap, totalRespondents },
    }))
    setLoading(null)
  }

  if (completions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: '#E8DDD0' }}>
        <p className="text-[#6B6B6B]">You haven&apos;t completed any surveys yet.</p>
        <a
          href="/survey"
          className="inline-block mt-4 px-6 py-2.5 rounded-full text-white text-sm font-semibold"
          style={{ backgroundColor: '#C94F2C' }}
        >
          Take This Week&apos;s Survey →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {completions.map(c => {
        const survey = c.surveys
        const surveyId = c.survey_id
        const isExpanded = expandedId === surveyId
        const data = resultsCache[surveyId]

        return (
          <div
            key={c.id}
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: '#E8DDD0' }}
          >
            <div className="flex items-center justify-between p-5 gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-[#1B3A2D] truncate">{survey?.title ?? 'Survey'}</p>
                <p className="text-sm text-[#6B6B6B] mt-0.5">
                  Completed {formatDate(c.completed_at)}
                  {c.points_awarded ? ` · +${c.points_awarded} points` : ''}
                </p>
              </div>
              <button
                onClick={() => loadResults(surveyId)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  backgroundColor: isExpanded ? '#F5EDE0' : '#C94F2C',
                  color: isExpanded ? '#1B3A2D' : '#fff',
                }}
              >
                {isExpanded ? 'Hide results' : 'My results'}
              </button>
            </div>

            {isExpanded && (
              <div className="border-t px-5 py-5 space-y-6" style={{ borderColor: '#F5EDE0' }}>
                {loading === surveyId && (
                  <p className="text-sm text-[#6B6B6B]">Loading results…</p>
                )}
                {data && data.questions.map((q, i) => {
                  const myAnswer = data.myAnswerMap[q.id]
                  const aggregate = data.aggregateMap[q.id] ?? {}
                  const isAggregate = q.question_type === 'checkbox' || q.question_type === 'likert_scale'

                  const options = q.question_type === 'likert_scale'
                    ? ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
                    : (q.options ?? [])

                  const total = Object.values(aggregate).reduce((s, v) => s + v, 0)

                  const myAnswerDisplay = Array.isArray(myAnswer)
                    ? myAnswer.join(', ')
                    : (myAnswer ?? '—')

                  return (
                    <div key={q.id}>
                      <p className="text-sm font-semibold text-[#1B3A2D] mb-1">
                        {i + 1}. {q.question_text}
                      </p>
                      <p className="text-xs text-[#6B6B6B] mb-2">
                        Your answer: <span className="text-[#2C2C2C] font-medium">{myAnswerDisplay}</span>
                      </p>
                      {isAggregate && options.length > 0 && (
                        <div>
                          <p className="text-xs text-[#6B6B6B] mb-1">All responses ({total} total):</p>
                          <BarChart options={options} counts={aggregate} total={total} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
