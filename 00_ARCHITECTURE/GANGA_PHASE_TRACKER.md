---
artifact: GANGA_PHASE_TRACKER.md
canonical_id: GANGA_PHASE_TRACKER
version: rolling
status: LIVING
authored_by: Claude (Cowork — GANGA-OPEN session) 2026-05-04
last_updated: 2026-05-04 (G3 COMPLETE — live eval 93% pass, all 6 thresholds cleared; Gemini stack)
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
current_gate: G4 COMPLETE — GANGA SPRINT CLOSED
last_session: GANGA-CLOSE (G4 SEALED 2026-05-05) — GANGA_CLOSE_v1_0.md authored
active_brief: null
active_sessions: []
blocking_item: null
note: >
  2026-05-05 (GANGA CLOSED + deferred items resolved): All 7 gates COMPLETE.
  Planner confirmed on Anthropic stack (4/4 fixtures plan_json non-NULL, haiku-4-5 1.7-3.3s).
  DEF-1 RESOLVED: per-stack NIM timeout 30s (feature/ganga-deferred).
  DEF-2 RESOLVED: compose_bundle spiritual/remedial two-layer bug fixed
  (bundle.schema.json roles + normaliseRole()) via feature/ganga-deferred.
  DEF-7 OPEN: re-run answer:eval with ANTHROPIC_API_KEY for real synthesis scores.
  PHASE11B deletion safe after 2026-05-11. CURRENT_STATE Madhav updated (fc1ca6d).
eval_baseline_anthropic_2026-05-05:
  fixtures: F001/F007/F013/F017
  kw: 0.83
  sig: 1.00
  syn: 0.50 (stub — ANTHROPIC_API_KEY missing in eval env)
  wtd: 0.75
  planner_latency_ms: 1700-3300
  synthesis_latency_s: 10-52
immediate_next_action: >
  1. Commit runner.py EVAL_STACK change:
     git add platform/scripts/eval/runner.py
     git commit -m "fix(eval): runner.py respects EVAL_STACK env var"
  2. Re-run eval with ANTHROPIC_API_KEY set to get real synthesis scores.
  3. GANGA-CLOSE (G4) — now unblocked. Seal GANGA_CLOSE_v1_0.md + update CURRENT_STATE.
  4. DONE: per-stack timeoutMs override NIM=30s (feature/ganga-deferred).
  5. DONE: compose_bundle() spiritual/remedial fix (feature/ganga-deferred).
