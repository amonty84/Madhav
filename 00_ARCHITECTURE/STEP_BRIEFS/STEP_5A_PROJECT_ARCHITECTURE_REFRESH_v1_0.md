---
step: 5A
title: Project Architecture refresh — absorb Macro Plan, Learning Layer, Gemini collab, file-tree corrections
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING_AMENDMENT (2026-04-23)
consumed_by: Step 6 (Governance & Integrity Protocol design — uses refreshed architecture as input)
inserted_reason: >
  During Step 0 closure the native confirmed that PROJECT_ARCHITECTURE_v2_1.md
  is the latest architecture doc but has drifted from current thought process
  in specific, documented ways — §E file tree, §I execution sequence, §D.6/
  D.7/D.9 placeholder workstreams, and missing coverage of Macro Plan arc,
  Learning Layer substrate, and Gemini collaboration. Rather than defer this
  drift to a post-rebuild cycle, Step 5A was inserted immediately after Step 5
  so the refreshed architecture is available as input for Step 6's governance
  integrity design.
---

# STEP 5A — Project Architecture Refresh

## 1. Objective

Produce `PROJECT_ARCHITECTURE_v2_2.md` — a **minor-version refresh** of the governing architecture blueprint that absorbs the architectural developments accumulated since v2.1 was closed on 2026-04-17. The refresh reconciles the blueprint with (a) the new Macro Plan (v1.1 or v2.0 as closed in Step 5), (b) the Learning Layer substrate, (c) the Gemini multi-agent collaboration workstream, (d) corrected file-system tree, and (e) live content in D.6/D.7/D.9 where v2.1 only left v1.0 back-pointers.

This is NOT a v3.0 rewrite. The five-layer pyramid (§C), the 12 architectural principles (§B), the stable-ID namespace (§F), and the quality standards (§H) are preserved. The refresh edits §A rationale, replaces §E, rewrites §I, and adds targeted sections for Learning Layer and multi-agent collaboration. v2.1 is marked SUPERSEDED with a retention banner; it is not deleted.

## 2. Inputs

**MUST read:**

1. `/Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md`
2. `00_ARCHITECTURE/STEP_LEDGER_v1_0.md`
3. This brief
4. `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` — the doc being refreshed
5. The new Macro Plan (closed in Step 5 — `MACRO_PLAN_v1_1.md` or `MACRO_PLAN_v2_0.md`) and `MACRO_PLAN_v1_0.md` (SUPERSEDED, for diff context)
6. `MACRO_PLAN_CRITIQUE_v1_0.md` — every MPC.N finding that touches architecture surfaces must be reconciled
7. `MACRO_PLAN_REVISION_SPEC_v1_0.md` — names which concepts the new Macro Plan absorbed
8. `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` — GA.1, GA.7–GA.12, GA.22–GA.32 must all be addressed or explicitly deferred
9. `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` (v1.0.2) — the live M2 execution plan; §E must anticipate it
10. `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (frontmatter only) — canonical L1 artifact, for §E correction
11. `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` (frontmatter only) — for §E correction
12. `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md`, `UCN_v4_0.md`, `CDLM_v1_1.md`, `RM_v2_0.md`, `CGM_v2_0.md` (frontmatter only) — for §E correction
13. `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` (or v1_1 after Step 5)
14. `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md`
15. `.geminirules` and `.gemini/project_state.md` — multi-agent collaboration surfaces
16. `00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md`
17. `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — ND.1 consumption matrix names Step 5A; §D.11 (Multi-Agent Collaboration workstream) must absorb the mirror-pair inventory and the adapted-parity principle.

**MAY read:**

- Existing workstream-support scripts under `platform/scripts/`
- Any L3 Domain Report frontmatter to verify §E paths

## 3. Deliverable

**File path:** `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md`

**Required frontmatter additions vs v2.1:**

