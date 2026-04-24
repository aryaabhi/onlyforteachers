import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CopyButton from './CopyButton'
import { Star, Flame, Trophy, ClipboardList, BookOpen, Gift } from 'lucide-react'

const EVENT_LABELS = {
  survey_completion: 'Survey Completed',
  referral: 'Referral Bonus',
  streak_award: 'Streak Bonus',
  redemption: 'Points Redeemed',
}

function formatEventType(eventType, pointType) {
  if (EVENT_LABELS[eventType]) return EVENT_LABELS[eventType]
  if (pointType === 'survey_points') return 'Survey Points'
  if (pointType === 'referral_points') return 'Referral Bonus'
  if (pointType === 'streak_bonus') return 'Streak Bonus'
  return 'Points'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams
  const surveyCompleted = params?.survey === 'completed'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const now = new Date().toISOString()

  const [
    { data: profile },
    { data: pointsData },
    { data: streakData },
    { data: survey },
    { data: completions },
    { data: recentActivity },
    { count: drawEntries },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('points_ledger').select('points, point_type').eq('user_id', user.id),
    supabase.from('streak_weeks').select('id').eq('user_id', user.id),
    supabase
      .from('surveys')
      .select('*')
      .lte('starts_at', now)
      .gte('ends_at', now)
      .maybeSingle(),
    supabase
      .from('survey_completions')
      .select('id, survey_id')
      .eq('user_id', user.id),
    supabase
      .from('points_ledger')
      .select('points, point_type, event_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('survey_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const firstName = profile?.first_name || user.user_metadata?.first_name || user.email?.split('@')[0] || 'Teacher'
  const totalPoints = (pointsData ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)
  const streakCount = (streakData ?? []).length
  const hasCompletedSurvey = survey
    ? (completions ?? []).some(c => c.survey_id === survey.id)
    : false
  const referralUrl = `https://onlyforteachers.co.uk/register?ref=${user.id}`

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>

      {surveyCompleted && (
        <div className="px-4 sm:px-6 py-3 text-center text-sm font-medium text-white" style={{ backgroundColor: '#16a34a' }}>
          Thank you! Your survey response has been saved and your points have been added.
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1B3A2D]">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="mt-1 text-[#6B6B6B]">Here&apos;s your activity overview.</p>
        </div>

        {/* Active survey card */}
        {survey && (
          <div className="rounded-2xl p-6 mb-6 text-white" style={{ backgroundColor: '#1B3A2D' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2 opacity-70">
              This Week&apos;s Survey
            </p>
            {hasCompletedSurvey ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#16a34a' }}>
                  ✓
                </div>
                <div>
                  <p className="font-semibold italic">{survey.title}</p>
                  <p className="text-sm opacity-60 mt-0.5">Completed — well done!</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold italic mb-1">{survey.title}</h2>
                <p className="text-sm opacity-60 mb-4">Takes ~3 minutes · {survey.points_value ?? 100} points</p>
                <Link
                  href="/survey"
                  className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
                  style={{ backgroundColor: '#C94F2C', textDecoration: 'none', color: '#fff' }}
                >
                  Take survey →
                </Link>
              </>
            )}
          </div>
        )}

        {!survey && (
          <div className="rounded-2xl p-6 mb-6 border" style={{ backgroundColor: '#fff', borderColor: '#E8DDD0' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#C94F2C' }}>This Week&apos;s Survey</p>
            <p className="text-[#6B6B6B] text-sm">No active survey right now — check back soon!</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Points Balance"
            value={totalPoints.toLocaleString()}
            icon={<Star className="w-5 h-5" style={{ color: '#C94F2C' }} />}
            valueColor="#C94F2C"
          />
          <StatCard
            label="Current Streak"
            value={`${streakCount}w`}
            icon={<Flame className="w-5 h-5" style={{ color: '#C94F2C' }} />}
            valueColor="#C94F2C"
          />
          <StatCard
            label="Draw Entries"
            value={drawEntries ?? 0}
            icon={<Trophy className="w-5 h-5" style={{ color: '#1B3A2D' }} />}
            valueColor="#1B3A2D"
          />
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#E8DDD0' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1B3A2D]">Recent Activity</h2>
            <Link
              href="/profile/points"
              className="text-sm font-medium hover:underline"
              style={{ color: '#C94F2C' }}
            >
              View full history
            </Link>
          </div>

          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-0.5">
              {recentActivity.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b last:border-0"
                  style={{ borderColor: '#F5EDE0' }}
                >
                  <div>
                    <span className="text-sm font-medium text-[#2C2C2C]">
                      {formatEventType(entry.event_type, entry.point_type)}
                    </span>
                    <span className="block text-xs text-[#6B6B6B]">{formatDate(entry.created_at)}</span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: entry.points >= 0 ? '#16a34a' : '#dc2626' }}
                  >
                    {entry.points >= 0 ? '+' : ''}{entry.points}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6B6B] py-4 text-center">
              No points activity yet — complete a survey to earn your first points!
            </p>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <QuickLink href="/survey-results" icon={<BookOpen className="w-5 h-5" />} label="Insights Hub" />
          <QuickLink href="/survey-results" icon={<ClipboardList className="w-5 h-5" />} label="Survey History" />
          <QuickLink href="/offers" icon={<Gift className="w-5 h-5" />} label="Rewards" />
        </div>

        {/* Referral */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0' }}>
          <h2 className="text-base font-semibold text-[#1B3A2D] mb-1">Refer a Teacher</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">
            Share your link and earn points for every teacher who joins.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              readOnly
              value={referralUrl}
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm text-[#6B6B6B] font-mono focus:outline-none min-w-0"
              style={{ borderColor: '#E8DDD0', backgroundColor: '#F5EDE0' }}
            />
            <CopyButton text={referralUrl} />
          </div>
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value, icon, valueColor }) {
  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0' }}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-3xl font-bold" style={{ color: valueColor }}>{value}</p>
    </div>
  )
}

function QuickLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border p-5 flex items-center gap-3 hover:shadow-md transition-shadow group"
      style={{ borderColor: '#E8DDD0', textDecoration: 'none' }}
    >
      <span className="text-[#C94F2C] group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium text-[#2C2C2C]">{label}</span>
    </Link>
  )
}
