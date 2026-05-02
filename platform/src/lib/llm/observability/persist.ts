// persistObservation — apply the active redaction policy, then INSERT one row
// into llm_usage_events. NEVER throws: observability errors must not break
// the caller (the chat path keeps working even when telemetry can't write).

import { getActivePolicy } from './redaction'
import type {
  CostResult,
  ObservatoryDb,
  ObservedLLMRequest,
  ObservedLLMResponse,
  PersistedObservation,
} from './types'

const INSERT_SQL = `
  INSERT INTO llm_usage_events (
    conversation_id,
    conversation_name,
    prompt_id,
    parent_prompt_id,
    user_id,
    provider,
    model,
    pipeline_stage,
    prompt_text,
    response_text,
    system_prompt,
    parameters,
    input_tokens,
    output_tokens,
    cache_read_tokens,
    cache_write_tokens,
    reasoning_tokens,
    computed_cost_usd,
    pricing_version_id,
    latency_ms,
    status,
    error_code,
    provider_request_id,
    started_at,
    finished_at
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
    $21, $22, $23, $24, $25
  )
  RETURNING *
`

export async function persistObservation(
  req: ObservedLLMRequest,
  res: ObservedLLMResponse,
  costResult: CostResult | null,
  db: ObservatoryDb,
): Promise<PersistedObservation | null> {
  try {
    const policy = getActivePolicy()
    const { request, response } = policy(req, res)

    const latencyMs = Math.max(
      0,
      response.finished_at.getTime() - response.started_at.getTime(),
    )

    const params: unknown[] = [
      request.conversation_id,
      request.conversation_name,
      request.prompt_id,
      request.parent_prompt_id ?? null,
      request.user_id,
      request.provider,
      request.model,
      request.pipeline_stage,
      request.prompt_text,
      response.response_text,
      request.system_prompt,
      request.parameters === undefined ? null : JSON.stringify(request.parameters),
      response.usage.input_tokens,
      response.usage.output_tokens,
      response.usage.cache_read_tokens,
      response.usage.cache_write_tokens,
      response.usage.reasoning_tokens,
      costResult?.computed_cost_usd ?? null,
      costResult?.pricing_version_id ?? null,
      latencyMs,
      response.status,
      response.error_code ?? null,
      response.provider_request_id ?? null,
      response.started_at.toISOString(),
      response.finished_at.toISOString(),
    ]

    const result = await db.query<PersistedObservation>(INSERT_SQL, params)
    return result.rows[0] ?? null
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[observability] persistObservation failed:', err)
    return null
  }
}
