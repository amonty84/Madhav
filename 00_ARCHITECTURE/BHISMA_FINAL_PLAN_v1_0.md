---
artifact: BHISMA_FINAL_PLAN_v1_0.md
canonical_id: BHISMA_FINAL_PLAN
version: 1.0
status: SUPERSEDED (2026-05-04 — see PROJECT_GANGA_PLAN_v1_0.md)
authored_by: Claude (Cowork — BHISMA-FINAL-PLAN session) 2026-05-04
macro_phase: M3/M5 — parallel engineering elevation sprint
project_code: BHISMA
supersedes: >
  Consolidates and supersedes the ad-hoc planning spread across
  PROJECT_BHISMA_BOOTSTRAP.md, BHISMA_PLAN_v1_0.md, BHISMA_WAVE2_PLAN_v1_1.md,
  BHISMA_CLOSE_v1_0.md, BHISMA_W2_CLOSE_v1_0.md, and all Phase-1 session briefs.
  Those documents remain as historical record — this is the single canonical
  forward-looking plan.
---

# BHISMA Final — Definitive Platform Elevation Plan

---

## §0 — What this document is

BHISMA ran across three distinct planning documents (Wave 1 plan, Wave 2 plan, and improvised Phase 1 briefs), producing fragmented state with no single picture of where things stand. This document consolidates everything: what BHISMA is, what shipped, what is broken, what the remaining gaps are, and the complete phased execution plan to bring BHISMA to a declared-complete state.

**Reading protocol.** This document is the only BHISMA planning document you need to read at any session open. The historical wave plans and individual session briefs remain for audit trail but are superseded by this file for forward planning.

---

## §1 — What BHISMA Is

**B H I S M A** = **Build, Harden, Instrument, Synthesize, Model, Architect**

**Mission.** BHISMA is a parallel platform elevation sprint running alongside — not inside — the MARSYS-JIS macro-phases. Its purpose is to make the platform production-grade: robust LLM routing, intelligent planning, full observability, and test coverage sufficient to detect regressions before they affect live inference.

**Scope boundary.** BHISMA is strictly an engineering workstream. It does not produce astrology content, modify L1/L2.5 synthesis layers, or execute M-phase governance actions. BHISMA sessions may only touch:
```
platform/src/**
platform/tests/**
platform/scripts/**
platform/supabase/migrations/**
00_ARCHITECTURE/BHISMA_*.md   (planning artifacts only)
CLAUDECODE_BRIEF_BHISMA_*.md  (session briefs only)
```

**Relationship to macro-phases.** BHISMA is gated on, not inside, M3/M4/M5. It provides the engineering substrate beneath those phases. M5 (Probabilistic Engine) cannot run well without BHISMA complete.

---

## §2 — Canonical State Audit (as of 2026-05-04)

### §2.1 Wave 1 — CLOSED (2026-05-01, commit 430ed4d / 0ba34e2)

| Deliverable | Status | Notes |
|---|---|---|
| Multi-provider model registry (11 models, 5 stacks) | ✅ SHIPPED | Anthropic, Google, DeepSeek, OpenAI, NIM |
| FAMILY_WORKER map + family-aware routing | ✅ SHIPPED | getWorkerForModel() in resolver.ts |
| o-series reasoning model calling convention | ✅ SHIPPED | No system prompt, no temperature; supportsStreaming gate |
| Hard-fail PipelineError (no silent fallbacks) | ✅ SHIPPED | ADR-3; step_error trace events |
| LLM-first planner (planner.ts) with 17-tool RCS | ✅ SHIPPED | Gated behind LLM_FIRST_PLANNER_ENABLED |
| Trace Command Center (warm palette, 5 panels) | ✅ SHIPPED | QueryDNA, Context, RetrievalScorecard, CostBar, AnalyticsTab |
| Citation check (citation_check.ts) | ✅ SHIPPED | Per-class threshold table |
| health.ts model health endpoint | ✅ SHIPPED | assertWorkerHealthy() — not wired to request path (low priority) |
| cost.ts estimateQueryCost() | ✅ SHIPPED | Reads registry cost rates × token fields |

