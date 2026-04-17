import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { buildTools } from '@/lib/claude/build-tools'
import { buildSystemPrompt } from '@/lib/claude/system-prompts'
import type { ModelMessage } from 'ai'

async function requireAstrologer() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data: prof } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (prof?.role !== 'astrologer') return null
  return user
}

export async function POST(request: Request) {
  const user = await requireAstrologer()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: { chartId?: string; messages?: ModelMessage[]; conversationId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { chartId, messages } = body
  if (!chartId || !messages) {
    return NextResponse.json({ error: 'chartId and messages are required' }, { status: 400 })
  }

  const service = createServiceClient()
  const [chartResult, layersResult] = await Promise.all([
    service.from('charts').select('name, birth_date, birth_time, birth_place').eq('id', chartId).single(),
    service.from('pyramid_layers').select('layer, sublayer, status').eq('chart_id', chartId),
  ])
  if (!chartResult.data) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
  if (layersResult.error) return NextResponse.json({ error: layersResult.error.message }, { status: 500 })
  const chart = chartResult.data
  const layers = layersResult.data ?? []

  const systemPrompt = buildSystemPrompt(chart, layers)

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages,
    tools: buildTools,
    maxOutputTokens: 16384,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  })

  return result.toTextStreamResponse()
}
