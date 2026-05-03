// Tests — anthropic_observed adapter (USTAD_S1_4 brief test plan).
// Cases:
//   1. Standard non-streaming call — observe() spied; correct ObservedLLMRequest.
//   2. Usage extraction — standard message (input/output, no cache).
//   3. Usage extraction — message with cache (cache_read + cache_write nonzero).
//   4. Streaming call — observeStream spied; usage accumulated across stream;
//      persisted once after stream completes.
//   5. Error: HTTP 429 → status=error, error_code=rate_limited.
//   6. Error: HTTP 500 → status=error, error_code=server_error.
//   7. Timeout → status=timeout, error_code=timeout.
//   8. Compile-time check — adapter exposes the same `messages.create`
//      signature as the underlying AnthropicClient.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type {
  ObservatoryDb,
  PipelineStage,
} from '@/lib/llm/observability'
import {
  wrapAnthropic,
  extractAnthropicUsage,
  extractAnthropicRequestId,
  mapAnthropicError,
  type AnthropicClient,
  type AnthropicCreateParams,
  type AnthropicCreateParamsStreaming,
  type AnthropicMessageResponse,
  type AnthropicStreamEvent,
  type ObservedAnthropicAdapter,
} from '../anthropic_observed'

// ────────────────────────────────────────────────────────────────────────────
// DB stub — captures INSERT params so each test can assert the row shape.
// ────────────────────────────────────────────────────────────────────────────

interface DbHandle {
  db: ObservatoryDb
  inserts: Array<{ params: unknown[] }>
  pricingQueries: number
}

