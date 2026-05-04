---
status: COMPLETE
session_id: GANGA-BUGFIX-S1
session_scope: Systematic bug-fix pass — validators, citations, conversation persistence, DeepSeek, methodology strip
authored: 2026-05-05
authored_by: Claude Sonnet 4.6 (Cowork session)
supersedes: Wave 2 UQE + Context Assembly brief (PARTIAL-COMPLETE 2026-05-04)
---

# CLAUDECODE_BRIEF — GANGA-BUGFIX-S1

## §0 — Governing scope

This brief governs one focused execution session: `GANGA-BUGFIX-S1`.
Read `CLAUDE.md §0` first. If `status` is `COMPLETE`, skip and proceed with
`CLAUDE.md §C` items 1–11 normally.

**Hard rule:** This is an Engineering-domain session. Do NOT touch
`00_ARCHITECTURE/`, `01_FACTS_LAYER/`, or `06_LEARNING_LAYER/`.

---

## §1 — Background

Static code analysis (Cowork session, 2026-05-05) identified 11 bugs across
the production query pipeline. Symptoms observed in production:

1. Every query returns `validators_run: []` regardless of query class
2. DeepSeek v4-pro stack returns empty answers (no text, just trace)
3. Multi-turn conversations fail on turn 2 with an error message ("conversation not found")
4. Citations in synthesis output are never verified — citation gate always shows "warn"
5. methodology_block fence appears in conversation history, bloating context on each turn
6. NIM context assembler silently degrades signal IDs for subsequent citation checks

The fixes below are **surgical** — no new features, no architecture changes. Each fix
has a precise root cause and a precise code change. The session must not scope-creep.

---

## §2 — Bug inventory and fixes

### BUG-1 — CRITICAL: Multi-turn conversation failure (second/third/fourth turn 404)

**Symptom:** First query in a conversation succeeds. Every subsequent query in the
same conversation returns an error to the user.

**Root cause:** `insertConversationWithId` is called inside `pendingConversationInsert`,
which is only awaited inside `onFinish`'s try/catch. If the DB insert fails (network
hiccup, cold-start, constraint), the error is silently swallowed:

```typescript
// platform/src/app/api/chat/consume/route.ts — current (broken) pattern
// Inside onFinish:
try {
  if (pendingConversationInsert) await pendingConversationInsert  // ← error eaten here
  await replaceConversationMessages({...})
} catch (err) {
  console.error('[consume:v2] persistence failed', err)  // ← user never sees this
}
```

On turn 2, `getConversation` returns `null` (row never created) → route returns
`res.notFound('conversation')` → error shown to user.

**Fix — two changes:**

**(a) `platform/src/lib/conversations.ts` — add `ON CONFLICT DO NOTHING`:**
```typescript
export async function insertConversationWithId(params: {
  id: string
  chartId: string
  userId: string
  module: ConversationModule
}): Promise<void> {
  await query(
    'INSERT INTO conversations (id, chart_id, user_id, module, title) VALUES ($1,$2,$3,$4,NULL) ON CONFLICT (id) DO NOTHING',
    [params.id, params.chartId, params.userId, params.module]
  )
}
```

**(b) `platform/src/app/api/chat/consume/route.ts` — move insert BEFORE streaming starts:**

Find the block where `pendingConversationInsert` is assigned and move it to execute
eagerly (awaited, not deferred) before the streaming `streamText`/`generateText` call.
If insert fails and is NOT a duplicate-key error, return HTTP 500 to the client before
streaming begins. Pattern:

```typescript
// BEFORE streaming starts — eager insert
if (conversationId) {
  try {
    await insertConversationWithId({ id: conversationId, chartId, userId: user.uid, module: 'consume' })
  } catch (err) {
    const msg = String(err).toLowerCase()
    if (!msg.includes('duplicate') && !msg.includes('unique') && !msg.includes('conflict')) {
      return res.status(500).json({ error: 'Failed to initialize conversation. Please retry.' })
    }
    // duplicate = already exists = fine (idempotent retry)
  }
}
// Remove the pendingConversationInsert deferred pattern entirely.
```

Remove all references to `pendingConversationInsert` from `onFinish`.

