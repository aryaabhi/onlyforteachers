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
    .select('id, survey_id, completed_at, points_awarded, surveys(id, title)')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B3A2D]">Survey history</h1>
          <p className="mt-1 text-[#6B6B6B]">Surveys you&apos;ve completed and your answers.</p>
        </div>

        <MySurveysClient completions={completions ?? []} userId={user.id} />
      </div>
    </main>
  )
}
