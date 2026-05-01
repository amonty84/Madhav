import type { Chart } from '@/lib/db/types'

export interface RosterStats {
  total: number
  inActiveBuild: number
  consumedToday: number
  predictionsOverdue: number
}

export interface ChartWithMeta extends Chart {
  pyramidPercent: number
  // ISO timestamp of the most recent pyramid_layers.updated_at for this chart
  lastLayerActivity: string | null
}

export interface FilterState {
  q: string
  place: string
  dasha: string
  buildMin: number
  buildMax: number
  since: string
}
