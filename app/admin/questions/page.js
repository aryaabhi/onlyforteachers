import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QuestionsClient from './QuestionsClient'

export default async function AdminQuestionsPage() {
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

  const { data: rows, error } = await service
    .from('community_questions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('community_questions fetch error:', error.message)

  const questions = (rows ?? []).map(r => ({
    id: r.id,
    question_text: r.question_text,
    name: r.name ?? null,
    email: r.email ?? null,
    status: r.status ?? 'pending',
    created_at: r.created_at,
  }))

  const totalCount = questions.length
  const pendingCount = questions.filter(q => !q.status || q.status === 'pending').length
  const featuredCount = questions.filter(q => q.status === 'featured').length
  const archivedCount = questions.filter(q => q.status === 'archived').length

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Admin
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin</span>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ask a question — submissions</h1>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <p className="font-semibold mb-1">Could not load submissions</p>
            <p className="font-mono text-xs">{error.message}</p>
            <p className="mt-2">If the <code>status</code> column is missing, run this SQL in Supabase:</p>
            <pre className="mt-1 bg-amber-100 rounded p-2 text-xs overflow-x-auto">{`alter table public.community_questions\nadd column if not exists status text default 'pending';`}</pre>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={totalCount} />
          <StatCard label="Pending" value={pendingCount} highlight="amber" />
          <StatCard label="Featured" value={featuredCount} highlight="green" />
          <StatCard label="Archived" value={archivedCount} highlight="gray" />
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          <p className="font-semibold mb-1">SQL — add status column if not exists</p>
          <pre className="font-mono overflow-x-auto">{`alter table public.community_questions\nadd column if not exists status text default 'pending';`}</pre>
        </div>

        <QuestionsClient questions={questions} />
      </div>
    </main>
  )
}

function StatCard({ label, value, highlight }) {
  const color =
    highlight === 'amber' ? '#D97706'
    : highlight === 'green' ? '#16a34a'
    : highlight === 'gray' ? '#6b7280'
    : '#CA9662'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}
