---
step: 2
title: Macro Plan revision specification
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 3 (rewrite)
---

# STEP 2 — Macro Plan Revision Spec

## 1. Objective

Produce `MACRO_PLAN_REVISION_SPEC_v1_0.md`: a finding-by-finding, section-by-section specification of exactly how `MACRO_PLAN_v1_0.md` should be revised, including the decision on whether the revision is **v1.1 (additive)** or **v2.0 (architectural)**. The spec is the blueprint Step 3 follows verbatim.

## 2. Inputs

**MUST read:**

1. `/Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md`
2. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/STEP_LEDGER_v1_0.md`
3. This brief
4. `00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md` — the critique produced in Step 1
5. `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` — the subject
6. `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md`
7. `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — LIVING artifact; §2 matrix names Step 2 as a consumer of ND.1. Every `open` directive whose consumption matrix names Step 2 MUST be addressed in this step.

**MAY read:**

- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md`
- `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md`

**FORBIDDEN:** anything outside `00_ARCHITECTURE/`.

## 3. Deliverable

**File path:** `00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md`

**Required frontmatter:**

```yaml
---
artifact: MACRO_PLAN_REVISION_SPEC_v1_0.md
version: 1.0
status: CLOSED
session: STEP_2_MACRO_PLAN_REVISION_SPEC
date: 2026-04-23 or later
subject_file: 00_ARCHITECTURE/MACRO_PLAN_v1_0.md
target_revision: v1.1 OR v2.0  # choose one with rationale in §1
consumed_by: Step 3
---
```

**Required structure:**

- **§1 — Version decision.** v1.1 vs v2.0 choice with explicit rationale. Rule of thumb: if the critique's CRITICAL findings can be resolved by additions and precisions, v1.1. If they require restructuring the macro-phase arc or adding a new cross-cutting substrate (e.g. Integrity Layer as sibling to Learning Layer), v2.0.
- **§2 — Section-by-section delta.** For every section of the existing Macro Plan, one of: KEEP (unchanged), REVISE (with exact wording direction), REPLACE (with new-section spec), DELETE (with rationale), or INSERT-BEFORE/INSERT-AFTER (for new sections). Each entry cites the MPC.N.M finding IDs it addresses.
- **§3 — New sections.** Any sections introduced by this revision (likely candidates per the 14 critique dimensions: Ethical Framework, Meta-Governance, Multi-Agent Protocol, Integrity Substrate, Post-M10 Roadmap, External Dependency Graph, Time Horizon). Each carries a skeleton of required subsections.
- **§4 — Frontmatter and changelog changes.** Exact new frontmatter, new changelog entry text.
- **§5 — Cross-surface impact.** Every surface that will need updating when the new Macro Plan is published. Minimum list: CLAUDE.md, .geminirules, .gemini/project_state.md, SESSION_LOG.md, FILE_REGISTRY_v1_0.md, GOVERNANCE_STACK_v1_0.md. This becomes Step 5's checklist.
- **§6 — Non-goals.** What this revision explicitly does NOT do. Prevents Step 3 scope-creep.
- **§7 — Finding coverage table.** One row per MPC.N.M finding from Step 1; one column per action (KEEP / REVISE / REPLACE / DELETE / INSERT / NEW-SECTION); one column citing the §2 or §3 entry that resolves it. Every CRITICAL and HIGH finding must be addressed or deferred with explicit rationale.

## 4. Constraints

- Do NOT write new Macro Plan prose. The spec describes *what* the revision does, not *writes* it. Step 3 writes it.
- Do NOT defer any CRITICAL finding without native approval. If a CRITICAL can't be resolved in this revision, flag `[NATIVE_CONFIRMATION_NEEDED]` and halt.
- Do NOT introduce new critique dimensions beyond the 14 that produced the critique. If a dimension was missing, it is Step 1's flaw and should have been caught at Step 1 close.
- Revision must be compatible with PHASE_B_PLAN_v1_0.md v1.0.2 — i.e., M2 scope and current B.0 handoff must survive the revision.

## 5. Discipline rules

- Closed artifact.
- Spec must be executable verbatim by a fresh conversation that has never seen Step 1 or Step 0.
- Every change justified by a critique finding ID. No drive-by improvements.
- If Step 2 wants to improve something outside the critique's scope, log it as a `[DEFER_TO_FUTURE_REVISION]` line item — do not silently add it.

## 6. Close criteria

- [ ] `MACRO_PLAN_REVISION_SPEC_v1_0.md` exists at the specified path
- [ ] Version decision (v1.1 or v2.0) is explicit and justified in §1
- [ ] Every Macro Plan section has a KEEP/REVISE/REPLACE/DELETE/INSERT disposition in §2
- [ ] §7 Finding Coverage Table has a row for every MPC.N.M from Step 1
- [ ] Every CRITICAL finding is addressed (not deferred) unless `[NATIVE_CONFIRMATION_NEEDED]` is present
- [ ] **ND.1 (Mirror Discipline) addressed.** Spec §3 (new sections) specifies a Mirror Discipline subsection in the new Macro Plan's System Integrity Substrate section stating the three load-bearing claims (bidirectional obligation; adapted parity not byte-identity; scope beyond CLAUDE.md). Spec §5 (cross-surface impact) names every mirror pair. Spec §7 Finding Coverage binds ND.1 to MPC.14.2 and MPC.13.1. If not addressed, this step does not close.
- [ ] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 2 has a corresponding §3 and/or §7 entry and a matching verification line here.
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 3 (Macro Plan rewrite)
- **File the next step will read:** the spec produced here
- **Blocking question, if any:** native approval on any `[NATIVE_CONFIRMATION_NEEDED]` items before Step 3 starts

## 8. Red-team prompts

- "For every CRITICAL finding, trace the spec entry that resolves it. Any unresolved?"
- "Is the v1.1 vs v2.0 decision justified by finding-severity distribution or by handwave?"
- "Would a fresh conversation with only this spec reproduce approximately the same rewrite?"
