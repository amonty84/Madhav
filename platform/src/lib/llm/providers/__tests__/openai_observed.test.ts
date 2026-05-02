// Tests — OpenAI provider observed adapter (USTAD_S1_5).
// Cases (per session brief acceptance list 1–10):
//   1.  Standard Chat Completions call — correct ObservedLLMRequest fields.
//   2.  Usage extraction — standard (prompt + completion tokens).
//   3.  Usage extraction — with cached tokens.
//   4.  Usage extraction — o-series reasoning tokens.
//   5.  Streaming — stream_options.include_usage injected automatically.
//   6.  Streaming — usage accumulated from final chunk.
//   7.  Error: 429 → rate_limited.
//   8.  Error: 500 → server_error.
//   9.  Timeout → status=timeout.
//   10. Adapter exposes same method signatures as underlying client.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  ObservedOpenAIClient,
  extractUsage,
  extractRequestId,
  mapErrorCode,
  type OpenAIShapedClient,
  type ObservationContext,
} from '../openai_observed'
import type { ObservatoryDb } from '@/lib/llm/observability'

interface CapturedInsert {
  params: unknown[]
}

interface InsertingDbHandle {
  db: ObservatoryDb
  inserts: CapturedInsert[]
}

function makeDbWithPricing(): InsertingDbHandle {
  const inserts: CapturedInsert[] = []
  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    if (sql.includes('llm_pricing_versions')) {
      return {
        rows: [
          {
            pricing_version_id: 'pv-input-x',
            token_class: 'input',
            price_per_million_usd: 2.5,
          },
          {
            pricing_version_id: 'pv-output-x',
            token_class: 'output',
            price_per_million_usd: 10.0,
          },
        ],
        rowCount: 2,
      }
    }
    if (sql.includes('INSERT INTO llm_usage_events')) {
      inserts.push({ params: params ?? [] })
      return {
        rows: [{ event_id: `evt-${inserts.length}` }],
        rowCount: 1,
      }
    }
    return { rows: [], rowCount: 0 }
  })
  return { db: { query } as unknown as ObservatoryDb, inserts }
}

const ctx: ObservationContext = {
  conversation_id: 'conv-1',
  conversation_name: 'Test conversation',
  prompt_id: 'prompt-1',
  user_id: 'user-1',
  pipeline_stage: 'synthesize',
}

let consoleErrorSpy: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  consoleErrorSpy.mockRestore()
})

// ===========================================================================
// Case 1 — Standard Chat Completions call: correct ObservedLLMRequest fields.
// ===========================================================================
describe('Case 1 — Chat Completions request fields', () => {
  it('records provider=openai, model, params, identity context, prompt_text, system_prompt', async () => {
    const handle = makeDbWithPricing()
    const fakeResponse = {
      id: 'chatcmpl-1',
      _request_id: 'req-1',
      choices: [{ message: { role: 'assistant', content: 'Hi there.' } }],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    }
    const create = vi.fn(async () => fakeResponse)
    const client: OpenAIShapedClient = {
      chat: { completions: { create } },
      responses: { create: vi.fn() },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    const callParams = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Be brief.' },
        { role: 'user', content: 'Hello?' },
      ],
      max_tokens: 50,
    }
    const response = await observed.chat.completions.create(callParams, ctx)

    expect(response).toBe(fakeResponse)
    expect(create).toHaveBeenCalledTimes(1)
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    // conversation_id, conversation_name, prompt_id
    expect(params[0]).toBe('conv-1')
    expect(params[1]).toBe('Test conversation')
    expect(params[2]).toBe('prompt-1')
    // user_id, provider, model, pipeline_stage
    expect(params[4]).toBe('user-1')
    expect(params[5]).toBe('openai')
    expect(params[6]).toBe('gpt-4o')
    expect(params[7]).toBe('synthesize')
    // prompt_text (last user msg), response_text (assistant content), system_prompt
    expect(params[8]).toBe('Hello?')
    expect(params[9]).toBe('Hi there.')
    expect(params[10]).toBe('Be brief.')
    // parameters jsonb stringified — should include model + max_tokens
    expect(typeof params[11]).toBe('string')
    expect(JSON.parse(params[11] as string).max_tokens).toBe(50)
    // status + provider_request_id
    expect(params[20]).toBe('success')
    expect(params[22]).toBe('req-1')
  })
})

// ===========================================================================
// Case 2 — Usage extraction: standard.
// ===========================================================================
describe('Case 2 — Usage extraction (standard)', () => {
  it('maps prompt_tokens → input_tokens; completion_tokens → output_tokens', () => {
    const usage = extractUsage({ prompt_tokens: 100, completion_tokens: 50 })
    expect(usage.input_tokens).toBe(100)
    expect(usage.output_tokens).toBe(50)
    expect(usage.cache_read_tokens).toBe(0)
    expect(usage.cache_write_tokens).toBe(0)
    expect(usage.reasoning_tokens).toBe(0)
  })
})

