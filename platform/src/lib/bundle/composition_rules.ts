/**
 * composition_rules.ts — deterministic bundle composition rules
 *
 * Each rule encodes one segment of the architecture §9 bundle logic.
 * Rules are applied in order by rule_composer.ts; assets are deduplicated
 * by canonical_id before the final bundle is assembled.
 *
 * NO LLM calls here — purely deterministic.
 */

import type { AssetEntry, BundleEntryRole, ManifestData, QueryPlan } from './types'
import { getTier1Entries } from './manifest_reader'

// ── CompositionRule interface ─────────────────────────────────────────────────

export interface CompositionRule {
  name: string
  /** Whether this rule fires for the given plan. */
  applies(plan: QueryPlan): boolean
  /** Entries this rule contributes when it fires. */
  assets_to_add(plan: QueryPlan, manifest: ManifestData): AssetEntry[]
  /** Role tag written onto every entry this rule emits. */
  role: BundleEntryRole | 'cross_native_meta'
}

// ── Path / ID lookup helpers ──────────────────────────────────────────────────

/** Find a manifest entry by exact canonical_id, or by path substring. */
function findEntry(manifest: ManifestData, canonicalId: string, pathSubstring: string): AssetEntry | undefined {
  // Try exact canonical_id first
  const byId = manifest.byId.get(canonicalId)
  if (byId) return byId

  // Fallback: path substring (handles mis-keyed overrides)
  return manifest.entries.find(e => e.path.includes(pathSubstring))
}

/** Collect a list of entries, silently skipping missing ones. */
function collectEntries(
  manifest: ManifestData,
  targets: Array<{ canonicalId: string; pathSubstring: string }>,
): AssetEntry[] {
  const out: AssetEntry[] = []
  for (const t of targets) {
    const entry = findEntry(manifest, t.canonicalId, t.pathSubstring)
    if (entry) out.push(entry)
  }
  return out
}

// ── Rule 1: floor ─────────────────────────────────────────────────────────────

const floorRule: CompositionRule = {
  name: 'floor',
  role: 'floor',

  applies(_plan: QueryPlan): boolean {
    return true // always
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return manifest.entries.filter(e => e.always_required === true)
  },
}

// ── Rule 2: interpretive ──────────────────────────────────────────────────────

const interpretiveRule: CompositionRule = {
  name: 'interpretive',
  role: 'interpretive',

  applies(plan: QueryPlan): boolean {
    return ['interpretive', 'cross_domain', 'holistic'].includes(plan.query_class)
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return collectEntries(manifest, [
      { canonicalId: 'UCN_v4_0', pathSubstring: 'UCN_v4_0' },
      { canonicalId: 'CDLM_v1_1', pathSubstring: 'CDLM_v1_1' },
      { canonicalId: 'RM_v2_0', pathSubstring: 'RM_v2_0' },
    ])
  },
}

// ── Rule 3: predictive ────────────────────────────────────────────────────────

const predictiveRule: CompositionRule = {
  name: 'predictive',
  role: 'predictive',

  applies(plan: QueryPlan): boolean {
    return plan.query_class === 'predictive' || plan.forward_looking === true
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return collectEntries(manifest, [
      { canonicalId: 'LIFE_EVENT_LOG_v1_2', pathSubstring: 'LIFE_EVENT_LOG_v1_2' },
      { canonicalId: 'SADE_SATI_CYCLES_ALL', pathSubstring: 'SADE_SATI_CYCLES_ALL' },
    ])
  },
}

// ── Rule 4: discovery ─────────────────────────────────────────────────────────

const discoveryRule: CompositionRule = {
  name: 'discovery',
  role: 'discovery',

  applies(plan: QueryPlan): boolean {
    return ['discovery', 'holistic'].includes(plan.query_class)
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return collectEntries(manifest, [
      { canonicalId: 'PATTERN_REGISTER_v1_0', pathSubstring: 'PATTERN_REGISTER_v1_0.md' },
      { canonicalId: 'CONTRADICTION_REGISTER_v1_0', pathSubstring: 'CONTRADICTION_REGISTER_v1_0.md' },
      { canonicalId: 'CLUSTER_ATLAS_v1_0', pathSubstring: 'CLUSTER_ATLAS_v1_0.md' },
      { canonicalId: 'RESONANCE_REGISTER_v1_0', pathSubstring: 'RESONANCE_REGISTER_v1_0.md' },
    ])
  },
}

