import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CopyButton from './CopyButton'
import { Star, Flame, Trophy, ClipboardList, BookOpen, Gift, MessageSquare } from 'lucide-react'

function weekKeyToAbsoluteWeek(key) {
  const [yearStr, weekStr] = key.split('-W')
  const year = parseInt(yearStr, 10)
  const week = parseInt(weekStr, 10)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const mondayW1 = new Date(jan4)
  mondayW1.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1))
  const weekDate = new Date(mondayW1)
  weekDate.setUTCDate(mondayW1.getUTCDate() + (week - 1) * 7)
  return Math.floor(weekDate.getTime() / (7 * 24 * 60 * 60 * 1000))
}

function calculateConsecutiveStreak(rows) {
  if (!rows || rows.length === 0) return 0
  const sorted = [...rows].map(r => r.week_key).sort((a, b) => b.localeCompare(a))
  const absolutes = sorted.map(weekKeyToAbsoluteWeek)
  let streak = 1
  for (let i = 1; i < absolutes.length; i++) {
    if (absolutes[i - 1] - absolutes[i] === 1) streak++
    else break
  }
  return streak
}

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

  const service = createServiceClient()
  const now = new Date().toISOString()

  const [
    { data: profile },
    { data: pointsData },
    { data: streakData, error: streakError },
    { data: survey },
    { data: completions },
    { data: recentActivity },
    { count: drawEntries },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('points_ledger').select('points, point_type').eq('user_id', user.id),
    service.from('streak_weeks').select('week_key').eq('user_id', user.id).order('week_key', { ascending: false }),
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

  console.log('[streak] user:', user.id, 'week_keys:', streakData?.map(r => r.week_key), 'error:', streakError?.message ?? null)
  const firstName = profile?.first_name || user.user_metadata?.first_name || user.email?.split('@')[0] || 'Teacher'
  const totalPoints = (pointsData ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)
  const currentStreak = calculateConsecutiveStreak(streakData)
  const hasCompletedSurvey = survey
    ? (completions ?? []).some(c => c.survey_id === survey.id)
    : false
  const referralUrl = `https://onlyforteachers.co.uk/register?ref=${user.id}`

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>

      {(!profile?.year_groups || profile.year_groups.length === 0) && (
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4" style={{ backgroundColor: '#FEF3C7', borderBottom: '1px solid #FDE68A' }}>
          <p className="text-sm text-amber-800">
            Please complete your profile to get the most from Only for Teachers.
          </p>
          <Link
            href="/complete-profile"
            className="shrink-0 text-sm font-semibold hover:underline"
            style={{ color: '#C94F2C' }}
          >
            Complete profile →
          </Link>
        </div>
      )}

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
              This week&apos;s survey
            </p>
            {hasCompletedSurvey ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#16a34a' }}>
                  ✓
                </div>
                <div>
                  <p className="font-semibold">{survey.title}</p>
                  <p className="text-sm opacity-60 mt-0.5">Completed - well done!</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-1">{survey.title}</h2>
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
            <p className="text-[#6B6B6B] text-sm">No active survey right now - check back soon!</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Points balance"
            value={totalPoints.toLocaleString()}
            icon={<Star className="w-5 h-5" style={{ color: '#C94F2C' }} />}
            valueColor="#C94F2C"
          />
          <StatCard
            label="Current streak"
            value={currentStreak === 1 ? '1 week' : `${currentStreak} weeks`}
            icon={<Flame className="w-5 h-5" style={{ color: '#C94F2C' }} />}
            valueColor="#C94F2C"
          />
          <StatCard
            label="Draw entries"
            value={drawEntries ?? 0}
            icon={<Trophy className="w-5 h-5" style={{ color: '#1B3A2D' }} />}
            valueColor="#1B3A2D"
          />
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#E8DDD0' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1B3A2D]">Recent activity</h2>
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
              No points activity yet - complete a survey to earn your first points!
            </p>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <QuickLink href="/survey-results" icon={<BookOpen className="w-5 h-5" />} label="Insights hub" />
          <QuickLink href="/my-surveys" icon={<ClipboardList className="w-5 h-5" />} label="Survey history" />
          <QuickLink href="/offers" icon={<Gift className="w-5 h-5" />} label="Rewards" />
        </div>

        {/* Ask a Question */}
        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#E8DDD0' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F5EDE0' }}>
              <MessageSquare className="w-5 h-5" style={{ color: '#C94F2C' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-[#1B3A2D] mb-1">Ask the community</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">
                Have a question you&apos;d like fellow teachers to answer? Submit it for our next survey.
              </p>
              <Link
                href="/ask-a-question"
                className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#C94F2C' }}
              >
                Ask a question →
              </Link>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0' }}>
          <h2 className="text-base font-semibold text-[#1B3A2D] mb-1">Refer a teacher</h2>
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
