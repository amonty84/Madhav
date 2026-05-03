import { describe, it, expect, vi } from 'vitest'

// Mock side-effecting modules before importing manifest_planner. The engine
// never invokes these in tests (we inject a stub plannerFn), but the imports
// themselves pull in `import 'server-only'` which would refuse to load under
// vitest's jsdom environment.
vi.mock('ai', () => ({
  generateObject: vi.fn(),
  generateText: vi.fn(),
  jsonSchema: (s: unknown) => s,
  tool: (def: unknown) => def,
}))
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: (id: string) => ({ __mocked_model_id: id }),
}))
vi.mock('@/lib/db/monitoring-write', () => ({
  writeLlmCallLog: vi.fn(),
  resolveProvider: () => 'mock',
}))

import {
  UniversalQueryEngine,
  type CallLlmPlannerFn,
  type UniversalQueryEngineOptions,
} from '@/lib/pipeline/universal_query_engine'
import { PlannerCircuitBreaker } from '@/lib/pipeline/planner_circuit_breaker'
import { PlannerError, type PlanSchema } from '@/lib/pipeline/manifest_planner'
import type { BudgetArbiterConfig } from '@/lib/pipeline/budget_arbiter'

// Tight budget envelope matching the existing budget_arbiter test:
//   available = floor(4000 * 0.85) - 800 - 200 = 2400 tokens
const tightBudgetConfig: BudgetArbiterConfig = {
  synthesis_model_max_context: 4000,
  system_prompt_reserve: 800,
  synthesis_guidance_reserve: 200,
  safety_margin: 0.85,
  min_tokens_per_tool: 200,
}

function makePlanSchema(overrides: Partial<PlanSchema> = {}): PlanSchema {
  return {
    query_class: 'remedial',
    query_intent_summary: 'Saturn remedial measures for the native',
    tool_calls: [
      {
        tool_name: 'remedial_codex_query',
        params: { planet: 'Saturn' },
        token_budget: 800,
        priority: 1,
        reason: 'pull Saturn remedial prescriptions',
      },
      {
        tool_name: 'msr_sql',
        params: { domain: 'remedial' },
        token_budget: 400,
        priority: 2,
        reason: 'cite supporting MSR signals',
      },
    ],
    ...overrides,
  }
}

function makeEngine(opts: Partial<UniversalQueryEngineOptions> = {}, planner?: CallLlmPlannerFn) {
  return new UniversalQueryEngine({
    budgetConfig: tightBudgetConfig,
    plannerFn: planner ?? (vi.fn(async () => makePlanSchema()) as unknown as CallLlmPlannerFn),
    ...opts,
  })
}

