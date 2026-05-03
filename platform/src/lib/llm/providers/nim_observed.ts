// NVIDIA NIM observed provider adapter (Phase O sub-phase O.1, S1.8).
//
// Wraps NVIDIA's NIM-hosted managed-catalog Chat Completions endpoint
// (https://integrate.api.nvidia.com/v1) — an OpenAI-compatible surface — so
// every call routes through the observability shim under
// platform/src/lib/llm/observability/. Adapters never touch llm_usage_events
// directly; all persistence is funneled via observe() / observeStream().
//
// In-scope models (v1, NGC-hosted managed catalog only):
//   - meta/llama-3.1-405b-instruct
//   - meta/llama-3.3-70b-instruct
//   - meta/llama-3.1-8b-instruct
//   - deepseek-ai/deepseek-r1                 (via NIM hosting)
//   - nvidia/llama-3.3-nemotron-super-49b-v1  (in-use — registry.ts L419)
//   - nvidia/nemotron-3-super-120b-a12b       (in-use — registry.ts L438)
//   - nvidia/llama-3.1-nemotron-ultra-253b-v1 (registered; HTTP 404 free tier)
//   - deepseek-ai/deepseek-v4-pro             (registered; via NIM hosting)
//   - qwen/qwen3-235b-a22b                    (registered; HTTP 410 EOL)
// The model id is recorded verbatim per OBSERVATORY_PLAN §4.5; new model rows
// in llm_pricing_versions track each id.
//
// Self-hosted NIM (GPU-utilization-derived cost) is OUT OF SCOPE for v1 per
// OBSERVATORY_PLAN §4.5 + §10 open-decision 7 — explicitly deferred to v2.
//
// Token extraction (OpenAI-compatible usage block):
//   prompt_tokens     -> input_tokens
//   completion_tokens -> output_tokens
//   cache_read_tokens, cache_write_tokens, reasoning_tokens left at 0:
//     NIM-hosted models in scope do not currently expose cache tokens or
//     reasoning tokens in the usage envelope. If a specific model ever does
//     surface them (e.g., a future deepseek-r1 build that returns
//     `reasoning_tokens` like the o-series), the extractor below picks them up
//     opportunistically — see extractUsage().
//
// provider_request_id: x-request-id response header preferred; client-side
// UUID fallback when absent.
//
// Streaming: NIM requires `stream: true` to be set explicitly even on the
// managed catalog. The streaming entry point always sets it. Final usage
// arrives in the last SSE chunk's `usage` block (OpenAI-compatible).

import { randomUUID } from 'node:crypto'

import { observe, observeStream } from '../observability/observe'
import type {
  ObservatoryDb,
  ObservedLLMRequest,
  TokenUsage,
} from '../observability/types'
import { ZERO_USAGE } from '../observability/types'

const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1'

export interface NimMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  name?: string
  tool_call_id?: string
}

export interface NimRequestParams {
  model: string
  messages: NimMessage[]
  temperature?: number
  top_p?: number
  max_tokens?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string | string[]
}

interface NimUsageBlock {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
  // Opportunistic — present if a specific NIM-hosted model returns them.
  cache_read_input_tokens?: number
  cache_creation_input_tokens?: number
  reasoning_tokens?: number
}

interface NimChoiceMessage {
  role: 'assistant'
  content: string | null
}

interface NimNonStreamResponse {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: Array<{
    index: number
    message: NimChoiceMessage
    finish_reason: string | null
  }>
  usage?: NimUsageBlock
}

interface NimStreamDelta {
  role?: 'assistant'
  content?: string
}

interface NimStreamChoice {
  index: number
  delta: NimStreamDelta
  finish_reason: string | null
}

interface NimStreamChunk {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: NimStreamChoice[]
  usage?: NimUsageBlock
}

export interface NimErrorPayload {
  error?: {
    code?: string
    message?: string
    type?: string
  }
}

export interface NimObservedFetch {
  (url: string, init: RequestInit): Promise<Response>
}

