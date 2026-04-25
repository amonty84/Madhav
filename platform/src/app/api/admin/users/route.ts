import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { adminAuth } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
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

  try {
    const { rows } = await query<{
      id: string
      role: string
      status: string
      name: string | null
      username: string | null
      email: string | null
      created_at: string
      approved_at: string | null
    }>(
      'SELECT id, role, status, name, username, email, created_at, approved_at FROM profiles ORDER BY created_at DESC'
    )
    return NextResponse.json({ users: rows })
  } catch (err) {
    console.error('[admin/users] GET failed', err)
    return NextResponse.json({ error: 'Failed to load users.' }, { status: 500 })
  }
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

  // Duplicate email/username check
  const { rows: dupRows } = await query<{ id: string }>(
    'SELECT id FROM profiles WHERE lower(email)=lower($1) OR lower(username)=lower($2) LIMIT 1',
    [email, username]
  )
  if (dupRows.length > 0) {
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
  try {
    const { rows: inserted } = await query(
      'INSERT INTO profiles (id, role, status, name, username, email, approved_at, approved_by) VALUES ($1,$2,$3,$4,$5,$6,now(),$7) RETURNING *',
      [uid, role, 'active', fullName, username, email, auth.user.uid]
    )
    const resetLink = await adminAuth.generatePasswordResetLink(email).catch(() => null)
    return NextResponse.json({ ok: true, user_id: uid, reset_link: resetLink, user: inserted[0] })
  } catch (err) {
    await adminAuth.deleteUser(uid).catch(() => {})
    const message = err instanceof Error ? err.message : 'Could not create profile.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