describe('UniversalQueryEngine — plan()', () => {
  it('returns arbitrated tool_calls with the planner output preserved on success', async () => {
    const plan = makePlanSchema()
    const planner = vi.fn(async () => plan) as unknown as CallLlmPlannerFn
    const engine = makeEngine({}, planner)

    const result = await engine.plan('test query', 'qid-1', [], 'planner-model', 'native-1')

    expect(result.fallback_used).toBe(false)
    expect(result.raw_plan).toBe(plan)
    expect(result.query_class).toBe('remedial')
    expect(result.query_intent_summary).toMatch(/Saturn/)
    expect(result.tool_calls).toHaveLength(2)
    expect(result.tool_calls[0]).toMatchObject({
      tool_name: 'remedial_codex_query',
      priority: 1,
      reason: 'pull Saturn remedial prescriptions',
    })
    // Original budgets sum (800 + 400 = 1200) ≤ 2400 → arbitration is a no-op.
    expect(result.tool_calls[0].token_budget).toBe(800)
    expect(result.tool_calls[1].token_budget).toBe(400)
  })

  it('arbitrates budgets when planner exceeds the synthesis-model envelope', async () => {
    // Budgets sum to 4000 tokens against a 2400 available window → must trim p2/p3.
    const plan = makePlanSchema({
      tool_calls: [
        {
          tool_name: 'p1_tool',
          params: {},
          token_budget: 2000,
          priority: 1,
          reason: 'p1',
        },
        {
          tool_name: 'p2_tool',
          params: {},
          token_budget: 1000,
          priority: 2,
          reason: 'p2',
        },
        {
          tool_name: 'p3_tool',
          params: {},
          token_budget: 1000,
          priority: 3,
          reason: 'p3',
        },
      ],
    })
    const planner = vi.fn(async () => plan) as unknown as CallLlmPlannerFn
    const engine = makeEngine({}, planner)

    const result = await engine.plan('q', 'qid-2', [], 'planner-model', 'native-1')

    const total = result.tool_calls.reduce((s, t) => s + t.token_budget, 0)
    expect(total).toBeLessThanOrEqual(2400)
    // Priority-1 tool not trimmed below floor.
    const p1 = result.tool_calls.find(t => t.tool_name === 'p1_tool')
    expect(p1?.token_budget).toBeGreaterThanOrEqual(200)
  })

  it('returns fallback when the circuit breaker is open (planner not invoked)', async () => {
    const breaker = new PlannerCircuitBreaker({ failureThreshold: 1, recoveryMs: 60_000, timeoutMs: 1000 })
    // Trip the breaker by failing once.
    await expect(
      breaker.call(async () => {
        throw new PlannerError('seed failure')
      }),
    ).rejects.toBeInstanceOf(PlannerError)
    expect(breaker.state).toBe('open')

    const planner = vi.fn(async () => makePlanSchema()) as unknown as CallLlmPlannerFn
    const engine = makeEngine({ circuitBreaker: breaker }, planner)

    const result = await engine.plan('q', 'qid-3', [], 'planner-model', 'native-1')

    expect(result.fallback_used).toBe(true)
    expect(result.raw_plan).toBeNull()
    expect(result.tool_calls).toEqual([])
    expect(planner).not.toHaveBeenCalled()
  })

  it('returns fallback when the planner throws PlannerError', async () => {
    const planner = vi.fn(async () => {
      throw new PlannerError('schema invalid')
    }) as unknown as CallLlmPlannerFn
    const engine = makeEngine({}, planner)

    const result = await engine.plan('q', 'qid-4', [], 'planner-model', 'native-1')

    expect(result.fallback_used).toBe(true)
    expect(result.raw_plan).toBeNull()
    expect(result.tool_calls).toEqual([])
  })

  it('forwards planning_start / planning_done trace events through emitTrace', async () => {
    const events: Array<{ event: string }> = []
    const emitTrace = (e: { event: string }) => {
      events.push(e)
    }
    // Planner stub mimics callLlmPlanner: it MUST emit planning_start before
    // the LLM call and planning_done after success. The engine's only
    // contribution is to forward emitTrace into the planner.
    const planner: CallLlmPlannerFn = vi.fn(async (_q, _h, _m, nativeId, emit) => {
      emit?.({
        event: 'planning_start',
        query_id: nativeId,
        planner_model_id: 'm',
        manifest_tool_count: 8,
      })
      emit?.({
        event: 'planning_done',
        query_id: nativeId,
        tool_count_planned: 2,
        tools_selected: ['a', 'b'],
        query_intent_summary: 'x',
        planner_latency_ms: 10,
      })
      return makePlanSchema()
    }) as unknown as CallLlmPlannerFn
    const engine = makeEngine({ emitTrace }, planner)

    await engine.plan('q', 'qid-5', [], 'planner-model', 'native-1')

    expect(events.map(e => e.event)).toEqual(['planning_start', 'planning_done'])
  })

  it('passes the queryId into the planner so monitoring writes are correlated', async () => {
    const planner = vi.fn(async () => makePlanSchema()) as unknown as CallLlmPlannerFn
    const engine = makeEngine({}, planner)

    await engine.plan('q', 'qid-correlation', [], 'planner-model', 'native-1')

    expect(planner).toHaveBeenCalledWith(
      'q',
      [],
      'planner-model',
      'native-1',
      undefined,
      'qid-correlation',
    )
  })
})
