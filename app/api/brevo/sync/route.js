import { NextResponse } from 'next/server'
import { syncLastLogin, syncLastSurvey, syncReferralId } from '@/lib/brevo'

export async function POST(request) {
  try {
    const { type, email, userId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    if (type === 'lastLogin') {
      await syncLastLogin(email)
    } else if (type === 'lastSurvey') {
      await syncLastSurvey(email)
    } else if (type === 'referralId') {
      if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      await syncReferralId(email, userId)
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