**Wave 1 residual carried forward:** GAP.P.9 eval baseline was STUB (secrets unavailable). Resolved in Wave 2 / Phase 1.

---

### §2.2 Wave 2 — CLOSED (2026-05-03, sessions S-A / S-B / S-C / S-D)

| Deliverable | Status | Notes |
|---|---|---|
| Universal Query Engine (universal_query_engine.ts) | ✅ SHIPPED | planner→arbitrator→trace wiring; ADR-5/6 |
| Budget arbitrator (budget_arbiter.ts) | ✅ SHIPPED | Arbitrates planner output vs synthesis envelope |
| MON emission: llm_call_log writer | ✅ SHIPPED | All LLM calls logged |
| MON emission: query_plan_log writer | ✅ SHIPPED | Plan JSON, parse result, fallback_used |
| MON emission: tool_execution_log writer | ✅ SHIPPED | Retrieve-tool path (16 structured tools still missing — see §3) |
| DB migrations 032/033/034 (3 MON tables) | ✅ SHIPPED | Applied against live DB in S-C |
| EVAL golden set (29 cases) | ✅ SHIPPED | 5 predictive + 5 edge_case + 6 remedial + 6 interpretive + 4 holistic + 3 planetary |
| Planner regression gate test | ✅ SHIPPED | Mocked CI test at tests/eval/planner_regression_gate.test.ts |
| RETENTION_POLICY_v1_0.md | ✅ SHIPPED | Schema retention policy document |
| Lever 2 evaluation (NIM 8b model) | ❌ HOLD | recall=0.710, precision=0.579 — below 0.80/0.90 thresholds on NIM 8b |

**Key fact:** Lever 2 held on NIM 8b. Subsequent work upgraded the planner to use Haiku/Flash per-stack (STACK_ROUTING) and ran 6 eval rounds (v1.1 → v1.6), ultimately achieving recall=0.940, precision=0.945. LLM_FIRST_PLANNER_ENABLED flipped to true at commit fa75e1a.

---

### §2.3 Phase 1 Hardening Rounds — COMPLETE (2026-05-04)

| Round | Brief | Deliverable | Status |
|---|---|---|---|
| R1.1 (CI-S1) | BHISMA_CI_S1 | `.github/workflows/ci.yml` — PR planner regression gate | ✅ COMPLETE |
| R1.2 (CLEANUP-S1) | BHISMA_CLEANUP_S1 | NIM debug body removed; nim_* scripts suppressed in .gitignore | ✅ COMPLETE |
| R1.3 (TOOLS-S1) | BHISMA_TOOLS_S1 | onStepFinish hook in route.ts — synthesis-time structured tool logging | ✅ COMPLETE |
| R1.4 (TRACE-S1) | BHISMA_TRACE_S1 | Planner params (plannerParamsMap) threaded through executeWithCache | ✅ COMPLETE |

**Planner prompt evolution (parallel to Phase 1):**

| Version | Event | Score |
|---|---|---|
| v1.1 | Wave 2 S-B initial (NIM 8b) | recall=0.750, precision=0.588 — HOLD |
| v1.2 | Added R7a/b/R11-R16; fixed cgm/resonance restriction | recall=0.770, precision=0.799 |
| v1.3 | R14 softened; R15 scoped; R18 added; R17 expanded | recall=0.830 ✓, precision=0.811 |
| v1.4 | R19 scoped; R6 strengthened; §4.1/§4.7 few-shots | recall=0.856 ✓, precision=0.867 |
| v1.5 | R7c transit; R12/R15 tightened; R19/R20 scoped | recall=0.911 ✓, precision=0.945 ✓ |
| v1.6 | §4.8 fix; §4.9/4.10 new examples; R18/R19 clarified | recall=0.940 ✓, precision=0.945 ✓ — **GATE MET** |

**LLM_FIRST_PLANNER_ENABLED=true** flipped at v1.6 gate pass (commit fa75e1a).

---

### §2.4 Current Platform State (what is truly working right now)