---

### BUG-2 — CRITICAL: Validators never fire (all queries return `validators_run: []`)

**Root cause:** All 3 validators declare `applies_at: 'synthesis'`. The route only
calls `runAll` at the `'bundle'` stage (before synthesis), which returns `[]` because
no validator applies there. There is NO `runAll` call at the synthesis stage anywhere
in `route.ts`.

```typescript
// platform/src/lib/validators/index.ts comment reads:
// "For bundle stage, no validators currently apply → returns []"
// — this is by design, but the synthesis-stage call was never added to route.ts
```

**Fix — `platform/src/app/api/chat/consume/route.ts`:**

In `onFinish` (after `cleanText` is available), add a synthesis-stage validation call
and thread the results into both the audit consumer and checkpoint_8_5:

```typescript
// After cleanText is determined, before audit consumer finalizes:
const synthesisValidations = await runAll(
  {
    output: cleanText,
    bundle,
    assembled_context: assembledContextJson,
    query_class: queryPlan?.query_class,
  },
  'synthesis',
  { model: selectedModelId, stack: selectedStack }
)

// Pass to audit consumer (replace the existing bundleValidations reference):
// validator_results: synthesisValidations   ← was: bundleValidations (always [])
```

Also update the `checkpoint_8_5` call to pass `synthesisValidations` instead of
the hardcoded `validator_results: []`:

```typescript
// platform/src/lib/synthesis/single_model_strategy.ts
// Find the checkpoint_8_5 call and replace:
validator_results: []   // ← WRONG — hardcoded
// with:
validator_results: validatorResultsRef ?? []   // pass through from caller
```

The route must pass `validatorResults` as a callback or post-hook that
`single_model_strategy` can use. Simplest: add an optional
`onValidatorResults?: (results: ValidationResult[]) => void` callback to
`SynthesisOptions` and call it from `single_model_strategy` after synthesis
with `synthesisValidations` computed inside the strategy.

Alternatively (simpler): compute `synthesisValidations` in `onFinish` in route.ts
after receiving `cleanText` from the stream, then write it to the audit record
in a second `updateAuditRecord` call. Either approach is acceptable; pick the
one with fewer moving parts.

---

### BUG-3 — p2_citation validator uses wrong regex format

**Root cause:** `p2_citation.ts` looks for `[SIG.MSR.NNN]` (square-bracket format)
but the synthesis prompts instruct the model to use `(→ SIG.MSR.NNN)` or bare
`SIG.MSR.NNN`. The regex will never match any citation the model actually emits.

**Fix — `platform/src/lib/validators/p2_citation.ts`:**

Replace the citation extraction regex to match what `citation_check.ts` already uses:
```typescript
// Replace:
const citationRegex = /\[(F\.\w+|FORENSIC\.\w+|SIG\.MSR\.\w+)\]/g
// With:
const citationRegex = /\bSIG\.MSR\.\d{3}\b/g
```

Also accept bare FORENSIC signal references — check `citation_check.ts` for the
canonical pattern and align `p2_citation.ts` to match it exactly.

---

### BUG-4 — DeepSeek v4-pro returns empty output (isR1 guard too narrow)

**Root cause:** `isR1` in `single_model_strategy.ts` is hardcoded to
`selected_model_id === 'deepseek-reasoner'`. DeepSeek v4-pro maps to a thinking
model on the DeepSeek API; its full output is in `<think>...</think>` blocks.
`stripThinkBlocks` removes those blocks → `cleanText = ''`. The model DID produce
output (thinking tokens are counted in `outputTok`) but it's all stripped away.

**Fix — `platform/src/lib/synthesis/single_model_strategy.ts`:**

Broaden the `isR1` (or rename to `isThinkingModel`) guard to cover all models
that use `<think>` blocks:

```typescript
// Replace:
const isR1 = selected_model_id === 'deepseek-reasoner'
// With:
const isThinkingModel =
  selected_model_id === 'deepseek-reasoner' ||
  getModelMeta(selected_model_id)?.hint?.toLowerCase().includes('thinking') ||
  false
```

