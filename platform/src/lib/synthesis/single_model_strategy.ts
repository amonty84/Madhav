/**
 * MARSYS-JIS Stream D — Single-Model Synthesis Orchestrator
 * schema_version: 1.1 (Phase 6 — checkpoint hook points)
 *
 * Takes a validated retrieval bundle, picks a prompt template, wraps
 * retrieval tools for AI SDK tool-use, and calls streamText to produce the
 * synthesis response.
 *
 * Phase 6 adds three flag-gated checkpoint hooks:
 *   Hook 1 (post-resolve)  — checkpoint 4.5 runs before retrieval
 *   Hook 2 (post-retrieve) — checkpoint 5.5 runs before synthesis
 *   Hook 3 (post-synthesize) — checkpoint 8.5 runs in onFinish
 * All hooks are no-ops when their respective flags are OFF. Flag-OFF path is
 * byte-identical to the Phase 3 baseline.
 */

import 'server-only'

import { streamText, stepCountIs, smoothStream, tool } from 'ai'
import { traceEmitter } from '@/lib/trace/emitter'
import type { TraceChunkItem } from '@/lib/trace/types'
import type { ModelMessage, ToolSet } from 'ai'
import { z } from 'zod'

import { resolveModel } from '@/lib/models/resolver'
import { getModelMeta, supports } from '@/lib/models/registry'
import { getDefaultRegistry } from '@/lib/prompts/index'
import { renderTemplate } from '@/lib/prompts/types'
import { getTool } from '@/lib/retrieve/index'
import { executeWithCache } from '@/lib/cache/index'
import { telemetry } from '@/lib/telemetry/index'
import { getFlag } from '@/lib/config/index'

import { runCheckpoint4_5 } from '@/lib/checkpoints/checkpoint_4_5'
import { runCheckpoint5_5 } from '@/lib/checkpoints/checkpoint_5_5'
import { runCheckpoint8_5 } from '@/lib/checkpoints/checkpoint_8_5'
import type { Checkpoint45Result, Checkpoint55Result, Checkpoint85Result } from '@/lib/checkpoints/types'

import type {
  SynthesisRequest,
  SynthesisResult,
  SynthesisMetadata,
  SynthesisAuditEvent,
  SynthesisOrchestrator,
} from './types'

// Token-budget constants for pre-fetched content injection (FUB-2 + FUB-3)
const MAX_CHART_CONTEXT_TOKENS = 6000
const MAX_TOOL_RESULTS_TOKENS = 3000
// Rough chars-per-token estimate for truncation (conservative)
const CHARS_PER_TOKEN = 4

