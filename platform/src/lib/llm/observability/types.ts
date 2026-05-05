// Provider-agnostic observability shim — type surface.
//
// Authored by USTAD_S1_2_LLMCLIENT_SHIM (Phase O sub-phase O.1) per
// OBSERVATORY_PLAN_v1_0.md §2.1 (telemetry layer) + §3.1 (llm_usage_events row).
// Consumed by S1.4–S1.8 provider adapters (Anthropic / OpenAI / Gemini /
// DeepSeek / NIM); the adapters call observe() / observeStream() and never
// touch llm_usage_events directly.

import type { LlmUsageEventRow } from '@/lib/db/schema/observatory'

export type ProviderName =
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'deepseek'
  | 'nim'

export type PipelineStage =
  | 'classify'
  | 'compose'
  | 'retrieve'
  | 'synthesize'
  | 'audit'
  | 'other'
  | 'planner'
  | 'title'
  | 'history_summary'

export type CallStatus = 'success' | 'error' | 'timeout'

export interface TokenUsage {
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_write_tokens: number
  reasoning_tokens: number
}

export interface ObservedLLMRequest {
  provider: ProviderName
  model: string
  prompt_text: string | null
  system_prompt: string | null
  parameters: unknown
  conversation_id: string
  conversation_name: string | null
  prompt_id: string
  parent_prompt_id?: string
  user_id: string
  pipeline_stage: PipelineStage
}

export interface ObservedLLMResponse {
  response_text: string | null
  usage: TokenUsage
  provider_request_id?: string
  status: CallStatus
  error_code?: string
  started_at: Date
  finished_at: Date
}

export type PersistedObservation = LlmUsageEventRow

export interface CostResult {
  computed_cost_usd: number
  pricing_version_id: string
}

// Minimal structural DB interface — anything that exposes pg-style query()
// satisfies it. Decouples the shim from the concrete pg.Pool import so tests
// can substitute a stub without spinning up a real database.
export interface ObservatoryDb {
  query<T = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: T[]; rowCount?: number | null }>
}

export const ZERO_USAGE: TokenUsage = Object.freeze({
  input_tokens: 0,
  output_tokens: 0,
  cache_read_tokens: 0,
  cache_write_tokens: 0,
  reasoning_tokens: 0,
})
