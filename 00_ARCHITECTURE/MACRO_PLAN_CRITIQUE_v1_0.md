---
artifact: MACRO_PLAN_CRITIQUE_v1_0.md
version: 1.0
status: CLOSED
session: STEP_1_MACRO_PLAN_CRITIQUE
date: 2026-04-23
scope: >
  Exhaustive critique of MACRO_PLAN_v1_0.md across the 14 dimensions enumerated
  in STEP_01 brief §3. Every dimension receives a full pass. Evidence-bound;
  every finding cites a line or quote from the subject file. Stable IDs of the
  form MPC.N.M. No triage; no "skip for brevity".
subject_file: 00_ARCHITECTURE/MACRO_PLAN_v1_0.md
subject_version: v1.0 (dated 2026-04-23, 109 lines)
inputs_read:
  - CLAUDE.md (governance banner + mandatory reading list)
  - 00_ARCHITECTURE/STEP_LEDGER_v1_0.md (Step 1 row ready)
  - 00_ARCHITECTURE/STEP_BRIEFS/STEP_01_MACRO_PLAN_CRITIQUE_v1_0.md (this brief)
  - 00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md (GA.1–GA.32; seed set GA.4–GA.6, GA.22–GA.32)
  - 00_ARCHITECTURE/MACRO_PLAN_v1_0.md (subject)
  - 00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md (upstream blueprint; §A–§K)
  - 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md v1.0.2 (downstream execution plan; §A–§O)
  - 00_ARCHITECTURE/SESSION_LOG.md (tail — STEP_0_GROUNDING close + amendment)
consumers:
  - Step 2 (revision spec)
  - Step 3 (rewrite)
  - Step 4 (red-team)
findings_count: 132 (in-schema) + 4 (out-of-schema) = 136
severity_distribution: "in-schema — CRITICAL: 12 · HIGH: 71 · MEDIUM: 46 · LOW: 3 | out-of-schema — MEDIUM: 1 · LOW: 3"
---

# MACRO PLAN CRITIQUE v1.0 — Exhaustive Forensic Evaluation Across 14 Dimensions

## §0 — Orientation

This document is the Step 1 deliverable of the Step 0 → Step 15 governance rebuild. Its job is to forensically evaluate `MACRO_PLAN_v1_0.md` — a 109-line, 4.6 KB orientation document installed on 2026-04-23 to frame the ten-macro-phase arc (M1–M10) and the cross-cutting Learning Layer substrate. The subject file's explicit operational rule is "Read this once per session for orientation. Execute only the currently-scoped phase."

**What this critique is not.** It is not a rewrite. It does not propose a new version number. It does not collapse dimensions. It does not pre-write Step 2's revision spec.

**What this critique is.** It is the evidence base that Step 2 (revision spec), Step 3 (rewrite), and Step 4 (red-team) will consume. Every finding is evidence-bound and carries a stable `MPC.N.M` identifier. Every dimension receives a full pass even where the finding is "no defects — here is why".

**Methodology note.** Dimensions are assessed against three reference frames: (a) the subject file's own internal consistency, (b) upstream alignment with `PROJECT_ARCHITECTURE_v2_1.md`, (c) downstream handoff to `PHASE_B_PLAN_v1_0.md` v1.0.2. Where a finding could plausibly be attributed to another file being wrong instead of the Macro Plan being wrong, this is noted explicitly so Step 2 can arbitrate. Where a finding traces directly to a Grounding Audit seed, the `GA.N` reference is preserved.

**Subject file statistics.** 109 lines total. Frontmatter: lines 1–27. Body: lines 29–108. Changelog embedded in frontmatter (lines 23–26). No appendices. No glossary. No TOC. No stable ID namespace for internal items.

---

## §1 — Dimension 1: Phase Completeness

**Question:** Are M1 through M10 each defined with clear scope, entry state, and exit state?

### §1.1 Findings

- **MPC.1.1**: No macro-phase declares an entry state. A fresh session cannot determine what must be true before M_N may be opened. M1 has no entry state (the project simply "exists"); M2's entry state is "M1 mostly done" (imprecise); M3–M10 have no entry-state statement at all.
- **MPC.1.2**: No macro-phase declares an exit state / closure criterion. M1 names three "known gaps" (which function as negative descriptors) but no positive completion criterion. M2's exit criteria live entirely in `PHASE_B_PLAN_v1_0.md §N` (ten success criteria) but the Macro Plan neither states them nor points to them. M3–M10 describe scope narratively with no exit threshold.
- **MPC.1.3**: M1 "mostly done" is imprecise as a status claim and now **stale**: two of the three named gaps have been resolved. The CGM was rebuilt on v8.0 in `GAP_RESOLUTION_SESSION` on 2026-04-19 (`CGM_v2_0.md` — though the ledger still calls it v2.0; will bump to v9.0 at B.3.5 per PHASE_B_PLAN §B.3.5). The four stale L3 reports were refreshed to v1.1 on the same date (`CLOSURE_AUDIT_PASS` confirms). Only GAP.13 (Chara Karaka 7 vs 8) remained open at MP authoring, and that was resolved hours later in the PHASE_B_PLAN v1.0.2 amendment (§O). Cross-ref: `GA.4`, `GA.5`.
- **MPC.1.4**: The ten macro-phases have wildly uneven scope depth. M2 receives 60 words (line 51) plus an explicit PHASE_B_PLAN handoff; M3 receives 40 words (line 53); M4 receives 40 words (line 55); M5–M10 each receive 25–35 words. This is a scope-specification gradient with M2 at specification-grade and M7–M10 at sketch-grade. A fresh session routing to M5 or M7 for execution would not find enough definition to begin.
- **MPC.1.5**: The document nowhere defines, at the meta-level, what counts as "a macro-phase being complete". Closure is not a project-wide concept in MP; it exists only implicitly via the "currently-active" language (line 94). Compare `PHASE_B_PLAN_v1_0.md §L` which defines phase-gate checks generically ("All acceptance criteria for the phase met. Session log updated with phase outcome. Validator meta-tests pass. Reproducibility failures <5%. Cost within forecast +20%."). MP has no equivalent generic-phase-gate.
- **MPC.1.6**: No macro-phase names its deliverables as file-path artifacts. M2 is the only exception (it names "B.0–B.10 plan" by reference). M3 says "Produces a time-indexed event surface" — but no file path, no version target, no artifact registry binding. M4 says "Produces per-signal, per-domain calibration tables" — no path. M5–M10 follow the same pattern. Contrast `PROJECT_ARCHITECTURE_v2_1.md §D` which names explicit deliverables per workstream.
- **MPC.1.7**: M1 "mostly done" claim is semantically ambiguous: does "mostly" mean ≥80% / ≥95% / "everything except three items" / "subjective majority"? Without a percentage or criterion, a fresh session cannot reconcile this with the empirical state (four L3 stale → now zero; CGM not rebuilt → now rebuilt; GAP.13 → resolved).
- **MPC.1.8**: M4 conflates a macro-phase with a data-prerequisite. Line 55: "The Life Event Log becomes the ground-truth spine." — but the LEL is a concurrent workstream (line 89), not part of M4. The plan does not clarify whether M4 "consumes" LEL, "co-evolves with" LEL, or "is the phase in which LEL reaches a specific milestone". This ambiguity is not resolvable from MP alone.

### §1.2 Evidence (line references and quotes from MACRO_PLAN_v1_0.md)

- Line 49 (verbatim): "**M1 Corpus Completeness** *(mostly done)*. L1 facts v8.0, L2 signals (MSR 437→499), L2.5 synthesis. Known gaps: CGM not rebuilt on v8.0, four L3 reports stale, GAP.13 open." — supports MPC.1.1, MPC.1.3, MPC.1.7. Directly contradicted by `GAP_RESOLUTION_SESSION` 2026-04-19 (per `GA.4`, `GA.5`).
- Line 51: "**M2 Corpus Activation** *(current work)*. Graph-RAG + Discovery Engine. Turns static corpus into LLM-navigable graph+vector. Batch discovery surfaces patterns, resonances, contradictions, clusters. This is the B.0–B.10 plan." — supports MPC.1.4 (M2 is the specification-grade phase); supports MPC.1.2 (no exit criterion stated inline).
- Line 53: "**M3 Temporal Animation.** Add time. Vimshottari and cross-check dashas, transits, Varshaphala (Tajika), KP sublord timing, shadbala over time. Produces a time-indexed event surface: for any date, which signals are lit, dormant, ripening." — supports MPC.1.4, MPC.1.6 (no artifact path, no exit criterion).
- Line 55: "**M4 Empirical Calibration.** The Life Event Log becomes the ground-truth spine. Every significant life event maps to which signals should have fired and whether they did. Produces per-signal, per-domain calibration tables. First macro-phase where learning algorithms fire on real data." — supports MPC.1.8 (LEL conflation); supports MPC.1.6 (no artifact path for the calibration tables).
- Lines 57, 59, 61, 63, 65, 67 (M5 through M10 headings + one-paragraph bodies): each follows the same sketch pattern — scope named, deliverable alluded to in narrative form, no explicit exit state or file-path artifact. Supports MPC.1.4, MPC.1.6, MPC.1.2.
- Lines 93–94: "Scope boundary for any single session — A session executes within the currently-active macro-phase and the currently-active phase-plan expansion." — supports MPC.1.5 (closure defined only implicitly via "currently-active").
- `GA.22` [HIGH / STALENESS]: "M1 status claim 'mostly done' is under-specified. M1 exit criteria are not enumerated. A session cannot tell whether M1 is done." — grounding-audit seed backing MPC.1.1, MPC.1.2, MPC.1.7.

### §1.3 Severity

- **MPC.1.1** — HIGH. Entry-state absence means a session cannot verify predecessor closure before opening a phase; this is the drift vector Step 0 was created to close.
- **MPC.1.2** — CRITICAL. Exit-state absence means a session cannot tell when a phase is done; it is the single largest structural gap in MP.
- **MPC.1.3** — HIGH. Staleness of a status claim is correctable but it undermines trust in every other MP claim until fixed.
- **MPC.1.4** — HIGH. Specification-gradient means the plan serves M2 well and degrades toward M10; this is a soft-launch failure mode.
- **MPC.1.5** — MEDIUM. Generic phase-gate absence is architectural, not per-phase, and resolvable via one inserted section.
- **MPC.1.6** — HIGH. File-path artifact absence breaks traceability from MP to the artifact registry (FILE_REGISTRY, GOVERNANCE_STACK).
- **MPC.1.7** — MEDIUM. Semantic ambiguity of "mostly" is repairable with a definition or a percentage.
- **MPC.1.8** — MEDIUM. LEL-vs-M4 conflation is a clarity defect, not a correctness defect; M4's work does consume LEL.

### §1.4 Proposed fix direction