`getModelMeta` is already imported. The `deepseek-v4-pro` registry entry has
`hint: "thinking mode"` (verify this in `registry.ts`; if the hint text differs,
match exactly). If `isThinkingModel` is true, `stripThinkBlocks` should be
applied to extract the text OUTSIDE `<think>` blocks rather than discarding them.

Verify the current `stripThinkBlocks` implementation: it should return the text
that comes AFTER the closing `</think>` tag, not the content inside it. If it
returns `''` when there is no post-`</think>` text, add a fallback that returns
the think-block content itself (the model's actual answer is inside `<think>` for
some DeepSeek models). Adjust as needed based on what DeepSeek v4-pro actually returns.

---

### BUG-5 — Methodology block not stripped from cleanText (conversation history bloat)

**Root cause:** In `single_model_strategy.ts`, `mbMatch` extracts the methodology
block content into `methodologyBlockHolder.value` but does NOT remove the fence from
`cleanText`. The fence remains in `final_output` and is stored in conversation history.
Each subsequent turn appends another ~200-400 token block, causing context overflow.

**Fix — `platform/src/lib/synthesis/single_model_strategy.ts`:**

After the regex match, strip the fence from `cleanText`:

```typescript
// Current (broken):
const mbMatch = cleanText.match(/^```marsys_methodology_block\n([\s\S]*?)\n```/m)
methodologyBlockHolder.value = mbMatch ? mbMatch[1].trim() : null
// cleanText still contains the fence — NOT stripped

// Fixed:
const mbMatch = cleanText.match(/^```marsys_methodology_block\n([\s\S]*?)\n```\n?/m)
methodologyBlockHolder.value = mbMatch ? mbMatch[1].trim() : null
if (mbMatch) {
  cleanText = cleanText.replace(mbMatch[0], '').trim()
}
```

---

### BUG-6 — Citation gate uses pre-assembly context (false negatives)

**Root cause:** `assembledContextJson` in the citation gate is built from
`validToolResults` (the raw tool results before context assembly). After
`CONTEXT_ASSEMBLY_ENABLED` runs, the synthesis model sees `assembledBundle`
(the compressed/reordered results), not the originals. Signal IDs present in
the assembled bundle may differ from those in `validToolResults`.

**Fix — `platform/src/app/api/chat/consume/route.ts`:**

When building `assembledContextJson` for the citation gate, prefer the assembled
bundle if it exists:

```typescript
// Replace:
const assembledContextJson = JSON.stringify({ bundle, tool_results: validToolResults })
// With:
const assembledContextJson = JSON.stringify({
  bundle,
  tool_results: assembledBundle?.tool_bundles ?? validToolResults,
})
```

(Use whatever field name `contextAssembler` returns for the assembled results.)

---

### BUG-7 — `includes()` substring match in citation verification (false positives)

**Root cause:** `citation_check.ts` verifies that a cited signal ID is present in
`assembledContextJson` using `assembledContextJson.includes(id)`. This is a naive
substring match: `SIG.MSR.001` would match inside `SIG.MSR.0010`. Under high signal
density, false positives are plausible.

**Fix — `platform/src/lib/synthesis/citation_check.ts`:**

Replace the substring check with a word-boundary regex:

```typescript
// Replace:
const idPresentInContext = assembledContextJson.includes(id)
// With:
const idPresentInContext = new RegExp(`\\b${id.replace(/\./g, '\\.')}\\b`).test(assembledContextJson)
```

---

### BUG-8 — NIM stack bypasses context assembly (D.1)

**Root cause:** `nemotron-3-super-120b-a12b` (the NIM context assembler model) has
`capabilities: []` in the registry and produces unreliable JSON output. When
`parseAssemblerOutput` fails, the assembler silently falls back to passThrough,
but signal IDs may still be degraded in the process. On the NIM stack, context
assembly adds latency and risk with no benefit.

**Fix — `platform/src/app/api/chat/consume/route.ts`:**

Add a stack guard that forces `CONTEXT_ASSEMBLY_ENABLED` off for the NIM stack:

```typescript
const effectiveContextAssembly =
  isEnabled(FeatureFlag.CONTEXT_ASSEMBLY_ENABLED) &&
  selectedStack !== 'nim'
```

