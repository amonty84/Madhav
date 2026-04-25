import {
  streamText,
  stepCountIs,
  convertToModelMessages,
  createIdGenerator,
  generateText,
  smoothStream,
} from 'ai'
import type { ModelMessage, UIMessage } from 'ai'
import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { consumeTools } from '@/lib/claude/consume-tools'
import { consumeSystemPrompt, type ConsumeStyle } from '@/lib/claude/system-prompts'
import {
  getConversation,
  insertConversationWithId,
  replaceConversationMessages,
  updateConversationTitle,
} from '@/lib/conversations'
import {
  DEFAULT_MODEL_ID,
  TITLE_MODEL_ID,
  getModelMeta,
  isValidModelId,
  supports,
} from '@/lib/models/registry'
import { resolveModel } from '@/lib/models/resolver'

export const maxDuration = 120

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

  const user = await getServerUser()
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

  const modelId = isValidModelId(body.model ?? '') ? (body.model as string) : DEFAULT_MODEL_ID
  const modelMeta = getModelMeta(modelId)!
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
    service.from('profiles').select('role').eq('id', user.uid).single(),
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

  if (!isAstrologer && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let isFirstTurn = false
  // Fire the first-turn conversation insert in parallel with the model call so
  // it doesn't block TTFT. onFinish awaits this before persisting messages.
  let pendingConversationInsert: Promise<void> | null = null

  if (conversationId) {
    const existing = await getConversation({ id: conversationId, userId: user.uid, isAstrologer })
    if (!existing || existing.chart_id !== chartId) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
  } else {
    conversationId = crypto.randomUUID()
    isFirstTurn = true
    pendingConversationInsert = insertConversationWithId({
      id: conversationId,
      chartId,
      userId: user.uid,
      module: 'consume',
    })
  }

  const systemPrompt = consumeSystemPrompt(chart, reportsResult.data ?? [], style)

  console.log(`[consume] pre-stream setup: ${Date.now() - setupStart}ms  model=${modelId}  style=${style}`)

  // Provider-specific system message handling. Anthropic supports ephemeral
  // prompt caching on the stable prefix; Gemini does not. Attach cache control
  // only where it's supported so other providers see a plain system message.
  const systemMessage: ModelMessage = supports(modelId, 'prompt-caching')
    ? {
        role: 'system',
        content: systemPrompt,
        providerOptions: {
          anthropic: { cacheControl: { type: 'ephemeral' } },
        },
      }
    : {
        role: 'system',
        content: systemPrompt,
      }

  const modelMessages: ModelMessage[] = [
    systemMessage,
    ...(await convertToModelMessages(messages)),
  ]

  let finishReason: string | undefined

  // Some models (e.g. DeepSeek R1) don't support tool-use reliably; omit tools
  // entirely for those so the model answers from conversation context alone
  // rather than emitting malformed tool calls.
  const toolsForModel = supports(modelId, 'tool-use') ? consumeTools : undefined

  const result = streamText({
    model: resolveModel(modelId),
    messages: modelMessages,
    tools: toolsForModel,
    stopWhen: stepCountIs(5),
    maxOutputTokens: modelMeta.maxOutputTokens,
    experimental_transform: smoothStream({ delayInMs: 20, chunking: 'word' }),
    onFinish: ({ finishReason: reason, providerMetadata, usage }) => {
      finishReason = reason
      const meta = providerMetadata?.anthropic as
        | { cacheReadInputTokens?: number; cacheCreationInputTokens?: number }
        | undefined
      console.log(
        `[consume] stream finish: model=${modelId} finishReason=${reason} ` +
          `cacheRead=${meta?.cacheReadInputTokens ?? 0} ` +
          `cacheCreate=${meta?.cacheCreationInputTokens ?? 0} ` +
          `inputTokens=${usage?.inputTokens ?? 0} ` +
          `outputTokens=${usage?.outputTokens ?? 0}`
      )
      if (reason === 'length') {
        console.warn('[consume] OUTPUT TRUNCATED: hit maxOutputTokens cap', {
          model: modelId,
          cap: modelMeta.maxOutputTokens,
        })
      }
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
        return { conversationId: finalConversationId, model: modelId }
      }
      if (part.type === 'start') {
        return { model: modelId }
      }
      // Emitted after streamText.onFinish has run, so finishReason is set.
      if (part.type === 'finish' && finishReason === 'length') {
        return { truncated: true }
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
    // Pinned to the cheapest fast model regardless of the user's picked chat
    // model — titles are short and latency-sensitive.
    const { text: title } = await generateText({
      model: resolveModel(TITLE_MODEL_ID),
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
