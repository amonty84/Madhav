---
project: BHISMA
version: 1.0
status: ACTIVE
created: 2026-05-01
description: >
  Platform Elevation Project — multi-provider model family, LLM-first intelligent
  pipeline, Trace Command Center. Runs in parallel with M3 as a separate workstream.
cowork_conversation: BHISMA (separate from M3 conversation)
karn_wave_equivalent: KARN-W9 (B1–B4)
---

# PROJECT BHISMA — Session Log

## Naming Convention

### Pattern
```
BHISMA-W{wave}-S{session}-{DESCRIPTION}
```

| Field | Rule |
|---|---|
| `wave` | Sequential integer starting at **1**. Incremented at each convergence close (W1 closes with S4-CONVERGENCE). |
| `session` | Sequential integer within the wave. S1–S3 are parallel-safe within the same wave; S4 (convergence) blocks until S1–S3 close. |
| `DESCRIPTION` | SCREAMING-KEBAB-CASE, max 4 words, describes the session's primary deliverable. |

### Examples
```
BHISMA-W1-S1-MODEL-FAMILY        ← Wave 1, Session 1: model registry + o-series + hard-fail
BHISMA-W1-S2-LLM-PIPELINE        ← Wave 1, Session 2: LLM-first planner + retrieval caps
BHISMA-W1-S3-TRACE-COMMAND       ← Wave 1, Session 3: trace re-skin + new panels
BHISMA-W1-S4-CONVERGENCE         ← Wave 1, Session 4: integration smoke + BHISMA close
BHISMA-W2-S1-DISCOVERY-FRESHNESS ← Wave 2, Session 1 (future)
```

### Cowork thread naming
Cowork conversation threads use the same identifier as the Claude Code session:
`BHISMA-W1-S1-MODEL-FAMILY`, `BHISMA-W1-S2-LLM-PIPELINE`, etc.

### Relationship to KARN
BHISMA is a sub-protocol of the KARN execution framework. KARN
`PROJECT_KARN_SESSION_LOG.md` receives a single entry at BHISMA-W1-S4-CONVERGENCE
close. Individual S1–S3 sessions do NOT write to the KARN log — they write here only.

---

## Wave 1 — Platform Elevation (Active)

**Entry state:** M2 CLOSED (KARN-W8-R2-M2-CLOSE, 2026-05-01)
**Convergence gate:** All three S1/S2/S3 close summaries reviewed by native before S4 opens.

| Session ID | Stream | Primary deliverable | Status | Closed date | Git SHA |
|---|---|---|---|---|---|
| BHISMA-W1-S1-MODEL-FAMILY | Model Family | registry.ts + resolver.ts + hard-fail | OPEN | — | — |
| BHISMA-W1-S2-LLM-PIPELINE | LLM Pipeline | planner.ts + retrieval_capability_spec.ts | CLOSED | 2026-05-01 | (recorded at commit) |
| BHISMA-W1-S3-TRACE-COMMAND | Trace UI | TracePanel re-skin + QueryDNAPanel + CostBar | OPEN | — | — |
| BHISMA-W1-S4-CONVERGENCE | Convergence | tsc clean + eval delta + BHISMA_CLOSE_v1_0.md | PENDING | — | — |

### Wave 1 acceptance gate (S4 close criteria)
- [ ] `npx tsc --noEmit` passes clean across all new/modified files
- [ ] vitest suite passes (composition_rules tests updated for rule_composer retirement)
- [ ] Eval baseline pre/post delta recorded (BASELINE_RUN_W9.json)
- [ ] BHISMA_CLOSE_v1_0.md authored and committed
- [ ] KARN SESSION_LOG receives Wave 1 convergence entry

---

## Session Entries

<!-- Sessions append their close block below in this format:

=== BHISMA-W{n}-S{m}-{DESCRIPTION} CLOSE ===
closed: YYYY-MM-DD
git_sha: {sha}
deliverables:
  - {file}: {action}
acceptance_criteria_passed: [AC.B{n}.1, ...]
known_residuals:
  - {item}
notes: >
  {freeform}

-->

=== BHISMA-W1-S2-LLM-PIPELINE CLOSE ===
session_id_alias: KARN-W9-B2-BHISMA-LLM-PIPELINE  # name from the user brief; predates the BHISMA log naming convention
closed: 2026-05-01
git_sha: (recorded at commit)
agent: claude-opus-4-7-1m
cowork_thread: "KARN-W9-B2 — BHISMA LLM-First Intelligent Pipeline"
predecessor: KARN-W8-R2-M2-CLOSE

scope_executed: BHISMA_PLAN_v1_0.md §4.1–§4.9 (Stream 2 deliverables)

