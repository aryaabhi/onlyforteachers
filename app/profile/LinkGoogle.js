'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}

export default function LinkGoogle() {
  const [identities, setIdentities] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmUnlink, setConfirmUnlink] = useState(false)
  const [unlinkError, setUnlinkError] = useState(null)

  useEffect(() => {
    async function loadIdentities() {
      const supabase = createClient()
      const { data } = await supabase.auth.getUserIdentities()
      setIdentities(data?.identities ?? [])
      setLoading(false)
    }
    loadIdentities()
  }, [])

  async function handleLink() {
    setActionLoading(true)
    const supabase = createClient()
    await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleUnlink() {
    const googleIdentity = identities?.find(i => i.provider === 'google')
    if (!googleIdentity) return
    setActionLoading(true)
    setUnlinkError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
    if (error) {
      setUnlinkError(error.message)
      setActionLoading(false)
    } else {
      setIdentities(prev => prev.filter(i => i.provider !== 'google'))
      setConfirmUnlink(false)
      setActionLoading(false)
    }
  }

  if (loading) return null

  const googleIdentity = identities?.find(i => i.provider === 'google')
  const isLinked = !!googleIdentity
  const googleEmail = googleIdentity?.identity_data?.email

  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E8DDD0' }}>
      <h2 className="text-base font-semibold text-[#1B3A2D] mb-4">Linked accounts</h2>

      {isLinked ? (
        <div className="rounded-xl border p-4" style={{ borderColor: '#E8DDD0' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#2C2C2C]">Google account linked</p>
              {googleEmail && <p className="text-xs text-[#6B6B6B]">{googleEmail}</p>}
            </div>
          </div>

          {!confirmUnlink ? (
            <button
              type="button"
              onClick={() => setConfirmUnlink(true)}
              className="text-xs text-[#6B6B6B] hover:text-[#2C2C2C] hover:underline"
            >
              Unlink Google account
            </button>
          ) : (
            <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-800 mb-3">
                Make sure you have a password set before unlinking Google — otherwise you won&apos;t be able to sign in.
              </p>
              {unlinkError && (
                <p className="text-xs text-red-600 mb-2">{unlinkError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUnlink}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: '#C94F2C' }}
                >
                  {actionLoading ? 'Unlinking…' : 'Yes, unlink'}
                </button>
                <button
                  type="button"
                  onClick={() => { setConfirmUnlink(false); setUnlinkError(null) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#2C2C2C] border"
                  style={{ borderColor: '#E8DDD0' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border p-4" style={{ borderColor: '#E8DDD0' }}>
          <p className="text-sm text-[#6B6B6B] mb-3">
            Link your Google account to sign in faster. Use the same Google account to ensure your points and history are preserved.
          </p>
          <button
            type="button"
            onClick={handleLink}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold text-[#2C2C2C] transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-60"
            style={{ borderColor: '#D1D5DB', backgroundColor: '#fff' }}
          >
            <GoogleIcon />
            {actionLoading ? 'Redirecting…' : 'Link Google account'}
          </button>
        </div>
      )}
    </div>
  )
}