export class SingleModelOrchestrator implements SynthesisOrchestrator {
  async synthesize(request: SynthesisRequest): Promise<SynthesisResult> {
    const {
      query,
      query_plan,
      bundle,
      tool_results,
      conversation_history,
      selected_model_id,
      style,
      audience_tier,
      cache,
      conversation_id,
      onAuditEvent,
    } = request

    const started_at = new Date().toISOString()

    // ── Hook 1: Checkpoint 4.5 (post-resolve, pre-retrieve) ──────────────────
    // No-op when CHECKPOINT_4_5_ENABLED=false (flag-OFF = skipped result returned).
    let c4_5Result: Checkpoint45Result | undefined
    if (getFlag('CHECKPOINT_4_5_ENABLED')) {
      c4_5Result = await runCheckpoint4_5({
        query,
        query_plan,
        discarded_alternatives: [],
      })
      // CheckpointHaltError thrown by runCheckpoint4_5 when FAIL_HARD=true; propagates up.
    }

    // ── Hook 2: Checkpoint 5.5 (post-retrieve, pre-synthesis) ────────────────
    // Skipped when 4.5 halted (error thrown above) or flag is OFF.
    let c5_5Result: Checkpoint55Result | undefined
    if (getFlag('CHECKPOINT_5_5_ENABLED')) {
      c5_5Result = await runCheckpoint5_5({
        query,
        query_plan,
        bundle,
        tool_results,
      })
      // CheckpointHaltError thrown by runCheckpoint5_5 when FAIL_HARD=true; propagates up.
    }

    // ── Synthesis setup (unchanged from Phase 3 baseline) ────────────────────

    const registry = getDefaultRegistry()
    const template = registry.get(query_plan.query_class, audience_tier, 'single_model')

    const variables: Record<string, string> = {
      chart_name: request.chart_context?.name ?? 'the native',
      birth_date: request.chart_context?.birth_date ?? '<birth date unavailable>',
      birth_time: request.chart_context?.birth_time ?? '<birth time unavailable>',
      birth_place: request.chart_context?.birth_place ?? '<birth place unavailable>',
      bundle_summary: bundle.mandatory_context
        .map(e => `${e.canonical_id} (${e.role})`)
        .join(', '),
      tools_available: query_plan.tools_authorized.join(', '),
    }
    let renderedPrompt = renderTemplate(template, variables, style)

    // ── FUB-2: Append chart context block from vector_search floor-asset results ─
    // Eagerly inject semantic chunks from floor-role assets so the LLM has
    // actual FORENSIC/MSR content in context before calling any tools.
    const vsResults = tool_results
      .filter(tb => tb.tool_name === 'vector_search')
      .flatMap(tb => tb.results)

    if (vsResults.length > 0 && bundle.mandatory_context.some(e => e.role === 'floor')) {
      const maxChars = MAX_CHART_CONTEXT_TOKENS * CHARS_PER_TOKEN
      const chunks = vsResults
        .map(r => `[chunk:${r.signal_id ?? 'unknown'}]\n${r.content}`)
        .join('\n\n---\n\n')
      const truncated = chunks.length > maxChars ? chunks.slice(0, maxChars) + '\n[...truncated]' : chunks
      renderedPrompt += `\n\n<CHART_CONTEXT_BLOCK source="vector_search">\n${truncated}\n</CHART_CONTEXT_BLOCK>`
    }

    // ── FUB-3: Append pre-fetched tool_results (non-vector_search) ─────────────
    // MSR signals and other eagerly retrieved bundles are appended here so the
    // LLM sees them even if it doesn't re-invoke those tools.
    const nonVsResults = tool_results.filter(tb => tb.tool_name !== 'vector_search')
    if (nonVsResults.length > 0) {
      const maxChars = MAX_TOOL_RESULTS_TOKENS * CHARS_PER_TOKEN
      const blocks = nonVsResults
        .map(tb =>
          tb.results
            .map(r => `[signal:${r.signal_id ?? tb.tool_name}] ${r.content}`)
            .join('\n')
        )
        .join('\n\n')
      const truncated = blocks.length > maxChars ? blocks.slice(0, maxChars) + '\n[...truncated]' : blocks
      renderedPrompt += `\n\n<PRE_FETCHED_TOOL_RESULTS>\n${truncated}\n</PRE_FETCHED_TOOL_RESULTS>`
    }

    // ── Trace: context_assembly step ─────────────────────────────────────────
    // Emit after both FUB-2 and FUB-3 blocks are assembled so token counts
    // reflect the actual content entering the LLM context.
    // Fire-and-forget — never awaited.
    {
      const qid = query_plan.query_plan_id
      const nToolSteps = query_plan.tools_authorized?.length ?? 0
      const ctxSeq = 3 + nToolSteps       // synthesis is ctxSeq+1

      const l1Items: TraceChunkItem[] = vsResults.map(r => ({
        id: r.signal_id ?? 'unknown',
        source: 'vector_search',
        layer: 'L1' as const,
        token_estimate: Math.ceil(r.content.length / 4),
        text: r.content,
      }))

      const l2Items: TraceChunkItem[] = nonVsResults.flatMap(tb =>
        tb.results.map((r: { signal_id?: string; content: string }) => ({
          id: r.signal_id ?? tb.tool_name,
          source: tb.tool_name,
          layer: 'L2.5' as const,
          token_estimate: Math.ceil(r.content.length / 4),
          text: r.content,
        }))
      )

      const systemChars = renderedPrompt.length
      const systemTokens = Math.ceil(systemChars / 4)
      const l1Tokens = l1Items.reduce((s, i) => s + i.token_estimate, 0)
      const l2Tokens = l2Items.reduce((s, i) => s + i.token_estimate, 0)
      const totalTokens = l1Tokens + l2Tokens + systemTokens

      traceEmitter.emitStep({
        event: 'step_done',
        query_id: qid,
        step: {
          query_id: qid,
          conversation_id,
          step_seq: ctxSeq,
          step_name: 'context_assembly',
          step_type: 'deterministic',
          status: 'done',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          latency_ms: 0,
          data_summary: { token_estimate: totalTokens },
          payload: {
            l1_tokens: l1Tokens,
            l2_tokens: l2Tokens,
            system_tokens: systemTokens,
            total_tokens: totalTokens,
            l1_items: l1Items,
            l2_items: l2Items,
          },
        },
      })
    }

    let toolsForModel: ToolSet | undefined
    if (supports(selected_model_id, 'tool-use')) {
      const wrappedTools: ToolSet = {}
      for (const toolName of query_plan.tools_authorized) {
        wrappedTools[toolName] = tool({
          description: `Retrieval tool: ${toolName}. Use to extend the context bundle.`,
          inputSchema: z.object({ query_hint: z.string().optional() }),
          execute: async () => {
            const t = getTool(toolName)
            if (!t) return { error: `Tool ${toolName} not found` }
            const toolBundle = await executeWithCache(t, query_plan, cache)
            return { results: toolBundle.results, tool_name: toolName }
          },
        })
      }
      toolsForModel = Object.keys(wrappedTools).length > 0 ? wrappedTools : undefined
    }

    const systemMessage: ModelMessage = supports(selected_model_id, 'prompt-caching')
      ? {
          role: 'system',
          content: renderedPrompt,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral' } },
          },
        }
      : {
          role: 'system',
          content: renderedPrompt,
        }

