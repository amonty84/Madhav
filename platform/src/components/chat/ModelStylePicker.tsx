'use client'

import { Check, ChevronDown, Gauge, Sparkles, Zap, type LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MODELS,
  PROVIDER_LABEL,
  getModelMeta,
  modelsByProvider,
  type SpeedTier,
} from '@/lib/models/registry'
import { cn } from '@/lib/utils'

// Model IDs are validated against the registry at runtime. Keeping this alias
// as `string` avoids a literal-union churn whenever we add/rename a model.
export type ModelId = string
export type StyleId = 'acharya' | 'brief' | 'client'

const ICON_BY_TIER: Record<SpeedTier, LucideIcon> = {
  fast: Zap,
  balanced: Gauge,
  deep: Sparkles,
}

function TierIcon({ tier, className }: { tier: SpeedTier; className?: string }) {
  const Icon = ICON_BY_TIER[tier]
  return <Icon className={className} />
}

export const STYLE_OPTIONS: { id: StyleId; label: string; hint: string }[] = [
  { id: 'acharya', label: 'Acharya depth', hint: 'Full rigor, technical Jyotish' },
  { id: 'brief', label: 'Brief', hint: '1–2 short paragraphs, lead with the answer' },
  { id: 'client', label: 'Simple', hint: 'Plain language for someone unfamiliar with Jyotish' },
]

interface Props {
  model: ModelId
  style: StyleId
  onModelChange: (m: ModelId) => void
  onStyleChange: (s: StyleId) => void
  disabled?: boolean
}

export function ModelStylePicker({ model, style, onModelChange, onStyleChange, disabled }: Props) {
  const currentModel = getModelMeta(model) ?? MODELS[0]
  const currentStyle = STYLE_OPTIONS.find(s => s.id === style) ?? STYLE_OPTIONS[0]
  const grouped = modelsByProvider()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label={`Model: ${currentModel.label}, Style: ${currentStyle.label}`}
        className={cn(
          'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <TierIcon tier={currentModel.speedTier} className="size-3.5" />
        <span className="font-medium text-foreground">{currentModel.label}</span>
        <span className="hidden sm:inline">· {currentStyle.label}</span>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {grouped.map((group, gi) => (
          <DropdownMenuGroup key={group.provider}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {PROVIDER_LABEL[group.provider]}
            </DropdownMenuLabel>
            {group.models.map(opt => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => onModelChange(opt.id)}
                className="flex items-start gap-2"
              >
                <TierIcon tier={opt.speedTier} className="mt-0.5 size-3.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-[11px] text-muted-foreground">{opt.hint}</div>
                </div>
                {model === opt.id && <Check className="mt-0.5 size-3.5 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Style
          </DropdownMenuLabel>
          {STYLE_OPTIONS.map(opt => (
            <DropdownMenuItem
              key={opt.id}
              onClick={() => onStyleChange(opt.id)}
              className="flex items-start gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-[11px] text-muted-foreground">{opt.hint}</div>
              </div>
              {style === opt.id && <Check className="mt-0.5 size-3.5 shrink-0" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
