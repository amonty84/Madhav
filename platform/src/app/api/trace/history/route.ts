/**
 * MARSYS-JIS Query Trace Panel — historical query list
 *
 * GET /api/trace/history?limit=50
 *   Default mode — returns recent queries with aggregate step stats for
 *   the History tab list view.
 *
 * GET /api/trace/history?limit=50&mode=analytics
 *   Analytics mode (BHISMA-B3) — extends each row with per-stage latencies,
 *   query_class, citation_count, tools_used, error flag. Powers the History
 *   analytics sub-tab (donut, latency line, tool frequency, error rate).
 *
 * Auth: super_admin only.
 */

import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { fetchTraceHistory, fetchTraceHistoryAnalytics } from '@/lib/trace/writer'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '50', 10)))
  const mode = url.searchParams.get('mode') === 'analytics' ? 'analytics' : 'list'

  try {
    const history = mode === 'analytics'
      ? await fetchTraceHistoryAnalytics(limit)
      : await fetchTraceHistory(limit)
    return NextResponse.json(history)
  } catch (err) {
    console.error('[api/trace/history] GET failed', err)
    return NextResponse.json({ error: 'Failed to load trace history.' }, { status: 500 })
  }
}
