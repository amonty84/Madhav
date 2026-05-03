// Phase O — O.4 Analytics — anomaly detection.
//
// Authored by USTAD_S4_6_ANOMALY_O4_CLOSE. Computes per-day cost series for
// each (provider, pipeline_stage, user_id) dimension over a rolling lookback
// window, then flags any point whose absolute z-score exceeds the configured
// threshold. Mirrors the alert-dispatch shape of `pricing_diff.ts`:
//
//   - SQL-only computation (no in-process aggregation), bound parameters.
//   - Dimensions checked: 'provider', 'pipeline_stage', 'user_id' (nulls
//     excluded for the user_id slice).
//   - Yesterday is the "checked day". Today is excluded because partial-day
//     totals would skew the z-score.
//   - Series with fewer than `min_data_points` complete days are skipped.
//   - Webhook dispatch (if `OBSERVATORY_ALERT_WEBHOOK_URL` set) and a
//     console.warn line fire whenever any anomalies are detected. Webhook
//     failures are swallowed (never throw).
//
// QueryFn injection mirrors `pricing_diff.ts` so tests can substitute
// `vi.fn()` for the real pg pool.

import 'server-only'
import { query } from '../../db/client'

export const DEFAULT_LOOKBACK_DAYS = 14
export const DEFAULT_Z_THRESHOLD = 2.5
export const DEFAULT_MIN_DATA_POINTS = 7
const WEBHOOK_TIMEOUT_MS = 5_000

export type AnomalyDimension = 'provider' | 'pipeline_stage' | 'user_id'

export interface AnomalyConfig {
  lookback_days: number
  z_threshold: number
  min_data_points: number
}

export interface AnomalyPoint {
  dimension: AnomalyDimension
  dimension_value: string
  date: string
  observed_cost_usd: number
  mean_cost_usd: number
  stddev_cost_usd: number
  z_score: number
  is_anomaly: boolean
}

export interface AnomalyResult {
  checked_at: string
  config: AnomalyConfig
  anomalies: AnomalyPoint[]
  total_series_checked: number
  alert_fired: boolean
}

interface QueryFn {
  <R = unknown>(sql: string, params?: unknown[]): Promise<{ rows: R[] }>
}

interface AnomalyRow {
  dimension: AnomalyDimension
  dimension_value: string
  cost_date: string
  observed_cost_usd: number | string | null
  mean_cost_usd: number | string | null
  stddev_cost_usd: number | string | null
  data_points: number | string | null
  z_score: number | string | null
}

function resolveConfig(partial?: Partial<AnomalyConfig>): AnomalyConfig {
  return {
    lookback_days: Math.max(1, Math.floor(partial?.lookback_days ?? DEFAULT_LOOKBACK_DAYS)),
    z_threshold: Number.isFinite(partial?.z_threshold)
      ? Number(partial?.z_threshold)
      : DEFAULT_Z_THRESHOLD,
    min_data_points: Math.max(2, Math.floor(partial?.min_data_points ?? DEFAULT_MIN_DATA_POINTS)),
  }
}

