import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AskForm from './AskForm'

export const metadata = {
  title: 'Ask The Teaching Community | Only For Teachers',
  description: 'Submit a question you want asked to UK teachers in a future Only For Teachers weekly survey.',
}

export default async function AskAQuestionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userEmail = ''
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('id', user.id)
      .single()
    userEmail = profile?.email ?? user.email ?? ''
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ask The Teaching Community</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Is there a question you wish someone would ask UK teachers? Submit it here
          and we&apos;ll consider it for a future weekly survey.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-2">✍️</div>
            <p className="text-sm text-gray-600">Submit your question</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-2">👀</div>
            <p className="text-sm text-gray-600">We review all submissions</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-gray-600">Best questions go into surveys</p>
          </div>
        </section>

        {!user && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">You must be logged in to submit.</p>
              <p className="text-sm text-amber-700 mt-0.5">Login or register to send your question to the community.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-amber-300 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#C94F2C' }}
              >
                Register Free
              </Link>
            </div>
          </div>
        )}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <AskForm initialEmail={userEmail} disabled={!user} />
        </section>

        <section className="text-sm text-gray-500 leading-relaxed">
          <p>
            By submitting a question, you agree that it may be used (in whole or edited form) in
            a future Only For Teachers survey. We reserve the right to reject or modify submitted
            questions.
          </p>
        </section>
      </div>
    </main>
  )
}
