---
artifact: GANGA_PHASE_TRACKER.md
canonical_id: GANGA_PHASE_TRACKER
version: rolling
status: LIVING
authored_by: Claude (Cowork — GANGA-OPEN session) 2026-05-04
project_code: GANGA
purpose: >
  Living status board for Project Ganga. Updated at every session close.
  The single answer to "where are we right now?"
---

# Project Ganga — Phase Tracker

*Update this file at every session close. It is the first document any new session reads after BOOTSTRAP.*

---

## §1 — Current State Block

```yaml
as_of: 2026-05-05
last_session: GANGA-PLANNER-FIX-S1 (CLOSED 2026-05-05, commit 8142da4)
current_gate: G0 (LLM Stack Audit — circuit reset done; planner still timing out >15s)
active_brief: null
active_sessions: []
blocking_item: >
  RC-A: NIM nemotron-3-super-120b-a12b exceeds 15s timeout. Circuit reset and timeoutMs
  raised to 15s (PLANNER-FIX-S1), but planner calls still time out. Plan_json remains
  NULL; queries run on classify() fallback. Root cause in GANGA-GQ002-BUG-v1_0.md.
immediate_next_action: >
  1. Merge feature/planner-fix-s1 to main; re-run E2E obs (verify plan_json non-NULL).
  2. Investigate NIM p50/p95 latency; raise timeoutMs to 30s or swap planner model.
  3. Audit compose_bundle() fallback tool selection for factual/spiritual query class.
open_items_count: 114
completed_items_count: 3
completed_this_session:
  - CHANGE-1: writeObservatoryQueryEvent implemented (monitoring-write.ts)
  - CHANGE-2: POST /api/admin/planner/reset-circuit admin endpoint created
  - CHANGE-3: timeoutMs raised 5s→15s in planner_circuit_breaker.ts
  - AC.1: tsc --noEmit exits 0 (pre-existing type errors fixed)
  - AC.8: GQ-002 root cause documented (GANGA-GQ002-BUG-v1_0.md)
```

---

## §2 — Gate Status Board

| Gate | Name | Status | Sessions | Key Output | Blocks |
|---|---|---|---|---|---|
| **G0** | LLM Stack Audit | 🔴 NOT STARTED | G0-S1 (not yet run) | MODEL_REGISTRY_v1_0.md | All other gates |
| G1 | Production Fix + E2E | ⏸️ BLOCKED on G0 | G1-S1 (brief ready), B.1 observation | plan_json non-NULL first time | Gate 2 |
| G2 | Platform Hardening | ⏸️ BLOCKED on G1 | 5-6 parallel sessions | Planner v1.7, retrieval fixes, test fixes | Gate 3 |
| G3 | Synthesis Quality | ⏸️ BLOCKED on G2 | 3-4 sequential sessions | SYNTHESIS_PROMPT v1.0, eval harness, B.11 | Gate 4 |
| G4 | Integration + Close | ⏸️ BLOCKED on G3 | 1 session | GANGA_CLOSE_v1_0.md | — |

---

## §3 — Workstream Item Tracker

### Workstream K — LLM Stack Review (Gate 0)
| ID | Item | Status | Session |
|---|---|---|---|
| K.1 | Model × stack × role matrix audit | ⬜ pending | G0-S1 |
| K.2 | NIM model selection (nemotron-49B vs alternatives) | ⬜ pending | G0-S1 |
| K.3 | Author MODEL_REGISTRY_v1_0.md | ⬜ pending | G0-S1 |

### Workstream A — Production Blocker Fix (Gate 1)
| ID | Item | Status | Session |
|---|---|---|---|
| A.1 | deepseek-v4-flash → deepseek-chat in registry.ts | ⬜ pending | G1-S1 (brief: BHISMA_PF_S1) |

### Workstream B — E2E Baseline (Gate 1)
| ID | Item | Status | Session |
|---|---|---|---|
| B.1 | 8 targeted queries + E2E SQL pull + planner observation | ⬜ pending | observation run (no code) |

