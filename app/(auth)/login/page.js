'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    fetch('/api/brevo/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'lastLogin', email }),
    }).catch(() => {})

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: '#F5EDE0' }}>
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo.png"
                alt="Only For Teachers"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold text-[#1B3A2D]">Welcome back</h1>
            <p className="mt-2 text-[#6B6B6B]">Log in to your Only for Teachers account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E8DDD0' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-[#2C2C2C]">
                    Password
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-xs hover:underline"
                    style={{ color: '#C94F2C' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
                style={{ backgroundColor: '#C94F2C' }}
              >
                {loading ? 'Logging in…' : 'Log in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B6B6B]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: '#C94F2C' }}>
                Join free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-12" style={{ backgroundColor: '#1B3A2D' }}>
        <Image
          src="/logo.png"
          alt="Only For Teachers"
          width={200}
          height={50}
          className="h-12 w-auto object-contain mb-8"
        />
        <blockquote className="text-center max-w-sm">
          <p className="text-xl font-bold italic leading-relaxed mb-6" style={{ color: '#F5EDE0' }}>
            &ldquo;Finally — a voice for UK teachers that actually matters.&rdquo;
          </p>
          <p className="text-sm" style={{ color: '#9A8F82' }}>— Only for Teachers member</p>
        </blockquote>
      </div>
    </main>
  )
}