**Working:**
- All 5 stacks defined and routing (Anthropic, Gemini, GPT, NIM, DeepSeek)
- LLM-first planner code path (manifest_planner.ts) — flag ON
- Planner prompt v1.6 (recall 0.940 / precision 0.945 on golden set)
- Planner circuit breaker (falls back to classify() on repeated failures)
- CI regression gate (mocked, PR-triggered)
- MON tables (query_plan_log, llm_call_log, tool_execution_log — live in DB)
- Retrieve-tool execution logging (15 tools)
- Synthesis-time tool logging (TOOLS-S1 — 16 structured tools now included)
- Planner params threaded to retrieve tools (TRACE-S1)
- Trace Command Center (5 panels, warm palette)
- Universal Query Engine wiring
- Budget arbiter

**NOT working (confirmed by E2E observation 2026-05-04):**
- **DeepSeek planner**: `deepseek-v4-flash` resolves to `deepseek-reasoner` on API → rejects `toolChoice` → 100% fallback to classify(). `plan_json=NULL` on every query.
- **LLM planner has never successfully fired in production** — all live queries ran deterministic classify() fallback.

---

## §3 — Gap Map

### BF.GAP.001 — DeepSeek Model ID Mismatch [CRITICAL — PRODUCTION BLOCKER]
`deepseek-v4-flash` is not a valid DeepSeek API model identifier. The API silently maps it to `deepseek-reasoner` (R1/thinking), which rejects `toolChoice: 'required'`. Every DeepSeek-stack query has used the deterministic classify() fallback since LLM_FIRST_PLANNER_ENABLED was flipped on 2026-05-04. Fix brief exists: `CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md`. Changes: 6 targeted edits to `registry.ts` only.

### BF.GAP.002 — Phase 2 E2E Baseline Never Established
Because of GAP.001, the planner has never fired in production. Phase 2 E2E observation (intended to evaluate GT.002, GT.025, R14/R15 on live traffic) yielded no usable planner data. The observation phase must be re-run after GAP.001 is fixed.

### BF.GAP.003 — GT.002 and GT.025 Planner Failures (Deferred)
GT.002 ("mantra for spiritual progress" — alignment-character remedial): §4.2 explicitly teaches no-vector_search for alignment remedial, overriding R18 even when "spiritual" domain is present. GT.025 ("interesting about chart" — lightweight holistic): §4.7 gravitational pull produces 2-tool plan where gold expects richer. Both are known post-v1.6 residuals deferred to PROMPT-S2.

### BF.GAP.004 — R14/R15 Re-evaluation Pending
R14 (cgm_graph_walk holistic-only relaxed) and R15 (resonance_register remedial-only relaxed) were accepted provisionally. Full re-evaluation requires live E2E traffic, which requires GAP.001 fixed first.

### BF.GAP.005 — cgm_graph_walk Returns Zero Rows on Single Seed
E2E observation: cgm_graph_walk returned zero_rows when called with a single HSE seed. The tool likely needs ≥2 seeds or a different seed-selection strategy. Affects graph-walk quality on holistic queries.

### BF.GAP.006 — msr_sql Zero Rows on Finance Domain
E2E observation: msr_sql returned zero_rows on a finance+Jupiter/Venus query with confidence_floor=0.6. The floor may be too restrictive for the finance domain. Affects retrieval completeness for financial astrology queries.

### BF.GAP.007 — Synthesis Latency on DeepSeek (~3.5 min)
E2E observation: deepseek-v4-pro synthesis call took ~3.5 minutes. Whether this is normal (deep chain-of-thought) or degraded performance is unknown. Requires investigation.

### BF.GAP.008 — CONTEXT_ASSEMBLY Flag Pending Smoke
Migration 035 (context_assembly schema additions) was applied. The CONTEXT_ASSEMBLY feature flag flip has not been smoke-tested in production.

### BF.GAP.009 — 28 Pre-Existing Test File Failures
28 test files fail for reasons predating BHISMA: 11 Playwright e2e, manifest_planner.test.ts (incomplete ai SDK mock), cgm_graph_walk.test.ts (flag variant), synthesis orchestrator contract drift, component contract drift, route.test.ts mock gap. None introduced by BHISMA but create noise in test runs.

