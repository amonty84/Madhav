// Server-only DB loader for the reconciliation banner + history page.
//
// The banner renders inside the observatory route layout (a server component)
// and needs DB-side data without an in-process HTTP round-trip. The history
// page also reuses this loader to render its initial table snapshot before
// any client-side filter mutates the URL params.

import 'server-only'

import { query } from '@/lib/db/client'
import type {
  ReconciliationHistoryRow,
  ReconciliationStatus,
} from '@/lib/observatory/reconciliation/types'

interface RawHistoryRow {
  reconciliation_id: string
  provider: string
  reconciliation_date: string
  status: string
  variance_pct: number | null
  computed_total_usd: number
  authoritative_total_usd: number | null
  reconciled_at: string
  notes: string | null
}

const PERIOD_END_REGEX = /period=(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})/

function parsePeriodEnd(row: RawHistoryRow): string {
  if (row.notes) {
    const m = row.notes.match(PERIOD_END_REGEX)
    if (m) return m[2]
  }
  return row.reconciliation_date
}

function shapeRow(r: RawHistoryRow): ReconciliationHistoryRow {
  return {
    reconciliation_id: r.reconciliation_id,
    provider: r.provider,
    period_start: r.reconciliation_date,
    period_end: parsePeriodEnd(r),
    status: r.status,
    variance_pct: r.variance_pct != null ? Number(r.variance_pct) : null,
    computed_cost_usd: Number(r.computed_total_usd),
    authoritative_cost_usd:
      r.authoritative_total_usd != null
        ? Number(r.authoritative_total_usd)
        : null,
    created_at: r.reconciled_at,
  }
}

const SELECT_COLUMNS = `
  reconciliation_id,
  provider,
  reconciliation_date::text   AS reconciliation_date,
  status,
  variance_pct,
  computed_total_usd,
  authoritative_total_usd,
  reconciled_at,
  notes
`

/** Most recent reconciliation row per provider (one row per provider that
 *  has any history). Ordered by created_at DESC across providers. Used by
 *  ReconciliationBanner to render a chip per provider. */
export async function loadLatestReconciliationPerProvider(): Promise<
  ReconciliationHistoryRow[]
> {
  const sql = `
    SELECT DISTINCT ON (provider) ${SELECT_COLUMNS}
    FROM llm_cost_reconciliation
    ORDER BY provider, reconciliation_date DESC, reconciled_at DESC
  `
  try {
    const { rows } = await query<RawHistoryRow>(sql)
    const shaped = rows.map(shapeRow)
    shaped.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    return shaped
  } catch (err) {
    console.error(
      '[observatory/reconciliation/loader] loadLatestReconciliationPerProvider failed',
      err,
    )
    return []
  }
}

/** Paginated history rows for the history page. */
export async function loadReconciliationHistory(opts: {
  provider?: string
  limit?: number
  offset?: number
} = {}): Promise<{ rows: ReconciliationHistoryRow[]; total: number }> {
  const params: unknown[] = []
  let where = ''
  if (opts.provider) {
    params.push(opts.provider)
    where = ' WHERE provider = $1'
  }
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200)
  const offset = Math.max(opts.offset ?? 0, 0)
  try {
    const countSql = `SELECT COUNT(*)::text AS n FROM llm_cost_reconciliation${where}`
    const countResult = await query<{ n: string }>(countSql, params)
    const total = Number(countResult.rows[0]?.n ?? 0)

    const limitIdx = params.length + 1
    const offsetIdx = params.length + 2
    const pageSql = `
      SELECT ${SELECT_COLUMNS}
      FROM llm_cost_reconciliation${where}
      ORDER BY reconciliation_date DESC, reconciled_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `
    const { rows } = await query<RawHistoryRow>(pageSql, [
      ...params,
      limit,
      offset,
    ])
    return { rows: rows.map(shapeRow), total }
  } catch (err) {
    console.error(
      '[observatory/reconciliation/loader] loadReconciliationHistory failed',
      err,
    )
    return { rows: [], total: 0 }
  }
}

export const RECONCILIATION_STATUS_VALUES: readonly ReconciliationStatus[] = [
  'matched',
  'variance_within_tolerance',
  'variance_alert',
  'missing_authoritative',
  'error',
] as const
