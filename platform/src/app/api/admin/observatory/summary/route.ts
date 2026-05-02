import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../_guard'
import { ObservatoryBadRequestError, parseSummaryQuery } from '../_parse'
import { getSummary } from '@/lib/observatory/queries'

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let input
  try {
    input = parseSummaryQuery(new URL(request.url))
  } catch (err) {
    if (err instanceof ObservatoryBadRequestError) return res.badRequest(err.message)
    throw err
  }

  try {
    const data = await getSummary(input)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/observatory/summary] failed', err)
    return res.internal('Failed to compute summary.')
  }
}