// ── Rule 5: holistic_remainder ────────────────────────────────────────────────

/**
 * For holistic queries: add all remaining Tier-1 eligible entries that have
 * not already been included by the earlier rules.
 *
 * assets_to_add receives the already-accumulated set via the plan's
 * bundle_directives.floor_overrides field — but that approach couples rules to
 * execution order. Instead, rule_composer.ts calls this rule last and passes
 * the accumulated set through the manifest so this rule can subtract it.
 *
 * Because CompositionRule.assets_to_add does not expose the accumulated set,
 * the holistic_remainder rule returns ALL Tier-1 entries; deduplication in
 * rule_composer.ts ensures no double-adds.
 */
const holisticRemainderRule: CompositionRule = {
  name: 'holistic_remainder',
  role: 'holistic',

  applies(plan: QueryPlan): boolean {
    return plan.query_class === 'holistic'
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return getTier1Entries(manifest)
  },
}

// ── Rule 6: cross_native_meta ─────────────────────────────────────────────────

/**
 * cross_native queries use a meta-bundle: floor only + a placeholder marker.
 * The placeholder is represented as a synthetic entry that downstream
 * orchestration can recognise; it carries no real manifest content.
 */
const CROSS_NATIVE_PLACEHOLDER: AssetEntry = {
  canonical_id: '__cross_native_placeholder__',
  path: '__meta__',
  version: '1.0',
  status: 'META',
  layer: 'META',
  expose_to_chat: false,
  representations: [],
  interface_version: '1.0',
  fingerprint: '',
  native_id: '',
}

const crossNativeMetaRule: CompositionRule = {
  name: 'cross_native_meta',
  role: 'cross_native_meta',

  applies(plan: QueryPlan): boolean {
    return plan.query_class === 'cross_native'
  },

  assets_to_add(_plan: QueryPlan, _manifest: ManifestData): AssetEntry[] {
    return [CROSS_NATIVE_PLACEHOLDER]
  },
}

// ── Rule 7: remedial ──────────────────────────────────────────────────────────

/**
 * For remedial queries: add REMEDIAL_CODEX source entries (L4) so the
 * synthesizer has the full codex in context alongside the retrieval tool results.
 *
 * PATH A: REMEDIAL_CODEX_v2_0_PART1 + PART2 are in the manifest — add them directly.
 * PATH B: Not in manifest — rule fires but adds no assets (the remedial_codex_query
 *         retrieval tool already surfaces the content via rag_chunks; this rule is a
 *         no-op bundle-layer gate that logs a missing-entry advisory).
 */
const remedialRule: CompositionRule = {
  name: 'remedial',
  role: 'remedial',

  applies(plan: QueryPlan): boolean {
    return plan.query_class === 'remedial'
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return collectEntries(manifest, [
      { canonicalId: 'REMEDIAL_CODEX_v2_0_PART1', pathSubstring: 'REMEDIAL_CODEX_v2_0_PART1' },
      { canonicalId: 'REMEDIAL_CODEX_v2_0_PART2', pathSubstring: 'REMEDIAL_CODEX_v2_0_PART2' },
    ])
    // collectEntries silently skips missing entries — path B is naturally handled.
  },
}

// ── Rule 8: domain_report ─────────────────────────────────────────────────────

/**
 * When a query references specific domains, add the matching REPORT_* manifest
 * entries so the synthesizer has the full L3 domain synthesis in context.
 *
 * Domain → canonical_id mapping uses v1_1 (or v2_1 for financial) per current manifest.
 * collectEntries silently skips any missing entry.
 */

