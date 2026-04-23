'use client'

import { useState, useTransition } from 'react'
import { redeemOffer } from '@/app/actions/offers'

export default function OffersList({ offers, totalPoints }) {
  const [balance, setBalance] = useState(totalPoints)
  const [confirmOffer, setConfirmOffer] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleRedeem(offer) {
    setConfirmOffer(offer)
    setSuccess('')
    setError('')
  }

  function handleCancel() {
    setConfirmOffer(null)
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await redeemOffer(confirmOffer.id)
      if (result?.error) {
        setError(result.error)
        setConfirmOffer(null)
      } else {
        setBalance(b => b - confirmOffer.points_cost)
        setSuccess(`Successfully redeemed "${confirmOffer.title}"! We'll be in touch shortly.`)
        setConfirmOffer(null)
      }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Rewards</h1>
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-white"
            style={{ backgroundColor: '#CA9662' }}
          >
            <span className="text-sm font-medium">Your Points Balance</span>
            <span className="text-2xl font-bold">{balance.toLocaleString()}</span>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {offers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            No rewards available right now — check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map(offer => {
              const canAfford = balance >= offer.points_cost
              const outOfStock = offer.stock !== null && offer.stock <= 0
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4"
                >
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">{offer.title}</h2>
                    {offer.description && (
                      <p className="text-sm text-gray-500">{offer.description}</p>
                    )}
                    {offer.stock !== null && (
                      <p className="text-xs text-gray-400 mt-2">{offer.stock} remaining</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: '#CA9662' }}>
                      {offer.points_cost.toLocaleString()} points
                    </span>
                    {outOfStock ? (
                      <span className="text-sm text-gray-400">Out of stock</span>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleRedeem(offer)}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: '#CA9662' }}
                      >
                        Redeem
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Need {(offer.points_cost - balance).toLocaleString()} more points
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirmOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Confirm Redemption</h3>
            <p className="text-sm text-gray-600 mb-6">
              Redeem <span className="font-semibold">{confirmOffer.title}</span> for{' '}
              <span className="font-semibold" style={{ color: '#CA9662' }}>
                {confirmOffer.points_cost.toLocaleString()} points
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#CA9662' }}
              >
                {isPending ? 'Processing…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
