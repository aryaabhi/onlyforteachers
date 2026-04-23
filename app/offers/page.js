import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OffersList from './OffersList'

export default async function OffersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: offers }, { data: ledger }] = await Promise.all([
    supabase.from('offers').select('*').eq('is_active', true).order('points_cost'),
    supabase.from('points_ledger').select('points').eq('user_id', user.id),
  ])

  const totalPoints = (ledger ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)

  return <OffersList offers={offers ?? []} totalPoints={totalPoints} />
}
