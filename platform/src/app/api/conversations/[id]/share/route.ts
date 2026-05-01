import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { getConversation } from '@/lib/conversations'

async function resolveAccess(userId: string) {
  const result = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [userId]
  )
  return result.rows[0]?.role === 'super_admin'
}

// URL-safe 10-char slug (~58 bits of entropy — enough for public read-only links).
function generateSlug(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10))
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (const b of bytes) out += chars[b % chars.length]
  return out
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { rows } = await query<{
    slug: string
    created_at: string
    expires_at: string | null
    revoked_at: string | null
  }>(
    'SELECT slug, created_at, expires_at, revoked_at FROM conversation_shares WHERE conversation_id=$1 AND revoked_at IS NULL ORDER BY created_at DESC LIMIT 1',
    [id]
  )

  return NextResponse.json({ share: rows[0] ?? null })
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Reuse the active share if one exists — idempotent from the user's POV.
  const existing = await query<{ slug: string }>(
    'SELECT slug FROM conversation_shares WHERE conversation_id=$1 AND revoked_at IS NULL LIMIT 1',
    [id]
  )
  if (existing.rows[0]) return NextResponse.json({ slug: existing.rows[0].slug })

  const slug = generateSlug()
  try {
    await query(
      'INSERT INTO conversation_shares (conversation_id, slug, created_by) VALUES ($1,$2,$3) RETURNING *',
      [id, slug, user.uid]
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'database error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  return NextResponse.json({ slug })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  await query(
    'UPDATE conversation_shares SET revoked_at=now() WHERE conversation_id=$1 AND revoked_at IS NULL',
    [id]
  )

  return NextResponse.json({ ok: true })
}