export interface NimObservedClientOptions {
  apiKey?: string
  baseUrl?: string
  fetchImpl?: NimObservedFetch
  generateRequestId?: () => string
}

export class NimObservedError extends Error {
  status: number
  // `code` (not `errorCode`) — observe()'s extractErrorCode reads `err.code`
  // first, so this is the field the persisted error_code column ultimately
  // mirrors when a NIM call throws inside a wrapped providerCall.
  code: string
  payload: unknown

  constructor(status: number, errorCode: string, message: string, payload: unknown) {
    super(message)
    this.name = 'NimObservedError'
    this.status = status
    this.code = errorCode
    this.payload = payload
  }
}

export interface NimChatCompletionResult {
  text: string
  raw: NimNonStreamResponse
  usage: TokenUsage
  providerRequestId: string
}

function classifyHttpError(status: number): string {
  if (status === 429) return 'rate_limited'
  if (status >= 500) return 'server_error'
  return 'http_error'
}

function pickErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const err = (payload as NimErrorPayload).error
    if (err && typeof err.message === 'string' && err.message.length > 0) {
      return err.message
    }
  }
  return `NIM HTTP ${status}`
}

function pickErrorCode(status: number, payload: unknown): string {
  if (status === 429) return 'rate_limited'
  if (status >= 500) return 'server_error'
  if (payload && typeof payload === 'object') {
    const err = (payload as NimErrorPayload).error
    if (err) {
      if (typeof err.code === 'string' && err.code.length > 0) return err.code
      if (typeof err.message === 'string' && err.message.length > 0) return err.message
    }
  }
  if (status >= 400 && status < 500) return classifyHttpError(status)
  return classifyHttpError(status)
}

function extractUsage(usage: NimUsageBlock | undefined): TokenUsage {
  if (!usage) return { ...ZERO_USAGE }
  return {
    input_tokens: typeof usage.prompt_tokens === 'number' ? usage.prompt_tokens : 0,
    output_tokens:
      typeof usage.completion_tokens === 'number' ? usage.completion_tokens : 0,
    cache_read_tokens:
      typeof usage.cache_read_input_tokens === 'number'
        ? usage.cache_read_input_tokens
        : 0,
    cache_write_tokens:
      typeof usage.cache_creation_input_tokens === 'number'
        ? usage.cache_creation_input_tokens
        : 0,
    reasoning_tokens:
      typeof usage.reasoning_tokens === 'number' ? usage.reasoning_tokens : 0,
  }
}

function pickProviderRequestId(
  res: Response,
  fallbackGen: () => string,
): string {
  const header = res.headers.get('x-request-id')
  if (header && header.length > 0) return header
  return fallbackGen()
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return null
  }
}

function makeRequestInit(
  apiKey: string,
  body: unknown,
  signal?: AbortSignal,
): RequestInit {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
      accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  }
}

