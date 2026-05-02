// Tests for the NIM observed provider adapter (USTAD_S1_8).
// Cases per brief acceptance list:
//   1. Standard call — correct field mapping for Llama-3 70B.
//   2. Usage extraction — prompt + completion tokens.
//   3. Streaming — usage accumulated from final chunk; stream=true always set.
//   4. provider_request_id from x-request-id header; fallback to generated UUID.
//   5. Error: 429 → rate_limited.
//   6. Error: 500 → server_error.
//   7. Scope comment lists all in-scope models (structural).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { NimObservedClient, NimObservedError } from '../nim_observed'
import type { ObservatoryDb, ObservedLLMRequest } from '../../observability/types'

interface CapturedInsert {
  params: unknown[]
}

function makeDbWithPricing(): {
  db: ObservatoryDb
  inserts: CapturedInsert[]
} {
  const inserts: CapturedInsert[] = []
  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    if (sql.includes('llm_pricing_versions')) {
      return {
        rows: [
          {
            pricing_version_id: 'pv-nim-input-v1',
            token_class: 'input',
            price_per_million_usd: 0.5,
          },
          {
            pricing_version_id: 'pv-nim-output-v1',
            token_class: 'output',
            price_per_million_usd: 1.5,
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

const baseReq: ObservedLLMRequest = {
  provider: 'nim',
  model: 'meta/llama-3.3-70b-instruct',
  prompt_text: 'What is the capital of Bharat?',
  system_prompt: 'You are a careful geographer.',
  parameters: { temperature: 0.2, max_tokens: 64 },
  conversation_id: 'conv-nim-1',
  conversation_name: 'NIM smoke',
  prompt_id: 'prompt-nim-1',
  user_id: 'user-nim-1',
  pipeline_stage: 'synthesize',
}

function jsonResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  })
}

function sseResponse(
  events: string[],
  headers: Record<string, string> = {},
): Response {
  const body = events.map((e) => `data: ${e}\n\n`).join('') + 'data: [DONE]\n\n'
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      ...headers,
    },
  })
}

let consoleErrorSpy: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('NimObservedClient — non-streaming chat completion', () => {
  it('AC.1: standard call — correct field mapping for Llama-3.3-70B', async () => {
    const handle = makeDbWithPricing()
    const fetchImpl = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string) as {
        model: string
        stream: boolean
      }
      expect(body.model).toBe('meta/llama-3.3-70b-instruct')
      expect(body.stream).toBe(false)
      return jsonResponse(
        200,
        {
          id: 'cmpl-abc',
          object: 'chat.completion',
          created: 1730000000,
          model: 'meta/llama-3.3-70b-instruct',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'New Delhi.' },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 100,
            completion_tokens: 50,
            total_tokens: 150,
          },
        },
        { 'x-request-id': 'nim-req-llama70-1' },
      )
    })

    const client = new NimObservedClient({ apiKey: 'k', fetchImpl })
    const result = await client.chatCompletion(
      baseReq,
      {
        model: 'meta/llama-3.3-70b-instruct',
        messages: [{ role: 'user', content: 'capital?' }],
      },
      handle.db,
    )

    expect(result.text).toBe('New Delhi.')
    expect(result.providerRequestId).toBe('nim-req-llama70-1')

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[5]).toBe('nim') // provider
    expect(params[6]).toBe('meta/llama-3.3-70b-instruct') // model
    expect(params[20]).toBe('success') // status
    expect(params[22]).toBe('nim-req-llama70-1') // provider_request_id
  })

  it('AC.2: usage extraction maps prompt_tokens→input, completion_tokens→output; cache+reasoning at 0', async () => {
    const handle = makeDbWithPricing()
    const fetchImpl = vi.fn(async () =>
      jsonResponse(200, {
        id: 'cmpl-usage',
        object: 'chat.completion',
        created: 1730000000,
        model: 'meta/llama-3.3-70b-instruct',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'ok' },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 12_345,
          completion_tokens: 678,
          total_tokens: 13_023,
        },
      }),
    )
    const client = new NimObservedClient({
      apiKey: 'k',
      fetchImpl,
      generateRequestId: () => 'gen-1',
    })
    const result = await client.chatCompletion(
      baseReq,
      {
        model: 'meta/llama-3.3-70b-instruct',
        messages: [{ role: 'user', content: 'x' }],
      },
      handle.db,
    )

    expect(result.usage.input_tokens).toBe(12_345)
    expect(result.usage.output_tokens).toBe(678)
    expect(result.usage.cache_read_tokens).toBe(0)
    expect(result.usage.cache_write_tokens).toBe(0)
    expect(result.usage.reasoning_tokens).toBe(0)

    const params = handle.inserts[0].params
    expect(params[12]).toBe(12_345) // input_tokens
    expect(params[13]).toBe(678) // output_tokens
    expect(params[14]).toBe(0) // cache_read_tokens
    expect(params[15]).toBe(0) // cache_write_tokens
    expect(params[16]).toBe(0) // reasoning_tokens
  })
})

