import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { adminAuth } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateUsername } from '@/lib/auth/username'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface CreateBody {
  full_name?: string
  email?: string
  username?: string
  role?: 'super_admin' | 'client'
}

export async function GET() {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const service = createServiceClient()
  const { data, error } = await service
    .from('profiles')
    .select('id, role, status, name, username, email, created_at, approved_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data ?? [] })
}

export async function POST(request: Request) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  let body: CreateBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  const fullName = (body.full_name ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  const username = (body.username ?? '').trim().toLowerCase()
  const role = body.role === 'super_admin' ? 'super_admin' : 'client'

  if (!fullName || fullName.length > 100) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  const usernameError = validateUsername(username)
  if (usernameError) return NextResponse.json({ error: usernameError }, { status: 400 })

  const service = createServiceClient()

  const { data: dup } = await service
    .from('profiles')
    .select('id')
    .or(`email.ilike.${email},username.ilike.${username}`)
    .maybeSingle()
  if (dup) {
    return NextResponse.json(
      { error: 'A user with that email or username already exists.' },
      { status: 409 },
    )
  }

  let firebaseUser: Awaited<ReturnType<typeof adminAuth.createUser>>
  try {
    firebaseUser = await adminAuth.createUser({
      email,
      emailVerified: false,
      displayName: fullName,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not create user account.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const uid = firebaseUser.uid
  const { error: insertError } = await service.from('profiles').insert({
    id: uid,
    role,
    status: 'active',
    name: fullName,
    username,
    email,
    approved_at: new Date().toISOString(),
    approved_by: auth.user.uid,
  })
  if (insertError) {
    await adminAuth.deleteUser(uid).catch(() => {})
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  const resetLink = await adminAuth.generatePasswordResetLink(email).catch(() => null)
  return NextResponse.json({ ok: true, user_id: uid, reset_link: resetLink })
}
