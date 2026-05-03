// POST /api/admin/observatory/analytics/anomaly/run
//
// Phase O — O.4 Analytics — explicit anomaly-detection trigger.
// Authored by USTAD_S4_6. Same behaviour as GET but exposed as POST so
// nightly schedulers / native scripts can invoke it without semantic
// confusion about side-effects on a read endpoint.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../../_guard'
import {
  detectAnomalies,
  type AnomalyConfig,
} from '@/lib/observatory/analytics/anomaly'

interface AnomalyPostBody {
  lookback_days?: unknown
  z_threshold?: unknown
  min_data_points?: unknown
}

function parseBody(body: AnomalyPostBody): Partial<AnomalyConfig> {
  const out: Partial<AnomalyConfig> = {}
  if (typeof body.lookback_days === 'number' && Number.isFinite(body.lookback_days) && body.lookback_days > 0) {
    out.lookback_days = Math.floor(body.lookback_days)
  }
  if (typeof body.z_threshold === 'number' && Number.isFinite(body.z_threshold) && body.z_threshold > 0) {
    out.z_threshold = body.z_threshold
  }
  if (typeof body.min_data_points === 'number' && Number.isFinite(body.min_data_points) && body.min_data_points > 0) {
    out.min_data_points = Math.floor(body.min_data_points)
  }
  return out
}

export async function POST(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let raw: AnomalyPostBody = {}
  try {
    const text = await request.text()
    if (text.length > 0) raw = JSON.parse(text) as AnomalyPostBody
  } catch {
    return res.badRequest('Request body must be valid JSON or empty')
  }

  const config = parseBody(raw)

  try {
    const result = await detectAnomalies(config)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[admin/observatory/analytics/anomaly/run] POST failed', err)
    return res.internal('Failed to detect anomalies.')
  }
}
