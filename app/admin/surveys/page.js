import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import AdminSurveysClient from './AdminSurveysClient'
import Link from 'next/link'

export default async function AdminSurveysPage({ searchParams }) {
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

  const supabaseAdmin = createServiceClient()
  const { data: surveys } = await supabaseAdmin
    .from('surveys')
    .select('*')
    .order('created_at', { ascending: false })

  const surveysWithCounts = await Promise.all(
    (surveys ?? []).map(async (survey) => {
      const { count } = await supabaseAdmin
        .from('survey_completions')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', survey.id)
      return { ...survey, response_count: count || 0 }
    })
  )

  console.log('Surveys with counts:', surveysWithCounts)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Dashboard
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>
      {sp?.updated && (
        <div className="bg-green-50 border-b border-green-200 px-4 sm:px-6 py-3 text-center">
          <p className="text-sm text-green-800 font-medium">Survey updated successfully.</p>
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <AdminSurveysClient
          initialSurveys={surveysWithCounts}
        />
      </div>
    </main>
  )
}
