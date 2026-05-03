'use client'

import * as React from 'react'
import {
  getBreakdowns,
  getSummary,
  getTimeseries,
  type BreakdownsParams,
  type SummaryParams,
  type TimeseriesParams,
} from '@/lib/api-clients/observatory'
import type {
  BreakdownsResponse,
  SummaryResponse,
  TimeseriesResponse,
} from '@/lib/observatory/types'
import { CostByModelChart, CostOverTimeChart } from '../charts'
import { FiltersBar } from '../filters/FiltersBar'
import { useObservatoryFilters } from '../filters/useObservatoryFilters'
import type { ObservatoryFilters as UiFilters } from '../filters/types'
import { KpiTilesRow } from '../kpi/KpiTilesRow'
import { uiToApiFilters, uiToDashboardRange } from './filterAdapter'

type GroupedBreakdowns = {
  provider: BreakdownsResponse | null
  pipeline_stage: BreakdownsResponse | null
  model: BreakdownsResponse | null
}

interface OverviewClientProps {
  /** Test seam — production code uses the api client directly. */
  apiClient?: {
    getSummary: (p: SummaryParams) => Promise<SummaryResponse>
    getTimeseries: (p: TimeseriesParams) => Promise<TimeseriesResponse>
    getBreakdowns: (p: BreakdownsParams) => Promise<BreakdownsResponse>
  }
}

const DEFAULT_API = { getSummary, getTimeseries, getBreakdowns }

export function OverviewClient({
  apiClient = DEFAULT_API,
}: OverviewClientProps = {}): React.ReactElement {
  const { filters, setFilters } = useObservatoryFilters()
  const [summary, setSummary] = React.useState<SummaryResponse | null>(null)
  const [timeseries, setTimeseries] = React.useState<TimeseriesResponse | null>(
    null,
  )
  const [breakdowns, setBreakdowns] = React.useState<GroupedBreakdowns>({
    provider: null,
    pipeline_stage: null,
    model: null,
  })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refetch = React.useCallback(
    async (f: UiFilters) => {
      setLoading(true)
      setError(null)
      try {
        const range = uiToDashboardRange(f)
        const apiF = uiToApiFilters(f)
        const [s, ts, prov, stage, model] = await Promise.all([
          apiClient.getSummary({
            ...range,
            compare_to_previous: f.compare_to_previous,
            filters: apiF,
          }),
          apiClient.getTimeseries({
            ...range,
            granularity: 'day',
            dimension: 'provider',
            filters: apiF,
          }),
          apiClient.getBreakdowns({
            ...range,
            dimension: 'provider',
            filters: apiF,
          }),
          apiClient.getBreakdowns({
            ...range,
            dimension: 'pipeline_stage',
            filters: apiF,
          }),
          apiClient.getBreakdowns({
            ...range,
            dimension: 'model',
            filters: apiF,
          }),
        ])
        setSummary(s)
        setTimeseries(ts)
        setBreakdowns({ provider: prov, pipeline_stage: stage, model })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load observatory data')
      } finally {
        setLoading(false)
      }
    },
    [apiClient],
  )

  React.useEffect(() => {
    void refetch(filters)
  }, [filters, refetch])

  const modelOptions = React.useMemo(
    () => (breakdowns.model?.rows ?? []).map((r) => r.dim_value),
    [breakdowns.model],
  )

  return (
    <div data-testid="observatory-overview" className="flex flex-col gap-4">
      <FiltersBar
        filters={filters}
        modelOptions={modelOptions}
        onFiltersChange={setFilters}
      />

      {error ? (
        <div
          data-testid="observatory-overview-error"
          role="alert"
          className="rounded border border-destructive/40 bg-destructive/5 p-3 text-sm"
        >
          {error}
        </div>
      ) : null}

      <KpiTilesRow
        summary={summary ?? undefined}
        loading={loading && !summary}
        onRetry={() => void refetch(filters)}
      />

      <section data-testid="observatory-overview-timeseries">
        <h2 className="mb-2 text-sm font-medium uppercase text-muted-foreground">
          Cost over time — by provider
        </h2>
        <CostOverTimeChart
          data={timeseries}
          dimension="provider"
          granularity="day"
          loading={loading && !timeseries}
          onRetry={() => void refetch(filters)}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section data-testid="observatory-overview-provider-breakdown">
          <h2 className="mb-2 text-sm font-medium uppercase text-muted-foreground">
            Cost breakdown — by provider
          </h2>
          <CostByModelChart
            data={breakdowns.provider}
            loading={loading && !breakdowns.provider}
            onRetry={() => void refetch(filters)}
          />
        </section>
        <section data-testid="observatory-overview-stage-breakdown">
          <h2 className="mb-2 text-sm font-medium uppercase text-muted-foreground">
            Cost breakdown — by pipeline stage
          </h2>
          <CostByModelChart
            data={breakdowns.pipeline_stage}
            loading={loading && !breakdowns.pipeline_stage}
            onRetry={() => void refetch(filters)}
          />
        </section>
      </div>
    </div>
  )
}
