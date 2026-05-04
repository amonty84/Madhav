/**
 * citation_check.ts — BHISMA Stream 2 §4.7
 *
 * Counts MSR signal citations in synthesis output and checks them against a
 * per-query-class minimum. Used by the synthesis trace step (P.4 fix) to flag
 * low-citation responses so the trace panel can surface a warning badge.
 *
 * The signal-id format is fixed by L2.5 schema: SIG.MSR.NNN where NNN is a
 * three-digit signal number. We count distinct ids — repeated citations of
 * the same signal are not double-counted, since attribution is what matters
 * to the audit, not citation density.
 */

const SIGNAL_ID_PATTERN = /\bSIG\.MSR\.\d{3}\b/g

/** Per-query-class minimum citation count. Tuned to expected output shape. */
const MIN_CITATIONS_BY_CLASS: Record<string, number> = {
  factual: 0,
  remedial: 1,
  predictive: 2,
  cross_native: 2,
  interpretive: 3,
  discovery: 3,
  cross_domain: 4,
  holistic: 5,
}

/** Default for unknown classes — at least one citation expected. */
const DEFAULT_MIN_CITATIONS = 1

/**
 * Count distinct MSR signal citations in the synthesis output text.
 *
 * Example: text contains "SIG.MSR.142", "SIG.MSR.207", "SIG.MSR.142" → 2
 * (the duplicate doesn't count twice).
 */
export function countSignalCitations(text: string): number {
  const matches = text.match(SIGNAL_ID_PATTERN)
  if (!matches) return 0
  return new Set(matches).size
}

/** Total citation occurrences (duplicates count) — useful for citation density. */
export function totalSignalCitations(text: string): number {
  const matches = text.match(SIGNAL_ID_PATTERN)
  return matches ? matches.length : 0
}

/**
 * Returns true if the text meets the per-query-class minimum citation count.
 * Unknown classes fall back to DEFAULT_MIN_CITATIONS.
 */
export function hasMinimumCitations(text: string, queryClass: string): boolean {
  const minimum = MIN_CITATIONS_BY_CLASS[queryClass] ?? DEFAULT_MIN_CITATIONS
  return countSignalCitations(text) >= minimum
}

/**
 * Returns the per-class minimum so callers can surface "needs N citations,
 * has M" diagnostics without re-deriving the threshold.
 */
export function citationThresholdForClass(queryClass: string): number {
  return MIN_CITATIONS_BY_CLASS[queryClass] ?? DEFAULT_MIN_CITATIONS
}

// ── Layer 2: cross-reference citations against assembled context ─────────────
//
// Layer 1 (above) only counts pattern occurrences in the output. That alone
// can't tell whether the model invented a SIG.MSR.NNN id (training-data leak)
// or actually drew it from the assembled context. Layer 2 closes that gap by
// verifying each output citation id is present in the JSONified context bundle.
//
// Result semantics:
//   layer1_count    = distinct SIG.MSR.NNN ids in output (same as Layer 1)
//   layer2_verified = ids in output that ALSO appear in the context JSON
//   layer2_leaked   = ids in output that do NOT appear in the context JSON
// Invariant: layer1_count == layer2_verified + layer2_leaked.
//
// "Prescriptive" query classes (remedial, predictive) require at least one
// verified citation; an empty answer with no citations from a remedial query
// is treated as fabricated guidance and gated to ERROR.

export interface CitationValidationResult {
  layer1_count: number
  layer2_verified: number
  layer2_leaked: number
  gate_result: 'PASS' | 'WARN' | 'ERROR'
  gate_reason: string
}

const PRESCRIPTIVE_CLASSES = new Set(['remedial', 'predictive'])

export function validateCitations(
  outputText: string,
  assembledContextJson: string,
  queryClass: string
): CitationValidationResult {
  const matches = outputText.match(SIGNAL_ID_PATTERN)
  const distinctIds = matches ? Array.from(new Set(matches)) : []
  const layer1_count = distinctIds.length

  let layer2_verified = 0
  let layer2_leaked = 0
  for (const id of distinctIds) {
    // BUG-7: word-boundary check prevents SIG.MSR.001 matching inside SIG.MSR.0010
    const idPattern = new RegExp(`\\b${id.replace(/\./g, '\\.')}\\b`)
    if (idPattern.test(assembledContextJson)) layer2_verified += 1
    else layer2_leaked += 1
  }

  if (layer2_verified >= 1) {
    const reason =
      layer2_leaked > 0
        ? `${layer2_verified} verified, ${layer2_leaked} unverified (partial leak)`
        : `${layer2_verified} verified citation(s) cross-referenced against context`
    return { layer1_count, layer2_verified, layer2_leaked, gate_result: 'PASS', gate_reason: reason }
  }

  if (layer1_count > 0) {
    return {
      layer1_count,
      layer2_verified,
      layer2_leaked,
      gate_result: 'WARN',
      gate_reason: `training-data leak suspected: ${layer1_count} citation id(s) in output but 0 verified against context`,
    }
  }

  if (PRESCRIPTIVE_CLASSES.has(queryClass)) {
    return {
      layer1_count,
      layer2_verified,
      layer2_leaked,
      gate_result: 'ERROR',
      gate_reason: `prescriptive query (${queryClass}) produced 0 citations — guidance must be grounded`,
    }
  }

  return {
    layer1_count,
    layer2_verified,
    layer2_leaked,
    gate_result: 'PASS',
    gate_reason: `informational query (${queryClass}); citations not required`,
  }
}
