---
artifact: PROJECT_GANGA_PLAN_v1_0.md
canonical_id: PROJECT_GANGA_PLAN
version: 1.0
status: CURRENT
authored_by: Claude (Cowork — GANGA-OPEN session) 2026-05-04
project_code: GANGA
macro_phase: M5 prerequisite (parallel engineering sprint)
supersedes: >
  BHISMA_FINAL_PLAN_v1_0.md and all prior BHISMA planning documents.
  Those remain as historical record — this is the single canonical forward plan.
changelog:
  - 1.0 (2026-05-04): Initial Ganga plan. Consolidates BHISMA Final + Opus critical analysis.
    Adds Workstream L (24 synthesis quality items). Trims K/D/F/J per Opus rebalancing.
    Total scope: 114 items across 11 workstreams (A–L + K).
---

# Project Ganga — Master Plan v1.0

---

## §0 — Executive Summary

**Project Ganga** is the platform elevation and synthesis quality sprint that must
complete before MARSYS-JIS M5 (Probabilistic Engine) can run.

**What BHISMA built:** Robust infrastructure. Multi-stack LLM routing. Intelligent
planner. Trace Command Center. MON observability. A platform that *can* execute
complex Jyotish queries reliably.

**What Ganga adds:** Everything needed to make that platform produce *acharya-grade answers*.
The synthesis layer — the only layer that touches the native's actual question — has
zero coverage in the prior BHISMA scope. Ganga closes that gap.

**The Opus verdict (critical analysis, 2026-05-04):** "Project Ganga as currently scoped
will produce a robust five-stack RAG platform with reliable planner and observable
retrieval. It will not produce an acharya-grade Jyotish instrument. The synthesis layer —
the only layer that touches the native's actual question — has zero coverage."

Ganga's scope rebalances accordingly: Workstream L (synthesis quality, 24 items) is added
as the highest-value gate. Workstreams K, D, F, J are trimmed to their essential core.

---

## §1 — Current State (at Ganga open, 2026-05-04)

### What is working

| Component | Status | Evidence |
|---|---|---|
| Multi-provider model registry (5 stacks, 11+ models) | ✅ LIVE | registry.ts |
| LLM-first planner (manifest_planner.ts) | ✅ CODE ON | LLM_FIRST_PLANNER_ENABLED=true (fa75e1a) |
| Planner prompt v1.6 | ✅ GATE MET | recall=0.940, precision=0.945 on 29-case golden set |
| Planner circuit breaker | ✅ LIVE | Falls back to classify() on repeated failures |
| Universal Query Engine | ✅ LIVE | planner→arbitrator→trace wiring |
| Budget arbitrator | ✅ LIVE | Constrains planner vs synthesis token envelope |
| MON tables (query_plan_log, llm_call_log, tool_execution_log) | ✅ LIVE | Migrations 032/033/034 |
| Retrieve-tool execution logging | ✅ LIVE | 15 structured tools self-log |
| Synthesis-time tool logging | ✅ LIVE | TOOLS-S1 onStepFinish hook |
| Planner params threaded to retrieve tools | ✅ LIVE | TRACE-S1 plannerParamsMap |
| Trace Command Center (5 panels) | ✅ LIVE | Warm palette, QueryDNA, RetrievalScorecard |
| CI planner regression gate | ✅ LIVE | .github/workflows/ci.yml |

### What is NOT working (confirmed by E2E observation 2026-05-04)

| Problem | Root Cause | Impact |
|---|---|---|
| **DeepSeek planner never fires** | `deepseek-v4-flash` is not a valid API model ID → routes to deepseek-reasoner → rejects toolChoice | **100% fallback to classify() on all DeepSeek queries. plan_json=NULL on every query.** |
| LLM planner has never successfully fired in production | Consequence of above | The entire Wave 2 + Phase 1 planner investment has not yet been exercised in production |

### BHISMA history at Ganga open

