import { createClient } from '@/lib/supabase/server'
import { client } from '@/lib/sanity'
import Link from 'next/link'

export const metadata = {
  title: 'UK Teacher Pulse Index | Only For Teachers',
  description: 'The UK Teacher Pulse Index — a public record of how UK teachers think and feel about the issues that matter most to their profession.',
}

export const revalidate = 3600

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const LIKERT_OPTIONS = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']

async function getSurveyHighlights(supabase, surveyId) {
  const [{ data: questions }, { data: responses }] = await Promise.all([
    supabase.from('questions').select('id, question_text, question_type, options').eq('survey_id', surveyId).order('position').limit(3),
    supabase.from('responses').select('question_id, answer, answer_array').eq('survey_id', surveyId),
  ])

  if (!questions || questions.length === 0) return []

  const highlights = []
  for (const q of questions) {
    const isAggregate = q.question_type === 'likert_scale' || q.question_type === 'checkbox'
    if (!isAggregate) continue

    const options = q.question_type === 'likert_scale' ? LIKERT_OPTIONS : (q.options ?? [])
    const qResponses = responses?.filter(r => r.question_id === q.id) ?? []
    if (qResponses.length === 0) continue

    const counts = {}
    for (const opt of options) counts[opt] = 0
    for (const r of qResponses) {
      const ans = r.answer_array ?? r.answer
      if (Array.isArray(ans)) for (const a of ans) { if (a in counts) counts[a]++ }
      else if (typeof ans === 'string' && ans in counts) counts[ans]++
    }

    const topOption = Object.entries(counts).sort(([,a],[,b]) => b - a)[0]
    if (!topOption) continue

    const pct = Math.round((topOption[1] / qResponses.length) * 100)
    highlights.push({ question: q.question_text, topAnswer: topOption[0], pct, total: qResponses.length })
  }
  return highlights
}

export default async function TeacherIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const now = new Date().toISOString()

  const [{ data: surveys }, reports] = await Promise.all([
    supabase
      .from('surveys')
      .select('id, title, ends_at, starts_at')
      .lt('ends_at', now)
      .order('ends_at', { ascending: false }),
    client.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        title, "slug": slug.current, publishedAt, excerpt
      }`
    ).catch(() => []),
  ])

  const surveyHighlights = {}
  if (surveys && surveys.length > 0) {
    const highlightResults = await Promise.all(
      surveys.slice(0, 5).map(async s => ({
        id: s.id,
        highlights: await getSurveyHighlights(supabase, s.id),
      }))
    )
    for (const { id, highlights } of highlightResults) {
      surveyHighlights[id] = highlights
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">UK Teacher Pulse Index</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A public record of how UK teachers think and feel about the issues that matter
          most to their profession. Updated after each weekly survey closes.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ExplainerCard icon="📊" title="What It Measures" description="Workload, wellbeing, pay, curriculum, technology, leadership, and more — tracking teacher sentiment over time." />
          <ExplainerCard icon="👩‍🏫" title="Who Contributes" description="Verified UK teaching professionals across all school types, year groups, and subject areas." />
          <ExplainerCard icon="🔓" title="Freely Available" description="All results are publicly accessible. Free to use for journalism, research, and policy — with attribution." />
        </section>

        <section className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How the Index Works</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              The UK Teacher Pulse Index is built from weekly surveys sent to verified UK teachers.
              Each survey focuses on a specific theme — from workload and wellbeing to pay, curriculum design,
              and the use of technology in classrooms.
            </p>
            <p>
              Results are aggregated across all respondents and published here after each survey closes.
              No individual responses are ever published. Participation is voluntary and anonymous.
            </p>
          </div>
          <Link
            href="/survey-methodology"
            className="inline-block mt-4 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#C94F2C' }}
          >
            Read the full methodology →
          </Link>
        </section>

        {reports && reports.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Survey Reports</h2>
            <div className="space-y-3">
              {reports.map(report => (
                <div
                  key={report.slug}
                  className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{formatDate(report.publishedAt)}</p>
                    {report.excerpt && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">{report.excerpt}</p>
                    )}
                  </div>
                  <Link
                    href={`/survey-results/${report.slug}`}
                    className="flex-shrink-0 ml-4 text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50 whitespace-nowrap"
                    style={{ color: '#C94F2C' }}
                  >
                    Read report →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Survey Archive</h2>

          {surveys && surveys.length > 0 ? (
            <div className="space-y-4">
              {surveys.map(survey => (
                <SurveyRow
                  key={survey.id}
                  survey={survey}
                  highlights={surveyHighlights[survey.id] ?? []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 text-lg mb-2">No completed surveys yet</p>
              <p className="text-gray-400 text-sm">
                Results will appear here once surveys close. Check back soon.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#F5EDE0' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isLoggedIn ? 'Participate in future surveys' : 'Contribute to the index'}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            {isLoggedIn
              ? 'Complete each weekly survey to add your voice to the UK Teacher Pulse Index.'
              : 'Join Only For Teachers to participate in weekly surveys and help shape the Teacher Pulse Index.'}
          </p>
          <Link
            href={isLoggedIn ? '/survey' : '/register'}
            className="inline-block px-8 py-3 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1B3A2D' }}
          >
            {isLoggedIn ? "Take This Week's Survey" : 'Join Free'}
          </Link>
        </section>

        <section className="border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-500 leading-relaxed">
            Want to understand how our surveys are designed and how we compile results?{' '}
            <Link href="/survey-methodology" className="font-medium" style={{ color: '#C94F2C' }}>
              Read our Survey Methodology
            </Link>.
          </p>
        </section>
      </div>
    </main>
  )
}

function ExplainerCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function SurveyRow({ survey, highlights }) {
  const endDate = new Date(survey.ends_at)
  const formatted = endDate.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium text-gray-900">{survey.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">Closed {formatted}</p>
        </div>
        <Link
          href={`/survey-results/data/${survey.id}`}
          className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
          style={{ color: '#C94F2C' }}
        >
          View data →
        </Link>
      </div>
      {highlights.length > 0 && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Key findings</p>
            {highlights.map((h, i) => (
              <div key={i} className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{h.pct}%</span> said &ldquo;{h.topAnswer}&rdquo; on: {h.question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
