---
step: 15
title: Governance baseline close — the sealing artifact
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: resumption of M2 Phase B.0 execution
---

# STEP 15 — Governance Baseline Close

## 1. Objective

Produce `GOVERNANCE_BASELINE_v1_0.md`, the sealing artifact that declares the Step 0 → Step 15 governance rebuild closed, records the baseline state, and hands off to whatever work the project does next (M2 Phase B.0 execution per PHASE_B_PLAN v1.0.2, unless the new Macro Plan revised B.0 scope).

## 2. Inputs

**MUST read:**

1. New CLAUDE.md
2. CURRENT_STATE_v1_0.md
3. STEP_LEDGER_v1_0.md (all 16 rows: Step 0 and Steps 1–15)
4. This brief
5. `GROUNDING_AUDIT_v1_0.md`
6. `MACRO_PLAN_CRITIQUE_v1_0.md`
7. The new Macro Plan (v1.1 or v2.0)
8. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`
9. `ONGOING_HYGIENE_POLICIES_v1_0.md`
10. `DRIFT_REPORT_STEP_13_v1_0.md`
11. `SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md`

## 3. Deliverable

**File path:** `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md`

**Required structure:**

- **§1 Declaration.** "The Step 0 → Step 15 governance rebuild is closed on <date>. This file is the baseline state."
- **§2 Closure matrix.** One row per GA.N finding from the grounding audit. Columns: finding ID, severity, resolving step, resolution artifact, resolution verdict (RESOLVED / DEFERRED / ACCEPTED_AS_POLICY).
- **§3 Artifacts produced in Steps 0–15.** Canonical list with paths and versions. Cross-check against CANONICAL_ARTIFACTS and FILE_REGISTRY.
- **§4 Scripts introduced.** drift_detector, schema_validator, mirror_enforcer — with invocation syntax and expected clean-state output.
- **§5 Governance guarantees.** The axioms (from Integrity Protocol §A) restated as the project's new baseline commitments.
- **§6 What changed vs pre-Step-0.** A diff-level summary: versions bumped, files created, files superseded, policies installed.
- **§7 What did not change.** Explicit: the corpus itself (MSR, UCN, CDLM, RM, CGM, FORENSIC, L3 reports, LEL). The governance rebuild touched governance surfaces, not corpus content.
- **§8 Known deferred items.** Any GA.N finding or Step finding deferred to a future cycle, with owner and target window.
- **§9 Resumption pointer.** "The project now resumes M2 execution per `PHASE_B_PLAN_vX_X.md` Phase B.0". If the new Macro Plan revised B.0 scope, state the new scope. Point to the first concrete action a fresh session should take.
- **§10 Next governance cycle trigger.** "Quarterly governance pass per ONGOING_HYGIENE_POLICIES_v1_0 §H" — next due date stated.

## 4. Constraints

- Do NOT begin M2 work in this step. Step 15 closes governance only.
- Do NOT edit CLAUDE.md or any Step N deliverable in Step 15. If edits are needed, loop back.
- Do NOT declare CLEAN unless Step 13 and Step 14 both verdicted CLEAN (or RESIDUAL with pre-approved deferrals).

## 5. Discipline rules

- Closed artifact — the closing artifact.
- Adds to STEP_LEDGER the final row: `Step 15 COMPLETED, baseline sealed`.
- After this step, the Step 0 → Step 15 workflow is **retired**. Future governance work happens via quarterly passes (Step 12 §H) or ad-hoc grounding audits triggered by new drift.

## 6. Close criteria

- [ ] `GOVERNANCE_BASELINE_v1_0.md` exists
- [ ] §2 Closure matrix covers all 32 GA.N findings
- [ ] All artifacts in §3 verified to exist
- [ ] All scripts in §4 verified to run with clean exit
- [ ] §9 Resumption pointer is concrete and actionable
- [ ] STEP_LEDGER final row written
- [ ] SESSION_LOG closure entry appended per schema
- [ ] CURRENT_STATE_v1_0.md updated: active_governance_step = GOVERNANCE_CLOSED

## 7. Handoff

- **Next session:** a fresh session reading new CLAUDE.md + CURRENT_STATE + PHASE_B_PLAN vX.X begins Phase B.0 (or whatever B.0's revised scope is).
- The Step Briefs folder is retained as historical reference; future steps have different IDs and don't collide.

## 8. Red-team prompts

- "For every GA.N finding marked RESOLVED, trace the resolving artifact. Can I find it? Does it actually close the finding?"
- "If a reviewer six months from now reads GOVERNANCE_BASELINE_v1_0 only, can they reconstruct why the project was governance-healthy at this baseline?"
