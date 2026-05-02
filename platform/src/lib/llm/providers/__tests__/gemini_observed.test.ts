// Tests — Gemini provider adapter (USTAD_S1_6).
// Eight cases per the brief acceptance list:
//   1. Standard generateContent call — correct field mapping
//   2. usageMetadata extraction — all 4 token types
//   3. thoughtsTokenCount > 0 (Gemini 2.5 thinking path)
//   4. Streaming — usage accumulated from final chunk
//   5. Free-tier zero-cost call — persists with computed_cost_usd=0, not an error
//   6. provider_request_id generated as UUID; header value appended when present
//   7. Error: 429 → rate_limited
//   8. Error: 500 → server_error

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  buildProviderRequestId,
  callGeminiObserved,
  extractGeminiUsage,
  mapGeminiErrorCode,
  streamGeminiObserved,
  type GeminiResponseEnvelope,
  type GeminiStreamChunk,
} from '../gemini_observed'
import type { ObservatoryDb, ObservedLLMRequest } from '../../observability'

// --------------------------------------------------------------------------
// Mock DB — captures INSERT params; serves a pricing row set so computeCost
// can resolve. For the free-tier case we override the price rows to zero.
// --------------------------------------------------------------------------

interface CapturedInsert {
  params: unknown[]
}

function makeDb(opts: { freeTier?: boolean } = {}): {
  db: ObservatoryDb
  inserts: CapturedInsert[]
} {
  const inserts: CapturedInsert[] = []
  const inputPrice = opts.freeTier ? 0 : 1.25
  const outputPrice = opts.freeTier ? 0 : 5.0
  const cacheReadPrice = opts.freeTier ? 0 : 0.3125
  const reasoningPrice = opts.freeTier ? 0 : 5.0

  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    if (sql.includes('llm_pricing_versions')) {
      return {
        rows: [
          {
            pricing_version_id: 'pv-gem-input',
            token_class: 'input',
            price_per_million_usd: inputPrice,
          },
          {
            pricing_version_id: 'pv-gem-output',
            token_class: 'output',
            price_per_million_usd: outputPrice,
          },
          {
            pricing_version_id: 'pv-gem-cache-read',
            token_class: 'cache_read',
            price_per_million_usd: cacheReadPrice,
          },
          {
            pricing_version_id: 'pv-gem-reasoning',
            token_class: 'reasoning',
            price_per_million_usd: reasoningPrice,
          },
        ],
        rowCount: 4,
      }
    }
    if (sql.includes('INSERT INTO llm_usage_events')) {
      inserts.push({ params: params ?? [] })
      return {
        rows: [{ event_id: `evt-${inserts.length}`, params }],
        rowCount: 1,
      }
    }
    return { rows: [], rowCount: 0 }
  })

  return { db: { query } as unknown as ObservatoryDb, inserts }
}

// Param-index map mirrors the INSERT column order in observability/persist.ts.
// Keep in sync if persist.ts schema changes.
const COL = {
  provider: 5,
  model: 6,
  pipeline_stage: 7,
  input_tokens: 12,
  output_tokens: 13,
  cache_read_tokens: 14,
  cache_write_tokens: 15,
  reasoning_tokens: 16,
  computed_cost_usd: 17,
  pricing_version_id: 18,
  status: 20,
  error_code: 21,
  provider_request_id: 22,
} as const

const baseRequest: ObservedLLMRequest = {
  provider: 'gemini',
  model: 'gemini-2.5-pro',
  prompt_text: 'Explain Bayesian inference briefly.',
  system_prompt: null,
  parameters: { temperature: 0.7 },
  conversation_id: 'conv-gem-1',
  conversation_name: 'Gemini test',
  prompt_id: 'prompt-gem-1',
  user_id: 'user-1',
  pipeline_stage: 'synthesize',
}

// Quiet [observability] error logs from the error-path tests.
let consoleErrorSpy: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  consoleErrorSpy.mockRestore()
})

// --------------------------------------------------------------------------
// 1. Standard generateContent — correct field mapping
// --------------------------------------------------------------------------

