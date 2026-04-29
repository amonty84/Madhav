import 'server-only'

import { query } from '@/lib/db/client'
import type { PredictionRow, ListOpenPredictionsParams } from './types'

/**
 * List open predictions (outcome not yet observed) for Phase 10 calibration loop.
 * Optionally filter by subject and/or horizon_end cutoff date.
 */
export async function listOpenPredictions(
  params: ListOpenPredictionsParams = {}
): Promise<PredictionRow[]> {
  const conditions: string[] = ['outcome IS NULL']
  const values: unknown[] = []
  let idx = 1

  if (params.subject) {
    conditions.push(`subject = $${idx++}`)
    values.push(params.subject)
  }

  if (params.beforeHorizonEnd) {
    conditions.push(`horizon_end <= $${idx++}`)
    values.push(params.beforeHorizonEnd)
  }

  const where = conditions.join(' AND ')
  const result = await query<PredictionRow>(
    `SELECT id, query_id, created_at, prediction_text, confidence,
            horizon_start, horizon_end, falsifier, subject,
            outcome, outcome_observed_at, calibration_bucket
     FROM prediction_ledger
     WHERE ${where}
     ORDER BY horizon_start ASC`,
    values
  )

  return result.rows
}
