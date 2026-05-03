// Pure presentation: provider tabs + history table + (provider-conditional)
// CSV upload form. Server-renderable; receives the loaded rows as a prop so
// unit tests don't need to hit the DB loader.

import Link from 'next/link'
import type { ReconciliationHistoryRow } from '@/lib/observatory/reconciliation/types'
import { StatusChip, providerLabel } from './StatusChip'

const TAB_PROVIDERS = ['anthropic', 'openai', 'gemini', 'deepseek', 'nim'] as const
type TabProvider = (typeof TAB_PROVIDERS)[number]
const MANUAL_UPLOAD_PROVIDERS = new Set<string>(['deepseek', 'nim'])

function fmtUsd(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

function fmtPct(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return `${value.toFixed(2)}%`
}

function fmtPeriod(row: ReconciliationHistoryRow): string {
  if (!row.period_end || row.period_end === row.period_start) return row.period_start
  return `${row.period_start} → ${row.period_end}`
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toISOString().slice(0, 19).replace('T', ' ') + 'Z'
}

export interface ReconciliationHistoryViewProps {
  /** Active provider filter (URL-driven). null/undefined → 'All'. */
  selectedProvider?: string | null
  rows: ReconciliationHistoryRow[]
  total: number
}

export function ReconciliationHistoryView({
  selectedProvider,
  rows,
  total,
}: ReconciliationHistoryViewProps) {
  const active = selectedProvider ?? null
  const showUpload =
    active === null || MANUAL_UPLOAD_PROVIDERS.has(active)

  return (
    <section
      data-testid="reconciliation-history-page"
      className="flex flex-col gap-6"
    >
      <header>
        <h1 className="text-xl font-semibold">Reconciliation History</h1>
        <p className="text-sm text-muted-foreground">
          Per-provider reconciliation runs comparing telemetry-computed cost to
          authoritative billing. {total} total run{total === 1 ? '' : 's'}.
        </p>
      </header>

      <nav
        data-testid="reconciliation-tabs"
        aria-label="Provider filter"
        className="flex flex-wrap items-center gap-1 border-b text-sm"
      >
        <Link
          href="/observatory/reconciliation"
          data-testid="reconciliation-tab-all"
          aria-current={active === null ? 'page' : undefined}
          className={
            'border-b-2 px-3 py-2 ' +
            (active === null
              ? 'border-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground')
          }
        >
          All
        </Link>
        {TAB_PROVIDERS.map((p: TabProvider) => (
          <Link
            key={p}
            href={`/observatory/reconciliation?provider=${p}`}
            data-testid={`reconciliation-tab-${p}`}
            aria-current={active === p ? 'page' : undefined}
            className={
              'border-b-2 px-3 py-2 ' +
              (active === p
                ? 'border-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground')
            }
          >
            {providerLabel(p)}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <div
          data-testid="reconciliation-empty"
          className="rounded border border-dashed p-6 text-sm text-muted-foreground"
        >
          No reconciliation runs yet. Trigger a reconciliation from the API or
          upload a CSV for DeepSeek/NIM.
        </div>
      ) : (
        <div
          data-testid="reconciliation-table-wrapper"
          className="overflow-x-auto rounded border"
        >
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Provider</th>
                <th className="px-3 py-2 text-left">Period</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Authoritative</th>
                <th className="px-3 py-2 text-right">Computed</th>
                <th className="px-3 py-2 text-right">Variance%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr
                  key={row.reconciliation_id}
                  data-testid={`reconciliation-row-${row.reconciliation_id}`}
                  className="border-t"
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    {fmtDate(row.created_at)}
                  </td>
                  <td className="px-3 py-2">{providerLabel(row.provider)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{fmtPeriod(row)}</td>
                  <td className="px-3 py-2">
                    <StatusChip
                      provider={row.provider}
                      status={row.status}
                      variancePct={row.variance_pct}
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {fmtUsd(row.authoritative_cost_usd)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {fmtUsd(row.computed_cost_usd)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {fmtPct(row.variance_pct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUpload && (
        <form
          data-testid="reconciliation-upload-form"
          action="/api/admin/observatory/reconciliation/upload"
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col gap-3 rounded border p-4"
        >
          <div>
            <h2 className="text-sm font-semibold">
              Manual reconciliation upload (DeepSeek / NIM)
            </h2>
            <p className="text-xs text-muted-foreground">
              These two providers do not expose an admin/billing API. Upload
              the per-day or monthly invoice CSV for the period below.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Provider</span>
              <select
                name="provider"
                defaultValue={
                  active && MANUAL_UPLOAD_PROVIDERS.has(active) ? active : 'deepseek'
                }
                className="rounded border bg-background px-2 py-1 text-sm"
                data-testid="reconciliation-upload-provider"
              >
                <option value="deepseek">DeepSeek</option>
                <option value="nim">NIM</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Period start</span>
              <input
                type="date"
                name="period_start"
                required
                className="rounded border bg-background px-2 py-1 text-sm"
                data-testid="reconciliation-upload-period-start"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Period end</span>
              <input
                type="date"
                name="period_end"
                required
                className="rounded border bg-background px-2 py-1 text-sm"
                data-testid="reconciliation-upload-period-end"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">CSV file</span>
              <input
                type="file"
                name="file"
                accept=".csv,text/csv"
                required
                className="rounded border bg-background px-2 py-1 text-sm"
                data-testid="reconciliation-upload-file"
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="rounded border bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
              data-testid="reconciliation-upload-submit"
            >
              Upload &amp; reconcile
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
