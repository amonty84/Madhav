import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/admin/baseline_resolver', () => ({
  resolveBaseline: vi.fn(() =>
    Promise.resolve({ p50_total_latency_ms: 800, p95_total_latency_ms: 2000,
                      p50_total_cost_usd: 0.002, p95_total_cost_usd: 0.01, sample_size: 50 })
  ),
}))

import { assembleTrace } from '@/lib/admin/trace_assembler'
import type { StorageClient } from '@/lib/storage/types'

const QUERY_ID = 'cccccccc-0000-0000-0000-000000000001'

// Build a mock StorageClient whose query() dispatches on the SQL text
function makeDb(overrides: Record<string, unknown[]> = {}): StorageClient {
  const responses: Record<string, unknown[]> = {
    llm_call_log: [
      {
        id: 'llm-1',
        call_stage: 'planner',
        model_id: 'gemini-1.5-pro',
        input_tokens: 1200,
        output_tokens: 300,
        latency_ms: 820,
        cost_usd: '0.0025',
        decision_alternatives: null,
        decision_reasoning: null,
        payload: null,
      },
      {
        id: 'llm-2',
        call_stage: 'synthesis',
        model_id: 'gemini-1.5-pro',
        input_tokens: 8000,
        output_tokens: 1200,
        latency_ms: 3100,
        cost_usd: '0.0180',
        decision_alternatives: null,
        decision_reasoning: null,
        payload: null,
      },
    ],
    tool_execution_log: [
      {
        id: 'tool-1',
        tool_name: 'msr_sql',
        raw_result_count: 45,
        kept_result_count: 45,
        dropped_items: [],
        kept_items: [],
        latency_ms: 120,
        error_class: 'OK',
        rows_returned: 45,
      },
    ],
    plan_alternatives_log: [
      { bundle_name: 'msr_sql', was_selected: true, rationale: 'career query', expected_recall_score: 0.9 },
    ],
    context_assembly_item_log: [
      {
        item_rank: 0,
        source_bundle: 'L1',
        source_item_id: 'FORENSIC',
        layer: 'L1',
        token_cost: 1200,
        relevance_score: null,
        status: 'INCLUDED',
        drop_reason: null,
        cumulative_tokens_at_decision: 0,
        budget_at_decision: 12000,
      },
      {
        item_rank: 1,
        source_bundle: 'L2_5',
        source_item_id: 'MSR',
        layer: 'L2_5',
        token_cost: 4500,
        relevance_score: null,
        status: 'INCLUDED',
        drop_reason: null,
        cumulative_tokens_at_decision: 1200,
        budget_at_decision: 12000,
      },
    ],
    synthesis_quality_scorecard: [
      { composite_score: 0.82, citation_density: 0.75, failures: null },
    ],
    query_plan_log: [
      {
        query_text: 'Tell me about career',
        query_class: 'interpretive',
        plan_json: { tool_calls: [] },
        planner_latency_ms: 820,
      },
    ],
    ...overrides,
  }

  return {
    query: vi.fn((sql: string) => {
      const tableMatch = Object.keys(responses).find(t => sql.includes(t))
      const rows = tableMatch ? responses[tableMatch] : []
      return Promise.resolve({ rows, rowCount: rows.length })
    }),
    transaction: vi.fn(),
    readObject: vi.fn(),
    writeObject: vi.fn(),
    objectExists: vi.fn(),
    readFile: vi.fn(),
    fileExists: vi.fn(),
    listFiles: vi.fn(),
  } as unknown as StorageClient
}

