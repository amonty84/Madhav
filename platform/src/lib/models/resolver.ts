import 'server-only'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { deepseek } from '@ai-sdk/deepseek'
import { extractReasoningMiddleware, wrapLanguageModel } from 'ai'
import type { LanguageModel } from 'ai'
import { getModelMeta, getWorkerForModel } from './registry'
import { getOpenAIModel } from './openai'

// BHISMA-B1 §3.4 — wrap DeepSeek R1 with the AI-SDK reasoning-extraction
// middleware so <think>…</think> content is separated into the reasoning
// stream-part channel and never leaks into the displayed answer text.
const R1_REASONING_MIDDLEWARE = extractReasoningMiddleware({ tagName: 'think' })

/**
 * Resolve a model ID to a `LanguageModel` for `streamText` / `generateText`.
 * Server-only — the provider SDKs ship Node-only code and must never land in
 * the client bundle. Validate the ID with `isValidModelId` (from registry)
 * before calling this, so unknown IDs don't reach here.
 */
export function resolveModel(id: string): LanguageModel {
  const meta = getModelMeta(id)
  if (!meta) throw new Error(`Unknown model id: ${id}`)
  switch (meta.provider) {
    case 'anthropic':
      return anthropic(meta.id)
    case 'google':
      return google(meta.id)
    case 'deepseek':
      if (meta.id === 'deepseek-reasoner') {
        return wrapLanguageModel({
          model: deepseek(meta.id),
          middleware: R1_REASONING_MIDDLEWARE,
        })
      }
      return deepseek(meta.id)
    case 'openai':
      return getOpenAIModel(meta.id)
    default: {
      const _exhaustive: never = meta.provider
      throw new Error(`Unhandled provider: ${String(_exhaustive)}`)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BHISMA-B1 §3.2 — Reasoning model + worker resolution helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * True for OpenAI o-series models (o1, o3, o4-mini). The synthesis path must
 * branch on this: no system prompt (folded into first user message), no
 * temperature param, tool-use only when the model's capabilities allow,
 * and (for o1) a non-streaming generateText path.
 */
export function isReasoningModel(modelId: string): boolean {
  return getModelMeta(modelId)?.callingConvention === 'reasoning'
}

/**
 * Returns true if the model can stream tokens. Defaults to true unless the
 * registry explicitly marks `supportsStreaming: false` (today only o1).
 */
export function supportsStreaming(modelId: string): boolean {
  return getModelMeta(modelId)?.supportsStreaming !== false
}

/**
 * Resolve the worker model for a given synthesis model — same family, cheapest
 * option. The router uses this so the planning step bills the same provider
 * the user's synthesis pick already uses (BHISMA-B1 ADR-1).
 */
export function resolveWorkerModel(synthesisModelId: string): string {
  return getWorkerForModel(synthesisModelId)
}
