import Link from 'next/link'
import Image from 'next/image'
import NavbarMobileMenu from './NavbarMobileMenu'
import SidebarNav from './SidebarNav'

export default function Navbar({ user }) {
  const isLoggedIn = !!user

  if (isLoggedIn) {
    return <SidebarNav user={user} />
  }

  return (
    <nav className="relative bg-white border-b border-[#E8DDD0] z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Only For Teachers"
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          <NavLink href="/how-it-works">How it works</NavLink>
          <NavLink href="/rewards">Rewards</NavLink>
          <NavLink href="/survey-results">Insights</NavLink>
          <NavLink href="/survey">Survey</NavLink>
          <NavLink href="/login">Log in</NavLink>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: '#C94F2C' }}
          >
            Join free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <NavbarMobileMenu isLoggedIn={false} />
      </div>
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-[#2C2C2C] hover:text-[#C94F2C] transition-colors whitespace-nowrap"
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}
