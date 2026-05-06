-- Allow authenticated users to read their own streak_weeks rows.
-- Without this policy the anon/user client returns empty results even
-- when rows exist, because RLS blocks the SELECT.

alter table public.streak_weeks enable row level security;

create policy "users can view own streak weeks"
  on public.streak_weeks
  for select
  using (auth.uid() = user_id);
