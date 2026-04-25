---
step: 11
title: Learning Layer scaffold — present/future disambiguation
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 12 (hygiene policies)
---

# STEP 11 — Learning Layer Scaffold (or Explicit Non-Scaffold)

## 1. Objective

Resolve GA.6 — the Macro Plan names `06_LEARNING_LAYER/` as a first-class cross-cutting substrate but the directory does not exist. A fresh session reading the Macro Plan would conclude it exists and look for it. This step either (a) scaffolds a minimal placeholder with an explicit "to be populated in Phase M2 end / M3 start" notice, or (b) updates the new Macro Plan wording to unambiguously future-tense the Learning Layer and logs an explicit non-scaffold decision.

## 2. Inputs

**MUST read:**

1. New CLAUDE.md (post Step 9)
2. CURRENT_STATE_v1_0.md (post Step 10)
3. STEP_LEDGER_v1_0.md
4. This brief
5. The new Macro Plan — specifically the Learning Layer section
6. `GROUNDING_AUDIT_v1_0.md` (GA.6)
7. `PHASE_B_PLAN_v1_0.md` §E, §F — the four Learning Layer mechanisms listed as available in M2 (signal weight calibration, graph edge weight learning, embedding space adaptation, prompt optimization). The scaffold must be compatible with what M2 will want to write to it.

## 3. Deliverable

**Decision record:** `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md`

Contains:
- **§1 Decision** — SCAFFOLD or NO_SCAFFOLD
- **§2 Rationale** — citing Macro Plan wording, PHASE_B_PLAN intent, and GA.6
- **§3 Implementation (if SCAFFOLD):**
  - `06_LEARNING_LAYER/README.md` — names the ten mechanisms, tags four as "M2-available / stub", six as "activates at M4/M5/M6/M7", points to Macro Plan §Learning Layer
  - `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` — one-paragraph stub explaining I/O and dependency on Life Event Log retrodictive fit
  - `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/README.md` — similar stub
  - `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/README.md` — similar
  - `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/README.md` — similar
  - `06_LEARNING_LAYER/OBSERVATIONS/` — empty directory with `.gitkeep`; this is where shadow-mode observations accumulate for N-observation threshold per Macro Plan learning discipline
  - `06_LEARNING_LAYER/PARAMETER_UPDATES/` — empty; Bayesian updates land here after two-pass approval
- **§4 Implementation (if NO_SCAFFOLD):**
  - Edit the new Macro Plan to disambiguate Learning Layer wording (future tense, explicit "will be scaffolded when first mechanism has its first observation")
  - Log the wording change as a minor amendment (no version bump if trivial)
- **§5 Guardrails** — explicit statement: "Scaffold is empty. No Learning Layer mechanism fires in M2. First observations are admitted only after M4 Empirical Calibration begins, per Macro Plan learning discipline §3 (≥3 independent observations)." Prevents a future session from populating Learning Layer prematurely.
- **§6 Update CANONICAL_ARTIFACTS_v1_0.md** — add Learning Layer entry (either the scaffold README as CURRENT or a "PENDING_M4" placeholder row)

## 4. Constraints

- Recommended decision: **SCAFFOLD** with empty stubs. Rationale: the Macro Plan already commits to the substrate, PHASE_B_PLAN names four mechanisms as M2-available, and a scaffolded directory with guardrails is lower-risk than a conceptual placeholder that a future session might misread.
- If SCAFFOLD chosen, do NOT populate any mechanism with actual logic or weights. Empty stubs only.
- If NO_SCAFFOLD chosen, the Macro Plan edit must be approved in-band (native confirmation flag).
- Do NOT touch any corpus artifact.
- Do NOT pre-build M4/M5/M6/M7 infrastructure (explicit scope-boundary rule from Macro Plan).

## 5. Discipline rules

- Closed artifact (plus the scaffold directory bundle if SCAFFOLD).
- Every stub file contains a banner: `STATUS: STUB — activates at [M_N]. Do not populate until [prerequisite].`
- After edits, run drift_detector and schema_validator.

## 6. Close criteria

- [ ] Decision record exists
- [ ] If SCAFFOLD: `06_LEARNING_LAYER/` exists with required READMEs and empty subdirs
- [ ] If NO_SCAFFOLD: Macro Plan edit applied and changelog updated
- [ ] CANONICAL_ARTIFACTS reflects decision
- [ ] drift_detector and schema_validator pass
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 12 (Hygiene policies)

## 8. Red-team prompts

- "Does a fresh session now know why `06_LEARNING_LAYER/` is (or isn't) there?"
- "Is there any path by which a session can populate a stub mechanism without a corresponding Life Event or prediction validation?"
