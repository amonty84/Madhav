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
import { query } from '@/lib/db/client'
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
import { configService } from '@/lib/config/index'
import { classify } from '@/lib/router/router'
import { compose } from '@/lib/bundle/rule_composer'
import { getTool } from '@/lib/retrieve/index'
import { createToolCache, executeWithCache } from '@/lib/cache/index'
import { loadManifest } from '@/lib/bundle/manifest_reader'
import { runAll, summarize } from '@/lib/validators/index'
import { createOrchestrator } from '@/lib/synthesis/index'
import { createAuditConsumer } from '@/lib/audit/consumer'

export const maxDuration = 120

const ALLOWED_STYLES: ConsumeStyle[] = ['acharya', 'brief', 'client']

interface RequestBody {
  chartId?: string
  conversationId?: string
  messages?: UIMessage[]
  model?: string
  style?: string
  panel_opt_in?: boolean
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

  const [chartResult, profileResult, reportsResult] = await Promise.all([
    query<{ id: string; name: string; birth_date: string; birth_time: string; birth_place: string; client_id: string }>(
      'SELECT id, name, birth_date, birth_time, birth_place, client_id FROM charts WHERE id=$1',
      [chartId]
    ),
    query<{ role: string }>(
      'SELECT role FROM profiles WHERE id=$1',
      [user.uid]
    ),
    query<{ domain: string; title: string; version: string }>(
      'SELECT domain, title, version FROM reports WHERE chart_id=$1 ORDER BY domain',
      [chartId]
    ),
  ])

  if (!chartResult.rows[0]) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
  const chart = chartResult.rows[0]
  const role = profileResult.rows[0]?.role
  const isSuperAdmin = role === 'super_admin'

  if (!isSuperAdmin && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let isFirstTurn = false
  // Fire the first-turn conversation insert in parallel with the model call so
  // it doesn't block TTFT. onFinish awaits this before persisting messages.
  let pendingConversationInsert: Promise<void> | null = null

  if (conversationId) {
    const existing = await getConversation({ id: conversationId, userId: user.uid, isSuperAdmin })
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

  const finalConversationId = conversationId

  if (configService.getFlag('NEW_QUERY_PIPELINE_ENABLED')) {
    const lastUserMessage = messages.filter(m => m.role === 'user').at(-1)
    const queryText = extractText(lastUserMessage?.parts ?? [])

    const manifest = await loadManifest('00_ARCHITECTURE/CAPABILITY_MANIFEST.json', '00_ARCHITECTURE/manifest_overrides.yaml')

    const queryPlan = await classify(queryText, {
      audience_tier: isSuperAdmin ? 'super_admin' : 'client',
      manifest_fingerprint: manifest.fingerprint,
      conversation_history: messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-4)
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: extractText(m.parts ?? []),
        })),
    })

    const bundle = await compose(queryPlan)

    const cache = createToolCache()
    const toolResults = await Promise.all(
      queryPlan.tools_authorized.map(async (toolName: string) => {
        const t = getTool(toolName)
        if (!t) return null
        try {
          return await executeWithCache(t, queryPlan, cache)
        } catch {
          return null
        }
      })
    )
    const validToolResults = toolResults.filter((r): r is NonNullable<typeof r> => r !== null)

    const bundleValidations = await runAll(bundle, 'bundle', { query_plan: queryPlan, bundle, manifest_fingerprint: manifest.fingerprint })
    const bundleSummary = summarize(bundleValidations)
    if (bundleSummary.overall === 'fail' && configService.getFlag('VALIDATOR_FAILURE_HALT')) {
      return NextResponse.json(
        { error: 'bundle_validation_failed', failures: bundleSummary.failures },
        { status: 422 }
      )
    }

    const audienceTier = isSuperAdmin ? 'super_admin' as const : 'client' as const
    const panelOptIn = body.panel_opt_in === true
    const orchestrator = createOrchestrator({ panel_opt_in: panelOptIn })
    const { result } = await orchestrator.synthesize({
      query: queryText,
      query_plan: queryPlan,
      bundle,
      tool_results: validToolResults,
      conversation_history: messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: extractText(m.parts ?? []),
        })),
      selected_model_id: modelId,
      style,
      audience_tier: audienceTier,
      cache,
      chart_context: {
        name: chart.name ?? 'the native',
        birth_date: chart.birth_date,
        birth_time: chart.birth_time,
        birth_place: chart.birth_place,
      },
      panel_opt_in: panelOptIn,
      onAuditEvent: configService.getFlag('AUDIT_ENABLED')
        ? createAuditConsumer({
            query_text: queryText,
            query_plan: queryPlan,
            bundle,
            tool_results: validToolResults,
            validator_results: bundleValidations,
            disclosure_tier: audienceTier,
          })
        : undefined,
    })

    result.consumeStream()

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
      messageMetadata: ({ part }: { part: { type: string } }) => {
        if (part.type === 'start' && isFirstTurn) {
          return { conversationId: finalConversationId, model: modelId, pipeline: 'v2' }
        }
        if (part.type === 'start') {
          return { model: modelId, pipeline: 'v2' }
        }
      },
      onFinish: async ({ messages: finalMessages }: { messages: UIMessage[] }) => {
        try {
          if (pendingConversationInsert) await pendingConversationInsert
          await replaceConversationMessages({
            conversationId: finalConversationId,
            messages: finalMessages,
          })
          if (isFirstTurn) {
            generateConversationTitle(finalMessages).then((title: string | null) => {
              if (title) void updateConversationTitle(finalConversationId, title)
            })
          }
        } catch (err) {
          console.error('[consume:v2] persistence failed', err)
        }
      },
      onError: (error: unknown) => {
        if (error instanceof Error) return error.message
        return 'Something went wrong while generating a response.'
      },
    })
  }

  const systemPrompt = consumeSystemPrompt(chart, reportsResult.rows, style)

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

function extractText(parts: Array<{ type: string; text?: string }>): string {
  return parts.filter(p => p.type === 'text').map(p => p.text ?? '').join(' ').trim()
}
