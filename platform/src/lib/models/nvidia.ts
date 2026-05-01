import 'server-only'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'

/**
 * NVIDIA NIM provider — OpenAI-compatible endpoint.
 * Models: Nemotron Ultra 253B, Qwen3-235B-A22B, Llama-3.1-8B.
 * API key: NVIDIA_NIM_API_KEY env variable (required when NVIDIA_PLANNER_ENABLED=true).
 * Free tier available at https://integrate.api.nvidia.com/v1 (rate-limited).
 */
const NVIDIA_NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1'

let _client: ReturnType<typeof createOpenAI> | null = null

function getClient(): ReturnType<typeof createOpenAI> {
  if (!_client) {
    _client = createOpenAI({
      baseURL: NVIDIA_NIM_BASE_URL,
      apiKey: process.env.NVIDIA_NIM_API_KEY ?? '',
    })
  }
  return _client
}

export function getNvidiaModel(modelId: string): LanguageModel {
  return getClient()(modelId) as LanguageModel
}
