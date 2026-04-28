---
report_id: stage1_debug_report
phase: 11A.debug
authored_at: 2026-04-28
authored_by: Claude Code (Sonnet 4.6)
brief: EXEC_BRIEF_PHASE_11A_DEBUG_v1_0.md
status: COMPLETE
surgical_fixes_applied: 2
---

# Stage 1 Debug Report — Phase 11A
## Wrong Chart Data + Missing UI Elements

---

## ⚠ Blocking Precondition: Cloud SQL Auth Proxy NOT Running

**Stream A (audit_log capture) was blocked.** `pgrep -fl cloud_sql_proxy` returns nothing. The audit row for the failing query could not be retrieved. All subsequent findings are derived from code-level static analysis (Streams B–E).

**Impact on report:** Root cause identification is complete via code trace (Streams B–D). The Stream A evidence files (`stage1_debug_audit_row.json`, `stage1_debug_bundle.json`, `stage1_debug_prompt.txt`) cannot be generated without DB access. The follow-up brief outlines verification steps once the Auth Proxy is running.

---

## Stream B — Chart-ID Flow Trace

**Verdict: chart_id flows correctly all the way to `route.ts`. There is no routing bug.**

Per-stage breakdown:

| Stage | File | chart_id seen? | Notes |
|---|---|---|---|
| URL param | `page.tsx:14` | ✓ `id` from `params` | `const { id } = await params` |
| DB fetch for auth | `route.ts:79-91` | ✓ `chartId` → `charts WHERE id=$1` | Chart record fetched correctly |
| Access control | `route.ts:98-100` | ✓ verified | `chart.client_id !== user.uid` check passes |
| POST body | `useChatSession.ts:64` | ✓ | `{ chartId, conversationId, model, style }` |
| Route extraction | `route.ts:65` | ✓ | `const { chartId, messages } = body` |
| `classify()` call | `route.ts:131` | ✗ NOT PASSED | Only `audience_tier`, `manifest_fingerprint`, `conversation_history` |
| `compose()` call | `route.ts:143` | ✗ NOT PASSED | Only `queryPlan` |
| `synthesize()` call | `route.ts:171` | ✗ NOT PASSED | `SynthesisRequest` has no `chart_context` field |

**Divergence point:** `route.ts:125` — at the start of the new-pipeline branch, `chart` (with `birth_date`, `birth_time`, `birth_place`, `name`) is in scope but is never forwarded to `classify`, `compose`, or `synthesize`. The chart is fetched for auth only.

**Hypothesis test (Stream A §5):** chart_id resolves to the correct chart. The "wrong chart" is not a cross-user contamination — it is fabrication caused by the LLM receiving no actual chart data. See Stream D.

---

## Stream C — Bundle Content Audit

**Verdict: Bundle is manifest-reference only; zero actual content is loaded into the LLM context.**

`rule_composer.ts` (the Bundle Composer Phase 1) builds a `Bundle` whose `mandatory_context` entries contain:

```typescript
{
  canonical_id: "FORENSIC_v8_0",   // just the name
  version: "8.0",
  content_hash: "sha256:...",       // hash of canonical_id, not file content
  token_count: 0,                   // always 0 — content not loaded
  role: "floor",
  source: "rule_composer",
}
```

**No file content is read. No DB rows are fetched.** The bundle is a structured manifest reference.

`bundle_summary` injected into the synthesis prompt evaluates to:
```
FORENSIC_v8_0 (floor), MSR_v3_0 (floor), CGM_v9_0 (floor), UCN_v4_0 (interpretive), CDLM_v1_1 (interpretive), RM_v2_0 (interpretive)
```
(for an interpretive query; exact list depends on `query_class`)

This is a list of names. The LLM is told the bundle "includes FORENSIC_v8_0" but never sees its contents.

**Hypothesis test (Stream A §4):** FORENSIC asset_id IS present in `bundle_keys` (as a canonical_id reference), but its content is not loaded. This is distinct from FORENSIC being absent — the bundle is structurally correct but content-empty. Phase 2 of the bundle composer (content loading) has not been implemented.

**`rag_chunks` / vector_search path:** `vector_search.ts` can retrieve actual FORENSIC content from the `rag_chunks` DB table via semantic similarity search. It is registered in `RETRIEVAL_TOOLS` (`retrieve/index.ts:34`) and `VECTOR_SEARCH_ENABLED: true` by default. **Critical finding:** The router prompt (`prompt.ts`) did not list `vector_search` as an available tool, so the LLM never called it. The FORENSIC content in `rag_chunks` was inaccessible.

---

## Stream D — Synthesis Input Audit

**Verdict: Data-layer break (primary) + prompt-layer break (compound). LLM hallucinated chart positions.**

Three failure modes distinguished:

