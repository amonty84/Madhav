import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getConversation } from '@/lib/conversations'

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

  const service = createServiceClient()
  const { data } = await service
    .from('message_feedback')
    .select('message_id, rating, comment')
    .eq('conversation_id', id)
    .eq('user_id', user.uid)

  return NextResponse.json({ feedback: data ?? [] })
}

interface FeedbackBody {
  messageId?: string
  rating?: 1 | -1 | null
  comment?: string | null
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const isSuperAdmin = await resolveAccess(user.uid)
  const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
  if (!conv) return NextResponse.json({ error: 'not found' }, { status: 404 })

  let body: FeedbackBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const { messageId, rating } = body
  if (!messageId || typeof messageId !== 'string') {
    return NextResponse.json({ error: 'messageId required' }, { status: 400 })
  }
  if (rating !== null && rating !== 1 && rating !== -1) {
    return NextResponse.json({ error: 'rating must be 1, -1, or null' }, { status: 400 })
  }

  const service = createServiceClient()

  if (rating === null) {
    await service
      .from('message_feedback')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', user.uid)
    return NextResponse.json({ ok: true, rating: null })
  }

  const comment =
    typeof body.comment === 'string' ? body.comment.trim().slice(0, 2000) || null : null

  const { error } = await service.from('message_feedback').upsert(
    {
      conversation_id: id,
      message_id: messageId,
      user_id: user.uid,
      rating,
      comment,
    },
    { onConflict: 'message_id,user_id' }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, rating })
}