| Wave/Phase | Dates | Key deliverables | Status |
|---|---|---|---|
| Wave 1 | 2026-05-01 | Model registry, NVIDIA NIM, planner.ts, Trace Command Center | CLOSED |
| Wave 2 | 2026-05-01 to 2026-05-03 | UQE, budget_arbiter, MON, DB migrations, EVAL golden set | CLOSED |
| Phase 1 Hardening | 2026-05-04 | CI-S1, CLEANUP-S1, TOOLS-S1, TRACE-S1 | COMPLETE |
| Planner prompt v1.1→v1.6 | 2026-05-04 | 6 eval rounds, GATE MET | COMPLETE |

---

## §2 — Scope: 11 Workstreams, 114 Items

Workstreams are organized by gate. **Gate 0 (K) is the foundational prerequisite** — no
other workstream executes until Gate 0 closes. Gates 1–4 follow in sequence, with
within-gate parallelism where file-lock rules permit.

```
Gate 0 (K): LLM Stack Audit
  ↓
Gate 1: Production Fix + E2E Baseline
  ↓
Gate 2: Hardening (A, B, C, D, E, F, G, H, I, J — parallel)
  ↓
Gate 3: Synthesis Quality (L — sequential)
  ↓
Gate 4: Integration + Close
```

---

### Workstream K — LLM Stack Review (Gate 0, 3 items — FOUNDATIONAL PREREQUISITE)

**Why first:** The registry model selection drives every planner, synthesis, and cost
decision across all 5 stacks. Any gap here propagates downstream into all other workstreams.
NIM stack in particular needs deliberate model selection — nemotron-49B may not be optimal.
No other workstream should execute until K is done.

| ID | Item | Priority |
|---|---|---|
| K.1 | Audit the complete model × stack × role matrix (planner, synthesis, context_assembly, worker) against live API capabilities. Produce a table: model, supports_toolChoice, supports_streaming, latency_p50, cost_per_1M. | P0 |
| K.2 | NIM stack: evaluate nemotron-49B vs nemotron-70B vs alternative NIM-hosted models for the planner_deep role. Current nemotron-49B recall=0.710 was the Lever 2 hold. Determine if a different NIM model would clear the 0.80/0.90 threshold. | P0 |
| K.3 | Author `00_ARCHITECTURE/MODEL_REGISTRY_v1_0.md` — rationale document for every stack × role assignment. This is the governance artifact that explains *why* each model is where it is. Gates Lever 3 NIM consideration. | P0 |

**Output:** `MODEL_REGISTRY_v1_0.md`. **Gate 0 does not close until this document exists.**

---

### Workstream A — Production Blocker Fix (Gate 1, 1 item)

| ID | Item | Priority |
|---|---|---|
| A.1 | Fix `deepseek-v4-flash` → `deepseek-chat` in `platform/src/lib/models/registry.ts`. 6 targeted changes: FAMILY_WORKER['deepseek'], STACK_ROUTING.deepseek.planner_fast.primary, .context_assembly.primary, .worker.primary; un-deprecate deepseek-chat entry; warn on deepseek-v4-flash. **Brief already authored:** `CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md`. | P0 BLOCKING |

**Trigger:** `Read CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md and execute it.`

---

### Workstream B — E2E Baseline (Gate 1, 1 item — observation, no code)

| ID | Item | Priority |
|---|---|---|
| B.1 | After A.1 deploys: run 8 targeted queries (see §3 query table). Pull E2E SQL from query_plan_log, llm_call_log, tool_execution_log. Confirm plan_json IS NOT NULL for first time in production. Assess GT.002, GT.025, R14/R15 on live planner output. Record observations. This data gates all of Gate 2. | P0 |

**Query targets:**
- "What mantra for spiritual progress?" → GT.002
- "What is most interesting about my chart?" → GT.025
- "Saturn in my 10th house" → R14 cgm_graph_walk
- "Remedies for health issues?" → R15 resonance_register
- "Comprehensive life path overview" → holistic baseline
- "Jupiter-Venus interaction for career/finances?" → GAP.005/006
- "What does my chart say about relationships?" → interpretive baseline
- "Dasha period challenges next year?" → predictive baseline

---

### Workstream C — Planner Quality (Gate 2, 5 items)

