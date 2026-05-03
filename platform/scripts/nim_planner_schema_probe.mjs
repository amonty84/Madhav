#!/usr/bin/env node
/**
 * nim_planner_schema_probe.mjs
 *
 * Phase 1 (ran 2026-05-03): confirmed NIM accepts PlanInputJsonSchema with
 * integer enum, min/max, and minimal payload — all ✅ HTTP 200.
 * Diagnosis: schema itself is NOT the issue.
 *
 * Phase 2 (this file): mirror the real callLlmPlanner() call as closely as
 * possible to isolate what causes the live HTTP 500.
 *
 * Differences between probe phase 1 and the real call:
 *   D1 — system prompt: real call loads §3 + §4 from PLANNER_PROMPT_v1_0.md
 *   D2 — user payload:  real call sends { native_id, manifest, history, query }
 *         where manifest = compressedManifestToString() (8 tools, ≤12K chars)
 *   D3 — max_tokens:    real call does NOT set it (probe phase 1 set 512)
 *   D4 — model:         real call uses the model from resolveModel(plannerModelId)
 *
 * Test matrix:
 *   P1 — small system + small user + no max_tokens (isolate D3)
 *   P2 — real system prompt + small user + no max_tokens (add D1)
 *   P3 — real system prompt + real user payload + no max_tokens (add D2)
 *   P4 — real system prompt + real user payload + max_tokens:512 (add back limit)
 *
 * Usage (run from repo root — Madhav/):
 *   NVIDIA_NIM_API_KEY=<key> node platform/scripts/nim_planner_schema_probe.mjs
 *
 * The script reads PLANNER_PROMPT_v1_0.md and CAPABILITY_MANIFEST.json from
 * the repo root (relative to cwd).
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = 'https://integrate.api.nvidia.com/v1'
const MODEL    = 'nvidia/llama-3.3-nemotron-super-49b-v1'
const API_KEY  = process.env.NVIDIA_NIM_API_KEY

if (!API_KEY) {
  console.error('ERROR: NVIDIA_NIM_API_KEY not set')
  process.exit(1)
}

// ── Full PlanInputJsonSchema (exact copy from manifest_planner.ts) ────────────

const PLAN_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    query_class: {
      type: 'string',
      enum: ['remedial', 'interpretive', 'predictive', 'holistic', 'planetary', 'single_answer'],
    },
    query_intent_summary: { type: 'string' },
    tool_calls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tool_name:    { type: 'string' },
          params:       { type: 'object' },
          token_budget: { type: 'integer', minimum: 100, maximum: 2000 },
          priority:     { type: 'integer', minimum: 1, maximum: 3 },   // fixed
          reason:       { type: 'string' },
        },
        required: ['tool_name', 'params', 'token_budget', 'priority', 'reason'],
      },
    },
  },
  required: ['query_class', 'query_intent_summary', 'tool_calls'],
}

// ── Load real system prompt (§3 + §4 from PLANNER_PROMPT_v1_0.md) ─────────────

function extractSystemPromptBody(md) {
  const headerIdx = md.indexOf('## 3. System prompt')
  if (headerIdx < 0) throw new Error('§3 header not found')
  const fenceOpen = md.indexOf('```', headerIdx)
  if (fenceOpen < 0) throw new Error('§3 opening fence not found')
  const bodyStart = md.indexOf('\n', fenceOpen) + 1
  const fenceClose = md.indexOf('```', bodyStart)
  if (fenceClose < 0) throw new Error('§3 closing fence not found')
  return md.slice(bodyStart, fenceClose).trimEnd()
}

function extractFewShotSection(md) {
  const startIdx = md.indexOf('## 4. Few-shot examples')
  if (startIdx < 0) throw new Error('§4 header not found')
  const endIdx = md.indexOf('\n## 5.', startIdx)
  if (endIdx < 0) throw new Error('§5 boundary not found')
  return md.slice(startIdx, endIdx).trimEnd()
}

const QUERY_CLASS_EXTENSION = `
Output schema extension (W2-PLANNER):

  In addition to the schema above, also include a top-level \`query_class\`
  field. Pick exactly one of: "remedial" | "interpretive" | "predictive" |
  "holistic" | "planetary" | "single_answer". This field drives downstream
  bundle assembly and synthesis-guidance routing.`

let REAL_SYSTEM_PROMPT
try {
  const promptPath = join(process.cwd(), '00_ARCHITECTURE', 'PLANNER_PROMPT_v1_0.md')
  const md = readFileSync(promptPath, 'utf-8')
  const body     = extractSystemPromptBody(md)
  const fewShots = extractFewShotSection(md)
  REAL_SYSTEM_PROMPT = `${body}\n${QUERY_CLASS_EXTENSION}\n\n---\n\n${fewShots}\n`
  console.log(`✓ Loaded real system prompt — ${REAL_SYSTEM_PROMPT.length} chars (~${Math.ceil(REAL_SYSTEM_PROMPT.length/4)} tokens)`)
} catch (err) {
  console.warn(`⚠  Could not load PLANNER_PROMPT_v1_0.md: ${err.message}`)
  REAL_SYSTEM_PROMPT = 'You are a planner. Call the submit_plan tool exactly once.'
}

// ── Load real manifest and build compressed form ───────────────────────────────

const PRIMARY_TOOL_NAMES = [
  'remedial_codex_query', 'msr_sql', 'pattern_register',
  'contradiction_register', 'resonance_register', 'cluster_atlas',
  'cgm_graph_walk', 'vector_search',
]

function compressManifest(manifest) {
  const entries = manifest.entries ?? []
  return PRIMARY_TOOL_NAMES
    .map(name => entries.find(e => e.tool_name === name || e.canonical_id === name))
    .filter(Boolean)
    .map(e => ({
      t: e.tool_name ?? e.canonical_id,
      d: (e.tool_description ?? e.description ?? '').split(/\s+/).slice(0, 15).join(' '),
      p: Object.keys(e.query_schema?.properties ?? {}),
      c: e.token_cost_hint ?? 'med',
      a: e.linked_data_asset_id ?? '',
    }))
}

let REAL_USER_PAYLOAD
try {
  const manifestPath = join(process.cwd(), '00_ARCHITECTURE', 'CAPABILITY_MANIFEST.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  const compressed = compressManifest(manifest)
  REAL_USER_PAYLOAD = JSON.stringify({
    native_id: 'probe-realistic',
    manifest: compressed,
    history: { turns: [], was_summarized: false },
    query: 'What is the strength of the lagna lord and how does it affect career prospects?',
  })
  console.log(`✓ Loaded real user payload — ${REAL_USER_PAYLOAD.length} chars (~${Math.ceil(REAL_USER_PAYLOAD.length/4)} tokens)`)
} catch (err) {
  console.warn(`⚠  Could not load CAPABILITY_MANIFEST.json: ${err.message}`)
  REAL_USER_PAYLOAD = JSON.stringify({
    native_id: 'probe-fallback',
    manifest: [],
    history: { turns: [], was_summarized: false },
    query: 'What is the strength of the lagna lord?',
  })
}

// ── Shared tool definition ────────────────────────────────────────────────────

const TOOL = {
  type: 'function',
  function: {
    name: 'submit_plan',
    description: 'Submit the planned tool calls for the native query. Call this exactly once with the full plan; do not emit prose.',
    parameters: PLAN_INPUT_SCHEMA,
  },
}

// ── Probe runner ─────────────────────────────────────────────────────────────

async function probe(label, { system, userContent, maxTokens }) {
  console.log(`\n${'─'.repeat(70)}`)
  console.log(`PROBE: ${label}`)
  const sysLen  = system.length
  const userLen = userContent.length
  const total   = sysLen + userLen
  console.log(`  system=${sysLen}c (~${Math.ceil(sysLen/4)}t)  user=${userLen}c (~${Math.ceil(userLen/4)}t)  total=~${Math.ceil(total/4)}t  max_tokens=${maxTokens ?? '(none)'}`)

  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: userContent },
    ],
    tools: [TOOL],
    tool_choice: 'required',
    temperature: 0,
    ...(maxTokens != null ? { max_tokens: maxTokens } : {}),
  }

  const start = Date.now()
  try {
    const resp = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    })

    const latency = Date.now() - start
    const text = await resp.text()

    if (resp.ok) {
      let parsed
      try { parsed = JSON.parse(text) } catch { parsed = null }
      const toolCalls = parsed?.choices?.[0]?.message?.tool_calls ?? []
      console.log(`  ✅  HTTP ${resp.status} — ${latency}ms — tool_calls=${toolCalls.length}`)
      if (toolCalls.length > 0) {
        try {
          const args = JSON.parse(toolCalls[0].function.arguments)
          console.log(`      query_class=${args.query_class}  planned=${args.tool_calls?.length ?? 0} tools`)
        } catch { /* ok */ }
      }
    } else {
      console.log(`  ❌  HTTP ${resp.status} — ${latency}ms`)
      console.log(`      ${text.slice(0, 500)}`)
    }
  } catch (err) {
    const latency = Date.now() - start
    console.log(`  💥  Exception — ${latency}ms — ${err.message}`)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const SMALL_SYSTEM = 'You are a planner. Call the submit_plan tool exactly once.'
const SMALL_USER   = JSON.stringify({
  native_id: 'probe-small',
  manifest: [],
  history: { turns: [], was_summarized: false },
  query: 'What is the lagna lord?',
})

async function main() {
  console.log(`\nNIM Planner Schema Probe — Phase 2 (realistic payload)`)
  console.log(`Model: ${MODEL}`)

  // P1 — control: small everything, no max_tokens
  await probe('P1 — small system + small user + no max_tokens (D3 only)', {
    system: SMALL_SYSTEM, userContent: SMALL_USER, maxTokens: null
  })

  // P2 — add real system prompt
  await probe('P2 — REAL system + small user + no max_tokens (D1 + D3)', {
    system: REAL_SYSTEM_PROMPT, userContent: SMALL_USER, maxTokens: null
  })

  // P3 — add real user payload (no max_tokens) — mirrors real callLlmPlanner() exactly
  await probe('P3 — REAL system + REAL user + no max_tokens (D1+D2+D3) [mirrors real call]', {
    system: REAL_SYSTEM_PROMPT, userContent: REAL_USER_PAYLOAD, maxTokens: null
  })

  // P4 — real everything + add back max_tokens guard
  await probe('P4 — REAL system + REAL user + max_tokens:512', {
    system: REAL_SYSTEM_PROMPT, userContent: REAL_USER_PAYLOAD, maxTokens: 512
  })

  console.log(`\n${'─'.repeat(70)}`)
  console.log('INTERPRETATION:')
  console.log('  P1=✅ P2=❌          → system prompt content triggers 500')
  console.log('  P1=✅ P2=✅ P3=❌    → manifest payload triggers 500 (size or content)')
  console.log('  P1=✅ P2=✅ P3=❌ P4=✅ → missing max_tokens causes 500 with large payloads')
  console.log('  P1=❌               → model/API down, or max_tokens required even for small payload')
  console.log('  all ✅              → issue is AI SDK request shape (not content) — add max_tokens guard anyway')
}

main().catch(err => { console.error(err); process.exit(1) })