### Primary: Data-Layer Break
The LLM's system prompt for a factual query ("what is my D1 chart") is built from `shared.ts:buildOpeningBlock()` with these variables (`single_model_strategy.ts:92-98`):

```typescript
{
  chart_name: 'the native',                          // hardcoded
  birth_date: 'canonical birth data in context bundle',  // hardcoded placeholder
  birth_time: '',                                    // empty
  birth_place: '',                                   // empty
  bundle_summary: 'FORENSIC_v8_0 (floor), ...',     // names only
  tools_available: 'msr_sql',                        // vector_search NOT listed
}
```

The rendered `NATIVE_CONTEXT` block the LLM receives:

> "You are reading the birth chart of the native, born canonical birth data in context bundle at , . The canonical chart data is at L1 (facts layer); your response must be grounded in it."

The LLM is given:
- No chart name
- No birth date, time, or place
- No planetary positions
- A bundle that is a list of names with no content
- Tools: only `msr_sql` (which returns interpretive signal claims, not D1 positions)

### Compound: Prompt-Layer Break
The `chart` record (fetched at `route.ts:78-91`, containing `birth_date`, `birth_time`, `birth_place`, `name`) is available in scope at `route.ts:94` but is **never passed** to `orchestrator.synthesize()`. `SynthesisRequest` has no `chart_context` field (`synthesis/types.ts` — confirmed).

### Secondary: Pre-Fetched Tool Results Dropped
`route.ts:145-157` eagerly pre-fetches tool results (`validToolResults`), passes them to `orchestrator.synthesize()` as `tool_results`. In `single_model_strategy.ts`, `tool_results` is destructured from the request but **never injected** into `modelMessages`. The pre-fetched MSR signals (which do contain chart-grounded claim text) are silently dropped. The LLM could call `msr_sql` lazily via `wrappedTools`, but:
1. The tool description is generic ("Use to extend the context bundle") — insufficient to trigger a tool call for a D1 chart query
2. `msr_sql` returns interpretive signal claims (e.g., "Saturn in Aries in the 3rd house creates...") — not raw D1 planetary positions

**Conclusion:** LLM fabricated D1 chart positions from training data. This is a B.10 violation (no fabricated computation) caused by architectural gap: bundle content loading (Phase 2) not implemented.

---

## Stream E — UI Visibility Check

**Verdict on each missing element:**

### Panel checkbox — BY DESIGN (partially)

**Root**: `ConsumeChat` line 452: `{panelModeEnabled && pipelineEnabled && (...)}`. The `panelModeEnabled` prop defaults to `false`. **`page.tsx` was NOT passing `panelModeEnabled` at all** — it read `PANEL_MODE_ENABLED` from `configService` but did not forward it to the component. This is a 1-line bug (now fixed, see §Surgical Fixes). Even with the fix, the checkbox remains hidden because `PANEL_MODE_ENABLED` defaults to `false`. To show it, set `MARSYS_FLAG_PANEL_MODE_ENABLED=true`.

### DisclosureTierBadge and StreamingAnswer — BY DESIGN (empty-state)

Both render only when `pipelineEnabled=true` AND `!messagesEmpty`. On the initial empty conversation, neither appears. After submitting one message and getting a response, both appear:
- `DisclosureTierBadge` in the sticky top bar (line 350)
- `StreamingAnswer` replacing `AdaptiveMessageList` (line 366)

**These are not bugs.** The visible difference from the legacy pipeline appears only after the first message is sent.

---

## Surgical Fixes Applied

### Fix A — `vector_search` added to router prompt for factual queries
**File:** `platform/src/lib/router/prompt.ts`
**Lines changed:** 2

**Before:**
```
- cgm_graph_walk        — traverse the CGM graph...
```
```json
"tools_authorized": ["msr_sql"]
```

**After:**
```
- cgm_graph_walk        — traverse the CGM graph...
- vector_search         — semantic search over embedded corpus chunks including FORENSIC chart data; always include for factual queries
```
```json
"tools_authorized": ["msr_sql", "vector_search"]
```

**Rationale:** `vector_search` is registered in `RETRIEVAL_TOOLS`, `VECTOR_SEARCH_ENABLED=true` by default, and queries `rag_chunks` which contains embedded FORENSIC content. The sole reason it was never called was omission from the router prompt's tool list. With this fix, the router will authorize `vector_search` for factual queries. During synthesis, the LLM will call it (via the lazy `wrappedTools` mechanism) and retrieve actual FORENSIC chunk content including D1 planetary positions.

**Dependency:** Cloud SQL Auth Proxy must be running for `vector_search` to return actual results (it degrades gracefully without DB access, returning a warning bundle instead of failing hard).

### Fix B — `panelModeEnabled` forwarded from `page.tsx` to `ConsumeChat`
**File:** `platform/src/app/clients/[id]/consume/page.tsx`
**Lines changed:** 2

