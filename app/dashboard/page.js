import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import CopyButton from './CopyButton'

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams
  const surveyCompleted = params?.survey === 'completed'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const now = new Date().toISOString()

  const [
    { data: profile },
    { data: pointsData },
    { data: streakData },
    { data: survey },
    { data: completions },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('points_ledger').select('points, point_type').eq('user_id', user.id),
    supabase.from('streak_weeks').select('id').eq('user_id', user.id),
    supabase
      .from('surveys')
      .select('*')
      .lte('starts_at', now)
      .gte('ends_at', now)
      .maybeSingle(),
    supabase
      .from('survey_completions')
      .select('id, survey_id')
      .eq('user_id', user.id),
  ])

  const firstName = profile?.first_name ?? user.email?.split('@')[0] ?? 'Teacher'
  const surveyPoints = (pointsData ?? [])
    .filter(r => r.point_type === 'survey_points')
    .reduce((sum, r) => sum + (r.points ?? 0), 0)
  const referralPoints = (pointsData ?? [])
    .filter(r => r.point_type === 'referral_points')
    .reduce((sum, r) => sum + (r.points ?? 0), 0)
  const streakCount = (streakData ?? []).length
  const hasCompletedSurvey = survey
    ? (completions ?? []).some(c => c.survey_id === survey.id)
    : false
  const referralUrl = `https://onlyforteachers.co.uk/register?ref=${user.id}`

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <LogoutButton />
      </header>

      {surveyCompleted && (
        <div className="bg-green-50 border-b border-green-200 px-4 sm:px-6 py-3">
          <p className="text-green-800 text-sm font-medium text-center">
            Thank you! Your survey response has been saved and your points have been added.
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Survey Points" value={surveyPoints} />
          <StatCard label="Referral Points" value={referralPoints} />
          <StatCard label="Current Streak" value={`${streakCount}w`} />
        </div>

        {/* Survey card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">This Week&apos;s Survey</h2>
          {survey ? (
            hasCompletedSurvey ? (
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  ✓ Completed this week
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-gray-700 font-medium flex-1">{survey.title}</p>
                <Link
                  href="/survey"
                  className="inline-block px-6 py-2.5 rounded-lg text-white font-semibold text-sm text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#CA9662' }}
                >
                  Take Survey
                </Link>
              </div>
            )
          ) : (
            <p className="text-gray-500 text-sm">No active survey right now — check back soon!</p>
          )}
        </div>

        {/* Referral section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Refer a Teacher</h2>
          <p className="text-sm text-gray-500 mb-4">
            Share your link and earn points for every teacher who joins.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              readOnly
              value={referralUrl}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 font-mono focus:outline-none min-w-0"
            />
            <CopyButton text={referralUrl} />
          </div>
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      <p className="text-3xl font-bold" style={{ color: '#CA9662' }}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}