const DOMAIN_TO_CANONICAL: Record<string, { canonicalId: string; pathSubstring: string }> = {
  career:        { canonicalId: 'REPORT_CAREER_DHARMA_v1_1',     pathSubstring: 'REPORT_CAREER_DHARMA' },
  dharma:        { canonicalId: 'REPORT_CAREER_DHARMA_v1_1',     pathSubstring: 'REPORT_CAREER_DHARMA' },
  children:      { canonicalId: 'REPORT_CHILDREN_v1_1',          pathSubstring: 'REPORT_CHILDREN' },
  financial:     { canonicalId: 'REPORT_FINANCIAL_v2_1',         pathSubstring: 'REPORT_FINANCIAL' },
  finance:       { canonicalId: 'REPORT_FINANCIAL_v2_1',         pathSubstring: 'REPORT_FINANCIAL' },
  wealth:        { canonicalId: 'REPORT_FINANCIAL_v2_1',         pathSubstring: 'REPORT_FINANCIAL' },
  health:        { canonicalId: 'REPORT_HEALTH_LONGEVITY_v1_1',  pathSubstring: 'REPORT_HEALTH_LONGEVITY' },
  longevity:     { canonicalId: 'REPORT_HEALTH_LONGEVITY_v1_1',  pathSubstring: 'REPORT_HEALTH_LONGEVITY' },
  parents:       { canonicalId: 'REPORT_PARENTS_v1_1',           pathSubstring: 'REPORT_PARENTS' },
  psychology:    { canonicalId: 'REPORT_PSYCHOLOGY_MIND_v1_1',   pathSubstring: 'REPORT_PSYCHOLOGY_MIND' },
  mind:          { canonicalId: 'REPORT_PSYCHOLOGY_MIND_v1_1',   pathSubstring: 'REPORT_PSYCHOLOGY_MIND' },
  relationships: { canonicalId: 'REPORT_RELATIONSHIPS_v1_1',     pathSubstring: 'REPORT_RELATIONSHIPS' },
  marriage:      { canonicalId: 'REPORT_RELATIONSHIPS_v1_1',     pathSubstring: 'REPORT_RELATIONSHIPS' },
  spiritual:     { canonicalId: 'REPORT_SPIRITUAL_v1_1',         pathSubstring: 'REPORT_SPIRITUAL' },
  travel:        { canonicalId: 'REPORT_TRAVEL_v1_1',            pathSubstring: 'REPORT_TRAVEL' },
}

const domainReportRule: CompositionRule = {
  name: 'domain_report',
  role: 'domain_report',

  applies(plan: QueryPlan): boolean {
    return plan.domains.length > 0
  },

  assets_to_add(plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    const targets: Array<{ canonicalId: string; pathSubstring: string }> = []
    const seen = new Set<string>()
    for (const domain of plan.domains) {
      const mapping = DOMAIN_TO_CANONICAL[domain.toLowerCase()]
      if (mapping && !seen.has(mapping.canonicalId)) {
        targets.push(mapping)
        seen.add(mapping.canonicalId)
      }
    }
    return collectEntries(manifest, targets)
  },
}

// ── Rule 9: temporal_engine ───────────────────────────────────────────────────

/**
 * For forward-looking queries with a time_window: add 05_TEMPORAL_ENGINES
 * manifest entries (lifetime timeline, sade sati cycles) so the synthesizer
 * has the temporal arc documents in context.
 *
 * Gate: both forward_looking AND time_window must be set. Forward-looking alone
 * (no explicit window) does not fire this rule — the predictiveRule already
 * adds LEL and SADE_SATI_CYCLES_ALL for that case.
 */
const timelineRule: CompositionRule = {
  name: 'temporal_engine',
  role: 'temporal_engine',

  applies(plan: QueryPlan): boolean {
    return plan.forward_looking === true && plan.time_window != null
  },

  assets_to_add(_plan: QueryPlan, manifest: ManifestData): AssetEntry[] {
    return collectEntries(manifest, [
      { canonicalId: 'LIFETIME_TIMELINE_v1_0',   pathSubstring: 'LIFETIME_TIMELINE_v1_0' },
      { canonicalId: 'SADE_SATI_CYCLES_ALL',      pathSubstring: 'SADE_SATI_CYCLES_ALL' },
    ])
    // collectEntries silently skips entries absent from manifest.
  },
}

// ── Exported rule registry ────────────────────────────────────────────────────

/**
 * Rules are applied in this order by rule_composer.ts.
 * Do not reorder without updating the degradation priority logic.
 */
export const COMPOSITION_RULES: CompositionRule[] = [
  floorRule,
  interpretiveRule,
  predictiveRule,
  discoveryRule,
  holisticRemainderRule,
  crossNativeMetaRule,
  remedialRule,       // W6-R1
  domainReportRule,   // W6-R1
  timelineRule,       // W6-R1
]

export {
  floorRule,
  interpretiveRule,
  predictiveRule,
  discoveryRule,
  holisticRemainderRule,
  crossNativeMetaRule,
  CROSS_NATIVE_PLACEHOLDER,
  remedialRule,       // W6-R1
  domainReportRule,   // W6-R1
  timelineRule,       // W6-R1
  DOMAIN_TO_CANONICAL, // W6-R1 — exported for test use
}
