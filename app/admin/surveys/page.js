import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSurveysClient from './AdminSurveysClient'
import Link from 'next/link'

export default async function AdminSurveysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const [{ data: surveys }, { data: completions }] = await Promise.all([
    supabase.from('surveys').select('*').order('created_at', { ascending: false }),
    supabase.from('survey_completions').select('survey_id'),
  ])

  const completionCounts = {}
  for (const c of completions ?? []) {
    completionCounts[c.survey_id] = (completionCounts[c.survey_id] ?? 0) + 1
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Dashboard
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <AdminSurveysClient
          initialSurveys={surveys ?? []}
          completionCounts={completionCounts}
        />
      </div>
    </main>
  )
}
