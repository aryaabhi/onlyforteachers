import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load credentials from scripts/.env
const envPath = resolve(__dirname, '.env')
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=').map((part, i) => (i === 0 ? part.trim() : part.trim())))
    .filter(([key]) => key)
)

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY
const BREVO_API_KEY = envVars.BREVO_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !BREVO_API_KEY) {
  console.error('Missing required env vars in scripts/.env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const { data: profiles, error } = await supabase
  .from('profiles')
  .select('id, email, first_name, email_consent, subjects, year_groups')
  .gte('created_at', '2026-05-11 00:00:00')

if (error) {
  console.error('Failed to fetch profiles:', error.message)
  process.exit(1)
}

console.log(`Found ${profiles.length} user(s) created on 11–12 May 2026\n`)

let succeeded = 0
let failed = 0

for (const profile of profiles) {
  const { email, first_name, email_consent, subjects, year_groups } = profile

  const res = await fetch(
    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
    {
      method: 'PUT',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attributes: {
          EMAILCONSENT: email_consent === true,
          GDPRCONSENT: TRUE,
          FIRSTNAME: first_name || '',
          SUBJECTS: Array.isArray(subjects) ? subjects.join(', ') : '',
          YEARGROUP: Array.isArray(year_groups) ? year_groups.join(', ') : '',
        },
      }),
    }
  )

  if (res.ok) {
    console.log(`✅ updated: ${email}`)
    succeeded++
  } else {
    const text = await res.text()
    console.log(`❌ failed: ${email} - ${res.status} ${text}`)
    failed++
  }

  await new Promise(resolve => setTimeout(resolve, 300))
}

console.log(`\nDone. ${succeeded} updated, ${failed} failed.`)
