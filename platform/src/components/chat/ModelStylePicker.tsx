'use client'

import { Check, ChevronDown, Gauge, Sparkles, Zap } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type ModelId = 'claude-sonnet-4-6' | 'claude-haiku-4-5' | 'claude-opus-4-7'
export type StyleId = 'acharya' | 'brief' | 'client'

export const MODEL_OPTIONS: { id: ModelId; label: string; hint: string; Icon: typeof Zap }[] = [
  { id: 'claude-haiku-4-5', label: 'Haiku', hint: 'Fast, lighter reasoning', Icon: Zap },
  { id: 'claude-sonnet-4-6', label: 'Sonnet', hint: 'Balanced (default)', Icon: Gauge },
  { id: 'claude-opus-4-7', label: 'Opus', hint: 'Deepest analysis, slower', Icon: Sparkles },
]

export const STYLE_OPTIONS: { id: StyleId; label: string; hint: string }[] = [
  { id: 'acharya', label: 'Acharya depth', hint: 'Full rigor, technical Jyotish' },
  { id: 'brief', label: 'Brief', hint: '1–2 short paragraphs, lead with the answer' },
  { id: 'client', label: 'Client-facing', hint: 'Plain language, no Sanskrit' },
]

interface Props {
  model: ModelId
  style: StyleId
  onModelChange: (m: ModelId) => void
  onStyleChange: (s: StyleId) => void
  disabled?: boolean
}

export function ModelStylePicker({ model, style, onModelChange, onStyleChange, disabled }: Props) {
  const currentModel = MODEL_OPTIONS.find(m => m.id === model) ?? MODEL_OPTIONS[1]
  const currentStyle = STYLE_OPTIONS.find(s => s.id === style) ?? STYLE_OPTIONS[0]

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
        <currentModel.Icon className="size-3.5" />
        <span className="font-medium text-foreground">{currentModel.label}</span>
        <span className="hidden sm:inline">· {currentStyle.label}</span>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Model
        </DropdownMenuLabel>
        {MODEL_OPTIONS.map(opt => (
          <DropdownMenuItem
            key={opt.id}
            onSelect={() => onModelChange(opt.id)}
            className="flex items-start gap-2"
          >
            <opt.Icon className="mt-0.5 size-3.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{opt.label}</div>
              <div className="text-[11px] text-muted-foreground">{opt.hint}</div>
            </div>
            {model === opt.id && <Check className="mt-0.5 size-3.5 shrink-0" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Style
        </DropdownMenuLabel>
        {STYLE_OPTIONS.map(opt => (
          <DropdownMenuItem
            key={opt.id}
            onSelect={() => onStyleChange(opt.id)}
            className="flex items-start gap-2"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{opt.label}</div>
              <div className="text-[11px] text-muted-foreground">{opt.hint}</div>
            </div>
            {style === opt.id && <Check className="mt-0.5 size-3.5 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
