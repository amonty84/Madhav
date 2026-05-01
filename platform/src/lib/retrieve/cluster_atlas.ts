/**
 * MARSYS-JIS Stream C — Tool C.4: cluster_atlas
 *
 * Reads the CLUSTER_ATLAS JSON file from the repository and filters
 * ClusterEntry records to match the incoming QueryPlan. Returns a validated
 * ToolBundle.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { getFlag } from '@/lib/config'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'cluster_atlas'
const TOOL_VERSION = '1.0'
const REGISTER_PATH = '035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.json'

interface ClusterEntry {
  cluster_id: string
  cluster_label: string
  dominant_domain: string
  sub_domains: string[]
  signal_ids: string[]
  chunk_ids?: string[]
  centroid_method?: string
  cluster_size_n: number
  pass_1_actor?: string
  confidence: string | number
  significance: string | number
  annotation?: string
  ledger_event_ids?: string[]
  created_at?: string
  created_by_session?: string
  [key: string]: unknown
}

interface ClusterAtlas {
  schema?: string
  version: string
  produced_by_session?: string
  produced_at?: string
  clusters: ClusterEntry[]
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
      reason: 'DISCOVERY_CLUSTER_ENABLED=false',
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

  if (!getFlag('DISCOVERY_CLUSTER_ENABLED')) {
    return disabledBundle(start)
  }

  const raw = await getStorageClient().readFile(REGISTER_PATH)
  const register = JSON.parse(raw) as ClusterAtlas

  let clusters = register.clusters

  // Domain filter: dominant_domain match OR sub_domains intersection
  if (plan.domains.length > 0) {
    clusters = clusters.filter(
      c =>
        plan.domains.includes(c.dominant_domain) ||
        c.sub_domains?.some(d => plan.domains.includes(d))
    )
  }

  // graph_seed_hints: preferred clusters come first; others are not excluded
  if (plan.graph_seed_hints && plan.graph_seed_hints.length > 0) {
    const hints = plan.graph_seed_hints
    const preferred = clusters.filter(c => hints.includes(c.cluster_id))
    const rest = clusters.filter(c => !hints.includes(c.cluster_id))
    clusters = [...preferred, ...rest]
  }

  const results: ToolBundleResult[] = clusters.map(cluster => ({
    content: `${cluster.cluster_label}: ${cluster.annotation ?? 'No annotation'}\nDominant domain: ${cluster.dominant_domain}\nCluster size: ${cluster.cluster_size_n} signals`,
    source_canonical_id: 'CLUSTER_ATLAS',
    source_version: register.version,
    confidence: parseFloat(String(cluster.confidence)),
    significance: parseFloat(String(cluster.significance)),
    signal_id: cluster.cluster_id,
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
      graph_seed_hints: plan.graph_seed_hints ?? [],
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
      `cluster_atlas produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
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
