import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { adminAuth } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateUsername } from '@/lib/auth/username'

interface PatchBody {
  username?: string
  status?: 'active' | 'disabled'
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params
  if (id === auth.user.uid) {
    return NextResponse.json(
      { error: "You can't modify your own account from the admin panel." },
      { status: 400 },
    )
  }

  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}

  if (typeof body.username === 'string') {
    const username = body.username.trim().toLowerCase()
    const error = validateUsername(username)
    if (error) return NextResponse.json({ error }, { status: 400 })
    updates.username = username
  }

  if (body.status === 'active' || body.status === 'disabled') {
    updates.status = body.status
    try {
      await adminAuth.updateUser(id, { disabled: body.status === 'disabled' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Firebase update failed.'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  }

  const service = createServiceClient()
  const { error } = await service.from('profiles').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params
  if (id === auth.user.uid) {
    return NextResponse.json(
      { error: "You can't delete your own account." },
      { status: 400 },
    )
  }

  // Firebase delete first; if it fails, we leave the profile row alone.
  try {
    await adminAuth.deleteUser(id)
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    // user-not-found means Firebase already lost the row — proceed to clean up profile.
    if (code !== 'auth/user-not-found') {
      const message = err instanceof Error ? err.message : 'Firebase delete failed.'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  const service = createServiceClient()
  const { error } = await service.from('profiles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
