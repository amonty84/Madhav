'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UIMessage } from 'ai'
import {
  Plus,
  PanelLeft,
  FileText,
  Keyboard,
  Gauge,
  Zap,
  Sparkles,
  FileQuestion,
  BookOpenText,
  User,
  Columns3,
  type LucideIcon,
} from 'lucide-react'
import { MODELS, PROVIDER_LABEL, type SpeedTier } from '@/lib/models/registry'
import { ChatShell } from '@/components/chat/ChatShell'
import { ConversationSidebar } from '@/components/chat/ConversationSidebar'
import { AdaptiveMessageList } from '@/components/chat/AdaptiveMessageList'
import { PendingAssistantBubble } from '@/components/chat/PendingAssistantBubble'
import { Composer, type ComposerHandle } from '@/components/chat/Composer'
import { WelcomeGreeting } from '@/components/chat/WelcomeGreeting'
import { ScrollToBottomButton } from '@/components/chat/ScrollToBottomButton'
import { ShortcutsDialog } from '@/components/chat/ShortcutsDialog'
import { CommandPalette, type Command } from '@/components/chat/CommandPalette'
import { ReportLibrary } from './ReportLibrary'
import { ReportReader } from './ReportReader'
import { useChatSession } from '@/hooks/useChatSession'
import { useScrollAnchor } from '@/hooks/useScrollAnchor'
import { useHotkeys } from '@/hooks/useHotkeys'
import { useFeedback } from '@/hooks/useFeedback'
import { useChatPreferences } from '@/hooks/useChatPreferences'
import { useAttachments, type Attachment } from '@/hooks/useAttachments'
import { useBranches } from '@/hooks/useBranches'
import { classifyChatError } from '@/lib/chat/classify-error'
import { ModelStylePicker } from '@/components/chat/ModelStylePicker'
import { ShareButton } from '@/components/chat/ShareButton'
import type { Report, ConversationModule } from '@/lib/db/types'
import { StreamingAnswer } from './StreamingAnswer'
import { ValidatorFailureView } from './ValidatorFailureView'
import { ConsumeForceDark } from './ConsumeForceDark'
import { TracePanel } from '@/components/trace/TracePanel'
import { parseValidatorError } from '@/lib/ui/validator-error'
import type { AudienceTier } from '@/lib/prompts/types'

interface ConversationRow {
  id: string
  title: string | null
  created_at: string
  chart_id: string
  user_id: string
  module: ConversationModule
}

interface Props {
  chartId: string
  chartName: string
  chartMeta?: string
  reports: Report[]
  conversations: ConversationRow[]
  currentConversationId?: string
  initialMessages?: UIMessage[]
  pipelineEnabled?: boolean
  panelModeEnabled?: boolean
  audienceTier?: AudienceTier
}

