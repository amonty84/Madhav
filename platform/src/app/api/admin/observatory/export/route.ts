// GET /api/admin/observatory/export
//
// Phase O — O.3 Export — usage-event export endpoint. Authored by
// USTAD_S3_4_EXPORT_O3_CLOSE. Gated through the shared observatory guard
// (OBSERVATORY_ENABLED feature flag + super-admin role check). Output is
// either CSV with `Content-Disposition: attachment` or JSON with an
// `export_meta` wrapper. The route enforces a 90-day window cap and a
// 50 000-row limit cap before touching the DB.

import { NextResponse } from 'next/server'
import { guardObservatoryRoute } from '../_guard'
import { queryUsageForExport } from '@/lib/observatory/export/query'
import { toCSV, toJSON } from '@/lib/observatory/export/format'
import {
  EXPORT_LARGE_THRESHOLD,
  EXPORT_MAX_LIMIT,
  EXPORT_MAX_RANGE_DAYS,
  type ExportFormat,
  type ExportMeta,
  type ExportParams,
} from '@/lib/observatory/export/types'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MS_PER_DAY = 24 * 60 * 60 * 1000

function badRequest(error: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status: 400 })
}

function parseDateOnly(value: string): number | null {
  if (!DATE_PATTERN.test(value)) return null
  const ms = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(ms) ? ms : null
}

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const sp = new URL(request.url).searchParams

  const format = sp.get('format')
  if (format !== 'csv' && format !== 'json') {
    return badRequest('invalid_format', {
      received: format,
      allowed: ['csv', 'json'],
    })
  }

  const dateStartRaw = sp.get('date_start')
  const dateEndRaw = sp.get('date_end')
  if (!dateStartRaw || !dateEndRaw) {
    return badRequest('missing_date_range', {
      missing: [
        ...(dateStartRaw ? [] : ['date_start']),
        ...(dateEndRaw ? [] : ['date_end']),
      ],
    })
  }
  const startMs = parseDateOnly(dateStartRaw)
  const endMs = parseDateOnly(dateEndRaw)
  if (startMs === null || endMs === null) {
    return badRequest('invalid_date_format', { format: 'YYYY-MM-DD' })
  }
  if (endMs < startMs) {
    return badRequest('end_before_start')
  }
  const rangeDays = Math.floor((endMs - startMs) / MS_PER_DAY) + 1
  if (rangeDays > EXPORT_MAX_RANGE_DAYS) {
    return badRequest('range_too_wide', {
      max_days: EXPORT_MAX_RANGE_DAYS,
      requested_days: rangeDays,
    })
  }

  let limit: number | undefined
  const limitRaw = sp.get('limit')
  if (limitRaw !== null) {
    const parsed = Number(limitRaw)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return badRequest('invalid_limit', { received: limitRaw })
    }
    limit = Math.min(Math.floor(parsed), EXPORT_MAX_LIMIT)
  }

  const provider = sp.get('provider') ?? undefined
  const pipelineStage = sp.get('pipeline_stage') ?? undefined

  const params: ExportParams = {
    format: format as ExportFormat,
    date_start: dateStartRaw,
    date_end: dateEndRaw,
    limit,
    provider,
    pipeline_stage: pipelineStage,
  }

  let rows
  try {
    rows = await queryUsageForExport(params)
  } catch (err) {
    console.error('[admin/observatory/export] query failed', err)
    return NextResponse.json(
      { error: 'export_query_failed' },
      { status: 500 },
    )
  }

  const meta: ExportMeta = {
    row_count: rows.length,
    date_start: params.date_start,
    date_end: params.date_end,
    generated_at: new Date().toISOString(),
    format: params.format,
    provider: params.provider ?? null,
    pipeline_stage: params.pipeline_stage ?? null,
  }

  const headers: Record<string, string> = {}
  if (rows.length > EXPORT_LARGE_THRESHOLD) {
    headers['X-Export-Row-Count'] = String(rows.length)
  }

  if (params.format === 'csv') {
    const filename =
      `observatory-export-${params.date_start}-${params.date_end}.csv`
    return new NextResponse(toCSV(rows), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  }

  return new NextResponse(toJSON(rows, meta), {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
