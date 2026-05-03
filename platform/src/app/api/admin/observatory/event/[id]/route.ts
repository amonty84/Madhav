import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import { getEventById } from '@/lib/observatory/queries'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params
  if (!UUID_RE.test(id)) return res.badRequest('event id must be a UUID')

  try {
    const row = await getEventById(id)
    if (!row) return res.notFound('event')
    return NextResponse.json(row)
  } catch (err) {
    console.error('[admin/observatory/event/[id]] failed', err)
    return res.internal('Failed to load event.')
  }
}
