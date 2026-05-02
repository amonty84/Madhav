import { presetToRange, isValidIsoDate } from './dateRange'
import {
  PIPELINE_STAGE_OPTIONS,
  PROVIDER_OPTIONS,
  STATUS_OPTIONS,
  type CallStatusId,
  type DateRangePresetId,
  type LlmProviderId,
  type ObservatoryFilters,
  type PipelineStageId,
} from './types'

const PRESET_IDS = new Set<DateRangePresetId>([
  'today',
  'yesterday',
  '7d',
  '30d',
  '90d',
  'mtd',
  'last_month',
  'custom',
])

const PROVIDER_SET = new Set<string>(PROVIDER_OPTIONS)
const STAGE_SET = new Set<string>(PIPELINE_STAGE_OPTIONS)
const STATUS_SET = new Set<string>(STATUS_OPTIONS)

export const DEFAULT_FILTERS: ObservatoryFilters = {
  date_range: presetToRange('30d'),
  preset: '30d',
  compare_to_previous: false,
  providers: [],
  models: [],
  pipeline_stages: [],
  statuses: [],
  search: '',
}

export function defaultFilters(now: Date = new Date()): ObservatoryFilters {
  return { ...DEFAULT_FILTERS, date_range: presetToRange('30d', now) }
}

export function filtersToParams(f: ObservatoryFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.preset !== '30d') p.set('preset', f.preset)
  if (f.preset === 'custom') {
    p.set('from', f.date_range.from)
    p.set('to', f.date_range.to)
  }
  if (f.compare_to_previous) p.set('compare', '1')
  for (const v of f.providers) p.append('provider', v)
  for (const v of f.models) p.append('model', v)
  for (const v of f.pipeline_stages) p.append('stage', v)
  for (const v of f.statuses) p.append('status', v)
  if (f.search) p.set('q', f.search)
  return p
}

function readPreset(p: URLSearchParams): DateRangePresetId {
  const raw = p.get('preset')
  if (raw && PRESET_IDS.has(raw as DateRangePresetId)) {
    return raw as DateRangePresetId
  }
  return '30d'
}

export function parseFilters(
  params: URLSearchParams,
  now: Date = new Date(),
): ObservatoryFilters {
  const preset = readPreset(params)
  let date_range = presetToRange(preset, now)
  if (preset === 'custom') {
    const from = params.get('from')
    const to = params.get('to')
    if (from && to && isValidIsoDate(from) && isValidIsoDate(to)) {
      date_range = { from, to }
    }
  }
  const providers = params
    .getAll('provider')
    .filter((v): v is LlmProviderId => PROVIDER_SET.has(v))
  const models = params.getAll('model')
  const pipeline_stages = params
    .getAll('stage')
    .filter((v): v is PipelineStageId => STAGE_SET.has(v))
  const statuses = params
    .getAll('status')
    .filter((v): v is CallStatusId => STATUS_SET.has(v))
  return {
    preset,
    date_range,
    compare_to_previous: params.get('compare') === '1',
    providers,
    models,
    pipeline_stages,
    statuses,
    search: params.get('q') ?? '',
  }
}
