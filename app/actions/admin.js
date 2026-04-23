'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'

async function requireAdmin(supabase, user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')
}

export async function createSurveyAction(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await requireAdmin(supabase, user)

  const title = formData.get('title')
  const description = formData.get('description')
  const startDate = formData.get('startDate')
  const startTime = formData.get('startTime')
  const endDate = formData.get('endDate')
  const endTime = formData.get('endTime')
  const pointsValue = parseInt(formData.get('pointsValue') || '100')

  const starts_at = new Date(`${startDate}T${startTime}:00`).toISOString()
  const ends_at = new Date(`${endDate}T${endTime}:00`).toISOString()

  const { data: survey, error } = await supabase
    .from('surveys')
    .insert({ title, description, starts_at, ends_at, points_value: pointsValue, status: 'active' })
    .select()
    .single()

  if (error) return { error: error.message }
  return { survey }
}

export async function addQuestionAction(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await requireAdmin(supabase, user)

  const survey_id = formData.get('surveyId')
  const question_text = formData.get('questionText')
  const question_type = formData.get('questionType')
  const optionsRaw = formData.get('options') ?? ''
  const position = parseInt(formData.get('position') || '1')

  const options = question_type === 'checkbox'
    ? optionsRaw.split('\n').map(o => o.trim()).filter(Boolean)
    : []

  const { data: question, error } = await supabase
    .from('questions')
    .insert({ survey_id, question_text, question_type, options, position })
    .select()
    .single()

  if (error) return { error: error.message }
  return { question }
}

export async function deleteQuestionAction(questionId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await requireAdmin(supabase, user)

  const { error } = await supabase.from('questions').delete().eq('id', questionId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function setSurveyReadyAction(surveyId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await requireAdmin(supabase, user)

  const { data: survey } = await supabase
    .from('surveys')
    .select('starts_at')
    .eq('id', surveyId)
    .single()

  const now = new Date()
  const startsAt = new Date(survey?.starts_at)
  const status = startsAt <= now ? 'active' : 'scheduled'

  const { error } = await supabase.from('surveys').update({ status }).eq('id', surveyId)
  if (error) return { error: error.message }
  return { success: true, status }
}

export async function runMonthlyDrawAction(drawMonth) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await requireAdmin(supabase, user)

  const { data: existing } = await supabase
    .from('monthly_draws')
    .select('id')
    .eq('draw_month', drawMonth)
    .maybeSingle()

  if (existing) return { error: 'Draw already run for this month' }

  const monthStart = new Date(`${drawMonth}-01T00:00:00Z`)
  const monthEnd = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1))

  const { data: completions } = await supabase
    .from('survey_completions')
    .select('user_id')
    .gte('completed_at', monthStart.toISOString())
    .lt('completed_at', monthEnd.toISOString())

  if (!completions || completions.length === 0) {
    return { error: 'No eligible participants for this month' }
  }

  const userIds = [...new Set(completions.map(c => c.user_id))]
  const winnerId = userIds[Math.floor(Math.random() * userIds.length)]

  const service = createServiceClient()
  const { data: winner } = await service
    .from('profiles')
    .select('id, first_name, email')
    .eq('id', winnerId)
    .single()

  if (!winner) return { error: 'Could not find winner profile' }

  const { error: drawError } = await supabase.from('monthly_draws').insert({
    draw_month: drawMonth,
    winner_id: winnerId,
    prize_description: 'Monthly Prize Draw',
    drawn_at: new Date().toISOString(),
  })

  if (drawError) return { error: drawError.message }

  return { success: true, winner: { name: winner.first_name, email: winner.email } }
}
