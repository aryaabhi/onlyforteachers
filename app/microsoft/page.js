import Image from 'next/image'
import Link from 'next/link'
import { isCampaignActive } from '@/lib/campaigns'

const NAVY = '#2B4A7A'
const SKY = '#EAF1FB'
const TEXT = '#2C2C2C'
const MUTED = '#5B6B82'

const TITLE = 'Share Your Views and WIN £1,250 of Microsoft Training or Workshops for Your School'
const DESCRIPTION =
  'Complete the Microsoft Elevate for Educators UK Community teacher survey on Only for Teachers for a chance to win a £1,250 teacher training programme or student experience workshop, delivered by Tablet Academy.'

const baseMetadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/microsoft' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://onlyforteachers.co.uk/microsoft',
    images: [
      {
        url: '/microsoft/educator-community-badge.png',
        width: 800,
        height: 800,
        alt: 'Microsoft Elevate Educator Community',
      },
    ],
  },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION, images: ['/microsoft/educator-community-badge.png'] },
}

// Keep the page out of search results until the campaign is live
export function generateMetadata() {
  return {
    ...baseMetadata,
    robots: isCampaignActive('microsoft') ? { index: true, follow: true } : { index: false, follow: true },
  }
}

const PRIZE_OPTIONS = [
  {
    title: 'Option 1: Teacher Training Programme',
    value: '£1,250 value',
    body:
      "Empower your staff with practical training designed to help educators make the most of Microsoft technologies, including Microsoft 365, Microsoft Copilot, Teams, OneNote, Forms, Reading Progress, Reflect, and other tools that can enhance teaching, learning, communication, and productivity. Sessions can be tailored to the school's priorities and delivered online or in person (subject to location and availability).",
  },
  {
    title: 'Option 2: Student Experience Workshop',
    value: '£1,250 value',
    body:
      'Inspire learners through a hands-on workshop focused on future-ready skills. Topics may include Artificial Intelligence, Cyber Security, Minecraft Education, Digital Creativity, Coding, Esports, Accessibility, STEM learning, or other Microsoft-powered learning experiences. Workshops are designed to be engaging, curriculum relevant, and suitable for a range of age groups.',
  },
]

function CtaButton({ className = '' }) {
  return (
    <Link
      href="/survey"
      className={`inline-block px-10 py-4 rounded-full text-white text-lg font-semibold text-center transition-all hover:opacity-90 hover:shadow-md ${className}`}
      style={{ backgroundColor: NAVY, textDecoration: 'none' }}
    >
      Enter Survey and Prize Draw →
    </Link>
  )
}

