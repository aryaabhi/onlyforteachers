import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ResultsClient from './ResultsClient'

export default async function SurveyResultsAdminPage({ params }) {
  const { id } = await params
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
    { data: survey },
    { data: questions },
    { data: responses },
    { count: totalSubmissions },
  ] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', id).single(),
    supabase.from('questions').select('*').eq('survey_id', id).order('position'),
    supabase.from('responses').select('question_id, answer, answer_array, user_id, created_at').eq('survey_id', id),
    supabase
      .from('survey_completions')
      .select('id', { count: 'exact', head: true })
      .eq('survey_id', id),
  ])

  if (!survey) redirect('/admin/surveys')

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin/surveys" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Surveys
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalSubmissions ?? 0} total submission{totalSubmissions !== 1 ? 's' : ''}
          </p>
        </div>

        <ResultsClient
          survey={survey}
          questions={questions ?? []}
          responses={responses ?? []}
          totalSubmissions={totalSubmissions ?? 0}
        />
      </div>
    </main>
  )
}
