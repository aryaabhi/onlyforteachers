import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function SurveyResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: completions } = await supabase
    .from('survey_completions')
    .select('id, points_awarded, completed_at, surveys(id, title)')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Survey Results</h1>

        {(!completions || completions.length === 0) ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            You haven&apos;t completed any surveys yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Survey</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Completed</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Points Earned</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {completions.map(c => (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {c.surveys?.title ?? 'Survey'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(c.completed_at)}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold" style={{ color: '#CA9662' }}>
                          +{c.points_awarded}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/survey-results/${c.surveys?.id}`}
                          className="text-sm font-medium hover:opacity-70 transition-opacity"
                          style={{ color: '#CA9662' }}
                        >
                          View Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
