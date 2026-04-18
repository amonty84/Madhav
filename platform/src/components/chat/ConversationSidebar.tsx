'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MoreHorizontal,
  PenSquare,
  Trash2,
  Plus,
  PanelLeft,
  ArrowLeft,
} from 'lucide-react'
import {
  isToday,
  isYesterday,
  differenceInDays,
  parseISO,
  format,
} from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

interface ConversationRow {
  id: string
  title: string | null
  created_at: string
}

interface Props {
  chartId: string
  chartName: string
  conversations: ConversationRow[]
  currentConversationId?: string
  onRenamed?: (id: string, title: string) => void
  onDeleted?: (id: string) => void
  onClose?: () => void
}

function groupByDate(conversations: ConversationRow[]) {
  const groups = new Map<string, ConversationRow[]>()
  const now = new Date()
  for (const c of conversations) {
    const d = parseISO(c.created_at)
    let bucket: string
    if (isToday(d)) bucket = 'Today'
    else if (isYesterday(d)) bucket = 'Yesterday'
    else {
      const days = differenceInDays(now, d)
      if (days < 7) bucket = 'Previous 7 days'
      else if (days < 30) bucket = 'Previous 30 days'
      else bucket = format(d, 'MMMM yyyy')
    }
    if (!groups.has(bucket)) groups.set(bucket, [])
    groups.get(bucket)!.push(c)
  }
  return Array.from(groups.entries())
}

export function ConversationSidebar({
  chartId,
  chartName,
  conversations,
  currentConversationId,
  onRenamed,
  onDeleted,
  onClose,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const groups = useMemo(() => groupByDate(conversations), [conversations])

  async function handleRename(id: string) {
    const current = conversations.find(c => c.id === id)
    const next = window.prompt('Rename conversation', current?.title ?? '')
    if (!next || next.trim() === current?.title) return
    const res = await fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: next.trim() }),
    })
    if (res.ok) onRenamed?.(id, next.trim())
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this conversation?')) return
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    if (res.ok) {
      onDeleted?.(id)
      if (id === currentConversationId) {
        router.push(`/clients/${chartId}/consume`)
      }
    }
  }

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Dashboard</span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground md:hidden"
          >
            <PanelLeft className="size-3.5" />
          </button>
        )}
      </div>

      <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {chartName}
      </div>

      <div className="px-3 pb-2 pt-1">
        <button
          type="button"
          onClick={() => router.push(`/clients/${chartId}/consume`)}
          className={cn(
            'group flex w-full items-center gap-2 rounded-lg border border-border/60 bg-sidebar-accent/30 px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent',
            pathname === `/clients/${chartId}/consume` && 'bg-sidebar-accent'
          )}
        >
          <Plus className="size-4" />
          New chat
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {conversations.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No conversations yet.
            </p>
          )}
          {groups.map(([label, rows]) => (
            <div key={label} className="mt-3 first:mt-0">
              <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <ul className="space-y-0.5">
                {rows.map(c => (
                  <ConversationRowItem
                    key={c.id}
                    row={c}
                    chartId={chartId}
                    active={c.id === currentConversationId}
                    onRename={() => handleRename(c.id)}
                    onDelete={() => handleDelete(c.id)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t border-sidebar-border px-2 py-2">
        <div className="flex items-center justify-between gap-1 px-1">
          <span className="text-[11px] text-muted-foreground">AM-JIS</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}

function ConversationRowItem({
  row,
  chartId,
  active,
  onRename,
  onDelete,
}: {
  row: ConversationRow
  chartId: string
  active: boolean
  onRename: () => void
  onDelete: () => void
}) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (active) linkRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const title = row.title ?? 'New chat'

  return (
    <li className="group/row relative">
      <Link
        ref={linkRef}
        href={`/clients/${chartId}/consume/${row.id}`}
        className={cn(
          'block truncate rounded-lg px-3 py-1.5 pr-8 text-sm transition-colors',
          active
            ? 'bg-sidebar-accent text-foreground'
            : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
        )}
      >
        {title}
      </Link>
      <div
        className={cn(
          'absolute right-1 top-1/2 -translate-y-1/2 transition-opacity',
          open ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100 focus-within:opacity-100'
        )}
      >
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            aria-label="Conversation actions"
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <MoreHorizontal className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={2}>
            <DropdownMenuItem onClick={onRename}>
              <PenSquare className="size-3.5" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}
