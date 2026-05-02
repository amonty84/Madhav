// Gemini provider adapter — wraps a Gemini-shaped LLM call (generateContent
// or generateContentStream) with the observability shim authored at S1.2.
//
// Authored by USTAD_S1_6_GEMINI_PROVIDER_ADAPTER (Phase O sub-phase O.1) per
// OBSERVATORY_PLAN_v1_0.md §4.3 (Gemini provider matrix). Sibling of the
// other four provider adapters (S1.4 Anthropic, S1.5 OpenAI, S1.7 DeepSeek,
// S1.8 NIM); all five touch disjoint files under llm/providers/.
//
// Token-field mapping (per §4.3 + the brief):
//   promptTokenCount        → input_tokens
//   candidatesTokenCount    → output_tokens
//   thoughtsTokenCount      → reasoning_tokens   (Gemini 2.5 thinking models)
//   cachedContentTokenCount → cache_read_tokens
//   (cache_write_tokens stays 0 — Gemini does not separately report writes)
//
// provider_request_id LIMITATION:
//   Gemini does not return a stable per-request id in the response body. To
//   preserve the schema column's usefulness, this adapter generates a
//   client-side UUID at call start and stores it in provider_request_id. If
//   the underlying SDK surface forwards an `x-goog-request-id` response
//   header, the adapter appends it after a ":" separator (so the column
//   carries "<uuid>:<x-goog-request-id>"). Reconciliation against the BigQuery
//   billing export (S2.4) does not depend on this id — Gemini reconciliation
//   joins on (provider, model, time_bucket) per §4.3.
//
// Free-tier note (per §4.3): free-tier API keys may emit usageMetadata with
// all-zero token counts; computeCost will then yield 0.00 USD. That is the
// correct outcome — observe() persists the row and the reconciler treats
// zero-cost telemetry rows as not requiring a matching billing row.

import { randomUUID } from 'node:crypto'

import { observe, observeStream } from '../observability'
import type {
  ObservatoryDb,
  ObservedLLMRequest,
  PersistedObservation,
  TokenUsage,
} from '../observability'
import { ZERO_USAGE } from '../observability'

// --------------------------------------------------------------------------
// Gemini-shaped types — shape we expect from a Gemini SDK call. Kept narrow
// enough to be SDK-agnostic (works with @google/genai, @google/generative-ai,
// or any thin fetch wrapper that surfaces the documented usageMetadata block).
// --------------------------------------------------------------------------

export interface GeminiUsageMetadata {
  promptTokenCount?: number
  candidatesTokenCount?: number
  thoughtsTokenCount?: number
  cachedContentTokenCount?: number
  totalTokenCount?: number
}

export interface GeminiResponseEnvelope<T = unknown> {
  /** The provider-shaped response body (left opaque to the adapter). */
  response: T
  /** Usage block emitted on the final response (or final stream chunk). */
  usageMetadata?: GeminiUsageMetadata
  /** Optional response headers — looked up for x-goog-request-id. */
  responseHeaders?: Record<string, string | string[] | undefined>
}

export interface GeminiStreamChunk<T = unknown> {
  /** Per-chunk payload (delta). */
  chunk: T
  /** Present on the final chunk only — cumulative usage. */
  usageMetadata?: GeminiUsageMetadata
  /** Headers from the initial response, if surfaced on a chunk. */
  responseHeaders?: Record<string, string | string[] | undefined>
}

// --------------------------------------------------------------------------
// Error mapping helper — translates a Gemini API error into the (status,
// error_code) pair recorded on the telemetry row. observe() handles the
// status=error path generically; this helper exists so callers that own
// their own try/catch (e.g., custom retry shells) can normalize codes the
// same way.
// --------------------------------------------------------------------------

export interface GeminiErrorLike {
  status?: number
  message?: string
  code?: string
  error?: { status?: string; message?: string; code?: number }
}

export function mapGeminiErrorCode(err: unknown): string {
  if (!err || typeof err !== 'object') return 'unknown_error'
  const e = err as GeminiErrorLike
  const httpStatus =
    typeof e.status === 'number'
      ? e.status
      : typeof e.error?.code === 'number'
        ? e.error.code
        : undefined

  if (httpStatus === 429) return 'rate_limited'
  if (httpStatus !== undefined && httpStatus >= 500 && httpStatus < 600) {
    return 'server_error'
  }
  if (httpStatus !== undefined && httpStatus >= 400 && httpStatus < 500) {
    if (typeof e.error?.status === 'string' && e.error.status.length > 0) {
      return e.error.status
    }
    if (typeof e.code === 'string' && e.code.length > 0) return e.code
    if (typeof e.message === 'string' && e.message.length > 0) return e.message
    return `http_${httpStatus}`
  }

  if (e.message === 'timeout' || e.code === 'ETIMEDOUT' || e.code === 'timeout') {
    return 'timeout'
  }
  if (typeof e.code === 'string' && e.code.length > 0) return e.code
  if (typeof e.message === 'string' && e.message.length > 0) return e.message
  return 'unknown_error'
}

