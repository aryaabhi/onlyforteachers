'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Turnstile } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const NAME_RE = /^[a-zA-Z\s\-']{2,50}$/

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

const YEAR_GROUPS = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5', 'FE']
const SUBJECTS = [
  'English',
  'Maths',
  'Science',
  'Humanities',
  'Business and Economics',
  'Psychology and Sociology',
  'Drama/Art/Music/PE',
  'PSHE',
  'Other',
]

export default function RegisterPage() {
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) localStorage.setItem('referrer_id', ref)
  }, [])

  async function handleGoogleSignUp() {
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

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [yearGroups, setYearGroups] = useState([])
  const [subjects, setSubjects] = useState([])
  const [emailConsent, setEmailConsent] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Bot protection state
  const [turnstileToken, setTurnstileToken] = useState('')
  const honeypotRef = useRef(null)

  function toggleCheckbox(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function validate() {
    const errs = {}
    if (!firstName.trim()) {
      errs.firstName = 'First name is required'
    } else if (!NAME_RE.test(firstName.trim())) {
      errs.firstName = 'Please enter a valid first name'
    }
    if (!email.trim()) errs.email = 'Email is required'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (yearGroups.length === 0) errs.yearGroups = 'Please select at least one year group'
    if (subjects.length === 0) errs.subjects = 'Please select at least one subject'
    if (TURNSTILE_SITE_KEY && !turnstileToken) errs.turnstile = 'Please complete the security check'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Honeypot: bot filled the hidden field → fake success silently
    if (honeypotRef.current?.value) {
      router.push('/dashboard')
      return
    }

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    // Turnstile server-side verification
    if (TURNSTILE_SITE_KEY) {
      try {
        const res = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        })
        const { success } = await res.json()
        if (!success) {
          setErrors({ form: 'Please complete the security check' })
          setLoading(false)
          return
        }
      } catch {
        setErrors({ form: 'Security check failed. Please try again.' })
        setLoading(false)
        return
      }
    }

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
      },
    })

    if (signUpError) {
      setErrors({ form: signUpError.message })
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        first_name: firstName,
        display_name: firstName,
        subjects,
        year_groups: yearGroups,
        email_consent: emailConsent,
        role: 'teacher',
      })

      if (profileError && profileError.code !== '23505') {
        setErrors({ form: profileError.message })
        setLoading(false)
        return
      }

      try {
        await fetch('/api/brevo-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName,
            userId: data.user.id,
            yearGroups,
            subjects,
            emailConsent,
          }),
        })
      } catch (err) {
        console.error('[register] brevo sync error:', err)
      }

      const referrerId = localStorage.getItem('referrer_id')
      if (referrerId) {
        try {
          const res = await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referrerId, newUserId: data.user.id }),
          })
          const result = await res.json()
          if (!res.ok || result?.error) {
            console.error('[register] referral API error:', result?.error)
          }
        } catch (err) {
          console.error('[register] referral fetch threw:', err)
        } finally {
          localStorage.removeItem('referrer_id')
        }
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: '#F5EDE0' }}>
      {/* Left: form */}
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
            <h1 className="text-3xl font-bold text-[#1B3A2D]">Join free</h1>
            <p className="mt-2 text-[#6B6B6B]">Create your Only for Teachers account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E8DDD0' }}>
            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full border text-sm font-semibold text-[#2C2C2C] transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-60"
              style={{ borderColor: '#D1D5DB', backgroundColor: '#fff' }}
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Sign up with Google'}
            </button>
            <p className="mt-2 text-center text-xs text-[#6B6B6B]">
              Using Google? We&apos;ll still ask for your teaching details after sign up
            </p>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E8DDD0' }} />
              <span className="text-xs text-[#6B6B6B] shrink-0">or register with email</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E8DDD0' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot — invisible to real users, bots fill it */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none' }}
              />

              {/* Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }}
                />
                <p className="mt-1 text-xs text-[#6B6B6B]">Minimum 8 characters</p>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              {/* Your teaching role */}
              <div>
                <h3 className="text-sm font-semibold text-[#1B3A2D] mb-3 uppercase tracking-wide">Your teaching role</h3>

                {/* Year Groups */}
                <fieldset className="mb-5">
                  <legend className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Year group(s) you teach{' '}
                    <span className="text-[#6B6B6B] font-normal">(select all that apply)</span>
                  </legend>
                  <div className="grid grid-cols-4 gap-y-2 gap-x-3">
                    {YEAR_GROUPS.map((yg) => (
                      <label key={yg} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={yearGroups.includes(yg)}
                          onChange={() => toggleCheckbox(yearGroups, setYearGroups, yg)}
                          className="rounded border-gray-300 w-4 h-4"
                          style={{ accentColor: '#C94F2C' }}
                        />
                        <span className="text-sm text-[#2C2C2C]">{yg}</span>
                      </label>
                    ))}
                  </div>
                  {errors.yearGroups && <p className="mt-1 text-xs text-red-600">{errors.yearGroups}</p>}
                </fieldset>

                {/* Subjects */}
                <fieldset>
                  <legend className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Subject(s) you teach{' '}
                    <span className="text-[#6B6B6B] font-normal">(select all that apply)</span>
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    {SUBJECTS.map((subject) => (
                      <label key={subject} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={subjects.includes(subject)}
                          onChange={() => toggleCheckbox(subjects, setSubjects, subject)}
                          className="rounded border-gray-300 w-4 h-4 shrink-0"
                          style={{ accentColor: '#C94F2C' }}
                        />
                        <span className="text-sm text-[#2C2C2C]">{subject}</span>
                      </label>
                    ))}
                  </div>
                  {errors.subjects && <p className="mt-1 text-xs text-red-600">{errors.subjects}</p>}
                </fieldset>
              </div>

              {/* Email consent */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailConsent}
                    onChange={(e) => setEmailConsent(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 w-4 h-4 shrink-0"
                    style={{ accentColor: '#C94F2C' }}
                  />
                  <span className="text-sm text-[#6B6B6B]">
                    Yes, I&apos;d like to receive updates, news, and prize alerts by email from Only for Teachers
                  </span>
                </label>
                <p className="mt-1.5 ml-7 text-xs text-[#6B6B6B]">
                  We respect your privacy. You can unsubscribe at any time.
                </p>
              </div>

              {/* Turnstile widget — only rendered when site key is configured */}
              {TURNSTILE_SITE_KEY && (
                <div>
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => setTurnstileToken('')}
                  />
                  {errors.turnstile && <p className="mt-1 text-xs text-red-600">{errors.turnstile}</p>}
                </div>
              )}

              {errors.form && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errors.form}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
                style={{ backgroundColor: '#C94F2C' }}
              >
                {loading ? 'Creating account…' : 'Join free'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B6B6B]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: '#C94F2C' }}>
                Log in
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
        />
        <div className="text-center max-w-sm space-y-6">
          <div className="text-left space-y-4">
            {['Free forever - no hidden fees', 'Takes under 60 seconds to join', 'Earn points for every survey', 'Enter monthly prize draws'].map((point) => (
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
