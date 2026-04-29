import 'server-only'
import { query } from '@/lib/db/client'

export async function fetchConsumedTodayCount(chartIds: string[]): Promise<number> {
  if (chartIds.length === 0) return 0
  const result = await query<{ count: string }>(
    `SELECT COUNT(DISTINCT chart_id)::text AS count
     FROM conversations
     WHERE module = 'consume'
       AND created_at >= CURRENT_DATE
       AND chart_id = ANY($1::uuid[])`,
    [chartIds]
  )
  return parseInt(result.rows[0]?.count ?? '0', 10)
}
