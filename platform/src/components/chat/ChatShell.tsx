'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { PanelLeft, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHighlighter } from '@/lib/shiki'

interface Props {
  sidebar: ReactNode
  children: ReactNode
  rightPanel?: ReactNode
  rightPanelLabel?: string
  rightPanelBadge?: number
  headerTitle?: string
  headerMeta?: string
  headerActions?: ReactNode
  desktopSidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  onToggleDesktopSidebar: () => void
  onToggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
}

export function ChatShell({
  sidebar,
  children,
  rightPanel,
  rightPanelLabel = 'Reports',
  rightPanelBadge,
  headerTitle,
  headerMeta,
  headerActions,
  desktopSidebarCollapsed,
  mobileSidebarOpen,
  onToggleDesktopSidebar,
  onToggleMobileSidebar,
  setMobileSidebarOpen,
}: Props) {
  const [rightOpen, setRightOpen] = useState(false)

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

  return (
    <div
      className="relative flex h-[100dvh] w-full bg-background"
      style={{ ['--composer-h' as string]: '160px' }}
    >
      <aside
        aria-label="Conversations"
        className={cn(
          'hidden h-full shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex',
          desktopSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[260px]'
        )}
        aria-hidden={desktopSidebarCollapsed}
      >
        {!desktopSidebarCollapsed && <div className="flex h-full w-[260px] flex-col">{sidebar}</div>}
      </aside>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[84%] max-w-[320px] bg-sidebar p-0 md:hidden" showCloseButton={false}>
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
          <div className="flex min-w-0 items-center gap-2">
            {headerTitle && (
              <span className="truncate text-sm font-medium text-foreground">{headerTitle}</span>
            )}
            {headerMeta && (
              <span className="hidden truncate text-xs text-muted-foreground sm:block">
                {headerMeta}
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {headerActions}
            {rightPanel && (
              <button
                type="button"
                onClick={() => setRightOpen(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FileText className="size-3.5" />
                <span className="hidden sm:inline">{rightPanelLabel}</span>
                {typeof rightPanelBadge === 'number' && rightPanelBadge > 0 && (
                  <span className="inline-flex min-w-[18px] justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                    {rightPanelBadge}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </main>

      {rightPanel && (
        <Sheet open={rightOpen} onOpenChange={setRightOpen}>
          <SheetContent
            side="right"
            className="w-[92%] max-w-xl overflow-hidden p-0"
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
