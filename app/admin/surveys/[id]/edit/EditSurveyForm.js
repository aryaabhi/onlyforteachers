'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateSurveyAction } from '@/app/actions/admin'

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
]

const inputCls = 'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2'
const ringStyle = { '--tw-ring-color': '#CA9662' }

export default function EditSurveyForm({ survey, defaults }) {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.target)
    startTransition(async () => {
      const result = await updateSurveyAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/admin/surveys?updated=1')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="surveyId" value={survey.id} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title"
          required
          defaultValue={survey.title}
          className={inputCls}
          style={ringStyle}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={survey.description ?? ''}
          className={`${inputCls} resize-none`}
          style={ringStyle}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            required
            defaultValue={defaults.startDate}
            className={inputCls}
            style={ringStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            name="startTime"
            type="time"
            required
            defaultValue={defaults.startTime}
            className={inputCls}
            style={ringStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            required
            defaultValue={defaults.endDate}
            className={inputCls}
            style={ringStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            name="endTime"
            type="time"
            required
            defaultValue={defaults.endTime}
            className={inputCls}
            style={ringStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points Value</label>
          <input
            name="pointsValue"
            type="number"
            min="1"
            required
            defaultValue={survey.points_value ?? 100}
            className={inputCls}
            style={ringStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue={survey.status ?? 'draft'}
            className={`${inputCls} bg-white`}
            style={ringStyle}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: '#CA9662' }}
        >
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/surveys')}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