### BF.GAP.010 — 16 Structured Tools Missing query_id in tool_execution_log
Phase 11B scope (legacy deletion cleanup). The 16 tools in `/lib/tools/structured/` still lack direct query_id. Partially mitigated by TOOLS-S1 (onStepFinish hook captures them), but the tools themselves don't self-log. Phase 11B territory.

### BF.GAP.011 — Discovery Freshness (Signal Embedding Refresh)
MSR/UCN signal embeddings were last refreshed at a fixed point. As the corpus evolves, the vector index drifts from ground truth. BHISMA-W2-S1-DISCOVERY-FRESHNESS was deferred and remains unscheduled.

### BF.GAP.012 — Phase 11B Legacy Deletion Not Executed
The legacy query pipeline (classify → compose → plan_per_tool) remains in the codebase as a rollback path. Phase 11B (deletion) was gated on corpus + retrieval stability. That stability is not yet established.

---

## §4 — BHISMA Final Execution Plan

BHISMA Final has five phases. Phases BF.0 and BF.1 are sequential prerequisites. BF.2, BF.3, and BF.4 are parallel-safe with each other after BF.1 completes. BF.5 is the close gate.

```
BF.0 ──► BF.1 ──┬──► BF.2 ──┐
                 ├──► BF.3 ──┤──► BF.5
                 └──► BF.4 ──┘
```

---

### Phase BF.0 — Production Unblock (IMMEDIATE, 1 session)

**Goal:** Fix the production blocker that has prevented the LLM planner from ever firing. No other BHISMA work is meaningful until this is resolved.

**Addresses:** BF.GAP.001

**Session:** `BHISMA-BF0-S1-PLANNER-FIX`
**Brief:** `CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md` (already authored — ready to execute)
**Trigger phrase:** `Read CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md and execute it.`

**Deliverables:**
- `registry.ts`: 6 targeted changes — `FAMILY_WORKER['deepseek']` → `'deepseek-chat'`; `STACK_ROUTING.deepseek.planner_fast.primary` → `'deepseek-chat'`; same for context_assembly and worker; un-deprecate deepseek-chat entry; warn on deepseek-v4-flash entry
- `tsc --noEmit` — no new errors
- `npm test` — same pass count as before

**Acceptance gate:** `grep deepseek-v4-flash platform/src/lib/models/registry.ts` shows it only in the MODELS array definition, not in any routing table entry.

**Time estimate:** Single short session (~30 min in Antigravity).

---

### Phase BF.1 — E2E Baseline (No Code, 1 observation run)

**Goal:** After BF.0 deploys, run 6–10 targeted queries and observe the planner firing for the first time. Collect ground truth for BF.2 decisions.

**Addresses:** BF.GAP.002, BF.GAP.004, BF.GAP.005, BF.GAP.006, BF.GAP.007

**What to run (query targets):**

| Query Target | Covers |
|---|---|
| "What mantra should I chant for spiritual progress?" | GT.002 — alignment+spiritual remedial |
| "What is most interesting about my chart?" | GT.025 — lightweight holistic |
| "Tell me about Saturn in my 10th house" | R14 — structural positional (should get cgm_graph_walk) |
| "What remedies for health issues in my chart?" | R15 — remedial with domain (should get resonance_register) |
| "Give me a comprehensive overview of my life path" | R19 — comprehensive holistic |
| "What is the Jupiter-Venus interaction for career/finances?" | BF.GAP.005/006 — multi-seed graph + finance domain |
| "What does my chart say about relationships?" | General interpretive baseline |
| "What Dasha period challenges are coming next year?" | Predictive with temporal scope |

**Observation queries to run in Antigravity (same SQL as E2E-S1):**

```sql
-- Run after deploying BF.0
SELECT q.id, q.query_text, qpl.plan_json IS NOT NULL AS planner_fired,
       qpl.fallback_used, qpl.parse_error, qpl.planner_latency_ms,
       lc.model_id, lc.call_stage
FROM queries q
LEFT JOIN query_plan_log qpl ON q.id = qpl.query_id
LEFT JOIN llm_call_log lc ON q.id = lc.query_id AND lc.call_stage = 'planning'
ORDER BY q.created_at DESC
LIMIT 20;
```

