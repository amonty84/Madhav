// POST /api/admin/observatory/analytics/replay
//
// Phase O — O.4 Advanced Analytics — replay & re-cost engine.
// Authored by USTAD_S4_5_REPLAY_RECOST.
//
// Read-only endpoint: every code path delegates to `replayAndRecost()`,
// which never mutates llm_usage_events. The route enforces:
//   - super-admin gate via `guardObservatoryRoute()`
//   - `date_start`/`date_end` are valid `YYYY-MM-DD` and start ≤ end
//   - the date range is at most 90 days
//   - `limit` is capped at 50_000

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import {
  REPLAY_HARD_CAP_LIMIT,
  replayAndRecost,
  type ReplayParams,
} from '@/lib/observatory/analytics/replay'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MAX_RANGE_DAYS = 90

interface ReplayPostBody {
  date_start?: unknown
  date_end?: unknown
  target_pricing_version_id?: unknown
  provider?: unknown
  model?: unknown
  limit?: unknown
}

function parseBody(body: ReplayPostBody): ReplayParams | string {
  if (typeof body.date_start !== 'string' || !DATE_REGEX.test(body.date_start)) {
    return 'date_start must be an ISO date `YYYY-MM-DD`'
  }
  if (typeof body.date_end !== 'string' || !DATE_REGEX.test(body.date_end)) {
    return 'date_end must be an ISO date `YYYY-MM-DD`'
  }
  if (body.date_end < body.date_start) {
    return 'date_end must be on or after date_start'
  }

  // Range ≤ 90 days. Compute UTC-midnight diff to avoid TZ drift.
  const startMs = Date.parse(`${body.date_start}T00:00:00Z`)
  const endMs = Date.parse(`${body.date_end}T00:00:00Z`)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return 'date_start/date_end could not be parsed as dates'
  }
  const diffDays = Math.round((endMs - startMs) / 86_400_000)
  if (diffDays > MAX_RANGE_DAYS) {
    return `date range must be ≤ ${MAX_RANGE_DAYS} days (got ${diffDays})`
  }

  const out: ReplayParams = {
    date_start: body.date_start,
    date_end: body.date_end,
  }

  if (body.target_pricing_version_id !== undefined) {
    if (
      typeof body.target_pricing_version_id !== 'string' ||
      body.target_pricing_version_id.length === 0
    ) {
      return 'target_pricing_version_id must be a non-empty string'
    }
    out.target_pricing_version_id = body.target_pricing_version_id
  }
  if (body.provider !== undefined) {
    if (typeof body.provider !== 'string') {
      return 'provider must be a string'
    }
    out.provider = body.provider
  }
  if (body.model !== undefined) {
    if (typeof body.model !== 'string') {
      return 'model must be a string'
    }
    out.model = body.model
  }
  if (body.limit !== undefined) {
    if (typeof body.limit !== 'number' || !Number.isFinite(body.limit)) {
      return 'limit must be a finite number'
    }
    const lim = Math.floor(body.limit)
    if (lim <= 0) return 'limit must be > 0'
    if (lim > REPLAY_HARD_CAP_LIMIT) {
      return `limit must be ≤ ${REPLAY_HARD_CAP_LIMIT}`
    }
    out.limit = lim
  }
  return out
}

export async function POST(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let raw: ReplayPostBody
  try {
    raw = (await request.json()) as ReplayPostBody
  } catch {
    return res.badRequest('Request body must be valid JSON')
  }

  const parsed = parseBody(raw)
  if (typeof parsed === 'string') return res.badRequest(parsed)

  try {
    const result = await replayAndRecost(parsed)
    return NextResponse.json(result)
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes('not found') || err.message.includes('exceeds hard cap'))
    ) {
      return res.badRequest(err.message)
    }
    console.error('[admin/observatory/analytics/replay] failed', err)
    return res.internal('Failed to compute replay.')
  }
}
