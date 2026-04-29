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
]

export {
  floorRule,
  interpretiveRule,
  predictiveRule,
  discoveryRule,
  holisticRemainderRule,
  crossNativeMetaRule,
  CROSS_NATIVE_PLACEHOLDER,
}