describe('callGeminiObserved — standard generateContent', () => {
  it('maps Gemini envelope to telemetry row with correct provider/model/usage fields', async () => {
    const { db, inserts } = makeDb()
    const envelope: GeminiResponseEnvelope<{ text: string }> = {
      response: { text: 'Bayesian inference updates priors with evidence.' },
      usageMetadata: {
        promptTokenCount: 12,
        candidatesTokenCount: 18,
        totalTokenCount: 30,
      },
    }

    const result = await callGeminiObserved(
      baseRequest,
      async () => envelope,
      db,
    )

    expect(result.response).toBe(envelope.response)
    expect(inserts).toHaveLength(1)
    const p = inserts[0].params
    expect(p[COL.provider]).toBe('gemini')
    expect(p[COL.model]).toBe('gemini-2.5-pro')
    expect(p[COL.pipeline_stage]).toBe('synthesize')
    expect(p[COL.input_tokens]).toBe(12)
    expect(p[COL.output_tokens]).toBe(18)
    expect(p[COL.cache_read_tokens]).toBe(0)
    expect(p[COL.cache_write_tokens]).toBe(0)
    expect(p[COL.reasoning_tokens]).toBe(0)
    expect(p[COL.status]).toBe('success')
  })
})

// --------------------------------------------------------------------------
// 2. usageMetadata extraction — all four token types
// --------------------------------------------------------------------------

describe('extractGeminiUsage — all four token types', () => {
  it('maps every documented Gemini usageMetadata field to TokenUsage', () => {
    const usage = extractGeminiUsage({
      promptTokenCount: 100,
      candidatesTokenCount: 200,
      thoughtsTokenCount: 50,
      cachedContentTokenCount: 80,
      totalTokenCount: 430,
    })
    expect(usage).toEqual({
      input_tokens: 100,
      output_tokens: 200,
      cache_read_tokens: 80,
      cache_write_tokens: 0,
      reasoning_tokens: 50,
    })
  })

  it('returns zero-usage when usageMetadata is absent', () => {
    const usage = extractGeminiUsage(undefined)
    expect(usage).toEqual({
      input_tokens: 0,
      output_tokens: 0,
      cache_read_tokens: 0,
      cache_write_tokens: 0,
      reasoning_tokens: 0,
    })
  })
})

// --------------------------------------------------------------------------
// 3. thoughtsTokenCount > 0 (Gemini 2.5 thinking path)
// --------------------------------------------------------------------------

describe('callGeminiObserved — Gemini 2.5 thinking path', () => {
  it('persists thoughtsTokenCount as reasoning_tokens and includes it in cost', async () => {
    const { db, inserts } = makeDb()
    const envelope: GeminiResponseEnvelope<{ text: string }> = {
      response: { text: 'Step-by-step reasoning followed by answer.' },
      usageMetadata: {
        promptTokenCount: 100_000,
        candidatesTokenCount: 50_000,
        thoughtsTokenCount: 25_000,
        totalTokenCount: 175_000,
      },
    }

    await callGeminiObserved(baseRequest, async () => envelope, db)

    const p = inserts[0].params
    expect(p[COL.input_tokens]).toBe(100_000)
    expect(p[COL.output_tokens]).toBe(50_000)
    expect(p[COL.reasoning_tokens]).toBe(25_000)
    // 0.1*1.25 (input) + 0.05*5 (output) + 0.025*5 (reasoning)
    //   = 0.125 + 0.25 + 0.125 = 0.50
    expect(p[COL.computed_cost_usd]).toBeCloseTo(0.5, 6)
  })
})

// --------------------------------------------------------------------------
// 4. Streaming — usage accumulated from final chunk
// --------------------------------------------------------------------------

describe('streamGeminiObserved — usage from final chunk', () => {
  it('yields all chunks; persists once with usage from the final chunk', async () => {
    const { db, inserts } = makeDb()
    const chunks = ['Bayes', "' ", 'rule', ' updates', ' priors.']

    async function* gen(): AsyncIterable<GeminiStreamChunk<string>> {
      for (let i = 0; i < chunks.length; i++) {
        if (i === chunks.length - 1) {
          yield {
            chunk: chunks[i],
            usageMetadata: {
              promptTokenCount: 14,
              candidatesTokenCount: 22,
              totalTokenCount: 36,
            },
          }
        } else {
          yield { chunk: chunks[i] }
        }
      }
    }

    const collected: string[] = []
    for await (const c of streamGeminiObserved(baseRequest, gen, db)) {
      collected.push(c)
    }
    expect(collected).toEqual(chunks)
    expect(inserts).toHaveLength(1)
    const p = inserts[0].params
    expect(p[COL.input_tokens]).toBe(14)
    expect(p[COL.output_tokens]).toBe(22)
    expect(p[COL.status]).toBe('success')
  })
})

