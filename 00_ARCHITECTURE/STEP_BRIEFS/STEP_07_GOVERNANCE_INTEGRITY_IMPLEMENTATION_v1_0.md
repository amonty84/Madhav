---
step: 7
title: Implement the Governance & Integrity Protocol
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 8 (red-team)
---

# STEP 7 — Governance & Integrity Protocol Implementation

## 1. Objective

Implement, per the spec in `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` §M, every script, template, registry, and configuration the Integrity Protocol requires. This is the **first step in the governance chain that writes code**.

## 2. Inputs

**MUST read:**

1. CLAUDE.md
2. STEP_LEDGER_v1_0.md
3. This brief
4. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` — authoritative spec
5. `GROUNDING_AUDIT_v1_0.md`
6. The current Macro Plan
7. Existing scripts under `platform/scripts/` that may be reused (per protocol §C and §H)
8. `FILE_REGISTRY_v1_0.md` and `GOVERNANCE_STACK_v1_0.md` — will be edited per protocol §D decision
9. `.geminirules`
10. `.gemini/project_state.md`
11. `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — ND.1 consumption matrix names Step 7; `mirror_enforcer.py`, CANONICAL_ARTIFACTS_v1_0.md, and the re-authoring of `.geminirules` / `project_state.md` must all implement it.

## 3. Deliverables

Implementation bundle. Exact list dictated by protocol §M. Minimum expected set:

**A. New files:**

- `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — the single source-of-truth for canonical artifact paths and versions (per protocol §E). **Per ND.1**, the schema carries a `mirror_obligations` column: for every canonical artifact row, declare whether a Gemini-side counterpart exists, and if so, name the counterpart path and the authoritative side. Rows with no Gemini counterpart declare "Claude-only" explicitly rather than leaving the column empty.
- `platform/scripts/governance/drift_detector.py` — implements protocol §H
- `platform/scripts/governance/schema_validator.py` — implements protocol §I
- `platform/scripts/governance/mirror_enforcer.py` — implements protocol §J (or documented git-hook equivalent). **Per ND.1**, operates over the full inventory declared in CANONICAL_ARTIFACTS `mirror_obligations` column, not only CLAUDE.md ↔ `.geminirules`. Output identifies each out-of-sync pair and which side is stale. Exit 0 on parity, 1 on desync.
- `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` — per protocol §F
- `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` — per protocol §G
- `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` — per protocol §K (empty table + schema)

**B. Edited files:**

- `.geminirules` — replace ad-hoc collaboration clause with pointer to protocol §K and to `SESSION_OPEN_TEMPLATE`; mirror CANONICAL_ARTIFACTS block. **Per ND.1**, re-author to semantic parity with CLAUDE.md (adapted to Gemini's construct — not byte-identical). Include an explicit "Asymmetries" section documenting any Claude-side content with no Gemini equivalent and the rationale.
- `.gemini/project_state.md` — rewrite as a pointer into the new state file (drop twinkly-puzzling-quokka; point to PHASE_B_PLAN). **Per ND.1**, re-author to semantic parity with the Claude-side state-pointer equivalent; include "Asymmetries" section as above.
- `FILE_REGISTRY_v1_0.md` or its v1_1 successor — per protocol §D decision
- `GOVERNANCE_STACK_v1_0.md` — update per protocol §D decision

**C. Not in scope for this step:**

- CLAUDE.md rebuild — that is Step 9. This step may add a `[STEP_9_PENDING_FULL_REBUILD]` note at the top of CLAUDE.md only if protocol §M explicitly required it.
- SESSION_LOG schema retrofit — Step 10.
- Learning Layer scaffolding — Step 11.
- First runs of drift_detector and schema_validator — Steps 13/14.

## 4. Constraints

- Every script must run as a standalone command (`python3 platform/scripts/governance/drift_detector.py`) with no interactive prompts and clear exit codes (0 = clean, 1 = drift found, 2 = execution error).
- Every script must write a machine-readable output artifact (JSON) and a human-readable summary (markdown) — paths per protocol §M.
- Scripts must not modify any file they inspect. They are detectors only. Corrective action is always human-in-the-loop.
- No fabricated paths: every file path the scripts compare must exist at implementation time, or the script must distinguish "missing" vs "drifted".
- No new dependencies beyond what is already in `platform/` requirements. If a new dep is needed, flag `[NEW_DEPENDENCY_NEEDS_APPROVAL]` and halt that script.
- CANONICAL_ARTIFACTS_v1_0.md is the single source of truth after publication — no other file may declare a canonical version without citing it.

## 5. Discipline rules

- Closed artifact (bundle, not file — but all deliverables land in one session).
- Traceability: every deliverable has a `# Implements: Protocol §X.Y` comment header or frontmatter pointer.
- Test before close: run `drift_detector.py` at end of Step 7. It should fail with a known-state report (describing drift that Steps 8–12 will resolve). That known-state report is itself a deliverable: `DRIFT_REPORT_STEP_7_v1_0.md`.
- Run `schema_validator.py`. Same discipline: produce `SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md`.

## 6. Close criteria

- [ ] All files in §3.A exist
- [ ] All files in §3.B are edited per protocol spec
- [ ] `drift_detector.py`, `schema_validator.py`, `mirror_enforcer.py` each run end-to-end and emit JSON + markdown outputs
- [ ] `DRIFT_REPORT_STEP_7_v1_0.md` and `SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md` exist
- [ ] No `[NEW_DEPENDENCY_NEEDS_APPROVAL]` or `[SPEC_UNDERSPECIFIED]` flags unresolved
- [ ] CANONICAL_ARTIFACTS_v1_0.md is the sole place where MSR/UCN/CDLM/CGM/RM/FORENSIC/LEL/MACRO_PLAN/PHASE_B_PLAN versions are declared
- [ ] **ND.1 (Mirror Discipline) implemented end-to-end.** CANONICAL_ARTIFACTS carries the `mirror_obligations` column populated for every row (no empty cells). `mirror_enforcer.py` runs against the full inventory and exits 0 (or, if exit 1, the residual desync is documented in DRIFT_REPORT_STEP_7 as a known-state item for Step 12 to resolve). `.geminirules` and `.gemini/project_state.md` are re-authored to semantic parity with their Claude-side counterparts; each contains an "Asymmetries" section. After re-authoring, run `mirror_enforcer.py` a second time — its exit code and output are logged. After this step, a Claude-side governance change that omits the Gemini-side mirror is detectable by `mirror_enforcer.py`. If not implemented end-to-end, this step does not close.
- [ ] Once ND.1 is implemented, `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` ND.1 status is updated from `open` to `addressed` with a pointer to the Step 7 DRIFT_REPORT and the SESSION_LOG entry. If any per-step verification is deferred (e.g., an asymmetry that Step 12 will formalize), status is set to `partially_addressed` with the specific residual named.
- [ ] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 7 has been implemented and has its directive-status flipped accordingly.
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 8 (red-team on the implementation)
- **Files the next step will read:** everything in §3 + the two Step 7 reports

## 8. Red-team prompts

- "Can I bypass the drift detector by touching a file after the check? Does it re-run on close?"
- "If CANONICAL_ARTIFACTS contradicts CLAUDE.md, which wins? Is that resolution codified?"
- "Does mirror_enforcer.py catch the kind of partial mirror that happened in the PHASE_B_PLAN v1.0.2 Amendment session (L2.5 paths copied but project_state.md not updated)?"