completed_items_count: 44
open_items_count: 97
```

---

## §2 — Gate Status Board

| Gate | Name | Status | Sessions | Key Output | Blocks |
|---|---|---|---|---|---|
| **G0** | LLM Stack Audit | 🟢 COMPLETE (2026-05-04) | GANGA-P1-R1-S1 ✅ | MODEL_REGISTRY_v1_0.md + GANGA_STACK_AUDIT_v1_0.md | — |
| **G1** | Production Fix + E2E | 🟢 COMPLETE (2026-05-04) | GANGA-P1-R2-S1 ✅ | BF.GAP.001 fixed (deepseek-chat routing) | — |
| **G2** | Platform Hardening | 🟢 COMPLETE (2026-05-04) | GANGA-P2-R1-S1 ✅, GANGA-P2-R2-S1 ✅, GANGA-P2-R2-S2 ✅ | CI gate + NIM hardening + circuit breaker | — |
| **G3** | Synthesis Quality | 🟢 COMPLETE (2026-05-04) | GANGA-P3-R1-S1 ✅, GANGA-P3-R1-S2 ✅, GANGA-P3-R2-S1 ✅, GANGA-P3-R2-S2 ✅ | SYNTHESIS_PROMPT v1.0 + eval + B.11 guard | — |
| **G-UX** | UX Hardening + Trace | 🟢 COMPLETE (2026-05-05) | GANGA-CHAT-S1 ✅, GANGA-STACK-S1 ✅, GANGA-TRACE-S1 ✅ | Error dismiss, model indicator, provider options, PipelineFlowView | — |
| **G-FIX** | Planner + Observability Fix | 🟢 COMPLETE (2026-05-05) | GANGA-PLANNER-FIX-S1 ✅ (merged 03d3031) | Circuit reset endpoint, writeObservatoryQueryEvent, timeoutMs=15s | NIM latency blocker remains |
| **G4** | Integration + Close | 🟢 COMPLETE (2026-05-05) | E2E-OBS-ANTHROPIC ✅ | GANGA_CLOSE_v1_0.md | — |

---

## §3 — Workstream Item Tracker

### Workstream K — LLM Stack Review (Gate 0)
| ID | Item | Status | Session |
|---|---|---|---|
| K.1 | Model × stack × role matrix audit | ✅ complete | GANGA-P1-R1-S1 |
| K.2 | NIM model selection (nemotron-49B vs alternatives) | ✅ complete | GANGA-P1-R1-S1 |
| K.3 | Author MODEL_REGISTRY_v1_0.md | ✅ complete | GANGA-P1-R1-S1 |

### Workstream A — Production Blocker Fix (Gate 1)
| ID | Item | Status | Session |
|---|---|---|---|
| A.1 | deepseek-v4-flash → deepseek-chat in registry.ts | ✅ complete | GANGA-P1-R2-S1 |

### Workstream B — E2E Baseline (Gate 1)
| ID | Item | Status | Session |
|---|---|---|---|
| B.1 | 8 targeted queries + E2E observation + GT.002/GT.025 root causes | ✅ complete | GANGA-P2-R1-S2 — GANGA_E2E_OBS_v1_0.md authored (e4ea6e7) |

### Workstream C — Planner Quality (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| C.1 | GT.002 fix: spiritual-domain remedial few-shot in PLANNER_PROMPT | ✅ complete | GANGA-P2-R1-S3 — §4.2 example swapped to mantra+spiritual+vector_search |
| C.2 | GT.025 fix: open-ended holistic → all 4 discovery registers | ✅ complete | GANGA-P2-R1-S3 — §4.11 dual R12+R15 holistic few-shot added |
| C.3 | R14 re-evaluation (post-E2E-OBS live data) | ✅ complete | GANGA-P2-R1-S3 — R14 extended for divisional structural queries |
| C.4 | R15 re-evaluation (post-E2E-OBS live data) | ✅ complete | GANGA-P2-R1-S3 — R19 tightened for R12/R15 scope words |
| C.5 | Planner regression gate written (CI) | ✅ complete | GANGA-P2-R1-S1 |
| C.6 | 29-case eval at v1.7 — maintain recall ≥ 0.940, precision ≥ 0.945 | ✅ complete | GANGA-P2-R1-S3 — recall=0.954/0.966, precision=0.950/0.951 ✅ |

### Workstream D — Retrieval Quality (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| D.1 | cgm_graph_walk seed strategy fix (zero_rows on single seed) | ✅ complete | GANGA-P2-R1-S4 — SQL_FALLBACK_MSR + [CGM_FALLBACK] label, 2 tests |
| D.2 | msr_sql finance domain confidence_floor fix | ✅ complete | GANGA-P2-R1-S4 — finance/wealth default=0.35, global default=0.6, 4 tests |
| D.3 | Discovery freshness: signal embedding refresh | ✅ complete | GANGA-P2-R1-S4 — embedding_freshness_check.ts + embedding:freshness script |
| D.4 | CONTEXT_ASSEMBLY smoke + flag flip | ✅ complete | GANGA-D4-UNBLOCK — CONTEXT_ASSEMBLY_ENABLED=true; generateText + context_assembler mocks added (5eeb39d) |
| D.5 | vector_search remedial retrieval improvement (post-E2E-OBS) | ✅ complete | GANGA-P2-R1-S4 — empty-set safety + [D.5 TODO] for L3/spiritual doc |

### Workstream E — Test Coverage (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| E.1 | manifest_planner.test.ts AI SDK mock fix | ✅ complete | GANGA-D4-UNBLOCK — generateText+tool-call shape (planner migrated from generateObject); token-budget 5000→10000 |
| E.2 | route.test.ts STACK_ROUTING mock gap | ✅ complete | GANGA-D4-UNBLOCK — STACK_ROUTING + DEFAULT_STACK_ID added to registry mock |
| E.3 | cgm_graph_walk.test.ts flag variant failures | ✅ complete | GANGA-P2-R1-S4 — CGM_GRAPH_WALK_ENABLED retired; BFS always-on |
| E.4 | retrieve __tests__ contract drift | ✅ complete | GANGA-D4-UNBLOCK — integration.test.ts 17→20 tools; UQE-7 domain-fallback behavior updated |
| E.5 | Pre-existing test failure triage (17 infra residuals) | 🔒 KNOWN RESIDUALS | 11 E2E (server required) + PanelAnswerView/AppShell/LogPredictionAction/parity_validator/fs-path tests; none Ganga-introduced |

### Workstream F — NIM Stack (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| F.1 | NIM API key + SLA verification | ✅ complete | GANGA-P2-R2-S1 (NIM-COMPAT) |
| F.2 | STACK_ROUTING.nim update + PlannerCompatibilityError | ✅ complete | GANGA-P2-R2-S1 (NIM-COMPAT) |
| F.3 | Lever 3 eval (NIM model swap) — gated on native authorization | 🔒 GATED | post-G2 if authorized |

### Workstream G — Observability + MON (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| G.1 | TracePanel: wire plan_json tool calls to QueryDNAPanel | ✅ complete | GANGA-P2-R3-S1 — query_class, planning_confidence, tool_calls in trace payload |
| G.2 | llm_call_log completeness audit | ✅ complete | GANGA-P2-R3-S1 — stack/tokens/cost added; cost_usd TODO for DB-backing |
| G.3 | Observatory/Ustad live query event integration | ⚠️ TODO-only | Blocked: observatory.ts client pattern verification + query_class thread needed |
| G.4 | DeepSeek synthesis latency investigation (~3.5 min) | ✅ complete | GANGA-P2-R3-S1 — synthesisLatencyMs timer at onFinish; drift fixed |

### Workstream H — CI/CD + Cleanup (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| H.1 | CI gate green (.github/workflows/ci.yml) | ✅ complete | GANGA-P2-R1-S1 |
| H.2 | Feature flag audit: retire deprecated flags | ⬜ pending | GANGA-P2-R3-S2 PHASE11B-CLEAN |
| H.3 | Phase 11B legacy deletion | 🔒 GATED (7-day soak — earliest 2026-05-11) | GANGA-P2-R3-S2 |

### Workstream I — Trace UI Enhancement (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| I.1 | TracePanel: display plannerParams per-tool in QueryDNAPanel | ✅ complete | GANGA-P2-R3-S1 — params chevron → 2-col monospace k/v table, >4 keys collapsed |
| I.2 | AnalyticsTab: wire to live query_plan_log data | ✅ complete | GANGA-P2-R3-S1 — Avg tools/plan KPI tile from tools_used[] |
| I.3 | CostPerformanceBar: verify live USD computation all stacks | ✅ complete | GANGA-P2-R3-S1 — null→N/A handled; TODO for DB-backed cost_usd |
| I.4 | RetrievalScorecard: wire to live tool_execution_log scores | ⚠️ TODO-only | tool_execution_log has no score columns yet; graceful no-data state in place |

### Workstream J — Design System Alignment (Gate 2)
| ID | Item | Status | Session |
|---|---|---|---|
| J.1 | TracePanel palette vs portal redesign design system | ⚠️ TODO-only | Hardcoded rgba() values; TODO for R7 CSS variable migration in GANGA-CLOSE |
| J.2 | Portal integration smoke (TracePanel in R7 shell) | ✅ complete | GANGA-P2-R3-S1 — no missing context providers; useTraceStream self-contained |

### Workstream L — Synthesis Quality (Gate 3)

#### L.1 Synthesis Prompt Architecture
| ID | Item | Status | Session |
|---|---|---|---|
| L.1.1 | Author SYNTHESIS_PROMPT_v1_0.md skeleton | ✅ complete | GANGA-P3-R1-S1 |
| L.1.2 | Jyotish methodology enforcement (B.11 encoded) | ✅ complete | GANGA-P3-R1-S1 |
| L.1.3 | Citation schema (B.3 discipline encoded) | ✅ complete | GANGA-P3-R1-S1 |
| L.1.4 | Disclosure-tier structure | ✅ complete | GANGA-P3-R1-S1 |
| L.1.5 | Per-query-class synthesis variants | ✅ complete | GANGA-P3-R1-S1 |
| L.1.6 | Counterfactual check instruction | ✅ complete | GANGA-P3-R1-S1 |
| L.1.7 | Worked examples section (acharya-grade) | ✅ complete | GANGA-P3-R1-S1 |
| L.1.8 | Output schema: structured sections per query class | ✅ complete | GANGA-P3-R1-S1 |

#### L.2 Acharya-Grade Answer Evaluation
| ID | Item | Status | Session |
|---|---|---|---|
| L.2.1 | 15-query golden eval set (answer_eval.ts) | ✅ complete | GANGA-P3-R1-S2 |
| L.2.2 | 5-dimension scoring harness (layer_coverage, b10_compliance, b11_signal, citation_presence, calibration_language) | ✅ complete | GANGA-P3-R1-S2 |
| L.2.3 | Baseline capture: answer:eval run before SYNTHESIS_PROMPT merges | ✅ complete | 2026-05-04 — pass=8%, B11=94%, citations=14%🔴, calibration=39%🔴, B10=77% |
| L.2.4 | Adversarial probes covered in 15 golden queries | ✅ complete | GANGA-P3-R1-S2 |
| L.2.5 | CI gate: synthesis eval wired to planner-regression workflow | ✅ complete | GANGA-P3-R1-S2 |
| L.2.6 | Multi-stack synthesis quality comparison | ✅ complete | GANGA-P3-R4-S1 + live eval 2026-05-04 — Gemini: 93% pass · citations=100% · b10=100% · b11=100% · calib=81% · layer=96% |

#### L.3 B.11 Runtime Enforcement
| ID | Item | Status | Session |
|---|---|---|---|
| L.3.1 | b11_guard.ts — checkB11Compliance() + B11_VIOLATION log + soft warning | ✅ complete | GANGA-P3-R2-S1 |
| L.3.2 | [B.11-PARTIAL] annotation in synthesis response when layers missing | ✅ complete | GANGA-P3-R2-S1 |
| L.3.3 | B.11 violation counter in AnalyticsTab | ✅ complete | GANGA-P3-R4-S1 SYNTH-INTEGRATION — B11_EXPLICIT_LAYER_GATE applied to all 8 templates; B11 signal now emitted consistently (commit 2eea11a) |

#### L.4 Context Assembler
| ID | Item | Status | Session |
|---|---|---|---|
| L.4.1 | context_assembler.ts — assembleContext() with token-budgeted L1/L2.5/L3 packing | ✅ complete | GANGA-P3-R2-S2 |
| L.4.2 | Floor/fill discipline (FORENSIC mandatory pre-insert) | ✅ complete | GANGA-P3-R2-S2 |
| L.4.3 | Conflict surfacing (contradictory context items flagged) | ✅ complete | GANGA-P3-R2-S2 |
| L.4.4 | b11Compliant flag in AssemblyResult | ✅ complete | GANGA-P3-R2-S2 |

#### L.5 Calibration Substrate
| ID | Item | Status | Session |
|---|---|---|---|
| L.5.1 | Prediction registration hook in synthesis pipeline | ✅ complete | GANGA-P3-R3-S1 CALIBRATION — commit 52578b4 |
| L.5.2 | Outcome capture: link Phase 8 outcome form to prediction_outcome_log | ✅ complete | GANGA-P3-R3-S1 CALIBRATION — commit 52578b4 |
| L.5.3 | Brier score computation + audit view integration | ✅ complete | GANGA-P3-R3-S1 CALIBRATION — commit 52578b4 |
| L.5.4 | Native correction surface in audit view | ✅ complete | GANGA-P3-R3-S1 CALIBRATION — commit 52578b4 |

---

## §4 — Recently Completed

| Item | Completed | Session | Notes |
|---|---|---|---|
| SYNTH-INTEGRATION — all 8 templates v2.0, citation format fixed, 3 new gates | 2026-05-04 | GANGA-P3-R4-S1 | commit 2eea11a · 134/134 tests · citation (→ FORENSIC/SIG.MSR) · PRESCRIPTIVE_CITATION_GATE all 8 · CALIBRATION_LANGUAGE_GATE (predictive/holistic/cross_domain) · B11_EXPLICIT_LAYER_GATE all 8 · live eval pending |
| CALIBRATION — L.5 prediction substrate (registration hook + Brier score + correction surface) | 2026-05-04 | GANGA-P3-R3-S1 | commit 52578b4 · L.5.1–L.5.4 all complete |
| D.4 CONTEXT_ASSEMBLY_ENABLED=true — test mocks fixed across 5 suites | 2026-05-04 | GANGA-D4-UNBLOCK | commit 5eeb39d · suite 26/53→17/11 · E.1/E.2/E.4 co-resolved · planner uses generateText+tool-call |
| PLANNER_PROMPT v1.7 — 5 targeted fixes + manifest_planner retry | 2026-05-04 | GANGA-P2-R1-S3 | recall=0.954-0.966, prec=0.950-0.951 ✅ · commit deda7ee/f0bea21 |
| G-series monitoring: TracePanel plan_json, latency timer, llm_call_log fields | 2026-05-04 | GANGA-P2-R3-S1 | synthesisLatencyMs drift fixed; TODO: observatory rollup, cost_usd |
| I-series trace UI: params chevron, AnalyticsTab KPI, CostPerformanceBar null-safe | 2026-05-04 | GANGA-P2-R3-S1 | commit ed9f923/756631f · tsc clean · 0 new test failures |
| D.1 cgm_graph_walk fallback — SQL_FALLBACK_MSR + [CGM_FALLBACK] label | 2026-05-04 | GANGA-P2-R1-S4 | 2 new tests |
| D.2 msr_sql confidence_floor — finance/wealth default 0.35, global 0.6 | 2026-05-04 | GANGA-P2-R1-S4 | 4 new tests |
| D.3 embedding_freshness_check.ts + npm run embedding:freshness | 2026-05-04 | GANGA-P2-R1-S4 | exits 1 if ≥15% stale |
| D.5 vector_search empty-set safety + spiritual TODO | 2026-05-04 | GANGA-P2-R1-S4 | 2 new tests · commit 722a401 |
| E.3 cgm_graph_walk.test.ts — CGM_GRAPH_WALK_ENABLED retired; BFS always-on | 2026-05-04 | GANGA-P2-R1-S4 | +9 passing, -1 failing file |
| assembleContext() — token-budgeted L1/L2.5/L3 packing | 2026-05-04 | GANGA-P3-R2-S2 | 6 unit tests green |
| b11_guard.ts — B.11 runtime compliance enforcement | 2026-05-04 | GANGA-P3-R2-S1 | 4 unit tests green |
| Answer eval harness (answer_eval.ts) — 15 golden queries + 5-dim scoring | 2026-05-04 | GANGA-P3-R1-S2 | CI gate wired |
| SYNTHESIS_PROMPT_v1_0.md — B.11 + citation + disclosure spec | 2026-05-04 | GANGA-P3-R1-S1 | Governs all synthesis calls |
| Circuit breaker enhanced — per-stack isolation + exponential backoff | 2026-05-04 | GANGA-P2-R2-S2 | getMetrics() + HALF_OPEN state |
| NIM compat — PlannerCompatibilityError + error classification | 2026-05-04 | GANGA-P2-R2-S1 | toolChoice rejection handled |
| CI gate — .github/workflows/ci.yml + planner regression | 2026-05-04 | GANGA-P2-R1-S1 | 3-job: typecheck + unit-tests + planner-regression |
| BF.GAP.001 fix — deepseek-chat in registry.ts | 2026-05-04 | GANGA-P1-R2-S1 | 6 targeted changes; deepseek-v4-flash marked invalid |
| MODEL_REGISTRY_v1_0.md + GANGA_STACK_AUDIT_v1_0.md | 2026-05-04 | GANGA-P1-R1-S1 | G0 gate artifact |
| Planner prompt v1.6 (recall=0.940, precision=0.945) | 2026-05-04 | BHISMA Phase 1 | GATE MET |
| LLM_FIRST_PLANNER_ENABLED=true (fa75e1a) | 2026-05-04 | BHISMA W2 | Live in prod |
| MARSYS_FLAG_OBSERVATORY_ENABLED=true | 2026-05-04 | Phase O | Live at amjis-web-00044-sn5 |

---

## §5 — Open Decisions (require native input)

| Decision | Question | Status |
|---|---|---|
| Lever 3 authorization | "Do I authorize Lever 3 NIM model swap?" (K.2 recommendation now in MODEL_REGISTRY) | PENDING |
| Phase 11B timing | Legacy deletion — 7-day soak from 2026-05-04 → earliest 2026-05-11 | GATED |
| Synthesis model | "For SYNTH-INTEGRATION, which model drives synthesis?" (opus-4.6 current; opus-4.7 deferred) | OPEN |
| L.5.4 native correction UX | "What does the correction workflow look like for me as the native?" | OPEN |

---

*Update this file at every session close. Maintain §1 current state block. Append completed items to §4. Update gate statuses in §2. Check off items in §3.*
