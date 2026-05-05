/**
 * MARSYS-JIS Stream A — Tool: cgm_graph_walk
 *
 * BFS traversal over the CGM graph (l25_cgm_nodes + l25_cgm_edges).
 * Starts from seed nodes supplied in QueryPlan.graph_seed_hints and expands
 * up to graph_traversal_depth levels, batch-fetching edges and node metadata
 * at each level (one SQL call per table per level, not N individual queries).
 *
 * Returns a validated ToolBundle. If the feature flag is disabled or no seeds
 * are supplied, returns an empty ToolBundle immediately without touching the DB.
 *
 * Table routing note: Phase 14D introduced l25_cgm_nodes / l25_cgm_edges as the
 * authoritative CGM structured tables (migration 018). The original rag_graph_nodes /
 * rag_graph_edges tables (migration 005) are never populated by the build pipeline
 * and are reserved for a future cross-native graph layer. All BFS queries target
 * l25_cgm_* exclusively. Column aliases: strength → weight, properties → metadata.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { configService } from '@/lib/config'
import {
  CGM_GRAPH_WALK_MAX_DEPTH_KEY,
  CGM_GRAPH_WALK_MAX_DEPTH_DEFAULT,
} from '@/lib/config/feature_flags'
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'cgm_graph_walk'
const TOOL_VERSION = '1.0.0'
const DEFAULT_NATIVE_ID = 'abhisek_mohanty'

// ---------------------------------------------------------------------------
// SQL templates
// ---------------------------------------------------------------------------

// l25_cgm_edges stores weight as `strength` (NUMERIC); alias to `weight` for EdgeRow compatibility.
// No native_id column exists on l25_cgm_* tables — all rows belong to the single active native.
// $1 = frontier node IDs (text[]), $2 = edge_type filter (text[] | NULL)
const SQL_FETCH_EDGES = `
  SELECT source_node_id, target_node_id, edge_type,
         COALESCE(strength, 1.0)::float AS weight
  FROM l25_cgm_edges
  WHERE source_node_id = ANY($1::text[])
    AND ($2::text[] IS NULL OR edge_type = ANY($2::text[]))
    AND status = 'valid'
`.trim()

// l25_cgm_nodes stores node payload as `properties` (JSONB); alias to `metadata` for NodeRow compatibility.
// $1 = node IDs to hydrate (text[])
const SQL_FETCH_NODES = `
  SELECT node_id, node_type, properties AS metadata
  FROM l25_cgm_nodes
  WHERE node_id = ANY($1::text[])
`.trim()

// Fallback: when BFS yields 0 results for a seed node that has no edges,
// surface the top-5 MSR signals whose planet OR domain matches the seed names.
// $1 = native_id, $2 = seed node names (text[])
const SQL_FALLBACK_MSR = `
  SELECT signal_id, claim_text, domain, confidence
  FROM msr_signals
  WHERE native_id = $1
    AND (planet = ANY($2::text[]) OR domain = ANY($2::text[]))
  ORDER BY confidence DESC
  LIMIT 5
`.trim()

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

interface EdgeRow {
  source_node_id: string
  target_node_id: string
  edge_type: string
  weight: number
}

interface NodeRow {
  node_id: string
  node_type: string
  metadata: Record<string, unknown> | null
}

interface MsrFallbackRow {
  signal_id: string
  claim_text: string
  domain: string
  confidence: number
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
      data_asset_id: 'CGM_GRAPH',
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
  // CGM_GRAPH_WALK_ENABLED retired BHISMA-B1 §6.2: always-on; gate removed.

  // --- Seed validation ---
  const seeds: string[] =
    plan.graph_seed_hints && plan.graph_seed_hints.length > 0 ? plan.graph_seed_hints : []
  if (seeds.length === 0) {
    return buildEmptyBundle(start, plan, params)
  }

  // --- Depth resolution ---
  const maxDepthFromConfig = configService.getValue(
    CGM_GRAPH_WALK_MAX_DEPTH_KEY,
    CGM_GRAPH_WALK_MAX_DEPTH_DEFAULT
  ) as number
  const requestedDepth =
    typeof plan.graph_traversal_depth === 'number' && plan.graph_traversal_depth >= 1
      ? plan.graph_traversal_depth
      : 1
  const depth = Math.min(requestedDepth, maxDepthFromConfig)

  // --- Edge type filter ---
  const edgeTypeFilter: string[] | null =
    Array.isArray(params?.edge_type_filter) && (params.edge_type_filter as string[]).length > 0
      ? (params.edge_type_filter as string[])
      : null

  const nativeId = (params?.native_id as string | undefined) ?? DEFAULT_NATIVE_ID
  const storage = getStorageClient()

  // --- BFS ---
  const visited = new Set<string>(seeds)
  let frontier: string[] = [...seeds]
  const results: ToolBundleResult[] = []

  for (let level = 0; level < depth; level++) {
    if (frontier.length === 0) break

    // Batch-fetch edges for all frontier nodes in one query
    // Params: $1=frontier node IDs, $2=edge_type filter (or null)
    const { rows: edgeRows } = await storage.query<EdgeRow>(SQL_FETCH_EDGES, [
      frontier,
      edgeTypeFilter,
    ])

    // Collect unvisited targets
    const nextFrontier: string[] = []
    const newTargets: string[] = []
    for (const edge of edgeRows) {
      if (!visited.has(edge.target_node_id)) {
        visited.add(edge.target_node_id)
        nextFrontier.push(edge.target_node_id)
        newTargets.push(edge.target_node_id)
      }
    }

    if (newTargets.length === 0) {
      frontier = nextFrontier
      continue
    }

    // Batch-fetch node metadata for newly discovered targets
    // Params: $1=node IDs to hydrate
    const { rows: nodeRows } = await storage.query<NodeRow>(SQL_FETCH_NODES, [
      newTargets,
    ])

    // Build a lookup map for fast access
    const nodeMap = new Map<string, NodeRow>()
    for (const node of nodeRows) {
      nodeMap.set(node.node_id, node)
    }

    // Build result entries — one per newly-discovered target node (first edge wins)
    const emittedTargets = new Set<string>()
    for (const edge of edgeRows) {
      if (!newTargets.includes(edge.target_node_id)) continue
      if (emittedTargets.has(edge.target_node_id)) continue
      emittedTargets.add(edge.target_node_id)
      const targetNode = nodeMap.get(edge.target_node_id)
      const entry = {
        from: edge.source_node_id,
        to: edge.target_node_id,
        edge_type: edge.edge_type,
        level,
        target_node_type: targetNode?.node_type ?? null,
        target_metadata: targetNode?.metadata ?? null,
      }
      results.push({
        content: JSON.stringify(entry),
        source_canonical_id: 'CGM_GRAPH',
        signal_id: edge.target_node_id,
      })
    }

    frontier = nextFrontier
  }

  // --- Fallback: if BFS yielded zero results, surface MSR signals for the seed nodes ---
  let fallback_used = false
  if (results.length === 0) {
    console.warn(
      JSON.stringify({
        event: 'cgm_graph_walk_zero_rows_fallback',
        seeds,
        depth,
        msg: 'BFS returned 0 results; falling back to MSR signals for seed nodes',
      }),
    )
    try {
      const { rows: fallbackRows } = await storage.query<MsrFallbackRow>(SQL_FALLBACK_MSR, [
        nativeId,
        seeds,
      ])
      for (const row of fallbackRows) {
        results.push({
          content: `[CGM_FALLBACK] ${row.claim_text}`,
          source_canonical_id: 'MSR',
          signal_id: row.signal_id,
          confidence: Number(row.confidence),
        })
      }
      fallback_used = fallbackRows.length > 0
    } catch (fallbackErr) {
      console.warn(
        `[cgm_graph_walk] MSR fallback query failed: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`,
      )
    }
  }

  // --- Build and validate bundle ---
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
      native_id: nativeId,
      seeds,
      depth,
      edge_type_filter: edgeTypeFilter,
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
      `cgm_graph_walk produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
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
    data_asset_id: 'CGM_GRAPH',
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

// ---------------------------------------------------------------------------
// Helper: empty bundle (no DB call, no latency recording)
// ---------------------------------------------------------------------------

function buildEmptyBundle(
  start: number,
  plan: QueryPlan,
  params?: Record<string, unknown>
): ToolBundle {
  const nativeId = (params?.native_id as string | undefined) ?? DEFAULT_NATIVE_ID
  const latency_ms = Date.now() - start

  const result_hash =
    'sha256:' + crypto.createHash('sha256').update(JSON.stringify([])).digest('hex')

  const bundle: ToolBundle = {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      native_id: nativeId,
      seeds: plan.graph_seed_hints ?? [],
      depth: plan.graph_traversal_depth ?? 1,
      edge_type_filter: null,
    },
    results: [],
    served_from_cache: false,
    latency_ms,
    result_hash,
    schema_version: '1.0',
  }

  const validation = validate('tool_bundle', bundle)
  if (!validation.valid) {
    throw new Error(
      `cgm_graph_walk produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
    )
  }

  void writeToolExecutionLog({
    query_id: plan.query_plan_id,
    tool_name: TOOL_NAME,
    params_json: bundle.invocation_params as Record<string, unknown>,
    status: 'zero_rows',
    rows_returned: 0,
    latency_ms,
    token_estimate: 0,
    data_asset_id: 'CGM_GRAPH',
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
