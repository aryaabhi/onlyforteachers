import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Points History — Only For Teachers' }

const PAGE_SIZE = 20

const EVENT_LABELS = {
  survey_completion: 'Survey Completed',
  referral: 'Referral Bonus',
  streak_award: 'Streak Bonus',
  redemption: 'Points Redeemed',
}

function formatEventType(eventType, pointType) {
  if (EVENT_LABELS[eventType]) return EVENT_LABELS[eventType]
  if (pointType === 'survey_points') return 'Survey Points'
  if (pointType === 'referral_points') return 'Referral Bonus'
  if (pointType === 'streak_bonus') return 'Streak Bonus'
  return 'Points'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function PointsHistoryPage({ searchParams }) {
  const params = await searchParams
  const tab = params?.tab === 'referral' ? 'referral' : 'survey'
  const page = Math.max(1, parseInt(params?.page ?? '1'))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all entries to compute total balance
  const { data: allEntries } = await supabase
    .from('points_ledger')
    .select('points, point_type')
    .eq('user_id', user.id)

  const totalBalance = (allEntries ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)
  const surveyTotal = (allEntries ?? [])
    .filter(r => r.point_type !== 'referral_points')
    .reduce((sum, r) => sum + (r.points ?? 0), 0)
  const referralTotal = (allEntries ?? [])
    .filter(r => r.point_type === 'referral_points')
    .reduce((sum, r) => sum + (r.points ?? 0), 0)

  // Paginated entries for active tab
  const pointTypeFilter = tab === 'referral' ? 'referral_points' : null
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('points_ledger')
    .select('points, point_type, event_type, created_at', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (pointTypeFilter) {
    query = query.eq('point_type', pointTypeFilter)
  } else {
    query = query.neq('point_type', 'referral_points')
  }

  const { data: entries, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  // Compute running total for visible rows (only makes sense for the full set)
  // Running total = sum of all entries up to and including each row
  // We'll show it as cumulative from the top of this page
  let runningTotal = totalBalance
  // subtract entries that come BEFORE the current page
  const { data: beforeEntries } = await supabase
    .from('points_ledger')
    .select('points')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(0, from - 1)

  if (from > 0 && beforeEntries) {
    runningTotal = totalBalance - beforeEntries.reduce((s, r) => s + (r.points ?? 0), 0)
  }

  const entriesWithRunning = (entries ?? []).map(entry => {
    const current = runningTotal
    runningTotal -= (entry.points ?? 0)
    return { ...entry, runningTotal: current }
  })

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/profile"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Points History</h1>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-2xl font-bold" style={{ color: '#CA9662' }}>{totalBalance}</p>
            <p className="text-sm text-gray-500 mt-1">Total Balance</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-gray-800">{surveyTotal}</p>
            <p className="text-sm text-gray-500 mt-1">Survey Points</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-gray-800">{referralTotal}</p>
            <p className="text-sm text-gray-500 mt-1">Referral Points</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          <Link
            href="/profile/points?tab=survey&page=1"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'survey'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Survey Points
          </Link>
          <Link
            href="/profile/points?tab=referral&page=1"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'referral'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Referral Points
          </Link>
        </div>

        {/* Entries table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {entriesWithRunning.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              No {tab === 'referral' ? 'referral' : 'survey'} points yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Activity</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500">Points</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {entriesWithRunning.map((entry, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(entry.created_at)}
                      </td>
                      <td className="px-6 py-3.5 text-gray-900">
                        {formatEventType(entry.event_type, entry.point_type)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold">
                        <span style={{ color: entry.points >= 0 ? '#16a34a' : '#dc2626' }}>
                          {entry.points >= 0 ? '+' : ''}{entry.points}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right text-gray-500">
                        {entry.runningTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/profile/points?tab=${tab}&page=${page - 1}`}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/profile/points?tab=${tab}&page=${page + 1}`}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#CA9662' }}
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
