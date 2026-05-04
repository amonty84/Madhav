import 'server-only'

import { query } from '@/lib/db/client'
import type { PredictionRow } from './types'

export type PredictionOutcome = 'confirmed' | 'refuted' | 'partial' | 'unobservable'

export interface ListPredictionsParams {
  status: 'open' | 'closed'
  subject?: string
  date_from?: string
  date_to?: string
  confidence_min?: number
  confidence_max?: number
  calibration_bucket?: string
}

export interface ListPredictionsResult {
  rows: PredictionRow[]
}

export async function listPredictions(
  params: ListPredictionsParams
): Promise<ListPredictionsResult> {
  const conditions: string[] = []
  const values: unknown[] = []
  let idx = 1

  if (params.status === 'open') {
    conditions.push(`(outcome IS NULL AND horizon_end >= CURRENT_DATE)`)
  } else {
    conditions.push(`(outcome IS NOT NULL OR horizon_end < CURRENT_DATE)`)
  }

  if (params.subject) {
    conditions.push(`subject = $${idx++}`)
    values.push(params.subject)
  }

  if (params.date_from) {
    conditions.push(`horizon_start >= $${idx++}`)
    values.push(params.date_from)
  }

  if (params.date_to) {
    conditions.push(`horizon_end <= $${idx++}`)
    values.push(params.date_to)
  }

  if (params.confidence_min !== undefined) {
    conditions.push(`confidence >= $${idx++}`)
    values.push(params.confidence_min)
  }

  if (params.confidence_max !== undefined) {
    conditions.push(`confidence <= $${idx++}`)
    values.push(params.confidence_max)
  }

  if (params.calibration_bucket) {
    conditions.push(`calibration_bucket = $${idx++}`)
    values.push(params.calibration_bucket)
  }

  const where = conditions.join(' AND ')
  const orderCol = params.status === 'open' ? 'horizon_start ASC' : 'outcome_observed_at DESC NULLS LAST, horizon_end DESC'

  const result = await query<PredictionRow>(
    `SELECT id, query_id, created_at, prediction_text, confidence,
            horizon_start, horizon_end, falsifier, subject,
            outcome, outcome_observed_at, calibration_bucket,
            brier_score, correction_note
     FROM prediction_ledger
     WHERE ${where}
     ORDER BY ${orderCol}`,
    values
  )

  return { rows: result.rows }
}

export interface RecordOutcomeParams {
  id: string
  outcome: PredictionOutcome
  observation?: string
  correction_note?: string
}

export async function recordOutcome(params: RecordOutcomeParams): Promise<PredictionRow | null> {
  const result = await query<PredictionRow>(
    `UPDATE prediction_ledger
     SET outcome = $1,
         outcome_observed_at = NOW(),
         calibration_bucket = CASE
           WHEN $1 = 'confirmed' THEN 'true_positive'
           WHEN $1 = 'refuted' THEN 'false_positive'
           ELSE 'partial_or_unobservable'
         END,
         brier_score = CASE
           WHEN $1 = 'confirmed' THEN POWER(confidence - 1.0, 2)
           WHEN $1 = 'refuted'   THEN POWER(confidence - 0.0, 2)
           ELSE NULL
         END,
         correction_note = $3
     WHERE id = $2
     RETURNING id, query_id, created_at, prediction_text, confidence,
               horizon_start, horizon_end, falsifier, subject,
               outcome, outcome_observed_at, calibration_bucket,
               brier_score, correction_note`,
    [params.outcome, params.id, params.correction_note ?? null]
  )
  return result.rows[0] ?? null
}

export interface CalibrationMetrics {
  mean_brier_score: number | null
  closed_count: number
  confirmed_count: number
  refuted_count: number
  partial_count: number
}

export async function computeCalibrationMetrics(
  subject = 'native:abhisek'
): Promise<CalibrationMetrics> {
  const result = await query<{
    mean_brier_score: string | null
    closed_count: string
    confirmed_count: string
    refuted_count: string
    partial_count: string
  }>(
    `SELECT
       AVG(brier_score) AS mean_brier_score,
       COUNT(*) AS closed_count,
       SUM(CASE WHEN outcome = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_count,
       SUM(CASE WHEN outcome = 'refuted' THEN 1 ELSE 0 END) AS refuted_count,
       SUM(CASE WHEN outcome IN ('partial', 'unobservable') THEN 1 ELSE 0 END) AS partial_count
     FROM prediction_ledger
     WHERE outcome IS NOT NULL AND subject = $1`,
    [subject]
  )

  const row = result.rows[0]
  return {
    mean_brier_score: row?.mean_brier_score != null ? parseFloat(row.mean_brier_score) : null,
    closed_count: parseInt(row?.closed_count ?? '0', 10),
    confirmed_count: parseInt(row?.confirmed_count ?? '0', 10),
    refuted_count: parseInt(row?.refuted_count ?? '0', 10),
    partial_count: parseInt(row?.partial_count ?? '0', 10),
  }
}