Use `effectiveContextAssembly` in place of the raw flag check in the assembly
branch. Do NOT remove `CONTEXT_ASSEMBLY_ENABLED` from the registry — it remains
the override for non-NIM stacks.

---

### BUG-9 — B.11 tool inclusion not enforced in classify() path (D.2)

**Root cause:** The prompt template asserts B.11 (Whole-Chart-Read: MSR, UCN, CDLM,
CGM, RM must all be consulted) but the `classify()` / `compose()` planner path
does not enforce that L2.5 synthesis tools are included in the bundle. A query
that only selects L1 tools violates B.11 silently.

**Fix — `platform/src/lib/router/` (wherever `compose()` builds the final bundle):**

After `compose()` returns a bundle, verify that the L2.5 tools are present.
If any are missing, add them with default params:

```typescript
const L2_5_REQUIRED_TOOLS = ['get_msr_signals', 'get_ucn_profile', 'get_cdlm_links', 'get_cgm_node', 'get_rm_state']
// (verify exact tool names against the tool registry)

for (const toolName of L2_5_REQUIRED_TOOLS) {
  if (!bundle.tools.find(t => t.name === toolName)) {
    bundle.tools.push({ name: toolName, params: {} })  // default params
    // log B.11 enforcement addition to trace
  }
}
```

If `LLM_FIRST_PLANNER_ENABLED` is true, apply the same enforcement in
`llm_planner.ts` after the LLM returns its bundle.

---

## §3 — Acceptance criteria

All 9 bugs above must be fixed. Acceptance is verified as follows:

### AC.1 — Second-turn conversation works

Manual smoke: send query 1, receive answer. In the same conversation, send query 2.
It must NOT show an error. Check Cloud SQL: a `conversations` row must exist with
the correct `id` immediately after turn 1 completes (before turn 2 is sent).

### AC.2 — Validators fire at synthesis stage

In a post-fix smoke run: the audit record for any query must show
`validators_run` with at least one entry (e.g. `p1_layer_separation`,
`p2_citation`, `p5_signal_id_resolution`). `validators_run: []` for a
synthesized query is a failure.

### AC.3 — p2_citation detects citations correctly

Unit test: `p2_citation` validator must return `pass: true` when input contains
`(→ SIG.MSR.001)` or bare `SIG.MSR.001` and `pass: false` when neither is present.
Add or update the test in `platform/tests/validators/`.

### AC.4 — DeepSeek v4-pro stack returns non-empty answers

Smoke on deepseek-v4-pro stack: answer text must be non-empty. If the stack
is not available in test environment, add a unit test for `isThinkingModel`
detection that covers `deepseek-v4-pro` and `deepseek-reasoner` model IDs.

### AC.5 — Methodology block absent from stored messages

After a synthesis, inspect the stored message in `messages` table (or logs):
the `content` / `tool_calls` column must NOT contain
`` ```marsys_methodology_block `` fence markers. The methodology content must
still appear in the `methodology_block` field of the audit record.

### AC.6 — Citation gate uses assembled context

Log or trace assertion: when `CONTEXT_ASSEMBLY_ENABLED=true` and a bundle is
assembled, the citation gate's `assembledContextJson` must reference assembled
signal IDs, not the original `validToolResults` list. Verify via trace diff
or unit test in `platform/tests/synthesis/citation_check.test.ts`.

### AC.7 — tsc clean

`npx tsc --noEmit` returns 0 errors across all changed files. Pre-existing
test file errors (AppShell.test.tsx, ReportGallery.test.tsx) are
`known_residuals` — do not fix in this session.

### AC.8 — Unit tests pass

`npm test` (or `npx vitest run`) returns no new failures. If existing tests
break due to interface changes (e.g. `SynthesisOptions` gains new field),
update the tests to match the new interface.

### AC.9 — Commit

Single commit with message:
```
fix(pipeline): systematic bugfix pass — conversation persistence, validators, citations, DeepSeek, methodology strip