deliverables:
  - 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9.json: created (STUB — secrets unavailable; documented gap)
  - 00_ARCHITECTURE/CAPABILITY_MANIFEST.json: token_count backfilled for 6 high-cost assets (FORENSIC, MSR_v3_0, UCN_v4_0, CGM, CDLM_v1_1, RM_v2_0); last_updated rotated
  - platform/src/lib/config/feature_flags.ts: added LLM_FIRST_PLANNER_ENABLED (default false)
  - platform/src/lib/bundle/types.ts: AssetEntry.token_count optional + BundleEntrySource accepts 'planner'
  - platform/src/lib/bundle/rule_composer.ts: tokenFor() now reads typed AssetEntry.token_count; dead getTokens removed
  - platform/src/lib/router/types.ts: added RichQueryPlan, ToolCallSpec, PlanContext, ChartContext, ConversationTurn
  - platform/src/lib/router/retrieval_capability_spec.ts: NEW — RCS for all 17 retrieval tools (BHISMA §4.1)
  - platform/src/lib/router/planner.ts: NEW — LLM-first planner with embedded system prompt (§4.2 + §4.3) + buildPlannerFloorBundle helper for §4.4 retirement of compose() in new path; PlannerError class for ADR-3 hard-fail
  - platform/src/lib/synthesis/citation_check.ts: NEW — countSignalCitations / hasMinimumCitations / citationThresholdForClass (§4.7)
  - platform/src/lib/synthesis/__tests__/citation_check.test.ts: NEW — 15 unit tests, all pass
  - platform/src/lib/synthesis/single_model_strategy.ts: synthesis_done now emits citation_count + real wall-clock latency (§4.6)
  - platform/src/app/api/chat/consume/route.ts: branch on LLM_FIRST_PLANNER_ENABLED; new path emits single 'plan' step replacing classify+compose+plan_per_tool; legacy path preserved verbatim when flag is false; PlannerError handled with step_error emit + structured 502 response
  - platform/src/lib/schemas/bundle.schema.json: source enum extended with 'planner'

acceptance_criteria_passed:
  - "§4.1 RCS authored for all 17 retrieval tools (no halt-condition triggered)"
  - "§4.2 RichQueryPlan returned by plan() with all fields populated; gated behind LLM_FIRST_PLANNER_ENABLED"
  - "§4.3 Planner system prompt embeds full RCS + 8 few-shot examples covering every query_class"
  - "§4.4 Old classify+compose+planPerTool path removed when flag=true; preserved when flag=false (rollback safe)"
  - "§4.5 context_assembly emit verified at single_model_strategy.ts:182 — token summary + chunk inventory present (already shipped pre-session)"
  - "§4.6 synthesis_done emit enriched with citation_count + real latency_ms"
  - "§4.7 citation_check.ts authored; threshold table per query_class; 15/15 tests pass"
  - "§4.8 Eval baseline STUB recorded with documented gap (server up; SMOKE_* / ANTHROPIC_API_KEY unset in this session)"
  - "§4.9 token_count backfilled for 6 major assets; tokenFor() typed-clean read"
  - "Typecheck: 9 errors total — all in pre-W6 UI test fixtures (AppShell, ReportGallery); matches W8-R1 known-residual baseline; zero new errors from this session"
  - "Vitest: 1058 passing / 13 failing — same 13-failing baseline as W8-R1; +11 net passing tests"

known_residuals:
  - id: GAP.P.9
    severity: MEDIUM
    description: "Eval baseline is STUB; post-BHISMA paired run (planner_branch=on) requires SMOKE_SESSION_COOKIE + SMOKE_CHART_ID + ANTHROPIC_API_KEY which the executor session cannot mint"
    blocker_for_close: false
    blocker_for_S4_convergence: TRUE — S4 must run the paired baseline before BHISMA closes
  - id: STEP_SEQ_DRIFT
    severity: LOW
    description: "Tool step_seq numbering: route.ts uses 4+idx (legacy); single_model_strategy uses 3+nTools-based ctxSeq. Inconsistency predates this session — not introduced by W1-S2"
    blocker_for_close: false
  - id: COMPOSE_CALL_LEGACY_BRANCH
    severity: LOW
    description: "compose() is still called in the legacy branch (LLM_FIRST_PLANNER_ENABLED=false). Per §4.4, compose() removal is for the new path only; legacy path keeps it for rollback. This is by design."
    blocker_for_close: false
  - id: BHISMA_PLAN_NAMING_REFRESH
    severity: INFORMATIONAL
    description: "Parallel session amended BHISMA_PLAN_v1_0.md to rename W9-B# → BHISMA-W1-S# convention. Session_id stayed as user-brief 'KARN-W9-B2' for traceability; alias recorded above. Not a scope violation."
    blocker_for_close: false

mirror_updates_propagated: NONE (BHISMA-W1-S2 is Claude-only; no Gemini-side counterpart this session per BHISMA naming-convention §relationship-to-KARN)

current_state_v1_0_updated: false  # per BHISMA log convention §relationship-to-KARN, only S4-CONVERGENCE writes to KARN/CURRENT_STATE
karn_session_log_appended: false   # per same convention

handoff_to_next_session: |
  S4-CONVERGENCE (BHISMA-W1-S4) is the next session that consumes this stream's output:
    1. Run paired eval baseline:
         export SMOKE_SESSION_COOKIE=... SMOKE_CHART_ID=... ANTHROPIC_API_KEY=...
         python3 platform/scripts/eval/runner.py --planner-off --output 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9.json
       (overwrite STUB), then run again with MARSYS_FLAG_LLM_FIRST_PLANNER_ENABLED=true and store the on-branch results.
    2. Smoke the new path end-to-end against /api/chat/consume with the flag flipped.
    3. Author BHISMA_CLOSE_v1_0.md with the eval delta recorded.
    4. Single KARN-log entry referencing this BHISMA log close block.

notes: >
  No 025_HOLISTIC_SYNTHESIS/**, platform/migrations/**, or platform/src/lib/retrieve/** files were touched
  per the user-brief halt-conditions. The compose() function remains in the codebase and is called by the
  legacy branch — a future cleanup session can delete it once LLM_FIRST_PLANNER_ENABLED is flipped to true
  in defaults and observed in production for a soak window.
