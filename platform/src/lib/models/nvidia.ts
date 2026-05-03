import 'server-only'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'

/**
 * NVIDIA NIM provider — OpenAI-compatible endpoint.
 * Models: Nemotron Ultra 253B, Qwen3-235B-A22B, Llama-3.1-8B, DeepSeek V4 Pro.
 * API key: NVIDIA_NIM_API_KEY env variable (required when NIM stack is active).
 * Free tier available at https://integrate.api.nvidia.com/v1 (rate-limited).
 *
 * TIMEOUT GUARD
 * NIM's free tier is queue-based: a request may sit in queue for an extended
 * period before the endpoint sends back any HTTP headers at all. Without a
 * hard timeout the AI SDK's default fetch waits indefinitely, then retries
 * up to 3 times (AI_RetryError after 3 × headers-timeout ≈ 5+ minutes of
 * silence on a busy queue or a model ID that doesn't exist).
 *
 * We pass a custom fetch wrapper that aborts after NIM_HEADERS_TIMEOUT_MS
 * with no HTTP response headers. Combined with maxRetries: 0 on synthesis
 * streamText calls and planner generateText calls this caps the hang at
 * ~90 s → fast error → user can retry or switch stacks rather than waiting
 * indefinitely. 90 s chosen to accommodate NIM queue waits (worst observed:
 * ~46 s end-to-end under load; original 30 s limit fired too early).
 */
const NVIDIA_NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1'

/**
 * Abort if NIM doesn't send HTTP headers within this window.
 *
 * Why 90s: NIM free-tier is queue-based. Under load the endpoint can take
 * 30–60s before sending *any* HTTP headers (the request sits in queue before
 * a GPU slot opens). The original 30s limit caused AbortError → AI SDK retry
 * → the queued-then-aborted request returned 500 on retry → PlannerError.
 * 90s gives generous headroom for cold-start queue waits observed in testing
 * (worst measured: ~46s end-to-end under load). Once headers arrive, the
 * response body streams at full GPU throughput and is not affected by this
 * deadline.
 */
const NIM_HEADERS_TIMEOUT_MS = 90_000

/**
 * Wrap the platform fetch so every NIM request races against a hard deadline.
 * If the caller's init already carries a signal (AI SDK retry/abort), we
 * race both signals so whichever fires first wins.
 */
function nimFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // NIM_DEBUG_BODY=1: log the first 3000 chars of the request body to stderr.
  // Used to diff AI SDK wire format against raw-fetch probes. Remove once
  // Lever 2 is unblocked.
  if (process.env.NIM_DEBUG_BODY && init?.body) {
    const body = init.body
    const snippet = typeof body === 'string' ? body.slice(0, 3000) : '(non-string body)'
    process.stderr.write(`[nim-debug] → ${snippet}\n`)
  }

  const timeoutSignal = AbortSignal.timeout(NIM_HEADERS_TIMEOUT_MS)
  const signal =
    init?.signal
      ? (AbortSignal as unknown as { any: (signals: AbortSignal[]) => AbortSignal }).any
        ? (AbortSignal as unknown as { any: (signals: AbortSignal[]) => AbortSignal }).any([
            init.signal as AbortSignal,
            timeoutSignal,
          ])
        : timeoutSignal           // Node < 20: fall back to timeout-only
      : timeoutSignal
  return fetch(url, { ...init, signal })
}

let _client: ReturnType<typeof createOpenAI> | null = null

function getClient(): ReturnType<typeof createOpenAI> {
  if (!_client) {
    _client = createOpenAI({
      baseURL: NVIDIA_NIM_BASE_URL,
      apiKey: process.env.NVIDIA_NIM_API_KEY ?? '',
      fetch: nimFetch,
    })
  }
  return _client
}

export function getNvidiaModel(modelId: string): LanguageModel {
  return getClient().chat(modelId) as LanguageModel
}
