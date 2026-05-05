import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CompleteProfileForm from './CompleteProfileForm'

export const metadata = { title: 'Complete your profile — Only for Teachers' }

export default async function CompleteProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('year_groups, first_name, email')
    .eq('id', user.id)
    .single()

  if (profile?.year_groups?.length > 0) redirect('/dashboard')

  const firstName = profile?.first_name || user.user_metadata?.full_name?.split(' ')[0] || ''
  const email = profile?.email || user.email || ''

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: '#F5EDE0' }}>
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo.png"
                alt="Only for Teachers"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold text-[#1B3A2D]">
              Almost there!
            </h1>
            <p className="mt-2 text-[#6B6B6B]">Tell us about your teaching role</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E8DDD0' }}>
            <CompleteProfileForm
              userId={user.id}
              email={email}
              firstName={firstName}
            />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-12" style={{ backgroundColor: '#1B3A2D' }}>
        <Image
          src="/logo-white.png"
          alt="Only for Teachers"
          width={200}
          height={50}
          className="h-12 w-auto object-contain mb-8"
        />
        <div className="text-center max-w-sm space-y-6">
          <div className="text-left space-y-4">
            {['Your profile helps tailor surveys to you', 'Earn points for every survey you complete', 'Enter monthly prize draws', 'Free forever - no hidden fees'].map((point) => (
              <div key={point} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#C94F2C' }}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: '#D4C9B8' }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