**Decision gate for BF.2:** Review `plan_json` for each query. Do GT.002 and GT.025 still fail? Are R14/R15 tool selections stable? Are cgm_graph_walk seeds sufficient? Return observations to open BF.2.

**Time estimate:** 30-minute query run + SQL pull in Antigravity. No session brief needed.

---

### Phase BF.2 — Planner Quality (1–2 sessions, post BF.1)

**Goal:** Ship PLANNER_PROMPT v1.7 fixing the known residuals from v1.6 eval, informed by actual live E2E data from BF.1.

**Addresses:** BF.GAP.003, BF.GAP.004

**Session:** `BHISMA-BF2-S1-PROMPT-V17`
**Brief:** `CLAUDECODE_BRIEF_BHISMA_PROMPT_S2_v1_0.md` (to be authored after BF.1 data is reviewed)

**Planned changes to PLANNER_PROMPT_v1_0.md (v1.6 → v1.7):**

| Fix | Target | Rule / Section |
|---|---|---|
| GT.002: alignment remedial + "spiritual" domain | R18 override: when query is alignment-character type but contains a domain keyword, R18 DOES fire (add vector_search). Revise §4.2 few-shot. | R18 + §4.2 |
| GT.025: lightweight holistic "interesting" | Add §4.11 few-shot: lightweight holistic curiosity queries → [cluster_atlas, pattern_register, cgm_graph_walk] (3-tool plan, not 2) | §4.11 new |
| R14/R15 re-evaluation | Based on BF.1 live data. If structural positional queries systematically miss cgm_graph_walk → tighten R14. If remedial queries miss resonance_register → tighten R15. | R14/R15 |

**Eval protocol:**
1. Patch PLANNER_PROMPT_v1_0.md with proposed v1.7 changes
2. Run `npm run eval:planner` (29-case smoke)
3. Target: recall ≥ 0.940, precision ≥ 0.945 (maintain v1.6 baseline)
4. If gate passes: commit + record as v1.7 in frontmatter

**Parallel safety:** BF.2 is parallel-safe with BF.3 and BF.4 (different files).

---

### Phase BF.3 — Retrieval Quality (1–2 sessions, post BF.1, parallel with BF.2)

**Goal:** Fix the two retrieval-layer gaps observed in E2E, and refresh signal embeddings.

**Addresses:** BF.GAP.005, BF.GAP.006, BF.GAP.011

#### BF.3-A — cgm_graph_walk Seed Strategy

**File:** `platform/src/lib/retrieve/cgm_graph_walk.ts`

**Problem:** Returns zero_rows when called with a single HSE (House-Sign-Element) seed. The graph walk likely needs ≥2 seeds to generate useful traversal paths.

**Fix options (investigate in brief):**
- Option A: If query has one graph_seed_hint, auto-derive a second seed from the query context (e.g., primary planet + its lord)
- Option B: Add a `min_seeds` check in cgm_graph_walk.ts — if seeds < 2, generate a default second seed from the natal chart context
- Option C: Lower the zero-results threshold and return partial traversal

**Brief:** `CLAUDECODE_BRIEF_BHISMA_CGM_S1_v1_0.md` (to be authored)

#### BF.3-B — msr_sql Finance Domain Floor

**File:** `platform/src/lib/retrieve/msr_sql.ts`

**Problem:** confidence_floor=0.6 filters out all finance-domain signals for Jupiter/Venus queries. Finance signals may naturally score lower due to corpus distribution.

**Fix options:**
- Option A: Per-domain confidence_floor table (finance → 0.45, spiritual → 0.5, default → 0.6)
- Option B: Dynamic floor: if zero_rows returned at floor=0.6, retry at floor=0.4
- Option C: Investigate whether the signals exist but score low — may be a corpus gap not a threshold gap

**Brief:** Can be combined with BF.3-A as a single session.

#### BF.3-C — Discovery Freshness (Signal Embedding Refresh)

**Session:** `BHISMA-BF3-S2-DISCOVERY-FRESHNESS` (separate session — database-heavy)

Refresh MSR/UCN signal embeddings against the current corpus state. This was deferred from Wave 2. Run the embedding refresh scripts and verify vector search quality on the golden set.

