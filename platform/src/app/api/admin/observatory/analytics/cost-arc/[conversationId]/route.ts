// GET /api/admin/observatory/analytics/cost-arc/[conversationId]
//
// Returns the full per-event cost arc for one conversation. 404 when the
// id has no events.
//
// Phase O — O.4 — USTAD_S4_3_COST_ARC.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../../_guard'
import {
  queryConversationArc,
  getDefaultQuery,
} from '@/lib/observatory/analytics/cost_arc'

export async function GET(
  _request: Request,
  context: { params: Promise<{ conversationId: string }> },
) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const { conversationId } = await context.params
  if (!conversationId) {
    return res.badRequest('conversationId is required.')
  }

  try {
    const arc = await queryConversationArc(getDefaultQuery(), conversationId)
    if (!arc) {
      return res.notFound(`No events for conversation_id ${conversationId}.`)
    }
    return NextResponse.json(arc)
  } catch (err) {
    console.error(
      '[admin/observatory/analytics/cost-arc/[conversationId]] GET failed',
      err,
    )
    return res.internal('Failed to load conversation cost arc.')
  }
}
