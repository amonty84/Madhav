---
step: 3
title: Macro Plan rewrite per revision spec
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 4 (red-team)
---

# STEP 3 — Macro Plan Rewrite

## 1. Objective

Produce the revised Macro Plan — either `MACRO_PLAN_v1_1.md` or `MACRO_PLAN_v2_0.md` depending on the Step 2 decision — by executing the revision spec verbatim. The output is a draft marked DRAFT_PENDING_REDTEAM until Step 4 passes.

## 2. Inputs

**MUST read:**

1. CLAUDE.md
2. STEP_LEDGER_v1_0.md
3. This brief
4. `00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md` — the authoritative spec
5. `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` — source text for KEEP sections
6. `00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md` — for finding context only
7. `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` — for canonical state facts (e.g., M1 gap list correction)
8. `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — for every `open` directive whose consumption matrix names Step 3. The rewrite must implement the directive text exactly as the spec instructs; if a spec entry for a directive appears incomplete, flag `[SPEC_UNDERSPECIFIED_FOR_DIRECTIVE: ND.N]` and halt.

**MAY read:** any file the revision spec explicitly names.

**FORBIDDEN:** anything not named in the spec or this brief.

## 3. Deliverable

**File path:** `00_ARCHITECTURE/MACRO_PLAN_v1_1.md` OR `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` per Step 2 decision

**Required frontmatter:**

```yaml
---
document: MARSYS-JIS MACRO PLAN — STRATEGIC ARC
project_name: Abhisek Mohanty — Jyotish Intelligence System (MARSYS-JIS)
subject: Abhisek Mohanty (b. 1984-02-05, 10:43 IST, Bhubaneswar)
version: 1.1 OR 2.0
status: DRAFT_PENDING_REDTEAM
supersedes: v1.0 (once Step 5 closes)
author: Abhisek Mohanty
date: 2026-04-23 or later
purpose: (per spec §1 rationale)
audience: (per v1.0, updated per spec)
operational_rule: (per v1.0, updated per spec)
changelog:
  - vX.X (date): (per spec §4)
  - v1.0 (2026-04-23): Initial macro plan establishing ten macro-phase arc...
---
```

**Required structure:** exact structure as dictated by revision spec §2 and §3. Do not introduce sections not specified. Do not reorder sections.

**Content rules:**

- Every KEEP section uses the v1.0 text verbatim (copy exactly).
- Every REVISE section uses the spec's wording direction. If the spec says "rewrite M1 status to reflect CGM and L3 reports now done", actually reflect that — do not hedge.
- Every INSERT section follows the spec's skeleton. Fill in substance using grounding audit facts.
- No freelancing: if the spec did not mention a change, don't make it.
- All dates in the new Macro Plan are absolute dates, not relative.
- The Learning Layer section, if revised, must disambiguate present/future of `06_LEARNING_LAYER/` (per GA.6). "To be scaffolded in Step 11" is acceptable language.

## 4. Constraints

- Do NOT close or supersede `MACRO_PLAN_v1_0.md` yet. v1.0 remains CURRENT until Step 5.
- Do NOT update CLAUDE.md, .geminirules, project_state.md, SESSION_LOG.md's active-plan pointer, FILE_REGISTRY, or GOVERNANCE_STACK in this step. Those belong to Step 5.
- Do NOT run Step 4's red-team in this step. The output is DRAFT_PENDING_REDTEAM; Step 4 decides pass/fail.
- Do NOT invent content. If the spec calls for ethical framework text and the spec did not draft the substance, write a minimum viable skeleton and flag `[SPEC_UNDERSPECIFIED_FOR_SUBSTANCE — ESCALATE]` so Step 4 or native can fill.

## 5. Discipline rules

- Closed artifact.
- One output file. Draft only. Status marked DRAFT_PENDING_REDTEAM.
- Traceability: every revision points to the spec entry that mandated it. Append a §"Spec Traceability" appendix mapping each new/revised section → spec §2/§3 entry.

## 6. Close criteria

- [ ] New Macro Plan file exists at the specified path, status=DRAFT_PENDING_REDTEAM
- [ ] Every KEEP section matches v1.0 verbatim
- [ ] Every REVISE/REPLACE/INSERT section conforms to the spec
- [ ] No sections added beyond the spec
- [ ] `MACRO_PLAN_v1_0.md` remains unchanged and status=CURRENT
- [ ] Spec Traceability appendix present
- [ ] **ND.1 (Mirror Discipline) enacted.** The rewritten MP contains a Mirror Discipline subsection in its System Integrity Substrate section; the subsection states bidirectional obligation, adapted-parity-not-byte-identity, and scope beyond CLAUDE.md. MP changelog entry names ND.1. Spec Traceability appendix maps the Mirror Discipline subsection to the ND.1 entry in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` as well as to the spec entry that directed it. If not enacted, this step does not close.
- [ ] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 3 is enacted in the rewrite and traced in the appendix.
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 4 (red-team)
- **File the next step will read:** the DRAFT_PENDING_REDTEAM file plus the spec plus the critique

## 8. Red-team prompts

- "Diff the new Macro Plan against v1.0 — does every diff trace to a spec entry?"
- "Does the new Macro Plan contradict any CURRENT state recorded in the grounding audit?"
- "Are any `[SPEC_UNDERSPECIFIED_FOR_SUBSTANCE]` flags present? Halt Step 5 if yes."
