'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'

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

export default function ProfileForm({ profile }) {
  const [firstName, setFirstName] = useState(profile?.first_name ?? '')
  const [yearGroups, setYearGroups] = useState(profile?.year_groups ?? [])
  const [subjects, setSubjects] = useState(profile?.subjects ?? [])
  const [emailConsent, setEmailConsent] = useState(profile?.email_consent ?? false)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  function toggle(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)

    const result = await updateProfile({ firstName, subjects, yearGroups, emailConsent })

    if (result?.error) {
      setStatus({ type: 'error', message: result.error })
    } else {
      setStatus({ type: 'success', message: 'Profile saved successfully.' })
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl border px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
  const inputStyle = { borderColor: '#E8DDD0', '--tw-ring-color': '#C94F2C' }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
          First name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Email</label>
        <input
          type="email"
          value={profile?.email ?? ''}
          disabled
          className="w-full rounded-xl border px-4 py-3 text-sm text-[#6B6B6B] cursor-not-allowed"
          style={{ borderColor: '#E8DDD0', backgroundColor: '#F5EDE0' }}
        />
        <p className="mt-1 text-xs text-[#6B6B6B]">Email cannot be changed</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#1B3A2D] mb-3 uppercase tracking-wide">Your teaching role</h3>

        <fieldset className="mb-5">
          <legend className="block text-sm font-medium text-[#2C2C2C] mb-2">
            Year group(s) you teach{' '}
            <span className="text-[#6B6B6B] font-normal">(select all that apply)</span>
          </legend>
          <div className="grid grid-cols-4 gap-y-2 gap-x-4">
            {YEAR_GROUPS.map((yg) => (
              <label key={yg} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={yearGroups.includes(yg)}
                  onChange={() => toggle(yearGroups, setYearGroups, yg)}
                  className="rounded w-4 h-4"
                  style={{ accentColor: '#C94F2C' }}
                />
                <span className="text-sm text-[#2C2C2C]">{yg}</span>
              </label>
            ))}
          </div>
        </fieldset>

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
                  className="rounded w-4 h-4 shrink-0"
                  style={{ accentColor: '#C94F2C' }}
                />
                <span className="text-sm text-[#2C2C2C]">{subject}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={emailConsent}
          onChange={(e) => setEmailConsent(e.target.checked)}
          className="mt-0.5 rounded w-4 h-4 shrink-0"
          style={{ accentColor: '#C94F2C' }}
        />
        <span className="text-sm text-[#6B6B6B]">
          Yes, I&apos;d like to receive updates, news, and prize alerts by email from Only for Teachers
        </span>
      </label>

      {status?.type === 'success' && (
        <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-2.5">{status.message}</p>
      )}
      {status?.type === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{status.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
        style={{ backgroundColor: '#C94F2C' }}
      >
        {loading ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
