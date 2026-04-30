import {
  streamText,
  stepCountIs,
  convertToModelMessages,
  createIdGenerator,
  generateText,
  smoothStream,
} from 'ai'
import type { ModelMessage, UIMessage } from 'ai'
import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { consumeTools } from '@/lib/claude/consume-tools'
import { consumeSystemPrompt, type ConsumeStyle } from '@/lib/claude/system-prompts'
import {
  getConversation,
  insertConversationWithId,
  replaceConversationMessages,
  updateConversationTitle,
} from '@/lib/conversations'
import {
  DEFAULT_MODEL_ID,
  TITLE_MODEL_ID,
  getModelMeta,
  isValidModelId,
  supports,
} from '@/lib/models/registry'
import { resolveModel } from '@/lib/models/resolver'
import { configService } from '@/lib/config/index'
import { classify } from '@/lib/router/router'
import { PipelineError } from '@/lib/router/errors'
import { compose } from '@/lib/bundle/rule_composer'
// BHISMA Stream 2 §4.2 — LLM-first planner. Used when LLM_FIRST_PLANNER_ENABLED=true.
import { plan as runPlanner, buildPlannerFloorBundle, PlannerError } from '@/lib/router/planner'
import type { RichQueryPlan } from '@/lib/router/types'
import type { Bundle } from '@/lib/bundle/types'
import { getTool } from '@/lib/retrieve/index'
import { createToolCache, executeWithCache } from '@/lib/cache/index'
import { loadManifest } from '@/lib/bundle/manifest_reader'
import { runAll, summarize } from '@/lib/validators/index'
import { createOrchestrator } from '@/lib/synthesis/index'
import { createAuditConsumer } from '@/lib/audit/consumer'
import { writeAuditEvent, writeQueryPlan } from '@/lib/audit/audit_writer'
import { traceEmitter } from '@/lib/trace/emitter'
import type { TraceStep, TraceChunkItem, TraceDataSummary, TracePayload } from '@/lib/trace/types'
import type { ToolBundle, ToolBundleResult } from '@/lib/retrieve/index'
// planPerTool import removed BHISMA-B1 §6.2: PER_TOOL_PLANNER_ENABLED retired.

// ── Trace helpers ─────────────────────────────────────────────────────────────

function toolStepType(toolName: string): TraceStep['step_type'] {
  if (toolName === 'vector_search') return 'vector'
  if (['msr_sql', 'query_msr_aggregate'].includes(toolName)) return 'sql'
  return 'gcs'
}

function inferLayer(toolName: string): 'L1' | 'L2.5' {
  if (['msr_sql', 'query_msr_aggregate', 'pattern_register', 'resonance_register',
       'cluster_atlas', 'contradiction_register', 'temporal', 'cgm_graph_walk'].includes(toolName)) {
    return 'L2.5'
  }
  return 'L1'
}

function buildToolSummary(toolName: string, result: ToolBundle): TraceDataSummary {
  const totalChars = result.results.reduce((s: number, r: ToolBundleResult) => s + r.content.length, 0)
  const token_estimate = Math.ceil(totalChars / 4)
  if (toolName === 'vector_search') {
    const top_score = result.results[0]?.significance ?? result.results[0]?.confidence ?? 0
    return { chunks_returned: result.results.length, top_score, token_estimate }
  }
  return { rows_returned: result.results.length, tool_name: toolName, token_estimate }
}

function buildToolPayload(toolName: string, result: ToolBundle): TracePayload {
  const layer = inferLayer(toolName)
  const items: TraceChunkItem[] = result.results.map((r: ToolBundleResult) => ({
    id: r.signal_id ?? r.source_canonical_id ?? toolName,
    source: r.source_canonical_id ?? toolName,
    layer,
    token_estimate: Math.ceil(r.content.length / 4),
    text: r.content,
  }))
  return { items }
}

export const maxDuration = 120

const ALLOWED_STYLES: ConsumeStyle[] = ['acharya', 'brief', 'client']

interface RequestBody {
  chartId?: string
  conversationId?: string
  messages?: UIMessage[]
  model?: string
  style?: string
  panel_opt_in?: boolean
}