// --------------------------------------------------------------------------
// Token extraction
// --------------------------------------------------------------------------

export function extractGeminiUsage(meta?: GeminiUsageMetadata): TokenUsage {
  if (!meta) return { ...ZERO_USAGE }
  return {
    input_tokens: meta.promptTokenCount ?? 0,
    output_tokens: meta.candidatesTokenCount ?? 0,
    cache_read_tokens: meta.cachedContentTokenCount ?? 0,
    cache_write_tokens: 0,
    reasoning_tokens: meta.thoughtsTokenCount ?? 0,
  }
}

// --------------------------------------------------------------------------
// provider_request_id construction
// --------------------------------------------------------------------------

function pickHeader(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string,
): string | undefined {
  if (!headers) return undefined
  const target = name.toLowerCase()
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() !== target) continue
    if (v === undefined) return undefined
    return Array.isArray(v) ? v[0] : v
  }
  return undefined
}

export function buildProviderRequestId(
  clientUuid: string,
  headers?: Record<string, string | string[] | undefined>,
): string {
  const goog = pickHeader(headers, 'x-goog-request-id')
  return goog && goog.length > 0 ? `${clientUuid}:${goog}` : clientUuid
}

// --------------------------------------------------------------------------
// Public entry points
// --------------------------------------------------------------------------

/**
 * Wrap a Gemini generateContent call. The caller passes a thunk that performs
 * the SDK call and returns a GeminiResponseEnvelope. observe() handles
 * persistence + cost computation + error path.
 */
export async function callGeminiObserved<T>(
  request: ObservedLLMRequest,
  geminiCall: () => Promise<GeminiResponseEnvelope<T>>,
  db: ObservatoryDb,
): Promise<{ response: T; observation: PersistedObservation | null }> {
  const clientUuid = randomUUID()

  return observe<T>(
    request,
    async () => {
      try {
        const envelope = await geminiCall()
        return {
          response: envelope.response,
          rawUsage: extractGeminiUsage(envelope.usageMetadata),
          providerRequestId: buildProviderRequestId(
            clientUuid,
            envelope.responseHeaders,
          ),
        }
      } catch (err) {
        // Tag the error with the Gemini-mapped code so observe()'s generic
        // extractErrorCode persists "rate_limited" / "server_error" / etc.,
        // not the raw .name. Mutate to preserve the original stack trace.
        annotateGeminiError(err)
        throw err
      }
    },
    db,
  )
}

function annotateGeminiError(err: unknown): void {
  if (!err || typeof err !== 'object') return
  const e = err as { code?: unknown }
  // Only set when no string code is already present — never overwrite a
  // caller-supplied code value.
  if (typeof e.code !== 'string' || e.code.length === 0) {
    e.code = mapGeminiErrorCode(err)
  }
}

/**
 * Wrap a Gemini generateContentStream call. The caller passes an async
 * generator that yields GeminiStreamChunk items; the final chunk MUST carry
 * usageMetadata (Gemini's documented streaming behavior — final chunk holds
 * cumulative counts).
 */
export async function* streamGeminiObserved<T>(
  request: ObservedLLMRequest,
  geminiStream: () => AsyncIterable<GeminiStreamChunk<T>>,
  db: ObservatoryDb,
): AsyncGenerator<T> {
  const clientUuid = randomUUID()
  let isFirst = true

  yield* observeStream<T>(
    request,
    async function* () {
      try {
        for await (const item of geminiStream()) {
          const finalUsage = item.usageMetadata
            ? extractGeminiUsage(item.usageMetadata)
            : undefined

          // Always emit a providerRequestId on the first chunk so the
          // client-side UUID is recorded even when no header is observed.
          // Any later chunk carrying x-goog-request-id overwrites with the
          // composed "<uuid>:<x-goog-id>" form (observeStream takes the
          // latest non-undefined value).
          const headers = item.responseHeaders
          const providerRequestId =
            isFirst || headers !== undefined
              ? buildProviderRequestId(clientUuid, headers)
              : undefined
          isFirst = false

          yield {
            chunk: item.chunk,
            finalUsage,
            providerRequestId,
          }
        }
      } catch (err) {
        annotateGeminiError(err)
        throw err
      }
    },
    db,
  )
}
