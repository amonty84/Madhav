import { NextResponse, type NextRequest } from 'next/server'

// Lightweight JWT payload parse — no crypto. Real verification happens in each
// route handler via firebase-admin (Node.js runtime). Middleware only gates
// redirects; cryptographic enforcement is at the route layer.
function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split('.')[1]
    if (!segment) return null
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(
      segment.length + ((4 - (segment.length % 4)) % 4),
      '='
    )
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

function isSessionValid(sessionCookie: string | undefined): boolean {
  if (!sessionCookie) return false
  const payload = parseJwtPayload(sessionCookie)
  if (!payload) return false
  return (
    typeof payload.exp === 'number' &&
    payload.exp * 1000 > Date.now() &&
    typeof payload.iss === 'string' &&
    payload.iss.includes('session.firebase.google.com')
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/login')
  const isPublicRoute = pathname === '/'

  if (!isAuthRoute && !isPublicRoute) {
    const sessionCookie = request.cookies.get('__session')?.value
    if (!isSessionValid(sessionCookie)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth/).*)'],
}
