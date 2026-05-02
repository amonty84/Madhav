// Redaction policies for prompt / response / system_prompt capture.
//
// Per OBSERVATORY_PLAN §10 open-decision 5 (and the §9 PII risk row): default
// behavior in this shim is full capture (defaultRedactionPolicy = identity).
// Setting OBSERVATORY_HASH_PROMPTS=true at module-init time switches to
// hashPromptPolicy, which replaces the three text fields with sha256 hex
// digests so an event row records "we saw text of this content-hash" without
// retaining the text itself.
//
// The active policy is resolved once at module init; tests that need to
// exercise the inactive policy import it directly rather than fighting env
// state.

import { createHash } from 'node:crypto'

import type { ObservedLLMRequest, ObservedLLMResponse } from './types'

export type RedactionPolicy = (
  req: ObservedLLMRequest,
  res: ObservedLLMResponse,
) => { request: ObservedLLMRequest; response: ObservedLLMResponse }

export const defaultRedactionPolicy: RedactionPolicy = (req, res) => ({
  request: req,
  response: res,
})

function sha256Hex(value: string | null): string | null {
  if (value === null) return null
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

export const hashPromptPolicy: RedactionPolicy = (req, res) => ({
  request: {
    ...req,
    prompt_text: sha256Hex(req.prompt_text),
    system_prompt: sha256Hex(req.system_prompt),
  },
  response: {
    ...res,
    response_text: sha256Hex(res.response_text),
  },
})

function resolvePolicy(): RedactionPolicy {
  const flag = process.env.OBSERVATORY_HASH_PROMPTS
  if (flag && flag.toLowerCase() === 'true') {
    return hashPromptPolicy
  }
  return defaultRedactionPolicy
}

let _activePolicy: RedactionPolicy = resolvePolicy()

export function getActivePolicy(): RedactionPolicy {
  return _activePolicy
}

// Test-only helper — re-reads the env var and resets the cached policy.
// Not exported through index.ts; tests import it explicitly.
export function __resetActivePolicyForTests(): void {
  _activePolicy = resolvePolicy()
}
