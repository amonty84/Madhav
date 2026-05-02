// DeepSeek provider adapter — wraps DeepSeek's OpenAI-compatible Chat
// Completions endpoint with the Observatory shim (S1.2).
//
// Authored by USTAD_S1_7_DEEPSEEK_PROVIDER_ADAPTER (Phase O sub-phase O.1)
// per OBSERVATORY_PLAN_v1_0.md §4.4 (DeepSeek per-request capture). Reads from
// `../observability/{observe,types}` (S1.2) and never touches the
// llm_usage_events table directly — `observe()` / `observeStream()` own
// persistence.
//
// ---------------------------------------------------------------------------
// Token-extraction semantics (per S1.7 brief — pinned to OBSERVATORY_PLAN §4.4)
// ---------------------------------------------------------------------------
// DeepSeek's `usage` block fields map onto the shim's TokenUsage shape as:
//
//   prompt_tokens             → input_tokens
//   completion_tokens         → output_tokens
//   prompt_cache_hit_tokens   → cache_read_tokens   (DeepSeek bills cache hits
//                                                     at ≈10× cheaper than
//                                                     cache misses for V3 chat)
//
// `prompt_cache_miss_tokens` semantically OVERLAPS with `prompt_tokens` — it
// is the non-cached portion of the input prompt and is already accounted for
// inside `input_tokens`. Adding it to any token-count column would double-count
// the input. Per S1.7 brief, we capture it in `parameters` jsonb under the
// key `deepseek_cache_miss_tokens` for audit purposes only; it never enters
// the cache_write_tokens column or any other token count.
//
// `reasoning_tokens` are not separately reported by DeepSeek's `usage` block
// even on the R1 reasoning model as of 2026-05-03 — R1 includes reasoning
// content inside the assistant message but its token count rolls into
// `completion_tokens`. We leave reasoning_tokens=0; if a future API revision
// surfaces a discrete reasoning-token count, this adapter will pick it up
// here (search for REASONING_TOKEN_FUTURE).
//
// `cache_write_tokens` are not exposed by DeepSeek (no separate cache-creation
// price) — left at 0.
//
// ---------------------------------------------------------------------------
// Error mapping
// ---------------------------------------------------------------------------
//   400 / 401 / 403  → status=error, error_code from `.error.code` (or
//                       `.error.type`/`.error.message`/`http_<status>` fallback)
//   429              → status=error, error_code=rate_limited
//   5xx              → status=error, error_code=server_error
//   AbortError /     → status=error, error_code=timeout (status='timeout' is
//   timeout            not currently emitted by observe(); the shim collapses
//                      all thrown errors to status='error'. The error_code
//                      preserves the timeout signal for downstream queries.)
//
// `provider_request_id` is captured from the response's `x-request-id` header
// or the DeepSeek-specific `x-ds-request-id` header where present, else null.

import { observe, observeStream } from '../observability/observe'
import type {
  ObservatoryDb,
  ObservedLLMRequest,
  TokenUsage,
} from '../observability/types'

const DEFAULT_BASE_URL = 'https://api.deepseek.com'

// ---------------------------------------------------------------------------
// Public types — modeled on the DeepSeek API surface as of 2026-05-03.
// We keep these intentionally permissive (`[k: string]: unknown`) so that
// future request/response fields don't force a schema change.
// ---------------------------------------------------------------------------

export interface DeepSeekChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  [k: string]: unknown
}

export interface DeepSeekChatRequestBody {
  model: string
  messages: DeepSeekChatMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  stop?: string | string[]
  stream?: boolean
  [k: string]: unknown
}

export interface DeepSeekUsage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
  prompt_cache_hit_tokens?: number
  prompt_cache_miss_tokens?: number
  [k: string]: unknown
}

export interface DeepSeekChatChoice {
  index: number
  message: { role: string; content: string; [k: string]: unknown }
  finish_reason: string | null
}

export interface DeepSeekChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: DeepSeekChatChoice[]
  usage?: DeepSeekUsage
  [k: string]: unknown
}

export interface DeepSeekStreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: { role?: string; content?: string; [k: string]: unknown }
    finish_reason: string | null
  }>
  usage?: DeepSeekUsage
  [k: string]: unknown
}

// `observation` carries the Observatory request-context fields. The adapter
// owns `parameters`: it snapshots the request body into `parameters.request`
// and (after the response arrives) injects `deepseek_cache_miss_tokens` into
// the same object — which `persistObservation` reads by reference.
export interface DeepSeekAdapterContext {
  observation: Omit<ObservedLLMRequest, 'parameters'>
  body: DeepSeekChatRequestBody
  apiKey: string
  baseUrl?: string
  fetchImpl?: typeof fetch
  db: ObservatoryDb
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

function extractRequestId(headers: Headers): string | undefined {
  const id = headers.get('x-request-id') ?? headers.get('x-ds-request-id')
  return id ?? undefined
}

function mapHttpErrorCode(status: number, body: unknown): string {
  if (status === 429) return 'rate_limited'
  if (status >= 500) return 'server_error'
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as { error?: { code?: unknown; type?: unknown; message?: unknown } }).error
    if (err && typeof err.code === 'string' && err.code) return err.code
    if (err && typeof err.type === 'string' && err.type) return err.type
    if (err && typeof err.message === 'string' && err.message) return err.message
  }
  return `http_${status}`
}

