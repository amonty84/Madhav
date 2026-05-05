/**
 * MARSYS-JIS Stream C — Tool C.2: pattern_register
 *
 * Reads the PATTERN_REGISTER JSON file from the repository and filters
 * PatternEntry records to match the incoming QueryPlan. Returns a validated
 * ToolBundle.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { getFlag } from '@/lib/config'
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

// Map categorical confidence labels used in the register JSON to numeric values
function toNumericConfidence(raw: string | number): number {
  if (typeof raw === 'number' && !isNaN(raw)) return Math.min(1, Math.max(0, raw))
  const n = parseFloat(String(raw))
  if (!isNaN(n)) return Math.min(1, Math.max(0, n))
  const label = String(raw).toUpperCase()
  if (label === 'HIGH') return 0.85
  if (label === 'MED' || label === 'MEDIUM') return 0.65
  if (label === 'LOW') return 0.35
  return 0.5
}

const TOOL_NAME = 'pattern_register'
const TOOL_VERSION = '1.0.0'
const REGISTER_PATH = '035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json'

interface PatternEntry {
  pattern_id: string
  claim_text: string
  mechanism: string
  domain: string
  signals_referenced?: string[]
  counter_cases?: unknown
  classical_basis?: string
  alternatives?: unknown
  validator_results?: unknown
  confidence: string | number
  significance: string | number
  is_forward_looking?: boolean
  time_indexed_falsifier?: string
  [key: string]: unknown
}

interface PatternRegister {
  schema?: string
  version: string
  produced_by_session?: string
  produced_at?: string
  patterns: PatternEntry[]
}

function disabledBundle(start: number): ToolBundle {
  const latency_ms = Date.now() - start
  return {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      register_path: REGISTER_PATH,
      disabled: true,
      reason: 'DISCOVERY_PATTERN_ENABLED=false',
    },
    results: [],
    served_from_cache: false,
    latency_ms,
    result_hash: 'sha256:' + crypto.createHash('sha256').update('disabled').digest('hex'),
    schema_version: '1.0',
  }
}

async function retrieve(plan: QueryPlan, _params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()
  try {
    return await retrieveImpl(plan, start)
  } catch (err) {
    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: { domains: plan.domains, forward_looking: plan.forward_looking },
      status: 'error',
      rows_returned: 0,
      latency_ms: Date.now() - start,
      token_estimate: 0,
      data_asset_id: 'PATTERN_REGISTER_v1_0',
      error_code: err instanceof Error ? err.message : String(err),
      served_from_cache: false,
      fallback_used: false,
    })
    throw err
  }
}

async function retrieveImpl(plan: QueryPlan, start: number): Promise<ToolBundle> {
  if (!getFlag('DISCOVERY_PATTERN_ENABLED')) {
    return disabledBundle(start)
  }

  const raw = await getStorageClient().readFile(REGISTER_PATH)
  const register = JSON.parse(raw) as PatternRegister

  // Domain filter: if domains specified, pattern.domain must be in the list.
  // Forward-looking preference: when plan.forward_looking is true, prefer
  // patterns with is_forward_looking == true but do not strictly exclude others
  // (they remain useful context).
  let patterns = register.patterns
  let fallback_used = false

  if (plan.domains.length > 0) {
    const filtered = patterns.filter(p => plan.domains.includes(p.domain))
    if (filtered.length === 0) {
      // UQE-7 (W2-BUGS B2W-2/3) — domain-only fallback. When the requested
      // domain produced zero patterns, fall back to the unfiltered register so
      // synthesis sees at least the available pattern context.
      fallback_used = true
    } else {
      patterns = filtered
    }
  }

  if (plan.forward_looking) {
    // Bring forward-looking patterns to the front; keep all.
    const fl = patterns.filter(p => p.is_forward_looking === true)
    const notFl = patterns.filter(p => p.is_forward_looking !== true)
    patterns = [...fl, ...notFl]
  }

  const results: ToolBundleResult[] = patterns.map(pattern => ({
    content: `${pattern.claim_text}\n\nMechanism: ${pattern.mechanism}`,
    source_canonical_id: 'PATTERN_REGISTER',
    source_version: register.version,
    confidence: toNumericConfidence(pattern.confidence),
    significance: toNumericConfidence(pattern.significance),
    signal_id: pattern.pattern_id,
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
      register_path: REGISTER_PATH,
      domains: plan.domains,
      forward_looking: plan.forward_looking,
      fallback_used,
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
      `pattern_register produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
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
    data_asset_id: 'PATTERN_REGISTER_v1_0',
    error_code: null,
    served_from_cache: false,
    fallback_used,
    raw_result_count: results.length,
    kept_result_count: results.length,
    dropped_items: [],
    kept_items: results.slice(0, 200).map(r => ({
      item_id: r.signal_id ?? r.source_canonical_id,
      score: r.confidence ?? null,
      contribution_tokens: null,
    })),
    tool_input_payload: bundle.invocation_params,
    error_class: 'OK',
  })

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
