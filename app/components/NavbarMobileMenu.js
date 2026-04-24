'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NavbarMobileMenu({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function close() {
    setIsOpen(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {isLoggedIn ? (
              <>
                <MobileLink href="/dashboard" onClick={close}>Dashboard</MobileLink>
                <MobileLink href="/survey" onClick={close}>Survey</MobileLink>
                <MobileLink href="/offers" onClick={close}>Offers</MobileLink>
                <MobileLink href="/survey-results" onClick={close}>Survey Results</MobileLink>
                <MobileLink href="/profile" onClick={close}>Profile</MobileLink>
                <div className="my-1.5 border-t border-gray-100" />
                <MobileLink href="/how-it-works" onClick={close}>How It Works</MobileLink>
                <MobileLink href="/rewards" onClick={close}>Rewards</MobileLink>
                <MobileLink href="/teacher-index" onClick={close}>Teacher Pulse Index</MobileLink>
                <MobileLink href="/ask-a-question" onClick={close}>Ask a Question</MobileLink>
                <MobileLink href="/about" onClick={close}>About Us</MobileLink>
                <div className="my-1.5 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <MobileLink href="/how-it-works" onClick={close}>How It Works</MobileLink>
                <MobileLink href="/rewards" onClick={close}>Rewards</MobileLink>
                <MobileLink href="/survey-results" onClick={close}>Survey Results</MobileLink>
                <MobileLink href="/teacher-index" onClick={close}>Teacher Pulse Index</MobileLink>
                <MobileLink href="/ask-a-question" onClick={close}>Ask a Question</MobileLink>
                <div className="my-1.5 border-t border-gray-100" />
                <MobileLink href="/login" onClick={close}>Login</MobileLink>
                <Link
                  href="/register"
                  onClick={close}
                  className="block mx-4 mt-2 mb-1 py-2.5 rounded-lg text-white text-sm font-semibold text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#CA9662' }}
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  )
}
