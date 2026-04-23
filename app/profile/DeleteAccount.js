'use client'

import { useState } from 'react'
import { deleteAccount } from '@/app/actions/profile'

export default function DeleteAccount() {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)
    const result = await deleteAccount()
    if (result?.error) {
      setError(result.error)
      setLoading(false)
      setConfirming(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Permanently delete your account and all associated data. This cannot be undone.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="px-4 py-2.5 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Delete my account
        </button>
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
          <p className="text-sm font-medium text-red-800">
            Are you sure? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Deleting…' : 'Yes, delete my account'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}
    </div>
  )
}
