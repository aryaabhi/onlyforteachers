import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Password reset — always send to update-password regardless of OAuth status
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/update-password`)
      }

      const user = data.user

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('year_groups')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        const fullName = user.user_metadata?.full_name ?? ''
        const firstName = fullName.split(' ')[0] ?? ''

        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          display_name: fullName || user.email,
          subjects: [],
          year_groups: [],
          email_consent: false,
          role: 'teacher',
        })

        if (insertError && insertError.code !== '23505') {
          console.error('[auth/callback] profile insert error:', insertError)
        }

        return NextResponse.redirect(`${origin}/complete-profile`)
      }

      if (type === 'signup') {
        const yearGroups = existingProfile.year_groups
        if (!yearGroups || yearGroups.length === 0) {
          return NextResponse.redirect(`${origin}/complete-profile`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }

      const yearGroups = existingProfile.year_groups
      if (!yearGroups || yearGroups.length === 0) {
        return NextResponse.redirect(`${origin}/complete-profile`)
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
