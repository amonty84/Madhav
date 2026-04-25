import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  deleteConversation,
  getConversation,
  loadConversationMessages,
  updateConversationTitle,
} from '@/lib/conversations'

async function resolveAccess(userId: string) {
  const service = createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', userId).single()
  return profile?.role === 'super_admin'
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const messages = await loadConversationMessages(id)
  return NextResponse.json({ conversation: conv, messages })
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  let body: { title?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  if (typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }
  const title = body.title.trim().slice(0, 120)
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  await updateConversationTitle(id, title)
  return NextResponse.json({ ok: true, title })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  await deleteConversation(id)
  return NextResponse.json({ ok: true })
}
