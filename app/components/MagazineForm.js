'use client'

import { useState } from 'react'

export default function MagazineForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm py-3" style={{ color: '#D4C9B8' }}>
        Thanks! We&apos;ll be in touch with the next issue.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-14"
    >
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-full text-[#2C2C2C] text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 whitespace-nowrap"
        style={{ backgroundColor: '#C94F2C' }}
      >
        Send me the magazine →
      </button>
    </form>
  )
}
