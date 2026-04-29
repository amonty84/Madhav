import 'server-only'

import { generateText } from 'ai'
import { resolveModel } from '@/lib/models/resolver'
import { validate } from '@/lib/schemas/index'
import { telemetry } from '@/lib/telemetry/index'
import { configService } from '@/lib/config/index'
import {
  ROUTER_SYSTEM_PROMPT,
  buildRouterUserMessage,
  buildStrictRetryMessage,
} from './prompt'
import type { QueryPlan } from './types'

export type { QueryPlan }

// ---------------------------------------------------------------------------
// Public interfaces
// ---------------------------------------------------------------------------

export interface RouterConfig {
  model_id: string
  temperature: number
  max_tokens: number
}

export interface RouterContext {
  conversation_history?: Array<{ role: 'user' | 'assistant'; content: string }>
  audience_tier: 'super_admin' | 'acharya_reviewer' | 'client' | 'public_redacted'
  manifest_fingerprint: string
}

// ---------------------------------------------------------------------------
// Fallback plan — returned when both attempts fail schema validation
// ---------------------------------------------------------------------------
function buildFallbackPlan(
  query: string,
  context: RouterContext,
  modelId: string
): QueryPlan {
  return {
    query_plan_id: crypto.randomUUID(),
    query_text: query,
    query_class: 'interpretive',
    domains: [],
    forward_looking: false,
    audience_tier: context.audience_tier,
    tools_authorized: ['msr_sql', 'pattern_register'],
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'three_interpretation',
    manifest_fingerprint: context.manifest_fingerprint,
    schema_version: '1.0',
    router_confidence: 0.0,
    router_model_id: modelId,
  }
}

// ---------------------------------------------------------------------------
// JSON extraction helper — strips any accidental markdown fences
// ---------------------------------------------------------------------------
function extractJson(raw: string): string {
  const stripped = raw.trim()
  // Handle ```json ... ``` or ``` ... ```
  const fenceMatch = stripped.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/)
  if (fenceMatch) return fenceMatch[1].trim()
  return stripped
}

// ---------------------------------------------------------------------------
// Core classify function
// ---------------------------------------------------------------------------
export async function classify(
  query: string,
  context: RouterContext,
  config?: Partial<RouterConfig>
): Promise<QueryPlan> {
  const modelId =
    config?.model_id ??
    configService.getValue<string>('ROUTER_MODEL_OVERRIDE', 'claude-haiku-4-5')
  const temperature =
    config?.temperature ??
    configService.getValue<number>('ROUTER_TEMPERATURE', 0.0)
  const maxTokens =
    config?.max_tokens ??
    configService.getValue<number>('ROUTER_MAX_TOKENS', 1024)

  const model = resolveModel(modelId)

  const promptInputs = {
    query,
    conversationHistory: context.conversation_history,
    audienceTier: context.audience_tier,
  }

  // ---------------------------------------------------------------------------
  // Attempt 1 — standard classification prompt
  // ---------------------------------------------------------------------------
  const attempt1Start = Date.now()
  let rawText1 = ''
  let inputTokens1 = 0
  let outputTokens1 = 0

  try {
    const result1 = await generateText({
      model,
      system: ROUTER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildRouterUserMessage(promptInputs) }],
      temperature,
      maxOutputTokens: maxTokens,
    })

    rawText1 = result1.text
    inputTokens1 = result1.usage?.inputTokens ?? 0
    outputTokens1 = result1.usage?.outputTokens ?? 0
  } catch (err) {
    telemetry.recordError('router', 'llm_call_1_failed', err instanceof Error ? err : new Error(String(err)))
    return buildFallbackPlan(query, context, modelId)
  } finally {
    telemetry.recordLatency('router', 'classify', Date.now() - attempt1Start)
    telemetry.recordCost('router', modelId, inputTokens1, outputTokens1, 0)
  }

  // Try to parse attempt 1
  let parsed1: unknown
  let parseError1: string | null = null
  try {
    parsed1 = JSON.parse(extractJson(rawText1))
  } catch (e) {
    parseError1 = e instanceof Error ? e.message : String(e)
  }

  if (parsed1 !== undefined) {
    const result = applyCallerFields(parsed1, query, context, modelId)
    const validation = validate<QueryPlan>('query_plan', result)
    if (validation.valid && validation.data) {
      return { ...validation.data, router_confidence: 1.0, router_model_id: modelId }
    }
    // Schema invalid — fall through to retry
    parseError1 = validation.errors?.map(e => `${e.path}: ${e.message}`).join('; ') ?? 'schema validation failed'
  }

  // ---------------------------------------------------------------------------
  // Attempt 2 — strict retry with error feedback
  // ---------------------------------------------------------------------------
  const attempt2Start = Date.now()
  let rawText2 = ''
  let inputTokens2 = 0
  let outputTokens2 = 0

  try {
    const result2 = await generateText({
      model,
      system: ROUTER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildStrictRetryMessage(promptInputs, parseError1 ?? 'unknown error'),
        },
      ],
      temperature: 0.0, // force deterministic on retry
      maxOutputTokens: maxTokens,
    })

    rawText2 = result2.text
    inputTokens2 = result2.usage?.inputTokens ?? 0
    outputTokens2 = result2.usage?.outputTokens ?? 0
  } catch (err) {
    telemetry.recordError('router', 'llm_call_2_failed', err instanceof Error ? err : new Error(String(err)))
    return buildFallbackPlan(query, context, modelId)
  } finally {
    telemetry.recordLatency('router', 'classify_retry', Date.now() - attempt2Start)
    telemetry.recordCost('router', modelId, inputTokens2, outputTokens2, 0)
  }

  // Try to parse attempt 2
  let parsed2: unknown
  try {
    parsed2 = JSON.parse(extractJson(rawText2))
  } catch {
    return buildFallbackPlan(query, context, modelId)
  }

  const result2 = applyCallerFields(parsed2, query, context, modelId)
  const validation2 = validate<QueryPlan>('query_plan', result2)
  if (validation2.valid && validation2.data) {
    return { ...validation2.data, router_confidence: 1.0, router_model_id: modelId }
  }

  // Both attempts failed — return safe fallback
  return buildFallbackPlan(query, context, modelId)
}

// ---------------------------------------------------------------------------
// applyCallerFields — overlay the caller-controlled fields onto the LLM output
// so the LLM can never override audience_tier or manifest_fingerprint.
// ---------------------------------------------------------------------------
function applyCallerFields(
  llmOutput: unknown,
  query: string,
  context: RouterContext,
  modelId: string
): unknown {
  if (typeof llmOutput !== 'object' || llmOutput === null) {
    return llmOutput
  }
  return {
    ...(llmOutput as Record<string, unknown>),
    query_plan_id: crypto.randomUUID(),
    query_text: query,
    audience_tier: context.audience_tier,
    manifest_fingerprint: context.manifest_fingerprint,
    schema_version: '1.0',
    router_model_id: modelId,
  }
}
