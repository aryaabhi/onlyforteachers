import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RedemptionsClient from './RedemptionsClient'

export default async function AdminRedemptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: redemptions } = await supabase
    .from('redemptions')
    .select(`
      *,
      profiles!redemptions_user_id_fkey(email, first_name),
      offers!redemptions_offer_id_fkey(title)
    `)
    .order('created_at', { ascending: false })

  const rows = (redemptions ?? []).map(r => ({
    ...r,
    email: r.profiles?.email ?? null,
    first_name: r.profiles?.first_name ?? null,
    offer_title: r.offers?.title ?? null,
  }))

  const totalCount = rows.length
  const pendingCount = rows.filter(r => r.status === 'pending').length
  const fulfilledCount = rows.filter(r => r.status === 'fulfilled').length
  const totalPointsSpent = rows.reduce((sum, r) => sum + (r.points_spent ?? 0), 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Admin
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Redemptions</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={totalCount} />
          <StatCard label="Pending" value={pendingCount} highlight="amber" />
          <StatCard label="Fulfilled" value={fulfilledCount} highlight="green" />
          <StatCard label="Points Spent" value={totalPointsSpent.toLocaleString()} />
        </div>

        <RedemptionsClient redemptions={rows} />

        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-xs text-gray-500 font-mono">
          <p className="font-semibold text-gray-700 mb-1 font-sans text-sm">SQL: Add fulfilled_at column (run in Supabase if needed)</p>
          <pre className="whitespace-pre-wrap">{`alter table public.redemptions\n  add column if not exists fulfilled_at timestamptz;`}</pre>
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value, highlight }) {
  const color =
    highlight === 'amber' ? '#D97706'
    : highlight === 'green' ? '#16a34a'
    : '#CA9662'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}
