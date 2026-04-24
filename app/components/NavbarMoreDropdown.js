'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function NavbarMoreDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        More
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
          <DropdownLink href="/how-it-works" onClick={() => setOpen(false)}>How It Works</DropdownLink>
          <DropdownLink href="/rewards" onClick={() => setOpen(false)}>Rewards</DropdownLink>
          <DropdownLink href="/teacher-index" onClick={() => setOpen(false)}>Teacher Pulse Index</DropdownLink>
          <DropdownLink href="/ask-a-question" onClick={() => setOpen(false)}>Ask a Question</DropdownLink>
          <div className="my-1 border-t border-gray-100" />
          <DropdownLink href="/about" onClick={() => setOpen(false)}>About Us</DropdownLink>
        </div>
      )}
    </div>
  )
}

function DropdownLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  )
}
