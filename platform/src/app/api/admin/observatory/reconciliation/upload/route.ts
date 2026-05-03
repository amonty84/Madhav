// POST /api/admin/observatory/reconciliation/upload
//
// Phase O — O.2 Reconciliation — manual CSV upload reconciler for the two
// providers without an admin/billing API (DeepSeek + NIM managed-catalog).
//
// Authored by USTAD_S2_5_DEEPSEEKNNIM_CSV. The standard reconciliation
// endpoint (`POST /api/admin/observatory/reconciliation`) returns 400
// `manual_upload_required` for these two providers — this companion endpoint
// is where the super-admin uploads the CSV that those providers' billing
// portals export.
//
// Processing pipeline (matches BaseReconciler.reconcile() shape so the
// downstream UI + history endpoint don't need to special-case the manual
// providers):
//   1. Read multipart form-data: provider, period_start, period_end, file
//   2. Parse CSV via parseDeepSeekCsv / parseNimCsv (per provider)
//   3. Filter to period via sumDeepSeekCsv / sumNimCsv → authoritative cost
//   4. computePeriodCost(provider, period_start, period_end) → computed cost
//   5. INSERT raw rows into llm_provider_cost_reports (truncated to first
//      1000 rows when JSONified to keep raw_payload bounded)
//   6. classifyVariance(...) → status
//   7. INSERT/UPSERT into llm_cost_reconciliation
//   8. Return ProviderReconcileResult JSON
//
// Error envelopes (400):
//   { error: 'parse_error', message, columns_found, columns_expected }
//   { error: 'unsupported_provider', provider }
//   { error: 'invalid_input', message }    // for date / form-field problems
// 500 reserved for unexpected DB / runtime failures.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { query } from '@/lib/db/client'
import { guardObservatoryRoute } from '../../_guard'
import {
  CsvParseError,
} from '@/lib/observatory/reconciliation/csv_upload'
import {
  parseDeepSeekCsv,
  sumDeepSeekCsv,
} from '@/lib/observatory/reconciliation/deepseek_csv'
import {
  parseNimCsv,
  sumNimCsv,
} from '@/lib/observatory/reconciliation/nim_csv'
import {
  classifyVariance,
  computePeriodCost,
} from '@/lib/observatory/reconciliation/variance'
import {
  DEFAULT_RECONCILIATION_CONFIG,
  type ProviderReconcileResult,
} from '@/lib/observatory/reconciliation/types'

type UploadProvider = 'deepseek' | 'nim'

const UPLOAD_PROVIDERS: ReadonlySet<string> = new Set(['deepseek', 'nim'])
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const RAW_PAYLOAD_ROW_CAP = 1000