| ID | Item | Priority |
|---|---|---|
| C.1 | GT.002 fix: `PLANNER_PROMPT_v1_0.md` v1.7 — alignment-character remedial queries that contain a domain keyword should still include vector_search (R18 override). Revise §4.2 few-shot. | P1 |
| C.2 | GT.025 fix: add §4.11 few-shot — "interesting about chart" lightweight holistic → [cluster_atlas, pattern_register, cgm_graph_walk] (3-tool plan, not 2). | P1 |
| C.3 | R14 re-evaluation: if live E2E data (B.1) shows structural positional queries systematically miss cgm_graph_walk, tighten R14. | P1 |
| C.4 | R15 re-evaluation: if live data shows remedial queries miss resonance_register, tighten R15. | P1 |
| C.5 | Run full 29-case golden set eval at v1.7: maintain recall ≥ 0.940, precision ≥ 0.945. Commit if gate passes. | P1 |

**Brief to author:** `CLAUDECODE_BRIEF_GANGA_PROMPT_S1_v1_0.md` (after B.1 data reviewed)

---

### Workstream D — Retrieval Quality (Gate 2, 5 items)

| ID | Item | Priority |
|---|---|---|
| D.1 | cgm_graph_walk seed strategy: fix zero_rows on single-seed queries. Options: auto-derive second seed from natal chart context; add min_seeds check; lower zero-results threshold. Investigate first, fix second. | P1 |
| D.2 | msr_sql finance domain: confidence_floor=0.6 filters all finance signals. Options: per-domain floor table (finance→0.45); dynamic retry at 0.4 if zero_rows; corpus gap investigation. | P1 |
| D.3 | Discovery freshness: refresh MSR/UCN signal embeddings against current corpus state. Run embedding refresh scripts; verify vector search quality against golden set. | P2 |
| D.4 | CONTEXT_ASSEMBLY smoke: migration 035 applied but feature not E2E verified. Smoke in production; flip CONTEXT_ASSEMBLY flag if passes. | P2 |
| D.5 | Evaluate whether vector_search retrieval can be improved for remedial queries (R15 / resonance_register gap identified in B.1). | P2 |

**Brief to author:** `CLAUDECODE_BRIEF_GANGA_RETRIEVAL_S1_v1_0.md`

---

### Workstream E — Test Coverage (Gate 2, 5 items)

| ID | Item | Priority |
|---|---|---|
| E.1 | Fix `manifest_planner.test.ts` — incomplete ai SDK mock. This test is directly BHISMA/Ganga-adjacent and currently fails noisily. | P1 |
| E.2 | Fix `route.test.ts` — STACK_ROUTING not exported from mock after registry simplification. | P1 |
| E.3 | Fix `cgm_graph_walk.test.ts` flag variant failures (3 tests). | P2 |
| E.4 | Fix retrieve `__tests__` contract drift ("returns empty results for unknown domain" failures). | P2 |
| E.5 | Triage the remaining 24 pre-existing failing test files. Categorize: (a) BHISMA scope to fix now; (b) Phase 11B scope (legacy deletion); (c) portal redesign archival scope; (d) browser runtime only. Produce a disposition table. | P3 |

**Brief:** can be combined with D as a single Gate 2 session.

---

### Workstream F — NIM Stack (Gate 2, 3 items — trimmed from 8)

| ID | Item | Priority |
|---|---|---|
| F.1 | Verify NVIDIA NIM API key active and all 3 NIM-routed calls (planner_deep, context_assembly, synthesis) respond within SLA. | P1 |
| F.2 | Based on K.2 model selection: if a NIM model other than nemotron-49B is chosen, update STACK_ROUTING.nim entries accordingly. | P2 |
| F.3 | Lever 3 evaluation: if native authorizes, swap planner_deep to the K.2-selected model, re-run EVAL-B smoke (29 cases). If recall ≥ 0.80 AND precision ≥ 0.90: update registry + document in MODEL_REGISTRY. | P3 (gated on native authorization) |

---

### Workstream G — Observability + MON (Gate 2, 4 items)

