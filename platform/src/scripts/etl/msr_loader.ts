import type { MsrSignal } from '../../lib/db/types'
import { getStorageClient } from '../../lib/storage/index'

/**
 * Load MSR signals into the msr_signals table via UPSERT on signal_id.
 * Preserves existing rows; updates all columns including the 8 new source fields.
 *
 * @returns Object with counts of deleted and inserted rows.
 */
export async function loadMsrSignals(
  signals: MsrSignal[]
): Promise<{ deleted: number; inserted: number }> {
  const client = getStorageClient()
  const deleted = 0

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
          source_version,
          signal_type,
          temporal_activation,
          valence,
          entities_involved,
          supporting_rules,
          rpt_deep_dive,
          v6_ids_consumed,
          prior_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19::jsonb, $20::jsonb, $21, $22::jsonb, $23
        )
        ON CONFLICT (signal_id) DO UPDATE SET
          native_id           = EXCLUDED.native_id,
          domain              = EXCLUDED.domain,
          planet              = EXCLUDED.planet,
          house               = EXCLUDED.house,
          nakshatra           = EXCLUDED.nakshatra,
          dasha_lord          = EXCLUDED.dasha_lord,
          confidence          = EXCLUDED.confidence,
          significance        = EXCLUDED.significance,
          is_forward_looking  = EXCLUDED.is_forward_looking,
          claim_text          = EXCLUDED.claim_text,
          classical_basis     = EXCLUDED.classical_basis,
          falsifier           = EXCLUDED.falsifier,
          source_file         = EXCLUDED.source_file,
          source_version      = EXCLUDED.source_version,
          signal_type         = EXCLUDED.signal_type,
          temporal_activation = EXCLUDED.temporal_activation,
          valence             = EXCLUDED.valence,
          entities_involved   = EXCLUDED.entities_involved,
          supporting_rules    = EXCLUDED.supporting_rules,
          rpt_deep_dive       = EXCLUDED.rpt_deep_dive,
          v6_ids_consumed     = EXCLUDED.v6_ids_consumed,
          prior_id            = EXCLUDED.prior_id,
          ingested_at         = NOW()`,
        [
          signal.signal_id,
          signal.native_id,
          signal.domain,
          signal.planet ?? null,
          signal.house ?? null,
          signal.nakshatra ?? null,
          signal.dasha_lord ?? null,
          signal.confidence,
          signal.significance,
          signal.is_forward_looking,
          signal.claim_text,
          signal.classical_basis ?? null,
          signal.falsifier ?? null,
          signal.source_file,
          signal.source_version,
          signal.signal_type ?? null,
          signal.temporal_activation ?? null,
          signal.valence ?? null,
          signal.entities_involved !== undefined && signal.entities_involved !== null
            ? JSON.stringify(signal.entities_involved)
            : null,
          signal.supporting_rules !== undefined && signal.supporting_rules !== null
            ? JSON.stringify(signal.supporting_rules)
            : null,
          signal.rpt_deep_dive ?? null,
          signal.v6_ids_consumed !== undefined && signal.v6_ids_consumed !== null
            ? JSON.stringify(signal.v6_ids_consumed)
            : null,
          signal.prior_id ?? null,
        ]
      )
      inserted++
    }
  })

  return { deleted, inserted }
}
