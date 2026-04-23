'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
          console.log('[register] processing referral for referrer:', referrerId)
          const res = await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referrerId, newUserId: data.user.id }),
          })
          const result = await res.json()
          if (!res.ok || result?.error) {
            console.error('[register] referral API error:', result?.error)
          } else {
            console.log('[register] referral succeeded')
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join Only For Teachers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Year Groups */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Year group(s) you teach{' '}
              <span className="text-gray-400 font-normal">(select all that apply)</span>
            </legend>
            <div className="grid grid-cols-4 gap-y-2 gap-x-4">
              {YEAR_GROUPS.map((yg) => (
                <label key={yg} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={yearGroups.includes(yg)}
                    onChange={() => toggleCheckbox(yearGroups, setYearGroups, yg)}
                    className="rounded border-gray-300"
                    style={{ accentColor: '#CA9662' }}
                  />
                  <span className="text-sm text-gray-700">{yg}</span>
                </label>
              ))}
            </div>
            {errors.yearGroups && <p className="mt-1 text-xs text-red-600">{errors.yearGroups}</p>}
          </fieldset>

          {/* Subjects */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Subject(s) you teach{' '}
              <span className="text-gray-400 font-normal">(select all that apply)</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {SUBJECTS.map((subject) => (
                <label key={subject} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjects.includes(subject)}
                    onChange={() => toggleCheckbox(subjects, setSubjects, subject)}
                    className="rounded border-gray-300"
                    style={{ accentColor: '#CA9662' }}
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
            {errors.subjects && <p className="mt-1 text-xs text-red-600">{errors.subjects}</p>}
          </fieldset>

          {/* Email Consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailConsent}
              onChange={(e) => setEmailConsent(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 shrink-0"
              style={{ accentColor: '#CA9662' }}
            />
            <span className="text-sm text-gray-600">
              Yes, I&apos;d like to receive updates, news, and prize alerts by email from Only for Teachers
            </span>
          </label>

          {errors.form && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{errors.form}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#CA9662' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: '#CA9662' }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
