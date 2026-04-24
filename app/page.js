import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Only For Teachers — The UK Teacher Community That Rewards You',
  description: 'Take weekly surveys, earn points, and get rewarded for sharing your professional opinion as a UK teacher.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <main>
      {/* Hero */}
      <section className="bg-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          The UK Teacher Community That Rewards You
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Take weekly surveys, earn points, and get rewarded for sharing your professional opinion
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={isLoggedIn ? '/dashboard' : '/register'}
            className="px-8 py-3.5 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Join Now'}
          </Link>
          <Link
            href="/how-it-works"
            className="px-8 py-3.5 rounded-lg font-semibold text-lg border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: '#CA9662', color: '#CA9662' }}
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Join Free"
              description="Create your free account in minutes, no hidden costs ever"
            />
            <StepCard
              number="2"
              title="Take Weekly Surveys"
              description="Short 5 question surveys on topics that matter to teachers"
            />
            <StepCard
              number="3"
              title="Earn Rewards"
              description="Collect points and redeem them for real rewards"
            />
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Join?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BenefitCard
              title="Relevant Surveys"
              description="Short weekly surveys, always relevant to education"
            />
            <BenefitCard
              title="Peer Insights"
              description="Find out what your peers are thinking"
            />
            <BenefitCard
              title="Monthly Prize Draw"
              description="Each survey enters you into monthly £50 prize draw"
            />
            <BenefitCard
              title="Real Rewards"
              description="Earn points that turn into rewards"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 px-4" style={{ backgroundColor: '#CA9662' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <StatItem value="855+" label="Teachers" />
          <StatItem value="Weekly" label="Surveys" />
          <StatItem value="£50" label="Monthly Prize" />
          <StatItem value="Free" label="Forever" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to join the community?</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Join thousands of UK teachers sharing their voice.
        </p>
        <Link
          href={isLoggedIn ? '/dashboard' : '/register'}
          className="inline-block px-8 py-3.5 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#CA9662' }}
        >
          {isLoggedIn ? 'Go to Dashboard' : 'Join Now'}
        </Link>
      </section>
    </main>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center p-6">
      <div
        className="w-12 h-12 rounded-full text-white font-bold text-xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#CA9662' }}
      >
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitCard({ title, description }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div
        className="w-8 h-1 rounded-full mb-4"
        style={{ backgroundColor: '#CA9662' }}
      />
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-white/80 mt-1 text-sm">{label}</p>
    </div>
  )
}