    const historyMessages: ModelMessage[] = conversation_history.map(m => ({
      role: m.role,
      content: m.content,
    }))

    const modelMessages: ModelMessage[] = [
      systemMessage,
      ...historyMessages,
      { role: 'user', content: query },
    ]

    const modelMeta = getModelMeta(selected_model_id)

    const metadata: SynthesisMetadata = {
      synthesis_prompt_version: template.version,
      synthesizer_model_id: selected_model_id,
      bundle_hash: bundle.bundle_hash,
      started_at,
    }

    // Populated synchronously at the top of onFinish (before any await), so
    // it is set by the time the 'finish' SSE part fires in toUIMessageStreamResponse.
    const methodologyBlockHolder: { value: string | null } = { value: null }

    const result = streamText({
      model: resolveModel(selected_model_id),
      messages: modelMessages,
      tools: toolsForModel,
      stopWhen: stepCountIs(5),
      maxOutputTokens: modelMeta?.maxOutputTokens,
      experimental_transform: smoothStream({ delayInMs: 20, chunking: 'word' }),
      onFinish: async ({
        finishReason,
        usage,
        text,
      }: {
        finishReason: string
        usage?: { inputTokens?: number; outputTokens?: number }
        text?: string
      }) => {
        // Synchronous extraction — before any await — so the value is
        // available when the 'finish' SSE part fires in the route handler.
        const mbMatch = (text ?? '').match(/^```marsys_methodology_block\n([\s\S]*?)\n```/m)
        methodologyBlockHolder.value = mbMatch ? mbMatch[1].trim() : null

        // ── Trace: synthesis done ─────────────────────────────────────────────
        // Fire-and-forget — never awaited.
        {
          const qid = query_plan.query_plan_id
          const nToolSteps = query_plan.tools_authorized?.length ?? 0
          const synthesisSeq = 3 + nToolSteps + 1
          traceEmitter.emitStep({
            event: 'step_done',
            query_id: qid,
            step: {
              query_id: qid,
              conversation_id,
              step_seq: synthesisSeq,
              step_name: 'synthesis',
              step_type: 'llm',
              status: 'done',
              started_at: new Date().toISOString(),
              completed_at: new Date().toISOString(),
              latency_ms: 0,             // wall-clock tracked by consume/route
              data_summary: {
                model: selected_model_id,
                input_tokens: usage?.inputTokens ?? 0,
                output_tokens: usage?.outputTokens ?? 0,
              },
              payload: {
                prompt_preview: (text ?? '').slice(0, 500),
              },
            },
          })
        }

        telemetry.recordMetric('synthesis', 'stream_finish', 1, {
          finishReason,
          model: selected_model_id,
        })
        telemetry.recordCost(
          'synthesis',
          selected_model_id,
          usage?.inputTokens ?? 0,
          usage?.outputTokens ?? 0,
          0,
        )

        // ── Hook 3: Checkpoint 8.5 (post-synthesize) ─────────────────────────
        // Runs async in onFinish after stream completes. Halt verdict is logged
        // to telemetry but cannot stop the response already sent to the user;
        // it gates prediction logging and flags the audit event.
        let c8_5Result: Checkpoint85Result | undefined
        if (getFlag('CHECKPOINT_8_5_ENABLED')) {
          try {
            c8_5Result = await runCheckpoint8_5({
              synthesized_text: text ?? '',
              query_class: query_plan.query_class,
              validator_results: [],
            })
          } catch {
            // CheckpointHaltError with FAIL_HARD=true — log; response already sent
            telemetry.recordMetric('synthesis', 'checkpoint_8_5_late_halt', 1)
          }
        }

        const auditEvent: SynthesisAuditEvent = {
          event_type: 'synthesis_complete',
          query_plan_id: query_plan.query_plan_id,
          bundle_id: bundle.bundle_id,
          synthesis_prompt_version: template.version,
          synthesizer_model_id: selected_model_id,
          finish_reason: finishReason,
          validator_votes: {},
          started_at: metadata.started_at,
          finished_at: new Date().toISOString(),
          input_tokens: usage?.inputTokens ?? 0,
          output_tokens: usage?.outputTokens ?? 0,
          final_output: text ?? '',
          // Phase 6: checkpoint payloads (undefined when flags OFF)
          checkpoints: (c4_5Result || c5_5Result || c8_5Result)
            ? { c4_5: c4_5Result, c5_5: c5_5Result, c8_5: c8_5Result }
            : undefined,
          prediction: c8_5Result?.prediction,
        }

        telemetry.recordMetric('synthesis', 'audit_event', 1, {
          event_type: 'synthesis_complete',
        })
        console.log('[synthesis] audit event:', JSON.stringify(auditEvent))

        onAuditEvent?.(auditEvent)
      },
    })

    return { result, metadata, methodologyBlockHolder }
  }
}

export function createOrchestrator(): SynthesisOrchestrator {
  return new SingleModelOrchestrator()
}
