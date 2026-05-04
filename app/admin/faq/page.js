import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FAQAdminClient from './FAQAdminClient'

export default async function AdminFAQPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('position')

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Admin
        </Link>
        <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>Admin · FAQ</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <FAQAdminClient initialFaqs={faqs ?? []} />
      </div>
    </main>
  )
}
