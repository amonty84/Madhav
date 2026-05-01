import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { recordOutcome } from '@/lib/prediction/queries'
import { query } from '@/lib/db/client'
import type { PredictionOutcome } from '@/lib/prediction/queries'

const VALID_OUTCOMES: PredictionOutcome[] = ['confirmed', 'refuted', 'partial', 'unobservable']

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  let body: { outcome?: string; observation?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  const outcome = body.outcome as PredictionOutcome | undefined
  if (!outcome || !VALID_OUTCOMES.includes(outcome)) {
    return NextResponse.json(
      { error: `outcome must be one of: ${VALID_OUTCOMES.join(', ')}` },
      { status: 400 }
    )
  }

  // Sacrosanct rule: horizon_start must be <= today before recording outcome
  const checkResult = await query<{ id: string; horizon_start: string; outcome: string | null }>(
    'SELECT id, horizon_start, outcome FROM prediction_ledger WHERE id = $1',
    [id]
  )
  const prediction = checkResult.rows[0]
  if (!prediction) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (prediction.outcome !== null) {
    return NextResponse.json({ error: 'outcome already recorded' }, { status: 409 })
  }

  const today = new Date().toISOString().split('T')[0]
  if (prediction.horizon_start > today) {
    return NextResponse.json(
      { error: 'horizon_start has not been reached yet — outcome cannot be recorded before the prediction window begins' },
      { status: 422 }
    )
  }

  try {
    const updated = await recordOutcome({ id, outcome, observation: body.observation })
    if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return NextResponse.json({ ok: true, prediction: updated })
  } catch (err) {
    console.error('[api/audit/predictions/[id]/outcome] POST failed', err)
    return NextResponse.json({ error: 'Failed to record outcome.' }, { status: 500 })
  }
}
