import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../_guard'
import { ObservatoryBadRequestError, parseEventsQuery } from '../_parse'
import { getEvents } from '@/lib/observatory/queries'
import { query } from '@/lib/db/client'

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)

  const groupByQuery = url.searchParams.get('groupByQuery') === 'true'
  if (groupByQuery) {
    try {
      const from = url.searchParams.get('from')
      const to = url.searchParams.get('to')
      if (!from || !to) return res.badRequest('Missing required parameter: from or to')
      const groupedSql = `
        SELECT
          conversation_id,
          COUNT(*) AS call_count,
          SUM(computed_cost_usd) AS total_cost_usd,
          SUM(input_tokens) AS total_input_tokens,
          SUM(output_tokens) AS total_output_tokens,
          MIN(started_at) AS started_at,
          MAX(finished_at) AS finished_at,
          array_agg(DISTINCT pipeline_stage) AS stages
        FROM llm_usage_events
        WHERE started_at >= $1 AND started_at < $2
        GROUP BY conversation_id
        ORDER BY started_at DESC
        LIMIT 100
      `
      const result = await query(groupedSql, [from, to])
      return NextResponse.json({ type: 'grouped', rows: result.rows })
    } catch (err) {
      console.error('[admin/observatory/events] grouped query failed', err)
      return res.internal('Failed to list grouped events.')
    }
  }

  let input
  try {
    input = parseEventsQuery(url)
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
