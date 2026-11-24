// Sponsored survey campaigns.
//
// During a campaign window every "take the survey" entry point on the site
// (sidebar, top nav, footer, dashboard card) sends teachers to the sponsor's
// landing page first, and the survey itself shows a "Brought to you by" banner.
// Outside every window the site behaves exactly as normal.
//
// Gating is by date here, not by a database flag, so the switch-over is
// automatic once the campaign window and the survey record's starts_at/ends_at
// agree. Weekly surveys run 00:01 UTC Tuesday to 23:59 UTC Monday, and only one
// survey may be live at a time (the dashboard and survey page take the first
// active row).
//
// To preview a campaign before it goes live (e.g. on a Vercel preview
// deployment for client sign-off) set NEXT_PUBLIC_CAMPAIGN_PREVIEW to its slug.

export const CAMPAIGNS = [
  {
    slug: 'crayola',
    name: 'Crayola',
    // Brought forward a day from the originally agreed Tuesday 20 October start.
    // Survey record id 25.
    start: new Date('2026-10-19T15:00:00Z'),
    end: new Date('2026-11-02T23:59:00Z'),
    logo: { src: '/crayola/logo.png', alt: 'Crayola', width: 504, height: 360, className: 'h-12 w-auto' },
    prizeShort: 'win a £300 creative supplies bundle',
    surveyBannerText: 'Complete the survey to be entered into the prize draw for a £300 Crayola creative supplies bundle.',
    completedText: 'You have also been entered into the Crayola prize draw.',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft Elevate for Educators',
    // Survey record id 31, "AI, Training and Community". Normal weekly slot.
    start: new Date('2026-12-01T00:01:00Z'),
    end: new Date('2026-12-07T23:59:00Z'),
    logo: {
      src: '/microsoft/educator-community-badge.png',
      alt: 'Microsoft Elevate Educator Community',
      width: 800,
      height: 800,
      className: 'h-24 w-auto',
    },
    prizeShort: 'win £1,250 of teacher training or student workshops for your school',
    surveyBannerText:
      'Complete the survey to be entered into the prize draw for a £1,250 Microsoft teacher training programme or student workshop for your school.',
    completedText: 'You have also been entered into the Microsoft Elevate for Educators prize draw.',
  },
]

export function getCampaign(slug) {
  return CAMPAIGNS.find(c => c.slug === slug) ?? null
}

// The campaign whose window contains `now`, or null.
export function activeCampaign(now = new Date()) {
  const preview = process.env.NEXT_PUBLIC_CAMPAIGN_PREVIEW
  if (preview) {
    const c = getCampaign(preview)
    if (c) return c
  }
  return CAMPAIGNS.find(c => now >= c.start && now <= c.end) ?? null
}

export function isCampaignActive(slug, now = new Date()) {
  return activeCampaign(now)?.slug === slug
}

// Where "take the survey" links should point right now.
export function surveyHref(now = new Date()) {
  const c = activeCampaign(now)
  return c ? `/${c.slug}` : '/survey'
}
