// Tests — DeepSeek provider adapter (USTAD_S1_7).
//
// Cases (per S1.7 brief):
//   1. Standard V3 call — correct field mapping (prompt_tokens → input_tokens,
//      completion_tokens → output_tokens), provider_request_id captured.
//   2. Usage extraction — prompt_cache_hit_tokens → cache_read_tokens.
//   3. cache_miss_tokens captured in parameters jsonb only, not in any token
//      count column (cache_write_tokens stays 0; input_tokens unchanged).
//   4. Streaming — usage accumulated from final chunk via observeStream().
//   5. R1 reasoning model — reasoning_tokens=0 (DeepSeek does not separately
//      surface reasoning tokens in the usage block as of 2026-05-03).
//   6. Error: HTTP 429 → status='error', error_code='rate_limited'.
//   7. Error: HTTP 500 → status='error', error_code='server_error'.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { chatCompletion, streamChatCompletion } from '../deepseek_observed'
import type {
  ObservatoryDb,
  ObservedLLMRequest,
} from '../../observability/types'

// ---------------------------------------------------------------------------
// Test infrastructure — db stub mirroring observability_observe.test.ts.
// Captures every INSERT INTO llm_usage_events param array; serves the
// pricing-version lookup with two fixed rows.
// ---------------------------------------------------------------------------

interface CapturedInsert {
  params: unknown[]
}

interface DbHandle {
  db: ObservatoryDb
  inserts: CapturedInsert[]
}

function makeDb(): DbHandle {
  const inserts: CapturedInsert[] = []
  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    if (sql.includes('llm_pricing_versions')) {
      return {
        rows: [
          { pricing_version_id: 'pv-input-ds', token_class: 'input', price_per_million_usd: 0.27 },
          { pricing_version_id: 'pv-output-ds', token_class: 'output', price_per_million_usd: 1.1 },
          {
            pricing_version_id: 'pv-cache-read-ds',
            token_class: 'cache_read',
            price_per_million_usd: 0.07,
          },
        ],
        rowCount: 3,
      }
    }
    if (sql.includes('INSERT INTO llm_usage_events')) {
      inserts.push({ params: params ?? [] })
      return { rows: [{ event_id: `evt-${inserts.length}` }], rowCount: 1 }
    }
    return { rows: [], rowCount: 0 }
  })
  return { db: { query } as unknown as ObservatoryDb, inserts }
}

// Param-array indices into the persistObservation INSERT statement (see
// platform/src/lib/llm/observability/persist.ts INSERT_SQL).
const IDX = {
  provider: 5,
  model: 6,
  parameters: 11,
  input_tokens: 12,
  output_tokens: 13,
  cache_read_tokens: 14,
  cache_write_tokens: 15,
  reasoning_tokens: 16,
  status: 20,
  error_code: 21,
  provider_request_id: 22,
} as const

const baseObservation: Omit<ObservedLLMRequest, 'parameters'> = {
  provider: 'deepseek',
  model: 'deepseek-chat',
  prompt_text: 'Say hi.',
  system_prompt: 'Be brief.',
  conversation_id: 'conv-ds-1',
  conversation_name: 'DeepSeek scratch',
  prompt_id: 'prompt-ds-1',
  user_id: 'user-ds-1',
  pipeline_stage: 'synthesize',
}

// Headers helper — returns a Headers instance the adapter can read via
// .get(). Vitest's global Response/Headers/ReadableStream are available
// under Node 20+ and Vitest 4.
function makeJsonResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

function makeSSEResponse(chunks: unknown[], headers: Record<string, string> = {}): Response {
  const text =
    chunks
      .map((c) => `data: ${JSON.stringify(c)}\n`)
      .join('\n') + '\ndata: [DONE]\n'
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
  return new Response(stream, {
    status: 200,
    headers: { 'content-type': 'text/event-stream', ...headers },
  })
}

let consoleErrorSpy: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  consoleErrorSpy.mockRestore()
})

