import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { appendEvent, appendPrediction, markPredictionOutcome } from '@/lib/lel/writer'
import { res } from '@/lib/errors'
import type { NewLELEvent, NewLELPrediction } from '@/lib/lel/writer'

async function assertSuperAdmin(req: NextRequest): Promise<string | null> {
  const user = await getServerUser()
  if (!user) return null
  const result = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [user.uid]
  )
  if (result.rows[0]?.role !== 'super_admin') return null
  return user.uid
}

export async function POST(req: NextRequest) {
  const uid = await assertSuperAdmin(req)
  if (!uid) {
    return res.forbidden()
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return res.badRequest('Invalid JSON')
  }

  if (!body || typeof body !== 'object') {
    return res.badRequest('Invalid body')
  }

  const { action, chartId, payload } = body as Record<string, unknown>

  try {
    if (action === 'append_event') {
      if (!chartId || typeof chartId !== 'string') {
        return res.badRequest('chartId required')
      }
      const result = await appendEvent(chartId, payload as NewLELEvent)
      return NextResponse.json(result)
    }

    if (action === 'append_prediction') {
      if (!chartId || typeof chartId !== 'string') {
        return res.badRequest('chartId required')
      }
      const result = await appendPrediction(chartId, payload as NewLELPrediction)
      return NextResponse.json(result)
    }

    if (action === 'mark_outcome') {
      const { predId, outcome } = body as Record<string, unknown>
      if (!predId || typeof predId !== 'string') {
        return res.badRequest('predId required')
      }
      await markPredictionOutcome(
        predId,
        outcome as { status: 'observed_confirmed' | 'observed_refuted'; body: string }
      )
      return NextResponse.json({ ok: true })
    }

    return res.badRequest(`Unknown action: ${action}`)
  } catch (e) {
    console.error('[api/lel]', e)
    return res.internal(e instanceof Error ? e.message : undefined)
  }
}