export async function POST(request: Request) {
  const setupStart = Date.now()

  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { chartId, messages } = body
  let { conversationId } = body

  if (!chartId || !messages) {
    return NextResponse.json({ error: 'chartId and messages are required' }, { status: 400 })
  }

  const modelId = isValidModelId(body.model ?? '') ? (body.model as string) : DEFAULT_MODEL_ID
  const modelMeta = getModelMeta(modelId)!
  const style: ConsumeStyle = ALLOWED_STYLES.includes(body.style as ConsumeStyle)
    ? (body.style as ConsumeStyle)
    : 'acharya'

  const [chartResult, profileResult, reportsResult] = await Promise.all([
    query<{ id: string; name: string; birth_date: string; birth_time: string; birth_place: string; client_id: string }>(
      'SELECT id, name, birth_date, birth_time, birth_place, client_id FROM charts WHERE id=$1',
      [chartId]
    ),
    query<{ role: string }>(
      'SELECT role FROM profiles WHERE id=$1',
      [user.uid]
    ),
    query<{ domain: string; title: string; version: string }>(
      'SELECT domain, title, version FROM reports WHERE chart_id=$1 ORDER BY domain',
      [chartId]
    ),
  ])

  if (!chartResult.rows[0]) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
  const chart = chartResult.rows[0]
  const role = profileResult.rows[0]?.role
  const isSuperAdmin = role === 'super_admin'

  if (!isSuperAdmin && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let isFirstTurn = false
  // Fire the first-turn conversation insert in parallel with the model call so
  // it doesn't block TTFT. onFinish awaits this before persisting messages.
  let pendingConversationInsert: Promise<void> | null = null

  if (conversationId) {
    const existing = await getConversation({ id: conversationId, userId: user.uid, isSuperAdmin })
    if (!existing || existing.chart_id !== chartId) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
  } else {
    conversationId = crypto.randomUUID()
    isFirstTurn = true
    pendingConversationInsert = insertConversationWithId({
      id: conversationId,
      chartId,
      userId: user.uid,
      module: 'consume',
    })
  }

  const finalConversationId = conversationId

  if (configService.getFlag('NEW_QUERY_PIPELINE_ENABLED')) {
    // Pre-allocate the query id so a PipelineError thrown by classify can still
    // be correlated to a trace step_error event (BHISMA-B1 §3.3 / ADR-3).
    const preAllocatedQueryId = crypto.randomUUID()
    const classifyStart = Date.now()
    let queryText = ''
    try {
    const lastUserMessage = messages.filter(m => m.role === 'user').at(-1)
    queryText = extractText(lastUserMessage?.parts ?? [])

    const manifest = await loadManifest('00_ARCHITECTURE/CAPABILITY_MANIFEST.json', '00_ARCHITECTURE/manifest_overrides.yaml')

    // ──────────────────────────────────────────────────────────────────────
    // BHISMA Stream 2 §4.4 — branch on LLM_FIRST_PLANNER_ENABLED.
    //
    // ON  → unified planner replaces classify + compose + plan_per_tool with
    //       a single LLM call that emits a RichQueryPlan with per-tool params
    //       already filled in. Bundle is the always-required floor only.
    // OFF → legacy three-step sequence (the live path until smoke completes).
    //
    // Both branches converge with: `queryPlan`, `queryId`, `bundle`,
    // `perToolOverrides` defined. Downstream tool execution and synthesis
    // are agnostic to which branch produced the plan.
    // ──────────────────────────────────────────────────────────────────────
    let queryPlan: RichQueryPlan | Awaited<ReturnType<typeof classify>>
    let queryId: string
    let bundle: Bundle
    let perToolOverrides = new Map<string, Record<string, unknown>>()

    if (configService.getFlag('LLM_FIRST_PLANNER_ENABLED')) {
      // ── New path: unified planner ───────────────────────────────────────
      const planStart = Date.now()
      const richPlan: RichQueryPlan = await runPlanner({
        query: queryText,
        conversation_history: messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-4)
          .map(m => ({
            role: m.role as 'user' | 'assistant',
            content: extractText(m.parts ?? []),
          })),
        chart_context: {
          name: chart.name ?? 'the native',
          birth_date: chart.birth_date,
          birth_time: chart.birth_time,
          birth_place: chart.birth_place,
        },
        current_date: new Date().toISOString().split('T')[0],
        audience_tier: isSuperAdmin ? 'super_admin' : 'client',
        manifest_fingerprint: manifest.fingerprint,
        synthesis_model_id: modelId,
      })
      // Force the pre-allocated id so trace events emitted before the call
      // (none today, but reserved by BHISMA-B1 pattern) stay correlated.
      richPlan.query_plan_id = preAllocatedQueryId
      queryPlan = richPlan
      queryId = richPlan.query_plan_id
      bundle = buildPlannerFloorBundle(richPlan, manifest)
      perToolOverrides = new Map(
        richPlan.tool_calls.map(tc => [tc.tool_name, tc.params]),
      )
      void writeQueryPlan(richPlan)

      // Single 'plan' trace step replaces classify + compose + plan_per_tool.
      // Rich fields go into payload.query_plan (TraceQueryPlan) per the
      // trace schema; data_summary stays compact for list-row rendering.
      traceEmitter.emitStep({
        event: 'step_done',
        query_id: queryId,
        step: {
          query_id: queryId,
          conversation_id: finalConversationId,
          step_seq: 1,
          step_name: 'plan',
          step_type: 'llm',
          status: 'done',
          started_at: new Date(planStart).toISOString(),
          completed_at: new Date().toISOString(),
          latency_ms: richPlan.planning_latency_ms,
          data_summary: {
            result: richPlan.query_class,
            confidence: richPlan.router_confidence,
            model: richPlan.planning_model_id,
            tool_count: richPlan.tool_calls.length,
            tools_refined: richPlan.tool_calls.length,
            planner_active: true,
            query_class: richPlan.query_class,
            planning_confidence: richPlan.router_confidence,
          },
          payload: {
            query_plan: {
              query_plan_id: richPlan.query_plan_id,
              query_class: richPlan.query_class,
              domains: richPlan.domains,
              tools_authorized: richPlan.tools_authorized,
              forward_looking: richPlan.forward_looking,
              dasha_context_required: richPlan.dasha_context_required,
              graph_seed_hints: richPlan.graph_seed_hints,
              planets: richPlan.planets,
              houses: richPlan.houses,
              time_window: richPlan.time_window,
              expected_output_shape: richPlan.expected_output_shape,
              router_confidence: richPlan.router_confidence,
              query_intent_summary: richPlan.query_intent_summary,
              planning_rationale: richPlan.planning_rationale,
              synthesis_guidance: richPlan.synthesis_guidance,
              tool_calls: richPlan.tool_calls,
              planning_model_id: richPlan.planning_model_id,
              planning_latency_ms: richPlan.planning_latency_ms,
            },
            tool_calls: richPlan.tool_calls,
          },
        },
      })
    } else {
      // ── Legacy path: classify → compose → plan_per_tool ─────────────────
      const legacyPlan = await classify(queryText, {
        audience_tier: isSuperAdmin ? 'super_admin' : 'client',
        manifest_fingerprint: manifest.fingerprint,
        synthesis_model_id: modelId,
        query_plan_id: preAllocatedQueryId,
        conversation_history: messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-4)
          .map(m => ({
            role: m.role as 'user' | 'assistant',
            content: extractText(m.parts ?? []),
          })),
      })
      queryPlan = legacyPlan
      queryId = legacyPlan.query_plan_id
      void writeQueryPlan(legacyPlan)
      // Step 1 — classify (emit done immediately; query_id now known)
      traceEmitter.emitStep({
        event: 'step_done',
        query_id: queryId,
        step: {
          query_id: queryId,
          conversation_id: finalConversationId,
          step_seq: 1,
          step_name: 'classify',
          step_type: 'deterministic',
          status: 'done',
          started_at: new Date(classifyStart).toISOString(),
          completed_at: new Date().toISOString(),
          latency_ms: Date.now() - classifyStart,
          data_summary: {
            result: legacyPlan.query_class,
            confidence: legacyPlan.router_confidence,
          },
          payload: {},
        },
      })

      const composeStart = Date.now()
      bundle = await compose(legacyPlan)
      // Step 2 — compose bundle
      traceEmitter.emitStep({
        event: 'step_done',
        query_id: queryId,
        step: {
          query_id: queryId,
          conversation_id: finalConversationId,
          step_seq: 2,
          step_name: 'compose_bundle',
          step_type: 'deterministic',
          status: 'done',
          started_at: new Date(composeStart).toISOString(),
          completed_at: new Date().toISOString(),
          latency_ms: Date.now() - composeStart,
          data_summary: {
            result: `${bundle.mandatory_context.length} bundles · ${legacyPlan.tools_authorized.length} tools`,
          },
          payload: {},
        },
      })

      // --- Step 3: plan_per_tool ---
      // BHISMA-B1 §6.2: PER_TOOL_PLANNER_ENABLED retired (was never flipped true).
      // Always emit planner-off step so A/B analysis can distinguish planner-off runs.
      const plannerStart = Date.now()
      traceEmitter.emitStep({
        event: 'step_done',
        query_id: queryId,
        step: {
          query_id: queryId,
          conversation_id: finalConversationId,
          step_seq: 3,
          step_name: 'plan_per_tool',
          step_type: 'llm',
          status: 'done',
          started_at: new Date(plannerStart).toISOString(),
          completed_at: new Date().toISOString(),
          latency_ms: 0,
          data_summary: { planner_active: false, tools_refined: 0, tool_count: 0 },
          payload: {},
        },
      })
    }

    const cache = createToolCache()
    const toolFetchWallStart = Date.now()
    // Steps 4…N — emit 'running' for all tools simultaneously (they fire in parallel)
    queryPlan.tools_authorized.forEach((toolName: string, idx: number) => {
      traceEmitter.emitStep({
        event: 'step_start',
        query_id: queryId,
        step: {
          query_id: queryId,
          conversation_id: finalConversationId,
          step_seq: 4 + idx,
          step_name: toolName,
          step_type: toolStepType(toolName),
          status: 'running',
          started_at: new Date(toolFetchWallStart).toISOString(),
          parallel_group: 'tool_fetch',
          data_summary: {},
          payload: {},
        },
      })
    })

    const toolResults = await Promise.all(
      queryPlan.tools_authorized.map(async (toolName: string, idx: number) => {
        const t = getTool(toolName)
        if (!t) return null
        const toolStart = Date.now()
        // Merge per-tool overrides (if planner ran) into a refined query plan for this tool
        const toolOverride = perToolOverrides.get(toolName)
        const effectivePlan = toolOverride
          ? { ...queryPlan, ...toolOverride } as typeof queryPlan
          : queryPlan
        try {
          const result = await executeWithCache(t, effectivePlan, cache)
          traceEmitter.emitStep({
            event: 'step_done',
            query_id: queryId,
            step: {
              query_id: queryId,
              conversation_id: finalConversationId,
              step_seq: 4 + idx,
              step_name: toolName,
              step_type: toolStepType(toolName),
              status: 'done',
              started_at: new Date(toolFetchWallStart).toISOString(),
              completed_at: new Date().toISOString(),
              latency_ms: Date.now() - toolStart,
              parallel_group: 'tool_fetch',
              data_summary: buildToolSummary(toolName, result),
              payload: buildToolPayload(toolName, result),
            },
          })
          return result
        } catch (err) {
          traceEmitter.emitStep({
            event: 'step_error',
            query_id: queryId,
            step: {
              query_id: queryId,
              conversation_id: finalConversationId,
              step_seq: 4 + idx,
              step_name: toolName,
              step_type: toolStepType(toolName),
              status: 'error',
              started_at: new Date(toolFetchWallStart).toISOString(),
              completed_at: new Date().toISOString(),
              latency_ms: Date.now() - toolStart,
              parallel_group: 'tool_fetch',
              data_summary: { result: String(err) },
              payload: {},
            },
          })
          return null
        }
      })
    )
    const validToolResults = toolResults.filter((r): r is NonNullable<typeof r> => r !== null)

    const bundleValidations = await runAll(bundle, 'bundle', { query_plan: queryPlan, bundle, manifest_fingerprint: manifest.fingerprint })
    const bundleSummary = summarize(bundleValidations)
    if (bundleSummary.overall === 'fail' && configService.getFlag('VALIDATOR_FAILURE_HALT')) {
      return NextResponse.json(
        { error: 'bundle_validation_failed', failures: bundleSummary.failures },
        { status: 422 }
      )
    }

    const audienceTier = isSuperAdmin ? 'super_admin' as const : 'client' as const
    const panelOptIn = body.panel_opt_in === true

    // Emit synthesis start — seq = 4 + nTools + 1 (plan_per_tool is step 3; tools are steps 4…4+N-1; context_assembly is in single_model_strategy)
    const nToolSteps = queryPlan.tools_authorized.length
    const synthesisSeq = 4 + nToolSteps + 1
    const synthesisStart = Date.now()
    traceEmitter.emitStep({
      event: 'step_start',
      query_id: queryId,
      step: {
        query_id: queryId,
        conversation_id: finalConversationId,
        step_seq: synthesisSeq,
        step_name: 'synthesis',
        step_type: 'llm',
        status: 'running',
        started_at: new Date(synthesisStart).toISOString(),
        data_summary: { model: modelId },
        payload: {},
      },
    })

    const orchestrator = createOrchestrator({ panel_opt_in: panelOptIn })
    const { result, methodologyBlockHolder } = await orchestrator.synthesize({
      query: queryText,
      query_plan: queryPlan,
      bundle,
      tool_results: validToolResults,
      conversation_history: messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(0, -1)  // exclude current user message; synthesize() appends it via `query`
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: extractText(m.parts ?? []),
        })),
      selected_model_id: modelId,
      style,
      audience_tier: audienceTier,
      cache,
      chart_context: {
        name: chart.name ?? 'the native',
        birth_date: chart.birth_date,
        birth_time: chart.birth_time,
        birth_place: chart.birth_place,
      },
      conversation_id: finalConversationId,
      panel_opt_in: panelOptIn,
      // BHISMA-B1 §6.2: AUDIT_ENABLED retired — audit consumer is always active.
      onAuditEvent: createAuditConsumer({
        query_text: queryText,
        query_plan: queryPlan,
        bundle,
        tool_results: validToolResults,
        validator_results: bundleValidations,
        disclosure_tier: audienceTier,
      }),
    })

    result.consumeStream()

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
      messageMetadata: ({ part }: { part: { type: string } }) => {
        if (part.type === 'start' && isFirstTurn) {
          return { conversationId: finalConversationId, model: modelId, style, disclosure_tier: audienceTier, pipeline: 'v2', queryId }
        }
        if (part.type === 'start') {
          return { model: modelId, style, disclosure_tier: audienceTier, pipeline: 'v2', queryId }
        }
        if (part.type === 'finish') {
          return { methodology_block: methodologyBlockHolder?.value ?? null }
        }
      },
      onFinish: async ({ messages: finalMessages }: { messages: UIMessage[] }) => {
        // Emit trace done sentinel so SSE endpoint closes the stream
        traceEmitter.emitStep({ event: 'done', query_id: queryId })
        // Non-blocking — write audit event to audit_events table for observability
        void writeAuditEvent({
          queryId,
          queryPlanId: queryPlan.query_plan_id,
          queryText,
          queryClass: queryPlan.query_class,
          userId: user.uid,
          chartId: chartId ?? undefined,
          conversationId: finalConversationId,
          toolBundles: validToolResults.map(r => ({
            tool_name: r.tool_name,
            item_count: r.results.length,
            latency_ms: r.latency_ms,
            cached: r.served_from_cache,
          })),
          latencyMs: Date.now() - classifyStart,
        })
        try {
          if (pendingConversationInsert) await pendingConversationInsert
          await replaceConversationMessages({
            conversationId: finalConversationId,
            messages: finalMessages,
          })
          if (isFirstTurn) {
            generateConversationTitle(finalMessages).then((title: string | null) => {
              if (title) void updateConversationTitle(finalConversationId, title)
            })
          }
        } catch (err) {
          console.error('[consume:v2] persistence failed', err)
        }
      },
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : String(error)
        console.error('[consume:v2] synthesis error:', msg)
        return msg
      },
    })
  } catch (pipelineError) {
    // BHISMA-B1 §3.3 / ADR-3: failure is loud, never silent. Translate
    // PipelineError into a structured JSON response and emit a step_error
    // trace event so the trace panel + chat UI both surface the failure.
    // BHISMA-B2 §4.4: PlannerError from the LLM-first planner gets the same
    // loud-failure treatment.
    if (pipelineError instanceof PlannerError) {
      console.error(
        `[consume:v2] PlannerError [${pipelineError.stage}] model=${pipelineError.model_id} attempt=${pipelineError.attempt}: ${pipelineError.message}`
      )
      try {
        traceEmitter.emitStep({
          event: 'step_error',
          query_id: preAllocatedQueryId,
          step: {
            query_id: preAllocatedQueryId,
            conversation_id: finalConversationId,
            step_seq: 1,
            step_name: 'plan',
            step_type: 'llm',
            status: 'error',
            started_at: new Date(classifyStart).toISOString(),
            completed_at: new Date().toISOString(),
            latency_ms: Date.now() - classifyStart,
            data_summary: {
              result: pipelineError.stage,
              model: pipelineError.model_id,
              error_reason: pipelineError.stage,
              error_stage: 'plan',
            },
            payload: {
              error_message:
                `[attempt ${pipelineError.attempt}] ${pipelineError.message}` +
                (pipelineError.raw_response
                  ? `\n\n--- raw response (first 500 chars) ---\n${pipelineError.raw_response.slice(0, 500)}`
                  : ''),
            },
          },
        })
        traceEmitter.emitStep({ event: 'done', query_id: preAllocatedQueryId })
      } catch (emitErr) {
        console.error('[consume:v2] planner step_error emit failed', emitErr)
      }
      return NextResponse.json(
        {
          error: 'planner_failed',
          stage: pipelineError.stage,
          model_id: pipelineError.model_id,
          attempt: pipelineError.attempt,
          query_id: preAllocatedQueryId,
          user_message: `The planner step failed (${pipelineError.stage}). Try again, or pick a different model from the picker.`,
        },
        { status: 502 }
      )
    }
    if (pipelineError instanceof PipelineError) {
      console.error(
        `[consume:v2] PipelineError [${pipelineError.stage}] model=${pipelineError.model_id ?? 'unknown'} reason=${pipelineError.reason}`
      )
      const stepSeqByStage: Record<string, number> = {
        classify: 1,
        compose: 2,
        tool_fetch: 4,
        synthesis: 99,
      }
      try {
        traceEmitter.emitStep({
          event: 'step_error',
          query_id: preAllocatedQueryId,
          step: {
            query_id: preAllocatedQueryId,
            conversation_id: finalConversationId,
            step_seq: stepSeqByStage[pipelineError.stage] ?? 1,
            step_name: pipelineError.stage,
            step_type: pipelineError.stage === 'classify' || pipelineError.stage === 'synthesis' ? 'llm' : 'deterministic',
            status: 'error',
            started_at: new Date(classifyStart).toISOString(),
            completed_at: new Date().toISOString(),
            latency_ms: Date.now() - classifyStart,
            data_summary: {
              result: pipelineError.reason,
              model: pipelineError.model_id,
              error_reason: pipelineError.reason,
              error_stage: pipelineError.stage,
              provider: pipelineError.provider,
            },
            payload: {
              error_message: pipelineError.message,
            },
          },
        })
        traceEmitter.emitStep({ event: 'done', query_id: preAllocatedQueryId })
      } catch (emitErr) {
        console.error('[consume:v2] step_error emit failed', emitErr)
      }
      return NextResponse.json(
        {
          error: 'pipeline_stage_failed',
          stage: pipelineError.stage,
          reason: pipelineError.reason,
          model_id: pipelineError.model_id,
          provider: pipelineError.provider,
          query_id: preAllocatedQueryId,
          user_message: `The ${pipelineError.stage} step failed. Please try again, or pick a different model from the picker.`,
        },
        { status: 502 }
      )
    }
    const msg = pipelineError instanceof Error ? pipelineError.message : String(pipelineError)
    console.error('[consume:v2] pre-stream error:', msg)
    return NextResponse.json(
      {
        error: 'pipeline_unknown_error',
        reason: msg,
        query_id: preAllocatedQueryId,
        user_message: 'An unexpected error happened before the response could be generated. Please try again.',
      },
      { status: 500 }
    )
  }
  }

  const systemPrompt = consumeSystemPrompt(chart, reportsResult.rows, style)

  console.log(`[consume] pre-stream setup: ${Date.now() - setupStart}ms  model=${modelId}  style=${style}`)

  // Provider-specific system message handling. Anthropic supports ephemeral
  // prompt caching on the stable prefix; Gemini does not. Attach cache control
  // only where it's supported so other providers see a plain system message.
  const systemMessage: ModelMessage = supports(modelId, 'prompt-caching')
    ? {
        role: 'system',
        content: systemPrompt,
        providerOptions: {
          anthropic: { cacheControl: { type: 'ephemeral' } },
        },
      }
    : {
        role: 'system',
        content: systemPrompt,
      }

  const modelMessages: ModelMessage[] = [
    systemMessage,
    ...(await convertToModelMessages(messages)),
  ]

  let finishReason: string | undefined

  // Some models (e.g. DeepSeek R1) don't support tool-use reliably; omit tools
  // entirely for those so the model answers from conversation context alone
  // rather than emitting malformed tool calls.
  const toolsForModel = supports(modelId, 'tool-use') ? consumeTools : undefined

  const result = streamText({
    model: resolveModel(modelId),
    messages: modelMessages,
    tools: toolsForModel,
    stopWhen: stepCountIs(5),
    maxOutputTokens: modelMeta.maxOutputTokens,
    experimental_transform: smoothStream({ delayInMs: 20, chunking: 'word' }),
    onFinish: ({ finishReason: reason, providerMetadata, usage }) => {
      finishReason = reason
      const meta = providerMetadata?.anthropic as
        | { cacheReadInputTokens?: number; cacheCreationInputTokens?: number }
        | undefined
      console.log(
        `[consume] stream finish: model=${modelId} finishReason=${reason} ` +
          `cacheRead=${meta?.cacheReadInputTokens ?? 0} ` +
          `cacheCreate=${meta?.cacheCreationInputTokens ?? 0} ` +
          `inputTokens=${usage?.inputTokens ?? 0} ` +
          `outputTokens=${usage?.outputTokens ?? 0}`
      )
      if (reason === 'length') {
        console.warn('[consume] OUTPUT TRUNCATED: hit maxOutputTokens cap', {
          model: modelId,
          cap: modelMeta.maxOutputTokens,
        })
      }
    },
  })

  // Keep the server stream alive even if the client disconnects, so onFinish
  // still fires and we persist the full assistant turn.
  result.consumeStream()

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
    messageMetadata: ({ part }) => {
      if (part.type === 'start' && isFirstTurn) {
        return { conversationId: finalConversationId, model: modelId }
      }
      if (part.type === 'start') {
        return { model: modelId }
      }
      // Emitted after streamText.onFinish has run, so finishReason is set.
      if (part.type === 'finish' && finishReason === 'length') {
        return { truncated: true }
      }
    },
    onFinish: async ({ messages: finalMessages }) => {
      try {
        // First-turn insert was fired in parallel with the stream; await it
        // before writing messages so the FK (messages.conversation_id) is valid.
        if (pendingConversationInsert) await pendingConversationInsert
        await replaceConversationMessages({
          conversationId: finalConversationId,
          messages: finalMessages,
        })
        if (isFirstTurn) {
          generateConversationTitle(finalMessages).then(title => {
            if (title) void updateConversationTitle(finalConversationId, title)
          })
        }
      } catch (err) {
        console.error('[consume] persistence failed', err)
      }
    },
    onError: error => {
      if (error instanceof Error) return error.message
      return 'Something went wrong while generating a response.'
    },
  })
}

