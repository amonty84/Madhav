'use client'

import { useCallback, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { UIMessage } from 'ai'
import { Plus, PanelLeft, Keyboard } from 'lucide-react'
import { ChatShell } from '@/components/chat/ChatShell'
import { ConversationSidebar } from '@/components/chat/ConversationSidebar'
import { AdaptiveMessageList } from '@/components/chat/AdaptiveMessageList'
import { PendingAssistantBubble } from '@/components/chat/PendingAssistantBubble'
import { Composer, type ComposerHandle } from '@/components/chat/Composer'
import { WelcomeGreeting } from '@/components/chat/WelcomeGreeting'
import { ScrollToBottomButton } from '@/components/chat/ScrollToBottomButton'
import { ShortcutsDialog } from '@/components/chat/ShortcutsDialog'
import { CommandPalette, type Command } from '@/components/chat/CommandPalette'
import { ShareButton } from '@/components/chat/ShareButton'
import { BuildRightPane } from './BuildRightPane'
import { useBuildChat } from '@/hooks/useBuildChatAdapter'
import { useScrollAnchor } from '@/hooks/useScrollAnchor'
import { useHotkeys } from '@/hooks/useHotkeys'
import { useFeedback } from '@/hooks/useFeedback'
import { useBranches } from '@/hooks/useBranches'
import { useAttachments } from '@/hooks/useAttachments'
import type { MacroPhaseEntry, CurrentBrief, InsightCard, MirrorPair } from '@/lib/build/types'

interface ConversationRow {
  id: string
  title: string | null
  created_at: string
}

interface LayerEntry {
  layer: string
  sublayer: string
  status: 'not_started' | 'in_progress' | 'complete'
}

interface Props {
  chartId: string
  chartName: string
  conversations: ConversationRow[]
  currentConversationId?: string
  initialMessages?: UIMessage[]
  arc: MacroPhaseEntry[]
  activePhaseId: string
  brief: CurrentBrief | null
  insights: InsightCard[]
  mirrorPairs: MirrorPair[]
  layers: LayerEntry[]
}

export function BuildChat({
  chartId,
  chartName,
  conversations: initialConversations,
  currentConversationId,
  initialMessages,
  arc,
  activePhaseId,
  brief,
  insights,
  mirrorPairs,
  layers,
}: Props) {
  const router = useRouter()
  const composerRef = useRef<ComposerHandle>(null)
  const composerEl = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState(initialConversations)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const session = useBuildChat({
    chartId,
    conversationId: currentConversationId,
    initialMessages,
    onConversationCreated: id => {
      if (typeof window !== 'undefined') {
        window.history.replaceState(window.history.state, '', `/clients/${chartId}/build/${id}`)
      }
      setConversations(prev => [
        { id, title: null, created_at: new Date().toISOString() },
        ...prev,
      ])
    },
  })

  const { scrollRef, bottomRef, isAtBottom, scrollToBottom } = useScrollAnchor({ thresholdPx: 96 })
  const branches = useBranches(session.conversationId)
  const { ratings, rate } = useFeedback(session.conversationId)
  const { attachments, addFiles, remove: removeAttachment, canSend: attachmentsReady } = useAttachments()

  const handleSend = useCallback(
    (text: string) => {
      session.send(text)
    },
    [session]
  )

  const handleRegenerate = useCallback(() => session.regenerate(), [session])

  const handleEdit = useCallback(
    (id: string, text: string) => {
      branches.archiveBranch(id, session.messages)
      const idx = session.messages.findIndex(m => m.id === id)
      if (idx === -1) return
      session.setMessages(session.messages.slice(0, idx))
      session.send(text)
    },
    [branches, session]
  )

  const handleRenameConversation = useCallback(async (id: string, title: string) => {
    const res = await fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (res.ok) {
      setConversations(prev => prev.map(c => (c.id === id ? { ...c, title } : c)))
    }
  }, [])

  useHotkeys({
    onPalette: () => setPaletteOpen(o => !o),
    onNewChat: () => router.push(`/clients/${chartId}/build`),
    onToggleSidebar: () => setDesktopSidebarCollapsed(c => !c),
    onShortcutsHelp: () => setShortcutsOpen(true),
    onEscape: () => { if (session.isStreaming) session.stop() },
  })

  const paletteCommands = useMemo<Command[]>(() => [
    {
      id: 'new-chat',
      label: 'New build chat',
      hint: '⌘⇧O',
      icon: Plus,
      section: 'Actions',
      keywords: 'create start fresh',
      run: () => router.push(`/clients/${chartId}/build`),
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
      id: 'shortcuts',
      label: 'Keyboard shortcuts',
      hint: '⌘/',
      icon: Keyboard,
      section: 'Help',
      run: () => setShortcutsOpen(true),
    },
  ], [chartId, router, desktopSidebarCollapsed])

  const displayMessages = branches.viewingMessages ?? session.messages
  const messagesEmpty = displayMessages.length === 0
  const lastMessage = displayMessages[displayMessages.length - 1]
  const showPendingAssistant =
    session.isStreaming && !branches.isViewingArchived && lastMessage?.role === 'user'

  const sidebar = (
    <ConversationSidebar
      chartId={chartId}
      chartName={chartName}
      conversations={conversations}
      currentConversationId={session.conversationId ?? currentConversationId}
      onClose={() => setMobileSidebarOpen(false)}
      onRenamed={(id, title) =>
        setConversations(prev => prev.map(c => (c.id === id ? { ...c, title } : c)))
      }
      onDeleted={id => setConversations(prev => prev.filter(c => c.id !== id))}
    />
  )

  const rightPanel = (
    <BuildRightPane
      arc={arc}
      activePhaseId={activePhaseId}
      brief={brief}
      insights={insights}
      mirrorPairs={mirrorPairs}
      layers={layers}
    />
  )

  return (
    <div className="flex h-full flex-1 min-h-0 flex-col">
      <ChatShell
        sidebar={sidebar}
        rightPanel={rightPanel}
        rightPanelLabel="Build Status"
        headerTitle={chartName}
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
              reports={[]}
              onSuggest={handleSend}
            />
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
          <Composer
            ref={composerRef}
            onSubmit={(text, _attachments) => handleSend(text)}
            onStop={session.stop}
            isStreaming={session.isStreaming}
            disabled={branches.isViewingArchived}
            placeholder={messagesEmpty ? 'Ask Claude to build a layer…' : 'Reply…'}
            attachments={attachments}
            onAddFiles={addFiles}
            onRemoveAttachment={removeAttachment}
            attachmentsReady={attachmentsReady}
          />
        </div>
      </ChatShell>
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} commands={paletteCommands} />
    </div>
  )
}
