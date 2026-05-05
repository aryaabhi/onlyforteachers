import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import FAQAccordion from './FAQAccordion'

export const metadata = {
  title: 'How It Works - Earn Rewards for Your Teacher Opinion',
  description: 'Learn how Only for Teachers works. Sign up free, take weekly surveys, earn points and redeem real rewards. Takes just 3 minutes a week.',
  openGraph: {
    title: 'How It Works - Earn Rewards for Your Teacher Opinion',
    description: 'Sign up free, take weekly surveys, earn points and redeem real rewards.',
    url: 'https://onlyforteachers.co.uk/how-it-works',
  },
}

const FALLBACK_FAQS = [
  {
    id: 1,
    question: 'Is it really free?',
    answer: 'Yes, completely free forever. No hidden costs, no premium tiers.',
  },
  {
    id: 2,
    question: 'How long do surveys take?',
    answer: 'Most surveys take around 3 minutes. Never more than 5 questions.',
  },
  {
    id: 3,
    question: 'Are my responses anonymous?',
    answer: 'Your individual responses are never published. We only publish aggregated data.',
  },
  {
    id: 4,
    question: 'How do I claim rewards?',
    answer: 'Browse available rewards in the Rewards section and redeem using your points balance.',
  },
  {
    id: 5,
    question: 'Who can join?',
    answer: 'Any teacher working in a UK school or educational institution.',
  },
  {
    id: 6,
    question: 'When is the monthly prize draw?',
    answer: 'The draw runs on the last day of each month. Every survey completion = one entry.',
  },
]

export default async function HowItWorksPage() {
  const supabase = await createClient()
  let faqs = null
  try {
    const result = await supabase
      .from('faqs')
      .select('id, question, answer')
      .eq('is_active', true)
      .order('position')
    faqs = result.data
  } catch {
    faqs = null
  }

  const displayFaqs = faqs && faqs.length > 0 ? faqs : FALLBACK_FAQS

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="text-white px-4 pt-16 pb-0" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-4xl mx-auto text-center pb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garant', serif" }}>
            How it <em>works</em>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D4C9B8' }}>
            Only for Teachers is a free UK teacher community where you share your professional
            opinion through quick weekly surveys - and get rewarded for it. Here&apos;s how it
            works in three simple steps.
          </p>
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto border-t pb-0" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ divideColor: 'rgba(255,255,255,0.15)' }}>
            {[
              { stat: '2,500+', label: 'teachers and growing every week' },
              { stat: '~3 min', label: 'average survey length' },
              { stat: '£50 × 5', label: 'winners every month' },
            ].map(({ stat, label }) => (
              <div key={stat} className="text-center py-6 px-4">
                <p className="text-2xl font-bold" style={{ color: '#F5EDE0' }}>{stat}</p>
                <p className="text-sm mt-1" style={{ color: '#9A8F82' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="w-full leading-[0] overflow-hidden">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" fill="#1B3A2D" />
          </svg>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">

        <section>
          <SectionNumber number="1" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Join</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Registration is completely free and takes just a few minutes. Create your account with your
            name, email address, and some basic information about your teaching role - your subjects,
            year groups, and school type.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Only for Teachers is available to UK teachers only. There are no hidden costs, no subscription
            fees, and no credit card required - ever.
          </p>
        </section>

        <section>
          <SectionNumber number="2" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Take weekly surveys</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every week, a new 5-question survey goes live. Each survey focuses on a topic relevant to
            teaching - from workload and wellbeing to curriculum changes and technology in the classroom.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Surveys run for one week and you&apos;ll be notified when a new survey opens. Each survey takes
            around 2-3 minutes to complete.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Your responses are anonymised and compiled into the{' '}
            <Link href="/teacher-index" className="font-medium" style={{ color: '#C94F2C' }}>
              UK Teacher Pulse Index
            </Link>
            {' '}- a public record of how UK teachers feel about the issues that matter most.
          </p>
        </section>

        <section>
          <SectionNumber number="3" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Earn points</h2>
          <p className="text-gray-600 leading-relaxed mb-4">You earn points in four ways:</p>
          <ul className="space-y-4">
            <PointsItem icon="📋" label="Survey completion" description="Earn 100-500 points each time you complete a survey" />
            <PointsItem icon="👫" label="Refer a teacher" description="Earn 100 points for every teacher you refer who joins" />
            <PointsItem icon="🎁" label="Join via referral" description="Earn 100 points when you join through a friend's referral link" />
            <PointsItem icon="🔥" label="10 week streak bonus" description="Complete 10 surveys in a row and earn a 500 point bonus" />
          </ul>
        </section>

        <section>
          <SectionNumber number="4" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Redeem rewards</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Your points can be redeemed for real rewards through our{' '}
            <Link href="/rewards" className="font-medium" style={{ color: '#C94F2C' }}>
              rewards catalogue
            </Link>
            {' '}- including partner offers and discounts relevant to teachers.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every month, we draw <strong>5 winners</strong> who each receive <strong>£50</strong>.
            Every survey you complete gives you one entry into that month&apos;s draw. The more surveys
            you complete, the more entries you get.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Winners are drawn at the end of each month and notified by email.
          </p>
        </section>

        <section>
          <SectionNumber number="5" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Teacher Pulse Index</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The UK Teacher Pulse Index is our public record of how teachers across the UK are thinking
            and feeling. Every completed survey contributes to this index, which is published after
            each survey closes.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            The index covers workload, wellbeing, curriculum, technology, leadership, pay, and more.
            It&apos;s designed to give teachers, school leaders, policymakers, and the public an honest
            picture of life in UK classrooms.
          </p>
          <Link
            href="/teacher-index"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1B3A2D' }}
          >
            View the Teacher Pulse Index
          </Link>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <FAQAccordion faqs={displayFaqs} />
        </section>

        <section className="text-center py-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Join UK teachers sharing their voice and earning rewards.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 rounded-full text-white font-semibold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C94F2C' }}
          >
            Join for free
          </Link>
        </section>
      </div>
    </main>
  )
}

function SectionNumber({ number }) {
  return (
    <div
      className="w-10 h-10 rounded-full text-white font-bold text-lg flex items-center justify-center"
      style={{ backgroundColor: '#C94F2C' }}
    >
      {number}
    </div>
  )
}

function PointsItem({ icon, label, description }) {
  return (
    <li className="flex items-start gap-3 list-none">
      <span className="text-xl mt-0.5">{icon}</span>
      <span className="text-gray-600">
        <strong className="text-gray-900">{label}</strong>
        {' - '}
        {description}
      </span>
    </li>
  )
}
