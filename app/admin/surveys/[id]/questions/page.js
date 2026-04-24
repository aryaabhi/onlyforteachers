import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QuestionsClient from './QuestionsClient'

export default async function SurveyQuestionsPage({ params }) {
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

  const [{ data: survey }, { data: questions }] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', id).single(),
    supabase.from('questions').select('*').eq('survey_id', id).order('position'),
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
          <Link
            href={`/admin/surveys/${id}/edit`}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#CA9662' }}
          >
            ← Edit Survey Details
          </Link>
        </div>
        <QuestionsClient survey={survey} initialQuestions={questions ?? []} />
      </div>
    </main>
  )
}
