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

  if (plan.domains.length > 0) {
    patterns = patterns.filter(p => plan.domains.includes(p.domain))
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

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
