---
step: 8
title: Red-team the Governance & Integrity implementation
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 9 (CLAUDE.md rebuild)
---

# STEP 8 — Governance & Integrity Implementation Red-Team

## 1. Objective

Adversarially test the Step 7 implementation. Confirm every axis in the protocol has a working mechanical check. Produce `GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md` with verdict PASS / PASS_WITH_FIXES / FAIL.

## 2. Inputs

**MUST read:**

1. CLAUDE.md
2. STEP_LEDGER_v1_0.md
3. This brief
4. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`
5. Every file in Step 7 §3
6. `DRIFT_REPORT_STEP_7_v1_0.md`
7. `SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md`
8. `GROUNDING_AUDIT_v1_0.md`

**MAY run:**

- The Step 7 scripts, to verify behavior

## 3. Deliverable

**File path:** `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md`

**Required structure:**

- **§1 Verdict** — PASS / PASS_WITH_FIXES / FAIL
- **§2 Adversarial tests executed:**
  - T.1 — Inject synthetic drift: temporarily edit a copy of CLAUDE.md and run drift_detector. Verify it catches the drift. Revert.
  - T.2 — Inject a schema violation: temporarily add a malformed frontmatter to a test file and run schema_validator. Verify catch. Revert.
  - T.3 — Partial-mirror test: edit `.geminirules` without mirroring a CLAUDE.md change. Run mirror_enforcer. Verify catch. Revert.
  - T.4 — Orphaned canonical-path test: add a new canonical artifact only to CLAUDE.md, not to CANONICAL_ARTIFACTS. Run drift_detector. Verify catch. Revert.
  - T.5 — GA coverage: for each GA.N finding marked CRITICAL or HIGH in the grounding audit, identify the mechanical control that catches it and confirm it fires in the current state (or explain why it will fire when the condition arises).
  - T.6 — Script idempotence: run each script twice in a row; verify no side effects and identical output.
  - T.7 — Session handshake parsing: produce a sample SESSION_OPEN and SESSION_CLOSE artifact and confirm the template is machine-parseable (regex or YAML-load).
  - T.8 — Disagreement register: write a synthetic disagreement entry; confirm schema_validator accepts it.
- **§3 Findings** — FIX / WARN / OK tags; cite which test produced each
- **§4 Fixes applied** — if PASS_WITH_FIXES
- **§5 Residual gaps** — any GA.N finding that the implementation does not yet cover, with justification and deferral target (Step 12 or later)
- **§6 Handoff** — ready for Step 9 or loop back to Step 7

## 4. Constraints

- Run adversarial tests on **copies** or with **revertible edits**. No uncontrolled mutation of governance files.
- If a script bug is found, minor fixes can be applied inline; substantive fixes loop back to Step 7.
- FAIL halts the chain.

## 5. Discipline rules

- Closed artifact.
- Every test has a clean revert path documented.
- No test leaves scaffolding behind.

## 6. Close criteria

- [ ] All 8 tests executed with documented outcomes
- [ ] Verdict explicit
- [ ] Every CRITICAL/HIGH GA.N finding mapped to a control
- [ ] All revertible edits reverted
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step (if PASS/PASS_WITH_FIXES):** Step 9 (CLAUDE.md rebuild)
- **Next step (if FAIL):** loop back to Step 7

## 8. Red-team prompts (self-applied)

- "Pretend I am a Claude session in six months with a different system prompt and less context. Can I still bypass the integrity system unintentionally?"
- "What is the failure mode if the scripts themselves break? Does the Integrity Protocol have a fallback assertion (e.g., CI runs them)?"
