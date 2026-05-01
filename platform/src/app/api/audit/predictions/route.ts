import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { listPredictions } from '@/lib/prediction/queries'
import type { ListPredictionsParams } from '@/lib/prediction/queries'

export async function GET(request: Request) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const status = url.searchParams.get('status') === 'closed' ? 'closed' : 'open'

  const params: ListPredictionsParams = { status }

  const subject = url.searchParams.get('subject')
  if (subject) params.subject = subject

  const dateFrom = url.searchParams.get('date_from')
  if (dateFrom) params.date_from = dateFrom

  const dateTo = url.searchParams.get('date_to')
  if (dateTo) params.date_to = dateTo

  const confMin = url.searchParams.get('confidence_min')
  if (confMin !== null) params.confidence_min = parseFloat(confMin)

  const confMax = url.searchParams.get('confidence_max')
  if (confMax !== null) params.confidence_max = parseFloat(confMax)

  const bucket = url.searchParams.get('calibration_bucket')
  if (bucket) params.calibration_bucket = bucket

  try {
    const result = await listPredictions(params)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/audit/predictions] GET failed', err)
    return NextResponse.json({ error: 'Failed to load predictions.' }, { status: 500 })
  }
}
