const BREVO_BASE = 'https://api.brevo.com/v3'

async function updateContact(email, attributes) {
  const res = await fetch(`${BREVO_BASE}/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attributes }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Brevo API error ${res.status}: ${text}`)
  }
}

export async function syncLastLogin(email) {
  await updateContact(email, { LASTLOGIN: new Date().toISOString() })
}

export async function syncLastSurvey(email) {
  await updateContact(email, { LASTSURVEY: new Date().toISOString() })
}

export async function syncReferralId(email, userId) {
  await updateContact(email, { REFERALID: userId })
}
