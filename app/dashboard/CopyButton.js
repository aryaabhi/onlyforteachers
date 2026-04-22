'use client'

import { useState } from 'react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors"
      style={{ backgroundColor: copied ? '#16a34a' : '#CA9662' }}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
