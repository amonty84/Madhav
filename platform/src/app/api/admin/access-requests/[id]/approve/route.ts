import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { adminAuth } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
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

  const service = createServiceClient()

  // 1. Load the request row.
  const { data: req } = await service
    .from('access_requests')
    .select('id, full_name, email, status')
    .eq('id', id)
    .single<RequestRow>()
  if (!req) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request is not pending.' }, { status: 409 })
  }

  // 2. Username uniqueness pre-check (the unique index will enforce too).
  const { data: dupUsername } = await service
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .maybeSingle()
  if (dupUsername) {
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
  const { error: insertError } = await service.from('profiles').insert({
    id: uid,
    role,
    status: 'active',
    name: req.full_name,
    username,
    email: req.email,
    approved_at: new Date().toISOString(),
    approved_by: auth.user.uid,
  })
  if (insertError) {
    await adminAuth.deleteUser(uid).catch(() => {})
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // 5. Mark the request approved.
  const { error: updateError } = await service
    .from('access_requests')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user.uid,
      approved_user_id: uid,
    })
    .eq('id', id)
  if (updateError) console.error('[approve] could not mark request approved', updateError)

  // 6. Generate a password-reset link. The link itself is returned to the
  // admin UI for copy-paste OR to be sent via SMTP (out of scope for v1).
  const resetLink = await adminAuth
    .generatePasswordResetLink(req.email)
    .catch(() => null)

  return NextResponse.json({ ok: true, user_id: uid, reset_link: resetLink })
}
