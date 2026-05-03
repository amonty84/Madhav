'use client'

// Phase O — O.4 Advanced Analytics — Replay & Re-cost UI.
// Authored by USTAD_S4_5_REPLAY_RECOST.
//
// Read-only operation: this panel never causes a write to llm_usage_events.
// It POSTs to /api/admin/observatory/analytics/replay and renders the
// returned ReplayResult. The backend computes everything in memory.

import { useEffect, useState, type FormEvent } from 'react'

import type {
  ReplayBreakdown,
  ReplayResult,
  ReplayPricingVersionOption,
} from '@/lib/observatory/analytics/replay'

interface ReplayPanelProps {
  /** Default `[date_start, date_end]` rendered into the form. Useful for
   *  tests. If omitted: today − 30d ... today. */
  defaultDateStart?: string
  defaultDateEnd?: string
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoIso(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

function fmtUsd(n: number): string {
  const sign = n < 0 ? '−' : ''
  const abs = Math.abs(n)
  return `${sign}$${abs.toFixed(4)}`
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

export function ReplayPanel({
  defaultDateStart,
  defaultDateEnd,
}: ReplayPanelProps = {}) {
  const [dateStart, setDateStart] = useState(defaultDateStart ?? daysAgoIso(30))
  const [dateEnd, setDateEnd] = useState(defaultDateEnd ?? todayIso())
  const [pricingVersions, setPricingVersions] = useState<
    ReplayPricingVersionOption[]
  >([])
  const [pricingLoadError, setPricingLoadError] = useState<string | null>(null)
  const [targetVersionId, setTargetVersionId] = useState<string>('')
  const [provider, setProvider] = useState<string>('')
  const [model, setModel] = useState<string>('')
  const [limit, setLimit] = useState<number>(10_000)

  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReplayResult | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const r = await fetch(
          '/api/admin/observatory/analytics/replay/pricing-versions',
          { method: 'GET' },
        )
        if (!r.ok) {
          throw new Error(`pricing-versions HTTP ${r.status}`)
        }
        const body = (await r.json()) as {
          versions: ReplayPricingVersionOption[]
        }
        if (!cancelled) setPricingVersions(body.versions ?? [])
      } catch (err) {
        if (!cancelled) {
          setPricingLoadError(
            err instanceof Error ? err.message : 'Failed to load pricing versions',
          )
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      const body: Record<string, unknown> = {
        date_start: dateStart,
        date_end: dateEnd,
        limit,
      }
      if (targetVersionId) body.target_pricing_version_id = targetVersionId
      if (provider) body.provider = provider
      if (model) body.model = model
      const r = await fetch('/api/admin/observatory/analytics/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const errBody = await r.json().catch(() => ({}))
        const detail =
          (errBody as { error?: { message?: string }; message?: string })
            ?.error?.message ??
          (errBody as { message?: string })?.message ??
          `HTTP ${r.status}`
        throw new Error(detail)
      }
      const data = (await r.json()) as ReplayResult
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Replay failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div data-testid="replay-panel" className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Replay &amp; Re-cost</h1>
        <p className="text-sm text-muted-foreground">
          Re-cost historical events under alternative pricing.{' '}
          <strong>Re-cost is computed in memory. Original event costs are
          unchanged.</strong>
        </p>
      </header>

      <form
        data-testid="replay-form"
        onSubmit={onSubmit}
        className="flex flex-col gap-4 rounded border bg-card p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Date start</span>
            <input
              type="date"
              data-testid="replay-date-start"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              required
              className="h-8 rounded border bg-background px-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Date end</span>
            <input
              type="date"
              data-testid="replay-date-end"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              required
              className="h-8 rounded border bg-background px-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">
              Target pricing version (optional)
            </span>
            <select
              data-testid="replay-pricing-version"
              value={targetVersionId}
              onChange={(e) => setTargetVersionId(e.target.value)}
              className="h-8 rounded border bg-background px-2 text-sm"
            >
              <option value="">Latest pricing per (provider, model)</option>
              {pricingVersions.map((pv) => (
                <option
                  key={`${pv.pricing_version_id}-${pv.provider}-${pv.model}`}
                  value={pv.pricing_version_id}
                >
                  {pv.provider} / {pv.model} — {pv.effective_from}
                </option>
              ))}
            </select>
            {pricingLoadError ? (
              <span className="text-[10px] text-destructive">
                {pricingLoadError}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Limit (max 50000)</span>
            <input
              type="number"
              data-testid="replay-limit"
              min={1}
              max={50_000}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-8 rounded border bg-background px-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Provider (optional)</span>
            <input
              type="text"
              data-testid="replay-provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. anthropic"
              className="h-8 rounded border bg-background px-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Model (optional)</span>
            <input
              type="text"
              data-testid="replay-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. claude-opus-4-7"
              className="h-8 rounded border bg-background px-2 text-sm"
            />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            data-testid="replay-run"
            disabled={running}
            className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {running ? 'Running…' : 'Run re-cost'}
          </button>
          {error ? (
            <span data-testid="replay-error" className="text-xs text-destructive">
              {error}
            </span>
          ) : null}
        </div>
      </form>

      {result ? (
        <ResultView result={result} />
      ) : (
        <div
          data-testid="replay-empty"
          className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground"
        >
          Run a re-cost to see results.
        </div>
      )}
    </div>
  )
}

function ResultView({ result }: { result: ReplayResult }) {
  return (
    <section
      data-testid="replay-result"
      className="flex flex-col gap-4 rounded border bg-card p-4"
    >
      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Stat label="Events" value={String(result.events_processed)} />
        <Stat
          label="Original total"
          value={fmtUsd(result.original_total_usd)}
        />
        <Stat label="Re-cost total" value={fmtUsd(result.recost_total_usd)} />
        <Stat
          label="Delta"
          value={`${fmtUsd(result.delta_total_usd)} (${fmtPct(result.delta_total_pct)})`}
          tone={result.delta_total_usd === 0 ? 'neutral' : result.delta_total_usd > 0 ? 'positive' : 'negative'}
        />
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span>
          Anchor pricing version:{' '}
          <code>{result.target_pricing_version_id || '—'}</code>{' '}
          (effective from{' '}
          <code>{result.target_pricing_effective_from || '—'}</code>)
        </span>
        <span>Computed at {result.computed_at}</span>
        <span>
          Re-cost is computed in memory. Original event costs are unchanged.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table
          data-testid="replay-breakdown-table"
          className="w-full border-collapse text-sm"
        >
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-1">Provider</th>
              <th className="px-2 py-1">Model</th>
              <th className="px-2 py-1 text-right">Events</th>
              <th className="px-2 py-1 text-right">Original</th>
              <th className="px-2 py-1 text-right">Re-cost</th>
              <th className="px-2 py-1 text-right">Delta</th>
              <th className="px-2 py-1 text-right">Delta %</th>
            </tr>
          </thead>
          <tbody>
            {result.breakdown.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-2 py-3 text-center text-muted-foreground"
                >
                  No events in range.
                </td>
              </tr>
            ) : (
              result.breakdown.map((row) => (
                <BreakdownRow key={`${row.provider}::${row.model ?? ''}`} row={row} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function BreakdownRow({ row }: { row: ReplayBreakdown }) {
  const tone =
    row.delta_usd === 0
      ? 'text-muted-foreground'
      : row.delta_usd > 0
        ? 'text-orange-500'
        : 'text-emerald-500'
  return (
    <tr data-testid="replay-breakdown-row" className="border-b last:border-0">
      <td className="px-2 py-1">{row.provider}</td>
      <td className="px-2 py-1">{row.model ?? '—'}</td>
      <td className="px-2 py-1 text-right tabular-nums">{row.event_count}</td>
      <td className="px-2 py-1 text-right tabular-nums">
        {fmtUsd(row.original_cost_usd)}
      </td>
      <td className="px-2 py-1 text-right tabular-nums">
        {fmtUsd(row.recost_usd)}
      </td>
      <td className={`px-2 py-1 text-right tabular-nums ${tone}`}>
        {fmtUsd(row.delta_usd)}
      </td>
      <td className={`px-2 py-1 text-right tabular-nums ${tone}`}>
        {fmtPct(row.delta_pct)}
      </td>
    </tr>
  )
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'neutral' | 'positive' | 'negative'
}) {
  const toneClass =
    tone === 'positive'
      ? 'text-orange-500'
      : tone === 'negative'
        ? 'text-emerald-500'
        : ''
  return (
    <div className="flex flex-col gap-0.5 rounded border bg-background p-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className={`text-base font-semibold tabular-nums ${toneClass}`}>
        {value}
      </span>
    </div>
  )
}
