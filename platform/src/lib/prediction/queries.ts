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
            outcome, outcome_observed_at, calibration_bucket
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
         END
     WHERE id = $2
     RETURNING id, query_id, created_at, prediction_text, confidence,
               horizon_start, horizon_end, falsifier, subject,
               outcome, outcome_observed_at, calibration_bucket`,
    [params.outcome, params.id]
  )
  return result.rows[0] ?? null
}