describe('NimObservedClient — streaming', () => {
  it('AC.3: stream=true is always set; usage from final chunk is persisted', async () => {
    const handle = makeDbWithPricing()
    const fetchImpl = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string) as {
        model: string
        stream: boolean
      }
      // Caller did not set stream — adapter must force it.
      expect(body.stream).toBe(true)

      const baseChunk = {
        id: 'cmpl-stream-1',
        object: 'chat.completion.chunk' as const,
        created: 1730000001,
        model: 'meta/llama-3.1-8b-instruct',
      }
      const events = [
        JSON.stringify({
          ...baseChunk,
          choices: [{ index: 0, delta: { content: 'Hel' }, finish_reason: null }],
        }),
        JSON.stringify({
          ...baseChunk,
          choices: [{ index: 0, delta: { content: 'lo, ' }, finish_reason: null }],
        }),
        JSON.stringify({
          ...baseChunk,
          choices: [{ index: 0, delta: { content: 'world!' }, finish_reason: 'stop' }],
        }),
        JSON.stringify({
          ...baseChunk,
          choices: [],
          usage: {
            prompt_tokens: 7,
            completion_tokens: 3,
            total_tokens: 10,
          },
        }),
      ]
      return sseResponse(events, { 'x-request-id': 'nim-stream-req-1' })
    })

    const client = new NimObservedClient({ apiKey: 'k', fetchImpl })
    const collected: string[] = []
    for await (const chunk of client.chatCompletionStream(
      { ...baseReq, model: 'meta/llama-3.1-8b-instruct' },
      {
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: 'hi' }],
      },
      handle.db,
    )) {
      collected.push(chunk)
    }

    expect(collected.join('')).toBe('Hello, world!')
    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[12]).toBe(7) // input_tokens
    expect(params[13]).toBe(3) // output_tokens
    expect(params[20]).toBe('success')
    expect(params[22]).toBe('nim-stream-req-1')
  })
})

describe('NimObservedClient — provider_request_id', () => {
  it('AC.4: prefers x-request-id header; falls back to generated UUID when absent', async () => {
    const handle1 = makeDbWithPricing()
    const fetch1 = vi.fn(async () =>
      jsonResponse(
        200,
        {
          id: 'cmpl-1',
          object: 'chat.completion',
          created: 1,
          model: 'meta/llama-3.1-8b-instruct',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'ok' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        },
        { 'x-request-id': 'header-supplied-id' },
      ),
    )
    const c1 = new NimObservedClient({ apiKey: 'k', fetchImpl: fetch1 })
    const r1 = await c1.chatCompletion(
      baseReq,
      { model: 'meta/llama-3.1-8b-instruct', messages: [{ role: 'user', content: 'x' }] },
      handle1.db,
    )
    expect(r1.providerRequestId).toBe('header-supplied-id')
    expect(handle1.inserts[0].params[22]).toBe('header-supplied-id')

    const handle2 = makeDbWithPricing()
    const fetch2 = vi.fn(async () =>
      jsonResponse(200, {
        id: 'cmpl-2',
        object: 'chat.completion',
        created: 1,
        model: 'meta/llama-3.1-8b-instruct',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'ok' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      }),
    )
    const c2 = new NimObservedClient({
      apiKey: 'k',
      fetchImpl: fetch2,
      generateRequestId: () => 'fallback-uuid-abc',
    })
    const r2 = await c2.chatCompletion(
      baseReq,
      { model: 'meta/llama-3.1-8b-instruct', messages: [{ role: 'user', content: 'x' }] },
      handle2.db,
    )
    expect(r2.providerRequestId).toBe('fallback-uuid-abc')
    expect(handle2.inserts[0].params[22]).toBe('fallback-uuid-abc')
  })
})

describe('NimObservedClient — error mapping', () => {
  it('AC.5: HTTP 429 → status=error, error_code=rate_limited', async () => {
    const handle = makeDbWithPricing()
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        429,
        { error: { code: 'too_many_requests', message: 'slow down' } },
        { 'x-request-id': 'nim-429-id' },
      ),
    )
    const client = new NimObservedClient({ apiKey: 'k', fetchImpl })

    let thrown: unknown = null
    try {
      await client.chatCompletion(
        baseReq,
        { model: baseReq.model, messages: [{ role: 'user', content: 'x' }] },
        handle.db,
      )
    } catch (e) {
      thrown = e
    }
    expect(thrown).toBeInstanceOf(NimObservedError)
    expect((thrown as NimObservedError).status).toBe(429)
    expect((thrown as NimObservedError).code).toBe('rate_limited')

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('error')
    expect(params[21]).toBe('rate_limited')
  })

  it('AC.6: HTTP 500 → status=error, error_code=server_error', async () => {
    const handle = makeDbWithPricing()
    const fetchImpl = vi.fn(async () =>
      jsonResponse(500, { error: { code: 'internal', message: 'boom' } }),
    )
    const client = new NimObservedClient({ apiKey: 'k', fetchImpl })

    let thrown: unknown = null
    try {
      await client.chatCompletion(
        baseReq,
        { model: baseReq.model, messages: [{ role: 'user', content: 'x' }] },
        handle.db,
      )
    } catch (e) {
      thrown = e
    }
    expect(thrown).toBeInstanceOf(NimObservedError)
    expect((thrown as NimObservedError).status).toBe(500)
    expect((thrown as NimObservedError).code).toBe('server_error')

    expect(handle.inserts).toHaveLength(1)
    const params = handle.inserts[0].params
    expect(params[20]).toBe('error')
    expect(params[21]).toBe('server_error')
  })
})

describe('NimObservedClient — in-scope models documented in source', () => {
  it('AC.7: file-level comment lists all v1 in-scope NIM models', () => {
    const src = readFileSync(
      join(__dirname, '..', 'nim_observed.ts'),
      'utf8',
    )
    // Pull the file-level comment block (everything before the first `import`).
    const headerEnd = src.indexOf('\nimport ')
    const header = headerEnd === -1 ? src : src.slice(0, headerEnd)

    const required = [
      'meta/llama-3.1-405b-instruct',
      'meta/llama-3.3-70b-instruct',
      'meta/llama-3.1-8b-instruct',
      'deepseek-ai/deepseek-r1',
      'nvidia/llama-3.3-nemotron-super-49b-v1',
      'nvidia/nemotron-3-super-120b-a12b',
    ]
    for (const m of required) {
      expect(header).toContain(m)
    }
  })
})
