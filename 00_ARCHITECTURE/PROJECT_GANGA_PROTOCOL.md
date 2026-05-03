---
artifact: PROJECT_GANGA_PROTOCOL.md
canonical_id: PROJECT_GANGA_PROTOCOL
version: 1.0
status: CURRENT
authored_by: Claude (Cowork — GANGA-OPEN session) 2026-05-04
project_code: GANGA
supersedes: PROJECT_BHISMA_PROTOCOL.md
purpose: >
  Operating protocol for Project Ganga. Governs session naming, domain isolation,
  brief contract, gate structure, and parallel-session anti-entanglement rules.
---

# Project Ganga — Operating Protocol v1.0

## §0 — What this is

A naming + cross-session-continuity + parallel-isolation protocol for Project Ganga,
the comprehensive platform elevation and synthesis quality sprint within MARSYS-JIS.

Ganga supersedes BHISMA and consolidates all prior platform elevation work under
a single governance protocol.

---

## §1 — Naming convention

### §1.1 — Session names

Format: `GANGA-G{gate}-S{n}-{DESCRIPTION}`

| Field | Rule |
|-------|------|
| `G{gate}` | Gate number. G0=LLM stack audit (prerequisite). G1=production fix + E2E. G2=planner+retrieval+platform. G3=synthesis quality. G4=integration + close. |
| `S{n}` | Sequential session number within the gate. |
| `DESCRIPTION` | SCREAMING-KEBAB-CASE, max 4 words. |

Examples:
```
GANGA-G0-S1-STACK-AUDIT         ← Gate 0, session 1: LLM stack model audit
GANGA-G1-S1-PROD-FIX            ← Gate 1, session 1: production blocker fix
GANGA-G2-S1-PLANNER-PROMPT      ← Gate 2, session 1: planner prompt v1.7
GANGA-G2-S2-RETRIEVAL-FIXES     ← Gate 2, session 2: CGM + MSR fixes
GANGA-G3-S1-SYNTHESIS-PROMPT    ← Gate 3, session 1: synthesis prompt
GANGA-G4-S1-CLOSE               ← Gate 4: integration close
```

### §1.2 — Cowork thread names

Format: `GANGA-{GATE}-{SUMMARY}`

Examples:
```
GANGA-G0-STACK-AUDIT
GANGA-G1-PROD-FIX
GANGA-G2-PARALLEL-ROUND
GANGA-G3-SYNTHESIS-QUALITY
GANGA-G4-CLOSE
```

### §1.3 — Brief files

Active brief at root: `CLAUDECODE_BRIEF.md` (routing table only — replaced at each session open)

Session briefs (during active session): `CLAUDECODE_BRIEF_GANGA_{SESSION_ID}_v1_0.md` at project root

Completed briefs (after session close): move to `00_ARCHITECTURE/briefs/`

---

## §2 — Gate structure

### Gate 0 — LLM Stack Audit (PREREQUISITE, BLOCKING)
Audit the complete model × stack × role matrix. Finalize NIM model selection.
Author MODEL_REGISTRY_v1_0.md. **No other workstream executes until G0 closes.**

### Gate 1 — Production Fix + E2E Baseline
Fix DeepSeek production blocker. Observe LLM planner firing for first time.
Collect E2E ground truth to inform Gates 2 and 3.

### Gate 2 — Platform Hardening (parallel workstreams A-J)
Planner quality, retrieval quality, observability, test coverage, cleanup.
Multiple sessions may run in parallel within Gate 2 with non-overlapping file sets.

### Gate 3 — Synthesis Quality (Workstream L)
Author synthesis prompt. Build answer evaluation harness. Enforce B.11.
Context assembler. Calibration substrate. This is the highest-value gate.

### Gate 4 — Integration + Close
Integration smoke across all stacks. Full test run. Close artifact.

---

## §3 — Domain boundaries (file locks)

Every Ganga session must declare `may_touch` and `must_not_touch` at session open.

### Engineering domain (platform/)

```yaml
may_touch:
  - platform/src/**
  - platform/tests/**
  - platform/scripts/**
  - platform/supabase/migrations/**
  - platform/.env.local
must_not_touch:
  - 00_ARCHITECTURE/**        # except SESSION_LOG and PHASE_TRACKER append
  - 01_FACTS_LAYER/**
  - 025_HOLISTIC_SYNTHESIS/**
  - 06_LEARNING_LAYER/**
  - .geminirules
  - CLAUDE.md
```

Exception: Engineering sessions may append to `PROJECT_GANGA_SESSION_LOG.md`
and update `GANGA_PHASE_TRACKER.md` at session close. Those are the only
allowed cross-domain files.

### Governance domain (planning artifacts)

