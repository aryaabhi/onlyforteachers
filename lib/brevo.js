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
  await updateContact(email, { LASTLOGIN: new Date().toISOString().split('T')[0] })
}

export async function syncLastSurvey(email) {
  await updateContact(email, { LASTSURVEY: new Date().toISOString().split('T')[0] })
}

export async function updateBrevoAttributes(email, attributes) {
  try {
    await fetch(`${BREVO_BASE}/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({ attributes }),
    })
  } catch (error) {
    console.error('Brevo update failed:', error)
  }
}

export async function syncReferralId(email, userId) {
  await updateContact(email, { REFERALID: userId })
}

export async function syncFullProfile(user) {
  const apiKey = process.env.BREVO_API_KEY
  const today = new Date().toISOString().split('T')[0]
  const data = {
    email: user.email,
    attributes: {
      FIRSTNAME: user.first_name || '',
      REFERALID: user.id,
      YEARGROUP: Array.isArray(user.year_groups) ? user.year_groups.join(', ') : '',
      SUBJECTS: Array.isArray(user.subjects) ? user.subjects.join(', ') : '',
      EMAIL_CONSENT: Boolean(user.email_consent),
      GDPR_CONSENT: 'YES',
      LASTLOGIN: today,
    },
    ...(process.env.BREVO_LIST_ID ? { listIds: [parseInt(process.env.BREVO_LIST_ID, 10)] } : {}),
    updateEnabled: true,
  }

  const response = await fetch(`${BREVO_BASE}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    console.error('Brevo syncFullProfile failed:', await response.text())
  }
}