```yaml
version: 2.2
supersedes: 2.1 (2026-04-17) and 2.0 and 1.0 (archived)
status: APPROVED BLUEPRINT — governance-rebuild amendment absorbed
v22_rationale: >
  Absorbs the Macro Plan M1-M10 arc, the Learning Layer substrate, the Gemini
  multi-agent collaboration workstream, and corrected file-system tree.
  Produced in Step 5A of the Step 0 → Step 15 governance rebuild.
blueprint_date: 2026-04-23
```

**Required structural changes:**

- **§A.4 addendum:** Add a paragraph acknowledging the post-v2.1 drift and naming the refresh rationale in one sentence. Cite the new Macro Plan by name.
- **§B (principles):** UNCHANGED. Preserve all 12 principles verbatim.
- **§C (pyramid):** UNCHANGED. Preserve the five-layer model.
- **§D (workstreams):**
  - D.1–D.5: minor edits only (version pointer corrections, e.g., "v6.0 (current)" → "v8.0 (current)" where applicable)
  - D.6 (Remedial Codex): replace "Unchanged from v1.0 — see v1.0 §D.5 equivalent" with an actual scope paragraph pointing to Macro Plan M7 (or equivalent)
  - D.7 (Temporal Engines): same — replace back-pointer with live scope
  - D.8 (Query & Prompt Library): preserve — still current
  - D.9 (Governance Stack): replace "Unchanged from v1.0" with a live paragraph that (a) points forward to the forthcoming Governance Integrity Protocol (Step 6) without pre-specifying it, and (b) cites the existing GOVERNANCE_STACK_v1_0 + LIVING_PROJECT_MAINTENANCE_GUIDE
  - **D.10 (NEW):** Learning Layer substrate workstream — per the new Macro Plan's Learning Layer section. One paragraph scoping the 10 mechanisms at a summary level, with forward pointer to Macro Plan for detail.
  - **D.11 (NEW):** Multi-Agent Collaboration workstream — Claude ↔ Gemini two-pass protocol, .geminirules, project_state.md mirror, disagreement register. One paragraph at summary level, pointing to Governance Integrity Protocol (Step 6) for enforcement mechanics. **Must absorb ND.1 (Mirror Discipline):** name the mirror-pair inventory at a summary level (every pair, with which side is authoritative), state the adapted-parity-not-byte-identity principle, and declare that the full machine-enforceable inventory is owned by CANONICAL_ARTIFACTS_v1_0.md (Step 7 deliverable).
