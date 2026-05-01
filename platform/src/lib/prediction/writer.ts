import 'server-only'

import { query } from '@/lib/db/client'
import type { Prediction } from './types'

/**
 * Log a time-indexed prediction. Returns the new row id.
 *
 * Strict sacrosanct rule (CLAUDE.md §E / Learning Layer rule #4): if the
 * caller supplies an outcome field on the input object, this function throws
 * rather than corrupt the held-out discipline. Confidence, horizon, and
 * falsifier are all required.
 */
export async function logPrediction(p: Prediction): Promise<string> {
  // Sacrosanct guard: refuse writes that already carry an outcome
  if ('outcome' in p && (p as Record<string, unknown>).outcome != null) {
    throw new Error(
      'logPrediction: outcome must not be set at insert time — held-out discipline violated'
    )
  }

  validatePrediction(p)

  const result = await query<{ id: string }>(
    `INSERT INTO prediction_ledger
       (query_id, prediction_text, confidence, horizon_start, horizon_end, falsifier, subject)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      p.query_id,
      p.prediction_text,
      p.confidence,
      p.horizon_start,
      p.horizon_end,
      p.falsifier,
      p.subject ?? 'native:abhisek',
    ]
  )

  const id = result.rows[0]?.id
  if (!id) throw new Error('logPrediction: INSERT did not return an id')
  return id
}

function validatePrediction(p: Prediction): void {
  if (typeof p.confidence !== 'number' || p.confidence < 0 || p.confidence > 1) {
    throw new Error(`logPrediction: confidence must be a number in [0, 1], got ${p.confidence}`)
  }
  if (!p.horizon_start || !p.horizon_end) {
    throw new Error('logPrediction: horizon_start and horizon_end are required')
  }
  if (p.horizon_start > p.horizon_end) {
    throw new Error(
      `logPrediction: horizon_start (${p.horizon_start}) must be <= horizon_end (${p.horizon_end})`
    )
  }
  if (!p.falsifier || p.falsifier.trim().length === 0) {
    throw new Error('logPrediction: falsifier is required and must be non-empty')
  }
  if (!p.prediction_text || p.prediction_text.trim().length === 0) {
    throw new Error('logPrediction: prediction_text is required and must be non-empty')
  }
}
