---
artifact: PROJECT_GANGA_BOOTSTRAP.md
canonical_id: PROJECT_GANGA_BOOTSTRAP
version: 1.0
status: CURRENT
authored_by: Claude (Cowork — BHISMA-FINAL-PLAN/GANGA-OPEN session) 2026-05-04
project_code: GANGA
purpose: >
  Single entry-point document for any new session picking up Project Ganga.
  Read this first, then follow the reading chain below. Orients any Claude
  session in under 5 minutes.
---

# Project Ganga — Bootstrap

## What is Project Ganga?

**Project Ganga** is the comprehensive platform elevation and synthesis quality
sprint for MARSYS-JIS. It supersedes and expands the prior BHISMA project scope.

**BHISMA** solved infrastructure hardening (model registry, LLM planner, Trace
Command Center, MON observability). **Ganga** completes that work and adds the
layer BHISMA never touched: *synthesis quality* — the actual layer that produces
answers for the native.

**Ganga is the last engineering sprint before M5 (Probabilistic Engine).** M5
cannot run well without a reliable, observable, acharya-grade inference substrate.
Ganga builds that substrate.

---

## Magic phrase (paste into any new session)

```
GANGA

Pick up Project Ganga. Read PROJECT_GANGA_BOOTSTRAP.md in 00_ARCHITECTURE/ first,
then orient from PROJECT_GANGA_PLAN_v1_0.md and GANGA_PHASE_TRACKER.md.
Tell me current state, open items, and what the next session should be.
```

Claude will: read bootstrap → read phase tracker → propose thread name → report state.

---

## Reading chain (in order)

1. **This file** — you are here.
2. `00_ARCHITECTURE/GANGA_PHASE_TRACKER.md` — living status board; answers "where are we right now?"
3. `00_ARCHITECTURE/PROJECT_GANGA_PLAN_v1_0.md` — master plan; 11 workstreams, full scope, gap map, execution schedule.
4. `00_ARCHITECTURE/PROJECT_GANGA_PROTOCOL.md` — session naming, file locks, brief format, domain isolation rules.
5. `00_ARCHITECTURE/PROJECT_GANGA_SESSION_LOG.md` — running session log; append at every session close.
6. The active session brief (current brief path is listed in GANGA_PHASE_TRACKER.md §current_brief).

---

## Current state snapshot (update this block at every session close)

```yaml
last_updated: 2026-05-04
last_session: GANGA-OPEN (governance documents authored)
phase_tracker_ref: GANGA_PHASE_TRACKER.md
active_brief: CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md
current_gate: G0-K (LLM stack audit — prerequisite for all other workstreams)
immediate_next: Execute PF-S1 brief (production blocker fix: deepseek-v4-flash → deepseek-chat)
blocking_item: >
  BF.GAP.001 — DeepSeek model ID mismatch. LLM planner has never fired in
  production. All queries running on deterministic classify() fallback.
  Fix: 6 edits to registry.ts only. Brief: CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md
  Trigger: "Read CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md and execute it."
```

---

## Domain boundaries

Ganga is an **engineering-only workstream**. Sessions may only touch:

```
platform/src/**
platform/tests/**
platform/scripts/**
platform/supabase/migrations/**
00_ARCHITECTURE/GANGA_*.md          (Ganga planning artifacts)
00_ARCHITECTURE/PROJECT_GANGA_*.md  (Ganga governance artifacts)
CLAUDECODE_BRIEF_GANGA_*.md         (Ganga session briefs at root during active session)
```

**NEVER touch:**
```
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
06_LEARNING_LAYER/**
.geminirules
```

Exception: any session may append to `00_ARCHITECTURE/PROJECT_GANGA_SESSION_LOG.md`
and update `GANGA_PHASE_TRACKER.md` at close.

---

## Key prior documents (historical audit trail)

| Document | Status | Role |
|---|---|---|
| `BHISMA_FINAL_PLAN_v1_0.md` | SUPERSEDED by Ganga Plan | Prior wave plan consolidation |
| `BHISMA_W2_CLOSE_v1_0.md` | CLOSED | Wave 2 sealing artifact |
| `BHISMA_CLOSE_v1_0.md` | CLOSED | Wave 1 sealing artifact |
| `PROJECT_BHISMA_PROTOCOL.md` | SUPERSEDED by Ganga Protocol | Prior operating protocol |
| `PROJECT_BHISMA_SESSION_LOG.md` | CLOSED | Historical Wave 1 session log |
| `PLANNER_PROMPT_v1_0.md` | LIVING (v1.6 current) | Planner prompt — Ganga BF.2 will advance to v1.7 |

---

*End of PROJECT_GANGA_BOOTSTRAP.md v1.0 — 2026-05-04. Next: read GANGA_PHASE_TRACKER.md.*
