import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfilePageContent from './ProfilePageContent'

export const metadata = { title: 'Account Settings — Only For Teachers' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, first_name, subjects, year_groups, email_consent')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      <div className="py-12 px-4 text-center text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-1 text-sm opacity-70">Manage your profile and account details</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border p-6 sm:p-8" style={{ borderColor: '#E8DDD0' }}>
          <ProfilePageContent profile={profile} />
        </div>
      </div>
    </main>
  )
}
