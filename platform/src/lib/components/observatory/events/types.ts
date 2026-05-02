// Shared types for the events explorer (S1.12).
// Re-exports the API client's row shape under a stable local alias so the
// table + side panel can evolve independently of the backend types if needed.

import type {
  ObservatoryEventListRow,
  EventDetailResponse,
} from '@/lib/observatory/types'

export type EventRow = ObservatoryEventListRow
export type EventDetail = EventDetailResponse

export type EventColumnId =
  | 'timestamp'
  | 'conversation_name'
  | 'provider'
  | 'model'
  | 'pipeline_stage'
  | 'input_tokens'
  | 'output_tokens'
  | 'cost_usd'
  | 'latency_ms'
  | 'status'
  | 'prompt_id'
  | 'user_id'
  | 'cache_tokens'
  | 'error_code'

export const ALL_EVENT_COLUMNS: readonly EventColumnId[] = [
  'timestamp',
  'conversation_name',
  'provider',
  'model',
  'pipeline_stage',
  'input_tokens',
  'output_tokens',
  'cost_usd',
  'latency_ms',
  'status',
  'prompt_id',
  'user_id',
  'cache_tokens',
  'error_code',
] as const

export const DEFAULT_VISIBLE_COLUMNS: readonly EventColumnId[] = [
  'timestamp',
  'conversation_name',
  'provider',
  'model',
  'pipeline_stage',
  'input_tokens',
  'output_tokens',
  'cost_usd',
  'latency_ms',
  'status',
] as const

export const COLUMN_LABELS: Record<EventColumnId, string> = {
  timestamp: 'Timestamp',
  conversation_name: 'Conversation',
  provider: 'Provider',
  model: 'Model',
  pipeline_stage: 'Stage',
  input_tokens: 'In',
  output_tokens: 'Out',
  cost_usd: 'Cost (USD)',
  latency_ms: 'Latency (ms)',
  status: 'Status',
  prompt_id: 'Prompt',
  user_id: 'User',
  cache_tokens: 'Cache',
  error_code: 'Error',
}

export type SortableColumnId = 'timestamp' | 'cost_usd' | 'latency_ms'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  column: SortableColumnId
  direction: SortDirection
}

export const COLUMN_STORAGE_KEY = 'observatory_event_columns'
