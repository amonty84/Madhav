// Map UI-side ObservatoryFilters (rich shape used by FiltersBar / URL state)
// to API-side ObservatoryFilters (narrow shape consumed by /summary, /timeseries,
// /breakdowns). UI extras like `statuses` and `search` live on the events
// endpoint only and don't map onto the dashboard endpoints.

import type { ObservatoryFilters as UiFilters } from '../filters/types'
import type { ObservatoryFilters as ApiFilters } from '@/lib/observatory/types'

/** Convert YYYY-MM-DD to ISO 8601 datetime at start of UTC day. */
export function dateOnlyToFromIso(d: string): string {
  return `${d}T00:00:00.000Z`
}

/** Convert YYYY-MM-DD (inclusive) to ISO 8601 datetime at end-of-day-exclusive
 *  (i.e. start of the following UTC day). API ranges are half-open: [from, to). */
export function dateOnlyToToIso(d: string): string {
  const [y, m, day] = d.split('-').map(Number)
  const next = new Date(Date.UTC(y, (m ?? 1) - 1, (day ?? 1) + 1))
  return next.toISOString()
}

export function uiToApiFilters(ui: UiFilters): ApiFilters {
  const out: ApiFilters = {}
  if (ui.providers.length > 0) out.provider = ui.providers
  if (ui.models.length > 0) out.model = ui.models
  if (ui.pipeline_stages.length > 0) out.pipeline_stage = ui.pipeline_stages
  return out
}

export function uiToDashboardRange(ui: UiFilters): { from: string; to: string } {
  return {
    from: dateOnlyToFromIso(ui.date_range.from),
    to: dateOnlyToToIso(ui.date_range.to),
  }
}
