/**
 * MARSYS-JIS Stream A — Tool: cgm_graph_walk
 *
 * BFS traversal over the CGM graph (rag_graph_nodes + rag_graph_edges).
 * Starts from seed nodes supplied in QueryPlan.graph_seed_hints and expands
 * up to graph_traversal_depth levels, batch-fetching edges and node metadata
 * at each level (one SQL call per table per level, not N individual queries).
 *
 * Returns a validated ToolBundle. If the feature flag is disabled or no seeds
 * are supplied, returns an empty ToolBundle immediately without touching the DB.
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import { getFlag, configService } from '@/lib/config'
import {
  CGM_GRAPH_WALK_MAX_DEPTH_KEY,
  CGM_GRAPH_WALK_MAX_DEPTH_DEFAULT,
} from '@/lib/config/feature_flags'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'cgm_graph_walk'
const TOOL_VERSION = '1.0.0'
const DEFAULT_NATIVE_ID = 'abhisek_mohanty'

// ---------------------------------------------------------------------------
// SQL templates
// ---------------------------------------------------------------------------

const SQL_FETCH_EDGES = `
  SELECT source_node_id, target_node_id, edge_type, weight
  FROM rag_graph_edges
  WHERE native_id = $1
    AND source_node_id = ANY($2::text[])
    AND ($3::text[] IS NULL OR edge_type = ANY($3::text[]))
`.trim()

const SQL_FETCH_NODES = `
  SELECT node_id, node_type, metadata
  FROM rag_graph_nodes
  WHERE native_id = $1
    AND node_id = ANY($2::text[])
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

// ---------------------------------------------------------------------------
// Core retrieve function
// ---------------------------------------------------------------------------

async function retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()

  // --- Feature flag gate ---
  if (!getFlag('CGM_GRAPH_WALK_ENABLED')) {
    return buildEmptyBundle(start, plan, params)
  }

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
    const { rows: edgeRows } = await storage.query<EdgeRow>(SQL_FETCH_EDGES, [
      nativeId,
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
    const { rows: nodeRows } = await storage.query<NodeRow>(SQL_FETCH_NODES, [
      nativeId,
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

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
