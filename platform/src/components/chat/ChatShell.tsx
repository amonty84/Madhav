'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { PanelLeft, FileText, X, Pencil, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHighlighter } from '@/lib/shiki'

interface Props {
  sidebar: ReactNode
  children: ReactNode
  rightPanel?: ReactNode
  rightPanelLabel?: string
  rightPanelBadge?: number
  traceAction?: ReactNode
  headerTitle?: string
  headerMeta?: string
  headerActions?: ReactNode
  desktopSidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  onToggleDesktopSidebar: () => void
  onToggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  conversationId?: string
  onRenameConversation?: (id: string, title: string) => Promise<void>
}

export function ChatShell({
  sidebar,
  children,
  rightPanel,
  rightPanelLabel = 'Reports',
  rightPanelBadge,
  traceAction,
  headerTitle,
  headerMeta,
  headerActions,
  desktopSidebarCollapsed,
  mobileSidebarOpen,
  onToggleDesktopSidebar,
  onToggleMobileSidebar,
  setMobileSidebarOpen,
  conversationId,
  onRenameConversation,
}: Props) {
  const [rightOpen, setRightOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [hoverOpen, setHoverOpen] = useState(false)
  const showSidebar = hoverOpen || !desktopSidebarCollapsed
  const [titleDraft, setTitleDraft] = useState(headerTitle ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep draft in sync when the title changes externally (e.g. after nav)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitleDraft(headerTitle ?? '')
  }, [headerTitle])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  // Warm the Shiki highlighter bundle on idle so the first code block post-stream
  // renders with zero cold-start delay. CodeBlock skips Shiki during streaming.
  useEffect(() => {
    const ric =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback
    const run = () => {
      getHighlighter().catch(() => {})
    }
    if (ric) ric(run)
    else setTimeout(run, 200)
  }, [])

  function saveTitle() {
    const trimmed = titleDraft.trim()
    setEditing(false)
    if (!trimmed || trimmed === headerTitle || !conversationId || !onRenameConversation) return
    onRenameConversation(conversationId, trimmed).catch(() => {
      setTitleDraft(headerTitle ?? '')
    })
  }

  function cancelTitle() {
    setTitleDraft(headerTitle ?? '')
    setEditing(false)
  }

  const canRename = !!conversationId && !!onRenameConversation

  return (
    <div
      className="relative flex h-full w-full bg-background"
      style={{ ['--composer-h' as string]: '160px' }}
    >
      {/* Sidebar hover zone — thin strip when collapsed, full panel when hovered */}
      <div
        className="relative hidden md:block shrink-0"
        style={{ width: showSidebar ? 260 : 8 }}
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => setHoverOpen(false)}
      >
        <aside
          aria-label="Conversations"
          aria-hidden={!showSidebar}
          className={cn(
            'absolute left-0 top-0 h-full border-r border-sidebar-border bg-sidebar',
            'transition-[width,box-shadow] duration-200 ease-in-out overflow-hidden z-20',
            showSidebar
              ? 'w-[260px] shadow-[4px_0_24px_rgba(0,0,0,0.35)]'
              : 'w-2 bg-[color-mix(in_oklch,var(--brand-gold)_10%,var(--sidebar))]'
          )}
        >
          {showSidebar && <div className="flex h-full w-[260px] flex-col">{sidebar}</div>}
        </aside>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[78%] max-w-[300px] bg-sidebar p-0 md:hidden" showCloseButton={false}>
          <SheetTitle className="sr-only">Conversations</SheetTitle>
          <div className="flex h-full flex-col">{sidebar}</div>
        </SheetContent>
      </Sheet>

      <main className="relative flex h-full flex-1 flex-col overflow-hidden" aria-label="Chat">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-background/60 px-3 backdrop-blur supports-backdrop-filter:bg-background/40">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle sidebar"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            <PanelLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            aria-label={desktopSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            className="hidden size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            <PanelLeft className="size-4" />
          </button>

          {/* Title area — stacked: h1 title + chartMeta always visible */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {headerTitle && (
              <div className="group/title flex min-w-0 flex-col leading-tight">
                {editing ? (
                  <input
                    ref={inputRef}
                    value={titleDraft}
                    onChange={e => setTitleDraft(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); saveTitle() }
                      if (e.key === 'Escape') { e.preventDefault(); cancelTitle() }
                    }}
                    className="truncate rounded bg-transparent text-sm font-medium text-foreground outline-none ring-1 ring-[var(--brand-gold)]/60 px-1 min-w-0 max-w-[200px]"
                    aria-label="Conversation title"
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <h1
                      className="truncate text-sm font-medium text-foreground max-w-[200px]"
                      onDoubleClick={canRename ? () => setEditing(true) : undefined}
                      title={canRename ? 'Double-click to rename' : undefined}
                    >
                      {headerTitle}
                    </h1>
                    {canRename && (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        aria-label="Rename conversation"
                        className="shrink-0 opacity-0 group-hover/title:opacity-100 transition-opacity inline-flex size-5 items-center justify-center rounded text-[var(--brand-gold-hairline)] hover:text-[var(--brand-gold)]"
                      >
                        <Pencil className="size-3" />
                      </button>
                    )}
                  </div>
                )}
                {headerMeta && (
                  <p className="truncate text-[10px] uppercase tracking-[0.24em] text-[var(--brand-cream)]/50">
                    {headerMeta}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1">
            {headerActions}
            {traceAction}
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </main>

      {rightPanel && (
        <Sheet open={rightOpen} onOpenChange={setRightOpen}>
          <SheetContent
            side="right"
            className="w-[92%] max-w-2xl lg:max-w-3xl overflow-hidden p-0"
            showCloseButton={false}
          >
            <div className="flex h-full flex-col">
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 px-3">
                <SheetTitle className="text-sm font-medium">{rightPanelLabel}</SheetTitle>
                <button
                  type="button"
                  onClick={() => setRightOpen(false)}
                  aria-label="Close"
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{rightPanel}</div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
