'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    supabase.from('profiles').update({ updated_at: new Date().toISOString() }).eq('id', data.user.id).then(() => {})

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
                alt="Only for Teachers"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold text-[#1B3A2D]">Welcome back</h1>
            <p className="mt-2 text-[#6B6B6B]">Log in to your Only for Teachers account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E8DDD0' }}>
            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full border text-sm font-semibold text-[#2C2C2C] transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-60"
              style={{ borderColor: '#D1D5DB', backgroundColor: '#fff' }}
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>
            <p className="mt-2 text-center text-xs text-[#6B6B6B]">
              Use the same email you registered with
            </p>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E8DDD0' }} />
              <span className="text-xs text-[#6B6B6B] shrink-0">or continue with email</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E8DDD0' }} />
            </div>

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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 pr-11 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                  Note: if you previously signed in with Google, use the &lsquo;Continue with Google&rsquo; button above.
                </p>
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
                Join for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-12" style={{ backgroundColor: '#1B3A2D' }}>
        <Image
          src="/logo-white.png"
          alt="Only for Teachers"
          width={200}
          height={50}
          className="h-12 w-auto object-contain mb-8"
          priority
        />
        <blockquote className="text-center max-w-sm">
          <p className="text-xl font-bold italic leading-relaxed mb-6" style={{ color: '#F5EDE0' }}>
            &ldquo;Finally - a voice for UK teachers that actually matters.&rdquo;
          </p>
          <p className="text-sm" style={{ color: '#9A8F82' }}>— Only for Teachers member</p>
        </blockquote>
      </div>
    </main>
  )
}
