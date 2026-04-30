/**
 * MARSYS-JIS Query Trace Panel — historical query list
 *
 * GET /api/trace/history?limit=50
 *   Returns recent queries with aggregate step stats for the History tab.
 *
 * Auth: super_admin only.
 */

import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { fetchTraceHistory } from '@/lib/trace/writer'
import { res } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '50', 10)))

  try {
    const history = await fetchTraceHistory(limit)
    return NextResponse.json(history)
  } catch (err) {
    console.error('[api/trace/history] GET failed', err)
    return res.internal('Failed to load trace history.')
  }
}
