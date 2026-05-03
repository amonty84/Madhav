// Phase O — O.3 Export — query layer.
//
// Accepts an injectable `queryFn` defaulting to the global `query` helper so
// the route handler talks to the real pool while tests pass in a mock. The
// SQL filters by `started_at` (the call's start time, not the row insertion
// time) so date filters line up with the dashboard's date pickers.

import 'server-only'
import { query } from '../../db/client'
import {
  EXPORT_COLUMNS,
  EXPORT_MAX_LIMIT,
  type ExportParams,
  type ExportRow,
} from './types'

interface QueryFn {
  <R = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: R[] }>
}

const SELECT_COLUMNS = EXPORT_COLUMNS.join(', ')

export async function queryUsageForExport(
  params: ExportParams,
  queryFn: QueryFn = query as QueryFn,
): Promise<ExportRow[]> {
  const where: string[] = [
    'started_at >= $1::date',
    "started_at <  ($2::date + INTERVAL '1 day')",
  ]
  const args: unknown[] = [params.date_start, params.date_end]

  if (params.provider) {
    args.push(params.provider)
    where.push(`provider = $${args.length}`)
  }
  if (params.pipeline_stage) {
    args.push(params.pipeline_stage)
    where.push(`pipeline_stage = $${args.length}`)
  }

  const requested = params.limit ?? 0
  const cap = requested > 0 && requested < EXPORT_MAX_LIMIT
    ? requested
    : EXPORT_MAX_LIMIT
  args.push(cap)

  const sql =
    `SELECT ${SELECT_COLUMNS}` +
    ' FROM llm_usage_events' +
    ` WHERE ${where.join(' AND ')}` +
    ' ORDER BY started_at DESC' +
    ` LIMIT $${args.length}`

  const { rows } = await queryFn<ExportRow>(sql, args)
  return rows
}