async function generateConversationTitle(messages: UIMessage[]): Promise<string | null> {
  const firstUser = messages.find(m => m.role === 'user')
  if (!firstUser) return null
  const text = firstUser.parts
    .filter(p => p.type === 'text')
    .map(p => (p as { text: string }).text)
    .join(' ')
    .trim()
  if (!text) return null

  try {
    // Pinned to the cheapest fast model regardless of the user's picked chat
    // model — titles are short and latency-sensitive.
    const { text: title } = await generateText({
      model: resolveModel(TITLE_MODEL_ID),
      system:
        'Summarize the user question as a concise 3-6 word chat title. No quotes, no trailing punctuation, Title Case.',
      prompt: text.slice(0, 500),
      maxOutputTokens: 40,
    })
    const cleaned = title.replace(/^["']|["']$/g, '').trim().slice(0, 80)
    return cleaned || fallbackTitle(text)
  } catch {
    return fallbackTitle(text)
  }
}

function fallbackTitle(text: string): string {
  const firstLine = text.split('\n')[0].trim()
  if (firstLine.length <= 60) return firstLine
  const slice = firstLine.slice(0, 60)
  const lastSpace = slice.lastIndexOf(' ')
  return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice) + '…'
}

function extractText(parts: Array<{ type: string; text?: string }>): string {
  return parts.filter(p => p.type === 'text').map(p => p.text ?? '').join(' ').trim()
}
