import { describe, it, expect } from 'vitest'
import { detectAnomalies, buildHealthSummary } from '@/lib/admin/anomaly_detector'
import type { TraceDocument } from '@/lib/admin/trace_assembler'

// Minimal valid trace with no anomaly triggers
function makeTrace(overrides: Partial<TraceDocument> = {}): TraceDocument {
  return {
    query: {
      id: 'test-id',
      text: 'test query',
      type: 'holistic',
      confidence: 0.9,
      total_ms: 1500,
      total_cost_usd: 0.003,
      health: 'HEALTHY',
    },
    classify: {
      input: null,
      alternatives: [],
      decision_reasoning: null,
      latency_ms: 200,
      tokens: { input: 100, output: 50 },
    },
    plan: {
      included_bundles: [{ name: 'cgm_bundle', rationale: null, expected_recall: 0.9 }],
      excluded_bundles: [],
      plan_json: null,
      latency_ms: 300,
    },
    fetches: [
      {
        bundle: 'cgm_bundle',
        step_order: 0,
        raw_count: 10,
        kept_count: 8,
        dropped_items: [],
        kept_items: [],
        latency_ms: 150,
        error_class: 'OK',
      },
    ],
    context_assembly: {
      items: [
        {
          rank: 1, source_bundle: 'cgm_bundle', source_item_id: 'item-1',
          layer: 'L1', token_cost: 100, relevance_score: 0.9,
          status: 'INCLUDED', drop_reason: null, cumulative_tokens: 100, budget: 4000,
        },
        {
          rank: 2, source_bundle: 'cgm_bundle', source_item_id: 'item-2',
          layer: 'L2_5', token_cost: 80, relevance_score: 0.7,
          status: 'INCLUDED', drop_reason: null, cumulative_tokens: 180, budget: 4000,
        },
      ],
      token_ledger: {
        total: 180, budget: 4000, preamble: 50, L1: 100, L2_5: 80,
        dropped_count: 0, truncated_count: 0,
      },
    },
    synthesis: {
      model: 'claude-sonnet-4-6',
      input_tokens: 1000,
      output_tokens: 300,
      latency_ms: 800,
      scorecard: { composite_score: 0.82, citation_density: 0.75, failures: [] },
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
    ...overrides,
  }
}

describe('detectAnomalies', () => {
  it('returns empty array for a clean, healthy trace', () => {
    const result = detectAnomalies(makeTrace())
    expect(result).toHaveLength(0)
  })

  it('detects plan latency outlier at WARNING when ratio 2–3× p50', () => {
    const trace = makeTrace({
      plan: {
        included_bundles: [{ name: 'cgm_bundle', rationale: null, expected_recall: 0.9 }],
        excluded_bundles: [],
        plan_json: null,
        latency_ms: 4000, // 4000 / 1800 ≈ 2.22×
      },
    })
    const result = detectAnomalies(trace)
    const planAnomaly = result.find(a => a.stage === 'plan')
    expect(planAnomaly).toBeDefined()
    expect(planAnomaly!.severity).toBe('WARNING')
    expect(planAnomaly!.step_id).toBe('plan')
    expect(planAnomaly!.metric?.ratio).toBeGreaterThan(2)
  })

  it('detects plan latency outlier at ERROR when ratio > 3× p50', () => {
    const trace = makeTrace({
      plan: {
        included_bundles: [],
        excluded_bundles: [],
        plan_json: null,
        latency_ms: 6000, // 6000 / 1800 ≈ 3.33×
      },
    })
    const result = detectAnomalies(trace)
    const planAnomaly = result.find(a => a.stage === 'plan')
    expect(planAnomaly!.severity).toBe('ERROR')
  })

  it('does NOT flag plan latency when ratio ≤ 2× p50', () => {
    // plan.latency_ms = 300, p50 = 1800 → ratio ≈ 0.17 — no anomaly
    const result = detectAnomalies(makeTrace())
    expect(result.find(a => a.stage === 'plan')).toBeUndefined()
  })

  it('detects failed fetch step', () => {
    const trace = makeTrace({
      fetches: [{
        bundle: 'cgm_bundle', step_order: 0, raw_count: 0, kept_count: 0,
        dropped_items: [], kept_items: [], latency_ms: 200,
        error_class: 'DB_TIMEOUT',
      }],
    })
    const result = detectAnomalies(trace)
    const fetchError = result.find(a => a.stage === 'fetch' && a.severity === 'ERROR')
    expect(fetchError).toBeDefined()
    expect(fetchError!.message).toContain('DB_TIMEOUT')
    expect(fetchError!.step_id).toBe('cgm_bundle')
  })

  it('detects empty fetch (0 raw + 0 kept, OK status)', () => {
    const trace = makeTrace({
      fetches: [{
        bundle: 'msr_bundle', step_order: 0, raw_count: 0, kept_count: 0,
        dropped_items: [], kept_items: [], latency_ms: 100, error_class: 'OK',
      }],
    })
    const result = detectAnomalies(trace)
    const emptyFetch = result.find(a => a.stage === 'fetch' && a.severity === 'WARNING')
    expect(emptyFetch).toBeDefined()
    expect(emptyFetch!.message).toContain('0 items')
    expect(emptyFetch!.step_id).toBe('msr_bundle')
  })

  it('does NOT flag empty fetch when kept_count=0 but raw_count>0', () => {
    // kept_count=0 but raw_count=5 — this means items were fetched but all dropped
    // Not the "empty fetch" condition (raw_count===0 required)
    const trace = makeTrace({
      fetches: [{
        bundle: 'cgm_bundle', step_order: 0, raw_count: 5, kept_count: 0,
        dropped_items: [], kept_items: [], latency_ms: 100, error_class: 'OK',
      }],
    })
    const result = detectAnomalies(trace)
    const emptyFetch = result.find(a => a.stage === 'fetch' && a.severity === 'WARNING')
    expect(emptyFetch).toBeUndefined()
  })

  it('detects context assembly budget pressure (>30% dropped)', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1, source_bundle: 'cgm_bundle', source_item_id: `item-${i}`,
      layer: 'L1', token_cost: 100, relevance_score: 0.5 - i * 0.04,
      status: (i < 6 ? 'INCLUDED' : 'DROPPED') as 'INCLUDED' | 'DROPPED',
      drop_reason: i >= 6 ? 'BUDGET' : null, cumulative_tokens: 100 * (i + 1), budget: 600,
    }))
    const trace = makeTrace({
      context_assembly: {
        items,
        token_ledger: { total: 600, budget: 600, preamble: 0, L1: 600, L2_5: 0, dropped_count: 4, truncated_count: 0 },
      },
    })
    const result = detectAnomalies(trace)
    const budgetAnomaly = result.find(a => a.stage === 'context_assembly' && a.message.includes('budget pressure'))
    expect(budgetAnomaly).toBeDefined()
    expect(budgetAnomaly!.severity).toBe('WARNING')
  })

  it('detects priority violation (dropped item scored higher than included)', () => {
    const trace = makeTrace({
      context_assembly: {
        items: [
          {
            rank: 1, source_bundle: 'b', source_item_id: 'low',
            layer: 'L1', token_cost: 100, relevance_score: 0.4,
            status: 'INCLUDED', drop_reason: null, cumulative_tokens: 100, budget: 4000,
          },
          {
            rank: 2, source_bundle: 'b', source_item_id: 'high-dropped',
            layer: 'L1', token_cost: 100, relevance_score: 0.95,
            status: 'DROPPED', drop_reason: 'BUDGET', cumulative_tokens: 100, budget: 4000,
          },
        ],
        token_ledger: { total: 100, budget: 4000, preamble: 0, L1: 100, L2_5: 0, dropped_count: 1, truncated_count: 0 },
      },
    })
    const result = detectAnomalies(trace)
    const violation = result.find(a => a.message.includes('Priority violation'))
    expect(violation).toBeDefined()
    expect(violation!.severity).toBe('ERROR')
  })

  it('detects low citation density', () => {
    const trace = makeTrace({
      synthesis: {
        model: 'claude-sonnet-4-6', input_tokens: 1000, output_tokens: 300, latency_ms: 800,
        scorecard: { composite_score: 0.75, citation_density: 0.3, failures: [] },
      },
    })
    const result = detectAnomalies(trace)
    const citAnomaly = result.find(a => a.message.includes('citation density'))
    expect(citAnomaly).toBeDefined()
    expect(citAnomaly!.severity).toBe('WARNING')
    expect(citAnomaly!.step_id).toBe('synthesis')
  })

  it('detects low composite score at WARNING (0.4–0.6)', () => {
    const trace = makeTrace({
      synthesis: {
        model: 'claude-sonnet-4-6', input_tokens: 1000, output_tokens: 300, latency_ms: 800,
        scorecard: { composite_score: 0.55, citation_density: 0.8, failures: [] },
      },
    })
    const result = detectAnomalies(trace)
    const scoreAnomaly = result.find(a => a.message.includes('quality score'))
    expect(scoreAnomaly).toBeDefined()
    expect(scoreAnomaly!.severity).toBe('WARNING')
  })

  it('detects low composite score at ERROR (<0.4)', () => {
    const trace = makeTrace({
      synthesis: {
        model: 'claude-sonnet-4-6', input_tokens: 1000, output_tokens: 300, latency_ms: 800,
        scorecard: { composite_score: 0.3, citation_density: 0.8, failures: [] },
      },
    })
    const result = detectAnomalies(trace)
    const scoreAnomaly = result.find(a => a.message.includes('quality score'))
    expect(scoreAnomaly!.severity).toBe('ERROR')
  })

  it('sorts anomalies: errors before warnings before info', () => {
    const trace = makeTrace({
      fetches: [
        { bundle: 'a', step_order: 0, raw_count: 0, kept_count: 0, dropped_items: [], kept_items: [], latency_ms: 100, error_class: 'TIMEOUT' },
      ],
      plan: { included_bundles: [], excluded_bundles: [], plan_json: null, latency_ms: 5500 },
    })
    const result = detectAnomalies(trace)
    const severities = result.map(a => a.severity)
    const errorIdx = severities.indexOf('ERROR')
    const warnIdx = severities.indexOf('WARNING')
    if (errorIdx !== -1 && warnIdx !== -1) {
      expect(errorIdx).toBeLessThan(warnIdx)
    }
  })
})

describe('buildHealthSummary', () => {
  it('returns "All stages nominal" with no anomalies', () => {
    expect(buildHealthSummary('HEALTHY', [])).toBe('All stages nominal')
  })

  it('returns critical failure message when errors present', () => {
    const msg = buildHealthSummary('FAILED', [
      { stage: 'fetch', severity: 'ERROR', message: 'timeout', step_id: 'cgm' },
    ])
    expect(msg).toContain('Critical failure in fetch')
  })

  it('returns degraded message when only warnings present', () => {
    const msg = buildHealthSummary('DEGRADED', [
      { stage: 'plan', severity: 'WARNING', message: 'Plan latency 4000ms (2.2× p50)', step_id: 'plan' },
    ])
    expect(msg).toContain('Degraded:')
    expect(msg).toContain('Plan latency')
  })
})
