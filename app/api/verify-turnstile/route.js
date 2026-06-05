export async function POST(request) {
  const { token } = await request.json()

  // If no secret key configured (local dev without keys), pass through
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return Response.json({ success: true })

  if (!token) return Response.json({ success: false })

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    }
  )

  const data = await response.json()
  return Response.json({ success: data.success })
}
