import type { TraceDocument } from '@/lib/admin/trace_assembler'

export const MOCK_TRACE: TraceDocument = {
  query: {
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    text: 'What is the transit of Jupiter for this year?',
    type: 'holistic',
    confidence: 0.87,
    total_ms: 2300,
    total_cost_usd: 0.0042,
    health: 'HEALTHY',
  },
  classify: {
    input: null,
    alternatives: [
      { type: 'holistic', confidence: 0.87, rationale: 'Full chart reading requested' },
      { type: 'temporal', confidence: 0.09, rationale: 'Transit mentioned' },
      { type: 'remedial', confidence: 0.04, rationale: null },
    ],
    decision_reasoning: 'Query spans multiple domains; holistic selected.',
    latency_ms: 320,
    tokens: { input: 120, output: 80 },
  },
  plan: {
    included_bundles: [
      { name: 'cgm_bundle', rationale: 'Chart geometry needed', expected_recall: 0.9 },
      { name: 'msr_bundle', rationale: 'Signal state needed', expected_recall: 0.8 },
    ],
    excluded_bundles: [
      { name: 'remedial_bundle', rationale: 'No remedial intent' },
    ],
    plan_json: { version: 1, bundles: ['cgm_bundle', 'msr_bundle'] },
    latency_ms: 450,
  },
  fetches: [
    {
      bundle: 'cgm_bundle',
      step_order: 0,
      raw_count: 25,
      kept_count: 18,
      dropped_items: [
        { item_id: 'cgm-001', score: 0.3, drop_reason: 'LOW_RELEVANCE' },
        { item_id: 'cgm-002', score: 0.25, drop_reason: 'LOW_RELEVANCE' },
      ],
      kept_items: [
        { item_id: 'cgm-003', score: 0.92, contribution_tokens: 120 },
        { item_id: 'cgm-004', score: 0.88, contribution_tokens: 95 },
      ],
      latency_ms: 180,
      error_class: 'OK',
    },
    {
      bundle: 'msr_bundle',
      step_order: 1,
      raw_count: 10,
      kept_count: 0,
      dropped_items: [],
      kept_items: [],
      latency_ms: 90,
      error_class: 'OK',
    },
  ],
  context_assembly: {
    items: [
      {
        rank: 1,
        source_bundle: 'cgm_bundle',
        source_item_id: 'cgm-003',
        layer: 'L1',
        token_cost: 120,
        relevance_score: 0.92,
        status: 'INCLUDED',
        drop_reason: null,
        cumulative_tokens: 120,
        budget: 4000,
      },
      {
        rank: 2,
        source_bundle: 'cgm_bundle',
        source_item_id: 'cgm-004',
        layer: 'L2_5',
        token_cost: 95,
        relevance_score: 0.88,
        status: 'INCLUDED',
        drop_reason: null,
        cumulative_tokens: 215,
        budget: 4000,
      },
      {
        rank: 3,
        source_bundle: 'msr_bundle',
        source_item_id: 'msr-001',
        layer: 'L1',
        token_cost: 200,
        relevance_score: 0.4,
        status: 'TRUNCATED',
        drop_reason: 'TOKEN_BUDGET',
        cumulative_tokens: 415,
        budget: 4000,
      },
      {
        rank: 4,
        source_bundle: 'msr_bundle',
        source_item_id: 'msr-002',
        layer: 'L2_5',
        token_cost: 300,
        relevance_score: 0.2,
        status: 'DROPPED',
        drop_reason: 'LOW_RELEVANCE',
        cumulative_tokens: 415,
        budget: 4000,
      },
    ],
    token_ledger: {
      total: 215,
      budget: 4000,
      preamble: 50,
      L1: 120,
      L2_5: 95,
      dropped_count: 1,
      truncated_count: 1,
    },
  },
  synthesis: {
    model: 'claude-sonnet-4-6',
    input_tokens: 1500,
    output_tokens: 420,
    latency_ms: 1200,
    scorecard: {
      composite_score: 0.82,
      citation_density: 0.75,
      failures: [],
    },
  },
  baselines: {
    p50_total_latency_ms: 1800,
    p95_total_latency_ms: 3200,
    p50_total_cost_usd: 0.003,
    p95_total_cost_usd: 0.008,
    sample_size: 100,
  },
  anomalies: [],
  partial: false,
}

export const DEGRADED_TRACE: TraceDocument = {
  ...MOCK_TRACE,
  query: { ...MOCK_TRACE.query, health: 'DEGRADED' },
}

export const FAILED_TRACE: TraceDocument = {
  ...MOCK_TRACE,
  query: { ...MOCK_TRACE.query, health: 'FAILED' },
  fetches: [
    { ...MOCK_TRACE.fetches[0], error_class: 'DB_TIMEOUT' },
  ],
}
