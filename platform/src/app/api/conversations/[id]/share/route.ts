import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getConversation } from '@/lib/conversations'

async function resolveAccess(userId: string) {
  const service = createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', userId).single()
  return profile?.role === 'astrologer'
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

  const isAstrologer = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isAstrologer })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const service = createServiceClient()
  const { data } = await service
    .from('conversation_shares')
    .select('slug, created_at, expires_at, revoked_at')
    .eq('conversation_id', id)
    .is('revoked_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ share: data })
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isAstrologer = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isAstrologer })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const service = createServiceClient()

  // Reuse the active share if one exists — idempotent from the user's POV.
  const { data: existing } = await service
    .from('conversation_shares')
    .select('slug')
    .eq('conversation_id', id)
    .is('revoked_at', null)
    .limit(1)
    .maybeSingle()
  if (existing) return NextResponse.json({ slug: existing.slug })

  const slug = generateSlug()
  const { error } = await service.from('conversation_shares').insert({
    conversation_id: id,
    slug,
    created_by: user.uid,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ slug })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isAstrologer = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isAstrologer })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const service = createServiceClient()
  await service
    .from('conversation_shares')
    .update({ revoked_at: new Date().toISOString() })
    .eq('conversation_id', id)
    .is('revoked_at', null)

  return NextResponse.json({ ok: true })
}
