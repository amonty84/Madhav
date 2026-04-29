/**
 * MARSYS-JIS Phase 4 Stream A — Audit log shared types
 * audit_event_version: 1 (Phase 6 introduces version 2 with checkpoint payloads)
 */

export interface ToolCallRecord {
  tool: string
  params_hash: string
  latency_ms: number
  cached: boolean
}

export interface ValidatorRecord {
  validator_id: string
  passed: boolean
  message: string
}

/** Input shape for writeAuditLog — mirrors the audit_log DB columns. */
export interface AuditEvent {
  query_id: string
  query_text: string
  query_class: string
  bundle_keys: string[]
  tools_called: ToolCallRecord[]
  validators_run: ValidatorRecord[]
  synthesis_model: string
  synthesis_input_tokens: number
  synthesis_output_tokens: number
  disclosure_tier: string
  final_output: string
  audit_event_version?: number
}

/** Full DB row shape returned by reads. */
export interface AuditLogRow extends Required<AuditEvent> {
  id: string
  created_at: string
}
