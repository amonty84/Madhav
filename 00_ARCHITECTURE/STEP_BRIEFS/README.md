---
artifact: STEP_BRIEFS/README.md
version: 1.0
status: CURRENT
date: 2026-04-23
scope: >
  Index and usage protocol for the Step Briefs that govern the Step 0 → Step 15
  governance-layer rebuild. Each Step Brief is a self-contained instruction
  package that lets a FRESH Claude conversation execute exactly one step without
  needing the prior conversation's context.
---

# STEP BRIEFS — Governance Rebuild Workflow

## Purpose

The Step 0 → Step 15 workflow exists to rebuild the AM-JIS governance layer so that the project survives multi-session, multi-agent execution without drift. The workflow was commissioned in the conversation dated 2026-04-23 after the native identified that governance surfaces (CLAUDE.md, .geminirules, FILE_REGISTRY, GOVERNANCE_STACK) had already drifted out of sync within days of being mirrored.

The design principle: each step is a **closed artifact** that one conversation produces and the next conversation consumes. No step spans conversations. No two steps run simultaneously. The Step Ledger is the only cross-conversation state.

## The 15 steps at a glance

| # | Step | Primary deliverable | Depends on |
|---|---|---|---|
| 0 | Grounding | `GROUNDING_AUDIT_v1_0.md` + this README + 15 Step Briefs + `STEP_LEDGER_v1_0.md` | — |
| 1 | Exhaustive Macro Plan critique | `MACRO_PLAN_CRITIQUE_v1_0.md` (14 dimensions) | 0 |
| 2 | Macro Plan revision spec | `MACRO_PLAN_REVISION_SPEC_v1_0.md` | 1 |
| 3 | Macro Plan v1_1 (or v2_0) | `MACRO_PLAN_v1_1.md` or `MACRO_PLAN_v2_0.md` | 2 |
| 4 | Red-team pass on new Macro Plan | `MACRO_PLAN_REDTEAM_v1_0.md` | 3 |
| 5 | Close Macro Plan revision | Macro Plan marked CURRENT, v1_0 SUPERSEDED, all surfaces updated | 4 |
| 5A | Project Architecture refresh (v2.1 → v2.2) | `PROJECT_ARCHITECTURE_v2_2.md` + mirror updates + v2.1 SUPERSEDED banner | 5 |
| 6 | Governance & Integrity Protocol design | `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` (spec only) | 5A + Step 0 audit |
| 7 | Integrity system implementation | drift-detection script, schema validator, session-open handshake template, session-close checklist, mirror enforcer, updated `.geminirules` and `project_state.md` | 6 |
| 8 | Red-team pass on integrity system | `GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md` | 7 |
| 9 | CLAUDE.md rebuild | New `CLAUDE.md` (root) incorporating all findings | 8 |
| 10 | SESSION_LOG format + enforcement | `SESSION_LOG_SCHEMA_v1_0.md`, template, header retrofit | 9 |
| 11 | Learning Layer scaffolding check | Scaffold `06_LEARNING_LAYER/` with README and deferral notice, or document explicit non-scaffold decision | 10 |
| 12 | Ongoing hygiene policies | `ONGOING_HYGIENE_POLICIES_v1_0.md` | 11 |
| 13 | Run drift-detection script | `DRIFT_REPORT_STEP_13_v1_0.md` (baseline clean state) | 12 |
| 14 | Run schema validator | `SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md` | 13 |
| 15 | Close with governance baseline | `GOVERNANCE_BASELINE_v1_0.md` (final artifact) | 14 |

After Step 15, the project has a clean, enforceable governance layer and can resume M2 execution (Phase B.0 onward) with confidence that drift will be caught mechanically rather than accidentally.

## Protocol for starting a fresh conversation on Step N

Each fresh conversation begins with this exact handshake:

```
Read the following files in order:
1. /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md
2. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/STEP_LEDGER_v1_0.md
3. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/STEP_BRIEFS/STEP_[N]_*.md
4. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md
5. Any files named in the Step Brief's "inputs" block

Confirm:
- Ledger shows Step N-1 status = completed (or Step 0 has seeded the ledger)
- Ledger shows Step N status = pending
- No other step is status = in_progress

Then execute per the Step Brief's close criteria. Close the step by:
- Producing the brief's named deliverable file(s)
- Updating STEP_LEDGER_v1_0.md with status=completed and deliverable path
- Appending a Session entry to SESSION_LOG.md (after Step 10 retrofit, use schema)
```

## Step Brief schema

Every brief in this folder carries these eight fields:

1. **objective** — one sentence, what this step produces and why
2. **inputs** — full file paths the session MUST read, full file paths it MAY read, and forbidden files (out of scope)
3. **deliverables** — exact file path(s) and required frontmatter for each output
4. **constraints** — what this step is NOT allowed to do
5. **discipline rules** — the closed-artifact, version-bump, scope-boundary, no-mix-layers rules as they apply to this specific step
6. **close criteria** — the checklist this step must satisfy to be marked completed in the ledger
7. **handoff** — the single next step, the file the next step will read, and any state that must be transferred
8. **redteam prompts** — prompts that a later red-team pass can use to stress-test this step's output

## Governing rule for every fresh conversation

The conversation that executes Step N **does not speculate about Steps N+1 through 15**. It closes Step N and hands off. The brief for Step N gives it everything it needs. If the brief turns out to be wrong, the session flags it in the ledger and stops rather than "improvising".

## Files in this folder

- `README.md` (this file)
- `STEP_01_MACRO_PLAN_CRITIQUE_v1_0.md`
- `STEP_02_MACRO_PLAN_REVISION_SPEC_v1_0.md`
- `STEP_03_MACRO_PLAN_REWRITE_v1_0.md`
- `STEP_04_MACRO_PLAN_REDTEAM_v1_0.md`
- `STEP_05_MACRO_PLAN_CLOSURE_v1_0.md`
- `STEP_5A_PROJECT_ARCHITECTURE_REFRESH_v1_0.md`
- `STEP_06_GOVERNANCE_INTEGRITY_DESIGN_v1_0.md`
- `STEP_07_GOVERNANCE_INTEGRITY_IMPLEMENTATION_v1_0.md`
- `STEP_08_GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md`
- `STEP_09_CLAUDE_MD_REBUILD_v1_0.md`
- `STEP_10_SESSION_LOG_SCHEMA_v1_0.md`
- `STEP_11_LEARNING_LAYER_SCAFFOLD_v1_0.md`
- `STEP_12_ONGOING_HYGIENE_POLICIES_v1_0.md`
- `STEP_13_DRIFT_DETECTION_RUN_v1_0.md`
- `STEP_14_SCHEMA_VALIDATION_RUN_v1_0.md`
- `STEP_15_GOVERNANCE_BASELINE_CLOSE_v1_0.md`

---

## Changelog

- 2026-04-23 v1.0: Initial index produced in Step 0. CURRENT.
- 2026-04-23 v1.0 amendment: Step 5A inserted (Project Architecture refresh v2.1 → v2.2) between Step 5 and Step 6. Step 6 now depends on Step 5A. Amendment rationale: native confirmed v2.1 architecture blueprint has drifted from current thought process (§E file tree, §I execution sequence, §D.6/D.7/D.9 placeholder workstreams, missing Macro Plan / Learning Layer / Gemini coverage) and authorized explicit closure within the rebuild rather than deferring to a post-rebuild cycle.
