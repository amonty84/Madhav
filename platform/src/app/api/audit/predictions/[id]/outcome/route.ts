import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { recordOutcome } from '@/lib/prediction/queries'
import { query } from '@/lib/db/client'
import { res } from '@/lib/errors'
import type { PredictionOutcome } from '@/lib/prediction/queries'

const VALID_OUTCOMES: PredictionOutcome[] = ['confirmed', 'refuted', 'partial', 'unobservable']

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  let body: { outcome?: string; observation?: string; correction_note?: string }
  try {
    body = await request.json()
  } catch {
    return res.badRequest('invalid request body')
  }

  const outcome = body.outcome as PredictionOutcome | undefined
  if (!outcome || !VALID_OUTCOMES.includes(outcome)) {
    return res.badRequest(`outcome must be one of: ${VALID_OUTCOMES.join(', ')}`)
  }

  // Sacrosanct rule: horizon_start must be <= today before recording outcome
  let checkResult: Awaited<ReturnType<typeof query<{ id: string; horizon_start: string; outcome: string | null }>>>
  try {
    checkResult = await query<{ id: string; horizon_start: string; outcome: string | null }>(
      'SELECT id, horizon_start, outcome FROM prediction_ledger WHERE id = $1',
      [id]
    )
  } catch (err) {
    console.error('[api/audit/predictions/[id]/outcome] pre-check query failed', err)
    return res.dbError()
  }

  const prediction = checkResult.rows[0]
  if (!prediction) {
    return res.notFound()
  }
  if (prediction.outcome !== null) {
    return res.conflict('outcome already recorded')
  }

  const today = new Date().toISOString().split('T')[0]
  if (prediction.horizon_start > today) {
    return res.badRequest('horizon_start has not been reached yet — outcome cannot be recorded before the prediction window begins')
  }

  try {
    const updated = await recordOutcome({ id, outcome, observation: body.observation, correction_note: body.correction_note })
    if (!updated) return res.notFound()
    return NextResponse.json({ ok: true, prediction: updated })
  } catch (err) {
    console.error('[api/audit/predictions/[id]/outcome] POST failed', err)
    return res.internal('Failed to record outcome.')
  }
}