**Parallel safety:** BF.3 sessions are parallel-safe with BF.2 (different files: cgm_graph_walk.ts / msr_sql.ts vs PLANNER_PROMPT_v1_0.md).

---

### Phase BF.4 — Platform Cleanup (1–2 sessions, post BF.1, parallel with BF.2/BF.3)

**Goal:** Clear accumulated technical debt from Waves 1/2 and Phase 1.

**Addresses:** BF.GAP.008, BF.GAP.009, BF.GAP.012

#### BF.4-A — CONTEXT_ASSEMBLY Smoke + Flag Flip

**Session:** `BHISMA-BF4-S1-CTX-ASSEMBLY`

Migration 035 (context_assembly schema) was applied but the feature has not been end-to-end verified in production. This session runs a smoke test and, if it passes, flips the CONTEXT_ASSEMBLY flag.

Acceptance: smoke passes, plan_json contains context_assembly entries for at least 2 test queries.

#### BF.4-B — Pre-existing Test Failures (Priority triage)

**Session:** Can be combined with BF.4-A or run separately.

The 28 pre-existing failing test files break `npm test` noisily. While not all are BHISMA's responsibility (many are Phase 11B legacy-deletion scope), the highest-priority ones to fix are:
- `route.test.ts` — mock gap after registry simplification (STACK_ROUTING not exported from mock)
- `manifest_planner.test.ts` — incomplete ai SDK mock (this one is directly BHISMA-adjacent)
- The three retrieve/__tests__ "returns empty results for unknown domain" failures (contract drift)

**BF.4-B does NOT include:** Playwright e2e failures (browser runtime required), synthesis orchestrator failures (Phase 11B scope), component test drift (portal redesign archival scope).

#### BF.4-C — Phase 11B Legacy Deletion (gated, can be deferred to BF.5)

Delete the legacy query pipeline (classify → compose → planPerTool path). Gate: BF.2 and BF.3 both complete; planner firing reliably on all 5 stacks for ≥7 days. This is the most impactful cleanup but carries the highest risk — only execute after the new path has proven stable.

**Parallel safety:** BF.4 is parallel-safe with BF.2 and BF.3 (different files).

---

### Phase BF.5 — BHISMA Final Close Gate (1 session, after BF.2+BF.3+BF.4)

**Goal:** Integration smoke, full test run, governance close artifact.

**Session:** `BHISMA-BF5-S1-CLOSE`

**Acceptance gate (all must pass before BHISMA is declared COMPLETE):**

| Criterion | Requirement |
|---|---|
| Planner fires on all 5 stacks | Verified via E2E SQL query — no `fallback_used=true` on healthy model calls |
| DeepSeek planner model | `FAMILY_WORKER['deepseek'] === 'deepseek-chat'` confirmed |
| GT.002 fixed | v1.7 eval passes GT.002 case |
| GT.025 fixed | v1.7 eval passes GT.025 case |
| Planner eval scores | recall ≥ 0.940, precision ≥ 0.945 maintained at v1.7 |
| CI gate | `.github/workflows/ci.yml` passes on current branch |
| cgm_graph_walk | No zero_rows on 2-seed holistic queries |
| msr_sql finance | Retrieves ≥1 row on finance+Jupiter/Venus query |
| tsc --noEmit | Zero errors in src/ (pre-existing test file errors excluded) |
| Phase 11B legacy | Either deleted or formally deferred with a dated gate decision |
| BHISMA_FINAL_CLOSE_v1_0.md | This sealing artifact authored and committed |

---

## §5 — Execution Schedule (Parallel Rounds)

### Round 0 (NOW — blocking everything)
```
┌─────────────────────────────────┐
│  BF.0: Execute PF-S1 brief      │ ← Antigravity, single session
│  File: registry.ts only         │
│  Time: ~30 min                  │
└─────────────────────────────────┘
```
**Trigger:** `Read CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md and execute it.`

### Round 1 (After BF.0 deployed)
```
Native runs 8 targeted queries → pulls E2E SQL → shares with Claude
```
No code session. 30-minute observation window. Output feeds Rounds 2+.

