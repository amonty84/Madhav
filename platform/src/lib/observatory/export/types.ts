// Phase O — O.3 Export — types.
//
// Authored by USTAD_S3_4_EXPORT_O3_CLOSE. The export surface lets a
// super-admin pull a filtered slice of `llm_usage_events` as either CSV or
// JSON. Caps are enforced at the API edge: a single export is bounded to
// 90 calendar days and 50 000 rows so a runaway request can't page the
// Cloud Run instance into OOM.

import type { LlmPipelineStage, LlmProvider } from '../../db/schema/observatory'

export type ExportFormat = 'csv' | 'json'

export interface ExportParams {
  format: ExportFormat
  /** Optional provider filter; omit for all providers. */
  provider?: LlmProvider | string
  /** Optional pipeline stage filter; omit for all stages. */
  pipeline_stage?: LlmPipelineStage | string
  /** Inclusive start date (`YYYY-MM-DD`), interpreted UTC. */
  date_start: string
  /** Inclusive end date (`YYYY-MM-DD`), interpreted UTC. */
  date_end: string
  /** Server-side cap is `EXPORT_MAX_LIMIT` regardless of input. */
  limit?: number
}

/** Server-side row cap. The 90-day window cap is in `route.ts`. */
export const EXPORT_MAX_LIMIT = 50_000
export const EXPORT_DEFAULT_LIMIT = 10_000
export const EXPORT_MAX_RANGE_DAYS = 90
/** Threshold at which the response carries the `X-Export-Row-Count` hint. */
export const EXPORT_LARGE_THRESHOLD = 5_000

/** Subset of `LlmUsageEventRow` columns the export surfaces. Internal-id
 *  columns that don't add caller value (e.g. `prompt_id`, `feature_flag_state`)
 *  are excluded. PII columns (`prompt_text`, `response_text`, `system_prompt`)
 *  are excluded — the export is for cost/usage analysis, not raw-payload
 *  audit; payload review still goes through the per-event drilldown. */
export const EXPORT_COLUMNS = [
  'event_id',
  'provider',
  'model',
  'pipeline_stage',
  'conversation_id',
  'user_id',
  'input_tokens',
  'output_tokens',
  'cache_read_tokens',
  'cache_write_tokens',
  'reasoning_tokens',
  'computed_cost_usd',
  'pricing_version_id',
  'status',
  'latency_ms',
  'started_at',
] as const

export type ExportColumn = (typeof EXPORT_COLUMNS)[number]

/** Exported row shape — one entry per `EXPORT_COLUMNS` member. */
export type ExportRow = {
  [K in ExportColumn]: string | number | null
}

export interface ExportMeta {
  row_count: number
  date_start: string
  date_end: string
  generated_at: string
  format: ExportFormat
  provider: string | null
  pipeline_stage: string | null
}
