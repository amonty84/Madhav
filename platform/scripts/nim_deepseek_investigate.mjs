/**
 * nim_deepseek_investigate.mjs
 *
 * Deep investigation of DeepSeek V4 Pro / Flash availability on NVIDIA NIM.
 *
 * Three-phase approach:
 *   Phase 1 — Catalog scan: list every model on the free endpoint, find all
 *             DeepSeek entries. The ID we've been using might be wrong.
 *   Phase 2 — ID variants: try alternate model ID strings (date-stamped,
 *             different prefixes) with a 60s timeout (cold-start can be slow).
 *   Phase 3 — Calling convention: try streaming=true, different param shapes,
 *             and the v1/completions (legacy) endpoint — some NIM models
 *             only respond on specific endpoint paths.
 *
 * Usage:  node scripts/nim_deepseek_investigate.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath   = resolve(__dirname, '../.env.local')
let apiKey = ''
try {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^NVIDIA_NIM_API_KEY\s*=\s*(.+)$/)
    if (m) { apiKey = m[1].trim(); break }
  }
} catch {}
if (!apiKey) { console.error('NVIDIA_NIM_API_KEY not found'); process.exit(1) }

const BASE = 'https://integrate.api.nvidia.com/v1'
console.log(`Key: ${apiKey.slice(0, 12)}…`)
console.log(`Time: ${new Date().toISOString()}\n`)

// ── Shared fetch helper ──────────────────────────────────────────────────────
async function req(url, body, timeoutMs = 60_000) {
  const ac = new AbortController()
  const t  = setTimeout(() => ac.abort(), timeoutMs)
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    })
    clearTimeout(t)
    const ms = Date.now() - start
    if (res.ok) {
      let content = '(empty)'
      try {
        // For streaming responses, read the first chunk
        if (body.stream) {
          const text = await res.text()
          const firstData = text.split('\n').find(l => l.startsWith('data: ') && !l.includes('[DONE]'))
          if (firstData) {
            const chunk = JSON.parse(firstData.replace('data: ', ''))
            content = chunk?.choices?.[0]?.delta?.content ?? chunk?.choices?.[0]?.message?.content ?? '(stream chunk)'
          }
        } else {
          const data = await res.json()
          content = data?.choices?.[0]?.message?.content?.trim().slice(0, 40) ?? '(empty)'
        }
      } catch { content = '(parse error)' }
      return { ok: true, ms, result: `✅  HTTP 200 in ${ms}ms — "${content}"` }
    }
    const txt = await res.text().catch(() => '').then(t => t.slice(0, 150).replace(/\n/g, ' '))
    const sym = res.status === 404 ? '❌' : res.status === 410 ? '☠️' : res.status === 429 ? '🔁' : '⚠️'
    return { ok: false, ms, result: `${sym}  HTTP ${res.status} in ${ms}ms — ${txt}` }
  } catch (err) {
    clearTimeout(t)
    const ms = Date.now() - start
    return { ok: false, ms, result: `⏱   Timeout/abort after ${ms}ms — ${err.message?.slice(0,60)}` }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1 — Catalog scan
// ═══════════════════════════════════════════════════════════════════════════
console.log('═══ PHASE 1: NIM catalog scan — all DeepSeek models ═══\n')

try {
  const ac = new AbortController()
  setTimeout(() => ac.abort(), 20_000)
  const res = await fetch(`${BASE}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: ac.signal,
  })
  if (!res.ok) {
    console.log(`Catalog: HTTP ${res.status} — ${(await res.text().catch(() => '')).slice(0,100)}\n`)
  } else {
    const { data = [] } = await res.json()
    console.log(`Total models on NIM free tier: ${data.length}`)

    const deepseekModels = data.filter(m => m.id.toLowerCase().includes('deepseek'))
    if (deepseekModels.length === 0) {
      console.log('\n⚠️  NO DeepSeek models in catalog — NIM free tier has removed them entirely.')
      console.log('All model IDs on the endpoint:\n')
      for (const m of data) console.log(`  ${m.id}`)
    } else {
      console.log(`\nDeepSeek models found in catalog (${deepseekModels.length}):`)
      for (const m of deepseekModels) {
        const ctx = m.context_window ?? m.max_context ?? m.maxContextLength ?? '?'
        console.log(`  ${m.id}  (context: ${ctx})`)
      }
      console.log('\nAll model IDs (for reference):')
      for (const m of data) console.log(`  ${m.id}`)
    }
  }
} catch (e) {
  console.log(`Catalog fetch failed: ${e.message}`)
  console.log('(proceeding to Phase 2 with manual probes)\n')
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2 — Model ID variants (60s timeout — cold-start can be slow)
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n═══ PHASE 2: DeepSeek model ID variants (60s timeout each) ═══\n')

const ID_VARIANTS = [
  // ── What we've been using (to confirm timeout is reproducible) ───────────
  { id: 'deepseek-ai/deepseek-v4-pro',          note: 'current ID (was timeout)' },
  { id: 'deepseek-ai/deepseek-v4-flash',        note: 'current ID (was timeout)' },
  // ── Date-versioned variants (NIM sometimes uses these) ───────────────────
  { id: 'deepseek-ai/deepseek-v4-0520',         note: 'date-versioned May 2025' },
  { id: 'deepseek-ai/deepseek-v4-0516',         note: 'date-versioned alt' },
  { id: 'deepseek-ai/deepseek-v4',              note: 'no suffix' },
  { id: 'deepseek-ai/deepseek-v4-pro-0520',     note: 'pro + date' },
  // ── NIM sometimes uses "nvidia/" prefix for partner models ───────────────
  { id: 'nvidia/deepseek-v4-pro',               note: 'nvidia/ prefix' },
  { id: 'nvidia/deepseek-v4-flash',             note: 'nvidia/ prefix flash' },
  // ── Older confirmed variants that might alias to V4 ─────────────────────
  { id: 'deepseek-ai/deepseek-r1',              note: 'R1 reasoning (671B) — was it re-listed?' },
  { id: 'deepseek-ai/deepseek-v3-0324',         note: 'V3 Mar-2025 — still alive?' },
  { id: 'deepseek-ai/deepseek-r1-0528',         note: 'R1 0528 — was EOL, re-check' },
]

const PAD = Math.max(...ID_VARIANTS.map(v => v.id.length)) + 2
for (const v of ID_VARIANTS) {
  process.stdout.write(`  ${v.id.padEnd(PAD)}  ${v.note.padEnd(38)}  `)
  const r = await req(`${BASE}/chat/completions`, {
    model: v.id,
    messages: [{ role: 'user', content: '1+1=?' }],
    max_tokens: 8,
    stream: false,
  }, 60_000)
  console.log(r.result)
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3 — Calling convention variants on the most promising IDs
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n═══ PHASE 3: Calling convention variants ═══\n')

// Pick the IDs that either timed out (might just need streaming) or are candidates
const PHASE3_IDS = ['deepseek-ai/deepseek-v4-pro', 'deepseek-ai/deepseek-v4-0520']

for (const modelId of PHASE3_IDS) {
  console.log(`── ${modelId} ──`)

  // 3a. Streaming request (some NIM models only return headers via SSE)
  process.stdout.write(`  stream=true, max_tokens=8, 30s timeout          `)
  const s = await req(`${BASE}/chat/completions`, {
    model: modelId, messages: [{ role: 'user', content: '1+1=?' }],
    max_tokens: 8, stream: true,
  }, 30_000)
  console.log(s.result)

  // 3b. Very small max_tokens with temperature=0
  process.stdout.write(`  stream=false, max_tokens=1, temp=0, 30s         `)
  const t = await req(`${BASE}/chat/completions`, {
    model: modelId, messages: [{ role: 'user', content: '2' }],
    max_tokens: 1, temperature: 0, stream: false,
  }, 30_000)
  console.log(t.result)

  // 3c. Legacy /v1/completions endpoint (not chat)
  process.stdout.write(`  /v1/completions (legacy), 30s                   `)
  const l = await req(`${BASE}/completions`, {
    model: modelId, prompt: '1+1=', max_tokens: 4, stream: false,
  }, 30_000)
  console.log(l.result)

  console.log()
}

console.log('Investigation complete.')
