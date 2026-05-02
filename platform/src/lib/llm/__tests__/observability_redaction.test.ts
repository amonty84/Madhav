// Tests — redaction policies.
// Cases (per USTAD_S1_2 brief acceptance list 4–5):
//   4. defaultRedactionPolicy is identity (no field changes).
//   5. hashPromptPolicy replaces prompt_text / response_text / system_prompt
//      with sha256 hex; all other fields unchanged.

import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'

import {
  defaultRedactionPolicy,
  hashPromptPolicy,
} from '../observability/redaction'
import type {
  ObservedLLMRequest,
  ObservedLLMResponse,
} from '../observability/types'

const sampleReq: ObservedLLMRequest = {
  provider: 'anthropic',
  model: 'claude-opus-4-6',
  prompt_text: 'What is the capital of France?',
  system_prompt: 'You are a helpful assistant.',
  parameters: { temperature: 0.7, max_tokens: 100 },
  conversation_id: 'conv-1',
  conversation_name: 'Geography quiz',
  prompt_id: 'prompt-1',
  parent_prompt_id: 'prompt-0',
  user_id: 'user-1',
  pipeline_stage: 'classify',
}

const sampleRes: ObservedLLMResponse = {
  response_text: 'The capital of France is Paris.',
  usage: {
    input_tokens: 10,
    output_tokens: 8,
    cache_read_tokens: 0,
    cache_write_tokens: 0,
    reasoning_tokens: 0,
  },
  provider_request_id: 'req-anthropic-abc',
  status: 'success',
  started_at: new Date('2026-05-03T12:00:00Z'),
  finished_at: new Date('2026-05-03T12:00:01Z'),
}

function sha256(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex')
}

describe('defaultRedactionPolicy', () => {
  it('is the identity function (no field changes)', () => {
    const { request, response } = defaultRedactionPolicy(sampleReq, sampleRes)

    expect(request).toEqual(sampleReq)
    expect(response).toEqual(sampleRes)
  })
})

describe('hashPromptPolicy', () => {
  it('replaces prompt_text, response_text, system_prompt with sha256 hex; leaves other fields intact', () => {
    const { request, response } = hashPromptPolicy(sampleReq, sampleRes)

    expect(request.prompt_text).toBe(sha256(sampleReq.prompt_text!))
    expect(request.system_prompt).toBe(sha256(sampleReq.system_prompt!))
    expect(response.response_text).toBe(sha256(sampleRes.response_text!))

    expect(request.provider).toBe(sampleReq.provider)
    expect(request.model).toBe(sampleReq.model)
    expect(request.parameters).toEqual(sampleReq.parameters)
    expect(request.conversation_id).toBe(sampleReq.conversation_id)
    expect(request.conversation_name).toBe(sampleReq.conversation_name)
    expect(request.prompt_id).toBe(sampleReq.prompt_id)
    expect(request.parent_prompt_id).toBe(sampleReq.parent_prompt_id)
    expect(request.user_id).toBe(sampleReq.user_id)
    expect(request.pipeline_stage).toBe(sampleReq.pipeline_stage)

    expect(response.usage).toEqual(sampleRes.usage)
    expect(response.provider_request_id).toBe(sampleRes.provider_request_id)
    expect(response.status).toBe(sampleRes.status)
    expect(response.started_at).toEqual(sampleRes.started_at)
    expect(response.finished_at).toEqual(sampleRes.finished_at)
  })

  it('preserves null values without hashing', () => {
    const reqWithNulls: ObservedLLMRequest = {
      ...sampleReq,
      prompt_text: null,
      system_prompt: null,
    }
    const resWithNull: ObservedLLMResponse = {
      ...sampleRes,
      response_text: null,
    }

    const { request, response } = hashPromptPolicy(reqWithNulls, resWithNull)
    expect(request.prompt_text).toBeNull()
    expect(request.system_prompt).toBeNull()
    expect(response.response_text).toBeNull()
  })
})