function toNumber(v: number | string | null | undefined): number {
  if (v === null || v === undefined) return 0
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

async function dispatchAnomalyAlert(
  result: AnomalyResult,
): Promise<void> {
  console.warn(
    `[AnomalyAlert] anomaly_count=${result.anomalies.length} ` +
      `series_checked=${result.total_series_checked} ` +
      `z_threshold=${result.config.z_threshold}`,
  )
  const target = process.env.OBSERVATORY_ALERT_WEBHOOK_URL
  if (!target) return
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)
  try {
    await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'anomaly_detection',
        checked_at: result.checked_at,
        anomaly_count: result.anomalies.length,
        config: result.config,
        anomalies: result.anomalies,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[AnomalyAlert] webhook dispatch failed: ${message}`)
  } finally {
    clearTimeout(timeout)
  }
}

export async function detectAnomalies(
  partialConfig?: Partial<AnomalyConfig>,
  queryFn: QueryFn = query as QueryFn,
): Promise<AnomalyResult> {
  const config = resolveConfig(partialConfig)
  const checkedAt = new Date().toISOString()

  // The "lookback" for the stats window is `lookback_days` days of completed
  // history (i.e. excluding today). We pull `lookback_days + 1` to include
  // the day we're about to check (yesterday) as a candidate point and still
  // have `lookback_days` complete days behind it for the stats computation.
  // Exception: stats SQL excludes today (incomplete) but includes yesterday
  // — yesterday is both the candidate point AND a member of the stats
  // population. This matches the brief.
  const sql =
    'WITH daily_costs AS (' +
    "  SELECT DATE(started_at) AS cost_date," +
    "         provider AS dimension_value," +
    "         'provider'::text AS dimension," +
    "         SUM(computed_cost_usd) AS daily_cost" +
    '  FROM llm_usage_events' +
    "  WHERE started_at >= NOW() - ($1::int + 1) * INTERVAL '1 day'" +
    '    AND computed_cost_usd IS NOT NULL' +
    '  GROUP BY DATE(started_at), provider' +
    '  UNION ALL' +
    "  SELECT DATE(started_at) AS cost_date," +
    "         pipeline_stage AS dimension_value," +
    "         'pipeline_stage'::text AS dimension," +
    "         SUM(computed_cost_usd) AS daily_cost" +
    '  FROM llm_usage_events' +
    "  WHERE started_at >= NOW() - ($1::int + 1) * INTERVAL '1 day'" +
    '    AND computed_cost_usd IS NOT NULL' +
    '    AND pipeline_stage IS NOT NULL' +
    '  GROUP BY DATE(started_at), pipeline_stage' +
    '  UNION ALL' +
    "  SELECT DATE(started_at) AS cost_date," +
    '         user_id::text AS dimension_value,' +
    "         'user_id'::text AS dimension," +
    '         SUM(computed_cost_usd) AS daily_cost' +
    '  FROM llm_usage_events' +
    "  WHERE started_at >= NOW() - ($1::int + 1) * INTERVAL '1 day'" +
    '    AND computed_cost_usd IS NOT NULL' +
    '    AND user_id IS NOT NULL' +
    '  GROUP BY DATE(started_at), user_id' +
    '),' +
    'stats AS (' +
    '  SELECT dimension, dimension_value,' +
    '         AVG(daily_cost) AS mean_cost,' +
    '         COALESCE(STDDEV_POP(daily_cost), 0) AS stddev_cost,' +
    '         COUNT(*) AS data_points' +
    '  FROM daily_costs' +
    '  WHERE cost_date < CURRENT_DATE' +
    '  GROUP BY dimension, dimension_value' +
    ')' +
    'SELECT dc.dimension AS dimension,' +
    '       dc.dimension_value AS dimension_value,' +
    '       dc.cost_date::text AS cost_date,' +
    '       dc.daily_cost AS observed_cost_usd,' +
    '       s.mean_cost AS mean_cost_usd,' +
    '       s.stddev_cost AS stddev_cost_usd,' +
    '       s.data_points AS data_points,' +
    '       CASE WHEN s.stddev_cost > 0' +
    '            THEN ABS(dc.daily_cost - s.mean_cost) / s.stddev_cost' +
    '            ELSE 0 END AS z_score' +
    ' FROM daily_costs dc' +
    ' JOIN stats s USING (dimension, dimension_value)' +
    " WHERE dc.cost_date = (CURRENT_DATE - INTERVAL '1 day')::date" +
    '   AND s.data_points >= $2::int'

  const { rows } = await queryFn<AnomalyRow>(sql, [
    config.lookback_days,
    config.min_data_points,
  ])

  const anomalies: AnomalyPoint[] = []
  let totalSeriesChecked = 0
  for (const row of rows) {
    totalSeriesChecked += 1
    const observed = toNumber(row.observed_cost_usd)
    const mean = toNumber(row.mean_cost_usd)
    const stddev = toNumber(row.stddev_cost_usd)
    const zScore = toNumber(row.z_score)
    const isAnomaly = stddev > 0 && Math.abs(zScore) > config.z_threshold
    if (!isAnomaly) continue
    anomalies.push({
      dimension: row.dimension,
      dimension_value: String(row.dimension_value ?? ''),
      date: String(row.cost_date),
      observed_cost_usd: observed,
      mean_cost_usd: mean,
      stddev_cost_usd: stddev,
      z_score: zScore,
      is_anomaly: true,
    })
  }

  anomalies.sort((a, b) => b.z_score - a.z_score)

  const result: AnomalyResult = {
    checked_at: checkedAt,
    config,
    anomalies,
    total_series_checked: totalSeriesChecked,
    alert_fired: false,
  }

  if (anomalies.length > 0) {
    try {
      await dispatchAnomalyAlert(result)
    } catch {
      // dispatchAnomalyAlert already swallows internally; defence in depth.
    }
    result.alert_fired = true
  }

  return result
}