export async function POST(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json(
      { error: 'invalid_input', message: 'Request body must be multipart/form-data.' },
      { status: 400 },
    )
  }

  const providerRaw = form.get('provider')
  const periodStartRaw = form.get('period_start')
  const periodEndRaw = form.get('period_end')
  const file = form.get('file')

  if (typeof providerRaw !== 'string' || !UPLOAD_PROVIDERS.has(providerRaw)) {
    return NextResponse.json(
      { error: 'unsupported_provider', provider: typeof providerRaw === 'string' ? providerRaw : null },
      { status: 400 },
    )
  }
  const provider = providerRaw as UploadProvider

  if (typeof periodStartRaw !== 'string' || !DATE_REGEX.test(periodStartRaw)) {
    return NextResponse.json(
      { error: 'invalid_input', message: 'period_start must be an ISO date YYYY-MM-DD.' },
      { status: 400 },
    )
  }
  if (typeof periodEndRaw !== 'string' || !DATE_REGEX.test(periodEndRaw)) {
    return NextResponse.json(
      { error: 'invalid_input', message: 'period_end must be an ISO date YYYY-MM-DD.' },
      { status: 400 },
    )
  }
  if (periodEndRaw < periodStartRaw) {
    return NextResponse.json(
      { error: 'invalid_input', message: 'period_end must be on or after period_start.' },
      { status: 400 },
    )
  }
  const period_start = periodStartRaw
  const period_end = periodEndRaw

  if (!file || typeof file === 'string' || typeof (file as Blob).text !== 'function') {
    return NextResponse.json(
      { error: 'invalid_input', message: 'A "file" form field with a CSV upload is required.' },
      { status: 400 },
    )
  }

  let csvText: string
  try {
    csvText = await (file as Blob).text()
  } catch {
    return NextResponse.json(
      { error: 'invalid_input', message: 'Could not read uploaded file as text.' },
      { status: 400 },
    )
  }

  // 1+2+3. Parse and sum.
  let authoritative_cost_usd: number
  let parsedRows: unknown[]
  try {
    if (provider === 'deepseek') {
      const rows = parseDeepSeekCsv(csvText)
      const summed = sumDeepSeekCsv(rows, period_start, period_end)
      authoritative_cost_usd = summed.cost_usd
      parsedRows = rows
    } else {
      const rows = parseNimCsv(csvText)
      const summed = sumNimCsv(rows, period_start, period_end)
      authoritative_cost_usd = summed.cost_usd
      parsedRows = rows
    }
  } catch (err) {
    if (err instanceof CsvParseError) {
      return NextResponse.json(
        {
          error: 'parse_error',
          message: err.message,
          columns_found: err.columns_found,
          columns_expected: err.columns_expected,
        },
        { status: 400 },
      )
    }
    console.error('[admin/observatory/reconciliation/upload] parse failed', err)
    return res.internal('Failed to parse CSV upload.')
  }

  const truncatedRows = parsedRows.slice(0, RAW_PAYLOAD_ROW_CAP)

  // 5. Persist raw report → returns report_id.
  let raw_report_id = ''
  try {
    const { rows } = await query<{ report_id: string }>(
      `INSERT INTO llm_provider_cost_reports
         (provider, model, time_bucket_start, time_bucket_end,
          authoritative_cost_usd, raw_payload)
       VALUES ($1, NULL, $2::date, ($3::date + INTERVAL '1 day'), $4, $5)
       RETURNING report_id`,
      [
        provider,
        period_start,
        period_end,
        authoritative_cost_usd,
        JSON.stringify({
          source: 'manual_upload',
          provider,
          period_start,
          period_end,
          rows_uploaded: parsedRows.length,
          rows_persisted: truncatedRows.length,
          rows: truncatedRows,
        }),
      ],
    )
    raw_report_id = rows[0]?.report_id ?? ''
  } catch (err) {
    console.error('[admin/observatory/reconciliation/upload] report persist failed', err)
    return res.internal('Failed to persist raw cost report.')
  }

  // 4. Compute local-side cost.
  let computed_cost_usd = 0
  let event_count = 0
  try {
    const totals = await computePeriodCost(provider, period_start, period_end)
    computed_cost_usd = totals.total_cost_usd
    event_count = totals.event_count
  } catch (err) {
    console.error('[admin/observatory/reconciliation/upload] computePeriodCost failed', err)
    return res.internal('Failed to compute period cost.')
  }

  // 6. Classify + 7. persist reconciliation.
  const variance_usd = authoritative_cost_usd - computed_cost_usd
  const variance_pct =
    authoritative_cost_usd === 0
      ? 0
      : (Math.abs(variance_usd) / authoritative_cost_usd) * 100
  const status = classifyVariance(
    computed_cost_usd,
    authoritative_cost_usd,
    DEFAULT_RECONCILIATION_CONFIG,
  )

  const periodSpansMultipleDays = period_start !== period_end
  const notes = [
    'source=manual_upload',
    `raw_report_id=${raw_report_id}`,
    periodSpansMultipleDays ? `period=${period_start}..${period_end}` : null,
  ]
    .filter(Boolean)
    .join('; ')

  try {
    await query(
      `INSERT INTO llm_cost_reconciliation
         (reconciliation_date, provider, model,
          computed_total_usd, authoritative_total_usd,
          variance_usd, variance_pct, event_count, status, notes)
       VALUES ($1::date, $2, NULL, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (reconciliation_date, provider, COALESCE(model, ''))
       DO UPDATE SET
          computed_total_usd      = EXCLUDED.computed_total_usd,
          authoritative_total_usd = EXCLUDED.authoritative_total_usd,
          variance_usd            = EXCLUDED.variance_usd,
          variance_pct            = EXCLUDED.variance_pct,
          event_count             = EXCLUDED.event_count,
          status                  = EXCLUDED.status,
          notes                   = EXCLUDED.notes,
          reconciled_at           = NOW()`,
      [
        period_start,
        provider,
        computed_cost_usd,
        authoritative_cost_usd,
        variance_usd,
        variance_pct,
        event_count,
        status,
        notes,
      ],
    )
  } catch (err) {
    console.error('[admin/observatory/reconciliation/upload] reconciliation persist failed', err)
    return res.internal('Failed to persist reconciliation row.')
  }

  const result: ProviderReconcileResult = {
    provider,
    period_start,
    period_end,
    authoritative_cost_usd,
    computed_cost_usd,
    variance_usd,
    variance_pct,
    status,
    event_count,
    raw_report_id,
    notes: notes || undefined,
  }
  return NextResponse.json(result)
}
