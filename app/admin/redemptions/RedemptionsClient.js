'use client'

import { useState, useTransition } from 'react'
import { markRedemptionFulfilledAction } from '@/app/actions/admin'
import { CheckCircle, Copy, Check } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy email'}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy email'}
    </button>
  )
}

function FulfillButton({ redemptionId, initialFulfilledAt }) {
  const [fulfilledAt, setFulfilledAt] = useState(initialFulfilledAt)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  if (fulfilledAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
        <CheckCircle size={16} />
        Fulfilled {formatDate(fulfilledAt)}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await markRedemptionFulfilledAction(redemptionId)
            if (res?.error) {
              setError(res.error)
            } else if (res?.success) {
              setFulfilledAt(res.fulfilled_at)
            }
          })
        }}
        className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#C94F2C' }}
      >
        {isPending ? 'Updating…' : 'Mark as fulfilled'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function RedemptionsClient({ redemptions }) {
  if (redemptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
        No redemptions yet
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Teacher</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Offer</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Points</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map(r => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{r.first_name ?? '—'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 text-xs">{r.email ?? '—'}</span>
                    {r.status === 'pending' && r.email && (
                      <CopyEmailButton email={r.email} />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{r.offer_title ?? '—'}</td>
                <td className="px-6 py-4 font-semibold" style={{ color: '#CA9662' }}>
                  {(r.points_spent ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(r.created_at)}</td>
                <td className="px-6 py-4">
                  {r.status === 'fulfilled' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Fulfilled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <FulfillButton
                    redemptionId={r.id}
                    initialFulfilledAt={r.fulfilled_at ?? null}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
