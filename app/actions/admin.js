'use server'

import { createClient } from '@/lib/supabase/server'
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
