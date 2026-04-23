'use client'

import { useState, useTransition } from 'react'
import { runMonthlyDrawAction } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

export default function MonthlyDrawClient({ currentMonth, alreadyRun }) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleRunDraw() {
    startTransition(async () => {
      const res = await runMonthlyDrawAction(currentMonth)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        setResult(res.winner)
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        {currentMonth} Draw
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Randomly selects a winner from teachers who completed at least one survey this month.
      </p>

      {result && (
        <div
          className="mb-5 p-5 rounded-xl text-white"
          style={{ backgroundColor: '#CA9662' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Winner!</p>
          <p className="text-xl font-bold">{result.name}</p>
          <p className="text-sm opacity-90">{result.email}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {alreadyRun && !result ? (
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
          Draw has already been run for {currentMonth}.
        </div>
      ) : (
        <button
          onClick={handleRunDraw}
          disabled={isPending || alreadyRun}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#CA9662' }}
        >
          {isPending ? 'Drawing…' : `Run Draw for ${currentMonth}`}
        </button>
      )}
    </div>
  )
}