```yaml
may_touch:
  - 00_ARCHITECTURE/GANGA_*.md
  - 00_ARCHITECTURE/PROJECT_GANGA_*.md
  - CLAUDECODE_BRIEF_GANGA_*.md
must_not_touch:
  - platform/src/**
  - platform/tests/**
  - 01_FACTS_LAYER/**
  - 025_HOLISTIC_SYNTHESIS/**
```

---

## §4 — Parallel session anti-entanglement rules

### Rule 1 — One domain per process
Each running Claude Code process handles exactly one domain.

### Rule 2 — File lock declarations prevent overlap
Before starting any Gate 2 parallel session, check GANGA_PHASE_TRACKER.md §active_sessions.
If another active session has overlapping `may_touch` globs, the new session must wait
or be scoped to non-overlapping files only.

### Rule 3 — Synthesis prompt sessions are sequential
Gate 3 sessions are sequential. No two sessions may touch SYNTHESIS_PROMPT_v1_0.md,
the eval harness, or B.11 enforcement simultaneously.

### Rule 4 — Shared files require sequential access
These files are shared and only one session writes at a time:
- `PROJECT_GANGA_SESSION_LOG.md` — append-only; no concurrent writes
- `GANGA_PHASE_TRACKER.md` — sequential writes only
- `PLANNER_PROMPT_v1_0.md` — sequential writes only
- `platform/src/lib/models/registry.ts` — sequential writes only

### Rule 5 — Branch naming encodes gate
```
feature/ganga-g0-*    → Gate 0 LLM stack audit
feature/ganga-g1-*    → Gate 1 production fix
feature/ganga-g2-*    → Gate 2 hardening
feature/ganga-g3-*    → Gate 3 synthesis quality
feature/ganga-g4-*    → Gate 4 close
```

### Rule 6 — Commit messages encode gate
```
feat(ganga-g{n}-{stream}):   Engineering commits
fix(ganga-g{n}-{stream}):    Bug fix commits
test(ganga-g{n}):             Test commits
docs(ganga-g{n}):             Governance commits
chore(ganga-housekeeping):    Cleanup commits
```

---

## §5 — Session open / close ritual

### Open
1. Read `PROJECT_GANGA_BOOTSTRAP.md` → orient on current state.
2. Read `GANGA_PHASE_TRACKER.md` → check active sessions, current gate, file locks.
3. Read session brief → confirm scope, may_touch, must_not_touch.
4. Emit session open declaration (gate, session ID, may_touch, must_not_touch, ACs).
5. Check for git locks: `ls .git/*.lock` — remove stale locks.

### Close
1. All ACs from brief must be verified (tsc clean, tests pass or delta explained).
2. Set brief `status: COMPLETE` (or PARKED/PARTIAL with reason).
3. Append entry to `PROJECT_GANGA_SESSION_LOG.md`.
4. Update `GANGA_PHASE_TRACKER.md` — gate status, active_brief, open items.
5. Commit with gate-appropriate message format.
6. Move brief from root to `00_ARCHITECTURE/briefs/`.

---

## §6 — Gate acceptance criteria

### Gate 0 closes when:
- MODEL_REGISTRY_v1_0.md authored with full 5-stack × role matrix
- NIM model selection finalized with rationale
- All 5 stack API keys confirmed functional

### Gate 1 closes when:
- `plan_json IS NOT NULL` on ≥1 query in `query_plan_log` (planner fires for first time)
- E2E SQL observation data collected and reviewed
- GT.002, GT.025, R14/R15 assessed on live data

### Gate 2 closes when:
- PLANNER_PROMPT v1.7: recall ≥ 0.940, precision ≥ 0.945, GT.002+GT.025 fixed
- cgm_graph_walk: no zero_rows on 2-seed holistic queries
- msr_sql: ≥1 row on finance+Jupiter/Venus query
- CONTEXT_ASSEMBLY flag smoked and live
- Priority test failures (route.test.ts, manifest_planner.test.ts) fixed

### Gate 3 closes when:
- SYNTHESIS_PROMPT_v1_0.md authored with all 8 L.1 sub-items complete
- 100-query answer eval set built and LLM-as-judge harness operational
- B.11 runtime enforcement gate deployed (holistic_floor check live)
- Context assembler module deployed (floor/fill, dedup, ordering)
- Calibration substrate scaffolded (prediction logging + outcome capture)

### Gate 4 closes when:
- Integration smoke: planner fires on all 5 stacks in E2E
- Full test run: zero new failures vs Gate 1 baseline
- tsc --noEmit: zero src/ errors
- Phase 11B legacy: either deleted or formally deferred with dated gate decision
- `GANGA_CLOSE_v1_0.md` sealing artifact authored and committed

---

*End of PROJECT_GANGA_PROTOCOL.md v1.0 — 2026-05-04.*
