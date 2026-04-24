'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NavbarMobileMenu({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false)

  function close() {
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 rounded-lg text-[#2C2C2C] hover:bg-[#F5EDE0] transition-colors"
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
        <div className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#E8DDD0] shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <MobileLink href="/how-it-works" onClick={close}>How it works</MobileLink>
            <MobileLink href="/rewards" onClick={close}>Rewards</MobileLink>
            <MobileLink href="/survey-results" onClick={close}>Insights</MobileLink>
            <MobileLink href="/survey" onClick={close}>Survey</MobileLink>
            <div className="my-1.5 border-t border-[#E8DDD0]" />
            <MobileLink href="/login" onClick={close}>Log in</MobileLink>
            <Link
              href="/register"
              onClick={close}
              className="block mx-4 mt-2 mb-1 py-2.5 rounded-full text-white text-sm font-semibold text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
            >
              Join free
            </Link>
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
      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#2C2C2C] hover:bg-[#F5EDE0] transition-colors"
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}
