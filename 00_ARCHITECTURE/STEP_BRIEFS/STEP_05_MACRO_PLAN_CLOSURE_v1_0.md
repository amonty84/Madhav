---
step: 5
title: Close Macro Plan revision and propagate to all surfaces
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 5A (Project Architecture refresh — uses new Macro Plan as primary input) → Step 6 (governance design)
---

# STEP 5 — Macro Plan Closure

## 1. Objective

Promote the red-teamed Macro Plan draft from DRAFT_PENDING_REDTEAM to CURRENT, mark `MACRO_PLAN_v1_0.md` as SUPERSEDED, and propagate the change to every governance surface named in revision spec §5. This is the first step in the chain that touches CLAUDE.md, .geminirules, project_state.md, FILE_REGISTRY, and GOVERNANCE_STACK. The touches are **surgical minimal** — Step 9 will do the full CLAUDE.md rebuild.

## 2. Inputs

**MUST read:**

1. CLAUDE.md
2. STEP_LEDGER_v1_0.md
3. This brief
4. The red-teamed Macro Plan draft
5. `MACRO_PLAN_REDTEAM_v1_0.md` (must show PASS or PASS_WITH_FIXES)
6. `MACRO_PLAN_REVISION_SPEC_v1_0.md` §5 (cross-surface impact list)
7. `MACRO_PLAN_v1_0.md`
8. `.geminirules`
9. `.gemini/project_state.md`
10. `FILE_REGISTRY_v1_0.md`
11. `GOVERNANCE_STACK_v1_0.md`
12. `SESSION_LOG.md` (tail)

## 3. Deliverables

Not one file — this step is a **coordinated multi-file edit**. Required actions:

**Action 1:** In the new Macro Plan file, update frontmatter:
- `status: DRAFT_PENDING_REDTEAM` → `status: CURRENT`
- Confirm `supersedes: v1.0` present
- Append a closure entry in changelog

**Action 2:** Edit `MACRO_PLAN_v1_0.md`:
- Update frontmatter: `status: ORIENTATION DOCUMENT...` → `status: SUPERSEDED by MACRO_PLAN_vX_X.md`
- Prepend a banner: `> **SUPERSEDED** — see `MACRO_PLAN_vX_X.md` for current. Retained for historical reference only.`
- Do not delete content.

**Action 3:** Edit CLAUDE.md mandatory reading list item 3:
- `MACRO_PLAN_v1_0.md` → `MACRO_PLAN_vX_X.md`
- Update the parenthetical description if the revision reframed the arc

**Action 4:** Edit `.geminirules`:
- Mirror the MACRO_PLAN pointer if it's cited (currently not cited explicitly; add if revision adds it to .geminirules per Step 2 spec)

**Action 5:** Edit `.gemini/project_state.md`:
- Replace "twinkly-puzzling-quokka.md" reference with a pointer to `PHASE_B_PLAN_v1_0.md v1.0.2`
- Update the "Active Phase" section to reflect the new Macro Plan's language (e.g., if Integrity substrate added, note it)

**Action 6:** Edit `FILE_REGISTRY_v1_0.md`:
- Bump file_registry version (e.g., v1_0 → v1_1) if schema unchanged; or create `FILE_REGISTRY_v1_1.md` if row additions
- Update MACRO_PLAN row to show new version as CURRENT, v1.0 as SUPERSEDED
- Fix MSR row to MSR_v3_0 (499) per GA.1 — this is a parallel cleanup the revision naturally enables

**Action 7:** Edit `GOVERNANCE_STACK_v1_0.md`:
- Append amendment log entry for Step 5 closure
- Update §1 L-meta registry: new Macro Plan CURRENT, v1_0 SUPERSEDED
- Fix MSR row to MSR_v3_0 (499)

**Action 8:** Append to `SESSION_LOG.md`:
- Entry titled `Session — STEP_5_MACRO_PLAN_CLOSURE (date, CLOSED)`
- List every file touched in Actions 1–7
- Set next session objective: "Execute Step 5A — Project Architecture Refresh (v2.1 → v2.2)"

## 4. Constraints

- Do NOT rebuild CLAUDE.md wholesale in this step — only the mandatory reading item 3. Step 9 does the full rebuild.
- Do NOT add/remove canonical artifact paths in CLAUDE.md beyond what's needed for the Macro Plan pointer change — Step 9 handles that.
- Do NOT edit any corpus file (MSR, UCN, CDLM, RM, CGM, forensic, L3 reports). This step is governance-only.
- If Step 4 verdict was FAIL, this step halts immediately — log to ledger and stop.

## 5. Discipline rules

- Atomic edits. If any of Actions 1–8 fail, roll back the preceding actions in the same session and mark the step blocked.
- Version-bump discipline: every edited registry file carries a new changelog entry.
- Mirror discipline: after the edits, run the eyeball check — CLAUDE.md, .geminirules, FILE_REGISTRY, GOVERNANCE_STACK all name the same Macro Plan version.

## 6. Close criteria

- [ ] New Macro Plan status=CURRENT
- [ ] Old Macro Plan status=SUPERSEDED with banner
- [ ] CLAUDE.md mandatory reading #3 updated
- [ ] .geminirules updated if spec required
- [ ] project_state.md no longer references twinkly-puzzling-quokka
- [ ] FILE_REGISTRY MACRO_PLAN row updated; MSR row corrected
- [ ] GOVERNANCE_STACK updated
- [ ] SESSION_LOG entry appended
- [ ] STEP_LEDGER status=completed

## 7. Handoff

- **Next step:** Step 5A (Project Architecture refresh v2.1 → v2.2)
- **Input for next step:** the new Macro Plan (now CURRENT) + `PROJECT_ARCHITECTURE_v2_1.md` + GROUNDING_AUDIT_v1_0 + MACRO_PLAN_CRITIQUE_v1_0
- **Step after that:** Step 6 (Governance Integrity Protocol design), which consumes the refreshed architecture

## 8. Red-team prompts

- "grep the entire repo for `MACRO_PLAN_v1_0` — every hit should either be in the v1_0 file itself, in STEP_BRIEFS, in SESSION_LOG history, or explicitly noted as historical. Any live pointer is a bug."
- "Do CLAUDE.md and .geminirules now cite the same version of every canonical artifact? List differences."
