import { streamText, stepCountIs, convertToModelMessages, createIdGenerator, generateText } from 'ai'
import type { ModelMessage, UIMessage } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { consumeTools } from '@/lib/claude/consume-tools'
import { consumeSystemPrompt, type ConsumeStyle } from '@/lib/claude/system-prompts'
import {
  getConversation,
  insertConversationWithId,
  replaceConversationMessages,
  updateConversationTitle,
} from '@/lib/conversations'

export const maxDuration = 60

const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-haiku-4-5', 'claude-opus-4-7'] as const
type AllowedModel = (typeof ALLOWED_MODELS)[number]
const DEFAULT_MODEL: AllowedModel = 'claude-sonnet-4-6'

const ALLOWED_STYLES: ConsumeStyle[] = ['acharya', 'brief', 'client']

interface RequestBody {
  chartId?: string
  conversationId?: string
  messages?: UIMessage[]
  model?: string
  style?: string
}

export async function POST(request: Request) {
  const setupStart = Date.now()

  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { chartId, messages } = body
  let { conversationId } = body

  if (!chartId || !messages) {
    return NextResponse.json({ error: 'chartId and messages are required' }, { status: 400 })
  }

  const model: AllowedModel = (ALLOWED_MODELS as readonly string[]).includes(body.model ?? '')
    ? (body.model as AllowedModel)
    : DEFAULT_MODEL
  const style: ConsumeStyle = ALLOWED_STYLES.includes(body.style as ConsumeStyle)
    ? (body.style as ConsumeStyle)
    : 'acharya'

  const service = createServiceClient()

  const [chartResult, profileResult, reportsResult] = await Promise.all([
    service
      .from('charts')
      .select('id, name, birth_date, birth_time, birth_place, client_id')
      .eq('id', chartId)
      .single(),
    service.from('profiles').select('role').eq('id', user.id).single(),
    service
      .from('reports')
      .select('domain, title, version')
      .eq('chart_id', chartId)
      .order('domain'),
  ])

  if (!chartResult.data) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
  const chart = chartResult.data
  const role = profileResult.data?.role
  const isAstrologer = role === 'astrologer'

  if (!isAstrologer && chart.client_id !== user.id) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let isFirstTurn = false
  // Fire the first-turn conversation insert in parallel with the model call so
  // it doesn't block TTFT. onFinish awaits this before persisting messages.
  let pendingConversationInsert: Promise<void> | null = null

  if (conversationId) {
    const existing = await getConversation({ id: conversationId, userId: user.id, isAstrologer })
    if (!existing || existing.chart_id !== chartId) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
  } else {
    conversationId = crypto.randomUUID()
    isFirstTurn = true
    pendingConversationInsert = insertConversationWithId({
      id: conversationId,
      chartId,
      userId: user.id,
      module: 'consume',
    })
  }

  const systemPrompt = consumeSystemPrompt(chart, reportsResult.data ?? [], style)

  console.log(`[consume] pre-stream setup: ${Date.now() - setupStart}ms`)

  // Cache the stable prefix (tools + system prompt) with an ephemeral breakpoint.
  // Anthropic caches everything before the breakpoint, so this covers tool defs
  // + chart context + reports index on every turn after the first in a 5-min window.
  const modelMessages: ModelMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
      providerOptions: {
        anthropic: { cacheControl: { type: 'ephemeral' } },
      },
    },
    ...(await convertToModelMessages(messages)),
  ]

  const result = streamText({
    model: anthropic(model),
    messages: modelMessages,
    tools: consumeTools,
    stopWhen: stepCountIs(3),
    maxOutputTokens: 8192,
    onFinish: ({ providerMetadata, usage }) => {
      const meta = providerMetadata?.anthropic as
        | { cacheReadInputTokens?: number; cacheCreationInputTokens?: number }
        | undefined
      console.log('[consume] stream finish:', {
        cacheRead: meta?.cacheReadInputTokens ?? 0,
        cacheCreate: meta?.cacheCreationInputTokens ?? 0,
        inputTokens: usage?.inputTokens ?? 0,
        outputTokens: usage?.outputTokens ?? 0,
      })
    },
  })

  // Keep the server stream alive even if the client disconnects, so onFinish
  // still fires and we persist the full assistant turn.
  result.consumeStream()

  const finalConversationId = conversationId

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
    messageMetadata: ({ part }) => {
      if (part.type === 'start' && isFirstTurn) {
        return { conversationId: finalConversationId }
      }
    },
    onFinish: async ({ messages: finalMessages }) => {
      try {
        // First-turn insert was fired in parallel with the stream; await it
        // before writing messages so the FK (messages.conversation_id) is valid.
        if (pendingConversationInsert) await pendingConversationInsert
        await replaceConversationMessages({
          conversationId: finalConversationId,
          messages: finalMessages,
        })
        if (isFirstTurn) {
          generateConversationTitle(finalMessages).then(title => {
            if (title) void updateConversationTitle(finalConversationId, title)
          })
        }
      } catch (err) {
        console.error('[consume] persistence failed', err)
      }
    },
    onError: error => {
      if (error instanceof Error) return error.message
      return 'Something went wrong while generating a response.'
    },
  })
}

async function generateConversationTitle(messages: UIMessage[]): Promise<string | null> {
  const firstUser = messages.find(m => m.role === 'user')
  if (!firstUser) return null
  const text = firstUser.parts
    .filter(p => p.type === 'text')
    .map(p => (p as { text: string }).text)
    .join(' ')
    .trim()
  if (!text) return null

  try {
    const { text: title } = await generateText({
      model: anthropic('claude-haiku-4-5'),
      system:
        'Summarize the user question as a concise 3-6 word chat title. No quotes, no trailing punctuation, Title Case.',
      prompt: text.slice(0, 500),
      maxOutputTokens: 40,
    })
    const cleaned = title.replace(/^["']|["']$/g, '').trim().slice(0, 80)
    return cleaned || fallbackTitle(text)
  } catch {
    return fallbackTitle(text)
  }
}

function fallbackTitle(text: string): string {
  const firstLine = text.split('\n')[0].trim()
  if (firstLine.length <= 60) return firstLine
  const slice = firstLine.slice(0, 60)
  const lastSpace = slice.lastIndexOf(' ')
  return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice) + '…'
}