| ID | Item | Priority |
|---|---|---|
| G.1 | Wire query_plan_log data into TracePanel QueryDNAPanel — show tool_calls from plan_json as the planned tools list, not just what was actually called. Closes the plan vs actual gap in the Trace UI. | P1 |
| G.2 | Verify llm_call_log completeness: every LLM call (planner, context_assembly, synthesis) has a row. Check for missing call_stage values post-PF-S1. | P2 |
| G.3 | Observatory/Ustad integration: wire live query events to the Phase O observatory pipeline. Currently observatory pulls from LLM cost data but has no real-time query event feed. | P2 |
| G.4 | DeepSeek synthesis latency investigation: E2E observed ~3.5 min for deepseek-v4-pro synthesis. Determine if this is normal (deep chain-of-thought) or degraded. Set timeout thresholds appropriately. | P2 |

---

### Workstream H — CI/CD + Platform Cleanup (Gate 2, 3 items)

| ID | Item | Priority |
|---|---|---|
| H.1 | Verify `.github/workflows/ci.yml` passes green on main post-PF-S1 fix. No action needed if CI already green; document if any adjustment required. | P1 |
| H.2 | Feature flag audit: identify any deprecated feature flags (AUDIT_ENABLED was retired at Wave 1; PER_TOOL_PLANNER_ENABLED retired; CGM_GRAPH_WALK_ENABLED retired). Remove them from the FeatureFlag type union. | P2 |
| H.3 | Phase 11B legacy deletion: delete the legacy query pipeline (classify → compose → plan_per_tool path). **Gate: planner has fired reliably for ≥7 days in production AND Gate 2 is fully closed.** Do not execute earlier. | P3 (gated) |

---

### Workstream I — Trace UI Enhancement (Gate 2, 4 items)

| ID | Item | Priority |
|---|---|---|
| I.1 | TracePanel: display `plan_json` tool call params in QueryDNAPanel — the per-tool plannerParams that TRACE-S1 threads through executeWithCache. Currently threaded but not displayed in UI. | P2 |
| I.2 | AnalyticsTab: wire to live query_plan_log data — cross-query class distribution, planner latency trend, fallback_used rate. Currently the tab exists but data connection needs verification post-MON. | P2 |
| I.3 | CostPerformanceBar: verify USD cost computation is live with new registry cost rates. Test with at least one query per stack. | P2 |
| I.4 | RetrievalScorecard: wire per-tool signal scores from tool_execution_log (score field added in Wave 2). Currently showing static structure, not live data. | P3 |

---

### Workstream J — Design System Alignment (Gate 2, 2 items — trimmed from 7)

| ID | Item | Priority |
|---|---|---|
| J.1 | TracePanel visual alignment: verify the warm-dark palette introduced in Wave 1 is consistent with the portal redesign design system (R0–R7). Fix any obvious palette/typography drift. | P3 |
| J.2 | Portal integration smoke: verify TracePanel renders correctly within the completed portal redesign shell (R7 delivered). No functional changes — visual regression check only. | P3 |

---

### Workstream L — Synthesis Quality (Gate 3, 24 items — HIGHEST VALUE)

**Context (Opus critical analysis verdict):** The synthesis layer is the only layer that
produces answers the native actually reads. It has zero governance in the prior BHISMA scope.
Every retrieval improvement and planner improvement is wasted if the synthesis prompt
produces formulaic, non-acharya-grade answers. Workstream L is Gate 3's entire content.

#### L.1 — Synthesis Prompt Architecture (8 items)

