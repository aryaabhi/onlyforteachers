import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfilePageContent from './ProfilePageContent'

export const metadata = { title: 'Your Profile — Only For Teachers' }

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
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <ProfilePageContent profile={profile} />
        </div>
      </div>
    </main>
  )
}
