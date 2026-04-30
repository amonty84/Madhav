/**
 * MARSYS-JIS Query Trace Panel — shared types
 * schema_version: 1.0
 */

export type StepType = 'deterministic' | 'llm' | 'sql' | 'vector' | 'gcs'
export type StepStatus = 'pending' | 'running' | 'done' | 'error'

/** A single retrieved chunk or signal row, with layer classification */
export interface TraceChunkItem {
  id: string                  // chunk_id / signal_id
  source: string              // canonical_id or tool_name
  layer: 'L1' | 'L2.5' | 'system'
  token_estimate: number
  text: string                // full raw text
}

/** Lightweight statistics stored in data_summary column */
export interface TraceDataSummary {
  // deterministic
  result?: string
  confidence?: number
  // llm
  model?: string
  input_tokens?: number
  output_tokens?: number
  // sql / vector / gcs — shared
  token_estimate?: number
  // sql
  rows_returned?: number
  tool_name?: string
  // vector
  chunks_returned?: number
  top_score?: number
  // gcs
  source_path?: string
  bytes?: number
  // plan (per_tool_planner)
  planner_active?: boolean
  tools_refined?: number
  tool_count?: number
}

/** Full drill-down content stored in payload column */
export interface TracePayload {
  // sql / vector / gcs steps
  items?: TraceChunkItem[]
  // context_assembly step
  l1_tokens?: number
  l2_tokens?: number
  system_tokens?: number
  total_tokens?: number
  l1_items?: TraceChunkItem[]
  l2_items?: TraceChunkItem[]
  // llm steps
  prompt_preview?: string
}

/** One pipeline step record (maps 1:1 to a query_trace_steps row) */
export interface TraceStep {
  query_id: string
  conversation_id?: string
  step_seq: number
  step_name: string
  step_type: StepType
  status: StepStatus
  started_at: string          // ISO 8601
  completed_at?: string       // ISO 8601, set on done/error
  latency_ms?: number
  parallel_group?: string     // e.g. 'tool_fetch' — marks concurrent siblings
  data_summary: TraceDataSummary
  payload: TracePayload
}

/** Event sent over SSE and through the in-process emitter */
export interface TraceEvent {
  event: 'step_start' | 'step_done' | 'step_error' | 'done'
  query_id: string
  step?: TraceStep
}
