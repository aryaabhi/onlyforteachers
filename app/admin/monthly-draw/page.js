import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MonthlyDrawClient from './MonthlyDrawClient'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function MonthlyDrawPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: draws } = await supabase
    .from('monthly_draws')
    .select('id, draw_month, prize_description, drawn_at, profiles(first_name, email)')
    .order('draw_month', { ascending: false })

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const alreadyRun = (draws ?? []).some(d => d.draw_month === currentMonth)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Admin
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Monthly Draw</h1>
        </div>

        <MonthlyDrawClient currentMonth={currentMonth} alreadyRun={alreadyRun} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Previous Draws</h2>
          </div>
          {(!draws || draws.length === 0) ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">No draws yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Month</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Winner</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Prize</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Drawn</th>
                  </tr>
                </thead>
                <tbody>
                  {draws.map(d => (
                    <tr key={d.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-900">{d.draw_month}</td>
                      <td className="px-6 py-4 text-gray-700">{d.profiles?.first_name ?? '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{d.profiles?.email ?? '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{d.prize_description ?? '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(d.drawn_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
