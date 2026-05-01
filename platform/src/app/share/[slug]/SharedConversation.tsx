'use client'

import type { UIMessage } from 'ai'
import { MessageList } from '@/components/chat/MessageList'

interface Props {
  messages: UIMessage[]
}

// Read-only read of a shared conversation. MessageList already renders user +
// assistant messages; passing no handlers disables all interaction (edit,
// regenerate, thumbs, attachments), and isStreaming=false keeps rendering idle.
export function SharedConversation({ messages }: Props) {
  return <MessageList messages={messages} isStreaming={false} />
}
