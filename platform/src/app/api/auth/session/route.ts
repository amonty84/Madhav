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

  let decoded
  try {
    decoded = await adminAuth.verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }

  // Sync / look up the Supabase profile row for this Firebase UID. The role +
  // status columns gate sign-in: a row with status != 'active' is refused.
  const service = createServiceClient()
  const { data: existing } = await service
    .from('profiles')
    .select('id, role, status')
    .eq('id', decoded.uid)
    .single<{ id: string; role: 'super_admin' | 'client'; status: 'pending' | 'active' | 'disabled' }>()

  if (existing) {
    if (existing.status !== 'active') {
      return NextResponse.json({ error: 'account_inactive' }, { status: 403 })
    }
  } else {
    // First sign-in via this Firebase UID — create the profile row. The seed
    // super-admin is provisioned via migration; everyone else lands as a
    // status='active' client unless created via the admin module.
    const role =
      decoded.email && decoded.email === process.env.SUPER_ADMIN_EMAIL
        ? 'super_admin'
        : 'client'
    const { error: insertError } = await service.from('profiles').insert({
      id: decoded.uid,
      role,
      status: 'active',
      name: decoded.name ?? null,
      email: decoded.email ?? null,
    })
    if (insertError) {
      console.error('[session] profile insert failed', insertError)
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
