import Image from 'next/image'
import Link from 'next/link'
import classroomImage from '@/public/microsoft/classroom-wide.jpg'
import { isCampaignActive } from '@/lib/campaigns'

const GREEN = '#1B3A2D'
const ORANGE = '#C94F2C'
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
        url: '/microsoft/classroom-wide.jpg',
        width: 1900,
        height: 790,
        alt: 'A teacher presenting from a laptop beside an interactive whiteboard',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/microsoft/classroom-wide.jpg'] },
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

function CtaButton() {
  return (
    <Link
      href="/survey"
      className="inline-block px-12 py-4 rounded-full text-white text-lg font-semibold transition-all hover:opacity-90 hover:shadow-md"
      style={{ backgroundColor: ORANGE, textDecoration: 'none' }}
    >
      Take survey →
    </Link>
  )
}

export default function MicrosoftLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Sponsor band */}
      <section className="px-4 pt-8 pb-10 text-center text-white" style={{ backgroundColor: GREEN }}>
        <p className="text-lg sm:text-xl font-medium mb-3">Brought to you by</p>
        <Image
          src="/microsoft/educator-community-badge.png"
          alt="Microsoft Elevate Educator Community"
          width={800}
          height={800}
          preload
          sizes="128px"
          className="mx-auto h-28 w-28 sm:h-32 sm:w-32"
        />
      </section>

      {/* Headline + prize */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
          {TITLE}
        </h1>

        <div className="space-y-5 text-base sm:text-[17px] leading-relaxed max-w-3xl mx-auto mb-10" style={{ color: TEXT }}>
          <p>Complete our short survey (5 questions) for a chance to win an incredible prize for your school.</p>
          <p>
            One school will win a Microsoft-focused professional learning or student engagement experience worth
            £1,250, delivered by education specialists from Tablet Academy. The winning school can choose one of
            the two options below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 rounded-2xl p-4 sm:p-5 text-left" style={{ backgroundColor: SKY }}>
          {PRIZE_OPTIONS.map(opt => (
            <div key={opt.title} className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#D6E2F3' }}>
              <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: MUTED }}>
                {opt.value}
              </p>
              <h2 className="text-lg font-bold mb-3" style={{ color: NAVY }}>
                {opt.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: TEXT }}>
                {opt.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <CtaButton />
        </div>
      </section>

      {/* Classroom photo */}
      <section className="max-w-4xl mx-auto px-4">
        <Image
          src={classroomImage}
          alt="A teacher presenting from a laptop beside an interactive whiteboard in a classroom"
          placeholder="blur"
          sizes="(max-width: 896px) 100vw, 864px"
          className="w-full h-auto"
        />
      </section>

      {/* Community profile */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-16 sm:pb-20 text-center">
        <div className="space-y-5 text-base sm:text-[17px] font-semibold leading-relaxed max-w-3xl mx-auto" style={{ color: TEXT }}>
          <p>
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
              className="underline"
              style={{ color: TEXT }}
            >
              aka.ms/MicrosoftElevateforEducators
            </a>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <CtaButton />
          <p className="text-sm font-semibold">
            <Link href="/microsoft/terms" className="underline" style={{ color: TEXT }}>
              *Terms and conditions apply
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
