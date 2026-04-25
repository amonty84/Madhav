import 'server-only'
import type { UIMessage } from 'ai'
import { createServiceClient } from '@/lib/supabase/server'
import type { ConversationModule } from '@/lib/supabase/types'

export interface ConversationSummary {
  id: string
  chart_id: string
  user_id: string
  module: ConversationModule
  title: string | null
  created_at: string
  updated_at: string | null
}

export async function listConversations(params: {
  chartId: string
  userId: string
  module: ConversationModule
}): Promise<ConversationSummary[]> {
  const service = createServiceClient()
  const { data } = await service
    .from('conversations')
    .select('id, chart_id, user_id, module, title, created_at')
    .eq('chart_id', params.chartId)
    .eq('user_id', params.userId)
    .eq('module', params.module)
    .order('created_at', { ascending: false })
    .limit(100)
  return (data ?? []).map(row => ({
    ...row,
    module: row.module as ConversationModule,
    updated_at: row.created_at,
  }))
}

export async function createConversation(params: {
  chartId: string
  userId: string
  module: ConversationModule
}): Promise<ConversationSummary> {
  const service = createServiceClient()
  const { data, error } = await service
    .from('conversations')
    .insert({
      chart_id: params.chartId,
      user_id: params.userId,
      module: params.module,
      title: null,
    })
    .select('id, chart_id, user_id, module, title, created_at')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'Failed to create conversation')
  return { ...data, module: data.module as ConversationModule, updated_at: data.created_at }
}

// Inserts a conversation row with a caller-supplied id. Used when the route
// generates the id upfront and streams the response before persisting, so the
// insert can run in parallel with the model call instead of blocking TTFT.
export async function insertConversationWithId(params: {
  id: string
  chartId: string
  userId: string
  module: ConversationModule
}): Promise<void> {
  const service = createServiceClient()
  const { error } = await service.from('conversations').insert({
    id: params.id,
    chart_id: params.chartId,
    user_id: params.userId,
    module: params.module,
    title: null,
  })
  if (error) throw new Error(error.message)
}

export async function getConversation(params: {
  id: string
  userId: string
  isSuperAdmin: boolean
}): Promise<ConversationSummary | null> {
  const service = createServiceClient()
  const { data } = await service
    .from('conversations')
    .select('id, chart_id, user_id, module, title, created_at')
    .eq('id', params.id)
    .single()
  if (!data) return null
  if (!params.isSuperAdmin && data.user_id !== params.userId) return null
  return { ...data, module: data.module as ConversationModule, updated_at: data.created_at }
}

export async function loadConversationMessages(conversationId: string): Promise<UIMessage[]> {
  const service = createServiceClient()
  const { data } = await service
    .from('messages')
    .select('id, role, content, tool_calls, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (!data) return []
  const out: UIMessage[] = []
  for (const row of data) {
    if (row.role === 'user' || row.role === 'assistant') {
      let parts: UIMessage['parts'] | null = null
      if (Array.isArray(row.tool_calls)) {
        parts = row.tool_calls as UIMessage['parts']
      } else if (row.content) {
        parts = [{ type: 'text', text: row.content }] as UIMessage['parts']
      } else {
        parts = []
      }
      out.push({
        id: row.id,
        role: row.role,
        parts: parts ?? [],
      } as UIMessage)
    }
  }
  return out
}

export async function replaceConversationMessages(params: {
  conversationId: string
  messages: UIMessage[]
}) {
  const service = createServiceClient()
  await service.from('messages').delete().eq('conversation_id', params.conversationId)
  if (params.messages.length === 0) return
  const rows = params.messages.map(m => {
    const text = m.parts
      .filter(p => p.type === 'text')
      .map(p => (p as { text: string }).text)
      .join('')
    return {
      id: m.id,
      conversation_id: params.conversationId,
      role: m.role === 'assistant' || m.role === 'user' ? m.role : 'assistant',
      content: text || null,
      tool_calls: m.parts as unknown,
    }
  })
  await service.from('messages').insert(rows)
}

export async function updateConversationTitle(id: string, title: string) {
  const service = createServiceClient()
  await service.from('conversations').update({ title }).eq('id', id)
}

export async function deleteConversation(id: string) {
  const service = createServiceClient()
  await service.from('conversations').delete().eq('id', id)
}
