import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TPIAdminClient from './TPIAdminClient'

export default async function AdminTPIPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const service = createServiceClient()
  const { data: scores } = await service
    .from('tpi_scores')
    .select('*')
    .order('survey_date', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Admin
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin · TPI Scores</span>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <TPIAdminClient initialScores={scores ?? []} />
      </div>
    </main>
  )
}
