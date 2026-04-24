import Link from 'next/link'

export const metadata = {
  title: 'How It Works | Only For Teachers',
  description: 'Learn how Only For Teachers works — join, take weekly surveys, earn points, and redeem rewards.',
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Only For Teachers is the UK&apos;s first survey platform built exclusively for teachers.
          Here&apos;s everything you need to know.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">

        <section>
          <SectionNumber number="1" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Join</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Registration is completely free and takes just a few minutes. Create your account with your
            name, email address, and some basic information about your teaching role — your subjects,
            year groups, and school type.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Only For Teachers is available to UK teachers only. There are no hidden costs, no subscription
            fees, and no credit card required — ever.
          </p>
        </section>

        <section>
          <SectionNumber number="2" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Take Weekly Surveys</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every week, a new 5-question survey goes live. Each survey focuses on a topic relevant to
            teaching — from workload and wellbeing to curriculum changes and technology in the classroom.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Surveys run for one week. You&apos;ll be notified when a new survey opens. Each survey takes
            around 2–3 minutes to complete.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Your responses are anonymised and compiled into the{' '}
            <Link href="/teacher-index" className="font-medium" style={{ color: '#CA9662' }}>
              UK Teacher Pulse Index
            </Link>
            {' '}— a public record of how UK teachers feel about the issues that matter most.
          </p>
        </section>

        <section>
          <SectionNumber number="3" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Earn Points</h2>
          <p className="text-gray-600 leading-relaxed mb-4">You earn points in four ways:</p>
          <ul className="space-y-4">
            <PointsItem
              icon="📋"
              label="Survey completion"
              description="Earn 100–500 points each time you complete a survey"
            />
            <PointsItem
              icon="👫"
              label="Refer a teacher"
              description="Earn 100 points for every teacher you refer who joins"
            />
            <PointsItem
              icon="🎁"
              label="Join via referral"
              description="Earn 100 points when you join through a friend's referral link"
            />
            <PointsItem
              icon="🔥"
              label="10 week streak bonus"
              description="Complete 10 surveys in a row and earn a 500 point bonus"
            />
          </ul>
        </section>

        <section>
          <SectionNumber number="4" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Redeem Rewards</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Your points can be redeemed for real rewards through our{' '}
            <Link href="/rewards" className="font-medium" style={{ color: '#CA9662' }}>
              rewards catalogue
            </Link>
            {' '}— including partner offers and discounts relevant to teachers.
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
            style={{ backgroundColor: '#CA9662' }}
          >
            View the Teacher Pulse Index
          </Link>
        </section>

        <section className="text-center py-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Join UK teachers sharing their voice and earning rewards.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Join Free Today
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
      style={{ backgroundColor: '#CA9662' }}
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
        {' — '}
        {description}
      </span>
    </li>
  )
}
