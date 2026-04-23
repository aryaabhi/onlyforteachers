import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const LIKERT_OPTIONS = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']

export default async function SurveyResultDetailPage({ params }) {
  const { surveyId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: completion } = await supabase
    .from('survey_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('survey_id', surveyId)
    .maybeSingle()

  if (!completion) redirect('/survey-results')

  const [{ data: survey }, { data: questions }] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', surveyId).single(),
    supabase.from('questions').select('*').eq('survey_id', surveyId).order('position'),
  ])

  if (!survey || !questions) redirect('/survey-results')

  const questionResults = await Promise.all(
    questions.map(async q => {
      if (q.question_type === 'checkbox') {
        const { data: responses } = await supabase
          .from('responses')
          .select('answer_array')
          .eq('question_id', q.id)
        const counts = {}
        for (const r of responses ?? []) {
          for (const opt of r.answer_array ?? []) {
            counts[opt] = (counts[opt] ?? 0) + 1
          }
        }
        return { ...q, resultType: 'aggregate', counts, total: (responses ?? []).length, options: q.options ?? [] }
      }
      if (q.question_type === 'likert_scale') {
        const { data: responses } = await supabase
          .from('responses')
          .select('answer')
          .eq('question_id', q.id)
        const counts = {}
        for (const r of responses ?? []) {
          if (r.answer) counts[r.answer] = (counts[r.answer] ?? 0) + 1
        }
        return { ...q, resultType: 'aggregate', counts, total: (responses ?? []).length, options: LIKERT_OPTIONS }
      }
      const { data: response } = await supabase
        .from('responses')
        .select('answer')
        .eq('question_id', q.id)
        .eq('user_id', user.id)
        .maybeSingle()
      return { ...q, resultType: 'own', answer: response?.answer ?? '' }
    })
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/survey-results"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
        >
          ← Back to Survey Results
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{survey.title}</h1>
        {survey.description && (
          <p className="text-sm text-gray-500 mb-8">{survey.description}</p>
        )}

        <div className="space-y-6 mt-6">
          {questionResults.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">
                {i + 1}. {q.question_text}
              </p>
              {q.resultType === 'aggregate' ? (
                <AggregateChart options={q.options} counts={q.counts} total={q.total} />
              ) : (
                <div className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3">
                  {q.answer || <span className="text-gray-400 italic">No answer submitted</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function AggregateChart({ options, counts, total }) {
  return (
    <div className="space-y-3">
      {options.map(opt => {
        const count = counts[opt] ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={opt}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">{opt}</span>
              <span className="text-xs text-gray-500">{count} ({pct}%)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: '#CA9662' }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-gray-400 mt-1">{total} total {total === 1 ? 'response' : 'responses'}</p>
    </div>
  )
}
