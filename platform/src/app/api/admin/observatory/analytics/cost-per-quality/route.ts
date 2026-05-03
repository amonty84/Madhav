// GET /api/admin/observatory/analytics/cost-per-quality
//
// Per-pipeline-stage cost analytics for the super-admin observatory.
// Quality dimension is a stub (`quality_probe_wired: false`) until the
// audit-stage probe spec lands. See cost_per_quality.ts for details.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import { getPool } from '@/lib/db/client'
import { queryCostPerQuality } from '@/lib/observatory/analytics/cost_per_quality'

function isValidIsoTimestamp(v: string): boolean {
  return Number.isFinite(Date.parse(v))
}

/** BigInt safe-stringify so JSON.stringify won't throw on the token totals. */
function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value
}

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const dateStart = url.searchParams.get('date_start')
  const dateEnd = url.searchParams.get('date_end')
  const provider = url.searchParams.get('provider') ?? undefined

  if (!dateStart) return res.badRequest('Missing required parameter: date_start')
  if (!dateEnd) return res.badRequest('Missing required parameter: date_end')
  if (!isValidIsoTimestamp(dateStart)) {
    return res.badRequest(`Invalid ISO timestamp for date_start: ${dateStart}`)
  }
  if (!isValidIsoTimestamp(dateEnd)) {
    return res.badRequest(`Invalid ISO timestamp for date_end: ${dateEnd}`)
  }
  if (Date.parse(dateEnd) <= Date.parse(dateStart)) {
    return res.badRequest('`date_end` must be strictly after `date_start`')
  }

  const pool = await getPool()
  const client = await pool.connect()
  try {
    const data = await queryCostPerQuality(client, {
      date_start: dateStart,
      date_end: dateEnd,
      provider,
    })
    // Hand-serialize so bigint token totals survive JSON.
    return new NextResponse(JSON.stringify(data, jsonReplacer), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    console.error('[admin/observatory/analytics/cost-per-quality] failed', err)
    return res.internal('Failed to compute cost-per-quality analytics.')
  } finally {
    client.release()
  }
}