// ===========================================================================
// Case 3 — Usage extraction: with cached tokens.
// ===========================================================================
describe('Case 3 — Usage extraction (cached tokens)', () => {
  it('maps prompt_tokens_details.cached_tokens → cache_read_tokens', () => {
    const usage = extractUsage({
      prompt_tokens: 200,
      completion_tokens: 80,
      prompt_tokens_details: { cached_tokens: 150 },
    })
    expect(usage.input_tokens).toBe(200)
    expect(usage.output_tokens).toBe(80)
    expect(usage.cache_read_tokens).toBe(150)
    expect(usage.cache_write_tokens).toBe(0)
  })

  it('also handles Responses API shape (input_tokens_details.cached_tokens)', () => {
    const usage = extractUsage({
      input_tokens: 200,
      output_tokens: 80,
      input_tokens_details: { cached_tokens: 75 },
    })
    expect(usage.input_tokens).toBe(200)
    expect(usage.output_tokens).toBe(80)
    expect(usage.cache_read_tokens).toBe(75)
  })
})

// ===========================================================================
// Case 4 — Usage extraction: o-series reasoning tokens.
// ===========================================================================
describe('Case 4 — Usage extraction (reasoning tokens)', () => {
  it('maps completion_tokens_details.reasoning_tokens → reasoning_tokens', () => {
    const usage = extractUsage({
      prompt_tokens: 30,
      completion_tokens: 200,
      completion_tokens_details: { reasoning_tokens: 180 },
    })
    expect(usage.reasoning_tokens).toBe(180)
    expect(usage.output_tokens).toBe(200)
  })

  it('also handles Responses API shape (output_tokens_details.reasoning_tokens)', () => {
    const usage = extractUsage({
      input_tokens: 30,
      output_tokens: 200,
      output_tokens_details: { reasoning_tokens: 180 },
    })
    expect(usage.reasoning_tokens).toBe(180)
  })
})

// ===========================================================================
// Case 5 — Streaming: stream_options.include_usage injected automatically.
// ===========================================================================
describe('Case 5 — Streaming injects include_usage=true', () => {
  it('adapter sets stream_options.include_usage even when caller omits it', async () => {
    const handle = makeDbWithPricing()
    let receivedParams: Record<string, unknown> = {}
    async function* streamGen() {
      yield {
        id: 'chunk-1',
        choices: [{ delta: { content: 'partial' } }],
      }
      yield {
        id: 'chunk-final',
        choices: [{ delta: {} }],
        usage: { prompt_tokens: 8, completion_tokens: 4 },
      }
    }
    const create = vi.fn(async (params: Record<string, unknown>) => {
      receivedParams = params
      return streamGen()
    })
    const client: OpenAIShapedClient = {
      chat: { completions: { create } },
      responses: { create: vi.fn() },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    const stream = (await observed.chat.completions.create(
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Stream please.' }],
        stream: true,
      },
      ctx,
    )) as AsyncIterable<unknown>

    const collected: unknown[] = []
    for await (const c of stream) collected.push(c)

    expect(receivedParams.stream).toBe(true)
    const so = receivedParams.stream_options as { include_usage?: boolean } | undefined
    expect(so).toBeDefined()
    expect(so?.include_usage).toBe(true)
  })
})

// ===========================================================================
// Case 6 — Streaming: usage accumulated from final chunk.
// ===========================================================================
describe('Case 6 — Streaming usage accumulation', () => {
  it('persists accumulated usage from the final stream chunk', async () => {
    const handle = makeDbWithPricing()
    async function* streamGen() {
      yield {
        choices: [{ delta: { content: 'A' } }],
      }
      yield {
        choices: [{ delta: { content: 'B' } }],
      }
      yield {
        choices: [{ delta: {} }],
        usage: {
          prompt_tokens: 12,
          completion_tokens: 24,
          prompt_tokens_details: { cached_tokens: 4 },
        },
      }
    }
    const create = vi.fn(async () => streamGen())
    const client: OpenAIShapedClient = {
      chat: { completions: { create } },
      responses: { create: vi.fn() },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    const stream = (await observed.chat.completions.create(
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Stream' }],
        stream: true,
      },
      ctx,
    )) as AsyncIterable<unknown>

    const collected: unknown[] = []
    for await (const c of stream) collected.push(c)

    expect(collected).toHaveLength(3)
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    // input_tokens, output_tokens, cache_read_tokens
    expect(params[12]).toBe(12)
    expect(params[13]).toBe(24)
    expect(params[14]).toBe(4)
    expect(params[20]).toBe('success')
  })
})

