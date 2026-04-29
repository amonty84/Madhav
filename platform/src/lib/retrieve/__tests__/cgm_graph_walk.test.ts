import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks must be declared before module imports
vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

vi.mock('@/lib/schemas', () => ({
  validate: vi.fn().mockReturnValue({ valid: true }),
}))

vi.mock('@/lib/config', () => ({
  getFlag: vi.fn().mockReturnValue(true),
  configService: { getValue: vi.fn().mockReturnValue(3) },
}))

import { getStorageClient } from '@/lib/storage'
import { getFlag, configService } from '@/lib/config'
import { tool } from '../cgm_graph_walk'
import type { QueryPlan } from '../types'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const mockQuery = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000001',
  query_text: 'How do career and psychology cross-link in the CGM?',
  query_class: 'cross_domain',
  domains: ['career', 'psychology'],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['cgm_graph_walk'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'three_interpretation',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
  graph_seed_hints: ['node-seed-1'],
  graph_traversal_depth: 1,
}

const makeEdgeRow = (
  source: string,
  target: string,
  edge_type = 'SUPPORTS',
  weight = 0.8
) => ({ source_node_id: source, target_node_id: target, edge_type, weight })

const makeNodeRow = (node_id: string, node_type = 'signal', metadata = { label: node_id }) => ({
  node_id,
  node_type,
  metadata,
})

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getFlag).mockReturnValue(true)
  vi.mocked(configService.getValue).mockReturnValue(3)
  vi.mocked(getStorageClient).mockReturnValue({
    query: mockQuery,
    transaction: vi.fn(),
    readObject: vi.fn(),
    writeObject: vi.fn(),
    objectExists: vi.fn(),
    readFile: vi.fn(),
    fileExists: vi.fn(),
    listFiles: vi.fn(),
  })
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('cgm_graph_walk tool', () => {
  it('returns empty ToolBundle when feature flag disabled', async () => {
    vi.mocked(getFlag).mockReturnValue(false)

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(0)
    expect(bundle.tool_name).toBe('cgm_graph_walk')
    // No DB call should have been made
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('returns empty ToolBundle when no seed hints', async () => {
    const plan: QueryPlan = { ...basePlan, graph_seed_hints: [] }

    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(0)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('returns empty ToolBundle when graph_seed_hints is undefined', async () => {
    const { graph_seed_hints: _dropped, ...planWithoutSeeds } = basePlan
    const plan = planWithoutSeeds as QueryPlan

    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(0)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('BFS depth 1: returns adjacent nodes', async () => {
    // Level 0: edges from seed
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          makeEdgeRow('node-seed-1', 'node-a'),
          makeEdgeRow('node-seed-1', 'node-b'),
          makeEdgeRow('node-seed-1', 'node-c'),
        ],
      })
      // Batch node metadata fetch for [node-a, node-b, node-c]
      .mockResolvedValueOnce({
        rows: [
          makeNodeRow('node-a'),
          makeNodeRow('node-b', 'fact'),
          makeNodeRow('node-c', 'chunk'),
        ],
      })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(3)

    const parsed = bundle.results.map(r => JSON.parse(r.content))
    expect(parsed[0].from).toBe('node-seed-1')
    expect(parsed[0].to).toBe('node-a')
    expect(parsed[0].level).toBe(0)
    expect(parsed[0].edge_type).toBe('SUPPORTS')
    expect(parsed[0].target_node_type).toBe('signal')

    expect(parsed[1].to).toBe('node-b')
    expect(parsed[1].target_node_type).toBe('fact')

    expect(parsed[2].to).toBe('node-c')
    expect(parsed[2].target_node_type).toBe('chunk')

    // signal_id should be the target node id
    expect(bundle.results[0].signal_id).toBe('node-a')
    expect(bundle.results[0].source_canonical_id).toBe('CGM_GRAPH')
  })

  it('BFS depth 2: expands frontier', async () => {
    const plan: QueryPlan = { ...basePlan, graph_traversal_depth: 2 }

    // Level 0: 2 edges from seed
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          makeEdgeRow('node-seed-1', 'node-a'),
          makeEdgeRow('node-seed-1', 'node-b'),
        ],
      })
      .mockResolvedValueOnce({
        rows: [makeNodeRow('node-a'), makeNodeRow('node-b')],
      })
      // Level 1: 2 edges from [node-a, node-b]
      .mockResolvedValueOnce({
        rows: [
          makeEdgeRow('node-a', 'node-c'),
          makeEdgeRow('node-b', 'node-d'),
        ],
      })
      .mockResolvedValueOnce({
        rows: [makeNodeRow('node-c'), makeNodeRow('node-d')],
      })

    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(4)

    const levels = bundle.results.map(r => JSON.parse(r.content).level)
    expect(levels.filter(l => l === 0)).toHaveLength(2)
    expect(levels.filter(l => l === 1)).toHaveLength(2)

    // Verify level 1 targets are present
    const targets = bundle.results.map(r => JSON.parse(r.content).to)
    expect(targets).toContain('node-c')
    expect(targets).toContain('node-d')
  })

  it('respects edge_type_filter param', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [makeEdgeRow('node-seed-1', 'node-x', 'CONTRADICTS')] })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-x')] })

    await tool.retrieve(basePlan, { edge_type_filter: ['CONTRADICTS', 'CROSS_LINKS'] })

    // First query call is the edges fetch; $2 param (index 1) is the edge_type filter
    // (nativeId no longer passed to SQL — l25_cgm_edges has no native_id column)
    const edgesCallArgs = mockQuery.mock.calls[0]
    expect(edgesCallArgs[1][1]).toEqual(['CONTRADICTS', 'CROSS_LINKS'])
  })

  it('passes null edge_type_filter when not provided', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [makeEdgeRow('node-seed-1', 'node-x')] })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-x')] })

    await tool.retrieve(basePlan)

    // $2 param (index 1) should be null when no filter provided
    const edgesCallArgs = mockQuery.mock.calls[0]
    expect(edgesCallArgs[1][1]).toBeNull()
  })

  it('returns valid ToolBundle schema fields', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [makeEdgeRow('node-seed-1', 'node-a')] })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-a')] })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('cgm_graph_walk')
    expect(bundle.tool_version).toBe('1.0.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(bundle.cache_key).toBeUndefined()
    expect(typeof bundle.tool_bundle_id).toBe('string')
    expect(typeof bundle.latency_ms).toBe('number')
    expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
  })

  it('depth is capped at max depth from config', async () => {
    // Config returns max depth of 2; plan requests 5
    vi.mocked(configService.getValue).mockReturnValue(2)
    const plan: QueryPlan = { ...basePlan, graph_traversal_depth: 5 }

    // Two levels of BFS calls (level 0 + level 1), then no more
    mockQuery
      // Level 0 edges
      .mockResolvedValueOnce({ rows: [makeEdgeRow('node-seed-1', 'node-a')] })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-a')] })
      // Level 1 edges
      .mockResolvedValueOnce({ rows: [makeEdgeRow('node-a', 'node-b')] })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-b')] })

    const bundle = await tool.retrieve(plan)

    // Only 2 levels executed despite depth=5 in the plan
    // 2 edge queries + 2 node queries = 4 total DB calls
    expect(mockQuery).toHaveBeenCalledTimes(4)
    expect(bundle.results).toHaveLength(2)

    const levels = bundle.results.map(r => JSON.parse(r.content).level)
    expect(levels).toContain(0)
    expect(levels).toContain(1)
    // Level 2 should never appear
    expect(levels).not.toContain(2)
  })

  it('does not revisit already-visited nodes', async () => {
    // Both edges from the seed go to the same target
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          makeEdgeRow('node-seed-1', 'node-a'),
          makeEdgeRow('node-seed-1', 'node-a'), // duplicate target
        ],
      })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-a')] })

    const bundle = await tool.retrieve(basePlan)

    // node-a should only appear once in results
    const targets = bundle.results.map(r => JSON.parse(r.content).to)
    expect(targets.filter(t => t === 'node-a')).toHaveLength(1)
  })

  it('stops early when frontier becomes empty', async () => {
    const plan: QueryPlan = { ...basePlan, graph_traversal_depth: 3 }

    // Level 0 returns one edge
    mockQuery
      .mockResolvedValueOnce({ rows: [makeEdgeRow('node-seed-1', 'node-a')] })
      .mockResolvedValueOnce({ rows: [makeNodeRow('node-a')] })
      // Level 1: no edges from node-a (dead end)
      .mockResolvedValueOnce({ rows: [] })

    const bundle = await tool.retrieve(plan)

    // Only 3 DB calls: 2 for level 0, 1 edge query for level 1 (no nodes to fetch)
    expect(mockQuery).toHaveBeenCalledTimes(3)
    expect(bundle.results).toHaveLength(1)
  })
})