| ID | Item | Priority |
|---|---|---|
| L.1.1 | Author `SYNTHESIS_PROMPT_v1_0.md` skeleton — document analogous to PLANNER_PROMPT_v1_0.md but for the synthesis model. Establish the governance structure: versioned, frontmatter-bearing, eval-gated before any commit. | P0 |
| L.1.2 | Embed Jyotish methodology enforcement — B.11 (Whole-Chart-Read) encoded as explicit synthesis instruction: every answer must name which L2.5 synthesis layers were consulted (MSR, UCN, CDLM, CGM, RM) and what each surfaced. | P0 |
| L.1.3 | Define citation schema — every claim in a synthesis answer must cite a specific corpus source (signal ID, FORENSIC field, LEL event). "As is known classically" is forbidden. B.3 derivation-ledger discipline encoded in the prompt. | P0 |
| L.1.4 | Disclosure-tier structure — synthesis prompt must enforce the per-class disclosure tier (RESEARCH, MEMBER, GUEST, PUBLIC) defined in the pipeline. Acharya-mode explanations only for RESEARCH tier. | P1 |
| L.1.5 | Per-query-class synthesis variants — the prompt must behave differently for predictive (confidence intervals, horizon, falsifier) vs interpretive (multi-layer cross-reference) vs remedial (remedy + mechanism + source) vs holistic (cross-domain linkage, contradiction surfacing) queries. | P1 |
| L.1.6 | Counterfactual check instruction — synthesis must ask: "Does this claim survive if the weaker planet in this combination is reversed?" Force the model to self-falsify before committing to a strong claim. | P1 |
| L.1.7 | Worked examples section (§4 analogous to planner prompt) — at least 3 exemplary acharya-grade answers, one per query class, showing the expected depth, citation style, and contradiction-surfacing behavior. | P1 |
| L.1.8 | Length and structure discipline — define output schema: structured sections (Pattern Summary, Layer Cross-Reference, Synthesis Claim, Confidence, Falsifier for predictive, Remedy Mechanism for remedial). Not free-form prose. | P1 |

#### L.2 — Acharya-Grade Answer Evaluation (6 items)

| ID | Item | Priority |
|---|---|---|
| L.2.1 | Build 100-query acharya-grade answer eval set — analogous to the planner's 29-case golden set but for synthesis quality. Include: 20 predictive (each requiring confidence interval + falsifier), 20 interpretive (multi-layer), 20 remedial, 20 holistic (contradiction-surfacing), 20 edge cases. | P0 |
| L.2.2 | Build LLM-as-judge harness — automated scorer that evaluates synthesis answers against the eval set. Metrics: citation_coverage (fraction of claims with corpus citations), b11_compliance (fraction that name all 5 L2.5 layers), acharya_depth_score (LLM judge 1-5 scale vs exemplar answer), disclosure_tier_correct. | P0 |
| L.2.3 | Establish baseline: run current synthesis output (no SYNTHESIS_PROMPT changes yet) through the judge harness. Record baseline scores. This is the "before" state. | P1 |
| L.2.4 | Adversarial probes — 10 queries designed to break synthesis discipline: vague queries that invite generic astrology, leading questions that invite confirmation bias, queries that span 3+ domains requiring real holistic synthesis. Verify synthesis prompt handles all 10 with acharya discipline. | P1 |
| L.2.5 | CI gate for synthesis quality — add synthesis eval to CI pipeline alongside the planner regression gate. Fail PR if any metric regresses below established threshold. | P2 |
| L.2.6 | Multi-stack synthesis comparison — run the same 10 representative queries across all 5 stacks. Compare synthesis quality scores. Identify which stacks produce consistently lower quality and why. | P2 |

#### L.3 — B.11 Whole-Chart-Read Runtime Enforcement (3 items)

| ID | Item | Priority |
|---|---|---|
| L.3.1 | Holistic floor gate in UQE: before synthesis, assert that for any non-trivial query (>1 tool call planned), at least one of {msr_sql, vector_search} retrieved results from MSR/UCN context. If not: surface a warning in the trace (not a hard fail — soft signal). | P1 |
| L.3.2 | Synthesis-side audit: add a post-synthesis check that parses the synthesis response for the presence of L2.5 layer citations (MSR signal IDs, UCN pattern IDs, CDLM dates, CGM graph edge references). Log the coverage score to llm_call_log metadata. | P1 |
| L.3.3 | B.11 violation counter: aggregate the soft-signal from L.3.1 across sessions. If >20% of queries in a 24-hour window have zero holistic floor — surface a dashboard alert in the Trace UI AnalyticsTab. | P2 |

#### L.4 — Context Assembly Layer (4 items)

