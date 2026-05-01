---
step: 13
title: Baseline drift-detection run
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 14 (schema validator run)
---

# STEP 13 — Baseline Drift-Detection Run

## 1. Objective

Run `drift_detector.py` on the final, fully-governed state of the project and produce `DRIFT_REPORT_STEP_13_v1_0.md`. Expected outcome: **zero drift**. If any drift is found, this step fails and loops back to the implementation step that introduced the regression.

## 2. Inputs

**MUST read:**

1. New CLAUDE.md
2. CURRENT_STATE_v1_0.md
3. STEP_LEDGER_v1_0.md
4. This brief
5. `DRIFT_REPORT_STEP_7_v1_0.md` (baseline with known drift) — used for diff
6. `ONGOING_HYGIENE_POLICIES_v1_0.md`
7. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` §H

**MAY run:** `drift_detector.py`

## 3. Deliverable

**File path:** `00_ARCHITECTURE/DRIFT_REPORT_STEP_13_v1_0.md`

**Required structure:**

- **§1 Summary.** Exit code, drift count, diff vs Step 7 baseline (Step 7 produced known drift; Step 13 should be clean).
- **§2 Detailed results.** One section per axis/check in the drift detector.
- **§3 Residual drift (if any).** List each item with owning step — the step that should have resolved it but didn't.
- **§4 Verdict.** CLEAN / RESIDUAL / REGRESSION.
  - CLEAN: no drift, proceed to Step 14
  - RESIDUAL: drift present but all items were explicitly deferred with rationale in prior steps
  - REGRESSION: drift present that should have been resolved; halt and route back

## 4. Constraints

- Do NOT modify any file in this step other than the report. Step 13 is a read-only verification run.
- Do NOT suppress drift findings. Every finding is reported; deferrals (if any) are cited with source step.
- REGRESSION verdict halts the chain.

## 5. Discipline rules

- Closed artifact.
- Run drift_detector exactly as Step 7 implemented it. Do not tune to make it pass.

## 6. Close criteria

- [ ] drift_detector.py executed, exit code recorded
- [ ] Report produced at specified path
- [ ] Verdict explicit
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step (if CLEAN/RESIDUAL):** Step 14 (schema validator run)
- **Next step (if REGRESSION):** loop back to the step that introduced the drift

## 8. Red-team prompts

- "Is the drift detector actually checking every axis it claims to check, or are any checks stubbed?"
- "If I manually introduce a new drift right now (copy, run, revert), does the report capture it correctly?"
