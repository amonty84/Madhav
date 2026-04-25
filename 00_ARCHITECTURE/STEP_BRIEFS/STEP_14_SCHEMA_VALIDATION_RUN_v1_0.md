---
step: 14
title: Baseline schema-validator run
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 15 (governance baseline close)
---

# STEP 14 — Baseline Schema-Validator Run

## 1. Objective

Run `schema_validator.py` on the final state and produce `SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md`. Expected: clean. This step validates frontmatter and SESSION_LOG schema conformance across the project after the full governance rebuild.

## 2. Inputs

**MUST read:**

1. New CLAUDE.md
2. CURRENT_STATE_v1_0.md
3. STEP_LEDGER_v1_0.md
4. This brief
5. `SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md` — baseline (known schema issues) for diff
6. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` §I
7. `SESSION_LOG_SCHEMA_v1_0.md`

**MAY run:** `schema_validator.py`

## 3. Deliverable

**File path:** `00_ARCHITECTURE/SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md`

**Required structure:**

- **§1 Summary.** Exit code, violation count, diff vs Step 7 baseline.
- **§2 Per-file results.** Every file inspected, pass/fail, fields checked.
- **§3 Rule coverage.** One row per schema rule, with count of files inspected and count passing.
- **§4 Residual violations.** If any, owning step.
- **§5 Verdict.** CLEAN / RESIDUAL / REGRESSION.

## 4. Constraints

- Read-only step. No file modifications other than the report.
- Do NOT tune the validator to pass. If it fails, report fails.
- REGRESSION halts.

## 5. Discipline rules

- Closed artifact.
- Run with the schema_validator exactly as Step 10/12 extended it.

## 6. Close criteria

- [ ] schema_validator.py executed, exit code recorded
- [ ] Report produced at specified path
- [ ] Verdict explicit
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step (if CLEAN/RESIDUAL):** Step 15 (final closure)
- **Next step (if REGRESSION):** loop back

## 8. Red-team prompts

- "Does the validator inspect every file under 00_ARCHITECTURE/ and 025_HOLISTIC_SYNTHESIS/, or only a curated list?"
- "Does SESSION_LOG.md validate entry-by-entry or only as one blob?"
