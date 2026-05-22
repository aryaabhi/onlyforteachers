import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'

export const metadata = {
  title: 'UK Teacher Pulse Index — Teacher Sentiment Tracker | Only for Teachers',
  description: 'The UK Teacher Pulse Index tracks teacher sentiment across confidence, workload, support and optimism - drawn from weekly surveys of UK teachers. 25 surveys, 2,888 responses.',
}

export const revalidate = 604800

function formatTableDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatShortDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-GB', { month: 'short' })
  const year = d.getFullYear().toString().slice(2)
  return `${month} '${year}`
}

function avg(arr) {
  const vals = arr.filter(v => v != null)
  if (!vals.length) return 0
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
}

function avgDecimal(arr) {
  const vals = arr.filter(v => v != null)
  if (!vals.length) return '0.0'
  return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)
}

function tpiStyle(score) {
  if (score >= 80) return { backgroundColor: '#1B3A2D', color: '#ffffff' }
  if (score >= 60) return { backgroundColor: '#2E6B4F', color: '#ffffff' }
  if (score >= 40) return { backgroundColor: '#D97706', color: '#ffffff' }
  if (score >= 20) return { backgroundColor: '#C94F2C', color: '#ffffff' }
  return { backgroundColor: '#DC2626', color: '#ffffff' }
}

function TPICell({ score }) {
  if (score == null) return <span className="text-gray-400">—</span>
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={tpiStyle(score)}
    >
      {score}
    </span>
  )
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'UK Teacher Pulse Index 2025-2026',
  description: 'A multi-dimensional sentiment tracker measuring UK teacher confidence, workload, support and optimism across 25 weekly surveys',
  url: 'https://onlyforteachers.co.uk/teacher-index',
  creator: {
    '@type': 'Organization',
    name: 'Only for Teachers',
    url: 'https://onlyforteachers.co.uk',
  },
  datePublished: '2025-09-01',
  dateModified: '2026-03-22',
  license: 'https://onlyforteachers.co.uk/privacy-policy',
  temporalCoverage: '2025-09/2026-03',
  spatialCoverage: 'United Kingdom',
  variableMeasured: [
    'Teacher confidence',
    'Teacher workload',
    'Teacher support',
    'Teacher optimism',
  ],
}