export class DeepSeekHTTPError extends Error {
  readonly code: string
  readonly status: number
  constructor(status: number, body: unknown) {
    const code = mapHttpErrorCode(status, body)
    super(`DeepSeek API error (${status}): ${code}`)
    this.name = 'DeepSeekHTTPError'
    this.status = status
    this.code = code
  }
}

function usageToTokens(u: DeepSeekUsage | undefined): {
  tokens: TokenUsage
  cacheMissTokens: number | null
} {
  if (!u) {
    return {
      tokens: {
        input_tokens: 0,
        output_tokens: 0,
        cache_read_tokens: 0,
        cache_write_tokens: 0,
        reasoning_tokens: 0,
      },
      cacheMissTokens: null,
    }
  }
  return {
    tokens: {
      input_tokens: u.prompt_tokens ?? 0,
      output_tokens: u.completion_tokens ?? 0,
      cache_read_tokens: u.prompt_cache_hit_tokens ?? 0,
      cache_write_tokens: 0,
      reasoning_tokens: 0,
      // REASONING_TOKEN_FUTURE: DeepSeek R1 does not separately expose
      // reasoning_tokens in usage as of 2026-05-03. If they add it, map here.
    },
    cacheMissTokens:
      typeof u.prompt_cache_miss_tokens === 'number' ? u.prompt_cache_miss_tokens : null,
  }
}

function snapshotRequest(body: DeepSeekChatRequestBody): Record<string, unknown> {
  // Strip messages — prompt content is captured under prompt_text/system_prompt
  // by the caller; storing it twice would inflate parameters jsonb size and
  // duplicate redaction-policy work.
  const { messages: _m, ...rest } = body
  return { request: rest }
}

async function readErrorBody(resp: Response): Promise<unknown> {
  try {
    return await resp.json()
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Public entry: non-streaming chat completion
// ---------------------------------------------------------------------------

export async function chatCompletion(ctx: DeepSeekAdapterContext): Promise<DeepSeekChatResponse> {
  const fetchFn = ctx.fetchImpl ?? fetch
  const baseUrl = ctx.baseUrl ?? DEFAULT_BASE_URL
  const parameters = snapshotRequest(ctx.body)

  const request: ObservedLLMRequest = { ...ctx.observation, parameters }

  const { response } = await observe(
    request,
    async () => {
      const httpResp = await fetchFn(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${ctx.apiKey}`,
        },
        body: JSON.stringify({ ...ctx.body, stream: false }),
      })

      const providerRequestId = extractRequestId(httpResp.headers)

      if (!httpResp.ok) {
        throw new DeepSeekHTTPError(httpResp.status, await readErrorBody(httpResp))
      }

      const respBody = (await httpResp.json()) as DeepSeekChatResponse
      const { tokens, cacheMissTokens } = usageToTokens(respBody.usage)
      if (cacheMissTokens !== null) {
        parameters.deepseek_cache_miss_tokens = cacheMissTokens
      }
      return { response: respBody, rawUsage: tokens, providerRequestId }
    },
    ctx.db,
  )

  return response
}

// ---------------------------------------------------------------------------
// Public entry: streaming chat completion
// ---------------------------------------------------------------------------

async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<DeepSeekStreamChunk> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let nlIndex: number
    while ((nlIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nlIndex).trim()
      buffer = buffer.slice(nlIndex + 1)
      if (!line || !line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (data === '[DONE]') return
      try {
        yield JSON.parse(data) as DeepSeekStreamChunk
      } catch {
        // Skip malformed SSE lines silently — mirrors the OpenAI SDK.
      }
    }
  }
}

export async function* streamChatCompletion(
  ctx: DeepSeekAdapterContext,
): AsyncGenerator<DeepSeekStreamChunk> {
  const fetchFn = ctx.fetchImpl ?? fetch
  const baseUrl = ctx.baseUrl ?? DEFAULT_BASE_URL
  const parameters = snapshotRequest({ ...ctx.body, stream: true })

  const request: ObservedLLMRequest = { ...ctx.observation, parameters }

  async function* streamCall(): AsyncGenerator<{
    chunk: DeepSeekStreamChunk
    finalUsage?: TokenUsage
    providerRequestId?: string
  }> {
    const httpResp = await fetchFn(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${ctx.apiKey}`,
      },
      body: JSON.stringify({
        ...ctx.body,
        stream: true,
        stream_options: { include_usage: true, ...(ctx.body.stream_options as object | undefined) },
      }),
    })

    const providerRequestId = extractRequestId(httpResp.headers)

    if (!httpResp.ok) {
      throw new DeepSeekHTTPError(httpResp.status, await readErrorBody(httpResp))
    }
    if (!httpResp.body) {
      throw new Error('DeepSeek streaming response has no body')
    }

    let firstYield = true
    for await (const chunk of parseSSE(httpResp.body)) {
      const item: { chunk: DeepSeekStreamChunk; finalUsage?: TokenUsage; providerRequestId?: string } = {
        chunk,
      }
      if (firstYield) {
        item.providerRequestId = providerRequestId
        firstYield = false
      }
      if (chunk.usage) {
        const { tokens, cacheMissTokens } = usageToTokens(chunk.usage)
        item.finalUsage = tokens
        if (cacheMissTokens !== null) {
          parameters.deepseek_cache_miss_tokens = cacheMissTokens
        }
      }
      yield item
    }
  }

  yield* observeStream(request, streamCall, ctx.db)
}
