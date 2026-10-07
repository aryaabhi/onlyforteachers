import Image from 'next/image'
import Link from 'next/link'
import heroImage from '@/public/crayola/creativity-week.jpg'

export const metadata = {
  title: 'Share Your Views and WIN a £300 Crayola Creative Supplies Bundle',
  description:
    'Complete the Crayola Creativity Week teacher survey on Only for Teachers and be entered into a prize draw to win a Crayola bundle of creative supplies worth £300.',
  alternates: { canonical: '/crayola' },
  openGraph: {
    title: 'Share Your Views and WIN a £300 Crayola Creative Supplies Bundle',
    description:
      'Complete the Crayola Creativity Week teacher survey and be entered into a prize draw to win a £300 Crayola creative supplies bundle.',
    url: 'https://onlyforteachers.co.uk/crayola',
    images: [{ url: '/crayola/creativity-week.jpg', width: 1900, height: 790, alt: 'Crayola Creativity Week' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Share Your Views and WIN a £300 Crayola Creative Supplies Bundle',
    description:
      'Complete the Crayola Creativity Week teacher survey and be entered into a prize draw to win a £300 Crayola creative supplies bundle.',
    images: ['/crayola/creativity-week.jpg'],
  },
}

const PARAGRAPHS = [
  "At Crayola, we're passionate about helping children explore their ideas, build confidence and express themselves through creativity. That's why we'd love to hear from the people who make creativity come alive every day in the classroom: teachers.",
  "We know that nurturing creativity in school can be incredibly rewarding, but it can also come with challenges. Whether it's finding enough time in a busy timetable, accessing suitable resources, or encouraging creative confidence across different age groups, we'd like to better understand the realities of teaching creativity in today's classrooms.",
  "By completing our short survey, you'll help us learn more about the support, resources and inspiration primary teachers need most. Your feedback will play an important role in shaping future Crayola Creativity Week resources and helping us develop initiatives that better support schools, teachers and pupils.",
  'As a thank you for sharing your thoughts, everyone who completes the survey will be entered into a prize draw to win a Crayola bundle of creative supplies worth £300.',
  'Packed with colourful, high-quality creative materials, the prize bundle will help bring even more imagination, creativity and hands-on learning opportunities to your classroom. Whether used for art projects, creative writing activities, topic work or free creative exploration, these resources are designed to inspire young minds and help every child express themselves with confidence.',
  'The survey takes just a few minutes to complete, and your insights will help us continue our mission of supporting parents and educators in raising creatively alive children.',
  'Complete the survey today for your chance to win and help shape the future of creativity in the classroom.',
]

export default function CrayolaLandingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      {/* Sponsor band */}
      <section className="relative text-center text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="pt-8 pb-16 px-4">
          <p className="text-lg sm:text-xl font-medium mb-3">Brought to you by</p>
          <Image
            src="/crayola/logo.png"
            alt="Crayola"
            width={504}
            height={360}
            preload
            className="mx-auto h-16 sm:h-20 w-auto"
          />
        </div>
        {/* Curved transition into the cream content area */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-8 sm:h-12"
        >
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#F5EDE0" />
        </svg>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 pt-6 pb-16 sm:pt-10 sm:pb-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#1B3A2D] mb-8">
          Share Your Views and WIN a £300 Crayola Creative Supplies Bundle
        </h1>

        <div className="rounded-2xl overflow-hidden shadow-md mb-10 max-w-3xl mx-auto">
          <Image
            src={heroImage}
            alt="A child colouring a Crayola Creativity Week activity sheet with crayons"
            placeholder="blur"
            preload
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto"
          />
        </div>

        <div className="space-y-5 text-base sm:text-[17px] leading-relaxed text-[#2C2C2C] max-w-3xl mx-auto">
          {PARAGRAPHS.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Link
            href="/survey"
            className="inline-block px-12 py-4 rounded-full text-white text-lg font-semibold transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
          >
            Take survey →
          </Link>
          <p className="text-sm text-[#6B6B6B]">
            <Link href="/crayola/terms" className="underline" style={{ color: '#6B6B6B' }}>
              T&amp;Cs apply
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