| ID | Item | Priority |
|---|---|---|
| L.4.1 | Context assembler module — `platform/src/lib/synthesis/context_assembler.ts`. Responsible for: collecting tool outputs, deduplicating overlapping content, applying Jyotish-methodology-aware ordering (FORENSIC floor first, then MSR signals, then synthesis patterns, then CGM graph), applying compression for long contexts. | P0 |
| L.4.2 | Floor/fill discipline: FORENSIC data (FORENSIC_ASTROLOGICAL_DATA chart facts) must always appear in synthesis context as a floor — never filtered out by low signal score. Implement as a mandatory pre-context insert. This is ADR-4 enforcement at the assembler level. | P0 |
| L.4.3 | Conflict surfacing: when two retrieved context items make contradictory claims about the same planet/house/dasha state, flag the conflict explicitly in the assembled context. The synthesis prompt (L.1) then handles it — but it must *see* the conflict first. | P1 |
| L.4.4 | Context assembly telemetry: emit a context_assembled step in the trace with: total_tokens_before_dedup, total_tokens_after_dedup, compression_ratio, conflict_count, forensic_floor_present. Wires into CONTEXT_ASSEMBLY feature flag (migration 035). | P1 |

#### L.5 — Calibration Substrate (4 items)

| ID | Item | Priority |
|---|---|---|
| L.5.1 | Prediction registration surface: every synthesis answer that makes a time-indexed prediction must automatically extract the prediction (horizon, confidence, falsifier) and log it to the prospective prediction log (currently `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` prediction subsection per CLAUDE.md §E). Build the extraction and logging hook in the synthesis pipeline. | P1 |
| L.5.2 | Outcome capture surface: the Phase 8 audit view already has an outcome form. Wire it to prediction_outcome_log table (migration to be authored). When the native records an outcome, link it back to the originating synthesis answer and prediction ID. | P1 |
| L.5.3 | Brier score calculation: for closed predictions (outcome recorded), compute Brier score and log to prediction_outcome_log. Aggregate Brier score per query_class in the Audit View predictions tab. This is the quantitative calibration signal. | P2 |
| L.5.4 | Native correction surface: add a "correct this claim" action to the Audit View answer display. When native marks a claim as incorrect, link the correction to the originating MSR signal ID or context item. Feed corrections back as negative examples for the next synthesis prompt revision. | P2 |

---

## §3 — Gap Map (inherited from BHISMA Final)

| Gap ID | Description | Workstream | Severity |
|---|---|---|---|
| GAP.001 | DeepSeek model ID mismatch (deepseek-v4-flash → deepseek-reasoner) | A.1 | CRITICAL |
| GAP.002 | E2E baseline never established (planner never fired in prod) | B.1 | CRITICAL |
| GAP.003 | GT.002 / GT.025 planner failures (deferred from v1.6) | C.1/C.2 | HIGH |
| GAP.004 | R14/R15 re-evaluation pending live E2E data | C.3/C.4 | HIGH |
| GAP.005 | cgm_graph_walk zero_rows on single seed | D.1 | HIGH |
| GAP.006 | msr_sql zero_rows on finance domain at confidence_floor=0.6 | D.2 | HIGH |
| GAP.007 | DeepSeek synthesis latency ~3.5 min (investigation needed) | G.4 | MEDIUM |
| GAP.008 | CONTEXT_ASSEMBLY flag not smoked in production | D.4 | MEDIUM |
| GAP.009 | 28 pre-existing test file failures | E.5 | MEDIUM |
| GAP.010 | 16 structured tools missing direct query_id in tool_execution_log | Phase 11B scope | LOW |
| GAP.011 | Discovery freshness / signal embedding drift | D.3 | MEDIUM |
| GAP.012 | Phase 11B legacy code not deleted | H.3 | LOW (gated) |
| GAP.013 (new) | Synthesis prompt: zero governance, no acharya-grade instruction | L.1 | CRITICAL |
| GAP.014 (new) | Answer quality: no evaluation harness, no metric, no CI gate | L.2 | CRITICAL |
| GAP.015 (new) | B.11 Whole-Chart-Read: no runtime enforcement | L.3 | HIGH |
| GAP.016 (new) | Context assembler: missing (no dedup, ordering, conflict surfacing) | L.4 | HIGH |
| GAP.017 (new) | Calibration substrate: prediction logging not wired to synthesis pipeline | L.5 | HIGH |

