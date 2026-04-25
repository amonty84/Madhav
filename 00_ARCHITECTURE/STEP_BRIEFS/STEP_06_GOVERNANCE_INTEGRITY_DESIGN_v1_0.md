---
step: 6
title: Governance & Integrity Protocol — design document
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 7 (implementation)
---

# STEP 6 — Governance & Integrity Protocol Design

## 1. Objective

Produce `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` — a **specification-only** document that defines the full drift-prevention, integrity-enforcement, and multi-agent-sync system the project will implement. No code or configuration is written in this step. The design document becomes the requirements spec Step 7 implements.

The protocol spans six axes:
1. **Data integrity** — facts, derivations, interpretations, cross-file citations
2. **Data accuracy** — numeric invariants, position grammar, version pointers
3. **Data consistency** — cross-surface version agreement, canonical-path agreement
4. **Alignment to goals and plan** — scope-boundary enforcement per Macro Plan and active phase plan
5. **Living-document hygiene** — registry currency, staleness detection
6. **Multi-agent collaboration** — Claude ↔ Gemini sync, session-open handshake, session-close checklist

## 2. Inputs

**MUST read:**

1. CLAUDE.md
2. STEP_LEDGER_v1_0.md
3. This brief
4. `GROUNDING_AUDIT_v1_0.md` — every finding is an input here; design must address them by ID
5. The current Macro Plan (after Step 5 closure — v1.1 or v2.0)
6. `PROJECT_ARCHITECTURE_v2_2.md` — refreshed blueprint from Step 5A; specifically §D.9 (governance pointer), §D.11 (multi-agent collaboration workstream summary), and §L (Governance Rebuild Reference)
7. `PHASE_B_PLAN_v1_0.md` §H (P1–P9 validators — informs validator schema)
8. `.geminirules` — current multi-agent protocol statement
9. `.gemini/project_state.md`
10. `GOVERNANCE_STACK_v1_0.md` — existing governance registry (design will supersede/extend it)
11. `FILE_REGISTRY_v1_0.md`
12. `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — ND.1 consumption matrix names Step 6; §J (Mirror enforcer spec) and §K (multi-agent disagreement protocol) must both absorb it; §N finding coverage must list ND.1 as a non-GA input.

**MAY read:**

- Existing scripts under `platform/scripts/` (e.g., `audit.py`, `verify_corpus.py`, `citation_graph_builder.py`, `invariants_l1.py`) — the design should reuse, not duplicate
- `LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md`
- `MAINTENANCE_SCHEDULE_v1_0.md`

## 3. Deliverable

**File path:** `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`

**Required structure:**

- **§A — Axioms.** Non-negotiable principles the protocol guarantees. Minimum: single-source-of-truth per canonical artifact, every cross-surface reference resolvable and current, no drift undetected for >1 session, every session produces an auditable trace.
- **§B — Scope and non-scope.** What this protocol governs (governance surfaces, registries, scripts, session protocol) and what it does NOT govern (corpus content, phase-specific work).
- **§C — Six axes.** One subsection per axis listed in §1 of this brief. Each subsection specifies:
  - Axis definition
  - Threats this axis guards against (cite GA.N findings)
  - Controls (preventive, detective, corrective)
  - Enforcement mechanism (script, linter, handshake, gate)
- **§D — Artifact registry redesign.** How `FILE_REGISTRY` and `GOVERNANCE_STACK` relate going forward. Decision: merge, keep separate, or replace one. Justify. Specify schema (frontmatter, row format, mandatory fields).
- **§E — Canonical path declaration protocol.** A single authoritative source — probably a new file, `CANONICAL_ARTIFACTS_v1_0.md` — that every other surface imports/cites rather than duplicating. Specify format (YAML block, markdown table, JSON — pick and justify).
- **§F — Session-open handshake.** The machine-readable confirmation a session emits before starting work. Fields: session ID, agent name, step number, mandatory-reading confirmation, canonical-artifact-fingerprint check, declared scope.
- **§G — Session-close checklist.** The machine-readable artifact a session emits before claiming close. Fields: files touched, registry updates made, sync mirror performed, red-team pass done (if due), ledger updated.
- **§H — Drift-detection script spec.** Inputs, outputs, failure modes. Must check at minimum: CLAUDE.md vs .geminirules path-table agreement; CANONICAL_ARTIFACTS vs actual filesystem; MACRO_PLAN ↔ PHASE_B_PLAN phase alignment; STEP_LEDGER internal consistency.
- **§I — Schema validator spec.** Validates frontmatter across all `00_ARCHITECTURE/` and `025_HOLISTIC_SYNTHESIS/` files. Validates MSR/UCN/CDLM/RM/CGM required fields per their own frontmatter templates.
- **§J — Mirror enforcer spec.** Automatic check over the full mirror-pair inventory (per ND.1 — not just CLAUDE.md ↔ `.geminirules` but every Claude-side governance file with a Gemini-side counterpart). For each pair: declare authoritative side, declare parity criterion (semantic, not byte-identical, per ND.1's "adapted parity" claim), declare asymmetry-documentation requirement. Specify detection output: which pair is out-of-sync, which side is stale, which sentence/section differs. Either script-based or git-hook-based — pick and justify. Explicitly cite ND.1.
- **§K — Multi-agent disagreement protocol.** When Claude and Gemini output conflicting conclusions (e.g., two-pass ordering says Gemini proposes, Claude reconciles — what if Claude rejects Gemini's proposal?), which artifact records the disagreement, who arbitrates, how resolution is logged. **Must include mirror-desync as a listed disagreement class** (per ND.1) — when a mirror-pair is detected out-of-sync by `mirror_enforcer`, the protocol treats the staleness as an implicit disagreement requiring resolution, not silent overwriting.
- **§L — Governance meta-rules.** How this protocol itself is revised. Version-bump triggers. Red-team cadence for the protocol.
- **§M — Implementation hand-off.** Exact list of files/scripts Step 7 must produce, with priority order (some may be deferred to Step 12 if trivial).
- **§N — Finding coverage table.** One row per GA.N from the grounding audit, **plus one row per `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 6 (minimum: ND.1)**. Columns: finding/directive ID, severity, axis(es) that cover it, control type (preventive/detective/corrective), implementation artifact. Every CRITICAL and HIGH finding must be covered; every `open` directive must be explicitly covered or explicitly deferred with a listed downstream step.