export default async function TeacherIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const service = createServiceClient()
  const { data: scores } = await service
    .from('tpi_scores')
    .select('*')
    .order('survey_date', { ascending: true })

  const tpiScores = scores ?? []
  const totalSurveys = tpiScores.length

  const respondentsSum = tpiScores.reduce((sum, s) => sum + (s.respondents ?? 0), 0)
  const totalResponses = respondentsSum > 0 ? respondentsSum : 2888

  const avgTPI = avgDecimal(tpiScores.map(s => s.overall_tpi))
  const earliestDate = tpiScores.length ? formatShortDate(tpiScores[0].survey_date) : '—'

  const avgConf = avg(tpiScores.map(s => s.confidence))
  const avgWork = avg(tpiScores.map(s => s.workload))
  const avgSupp = avg(tpiScores.map(s => s.support))
  const avgOpti = avg(tpiScores.map(s => s.optimism))
  const avgOverall = avg(tpiScores.map(s => s.overall_tpi))

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* 1. HERO */}
      <section style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-5xl mx-auto px-4 pt-16 text-center">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ color: '#9A8F82' }}
          >
            Only for Teachers · Original Research
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5"
            style={{ color: '#F5EDE0', fontFamily: "'Cormorant Garant', serif" }}
          >
            UK Teacher Pulse Index
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-14" style={{ color: '#D4C9B8' }}>
            A multi-dimensional sentiment tracker drawn from weekly surveys of UK teachers
          </p>

          {/* 2. STATS BAR */}
          {totalSurveys > 0 && (
            <div
              className="grid grid-cols-2 sm:grid-cols-4 border-t border-b"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
            >
              {[
                { label: 'Total surveys', value: totalSurveys },
                { label: 'Total responses', value: totalResponses.toLocaleString() },
                { label: 'Average TPI', value: avgTPI },
                { label: 'Data from', value: earliestDate },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className="py-7 px-4"
                  style={{
                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                  }}
                >
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#C94F2C' }}>
                    {value}
                  </p>
                  <p className="text-xs uppercase tracking-wide" style={{ color: '#9A8F82' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wave transition to cream */}
        <div className="w-full overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" fill="#F5EDE0" />
          </svg>
        </div>
      </section>

      {/* 3. ABOUT THE INDEX */}
      <section style={{ backgroundColor: '#F5EDE0' }} className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1B3A2D' }}>
            About the index
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Confidence (0–100)',
                desc: "How prepared, capable and self-assured teachers feel regarding the survey topic — covering skill levels, adoption rates and willingness to engage with new approaches.",
              },
              {
                title: 'Workload (0–100)',
                desc: "The perceived impact on teachers' time and effort. A high score means the topic eases workload; a low score means it adds burden or administrative pressure.",
              },
              {
                title: 'Support (0–100)',
                desc: "Quality and availability of institutional support — including training, resources, clear school policy, and CPD access relevant to the topic.",
              },
              {
                title: 'Optimism (0–100)',
                desc: "Forward-looking sentiment — whether teachers feel positive or negative about the direction of travel, derived from motivations versus concerns and barriers.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-3 text-base" style={{ color: '#1B3A2D' }}>{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1B3A2D' }}>
            Methodology
          </h2>
          <div className="space-y-5 text-sm leading-relaxed text-gray-700 max-w-3xl">
            <p>
              <strong>How it works:</strong> Each week, teachers registered with Only for Teachers complete a
              short anonymous survey on a topic affecting their profession. For every survey, each question is
              classified into one or more of the four dimensions above and scored 0–100 based on response
              patterns. The Overall TPI is the unweighted mean of all four dimension scores.
            </p>
            <p>
              <strong>Who responds:</strong> Active UK teachers who have registered with the Only for Teachers
              platform. Participation is voluntary and all responses are anonymous. Our surveys target a
              specific, verified professional community rather than a general population panel.
            </p>
            <p>
              <strong>Limitations:</strong> The TPI is based on self-selected respondents and does not claim to
              be statistically representative of all UK teachers. Scoring involves analyst judgement, documented
              in full in the accompanying methodology file. Use as a directional indicator of professional
              sentiment, not as a definitive measurement.
            </p>
          </div>
        </div>
      </section>

      {/* 5. DATA TABLE */}
      {tpiScores.length > 0 && (
        <section style={{ backgroundColor: '#F5EDE0' }} className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1B3A2D' }}>
              The Teacher Pulse Index · Sep 2025 – Mar 2026
            </h2>

            {/* Colour key */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { range: '80–100', label: 'Very Positive', bg: '#1B3A2D' },
                { range: '60–79', label: 'Positive', bg: '#2E6B4F' },
                { range: '40–59', label: 'Neutral / Mixed', bg: '#D97706' },
                { range: '20–39', label: 'Negative', bg: '#C94F2C' },
                { range: '0–19', label: 'Very Negative', bg: '#DC2626' },
              ].map(({ range, label, bg }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: bg, color: '#ffffff' }}
                >
                  <span style={{ opacity: 0.75 }}>{range}</span>
                  <span>{label}</span>
                </span>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ minWidth: '640px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1B3A2D' }}>
                      {[
                        { label: 'Date', align: 'left', cls: 'px-5' },
                        { label: 'Survey topic', align: 'left', cls: 'px-5' },
                        { label: 'Confidence', align: 'center', cls: 'px-4' },
                        { label: 'Workload', align: 'center', cls: 'px-4' },
                        { label: 'Support', align: 'center', cls: 'px-4' },
                        { label: 'Optimism', align: 'center', cls: 'px-4' },
                        { label: 'Overall TPI', align: 'center', cls: 'px-5' },
                      ].map(({ label, align, cls }) => (
                        <th
                          key={label}
                          className={`py-3.5 font-semibold text-xs uppercase tracking-wide ${cls}`}
                          style={{ color: '#F5EDE0', textAlign: align }}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tpiScores.map((s, idx) => (
                      <tr
                        key={s.id}
                        style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#FDFAF6' }}
                      >
                        <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                          {formatTableDate(s.survey_date)}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">{s.survey_topic}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.confidence ?? '—'}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.workload ?? '—'}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.support ?? '—'}</td>
                        <td className="px-4 py-3.5 text-center text-gray-700">{s.optimism ?? '—'}</td>
                        <td className="px-5 py-3.5 text-center">
                          <TPICell score={s.overall_tpi} />
                        </td>
                      </tr>
                    ))}

                    {/* Averages row */}
                    <tr style={{ backgroundColor: '#1B3A2D' }}>
                      <td
                        className="px-5 py-4 font-semibold text-xs whitespace-nowrap"
                        style={{ color: '#F5EDE0' }}
                        colSpan={2}
                      >
                        Overall average · {totalSurveys} {totalSurveys === 1 ? 'survey' : 'surveys'}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold" style={{ color: '#F5EDE0' }}>{avgConf}</td>
                      <td className="px-4 py-4 text-center font-semibold" style={{ color: '#F5EDE0' }}>{avgWork}</td>
                      <td className="px-4 py-4 text-center font-semibold" style={{ color: '#F5EDE0' }}>{avgSupp}</td>
                      <td className="px-4 py-4 text-center font-semibold" style={{ color: '#F5EDE0' }}>{avgOpti}</td>
                      <td className="px-5 py-4 text-center">
                        <TPICell score={avgOverall} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. DOWNLOAD & CITATION */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <a
            href="/teacher-pulse-index-summary.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm mb-8 transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#C94F2C', color: '#ffffff' }}
          >
            Download full methodology &amp; index (PDF)
          </a>
          <div
            className="rounded-xl p-5 font-mono text-sm"
            style={{ backgroundColor: '#F5EDE0', border: '1px solid #D9CFBF', color: '#2C2C2C' }}
          >
            <p
              className="text-xs font-sans font-semibold uppercase tracking-wide mb-2"
              style={{ color: '#9A8F82' }}
            >
              Citation
            </p>
            <p>
              Only for Teachers UK Teacher Pulse Index (2025–2026) — onlyforteachers.co.uk/teacher-index
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-20 text-center" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#F5EDE0' }}>
            Join the community and share your voice
          </h2>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#C94F2C', color: '#ffffff' }}
            >
              Go to dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#C94F2C', color: '#ffffff' }}
            >
              Join for free
            </Link>
          )}
        </div>
      </section>

    </main>
  )
}
