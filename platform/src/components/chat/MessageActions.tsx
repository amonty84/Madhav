'use client'

import { useState } from 'react'
import { Copy, Check, RotateCw, PenSquare, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { modelsByProvider, PROVIDER_LABEL } from '@/lib/models/registry'
import { cn } from '@/lib/utils'
import type { Rating } from '@/hooks/useFeedback'

interface Props {
  onCopy?: () => void | Promise<void>
  onRegenerate?: () => void
  onRegenerateWithModel?: (modelId: string) => void
  onEdit?: () => void
  rating?: Rating
  onRate?: (rating: Rating) => void
  timestamp?: Date
  className?: string
}

export function MessageActions({ onCopy, onRegenerate, onRegenerateWithModel, onEdit, rating, onRate, timestamp, className }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!onCopy) return
    await onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleRate(next: 1 | -1) {
    if (!onRate) return
    onRate(rating === next ? null : next)
  }

  const grouped = modelsByProvider()

  return (
    <div className={cn('flex items-center gap-0.5 text-muted-foreground', className)}>
      {onCopy && (
        <ActionButton onClick={handleCopy} label={copied ? 'Copied' : 'Copy'}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </ActionButton>
      )}
      {onRegenerate && (
        <div className="inline-flex items-center">
          <ActionButton onClick={onRegenerate} label="Regenerate">
            <RotateCw className="size-3.5" />
          </ActionButton>
          {onRegenerateWithModel && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Regenerate with another model"
                className="inline-flex h-7 items-center rounded-md px-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <ChevronDown className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {grouped.map((group, gi) => (
                  <DropdownMenuGroup key={group.provider}>
                    {gi > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {PROVIDER_LABEL[group.provider]}
                    </DropdownMenuLabel>
                    {group.models.map(m => (
                      <DropdownMenuItem key={m.id} onClick={() => onRegenerateWithModel(m.id)}>
                        <span className="text-sm">{m.label}</span>
                        <span className="ml-auto text-[11px] text-muted-foreground">{m.hint}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      {onEdit && (
        <ActionButton onClick={onEdit} label="Edit">
          <PenSquare className="size-3.5" />
        </ActionButton>
      )}
      {onRate && (
        <>
          <ActionButton
            onClick={() => handleRate(1)}
            label="Good response"
            active={rating === 1}
          >
            <ThumbsUp className="size-3.5" />
          </ActionButton>
          <ActionButton
            onClick={() => handleRate(-1)}
            label="Bad response"
            active={rating === -1}
          >
            <ThumbsDown className="size-3.5" />
          </ActionButton>
        </>
      )}
      {timestamp && (
        <time
          dateTime={timestamp.toISOString()}
          title={timestamp.toLocaleString()}
          className="ml-1 text-[11px] tabular-nums text-muted-foreground/70"
        >
          {timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </time>
      )}
    </div>
  )
}

function ActionButton({
  onClick,
  label,
  active,
  children,
}: {
  onClick: () => void
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        active && 'bg-muted text-foreground'
      )}
    >
      {children}
    </button>
  )
}
