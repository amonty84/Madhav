#!/usr/bin/env tsx
/**
 * Quick diagnostic — test the classifier locally with the updated prompt.
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

function loadEnvFile(file: string): void {
  const p = join(process.cwd(), file)
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx < 0) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
loadEnvFile('.env.local')

const QUERIES = [
  'What does my Mercury support in my chart?',
  'How do my Mars and Saturn interact?',
  'What does my Saturn dasha bring next?',
  'Are there contradictions in my chart?',
  'Explain my chart in general terms.',
]

async function main() {
  const { ROUTER_SYSTEM_PROMPT, buildRouterUserMessage } = await import('../../src/lib/router/prompt.js')
  const { generateText } = await import('ai')
  const { createAnthropic } = await import('@ai-sdk/anthropic')

  const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const model = anthropic('claude-haiku-4-5')

  console.log('=== Local classify test ===')
  console.log(`System prompt length: ${ROUTER_SYSTEM_PROMPT.length} chars`)
  console.log()

  for (const query of QUERIES) {
    console.log(`Query: "${query}"`)
    try {
      const result = await generateText({
        model,
        system: ROUTER_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildRouterUserMessage({ query, audienceTier: 'super_admin' }) }],
        temperature: 0.0,
        maxOutputTokens: 1024,
      })
      const raw = result.text
      // Strip markdown fences (same as router.ts extractJson)
      const stripped = raw.trim()
      const fenceMatch = stripped.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/)
      const text = fenceMatch ? fenceMatch[1].trim() : stripped
      try {
        const plan = JSON.parse(text)
        console.log(`  class:         ${plan.query_class}`)
        console.log(`  tools:         ${JSON.stringify(plan.tools_authorized)}`)
        console.log(`  seeds:         ${JSON.stringify(plan.graph_seed_hints)}`)
        console.log(`  edge_filter:   ${JSON.stringify(plan.edge_type_filter)}`)
      } catch {
        console.log(`  PARSE ERROR — first 500 chars: ${text.slice(0, 500)}`)
      }
    } catch (err) {
      console.error(`  LLM ERROR: ${err}`)
    }
    console.log()
  }
}

main().catch(err => {
  console.error('FAILED:', err)
  process.exit(1)
})
