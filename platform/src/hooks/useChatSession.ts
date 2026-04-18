'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type FileUIPart, type UIMessage } from 'ai'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Options {
  chartId: string
  conversationId?: string
  initialMessages?: UIMessage[]
  onConversationCreated?: (id: string) => void
  model?: string
  style?: string
}

export function useChatSession({
  chartId,
  conversationId,
  initialMessages,
  onConversationCreated,
  model,
  style,
}: Options) {
  const [persistedId, setPersistedId] = useState<string | undefined>(conversationId)

  useEffect(() => {
    // Sync state with incoming prop when navigating between conversations.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (conversationId) setPersistedId(conversationId)
  }, [conversationId])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat/consume',
      }),
    []
  )

  const chat = useChat({
    id: conversationId ?? 'new',
    messages: initialMessages,
    transport,
    experimental_throttle: 16,
    onFinish: ({ message }) => {
      const metadata = message.metadata as { conversationId?: string } | undefined
      const newId = metadata?.conversationId
      if (newId && newId !== persistedId) {
        setPersistedId(newId)
        onConversationCreated?.(newId)
      }
    },
  })

  const isStreaming = chat.status === 'streaming' || chat.status === 'submitted'
  const canSend = chat.status === 'ready' || chat.status === 'error'

  const send = useCallback(
    (text: string, files?: FileUIPart[]) => {
      const trimmed = text.trim()
      const hasFiles = Boolean(files && files.length > 0)
      if ((!trimmed && !hasFiles) || isStreaming) return
      chat.sendMessage(
        hasFiles ? { text: trimmed, files } : { text: trimmed },
        { body: { chartId, conversationId: persistedId, model, style } }
      )
    },
    [chat, isStreaming, chartId, persistedId, model, style]
  )

  const regenerate = useCallback(() => {
    chat.regenerate({ body: { chartId, conversationId: persistedId, model, style } })
  }, [chat, chartId, persistedId, model, style])

  const editAndResubmit = useCallback(
    (id: string, newText: string) => {
      const idx = chat.messages.findIndex(m => m.id === id)
      if (idx === -1) return
      const truncated = chat.messages.slice(0, idx)
      chat.setMessages(truncated)
      chat.sendMessage(
        { text: newText },
        { body: { chartId, conversationId: persistedId, model, style } }
      )
    },
    [chat, chartId, persistedId, model, style]
  )

  return {
    messages: chat.messages,
    status: chat.status,
    error: chat.error,
    isStreaming,
    canSend,
    send,
    stop: chat.stop,
    regenerate,
    setMessages: chat.setMessages,
    editAndResubmit,
    conversationId: persistedId,
  }
}
