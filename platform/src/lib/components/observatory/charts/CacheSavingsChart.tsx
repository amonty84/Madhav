'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { BreakdownsResponse } from '@/lib/observatory/types'

import { colorForProvider, formatCostUSD, formatTokenCount } from './utils'

// ---------------------------------------------------------------------------
// Display-only price stubs.
//
// The frontend does not have access to the authoritative pricing table. To
// surface an order-of-magnitude estimate of cache savings we use a fixed,
// per-provider input-token price proxy and assume cache_read costs 0.1× input
// (the Anthropic-published discount; OpenAI is 0.5×, Gemini ~0.25×, but we use
// the conservative 0.1× across the board so the estimate is a *lower bound*
// on Anthropic-style savings and a *over-estimate* for non-Anthropic
// providers — labeled as "estimated" in the UI either way).
// ---------------------------------------------------------------------------

const INPUT_PRICE_PER_MILLION_USD: Record<string, number> = {
  anthropic: 3.0,
  openai: 2.5,
  gemini: 1.25,
  deepseek: 0.27,
  nim: 0.5,
}
const CACHE_READ_DISCOUNT = 0.1 // cache_read cost ≈ 10× cheaper than input
const FALLBACK_INPUT_PRICE = 1.0

export interface CacheSavingsChartProps {
  data: BreakdownsResponse | null
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export interface CacheSavingsRow {
  provider: string
  cache_tokens: number
  cost_without_cache_usd: number
  cost_with_cache_usd: number
  estimated_savings_usd: number
}

export function computeCacheSavings(
  data: BreakdownsResponse,
): CacheSavingsRow[] {
  const rows: CacheSavingsRow[] = []
  for (const r of data.rows) {
    const cacheTokens = r.cache_tokens ?? 0
    if (cacheTokens <= 0) continue
    const inputPrice =
      INPUT_PRICE_PER_MILLION_USD[r.dim_value] ?? FALLBACK_INPUT_PRICE
    const without = (cacheTokens * inputPrice) / 1_000_000
    const withCache = without * CACHE_READ_DISCOUNT
    rows.push({
      provider: r.dim_value,
      cache_tokens: cacheTokens,
      cost_without_cache_usd: without,
      cost_with_cache_usd: withCache,
      estimated_savings_usd: without - withCache,
    })
  }
  return rows.sort((a, b) => b.estimated_savings_usd - a.estimated_savings_usd)
}

function CacheSavingsTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: CacheSavingsRow }>
}) {
  if (!active || !payload || payload.length === 0) return null
  const row = payload[0].payload
  return (
    <div
      data-testid="cache-savings-tooltip"
      className="rounded border bg-background p-2 text-xs shadow"
    >
      <div className="mb-1 font-medium">{row.provider}</div>
      <div className="flex justify-between gap-4">
        <span>Cached tokens</span>
        <span className="tabular-nums">{formatTokenCount(row.cache_tokens)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Estimated without cache</span>
        <span className="tabular-nums">
          {formatCostUSD(row.cost_without_cache_usd)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Estimated with cache</span>
        <span className="tabular-nums">
          {formatCostUSD(row.cost_with_cache_usd)}
        </span>
      </div>
      <div className="mt-1 flex justify-between gap-4 border-t pt-1 font-medium">
        <span>Estimated savings</span>
        <span className="tabular-nums">
          {formatCostUSD(row.estimated_savings_usd)}
        </span>
      </div>
    </div>
  )
}

export function CacheSavingsChart({
  data,
  loading = false,
  error = null,
  onRetry,
}: CacheSavingsChartProps) {
  if (loading) {
    return (
      <div
        data-testid="cache-savings-loading"
        role="status"
        aria-live="polite"
        className="h-72 w-full animate-pulse rounded bg-muted"
      />
    )
  }

  if (error) {
    return (
      <div
        data-testid="cache-savings-error"
        role="alert"
        className="flex h-72 w-full flex-col items-center justify-center gap-2 rounded border border-destructive/30 p-4 text-sm"
      >
        <p>Failed to load cache savings.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded border px-3 py-1 text-xs hover:bg-muted"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  const rows = data ? computeCacheSavings(data) : []

  if (rows.length === 0) {
    return (
      <div
        data-testid="cache-savings-empty"
        className="flex h-72 w-full items-center justify-center rounded border text-sm text-muted-foreground"
      >
        No cached tokens in this range
      </div>
    )
  }

  return (
    <div
      data-testid="cache-savings-chart"
      data-provider-count={rows.length}
      className="h-72 w-full rounded border p-3"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="provider" />
          <YAxis tickFormatter={(v: number) => formatCostUSD(v)} width={84} />
          <Tooltip content={<CacheSavingsTooltip />} />
          <Legend />
          <Bar
            dataKey="cost_without_cache_usd"
            name="Estimated without cache"
            fill="#cbd5e1"
          />
          <Bar
            dataKey="cost_with_cache_usd"
            name="Estimated with cache"
            // Color-keyed by provider on the actual-cost bar
            fill="#6366f1"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-muted-foreground">
        Estimated savings — uses a fixed display-only price proxy
        (Anthropic-style ≈10× cache discount).{' '}
        {rows.map((r) => (
          <span key={r.provider} className="mr-2">
            <span
              aria-hidden="true"
              className="mr-1 inline-block h-2 w-2 rounded-sm align-middle"
              style={{ backgroundColor: colorForProvider(r.provider) }}
            />
            {r.provider}
          </span>
        ))}
      </p>
    </div>
  )
}
