'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function CompleteProfileForm({ userId, email, firstName }) {
  const router = useRouter()
  const [yearGroups, setYearGroups] = useState([])
  const [subjects, setSubjects] = useState([])
  const [emailConsent, setEmailConsent] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function toggle(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function validate() {
    const errs = {}
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
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ year_groups: yearGroups, subjects, email_consent: emailConsent })
      .eq('id', userId)

    if (updateError) {
      setErrors({ form: updateError.message })
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
          userId,
          yearGroups,
          subjects,
          emailConsent,
        }),
      })
    } catch (err) {
      console.error('[complete-profile] brevo sync error:', err)
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Pre-filled read-only fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Name</label>
          <input
            type="text"
            value={firstName}
            disabled
            className="w-full rounded-xl border px-4 py-3 text-sm text-[#6B6B6B] cursor-not-allowed"
            style={{ borderColor: '#E8DDD0', backgroundColor: '#F5EDE0' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border px-4 py-3 text-sm text-[#6B6B6B] cursor-not-allowed"
            style={{ borderColor: '#E8DDD0', backgroundColor: '#F5EDE0' }}
          />
        </div>
      </div>

      {/* Year Groups */}
      <fieldset>
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
                onChange={() => toggle(yearGroups, setYearGroups, yg)}
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
                onChange={() => toggle(subjects, setSubjects, subject)}
                className="rounded border-gray-300 w-4 h-4 shrink-0"
                style={{ accentColor: '#C94F2C' }}
              />
              <span className="text-sm text-[#2C2C2C]">{subject}</span>
            </label>
          ))}
        </div>
        {errors.subjects && <p className="mt-1 text-xs text-red-600">{errors.subjects}</p>}
      </fieldset>

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
      <p className="mt-1.5 ml-7 text-xs text-[#6B6B6B]">
        We respect your privacy. You can unsubscribe at any time.
      </p>

      {errors.form && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
        style={{ backgroundColor: '#C94F2C' }}
      >
        {loading ? 'Saving…' : 'Complete my profile'}
      </button>
    </form>
  )
}
