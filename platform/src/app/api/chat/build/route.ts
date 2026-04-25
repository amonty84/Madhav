import { streamText, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { buildTools } from '@/lib/claude/build-tools'
import { buildSystemPrompt } from '@/lib/claude/system-prompts'
import type { ModelMessage } from 'ai'

async function requireSuperAdmin() {
  const user = await getServerUser()
  if (!user) return null
  const result = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [user.uid]
  )
  if (result.rows[0]?.role !== 'super_admin') return null
  return user
}

export async function POST(request: Request) {
  const user = await requireSuperAdmin()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

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

  const [chartResult, layersResult] = await Promise.all([
    query<{ id: string; name: string; birth_date: string; birth_time: string; birth_place: string }>(
      'SELECT id, name, birth_date, birth_time, birth_place FROM charts WHERE id=$1',
      [chartId]
    ),
    query<{ layer: string; sublayer: string; status: string }>(
      'SELECT layer, sublayer, status FROM pyramid_layers WHERE chart_id=$1',
      [chartId]
    ),
  ])

  if (!chartResult.rows[0]) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
  const chart = chartResult.rows[0]
  const layers = layersResult.rows

  const systemPrompt = buildSystemPrompt(chart, layers)

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages,
    tools: buildTools,
    stopWhen: stepCountIs(5),
    maxOutputTokens: 16384,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  })

  return result.toTextStreamResponse()
}
