'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Copy, Check, RotateCw, PenSquare, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Rating } from '@/hooks/useFeedback'

interface Props {
  onCopy?: () => void | Promise<void>
  onRegenerate?: () => void
  onEdit?: () => void
  rating?: Rating
  onRate?: (rating: Rating) => void
  timestamp?: Date
  className?: string
}

export function MessageActions({ onCopy, onRegenerate, onEdit, rating, onRate, timestamp, className }: Props) {
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

  return (
    <div className={cn('flex items-center gap-0.5 text-muted-foreground', className)}>
      {onCopy && (
        <ActionButton onClick={handleCopy} label={copied ? 'Copied' : 'Copy'}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </ActionButton>
      )}
      {onRegenerate && (
        <ActionButton onClick={onRegenerate} label="Retry">
          <RotateCw className="size-3.5" />
        </ActionButton>
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
          title={format(timestamp, 'PPpp')}
          className="ml-1 text-[11px] tabular-nums text-muted-foreground/70"
        >
          {format(timestamp, 'h:mm a')}
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
