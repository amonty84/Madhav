'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AudienceTier } from '@/lib/prompts/types'

interface Props {
  tier: AudienceTier
  methodologyBlock?: string | null
  defaultExpanded?: boolean
  compact?: boolean
  className?: string
}

const TIER_CONFIG: Record<
  AudienceTier,
  { label: string; tooltip: string; chipClass: string }
> = {
  super_admin: {
    label: 'Super Admin',
    tooltip:
      'Full synthesis output with derivation ledger, methodology block, and all validator metadata visible.',
    chipClass:
      'bg-rose-100/80 text-rose-800 border-rose-200/60 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/40',
  },
  acharya_reviewer: {
    label: 'Acharya Review',
    tooltip:
      'Acharya-grade output including classical basis, interpretive alternatives, and timing signals. Sensitive personal data redacted.',
    chipClass:
      'bg-amber-100/80 text-amber-800 border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/40',
  },
  client: {
    label: 'Client',
    tooltip:
      'Client-safe synthesis: classical jargon minimised, probabilistic framing explicit, privacy-sensitive signals filtered.',
    chipClass:
      'bg-emerald-100/80 text-emerald-800 border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/40',
  },
  public_redacted: {
    label: 'Public (Redacted)',
    tooltip:
      'Maximum redaction tier: all personal identifiers removed, only general astrological patterns surfaced.',
    chipClass:
      'bg-slate-100/80 text-slate-700 border-slate-200/60 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-600/40',
  },
}

export function DisclosureTierBadge({ tier, methodologyBlock, defaultExpanded, compact, className }: Props) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  // defaultExpanded prop overrides tier-based default; falls back to
  // super_admin === expanded for backward compatibility.
  const [methodologyExpanded, setMethodologyExpanded] = useState(
    defaultExpanded ?? tier === 'super_admin'
  )

  const config = TIER_CONFIG[tier]

  // Compact mode: chip only — no methodology expander or helper text.
  if (compact) {
    return (
      <span
        role="status"
        aria-label={`Disclosure tier: ${config.label}. ${config.tooltip}`}
        className={cn(
          'inline-flex cursor-default select-none items-center rounded border px-1.5 py-0.5',
          'bt-label font-medium',
          config.chipClass,
          className
        )}
      >
        {config.label}
      </span>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <div className="relative inline-block">
          <span
            role="status"
            aria-label={`Disclosure tier: ${config.label}. ${config.tooltip}`}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
            tabIndex={0}
            className={cn(
              'inline-flex cursor-default select-none items-center rounded border px-1.5 py-0.5',
              'bt-label font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              config.chipClass
            )}
          >
            {config.label}
          </span>

          {tooltipVisible && (
            <div
              role="tooltip"
              className={cn(
                'absolute bottom-full left-0 z-10 mb-1.5 w-64 rounded-md border border-border',
                'bg-popover px-3 py-2 shadow-md',
                'bt-label text-popover-foreground'
              )}
            >
              {config.tooltip}
            </div>
          )}
        </div>

        {tier === 'super_admin' && methodologyBlock ? (
          <button
            type="button"
            aria-expanded={methodologyExpanded}
            aria-controls="methodology-block"
            onClick={() => setMethodologyExpanded(e => !e)}
            className={cn(
              'inline-flex items-center gap-1 rounded border border-[var(--brand-gold-hairline)] px-2 py-0.5',
              'bt-label text-[var(--brand-gold)]/70 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]'
            )}
          >
            {methodologyExpanded ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
            {methodologyExpanded ? 'Collapse methodology' : 'Show methodology'}
          </button>
        ) : null}
      </div>

      {tier === 'super_admin' && methodologyBlock && methodologyExpanded && (
        <div
          id="methodology-block"
          role="region"
          aria-label="Methodology disclosure"
          className={cn(
            'mt-2 rounded-md border border-[var(--brand-gold-hairline)] bg-[var(--brand-charcoal)]/60 p-3',
            'font-mono text-[12px] leading-relaxed text-[var(--brand-cream)] whitespace-pre-wrap'
          )}
        >
          {methodologyBlock}
        </div>
      )}
    </div>
  )
}
