/**
 * MARSYS-JIS Phase 4 Stream B — Prediction ledger shared types
 * Sacrosanct invariant: outcome must NOT be populated at insert time (CLAUDE.md §E).
 */

/** Input to logPrediction. outcome/outcome_observed_at/calibration_bucket are post-hoc only. */
export interface Prediction {
  query_id: string
  prediction_text: string
  /** Probability 0–1. Required before outcome is observed. */
  confidence: number
  horizon_start: string  // ISO date string YYYY-MM-DD
  horizon_end: string    // ISO date string YYYY-MM-DD
  /** What observation would refute this prediction. */
  falsifier: string
  /** Extensible: defaults to 'native:abhisek' for this native. */
  subject?: string
}

/** Full DB row shape returned by reads. Post-hoc fields may be null. */
export interface PredictionRow extends Required<Prediction> {
  id: string
  created_at: string
  outcome: string | null
  outcome_observed_at: string | null
  calibration_bucket: string | null
}

export interface ListOpenPredictionsParams {
  subject?: string
  beforeHorizonEnd?: string  // ISO date string — only predictions with horizon_end <= this
}
