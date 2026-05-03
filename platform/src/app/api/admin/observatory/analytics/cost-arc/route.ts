// GET /api/admin/observatory/analytics/cost-arc
//
// Lists the top conversations by total cost within a date range.
// Query params:
//   date_start  (required, ISO timestamp)
//   date_end    (required, ISO timestamp; must be strictly after date_start)
//   limit       (optional, default 50, max 200)
//
// Phase O — O.4 — USTAD_S4_3_COST_ARC.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import {
  queryTopConversations,
  getDefaultQuery,
  TOP_CONVERSATIONS_DEFAULT_LIMIT,
  TOP_CONVERSATIONS_MAX_LIMIT,
} from '@/lib/observatory/analytics/cost_arc'

function parseLimit(raw: string | null): number | null {
  if (raw == null) return TOP_CONVERSATIONS_DEFAULT_LIMIT
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1) return null
  return Math.min(n, TOP_CONVERSATIONS_MAX_LIMIT)
}

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const dateStart = url.searchParams.get('date_start')
  const dateEnd = url.searchParams.get('date_end')
  if (!dateStart || !dateEnd) {
    return res.badRequest('date_start and date_end are required.')
  }
  const startMs = Date.parse(dateStart)
  const endMs = Date.parse(dateEnd)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return res.badRequest('date_start and date_end must be valid ISO timestamps.')
  }
  if (endMs <= startMs) {
    return res.badRequest('date_end must be strictly after date_start.')
  }
  const limit = parseLimit(url.searchParams.get('limit'))
  if (limit == null) {
    return res.badRequest('limit must be a positive integer.')
  }

  try {
    const conversations = await queryTopConversations(getDefaultQuery(), {
      date_start: dateStart,
      date_end: dateEnd,
      limit,
    })
    return NextResponse.json({
      conversations,
      date_start: dateStart,
      date_end: dateEnd,
    })
  } catch (err) {
    console.error('[admin/observatory/analytics/cost-arc] GET failed', err)
    return res.internal('Failed to load conversation cost arc.')
  }
}
