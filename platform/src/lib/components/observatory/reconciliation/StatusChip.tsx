// Status chip used by the banner + history table.
//
// Server-renderable; pure presentation. Five statuses + a fallback so any
// future status string from the DB doesn't crash the chip render.

import type { ReconciliationStatus } from '@/lib/observatory/reconciliation/types'

const PROVIDER_LABEL: Record<string, string> = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  nim: 'NIM',
}

export function providerLabel(provider: string): string {
  return PROVIDER_LABEL[provider] ?? provider
}

interface ChipMeta {
  /** Tailwind background colour for the dot. */
  dotClass: string
  /** Render label (excluding variance numerals). */
  text: string
}

function renderMeta(
  status: ReconciliationStatus | string,
  variancePct: number | null,
): ChipMeta {
  const v =
    variancePct != null && Number.isFinite(variancePct)
      ? Math.abs(variancePct).toFixed(1)
      : null
  switch (status) {
    case 'matched':
      return { dotClass: 'bg-green-500', text: 'Reconciled' }
    case 'variance_within_tolerance':
      return {
        dotClass: 'bg-amber-500',
        text: v ? `±${v}%` : 'Within tolerance',
      }
    case 'variance_alert':
      return {
        dotClass: 'bg-red-500',
        text: v ? `Alert ±${v}%` : 'Alert',
      }
    case 'missing_authoritative':
      return { dotClass: 'bg-gray-400', text: 'No data' }
    case 'error':
      return { dotClass: 'bg-orange-500', text: 'Error' }
    default:
      return { dotClass: 'bg-gray-300', text: String(status) }
  }
}

export interface StatusChipProps {
  provider: string
  status: ReconciliationStatus | string
  variancePct: number | null
  /** Optional href; when set the chip becomes a link. */
  href?: string
}

export function StatusChip({
  provider,
  status,
  variancePct,
  href,
}: StatusChipProps) {
  const meta = renderMeta(status, variancePct)
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 rounded-full ${meta.dotClass}`}
      />
      <span className="font-medium text-foreground">
        {providerLabel(provider)}
      </span>
      <span className="text-muted-foreground">{meta.text}</span>
    </>
  )

  const className =
    'inline-flex items-center gap-1.5 rounded border bg-background px-2 py-1 text-xs hover:bg-muted'

  if (href) {
    return (
      <a
        href={href}
        data-testid={`reconciliation-chip-${provider}`}
        data-status={status}
        className={className}
      >
        {inner}
      </a>
    )
  }
  return (
    <span
      data-testid={`reconciliation-chip-${provider}`}
      data-status={status}
      className={className}
    >
      {inner}
    </span>
  )
}
