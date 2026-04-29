'use client'

import { useState, useTransition } from 'react'
import { redeemOffer } from '@/app/actions/offers'
import { Star } from 'lucide-react'

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
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      {/* Page header */}
      <div className="py-14 px-4 text-center text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <h1 className="text-3xl sm:text-4xl font-bold">Rewards &amp; Points</h1>
        <p className="mt-2 text-sm opacity-70">Redeem your hard-earned points for great rewards</p>
      </div>
      <div className="w-full leading-[0] overflow-hidden" style={{ marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" fill="#1B3A2D" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Points balance card */}
        <div className="rounded-2xl p-6 mb-8 flex items-center gap-4 text-white" style={{ backgroundColor: '#1B3A2D' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#C94F2C' }}>
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm opacity-70 mb-0.5">Your Points Balance</p>
            <p className="text-3xl font-bold" style={{ color: '#C94F2C' }}>{balance.toLocaleString()}</p>
          </div>
        </div>

        {/* How to earn points */}
        <div className="bg-white rounded-2xl border mb-8 overflow-hidden" style={{ borderColor: '#E8DDD0' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E8DDD0' }}>
            <h2 className="text-base font-bold text-[#1B3A2D]">How to earn points</h2>
          </div>
          {[
            { action: 'Complete weekly survey', points: '+100 pts', note: 'variable based on survey' },
            { action: 'Maintain 10-week streak', points: '+500 bonus', note: null },
            { action: 'Refer a colleague', points: '+100 pts', note: null },
            { action: 'Be referred by a colleague', points: '+100 pts', note: null },
          ].map((item, i, arr) => (
            <div
              key={item.action}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #E8DDD0' : 'none' }}
            >
              <div>
                <span className="text-sm font-medium text-[#2C2C2C]">{item.action}</span>
                {item.note && (
                  <span className="ml-2 text-xs text-[#6B6B6B]">({item.note})</span>
                )}
              </div>
              <span className="text-sm font-bold" style={{ color: '#C94F2C' }}>{item.points}</span>
            </div>
          ))}
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
          <div className="bg-white rounded-2xl border p-12 text-center text-[#6B6B6B]" style={{ borderColor: '#E8DDD0' }}>
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
                  className="bg-white rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: '#E8DDD0' }}
                >
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-[#1B3A2D] mb-1">{offer.title}</h2>
                    {offer.description && (
                      <p className="text-sm text-[#6B6B6B]">{offer.description}</p>
                    )}
                    {offer.stock !== null && (
                      <p className="text-xs text-[#6B6B6B] mt-2">{offer.stock} remaining</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: '#C94F2C' }}>
                      {offer.points_cost.toLocaleString()} points
                    </span>
                    {outOfStock ? (
                      <span className="text-sm text-[#6B6B6B]">Out of stock</span>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleRedeem(offer)}
                        disabled={isPending}
                        className="px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: '#C94F2C' }}
                      >
                        Redeem
                      </button>
                    ) : (
                      <span className="text-xs text-[#6B6B6B]">
                        Need {(offer.points_cost - balance).toLocaleString()} more pts
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-[#1B3A2D] mb-2">Confirm Redemption</h3>
            <p className="text-sm text-[#6B6B6B] mb-6">
              Redeem <span className="font-semibold text-[#2C2C2C]">{confirmOffer.title}</span> for{' '}
              <span className="font-bold" style={{ color: '#C94F2C' }}>
                {confirmOffer.points_cost.toLocaleString()} points
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-full border text-sm font-medium text-[#2C2C2C] hover:bg-[#F5EDE0] transition-colors disabled:opacity-60"
                style={{ borderColor: '#E8DDD0' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#C94F2C' }}
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
