// Crayola Creativity Week sponsored survey campaign.
//
// During the campaign window every "take the survey" entry point on the site
// (sidebar, top nav, footer, dashboard card) sends teachers to the Crayola
// landing page first, and the survey itself shows a "Brought to you by Crayola"
// banner. Outside the window the site behaves exactly as normal.
//
// To preview the campaign before it goes live (e.g. on a Vercel preview
// deployment for client sign-off) set NEXT_PUBLIC_CRAYOLA_PREVIEW=true.

// Survey runs for the usual one-week period starting Monday 20 October 2026.
// UK clocks go back on 25 October, so the end is expressed in GMT.
export const CRAYOLA_START = new Date('2026-10-20T00:00:00+01:00')
export const CRAYOLA_END = new Date('2026-10-26T23:59:59+00:00')

export function isCrayolaActive(now = new Date()) {
  if (process.env.NEXT_PUBLIC_CRAYOLA_PREVIEW === 'true') return true
  return now >= CRAYOLA_START && now <= CRAYOLA_END
}

// Where "take the survey" links should point right now.
export function surveyHref(now = new Date()) {
  return isCrayolaActive(now) ? '/crayola' : '/survey'
}
