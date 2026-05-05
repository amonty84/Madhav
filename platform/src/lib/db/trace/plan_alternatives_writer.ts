import 'server-only'
import { getStorageClient } from '@/lib/storage'

export interface PlanAlternative {
  query_id: string
  bundle_name: string
  was_selected: boolean
  rationale?: string
  expected_recall_score?: number
}

// Fire-and-forget: errors are swallowed so this never disrupts the planning path.
export function writePlanAlternatives(
  alternatives: PlanAlternative[],
  db = getStorageClient(),
): void {
  void (async () => {
    try {
      if (alternatives.length === 0) return
      const values = alternatives.map((_, i) => {
        const base = i * 5
        return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5})`
      }).join(',')
      const params = alternatives.flatMap(a => [
        a.query_id,
        a.bundle_name,
        a.was_selected,
        a.rationale ?? null,
        a.expected_recall_score ?? null,
      ])
      await db.query(
        `INSERT INTO plan_alternatives_log
         (query_id, bundle_name, was_selected, rationale, expected_recall_score)
         VALUES ${values}`,
        params,
      )
    } catch {
      // telemetry errors must not propagate
    }
  })()
}
