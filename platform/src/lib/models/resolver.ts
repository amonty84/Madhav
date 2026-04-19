import 'server-only'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { deepseek } from '@ai-sdk/deepseek'
import type { LanguageModel } from 'ai'
import { getModelMeta } from './registry'

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
      return deepseek(meta.id)
    default: {
      const _exhaustive: never = meta.provider
      throw new Error(`Unhandled provider: ${String(_exhaustive)}`)
    }
  }
}