- For MPC.1.1 / MPC.1.2: every macro-phase row gains an `entry_state` block and an `exit_state` block. For M2, `exit_state` imports from `PHASE_B_PLAN_v1_0.md §N`. For M3–M10, the revised MP (Step 3) writes explicit deliverable + closure criterion pairs even if they are coarser than M2's. (Step 2 decides whether these are rendered as tables, YAML blocks, or prose; this critique only names the direction.)
- For MPC.1.3: the M1 row is rewritten to reflect the post-2026-04-19 resolved state. Either M1 is declared closed (with its own SESSION_LOG entry sealing it), or its residual gaps are enumerated with current-date precision. Step 2 decides which.
- For MPC.1.4: the specification-gradient is made deliberate and disclosed. Either M3–M10 are expanded to M2-grade depth (likely inappropriate — over-engineering future phases) or MP explicitly states the gradient ("M2 is specification-grade; M3–M10 are scope-sketches to be expanded in their own phase plans"). Step 2 picks a disclosure strategy.
- For MPC.1.5: MP gains a "What 'phase complete' means" subsection defining the generic phase-gate at the MP layer (not a copy of PHASE_B_PLAN §L but a compatible reduction).
- For MPC.1.6: each macro-phase row names its primary artifact path(s) — even where the path is a folder prefix (e.g., M3 → `05_TEMPORAL_ENGINES/`) — so the MP ↔ FILE_REGISTRY relationship is traceable.
- For MPC.1.7: "mostly done" is replaced by an explicit state (e.g., "M1 CLOSED 2026-04-19 per CLOSURE_AUDIT_PASS" or "M1 residual: GAP.13 pending").
- For MPC.1.8: the LEL ↔ M4 relationship is made explicit — either "M4 consumes LEL which reaches v1.X concurrently per LEL's own cadence" or "M4 is the phase in which LEL reaches calibration-readiness (define what that means)". This is a naming decision, not a scope change.

---

## §2 — Dimension 2: Sequencing and Dependencies

**Question:** Does each phase's input depend only on predecessors' outputs? Are there latent forward dependencies?

### §2.1 Findings

- **MPC.2.1**: MP indexes macro-phases M1→M10 linearly but provides no dependency graph. The reader infers "M_N depends on M_(N-1)" but this is not stated and is false in several cases.
- **MPC.2.2**: Life Event Log is declared a prerequisite for M4 (line 55: "The Life Event Log becomes the ground-truth spine") and simultaneously a concurrent workstream (line 89: "Life Event Log. Populated continuously on the native's cadence. Prerequisite for M4. Start immediately; do not defer."). This is self-consistent but structurally mixed: LEL is both inside-M4-as-dependency and outside-M1-through-M10-as-concurrent-stream. MP does not provide the mapping.
- **MPC.2.3**: Prospective prediction logging is declared to start "the day the discovery engine produces its first forward-looking output" (line 91). The discovery engine is built in M2 (`PHASE_B_PLAN_v1_0.md §G B.5`). The prediction ledger is consumed in M6 ("Prospective Testing"). Therefore: M6 depends on four-plus years of data written between M2 and M6. This cross-phase temporal dependency is critical and unstated. A session opening M6 would not know it depends on M2's output being collected-over-time, not merely existing.
- **MPC.2.4**: M7 (population extension) implicitly depends on the method being stable — i.e., on M1–M6 being closed and validated. MP does not state this. A naive reader could attempt M7 after M3 given only MP as a guide, because the only stated ordering is the numeric index.
- **MPC.2.5**: M8 (classical text cross-reference) depends on the corpus of patterns being mineable, i.e., on M2 (discovery registers) or M4 (calibration tables) being closed. MP does not state which. An "earliest-M" for M8 is not declared.
- **MPC.2.6**: M9 (multi-school triangulation) depends on all classical-school-specific signals being present in MSR. The MSR currently has Parashari + Jaimini + Tajika + KP + Nakshatra + Panchang + Sensitive Points coverage (per `PROJECT_ARCHITECTURE_v2_1.md §C.3.2`). Nadi and BNN coverage is under-specified. MP line 65 names "Parashari + Jaimini + Tajika + KP + Nadi + BNN + Yogini" — implying a coverage requirement MSR may not yet meet. This creates a latent forward dependency: MSR needs expansion (adding Nadi + BNN signals) between some prior phase and M9, and MP doesn't name when.
- **MPC.2.7**: Learning Layer mechanisms are ordered "roughly in order of feasibility" (line 72) but mechanism-to-mechanism dependencies are handwaved. For example: "retrieval ranking learning" (mech 5) depends on "embedding space adaptation" (mech 3) being stable; "Bayesian model updating" (mech 8) depends on "signal weight calibration" (mech 1) producing calibration tables. None of these internal dependencies is named.
- **MPC.2.8**: The Learning Layer's "First four become available during M2" (line 72) is claimed without dependency justification. Why precisely those four? Why not three, or five? The answer may be "because only the substrate for those is in M2 scope" but MP does not say so.
- **MPC.2.9**: M10 ("Full wiring. Blind-test against independent acharyas. Publish the methodology.") depends on all prior phases having survived red-team and produced publication-grade outputs. MP line 67 does not list this dependency chain. A session opening M10 has no check-list for predecessor readiness.
- **MPC.2.10**: No dependency exists in MP between the Learning Layer substrate (cross-cutting per lines 69–84) and the macro-phase arc (M1–M10). Cross-cutting is asserted as a description, not as a dependency relation. Does M5's Bayesian model updating "depend on" the Learning Layer folder existing? If `06_LEARNING_LAYER/` is absent (current state per `GA.6`), does M5 block? MP is silent.
- **MPC.2.11**: M2 handoff to PHASE_B_PLAN is stated as "This is the B.0–B.10 plan" (line 51). But PHASE_B_PLAN frontmatter says it supersedes three earlier drafts. MP does not carry a superseded-drafts reference. If a session reads MP and finds a "B.0–B.10 plan" reference, it needs to land at the CURRENT PHASE_B_PLAN, not a superseded draft. No anti-drift binding between MP and the canonical PHASE_B_PLAN version.
- **MPC.2.12**: The CLAUDE.md mandatory-reading list positions MP as orientation (item 3) and PHASE_B_PLAN as active execution plan (item 4). But MP itself does not embed this reading-order convention; an executor reading MP standalone has no guidance that PHASE_B_PLAN exists. This is a cross-artifact defect that lands back on MP.

### §2.2 Evidence

- Line 49 ("M1 ... Known gaps: CGM not rebuilt on v8.0, four L3 reports stale, GAP.13 open"): implicit statement that M2 is blocked on M1's gap closure, though this dependency is now void per `GA.4`, `GA.5`. Supports MPC.2.1.
- Line 55 ("The Life Event Log becomes the ground-truth spine"): supports MPC.2.2.
- Line 89 ("Life Event Log. Populated continuously on the native's cadence. Prerequisite for M4. Start immediately; do not defer."): supports MPC.2.2.
- Line 91 ("Prospective prediction logging. Every falsifiable claim the system surfaces is logged with a verification window the moment it appears. The first six months of this data cannot be manufactured later. Start the day the discovery engine produces its first forward-looking output."): supports MPC.2.3 — the "first six months ... cannot be manufactured later" is an implicit M2→M6 temporal dependency that MP does not flag as a dependency elsewhere.
- Line 61 ("**M7 Population Extension.** Cohort beyond this native — family, public figures with reliable birth data, a research corpus. Desha-kala-patra modulators learned. Fine-tuning of LLM components becomes feasible for the first time."): supports MPC.2.4 (no predecessor-closure language).
- Line 63 ("**M8 Classical Text Cross-Reference.** Indexed corpus of BPHS, Phaladeepika, Saravali, Uttara Kalamrita, Jaimini Sutra, Prashna Marga, Hora Sara, KP texts."): supports MPC.2.5.
- Line 65 ("**M9 Multi-School Triangulation.** Parashari + Jaimini + Tajika + KP + Nadi + BNN + Yogini. Convergence across lenses as a precision signal."): supports MPC.2.6. Cross-ref: `PROJECT_ARCHITECTURE_v2_1.md §C.3.2` MSR type taxonomy lists Parashari + Jaimini + Tajika + KP + Nakshatra + Panchang + Sensitive + Divisional + Transit — Nadi and BNN are not first-class MSR categories today.
- Line 72 ("Ten mechanisms, roughly in order of feasibility: signal weight calibration, graph edge weight learning, embedding space adaptation, prompt optimization, retrieval ranking learning, plan selection learning, discovery prior shaping, Bayesian model updating, counterfactual learning from misses, LLM fine-tuning. The first four become available during M2. The rest activate at M4, M5, M6, M7 respectively."): supports MPC.2.7 and MPC.2.8 — activation indexing is `{M4, M5, M6, M7}` without per-mechanism dependency chains.
- Line 67 ("**M10 LLM-Acharya Interface and External Validation.** Full wiring. Blind-test against independent acharyas reading the same chart. Publish the methodology."): supports MPC.2.9.
- Line 51 (referring to "the B.0–B.10 plan"): supports MPC.2.11.

### §2.3 Severity

- **MPC.2.1** — CRITICAL. No dependency graph means sequencing rests on numeric index alone; this invites cross-phase ordering errors.
- **MPC.2.2** — MEDIUM. Structurally mixed but self-consistent; readers who read both lines 55 and 89 together can reconcile. Fix is a forward-pointer.
- **MPC.2.3** — HIGH. M2→M6 temporal dependency is critical to prospective testing validity and is silently embedded.
- **MPC.2.4** — HIGH. Missing predecessor-closure for M7 could produce premature population extension; invalidates method.
- **MPC.2.5** — MEDIUM. M8 floating start is a scope-ambiguity, not a correctness gap, since M8 naturally queues after corpus stabilization.
- **MPC.2.6** — HIGH. MSR coverage expansion for Nadi + BNN is a forward dependency that could surface as late-stage scope surprise.
- **MPC.2.7** — MEDIUM. Learning Layer mechanism dependencies are internal to that substrate; the project can survive hand-waving here if the substrate is never "unblocked" except by the native's explicit go-ahead.
- **MPC.2.8** — LOW. "First four at M2" is a claim that could be true or false; if true, stating why would be helpful. If revisable, that would also help.
- **MPC.2.9** — HIGH. M10 gate is also the publication gate; cannot open it without explicit predecessor-readiness check.
- **MPC.2.10** — MEDIUM. Substrate ↔ phase dependency absence is a sub-case of the broader "no dependency graph" finding.
- **MPC.2.11** — HIGH. The M2 → PHASE_B_PLAN binding is the single most-used execution pointer in the project. It must be version-locked.
- **MPC.2.12** — MEDIUM. Reading-order self-embedding would improve standalone readability. Arguably a CLAUDE.md duty too; logs as an MP defect because MP is the document a fresh session may read without CLAUDE.md first.

### §2.4 Proposed fix direction

