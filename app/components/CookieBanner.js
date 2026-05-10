'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const GA_ID = 'G-QB8MZV2H75'

function disableGA() {
  window[`ga-disable-${GA_ID}`] = true
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (consent === 'essential') {
      disableGA()
    } else if (!consent) {
      setVisible(true)
    }
  }, [])

  function acceptAll() {
    localStorage.setItem('cookie_consent', 'accepted')
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted' })
    }
    setVisible(false)
  }

  function essentialOnly() {
    localStorage.setItem('cookie_consent', 'essential')
    disableGA()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#1B3A2D',
        color: '#F5EDE0',
        padding: '16px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <p style={{ flex: '1 1 300px', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
          We use cookies to improve your experience and analyse site usage.{' '}
          <Link
            href="/privacy-policy"
            style={{ color: '#F5EDE0', textDecoration: 'underline' }}
          >
            See our privacy policy
          </Link>{' '}
          for details.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            onClick={acceptAll}
            style={{
              backgroundColor: '#C94F2C',
              color: '#F5EDE0',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Accept all
          </button>
          <button
            onClick={essentialOnly}
            style={{
              backgroundColor: 'transparent',
              color: '#F5EDE0',
              border: '1px solid #F5EDE0',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  )
}
