import 'server-only'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { deepseek } from '@ai-sdk/deepseek'
import { extractReasoningMiddleware, wrapLanguageModel } from 'ai'
import type { LanguageModel } from 'ai'
import { getModelMeta, getWorkerForModel } from './registry'
import { getOpenAIModel } from './openai'
import { getNvidiaModel } from './nvidia'

// DeepSeek R1 wraps its chain-of-thought in <think>…</think> blocks.
// The middleware separates them into the reasoning stream-part channel so
// they never leak into the displayed answer text. R1 uses the standard
// streamText path (not o-series convention) — only the middleware differs.
const R1_REASONING_MIDDLEWARE = extractReasoningMiddleware({ tagName: 'think' })

/**
 * Resolve a model ID to a `LanguageModel` for `streamText`.
 * Server-only — provider SDKs must never land in the client bundle.
 * Validate the ID with `isValidModelId` (from registry) before calling.
 *
 * All models use the standard AI SDK streamText calling convention:
 * system message + user messages + temperature + tool-use (where capable).
 * The o-series convention (folded system prompt, no temperature, no streaming)
 * has been removed — o1/o3/o4-mini are no longer in the registry.
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
      // R1 (deepseek-reasoner) gets the think-strip middleware; V3 is plain.
      if (meta.id === 'deepseek-reasoner') {
        return wrapLanguageModel({
          model: deepseek(meta.id),
          middleware: R1_REASONING_MIDDLEWARE,
        })
      }
      return deepseek(meta.id)
    case 'openai':
      return getOpenAIModel(meta.id)
    case 'nvidia':
      // NVIDIA NIM — OpenAI-compatible endpoint. Models in this provider are
      // planner-only (role='planner') and are never called from synthesis paths.
      // Requires NVIDIA_NIM_API_KEY env variable.
      return getNvidiaModel(meta.id)
    default: {
      const _exhaustive: never = meta.provider
      throw new Error(`Unhandled provider: ${String(_exhaustive)}`)
    }
  }
}

/**
 * Resolve the worker model for a given synthesis model — same provider family,
 * cheapest/fastest option. Used by the planner and title generator so that
 * internal LLM calls bill the same provider the user already has credentials
 * for (BHISMA ADR-1 / FAMILY_WORKER pattern).
 */
export function resolveWorkerModel(synthesisModelId: string): string {
  return getWorkerForModel(synthesisModelId)
}
