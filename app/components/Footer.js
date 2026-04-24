import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1B3A2D' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Only For Teachers"
                width={180}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: '#D4C9B8' }}>
              A premium community where UK teachers share, shape, and get rewarded.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://www.instagram.com/onlyforteachers.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#D4C9B8' }}
                className="hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/only-for-teachers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: '#D4C9B8' }}
                className="hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#F5EDE0' }}>
              Platform
            </h3>
            <ul className="space-y-2.5">
              <FooterLink href="/how-it-works">How it works</FooterLink>
              <FooterLink href="/rewards">Rewards</FooterLink>
              <FooterLink href="/survey-results">Insights</FooterLink>
              <FooterLink href="/survey">This week&apos;s survey</FooterLink>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#F5EDE0' }}>
              Account
            </h3>
            <ul className="space-y-2.5 mb-6">
              <FooterLink href="/login">Log in</FooterLink>
              <FooterLink href="/register">Join free</FooterLink>
            </ul>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#F5EDE0' }}>
              Legal
            </h3>
            <ul className="space-y-2.5">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/survey-methodology">Survey Methodology</FooterLink>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs" style={{ color: '#9A8F82' }}>
            © 2026 Only for Teachers. All rights reserved.
          </p>
          <p className="text-xs">
            <a
              href="mailto:contact@onlyforteachers.co.uk"
              className="hover:text-white transition-colors"
              style={{ color: '#9A8F82' }}
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
        style={{ color: '#D4C9B8', textDecoration: 'none' }}
      >
        {children}
      </Link>
    </li>
  )
}
