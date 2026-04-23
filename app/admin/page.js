import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalUsers },
    { count: totalSurveys },
    { count: totalCompletions },
    { data: pointsData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('surveys').select('*', { count: 'exact', head: true }),
    supabase.from('survey_completions').select('*', { count: 'exact', head: true }),
    supabase.from('points_ledger').select('points').gt('points', 0),
  ])

  const totalPointsAwarded = (pointsData ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={totalUsers ?? 0} />
          <StatCard label="Total Surveys" value={totalSurveys ?? 0} />
          <StatCard label="Completions" value={totalCompletions ?? 0} />
          <StatCard label="Points Awarded" value={(totalPointsAwarded).toLocaleString()} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminLink
            href="/admin/surveys"
            title="Manage Surveys"
            description="Create surveys, add questions, and set survey status."
          />
          <AdminLink
            href="/admin/users"
            title="View Users"
            description="Browse all registered teachers and their points balances."
          />
          <AdminLink
            href="/admin/monthly-draw"
            title="Monthly Draw"
            description="Run the monthly prize draw for active members."
          />
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

function AdminLink({ href, title, description }) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
    >
      <h2 className="text-base font-semibold mb-1 group-hover:opacity-80" style={{ color: '#CA9662' }}>
        {title}
      </h2>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
