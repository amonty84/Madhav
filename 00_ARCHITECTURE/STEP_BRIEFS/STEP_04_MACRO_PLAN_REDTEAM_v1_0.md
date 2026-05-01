---
step: 4
title: Red-team pass on revised Macro Plan
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 5 (closure)
---

# STEP 4 — Macro Plan Red-Team Pass

## 1. Objective

Stress-test the DRAFT_PENDING_REDTEAM Macro Plan against the 14 critique dimensions and the grounding audit. Produce `MACRO_PLAN_REDTEAM_v1_0.md` with verdict PASS, PASS_WITH_FIXES, or FAIL. If PASS_WITH_FIXES, Step 4 applies the fixes inline in the draft. If FAIL, Step 4 routes back to Step 2 with a re-spec ask.

## 2. Inputs

**MUST read:**

1. CLAUDE.md
2. STEP_LEDGER_v1_0.md
3. This brief
4. The DRAFT_PENDING_REDTEAM Macro Plan (`MACRO_PLAN_v1_1.md` or `MACRO_PLAN_v2_0.md`)
5. `00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md`
6. `00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md`
7. `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md`
8. `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` (baseline for diff)
9. `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — red-team must verify every `open` directive whose consumption matrix names Step 3 was actually enacted (not merely claimed) in the draft.

**MAY read:** any file cited as evidence in the draft.

## 3. Deliverable

**File path:** `00_ARCHITECTURE/MACRO_PLAN_REDTEAM_v1_0.md`

**Required structure:**

- **§1 — Verdict** — PASS / PASS_WITH_FIXES / FAIL with one-paragraph rationale
- **§2 — Adversarial tests run.** At minimum:
  - T.1: For each of 14 critique dimensions, try to find a residual finding in the new draft.
  - T.2: For each MPC.N.M finding in Step 1, verify the new draft addresses it as the spec committed.
  - T.3: Cross-reference: does any draft claim contradict GROUNDING_AUDIT_v1_0 or CURRENT corpus state (MSR_v3_0 499 signals, CGM_v2_0 on v8.0, 9 L3 reports v1.1+, etc.)?
  - T.4: Forward compatibility: does the draft survive contact with PHASE_B_PLAN_v1_0.md v1.0.2 — specifically, does B.0 still make sense under the new M2 definition?
  - T.5: Scope-creep test: did Step 3 introduce content beyond the spec?
  - T.6: Ambiguity test: does any Learning Layer mechanism, Integrity substrate, or ethical framework paragraph admit more than one good-faith reading?
  - T.7: **Native directive enactment test.** For every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 3, verify the draft actually contains the required subsection/language, not just the label. For ND.1 specifically, verify the "adapted parity, not byte-identity" claim admits only one good-faith reading.
- **§3 — Findings** — each tagged FIX (must resolve before Step 5), WARN (document, don't block), or OK.
- **§4 — Inline fixes applied** — if verdict = PASS_WITH_FIXES, list every fix applied to the draft with before/after diff.
- **§5 — Handoff** — state: the draft is ready for Step 5, or must loop back to Step 2/3.

## 4. Constraints

- Do NOT change the status flag on the draft (it stays DRAFT_PENDING_REDTEAM until Step 5 closes).
- Do NOT supersede v1.0 yet.
- Do NOT re-open critique dimensions that passed in Step 1. A new finding in this step must be justified as *regression from Step 3* or *missed in Step 1*.
- FAIL verdict halts the chain. Do not attempt to carry on to Step 5.

## 5. Discipline rules

- Closed artifact.
- Adversarial voice: actively try to break the plan.
- Any fix applied inline must be a minimal surgical edit; substantive rewrites loop back.

## 6. Close criteria

- [ ] `MACRO_PLAN_REDTEAM_v1_0.md` exists
- [ ] Verdict is explicit
- [ ] All 7 adversarial tests executed (T.1–T.7)
- [ ] If PASS_WITH_FIXES, draft reflects fixes and §4 logs them
- [ ] **ND.1 enactment verified.** §3 Findings contains at least one ND.1-linked entry (FIX / WARN / OK) confirming the mirror-discipline subsection is present in the draft with the three load-bearing claims and admits a single reading. §1 Verdict explicitly reports ND.1 addressed status. If verdict=FAIL or any FIX is unresolved, this step does not close.
- [ ] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 3 is verified in T.7 and reported in §3.
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step (if PASS/PASS_WITH_FIXES):** Step 5 (closure)
- **Next step (if FAIL):** back to Step 2 (re-spec)
- **File the next step will read:** the red-teamed draft and this red-team report

## 8. Red-team prompts (self-applied)

- "Pretend you are a hostile reviewer whose incentive is to block the revision. What can you legitimately block?"
- "Would an independent senior acharya reading the new Macro Plan understand the project's thesis better than from v1.0?"
