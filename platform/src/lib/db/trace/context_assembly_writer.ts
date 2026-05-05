import 'server-only'
import { getStorageClient } from '@/lib/storage'

export interface ContextAssemblyItem {
  query_id: string
  assembly_step_id: string
  item_rank: number
  source_bundle: string
  source_item_id: string
  layer: 'preamble' | 'L1' | 'L2_5'
  token_cost: number
  relevance_score?: number
  status: 'INCLUDED' | 'TRUNCATED' | 'DROPPED'
  drop_reason?: 'BUDGET_EXCEEDED' | 'DEDUP' | 'RELEVANCE_FLOOR'
  truncated_to_tokens?: number
  cumulative_tokens_at_decision: number
  budget_at_decision: number
}

// Writes per-item context assembly rows to context_assembly_item_log.
// Fire-and-forget: errors are swallowed so this never disrupts the assembly path.
// Capped at 500 items per call to avoid oversized inserts.
export function writeContextAssemblyLog(
  items: ContextAssemblyItem[],
  db = getStorageClient(),
): void {
  const capped = items.slice(0, 500)
  void (async () => {
    try {
      if (capped.length === 0) return
      const values = capped.map((_, i) => {
        const base = i * 12
        return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10},$${base + 11},$${base + 12})`
      }).join(',')
      const params = capped.flatMap(item => [
        item.query_id,
        item.assembly_step_id,
        item.item_rank,
        item.source_bundle,
        item.source_item_id,
        item.layer,
        item.token_cost,
        item.relevance_score ?? null,
        item.status,
        item.drop_reason ?? null,
        item.cumulative_tokens_at_decision,
        item.budget_at_decision,
      ])
      await db.query(
        `INSERT INTO context_assembly_item_log
         (query_id, assembly_step_id, item_rank, source_bundle, source_item_id, layer,
          token_cost, relevance_score, status, drop_reason, cumulative_tokens_at_decision,
          budget_at_decision)
         VALUES ${values}
         ON CONFLICT DO NOTHING`,
        params,
      )
    } catch {
      // telemetry errors must not propagate
    }
  })()
}
