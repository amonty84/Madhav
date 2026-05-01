import { NextResponse } from 'next/server'
import { createSessionCookie, adminAuth } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'

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

  let decoded
  try {
    decoded = await adminAuth.verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }

  const { rows: existing } = await query<{ id: string; role: 'super_admin' | 'client'; status: 'pending' | 'active' | 'disabled' }>(
    'SELECT id, role, status FROM profiles WHERE id=$1',
    [decoded.uid]
  )
  const profile = existing[0] ?? null

  if (profile) {
    if (profile.status !== 'active') {
      return NextResponse.json({ error: 'account_inactive' }, { status: 403 })
    }
  } else {
    const role =
      decoded.email && decoded.email === process.env.SUPER_ADMIN_EMAIL
        ? 'super_admin'
        : 'client'
    try {
      await query(
        'INSERT INTO profiles (id, role, status, name, email) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
        [decoded.uid, role, 'active', decoded.name ?? null, decoded.email ?? null]
      )
    } catch (insertErr) {
      console.error('[session] profile insert failed', insertErr)
      return NextResponse.json({ error: 'profile sync failed' }, { status: 500 })
    }
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
