'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'

export async function redeemOffer(offerId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: offer, error: offerError } = await supabase
    .from('offers')
    .select('id, title, points_cost, is_active, stock')
    .eq('id', offerId)
    .single()

  if (offerError || !offer) return { error: 'Offer not found' }
  if (!offer.is_active) return { error: 'This offer is no longer available' }
  if (offer.stock !== null && offer.stock <= 0) return { error: 'This offer is out of stock' }

  const { data: ledger } = await supabase
    .from('points_ledger')
    .select('points')
    .eq('user_id', user.id)

  const balance = (ledger ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)

  if (balance < offer.points_cost) {
    return { error: `Insufficient points. You need ${(offer.points_cost - balance).toLocaleString()} more points.` }
  }

  const { data: redemption, error: redemptionError } = await supabase
    .from('redemptions')
    .insert({
      user_id: user.id,
      offer_id: offerId,
      points_spent: offer.points_cost,
      status: 'pending',
    })
    .select()
    .single()

  if (redemptionError) return { error: redemptionError.message }

  const { error: pointsError } = await supabase.from('points_ledger').insert({
    user_id: user.id,
    points: -offer.points_cost,
    point_type: 'redemption',
    event_type: 'redemption',
    reference_id: redemption.id,
    note: `Redeemed: ${offer.title}`,
  })

  if (pointsError) return { error: pointsError.message }

  if (offer.stock !== null) {
    const service = createServiceClient()
    await service.from('offers').update({ stock: offer.stock - 1 }).eq('id', offerId)
  }

  return { success: true }
}
