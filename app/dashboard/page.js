import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const firstName = user.user_metadata?.first_name ?? user.email?.split('@')[0] ?? 'Teacher'

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg" style={{ color: '#CA9662' }}>
          Only For Teachers
        </span>
        <LogoutButton />
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-2 text-gray-500">Here&apos;s your dashboard.</p>
      </section>
    </main>
  )
}
