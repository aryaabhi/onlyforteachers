import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SurveyForm from './SurveyForm'

export default async function SurveyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date().toISOString()

  const { data: surveyRows } = await supabase
    .from('surveys')
    .select('*')
    .lte('starts_at', now)
    .gte('ends_at', now)
    .limit(1)
  const survey = surveyRows?.[0] ?? null

  if (!survey) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="py-20 px-4 text-center" style={{ backgroundColor: '#1B3A2D' }}>
          <h1 className="text-3xl font-bold text-white">This Week&apos;s Survey</h1>
        </div>
        <div className="flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-2xl border p-10 max-w-md w-full text-center shadow-sm" style={{ borderColor: '#E8DDD0' }}>
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-[#1B3A2D] mb-2">No Active Survey</h2>
            <p className="text-[#6B6B6B] mb-6">
              No survey is currently active. Check back next week!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
            >
              Back to Dashboard
            </Link>
          </div>
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
      <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="py-20 px-4 text-center" style={{ backgroundColor: '#1B3A2D' }}>
          <h1 className="text-3xl font-bold text-white">This Week&apos;s Survey</h1>
        </div>
        <div className="flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-2xl border p-10 max-w-md w-full text-center shadow-sm" style={{ borderColor: '#E8DDD0' }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
              style={{ backgroundColor: '#16a34a' }}
            >
              ✓
            </div>
            <h2 className="text-xl font-bold text-[#1B3A2D] mb-2">Already Completed</h2>
            <p className="text-[#6B6B6B] mb-6">
              You have already completed this week&apos;s survey. Your points have been added.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
            >
              Back to Dashboard
            </Link>
          </div>
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
