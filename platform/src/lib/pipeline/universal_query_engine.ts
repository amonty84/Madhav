/**
 * universal_query_engine.ts — UQE-5 (BHISMA Wave 2 §S-A).
 *
 * Thin orchestrator that consolidates the four LLM-first-planner primitives
 * (manifest load + planner call + circuit-breaker + budget arbitration) into
 * a single `plan()` call. Today the live path inlines this orchestration in
 * `src/app/api/chat/consume/route.ts`; this class refactors it into one
 * testable surface so the eventual `LLM_FIRST_PLANNER_ENABLED=true` cutover
 * becomes a one-line swap rather than a route-handler rewrite.
 *
 * Per BHISMA-S-A Hard Constraint 2, this session does NOT flip the flag.
 * The engine is created but not wired into the live request path. When the
 * native flips the flag, the route handler can replace its inline planner
 * block with `engine.plan(query, queryId, history, plannerModelId, nativeId)`.
 *
 * Failure semantics (parity with route.ts):
 *   - PlannerError or PlannerCircuitOpenError → fallback_used=true, empty plan
 *   - Other thrown errors → fallback_used=true + console.warn (loud)
 * The route caller inspects `fallback_used` and routes to classify() + compose
 * when true.
 */

import {
  plannerCircuit as defaultPlannerCircuit,
  PlannerCircuitOpenError,
  type PlannerCircuitBreaker,
} from './planner_circuit_breaker'
import {
  callLlmPlanner as defaultCallLlmPlanner,
  PlannerError,
  type PlanSchema,
} from './manifest_planner'
import { arbitrateBudgets, type BudgetArbiterConfig } from './budget_arbiter'
import type { TraceEvent } from '@/lib/trace/types'

export interface ConversationTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface UniversalToolCallSpec {
  tool_name: string
  params: Record<string, unknown>
  /** Post-arbitration budget. May be lower than the planner's emitted budget. */
  token_budget: number
  priority: 1 | 2 | 3
  reason: string
}

export interface UniversalQueryPlan {
  query_class: PlanSchema['query_class']
  query_intent_summary: string
  tool_calls: UniversalToolCallSpec[]
  /** True when the LLM planner failed or the breaker was open. */
  fallback_used: boolean
  /** The raw PlanSchema returned by the planner (pre-arbitration), or null on fallback. */
  raw_plan: PlanSchema | null
}

export type CallLlmPlannerFn = typeof defaultCallLlmPlanner

export interface UniversalQueryEngineOptions {
  budgetConfig: BudgetArbiterConfig
  /** Inject a custom breaker for tests; default uses the module singleton. */
  circuitBreaker?: PlannerCircuitBreaker
  /** SSE planning trace hook — forwarded into the underlying planner. */
  emitTrace?: (event: TraceEvent) => void
  /** Inject a stub planner for tests; defaults to the real callLlmPlanner. */
  plannerFn?: CallLlmPlannerFn
}

export class UniversalQueryEngine {
  private readonly opts: UniversalQueryEngineOptions

  constructor(opts: UniversalQueryEngineOptions) {
    this.opts = opts
  }

  async plan(
    query: string,
    queryId: string,
    conversationHistory: ConversationTurn[],
    plannerModelId: string,
    nativeId: string,
  ): Promise<UniversalQueryPlan> {
    const breaker = this.opts.circuitBreaker ?? defaultPlannerCircuit
    const plannerFn = this.opts.plannerFn ?? defaultCallLlmPlanner

    let planSchema: PlanSchema | null = null

    try {
      planSchema = await breaker.call(() =>
        plannerFn(
          query,
          conversationHistory,
          plannerModelId,
          nativeId,
          this.opts.emitTrace,
          queryId,
        ),
      )
    } catch (err) {
      if (err instanceof PlannerError || err instanceof PlannerCircuitOpenError) {
        // Expected fallback path — keep silent.
      } else {
        console.warn('[uqe] unexpected planner error, falling back', err)
      }
      planSchema = null
    }

    if (!planSchema) {
      return {
        query_class: 'single_answer',
        query_intent_summary: '',
        tool_calls: [],
        fallback_used: true,
        raw_plan: null,
      }
    }

    const arbitrated = arbitrateBudgets(
      planSchema.tool_calls.map(tc => ({
        tool_name: tc.tool_name,
        priority: tc.priority,
        token_budget: tc.token_budget,
      })),
      this.opts.budgetConfig,
    )

    const finalToolCalls: UniversalToolCallSpec[] = planSchema.tool_calls.map((tc, i) => ({
      tool_name: tc.tool_name,
      params: tc.params,
      token_budget: arbitrated[i].token_budget,
      priority: tc.priority,
      reason: tc.reason,
    }))

    return {
      query_class: planSchema.query_class,
      query_intent_summary: planSchema.query_intent_summary,
      tool_calls: finalToolCalls,
      fallback_used: false,
      raw_plan: planSchema,
    }
  }
}
