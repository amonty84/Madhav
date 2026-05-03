'use client'

// Phase O — O.3 Export — UI panel.
//
// Mounted on the events page (/observatory/events) above the EventExplorer
// as a collapsible "Export data" section. Authored by USTAD_S3_4. Form state
// is local; on submit we call buildExportUrl and navigate the browser to it,
// which triggers a file-download dialog without us having to materialise the
// file in memory inside the React app.

import * as React from 'react'

import { buildExportUrl } from '@/lib/api-clients/observatory'
import {
  EXPORT_DEFAULT_LIMIT,
  EXPORT_MAX_LIMIT,
  type ExportFormat,
  type ExportParams,
} from '@/lib/observatory/export/types'

const PROVIDERS = ['anthropic', 'openai', 'gemini', 'deepseek', 'nim'] as const
const STAGES = ['classify', 'compose', 'retrieve', 'synthesize', 'audit'] as const

function isoDate(d: Date): string {
  const yyyy = d.getUTCFullYear().toString().padStart(4, '0')
  const mm = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  const dd = d.getUTCDate().toString().padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function defaultDateRange(): { start: string; end: string } {
  const now = new Date()
  const end = isoDate(now)
  const startMs = now.getTime() - 29 * 24 * 60 * 60 * 1000
  const start = isoDate(new Date(startMs))
  return { start, end }
}

export function ExportPanel(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const initial = React.useMemo(defaultDateRange, [])
  const [dateStart, setDateStart] = React.useState(initial.start)
  const [dateEnd, setDateEnd] = React.useState(initial.end)
  const [provider, setProvider] = React.useState('')
  const [pipelineStage, setPipelineStage] = React.useState('')
  const [format, setFormat] = React.useState<ExportFormat>('csv')
  const [limit, setLimit] = React.useState(EXPORT_DEFAULT_LIMIT)
  const [busy, setBusy] = React.useState(false)

  function handleDownload(): void {
    setBusy(true)
    const params: ExportParams = {
      format,
      date_start: dateStart,
      date_end: dateEnd,
      limit,
      provider: provider || undefined,
      pipeline_stage: pipelineStage || undefined,
    }
    const url = buildExportUrl(params)
    window.location.href = url
    // Reset busy after a short delay; the download happens in another stack.
    window.setTimeout(() => setBusy(false), 500)
  }

  return (
    <section
      data-testid="observatory-export-panel"
      data-open={open ? 'true' : 'false'}
      className="rounded border bg-card"
    >
      <button
        type="button"
        data-testid="observatory-export-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-muted"
      >
        <span>Export data</span>
        <span aria-hidden className="text-xs text-muted-foreground">
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open ? (
        <div
          data-testid="observatory-export-form"
          className="grid gap-3 border-t px-3 py-3 sm:grid-cols-6 sm:items-end"
        >
          <label className="flex flex-col gap-1 text-xs">
            <span>Date start</span>
            <input
              type="date"
              data-testid="export-date-start"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="rounded border px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span>Date end</span>
            <input
              type="date"
              data-testid="export-date-end"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="rounded border px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span>Provider</span>
            <select
              data-testid="export-provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="rounded border px-2 py-1 text-xs"
            >
              <option value="">All</option>
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span>Pipeline stage</span>
            <select
              data-testid="export-pipeline-stage"
              value={pipelineStage}
              onChange={(e) => setPipelineStage(e.target.value)}
              className="rounded border px-2 py-1 text-xs"
            >
              <option value="">All</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="flex flex-col gap-1 text-xs">
            <legend>Format</legend>
            <div
              data-testid="export-format"
              className="flex items-center gap-3"
            >
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="export-format"
                  value="csv"
                  data-testid="export-format-csv"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                />
                CSV
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="export-format"
                  value="json"
                  data-testid="export-format-json"
                  checked={format === 'json'}
                  onChange={() => setFormat('json')}
                />
                JSON
              </label>
            </div>
          </fieldset>
          <label className="flex flex-col gap-1 text-xs">
            <span>Limit (max {EXPORT_MAX_LIMIT.toLocaleString()})</span>
            <input
              type="number"
              data-testid="export-limit"
              min={1}
              max={EXPORT_MAX_LIMIT}
              value={limit}
              onChange={(e) => {
                const next = Number(e.target.value)
                if (Number.isFinite(next)) setLimit(next)
              }}
              className="rounded border px-2 py-1 text-xs"
            />
          </label>
          <div className="sm:col-span-6">
            <button
              type="button"
              data-testid="export-download"
              onClick={handleDownload}
              disabled={busy || !dateStart || !dateEnd}
              className="rounded border bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Preparing…' : 'Download export'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
