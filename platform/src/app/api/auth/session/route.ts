import { NextResponse } from 'next/server'
import { createSessionCookie, adminAuth } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'

const SESSION_DURATION_MS = 60 * 60 * 24 * 14 * 1000 // 14 days

export async function POST(request: Request) {
  let idToken: string | undefined
  try {
    const body = await request.json()
    idToken = body?.idToken
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }
  if (!idToken) return NextResponse.json({ error: 'idToken required' }, { status: 400 })

  try {
    const decoded = await adminAuth.verifyIdToken(idToken)

    // Ensure a Supabase profile row exists for this Firebase UID. The layout
    // authorization checks (e.g. clients/[id]/layout.tsx) require it; without
    // this row, every chart navigation silently redirects to /dashboard.
    const service = createServiceClient()
    const role =
      decoded.email && decoded.email === process.env.ASTROLOGER_EMAIL
        ? 'astrologer'
        : 'client'
    const { error: profileError } = await service
      .from('profiles')
      .upsert({ id: decoded.uid, role, name: decoded.name ?? null }, { onConflict: 'id' })
    if (profileError) {
      console.error('[session] profile upsert failed', profileError)
      return NextResponse.json({ error: 'profile sync failed' }, { status: 500 })
    }

    const sessionCookie = await createSessionCookie(idToken, SESSION_DURATION_MS)
    const response = NextResponse.json({ ok: true })
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('__session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
