import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
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

  const service = createServiceClient()

  let { data: redemptions, error: redemptionsError } = await service
    .from('redemptions')
    .select('id, user_id, offer_id, points_spent, status, created_at, fulfilled_at')
    .order('created_at', { ascending: false })

  // fulfilled_at column may not exist yet — fall back to query without it
  if (redemptionsError) {
    console.error('redemptions fetch error (retrying without fulfilled_at):', redemptionsError.message)
    const fallback = await service
      .from('redemptions')
      .select('id, user_id, offer_id, points_spent, status, created_at')
      .order('created_at', { ascending: false })
    redemptions = fallback.data
    if (fallback.error) console.error('redemptions fallback error:', fallback.error.message)
  }

  const redemptionRows = (redemptions ?? []).map(r => ({ ...r, fulfilled_at: r.fulfilled_at ?? null }))

  const userIds = [...new Set(redemptionRows.map(r => r.user_id).filter(Boolean))]
  const offerIds = [...new Set(redemptionRows.map(r => r.offer_id).filter(Boolean))]

  const [{ data: profiles }, { data: offers }] = await Promise.all([
    userIds.length > 0
      ? service.from('profiles').select('id, email, first_name').in('id', userIds)
      : { data: [] },
    offerIds.length > 0
      ? service.from('offers').select('id, title').in('id', offerIds)
      : { data: [] },
  ])

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))
  const offerMap = Object.fromEntries((offers ?? []).map(o => [o.id, o]))

  const rows = redemptionRows.map(r => ({
    ...r,
    fulfilled_at: r.fulfilled_at ?? null,
    email: profileMap[r.user_id]?.email ?? null,
    first_name: profileMap[r.user_id]?.first_name ?? null,
    offer_title: offerMap[r.offer_id]?.title ?? null,
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