---

## §4 — Execution Schedule

### Gate 0 — LLM Stack Audit (PREREQUISITE, NOW)

```
┌────────────────────────────────────┐
│  GANGA-G0-S1-STACK-AUDIT           │
│  Workstream K (3 items)            │
│  Output: MODEL_REGISTRY_v1_0.md    │
│  Time: 1 session, ~1 hour          │
└────────────────────────────────────┘
```

**Brief:** `CLAUDECODE_BRIEF_GANGA_G0_S1_v1_0.md` (to be authored)
**Blocks all other gates.**

---

### Gate 1 — Production Fix + E2E Baseline (Sequential, after G0)

```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│  GANGA-G1-S1-PROD-FIX        │  →   │  E2E Observation (no code)   │
│  A.1: registry.ts fix        │      │  B.1: 8 queries + SQL pull   │
│  Brief: BHISMA_PF_S1 (ready) │      │  30 min, native runs queries │
└──────────────────────────────┘      └──────────────────────────────┘
```

---

### Gate 2 — Platform Hardening (Parallel workstreams, after G1)

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│  C+E: Planner      │  │  D: Retrieval       │  │  G+H: Observ +     │
│  PROMPT S1         │  │  CGM + MSR fixes    │  │  CI/Cleanup        │
│  29-case eval      │  │  + Embedding        │  │  + Trace UI        │
│  PLANNER_PROMPT    │  │  refresh            │  │  I: Trace wiring   │
└────────────────────┘  └────────────────────┘  └────────────────────┘
               ↑ All three parallel — zero file overlap ↑

F (NIM stack) runs concurrently with above if K.2 model selection needed.
J (design alignment) runs last — lowest priority.
H.3 (Phase 11B deletion) gated on 7-day prod soak.
```

---

### Gate 3 — Synthesis Quality (Sequential, after G2)

```
L.1+L.4: Author SYNTHESIS_PROMPT + context_assembler (foundational, sequential)
  ↓
L.2: Build eval harness + baseline (sequential)
  ↓
L.2.4+L.3: Adversarial probes + B.11 enforcement (can be parallel)
  ↓
L.5: Calibration substrate (sequential, last)
```

Gate 3 is largely sequential because each step's output feeds the next.
L.1 (synthesis prompt) must exist before L.2 (eval harness) can measure it.
L.2.3 (baseline) must exist before L.2.4 (adversarial probes) makes sense.

---

### Gate 4 — Integration + Close

```
┌────────────────────────────────────────────────────────────────┐
│  GANGA-G4-S1-CLOSE                                             │
│  Integration smoke: all 5 stacks, 8 query types               │
│  Synthesis eval: gate L.2 harness on final SYNTHESIS_PROMPT    │
│  Full test run: zero new failures vs G1 baseline              │
│  tsc --noEmit: zero src/ errors                               │
│  Author GANGA_CLOSE_v1_0.md                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## §5 — Brief Inventory

| Brief File | Gate | Workstream | Status |
|---|---|---|---|
| `CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md` | G1 | A.1 | **READY — execute after G0** |
| `CLAUDECODE_BRIEF_GANGA_G0_S1_v1_0.md` | G0 | K | To be authored (first action) |
| `CLAUDECODE_BRIEF_GANGA_PROMPT_S1_v1_0.md` | G2 | C | To be authored after B.1 |
| `CLAUDECODE_BRIEF_GANGA_RETRIEVAL_S1_v1_0.md` | G2 | D | To be authored after B.1 |
| `CLAUDECODE_BRIEF_GANGA_MON_S1_v1_0.md` | G2 | G | To be authored |
| `CLAUDECODE_BRIEF_GANGA_TEST_S1_v1_0.md` | G2 | E | To be authored |
| `CLAUDECODE_BRIEF_GANGA_SYNTH_PROMPT_S1_v1_0.md` | G3 | L.1+L.4 | To be authored after G2 |
| `CLAUDECODE_BRIEF_GANGA_SYNTH_EVAL_S1_v1_0.md` | G3 | L.2+L.3 | To be authored after L.1 |
| `CLAUDECODE_BRIEF_GANGA_CALIB_S1_v1_0.md` | G3 | L.5 | To be authored after L.2 |
| `CLAUDECODE_BRIEF_GANGA_CLOSE_v1_0.md` | G4 | — | To be authored after G3 |

