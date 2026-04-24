import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'UK Teacher Pulse Index | Only For Teachers',
  description: 'The UK Teacher Pulse Index — a public record of how UK teachers think and feel about the issues that matter most to their profession.',
}

export default async function TeacherIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const now = new Date().toISOString()
  const { data: surveys } = await supabase
    .from('surveys')
    .select('id, title, ends_at, starts_at')
    .lt('ends_at', now)
    .order('ends_at', { ascending: false })

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">UK Teacher Pulse Index</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A public record of how UK teachers think and feel about the issues that matter
          most to their profession. Updated after each weekly survey closes.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ExplainerCard
            icon="📊"
            title="What It Measures"
            description="Workload, wellbeing, pay, curriculum, technology, leadership, and more — tracking teacher sentiment over time."
          />
          <ExplainerCard
            icon="👩‍🏫"
            title="Who Contributes"
            description="Verified UK teaching professionals across all school types, year groups, and subject areas."
          />
          <ExplainerCard
            icon="🔓"
            title="Freely Available"
            description="All results are publicly accessible. Free to use for journalism, research, and policy — with attribution."
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Surveys</h2>

          {surveys && surveys.length > 0 ? (
            <div className="space-y-3">
              {surveys.map(survey => (
                <SurveyRow key={survey.id} survey={survey} />
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

        <section className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#FDF8F3' }}>
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
            className="inline-block px-8 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            {isLoggedIn ? 'Take This Week\'s Survey' : 'Join Free'}
          </Link>
        </section>

        <section className="border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-500 leading-relaxed">
            Want to understand how our surveys are designed and how we compile results?{' '}
            <Link href="/survey-methodology" className="font-medium" style={{ color: '#CA9662' }}>
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

function SurveyRow({ survey }) {
  const endDate = new Date(survey.ends_at)
  const formatted = endDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div>
        <p className="font-medium text-gray-900">{survey.title}</p>
        <p className="text-sm text-gray-500 mt-0.5">Closed {formatted}</p>
      </div>
      <Link
        href={`/survey-results`}
        className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
        style={{ color: '#CA9662' }}
      >
        View results →
      </Link>
    </div>
  )
}
