/**
 * MARSYS-JIS Stream B — Tool: manifest_query
 *
 * Queries the CAPABILITY_MANIFEST.json to surface relevant artifacts for a
 * given question. Uses deterministic keyword scoring — no LLM call. Returns a
 * validated ToolBundle.
 *
 * Feature-flag guarded: MANIFEST_QUERY_ENABLED.
 * Gracefully degrades (warning result, no throw) on file-read or parse failure.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { getFlag } from '@/lib/config'
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'manifest_query'
const TOOL_VERSION = '1.0.0'
const MANIFEST_PATH = '00_ARCHITECTURE/CAPABILITY_MANIFEST.json'

// ---------------------------------------------------------------------------
// Local interface definitions (not imported from schemas package)
// ---------------------------------------------------------------------------

interface ManifestEntry {
  canonical_id: string
  path: string
  version: string
  status: string
  layer: string
  expose_to_chat: boolean
  representations: string[]
  interface_version: string
  fingerprint: string
  native_id?: string
  preferred_for?: string[]
  always_required?: boolean
  tool_binding?: string
  cost_weight?: number
  supplements_parent?: string
}

interface CapabilityManifest {
  generated_at: string
  generator_version: string
  entry_count: number
  fingerprint: string
  entries: ManifestEntry[]
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Tokenize a string: lowercase, split on non-alphanumeric characters,
 * deduplicate, and remove empty tokens.
 */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(t => t.length > 0)
  )
}

/**
 * Score a single manifest entry against a set of query tokens.
 *
 * Scoring rules:
 *   +3  for each token that appears in canonical_id (case-insensitive)
 *   +2  for each token that appears in path
 *   +1  for each token that appears in any preferred_for[] value
 *   +1  flat bonus when expose_to_chat is true AND the entry already has at
 *       least one token match (tiebreaker only; does not surface zero-match entries)
 */
function scoreEntry(entry: ManifestEntry, tokens: Set<string>): number {
  let score = 0
  const idLower = entry.canonical_id.toLowerCase()
  const pathLower = entry.path.toLowerCase()

  for (const token of tokens) {
    if (idLower.includes(token)) score += 3
    if (pathLower.includes(token)) score += 2
    if (entry.preferred_for) {
      for (const pref of entry.preferred_for) {
        if (pref.toLowerCase().includes(token)) {
          score += 1
          break // count at most once per token across preferred_for
        }
      }
    }
  }

  // Apply the expose_to_chat bonus only when there is already a token match,
  // so it acts as a tiebreaker and never inflates a zero-match entry.
  if (score > 0 && entry.expose_to_chat) score += 1

  return score
}

// ---------------------------------------------------------------------------
// Empty-bundle helper (feature-flag disabled path)
// ---------------------------------------------------------------------------

function emptyBundle(start: number): ToolBundle {
  const latency_ms = Date.now() - start
  return {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: { manifest_path: MANIFEST_PATH, disabled: true },
    results: [],
    served_from_cache: false,
    latency_ms,
    result_hash: 'sha256:' + crypto.createHash('sha256').update('disabled').digest('hex'),
    schema_version: '1.0',
  }
}

// ---------------------------------------------------------------------------
// Core retrieve function
// ---------------------------------------------------------------------------

async function retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()
  try {
    return await retrieveImpl(plan, params, start)
  } catch (err) {
    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: (params ?? null) as Record<string, unknown> | null,
      status: 'error',
      rows_returned: 0,
      latency_ms: Date.now() - start,
      token_estimate: 0,
      data_asset_id: 'CAPABILITY_MANIFEST',
      error_code: err instanceof Error ? err.message : String(err),
      served_from_cache: false,
      fallback_used: false,
    })
    throw err
  }
}

