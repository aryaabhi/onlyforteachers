import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

const LIKERT_OPTIONS = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: survey } = await supabase
    .from('surveys')
    .select('title, description')
    .eq('id', id)
    .single()

  if (!survey) return { title: 'Survey Not Found' }

  return {
    title: `${survey.title} — Results | Only For Teachers`,
    description: survey.description || `Aggregate results from the "${survey.title}" survey of UK teachers.`,
    openGraph: {
      title: `${survey.title} — Results | Only For Teachers`,
      description: survey.description || 'UK teacher survey aggregate results.',
      type: 'article',
    },
  }
}

export default async function SurveyDataPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [{ data: survey }, { data: questions }] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', id).single(),
    supabase.from('questions').select('*').eq('survey_id', id).order('position'),
  ])

  // Only show data for surveys that have ended
  if (!survey || !questions || survey.ends_at > now) notFound()

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
      // For text/textarea: show total response count, no individual answers (privacy)
      const { count } = await supabase
        .from('responses')
        .select('id', { count: 'exact', head: true })
        .eq('question_id', q.id)
      return { ...q, resultType: 'text', total: count ?? 0 }
    })
  )

  const closedDate = new Date(survey.ends_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/survey-results"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
        >
          ← Survey Results
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{survey.title}</h1>
        <p className="text-sm text-gray-500 mb-2">Closed {closedDate}</p>
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
                <p className="text-sm text-gray-500">
                  {q.total} open-ended {q.total === 1 ? 'response' : 'responses'} received.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl p-6 text-center" style={{ backgroundColor: '#FDF8F3' }}>
          <p className="text-gray-700 font-medium mb-4">
            Want to contribute to future surveys?
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Join Free
          </Link>
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
