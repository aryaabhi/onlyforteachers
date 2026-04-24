import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditSurveyForm from './EditSurveyForm'

export default async function EditSurveyPage({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single()

  if (!survey) redirect('/admin/surveys')

  // Convert stored UTC datetimes → YYYY-MM-DD / HH:MM for the inputs
  const startsAt = new Date(survey.starts_at)
  const endsAt = new Date(survey.ends_at)
  const pad = n => String(n).padStart(2, '0')

  const defaults = {
    startDate: startsAt.toISOString().slice(0, 10),
    startTime: `${pad(startsAt.getUTCHours())}:${pad(startsAt.getUTCMinutes())}`,
    endDate: endsAt.toISOString().slice(0, 10),
    endTime: `${pad(endsAt.getUTCHours())}:${pad(endsAt.getUTCMinutes())}`,
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/admin/surveys"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Surveys
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Survey</h1>
          <Link
            href={`/admin/surveys/${id}/questions`}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#CA9662' }}
          >
            Manage Questions →
          </Link>
        </div>

        {sp?.success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            Survey updated successfully.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <EditSurveyForm survey={survey} defaults={defaults} />
        </div>
      </div>
    </main>
  )
}
