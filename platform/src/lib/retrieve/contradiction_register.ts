/**
 * MARSYS-JIS Stream C — Tool C.5: contradiction_register
 *
 * Reads the CONTRADICTION_REGISTER JSON file from the repository and filters
 * ContradictionEntry records to match the incoming QueryPlan. Returns a validated
 * ToolBundle.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { getFlag } from '@/lib/config'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'contradiction_register'
const TOOL_VERSION = '1.0'
const REGISTER_PATH = '035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.json'

// Fixed values: contradictions don't carry their own confidence/significance
const CONTRADICTION_CONFIDENCE = 0.8
const CONTRADICTION_SIGNIFICANCE = 0.9

interface ContradictionEntry {
  contradiction_id: string
  contradiction_class: string
  hypothesis_text: string
  mechanism: string
  domains_implicated: string[]
  signals_in_conflict?: string[]
  l1_references?: string[]
  claude_severity_prior?: string | number
  resolution_options?: string[] | string
  gemini_verdict?: string
  gemini_rationale?: string
  dr_entry_id?: string
  ledger_event_ids?: string[]
  pass_1_actor?: string
  created_at?: string
  created_by_session?: string
  [key: string]: unknown
}

interface ContradictionRegister {
  schema?: string
  version: string
  produced_by_session?: string
  produced_at?: string
  contradictions: ContradictionEntry[]
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
      reason: 'DISCOVERY_CONTRADICTION_ENABLED=false',
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

  if (!getFlag('DISCOVERY_CONTRADICTION_ENABLED')) {
    return disabledBundle(start)
  }

  const raw = await getStorageClient().readFile(REGISTER_PATH)
  const register = JSON.parse(raw) as ContradictionRegister

  let contradictions = register.contradictions

  // Domain filter: domains_implicated intersection
  if (plan.domains.length > 0) {
    contradictions = contradictions.filter(c =>
      c.domains_implicated?.some(d => plan.domains.includes(d))
    )
  }

  const results: ToolBundleResult[] = contradictions.map(contradiction => ({
    content: [
      `[${contradiction.contradiction_class}] ${contradiction.hypothesis_text}`,
      `Mechanism: ${contradiction.mechanism}`,
      `Resolution options: ${
        Array.isArray(contradiction.resolution_options)
          ? (contradiction.resolution_options.length > 0
              ? contradiction.resolution_options.join('; ')
              : 'none')
          : (contradiction.resolution_options ?? 'none')
      }`,
    ].join('\n'),
    source_canonical_id: 'CONTRADICTION_REGISTER',
    source_version: register.version,
    confidence: CONTRADICTION_CONFIDENCE,
    significance: CONTRADICTION_SIGNIFICANCE,
    signal_id: contradiction.contradiction_id,
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
      `contradiction_register produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
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