describe('assembleTrace', () => {
  beforeEach(() => vi.clearAllMocks())

  it('full data: returns TraceDocument with all sections populated', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb())
    expect(doc.query.id).toBe(QUERY_ID)
    expect(doc.query.health).toBe('HEALTHY')
    expect(doc.plan).not.toBeNull()
    expect(doc.plan!.included_bundles).toHaveLength(1)
    expect(doc.fetches).toHaveLength(1)
    expect(doc.fetches[0].bundle).toBe('msr_sql')
    expect(doc.context_assembly).not.toBeNull()
    expect(doc.context_assembly!.items).toHaveLength(2)
    expect(doc.synthesis).not.toBeNull()
    expect(doc.baselines).not.toBeNull()
    expect(doc.partial).toBe(false)
  })

  it('partial data: no context_assembly rows → partial: true', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb({ context_assembly_item_log: [] }))
    expect(doc.partial).toBe(true)
    expect(doc.context_assembly).toBeNull()
  })

  it('non-existent query_id: all sections null/empty, partial: true', async () => {
    const emptyDb: StorageClient = {
      query: vi.fn(() => Promise.resolve({ rows: [], rowCount: 0 })),
      transaction: vi.fn(),
      readObject: vi.fn(),
      writeObject: vi.fn(),
      objectExists: vi.fn(),
      readFile: vi.fn(),
      fileExists: vi.fn(),
      listFiles: vi.fn(),
    } as unknown as StorageClient
    const doc = await assembleTrace('00000000-dead-beef-0000-000000000000', emptyDb)
    expect(doc.partial).toBe(true)
    expect(doc.classify).toBeNull()
    expect(doc.plan).toBeNull()
    expect(doc.fetches).toHaveLength(0)
    expect(doc.context_assembly).toBeNull()
    expect(doc.synthesis).toBeNull()
  })

  it('health = FAILED when a fetch has error_class !== OK', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb({
      tool_execution_log: [{
        id: 'tool-1',
        tool_name: 'msr_sql',
        raw_result_count: 0,
        kept_result_count: 0,
        dropped_items: [],
        kept_items: [],
        latency_ms: 5000,
        error_class: 'TIMEOUT',
        rows_returned: 0,
      }],
    }))
    expect(doc.query.health).toBe('FAILED')
  })

  it('detector 1: plan latency > 2× p50 → WARNING anomaly', async () => {
    // p50 = 800ms (from mocked baseline_resolver); plan latency = 820ms → ~1.025× → no anomaly
    // Override plan latency to 2000ms → 2.5× p50 → anomaly
    const doc = await assembleTrace(QUERY_ID, makeDb({
      query_plan_log: [{
        query_text: 'Tell me about career',
        query_class: 'interpretive',
        plan_json: {},
        planner_latency_ms: 2000,
      }],
      llm_call_log: [{
        id: 'llm-1',
        call_stage: 'planner',
        model_id: 'gemini-1.5-pro',
        input_tokens: 1200,
        output_tokens: 300,
        latency_ms: 2000,  // 2.5× p50 (800ms)
        cost_usd: '0.002',
        decision_alternatives: null,
        decision_reasoning: null,
        payload: null,
      }],
    }))
    const warning = doc.anomalies.find(a => a.stage === 'plan' && a.severity === 'WARNING')
    expect(warning).toBeDefined()
    expect(warning!.message).toContain('p50')
  })

  it('detector 2: fetch error_class !== OK → ERROR anomaly', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb({
      tool_execution_log: [{
        id: 'tool-1',
        tool_name: 'vector_search',
        raw_result_count: 0,
        kept_result_count: 0,
        dropped_items: [],
        kept_items: [],
        latency_ms: 100,
        error_class: 'TIMEOUT',
        rows_returned: 0,
      }],
    }))
    const err = doc.anomalies.find(a => a.severity === 'ERROR' && a.stage === 'fetch')
    expect(err).toBeDefined()
    expect(err!.message).toContain('TIMEOUT')
  })

  it('detector 3: fetch with kept_count = 0 → WARNING anomaly', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb({
      tool_execution_log: [{
        id: 'tool-1',
        tool_name: 'msr_sql',
        raw_result_count: 0,
        kept_result_count: 0,
        dropped_items: [],
        kept_items: [],
        latency_ms: 80,
        error_class: 'OK',
        rows_returned: 0,
      }],
    }))
    const warn = doc.anomalies.find(a => a.severity === 'WARNING' && a.message.includes('0 items'))
    expect(warn).toBeDefined()
  })

  it('detector 4: context assembly dropped >30% → WARNING', async () => {
    // 4 items: 2 included, 3 dropped → 3/5 = 60% dropped
    const doc = await assembleTrace(QUERY_ID, makeDb({
      context_assembly_item_log: [
        { item_rank: 0, source_bundle: 'L1', source_item_id: 'FORENSIC', layer: 'L1',
          token_cost: 1200, relevance_score: null, status: 'INCLUDED', drop_reason: null,
          cumulative_tokens_at_decision: 0, budget_at_decision: 2000 },
        { item_rank: 1, source_bundle: 'L2_5', source_item_id: 'MSR', layer: 'L2_5',
          token_cost: 800, relevance_score: null, status: 'INCLUDED', drop_reason: null,
          cumulative_tokens_at_decision: 1200, budget_at_decision: 2000 },
        { item_rank: 2, source_bundle: 'L2_5', source_item_id: 'UCN', layer: 'L2_5',
          token_cost: 600, relevance_score: null, status: 'DROPPED', drop_reason: 'BUDGET_EXCEEDED',
          cumulative_tokens_at_decision: 2000, budget_at_decision: 2000 },
        { item_rank: 3, source_bundle: 'L2_5', source_item_id: 'CGM', layer: 'L2_5',
          token_cost: 500, relevance_score: null, status: 'DROPPED', drop_reason: 'BUDGET_EXCEEDED',
          cumulative_tokens_at_decision: 2000, budget_at_decision: 2000 },
        { item_rank: 4, source_bundle: 'L2_5', source_item_id: 'CDLM', layer: 'L2_5',
          token_cost: 400, relevance_score: null, status: 'DROPPED', drop_reason: 'BUDGET_EXCEEDED',
          cumulative_tokens_at_decision: 2000, budget_at_decision: 2000 },
      ],
    }))
    const warn = doc.anomalies.find(a => a.severity === 'WARNING' && a.message.includes('budget pressure'))
    expect(warn).toBeDefined()
  })

  it('detector 5: low citation_density in scorecard → WARNING', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb({
      synthesis_quality_scorecard: [
        { composite_score: 0.7, citation_density: 0.3, failures: null },
      ],
    }))
    const warn = doc.anomalies.find(a => a.severity === 'WARNING' && a.message.includes('citation density'))
    expect(warn).toBeDefined()
  })

  it('token_ledger correctly partitions L1 and L2_5 totals', async () => {
    const doc = await assembleTrace(QUERY_ID, makeDb())
    expect(doc.context_assembly!.token_ledger.L1).toBe(1200)
    expect(doc.context_assembly!.token_ledger.L2_5).toBe(4500)
    expect(doc.context_assembly!.token_ledger.total).toBe(5700)
  })
})