// ---------------------------------------------------------------------------
// Case 1 — standard V3 call
// ---------------------------------------------------------------------------
describe('chatCompletion — standard V3 call', () => {
  it('maps prompt_tokens → input_tokens, completion_tokens → output_tokens, captures provider_request_id', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeJsonResponse(
        200,
        {
          id: 'cmpl-v3-1',
          object: 'chat.completion',
          created: 1714752000,
          model: 'deepseek-chat',
          choices: [
            { index: 0, message: { role: 'assistant', content: 'Hi.' }, finish_reason: 'stop' },
          ],
          usage: { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 },
        },
        { 'x-request-id': 'req-ds-001' },
      ),
    )

    const resp = await chatCompletion({
      observation: baseObservation,
      body: { model: 'deepseek-chat', messages: [{ role: 'user', content: 'Say hi.' }] },
      apiKey: 'test-key',
      fetchImpl,
      db: handle.db,
    })

    expect(resp.choices[0].message.content).toBe('Hi.')
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[IDX.provider]).toBe('deepseek')
    expect(params[IDX.model]).toBe('deepseek-chat')
    expect(params[IDX.input_tokens]).toBe(12)
    expect(params[IDX.output_tokens]).toBe(3)
    expect(params[IDX.cache_read_tokens]).toBe(0)
    expect(params[IDX.cache_write_tokens]).toBe(0)
    expect(params[IDX.reasoning_tokens]).toBe(0)
    expect(params[IDX.status]).toBe('success')
    expect(params[IDX.provider_request_id]).toBe('req-ds-001')
  })
})

// ---------------------------------------------------------------------------
// Case 2 — cache hit mapped to cache_read_tokens
// ---------------------------------------------------------------------------
describe('chatCompletion — usage extraction', () => {
  it('maps prompt_cache_hit_tokens → cache_read_tokens', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeJsonResponse(200, {
        id: 'cmpl-v3-2',
        object: 'chat.completion',
        created: 1714752100,
        model: 'deepseek-chat',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Cached.' },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 5,
          total_tokens: 105,
          prompt_cache_hit_tokens: 80,
          prompt_cache_miss_tokens: 20,
        },
      }),
    )

    await chatCompletion({
      observation: baseObservation,
      body: { model: 'deepseek-chat', messages: [{ role: 'user', content: 'cache me' }] },
      apiKey: 'k',
      fetchImpl,
      db: handle.db,
    })

    const params = handle.inserts[0].params
    expect(params[IDX.input_tokens]).toBe(100)
    expect(params[IDX.cache_read_tokens]).toBe(80)
    expect(params[IDX.cache_write_tokens]).toBe(0)
    expect(params[IDX.output_tokens]).toBe(5)
  })
})

// ---------------------------------------------------------------------------
// Case 3 — cache_miss_tokens lands in parameters jsonb only
// ---------------------------------------------------------------------------
describe('chatCompletion — cache_miss_tokens routing', () => {
  it('captures prompt_cache_miss_tokens in parameters jsonb only; never into a token-count column', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeJsonResponse(200, {
        id: 'cmpl-v3-3',
        object: 'chat.completion',
        created: 1714752200,
        model: 'deepseek-chat',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'ok' },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 2,
          total_tokens: 102,
          prompt_cache_hit_tokens: 80,
          prompt_cache_miss_tokens: 20,
        },
      }),
    )

    await chatCompletion({
      observation: baseObservation,
      body: { model: 'deepseek-chat', messages: [{ role: 'user', content: 'mix' }] },
      apiKey: 'k',
      fetchImpl,
      db: handle.db,
    })

    const params = handle.inserts[0].params
    // No token-count column reflects 20.
    expect(params[IDX.input_tokens]).toBe(100)
    expect(params[IDX.cache_read_tokens]).toBe(80)
    expect(params[IDX.cache_write_tokens]).toBe(0)
    expect(params[IDX.reasoning_tokens]).toBe(0)
    expect(params[IDX.output_tokens]).toBe(2)

    // It IS recorded under parameters.deepseek_cache_miss_tokens.
    const parameters = JSON.parse(params[IDX.parameters] as string)
    expect(parameters.deepseek_cache_miss_tokens).toBe(20)
    // And the request body snapshot is preserved (sans messages).
    expect(parameters.request.model).toBe('deepseek-chat')
    expect(parameters.request.messages).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Case 4 — streaming usage accumulated from final chunk
