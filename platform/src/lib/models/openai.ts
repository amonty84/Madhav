import 'server-only'
import { openai } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'

export function getOpenAIModel(modelId: string): LanguageModel {
  return openai(modelId)
}
