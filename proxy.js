import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/survey', '/profile', '/offers', '/complete-profile', '/update-password']
const authRoutes = ['/login', '/register']

export async function proxy(request) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(r => pathname === r || pathname.startsWith(r + '/'))
  const isAuthRoute = authRoutes.some(r => pathname === r)
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/')

  // Fast path: skip auth entirely for public routes (homepage, blog posts,
  // survey-results, etc.) so they can be served as edge-cached static HTML.
  // The homepage's logged-in -> /dashboard redirect is handled client-side
  // by <HomeRedirect /> so that / never reads cookies on the server.
  if (!isProtected && !isAuthRoute && !isStudio) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Protected routes and /studio: validate with Supabase server (security critical, must use getUser)
  // Auth routes: read session from cookie only — no network call, fast
  let user = null
  if (isProtected || isStudio) {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } else {
    const { data } = await supabase.auth.getSession()
    user = data.session?.user ?? null
  }

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isStudio) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url))
    }
  }

  // /complete-profile: redirect away if profile already complete
  if (user && pathname.startsWith('/complete-profile')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('year_groups')
      .eq('id', user.id)
      .single()
    if (profile?.year_groups?.length > 0) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