// --------------------------------------------------------------------------
// 5. Free-tier zero-cost call — persists with computed_cost_usd=0, not an error
// --------------------------------------------------------------------------

describe('callGeminiObserved — free-tier zero-cost path', () => {
  it('persists row with computed_cost_usd=0 when pricing rows are zero (free tier)', async () => {
    const { db, inserts } = makeDb({ freeTier: true })
    const envelope: GeminiResponseEnvelope<{ text: string }> = {
      response: { text: 'free-tier reply' },
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 15,
        totalTokenCount: 25,
      },
    }

    const result = await callGeminiObserved(
      baseRequest,
      async () => envelope,
      db,
    )

    expect(result.response).toEqual({ text: 'free-tier reply' })
    expect(inserts).toHaveLength(1)
    const p = inserts[0].params
    expect(p[COL.computed_cost_usd]).toBe(0)
    expect(p[COL.status]).toBe('success')
    expect(p[COL.error_code]).toBeNull()
    // pricing_version_id still recorded — replay can re-cost against another version.
    expect(p[COL.pricing_version_id]).toBe('pv-gem-input')
  })
})

// --------------------------------------------------------------------------
// 6. provider_request_id — UUID generated; header appended when present
// --------------------------------------------------------------------------

describe('provider_request_id construction', () => {
  it('returns the UUID alone when no x-goog-request-id header is present', () => {
    const out = buildProviderRequestId('uuid-abc', undefined)
    expect(out).toBe('uuid-abc')
  })

  it('appends x-goog-request-id after a colon when present (case-insensitive header lookup)', () => {
    const out = buildProviderRequestId('uuid-abc', {
      'X-Goog-Request-Id': 'goog-12345',
    })
    expect(out).toBe('uuid-abc:goog-12345')
  })

  it('persists provider_request_id on the telemetry row', async () => {
    const { db, inserts } = makeDb()
    await callGeminiObserved(
      baseRequest,
      async () => ({
        response: { text: 'ok' },
        usageMetadata: {
          promptTokenCount: 1,
          candidatesTokenCount: 1,
          totalTokenCount: 2,
        },
        responseHeaders: { 'x-goog-request-id': 'goog-99' },
      }),
      db,
    )
    const persistedId = inserts[0].params[COL.provider_request_id] as string
    // Format: <uuid>:<x-goog-request-id>
    expect(persistedId).toMatch(/^[0-9a-f-]{36}:goog-99$/)
  })
})

// --------------------------------------------------------------------------
// 7. Error: 429 → rate_limited
// --------------------------------------------------------------------------

describe('callGeminiObserved — 429 error path', () => {
  it('persists status=error with error_code=rate_limited and re-throws', async () => {
    const { db, inserts } = makeDb()
    const err = Object.assign(new Error('rate limit hit'), { status: 429 })

    await expect(
      callGeminiObserved(
        baseRequest,
        async () => {
          throw err
        },
        db,
      ),
    ).rejects.toBe(err)

    expect(inserts).toHaveLength(1)
    const p = inserts[0].params
    expect(p[COL.status]).toBe('error')
    expect(p[COL.error_code]).toBe('rate_limited')
    // Direct helper sanity-check.
    expect(mapGeminiErrorCode(err)).toBe('rate_limited')
  })
})

// --------------------------------------------------------------------------
// 8. Error: 500 → server_error
// --------------------------------------------------------------------------

describe('callGeminiObserved — 500 error path', () => {
  it('classifies 5xx as server_error and persists status=error', async () => {
    const { db, inserts } = makeDb()
    const err = Object.assign(new Error('internal'), { status: 500 })

    await expect(
      callGeminiObserved(
        baseRequest,
        async () => {
          throw err
        },
        db,
      ),
    ).rejects.toBe(err)

    expect(inserts).toHaveLength(1)
    expect(inserts[0].params[COL.status]).toBe('error')
    expect(inserts[0].params[COL.error_code]).toBe('server_error')
    expect(mapGeminiErrorCode(err)).toBe('server_error')
  })
})
