import Link from 'next/link'
import NavbarMobileMenu from './NavbarMobileMenu'
import NavbarMoreDropdown from './NavbarMoreDropdown'
import LogoutButton from '@/app/dashboard/LogoutButton'

export default function Navbar({ user }) {
  const isLoggedIn = !!user

  return (
    <nav className="relative bg-white border-b border-gray-100 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href={isLoggedIn ? '/dashboard' : '/'}
          className="font-bold text-lg flex-shrink-0"
          style={{ color: '#CA9662' }}
        >
          Only For Teachers
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/survey">Survey</NavLink>
              <NavLink href="/offers">Offers</NavLink>
              <NavLink href="/survey-results">Results</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              <NavbarMoreDropdown />
              <LogoutButton />
            </>
          ) : (
            <>
              <NavLink href="/how-it-works">How It Works</NavLink>
              <NavLink href="/rewards">Rewards</NavLink>
              <NavLink href="/survey-results">Survey Results</NavLink>
              <NavLink href="/teacher-index">Pulse Index</NavLink>
              <NavLink href="/ask-a-question">Ask a Question</NavLink>
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#CA9662' }}
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <NavbarMobileMenu isLoggedIn={isLoggedIn} />
      </div>
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  )
}
