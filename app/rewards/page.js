import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export const metadata = {
  title: 'Rewards & Points - Only for Teachers',
  description: 'Earn points for completing weekly teacher surveys. Redeem for Amazon vouchers, TES Resources and more. Monthly £50 prize draw.',
  openGraph: {
    title: 'Rewards & Points - Only for Teachers',
    description: 'Earn points for surveys and redeem for real rewards.',
    url: 'https://onlyforteachers.co.uk/rewards',
  },
}

export default async function RewardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const { data: offers } = await supabase
    .from('offers')
    .select('id, title, description, points_cost')
    .eq('is_active', true)
    .order('points_cost')

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="text-white px-4 pt-16 pb-0" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-8 pb-12">
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garant', serif" }}>
              Rewards &amp; Points
            </h1>
            <p className="text-lg mb-8" style={{ color: '#D4C9B8' }}>
              Your expertise has value. Here&apos;s how we say thank you.
            </p>
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-block px-6 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
                >
                  Join for free
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 rounded-full font-semibold transition-all hover:bg-white/10"
                  style={{ color: '#D4C9B8', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}
                >
                  Already a member? Login →
                </Link>
              </div>
            )}
          </div>
          {/* Trophy illustration */}
          <div
            className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-6xl sm:text-7xl"
            style={{ backgroundColor: 'rgba(201,79,44,0.2)' }}
          >
            🏆
          </div>
        </div>
        {/* Wave */}
        <div className="w-full leading-[0] overflow-hidden">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" fill="#1B3A2D" />
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Intro */}
        <section>
          <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto text-center">
            Only for Teachers rewards UK teachers for sharing their professional opinions. Every
            week you complete a survey, you earn points. Those points can be redeemed for real
            rewards - from Amazon vouchers to a Teachit subscription. Plus, every survey
            gives you an entry into our monthly £50 prize draw.{' '}
            <Link href="/how-it-works" className="font-medium" style={{ color: '#C94F2C' }}>
              Learn how it works →
            </Link>
          </p>
        </section>

        {/* Points system */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">How you earn points</h2>
          <p className="text-gray-600 text-center mb-8">Four ways to build up your points balance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PointsCard
              icon="📋"
              title="Survey completion"
              points="100-500 pts"
              description="Earn points every time you complete a weekly survey"
            />
            <PointsCard
              icon="👫"
              title="Refer a teacher"
              points="100 pts"
              description="Earn points for every teacher you refer who joins"
            />
            <PointsCard
              icon="🎁"
              title="Join via referral"
              points="100 pts"
              description="Get bonus points when you join through a friend's link"
            />
            <PointsCard
              icon="🔥"
              title="10 week streak"
              points="500 pts"
              description="Complete 10 surveys in a row for a big streak bonus"
            />
          </div>
        </section>

        {/* Monthly prize draw */}
        <section
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: '#FDF8F3' }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly £50 prize draw</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
            Every survey you complete gives you <strong>one entry</strong> into the monthly prize draw.
            Each month, we select <strong>5 winners</strong> who each receive <strong>£50</strong>.
          </p>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Winners are drawn at the end of each month and notified by email. The more surveys you
            complete, the more chances you have to win.
          </p>
        </section>

        {/* Available offers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Available rewards</h2>
          <p className="text-gray-600 text-center mb-8">Redeem your points for these exclusive offers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(offers ?? []).map(offer => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{offer.title}</h3>
                {offer.description && (
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{offer.description}</p>
                )}
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: '#CA9662' }}
                >
                  {offer.points_cost.toLocaleString()} points
                </span>
              </div>
            ))}
            <RewardsComingSoonCard />
            <RewardsComingSoonCard />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isLoggedIn ? 'View your rewards' : 'Start earning rewards today'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isLoggedIn
              ? 'Check your points balance and redeem your rewards.'
              : 'Join free and start completing surveys to earn points and rewards.'}
          </p>
          <Link
            href={isLoggedIn ? '/offers' : '/register'}
            className="inline-block px-8 py-3.5 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            {isLoggedIn ? 'Go to rewards' : 'Join for free'}
          </Link>
        </section>
      </div>
    </main>
  )
}

function PointsCard({ icon, title, points, description }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full text-white font-semibold"
            style={{ backgroundColor: '#CA9662' }}
          >
            {points}
          </span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function RewardsComingSoonCard() {
  return (
    <div
      className="rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-3 text-center"
      style={{ backgroundColor: '#F5F5F5', opacity: 0.7 }}
    >
      <Lock className="w-7 h-7" style={{ color: '#B0B0B0' }} />
      <div>
        <p className="text-sm font-semibold" style={{ color: '#9A9A9A' }}>Coming soon</p>
        <p className="text-xs mt-0.5" style={{ color: '#B8B8B8' }}>New reward being sourced</p>
      </div>
    </div>
  )
}