### Round 2 (After BF.1 data reviewed — 3 parallel sessions)
```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  BF.2-S1             │  │  BF.3-A/B            │  │  BF.4-A/B            │
│  PLANNER PROMPT v1.7 │  │  CGM + MSR fixes     │  │  CTX-ASSEMBLY smoke  │
│  PLANNER_PROMPT only │  │  cgm_graph_walk.ts   │  │  + Test triage       │
│                      │  │  msr_sql.ts          │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```
All three parallel. Zero file overlap guaranteed.

### Round 3 (After Round 2 — sequential)
```
┌──────────────────────────────────┐  ┌────────────────────────────┐
│  BF.3-C                          │  │  BF.4-C (if gate met)      │
│  Discovery Freshness             │  │  Phase 11B legacy deletion │
│  (DB-heavy — own session)        │  │  (gated on 7-day soak)     │
└──────────────────────────────────┘  └────────────────────────────┘
```

### Round 4 (Close)
```
┌───────────────────────────────────────────────────────┐
│  BF.5-S1: BHISMA Final Close Gate                     │
│  Integration smoke + full test run + close artifact   │
└───────────────────────────────────────────────────────┘
```

---

## §6 — Session Brief Inventory

| Brief File | Phase | Status |
|---|---|---|
| `CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md` | BF.0 | **READY — execute now** |
| `CLAUDECODE_BRIEF_BHISMA_PROMPT_S2_v1_0.md` | BF.2 | To be authored after BF.1 data |
| `CLAUDECODE_BRIEF_BHISMA_CGM_S1_v1_0.md` | BF.3-A/B | To be authored after BF.1 data |
| `CLAUDECODE_BRIEF_BHISMA_CTX_S1_v1_0.md` | BF.4-A | To be authored after BF.1 |
| `CLAUDECODE_BRIEF_BHISMA_CLOSE_v1_0.md` | BF.5 | To be authored after BF.2+3+4 |

---

## §7 — Hard Constraints

1. **Do not touch manifest_planner.ts** — `toolChoice: 'required'` is the correct approach for NIM compatibility. The historical bug was wrong model ID, not calling convention.
2. **Do not touch synthesis routing** — `STACK_ROUTING.deepseek.synthesis.primary = 'deepseek-v4-pro'` is confirmed working in E2E logs. Do not change.
3. **Do not rename deepseek-reasoner** — retained as deprecated alias for persisted model IDs.
4. **Phase 11B legacy deletion only after 7-day soak** — the new planner path must prove stable in production before the fallback path is deleted.
5. **Planner prompt eval must pass gate before commit** — any v1.7 change that drops recall below 0.940 or precision below 0.945 is rejected.
6. **No M-phase content** — BHISMA sessions never touch 01_FACTS_LAYER, 025_HOLISTIC_SYNTHESIS, 06_LEARNING_LAYER, or any astrology content files.

---

## §8 — What BHISMA Final Completion Means

BHISMA is COMPLETE when:
- The LLM planner fires successfully on all 5 stacks (verified by live query_plan_log)
- Planner eval scores ≥ recall 0.940 / precision 0.945 at v1.7
- GT.002 and GT.025 are resolved
- cgm_graph_walk and msr_sql retrieval gaps are fixed
- The CI regression gate is green on main
- `BF.5-S1-CLOSE` sealing session has been executed

At that point, the MARSYS-JIS M5 Probabilistic Engine has a clean, observable, well-tested inference substrate beneath it. BHISMA's mission is fulfilled.

---

## §9 — What This Means for MARSYS-JIS

| Dependency | Status after BHISMA Final |
|---|---|
| M5 — Probabilistic Engine | Unblocked: inference substrate proven reliable |
| Phase 10 — Calibration Loop | Unblocked: prediction logging + audit view working; needs accumulated outcome data |
| LEL live maintenance | Unchanged — independent of BHISMA |
| Prospective Prediction Logging | Enabled: planner + synthesis pipeline observable, predictions can be logged with confidence |

---

*End of BHISMA_FINAL_PLAN_v1_0.md — authored 2026-05-04. BHISMA Final Round 0 is ready to execute: `Read CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md and execute it.`*
