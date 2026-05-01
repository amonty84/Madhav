/**
 * BHISMA-B1 §3.6 — Per-query cost estimation from trace steps
 *
 * Reads `input_tokens` and `output_tokens` from LLM trace step data_summary
 * fields, multiplies by the per-model cost rates declared in the model registry,
 * and returns USD buckets for planning vs. synthesis.
 *
 * Pure function — no side effects, no DB access. Safe to call from any context.
 */
import type { TraceStep } from '@/lib/trace/types'
import { getModelMeta } from '@/lib/models/registry'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface QueryCostBreakdown {
  /** USD cost for all planning/routing LLM calls (classify, plan, plan_per_tool). */
  planning_usd: number
  /** USD cost for the synthesis LLM call. */
  synthesis_usd: number
  /** Total USD cost (planning + synthesis). */
  total_usd: number
}

// Step names that belong to the planning bucket
const PLANNING_STEP_NAMES = new Set(['classify', 'plan', 'plan_per_tool'])

// ─────────────────────────────────────────────────────────────────────────────
// Cost computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the USD cost breakdown for a completed query from its trace steps.
 *
 * Only `step_type === 'llm'` steps with `data_summary.model` populated can be
 * costed. Steps with unknown model IDs (not in the registry) or missing token
 * counts contribute zero rather than throwing.
 *
 * @param steps  The full array of TraceStep records for a single query.
 * @returns      Planning, synthesis, and total USD costs.
 */
export function estimateQueryCost(steps: TraceStep[]): QueryCostBreakdown {
  let planning_usd = 0
  let synthesis_usd = 0

  for (const step of steps) {
    // Only LLM steps carry token usage
    if (step.step_type !== 'llm') continue

    const { model, input_tokens, output_tokens } = step.data_summary

    // Skip if token data or model ID absent
    if (!model || input_tokens == null || output_tokens == null) continue

    const meta = getModelMeta(model)
    if (!meta) continue

    // Cost = tokens / 1M * rate
    const input_cost = (input_tokens / 1_000_000) * meta.costPer1MInput
    const output_cost = (output_tokens / 1_000_000) * meta.costPer1MOutput
    const step_cost = input_cost + output_cost

    if (PLANNING_STEP_NAMES.has(step.step_name)) {
      planning_usd += step_cost
    } else if (step.step_name === 'synthesis') {
      synthesis_usd += step_cost
    }
    // Any other LLM step (future additions) contributes to neither bucket
    // until explicitly classified here.
  }

  return {
    planning_usd: round6(planning_usd),
    synthesis_usd: round6(synthesis_usd),
    total_usd: round6(planning_usd + synthesis_usd),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Round to 6 decimal places to avoid floating-point noise in display. */
function round6(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000
}