### Workstream C — Planner Quality (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| C.1 | GT.002 fix: alignment remedial + "spiritual" domain in PLANNER_PROMPT | ⬜ pending | G2-S1 |
| C.2 | GT.025 fix: lightweight holistic "interesting" §4.11 few-shot | ⬜ pending | G2-S1 |
| C.3 | R14 re-evaluation (post-B.1 live data) | ⬜ pending | G2-S1 |
| C.4 | R15 re-evaluation (post-B.1 live data) | ⬜ pending | G2-S1 |
| C.5 | 29-case eval at v1.7 — maintain recall ≥ 0.940, precision ≥ 0.945 | ⬜ pending | G2-S1 |

### Workstream D — Retrieval Quality (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| D.1 | cgm_graph_walk seed strategy fix (zero_rows on single seed) | ⬜ pending | G2-S2 |
| D.2 | msr_sql finance domain confidence_floor fix | ⬜ pending | G2-S2 |
| D.3 | Discovery freshness: signal embedding refresh | ⬜ pending | G2-S3 |
| D.4 | CONTEXT_ASSEMBLY smoke + flag flip | ⬜ pending | G2-S2 |
| D.5 | vector_search remedial retrieval improvement (post-B.1) | ⬜ pending | G2-S2 |

### Workstream E — Test Coverage (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| E.1 | manifest_planner.test.ts AI SDK mock fix | ⬜ pending | G2-S4 |
| E.2 | route.test.ts STACK_ROUTING mock gap | ⬜ pending | G2-S4 |
| E.3 | cgm_graph_walk.test.ts flag variant failures | ⬜ pending | G2-S4 |
| E.4 | retrieve __tests__ contract drift | ⬜ pending | G2-S4 |
| E.5 | Pre-existing test failure triage (24 remaining) | ⬜ pending | G2-S4 |

### Workstream F — NIM Stack (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| F.1 | NIM API key + SLA verification | ⬜ pending | G2-S5 |
| F.2 | STACK_ROUTING.nim update (per K.2 model selection) | ⬜ pending | G2-S5 |
| F.3 | Lever 3 eval (NIM model swap) — gated on native authorization | 🔒 GATED | post-G2 if authorized |

### Workstream G — Observability + MON (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| G.1 | TracePanel: wire plan_json tool calls to QueryDNAPanel | ⬜ pending | G2-S5 |
| G.2 | llm_call_log completeness audit | ⬜ pending | G2-S5 |
| G.3 | Observatory/Ustad live query event integration | ⬜ pending | G2-S5 |
| G.4 | DeepSeek synthesis latency investigation (~3.5 min) | ⬜ pending | G2-S5 |

### Workstream H — CI/CD + Cleanup (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| H.1 | CI gate green on main post-PF-S1 | ⬜ pending | G1-S1 (verify) |
| H.2 | Feature flag audit: retire deprecated flags | ⬜ pending | G2-S6 |
| H.3 | Phase 11B legacy deletion | 🔒 GATED (7-day soak) | post-G2 |

### Workstream I — Trace UI Enhancement (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| I.1 | TracePanel: display plannerParams per-tool in QueryDNAPanel | ⬜ pending | G2-S5 |
| I.2 | AnalyticsTab: wire to live query_plan_log data | ⬜ pending | G2-S5 |
| I.3 | CostPerformanceBar: verify live USD computation all stacks | ⬜ pending | G2-S5 |
| I.4 | RetrievalScorecard: wire to live tool_execution_log scores | ⬜ pending | G2-S6 |

### Workstream J — Design System Alignment (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| J.1 | TracePanel palette vs portal redesign design system | ⬜ pending | G2-S6 |
| J.2 | Portal integration smoke (TracePanel in R7 shell) | ⬜ pending | G2-S6 |

### Workstream L — Synthesis Quality (Gate 3)

#### L.1 Synthesis Prompt Architecture
| ID | Item | Status | Session |
|---|---|---|---|
| L.1.1 | Author SYNTHESIS_PROMPT_v1_0.md skeleton | ⬜ pending | G3-S1 |
| L.1.2 | Jyotish methodology enforcement (B.11 encoded) | ⬜ pending | G3-S1 |
| L.1.3 | Citation schema (B.3 discipline encoded) | ⬜ pending | G3-S1 |
| L.1.4 | Disclosure-tier structure | ⬜ pending | G3-S1 |
| L.1.5 | Per-query-class synthesis variants | ⬜ pending | G3-S1 |
| L.1.6 | Counterfactual check instruction | ⬜ pending | G3-S1 |
| L.1.7 | Worked examples section (3 acharya-grade examples) | ⬜ pending | G3-S1 |
| L.1.8 | Output schema: structured sections per query class | ⬜ pending | G3-S1 |

