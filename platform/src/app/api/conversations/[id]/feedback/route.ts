import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { getConversation } from '@/lib/conversations'
import { res } from '@/lib/errors'

async function resolveAccess(userId: string) {
  const result = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [userId]
  )
  return result.rows[0]?.role === 'super_admin'
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return res.unauthenticated()

  try {
    const isSuperAdmin = await resolveAccess(user.uid)
    const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
    if (!conv) return res.notFound('conversation')

    const { rows } = await query<{ message_id: string; rating: number; comment: string | null }>(
      'SELECT message_id, rating, comment FROM message_feedback WHERE conversation_id=$1 AND user_id=$2',
      [id, user.uid]
    )

    return Response.json({ feedback: rows })
  } catch {
    return res.dbError()
  }
}

interface FeedbackBody {
  messageId?: string
  rating?: 1 | -1 | null
  comment?: string | null
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getServerUser()
  if (!user) return res.unauthenticated()

  let body: FeedbackBody
  try {
    body = await req.json()
  } catch {
    return res.badRequest('invalid body')
  }

  const { messageId, rating } = body
  if (!messageId || typeof messageId !== 'string') {
    return res.badRequest('messageId required')
  }
  if (rating !== null && rating !== 1 && rating !== -1) {
    return res.badRequest('rating must be 1, -1, or null')
  }

  try {
    const isSuperAdmin = await resolveAccess(user.uid)
    const conv = await getConversation({ id, userId: user.uid, isSuperAdmin })
    if (!conv) return res.notFound('conversation')

    if (rating === null) {
      await query(
        'DELETE FROM message_feedback WHERE message_id=$1 AND user_id=$2',
        [messageId, user.uid]
      )
      return Response.json({ ok: true, rating: null })
    }

    const comment =
      typeof body.comment === 'string' ? body.comment.trim().slice(0, 2000) || null : null

    await query(
      'INSERT INTO message_feedback (conversation_id, message_id, user_id, rating, comment) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (message_id, user_id) DO UPDATE SET rating=$4, comment=$5',
      [id, messageId, user.uid, rating, comment]
    )

    return Response.json({ ok: true, rating })
  } catch {
    return res.dbError()
  }
}
