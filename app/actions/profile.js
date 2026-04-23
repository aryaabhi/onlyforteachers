'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
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
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('profiles').delete().eq('id', user.id)

  const serviceClient = createServiceClient()
  const { error } = await serviceClient.auth.admin.deleteUser(user.id)
  if (error) return { error: error.message }

  redirect('/')
}