- **§E (file system architecture):** REPLACE ENTIRELY with a corrected tree that:
  - Names "PROJECT_ARCHITECTURE_v2_2.md ← this file" (not v2_0)
  - Lists FORENSIC_ASTROLOGICAL_DATA_v8_0.md (not FORENSIC_DATA_v7_0)
  - Lists LIFE_EVENT_LOG_v1_2.md (not v1_0)
  - Lists MSR_v3_0, UCN_v4_0, CDLM_v1_1, RM_v2_0, CGM_v2_0 (current versions)
  - Includes `00_ARCHITECTURE/STEP_LEDGER_v1_0.md`, `STEP_BRIEFS/`, `GROUNDING_AUDIT_v1_0.md`, `MACRO_PLAN_vX_X.md`, `PHASE_B_PLAN_v1_0.md`
  - Includes `.geminirules` and `.gemini/project_state.md` at project root
  - Lists `06_LEARNING_LAYER/` either as scaffolded (if Step 11 scaffolds) or as "DEFERRED — see Macro Plan" (consistent with Step 11's decision at the time Step 5A runs — note: Step 11 may not have run yet; if not, Step 5A lists it as "PENDING per Step 11")
- **§F (stable ID namespace):** ADD rows for:
  - `GA.*` (grounding audit findings)
  - `MPC.*` (Macro Plan critique findings)
  - `STEP.*` (governance rebuild step IDs)
  - `LEL.*` if Macro Plan assigns a namespace; otherwise confirm `EVT.*` suffices
  - Any new namespaces introduced by the new Macro Plan
  Preserve all existing rows verbatim.
- **§G:** UNCHANGED, or minor version-pointer corrections only.
- **§H:** UNCHANGED.
- **§I (execution sequence):** REPLACE ENTIRELY with a short pointer section that says "Execution cadence is now governed by `MACRO_PLAN_vX_X.md` (ten macro phases M1–M10) and the currently-active phase plan (`PHASE_B_PLAN_v1_0.md` v1.0.2 for M2)." Do NOT re-enumerate the phases — that's the Macro Plan's job. Remove v2.1's 6-phase 38-42-session schedule. State explicitly that the prior 6-phase arc is superseded.
- **§J:** UNCHANGED. All five v2.1 decisions remain resolved.
- **§K (blueprint meta):** Add a changelog entry for v2.2, naming every section changed.
- **NEW §L — Governance Rebuild Reference:** A short section (one page) that points to STEP_LEDGER_v1_0.md, GROUNDING_AUDIT_v1_0.md, and the forthcoming GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md (Step 6 deliverable). This section is the single bridge between the architecture blueprint and the governance-layer artifacts.

**Required secondary edits:**

- Edit `PROJECT_ARCHITECTURE_v2_1.md` — update frontmatter `status:` to `SUPERSEDED by PROJECT_ARCHITECTURE_v2_2.md`, prepend a one-line banner at the top: `> **SUPERSEDED** — see PROJECT_ARCHITECTURE_v2_2.md for current. Retained for historical reference only.` Do not delete content.
- Edit CLAUDE.md mandatory reading item #2: `PROJECT_ARCHITECTURE_v2_1.md` → `PROJECT_ARCHITECTURE_v2_2.md`.
- Edit `.geminirules` and `.gemini/project_state.md` to reflect the new architecture version.
- Edit `FILE_REGISTRY` and `GOVERNANCE_STACK` — update architecture row; bump registry version if schema unchanged.

## 4. Constraints

- Do NOT rewrite §B (principles), §C (pyramid), §F's existing rows, §H (quality), or §J (key decisions). These are stable and preserving them is load-bearing.
- Do NOT specify the Governance Integrity Protocol in this step. Step 6 owns that. §D.9 and §D.11 may only name it as a forward pointer — no design detail.
- Do NOT design the Learning Layer mechanisms in this step. Macro Plan owns them. §D.10 summarizes only.
- Do NOT alter the MSR signal count ("499 signals" — reconcile the v2.1 wording "target 500-600" to actual current state in whichever section referenced the target).
- Do NOT edit any corpus file (MSR, UCN, CDLM, RM, CGM, forensic, LEL, L3 reports). Architecture layer only.
- Do NOT rewrite anything the new Macro Plan just re-scoped — reference it rather than duplicate.
- If the new Macro Plan's language for a concept differs from v2.1's language, adopt the Macro Plan's language. The Macro Plan is the authoritative source.

## 5. Discipline rules

- **Closed artifact per session.** One session produces v2.2, marks v2.1 superseded, and propagates the pointer updates.
- **Minor-version bump.** This is v2.1 → v2.2, not v2 → v3. The refresh preserves conceptual continuity. If the session finds it needs structural changes beyond what this brief authorizes, it halts and reports.
- **Preservation discipline.** §B, §C, §H, §J are preserved verbatim. Any edit in these sections is a protocol violation.
- **Inline red-team pass.** Before close, the session runs the Red-team prompts in §8 below as a self-check. No separate Step 5B red-team is required for this minor bump; the self-check satisfies the red-team-before-major-close rule at minor-bump scale.
- **Mirror discipline (per ND.1).** After editing CLAUDE.md, .geminirules, project_state.md, FILE_REGISTRY, and GOVERNANCE_STACK, run the eyeball check: (a) all five surfaces must name `PROJECT_ARCHITECTURE_v2_2.md`; (b) the Gemini-side surfaces (`.geminirules`, `project_state.md`) must carry the semantically equivalent content adapted to Gemini's construct — not byte-identical copies of the Claude-side text, but governance parity. Document any intentional asymmetry in the relevant Gemini-side file's "Asymmetries" note.

## 6. Close criteria

- [ ] `PROJECT_ARCHITECTURE_v2_2.md` exists with required frontmatter and structural changes
- [ ] Every GA.N finding that touches architecture (GA.1, GA.7–GA.12, GA.22–GA.32) is addressed in the new file OR explicitly deferred with rationale
- [ ] §B, §C, §F-existing-rows, §H, §J preserved verbatim
- [ ] §E file tree reflects actual current filesystem (paths + versions correct)
- [ ] §I replaced with pointer to Macro Plan; prior 6-phase arc explicitly superseded
- [ ] §D.6/D.7/D.9 no longer say "Unchanged from v1.0"
- [ ] §D.10 and §D.11 added (Learning Layer + Multi-Agent Collaboration workstreams)
- [ ] §L (Governance Rebuild Reference) added
- [ ] v2.1 marked SUPERSEDED with banner; content retained
- [ ] CLAUDE.md mandatory reading item #2 points to v2.2
- [ ] `.geminirules`, `.gemini/project_state.md` updated
- [ ] FILE_REGISTRY + GOVERNANCE_STACK architecture rows updated
- [ ] Inline red-team self-check documented in the v2.2 changelog
- [ ] **ND.1 (Mirror Discipline) addressed at architecture level.** v2.2 §D.11 contains the mirror-pair inventory and the explicit adapted-parity principle. The eyeball check confirms Gemini-side surfaces carry semantically equivalent content (not byte-identical), with asymmetries documented. If not addressed, this step does not close.
- [ ] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 5A has a corresponding §D entry or §L pointer with explicit addressing.
- [ ] STEP_LEDGER row for Step 5A updated to completed, deliverable path filled
- [ ] SESSION_LOG entry appended per active schema

## 7. Handoff

- **Next step:** Step 6 (Governance & Integrity Protocol design)
- **Input for next step:** the refreshed `PROJECT_ARCHITECTURE_v2_2.md` (specifically §D.9, §D.11, §L) + the new Macro Plan + GROUNDING_AUDIT_v1_0
- **State transferred:** Step 6's inputs list already includes the architecture doc; the pointer bump is transparent to Step 6 since it reads "the current architecture blueprint".

## 8. Red-team prompts (inline self-check before close)

- "grep the entire repo for `PROJECT_ARCHITECTURE_v2_1` — every hit should either be in the v2_1 file itself, in STEP_BRIEFS, in SESSION_LOG history, in the GROUNDING_AUDIT, or explicitly noted as historical. Any live pointer outside those is a bug."
- "Do CLAUDE.md, .geminirules, project_state.md, FILE_REGISTRY, and GOVERNANCE_STACK all name `PROJECT_ARCHITECTURE_v2_2.md`? List any differences."
- "For every GA.N finding in the grounding audit that named an architecture surface, can a reader find its resolution in v2.2? If any GA.N is silently dropped, flag it."
- "Does §E (file tree) match what `ls` would return today? Every path named exists; every path that exists in the project's 00_, 01_, 02_, 025_ folders is either in §E or explicitly out-of-scope."
- "Does v2.2 pre-specify anything that Step 6 is supposed to design? If yes, move that content to a Step-6-ready forward pointer and remove it from v2.2."
- "Is the distinction between Learning Layer (D.10) and Governance Integrity (D.9/forward pointer) crisp? A fresh reader should not conflate them."
- "Does the new §I correctly defer to the Macro Plan without duplicating its content? A reader looking for 'the execution sequence' should land on the Macro Plan, not on §I."

## 9. Scope boundary (explicit)

This step refreshes the architecture blueprint. It does NOT:
- Design or build the Governance Integrity Protocol (Step 6/7)
- Scaffold the Learning Layer (Step 11)
- Produce any corpus artifact (no MSR, UCN, CDLM, RM, CGM, or L3 report touched)
- Execute any Phase B work (paused per the CLAUDE.md banner)
- Resolve any Macro Plan critique finding that is not about architecture surfaces

If the session discovers an architecture-surface issue that needs addressing but is larger than a minor bump, it halts, files the finding as a new ledger row, and hands off without closing Step 5A.