BUG-1: insertConversationWithId moved before streaming; ON CONFLICT DO NOTHING; prevents turn-2 404
BUG-2: synthesis-stage runAll wired in route.ts onFinish; validators now fire
BUG-3: p2_citation regex fixed to match (→ SIG.MSR.NNN) and bare SIG.MSR.NNN
BUG-4: isThinkingModel broadened to cover deepseek-v4-pro (thinking mode)
BUG-5: methodology_block fence stripped from cleanText before storage
BUG-6: citation gate uses assembledBundle when CONTEXT_ASSEMBLY_ENABLED
BUG-7: citation_check.ts includes() replaced with word-boundary regex
BUG-8: CONTEXT_ASSEMBLY_ENABLED force-disabled on NIM stack
BUG-9: B.11 L2.5 tool enforcement added after compose()/llmFirstPlanner()
```

---

## §4 — File scope

### must_not_touch
```
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
00_ARCHITECTURE/**
06_LEARNING_LAYER/**
platform/src/components/**
platform/src/hooks/**
platform/src/lib/models/registry.ts
platform/src/lib/models/nvidia.ts
platform/src/lib/models/resolver.ts
platform/src/lib/prompts/**
platform/src/lib/config/feature_flags.ts   ← do NOT add/remove flags in this session
```

### may_touch
```
platform/src/app/api/chat/consume/route.ts
platform/src/lib/conversations.ts
platform/src/lib/synthesis/single_model_strategy.ts
platform/src/lib/synthesis/context_assembler.ts
platform/src/lib/synthesis/citation_check.ts
platform/src/lib/validators/index.ts
platform/src/lib/validators/p2_citation.ts
platform/src/lib/validators/p1_layer_separation.ts   (if interface change needed)
platform/src/lib/validators/p5_signal_id_resolution.ts (if interface change needed)
platform/src/lib/router/llm_planner.ts               (BUG-9 only, if LLM_FIRST_PLANNER_ENABLED path)
platform/src/lib/router/compose.ts                   (BUG-9 — wherever compose() lives)
platform/tests/validators/**
platform/tests/synthesis/**
platform/tests/conversations/**                      (add turn-2 regression test)
```

---

## §5 — Hard constraints

1. **No new feature flags.** All fixes must work within existing feature flag
   topology. BUG-8's stack guard is a conditional expression in route.ts, not
   a new flag.

2. **No architectural changes.** The pipeline shape (classify → retrieve → assemble
   → synthesize → validate → audit) is fixed. These are surgical fixes within
   existing steps.

3. **No Wave 3 pre-building.** Do not scaffold parallel tool orchestration,
   Kimi K2, or any future workstream.

4. **Idempotency on conversation insert is required.** The `ON CONFLICT DO NOTHING`
   clause is mandatory — without it, retries will fail with unique constraint violations.

5. **Validator interface change must be backward-compatible.** If `SynthesisOptions`
   gains a new field for validator results, it must be optional with a default of `[]`.

6. **Do not remove `extractText` helper** — it may be used elsewhere. Instead,
   ensure it is not the sole path for building conversation history for storage
   (stored messages should carry full `parts` arrays including tool-call/result parts
   if they were generated). The `replaceConversationMessages` + `loadConversationMessages`
   round-trip already handles parts correctly — the fix is to ensure `cleanText`
   (the text-only final answer) doesn't include the methodology fence.

---

## §6 — Session-open checklist

At session open, before any code changes, the executor must:

1. Read `CLAUDE.md §0` — check this file's `status`; if COMPLETE, skip.
2. Read `platform/src/app/api/chat/consume/route.ts` in full (it is the hub file).
3. Read `platform/src/lib/conversations.ts` lines 42–52 (`insertConversationWithId`).
4. Read `platform/src/lib/synthesis/single_model_strategy.ts` — locate `isR1`, `mbMatch`, `checkpoint_8_5`.
5. Read `platform/src/lib/validators/p2_citation.ts` — confirm the wrong regex.
6. Run `npx tsc --noEmit` to establish the baseline error count.
7. Declare `may_touch` + `must_not_touch` in session-open handshake.

Then execute BUG-1 through BUG-9 in order. BUG-1 (conversation persistence) first
because it is the highest-impact user-visible failure.

---

*End of CLAUDECODE_BRIEF — GANGA-BUGFIX-S1 (authored 2026-05-05)*
