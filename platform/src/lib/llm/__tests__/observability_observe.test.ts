// Tests — observe() / observeStream().
// Cases (per USTAD_S1_2 brief acceptance list 7–10):
//   7.  observe() wraps a successful provider call; returned response is
//       unmodified; observation row has correct fields.
//   8.  observe() — providerCall throws; observation persisted with
//       status=error and error_code; provider error re-throws to caller.
//   9.  observeStream — yields all chunks; final usage accumulated;
//       persistObservation called once at end.
//   10. observeStream — stream throws midway; observation persisted with
//       status=error and error_code.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { observe, observeStream } from '../observability/observe'
import type {
  ObservatoryDb,
  ObservedLLMRequest,
  TokenUsage,
} from '../observability/types'

interface CapturedInsert {
  params: unknown[]
}

interface InsertingDbHandle {
  db: ObservatoryDb
  inserts: CapturedInsert[]
  pricingQueries: number
}

function makeDbWithPricing(): InsertingDbHandle {
  const inserts: CapturedInsert[] = []
  let pricingQueries = 0

  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    if (sql.includes('llm_pricing_versions')) {
      pricingQueries += 1
      return {
        rows: [
          {
            pricing_version_id: 'pv-input-x',
            token_class: 'input',
            price_per_million_usd: 3.0,
          },
          {
            pricing_version_id: 'pv-output-x',
            token_class: 'output',
            price_per_million_usd: 15.0,
          },
        ],
        rowCount: 2,
      }
    }
    if (sql.includes('INSERT INTO llm_usage_events')) {
      inserts.push({ params: params ?? [] })
      return {
        rows: [
          {
            event_id: `evt-${inserts.length}`,
            params,
          },
        ],
        rowCount: 1,
      }
    }
    return { rows: [], rowCount: 0 }
  })

  return {
    db: { query } as unknown as ObservatoryDb,
    inserts,
    get pricingQueries() {
      return pricingQueries
    },
  }
}

const req: ObservedLLMRequest = {
  provider: 'anthropic',
  model: 'claude-opus-4-6',
  prompt_text: 'Tell me a joke.',
  system_prompt: 'Be concise.',
  parameters: { max_tokens: 50 },
  conversation_id: 'conv-42',
  conversation_name: 'Comedy hour',
  prompt_id: 'prompt-42',
  user_id: 'user-42',
  pipeline_stage: 'synthesize',
}

const usage: TokenUsage = {
  input_tokens: 100_000,
  output_tokens: 50_000,
  cache_read_tokens: 0,
  cache_write_tokens: 0,
  reasoning_tokens: 0,
}

describe('observe() success path', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('returns the original provider response unmodified and persists one event row', async () => {
    const handle = makeDbWithPricing()
    const fakeResponse = { content: 'Why did the chicken cross the road?' }

    const result = await observe(
      req,
      async () => ({
        response: fakeResponse,
        rawUsage: usage,
        providerRequestId: 'req-anth-99',
      }),
      handle.db,
    )

    expect(result.response).toBe(fakeResponse)
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[5]).toBe('anthropic')
    expect(params[6]).toBe('claude-opus-4-6')
    expect(params[12]).toBe(100_000)
    expect(params[13]).toBe(50_000)
    expect(params[20]).toBe('success')
    expect(params[22]).toBe('req-anth-99')
    // 0.1*3 + 0.05*15 = 1.05
    expect(params[17]).toBeCloseTo(1.05, 6)
    expect(params[18]).toBe('pv-input-x')
  })
})

describe('observe() error path', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('persists observation with status=error and error_code; re-throws provider error', async () => {
    const handle = makeDbWithPricing()
    const providerError = Object.assign(new Error('rate limited'), {
      code: 'rate_limit_exceeded',
    })

    await expect(
      observe(
        req,
        async () => {
          throw providerError
        },
        handle.db,
      ),
    ).rejects.toBe(providerError)

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('error')
    expect(params[21]).toBe('rate_limit_exceeded')
    expect(params[12]).toBe(0)
    expect(params[13]).toBe(0)
  })
})

describe('observeStream() success path', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('yields all chunks, accumulates final usage, persists once at end', async () => {
    const handle = makeDbWithPricing()
    const chunks = ['Hello', ', ', 'world']

    async function* streamCall() {
      for (let i = 0; i < chunks.length; i++) {
        if (i === chunks.length - 1) {
          yield {
            chunk: chunks[i],
            finalUsage: usage,
            providerRequestId: 'req-stream-1',
          }
        } else {
          yield { chunk: chunks[i] }
        }
      }
    }

    const collected: string[] = []
    for await (const c of observeStream(req, streamCall, handle.db)) {
      collected.push(c)
    }

    expect(collected).toEqual(chunks)
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[12]).toBe(100_000)
    expect(params[13]).toBe(50_000)
    expect(params[20]).toBe('success')
    expect(params[22]).toBe('req-stream-1')
  })
})

describe('observeStream() error path', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('persists observation with status=error when the stream throws midway', async () => {
    const handle = makeDbWithPricing()
    const boom = Object.assign(new Error('upstream blew up'), {
      code: 'upstream_error',
    })

    async function* streamCall() {
      yield { chunk: 'partial' }
      throw boom
    }

    const collected: string[] = []
    await expect(
      (async () => {
        for await (const c of observeStream(req, streamCall, handle.db)) {
          collected.push(c)
        }
      })(),
    ).rejects.toBe(boom)

    expect(collected).toEqual(['partial'])
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('error')
    expect(params[21]).toBe('upstream_error')
  })
})
