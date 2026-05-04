import { NextResponse } from 'next/server'
import { syncFullProfile } from '@/lib/brevo'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, firstName, userId, yearGroups, subjects, emailConsent } = body

    if (!email || !userId) {
      return NextResponse.json({ error: 'email and userId are required' }, { status: 400 })
    }

    await syncFullProfile({
      email,
      first_name: firstName || '',
      id: userId,
      year_groups: yearGroups || [],
      subjects: subjects || [],
      email_consent: emailConsent !== false,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[brevo-sync] threw:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
