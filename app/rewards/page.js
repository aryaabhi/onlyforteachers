import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Rewards | Only For Teachers',
  description: 'Earn points by completing weekly surveys and redeem them for real rewards. Monthly £50 prize draw for UK teachers.',
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
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rewards for Teachers Who Share Their Voice
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Complete weekly surveys, earn points, and redeem them for real rewards — because
          your professional opinion is valuable.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Points system */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">How You Earn Points</h2>
          <p className="text-gray-600 text-center mb-8">Four ways to build up your points balance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PointsCard
              icon="📋"
              title="Survey Completion"
              points="100–500 pts"
              description="Earn points every time you complete a weekly survey"
            />
            <PointsCard
              icon="👫"
              title="Refer a Teacher"
              points="100 pts"
              description="Earn points for every teacher you refer who joins"
            />
            <PointsCard
              icon="🎁"
              title="Join via Referral"
              points="100 pts"
              description="Get bonus points when you join through a friend's link"
            />
            <PointsCard
              icon="🔥"
              title="10 Week Streak"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly £50 Prize Draw</h2>
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
        {offers && offers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Available Rewards</h2>
            <p className="text-gray-600 text-center mb-8">Redeem your points for these exclusive offers</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {offers.map(offer => (
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
            </div>
          </section>
        )}

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
            {isLoggedIn ? 'Go to Rewards' : 'Join Now'}
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
