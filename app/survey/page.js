import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SurveyForm from './SurveyForm'

export default async function SurveyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date().toISOString()

  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .lte('starts_at', now)
    .gte('ends_at', now)
    .maybeSingle()

  if (!survey) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">No Active Survey</h1>
          <p className="text-gray-500 mb-6">
            No survey is currently active. Check back next week!
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  const { data: completion } = await supabase
    .from('survey_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('survey_id', survey.id)
    .maybeSingle()

  if (completion) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4"
            style={{ backgroundColor: '#16a34a' }}
          >
            ✓
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Already Completed</h1>
          <p className="text-gray-500 mb-6">
            You have already completed this week&apos;s survey. Your points have been added.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('survey_id', survey.id)
    .order('position')

  return <SurveyForm survey={survey} questions={questions ?? []} />
}
