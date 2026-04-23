'use server'

import { createServiceClient } from '@/lib/supabase/service'

export async function processReferral(referrerId, newUserId) {
  console.log('[processReferral] called with', { referrerId, newUserId })

  if (!referrerId || !newUserId) {
    console.log('[processReferral] missing parameters')
    return { error: 'Missing parameters' }
  }
  if (referrerId === newUserId) {
    console.log('[processReferral] self-referral rejected')
    return { error: 'Self-referral not allowed' }
  }

  try {
    const supabase = createServiceClient()

    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', referrerId)
      .single()

    if (referrerError) {
      console.error('[processReferral] referrer lookup error:', referrerError)
      return { error: 'Referrer not found' }
    }
    if (!referrer) {
      console.log('[processReferral] referrer not found:', referrerId)
      return { error: 'Referrer not found' }
    }

    const { error: referralError } = await supabase.from('referrals').insert({
      referrer_id: referrerId,
      referred_id: newUserId,
      referrer_points: 100,
      referred_points: 100,
    })

    if (referralError) {
      console.error('[processReferral] referrals insert error:', referralError)
      return { error: referralError.message }
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
      console.error('[processReferral] points_ledger insert error:', ledgerError)
      return { error: ledgerError.message }
    }

    console.log('[processReferral] success for', { referrerId, newUserId })
    return { success: true }
  } catch (err) {
    console.error('[processReferral] unexpected error:', err)
    return { error: err?.message ?? 'Unknown error' }
  }
}