---

## §6 — Hard Constraints

1. **Do not touch manifest_planner.ts** — `toolChoice: 'required'` is correct for NIM compatibility. The production bug was model ID, not calling convention.
2. **Do not touch STACK_ROUTING.deepseek.synthesis** — `deepseek-v4-pro` confirmed working in E2E.
3. **Do not rename deepseek-reasoner** — retained as deprecated alias for persisted model IDs.
4. **Phase 11B legacy deletion only after 7-day prod soak** — new planner must prove stable before fallback is deleted.
5. **Synthesis prompt eval gate before any commit** — any SYNTHESIS_PROMPT change that drops acharya_depth_score below established baseline is rejected.
6. **No M-phase content** — Ganga sessions never touch 01_FACTS_LAYER, 025_HOLISTIC_SYNTHESIS, 06_LEARNING_LAYER, or any astrology corpus files.
7. **Gate 0 (K) must close before any other gate opens** — no exceptions.
8. **B.11 enforcement is a soft gate (warning, not hard fail)** — synthesis must not be blocked when retrieval is incomplete. Warn and log; never 500.
9. **Prospective prediction data is sacrosanct** — L.5.1 logging must never see outcome before prediction is logged (per CLAUDE.md §E / MACRO_PLAN Learning Layer rule).

---

## §7 — What Ganga Completion Means for MARSYS-JIS

| Milestone | Status after Ganga Complete |
|---|---|
| M5 — Probabilistic Engine | **Unblocked.** Inference substrate reliable on all 5 stacks. Synthesis quality measured. Calibration loop instrumented. |
| Phase 10 — Calibration Loop | **Unblocked.** L.5 wires prediction logging to outcome capture. Brier scores computable. |
| Phase 11B — Legacy Deletion | **Unblocked** (if 7-day soak met at Gate 2). |
| Observatory / Ustad (G.3) | **Live.** Query events feed the Phase O cost observatory. |
| LEL maintenance | **Unchanged** — independent of Ganga. |
| Prospective Prediction Logging | **Automated.** L.5.1 extracts + logs predictions from synthesis answers at query time. |

---

## §8 — Scope Rebalancing Rationale (Opus analysis 2026-05-04)

The Opus critical analysis identified a fundamental gap: the original BHISMA scope (Workstreams A–J, ~90 items) was entirely focused on *routing, planning, and observability*. It had zero items covering *what the synthesis model is told to do and how well it does it*.

**The analogy:** Ganga was about to spend 90 units of engineering effort building a world-class navigation and instrument panel for an aircraft, while the cockpit had no flight manual and the pilots had no training syllabus.

**The rebalancing:** Workstream L (24 items) is added as Gate 3. To preserve total scope budget without infinite expansion, K is trimmed to its essential core (3 items from 10), D to 5 from 12, F to 3 from 8, J to 2 from 7. The trims remove nice-to-haves (deep NIM benchmarking, design system polish, extensive discovery freshness work) while preserving the mission-critical items in each workstream.

**The result:** 114 total items. Same engineering effort. Fundamentally different project: one that builds an acharya-grade instrument, not just a robust RAG platform.

---

*End of PROJECT_GANGA_PLAN_v1_0.md — authored 2026-05-04.*
*BHISMA_FINAL_PLAN_v1_0.md is superseded by this document for all forward planning.*
*Immediate next action: Author CLAUDECODE_BRIEF_GANGA_G0_S1_v1_0.md (LLM stack audit), then execute CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md (production fix).*