## 4. Constraints

- Do NOT write code in this step. No `.py`, no `.sh`, no configs.
- Do NOT edit `.geminirules`, `project_state.md`, CLAUDE.md, or any registry. Step 7 implements; this step specifies.
- Do NOT design the Learning Layer (that is Macro Plan's substrate). The Integrity Protocol is different — it's about the project not drifting, not about the instrument learning.
- Do NOT introduce new canonical artifact paths. Document the existing ones.
- Do NOT skip any GA.N finding. If one is genuinely out-of-scope (e.g., GA.12 pure hygiene), say so explicitly in §N.

## 5. Discipline rules

- Closed artifact.
- Spec must be implementable by a fresh conversation reading only §M.
- Every control must cite the threat it guards against by GA.N ID.
- Favor *mechanical enforcement over procedural exhortation*. "Session MUST update X" is weaker than "script fails loudly if X is not updated".

## 6. Close criteria

- [ ] `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` exists
- [ ] All six axes specified with threats→controls→enforcement
- [ ] §N finding coverage table complete (all 32 GA.N findings addressed or scope-excluded)
- [ ] §M hand-off list is implementable
- [ ] **ND.1 (Mirror Discipline) designed.** §J Mirror enforcer spec enumerates the full mirror-pair inventory with per-pair enforcement rules and cites ND.1. §K lists mirror-desync as a disagreement class. §N contains an ND.1 row naming J/K as covering axes and naming Step 7 as the implementation artifact. If not designed, this step does not close.
- [ ] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 6 has an explicit §N row and an implementation artifact named.
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 7 (implementation)
- **File the next step will read:** this protocol spec

## 8. Red-team prompts

- "For each GA.N finding, trace the control that catches it. Are any controls purely procedural ('session MUST...') without mechanical backing?"
- "If a future LLM session decides to ignore the protocol, what catches it? The drift-detection script should run on a clock, not on consent."
- "Is the distinction between Integrity Protocol and Learning Layer crisp enough that a fresh session will not confuse them?"
