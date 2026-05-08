'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { syncFullProfile } from '@/lib/brevo'
import { redirect } from 'next/navigation'

export async function updateProfile({ firstName, subjects, yearGroups, emailConsent }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      subjects,
      year_groups: yearGroups,
      email_consent: emailConsent,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  try {
    await syncFullProfile({
      email: user.email,
      first_name: firstName,
      id: user.id,
      year_groups: yearGroups,
      subjects,
      email_consent: emailConsent,
    })
  } catch (err) {
    console.error('[profile] brevo sync error:', err)
  }

  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userId = user.id
  const userEmail = user.email

  try {
    const steps = [
      () => supabase.from('redemptions').delete().eq('user_id', userId),
      () => supabase.from('referrals').delete().or(`referrer_id.eq.${userId},referred_id.eq.${userId}`),
      () => supabase.from('streak_awards').delete().eq('user_id', userId),
      () => supabase.from('streak_weeks').delete().eq('user_id', userId),
      () => supabase.from('survey_completions').delete().eq('user_id', userId),
      () => supabase.from('responses').delete().eq('user_id', userId),
      () => supabase.from('points_ledger').delete().eq('user_id', userId),
      () => supabase.from('profiles').delete().eq('id', userId),
    ]

    for (const step of steps) {
      const { error } = await step()
      if (error) {
        console.error('[deleteAccount] DB delete error:', error)
        return { error: 'Database error deleting user' }
      }
    }
  } catch (err) {
    console.error('[deleteAccount] Unexpected error:', err)
    return { error: 'Database error deleting user' }
  }

  try {
    const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(userEmail)}`, {
      method: 'DELETE',
      headers: { 'api-key': process.env.BREVO_API_KEY },
    })
    if (!res.ok && res.status !== 404) {
      console.error('[deleteAccount] Brevo delete failed:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[deleteAccount] Brevo delete error:', err)
  }

  const serviceClient = createServiceClient()
  const { error: authError } = await serviceClient.auth.admin.deleteUser(userId)
  if (authError) {
    console.error('[deleteAccount] Auth delete error:', authError)
    return { error: 'Error deleting account' }
  }

  await supabase.auth.signOut()

  redirect('/')
}
