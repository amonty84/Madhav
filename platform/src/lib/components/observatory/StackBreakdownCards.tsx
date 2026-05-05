'use client'

import { cn } from '@/lib/utils'
import type { BreakdownsResponse, BreakdownRow } from '@/lib/observatory/types'
import { PROVIDER_COLORS } from './charts/utils'
import { formatUsd, formatTokens, formatRequests } from './kpi/format'

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  nim: 'NIM',
}

const PROVIDER_ORDER = ['anthropic', 'openai', 'gemini', 'deepseek', 'nim']

function pct(part: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((part / total) * 100)}%`
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[rgba(212,175,55,0.10)] bg-[oklch(0.12_0.012_70)] p-4 animate-pulse">
      <div className="h-3 w-20 rounded bg-[rgba(212,175,55,0.08)]" />
      <div className="h-7 w-28 rounded bg-[rgba(212,175,55,0.08)]" />
      <div className="h-3 w-16 rounded bg-[rgba(212,175,55,0.06)]" />
      <div className="h-3 w-24 rounded bg-[rgba(212,175,55,0.06)]" />
    </div>
  )
}

interface StackCardProps {
  provider: string
  row: BreakdownRow
  totalCost: number
  isTop: boolean
}

function StackCard({ provider, row, totalCost, isTop }: StackCardProps) {
  const color = PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] ?? '#d4af37'
  const label = PROVIDER_LABELS[provider] ?? provider
  const share = pct(row.cost_usd, totalCost)
  const totalTokens = row.input_tokens + row.output_tokens + row.cache_tokens

  return (
    <div
      className={cn(
        'relative flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:border-opacity-60',
        isTop
          ? 'border-[rgba(212,175,55,0.35)] bg-[oklch(0.12_0.015_75)]'
          : 'border-[rgba(212,175,55,0.10)] bg-[oklch(0.11_0.010_70)]',
      )}
      style={{ borderTopColor: color, borderTopWidth: 2 }}
    >
      {/* Provider label + share badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {share}
        </span>
      </div>

      {/* Primary: cost */}
      <p className="font-heading text-2xl font-bold text-[#fce29a] tabular-nums leading-none">
        {formatUsd(row.cost_usd)}
      </p>

      {/* Secondary metrics */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[rgba(212,175,55,0.50)]">
        <span>
          <span className="text-[rgba(212,175,55,0.70)]">{formatRequests(row.request_count)}</span>{' '}
          calls
        </span>
        <span>
          <span className="text-[rgba(212,175,55,0.70)]">{formatTokens(totalTokens)}</span>{' '}
          tokens
        </span>
        <span>
          <span className="text-[rgba(212,175,55,0.70)]">{Math.round(row.avg_latency_ms)}ms</span>{' '}
          p50
        </span>
      </div>

      {/* Token split mini-bar */}
      {totalTokens > 0 && (
        <div className="mt-1 flex h-1 w-full overflow-hidden rounded-full bg-[rgba(212,175,55,0.08)]">
          <div
            className="h-full"
            style={{
              width: pct(row.input_tokens, totalTokens),
              backgroundColor: color,
              opacity: 0.9,
            }}
          />
          <div
            className="h-full"
            style={{
              width: pct(row.output_tokens, totalTokens),
              backgroundColor: color,
              opacity: 0.5,
            }}
          />
          <div
            className="h-full"
            style={{
              width: pct(row.cache_tokens, totalTokens),
              backgroundColor: color,
              opacity: 0.25,
            }}
          />
        </div>
      )}
    </div>
  )
}

export interface StackBreakdownCardsProps {
  data: BreakdownsResponse | null
  loading?: boolean
}

export function StackBreakdownCards({ data, loading = false }: StackBreakdownCardsProps) {
  if (loading || !data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PROVIDER_ORDER.map((p) => <SkeletonCard key={p} />)}
      </div>
    )
  }

  if (data.rows.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.08)] text-sm text-[rgba(212,175,55,0.30)]">
        No provider data in this range
      </div>
    )
  }

  const totalCost = data.rows.reduce((s, r) => s + r.cost_usd, 0)
  const topProvider = data.rows.reduce((best, r) => (r.cost_usd > best.cost_usd ? r : best), data.rows[0]).dim_value

  // Merge by ordered providers — show only those present in the data, ordered
  const rowMap = new Map(data.rows.map((r) => [r.dim_value, r]))
  const ordered = PROVIDER_ORDER
    .filter((p) => rowMap.has(p))
    .map((p) => ({ provider: p, row: rowMap.get(p)! }))

  // Append any unknown providers not in our known list
  for (const r of data.rows) {
    if (!PROVIDER_ORDER.includes(r.dim_value)) {
      ordered.push({ provider: r.dim_value, row: r })
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {ordered.map(({ provider, row }) => (
        <StackCard
          key={provider}
          provider={provider}
          row={row}
          totalCost={totalCost}
          isTop={provider === topProvider}
        />
      ))}
    </div>
  )
}
