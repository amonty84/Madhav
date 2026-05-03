// GET /api/admin/observatory/analytics/cache
//
// Phase O.4 — Cache effectiveness analytics endpoint (USTAD_S4_1).
// Super-admin only; gated by the same `guardObservatoryRoute` used by every
// other Observatory endpoint (feature flag + super-admin role).

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import { getPool } from '@/lib/db/client'
import {
  queryCacheEffectiveness,
  toJson,
} from '@/lib/observatory/analytics/cache_effectiveness'

function parseTimestamp(value: string | null, name: string): string {
  if (!value) {
    throw new Error(`Missing required parameter: ${name}`)
  }
  const ms = Date.parse(value)
  if (!Number.isFinite(ms)) {
    throw new Error(`Invalid ISO timestamp for ${name}: ${value}`)
  }
  return value
}

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let date_start: string
  let date_end: string
  let provider: string | undefined
  try {
    const sp = new URL(request.url).searchParams
    date_start = parseTimestamp(sp.get('date_start'), 'date_start')
    date_end = parseTimestamp(sp.get('date_end'), 'date_end')
    if (Date.parse(date_end) <= Date.parse(date_start)) {
      throw new Error('`date_end` must be strictly after `date_start`')
    }
    provider = sp.get('provider') ?? undefined
  } catch (err) {
    return res.badRequest(err instanceof Error ? err.message : 'Bad request')
  }

  try {
    const pool = await getPool()
    const result = await queryCacheEffectiveness(pool, {
      date_start,
      date_end,
      provider,
    })
    return NextResponse.json(toJson(result))
  } catch (err) {
    console.error('[admin/observatory/analytics/cache] failed', err)
    return res.internal('Failed to compute cache effectiveness.')
  }
}
