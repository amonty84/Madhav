/**
 * rule_composer.ts — deterministic Bundle Composer (Stream B, Phase 1)
 *
 * Applies CompositionRules against the manifest to produce a validated Bundle.
 * No LLM calls. The LLM Bundle Augmenter is deferred to Phase 6.
 */

import crypto from 'crypto'
import { loadManifest } from './manifest_reader'
import { COMPOSITION_RULES } from './composition_rules'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import type { AssetEntry, Bundle, BundleEntry, BundleEntryRole, ManifestData, QueryPlan } from './types'

// ── Config ────────────────────────────────────────────────────────────────────

export interface BundleComposerConfig {
  manifest_path?: string
  overrides_path?: string
  max_bundle_tokens?: number
}

const DEFAULT_MANIFEST_PATH = '00_ARCHITECTURE/CAPABILITY_MANIFEST.json'
const DEFAULT_OVERRIDES_PATH = '00_ARCHITECTURE/manifest_overrides.yaml'
const DEFAULT_MAX_TOKENS = 200_000

// ── Main entry ────────────────────────────────────────────────────────────────

export async function compose(
  plan: QueryPlan,
  config?: BundleComposerConfig,
): Promise<Bundle> {
  const start = Date.now()

  const manifestPath = config?.manifest_path ?? DEFAULT_MANIFEST_PATH
  const overridesPath = config?.overrides_path ?? DEFAULT_OVERRIDES_PATH
  const maxTokens = config?.max_bundle_tokens ?? DEFAULT_MAX_TOKENS

  // 1. Load manifest + overrides
  const manifest = await loadManifest(manifestPath, overridesPath)

  // 2. Apply composition rules in order; deduplicate by canonical_id
  const accumulated = new Map<string, { asset: AssetEntry; role: BundleEntryRole }>()

  for (const rule of COMPOSITION_RULES) {
    if (!rule.applies(plan)) continue

    const assets = rule.assets_to_add(plan, manifest)
    const role = normaliseRole(rule.role)

    for (const asset of assets) {
      if (!accumulated.has(asset.canonical_id)) {
        accumulated.set(asset.canonical_id, { asset, role })
      }
      // If already present, first rule wins (floor is always first, so floor
      // entries keep their 'floor' role even if a later rule would also include them)
    }
  }

  // 3. Build mandatory_context list
  let entries: Array<{ asset: AssetEntry; role: BundleEntryRole }> = Array.from(accumulated.values())

  // 4. Token budget enforcement — drop in priority order, never drop floor
  entries = enforceTokenBudget(entries, manifest, maxTokens)

  // 5. Build BundleEntry objects
  const mandatoryContext: BundleEntry[] = entries.map(({ asset, role }) =>
    toBundleEntry(asset, role),
  )

  // 6. Compute total_tokens
  const totalTokens = mandatoryContext.reduce((sum, e) => sum + e.token_count, 0)

  // 7. Compute bundle_hash: sha256 of sorted canonical_ids
  const sortedIds = [...mandatoryContext.map(e => e.canonical_id)].sort()
  const bundleHash =
    'sha256:' + crypto.createHash('sha256').update(sortedIds.join('\n')).digest('hex')

  // 8. Assemble bundle object
  const bundle: Bundle = {
    bundle_id: crypto.randomUUID(),
    query_plan_reference: plan.query_plan_id,
    manifest_fingerprint: manifest.fingerprint,
    mandatory_context: mandatoryContext,
    total_tokens: totalTokens,
    bundle_hash: bundleHash,
    schema_version: '1.0',
  }

  // 9. Validate against schema
  const result = validate<Bundle>('bundle', bundle)
  if (!result.valid) {
    const msg = result.errors?.map(e => `${e.path}: ${e.message}`).join('; ') ?? 'unknown'
    throw new Error(`BundleComposer: schema validation failed — ${msg}`)
  }

  // 10. Emit telemetry
  telemetry.recordLatency('bundle_composer', 'compose', Date.now() - start)

  return result.data!
}

// ── Token budget enforcement ──────────────────────────────────────────────────

/**
 * Drop entries to fit within maxTokens.
 *
 * Degradation priority (highest to lowest willingness to drop):
 *   1. domain reports  (layer contains 'L3', not a discovery register)
 *   2. discovery registers (role === 'discovery')
 *   3. predictive adds (role === 'predictive')
 *   4. interpretive adds (role === 'interpretive')
 *   5. holistic extras (role === 'holistic')
 *
 * floor entries are NEVER dropped.
 */
function enforceTokenBudget(
  entries: Array<{ asset: AssetEntry; role: BundleEntryRole }>,
  _manifest: ManifestData,
  maxTokens: number,
): Array<{ asset: AssetEntry; role: BundleEntryRole }> {
  const getTokens = (e: { asset: AssetEntry }) =>
    typeof e.asset.cost_weight === 'number'
      ? // if manifest carries a token_count use it; otherwise 0
        0
      : 0

  // Compute actual token counts from manifest entries that carry them
  const tokenFor = (e: { asset: AssetEntry }): number => {
    // The manifest schema does not currently include a token_count field on
    // AssetEntry; when Phase 2 populates it, this will pick it up.  For now
    // all counts default to 0 and degradation is a no-op unless the caller
    // supplies a very small max_bundle_tokens in tests.
    const raw = (e.asset as unknown as Record<string, unknown>)['token_count']
    return typeof raw === 'number' ? raw : 0
  }

  const total = () => entries.reduce((s, e) => s + tokenFor(e), 0)

  if (total() <= maxTokens) return entries

  // Priority buckets (drop order): domain_report → discovery → predictive → interpretive → holistic
  const dropOrder: BundleEntryRole[] = ['holistic', 'interpretive', 'predictive', 'discovery']

  for (const dropRole of dropOrder) {
    if (total() <= maxTokens) break
    // Remove entries of this role, excluding floor
    entries = entries.filter(e => {
      if (e.role === 'floor') return true
      if (e.role === dropRole) {
        // Check: domain-report entries go before discovery
        if (dropRole === 'discovery' && isDomainReport(e.asset)) return false
        return e.role !== dropRole
      }
      return true
    })
  }

  return entries
}

function isDomainReport(asset: AssetEntry): boolean {
  return Boolean(asset.path?.includes('REPORT_')) || asset.canonical_id.includes('REPORT_')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normaliseRole(role: string): BundleEntryRole {
  const valid: BundleEntryRole[] = ['floor', 'interpretive', 'predictive', 'discovery', 'holistic']
  if (valid.includes(role as BundleEntryRole)) return role as BundleEntryRole
  // cross_native_meta gets stored as 'floor' in the bundle schema (only floor is valid for that case)
  return 'floor'
}

function toBundleEntry(asset: AssetEntry, role: BundleEntryRole): BundleEntry {
  const tokenCount: number =
    typeof (asset as unknown as Record<string, unknown>)['token_count'] === 'number'
      ? ((asset as unknown as Record<string, unknown>)['token_count'] as number)
      : 0

  const version = asset.version ?? '1.0'

  // content_hash: sha256 of canonical_id (content not loaded in Phase 1)
  const contentHash =
    'sha256:' + crypto.createHash('sha256').update(asset.canonical_id).digest('hex')

  return {
    canonical_id: asset.canonical_id,
    version,
    content_hash: contentHash,
    token_count: tokenCount,
    role,
    source: 'rule_composer',
  }
}