**Before:**
```typescript
const pipelineEnabled = configService.getFlag('NEW_QUERY_PIPELINE_ENABLED')
// panelModeEnabled never read or passed
```

**After:**
```typescript
const pipelineEnabled = configService.getFlag('NEW_QUERY_PIPELINE_ENABLED')
const panelModeEnabled = configService.getFlag('PANEL_MODE_ENABLED')
// panelModeEnabled={panelModeEnabled} added to <ConsumeChat ... />
```

**Rationale:** The flag was read nowhere in `page.tsx`, so `ConsumeChat` always received `panelModeEnabled=false` (default) regardless of the flag's actual value. The panel checkbox remains hidden unless `MARSYS_FLAG_PANEL_MODE_ENABLED=true` is also set in the environment.

---

## Recommended Follow-Up Briefs

### FUB-1 (HIGH PRIORITY): Pass chart birth data into synthesis variables
**Root cause addressed:** Prompt-layer break — `birth_date`, `birth_time`, `birth_place`, `chart_name` are hardcoded placeholders.
**Files:** `platform/src/lib/synthesis/types.ts`, `platform/src/lib/synthesis/single_model_strategy.ts`, `platform/src/app/api/chat/consume/route.ts`
**Scope:** Add optional `chart_context?: { name: string; birth_date: string; birth_time: string; birth_place: string }` to `SynthesisRequest`. Update `single_model_strategy.ts:92-98` to use actual values. Update `route.ts` to pass `chart_context` from the fetched `chart` record.
**Lines:** ~17 across 3 files. Risk: LOW.
**Note:** Provides chart identity to LLM but NOT D1 positions — needed alongside FUB-2 for full fix.

### FUB-2 (HIGH PRIORITY): Bundle content loading — Phase 2 implementation
**Root cause addressed:** Data-layer break — bundle contains only manifest references; no actual file content reaches the LLM.
**Design:** The bundle composer should load actual content for `floor`-role assets (FORENSIC, MSR, CGM) either from the filesystem/GCS at compose time or pre-load them into a context injection block in the synthesis prompt.
**Files:** `platform/src/lib/bundle/rule_composer.ts`, `platform/src/lib/bundle/types.ts`, `platform/src/lib/synthesis/single_model_strategy.ts`
**Scope:** Medium (Phase 2 of bundle composer as originally planned). Risk: MEDIUM.

### FUB-3 (MEDIUM PRIORITY): Inject pre-fetched tool_results into synthesis modelMessages
**Root cause addressed:** Tertiary issue — eager tool execution results are silently dropped.
**Files:** `platform/src/lib/synthesis/single_model_strategy.ts`
**Scope:** ~8 lines. Add tool_results content as an injected context block before the user query in `modelMessages`. Risk: LOW.

### FUB-4 (LOW PRIORITY): Add vector_search to router tools for other query classes
**Context:** Fix A added `vector_search` for `factual` only. For `interpretive` and `holistic` queries, FORENSIC content is also needed.
**Files:** `platform/src/lib/router/prompt.ts` — update few-shot examples for `interpretive`, `holistic`, `cross_domain`.
**Scope:** ~6 lines. Risk: LOW.

---

## Native Action

Two surgical fixes have been applied. Restart the dev server, then:

1. **Test the chart data fix:** Submit "what is my D1 chart" again.
   - With Cloud SQL Auth Proxy running: the router will now authorize `vector_search`, and the LLM should call it and retrieve FORENSIC chunks from `rag_chunks`. Verify the D1 configuration matches the canonical chart.
   - Without Auth Proxy: `vector_search` degrades gracefully (warning bundle) — LLM will still lack FORENSIC content. Start Auth Proxy first: see previous session notes for the command.

2. **Panel button:** Still hidden because `PANEL_MODE_ENABLED` defaults to `false`. To show it, set `MARSYS_FLAG_PANEL_MODE_ENABLED=true` in your `.env.local` and restart. `DisclosureTierBadge` and `StreamingAnswer` will appear automatically after sending the first message.

3. **For complete wrong-chart fix:** After verifying Fix A partially helps, commission FUB-1 + FUB-2 as a follow-up brief to fully resolve the data-layer break (bundle content loading and chart birth data passing).

---

## Evidence Files

| File | Status | Notes |
|---|---|---|
| `stage1_debug_audit_row.json` | NOT GENERATED | Requires Cloud SQL Auth Proxy |
| `stage1_debug_bundle.json` | NOT GENERATED | Requires Auth Proxy for live capture; static analysis above substitutes |
| `stage1_debug_prompt.txt` | NOT GENERATED | Reconstructed inline in Stream D above |

All Stream A evidence files are blocked by the Auth Proxy requirement. The root cause is fully identified via static code analysis.

---

*End of stage1_debug_report.md — Phase 11A debug session complete.*
