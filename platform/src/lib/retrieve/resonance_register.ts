/**
 * MARSYS-JIS Stream C — Tool C.3: resonance_register
 *
 * Reads the RESONANCE_REGISTER JSON file from the repository and filters
 * ResonanceEntry records to match the incoming QueryPlan. Returns a validated
 * ToolBundle.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { getFlag } from '@/lib/config'
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

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

const TOOL_NAME = 'resonance_register'
const TOOL_VERSION = '1.0.0'
const REGISTER_PATH = '035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.json'

interface ResonanceEntry {
  resonance_id: string
  claim_text: string
  mechanism: string
  domains_bridged: string[]
  signals_referenced?: string[]
  cdlm_cells_referenced?: string[]
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

interface ResonanceRegister {
  schema?: string
  version: string
  produced_by_session?: string
  produced_at?: string
  resonances: ResonanceEntry[]
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
      reason: 'DISCOVERY_RESONANCE_ENABLED=false',
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
      data_asset_id: 'RESONANCE_REGISTER_v1_0',
      error_code: err instanceof Error ? err.message : String(err),
      served_from_cache: false,
      fallback_used: false,
    })
    throw err
  }
}

async function retrieveImpl(plan: QueryPlan, start: number): Promise<ToolBundle> {
  if (!getFlag('DISCOVERY_RESONANCE_ENABLED')) {
    return disabledBundle(start)
  }

  const raw = await getStorageClient().readFile(REGISTER_PATH)
  const register = JSON.parse(raw) as ResonanceRegister

  // Domain filter: if domains specified, domains_bridged must include at least
  // one of the plan domains.
  let resonances = register.resonances
  let fallback_used = false

  if (plan.domains.length > 0) {
    const filtered = resonances.filter(r =>
      r.domains_bridged?.some(d => plan.domains.includes(d))
    )
    if (filtered.length === 0) {
      // UQE-7 (W2-BUGS B2W-2/3) — domain-only fallback. Surface every
      // resonance rather than nothing when the requested domains don't
      // intersect any registered domains_bridged set.
      fallback_used = true
    } else {
      resonances = filtered
    }
  }

  const results: ToolBundleResult[] = resonances.map(resonance => ({
    content: [
      resonance.claim_text,
      `\nMechanism: ${resonance.mechanism}`,
      `Domains bridged: ${resonance.domains_bridged?.join(', ') ?? ''}`,
    ].join('\n\n'),
    source_canonical_id: 'RESONANCE_REGISTER',
    source_version: register.version,
    confidence: toNumericConfidence(resonance.confidence),
    significance: toNumericConfidence(resonance.significance),
    signal_id: resonance.resonance_id,
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
      `resonance_register produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
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
    data_asset_id: 'RESONANCE_REGISTER_v1_0',
    error_code: null,
    served_from_cache: false,
    fallback_used,
  })

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
