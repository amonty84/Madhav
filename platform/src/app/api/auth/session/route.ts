import { NextResponse } from 'next/server'
import { createSessionCookie, adminAuth } from '@/lib/firebase/server'

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
    await adminAuth.verifyIdToken(idToken)
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
