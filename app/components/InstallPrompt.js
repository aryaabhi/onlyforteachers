'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa_install_dismissed')) return

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (!isMobile) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    localStorage.setItem('pwa_install_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 flex items-start gap-3"
      style={{ backgroundColor: '#1B3A2D' }}
    >
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: '#F5EDE0' }}>
          Add Only for Teachers to your home screen for quick access
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#C94F2C', color: '#fff' }}
        >
          Add to home screen
        </button>
        <button
          onClick={handleDismiss}
          className="text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: '#D4C9B8' }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
