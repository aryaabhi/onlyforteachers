'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function getISOWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function weekKeyToAbsolute(key) {
  const [yearStr, weekStr] = key.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const mondayW1 = new Date(jan4)
  mondayW1.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1))
  const weekDate = new Date(mondayW1)
  weekDate.setUTCDate(mondayW1.getUTCDate() + (week - 1) * 7)
  return Math.floor(weekDate.getTime() / (7 * 24 * 60 * 60 * 1000))
}

export async function submitSurveyAction(surveyId, answers) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const weekKey = getISOWeekKey()
  const now = new Date().toISOString()

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, question_type')
    .eq('survey_id', surveyId)

  if (qError) throw new Error(qError.message)

  const { data: survey, error: sError } = await supabase
    .from('surveys')
    .select('points_value')
    .eq('id', surveyId)
    .single()

  if (sError) throw new Error(sError.message)

  const pointsValue = survey?.points_value ?? 100

  const responseInserts = (questions ?? []).map(q => {
    const answer = answers[q.id]
    const row = {
      survey_id: surveyId,
      question_id: q.id,
      user_id: user.id,
      submitted_at: now,
    }
    if (q.question_type === 'checkbox') {
      row.answer_array = Array.isArray(answer) ? answer : []
    } else {
      row.answer = answer ?? ''
    }
    return row
  })

  const { error: responsesError } = await supabase
    .from('responses')
    .insert(responseInserts)

  if (responsesError) throw new Error(responsesError.message)

  const { error: completionError } = await supabase
    .from('survey_completions')
    .insert({
      user_id: user.id,
      survey_id: surveyId,
      points_awarded: pointsValue,
      week_key: weekKey,
      completed_at: now,
    })

  if (completionError) throw new Error(completionError.message)

  await supabase.from('points_ledger').insert({
    user_id: user.id,
    points: pointsValue,
    point_type: 'survey_points',
    event_type: 'survey_completion',
    reference_id: surveyId,
    note: `Survey completed week ${weekKey}`,
    created_at: now,
  })

  // Insert streak week — ignore unique constraint violations
  await supabase.from('streak_weeks').insert({ user_id: user.id, week_key: weekKey })

  // Check for 10-consecutive-week streak
  const { data: allStreaks } = await supabase
    .from('streak_weeks')
    .select('week_key')
    .eq('user_id', user.id)

  if (allStreaks && allStreaks.length >= 10) {
    const absolutes = [
      ...new Set(allStreaks.map(s => weekKeyToAbsolute(s.week_key))),
    ].sort((a, b) => a - b)

    let max = 1
    let run = 1
    for (let i = 1; i < absolutes.length; i++) {
      if (absolutes[i] - absolutes[i - 1] === 1) {
        run++
        if (run > max) max = run
      } else {
        run = 1
      }
    }

    if (max >= 10) {
      const { error: awardError } = await supabase.from('streak_awards').insert({
        user_id: user.id,
        streak_goal: 10,
        points_awarded: 500,
        awarded_at: now,
      })

      if (!awardError) {
        await supabase.from('points_ledger').insert({
          user_id: user.id,
          points: 500,
          point_type: 'streak_bonus',
          event_type: 'streak_award',
          reference_id: user.id,
          note: '10-week streak bonus',
          created_at: now,
        })
      }
    }
  }

  redirect('/dashboard?survey=completed')
}
