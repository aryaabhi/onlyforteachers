import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MySurveysClient from './MySurveysClient'

export const metadata = {
  title: 'My Surveys | Only for Teachers',
  description: 'View your completed surveys and results.',
}

export default async function MySurveysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: completions } = await supabase
    .from('survey_completions')
    .select('id, survey_id, week_key, completed_at, points_awarded, surveys(id, title)')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B3A2D]">Survey history</h1>
          <p className="mt-1 text-[#6B6B6B]">Surveys you&apos;ve completed and your answers.</p>
        </div>

        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
          style={{ backgroundColor: '#FDF6EC', border: '1px solid #E8DDD0', color: '#5A4A3A' }}
        >
          <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">ℹ️</span>
          <p>
            Your survey history has been migrated from our previous platform. Results from surveys
            completed before May 2026 are not available to view, but your points have been preserved.
          </p>
        </div>

        <MySurveysClient completions={completions ?? []} userId={user.id} />
      </div>
    </main>
  )
}
