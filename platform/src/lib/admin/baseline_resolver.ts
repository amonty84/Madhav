import 'server-only'
import type { StorageClient } from '@/lib/storage/types'

export interface BaselineStats {
  p50_total_latency_ms: number | null
  p95_total_latency_ms: number | null
  p50_total_cost_usd: number | null
  p95_total_cost_usd: number | null
  sample_size: number
}

// Reads query_baseline_stats materialized view for the given query_type.
// Returns null values on any DB error or when the view has no data.
export async function resolveBaseline(
  _queryType: string | null,
  db: StorageClient,
): Promise<BaselineStats> {
  try {
    const { rows } = await db.query<{
      p50_total_latency_ms: number | null
      p95_total_latency_ms: number | null
      p50_total_cost_usd: number | null
      p95_total_cost_usd: number | null
      sample_size: string | number
    }>(
      `SELECT p50_total_latency_ms, p95_total_latency_ms,
              p50_total_cost_usd, p95_total_cost_usd, sample_size
       FROM query_baseline_stats
       WHERE query_type = 'unknown'
       LIMIT 1`,
      [],
    )
    if (rows.length === 0) {
      return { p50_total_latency_ms: null, p95_total_latency_ms: null,
               p50_total_cost_usd: null, p95_total_cost_usd: null, sample_size: 0 }
    }
    const row = rows[0]
    return {
      p50_total_latency_ms: row.p50_total_latency_ms,
      p95_total_latency_ms: row.p95_total_latency_ms,
      p50_total_cost_usd: row.p50_total_cost_usd,
      p95_total_cost_usd: row.p95_total_cost_usd,
      sample_size: Number(row.sample_size),
    }
  } catch {
    return { p50_total_latency_ms: null, p95_total_latency_ms: null,
             p50_total_cost_usd: null, p95_total_cost_usd: null, sample_size: 0 }
  }
}
