'use client'

import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  visible: boolean
  onClick: () => void
}

export function ScrollToBottomButton({ visible, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Jump to latest"
      className={cn(
        'pointer-events-auto absolute left-1/2 -translate-x-1/2 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all duration-200',
        'hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
      )}
      style={{ bottom: 'calc(var(--composer-h) + 12px)' }}
    >
      <ArrowDown className="size-4 text-muted-foreground" />
    </button>
  )
}
