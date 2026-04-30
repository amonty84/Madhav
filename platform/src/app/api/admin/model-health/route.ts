/**
 * BHISMA-B1 §3.5 — /api/admin/model-health
 *
 * GET  (no params)         → returns current in-memory health statuses
 * GET  ?refresh=true       → re-pings all FAMILY_WORKER models, then returns
 *
 * This endpoint is unauthenticated for simplicity — internal admin use only;
 * no sensitive data is exposed (model IDs + pass/fail + error strings).
 */
import { NextResponse } from 'next/server'
import { runHealthChecks, getAllHealthStatuses } from '@/lib/models/health'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const refresh = searchParams.get('refresh') === 'true'

  if (refresh) {
    const results = await runHealthChecks()
    return NextResponse.json({
      checked_at: new Date().toISOString(),
      results,
    })
  }

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    results: getAllHealthStatuses(),
  })
}