export class NimObservedClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly fetchImpl: NimObservedFetch
  private readonly generateRequestId: () => string

  constructor(opts: NimObservedClientOptions = {}) {
    this.apiKey = opts.apiKey ?? process.env.NVIDIA_NIM_API_KEY ?? ''
    this.baseUrl = (opts.baseUrl ?? NIM_BASE_URL).replace(/\/+$/, '')
    this.fetchImpl =
      opts.fetchImpl ??
      ((url, init) => fetch(url, init) as Promise<Response>)
    this.generateRequestId = opts.generateRequestId ?? randomUUID
  }

  /**
   * Non-streaming chat completion through observe(). Persists exactly one
   * llm_usage_events row regardless of success/error path.
   */
  async chatCompletion(
    request: ObservedLLMRequest,
    params: NimRequestParams,
    db: ObservatoryDb,
    signal?: AbortSignal,
  ): Promise<NimChatCompletionResult> {
    const url = `${this.baseUrl}/chat/completions`
    const body = { ...params, stream: false }
    const fallbackGen = this.generateRequestId

    const { response } = await observe(
      request,
      async () => {
        const httpRes = await this.fetchImpl(
          url,
          makeRequestInit(this.apiKey, body, signal),
        )
        const providerRequestId = pickProviderRequestId(httpRes, fallbackGen)

        if (!httpRes.ok) {
          const payload = await readJson(httpRes)
          const errCode = pickErrorCode(httpRes.status, payload)
          const msg = pickErrorMessage(payload, httpRes.status)
          throw new NimObservedError(httpRes.status, errCode, msg, payload)
        }

        const json = (await httpRes.json()) as NimNonStreamResponse
        const usage = extractUsage(json.usage)
        const text = json.choices[0]?.message?.content ?? ''
        const result: NimChatCompletionResult = {
          text,
          raw: json,
          usage,
          providerRequestId,
        }

        return {
          response: result,
          rawUsage: usage,
          providerRequestId,
        }
      },
      db,
    )

    return response
  }

  /**
   * Streaming chat completion through observeStream(). The OpenAI-compatible
   * SSE stream's final chunk carries a `usage` block; we accumulate that for
   * the single end-of-stream persist. `stream: true` is always set, even when
   * the caller forgets — required by some NIM-hosted models per the docs.
   */
  async *chatCompletionStream(
    request: ObservedLLMRequest,
    params: NimRequestParams,
    db: ObservatoryDb,
    signal?: AbortSignal,
  ): AsyncGenerator<string> {
    const url = `${this.baseUrl}/chat/completions`
    const body = { ...params, stream: true as const }
    const apiKey = this.apiKey
    const fetchImpl = this.fetchImpl
    const fallbackGen = this.generateRequestId

    async function* rawStream(): AsyncIterable<{
      chunk: string
      finalUsage?: TokenUsage
      providerRequestId?: string
    }> {
      const httpRes = await fetchImpl(url, makeRequestInit(apiKey, body, signal))
      const providerRequestId = pickProviderRequestId(httpRes, fallbackGen)

      if (!httpRes.ok) {
        const payload = await readJson(httpRes)
        const errCode = pickErrorCode(httpRes.status, payload)
        const msg = pickErrorMessage(payload, httpRes.status)
        throw new NimObservedError(httpRes.status, errCode, msg, payload)
      }

      const reader = httpRes.body?.getReader()
      if (!reader) {
        // Stream attempted but body unreadable — emit no chunks; observation
        // will record zero-usage success (no tokens flowed).
        return
      }

      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      let firstYield = true
      let finalUsage: TokenUsage | undefined

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // SSE framing: events delimited by blank lines; each event has one
        // or more `data: ...` lines. The last event for OpenAI-compatible
        // streams is `data: [DONE]`.
        let sep: number
        while ((sep = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, sep)
          buffer = buffer.slice(sep + 2)

          for (const line of event.split('\n')) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') continue

            let parsed: NimStreamChunk
            try {
              parsed = JSON.parse(data) as NimStreamChunk
            } catch {
              continue
            }

            if (parsed.usage) {
              finalUsage = extractUsage(parsed.usage)
            }

            const delta = parsed.choices?.[0]?.delta?.content
            if (typeof delta === 'string' && delta.length > 0) {
              if (firstYield) {
                yield {
                  chunk: delta,
                  providerRequestId,
                }
                firstYield = false
              } else {
                yield { chunk: delta }
              }
            }
          }
        }
      }

      // Emit a terminal sentinel carrying finalUsage (and the providerRequestId
      // if the body was empty — observeStream prefers the last set value).
      yield {
        chunk: '',
        finalUsage: finalUsage ?? { ...ZERO_USAGE },
        providerRequestId,
      }
    }

    for await (const piece of observeStream(request, rawStream, db)) {
      if (piece.length > 0) yield piece
    }
  }
}

export const __testables = {
  extractUsage,
  pickErrorCode,
  pickProviderRequestId,
}
