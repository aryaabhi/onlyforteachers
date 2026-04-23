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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={profile?.email ?? ''}
          disabled
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
      </div>

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
                onChange={() => toggle(yearGroups, setYearGroups, yg)}
                className="rounded border-gray-300"
                style={{ accentColor: '#CA9662' }}
              />
              <span className="text-sm text-gray-700">{yg}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
                onChange={() => toggle(subjects, setSubjects, subject)}
                className="rounded border-gray-300"
                style={{ accentColor: '#CA9662' }}
              />
              <span className="text-sm text-gray-700">{subject}</span>
            </label>
          ))}
        </div>
      </fieldset>

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

      {status?.type === 'success' && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-4 py-2">{status.message}</p>
      )}
      {status?.type === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{status.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#CA9662' }}
      >
        {loading ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
