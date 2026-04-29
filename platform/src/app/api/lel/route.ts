import { NextRequest, NextResponse } from 'next/server'
import { logPrediction } from '@/lib/prediction/writer'
import type { Prediction } from '@/lib/prediction/types'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const b = body as Partial<Prediction>

  if (!b.query_id || !b.prediction_text || !b.falsifier) {
    return NextResponse.json(
      { error: 'query_id, prediction_text, and falsifier are required' },
      { status: 400 }
    )
  }
  if (typeof b.confidence !== 'number' || b.confidence < 0 || b.confidence > 1) {
    return NextResponse.json({ error: 'confidence must be a number in [0, 1]' }, { status: 400 })
  }
  if (!b.horizon_start || !b.horizon_end) {
    return NextResponse.json({ error: 'horizon_start and horizon_end are required' }, { status: 400 })
  }

  try {
    const id = await logPrediction({
      query_id:        b.query_id,
      prediction_text: b.prediction_text,
      confidence:      b.confidence,
      horizon_start:   b.horizon_start,
      horizon_end:     b.horizon_end,
      falsifier:       b.falsifier,
      subject:         b.subject,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
