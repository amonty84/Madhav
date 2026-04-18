import { streamText, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { consumeTools } from '@/lib/claude/consume-tools'
import { consumeSystemPrompt } from '@/lib/claude/system-prompts'
import type { ModelMessage } from 'ai'

export async function POST(request: Request) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { chartId?: string; messages?: ModelMessage[] }
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

  // Verify ownership: astrologer can access any chart; client only their own
  const [chartResult, profileResult] = await Promise.all([
    service.from('charts').select('id, name, birth_date, birth_time, birth_place, client_id').eq('id', chartId).single(),
    service.from('profiles').select('role').eq('id', user.id).single(),
  ])

  if (!chartResult.data) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
  const chart = chartResult.data
  const role = profileResult.data?.role

  if (role !== 'astrologer' && chart.client_id !== user.id) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { data: reports } = await service
    .from('reports')
    .select('domain, title, version')
    .eq('chart_id', chartId)
    .order('domain')

  const systemPrompt = consumeSystemPrompt(chart, reports ?? [])

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages,
    tools: consumeTools,
    stopWhen: stepCountIs(5),
    maxOutputTokens: 8192,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  })

  return result.toTextStreamResponse()
}