async function retrieveImpl(
  plan: QueryPlan,
  params: Record<string, unknown> | undefined,
  start: number,
): Promise<ToolBundle> {
  // Feature-flag guard — return empty bundle immediately, no file read
  if (!getFlag('MANIFEST_QUERY_ENABLED')) {
    const bundle = emptyBundle(start)
    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: bundle.invocation_params as Record<string, unknown>,
      status: 'zero_rows',
      rows_returned: 0,
      latency_ms: bundle.latency_ms,
      token_estimate: 0,
      data_asset_id: 'CAPABILITY_MANIFEST',
      error_code: null,
      served_from_cache: false,
      fallback_used: false,
    })
    return bundle
  }

  // Resolve the question to score against
  const question =
    typeof params?.question === 'string' && params.question.length > 0
      ? params.question
      : plan.query_text

  const topN = typeof params?.top_n === 'number' && params.top_n > 0 ? params.top_n : 10

  // Read and parse the manifest — graceful degradation on failure
  let manifest: CapabilityManifest
  try {
    const raw = await getStorageClient().readFile(MANIFEST_PATH)
    manifest = JSON.parse(raw) as CapabilityManifest
  } catch (err) {
    const latency_ms = Date.now() - start
    telemetry.recordLatency(TOOL_NAME, 'retrieve_error', latency_ms)

    const warningBundle: ToolBundle = {
      tool_bundle_id: crypto.randomUUID(),
      tool_name: TOOL_NAME,
      tool_version: TOOL_VERSION,
      invocation_params: { manifest_path: MANIFEST_PATH, question, top_n: topN },
      results: [
        {
          content: `Manifest data unavailable: could not read or parse ${MANIFEST_PATH}`,
          source_canonical_id: 'CAPABILITY_MANIFEST',
          source_version: 'unknown',
          confidence: 0,
          significance: 0,
        },
      ],
      served_from_cache: false,
      latency_ms,
      result_hash:
        'sha256:' + crypto.createHash('sha256').update('manifest_unavailable').digest('hex'),
      schema_version: '1.0',
    }

    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: warningBundle.invocation_params as Record<string, unknown>,
      status: 'error',
      rows_returned: 0,
      latency_ms,
      token_estimate: 0,
      data_asset_id: 'CAPABILITY_MANIFEST',
      error_code: err instanceof Error ? err.message : 'manifest_read_failed',
      served_from_cache: false,
      fallback_used: false,
    })

    return warningBundle
  }

  // Score every entry
  const tokens = tokenize(question)

  const scored = manifest.entries
    .map(entry => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  const maxScore = scored.length > 0 ? scored[0].score : 1

  const results: ToolBundleResult[] = scored.map(({ entry, score }) => ({
    content: JSON.stringify(entry),
    source_canonical_id: 'CAPABILITY_MANIFEST',
    source_version: manifest.fingerprint,
    confidence: score / maxScore,
    signal_id: entry.canonical_id,
  }))

  const result_hash =
    'sha256:' +
    crypto
      .createHash('sha256')
      .update(JSON.stringify(results.map(r => r.signal_id ?? r.content.slice(0, 50)).sort()))
      .digest('hex')

  const latency_ms = Date.now() - start

  const bundle: ToolBundle = {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      manifest_path: MANIFEST_PATH,
      question,
      top_n: topN,
      manifest_fingerprint: manifest.fingerprint,
    },
    results,
    served_from_cache: false,
    latency_ms,
    result_hash,
    schema_version: '1.0',
  }

  const validation = validate('tool_bundle', bundle)
  if (!validation.valid) {
    throw new Error(
      `manifest_query produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
    )
  }

  telemetry.recordLatency(TOOL_NAME, 'retrieve', latency_ms)

  void writeToolExecutionLog({
    query_id: plan.query_plan_id,
    tool_name: TOOL_NAME,
    params_json: bundle.invocation_params as Record<string, unknown>,
    status: results.length === 0 ? 'zero_rows' : 'ok',
    rows_returned: results.length,
    latency_ms,
    token_estimate: Math.ceil(JSON.stringify(results).length / 4),
    data_asset_id: 'CAPABILITY_MANIFEST',
    error_code: null,
    served_from_cache: false,
    fallback_used: false,
  })

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
