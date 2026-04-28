import 'server-only'

import { query } from '@/lib/db/client'
import { telemetry } from '@/lib/telemetry/index'
import type { AuditEvent } from './types'

/**
 * Write one audit log row. Idempotent on query_id — re-writing the same
 * query_id overwrites the existing row. Never throws: a DB failure is
 * logged to telemetry but must not crash the user's response path.
 */
export async function writeAuditLog(event: AuditEvent): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_log (
        query_id, query_text, query_class, bundle_keys, tools_called,
        validators_run, synthesis_model, synthesis_input_tokens,
        synthesis_output_tokens, disclosure_tier, final_output,
        audit_event_version
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT ON CONSTRAINT uq_audit_log_query_id DO UPDATE SET
        query_text              = EXCLUDED.query_text,
        query_class             = EXCLUDED.query_class,
        bundle_keys             = EXCLUDED.bundle_keys,
        tools_called            = EXCLUDED.tools_called,
        validators_run          = EXCLUDED.validators_run,
        synthesis_model         = EXCLUDED.synthesis_model,
        synthesis_input_tokens  = EXCLUDED.synthesis_input_tokens,
        synthesis_output_tokens = EXCLUDED.synthesis_output_tokens,
        disclosure_tier         = EXCLUDED.disclosure_tier,
        final_output            = EXCLUDED.final_output,
        audit_event_version     = EXCLUDED.audit_event_version`,
      [
        event.query_id,
        event.query_text,
        event.query_class,
        JSON.stringify(event.bundle_keys),
        JSON.stringify(event.tools_called),
        JSON.stringify(event.validators_run),
        event.synthesis_model,
        event.synthesis_input_tokens,
        event.synthesis_output_tokens,
        event.disclosure_tier,
        event.final_output,
        event.audit_event_version ?? 1,
      ]
    )
  } catch (err) {
    telemetry.recordError(
      'audit',
      'write_failed',
      err instanceof Error ? err : new Error(String(err))
    )
  }
}