export default function MicrosoftLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Banner band – matches the email header */}
      <section className="px-4 pt-8 pb-10 text-center" style={{ backgroundColor: SKY }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: MUTED }}>
          Brought to you by
        </p>
        <div className="mx-auto max-w-[600px] rounded-xl overflow-hidden shadow-sm">
          <Image
            src="/microsoft/banner.png"
            alt="Microsoft Elevate for Educators UK Community – visit aka.ms/MicrosoftElevateforEducators"
            width={600}
            height={160}
            preload
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Headline + community profile */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8" style={{ color: NAVY }}>
          {TITLE}
        </h1>

        <div className="space-y-5 text-base sm:text-[17px] leading-relaxed max-w-3xl mx-auto" style={{ color: TEXT }}>
          <p className="font-semibold" style={{ color: NAVY }}>
            The Microsoft Elevate for Educators UK Community is a growing network of educators who are shaping
            the future of teaching and learning with Microsoft technologies.
          </p>
          <p>
            Whether you&apos;re a teacher, school leader, support professional, or IT specialist, by joining the
            community, you&apos;ll gain access to expert-led training, exclusive events, practical resources,
            weekly updates, and support from experienced UK educators and Microsoft specialists.
          </p>
          <p>
            To join the community visit{' '}
            <a
              href="https://aka.ms/MicrosoftElevateforEducators"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
              style={{ color: NAVY }}
            >
              aka.ms/MicrosoftElevateforEducators
            </a>
          </p>
        </div>
      </section>

      {/* Prize */}
      <section className="px-4 py-12" style={{ backgroundColor: SKY }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center mb-10">
            <div className="space-y-4 text-base sm:text-[17px] leading-relaxed" style={{ color: TEXT }}>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY }}>
                Win a £1,250 experience for your school
              </h2>
              <p>
                Complete our short survey (5 questions) for a chance to win an incredible prize for your school.
              </p>
              <p>
                One school will win a Microsoft-focused professional learning or student engagement experience
                worth <strong>£1,250</strong>, delivered by education specialists from Tablet Academy. The winning
                school can choose one of the two options below.
              </p>
            </div>
            <div className="flex md:flex-col items-center justify-center gap-4">
              <Image
                src="/microsoft/educator-community-badge.png"
                alt="Microsoft Elevate Educator Community"
                width={800}
                height={800}
                className="w-36 h-36 sm:w-44 sm:h-44"
              />
              <Image
                src="/microsoft/classroom.png"
                alt="A teacher presenting to a class with a laptop and interactive whiteboard"
                width={270}
                height={270}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-md"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {PRIZE_OPTIONS.map(opt => (
              <div key={opt.title} className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#D6E2F3' }}>
                <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: MUTED }}>
                  {opt.value}
                </p>
                <h3 className="text-lg font-bold mb-3" style={{ color: NAVY }}>
                  {opt.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT }}>
                  {opt.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base leading-relaxed max-w-3xl mx-auto text-center" style={{ color: TEXT }}>
            Both prize options are designed to support schools on their digital transformation journey while
            helping staff and students develop the skills needed for the future.
          </p>
        </div>
      </section>

      {/* How to enter + dates + CTA */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY }}>
          How to enter
        </h2>
        <p className="text-base sm:text-[17px] leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: TEXT }}>
          To be entered into the prize draw, simply complete the survey and submit your responses before the
          closing date. The survey takes around three minutes, and every completed survey also earns you Only
          for Teachers points as usual.
        </p>

        <dl className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-sm">
          {[
            ['Survey opens', 'Tuesday 1 December 2026'],
            ['Closing date', 'Monday 7 December 2026, 11:59pm'],
            ['Winner announced', 'By Friday 18 December 2026'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl px-4 py-4" style={{ backgroundColor: SKY }}>
              <dt className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: MUTED }}>
                {label}
              </dt>
              <dd className="font-semibold" style={{ color: NAVY }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col items-center gap-4">
          <CtaButton />
          <p className="text-sm" style={{ color: MUTED }}>
            Open to educators employed by UK schools, colleges and educational institutions. One entry per person.{' '}
            <Link href="/microsoft/terms" className="underline" style={{ color: MUTED }}>
              T&amp;Cs apply
            </Link>
          </p>
          <p className="text-sm" style={{ color: MUTED }}>
            New to Only for Teachers?{' '}
            <Link href="/register" className="underline font-medium" style={{ color: NAVY }}>
              Join free
            </Link>{' '}
            – it takes a minute, and you&apos;ll be taken straight to the survey after logging in.
          </p>
        </div>
      </section>

      {/* Partnership footer band */}
      <section className="px-4 py-10 text-center border-t" style={{ borderColor: '#E8DDD0', backgroundColor: '#FBF9F5' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: TEXT }}>
          In partnership with
        </p>
        <Image src="/logo.png" alt="Only for Teachers" width={208} height={52} className="mx-auto h-12 w-auto" />
        <p className="mt-4 text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: '#6B6B6B' }}>
          Only for Teachers is a free UK teacher community where teachers share their insights on school life
          through quick, 3-minute weekly surveys. Every survey you complete is free, anonymous and automatically
          earns you an entry into our monthly prize draw, where five teachers win a £50 Amazon voucher every month.
        </p>
      </section>
    </main>
  )
}
