import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const PAGE_SIZE = 25

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function AdminUsersPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const search = params?.search?.trim() ?? ''
  const sortBy = params?.sort ?? 'name'
  const page = Math.max(1, parseInt(params?.page ?? '1'))

  const [{ data: profiles }, { data: allLedger }, { data: allCompletions }] = await Promise.all([
    supabase.from('profiles').select('id, first_name, email, created_at'),
    supabase.from('points_ledger').select('user_id, points'),
    supabase.from('survey_completions').select('user_id'),
  ])

  const pointsByUser = {}
  for (const row of allLedger ?? []) {
    pointsByUser[row.user_id] = (pointsByUser[row.user_id] ?? 0) + (row.points ?? 0)
  }

  const completionsByUser = {}
  for (const row of allCompletions ?? []) {
    completionsByUser[row.user_id] = (completionsByUser[row.user_id] ?? 0) + 1
  }

  let users = (profiles ?? []).map(p => ({
    ...p,
    totalPoints: pointsByUser[p.id] ?? 0,
    surveysCompleted: completionsByUser[p.id] ?? 0,
  }))

  if (search) {
    const q = search.toLowerCase()
    users = users.filter(u =>
      (u.first_name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    )
  }

  if (sortBy === 'points') {
    users.sort((a, b) => b.totalPoints - a.totalPoints)
  } else {
    users.sort((a, b) => (a.first_name ?? '').localeCompare(b.first_name ?? ''))
  }

  const total = users.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function sortHref(s) {
    const p = new URLSearchParams({ ...(search ? { search } : {}), sort: s, page: '1' })
    return `/admin/users?${p}`
  }

  function pageHref(p) {
    const q = new URLSearchParams({ ...(search ? { search } : {}), sort: sortBy, page: String(p) })
    return `/admin/users?${q}`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Admin
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

        <form method="GET" action="/admin/users" className="flex gap-3 mb-6">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email…"
            className="flex-1 max-w-sm rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
          />
          <input type="hidden" name="sort" value={sortBy} />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Search
          </button>
          {search && (
            <Link
              href="/admin/users"
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    <Link href={sortHref('name')} className={sortBy === 'name' ? 'font-bold' : 'hover:text-gray-800'} style={sortBy === 'name' ? { color: '#CA9662' } : {}}>
                      Name
                    </Link>
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Surveys</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    <Link href={sortHref('points')} className={sortBy === 'points' ? 'font-bold' : 'hover:text-gray-800'} style={sortBy === 'points' ? { color: '#CA9662' } : {}}>
                      Points
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
                {paginated.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {u.first_name ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="px-6 py-4 text-gray-700">{u.surveysCompleted}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: '#CA9662' }}>
                      {u.totalPoints.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total} users
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={pageHref(currentPage - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                ← Prev
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={pageHref(currentPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