function makeDb(): DbHandle {
  const inserts: Array<{ params: unknown[] }> = []
  let pricingQueries = 0
  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    if (sql.includes('llm_pricing_versions')) {
      pricingQueries += 1
      return {
        rows: [
          {
            pricing_version_id: 'pv-input-anthropic',
            token_class: 'input',
            price_per_million_usd: 3.0,
          },
          {
            pricing_version_id: 'pv-output-anthropic',
            token_class: 'output',
            price_per_million_usd: 15.0,
          },
          {
            pricing_version_id: 'pv-cache-read-anthropic',
            token_class: 'cache_read',
            price_per_million_usd: 0.3,
          },
          {
            pricing_version_id: 'pv-cache-write-anthropic',
            token_class: 'cache_write',
            price_per_million_usd: 3.75,
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
  return {
    db: { query } as unknown as ObservatoryDb,
    inserts,
    get pricingQueries() {
      return pricingQueries
    },
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Mock AnthropicClient factory
// ────────────────────────────────────────────────────────────────────────────

interface MockAnthropicState {
  // What `create` should return / throw on the next non-streaming call.
  nextResponse?: AnthropicMessageResponse
  nextStreamEvents?: AnthropicStreamEvent[]
  nextError?: unknown
  // Capture of the last call arguments for assertions.
  lastParams?: AnthropicCreateParams
  lastOptions?: { headers?: Record<string, string> }
  callCount: number
}

function makeMockAnthropic(state: MockAnthropicState): {
  client: AnthropicClient
  state: MockAnthropicState
} {
  const create = vi.fn(
    (
      params: AnthropicCreateParams,
      options?: { headers?: Record<string, string> },
    ): unknown => {
      state.callCount += 1
      state.lastParams = params
      state.lastOptions = options
      if (state.nextError) {
        const e = state.nextError
        state.nextError = undefined
        throw e
      }
      if (params.stream === true) {
        const events = state.nextStreamEvents ?? []
        state.nextStreamEvents = undefined
        async function* iter() {
          for (const ev of events) yield ev
        }
        return iter()
      }
      const r = state.nextResponse
      state.nextResponse = undefined
      return Promise.resolve(r ?? {})
    },
  )
  return {
    client: { messages: { create } } as unknown as AnthropicClient,
    state,
  }
}

const ctx = {
  conversation_id: 'conv-anth-1',
  conversation_name: 'Anthropic test conversation',
  prompt_id: 'prompt-anth-1',
  user_id: 'user-1',
  pipeline_stage: 'synthesize' as PipelineStage,
  prompt_text: 'Tell me a fact.',
  system_prompt: 'Be concise.',
}

// Column index helpers (mirror persist.ts INSERT order, $1-indexed → 0-indexed)
const COL = {
  conversation_id: 0,
  conversation_name: 1,
  prompt_id: 2,
  parent_prompt_id: 3,
  user_id: 4,
  provider: 5,
  model: 6,
  pipeline_stage: 7,
  prompt_text: 8,
  response_text: 9,
  system_prompt: 10,
  parameters: 11,
  input_tokens: 12,
  output_tokens: 13,
  cache_read_tokens: 14,
  cache_write_tokens: 15,
  reasoning_tokens: 16,
  computed_cost_usd: 17,
  pricing_version_id: 18,
  latency_ms: 19,
  status: 20,
  error_code: 21,
  provider_request_id: 22,
  started_at: 23,
  finished_at: 24,
} as const

// S2.6 RT.5 flipped OBSERVATORY_HASH_PROMPTS so unset → hash. The active
// policy is cached at module-load in observability/redaction.ts, so we
// pin the env var BEFORE the test file's adapter modules resolve and use
// __resetActivePolicyForTests to re-read it once the override is in place.
// These tests assert the adapter's raw token/cost capture path, not the
// PII hashing redactor — testing the non-hashed code path explicitly.
// (D1 fix in USTAD_S4_6.)
import { __resetActivePolicyForTests } from '@/lib/llm/observability/redaction'

const originalHashEnv = process.env.OBSERVATORY_HASH_PROMPTS
process.env.OBSERVATORY_HASH_PROMPTS = 'false'
__resetActivePolicyForTests()

let consoleErrorSpy: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  process.env.OBSERVATORY_HASH_PROMPTS = 'false'
  __resetActivePolicyForTests()
})
afterEach(() => {
  consoleErrorSpy.mockRestore()
  vi.restoreAllMocks()
  if (originalHashEnv === undefined) {
    delete process.env.OBSERVATORY_HASH_PROMPTS
  } else {
    process.env.OBSERVATORY_HASH_PROMPTS = originalHashEnv
  }
  __resetActivePolicyForTests()
})

// ────────────────────────────────────────────────────────────────────────────
// Test 1 — Standard non-streaming call: observe() called with correct fields.
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — non-streaming success path', () => {
  it('persists one row with the correct ObservedLLMRequest fields', async () => {
    const handle = makeDb()
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextResponse: {
        id: 'msg_01',
        content: [{ type: 'text', text: 'hi' }],
        stop_reason: 'end_turn',
        usage: {
          input_tokens: 100,
          output_tokens: 50,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        },
      },
    })

    const adapter = wrapAnthropic(client, ctx, handle.db)
    const res = await adapter.messages.create({
      model: 'claude-opus-4-7',
      messages: [{ role: 'user', content: 'Tell me a fact.' }],
      max_tokens: 1024,
    })

    expect(res.id).toBe('msg_01')
    expect(handle.inserts).toHaveLength(1)
    const p = handle.inserts[0].params
    expect(p[COL.conversation_id]).toBe('conv-anth-1')
    expect(p[COL.conversation_name]).toBe('Anthropic test conversation')
    expect(p[COL.prompt_id]).toBe('prompt-anth-1')
    expect(p[COL.user_id]).toBe('user-1')
    expect(p[COL.provider]).toBe('anthropic')
    expect(p[COL.model]).toBe('claude-opus-4-7')
    expect(p[COL.pipeline_stage]).toBe('synthesize')
    expect(p[COL.prompt_text]).toBe('Tell me a fact.')
    expect(p[COL.system_prompt]).toBe('Be concise.')
    expect(p[COL.status]).toBe('success')
    expect(p[COL.input_tokens]).toBe(100)
    expect(p[COL.output_tokens]).toBe(50)
    expect(p[COL.reasoning_tokens]).toBe(0)
    // parameters jsonb must NOT contain `messages`
    const paramsJson = JSON.parse(p[COL.parameters] as string) as Record<
      string,
      unknown
    >
    expect(paramsJson.model).toBe('claude-opus-4-7')
    expect(paramsJson.max_tokens).toBe(1024)
    expect(paramsJson.messages).toBeUndefined()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 2 — Usage extraction (standard: input + output, no cache).
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — usage extraction (standard)', () => {
  it('maps response.usage fields to TokenUsage with zero cache + zero reasoning', () => {
    const tu = extractAnthropicUsage({
      input_tokens: 1234,
      output_tokens: 567,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    })
    expect(tu).toEqual({
      input_tokens: 1234,
      output_tokens: 567,
      cache_read_tokens: 0,
      cache_write_tokens: 0,
      reasoning_tokens: 0,
    })
  })

  it('end-to-end: persisted row reflects the standard usage', async () => {
    const handle = makeDb()
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextResponse: {
        id: 'msg_02',
        content: [],
        usage: {
          input_tokens: 1234,
          output_tokens: 567,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        },
      },
    })
    const adapter = wrapAnthropic(client, ctx, handle.db)
    await adapter.messages.create({
      model: 'claude-haiku-4-5',
      messages: [],
    })

    const p = handle.inserts[0].params
    expect(p[COL.input_tokens]).toBe(1234)
    expect(p[COL.output_tokens]).toBe(567)
    expect(p[COL.cache_read_tokens]).toBe(0)
    expect(p[COL.cache_write_tokens]).toBe(0)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 3 — Usage extraction with cache (cache_read + cache_write nonzero).
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — usage extraction (cache)', () => {
  it('routes cache_creation/read input tokens to cache_write/read', () => {
    const tu = extractAnthropicUsage({
      input_tokens: 100,
      output_tokens: 50,
      cache_creation_input_tokens: 2048,
      cache_read_input_tokens: 8192,
    })
    expect(tu.cache_write_tokens).toBe(2048)
    expect(tu.cache_read_tokens).toBe(8192)
  })

  it('end-to-end: persisted row reflects nonzero cache fields', async () => {
    const handle = makeDb()
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextResponse: {
        id: 'msg_03',
        usage: {
          input_tokens: 100,
          output_tokens: 50,
          cache_creation_input_tokens: 2048,
          cache_read_input_tokens: 8192,
        },
      },
    })
    const adapter = wrapAnthropic(client, ctx, handle.db)
    await adapter.messages.create({
      model: 'claude-opus-4-7',
      messages: [],
    })

    const p = handle.inserts[0].params
    expect(p[COL.input_tokens]).toBe(100)
    expect(p[COL.output_tokens]).toBe(50)
    expect(p[COL.cache_write_tokens]).toBe(2048)
    expect(p[COL.cache_read_tokens]).toBe(8192)
    // Computed cost = 100/1e6 * 3 + 50/1e6 * 15 + 8192/1e6 * 0.3 + 2048/1e6 * 3.75
    //               = 0.0003 + 0.00075 + 0.0024576 + 0.00768
    //               = 0.0111876
    expect(p[COL.computed_cost_usd]).toBeCloseTo(0.0111876, 6)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 4 — Streaming call: observeStream once after stream completes;
// accumulated usage from message_delta.
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — streaming success path', () => {
  it('forwards every chunk and persists once after stream completion with accumulated usage', async () => {
    const handle = makeDb()
    const events: AnthropicStreamEvent[] = [
      {
        type: 'message_start',
        message: {
          id: 'msg_stream_01',
          usage: {
            input_tokens: 200,
            output_tokens: 0,
            cache_creation_input_tokens: 64,
            cache_read_input_tokens: 256,
          },
        },
      },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Hel' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'lo' } },
      { type: 'content_block_stop', index: 0 },
      {
        type: 'message_delta',
        delta: { stop_reason: 'end_turn' },
        usage: { output_tokens: 75 },
      },
      { type: 'message_stop' },
    ]
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextStreamEvents: events,
    })
    const adapter = wrapAnthropic(client, ctx, handle.db)

    const collected: AnthropicStreamEvent[] = []
    const params: AnthropicCreateParamsStreaming = {
      model: 'claude-opus-4-7',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: true,
    }
    const stream = adapter.messages.create(params)
    for await (const ev of stream) {
      collected.push(ev)
    }
    expect(collected).toHaveLength(events.length)
    expect(collected.map((e) => e.type)).toEqual(events.map((e) => e.type))

    expect(handle.inserts).toHaveLength(1)
    const p = handle.inserts[0].params
    expect(p[COL.status]).toBe('success')
    expect(p[COL.input_tokens]).toBe(200)
    expect(p[COL.output_tokens]).toBe(75)
    expect(p[COL.cache_write_tokens]).toBe(64)
    expect(p[COL.cache_read_tokens]).toBe(256)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 5 — HTTP 429 maps to status=error, error_code=rate_limited.
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — error path (HTTP 429)', () => {
  it('persists status=error, error_code=rate_limited; re-throws', async () => {
    const handle = makeDb()
    const apiErr = Object.assign(new Error('rate limited'), {
      status: 429,
      error: { type: 'rate_limit_error' },
    })
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextError: apiErr,
    })
    const adapter = wrapAnthropic(client, ctx, handle.db)

    await expect(
      adapter.messages.create({
        model: 'claude-opus-4-7',
        messages: [],
      }),
    ).rejects.toBe(apiErr)

    expect(handle.inserts).toHaveLength(1)
    const p = handle.inserts[0].params
    expect(p[COL.status]).toBe('error')
    expect(p[COL.error_code]).toBe('rate_limited')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 6 — HTTP 500 maps to status=error, error_code=server_error.
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — error path (HTTP 500)', () => {
  it('persists status=error, error_code=server_error; re-throws', async () => {
    const handle = makeDb()
    const apiErr = Object.assign(new Error('upstream blew up'), {
      status: 500,
    })
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextError: apiErr,
    })
    const adapter = wrapAnthropic(client, ctx, handle.db)

    await expect(
      adapter.messages.create({
        model: 'claude-opus-4-7',
        messages: [],
      }),
    ).rejects.toBe(apiErr)

    expect(handle.inserts).toHaveLength(1)
    const p = handle.inserts[0].params
    expect(p[COL.status]).toBe('error')
    expect(p[COL.error_code]).toBe('server_error')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 7 — Timeout maps to status=timeout, error_code=timeout.
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — timeout path', () => {
  it('persists status=timeout, error_code=timeout; re-throws', async () => {
    const handle = makeDb()
    const timeoutErr = Object.assign(new Error('Request timed out'), {
      name: 'AbortError',
      code: 'ETIMEDOUT',
    })
    const { client } = makeMockAnthropic({
      callCount: 0,
      nextError: timeoutErr,
    })
    const adapter = wrapAnthropic(client, ctx, handle.db)

    await expect(
      adapter.messages.create({
        model: 'claude-opus-4-7',
        messages: [],
      }),
    ).rejects.toBe(timeoutErr)

    expect(handle.inserts).toHaveLength(1)
    const p = handle.inserts[0].params
    expect(p[COL.status]).toBe('timeout')
    expect(p[COL.error_code]).toBe('timeout')
    expect(p[COL.input_tokens]).toBe(0)
    expect(p[COL.output_tokens]).toBe(0)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Test 8 — Compile-time signature parity.
// ────────────────────────────────────────────────────────────────────────────

describe('wrapAnthropic — signature parity (compile-time)', () => {
  it('exposes the same messages.create signature as AnthropicClient', () => {
    // This block is a type-level assertion: if ObservedAnthropicAdapter's
    // messages.create signature drifts from AnthropicClient['messages']['create'],
    // TypeScript fails the build.
    type ClientCreate = AnthropicClient['messages']['create']
    type AdapterCreate = ObservedAnthropicAdapter['messages']['create']
    const _check: AdapterCreate = (() => undefined) as unknown as ClientCreate
    void _check
    expect(true).toBe(true)
  })

  it('helpers extractAnthropicRequestId + mapAnthropicError are exported and behave', () => {
    // request-id from response object
    expect(
      extractAnthropicRequestId({ _request_id: 'req_abc' }),
    ).toBe('req_abc')
    // request-id from response headers
    expect(
      extractAnthropicRequestId({
        headers: { 'request-id': 'req_xyz' },
      }),
    ).toBe('req_xyz')
    // x-request-id fallback
    expect(
      extractAnthropicRequestId({
        headers: { 'x-request-id': 'req_qrs' },
      }),
    ).toBe('req_qrs')
    // No id available
    expect(extractAnthropicRequestId({})).toBeUndefined()
    // Error mapping spot-checks
    expect(mapAnthropicError({ status: 429 })).toEqual({
      status: 'error',
      error_code: 'rate_limited',
    })
    expect(mapAnthropicError({ status: 503 })).toEqual({
      status: 'error',
      error_code: 'server_error',
    })
    expect(mapAnthropicError({ status: 401, error: { type: 'authentication_error' } })).toEqual({
      status: 'error',
      error_code: 'authentication_error',
    })
    expect(mapAnthropicError({ name: 'AbortError' })).toEqual({
      status: 'timeout',
      error_code: 'timeout',
    })
  })
})
