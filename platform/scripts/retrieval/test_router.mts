import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

function loadEnv() {
  const p = join('/Users/Dev/Vibe-Coding/Apps/Madhav/platform', '.env.local')
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
loadEnv()

// Read the prompt.ts source and extract the system prompt (crude but works for testing)
const promptSrc = readFileSync('/Users/Dev/Vibe-Coding/Apps/Madhav/platform/src/lib/router/prompt.ts', 'utf8')
// Get FEW_SHOT_EXAMPLES content
const fewShotMatch = promptSrc.match(/const FEW_SHOT_EXAMPLES = `([\s\S]*?)`\s*\/\/ ---/)
const fewShot = fewShotMatch ? fewShotMatch[1] : ''
// Get ROUTER_SYSTEM_PROMPT content  
const sysPromptMatch = promptSrc.match(/export const ROUTER_SYSTEM_PROMPT = `([\s\S]*?)`\s*\/\/ ---/)
const systemPrompt = sysPromptMatch ? sysPromptMatch[1].replace('${FEW_SHOT_EXAMPLES}', fewShot) : ''

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  'What does my Mercury support in my chart?',
  'How do my Mars and Saturn interact?',
]

async function main() {
  for (const query of QUERIES) {
    console.log(`\nQuery: "${query}"`)
    try {
      const resp = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt || 'You are a query classifier. Output JSON.',
        messages: [{ role: 'user', content: `## Query to classify\n${query}\n\naudience_tier: client\nmanifest_fingerprint: test\nquery_plan_id: 00000000-0000-0000-0000-000000000000` }]
      })
      const text = (resp.content[0] as { text: string }).text
      console.log('Raw response:', text.slice(0, 500))
      try {
        const plan = JSON.parse(text)
        console.log('tools_authorized:', plan.tools_authorized)
        console.log('graph_seed_hints:', plan.graph_seed_hints)
        console.log('edge_type_filter:', plan.edge_type_filter)
      } catch {
        console.log('Parse error')
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }
}
main()
