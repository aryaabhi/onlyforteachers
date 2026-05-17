import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SurveyPreviewClient from './SurveyPreviewClient'

export default async function SurveyPreviewPage({ params }) {
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

  const supabaseAdmin = createServiceClient()

  const { data: survey } = await supabaseAdmin
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single()

  if (!survey) redirect('/admin/surveys')

  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('*')
    .eq('survey_id', id)
    .order('position')

  return <SurveyPreviewClient survey={survey} questions={questions ?? []} />
}
