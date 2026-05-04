/**
 * embedding_freshness_check.ts
 *
 * Reports how many rag_embeddings rows are stale (created_at older than a
 * threshold). Exits 0 when stale_30_days / total < 0.15; exits 1 otherwise.
 *
 * Run via: npm run embedding:freshness
 *          (or: npx tsx --conditions=react-server scripts/retrieval/embedding_freshness_check.ts)
 *
 * Requires: DATABASE_URL env var (or the standard Cloud SQL Proxy on 5432).
 * [PROXY] step: run cloud_sql_proxy before executing this script against prod.
 */

import { getStorageClient } from '../src/lib/storage'

interface CountRow {
  cnt: string
}

/**
 * Returns the number of rag_embeddings rows with created_at older than
 * thresholdDays from now. Queries the prod DB; needs a live connection.
 */
export async function getStaleEmbeddingCount(thresholdDays: number): Promise<number> {
  const storage = getStorageClient()
  const { rows } = await storage.query<CountRow>(
    `SELECT COUNT(*)::text AS cnt
     FROM rag_embeddings
     WHERE created_at < NOW() - ($1 * INTERVAL '1 day')`,
    [thresholdDays],
  )
  return parseInt(rows[0]?.cnt ?? '0', 10)
}

async function main() {
  const storage = getStorageClient()

  const { rows: totalRows } = await storage.query<CountRow>(
    `SELECT COUNT(*)::text AS cnt FROM rag_embeddings`,
    [],
  )
  const total = parseInt(totalRows[0]?.cnt ?? '0', 10)

  const stale30 = await getStaleEmbeddingCount(30)
  const stale90 = await getStaleEmbeddingCount(90)

  console.log(`Embedding freshness report`)
  console.log(`  Total embeddings : ${total}`)
  console.log(`  Stale > 30 days  : ${stale30}`)
  console.log(`  Stale > 90 days  : ${stale90}`)

  if (total === 0) {
    console.log('  No embeddings found — cannot compute staleness ratio.')
    process.exit(0)
  }

  const ratio30 = stale30 / total
  console.log(`  Staleness ratio (30d): ${(ratio30 * 100).toFixed(1)}%  [threshold: 15%]`)

  if (ratio30 >= 0.15) {
    console.error(`  FAIL: stale_30_days / total = ${(ratio30 * 100).toFixed(1)}% >= 15% — re-embedding needed.`)
    process.exit(1)
  }

  console.log(`  PASS: staleness ratio is below 15%.`)
  process.exit(0)
}

main().catch(err => {
  console.error('embedding_freshness_check failed:', err)
  process.exit(1)
})