// ---------------------------------------------------------------------------
describe('streamChatCompletion — usage from final chunk', () => {
  it('yields all chunks and accumulates usage from the final chunk', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeSSEResponse(
        [
          {
            id: 'c-1',
            object: 'chat.completion.chunk',
            created: 1714752300,
            model: 'deepseek-chat',
            choices: [{ index: 0, delta: { role: 'assistant', content: 'Hel' }, finish_reason: null }],
          },
          {
            id: 'c-2',
            object: 'chat.completion.chunk',
            created: 1714752300,
            model: 'deepseek-chat',
            choices: [{ index: 0, delta: { content: 'lo' }, finish_reason: null }],
          },
          {
            id: 'c-3',
            object: 'chat.completion.chunk',
            created: 1714752300,
            model: 'deepseek-chat',
            choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
            usage: { prompt_tokens: 9, completion_tokens: 2, total_tokens: 11 },
          },
        ],
        { 'x-ds-request-id': 'req-stream-7' },
      ),
    )

    const collected: string[] = []
    for await (const chunk of streamChatCompletion({
      observation: baseObservation,
      body: { model: 'deepseek-chat', messages: [{ role: 'user', content: 'stream please' }] },
      apiKey: 'k',
      fetchImpl,
      db: handle.db,
    })) {
      const piece = chunk.choices[0]?.delta?.content
      if (typeof piece === 'string') collected.push(piece)
    }

    expect(collected.join('')).toBe('Hello')
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[IDX.input_tokens]).toBe(9)
    expect(params[IDX.output_tokens]).toBe(2)
    expect(params[IDX.status]).toBe('success')
    expect(params[IDX.provider_request_id]).toBe('req-stream-7')
  })
})

// ---------------------------------------------------------------------------
// Case 5 — R1 model: reasoning_tokens=0
// ---------------------------------------------------------------------------
describe('chatCompletion — R1 reasoning model', () => {
  it('records reasoning_tokens=0 (DeepSeek does not separately expose reasoning tokens in usage as of 2026-05-03)', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeJsonResponse(200, {
        id: 'cmpl-r1-1',
        object: 'chat.completion',
        created: 1714752400,
        model: 'deepseek-reasoner',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'The answer is 42.',
              // R1 includes reasoning_content alongside content; we don't
              // parse it here — the brief notes the token count isn't
              // separately reported in the usage block.
              reasoning_content: 'Step 1: think... Step 2: 42.',
            },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 7, completion_tokens: 200, total_tokens: 207 },
      }),
    )

    await chatCompletion({
      observation: { ...baseObservation, model: 'deepseek-reasoner' },
      body: {
        model: 'deepseek-reasoner',
        messages: [{ role: 'user', content: 'What is the answer?' }],
      },
      apiKey: 'k',
      fetchImpl,
      db: handle.db,
    })

    const params = handle.inserts[0].params
    expect(params[IDX.model]).toBe('deepseek-reasoner')
    expect(params[IDX.input_tokens]).toBe(7)
    expect(params[IDX.output_tokens]).toBe(200)
    expect(params[IDX.reasoning_tokens]).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Case 6 — HTTP 429 → rate_limited
// ---------------------------------------------------------------------------
describe('chatCompletion — error mapping (429)', () => {
  it('maps HTTP 429 to error_code=rate_limited and re-throws', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeJsonResponse(429, {
        error: { type: 'rate_limit', code: 'too_many_requests', message: 'Slow down' },
      }),
    )

    await expect(
      chatCompletion({
        observation: baseObservation,
        body: { model: 'deepseek-chat', messages: [{ role: 'user', content: 'hi' }] },
        apiKey: 'k',
        fetchImpl,
        db: handle.db,
      }),
    ).rejects.toMatchObject({ code: 'rate_limited', status: 429 })

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[IDX.status]).toBe('error')
    expect(params[IDX.error_code]).toBe('rate_limited')
  })
})

// ---------------------------------------------------------------------------
// Case 7 — HTTP 500 → server_error
// ---------------------------------------------------------------------------
describe('chatCompletion — error mapping (5xx)', () => {
  it('maps HTTP 500 to error_code=server_error and re-throws', async () => {
    const handle = makeDb()
    const fetchImpl = vi.fn(async () =>
      makeJsonResponse(500, {
        error: { type: 'internal', code: 'internal_error', message: 'oops' },
      }),
    )

    await expect(
      chatCompletion({
        observation: baseObservation,
        body: { model: 'deepseek-chat', messages: [{ role: 'user', content: 'hi' }] },
        apiKey: 'k',
        fetchImpl,
        db: handle.db,
      }),
    ).rejects.toMatchObject({ code: 'server_error', status: 500 })

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[IDX.status]).toBe('error')
    expect(params[IDX.error_code]).toBe('server_error')
  })
})
