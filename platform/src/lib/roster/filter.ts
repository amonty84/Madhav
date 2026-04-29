import type { ChartWithMeta, FilterState } from './types'

export const DEFAULT_FILTER: FilterState = {
  q: '',
  place: '',
  dasha: '',
  buildMin: 0,
  buildMax: 100,
  since: '',
}

export function applyFilters(charts: ChartWithMeta[], f: FilterState): ChartWithMeta[] {
  const q = f.q.toLowerCase()
  return charts.filter((c) => {
    if (q && !c.name.toLowerCase().includes(q) && !c.birth_place.toLowerCase().includes(q)) {
      return false
    }
    if (f.place && c.birth_place !== f.place) return false
    if (c.pyramidPercent < f.buildMin || c.pyramidPercent > f.buildMax) return false
    if (f.since) {
      const cutoff = new Date(f.since).getTime()
      const activity = c.lastLayerActivity ? new Date(c.lastLayerActivity).getTime() : 0
      if (activity < cutoff) return false
    }
    return true
  })
}

export function parseFilterFromParams(params: URLSearchParams): FilterState {
  return {
    q: params.get('q') ?? '',
    place: params.get('place') ?? '',
    dasha: params.get('dasha') ?? '',
    buildMin: parseInt(params.get('buildMin') ?? '0', 10),
    buildMax: parseInt(params.get('buildMax') ?? '100', 10),
    since: params.get('since') ?? '',
  }
}

export function filterToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.place) p.set('place', f.place)
  if (f.dasha) p.set('dasha', f.dasha)
  if (f.buildMin > 0) p.set('buildMin', String(f.buildMin))
  if (f.buildMax < 100) p.set('buildMax', String(f.buildMax))
  if (f.since) p.set('since', f.since)
  return p
}

export function distinctPlaces(charts: ChartWithMeta[]): string[] {
  return [...new Set(charts.map((c) => c.birth_place).filter(Boolean))].sort()
}
