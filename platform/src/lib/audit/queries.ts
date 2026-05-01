import 'server-only'

import { query } from '@/lib/db/client'
import type { AuditLogRow } from './types'

/** Phase 8 extension: audit_log row augmented with optional Phase 6/7 payload. */
export interface AuditLogRowExtended extends AuditLogRow {
  /** Added by Phase 6 migration (checkpoint payloads). Null when column absent or unpopulated. */
  payload?: AuditPayload | null
}

export interface CheckpointPayload {
  checkpoints?: {
    c4_5?: CheckpointResult
    c5_5?: CheckpointResult
    c8_5?: CheckpointResult
  }
  /** Phase 7 panel output — present when PANEL_MODE_ENABLED fired for this query. */
  panel?: PanelPayload
}

export type AuditPayload = CheckpointPayload

export interface CheckpointResult {
  verdict: 'pass' | 'warn' | 'halt'
  confidence: number
  reasoning: string
}

export interface PanelPayload {
  adjudicator_answer: string
  members: PanelMember[]
  divergence_class: string
}

export interface PanelMember {
  label: string
  answer: string
  alignment: 'agree' | 'partial' | 'dissent'
}

export interface PredictionJoin {
  id: string
  prediction_text: string
  confidence: number
  horizon_start: string
  horizon_end: string
  falsifier: string
  outcome: string | null
  outcome_observed_at: string | null
  calibration_bucket: string | null
}

export interface AuditDetailRow extends AuditLogRowExtended {
  predictions: PredictionJoin[]
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface AuditListFilters {
  query_class?: string[]
  disclosure_tier?: string[]
  validator_status?: 'passed_all' | 'any_failed' | 'halted'
  checkpoint_status?: 'none' | 'warn' | 'halt'
  panel_mode?: 'any' | 'panel_only' | 'single_only'
  search?: string
  date_from?: string
  date_to?: string
}

export interface AuditListResult {
  rows: AuditLogRowExtended[]
  total: number
  page: number
  page_size: number
}

const KNOWN_COLUMNS = `
  id, query_id, created_at, query_text, query_class,
  bundle_keys, tools_called, validators_run,
  synthesis_model, synthesis_input_tokens, synthesis_output_tokens,
  disclosure_tier, final_output, audit_event_version
`.trim()

export async function listAuditRows(
  page: number,
  pageSize: number,
  filters: AuditListFilters = {}
): Promise<AuditListResult> {
  const conditions: string[] = []
  const values: unknown[] = []
  let idx = 1

  if (filters.query_class?.length) {
    conditions.push(`query_class = ANY($${idx++}::text[])`)
    values.push(filters.query_class)
  }

  if (filters.disclosure_tier?.length) {
    conditions.push(`disclosure_tier = ANY($${idx++}::text[])`)
    values.push(filters.disclosure_tier)
  }

  if (filters.search) {
    conditions.push(`query_text ILIKE $${idx++}`)
    values.push(`%${filters.search}%`)
  }

  if (filters.date_from) {
    conditions.push(`created_at >= $${idx++}`)
    values.push(filters.date_from)
  }

  if (filters.date_to) {
    conditions.push(`created_at <= $${idx++}`)
    values.push(filters.date_to)
  }

  if (filters.validator_status === 'passed_all') {
    conditions.push(`NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(validators_run) v
      WHERE (v->>'passed')::boolean = false
    )`)
  } else if (filters.validator_status === 'any_failed') {
    conditions.push(`EXISTS (
      SELECT 1 FROM jsonb_array_elements(validators_run) v
      WHERE (v->>'passed')::boolean = false
    )`)
  } else if (filters.validator_status === 'halted') {
    conditions.push(`EXISTS (
      SELECT 1 FROM jsonb_array_elements(validators_run) v
      WHERE (v->>'passed')::boolean = false
    )`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * pageSize

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM audit_log ${where}`,
    values
  )
  const total = parseInt(countResult.rows[0]?.count ?? '0', 10)

  const dataResult = await query<AuditLogRowExtended>(
    `SELECT ${KNOWN_COLUMNS}
     FROM audit_log
     ${where}
     ORDER BY created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, pageSize, offset]
  )

  return {
    rows: dataResult.rows,
    total,
    page,
    page_size: pageSize,
  }
}

export async function getAuditRow(queryId: string): Promise<AuditDetailRow | null> {
  const auditResult = await query<AuditLogRowExtended>(
    `SELECT ${KNOWN_COLUMNS} FROM audit_log WHERE query_id = $1`,
    [queryId]
  )
  const row = auditResult.rows[0]
  if (!row) return null

  const predsResult = await query<PredictionJoin>(
    `SELECT id, prediction_text, confidence, horizon_start, horizon_end,
            falsifier, outcome, outcome_observed_at, calibration_bucket
     FROM prediction_ledger
     WHERE query_id = $1
     ORDER BY created_at ASC`,
    [queryId]
  )

  return { ...row, predictions: predsResult.rows }
}
