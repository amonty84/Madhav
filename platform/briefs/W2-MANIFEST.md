---
status: COMPLETE
session: W2-MANIFEST
scope: UQE-4a (manifest compressor) + UQE-4b (planner context builder) + UQE-8 (manifest metadata)
authored: 2026-05-01
round: 1
critical_path: true
blocks: W2-PLANNER (Round 2)
---

# CLAUDECODE_BRIEF — W2-MANIFEST
## Manifest Compressor + Planner Prerequisites

Read CLAUDE.md §0 first. Copy this file to the project root as
`CLAUDECODE_BRIEF.md` before opening the session.

---

## Why this session exists

The LLM-first planner (W2-PLANNER, Round 2) cannot be built until:
1. A compressed manifest format exists that fits the full 108-tool capability
   manifest into ~2–3K tokens (vs ~21K raw) — otherwise planner input blows
   past Haiku's context budget before the query even appears (Gap G5).
2. A planner context builder exists that limits conversation history to
   ≤600 tokens (Gap G11).
3. CAPABILITY_MANIFEST.json has complete per-tool metadata that the compressor
   and planner can rely on (UQE-8 prerequisite).

This session delivers all three. W2-PLANNER is gated on this session closing.

---

## Acceptance criteria

### AC.M.1 — CAPABILITY_MANIFEST metadata (UQE-8)

Add three fields to every tool entry in `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`:

```json
{
  "query_schema": {
    "type": "object",
    "properties": { ... },   // param names + types only; no descriptions
    "required": [...]
  },
  "token_cost_hint": "low" | "med" | "hi",
  "linked_data_asset_id": "string"  // e.g. "MSR_v3_0", "REMEDIAL_CODEX_v2_0"
}
```

- All 8 primary tools must have complete entries (remedial_codex_query,
  msr_sql, pattern_register, contradiction_register, resonance_register,
  cluster_atlas, cgm_graph_walk, vector_search).
- Manifest validates against the schema validator: `python scripts/governance/schema_validator.py`.
- Acceptance: `npx tsc --noEmit` clean; manifest JSON parses without error.

### AC.M.2 — Compressed manifest format (UQE-4a, part 1)

New file: `platform/src/lib/pipeline/manifest_compressor.ts`

Must export:
```typescript
export interface CompressedEntry {
  t: string          // tool_name
  d: string          // ≤15-word description
  p: string[]        // param names only (not full schema)
  c: 'low' | 'med' | 'hi'   // token_cost_hint
  a: string          // linked_data_asset_id
}

export function compressManifest(manifest: CapabilityManifest): CompressedEntry[]
export function compressedManifestToString(entries: CompressedEntry[]): string
// Returns a compact JSON string. Target: ≤3K tokens (≤12K chars) for 8 tools.
```

- `compressedManifestToString()` output must be ≤3,000 tokens when measured
  as `Math.ceil(output.length / 4)`.
- Unit test: `tests/pipeline/manifest_compressor.test.ts`
  - Asserts token count ≤ 3000 for the live manifest.
  - Asserts each entry has all 5 fields.
  - Asserts all 8 primary tools are present.

### AC.M.3 — Planner prompt document (UQE-4a, part 2)

New file: `00_ARCHITECTURE/PLANNER_PROMPT_v1_0.md`

Must contain:
- Complete system prompt text for the LLM-first planner (ready to copy into code).
- JSON schema for `PlanSchema` (the structured output the planner must emit).
- Two few-shot examples: one remedial query, one interpretive query.
- Token budget spec: system_prompt + compressed_manifest + history + query ≤ 5K tokens.
- Evaluation rubric (5 criteria, each scored 0–2).

The PlanSchema must define:
```typescript
interface PlanSchema {
  query_intent_summary: string   // ≤20 words
  tool_calls: Array<{
    tool_name: string
    params: Record<string, unknown>
    token_budget: number   // 100–2000
    priority: 1 | 2 | 3
    reason: string         // ≤15 words
  }>
}
```

### AC.M.4 — Planner context builder (UQE-4b)

New file: `platform/src/lib/pipeline/planner_context_builder.ts`

Must export:
```typescript
export interface PlannerContext {
  query: string
  history_turns: Array<{ role: 'user' | 'assistant'; content: string }>
  history_was_summarized: boolean
  total_estimated_tokens: number
}

export async function buildPlannerContext(
  query: string,
  conversationHistory: Array<{ role: string; content: string }>,
  workerModelId: string,
): Promise<PlannerContext>
```

Rules:
- Take last 2 turns max.
- Each turn capped at 300 tokens (`Math.ceil(content.length / 4)`).
- If combined history > 600 tokens: call `workerModelId` to summarize to ≤150 tokens.
  Flag `history_was_summarized: true`.
- If history empty: return empty `history_turns`, `history_was_summarized: false`.
- `total_estimated_tokens` = query tokens + history tokens (post-cap/summarize).
- Unit test: `tests/pipeline/planner_context_builder.test.ts`
  - Test: empty history → `history_turns = []`.
  - Test: 2 short turns → pass-through unchanged.
  - Test: 3 turns → only last 2 included.
  - Test: single turn > 300 tokens → truncated to 300.
  - Summarization test uses a mock worker model (do not make live API calls in tests).

### AC.M.5 — tsc clean

`npx tsc --noEmit` returns zero errors on changed files.
Pre-existing test file errors (AppShell.test.tsx, ReportGallery.test.tsx) are
known_residuals — do not fix.

### AC.M.6 — Commit

```
feat(w2-manifest): manifest compressor + planner prerequisites (UQE-4a/4b/UQE-8)

- CAPABILITY_MANIFEST: query_schema + token_cost_hint + linked_data_asset_id on all 8 tools
- manifest_compressor.ts: 108-entry manifest → ≤3K tokens CompressedEntry[]
- PLANNER_PROMPT_v1_0.md: system prompt, PlanSchema, 2 few-shots, eval rubric
- planner_context_builder.ts: ≤600 token history window with worker summarization
```

---

## may_touch

```
00_ARCHITECTURE/CAPABILITY_MANIFEST.json
00_ARCHITECTURE/PLANNER_PROMPT_v1_0.md           (new)
platform/src/lib/pipeline/manifest_compressor.ts  (new)
platform/src/lib/pipeline/planner_context_builder.ts (new)
platform/tests/pipeline/manifest_compressor.test.ts  (new)
platform/tests/pipeline/planner_context_builder.test.ts (new)
```

## must_not_touch

```
platform/src/app/api/chat/consume/route.ts
platform/src/lib/router/**
platform/src/lib/retrieve/**
platform/src/lib/synthesis/**
platform/src/lib/trace/**
platform/src/lib/config/feature_flags.ts
platform/src/hooks/**
platform/src/components/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
```

---

## Hard constraints

- Do NOT begin implementing the planner LLM call (manifest_planner.ts) — that
  is W2-PLANNER scope. This session only delivers the data structures and
  helper functions the planner will consume.
- Do NOT flip `LLM_FIRST_PLANNER_ENABLED`. It stays false.
- `compressedManifestToString()` must be deterministic (same input → same output).
- B.10: do not fabricate token counts. Use `Math.ceil(str.length / 4)` as the
  estimation formula consistently throughout.

---

*W2-MANIFEST · authored 2026-05-01 · unblocks W2-PLANNER (Round 2)*
