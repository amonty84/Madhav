/**
 * MARSYS-JIS Stream D — Synthesis Orchestrator shared types
 * schema_version: 1.1 (Phase 6 — adds checkpoint payload fields to audit event)
 */

import type { QueryPlan } from '@/lib/router/types'
import type { Bundle } from '@/lib/bundle/types'
import type { ToolBundle } from '@/lib/retrieve/types'
import type { RequestScopedToolCache } from '@/lib/cache/index'
import type { AudienceTier, StyleSuffix } from '@/lib/prompts/types'
import type { StreamTextResult, ToolSet } from 'ai'
import type {
  Checkpoint45Result,
  Checkpoint55Result,
  Checkpoint85Result,
  StructuredPrediction,
} from '@/lib/checkpoints/types'

export type { AudienceTier, StyleSuffix }

export interface ChartContext {
  name: string
  birth_date: string  // ISO YYYY-MM-DD
  birth_time: string  // HH:MM (24h)
  birth_place: string // e.g. "Bhubaneswar, Odisha, India"
}

export interface SynthesisRequest {
  query: string
  query_plan: QueryPlan
  bundle: Bundle
  tool_results: ToolBundle[]
  conversation_history: Array<{ role: 'user' | 'assistant'; content: string }>
  selected_model_id: string
  style: StyleSuffix
  audience_tier: AudienceTier
  cache: RequestScopedToolCache
  /** Phase 12 (FUB-1): canonical birth particulars for the native. Optional — callers that
   *  don't provide it fall back to placeholder strings rather than crashing. */
  chart_context?: ChartContext
  /** Phase 4: optional consumer callback. When AUDIT_ENABLED, route.ts wires this. */
  onAuditEvent?: (event: SynthesisAuditEvent) => void
  /** Phase 7: per-query opt-in for panel synthesis. Only active when PANEL_MODE_ENABLED=true. */
  panel_opt_in?: boolean
}

export interface SynthesisMetadata {
  synthesis_prompt_version: string
  synthesizer_model_id: string
  bundle_hash: string
  started_at: string
}

/**
 * Phase 6 checkpoint payloads nested under audit event.
 * Stored as opaque JSONB by Phase 4's v1 consumer — no schema bump required.
 */
export interface CheckpointPayloads {
  c4_5?: Checkpoint45Result
  c5_5?: Checkpoint55Result
  c8_5?: Checkpoint85Result
}

export interface SynthesisAuditEvent {
  event_type: 'synthesis_complete'
  query_plan_id: string
  bundle_id: string
  synthesis_prompt_version: string
  synthesizer_model_id: string
  finish_reason: string
  validator_votes: Record<string, string>
  started_at: string
  finished_at: string
  // Phase 4 additions — additive, no breaking changes to existing consumers:
  input_tokens: number
  output_tokens: number
  final_output: string
  // Phase 6 additions — optional nested fields stored as JSONB by Phase 4 consumer:
  checkpoints?: CheckpointPayloads
  prediction?: StructuredPrediction
  // Phase 7 additions — panel payload; Phase 4 consumer stores as JSONB without schema bump:
  panel?: PanelAuditPayload
}

/** Phase 7 — Panel audit payload attached to SynthesisAuditEvent when panel mode ran. */
export interface PanelAuditPayload {
  panel_slate: string[]
  adjudicator_model_id: string
  member_statuses: Array<'success' | 'failed'>
  divergence_classification: import('./panel/divergence_detector').DivergenceClassification
  degrade_notice?: string
}

/**
 * Return value from synthesize(). The caller (Stream E) calls
 * result.toUIMessageStreamResponse(...) on the streamText result.
 */
export interface SynthesisResult {
  result: StreamTextResult<ToolSet, never>
  metadata: SynthesisMetadata
}

export interface SynthesisOrchestrator {
  synthesize(request: SynthesisRequest): Promise<SynthesisResult>
}
