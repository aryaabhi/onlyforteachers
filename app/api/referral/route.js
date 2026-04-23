import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request) {
  try {
    const { referrerId, newUserId } = await request.json()

    console.log('[/api/referral] called with', { referrerId, newUserId })

    if (!referrerId || !newUserId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    if (referrerId === newUserId) {
      return NextResponse.json({ error: 'Self-referral not allowed' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', referrerId)
      .single()

    if (referrerError || !referrer) {
      console.error('[/api/referral] referrer not found:', referrerError)
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 })
    }

    const { error: referralError } = await supabase.from('referrals').insert({
      referrer_id: referrerId,
      referred_id: newUserId,
      referrer_points: 100,
      referred_points: 100,
    })

    if (referralError) {
      console.error('[/api/referral] referrals insert error:', referralError)
      return NextResponse.json({ error: referralError.message }, { status: 500 })
    }

    const now = new Date().toISOString()

    const { error: ledgerError } = await supabase.from('points_ledger').insert([
      {
        user_id: referrerId,
        points: 100,
        point_type: 'referral_points',
        event_type: 'referral',
        reference_id: newUserId,
        note: 'Referral bonus',
        created_at: now,
      },
      {
        user_id: newUserId,
        points: 100,
        point_type: 'referral_points',
        event_type: 'referred_signup',
        reference_id: referrerId,
        note: 'Referred signup bonus',
        created_at: now,
      },
    ])

    if (ledgerError) {
      console.error('[/api/referral] points_ledger insert error:', ledgerError)
      return NextResponse.json({ error: ledgerError.message }, { status: 500 })
    }

    console.log('[/api/referral] success for', { referrerId, newUserId })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/referral] unexpected error:', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