// ===========================================================================
// Case 7 — Error: 429 → rate_limited.
// ===========================================================================
describe('Case 7 — 429 → rate_limited', () => {
  it('persists status=error, error_code=rate_limited; re-throws', async () => {
    const handle = makeDbWithPricing()
    const apiErr = Object.assign(new Error('Rate limit exceeded'), {
      status: 429,
      error: { code: 'rate_limit_exceeded' },
    })
    const create = vi.fn(async () => {
      throw apiErr
    })
    const client: OpenAIShapedClient = {
      chat: { completions: { create } },
      responses: { create: vi.fn() },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    await expect(
      observed.chat.completions.create(
        { model: 'gpt-4o', messages: [{ role: 'user', content: 'hi' }] },
        ctx,
      ),
    ).rejects.toBe(apiErr)

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('error')
    expect(params[21]).toBe('rate_limited')
  })

  it('mapErrorCode unit: status 429 → rate_limited', () => {
    expect(mapErrorCode({ status: 429 })).toEqual({
      status: 'error',
      error_code: 'rate_limited',
    })
  })
})

// ===========================================================================
// Case 8 — Error: 500 → server_error.
// ===========================================================================
describe('Case 8 — 500 → server_error', () => {
  it('persists status=error, error_code=server_error', async () => {
    const handle = makeDbWithPricing()
    const apiErr = Object.assign(new Error('Internal error'), {
      status: 503,
      error: { code: 'service_unavailable' },
    })
    const create = vi.fn(async () => {
      throw apiErr
    })
    const client: OpenAIShapedClient = {
      chat: { completions: { create } },
      responses: { create: vi.fn() },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    await expect(
      observed.chat.completions.create(
        { model: 'gpt-4o', messages: [{ role: 'user', content: 'hi' }] },
        ctx,
      ),
    ).rejects.toBe(apiErr)

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('error')
    expect(params[21]).toBe('server_error')
  })

  it('400 with body.error.code → that code', () => {
    expect(mapErrorCode({ status: 400, error: { code: 'invalid_request' } })).toEqual({
      status: 'error',
      error_code: 'invalid_request',
    })
  })
})

// ===========================================================================
// Case 9 — Timeout → status=timeout.
// ===========================================================================
describe('Case 9 — Timeout → status=timeout', () => {
  it('persists status=timeout when underlying call throws APIConnectionTimeoutError', async () => {
    const handle = makeDbWithPricing()
    const timeoutErr = Object.assign(new Error('Connection timed out'), {
      name: 'APIConnectionTimeoutError',
    })
    const create = vi.fn(async () => {
      throw timeoutErr
    })
    const client: OpenAIShapedClient = {
      chat: { completions: { create } },
      responses: { create: vi.fn() },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    await expect(
      observed.chat.completions.create(
        { model: 'gpt-4o', messages: [{ role: 'user', content: 'hi' }] },
        ctx,
      ),
    ).rejects.toBe(timeoutErr)

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('timeout')
    expect(params[21]).toBe('timeout')
  })

  it('also detects ETIMEDOUT and AbortError as timeout', () => {
    expect(mapErrorCode({ code: 'ETIMEDOUT' }).status).toBe('timeout')
    expect(mapErrorCode({ name: 'AbortError' }).status).toBe('timeout')
  })
})

// ===========================================================================
// Case 10 — Adapter exposes same method signatures as underlying client.
// ===========================================================================
describe('Case 10 — Method signatures', () => {
  it('exposes chat.completions.create and responses.create matching the OpenAI shape', async () => {
    const handle = makeDbWithPricing()
    const chatCreate = vi.fn(async () => ({
      choices: [{ message: { content: 'ok' } }],
      usage: { prompt_tokens: 1, completion_tokens: 1 },
      _request_id: 'req-chat',
    }))
    const responsesCreate = vi.fn(async () => ({
      output_text: 'ok',
      usage: { input_tokens: 1, output_tokens: 1 },
      _request_id: 'req-resp',
    }))
    const client: OpenAIShapedClient = {
      chat: { completions: { create: chatCreate } },
      responses: { create: responsesCreate },
    }
    const observed = new ObservedOpenAIClient(client, handle.db)

    expect(typeof observed.chat.completions.create).toBe('function')
    expect(typeof observed.responses.create).toBe('function')

    await observed.chat.completions.create(
      { model: 'gpt-4o', messages: [{ role: 'user', content: 'hi' }] },
      ctx,
    )
    await observed.responses.create(
      { model: 'gpt-4o', input: 'hi' },
      ctx,
    )

    expect(chatCreate).toHaveBeenCalledTimes(1)
    expect(responsesCreate).toHaveBeenCalledTimes(1)
    expect(handle.inserts).toHaveLength(2)
    expect(handle.inserts[0].params[6]).toBe('gpt-4o') // model
    expect(handle.inserts[0].params[22]).toBe('req-chat')
    expect(handle.inserts[1].params[22]).toBe('req-resp')
  })

  it('extractRequestId reads _request_id; falls back to fetch-style header bag', () => {
    expect(extractRequestId({ _request_id: 'r1' })).toBe('r1')
    expect(
      extractRequestId({
        headers: {
          get: (k: string) => (k.toLowerCase() === 'x-request-id' ? 'r2' : null),
        },
      }),
    ).toBe('r2')
    expect(
      extractRequestId({
        headers: { 'x-request-id': 'r3' },
      }),
    ).toBe('r3')
  })
})
