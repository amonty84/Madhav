'use client'

import { cn } from '@/lib/utils'

interface BaseProps {
  testId: string
  label: string
  loading?: boolean
  error?: boolean
  onRetry?: () => void
}

interface KpiTileProps extends BaseProps {
  /** Primary value (formatted). */
  value?: React.ReactNode
  /** Optional secondary line (e.g., p95 underneath p50). */
  secondary?: React.ReactNode
  /** Delta string (e.g., "↓ 3.4%") and its semantic colour. */
  delta?: { text: string; tone: 'good' | 'bad' | 'neutral' } | null
  /** Hover-only tooltip for the entire tile. */
  title?: string
  /** Optional bottom slot for a sparkline / split bar. */
  footer?: React.ReactNode
}

const TONE_CLASS: Record<'good' | 'bad' | 'neutral', string> = {
  good: 'text-emerald-600',
  bad: 'text-red-600',
  neutral: 'text-muted-foreground',
}

export function KpiTile({
  testId,
  label,
  value,
  secondary,
  delta,
  title,
  footer,
  loading,
  error,
  onRetry,
}: KpiTileProps) {
  if (error) {
    return (
      <div
        data-testid={`${testId}-error`}
        role="alert"
        className="flex h-full flex-col justify-between rounded-md border border-destructive/30 bg-destructive/5 p-4"
      >
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-sm text-destructive">Failed to load.</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            data-testid={`${testId}-retry`}
            className="mt-2 self-start rounded border px-2 py-1 text-xs hover:bg-muted"
          >
            Retry
          </button>
        ) : null}
      </div>
    )
  }

  if (loading) {
    return (
      <div
        data-testid={`${testId}-skeleton`}
        aria-busy="true"
        className="flex h-full flex-col rounded-md border bg-card p-4"
      >
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-7 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div
      data-testid={testId}
      title={title}
      className="flex h-full flex-col justify-between rounded-md border bg-card p-4"
    >
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p data-testid={`${testId}-value`} className="mt-1 font-heading text-2xl">
          {value}
        </p>
        {secondary ? (
          <p data-testid={`${testId}-secondary`} className="mt-1 text-sm text-muted-foreground">
            {secondary}
          </p>
        ) : null}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        {delta ? (
          <span
            data-testid={`${testId}-delta`}
            data-tone={delta.tone}
            className={cn('text-xs font-medium', TONE_CLASS[delta.tone])}
          >
            {delta.text}
          </span>
        ) : (
          <span />
        )}
        {footer ? (
          <div data-testid={`${testId}-footer`} className="flex-1">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
