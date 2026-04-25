import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { adminAuth } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { validateUsername } from '@/lib/auth/username'

interface ApproveBody {
  username?: string
  role?: 'super_admin' | 'client'
}

interface RequestRow {
  id: string
  full_name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params
  let body: ApproveBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  const username = (body.username ?? '').trim().toLowerCase()
  const usernameError = validateUsername(username)
  if (usernameError) return NextResponse.json({ error: usernameError }, { status: 400 })

  const role = body.role === 'super_admin' ? 'super_admin' : 'client'

  // 1. Load the request row.
  const { rows: reqRows } = await query<RequestRow>(
    'SELECT id, full_name, email, status FROM access_requests WHERE id=$1',
    [id]
  )
  const req = reqRows[0] ?? null
  if (!req) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request is not pending.' }, { status: 409 })
  }

  // 2. Username uniqueness pre-check (the unique index will enforce too).
  const { rows: dupRows } = await query<{ id: string }>(
    'SELECT id FROM profiles WHERE lower(username)=lower($1) LIMIT 1',
    [username]
  )
  if (dupRows.length > 0) {
    return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 })
  }

  // 3. Create the Firebase user. Random password — they set their own via the reset link.
  let firebaseUser: Awaited<ReturnType<typeof adminAuth.createUser>>
  try {
    firebaseUser = await adminAuth.createUser({
      email: req.email,
      emailVerified: false,
      displayName: req.full_name,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not create user account.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // 4. Insert profile row. On conflict, roll back the Firebase user.
  const uid = firebaseUser.uid
  try {
    await query(
      'INSERT INTO profiles (id, role, status, name, username, email, approved_at, approved_by) VALUES ($1,\'client\',\'active\',$2,$3,$4,now(),$5) ON CONFLICT (id) DO NOTHING',
      [uid, req.full_name, username, req.email, auth.user.uid]
    )
    // Override role if super_admin was requested
    if (role === 'super_admin') {
      await query('UPDATE profiles SET role=$1 WHERE id=$2', ['super_admin', uid])
    }
  } catch (err) {
    await adminAuth.deleteUser(uid).catch(() => {})
    const message = err instanceof Error ? err.message : 'Could not create profile.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // 5. Mark the request approved.
  try {
    await query(
      'UPDATE access_requests SET status=\'approved\', reviewed_at=now(), reviewed_by=$1, approved_user_id=$2 WHERE id=$3',
      [auth.user.uid, uid, id]
    )
  } catch (err) {
    console.error('[approve] could not mark request approved', err)
  }

  // 6. Generate a password-reset link.
  const resetLink = await adminAuth
    .generatePasswordResetLink(req.email)
    .catch(() => null)

  return NextResponse.json({ ok: true, user_id: uid, reset_link: resetLink })
}
