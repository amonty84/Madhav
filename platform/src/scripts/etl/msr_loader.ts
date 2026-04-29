import type { MsrSignal } from '../../lib/db/types'
import { getStorageClient } from '../../lib/storage/index'

/**
 * Load MSR signals into the msr_signals table.
 * Clear-and-reload pattern: deletes all signals for native_id='abhisek', then inserts all provided signals.
 *
 * @returns Object with counts of deleted and inserted rows.
 */
export async function loadMsrSignals(
  signals: MsrSignal[]
): Promise<{ deleted: number; inserted: number }> {
  const client = getStorageClient()

  // Step 1: Delete existing signals for this native
  const deleteResult = await client.query<{ count: string }>(
    `DELETE FROM msr_signals WHERE native_id = $1 RETURNING 1`,
    ['abhisek']
  )
  const deleted = deleteResult.rowCount

  // Step 2: Insert all signals in a single transaction
  let inserted = 0

  await client.transaction(async (tx) => {
    for (const signal of signals) {
      await tx.query(
        `INSERT INTO msr_signals (
          signal_id,
          native_id,
          domain,
          planet,
          house,
          nakshatra,
          dasha_lord,
          confidence,
          significance,
          is_forward_looking,
          claim_text,
          classical_basis,
          falsifier,
          source_file,
          source_version
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (signal_id) DO UPDATE SET
          native_id = EXCLUDED.native_id,
          domain = EXCLUDED.domain,
          planet = EXCLUDED.planet,
          house = EXCLUDED.house,
          nakshatra = EXCLUDED.nakshatra,
          dasha_lord = EXCLUDED.dasha_lord,
          confidence = EXCLUDED.confidence,
          significance = EXCLUDED.significance,
          is_forward_looking = EXCLUDED.is_forward_looking,
          claim_text = EXCLUDED.claim_text,
          classical_basis = EXCLUDED.classical_basis,
          falsifier = EXCLUDED.falsifier,
          source_file = EXCLUDED.source_file,
          source_version = EXCLUDED.source_version`,
        [
          signal.signal_id,
          signal.native_id,
          signal.domain,
          signal.planet,
          signal.house,
          signal.nakshatra,
          signal.dasha_lord,
          signal.confidence,
          signal.significance,
          signal.is_forward_looking,
          signal.claim_text,
          signal.classical_basis,
          signal.falsifier,
          signal.source_file,
          signal.source_version,
        ]
      )
      inserted++
    }
  })

  return { deleted, inserted }
}
