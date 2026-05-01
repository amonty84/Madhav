'use client'

import { cn } from '@/lib/utils'
import type { AudienceTier } from '@/lib/prompts/types'

const TIERS: { value: AudienceTier; label: string }[] = [
  { value: 'client',      label: 'Client'  },
  { value: 'acharya_reviewer', label: 'Acharya' },
  { value: 'super_admin', label: 'Super'   },
]

interface Props {
  tier: AudienceTier
  onChange: (tier: AudienceTier) => void
}

export function TierPicker({ tier, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Audience tier"
      className="flex gap-px rounded-md border border-border bg-muted/30 p-0.5"
    >
      {TIERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'rounded px-2.5 py-1 text-[11px] font-medium transition-colors',
            tier === value
              ? 'bg-[var(--brand-gold)] text-[var(--brand-charcoal)]'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
