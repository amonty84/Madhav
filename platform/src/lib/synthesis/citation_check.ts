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
