import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../_guard'
import { ObservatoryBadRequestError, parseEventsQuery } from '../_parse'
import { getEvents } from '@/lib/observatory/queries'

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let input
  try {
    input = parseEventsQuery(new URL(request.url))
  } catch (err) {
    if (err instanceof ObservatoryBadRequestError) return res.badRequest(err.message)
    throw err
  }

  try {
    const data = await getEvents(input)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/observatory/events] failed', err)
    return res.internal('Failed to list events.')
  }
}
