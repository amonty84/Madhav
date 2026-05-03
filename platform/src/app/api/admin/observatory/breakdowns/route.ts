import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../_guard'
import { ObservatoryBadRequestError, parseBreakdownsQuery } from '../_parse'
import { getBreakdowns } from '@/lib/observatory/queries'

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let input
  try {
    input = parseBreakdownsQuery(new URL(request.url))
  } catch (err) {
    if (err instanceof ObservatoryBadRequestError) return res.badRequest(err.message)
    throw err
  }

  try {
    const data = await getBreakdowns(input)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/observatory/breakdowns] failed', err)
    return res.internal('Failed to compute breakdowns.')
  }
}
