import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'

export const metadata = {
  title: 'UK Teacher Pulse Index — Teacher Sentiment Tracker',
  description: 'The UK Teacher Pulse Index tracks teacher sentiment across confidence, workload, support and optimism — drawn from weekly surveys of UK teachers.',
  openGraph: {
    title: 'UK Teacher Pulse Index — Teacher Sentiment Tracker',
    description: 'Track UK teacher sentiment across confidence, workload, support and optimism.',
    url: 'https://onlyforteachers.co.uk/teacher-index',
  },
}

export const revalidate = 3600

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function TPIBadge({ score }) {
  let label, cls
  if (score >= 80) { label = 'Very Positive'; cls = 'bg-green-100 text-green-800' }
  else if (score >= 60) { label = 'Positive'; cls = 'bg-emerald-100 text-emerald-700' }
  else if (score >= 40) { label = 'Neutral/Mixed'; cls = 'bg-amber-100 text-amber-700' }
  else if (score >= 20) { label = 'Negative'; cls = 'bg-orange-100 text-orange-700' }
  else { label = 'Very Negative'; cls = 'bg-red-100 text-red-700' }
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {score} · {label}
    </span>
  )
}

function avg(arr) {
  if (!arr.length) return 0
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
}

export default async function TeacherIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const service = createServiceClient()
  const { data: scores } = await service
    .from('tpi_scores')
    .select('*')
    .order('survey_date', { ascending: false })

  const { count: totalResponses } = await service
    .from('survey_completions')
    .select('id', { count: 'exact', head: true })

  const tpiScores = scores ?? []

  const totalSurveys = tpiScores.length
  const avgTPI = avg(tpiScores.map(s => s.overall_tpi))
  const earliestDate = tpiScores.length
    ? formatDate(tpiScores[tpiScores.length - 1].survey_date)
    : null

  const avgConf = avg(tpiScores.map(s => s.confidence))
  const avgWork = avg(tpiScores.map(s => s.workload))
  const avgSupp = avg(tpiScores.map(s => s.support))
  const avgOpti = avg(tpiScores.map(s => s.optimism))

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="text-white px-4 pt-16 pb-0" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-5xl mx-auto text-center pb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9A8F82' }}>
            Powered by Only For Teachers
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            UK Teacher Pulse Index
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D4C9B8' }}>
            A public record of how UK teachers think and feel about the issues that matter most
            to their profession — updated every time a survey closes.
          </p>
        </div>

        {/* Summary stats */}
        {totalSurveys > 0 && (
          <div className="max-w-4xl mx-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              {[
                { label: 'Surveys scored', value: totalSurveys },
                { label: 'Teacher responses', value: (totalResponses ?? 0).toLocaleString() },
                { label: 'Average TPI', value: avgTPI },
                { label: 'Data from', value: earliestDate },
              ].map(({ label, value }) => (
                <div key={label} className="text-center py-6 px-4">
                  <p className="text-2xl font-bold" style={{ color: '#F5EDE0' }}>{value}</p>
                  <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full leading-[0] overflow-hidden">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" fill="#1B3A2D" />
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* About the Index */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Index</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '🎯',
                title: 'Confidence',
                desc: 'How confident teachers feel about their role, their school leadership, and the direction of education policy.',
              },
              {
                icon: '📋',
                title: 'Workload',
                desc: 'A measure of perceived workload sustainability — higher scores mean workload feels more manageable.',
              },
              {
                icon: '🤝',
                title: 'Support',
                desc: 'How supported teachers feel by their school, government, and wider society.',
              },
              {
                icon: '🌱',
                title: 'Optimism',
                desc: 'How optimistic teachers feel about the future of teaching and the profession.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-5">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How It&apos;s Calculated</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              Each week, verified UK teachers complete a short survey focused on a specific aspect of
              school life. Responses are compiled and scored across four dimensions: Confidence,
              Workload, Support, and Optimism. Each dimension is scored 0–100.
            </p>
            <p>
              The Overall TPI is the arithmetic mean of all four dimension scores. A score of 0
              represents the most negative sentiment possible; 100 represents the most positive.
              Individual responses are never published — all scores are aggregated across all
              respondents for that survey.
            </p>
            <p>
              Scores are added to this index after each survey closes. The index is updated weekly
              and historical data is preserved in full.
            </p>
          </div>
          <Link
            href="/survey-methodology"
            className="inline-block mt-4 text-sm font-medium hover:opacity-70"
            style={{ color: '#C94F2C' }}
          >
            Read the full survey methodology →
          </Link>
        </section>

        {/* The full table */}
        {tpiScores.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Full Index Data</h2>
              <a
                href="/teacher-pulse-index-methodology.pdf"
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#C94F2C' }}
              >
                Download Methodology PDF →
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Survey Topic</th>
                      <th className="text-center px-4 py-3.5 font-semibold text-gray-600">Confidence</th>
                      <th className="text-center px-4 py-3.5 font-semibold text-gray-600">Workload</th>
                      <th className="text-center px-4 py-3.5 font-semibold text-gray-600">Support</th>
                      <th className="text-center px-4 py-3.5 font-semibold text-gray-600">Optimism</th>
                      <th className="text-center px-5 py-3.5 font-semibold text-gray-600">Overall TPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tpiScores.map(s => (
                      <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                          {new Date(s.survey_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">{s.survey_topic}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.confidence}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.workload}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.support}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.optimism}</td>
                        <td className="px-5 py-3.5 text-center">
                          <TPIBadge score={s.overall_tpi} />
                        </td>
                      </tr>
                    ))}

                    {/* Averages row */}
                    <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
                      <td className="px-5 py-3.5 text-gray-700" colSpan={2}>Overall Averages</td>
                      <td className="px-4 py-3.5 text-center text-gray-900">{avgConf}</td>
                      <td className="px-4 py-3.5 text-center text-gray-900">{avgWork}</td>
                      <td className="px-4 py-3.5 text-center text-gray-900">{avgSupp}</td>
                      <td className="px-4 py-3.5 text-center text-gray-900">{avgOpti}</td>
                      <td className="px-5 py-3.5 text-center">
                        <TPIBadge score={avgTPI} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : (
          <section className="text-center py-16 rounded-2xl bg-gray-50">
            <p className="text-gray-500 text-lg">No TPI data published yet.</p>
            <p className="text-gray-400 text-sm mt-2">Scores will appear here as surveys complete.</p>
          </section>
        )}

        {/* Citation */}
        <section className="border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-500 leading-relaxed">
            <strong>Citation:</strong> Only For Teachers (2025). <em>UK Teacher Pulse Index</em>.
            Retrieved from onlyforteachers.co.uk/teacher-index. Data collected from verified UK
            teachers via weekly surveys. All scores are aggregated — individual responses are never
            published. Free to use for journalism, research, and policy with attribution.
          </p>
          <p className="text-sm text-gray-400 mt-3">
            {isLoggedIn ? (
              <>Want to contribute? <Link href="/survey" className="underline" style={{ color: '#C94F2C' }}>Take this week&apos;s survey →</Link></>
            ) : (
              <>Want to contribute? <Link href="/register" className="underline" style={{ color: '#C94F2C' }}>Join free →</Link></>
            )}
          </p>
        </section>
      </div>
    </main>
  )
}
