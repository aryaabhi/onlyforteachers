import { NextResponse } from 'next/server'

const BREVO_BASE = 'https://api.brevo.com/v3'

export async function POST(request) {
  try {
    const { email, firstName, userId } = await request.json()

    if (!email || !userId) {
      return NextResponse.json({ error: 'email and userId are required' }, { status: 400 })
    }

    const res = await fetch(`${BREVO_BASE}/contacts`, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName || '',
          REFERALID: userId,
        },
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[brevo-sync] API error:', res.status, text)
      return NextResponse.json({ error: 'Brevo sync failed', detail: text }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[brevo-sync] threw:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