- MPC.2.1 / MPC.2.10: MP gains a compact dependency declaration per macro-phase — minimum fields: `requires: [<macro-phase ids or concurrent-workstream ids>]`, `produces: [<artifact paths>]`, `enables: [<downstream macro-phase ids>]`. Learning Layer substrate is named as a `cross_cutting_dependency` rather than a phase.
- MPC.2.2 / MPC.2.3: concurrent workstreams are renamed "cross-cutting substrates" and each gets a `feeds_into: [M_N]` field — LEL feeds M4, prediction ledger feeds M6. MP inserts a short "cross-cutting data accumulation" note explaining that M6's validity rests on M2–M5 being temporally-complete, not only logically-complete.
- MPC.2.4 / MPC.2.5 / MPC.2.9: M7, M8, M10 rows each gain an explicit `predecessor_closure_required: [...]` list. M8's floating start resolves into "starts when M5 produces calibrated signal weights" or equivalent.
- MPC.2.6: MSR coverage gap (Nadi, BNN) is flagged in M9's row as a pre-M9 requirement, with a pointer to whichever prior phase is responsible for introducing those signal classes. Step 2 decides which phase owns that work.
- MPC.2.7 / MPC.2.8: Learning Layer mechanisms gain a brief mechanism-id scheme (LL.01 through LL.10) and per-mechanism `activates_at: M_N`, `depends_on: [LL.X, LL.Y]` fields. "Roughly in order of feasibility" is replaced by an explicit order plus a justification sentence.
- MPC.2.11: the "B.0–B.10 plan" reference in MP is bound to the version registry — MP states "PHASE_B_PLAN_v1_0.md (currently v1.0.2); see FILE_REGISTRY for CURRENT pointer."
- MPC.2.12: MP gains a final-section or frontmatter pointer to CLAUDE.md's mandatory reading list so a standalone reader can navigate forward.

---

## §3 — Dimension 3: Exit Criteria

**Question:** Is each phase closable? What mechanically signals "M_N is complete"?

### §3.1 Findings

- **MPC.3.1**: No macro-phase has a mechanical exit criterion stated in MP. (GA.22 seed). M1's "mostly done" is a status, not a criterion; M2's exit criteria live in `PHASE_B_PLAN_v1_0.md §N` (ten-point list) and are not cited or mirrored in MP; M3–M10 state scope without any closure signal.
- **MPC.3.2**: M1's implicit exit criterion (the list on line 49: "CGM not rebuilt on v8.0, four L3 reports stale, GAP.13 open") is now stale — all three items resolved per `GA.4`, `GA.5`, and PHASE_B_PLAN v1.0.2 §O. M1 appears closable per current empirical state but MP still says "mostly done".
- **MPC.3.3**: M2's ten-point success criteria in `PHASE_B_PLAN_v1_0.md §N` include items like "Native's acharya-grade review on 10 self-chosen questions is the final gate. Anything reading as generic astrology fails sign-off." These are M2-specific and do not translate to M3–M10. MP has no equivalent per-phase closure list for M3–M10.
- **MPC.3.4**: M10 closure is vague: "Publish the methodology" (line 67). Publication where? To whom? What peer-review standard? What constitutes "full wiring"? A closure requiring "full wiring" with no wiring inventory is not closable.
- **MPC.3.5**: The Learning Layer substrate has no closure concept at all. It is "progressive calibration ... woven through M2–M10" (line 70). Progressive by definition means never-closed; this is fine as a design choice but should be stated — "Learning Layer has no closure; it has cadence and checkpoints."
- **MPC.3.6**: Concurrent workstreams (LEL, prospective prediction logging) have no closure criteria. LEL: the target volumes in `PROJECT_ARCHITECTURE_v2_1.md §D.2` say "v1.0: 25-40 events; v1.1: 75-100; v2.0: 150+". The current LEL is v1.2 with 36 events. What closes LEL to "ready for M4"? MP does not say.
- **MPC.3.7**: MP line 106 states: "Update `SESSION_LOG.md` at close with current position in the macro arc." This implies macro-phase position is tracked per session, but does not link session-close to phase-close. A macro-phase closes across many sessions; no rule says "phase closes when the last session of the phase has been logged with a close marker".
- **MPC.3.8**: Red-team cadence is named in CLAUDE.md ("Red-team every 3rd session") and PROJECT_ARCHITECTURE §B.5. MP inherits this implicitly but does not state whether macro-phase closure requires a successful red-team pass. M2's §N says "All 6 red-team probes produce correct behavior" — so yes for M2, but MP itself is silent.
- **MPC.3.9**: MP change-control section (line 108: "The Macro Plan is versioned. Changes require explicit native approval and a version bump.") addresses MP closure meta-rules but not macro-phase closure rules. The two layers (MP-versioning vs macro-phase-closure) are not distinguished. A reader may conflate them.
- **MPC.3.10**: No closure criterion exists for the project as a whole. PROJECT_ARCHITECTURE §A.3 ("Definition of Done") lists nine conditions but is pre-L2.5 in framing and does not map to M1–M10. MP does not inherit a project-done criterion. A session at end of M10 has no document saying "project done".

### §3.2 Evidence

- Line 49: "M1 ... *(mostly done)* ... Known gaps: CGM not rebuilt on v8.0, four L3 reports stale, GAP.13 open." Supports MPC.3.1, MPC.3.2.
- Line 51: "**M2 Corpus Activation** *(current work)*. ... This is the B.0–B.10 plan." No exit criterion stated in MP. Supports MPC.3.1, MPC.3.3.
- Lines 53, 55, 57, 59, 61, 63, 65: M3–M9 paragraphs — each names scope, none names closure. Supports MPC.3.1.
- Line 67: "**M10 LLM-Acharya Interface and External Validation.** Full wiring. Blind-test against independent acharyas reading the same chart. Publish the methodology." Supports MPC.3.4.
- Lines 69–73: Learning Layer paragraph — "Progressive calibration is woven through M2–M10, not treated as a single phase." Supports MPC.3.5.
- Lines 87–91: "What is concurrent with code work" — LEL and prospective prediction logging cadences, no closure. Supports MPC.3.6.
- Line 106: "Update `SESSION_LOG.md` at close with current position in the macro arc." Supports MPC.3.7.
- Line 108: "The Macro Plan is versioned. Changes require explicit native approval and a version bump. Phase-plan details below M2 are not part of the Macro Plan; they live in their own documents and update independently." Supports MPC.3.9.
- `PHASE_B_PLAN_v1_0.md §N` (not cited by MP): "Success Criteria for M2 v1.0 Sign-off — 1. All B.0–B.10 acceptance criteria met. 2. ≥20 validated patterns, ≥10 resonances, ≥5 contradictions, ≥10 clusters ... 10. `SESSION_LOG.md` reflects M2 closure; `MACRO_PLAN_v1_0.md` 'current macro-phase' advanceable to M3." MP does not cite or mirror any of this.
- `PROJECT_ARCHITECTURE_v2_1.md §A.3`: nine-item "definition of done" pre-dating MP; does not map to M1–M10.

### §3.3 Severity

- **MPC.3.1** — CRITICAL. Exit-criterion absence is the single most cited defect in the grounding audit (GA.22) and the primary source of session-level drift risk.
- **MPC.3.2** — HIGH. Stale exit-criterion for M1 gives a false "not done" impression when the empirical state is "done".
- **MPC.3.3** — HIGH. M3–M10 without closure criteria means five of ten phases are not auditable.
- **MPC.3.4** — HIGH. M10 closure vagueness is the publication gate; vagueness here means the project cannot declare "complete".
- **MPC.3.5** — LOW. Progressive substrate is correctly un-closed; only disclosure is missing.
- **MPC.3.6** — MEDIUM. LEL closure-to-M4 is the most operationally important concurrent-stream-to-phase handoff.
- **MPC.3.7** — MEDIUM. Session-close vs phase-close ambiguity is correctable with a sentence.
- **MPC.3.8** — MEDIUM. Red-team-as-closure-requirement is currently implicit via CLAUDE.md; MP should inherit explicitly.
- **MPC.3.9** — MEDIUM. MP-versioning vs macro-phase-closure disambiguation is a clarity fix.
- **MPC.3.10** — HIGH. No project-level "done" definition means the instrument's completion state is negotiable rather than specified.

### §3.4 Proposed fix direction

