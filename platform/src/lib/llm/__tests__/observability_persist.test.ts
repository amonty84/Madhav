// Tests — persistObservation.
// Cases (per USTAD_S1_2 brief acceptance list 6):
//   6. persistObservation returns null on DB error without throwing.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { persistObservation } from '../observability/persist'
import type {
  CostResult,
  ObservatoryDb,
  ObservedLLMRequest,
  ObservedLLMResponse,
} from '../observability/types'

const req: ObservedLLMRequest = {
  provider: 'openai',
  model: 'gpt-4.1',
  prompt_text: 'hi',
  system_prompt: null,
  parameters: { temperature: 0.5 },
  conversation_id: 'conv-9',
  conversation_name: null,
  prompt_id: 'prompt-9',
  user_id: 'user-9',
  pipeline_stage: 'synthesize',
}

const res: ObservedLLMResponse = {
  response_text: 'hello',
  usage: {
    input_tokens: 5,
    output_tokens: 2,
    cache_read_tokens: 0,
    cache_write_tokens: 0,
    reasoning_tokens: 0,
  },
  provider_request_id: 'req-x',
  status: 'success',
  started_at: new Date('2026-05-03T10:00:00Z'),
  finished_at: new Date('2026-05-03T10:00:00.250Z'),
}

const cost: CostResult = {
  computed_cost_usd: 0.000025,
  pricing_version_id: 'pv-input-test',
}

describe('persistObservation', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('returns null when the DB query throws — never propagates', async () => {
    const db: ObservatoryDb = {
      query: vi.fn(async () => {
        throw new Error('connection refused')
      }),
    }

    const result = await persistObservation(req, res, cost, db)
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('returns the inserted row when the DB query succeeds', async () => {
    const fakeRow = {
      event_id: '00000000-0000-0000-0000-000000000001',
      conversation_id: req.conversation_id,
      conversation_name: null,
      prompt_id: req.prompt_id,
      parent_prompt_id: null,
      user_id: req.user_id,
      provider: req.provider,
      model: req.model,
      pipeline_stage: req.pipeline_stage,
      prompt_text: req.prompt_text,
      response_text: res.response_text,
      system_prompt: null,
      parameters: req.parameters,
      input_tokens: 5,
      output_tokens: 2,
      cache_read_tokens: 0,
      cache_write_tokens: 0,
      reasoning_tokens: 0,
      computed_cost_usd: cost.computed_cost_usd,
      pricing_version_id: cost.pricing_version_id,
      latency_ms: 250,
      status: 'success',
      error_code: null,
      provider_request_id: 'req-x',
      started_at: res.started_at.toISOString(),
      finished_at: res.finished_at.toISOString(),
      feature_flag_state: null,
      client_ip_hash: null,
      created_at: '2026-05-03T10:00:00.300Z',
    }

    const queryMock = vi.fn(async () => ({ rows: [fakeRow], rowCount: 1 }))
    const db: ObservatoryDb = { query: queryMock as unknown as ObservatoryDb['query'] }

    const result = await persistObservation(req, res, cost, db)
    expect(result).toEqual(fakeRow)
    expect(queryMock).toHaveBeenCalledTimes(1)

    const callArgs = queryMock.mock.calls[0] as unknown as [string, unknown[]]
    const params = callArgs[1]
    expect(params).toBeDefined()
    expect(params[5]).toBe('openai')
    expect(params[6]).toBe('gpt-4.1')
    expect(params[17]).toBe(cost.computed_cost_usd)
    expect(params[18]).toBe(cost.pricing_version_id)
    expect(params[19]).toBe(250)
    expect(params[20]).toBe('success')
  })
})
