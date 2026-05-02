// FiltersBar state — the rich, UI-side observatory filter shape.
//
// This is distinct from `ObservatoryFilters` in `@/lib/observatory/types`,
// which is the narrower API query shape (provider/model/pipeline_stage only).
// S1.13 wires this UI state into API queries by mapping date_range → from/to,
// passing compare_to_previous through, and forwarding the array filters.

export type LlmProviderId =
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'deepseek'
  | 'nim'

export type PipelineStageId =
  | 'classify'
  | 'compose'
  | 'retrieve'
  | 'synthesize'
  | 'audit'
  | 'other'

export type CallStatusId = 'success' | 'error' | 'timeout'

export type DateRangePresetId =
  | 'today'
  | 'yesterday'
  | '7d'
  | '30d'
  | '90d'
  | 'mtd'
  | 'last_month'
  | 'custom'

export interface DateRange {
  /** Inclusive ISO date (YYYY-MM-DD). */
  from: string
  /** Inclusive ISO date (YYYY-MM-DD). */
  to: string
}

export interface ObservatoryFilters {
  date_range: DateRange
  preset: DateRangePresetId
  compare_to_previous: boolean
  providers: LlmProviderId[]
  models: string[]
  pipeline_stages: PipelineStageId[]
  statuses: CallStatusId[]
  search: string
}

export const PROVIDER_OPTIONS: ReadonlyArray<LlmProviderId> = [
  'anthropic',
  'openai',
  'gemini',
  'deepseek',
  'nim',
]

export const PIPELINE_STAGE_OPTIONS: ReadonlyArray<PipelineStageId> = [
  'classify',
  'compose',
  'retrieve',
  'synthesize',
  'audit',
  'other',
]

export const STATUS_OPTIONS: ReadonlyArray<CallStatusId> = [
  'success',
  'error',
  'timeout',
]

export const DATE_RANGE_PRESETS: ReadonlyArray<{
  id: DateRangePresetId
  label: string
}> = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: 'mtd', label: 'MTD' },
  { id: 'last_month', label: 'Last month' },
  { id: 'custom', label: 'Custom' },
]
