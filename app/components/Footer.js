import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-bold text-lg" style={{ color: '#CA9662' }}>
              Only For Teachers
            </Link>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              The UK teacher community that rewards you for sharing your professional opinion.
              Free forever.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://instagram.com/onlyforteachers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/onlyforteachers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">About</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/survey-methodology">Survey Methodology</FooterLink>
              <FooterLink href="/teacher-index">Teacher Pulse Index</FooterLink>
              <FooterLink href="/ask-a-question">Ask a Question</FooterLink>
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Join</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/register">Join Now</FooterLink>
              <FooterLink href="/rewards">Rewards</FooterLink>
              <FooterLink href="/survey-results">Survey Results</FooterLink>
              <FooterLink href="/login">Login</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © 2025 Only For Teachers UK. All rights reserved.
          </p>
          <p className="text-xs">
            <a
              href="mailto:contact@onlyforteachers.co.uk"
              className="hover:text-white transition-colors"
            >
              contact@onlyforteachers.co.uk
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