#### L.2 Acharya-Grade Answer Evaluation
| ID | Item | Status | Session |
|---|---|---|---|
| L.2.1 | 100-query acharya-grade answer eval set | ⬜ pending | G3-S2 |
| L.2.2 | LLM-as-judge harness (citation_coverage, b11_compliance, acharya_depth_score) | ⬜ pending | G3-S2 |
| L.2.3 | Baseline: current synthesis scored before any SYNTHESIS_PROMPT changes | ⬜ pending | G3-S2 |
| L.2.4 | Adversarial probes (10 queries, synthesis discipline validation) | ⬜ pending | G3-S2 |
| L.2.5 | CI gate: synthesis eval added to PR pipeline | ⬜ pending | G3-S2 |
| L.2.6 | Multi-stack synthesis quality comparison | ⬜ pending | G3-S3 |

#### L.3 B.11 Runtime Enforcement
| ID | Item | Status | Session |
|---|---|---|---|
| L.3.1 | Holistic floor gate in UQE (soft warning) | ⬜ pending | G3-S2 |
| L.3.2 | Post-synthesis L2.5 citation coverage audit | ⬜ pending | G3-S2 |
| L.3.3 | B.11 violation counter in AnalyticsTab | ⬜ pending | G3-S3 |

#### L.4 Context Assembler
| ID | Item | Status | Session |
|---|---|---|---|
| L.4.1 | context_assembler.ts module (dedup, ordering, compression) | ⬜ pending | G3-S1 |
| L.4.2 | Floor/fill discipline (FORENSIC mandatory pre-insert) | ⬜ pending | G3-S1 |
| L.4.3 | Conflict surfacing (contradictory context items flagged) | ⬜ pending | G3-S1 |
| L.4.4 | context_assembled trace step + telemetry | ⬜ pending | G3-S1 |

#### L.5 Calibration Substrate
| ID | Item | Status | Session |
|---|---|---|---|
| L.5.1 | Prediction registration hook in synthesis pipeline | ⬜ pending | G3-S4 |
| L.5.2 | Outcome capture: link Phase 8 outcome form to prediction_outcome_log | ⬜ pending | G3-S4 |
| L.5.3 | Brier score computation + audit view integration | ⬜ pending | G3-S4 |
| L.5.4 | Native correction surface in audit view | ⬜ pending | G3-S4 |

---

## §4 — Recently Completed (BHISMA → Ganga handoff)

| Item | Completed | Session | Notes |
|---|---|---|---|
| Planner prompt v1.6 (recall=0.940, precision=0.945) | 2026-05-04 | BHISMA Phase 1 | GATE MET |
| LLM_FIRST_PLANNER_ENABLED=true | 2026-05-04 | fa75e1a | Planner code ON but never fired in prod |
| CI regression gate | 2026-05-04 | BHISMA-CI-S1 | .github/workflows/ci.yml live |
| TOOLS-S1 synthesis-time tool logging | 2026-05-04 | BHISMA-TOOLS-S1 | onStepFinish hook |
| TRACE-S1 planner params threaded | 2026-05-04 | BHISMA-TRACE-S1 | plannerParamsMap in executeWithCache |
| Wave 2 COMPLETE (UQE, MON, migrations) | 2026-05-03 | BHISMA-W2-SD | 46/58 tasks |
| Wave 1 COMPLETE (registry, planner code, Trace) | 2026-05-01 | BHISMA-W1-S4 | Foundation |

---

## §5 — Open Decisions (require native input)

| Decision | Question | Status |
|---|---|---|
| Lever 3 authorization | "Do I authorize Lever 3 NIM model swap?" (requires G0/K.2 recommendation) | PENDING |
| Phase 11B timing | "When to delete the legacy query pipeline?" (7-day soak after Gate 2) | PENDING |
| Synthesis model | "For Gate 3, which model drives synthesis on each stack?" (opus-4.7 vs current opus-4.6) | OPEN |
| L.5.4 native correction UX | "What does the correction workflow look like for me as the native?" | OPEN |

---

*Update this file at every session close. Maintain §1 current state block. Append completed items to §4. Update gate statuses in §2. Check off items in §3.*
