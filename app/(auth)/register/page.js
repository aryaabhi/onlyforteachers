'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) localStorage.setItem('referrer_id', ref)
  }, [])

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [yearGroups, setYearGroups] = useState([])
  const [subjects, setSubjects] = useState([])
  const [emailConsent, setEmailConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function toggleCheckbox(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function validate() {
    const errs = {}
    if (!firstName.trim()) errs.firstName = 'First name is required'
    if (!email.trim()) errs.email = 'Email is required'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (yearGroups.length === 0) errs.yearGroups = 'Please select at least one year group'
    if (subjects.length === 0) errs.subjects = 'Please select at least one subject'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

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
                alt="Only For Teachers"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold text-[#1B3A2D]">Join free</h1>
            <p className="mt-2 text-[#6B6B6B]">Create your Only for Teachers account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E8DDD0' }}>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
          src="/logo.png"
          alt="Only For Teachers"
          width={200}
          height={50}
          className="h-12 w-auto object-contain mb-8"
        />
        <div className="text-center max-w-sm space-y-6">
          <div className="text-left space-y-4">
            {['Free forever — no hidden fees', 'Takes under 60 seconds to join', 'Earn points for every survey', 'Enter monthly prize draws'].map((point) => (
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
