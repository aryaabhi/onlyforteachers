'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  // 'android' | 'ios' | null
  const [mode, setMode] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const ua = navigator.userAgent
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isAndroid = /android/i.test(ua)
    const isMobile = isIOS || isAndroid
    if (!isMobile) return

    if (isIOS) {
      // iOS: show once per session (sessionStorage), no localStorage persistence
      if (sessionStorage.getItem('pwa_ios_dismissed')) return
      setMode('ios')
      return
    }

    // Android: wait for browser install event
    if (localStorage.getItem('pwa_install_dismissed')) return
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setMode('android')
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleAndroidInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setMode(null)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    if (mode === 'ios') {
      sessionStorage.setItem('pwa_ios_dismissed', '1')
    } else {
      localStorage.setItem('pwa_install_dismissed', '1')
    }
    setMode(null)
  }

  if (!mode) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4"
      style={{ backgroundColor: '#1B3A2D' }}
    >
      {mode === 'android' ? (
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: '#F5EDE0' }}>
              Add Only for Teachers to your home screen for quick access
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAndroidInstall}
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
      ) : (
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: '#F5EDE0' }}>
              Add Only for Teachers to your home screen
            </p>
            <p className="text-sm flex items-center gap-1.5" style={{ color: '#D4C9B8' }}>
              Tap
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
                style={{ backgroundColor: '#2D5C45', color: '#F5EDE0' }}
                aria-label="Share"
              >
                ⬆
              </span>
              then &ldquo;Add to Home Screen&rdquo;
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-sm font-medium hover:opacity-70 transition-opacity shrink-0 mt-0.5"
            style={{ color: '#D4C9B8' }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
