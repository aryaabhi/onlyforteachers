'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  House,
  ClipboardList,
  BarChart,
  Gift,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/survey', label: "This Week's Survey", icon: ClipboardList },
  { href: '/survey-results', label: 'Survey History', icon: BarChart },
  { href: '/offers', label: 'Rewards & Points', icon: Gift },
  { href: '/survey-results', label: 'Insights Hub', icon: BookOpen },
  { href: '/profile', label: 'Account Settings', icon: Settings },
]

export default function SidebarNav({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const displayName =
    user?.user_metadata?.first_name ||
    user?.email?.split('@')[0] ||
    'Teacher'
  const initial = displayName[0]?.toUpperCase() ?? 'T'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 bg-[#1B3A2D]">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Only For Teachers"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile spacer */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="relative w-[260px] bg-[#1B3A2D] flex flex-col h-full overflow-y-auto">
            <div className="p-5 border-b border-white/10">
              <Image
                src="/logo.png"
                alt="Only For Teachers"
                width={160}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="flex-1 px-3 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C94F2C] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {initial}
                </div>
                <span className="text-sm text-white/90 font-medium truncate">{displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full px-1"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[260px] bg-[#1B3A2D] flex-col z-40">
        <div className="p-5 pt-6 pb-4">
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="Only For Teachers"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C94F2C] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initial}
            </div>
            <span className="text-sm text-white/90 font-medium truncate">{displayName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full px-1"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