export function ConsumeChat({
  chartId,
  chartName,
  chartMeta,
  reports,
  conversations: initialConversations,
  currentConversationId,
  initialMessages,
  pipelineEnabled = false,
  panelModeEnabled = false,
  audienceTier = 'client',
}: Props) {
  const router = useRouter()
  const composerRef = useRef<ComposerHandle>(null)
  const composerEl = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState(initialConversations)
  const [panelOptIn, setPanelOptIn] = useState(false)
  const [tracePanelOpen, setTracePanelOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  const { scrollRef, bottomRef, isAtBottom, scrollToBottom } = useScrollAnchor({ thresholdPx: 96 })

  // Track structured validator failures separately from generic chat errors (flag-ON only).
  const [validatorFailures, setValidatorFailures] = useState<
    ReturnType<typeof parseValidatorError>
  >(null)

  const { model, style, setModel, setStyle } = useChatPreferences(chartId)

  const session = useChatSession({
    chartId,
    conversationId: currentConversationId,
    initialMessages,
    model,
    style,
    onConversationCreated: id => {
      // First-turn URL sync. We deliberately do NOT use router.replace here:
      // that would re-mount ConsumeChat under the [conversationId] segment,
      // re-reading initialMessages from the DB. The DB write happens in the
      // server route's async onFinish (after the client stream finishes), so
      // the re-mount races against persistence and loses when slow — landing
      // on empty initialMessages and wiping the conversation from view.
      //
      // history.replaceState updates the URL shallowly so the component stays
      // mounted with its in-memory messages. A subsequent real navigation
      // (clicking a sidebar item, hard refresh) re-reads from the DB, which
      // by then has the messages.
      if (typeof window !== 'undefined') {
        window.history.replaceState(
          window.history.state,
          '',
          `/clients/${chartId}/consume/${id}`
        )
      }
      // Optimistically prepend to the sidebar list. Title will show null
      // (rendered as a placeholder) until the next navigation pulls the
      // server-generated title.
      setConversations(prev => [
        {
          id,
          title: null,
          created_at: new Date().toISOString(),
          chart_id: chartId,
          user_id: '',
          module: 'consume',
        } as ConversationRow,
        ...prev,
      ])
    },
  })

  // Write --composer-h to :root so ScrollToBottomButton can position above the band.
  useEffect(() => {
    const el = composerEl.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const h = Math.ceil(entry.contentRect.height)
      document.documentElement.style.setProperty('--composer-h', `${h}px`)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Parse validator failure payloads from chat errors when pipeline is ON.
  useEffect(() => {
    if (!pipelineEnabled) return
    if (session.error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValidatorFailures(parseValidatorError(session.error))
    } else {
      setValidatorFailures(null)
    }
  }, [pipelineEnabled, session.error])

  const attachmentsApi = useAttachments()

  const handleSend = useCallback(
    (text: string, attachments?: Attachment[]) => {
      const files = (attachments ?? [])
        .filter(a => a.status === 'ready' && a.url)
        .map(a => ({
          type: 'file' as const,
          filename: a.filename,
          mediaType: a.mime,
          url: a.url!,
        }))
      session.send(text, files, panelOptIn ? { panel_opt_in: true } : undefined)
      // Panel mode is not sticky — auto-reset after each submit.
      setPanelOptIn(false)
      if (files.length > 0) attachmentsApi.clear()
    },
    [session, attachmentsApi, panelOptIn]
  )

  const handleRegenerate = useCallback(() => {
    session.regenerate()
  }, [session])

  const branches = useBranches(session.conversationId)

  const handleEdit = useCallback(
    (id: string, text: string) => {
      // Snapshot the live conversation as an archived branch under this edit
      // point before truncating. See useBranches for the session-local tradeoff.
      branches.archiveBranch(id, session.messages)
      session.editAndResubmit(id, text)
    },
    [branches, session]
  )

  const { ratings, rate } = useFeedback(session.conversationId)

  useHotkeys({
    onPalette: () => setPaletteOpen(o => !o),
    onNewChat: () => router.push(`/clients/${chartId}/consume`),
    onToggleSidebar: () => setDesktopSidebarCollapsed(c => !c),
    onShortcutsHelp: () => setShortcutsOpen(true),
    onEscape: () => {
      if (session.isStreaming) session.stop()
    },
  })

  const paletteCommands = useMemo<Command[]>(() => {
    const iconByTier: Record<SpeedTier, LucideIcon> = {
      fast: Zap,
      balanced: Gauge,
      deep: Sparkles,
    }
    const modelCommands: Command[] = MODELS.map(m => ({
      id: `model-${m.id}`,
      label: `Model: ${m.label} (${PROVIDER_LABEL[m.provider]})`,
      icon: iconByTier[m.speedTier],
      section: 'Model',
      keywords: `${m.provider} ${m.speedTier} ${m.id} ${m.label}`,
      run: () => setModel(m.id),
    }))

    return [
      {
        id: 'new-chat',
        label: 'New chat',
        hint: '⌘⇧O',
        icon: Plus,
        section: 'Actions',
        keywords: 'create start fresh',
        run: () => router.push(`/clients/${chartId}/consume`),
      },
      {
        id: 'toggle-sidebar',
        label: desktopSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar',
        hint: '⌘B',
        icon: PanelLeft,
        section: 'View',
        run: () => setDesktopSidebarCollapsed(c => !c),
      },
      {
        id: 'toggle-reports',
        label: 'Open reports panel',
        icon: FileText,
        section: 'View',
        keywords: 'library domains',
        run: () => setSelectedDomain(null),
      },
      {
        id: 'shortcuts',
        label: 'Keyboard shortcuts',
        hint: '⌘/',
        icon: Keyboard,
        section: 'Help',
        run: () => setShortcutsOpen(true),
      },
      ...modelCommands,
      {
        id: 'style-acharya',
        label: 'Style: Acharya depth',
        icon: BookOpenText,
        section: 'Style',
        keywords: 'full technical jyotish',
        run: () => setStyle('acharya'),
      },
      {
        id: 'style-brief',
        label: 'Style: Brief',
        icon: FileQuestion,
        section: 'Style',
        keywords: 'short concise terse',
        run: () => setStyle('brief'),
      },
      {
        id: 'style-client',
        label: 'Style: Client-facing',
        icon: User,
        section: 'Style',
        keywords: 'plain no sanskrit jargon',
        run: () => setStyle('client'),
      },
    ]
  }, [chartId, router, desktopSidebarCollapsed, setModel, setStyle])

  useEffect(() => {
    if (!session.isStreaming) composerRef.current?.focus()
  }, [session.isStreaming, currentConversationId])

  const handleRenameConversation = useCallback(
    async (id: string, title: string) => {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (res.ok) {
        setConversations(prev => prev.map(c => (c.id === id ? { ...c, title } : c)))
      }
    },
    []
  )

  const displayMessages = branches.viewingMessages ?? session.messages
  const messagesEmpty = displayMessages.length === 0
  const lastMessage = displayMessages[displayMessages.length - 1]
  const showPendingAssistant =
    session.isStreaming &&
    !branches.isViewingArchived &&
    lastMessage?.role === 'user'

  const sidebar = (
    <ConversationSidebar
      chartId={chartId}
      chartName={chartName}
      conversations={conversations}
      currentConversationId={currentConversationId}
      onClose={() => setMobileSidebarOpen(false)}
      onRenamed={(id, title) =>
        setConversations(prev => prev.map(c => (c.id === id ? { ...c, title } : c)))
      }
      onDeleted={id => setConversations(prev => prev.filter(c => c.id !== id))}
    />
  )

  const rightPanel =
    selectedDomain == null ? (
      <ReportLibrary
        reports={reports}
        selectedDomain={null}
        onSelect={d => setSelectedDomain(d)}
      />
    ) : (
      <ReportReader
        chartId={chartId}
        domain={selectedDomain}
        onBack={() => setSelectedDomain(null)}
      />
    )

  return (
    <div className="consume-shell flex h-full flex-1 min-h-0 flex-col">
      <ConsumeForceDark />
      <ChatShell
        sidebar={sidebar}
        rightPanel={rightPanel}
        rightPanelLabel="Reports"
        rightPanelBadge={reports.length}
        headerTitle={chartName}
        headerMeta={chartMeta}
        headerActions={<ShareButton conversationId={session.conversationId} />}
        desktopSidebarCollapsed={desktopSidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleDesktopSidebar={() => setDesktopSidebarCollapsed(c => !c)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(o => !o)}
        setMobileSidebarOpen={setMobileSidebarOpen}
        conversationId={session.conversationId}
        onRenameConversation={handleRenameConversation}
      >
        <div
          ref={scrollRef}
          className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]"
        >
          {messagesEmpty ? (
            <WelcomeGreeting
              chartName={chartName}
              reports={reports}
              onSuggest={handleSend}
            />
          ) : pipelineEnabled ? (
            <>
              {validatorFailures ? (
                <ValidatorFailureView
                  failures={validatorFailures}
                  onRetry={() => {
                    const lastUser = displayMessages.filter(m => m.role === 'user').at(-1)
                    const text = lastUser?.parts
                      ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                      .map(p => p.text)
                      .join('') ?? ''
                    if (text) {
                      composerRef.current?.setValue(text)
                      composerRef.current?.focus()
                    }
                  }}
                />
              ) : (
                <>
                  <StreamingAnswer
                    messages={displayMessages}
                    isStreaming={session.isStreaming && !branches.isViewingArchived}
                    onStop={session.stop}
                    onRegenerate={branches.isViewingArchived ? undefined : handleRegenerate}
                    ratings={ratings}
                    onRate={branches.isViewingArchived ? undefined : rate}
                  />
                  {showPendingAssistant && <PendingAssistantBubble />}
                </>
              )}
            </>
          ) : (
            <>
              <AdaptiveMessageList
                messages={displayMessages}
                isStreaming={session.isStreaming && !branches.isViewingArchived}
                onRegenerate={branches.isViewingArchived ? undefined : handleRegenerate}
                onEditUserMessage={branches.isViewingArchived ? undefined : handleEdit}
                ratings={ratings}
                onRate={branches.isViewingArchived ? undefined : rate}
                branchStats={branches.stats}
                onStepBranch={branches.stepBranch}
                scrollRef={scrollRef}
              />
              {showPendingAssistant && <PendingAssistantBubble />}
            </>
          )}
          <div ref={bottomRef} className="h-1" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[var(--composer-h)] z-20 flex justify-center">
          <ScrollToBottomButton
            visible={!isAtBottom && !messagesEmpty}
            onClick={() => scrollToBottom('smooth')}
          />
        </div>

        {session.error && !validatorFailures && (() => {
          const err = classifyChatError(session.error)
          if (!err) return null
          return (
            <div className="mx-auto w-full max-w-4xl px-4">
              <div
                role="alert"
                className="flex items-start justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{err.title}</p>
                  <p className="mt-0.5 text-destructive/80">{err.hint}</p>
                  {err.detail && (
                    <p className="mt-1 font-mono text-[10px] break-all opacity-60 select-all">
                      {err.detail.slice(0, 400)}
                    </p>
                  )}
                </div>
                {err.kind !== 'auth' && (
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="shrink-0 rounded-md border border-destructive/40 px-2 py-0.5 text-[11px] hover:bg-destructive/20"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          )
        })()}

        <div ref={composerEl} className="relative shrink-0 border-t border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 pb-[env(safe-area-inset-bottom)]">
          {branches.isViewingArchived && (
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 pt-2">
              <p className="text-xs text-muted-foreground">
                Viewing an earlier version of this conversation. Composer is disabled.
              </p>
              <button
                type="button"
                onClick={branches.returnToLive}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                Return to latest
              </button>
            </div>
          )}
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 px-4 py-1.5">
            <ModelStylePicker
              model={model}
              style={style}
              onModelChange={setModel}
              onStyleChange={setStyle}
              disabled={session.isStreaming || branches.isViewingArchived}
            />
            {(panelModeEnabled || audienceTier === 'super_admin') && pipelineEnabled && (
              <div className="flex items-center gap-1.5">
                {panelModeEnabled && (
                  <label
                    htmlFor="panel-opt-in"
                    className={[
                      'inline-flex cursor-pointer select-none items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors',
                      panelOptIn
                        ? 'border-[color-mix(in_oklch,var(--brand-gold)_60%,transparent)] bg-[var(--brand-gold-faint)] text-[var(--brand-gold)]'
                        : 'border-border text-muted-foreground hover:border-[color-mix(in_oklch,var(--brand-gold)_40%,transparent)] hover:bg-[var(--brand-gold-faint)] hover:text-[var(--brand-gold)]',
                    ].join(' ')}
                    title="Run 3 independent models and adjudicate"
                  >
                    <Columns3 className="h-3 w-3" />
                    Panel
                    <input
                      type="checkbox"
                      id="panel-opt-in"
                      checked={panelOptIn}
                      onChange={e => setPanelOptIn(e.target.checked)}
                      className="sr-only"
                    />
                  </label>
                )}
                {audienceTier === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => setTracePanelOpen(o => !o)}
                    className={[
                      'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors',
                      tracePanelOpen
                        ? 'border-[color-mix(in_oklch,var(--status-warn)_60%,transparent)] bg-[var(--status-warn-bg)] text-[var(--status-warn)] hover:bg-[var(--status-warn-bg)]'
                        : 'border-border text-muted-foreground hover:border-[color-mix(in_oklch,var(--status-warn)_40%,transparent)] hover:bg-[var(--status-warn-bg)] hover:text-[var(--status-warn)]',
                    ].join(' ')}
                    title="Toggle query trace panel"
                  >
                    <Zap className="h-3 w-3" />
                    Trace
                  </button>
                )}
              </div>
            )}
          </div>
          <Composer
            ref={composerRef}
            onSubmit={handleSend}
            onStop={session.stop}
            isStreaming={session.isStreaming}
            disabled={branches.isViewingArchived}
            placeholder={messagesEmpty ? 'Ask about career, finance, timing…' : 'Reply…'}
            attachments={attachmentsApi.attachments}
            onAddFiles={attachmentsApi.addFiles}
            onRemoveAttachment={attachmentsApi.remove}
            attachmentsReady={attachmentsApi.canSend}
          />
        </div>
      </ChatShell>
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} commands={paletteCommands} />
      {tracePanelOpen && audienceTier === 'super_admin' && (
        <TracePanel
          queryId={session.currentQueryId ?? null}
          isSuperAdmin={true}
          onClose={() => setTracePanelOpen(false)}
        />
      )}
    </div>
  )
}