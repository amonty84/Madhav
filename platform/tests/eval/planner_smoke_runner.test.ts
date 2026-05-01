/**
 * planner_smoke_runner.test.ts — W2-EVAL-B AC.V.1
 *
 * Unit tests for the smoke runner's pure scoring helpers. All planner
 * dependencies are mocked — no live LLM calls.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/pipeline/manifest_planner', () => ({
  callLlmPlanner: vi.fn(),
}))

import {
  scoreEntry,
  aggregateResults,
  type GoldenEntry,
  type EvalResult,
} from './planner_smoke_runner'

const baseEntry: GoldenEntry = {
  id: 'GT.X',
  query: 'test query',
  query_class: 'remedial',
  category: 'remedial',
  expected_tools: ['msr_sql', 'remedial_codex_query', 'chart_facts_query'],
  required_tools: ['remedial_codex_query'],
  forbidden_tools: ['temporal'],
}

describe('scoreEntry — recall/precision math', () => {
  it('computes |predicted ∩ expected| / |expected| and / |predicted|', () => {
    // predicted = [msr_sql, remedial_codex_query, vector_search]
    // expected  = [msr_sql, remedial_codex_query, chart_facts_query]
    // intersection = 2; expected = 3; predicted = 3
    const r = scoreEntry(baseEntry, ['msr_sql', 'remedial_codex_query', 'vector_search'])
    expect(r.tool_recall).toBeCloseTo(2 / 3, 5)
    expect(r.tool_precision).toBeCloseTo(2 / 3, 5)
    // recall < 0.80 → does not pass
    expect(r.pass).toBe(false)
  })
})

describe('scoreEntry — required_hit', () => {
  it('is true when all required_tools appear in predicted, false when any are missing', () => {
    const hit = scoreEntry(
      { ...baseEntry, required_tools: ['remedial_codex_query'] },
      ['remedial_codex_query', 'msr_sql'],
    )
    expect(hit.required_hit).toBe(true)

    const miss = scoreEntry(
      { ...baseEntry, required_tools: ['remedial_codex_query'] },
      ['msr_sql', 'chart_facts_query'],
    )
    expect(miss.required_hit).toBe(false)
    expect(miss.pass).toBe(false)
  })
})

describe('scoreEntry — forbidden_violation', () => {
  it('is true when any forbidden_tool appears in predicted', () => {
    const violation = scoreEntry(
      { ...baseEntry, forbidden_tools: ['temporal'] },
      ['remedial_codex_query', 'msr_sql', 'temporal'],
    )
    expect(violation.forbidden_violation).toBe(true)
    expect(violation.pass).toBe(false)
  })
})

describe('scoreEntry — pass logic', () => {
  it('passes when recall ≥ 0.80, precision ≥ 0.90, required_hit, no forbidden', () => {
    // expected = 20 tools; predicted = 17 correct + 1 wrong = 18 total.
    // recall    = 17/20 = 0.85
    // precision = 17/18 ≈ 0.944
    const expected = Array.from({ length: 20 }, (_, i) => `tool_${i}`)
    const predicted = [...expected.slice(0, 17), 'noise_tool']
    const entry: GoldenEntry = {
      ...baseEntry,
      expected_tools: expected,
      required_tools: ['tool_0'],
      forbidden_tools: ['tool_99'],
    }
    const r = scoreEntry(entry, predicted)
    expect(r.tool_recall).toBeCloseTo(0.85, 5)
    expect(r.tool_precision).toBeCloseTo(17 / 18, 5)
    expect(r.required_hit).toBe(true)
    expect(r.forbidden_violation).toBe(false)
    expect(r.pass).toBe(true)
  })
})

describe('aggregateResults — pass_rate', () => {
  it('reports pass_rate=0.80 for 20 passing / 25 total', () => {
    const results: EvalResult[] = []
    for (let i = 0; i < 25; i++) {
      const pass = i < 20
      results.push({
        id: `GT.${String(i).padStart(3, '0')}`,
        query: '',
        expected_tools: [],
        predicted_tools: [],
        required_tools: [],
        forbidden_tools: [],
        tool_recall: pass ? 1 : 0,
        tool_precision: pass ? 1 : 0,
        required_hit: pass,
        forbidden_violation: !pass,
        pass,
      })
    }
    const agg = aggregateResults(results)
    expect(agg.total).toBe(25)
    expect(agg.passed).toBe(20)
    expect(agg.failed).toBe(5)
    expect(agg.pass_rate).toBeCloseTo(0.8, 5)
    expect(agg.avg_tool_recall).toBeCloseTo(0.8, 5)
    expect(agg.avg_tool_precision).toBeCloseTo(0.8, 5)
    expect(agg.forbidden_violations).toBe(5)
    expect(agg.required_misses).toBe(5)
  })
})