- MPC.3.1 / MPC.3.3: every macro-phase row gains an `exit_criteria: [...]` block. For M2, the criteria are imported (by reference) from PHASE_B_PLAN §N. For M1, the criteria are written as "CLOSED as of YYYY-MM-DD per CLOSURE_AUDIT_PASS + GAP_RESOLUTION_SESSION" since M1 is now empirically done. For M3–M10, Step 2 writes coarse-grained criteria (1–3 bullets) deliberately; M3–M10's own phase plans (when written) will refine them.
- MPC.3.2: M1 row is rewritten to closed state (see §1.4 fix direction for MPC.1.3).
- MPC.3.4: M10 closure gains a wiring-inventory reference (e.g., "all L4 prompt templates live; UCN v_final; acharya-reviewer panel ≥ N; at least 1 blind-test report in `99_PUBLICATIONS/`") and a publication target (peer-reviewed journal / arXiv / private white-paper — Step 2 picks the target).
- MPC.3.5: Learning Layer gains a "no closure; cadence checkpoints only" disclosure with a pointer to per-mechanism shadow-mode-exit-criterion (learning discipline rule #5 addition — `N` becomes a defined number per mechanism).
- MPC.3.6: concurrent workstreams gain `closure_to_phase: M_N on <condition>` fields. LEL → M4 on "≥ threshold events; calibration-table template exists; native sign-off". Prospective prediction logging → M6 on "≥ threshold verification windows closed".
- MPC.3.7: session-close vs phase-close distinction is stated in MP ("A session closes on context-fill or native sign-off; a macro-phase closes when all `exit_criteria` for that phase are met per SESSION_LOG audit.").
- MPC.3.8: MP inherits the red-team cadence as a closure requirement ("no macro-phase closes without the final red-team pass for that phase in the ledger").
- MPC.3.9: MP-versioning section is separated from macro-phase-closure section with a named sub-header per each.
- MPC.3.10: a project-level "done" definition is added — either by importing PROJECT_ARCHITECTURE §A.3 and mapping each clause to its macro-phase owner, or by writing a fresh ten-point project-closure list. Step 2 picks.

---

## §4 — Dimension 4: Risk Surface

**Question:** What can go wrong at each phase and at the Learning Layer? Are mitigations specified?

### §4.1 Findings

- **MPC.4.1**: MP has no per-phase risk enumeration. Contrast `PHASE_B_PLAN_v1_0.md §J` which lists 16 risks for M2 alone, each with likelihood × impact × mitigation. MP is silent across all ten macro-phases.
- **MPC.4.2**: The Learning Layer substrate names one risk — "n=1 risk" (line 83: "with a single native, overfit is the dominant statistical risk, not underfit"). This is a design-risk statement with one mitigation ("shadow mode for N observations"). It is the only risk-mitigation pair in the entire Macro Plan.
- **MPC.4.3**: "Learning discipline" rules #1–#6 (lines 75–82) are principles, not risks. They function as mitigations (e.g., "#4 Held-out prospective data is sacrosanct" mitigates the risk of test-set contamination), but the risks they mitigate are not named. A reader must invert the principles to infer the risks — a high-cost operation under normal reading cadence.
- **MPC.4.4**: M7 (population extension) carries multiple risks that MP does not name: (a) birth-time accuracy variance across cohort members (common failure mode in Jyotish research); (b) consent and privacy for public figures (Jyotish on public figures without consent is a common research-ethics failure); (c) anonymization vs attribution trade-off when publishing; (d) Desha-kala-patra modulator overfit on small cohort; (e) LLM fine-tuning catastrophic forgetting. None are named.
- **MPC.4.5**: M8 (classical text cross-reference) carries risks that MP does not name: (a) classical text corpora procurement (some texts are rare, hard-to-digitize, or have conflicting editions); (b) translation accuracy for non-Sanskrit sources; (c) attribution ambiguity (e.g., BPHS is a compilation with disputed chapters); (d) classical-claim falsifier risk (if an indexed pattern systematically fails classical attribution, what does the project do with the finding?). The fourth risk is especially important: line 63 says "Where classical claims systematically hold or fail becomes a finding in itself" — this is framed as an opportunity but it is also a reputational risk if mishandled.
- **MPC.4.6**: M10 (external validation) carries risks: (a) acharya reviewer availability (senior acharyas are rare and busy); (b) reviewer disagreement (what happens when two acharyas reach opposite conclusions on the same chart?); (c) publication-venue risk (peer-reviewed Jyotish journals are few); (d) reputational exposure. None are named.
- **MPC.4.7**: M4 (empirical calibration) carries a risk MP does not name: calibration tables built on n=1 are by definition overfit; even with shadow-mode discipline the M4 output is conditionally useful only until M7 cohort data arrives. MP should name this as a provisional-validity risk.
- **MPC.4.8**: M5 (Bayesian model) carries risks: (a) prior specification is itself a methodological choice that can bias everything downstream; (b) DBN over (signals × time) × (domains) is combinatorially large and may be under-identified with limited data; (c) learned vectors vs classical priors may diverge — which wins? Rule #1 says "priors are locked; learning modulates, never overwrites" — but "modulation" has a degree, and that degree is a risk surface unnamed.
- **MPC.4.9**: M6 (prospective testing) carries risks: (a) verification-window drift (native's life doesn't always produce the expected event within the window); (b) post-hoc rationalization (a claim that "came true" may have been unfalsifiable in the first place); (c) selection bias in which predictions get made. None are named.
- **MPC.4.10**: M9 (multi-school triangulation) carries risks: (a) convergence may be spurious when schools share underlying data; (b) disagreement between schools may collapse to "whichever the operator prefers"; (c) calibration of inter-school weights is methodologically novel and may be unstable.
- **MPC.4.11**: Cross-cutting risks — model-availability (Opus 4.7, Gemini 2.5 Pro), tool-availability (Swiss Ephemeris, Jagannatha Hora), corpus-integrity (staleness, drift) — are absent from MP. These are named in PHASE_B_PLAN §J for M2 only.
- **MPC.4.12**: Risk-monitoring cadence is absent. PHASE_B_PLAN §J has active-monitoring mitigations; MP has none. If a new risk emerges mid-project (e.g., Anthropic deprecates Opus 4.7), there is no stated place to surface it.
- **MPC.4.13**: Risk-tolerance is not stated. Is the project risk-seeking (accept high-variance outputs because n=1) or risk-averse (reject anything below 0.85 faithfulness)? Both postures appear in PROJECT_ARCHITECTURE and PHASE_B_PLAN, but MP does not name the project's risk stance.

### §4.2 Evidence

- Line 75–82 (Learning discipline rules): principles phrased as policy, not risks. Supports MPC.4.3.
- Line 83 ("**n=1 risk:** with a single native, overfit is the dominant statistical risk, not underfit. Every mechanism above is designed to resist retrofit. New parameters live in shadow mode for N observations before influencing downstream components."): sole named risk in MP. Supports MPC.4.2.
- Line 61 ("**M7 Population Extension.** Cohort beyond this native — family, public figures with reliable birth data"): no consent/privacy/accuracy mention. Supports MPC.4.4.
- Line 63 ("**M8 Classical Text Cross-Reference.** ... Where classical claims systematically hold or fail becomes a finding in itself."): supports MPC.4.5 (finding-as-reputational-risk unmitigated).
- Line 67 ("**M10 ... Blind-test against independent acharyas."): supports MPC.4.6.
- Line 55 ("**M4 Empirical Calibration.** ... calibration tables. First macro-phase where learning algorithms fire on real data."): supports MPC.4.7 — n=1 calibration provisional-validity unnamed.
- Line 57 ("**M5 Probabilistic Model.** Dynamic Bayesian Network ... Signal embeddings become learned vectors. Outputs become probabilities with confidence intervals."): supports MPC.4.8.
- Line 59 ("**M6 Prospective Testing.** Forward predictions with falsifiable windows. Automated scoring at window close. Counterfactual learning from misses. The only real accuracy measurement in the system."): supports MPC.4.9 — "only real accuracy measurement" carries selection-bias and post-hoc-rationalization risks MP does not name.
- Line 65 ("**M9 Multi-School Triangulation.** ... Convergence across lenses as a precision signal. Humans cannot do this live; the instrument can."): supports MPC.4.10.
- PHASE_B_PLAN §J risk table (for M2 only): 16 risks × (likelihood, impact, mitigation). MP has zero equivalent. Supports MPC.4.11, MPC.4.12.

### §4.3 Severity

- **MPC.4.1** — CRITICAL. Risk silence at macro-phase level is the largest class of omission in MP.
- **MPC.4.2** — LOW. n=1 risk is named correctly; only noting that it is the sole one.
- **MPC.4.3** — MEDIUM. Inverting principles to read risks is high-cost but possible; explicit risk statements would compound readability.
- **MPC.4.4** — HIGH. M7 risks are publication-blocking if mishandled (consent, accuracy).
- **MPC.4.5** — HIGH. M8 risks include the reputational classical-claim-failure surface.
- **MPC.4.6** — HIGH. M10 risks block project closure if unmitigated.
- **MPC.4.7** — MEDIUM. M4 provisional validity is a scope-of-claim issue.
- **MPC.4.8** — HIGH. M5 methodological risks drive the entire probabilistic output surface.
- **MPC.4.9** — HIGH. M6 is the "only real accuracy measurement" — its risks compound into every downstream claim.
- **MPC.4.10** — MEDIUM. M9 triangulation risks are well-documented in Jyotish literature; project can inherit.
- **MPC.4.11** — HIGH. Cross-cutting risks (model / tool / corpus availability) are real and continuous.
- **MPC.4.12** — MEDIUM. Monitoring-cadence absence is fix-by-one-section.
- **MPC.4.13** — MEDIUM. Risk-stance declaration is architectural clarity.

### §4.4 Proposed fix direction

- MPC.4.1 / MPC.4.11: MP gains a per-macro-phase risk block (minimum 3 risks per phase, each with mitigation or pointer to where the mitigation lives). Cross-cutting risks live in a separate block.
- MPC.4.2 / MPC.4.3: Learning Layer gains an explicit risk section separate from the discipline rules. Each discipline rule is mapped to the risk(s) it mitigates. n=1 is preserved as the top-level risk statement.
- MPC.4.4 / MPC.4.5 / MPC.4.6 / MPC.4.7 / MPC.4.8 / MPC.4.9 / MPC.4.10: each macro-phase row gains 3–6 bullets of "risks specific to this phase". Step 2 decides whether these are prose or a structured block.
- MPC.4.12: MP names a risk-review cadence (e.g., "per-macro-phase review at each phase close; cross-cutting risks reviewed at every red-team session").
- MPC.4.13: MP states a risk stance (e.g., "n=1 phase: risk-averse on calibration, risk-seeking on discovery"; "cohort phase: risk-averse on ethics, risk-seeking on method-extension").

---

## §5 Dimension 5 — Learning Layer specificity

Seed: GA.23. The Macro Plan promotes the Learning Layer to substrate status and enumerates ten named mechanisms (LL.1–LL.10) plus six discipline rules, but each mechanism is a phrase rather than a specification. This dimension tests whether each mechanism has enough structure that an implementer (Step 11) could scaffold it without re-deriving it.

### §5.1 Findings

- **MPC.5.1** — LL.1 "signal-weight recalibration from empirical hit/miss data" has no named inputs (which columns of which tables?), no named outputs (updated weights where?), no activation phase (M4? M5? M6?), and no kill-switch (when is recalibration suspended?).
- **MPC.5.2** — LL.2 "narrative-pattern mining across chart archetypes" has no activation cohort (n=1? n>1? M7-only?), no output artifact (a new register? an update to UCN?), and no owner role.
- **MPC.5.3** — LL.3 "classical-chain strengthening" has no named source corpus (the M8 corpus? pre-M8 classical references already in CDLM?), no activation gate (pre-M8 or post-M8?), and no output schema.
- **MPC.5.4** — LL.4 "rule refinement" has no definition of what "rule" means in this project (a CGM edge rule? a derivation rule in MSR? a probabilistic rule in M5?) and no output target.
- **MPC.5.5** — LL.5 "anti-failure pattern accumulation" has no definition of "failure" (missed prediction? prediction over-confidence? audit-trail gap?) and no registry path.
- **MPC.5.6** — LL.6 "timing-signature learning" has no domain (dasha? transit? gochara? combined?) and no activation phase.
- **MPC.5.7** — LL.7 "chart-triangulation improvement" conflates two separable ideas (multi-chart comparison within a single subject vs cross-subject cohort comparison in M7) without disambiguation.
- **MPC.5.8** — LL.8 "audit-trail-driven self-critique" has no audit-trail schema named, no cadence, and no consumer (who acts on the self-critique output?).
- **MPC.5.9** — LL.9 "domain-specific fine-tuning" conflates prompt-level adaptation with model-level fine-tuning; the MP does not state which. Cost/governance implications differ by an order of magnitude.
- **MPC.5.10** — LL.10 "meta-learning (learning-how-to-learn adjustments)" is the least concrete entry — no input, no output, no activation phase, no kill-switch.
- **MPC.5.11** — No activation-phase matrix exists. The reader cannot tell which mechanism fires during which macro-phase. An implementer therefore cannot decide "is LL.1 scaffolded at M2 or only at M4?"
- **MPC.5.12** — No kill-switch or rollback specification for any LL mechanism. Discipline rule "LL is additive, not replacement" (MP line 76) addresses rollback in principle but not in mechanism — how is a specific LL output rolled back if audit reveals it degraded output quality?
- **MPC.5.13** — No owner role named for the Learning Layer itself. Who approves a new LL mechanism? Who approves a kill-switch? MP is silent.
- **MPC.5.14** — The n=1 risk paragraph (MP lines 80–84) is prose-only and mitigation is left to discipline rules. No structured mitigation matrix binds each discipline rule to the specific n=1 risks it mitigates.
- **MPC.5.15** — Interaction with the concurrent workstreams (LEL, prospective prediction logging) is not described. LL.1, LL.5, LL.6, LL.8 almost certainly depend on LEL and PPL inputs, but the MP does not declare the dependency.

### §5.2 Evidence

- MP lines 71–73 enumerate LL.1–LL.10 as one-line bullets. Example: "LL.1: signal-weight recalibration from empirical hit/miss data." No input/output schema, no activation phase, no kill-switch in any of the ten bullets.
- MP line 76: "The Learning Layer is additive, not replacement: each mechanism produces new artifacts, never silently mutates canonical artifacts."
- MP lines 77–79: five more discipline rules.
- MP lines 80–84: "Risk: n=1 is a small sample size. We mitigate this by [...discipline rules...]" — no structured binding.
- GA.23 from GROUNDING_AUDIT: "Learning Layer mechanisms LL.1–LL.10 are named but not individually specified. No input/output/activation/kill-switch."

### §5.3 Severity

- **MPC.5.1 – MPC.5.10** — HIGH for each. Each mechanism is referenced as though it is designed, but no mechanism is implementable from MP text alone. Downstream scaffolding (Step 11) will face ten re-derivation tasks.
- **MPC.5.11** — CRITICAL. The absence of an activation-phase matrix is the single biggest reason an implementer cannot act on the LL section.
- **MPC.5.12** — HIGH. Kill-switch absence is a safety surface — an LL mechanism that degrades output has no declared stopping rule.
- **MPC.5.13** — MEDIUM. Ownership is clarifiable in a sentence.
- **MPC.5.14** — MEDIUM. Mitigation-matrix is structural clarity, not a defect in the idea.
- **MPC.5.15** — HIGH. Without declared LL ↔ LEL/PPL interaction, the concurrent workstream specs cannot be written (Dim 6 findings compound here).

### §5.4 Proposed fix direction

- MPC.5.1 / 5.2 / 5.3 / 5.4 / 5.5 / 5.6 / 5.7 / 5.8 / 5.9 / 5.10: Step 2 directs Step 3 to add a Learning Layer Specification Appendix to the Macro Plan. Each LL.N mechanism gains a five-field block: input, output, activation phase(s), kill-switch, owner. The block is one paragraph, not a full design (the full design is Step 11's job). The appendix adds ≈10 paragraphs.
- MPC.5.11: The appendix opens with an activation-phase matrix — rows LL.1–LL.10, columns M1–M10, cells marked "scaffold" / "active" / "dormant" / "n/a".
- MPC.5.12: Each LL.N block includes one sentence naming the kill-switch trigger.
- MPC.5.13: Appendix opens with an ownership statement (likely native + Claude co-owner, with red-team every 3rd session).
- MPC.5.14: The n=1 risk paragraph gains a binding table — each discipline rule mapped to the n=1 risk(s) it mitigates.
- MPC.5.15: Appendix closes with an interaction map — each LL.N mechanism's input-workstream dependency (LEL, PPL, MSR, UCN, CDLM, CGM) named explicitly.

---

## §6 Dimension 6 — Concurrency completeness

Seed: GA.24. The Macro Plan declares two concurrent workstreams (Life Event Log; prospective prediction logging) and states they run in parallel with the macro-phase arc. This dimension tests whether each workstream is specified well enough to execute without re-deriving the spec.

### §6.1 Findings

- **MPC.6.1** — LEL cadence is not specified. MP says "continuously maintained" (line 89) but does not name a minimum entry frequency, a session-close checkpoint, or a drift-alert rule for stale LEL.
- **MPC.6.2** — LEL owner is not named. Native is the implicit only author, but Claude/Gemini roles in LEL curation (transcription, schema validation, reminder generation) are silent.
- **MPC.6.3** — LEL schema pointer is absent from MP. The LEL file is referenced by name but MP does not state what version of LEL is canonical nor where the schema lives.
- **MPC.6.4** — LEL entry-point is absent. How does the native add a new life event? What template is used? Silent.
- **MPC.6.5** — Prospective prediction logging cadence is not specified. MP line 90 says "as M5 produces predictions, each is logged," but this implies logging only starts after M5, which contradicts its listing as a "concurrent workstream that runs in parallel with the arc."
- **MPC.6.6** — Prospective prediction logging owner is not named. Is Claude authoring the prediction and logging, or is native the approver before logging?
- **MPC.6.7** — Prospective prediction logging schema pointer is absent. No mention of a `PROSPECTIVE_PREDICTION_LOG_v*.md` file, no schema, no frontmatter spec.
- **MPC.6.8** — Prospective prediction logging entry-point is absent. Where do logged predictions live? Silent.
- **MPC.6.9** — Cross-workstream handoff to M4 (from LEL) and to M6 (from PPL) is implicit but not declared as an explicit unlock criterion.
- **MPC.6.10** — "Always on" vs "starts at M_X" framing is ambiguous. LEL implicitly starts at session 2 (per CLAUDE.md current execution position), but MP does not declare that. PPL appears to depend on M5 but is called "concurrent," which is contradictory.
- **MPC.6.11** — No failure-mode for missed entries (native skips weeks of LEL; Claude forgets to log a prediction). No drift-alert on concurrent workstream freshness.
- **MPC.6.12** — Minimum-data-volume gates are not stated. How many LEL events before M4 unlocks? How many PPL predictions before M6 is meaningful? MP is silent on thresholds.

### §6.2 Evidence

- MP lines 87–91 Concurrent workstreams block:
  - Line 88: "Life Event Log: continuously maintained; feeds M4 calibration."
  - Line 89 (restated): "continuously maintained" — no cadence.
  - Line 90: "Prospective prediction logging: as M5 produces predictions, each is logged for later M6 testing."
  - Line 91 (restated): "runs in parallel with the arc" — contradicts "as M5 produces."
- GA.24 from GROUNDING_AUDIT: "Concurrent workstreams LEL and prospective-prediction-logging lack cadence, owner, schema, and entry-point specification."

### §6.3 Severity

- **MPC.6.1 / 6.5** — HIGH. Cadence is the most important operational parameter for a concurrent workstream; absence prevents execution discipline.
- **MPC.6.2 / 6.6** — MEDIUM. Ownership is clarifiable in a sentence but has downstream effects on session design.
- **MPC.6.3 / 6.7** — HIGH. Schema absence blocks implementation.
- **MPC.6.4 / 6.8** — HIGH. Entry-point absence is a "where does this live" defect that breaks the drift-prevention baseline.
- **MPC.6.9** — HIGH. Unlock criteria drive phase sequencing; implicit criteria become a source of disagreement later.
- **MPC.6.10** — MEDIUM. Framing ambiguity is cleanable in one paragraph.
- **MPC.6.11** — MEDIUM. Staleness-detection cadence can be deferred to drift-prevention (Dim 14).
- **MPC.6.12** — HIGH. Without minimum-volume gates, M4 and M6 can be started prematurely with insufficient data.

### §6.4 Proposed fix direction

- MPC.6.1 / 6.2 / 6.3 / 6.4: The MP gains a Life Event Log specification block — cadence (e.g., "weekly review at session-close checkpoint; any in-life event logged within 7 days"), owner (native authors; Claude validates schema), schema pointer (versioned path), entry-point (template file).
- MPC.6.5 / 6.6 / 6.7 / 6.8: The MP gains a Prospective Prediction Log specification block with parallel structure. The "as M5 produces" phrase is revised to "once M5 emits its first probabilistic output, every output is logged within the session that emits it; scaffolding of the log file happens at M2 close so the register is ready."
- MPC.6.9 / 6.12: Each macro-phase row in MP that consumes a concurrent workstream (M4 ← LEL; M6 ← PPL) gains a minimum-volume gate (e.g., "M4 requires ≥ 40 LEL events spanning ≥ 5 years"; "M6 requires ≥ 50 logged predictions with ≥ 6-month horizon elapsed").
- MPC.6.10: The concurrent-workstream block opens with a "always on from session 2 onward" declaration for LEL; PPL is explicitly declared "scaffolded at M2 close, active from first M5 output."
- MPC.6.11: Step 2 may defer staleness detection to drift-prevention (Dim 14), but must declare the deferral in the revised MP's concurrent-workstream block so the reader is not left wondering.

---

## §7 Dimension 7 — External dependency graph

Seed: GA.25. The Macro Plan's macro-phase descriptions implicitly depend on multiple external systems, models, and human reviewers, but none are enumerated as a first-class dependency graph. This dimension tests whether each dependency is declared, whether its failure mode is considered, and whether contingency exists.

### §7.1 Findings

- **MPC.7.1** — External dependencies are not enumerated anywhere in MP. Dependencies surface implicitly: Jagannatha Hora (M1 chart computation; already in PROJECT_ARCHITECTURE), Swiss Ephemeris (M3 temporal animation), Voyage-3-large (M2 corpus activation, embedding layer), Postgres+pgvector (M2+), Gemini availability (cross-phase), Opus availability (cross-phase), classical text corpora (M8), acharya reviewers (M10). MP lists zero of these.
- **MPC.7.2** — Jagannatha Hora fallback absent. If JH produces an incompatible export format in a future version, MP has no plan.
- **MPC.7.3** — Swiss Ephemeris version-lock absent. M3 and M6 depend on ephemeris determinism; a version bump that changes ayanamsha defaults would silently invalidate prior computations.
- **MPC.7.4** — Voyage-3-large deprecation path absent. If Voyage deprecates v3-large mid-project, every embedding in the corpus (M2 output) is invalidated. No migration plan.
- **MPC.7.5** — Postgres+pgvector upgrade/migration path absent. Schema evolution across phases is not addressed.
- **MPC.7.6** — Gemini availability / budget contingency absent. The two-pass protocol (Gemini → Claude) breaks if Gemini is unavailable or over-budget. No fallback.
- **MPC.7.7** — Opus availability / cost contingency absent. Claude Opus is the second-pass reconciler; MP does not name a fallback (Sonnet? Opus-prior? pause-until-available?).
- **MPC.7.8** — Classical text corpora (M8) sourcing plan absent. No mention of which texts are in scope, licensing status, translation lineage, or digitization source.
- **MPC.7.9** — Acharya reviewer pool (M10) recruitment/retention plan absent. M10 is explicitly "LLM-acharya interface," requiring human acharyas as evaluators. MP names zero acharyas, zero recruitment plan, zero retention plan, zero honorarium policy.
- **MPC.7.10** — No single-point-of-failure map. The critical-path dependencies (JH, SE, Voyage, Postgres, Gemini, Opus) each represent a SPOF under current MP.
- **MPC.7.11** — No licensing / legal status called out for classical corpora or for subject-level data storage (GDPR-style considerations for M7 cohort).
- **MPC.7.12** — Model-family migration policy absent. If Claude or Gemini versions forward during the project, what is the coherence criterion? MP is silent.

### §7.2 Evidence

- MP lines 49–67 (M1–M10 summaries): no dependency enumeration in any macro-phase paragraph.
- MP contains zero occurrences of "Jagannatha", "Swiss Ephemeris", "Voyage", "Postgres", "pgvector", "acharya" (only "LLM-acharya interface" as a phase title on line 67).
- MP line 67 M10: "LLM-Acharya Interface. ... produce a specification for how an LLM-driven interface would serve the corpus to an acharya reviewer." No reviewer-sourcing detail.
- MP line 65 M8: "Classical Text Cross-Reference. ... compare against named classical sources." No corpus named.
- GA.25 from GROUNDING_AUDIT: "External dependencies (JH, Swiss Ephemeris, Voyage-3-large, Postgres+pgvector, Gemini, Opus, classical corpora, acharya reviewers) are not enumerated; failure modes not considered."

### §7.3 Severity

- **MPC.7.1** — CRITICAL. A plan that spans ten macro-phases and multiple years without an enumerated external-dependency graph cannot be made resilient.
- **MPC.7.2 / 7.3 / 7.4 / 7.5** — HIGH each. Each is a deterministic-computation dependency whose silent change invalidates prior phase output.
- **MPC.7.6 / 7.7** — HIGH. Model availability is a continuous operational risk.
- **MPC.7.8** — HIGH. M8's entire premise rests on a named corpus that does not exist in MP.
- **MPC.7.9** — CRITICAL. M10 cannot close without acharya reviewers; MP has no path to secure them.
- **MPC.7.10** — HIGH. SPOF mapping is a project-continuity deliverable.
- **MPC.7.11** — MEDIUM. Licensing is real but can be addressed at M7/M8 close.
- **MPC.7.12** — MEDIUM. Model-family migration can be handled in governance (Dim 12) with a dependency pointer.

### §7.4 Proposed fix direction

- MPC.7.1 / 7.10: Step 2 directs Step 3 to add an External Dependency Graph block to the MP — enumerated as a table with rows (each external system/human role), columns (used-by-phase, failure mode, contingency, SPOF-flag).
- MPC.7.2 – 7.7: Each row of the dependency table carries a one-sentence contingency (e.g., "JH deprecation → freeze at last compatible export; re-export with pyswisseph"; "Voyage deprecation → re-embed corpus on fallback model; schema migration document produced at phase close"; "Gemini unavailable → two-pass protocol collapses to one-pass Opus; red-team cadence doubles").
- MPC.7.8: MP's M8 row gains a corpus-sourcing pointer — the shortlist of candidate classical texts (likely BPHS, Jaimini sutras, Phaladeepika, Saravali, Brihat Jataka, Uttarakalamrita) with licensing/translation status per text. The MP does not need to name translations, but it must name the decision point.
- MPC.7.9: MP's M10 row gains a reviewer-sourcing block — acharya recruitment channel (native's network?), minimum review pool size (n ≥ 3?), honorarium stance, review protocol pointer. The MP states intent; the mechanism is Step 3's deliverable.
- MPC.7.11: MP adds a one-paragraph legal/licensing pointer — either addressing it or explicitly deferring to a governance artifact (Dim 12).
- MPC.7.12: MP adds a one-sentence model-family migration stance — e.g., "When Claude or Gemini versions forward, the project pins the current model identifier in SESSION_LOG; migration to a new model requires a dedicated red-team session."

---

## §8 Dimension 8 — Role-of-native cadence

Seed: GA.26. The Macro Plan is executed by Claude/Gemini under the native's direction. This dimension tests whether the MP declares, per macro-phase, what requires native approval, what is deferrable, and what is purely mechanical.

### §8.1 Findings

- **MPC.8.1** — No native-approval matrix exists. The MP does not enumerate, per macro-phase, which decisions require native approval versus which are mechanical.
- **MPC.8.2** — "Significant scope change" is the only native-approval trigger referenced (MP line 108 change-control), and it is undefined. What counts as "significant"? Silent.
- **MPC.8.3** — Life-domain declaration moments — where the native must declare what life events are in/out of scope, what domains are priority, what cohort criteria M7 uses — are not enumerated per macro-phase.
- **MPC.8.4** — Native time-budget per macro-phase is not estimated. M4 calibration likely requires extensive native elicitation; M10 acharya interface requires native recruitment work. MP provides no time envelope.
- **MPC.8.5** — Native escape-hatch / pause protocol is absent. If native must pause for life reasons (travel, illness, career), MP does not declare how the project pauses coherently.
- **MPC.8.6** — Native-unavailable handoff is absent. If native is unreachable for a session, can Claude proceed autonomously? Silent.
- **MPC.8.7** — Deferrable-vs-mechanical decisions are not enumerated. Which decisions can Claude make alone (e.g., internal-format choices), which require Gemini consultation (two-pass), which require native approval?

### §8.2 Evidence

- MP line 108 (change control): "Macro Plan is versioned. Significant scope changes require native approval and a version bump."
- MP contains zero occurrences of "approval matrix", "deferrable", "mechanical", "native time", "pause protocol", "handoff".
- MP lines 93–104 scope-boundary block: addresses "scope of a single session," not native cadence. Silent on native approval per macro-phase.
- GA.26 from GROUNDING_AUDIT: "Role of native per macro-phase — approval cadence, time budget, escape-hatch — is unspecified."

### §8.3 Severity

- **MPC.8.1** — HIGH. Approval-matrix absence means every session risks either under-consulting (drift) or over-consulting (native burnout).
- **MPC.8.2** — MEDIUM. "Significant" is definable in a paragraph.
- **MPC.8.3** — HIGH. Domain-declaration moments drive the critical-path for L3 domain reports and M7 cohort — unstated moments create ambiguity.
- **MPC.8.4** — MEDIUM. Time-budget is estimate-only; native will adjust as the project runs, but an initial envelope is useful.
- **MPC.8.5** — HIGH. Pause protocol is mission-continuity critical; this is a multi-year project.
- **MPC.8.6** — MEDIUM. Unavailable-handoff can be addressed via session-close discipline and SESSION_LOG, but MP should declare the stance.
- **MPC.8.7** — MEDIUM. The autonomy-boundary question compounds MPC.8.1; a paragraph resolves both.

### §8.4 Proposed fix direction

- MPC.8.1 / 8.7: Step 2 directs Step 3 to add a Native Cadence Block to MP — a table with three rows (mechanical / Claude-Gemini-only / native-approval-required) and columns per macro-phase. Each cell carries 1–3 bullets naming the decision class.
- MPC.8.2: The MP's change-control clause is expanded to define "significant" by example (e.g., "adding/removing a macro-phase, redefining a layer, changing the subject, opening M7 cohort" vs "adding a sub-phase within M2, revising a CDLM edge weight").
- MPC.8.3: Each macro-phase row gains a "native-declaration-moments" bullet list — e.g., M4 requires native to declare which life-event categories are in scope; M7 requires native to declare cohort inclusion criteria; M10 requires native to approve acharya reviewer shortlist.
- MPC.8.4: Optional per-phase time envelope — Step 2 may defer to Dim 9 (time-horizon), where it will be addressed with the session-volume estimate.
- MPC.8.5 / 8.6: MP gains a one-paragraph pause/handoff protocol — e.g., "At session close, Claude produces a SESSION_CLOSE handoff note sufficient for resumption weeks later. If native is unreachable for N days, Claude pauses at current phase close and does not begin a new phase."

---

## §9 Dimension 9 — Time horizon vs phase indexing

Seed: GA.27. The Macro Plan indexes by macro-phase (M1–M10), not by time. This dimension tests whether effort estimates, target dates, or dependency bars are provided — and whether they should be.

### §9.1 Findings

- **MPC.9.1** — No effort estimate per macro-phase (session count, hour count, or cost envelope).
- **MPC.9.2** — No target date per macro-phase. The MP does not state whether M10 is targeted in 2027, 2029, or 2032.
- **MPC.9.3** — No dependency bar / Gantt-equivalent. Phase sequencing is linear by default; whether phases overlap is left ambiguous.
- **MPC.9.4** — Expected duration of concurrent workstreams (LEL, PPL) is not stated. LEL spans the entire project; PPL depends on M5+ horizon. No duration envelopes.
- **MPC.9.5** — Ambiguity about whether M3–M10 are calendar-sequential or can run with partial overlap (e.g., M8 classical cross-reference could begin during M7 cohort extension).
- **MPC.9.6** — No session-volume estimate per macro-phase (given the per-session discipline, the reader cannot tell whether M2 is a 20-session or 100-session undertaking).
- **MPC.9.7** — No budget envelope per macro-phase (cost per phase in API spend, human-hours, or external-service fees).

### §9.2 Evidence

- MP contains zero calendar dates other than the v1.0 date (2026-04-23 in its frontmatter, inferred from the critique's subject_version line).
- MP contains zero hour/session/dollar estimates.
- MP lines 49–67 (M1–M10 paragraphs): each describes scope, not schedule or effort.
- MP lines 87–91 concurrent workstreams: no duration envelope on LEL or PPL.
- GA.27 from GROUNDING_AUDIT: "Macro Plan indexes by phase, not time; no effort estimate, target date, or dependency-bar is provided."

### §9.3 Severity

- **MPC.9.1** — MEDIUM. The project has declined to commit to dates previously; this is a framing decision, not a defect, but the MP should declare the stance.
- **MPC.9.2** — MEDIUM. Same reasoning.
- **MPC.9.3** — HIGH. Overlap-vs-serial sequencing drives governance cadence; ambiguity creates concurrency risk.
- **MPC.9.4** — HIGH. Concurrent workstream duration drives MPC.6 issues; compound defect.
- **MPC.9.5** — HIGH. Same as 9.3.
- **MPC.9.6** — MEDIUM. Session-volume is estimable and clarifying; absence is defensible but better-declared.
- **MPC.9.7** — MEDIUM. Budget envelopes can live in a subordinate artifact if MP declares the pointer.

### §9.4 Proposed fix direction

- MPC.9.1 / 9.2 / 9.6 / 9.7: Step 2 directs Step 3 to add a Time/Effort Stance paragraph to MP — explicitly stating that the project indexes by phase rather than calendar, with a rough session-volume envelope per phase (e.g., M2 ≈ 30–60 sessions; M3 ≈ 10–20; M4 ≈ 40–100; M5 ≈ 20–40; M6 is time-gated not session-gated; M7 ≈ 30–60 per added subject; etc.). Hard dates are explicitly declined.
- MPC.9.3 / 9.5: MP adds a sequencing stance — e.g., "M1–M6 are serial; M7–M9 may run partially overlapped; M10 serializes again." Any overlap is declared, not implied.
- MPC.9.4: The concurrent-workstream block (per Dim 6) adds a duration envelope — LEL spans project lifetime; PPL begins at first M5 output and spans project lifetime.
- MPC.9.7: MP declares whether cost envelopes live inside MP or in a separate GOVERNANCE/COST document; if the latter, MP carries the pointer.

---

## §10 Dimension 10 — Post-M10 framing

Seed: GA.28. The Macro Plan's M10 is the last listed phase. This dimension tests whether the MP addresses what happens after M10 — maintenance, publication, extension, retirement.

### §10.1 Findings

- **MPC.10.1** — Post-M10 state is entirely absent from MP. The MP ends at M10 and does not declare "what the project is" after M10 closes.
- **MPC.10.2** — Maintenance mode is undefined. Is the corpus a living artifact indefinitely? A frozen reference? MP silent.
- **MPC.10.3** — Publication / dissemination mode is undefined. Is the corpus intended for internal use only? Academic publication? Book? Community tool?
- **MPC.10.4** — Open-source / ownership / handoff stance is undefined. If native wishes to share the corpus with a collaborator or a wider community post-M10, MP has no default.
- **MPC.10.5** — Retirement criteria are undefined. Under what condition would the project be concluded or shelved?
- **MPC.10.6** — Versioning policy post-M10 is undefined. Does MP keep being revised? Does a MP v2.0 replace it? Does MP become SUPERSEDED by a steady-state artifact?

### §10.2 Evidence

- MP ends at line 109. The final macro-phase (M10) is on line 67. MP contains zero occurrences of "post-M10", "steady-state", "retirement", "publication", "maintenance mode".
- MP line 108 (change control) addresses MP revision in general but not post-M10 specifically.
- GA.28 from GROUNDING_AUDIT: "Post-M10 framing absent — maintenance, publication, extension, retirement undefined."

### §10.3 Severity

- **MPC.10.1** — HIGH. A ten-phase plan with no "what's next" is an incomplete spec. Even a one-paragraph declaration is sufficient.
- **MPC.10.2** — MEDIUM. Maintenance mode is declarable in two sentences.
- **MPC.10.3** — MEDIUM. Publication stance is native's call; MP should declare that the stance is deferred to native, not silent.
- **MPC.10.4** — MEDIUM. Same reasoning.
- **MPC.10.5** — MEDIUM. Retirement criteria (e.g., "if acharya panel rejects corpus at M10 close, project enters review-not-publication mode") is a risk-management deliverable.
- **MPC.10.6** — MEDIUM. Versioning policy post-M10 dovetails with Dim 12 (meta-governance).

### §10.4 Proposed fix direction

- MPC.10.1 – 10.6: Step 2 directs Step 3 to add a Post-M10 Framing section to MP — one section with five short paragraphs, one each on maintenance, publication, ownership/handoff, retirement, and versioning. The section states the stance for each, even if the stance is "deferred to native at M10 close" or "default is continuous maintenance with annual red-team cadence."

---

## §11 Dimension 11 — Ethical framework

Seed: GA.29. The instrument being built makes probabilistic predictions about life outcomes, including health, mortality, relationship, and financial domains. This dimension tests whether the MP declares ethical principles, disclosure requirements, self-harm-adjacent guardrails, and consent stances.

### §11.1 Findings

- **MPC.11.1** — No ethical principles are enumerated in MP. The MP makes no statement about truth-in-advertising, probabilistic humility, or consumer protection.
- **MPC.11.2** — No disclosure framework for predictions. How is a probabilistic output communicated to the consumer? With what confidence disclosure? With what failure-mode caveat?
- **MPC.11.3** — No guardrail for self-harm-adjacent outputs. The mortality domain, the health-crisis domain, and the mental-health domain are implicit targets. MP does not declare a guardrail.
- **MPC.11.4** — No consumer-audience distinction. The MP does not distinguish outputs intended for (a) the native self, (b) a cohort subject in M7, (c) an acharya reviewer in M10, (d) a hypothetical future public consumer.
- **MPC.11.5** — No consent / privacy stance for cohort phase (M7). Adding subjects raises consent, data-retention, and privacy questions; MP is silent.
- **MPC.11.6** — No statement of truth-in-advertising for probabilistic output. The M5 probabilistic model emits calibrated probabilities; the disclosure of calibration to consumers is not declared.
- **MPC.11.7** — No fraud / gaming guardrail. If native (consciously or not) adjusts LEL entries to match predictions, the calibration is broken. MP has no pre-registration or blinding mechanism.
- **MPC.11.8** — No minor / vulnerable-population stance for M7 cohort.
- **MPC.11.9** — No connection to L3 Domain Reports' Mode A / Mode B distinction (from PROJECT_ARCHITECTURE) — the architecture already distinguishes curated vs exhaustive output, but MP does not link ethics to that distinction.

### §11.2 Evidence

- MP contains zero occurrences of "ethic", "consent", "privacy", "disclosure", "guardrail", "self-harm", "vulnerable", "minor", "fraud", "blinding".
- MP line 63 M7: "Population Extension. Add N subjects. Method-extension test." No consent language.
- MP line 67 M10: "LLM-Acharya Interface." No disclosure language.
- GA.29 from GROUNDING_AUDIT: "Ethical framework absent — disclosure, guardrails, consent, vulnerable-population stance undefined."

### §11.3 Severity

- **MPC.11.1** — CRITICAL. A multi-year instrument emitting life-domain predictions without declared ethical principles is under-specified at the architectural level.
- **MPC.11.2** — HIGH. Disclosure framework protects consumers and the project; absence is both an ethical and reputational surface.
- **MPC.11.3** — CRITICAL. Self-harm-adjacent outputs in mortality/mental-health domains require explicit guardrails.
- **MPC.11.4** — HIGH. Audience distinction drives every disclosure rule; conflating audiences is a common failure mode.
- **MPC.11.5** — CRITICAL. Consent absence in M7 cohort is a legal and ethical blocker.
- **MPC.11.6** — HIGH. Calibration disclosure is truth-in-advertising.
- **MPC.11.7** — HIGH. Fraud/gaming guardrail is mission-critical for calibration validity.
- **MPC.11.8** — HIGH. Minor/vulnerable-population stance is a standard cohort-study requirement.
- **MPC.11.9** — MEDIUM. Linking ethics to Mode A/B distinction is clarifying rather than novel.

### §11.4 Proposed fix direction

- MPC.11.1: Step 2 directs Step 3 to add an Ethical Framework section to MP — at minimum, a principles block (probabilistic humility; truth-in-advertising; no self-harm-adjacent output without guardrail; consent-required for subjects other than native; red-team oversight).
- MPC.11.2: Ethical Framework section names a disclosure template for probabilistic output (confidence band; method pointer; known failure modes).
- MPC.11.3: Specifies that the mortality/health-crisis domain requires an explicit guardrail — e.g., no date-of-death output; health-crisis output requires double-red-team; suicide-adjacent output is disallowed.
- MPC.11.4: Names the four consumer audiences (native; cohort subject; acharya reviewer; hypothetical public) and binds a disclosure tier to each.
- MPC.11.5: M7 row is amended to require IRB-style consent protocol for each added subject before any L2+ output is produced for that subject.
- MPC.11.6: M5/M6 rows state that all outputs carry calibration-band disclosure.
- MPC.11.7: Adds a pre-registration / blinding stance — e.g., LEL entries are timestamped at first entry; post-hoc edits are flagged in audit trail; prospective predictions are locked at emission.
- MPC.11.8: M7 cohort inclusion criteria exclude minors and declare vulnerable-population protections.
- MPC.11.9: Ethical Framework section cross-references Architecture §§ on Mode A / Mode B.

---

## §12 Dimension 12 — Meta-governance

Seed: GA.30. The Macro Plan must be revisable, red-teamable, and retirable. This dimension tests whether it governs itself.

### §12.1 Findings

- **MPC.12.1** — No trigger condition for MP revision. When is a revision mandated (e.g., "any failed red-team of a macro-phase triggers MP review")? Silent.
- **MPC.12.2** — No approval protocol for MP revision. The change-control clause names "native approval" but not the protocol (proposal → red-team → approval → version bump).
- **MPC.12.3** — No retirement / sunset clause for MP. When does MP become SUPERSEDED by something else?
- **MPC.12.4** — No red-team cadence for MP itself. MP is subject to the general "red-team every 3rd session" discipline but does not declare a dedicated MP-level red-team.
- **MPC.12.5** — Version semantics (v1.1 additive vs v2.0 architectural) are undefined. The critique brief (§3) already anticipates this — Step 2 must decide — but the MP itself carries no rule.
- **MPC.12.6** — MP does not name its own status (LIVING vs CLOSED vs CURRENT vs SUPERSEDED). Its status is inferred from context but not declared.
- **MPC.12.7** — No changelog requirement. Future versions of MP could ship without a changelog, breaking audit-trail discipline.

### §12.2 Evidence

- MP line 108 (change control): "Macro Plan is versioned. Significant scope changes require native approval and a version bump." — the entire meta-governance statement in the MP.
- MP frontmatter contains no `status:` field. (The critique verified this against file content.)
- MP contains zero occurrences of "changelog", "red-team cadence", "revision trigger", "sunset", "retirement".
- GA.30 from GROUNDING_AUDIT: "Meta-governance of the Macro Plan itself (revision triggers, red-team cadence, retirement) undefined."

### §12.3 Severity

- **MPC.12.1** — HIGH. Revision triggers are how the MP stays honest.
- **MPC.12.2** — HIGH. Approval protocol is process clarity.
- **MPC.12.3** — MEDIUM. Sunset clause is long-horizon governance; one sentence suffices.
- **MPC.12.4** — HIGH. Red-team cadence for MP itself is the single strongest drift-prevention lever for the plan.
- **MPC.12.5** — MEDIUM. Version semantics is a paragraph.
- **MPC.12.6** — MEDIUM. Status field is frontmatter hygiene.
- **MPC.12.7** — MEDIUM. Changelog is a discipline rule.

### §12.4 Proposed fix direction

- MPC.12.1 / 12.2 / 12.4: Step 2 directs Step 3 to add a Meta-Governance block to MP — triggers for revision (any red-team rejection of a phase; any failed close-criterion; any P1–P9 failure cascade), approval protocol (proposal artifact → red-team → native approval → version bump → SESSION_LOG), red-team cadence for MP itself (e.g., "MP is red-teamed at each macro-phase close; additionally every 12 months").
- MPC.12.3: Meta-Governance block names a sunset clause — e.g., "MP is SUPERSEDED when a successor MP is published OR when the project enters steady-state maintenance per Post-M10 framing."
- MPC.12.5: Meta-Governance block defines version semantics — v1.X is additive; v2.0 is architectural; v3.0 is scope-redefining. Any ambiguity resolved in favor of the higher bump.
- MPC.12.6: MP gains a `status: CURRENT` field in frontmatter.
- MPC.12.7: Meta-Governance block requires a changelog section in every future MP revision.

---

## §13 Dimension 13 — Multi-agent collaboration discipline

Seed: GA.31. The project runs Claude and Gemini today and may add further agents in the future. This dimension tests whether the MP specifies the collaboration protocol, including disagreement handling.

### §13.1 Findings

- **MPC.13.1** — Gemini is referenced once in the broader project (per CLAUDE.md's Gemini collaboration clause) but does not appear in MP at all. MP contains zero mentions of Gemini, two-pass protocol, or any multi-agent coordination.
- **MPC.13.2** — No protocol for disagreement between agents. The Step 7 brief anticipates a DISAGREEMENT_REGISTER, but MP itself is silent.
- **MPC.13.3** — No role separation per macro-phase. Which passes use Gemini? Which are Claude-only? Which are both? MP does not say.
- **MPC.13.4** — No future-agent-admission policy. If a third agent (Gemini 3, a domain-specific model, or a human-in-the-loop) is added mid-project, MP has no default.
- **MPC.13.5** — DISAGREEMENT_REGISTER (from Step 7 brief) is a future artifact but MP does not point to it nor declare the disagreement-logging discipline.
- **MPC.13.6** — No quality-gate for agent output. What makes an agent pass acceptable to move to the next macro-phase? MP is silent.
- **MPC.13.7** — No version-coupling. Which Claude version, which Gemini version, was assumed when MP was drafted? What happens when those version forward? MP silent (compounds MPC.7.12).

### §13.2 Evidence

- MP contains zero occurrences of "Gemini", "two-pass", "disagreement", "agent-to-agent", "multi-agent", "reconciler".
- PROJECT_ARCHITECTURE_v2_1 §D.6 names the two-pass protocol; CLAUDE.md names the Gemini collaboration clause. MP does not mirror either.
- GA.31 from GROUNDING_AUDIT: "Multi-agent collaboration discipline (Claude + Gemini; disagreement protocol) not specified in MP."

### §13.3 Severity

- **MPC.13.1** — HIGH. A plan that doesn't reference the project's actual collaboration model is stale at publication.
- **MPC.13.2** — HIGH. Disagreement protocol is the single most important multi-agent discipline; absence is a direct drift source.
- **MPC.13.3** — HIGH. Per-phase agent role drives cost and quality.
- **MPC.13.4** — MEDIUM. Future-agent policy is declarable.
- **MPC.13.5** — MEDIUM. Pointer to DISAGREEMENT_REGISTER is a single sentence.
- **MPC.13.6** — HIGH. Quality-gate absence is compound with MPC.3 (exit criteria).
- **MPC.13.7** — MEDIUM. Version-coupling is a discipline rule.

### §13.4 Proposed fix direction

- MPC.13.1 / 13.3: Step 2 directs Step 3 to add a Multi-Agent Collaboration block to MP — naming the current agents (Claude Opus 4.7 reconciler; Gemini 2.5 Pro connector), declaring the two-pass protocol, and mapping agent roles per macro-phase (e.g., "M1–M2: two-pass; M3 computation: Claude-only; M4 elicitation: Claude-only with native; M5 model build: two-pass; M6 testing: Claude-only; M7 cohort extension: two-pass; M8 classical cross-reference: two-pass; M9 multi-school triangulation: two-pass + acharya; M10 acharya interface: Claude-only").
- MPC.13.2 / 13.5: MP declares that agent disagreements are logged to DISAGREEMENT_REGISTER and that unresolved disagreements escalate to native; includes pointer to the register artifact (created in Step 7).
- MPC.13.4: Multi-Agent block closes with a future-agent-admission clause — e.g., "Admission of any third agent requires a red-team session dedicated to the admission and a version bump of MP."
- MPC.13.6: Each macro-phase row gains a quality-gate bullet — the pass-criterion for agent output at that phase (typically the close-criteria from Dim 3, but binding them to agent responsibility).
- MPC.13.7: Multi-Agent block declares version-pinning discipline — SESSION_LOG records model identifiers; a model-family migration follows the Dim 12 meta-governance path.

---

## §14 Dimension 14 — System integrity and drift-prevention

Seed: GA.32. The governance rebuild exists because multi-session drift accumulated. This dimension tests whether the MP names drift-prevention as a first-class axis — not a macro-phase but a substrate like the Learning Layer.

### §14.1 Findings

- **MPC.14.1** — Drift-prevention is not named as an axis in MP. The MP treats Learning Layer as substrate but treats drift-prevention as implicit operational hygiene.
- **MPC.14.2** — No mention of mirror discipline (CLAUDE.md, `.geminirules`, `.gemini/project_state.md`). The MP is silent on how multi-file sources of truth are kept aligned.
- **MPC.14.3** — No mention of FILE_REGISTRY as enforcement mechanism. The registry exists in the project; MP does not reference it.
- **MPC.14.4** — No mention of SESSION_LOG as drift detector. The log is the cross-session memory anchor; MP does not bind macro-phase progress to SESSION_LOG entries.
- **MPC.14.5** — No mention of canonical-artifact discipline. The CLAUDE.md "Canonical corpus artifact paths" block is not echoed in MP.
- **MPC.14.6** — The governance rebuild (Step 0–15, the workflow currently in flight) is entirely absent from MP. MP was drafted before the rebuild was scoped and has not been updated.
- **MPC.14.7** — Learning Layer is promoted to substrate; drift-prevention is not. This is an architectural asymmetry — the Learning Layer is substrate for "the project learns over time," but drift-prevention is substrate for "the project stays coherent across sessions." Both deserve substrate status.

### §14.2 Evidence

- MP contains zero occurrences of "drift", "mirror", "FILE_REGISTRY", "SESSION_LOG", "canonical", "GOVERNANCE_BASELINE", "STEP_LEDGER".
- MP treats "Learning Layer" as substrate in Section §Learning Layer (lines 69–84) but no equivalent section on integrity or drift.
- GROUNDING_AUDIT findings GA.1–GA.6 document actual drift that has already occurred (CGM v8.0 rebuild staleness, L3 reports refreshed staleness, Learning Layer phantom reference, etc.) — precisely the kind of drift MP does not anticipate.
- GA.32 from GROUNDING_AUDIT: "System integrity and drift-prevention is not a first-class axis in the Macro Plan — the rebuild itself is proof that it should be."

### §14.3 Severity

- **MPC.14.1** — CRITICAL. The whole current rebuild exists because this axis was not first-class. Elevating it is the single biggest structural fix.
- **MPC.14.2** — HIGH. Mirror discipline is named in CLAUDE.md and enforced in Step 7 (mirror_enforcer) but is not in MP.
- **MPC.14.3** — HIGH. FILE_REGISTRY is the canonical-artifact enforcement hook.
- **MPC.14.4** — HIGH. SESSION_LOG is the drift-detection anchor.
- **MPC.14.5** — HIGH. Canonical-artifact discipline is what kept the project from deeper drift; its absence from MP is an omission.
- **MPC.14.6** — CRITICAL. The MP cannot claim to govern the project while ignoring the workflow currently rebuilding the governance layer.
- **MPC.14.7** — HIGH. Substrate parity (Learning Layer ↔ Integrity) is the cleanest architectural fix.

### §14.4 Proposed fix direction

- MPC.14.1 / 14.7: Step 2 directs Step 3 to add a System Integrity Substrate section to MP, parallel to the Learning Layer section. The new section enumerates integrity axes: canonical-artifact discipline, mirror discipline, FILE_REGISTRY enforcement, SESSION_LOG as drift-detector, SESSION_OPEN/CLOSE templates, drift_detector and schema_validator automation, DISAGREEMENT_REGISTER, red-team cadence.
- MPC.14.2 / 14.3 / 14.4 / 14.5: Each axis gets a one-line pointer to the governance artifact that owns it (GOVERNANCE_INTEGRITY_PROTOCOL, FILE_REGISTRY, SESSION_LOG, CANONICAL_ARTIFACTS). MP does not carry the definitions — it carries the pointers.
- MPC.14.6: The Substrate section opens by acknowledging the governance rebuild arc (Step 0–15) and declares that MP v1.X or v2.0 is produced during Step 3 of that rebuild. This binds MP to the rebuild rather than ignoring it.

---

## §15 Summary Table

| Dim | Title | Findings | Highest severity | Proposed revision approach |
|-----|-------|---------:|------------------|----------------------------|
| 1 | Phase completeness | 8 | CRITICAL | Normalize each macro-phase row to a fixed block schema: scope / entry state / exit state / owner / quality-gate. Refresh M1 status to reflect Step 0 grounding. |
| 2 | Sequencing and dependencies | 12 | HIGH | Add per-phase dependency block (upstream + downstream); explicit serial-vs-overlapped declaration; bind concurrent workstreams to unlock criteria. |
| 3 | Exit criteria | 10 | CRITICAL | Every macro-phase gains an explicit closure checklist bound to P1–P9 validators and red-team pass status; session-close discipline carries to macro-phase close. |
| 4 | Risk surface | 13 | HIGH | Per-phase risk block (≥3 risks, each with mitigation/pointer); cross-cutting risk block; risk stance declaration (n=1 vs cohort). |
| 5 | Learning Layer specificity | 15 | CRITICAL | Learning Layer Specification Appendix — five-field block per LL.N mechanism; activation-phase matrix; kill-switch per mechanism; n=1 mitigation binding table. |
| 6 | Concurrency completeness | 12 | HIGH | LEL and PPL specification blocks with cadence, owner, schema pointer, entry-point, minimum-volume gates, cross-workstream unlock criteria. |
| 7 | External dependency graph | 12 | CRITICAL | External Dependency Graph block enumerating JH, SE, Voyage, Postgres+pgvector, Gemini, Opus, classical corpora, acharya reviewers — each with failure mode and contingency. |
| 8 | Role-of-native cadence | 7 | HIGH | Native Cadence Block — approval matrix, "significant" definition, declaration-moments per phase, pause/handoff protocol. |
| 9 | Time horizon vs phase indexing | 7 | HIGH | Time/Effort Stance paragraph declaring phase-indexed governance; session-volume envelopes per phase; sequencing stance (serial vs overlap); concurrent-workstream duration. |
| 10 | Post-M10 framing | 6 | HIGH | Post-M10 Framing section covering maintenance, publication, ownership/handoff, retirement, versioning — even if stance is "deferred to native at M10 close." |
| 11 | Ethical framework | 9 | CRITICAL | Ethical Framework section — principles, disclosure tiers per audience, self-harm guardrail, consent protocol for M7, calibration disclosure, pre-registration/blinding stance. |
| 12 | Meta-governance | 7 | HIGH | Meta-Governance block — revision triggers, approval protocol, red-team cadence for MP, version semantics (v1.X vs v2.0), status field, changelog requirement, sunset clause. |
| 13 | Multi-agent collaboration | 7 | HIGH | Multi-Agent Collaboration block — current agents named, two-pass protocol declared, per-phase agent role, DISAGREEMENT_REGISTER pointer, future-agent-admission clause, version-coupling discipline. |
| 14 | System integrity and drift-prevention | 7 | CRITICAL | System Integrity Substrate section parallel to Learning Layer — canonical-artifact discipline, mirror enforcement, FILE_REGISTRY, SESSION_LOG as drift-detector, acknowledgment of Step 0–15 rebuild. |

**Totals:** 132 in-schema findings across 14 dimensions, plus 4 out-of-schema findings recorded in §16 — 136 findings in total.
**Severity distribution (in-schema):** CRITICAL: 12 · HIGH: 71 · MEDIUM: 46 · LOW: 3.
**Severity distribution (out-of-schema):** MEDIUM: 1 · LOW: 3.
**Dimensions with a CRITICAL finding:** 1, 2, 3, 4, 5, 7, 11, 14 (eight of fourteen).

---

## §16 Out-of-Schema Findings

These findings do not fit cleanly within any of the 14 mandated dimensions but surfaced during the critique and are recorded here per brief §4 and §5.

- **MPC.OS.1** — *Date collision / self-reference.* MP frontmatter is dated 2026-04-23, which is the same date as Step 0 Grounding and the anticipated date of Step 1 execution. If MP v1.1 or v2.0 ships on the same day (Step 3), three distinct versions of the governance arc share a single date. **Severity: LOW.** Fix direction: adopt date+session-id convention (e.g., `2026-04-23_STEP_3_MACRO_PLAN_REWRITE`) for disambiguation in SESSION_LOG and frontmatter.
- **MPC.OS.2** — *Native-scope-boundary fuzziness.* MP lines 93–104 scope-boundary block is about a single session rather than about a macro-phase. The two scopes (session-boundary vs phase-boundary) are conflated. **Severity: MEDIUM.** Fix direction: split the scope-boundary block into (a) session-scope discipline, which belongs in GOVERNANCE; (b) macro-phase scope, which belongs in MP's per-phase row.
- **MPC.OS.3** — *Markdown header style inconsistency.* MP uses `##` for macro-phase headers and `###` inconsistently across sub-sections. Not a content defect but a mirror-discipline concern (the schema_validator in Step 7 will flag header-level drift). **Severity: LOW.** Fix direction: Step 3's rewrite normalizes the header level convention and declares it in GOVERNANCE_STACK.
- **MPC.OS.4** — *Missing MP-internal ID namespace.* The ten macro-phases are referred to as "M1"–"M10" in prose but are not declared as a stable ID namespace in MP's frontmatter. External artifacts (this critique, Phase B Plan, GROUNDING_AUDIT, STEP_BRIEFS) cite "M2" or "M4" without a formal namespace contract. **Severity: LOW.** Fix direction: MP frontmatter gains `id_namespace: M1..M10` with a one-line policy that the namespace is stable across revisions.

---

*End of MACRO_PLAN_CRITIQUE_v1_0.md.*

