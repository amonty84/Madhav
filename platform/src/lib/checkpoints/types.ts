/**
 * MARSYS-JIS Phase 6 — LLM Checkpoints shared types
 * schema_version: 1.0
 *
 * Three checkpoints gate the synthesis pipeline on substance (not just form):
 *   4.5  Resolve→Retrieve  : resolved entities match user intent?
 *   5.5  Retrieve→Validate : retrieved bundle sufficient to answer?
 *   8.5  Synthesize→Discipline : synthesized answer is coherent, non-empty?
 */

import { z } from 'zod'
import type { QueryPlan } from '@/lib/router/types'
import type { Bundle } from '@/lib/bundle/types'
import type { ToolBundle } from '@/lib/retrieve/types'
import type { ValidationResult } from '@/lib/validators/types'

// ── Verdict ───────────────────────────────────────────────────────────────────

export type CheckpointVerdict = 'pass' | 'warn' | 'halt'

export const CheckpointVerdictSchema = z.enum(['pass', 'warn', 'halt'])

// ── Base result ───────────────────────────────────────────────────────────────

export interface CheckpointResult {
  checkpoint_id: string
  verdict: CheckpointVerdict
  confidence: number
  reasoning: string
  latency_ms: number
  /** true when the feature flag is OFF — checkpoint was not invoked */
  skipped: boolean
}

// ── Per-checkpoint result extensions ─────────────────────────────────────────

export interface Checkpoint45Result extends CheckpointResult {
  /** LLM-suggested revision to the resolved query plan (logged only; never auto-applied) */
  suggested_revision?: unknown
}

export interface Checkpoint55Result extends CheckpointResult {
  /** Free-text hints about signal types that appear absent from the bundle */
  missing_signal_hints?: string[]
}

export interface Checkpoint85Result extends CheckpointResult {
  /** Structured prediction object; present only when synthesis contains a time-indexed claim */
  prediction?: StructuredPrediction
}

// ── Structured Prediction ─────────────────────────────────────────────────────

export const StructuredPredictionSchema = z.object({
  prediction_text: z.string(),
  confidence: z.number().min(0).max(1),
  horizon_start: z.string(),
  horizon_end: z.string(),
  falsifier: z.string(),
  subject: z.string().default('native:abhisek'),
})

export type StructuredPrediction = z.infer<typeof StructuredPredictionSchema>

// ── LLM output schemas (Zod-validated strict parse) ───────────────────────────

export const BaseCheckpointOutputSchema = z.object({
  verdict: CheckpointVerdictSchema,
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export const Checkpoint45OutputSchema = BaseCheckpointOutputSchema.extend({
  suggested_revision: z.unknown().optional(),
})

export const Checkpoint55OutputSchema = BaseCheckpointOutputSchema.extend({
  missing_signal_hints: z.array(z.string()).optional(),
})

export const Checkpoint85OutputSchema = BaseCheckpointOutputSchema.extend({
  prediction: StructuredPredictionSchema.optional(),
})

export type Checkpoint85Output = z.infer<typeof Checkpoint85OutputSchema>

// ── Input types ───────────────────────────────────────────────────────────────

export interface Checkpoint45Input {
  query: string
  query_plan: QueryPlan
  /** Alternatives the router/resolver discarded during entity resolution */
  discarded_alternatives?: string[]
}

export interface Checkpoint55Input {
  query: string
  query_plan: QueryPlan
  bundle: Bundle
  tool_results: ToolBundle[]
}

export interface Checkpoint85Input {
  synthesized_text: string
  query_class: QueryPlan['query_class']
  validator_results: ValidationResult[]
}

// ── Halt error ────────────────────────────────────────────────────────────────

export class CheckpointHaltError extends Error {
  constructor(
    public readonly checkpoint_id: string,
    public readonly result: CheckpointResult,
  ) {
    super(`Checkpoint ${checkpoint_id} halted synthesis: ${result.reasoning}`)
    this.name = 'CheckpointHaltError'
  }
}

// ── Skipped result factory ────────────────────────────────────────────────────

export function skippedResult(checkpoint_id: string): CheckpointResult {
  return {
    checkpoint_id,
    verdict: 'pass',
    confidence: 1,
    reasoning: 'checkpoint disabled (flag OFF)',
    latency_ms: 0,
    skipped: true,
  }
}
