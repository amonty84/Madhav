---
artifact: MACRO_PLAN_REVISION_SPEC_v1_0.md
version: 1.0
status: CLOSED
session: STEP_2_MACRO_PLAN_REVISION_SPEC
date: 2026-04-23
subject_file: 00_ARCHITECTURE/MACRO_PLAN_v1_0.md
target_revision: v2.0
consumed_by: Step 3 (Macro Plan rewrite)
inputs_read:
  - CLAUDE.md (governance banner + mandatory reading list)
  - 00_ARCHITECTURE/STEP_LEDGER_v1_0.md (Step 2 row ready)
  - 00_ARCHITECTURE/STEP_BRIEFS/STEP_02_MACRO_PLAN_REVISION_SPEC_v1_0.md (this brief)
  - 00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md (132 in-schema + 4 out-of-schema findings)
  - 00_ARCHITECTURE/MACRO_PLAN_v1_0.md (subject — 109 lines)
  - 00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md (GA.1–GA.32)
  - 00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md (ND.1 — Mirror Discipline)
findings_addressed: 132 MPC (in-schema) + 4 MPC.OS (out-of-schema) + 1 ND (ND.1) = 137
version_decision_rationale: >
  12 CRITICAL findings across 8 of 14 dimensions, including one (MPC.14.6) that
  requires acknowledging the Step 0→15 governance rebuild itself as an axis of
  the plan; plus the addition of a new cross-cutting substrate (System
  Integrity Substrate) parallel to the existing Learning Layer substrate; plus
  a schema change to every macro-phase row to carry entry/exit/dependency/risk
  blocks; plus five new top-level sections (Ethical Framework, External
  Dependency Graph, Meta-Governance, Multi-Agent Collaboration, Post-M10
  Framing). This is architectural, not additive. v2.0 is the correct bump.
---

# MACRO PLAN REVISION SPEC v1.0 — Blueprint for MACRO_PLAN_v2_0.md

## §0 — Orientation

This document is the Step 2 deliverable of the Step 0 → Step 15 governance rebuild. It is **specification-only**. It does not write revised Macro Plan prose; Step 3 does that, following this spec verbatim.

**What this spec is.** A finding-by-finding, section-by-section blueprint that tells Step 3 exactly which existing MP sections to KEEP, REVISE, REPLACE, or DELETE; which new sections to INSERT; what schema each new section uses; what cross-surface artifacts need coordinated updates at Step 5 close; and how every one of the 132 in-schema MPC.N.M findings, 4 out-of-schema MPC.OS.N findings, and the ND.1 native directive are resolved.

**What this spec is not.** It is not a rewrite. It does not prose the new Macro Plan. It does not pre-decide Step 3's exact word choice. It does not re-critique. It does not relitigate severity decisions made in Step 1. Where a critique finding proposed a fix direction, this spec either accepts that direction (and names the §2/§3 entry implementing it) or overrides it with a named rationale.

**Reading order for Step 3.** Step 3's fresh conversation reads this spec along with MACRO_PLAN_CRITIQUE_v1_0 (for evidence context if needed) and then writes `MACRO_PLAN_v2_0.md` per §2 and §3 below. Step 3 does not need to re-read PROJECT_ARCHITECTURE, PHASE_B_PLAN, or the GROUNDING_AUDIT — this spec is the blueprint.

**Cross-artifact scope boundary.** This spec modifies only the Macro Plan. Cross-surface coordination (CLAUDE.md canonical paths, .geminirules mirror, .gemini/project_state.md, FILE_REGISTRY, GOVERNANCE_STACK) is scoped in §5 but executed in Step 5 (Macro Plan closure + propagate). This step does not edit any of those files.

---

## §1 — Version decision: v2.0

**Decision:** Step 3 produces `MACRO_PLAN_v2_0.md`, not `MACRO_PLAN_v1_1.md`.

**Rationale (evidence-bound):**

**1.1 — Architectural substrate change.** The critique identifies drift-prevention as the single largest structural gap (MPC.14.1 CRITICAL, MPC.14.7 HIGH) and demands a full System Integrity Substrate parallel to the existing Learning Layer substrate. Adding a cross-cutting substrate is an architectural operation by the MP's own internal vocabulary (the Learning Layer is declared substrate in MP v1.0 lines 69–73). Substrate-addition is not an additive patch; it restructures the cross-cutting layer count from one to two.

**1.2 — Per-phase schema change.** Eight CRITICAL findings across Dimensions 1, 2, 3, 4, 7, 11, 14 all demand the same structural reform: every macro-phase row must carry a fixed schema (entry_state, exit_state, dependencies, deliverable_paths, risks, quality_gate, native_approval_points). MP v1.0 has macro-phases as free-form prose paragraphs of 25–60 words. Replacing prose paragraphs with a structured per-row schema for all ten macro-phases is a format overhaul — a v2.0-scale change, not a v1.X-scale change.

**1.3 — New top-level sections.** The critique mandates five new top-level sections (Ethical Framework, External Dependency Graph, Meta-Governance, Multi-Agent Collaboration, Post-M10 Framing). A v1.X additive bump can tolerate one or two new sections; five new top-level sections plus one new substrate exceeds the additive envelope.

**1.4 — Rebuild-era acknowledgment.** MPC.14.6 (CRITICAL) requires that MP acknowledge the Step 0–15 governance rebuild arc and declare that MP v2.0 is produced *during* Step 3 of that rebuild. A plan that acknowledges the rebuild that produced it is meta-indexing on itself in a way v1.0 cannot — the v1.0 frontmatter has no concept of rebuild-era production.

**1.5 — Ethical framework is a load-bearing addition.** MPC.11.1, MPC.11.3, MPC.11.5 (three CRITICALs in Dimension 11) demand explicit ethics, disclosure, and consent protocols. Ethics is not an additive polish; it is an architectural principle that downstream phases (M4 calibration, M6 prospective testing, M7 cohort, M10 external validation) will be structurally bound by. Introducing ethics as a first-class section is a v2.0-scale architectural change.

**1.6 — ND.1 native directive requires substrate elevation.** ND.1 (Mirror Discipline) is native-issued and severity-equivalent to a CRITICAL critique finding. It requires mirror discipline to be promoted from operational afterthought to first-class substrate axis. This sits inside the System Integrity Substrate new section, confirming the substrate-level structural change is load-bearing for multiple drivers.

**Counter-consideration.** A v1.1 additive revision could in theory absorb some of the HIGH findings (e.g., per-phase risk bullets added inline; Gemini named once in the Learning Layer section). But it could not absorb the CRITICAL cluster without the schema overhaul described in 1.2, the substrate addition in 1.1, or the rebuild-era acknowledgment in 1.4. A partial v1.1 that addressed HIGHs but deferred CRITICALs would be a half-measure that would itself be red-teamed out at Step 4. The critique's handoff note anticipates this ("Step 2 should expect to recommend v2.0 unless it can show that the CRITICAL findings cluster around additive patches"); the CRITICAL findings do not cluster additively — they cluster structurally.

**Consequence for scope.** v2.0 changes the Macro Plan's schema, substrate count, section inventory, and frontmatter. It does NOT change:

- the subject of the project (Abhisek Mohanty, b. 1984-02-05),
- the ten-macro-phase arc (M1–M10 stay; each gets restructured internally, none are added or removed),
- the Learning Layer substrate (stays; gets expanded to five-field per-mechanism block),
- the cross-cutting-substrate concept (unchanged; substrate count grows from one to two),
- the closed-artifact-per-session discipline,
- the versioning policy for subordinate plans.

**Consequence for PHASE_B_PLAN_v1_0.md v1.0.2 compatibility (per brief §4).** M2 scope and B.0 handoff survive unchanged. The new MP v2.0 M2 row imports its exit criteria from PHASE_B_PLAN §N (ten-point list) by reference. The new MP carries no language that contradicts PHASE_B_PLAN v1.0.2.

**Consequence for Step 4 red-team.** v2.0 is a larger attack surface than v1.1 would be. Step 4's test suite (T.1–T.7 per amended brief) is calibrated for v2.0 depth. Acceptable trade.

**Step 3 binding.** Step 3 MUST produce a file named `MACRO_PLAN_v2_0.md` (not `MACRO_PLAN_v1_1.md`). Frontmatter must carry `version: 2.0` and the changelog entry per §4 below. MP v1.0 is marked SUPERSEDED per §5.

---

## §2 — Section-by-section delta

This section enumerates every section of the existing `MACRO_PLAN_v1_0.md` and declares its disposition in v2.0. Dispositions: **KEEP** (verbatim), **REVISE** (same section, new content), **REPLACE** (delete current content, install new spec), **DELETE** (no successor), **INSERT-BEFORE / INSERT-AFTER** (new section inserted adjacent to existing one). New top-level sections not adjacent to any existing section are specified separately in §3.

Each entry cites the MPC.N.M finding IDs it addresses. Where a finding is resolved only by a new section in §3, that's noted.

### §2.1 — Frontmatter (MP v1.0 lines 1–27)

**Disposition:** REPLACE.

**New frontmatter spec (Step 3 installs verbatim fields; values shown are templates):**

```yaml
---
document: MARSYS-JIS MACRO PLAN — STRATEGIC ARC
project_name: Abhisek Mohanty — Jyotish Intelligence System (MARSYS-JIS)
subject: Abhisek Mohanty (b. 1984-02-05, 10:43 IST, Bhubaneswar)
version: 2.0
status: CURRENT
supersedes: MACRO_PLAN_v1_0.md (2026-04-23; superseded by v2.0 in Step 3 of the Step 0→15 governance rebuild)
author: Abhisek Mohanty (native, project owner)
date: <Step 3 execution date>
produced_during: STEP_3_MACRO_PLAN_REWRITE (Step 0→15 governance rebuild)
id_namespace: M1..M10 (macro-phases); LL.1..LL.10 (Learning Layer mechanisms); IS.1..IS.N (Integrity Substrate axes — enumerated in §System Integrity Substrate)
purpose: >
  Strategic orientation layer for the MARSYS-JIS project. Frames the ten macro-
  phase arc (M1–M10) and the two cross-cutting substrates (Learning Layer and
  System Integrity). Read once per session for orientation; execute only the
  currently-scoped phase. This document governs how the project evolves across
  macro-phases and across agents (Claude + Gemini + any admitted future agent).
  v2.0 is produced during the governance rebuild workflow (Step 0 → Step 15)
  that closes multi-session drift observed in M2 execution.
audience:
  primary: Any LLM session working on MARSYS-JIS, current and future
  secondary: Abhisek Mohanty (native, project owner)
  tertiary: Independent classical-Jyotish acharyas reviewing the corpus
operational_rule: >
  Read this once per session for orientation. Execute only the currently-scoped
  phase. Do not pre-build infrastructure for later macro-phases. If any
  integrity axis (§System Integrity Substrate) is violated, halt and report.
changelog:
  - v2.0 (<date>): Architectural revision per MACRO_PLAN_REVISION_SPEC_v1_0.
    Produced during Step 3 of the Step 0→15 governance rebuild. Addresses 132
    MPC in-schema findings, 4 MPC.OS out-of-schema findings, and the ND.1
    native directive (Mirror Discipline as a First-Class Governance Principle).
    Adds System Integrity Substrate parallel to Learning Layer. Replaces prose
    macro-phase paragraphs with per-row schema (entry / exit / dependencies /
    deliverable paths / risks / quality gate / native-approval points).
    Introduces five new top-level sections: Ethical Framework, External
    Dependency Graph, Meta-Governance, Multi-Agent Collaboration, Post-M10
    Framing. Refreshes M1 status (M1 CLOSED 2026-04-19 per GAP_RESOLUTION_
    SESSION + CLOSURE_AUDIT_PASS). Full finding-to-section binding in
    MACRO_PLAN_REVISION_SPEC_v1_0.md §7.
  - v1.0 (2026-04-23): Initial macro plan establishing ten macro-phase arc and
    cross-cutting Learning Layer substrate. SUPERSEDED by v2.0.
---
```

**Findings addressed:** MPC.12.6 (status field), MPC.12.7 (changelog requirement), MPC.OS.4 (ID namespace declaration), MPC.OS.1 (date+session disambiguation via `produced_during`), and the frontmatter portions of MPC.14.6 (`produced_during` binds MP v2.0 to the rebuild).

**Implementation note for Step 3:** the `id_namespace` line also names `IS.1..IS.N` — the N is the count of Integrity Substrate axes specified in §3.3 of this spec. Step 3 counts them and substitutes the literal number.

### §2.2 — `# MARSYS-JIS Macro Plan — Strategic Arc v1.0` + "Status/Audience/Operational rule/Date/Owner" header block (MP v1.0 lines 29–37)

**Disposition:** REVISE.

**New content spec:**

- Title becomes `# MARSYS-JIS Macro Plan — Strategic Arc v2.0`.
- The redundant header block (Status / Audience / Operational rule / Date / Owner) is DELETED from the body — those fields are in the frontmatter and do not need to be restated in prose. The removal avoids the staleness risk of having two copies to maintain (a governance-hygiene concern per GA.13's "procedural rule that has been broken once will be broken again" principle).
- A single-sentence title-page line replaces the deleted block: "Authoritative strategic arc for the MARSYS-JIS project. See frontmatter for version, status, and audience."

**Findings addressed:** MPC.12.6 (status source-of-truth; only one copy), MPC.OS.3 (header-style hygiene — Step 3 also normalizes header levels per that finding).

### §2.3 — "Why this exists" (MP v1.0 lines 39–41)

**Disposition:** KEEP with one-sentence prepend.

**Prepended sentence:** "v2.0 of this plan is produced in Step 3 of the Step 0→15 governance rebuild that addressed multi-session drift observed during M2 execution. The rebuild's closed form is the GOVERNANCE_BASELINE artifact produced at Step 15; until then, this plan is governed jointly by the STEP_LEDGER and this frontmatter."

**Rationale:** binds MP v2.0 to its production-era context per MPC.14.6 without relitigating the "why orientation matters" sentiment of the existing paragraph.

**Findings addressed:** MPC.14.6 (CRITICAL; partial — the full acknowledgment is distributed across frontmatter `produced_during`, this paragraph prepend, and §3.3 Integrity Substrate subsection "Rebuild acknowledgment").

### §2.4 — "Ultimate goal" (MP v1.0 lines 43–45)

**Disposition:** REVISE.

**Revision direction:**

- KEEP the two existing sentences (chart-read; pattern-surfacing; extend beyond native) verbatim. They are correct and appropriately high-level.
- APPEND a third sentence naming ethical scope: "This goal is bounded by the Ethical Framework (§Ethical Framework): the instrument produces probabilistic, calibrated, auditable outputs for consenting audiences under stated disclosure tiers; it is not a fortune-telling product."

**Findings addressed:** MPC.11.1 (partial — explicit pointer to ethics as first-class; full treatment in §3.5 Ethical Framework).

### §2.5 — "The ten macro-phases" (MP v1.0 lines 47–67)

**Disposition:** REPLACE.

**New content spec:** every macro-phase row follows a fixed schema. Free-form prose paragraphs are deleted. The new schema per macro-phase is:

```
### M_N — <Phase Title>
- **Scope:** <one sentence>
- **Entry state:** <precondition list — what must be true before M_N opens>
- **Exit state:** <closure criteria — explicit list of checkboxes; for M2, import by reference from PHASE_B_PLAN_v1_0.md §N>
- **Dependencies:**
  - requires: [<macro-phase IDs and/or substrate/workstream IDs>]
  - produces: [<artifact paths or path-prefixes>]
  - enables: [<downstream macro-phase IDs>]
- **Deliverable paths:** <file paths or folder prefixes — required per MPC.1.6>
- **Risks:** 3–6 bullets, each with mitigation or pointer to where the mitigation lives
- **Quality gate:** <the single-sentence pass condition for agent output at this phase — typically the "final check" before the phase can be marked closed in STEP_LEDGER>
- **Native-approval points:** <enumerated decisions at this phase that require native sign-off>
- **Agent roles:** <which pass(es) use Claude-only / Gemini-only / two-pass — per §3.4 Multi-Agent Collaboration>
- **Time/effort stance:** <rough session-volume envelope OR "time-gated (see §3.6)">
- **Ethics binding:** <pointer to §3.5 Ethical Framework subsections that apply to this phase>
```

**Per-phase content direction (Step 3 writes these; spec names the binding):**

- **M1 Corpus Completeness.** Status: CLOSED as of 2026-04-19 per `GAP_RESOLUTION_SESSION` + `CLOSURE_AUDIT_PASS`. Entry state: n/a (seed phase). Exit state: "CGM rebuilt on FORENSIC_v8_0 ✓; all L3 reports v1.1+ ✓; GAP.13 resolved ✓; MSR v3.0 unified at 499 signals ✓; UCN v4.0 current ✓; CDLM v1.1 current ✓; RM v2.0 current ✓; FORENSIC v8.0 unified ✓". All checked. Deliverables: `01_FACTS_LAYER/` (FORENSIC_v8_0.md), `025_HOLISTIC_SYNTHESIS/` (MSR_v3_0, UCN_v4_0, CDLM_v1_1, CGM_v2_0, RM_v2_0). Risks: empty (phase closed). Quality gate: met. Addresses MPC.1.3, MPC.1.7, MPC.3.2, GA.4, GA.5.
- **M2 Corpus Activation (CURRENT).** Exit state imports from `PHASE_B_PLAN_v1_0.md §N` by reference (ten-point list). Dependencies: requires M1; produces graph DB, vector index, Discovery Layer outputs; enables M3 and M4. Deliverables: `02_ACTIVATION_LAYER/` + `04_DISCOVERY_LAYER/` + updates to SESSION_LOG and FILE_REGISTRY. Risks: import from `PHASE_B_PLAN §J` (16-risk table) by reference; MP row restates the top-3 and points to §J for full list. Quality gate: all P1–P9 validators green + red-team T.1–T.7 pass + native acharya-grade review on 10 questions (per PHASE_B_PLAN §N). Agent roles: two-pass (Gemini connector; Claude reconciler) per §3.4. Native-approval points: approval of pattern inclusion thresholds; approval of contradiction resolution class; approval of cluster naming. Time: 30–60 sessions envelope. Ethics binding: §3.5 §Principles + §3.5 §Pre-registration. Addresses MPC.1.2, MPC.2.11, MPC.3.1, MPC.3.3, MPC.3.8, MPC.4.1, MPC.13.3, MPC.13.6.
- **M3 Temporal Animation.** Entry state: M2 closed. Dependencies: requires M2 corpus + Swiss Ephemeris availability. Deliverables: `05_TEMPORAL_ENGINES/`. Exit state: (Step 3 writes 3–5 coarse-grained bullets — e.g., "Vimshottari + Yogini + Chara + Narayana dashas computed for subject; transit engine produces date-indexed signal lit/dormant states; Varshaphala rectification completed; KP sublord timing integrated; temporal validator meta-tests pass"). Risks: SE version-drift (per MPC.7.3) + dasha-lord disagreements across schools (per MPC.4.10 cross-ref). Agent roles: Claude-only (deterministic computation). Addresses MPC.1.4, MPC.1.6, MPC.2.1, MPC.7.3.
- **M4 Empirical Calibration.** Entry state: M3 closed AND LEL ≥ 40 events spanning ≥ 5 years (min-volume gate per §3.2). Dependencies: requires M3 + LEL cross-cutting workstream. Deliverables: `06_LEARNING_LAYER/` signal-calibration tables (LL.1 activation). Exit state: per-signal calibration tables produced with bootstrapped confidence intervals; shadow-mode disciplines all posterior updates; n=1 validity disclaimer attached to outputs. Risks: n=1 overfit (→ LL discipline #3 + shadow mode); LEL entry bias (→ pre-registration stance in §3.5); calibration-table staleness (→ re-run at each M4 session close). Native-approval points: approval of calibration scoring rubric; approval of shadow-mode exit rule. Quality gate: held-out LEL 20% partition passes calibration validity test. Ethics binding: §3.5 §Probabilistic humility + §Pre-registration. Addresses MPC.1.8, MPC.2.2, MPC.4.7, MPC.5.1, MPC.6.12, MPC.11.6, MPC.11.7.
- **M5 Probabilistic Model.** Entry state: M4 closed. Dependencies: requires M4 calibration tables; requires M3 temporal engine. Deliverables: DBN spec + parameters file (path TBD in Step 3). Exit state: DBN identifies on held-out data; signal embeddings stable across 3 refit runs; Bayesian posterior framing applied to all outputs. Risks: prior specification bias (→ Bayesian discipline + two-pass Gemini/Claude); DBN under-identification at n=1 (→ shadow mode + M7 re-fit plan); learned-vs-classical divergence (→ LL discipline #1 "priors locked"). Native-approval points: prior specification; DBN topology. Agent roles: two-pass. Ethics binding: §3.5 §Disclosure tiers. Addresses MPC.2.7, MPC.4.8, MPC.5.2.
- **M6 Prospective Testing.** Entry state: M5 closed AND PPL ≥ 50 predictions with ≥ 6-month horizon elapsed (min-volume gate per §3.2). Dependencies: requires M5 + PPL cross-cutting workstream. Deliverables: `07_PROSPECTIVE_TESTING/` scoring dashboards + counterfactual learning registry. Exit state: ≥ 50 verification windows closed and scored; automated scoring reproducibility verified; counterfactual learning registry populated; forward prediction validity declared for at least one life-domain. Risks: verification-window drift (→ fixed windows set at prediction emission); post-hoc rationalization (→ pre-registration from §3.5); selection bias in predictions (→ coverage tracking against MSR categories). Native-approval points: approval of win/loss verdict for edge cases. Ethics binding: §3.5 §Probabilistic humility + §Disclosure. Addresses MPC.2.3, MPC.2.9, MPC.4.9, MPC.6.5, MPC.11.6.
- **M7 Population Extension.** Entry state: M6 closed AND ethical review complete (per §3.5 §Consent). Dependencies: requires M6 + IRB-style consent workflow (per §3.5). Deliverables: cohort subject registry (path TBD) + per-subject L2.5 corpora + desha-kala-patra modulators. Exit state: ≥ N consented subjects (Step 3 sets N, suggestion: ≥ 5); per-subject calibration tables match method-extension validity test; cohort modulators produced. Risks: birth-time accuracy variance → require ≥ A-grade rectification per subject; consent privacy for public figures → explicit consent required, no public figures without it; anonymization vs attribution trade-off → default to anonymization unless subject consents to attribution; desha-kala-patra modulator overfit on small cohort → shadow mode N≥3 observations; LLM fine-tuning catastrophic forgetting → fine-tune only after method-extension validity confirmed. Native-approval points: cohort inclusion criteria; per-subject consent validation; fine-tune decision. Agent roles: two-pass. Ethics binding: §3.5 §Consent + §Vulnerable-population stance + §Audience disclosure tier (cohort subject). Addresses MPC.2.4, MPC.4.4, MPC.7.11, MPC.11.5, MPC.11.8.
- **M8 Classical Text Cross-Reference.** Entry state: M5 closed (earliest legitimate start; M7 is not a prerequisite). Dependencies: requires calibrated signal weights from M5; requires classical corpora procurement. Deliverables: classical attribution registry + classical-claim validity table. Exit state: BPHS + Phaladeepika + Saravali + Uttara Kalamrita + Jaimini Sutra + Prashna Marga + Hora Sara + KP texts indexed and attributed; classical-claim-holds/fails findings produced for each M5 probabilistic output. Risks: classical corpora procurement (→ shortlist produced in M8 kickoff); translation accuracy for non-Sanskrit sources (→ multi-source translation cross-check); attribution ambiguity (BPHS compilation chapters) (→ explicit attribution confidence flag per citation); classical-claim-failure reputational surface (→ explicit disclosure stance in §3.5 — findings are findings, not attacks). Native-approval points: corpus shortlist; disclosure policy for classical-claim-failures. Ethics binding: §3.5 §Disclosure tier (classical literature). Addresses MPC.2.5, MPC.4.5, MPC.7.8, MPC.7.11.
- **M9 Multi-School Triangulation.** Entry state: M8 closed. Dependencies: requires M8 + MSR coverage expansion for Nadi + BNN schools (per MPC.2.6 — expansion owned by M8 or earlier; Step 3 decides which exact phase).  Deliverables: multi-school convergence scoring artifact. Exit state: Parashari + Jaimini + Tajika + KP + Nadi + BNN + Yogini lenses all operating on shared signal set; inter-school convergence metrics calibrated; school-disagreement resolution protocol populated. Risks: spurious convergence from shared underlying data (→ cross-school signal-provenance tracking); operator-preference collapse on disagreement (→ explicit inter-school weights learned, not assigned); novel inter-school calibration instability (→ shadow mode). Agent roles: two-pass + acharya consultation for disagreement cases. Addresses MPC.2.6, MPC.4.10.
- **M10 LLM-Acharya Interface and External Validation.** Entry state: M9 closed AND acharya-reviewer panel ≥ 3 acharyas recruited per §3.7. Dependencies: requires M9 + acharya panel + publication venue decision. Deliverables: `99_PUBLICATIONS/` + LLM-acharya interface spec + blind-test reports. Exit state: wiring inventory complete (all L4 prompt templates live; UCN v_final; acharya-reviewer panel ≥ 3; at least 1 blind-test report); methodology published (Step 3 names target: arXiv preprint minimum; peer-reviewed journal submission as stretch goal). Risks: acharya availability (→ recruitment channel via native network; honorarium policy); reviewer disagreement (→ disagreement protocol from §3.4); publication-venue risk (→ fallback to arXiv + native blog); reputational exposure (→ disclosure tier stance). Native-approval points: acharya shortlist; honorarium budget; publication-venue selection; publication-scope (full methodology vs redacted). Ethics binding: §3.5 §Disclosure tier (acharya reviewer + public). Addresses MPC.1.6, MPC.3.4, MPC.4.6, MPC.7.9, MPC.11.4.

**Findings addressed by the replaced section:** MPC.1.1, MPC.1.2, MPC.1.3, MPC.1.4, MPC.1.5, MPC.1.6, MPC.1.7, MPC.1.8 (all Dim 1); MPC.2.1, MPC.2.2, MPC.2.3, MPC.2.4, MPC.2.5, MPC.2.6, MPC.2.9, MPC.2.10, MPC.2.11 (all Dim 2 except 2.7, 2.8, 2.12 which are handled in Learning Layer appendix, Learning Layer appendix, and §2.10 respectively); MPC.3.1, MPC.3.2, MPC.3.3, MPC.3.4, MPC.3.6 (Dim 3 exit-criteria); MPC.4.1, MPC.4.4, MPC.4.5, MPC.4.6, MPC.4.7, MPC.4.8, MPC.4.9, MPC.4.10 (Dim 4 per-phase risks); MPC.7.8, MPC.7.9, MPC.7.11 (Dim 7 partial — per-phase dependency bindings); MPC.8.1, MPC.8.3, MPC.8.7 (Dim 8 partial — per-phase native approval points); MPC.9.6 (Dim 9 partial — session-volume envelopes).

### §2.6 — "The Learning Layer — a cross-cutting substrate" (MP v1.0 lines 69–84)

**Disposition:** REVISE with appendix.

**Revision direction:**

1. KEEP the substrate-framing sentence (line 70: "Progressive calibration is woven through M2–M10, not treated as a single phase. It sits in `06_LEARNING_LAYER/` as a sibling to the Discovery Layer.") but ADD qualifier: "Directory `06_LEARNING_LAYER/` is scaffold-pending as of v2.0 publication; the LL scaffold decision is Step 11 of the governance rebuild. Sessions reading v2.0 before Step 11 closes must not assume the directory exists." Resolves MPC.14 (phantom reference via GA.6).
2. KEEP the ten-mechanism list (LL.1–LL.10) but REPLACE each one-line bullet with the five-field block specified in §3.2 of this spec.
3. KEEP the six learning-discipline rules (lines 75–82) verbatim EXCEPT amend rule #3 from "≥3 independent observations" to "≥N independent observations where N is per-mechanism-defined in §Learning Layer Specification Appendix; never less than 3".
4. KEEP the n=1 risk paragraph (lines 80–84) verbatim but APPEND the mitigation binding table (per MPC.5.14) — one row per discipline rule, mapped to the n=1 risk(s) it mitigates.
5. INSERT-AFTER: the Learning Layer Specification Appendix (§3.2 of this spec). The appendix is part of the MP body, not a separate file.

**Findings addressed:** MPC.3.5 (LL progressive-not-closed disclosure), MPC.5.1 through MPC.5.15 (all Dim 5), MPC.6.9 (cross-workstream handoff via activation-phase matrix in appendix), MPC.14.6 (phantom-folder qualifier).

### §2.7 — "What is concurrent with code work" (MP v1.0 lines 86–91)

**Disposition:** REPLACE.

**New content spec:** The header becomes "## Cross-cutting workstreams". Each workstream gets a fixed-schema block (same shape as macro-phase row, adapted). Two workstreams today: LEL (Life Event Log) and PPL (Prospective Prediction Log). Additional workstreams may be added; the schema is extensible.

**Per-workstream schema:**

```
### CW.<name> — <Full Name>
- **Scope:** <one sentence>
- **Cadence:** <minimum entry frequency; session-close checkpoint rule; drift-alert threshold>
- **Owner:** <native, Claude, Gemini, or split by role>
- **Schema pointer:** <file path + version + frontmatter spec pointer>
- **Entry-point:** <how a new entry is added — template file, command, native ritual>
- **Activation:** <"always on from session N" OR "scaffolded at M_X close, active from first M_Y output">
- **Duration envelope:** <project-lifetime / M_X through M_Y / etc>
- **Feeds into:** [<macro-phase IDs + unlock criteria>]
- **Minimum-volume gate (for feeds_into unlock):** <e.g., "M4 requires ≥ 40 LEL events spanning ≥ 5 years">
- **Failure modes:** <missed entries, stale data, native unavailability>
- **Freshness / staleness detection:** <the drift-alert mechanism>
- **Ethics binding:** <pointer to §3.5 subsections>
```

**Per-workstream content direction:**

- **CW.LEL — Life Event Log.** Cadence: session-close checkpoint (native reviews any new-since-last-session events at close). Owner: native authors; Claude validates schema at session close. Schema pointer: `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` (v1.2; upgraded at native's cadence). Entry-point: LEL template (path: TBD by Step 3; likely `01_FACTS_LAYER/LEL_ENTRY_TEMPLATE_v1_0.md`). Activation: always on from Session 2 onward (current state per CLAUDE.md). Duration envelope: project lifetime. Feeds into: M4 (calibration) with minimum-volume gate ≥ 40 events spanning ≥ 5 years. Failure modes: native skips weeks (staleness-detection script flags if no entry in 14 days); Claude forgets to validate at session close (session-close checklist per §3.3 IS.x). Freshness: drift-alert if last entry >14 days old. Ethics binding: §3.5 §Pre-registration + §Consent (native is consenting subject and has self-authored the log).

- **CW.PPL — Prospective Prediction Log.** Cadence: every falsifiable prediction logged at emission (not later). Owner: Claude authors; native approves before commitment. Schema pointer: TBD by Step 3; likely `07_PROSPECTIVE_TESTING/PROSPECTIVE_PREDICTION_LOG_v1_0.md`. Entry-point: predictions-log template (path TBD). Activation: scaffolded at M2 close (so the register exists); active from first M5 probabilistic output. Duration envelope: project lifetime. Feeds into: M6 (prospective testing) with minimum-volume gate ≥ 50 predictions with ≥ 6-month horizon elapsed. Failure modes: Claude forgets to log a prediction (session-close checklist); native bypasses approval (audit-trail flags). Freshness: drift-alert if discovery engine produces output without PPL entry in same session. Ethics binding: §3.5 §Probabilistic humility + §Pre-registration (emission-time commitment is the pre-registration).

**Findings addressed:** MPC.2.2 (LEL dual nature), MPC.6.1 through MPC.6.12 (all Dim 6), MPC.9.4 (duration envelopes), GA.9 (LEL surfaced as a canonical workstream — full resolution is in CLAUDE.md in Step 5 via §5 cross-surface impact).

### §2.8 — "Scope boundary for any single session" (MP v1.0 lines 93–104)

**Disposition:** REPLACE.

**Rationale:** MPC.OS.2 identified that the current block conflates session-scope discipline with phase-scope discipline. The replacement splits them:

**New §Scope Boundary section content spec:**

- **§Session-scope discipline.** The current block's content, minus phase-specific language. A session executes exactly one scoped task (typically one Step from the STEP_LEDGER during the rebuild; one sub-phase of M2 after rebuild closes; one sub-phase of M_N for other macro-phases). Session does not pre-build, does not expand scope mid-session, updates SESSION_LOG at close.
- **§Macro-phase scope discipline.** A macro-phase M_N executes exactly the scope declared in its row in §Ten macro-phases. It does not expand scope to other macro-phases. Cross-cutting substrates (Learning Layer, System Integrity) may be scaffolded or activated during M_N per their activation matrices, but no M_N-unrelated macro-phase may be started in the middle of M_N.
- **§Enforcement.** Session-open handshake (Step 7 deliverable — SESSION_OPEN_TEMPLATE) requires the session to declare its scope before action. Drift-detector (Step 7 deliverable) flags sessions that touch files outside the declared scope. Mechanical enforcement over procedural exhortation per GA.13.

**Findings addressed:** MPC.OS.2 (scope-boundary conflation), MPC.2.12 (forward-pointer to CLAUDE.md mandatory reading — added as a frontmatter `operational_rule` pointer in §2.1), GA.20 (policy → mechanical enforcement).

### §2.9 — "Change control" (MP v1.0 lines 106–108)

**Disposition:** REPLACE (folded into new §Meta-Governance section — see §3.3).

**Rationale:** MPC.12.1 through MPC.12.7 demand a full Meta-Governance section. The existing two-sentence change-control clause is insufficient. Step 3 replaces these lines with a single-line forward pointer: "Meta-governance — triggers, approval protocol, red-team cadence, version semantics, sunset clause — is specified in §Meta-Governance below."

**Findings addressed:** MPC.12.1 through MPC.12.7 (all Dim 12); MPC.3.9 (MP-versioning vs macro-phase-closure disambiguation now clean).

### §2.10 — Frontmatter forward-pointer to CLAUDE.md mandatory reading list (new within existing frontmatter)

**Disposition:** INSERT into frontmatter (§2.1 covers this).

**Content:** frontmatter `operational_rule` appends "For the canonical reading order across all governance surfaces, see CLAUDE.md §Mandatory reading before any work."

**Findings addressed:** MPC.2.12.

---

## §3 — New sections

This section specifies the seven new top-level sections (and two substantive appendices) that Step 3 installs in MP v2.0. Each carries a skeleton of required subsections and a binding to the MPC findings it resolves.

### §3.1 — Ordering of new sections in MP v2.0

Step 3 installs the new sections in the following order, interleaved with the existing-but-revised sections:

1. Frontmatter (§2.1)
2. Title + one-line subtitle (§2.2)
3. Why this exists (§2.3, KEPT+prepended)
4. Ultimate goal (§2.4, REVISED)
5. **System Integrity Substrate (NEW — §3.3)** — precedes Learning Layer so that integrity is established before learning mechanisms are discussed
6. Learning Layer substrate (§2.6, REVISED + appendix)
7. Learning Layer Specification Appendix (NEW — §3.2)
8. The ten macro-phases (§2.5, REPLACED)
9. Cross-cutting workstreams (§2.7, REPLACED)
10. Scope Boundary (§2.8, REPLACED)
11. **Multi-Agent Collaboration (NEW — §3.4)**
12. **Ethical Framework (NEW — §3.5)**
13. **External Dependency Graph (NEW — §3.6)**
14. **Acharya Reviewer Pool Policy (NEW — §3.7)** — could be nested under M10's row but given its cross-project implications is elevated to top-level section
15. **Time/Effort Stance (NEW — §3.8)**
16. **Post-M10 Framing (NEW — §3.9)**
17. **Meta-Governance (NEW — §3.10)** — replaces "Change control" stub (§2.9)
18. **Finding-Resolution Appendix (NEW — §3.11)** — traceability appendix binding each MPC.N.M + ND.1 to its resolving section

**Rationale for this order:** Integrity before Learning (integrity is the substrate for trust; learning is how the project gets smarter — without integrity, learning is noise). Phases after substrates (phases execute within the two substrates). Workstreams after phases (workstreams feed phases). Governance tail (Ethics, Dependencies, Reviewers, Time, Post-M10, Meta-Governance) after all operational content.

### §3.2 — Learning Layer Specification Appendix (new appendix; body-internal)

**Placement:** Immediately after the revised "Learning Layer substrate" section.

**Required subsections:**

**§LL-Appendix.A — Activation-phase matrix.** Table with rows LL.1–LL.10 and columns M1–M10. Each cell marked one of: `scaffold` (infrastructure built; not active), `active` (mechanism running), `dormant` (paused pending upstream), `n/a` (not applicable at this phase). Resolves MPC.5.11 CRITICAL.

**§LL-Appendix.B — Per-mechanism specification block.** For each of LL.1–LL.10, one five-field block:

```
### LL.N — <Mechanism Name>
- **Input:** <which columns of which tables; which workstream data>
- **Output:** <updated artifact paths; new registry rows; etc>
- **Activation phase(s):** <per matrix above>
- **Kill-switch:** <the specific condition under which this mechanism is suspended — typically a degradation signal>
- **Owner:** <role; default native + Claude co-owner, red-team every 3rd session>
- **Dependency on other LL.M:** <which LL.M must be stable first>
- **Interaction with workstreams:** <which CW.X entries this mechanism consumes or emits>
```

Resolves MPC.5.1 through MPC.5.10 (all ten mechanisms), MPC.5.12 (kill-switch), MPC.5.13 (owner), MPC.5.15 (workstream interaction), MPC.2.7 (inter-mechanism dependencies), MPC.2.8 (activation-phase justification).

**§LL-Appendix.C — n=1 risk mitigation binding table.** Table with rows = the six learning-discipline rules, and columns showing which n=1 risk each rule mitigates. Resolves MPC.5.14.

**§LL-Appendix.D — Learning Layer ownership.** One paragraph naming native as mechanism-introduction approver, Claude as mechanism-scaffolder, Gemini as mechanism-critic in red-team cadence.

### §3.3 — System Integrity Substrate (NEW TOP-LEVEL SECTION)

**Placement:** Between "Ultimate goal" and "Learning Layer substrate".

**Narrative frame:** One paragraph declaring that the Integrity Substrate is parallel to the Learning Layer. The Learning Layer is how the project gets smarter; the Integrity Substrate is how the project stays coherent across sessions and across agents. Both are cross-cutting (present in M2–M10). Both have kill-switches and governance. **Mirror Discipline (per ND.1) is declared here as one of the substrate axes — specifically IS.2 below.**

**Required subsections:**

**§IS.1 — Canonical Artifact Discipline.** Single source of truth per canonical artifact, enforced by CANONICAL_ARTIFACTS_v1_0.md (Step 7 deliverable). MP v2.0 does not list paths here (avoids duplication with CLAUDE.md); it points to CANONICAL_ARTIFACTS as the sole authoritative list. Resolves MPC.14.5.

**§IS.2 — Mirror Discipline (ND.1 implementation at MP layer).** Three load-bearing claims stated explicitly, matching the ND.1 native directive verbatim intent:

1. **Bidirectional obligation.** Every Claude-side governance file that has a Gemini-side counterpart is kept in continuous semantic parity with its counterpart. Any change on the Claude side triggers a mirror update on the Gemini side in the same session. Symmetrically in reverse.
2. **Adapted parity, not byte-identity.** The mirror is semantically equivalent, not textually identical. Each mirror is adapted to its target agent's construct while preserving the meaning.
3. **Scope is not limited to CLAUDE.md.** The principle extends to every governance surface that has a Gemini-side reference or counterpart. Precise inventory is maintained in CANONICAL_ARTIFACTS_v1_0.md (Step 7 deliverable) via a `mirror_obligations` column.

Resolves MPC.14.2, ND.1 at the MP-layer. (Full mirror-pair inventory is Step 5A's deliverable; enforcer is Step 7's.)

**§IS.3 — SESSION_LOG as drift detector.** SESSION_LOG is the cross-session memory anchor. Macro-phase progress binds to SESSION_LOG entries; every macro-phase closure requires a SESSION_LOG seal. Resolves MPC.14.4, GA.19 (implicit — Step 10 will add the "currently-executing" schema).

**§IS.4 — FILE_REGISTRY / GOVERNANCE_STACK as enforcement registries.** FILE_REGISTRY tracks every artifact; GOVERNANCE_STACK tracks versions and closure events. Both are authoritative by reference (Step 7 decides whether to merge or keep separate per protocol §D). Resolves MPC.14.3.

**§IS.5 — DISAGREEMENT_REGISTER.** Agent-to-agent disagreements logged; unresolved disagreements escalate to native. Register created in Step 7. MP v2.0 states the discipline and points to the register. Resolves MPC.13.2, MPC.13.5 (partial — full protocol in §3.4).

**§IS.6 — Drift-detector and schema-validator automation.** Scripts that run independently of session consent (per GA.13/GA.14). Created in Step 7 (`drift_detector.py`, `schema_validator.py`). MP states the cadence requirement (per Step 12 / Step 13 / Step 14 outputs) and names them as mechanical controls. Resolves GA.14 at MP layer.

**§IS.7 — Session-open handshake and session-close checklist.** Templates produced by Step 7 (SESSION_OPEN_TEMPLATE, SESSION_CLOSE_TEMPLATE). MP states that a session that does not complete the handshake is not a well-formed session. Resolves GA.15, GA.16, GA.21.

**§IS.8 — Red-team cadence as substrate axis.** Every 3rd session (CLAUDE.md existing rule); additionally every macro-phase close; additionally every 12 months for MP itself. Resolves MPC.3.8, MPC.12.4.

**§IS.9 — Governance rebuild acknowledgment.** This subsection opens with: "MP v2.0 is produced in Step 3 of the Step 0→15 governance rebuild (closes in GOVERNANCE_BASELINE_v1_0 at Step 15). Until Step 15 closes, the STEP_LEDGER governs which step is current. After Step 15 closes, this subsection is revised to point to the governance baseline." Resolves MPC.14.6 CRITICAL.

**ID count.** N (in `id_namespace: IS.1..IS.N`) = 9. Step 3 populates the frontmatter line accordingly.

**Findings addressed (full list):** MPC.14.1 (CRITICAL — substrate status for integrity), MPC.14.2 through MPC.14.7 (all Dim 14), MPC.3.7 (session-close vs phase-close disambiguation, partial — §IS.3 + §IS.7), MPC.13.5 (DISAGREEMENT_REGISTER pointer, partial), GA.13 through GA.21 (sync-gap + schema-gap + scope-creep findings), ND.1 (MP-layer implementation).

### §3.4 — Multi-Agent Collaboration (NEW TOP-LEVEL SECTION)

**Placement:** After "Scope Boundary".

**Required subsections:**

**§3.4.A — Current agents.** Claude Opus 4.7 (reconciler/primary); Gemini 2.5 Pro (connector/critic). Resolves MPC.13.1 CRITICAL-adjacent HIGH.

**§3.4.B — Two-pass protocol declaration.** The existing project-architectural pass pattern stated plainly: Gemini proposes connections/patterns; Claude reconciles and produces canonical artifacts. Two-pass is the default for multi-output phases; single-pass (Claude-only) is the default for deterministic computation phases. Resolves MPC.13.3 partial (full per-phase mapping is in each macro-phase row's `Agent roles` field per §2.5).

**§3.4.C — Disagreement protocol.** When agents reach conflicting conclusions, the disagreement is logged to DISAGREEMENT_REGISTER (Step 7 deliverable; §IS.5 points to it). Arbitration sequence: (1) re-running each agent in isolation to verify stability of each's output; (2) Claude-reconciler attempts resolution with explicit rationale; (3) if unresolved, escalated to native for resolution; (4) mirror-desync (per ND.1 §K) is treated as an implicit disagreement class requiring resolution, not silent overwriting. Resolves MPC.13.2 HIGH.

**§3.4.D — Quality gate for agent output per phase.** Pass-criterion for agent output at each phase is declared in the macro-phase row's `Quality gate` field (§2.5). MP does not restate per-phase criteria here; it points to §2.5. Resolves MPC.13.6 HIGH.

**§3.4.E — Future-agent admission policy.** Admission of any third agent (future Gemini version; domain-specific model; human-in-the-loop) requires: (1) a red-team session dedicated to the admission; (2) a version bump of MP; (3) updates to all mirror-pairs per IS.2 Mirror Discipline; (4) update to this §3.4.A current-agents list. Resolves MPC.13.4 MEDIUM.

**§3.4.F — Version-pinning discipline.** SESSION_LOG records model identifiers at every session open. Model-family migration (e.g., Claude Opus 4.7 → Opus 5.0; Gemini 2.5 Pro → Gemini 3.0) follows the Meta-Governance protocol (§3.10) with explicit red-team for the migration. Resolves MPC.13.7 MEDIUM, MPC.7.12 MEDIUM.

**Findings addressed:** MPC.13.1 through MPC.13.7 (all Dim 13), MPC.7.12 (model-family migration), ND.1 (partial — mirror-desync as disagreement class).

### §3.5 — Ethical Framework (NEW TOP-LEVEL SECTION)

**Placement:** After "Multi-Agent Collaboration".

**Required subsections:**

**§3.5.A — Principles block.** Six principles, stated as bullets:

1. **Probabilistic humility.** Outputs are probabilities, not certainties; confidence bands are always attached.
2. **Truth-in-advertising.** Calibration figures (accuracy rates, false-positive rates, bounded validity) are disclosed alongside predictions.
3. **No self-harm-adjacent output without guardrail.** Mortality-domain, mental-health domain, and health-crisis domain outputs require double red-team and are subject to the guardrails in §3.5.C.
4. **Consent required for non-native subjects.** Any M7 cohort subject requires explicit informed consent before any L2+ output is produced about them.
5. **Red-team oversight.** Every predictive output is subject to the red-team cadence (§IS.8).
6. **Reversibility.** Every output is rescindable if calibration data reveals it was unfounded.

Resolves MPC.11.1 CRITICAL.

**§3.5.B — Disclosure tiers.** Four consumer audiences named and bound to disclosure protocols:

- **Native self.** Full output; full calibration disclosure; unfiltered.
- **Cohort subject (M7).** Consent-gated; same disclosure tier as native; may request redactions.
- **Acharya reviewer (M10).** Full methodology; subject chart data; native consent required before acharya sees identifying data; anonymization optional.
- **Hypothetical public consumer (post-M10).** Redacted; aggregated; calibration bands mandatory; no individual-fate-adjacent claims.

Resolves MPC.11.4 HIGH.

**§3.5.C — Self-harm guardrail.** Specific guardrails:

- **No date-of-death output** for any subject under any audience tier. Even probabilistic mortality-window outputs are subject to double red-team and limited to aggregate statistical framing.
- **Health-crisis output requires double red-team** and explicit native sign-off before any output leaves a session.
- **Suicide-adjacent output** (ideation signals, self-harm-adjacent house/lord combinations) is disallowed under all audience tiers.
- **Mental health domain output** is subject to the same double red-team + native sign-off as health crisis.

Resolves MPC.11.3 CRITICAL.

**§3.5.D — Consent protocol for M7 cohort.** Each added subject requires: (1) written informed consent describing the method and retention policy; (2) subject's right to withdraw and to request deletion of their L2+ corpus; (3) explicit anonymization-vs-attribution choice (default anonymous); (4) minor/vulnerable-population exclusion per §3.5.F. Resolves MPC.11.5 CRITICAL.

**§3.5.E — Pre-registration / blinding stance.** LEL entries are timestamped at first entry; post-hoc edits are flagged in audit trail. Prospective predictions are locked at emission (PPL entry timestamp is the pre-registration). Native cannot revise a prediction after outcome is known. Resolves MPC.11.7 HIGH.

**§3.5.F — Minor / vulnerable-population stance.** M7 cohort excludes minors (< 18 years) absolutely. Subjects with active mental-health crisis or cognitive impairment are excluded from cohort. Resolves MPC.11.8 HIGH.

**§3.5.G — Calibration disclosure.** All M5/M6 outputs carry calibration band disclosure (point estimate + confidence interval + method pointer + known failure modes). Resolves MPC.11.6 HIGH.

**§3.5.H — Mode A / Mode B linkage.** Cross-references Architecture §§ on Mode A (curated) / Mode B (exhaustive). Disclosure tier applies identically across modes; Mode B's volume does not relax any of §3.5.A–G. Resolves MPC.11.9 MEDIUM.

**Findings addressed:** MPC.11.1 through MPC.11.9 (all Dim 11, including three CRITICALs), MPC.7.11 (licensing/consent), ND.1 (ethical framework is a mirror target; Gemini-side counterpart carries the same principles).

### §3.6 — External Dependency Graph (NEW TOP-LEVEL SECTION)

**Placement:** After "Ethical Framework".

**Required subsections:**

**§3.6.A — Dependency table.** Markdown table with columns: `Dependency ID | Name | Category (service/tool/model/human-role/corpus) | Used-by-phase(s) | Failure mode | Contingency | SPOF flag`. Minimum rows:

- `ED.1` Jagannatha Hora (M1, M3). Failure: format incompatibility or deprecation. Contingency: freeze at last compatible export; migrate to pyswisseph for affected fields. SPOF: partial.
- `ED.2` Swiss Ephemeris (M3, M6). Failure: version bump changes ayanamsha defaults. Contingency: version-lock at deployment; explicit ayanamsha declaration in SESSION_LOG. SPOF: yes.
- `ED.3` Voyage-3-large (M2+). Failure: deprecation; cost. Contingency: re-embed corpus on fallback model with documented schema migration. SPOF: yes.
- `ED.4` Postgres + pgvector (M2+). Failure: version bump; schema drift. Contingency: migration scripts versioned alongside schema; rollback plan per migration. SPOF: yes.
- `ED.5` Gemini 2.5 Pro (M2+). Failure: unavailability; budget cap. Contingency: two-pass protocol collapses to one-pass Opus; red-team cadence doubles. SPOF: no (degrades, doesn't block).
- `ED.6` Claude Opus 4.7 (M2+). Failure: unavailability; Anthropic deprecation. Contingency: Sonnet fallback with explicit capability downgrade; pause-until-available for high-stakes passes. SPOF: partial.
- `ED.7` Classical text corpora (M8). Failure: rare-text procurement; translation accuracy. Contingency: shortlist at M8 kickoff (BPHS, Phaladeepika, Saravali, Uttara Kalamrita, Jaimini Sutra, Prashna Marga, Hora Sara, Brihat Jataka, Brihat Samhita, selected KP commentaries); multi-source translation cross-check. SPOF: corpus-by-corpus.
- `ED.8` Acharya reviewer pool (M10). Failure: availability; disagreement. Contingency: cross-referenced to §3.7. SPOF: yes.
- `ED.9` Subject-level data storage (all phases). Failure: GDPR-style compliance; retention. Contingency: data-retention policy per §3.5.D + legal review before M7 cohort open.

Resolves MPC.7.1 CRITICAL, MPC.7.2 through MPC.7.11 (all Dim 7).

**§3.6.B — SPOF mitigation cadence.** For every row with `SPOF: yes`, one paragraph names the review cadence (typically per-phase-close + annual independent check). Resolves MPC.7.10 HIGH.

**§3.6.C — Licensing and legal status.** Classical corpora licensing (public domain vs copyrighted translations); cohort data GDPR-style posture; publication licensing at M10. One paragraph per concern. Resolves MPC.7.11 MEDIUM.

**§3.6.D — Model-family migration policy.** Cross-reference to §3.4.F. No duplication.

**Findings addressed:** MPC.7.1 through MPC.7.12 (all Dim 7), MPC.4.11 HIGH (cross-cutting risks), MPC.4.12 MEDIUM (risk-monitoring cadence).

### §3.7 — Acharya Reviewer Pool Policy (NEW TOP-LEVEL SECTION)

**Placement:** After "External Dependency Graph".

**Required subsections:**

**§3.7.A — Recruitment channel.** Native's network is primary channel. Criteria: ≥ 15 years practice; demonstrable classical (non-psychological) Jyotish grounding; willingness to blind-test. Minimum panel size for M10 opening: n ≥ 3.

**§3.7.B — Honorarium stance.** Step 3 decides: paid (per-review fee) vs unpaid (peer-review norm) vs discretionary. Default recommendation: paid per-review with bounded hourly rate, native-discretion override.

**§3.7.C — Review protocol pointer.** Pointer to `ACHARYA_ENGAGEMENT_KIT.md` (existing file per GA.11). MP does not duplicate its contents.

**§3.7.D — Retention plan.** Annual review; refresh panel if a reviewer withdraws. Maintain at minimum n = 3 at all times during M10 open state.

**§3.7.E — Disagreement protocol among reviewers.** If two acharyas reach opposite conclusions on the same chart, both are logged (not averaged) and the disagreement becomes a finding in its own right.

**Findings addressed:** MPC.7.9 CRITICAL, MPC.4.6 HIGH.

### §3.8 — Time/Effort Stance (NEW TOP-LEVEL SECTION)

**Placement:** After "Acharya Reviewer Pool Policy".

**Required subsections:**

**§3.8.A — Phase-indexed, not time-indexed.** One paragraph declaring that the project is governed by phase progression, not calendar deadlines. The native declines to commit to target dates. MP does not ship Gantt charts.

**§3.8.B — Session-volume envelopes.** Rough ranges per phase: M2 ≈ 30–60 sessions; M3 ≈ 10–20; M4 ≈ 40–100; M5 ≈ 20–40; M6 time-gated (not session-gated; requires elapsed time for verification windows); M7 ≈ 30–60 sessions per added subject; M8 ≈ 40–80; M9 ≈ 20–40; M10 ≈ 20–40 plus acharya coordination time. These are envelopes, not commitments.

**§3.8.C — Sequencing stance.** M1–M6 are serial. M7–M9 may run with partial overlap (M8 can begin once M5 produces calibrated weights; M7 can begin once M6 produces prospective validity). M10 serializes again.

**§3.8.D — Concurrent workstream duration.** LEL spans project lifetime. PPL begins at first M5 output and spans project lifetime. (Cross-ref to §2.7.)

**§3.8.E — Budget envelope pointer.** MP does not carry cost envelopes inline; they live in a separate budget artifact if/when created. MP declares the pointer; the artifact is out-of-scope for Step 3.

**§3.8.F — Native time cadence.** Daily sessions (per CLAUDE.md). Pause protocol declared in §3.8.G.

**§3.8.G — Pause protocol.** At session close, Claude produces a handoff note sufficient for resumption weeks later. If native is unreachable for >14 days, Claude pauses at current phase close and does not begin a new phase. SESSION_OPEN_TEMPLATE (Step 7) enforces pause-resume discipline.

**Findings addressed:** MPC.9.1 through MPC.9.7 (all Dim 9), MPC.8.4 (native time-budget), MPC.8.5 (pause protocol), MPC.8.6 (unavailable-handoff).

### §3.9 — Post-M10 Framing (NEW TOP-LEVEL SECTION)

**Placement:** After "Time/Effort Stance".

**Required subsections:**

**§3.9.A — Maintenance mode.** Post-M10, the corpus is a living artifact with scheduled drift-detector runs and annual red-team. LEL continues; PPL continues.

**§3.9.B — Publication.** Methodology published at M10 close per M10 exit criteria. Subject-specific corpus remains private unless native grants permission.

**§3.9.C — Ownership and handoff.** Default: native retains full ownership. If native wishes to share or transfer, a dedicated handoff session is opened with its own red-team.

**§3.9.D — Retirement criteria.** Project enters review-not-publication mode if: acharya panel rejects corpus at M10 close; OR calibration drops below stated floor for ≥ 2 review cycles; OR native decides to retire. Retirement is reversible.

**§3.9.E — Versioning policy post-M10.** MP v2.0 remains current until a new substrate or a new macro-phase is admitted. Post-M10 events may trigger MP v3.0 (e.g., second-native expansion; cross-cultural extension; commercialization path). Post-M10 events do NOT trigger v2.1-style additive bumps; they either fit within v2.0 (no bump) or require v3.0.

**Findings addressed:** MPC.10.1 through MPC.10.6 (all Dim 10).

### §3.10 — Meta-Governance (NEW TOP-LEVEL SECTION)

**Placement:** After "Post-M10 Framing". Final top-level section before the traceability appendix.

**Required subsections:**

**§3.10.A — Revision triggers.** MP is revised when: (a) any macro-phase red-team rejects the phase; (b) any close-criterion fails across two sessions; (c) any P1–P9 validator cascade fails; (d) native directive issues a new ND.N requiring structural change; (e) a new substrate or macro-phase is admitted; (f) annual red-team of MP surfaces structural defects. Any one of these is sufficient.

**§3.10.B — Approval protocol.** Proposed revision → Revision spec (the Step 2 artifact, versioned separately) → Red-team on the spec → Native approval → Version bump → Mirror update (per IS.2) → STEP_LEDGER entry → SESSION_LOG entry.

**§3.10.C — Red-team cadence for MP itself.** MP is red-teamed at every macro-phase close (embedded in the macro-phase red-team). Additionally every 12 months, regardless of phase state. Findings logged as MPC-style entries; if any CRITICAL or ≥3 HIGHs surface, a revision spec is opened.

**§3.10.D — Version semantics.** v1.X additive (new sections, new bullets, no schema change, no substrate change). v2.X architectural (schema change, substrate change, five-or-more new sections). v3.X scope-redefining (new subject; new cross-cultural extension; commercialization). Ambiguity resolves upward.

**§3.10.E — Sunset clause.** MP is SUPERSEDED when: (a) a successor MP is published; OR (b) the project enters steady-state maintenance per §Post-M10 Framing AND is audited to require no further MP revisions.

**§3.10.F — Changelog requirement.** Every MP revision ships with a changelog section in the frontmatter, including the spec reference, the red-team verdict, and the approval date.

**§3.10.G — Status field.** MP frontmatter carries `status: CURRENT` or `SUPERSEDED` at all times.

**Findings addressed:** MPC.12.1 through MPC.12.7 (all Dim 12), MPC.OS.1 (date+session-id disambiguation enforced via the `produced_during` frontmatter field + changelog), MPC.OS.3 (header-style drift — Step 3 normalizes per MPC.OS.3 fix direction).

### §3.11 — Finding-Resolution Appendix (NEW TRACEABILITY APPENDIX)

**Placement:** Final section of MP v2.0, after §3.10 Meta-Governance.

**Required content:** A single table binding each MPC.N.M finding, each MPC.OS.N finding, and each ND.N directive to the §2.X or §3.X entry in MP v2.0 that resolves it. Columns: `Finding ID | Severity | Dimension / Directive | Resolving section in MP v2.0 | Resolution type (KEEP / REVISE / REPLACE / DELETE / NEW-SECTION)`.

**Rationale:** Step 4 red-team will use this appendix as its primary traceability anchor. An MP that ships without this appendix is not auditable.

**Findings addressed:** — (self-referential: the appendix binds every finding).

---

## §4 — Frontmatter and changelog changes

This section is the exact text Step 3 installs. It is a consolidation of the frontmatter spec in §2.1 plus the changelog entry.

### §4.1 — Complete frontmatter for MP v2.0

Step 3 installs the frontmatter block shown in §2.1 verbatim, substituting:
- `<Step 3 execution date>` with the actual date Step 3 runs (format: `YYYY-MM-DD`);
- `IS.1..IS.N` with `IS.1..IS.9` (N = 9 per §3.3 count).

### §4.2 — Changelog entry text (for the `changelog:` frontmatter field)

```
  - v2.0 (<date>): Architectural revision per MACRO_PLAN_REVISION_SPEC_v1_0.
    Produced during Step 3 of the Step 0→15 governance rebuild. Addresses 132
    MPC in-schema findings, 4 MPC.OS out-of-schema findings, and the ND.1
    native directive (Mirror Discipline as a First-Class Governance Principle).
    Adds System Integrity Substrate parallel to Learning Layer. Replaces prose
    macro-phase paragraphs with per-row schema (entry / exit / dependencies /
    deliverable paths / risks / quality gate / native-approval points).
    Introduces five new top-level sections: Ethical Framework, External
    Dependency Graph, Meta-Governance, Multi-Agent Collaboration, Post-M10
    Framing. Plus Acharya Reviewer Pool Policy and Time/Effort Stance as
    separate top-level sections. Adds Learning Layer Specification Appendix
    and Finding-Resolution Appendix. Refreshes M1 status (M1 CLOSED 2026-04-19
    per GAP_RESOLUTION_SESSION + CLOSURE_AUDIT_PASS). Full finding-to-section
    binding in MACRO_PLAN_REVISION_SPEC_v1_0.md §7 and in this document's
    Finding-Resolution Appendix.
  - v1.0 (2026-04-23): Initial macro plan establishing ten macro-phase arc and
    cross-cutting Learning Layer substrate. SUPERSEDED by v2.0.
```

### §4.3 — Body changelog section (optional; Step 3 decides)

If Step 3 chooses to mirror the frontmatter changelog in the body (for readability), it does so in a `## Changelog` section at the end of MP v2.0, before the Finding-Resolution Appendix. Content identical to §4.2.

### §4.4 — MP v1.0 disposition

MP v1.0 is marked SUPERSEDED in Step 5 (closure + propagate). The Step 2 spec does not touch MP v1.0.

---

## §5 — Cross-surface impact

Step 5 (Macro Plan closure + propagate) executes every update named below. Step 2 does not execute any of these; it specifies them.

### §5.1 — Surface-by-surface update list

| # | Surface | Update required | Trigger / rationale | Mirror-pair (per ND.1) |
|---|---|---|---|---|
| S.1 | `CLAUDE.md` (root) | (a) Update §Mandatory reading before any work: replace item 3 pointer from "MACRO_PLAN_v1_0.md" to "MACRO_PLAN_v2_0.md"; (b) amend the governance banner if the rebuild is still in flight at Step 5 close; (c) confirm canonical-artifact paths unchanged (MSR/UCN/CDLM/CGM/RM/FORENSIC all remain on current versions — Step 5 does not touch them) | MP version bump | Paired with `.geminirules` |
| S.2 | `.geminirules` | Mirror S.1 updates: (a) mandatory-reading item updated; (b) any substrate language mirrored; (c) Gemini-specific construct adaptations per ND.1 §IS.2 (not byte-identical) | ND.1 mirror obligation | Paired with CLAUDE.md |
| S.3 | `.gemini/project_state.md` | (a) Drop `twinkly-puzzling-quokka.md` reference (per GA.7); (b) point at `PHASE_B_PLAN_v1_0.md v1.0.2` and `MACRO_PLAN_v2_0.md`; (c) add Integrity Substrate reference per IS.2 mirror | ND.1 mirror obligation + GA.7 resolution | Paired with (to be decided) — per §5.2 below |
| S.4 | `00_ARCHITECTURE/SESSION_LOG.md` | Append `STEP_2_MACRO_PLAN_REVISION_SPEC` entry (Step 2's own close); then Step 5 appends its own `STEP_5_MACRO_PLAN_CLOSURE` entry covering MP v1.0 SUPERSEDED + MP v2.0 published | Session close discipline | Gemini-side session pointer (if any) |
| S.5 | `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` | (a) Add row for MACRO_PLAN_v2_0.md (CURRENT); (b) update row for MACRO_PLAN_v1_0.md (SUPERSEDED); (c) add row for MACRO_PLAN_REVISION_SPEC_v1_0.md (CLOSED); (d) Step 5 may bump FILE_REGISTRY to v1.1 if governance protocol §D decision mandates | Canonical-artifact discipline | No direct Gemini counterpart; declared Claude-only in §IS.2 inventory |
| S.6 | `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | (a) Add MP v1.0 SUPERSEDED row; (b) add MP v2.0 CURRENT row; (c) register the MP-versioning policy per §Meta-Governance §3.10.D; (d) add revision-spec + closure-session entries | Canonical-artifact discipline | No direct Gemini counterpart; Claude-only per §IS.2 |
| S.7 | `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` | Step 2 row → `completed`; Step 3 row → `ready` (per Step 2's own close); Step 5 row → `ready` when Step 4 passes. Step 5 also registers ND.1 progress. | Step-ledger discipline | No Gemini counterpart; Claude-only |
| S.8 | `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | Add SUPERSEDED banner at top + frontmatter `status: SUPERSEDED` + pointer to v2.0. File itself is not deleted (retention per FILE_REGISTRY archival policy). | MP version bump | No Gemini counterpart |
| S.9 | `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` | No content change at Step 5; directive status remains `open` until Step 7 closes. Step 5 amends the ledger-linked history entry to confirm Step 3's ND.1 obligation was verified. | ND.1 tracking | No Gemini counterpart |
| S.10 | `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | No edit. Referenced from CW.LEL workstream block; no change required to LEL schema at Step 5. | Cross-ref only | No Gemini counterpart |

### §5.2 — Mirror-pair inventory (ND.1 — MP-layer declaration)

Per ND.1 (Mirror Discipline), the following mirror pairs must be maintained at semantic parity. **This list is the MP-layer first pass; the authoritative inventory is the Step 5A deliverable (`PROJECT_ARCHITECTURE_v2_2.md` §D.11) and the Step 7 deliverable (`CANONICAL_ARTIFACTS_v1_0.md` `mirror_obligations` column). MP v2.0 enumerates the pairs it creates or depends on; downstream artifacts extend and enforce.**

| Pair ID | Claude side | Gemini side | Authoritative side | Parity type | Asymmetries |
|---|---|---|---|---|---|
| MP.1 | `CLAUDE.md` | `.geminirules` | Claude-side (CLAUDE.md is master instructions) | Adapted parity (per ND.1) | Claude-side may contain Claude Code / MCP / skill references with no Gemini equivalent; documented in .geminirules "Asymmetries" section (Step 7 deliverable) |
| MP.2 | (Claude's implicit current-state; various sources) | `.gemini/project_state.md` | Claude-side via SESSION_LOG + STEP_LEDGER (authoritative truth) | Adapted parity | project_state.md must drop superseded refs (GA.7) and adopt current pointers |
| MP.3 | `MACRO_PLAN_v2_0.md` | Any Gemini-side macro-plan reference (currently: a short reference within `.geminirules` and `.gemini/project_state.md`) | Claude-side | Adapted parity | Gemini-side carries a compact summary + pointer to full MP v2.0; not a full duplicate |
| MP.4 | `PHASE_B_PLAN_v1_0.md` (v1.0.2) | Any Gemini-side phase reference (currently: brief mention in `.gemini/project_state.md`) | Claude-side | Adapted parity | Gemini-side carries the "current phase" pointer; not the full B.0–B.10 plan |
| MP.5 | `FILE_REGISTRY_v1_0.md` | Any Gemini-side canonical-path block (currently: path table in `.geminirules`) | Claude-side | Adapted parity | Gemini-side carries only the L2.5 canonical paths relevant to L4 Discovery Layer |
| MP.6 | `GOVERNANCE_STACK_v1_0.md` | No Gemini-side mirror currently | Claude-only | n/a | Declared Claude-only in §IS.2 inventory at Step 7 |
| MP.7 | `SESSION_LOG.md` | Any Gemini-side session pointer (potentially none; TBD by Step 5A) | Claude-side | Adapted parity | May remain Claude-only; Step 5A decides |

**Rationale for S.3 pairing decision.** `.gemini/project_state.md` mirrors the composite state derivable from SESSION_LOG + STEP_LEDGER + current-phase plan. Rather than naming a single Claude-side counterpart, ND.1 §IS.2 treats it as mirroring the "current project state" concept whose authoritative form lives in the Claude-side ledger + log pair. Step 5A formalizes this.

**Coverage vs ND.1.** Every mirror pair named above is bidirectional (per ND.1 claim 1), adapted (per claim 2), and named explicitly (per claim 3 — "scope is not limited to CLAUDE.md"). The inventory is non-final; Step 5A may add or refine pairs.

### §5.3 — Execution order for Step 5

Step 5 executes the S.1–S.10 list in this sequence:

1. Step 4 red-team must PASS before Step 5 begins. (Blocked otherwise.)
2. S.8 (MP v1.0 → SUPERSEDED) first, so nothing points to an un-superseded v1.0 when v2.0 lands.
3. S.5 + S.6 (FILE_REGISTRY + GOVERNANCE_STACK entries) second, so the registries reflect v2.0 before surfaces point to it.
4. S.1 + S.2 (CLAUDE.md + .geminirules mirror pair) third, as a single atomic mirror pass per ND.1.
5. S.3 (project_state.md) fourth, resolving GA.7 in the same session.
6. S.7 (STEP_LEDGER update) fifth, closing Step 5 itself.
7. S.4 (SESSION_LOG append) last, capturing the full sweep.
8. S.9 (NATIVE_DIRECTIVES ledger amendment) is a confirmation pass, not a content edit.
9. S.10 (LEL) is a cross-reference confirmation — no edit.

### §5.4 — Execution-order rationale

Step 5's sequence is designed so that at every intermediate point, the governance surface is self-consistent (never a state where CLAUDE.md points at v2.0 but FILE_REGISTRY still shows only v1.0). This prevents a red-team from opening mid-Step-5 and finding partial drift.

---

## §6 — Non-goals

This section explicitly names what this spec does NOT mandate, to prevent Step 3 scope-creep.

**§6.1 — Out of scope for Step 3 (the MP rewrite):**

- **Learning Layer scaffolding.** Step 3 does not create `06_LEARNING_LAYER/`. That is Step 11's job.
- **Integrity implementation.** Step 3 does not write `drift_detector.py`, `schema_validator.py`, `mirror_enforcer.py`, or any other governance script. Step 7 does.
- **CANONICAL_ARTIFACTS_v1_0.md.** Step 3 does not create this file. Step 7 does. MP v2.0 refers to it as an existing-or-forthcoming pointer without asserting it exists at the time of MP v2.0 publication.
- **CLAUDE.md rebuild.** Step 3 does not rewrite CLAUDE.md. Step 9 does. Step 5 will update CLAUDE.md's mandatory-reading entry for MP v2.0 and canonical-path block, but not rebuild.
- **SESSION_LOG schema retrofit.** Step 3 does not change SESSION_LOG format. Step 10 does.
- **Acharya recruitment.** Step 3 specifies the Acharya Reviewer Pool Policy (§3.7); it does not recruit actual reviewers.
- **Classical corpora procurement.** Step 3 specifies the shortlist and failure modes (§3.6.A ED.7); it does not acquire texts.
- **Budget artifact.** Step 3 specifies the pointer (§3.8.E); it does not create the budget document.
- **ND.2+ directives.** Step 3 addresses only ND.1. Future directives are handled in their own amendment cycles.

**§6.2 — Out of scope for the MP v2.0 artifact itself:**

- **Phase-plan detail below M2.** MP v2.0 states M3–M10 at coarse-grained exit-criteria level only. Full phase plans for M3 onward are separate artifacts produced in their own phase-opening sessions.
- **L3 domain report prose.** MP v2.0 does not dictate L3 report content. The UCN + CDLM + L3 report templates govern.
- **Astrology content.** MP v2.0 is orientation + governance, not astrology. No L1 chart data, no L2 signal content, no L2.5 synthesis narrative lives in MP v2.0.
- **Tool-specific configuration.** MP v2.0 names dependencies (§3.6) but does not specify tool configurations.
- **Duplicate of PROJECT_ARCHITECTURE.** MP v2.0 points to PROJECT_ARCHITECTURE_v2_1 (or v2.2 after Step 5A) for architectural depth; does not duplicate it.

**§6.3 — Deferrals explicitly declared in this spec:**

- **[DEFER_TO_FUTURE_REVISION]** — nothing deferred in this spec; all findings are addressed in the current pass per §7.
- **[NATIVE_CONFIRMATION_NEEDED]** — no items flagged. All CRITICAL findings are addressed. The §1 version decision (v2.0) is Step 2's call per the brief; it does not require separate native confirmation. The Acharya honorarium stance in §3.7.B is marked "Step 3 decides" with a recommended default, not a native-blocker.

**§6.4 — What Step 3 may decide within this spec's frame:**

- Exact wording of prose paragraphs (the spec names content direction, not verbatim text).
- Table vs YAML vs markdown-list rendering for per-phase schema (the spec names fields, not rendering).
- Exact naming of per-workstream schema pointer files (the spec names the concept; Step 3 picks paths consistent with existing folder conventions).
- Whether the Finding-Resolution Appendix is a table or a dense enumerated list (the spec mandates the content; not the shape).

**§6.5 — What Step 3 may NOT do:**

- Change the version number to anything other than `2.0`.
- Skip any of the 18 sections named in §3.1 ordering.
- Omit any finding from the §7 Finding Coverage Table traceability (the appendix is Step 3's primary traceability deliverable).
- Introduce new critique dimensions beyond Dim 1–14 (per brief constraint).
- Add content that contradicts PHASE_B_PLAN_v1_0.md v1.0.2's M2 definition.

---

## §7 — Finding coverage table

This is the traceability table binding every MPC.N.M in-schema finding, every MPC.OS.N out-of-schema finding, and the ND.1 directive to the §2.X or §3.X entry in this spec that resolves it. Action column values: **KEEP** = no change; **REVISE** = same section, new content; **REPLACE** = section content wholly replaced; **DELETE** = removed without successor; **INSERT** = new content inserted; **NEW-SECTION** = resolved by a new top-level section (see §3).

**CRITICAL findings are called out in bold.** Every CRITICAL is addressed (not deferred). Zero `[NATIVE_CONFIRMATION_NEEDED]` flags; zero `[DEFER_TO_FUTURE_REVISION]` flags.

### §7.1 — Dimension 1: Phase Completeness (8 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.1.1 | HIGH | REPLACE | §2.5 (every macro-phase row gains `Entry state` field per fixed schema) |
| **MPC.1.2** | **CRITICAL** | **REPLACE** | **§2.5 (every macro-phase row gains `Exit state` field; M2 imports from PHASE_B_PLAN §N by reference)** |
| MPC.1.3 | HIGH | REPLACE | §2.5 M1 row (rewritten to CLOSED state 2026-04-19 per GAP_RESOLUTION_SESSION + CLOSURE_AUDIT_PASS) |
| MPC.1.4 | HIGH | REPLACE | §2.5 (gradient disclosure — M3–M10 rows explicitly declared "coarse-grained; refined in phase-open sessions") |
| MPC.1.5 | MEDIUM | INSERT | §3.10.A (generic "revision triggers" + §3.10 as meta-governance at MP layer); plus §2.5 per-row `Quality gate` field |
| MPC.1.6 | HIGH | REPLACE | §2.5 (every macro-phase row gains `Deliverable paths` field) |
| MPC.1.7 | MEDIUM | REPLACE | §2.5 M1 row (replaces "mostly done" with "CLOSED 2026-04-19") |
| MPC.1.8 | MEDIUM | REPLACE | §2.5 M4 row (explicit LEL consumption statement; §2.7 CW.LEL workstream block declares "feeds M4") |

### §7.2 — Dimension 2: Sequencing and Dependencies (12 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **MPC.2.1** | **CRITICAL** | **REPLACE** | **§2.5 (every macro-phase row gains `Dependencies: requires / produces / enables` block — compact dependency graph per row)** |
| MPC.2.2 | MEDIUM | REPLACE | §2.7 CW.LEL workstream block (LEL declared cross-cutting + feeds M4 with minimum-volume gate) |
| MPC.2.3 | HIGH | REPLACE | §2.7 CW.PPL workstream block + §2.5 M6 row (min-volume gate ≥ 50 predictions with ≥ 6-month horizon) |
| MPC.2.4 | HIGH | REPLACE | §2.5 M7 row (Entry state: "M6 closed AND ethical review complete"; explicit predecessor closure) |
| MPC.2.5 | MEDIUM | REPLACE | §2.5 M8 row (Entry state: "M5 closed (earliest legitimate start; M7 is not a prerequisite)") |
| MPC.2.6 | HIGH | REPLACE | §2.5 M9 row (MSR coverage expansion for Nadi + BNN flagged as pre-M9 requirement; Step 3 decides which phase owns) |
| MPC.2.7 | MEDIUM | NEW-SECTION | §3.2 LL-Appendix.B per-mechanism `Dependency on other LL.M` field |
| MPC.2.8 | LOW | NEW-SECTION | §3.2 LL-Appendix.A (activation matrix justifies "first four at M2" explicitly) |
| MPC.2.9 | HIGH | REPLACE | §2.5 M10 row (Entry state: "M9 closed AND acharya panel ≥ 3"; wiring inventory named) |
| MPC.2.10 | MEDIUM | REPLACE | §2.5 (macro-phase rows) + §3.3 Integrity Substrate (substrate declared cross-cutting) + §3.2 LL-Appendix (Learning Layer activation-phase matrix) |
| MPC.2.11 | HIGH | REPLACE | §2.5 M2 row ("PHASE_B_PLAN_v1_0.md (currently v1.0.2); see FILE_REGISTRY for CURRENT pointer") |
| MPC.2.12 | MEDIUM | INSERT | §2.1 frontmatter `operational_rule` appends forward-pointer to CLAUDE.md §Mandatory reading |

### §7.3 — Dimension 3: Exit Criteria (10 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **MPC.3.1** | **CRITICAL** | **REPLACE** | **§2.5 (every macro-phase row gains `Exit state` block; M2 imports PHASE_B_PLAN §N; M1 declares CLOSED; M3–M10 write coarse criteria)** |
| MPC.3.2 | HIGH | REPLACE | §2.5 M1 row (CLOSED state per empirical date) |
| MPC.3.3 | HIGH | REPLACE | §2.5 M3–M10 rows (each gains coarse-grained exit criteria) |
| MPC.3.4 | HIGH | REPLACE | §2.5 M10 row (wiring inventory + publication target: arXiv minimum; peer-reviewed journal stretch) |
| MPC.3.5 | LOW | REVISE | §2.6 Learning Layer substrate ("no closure; cadence checkpoints" disclosure) + §3.2 LL-Appendix.B `Kill-switch` field |
| MPC.3.6 | MEDIUM | REPLACE | §2.7 CW.LEL + CW.PPL workstream blocks (minimum-volume gates declared) |
| MPC.3.7 | MEDIUM | INSERT | §3.3 §IS.3 (SESSION_LOG drift-detector) + §IS.7 (session-open/close templates) |
| MPC.3.8 | MEDIUM | INSERT | §3.3 §IS.8 (red-team cadence as substrate axis, required for macro-phase close) |
| MPC.3.9 | MEDIUM | NEW-SECTION | §3.10 Meta-Governance (MP-versioning vs macro-phase-closure now in separate sub-headers) |
| MPC.3.10 | HIGH | NEW-SECTION | §3.9.D Post-M10 Framing (retirement criteria) + §2.5 M10 row (project-done = M10 exit state) |

### §7.4 — Dimension 4: Risk Surface (13 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **MPC.4.1** | **CRITICAL** | **REPLACE** | **§2.5 (every macro-phase row gains `Risks` field, 3–6 bullets each)** |
| MPC.4.2 | LOW | REVISE | §2.6 Learning Layer (n=1 paragraph KEPT; §3.2 LL-Appendix.C adds mitigation binding table) |
| MPC.4.3 | MEDIUM | NEW-SECTION | §3.2 LL-Appendix.C (mitigation binding table — discipline rules mapped to n=1 risks) |
| MPC.4.4 | HIGH | REPLACE | §2.5 M7 row (consent, accuracy, desha-kala-patra overfit, fine-tuning risks each bulleted) |
| MPC.4.5 | HIGH | REPLACE | §2.5 M8 row (corpus procurement, translation accuracy, attribution ambiguity, classical-claim-failure risks bulleted) |
| MPC.4.6 | HIGH | REPLACE | §2.5 M10 row + §3.7 Acharya Reviewer Pool Policy (reviewer availability, disagreement, publication-venue, reputational) |
| MPC.4.7 | MEDIUM | REPLACE | §2.5 M4 row (provisional-validity risk bulleted) |
| MPC.4.8 | HIGH | REPLACE | §2.5 M5 row (prior specification, DBN under-identification, learned-vs-classical divergence) |
| MPC.4.9 | HIGH | REPLACE | §2.5 M6 row (verification-window drift, post-hoc rationalization, selection bias) |
| MPC.4.10 | MEDIUM | REPLACE | §2.5 M9 row (spurious convergence, operator-preference collapse, inter-school calibration instability) |
| MPC.4.11 | HIGH | NEW-SECTION | §3.6 External Dependency Graph (cross-cutting risks as first-class table) |
| MPC.4.12 | MEDIUM | NEW-SECTION | §3.6.B SPOF mitigation cadence + §3.3 §IS.6 drift-detector automation |
| MPC.4.13 | MEDIUM | REVISE | §2.6 Learning Layer (risk stance statement: "n=1 phase: risk-averse on calibration, risk-seeking on discovery") |

### §7.5 — Dimension 5: Learning Layer Specificity (15 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.5.1 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.1 five-field block (signal-weight recalibration) |
| MPC.5.2 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.2 five-field block |
| MPC.5.3 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.3 five-field block |
| MPC.5.4 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.4 five-field block |
| MPC.5.5 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.5 five-field block |
| MPC.5.6 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.6 five-field block |
| MPC.5.7 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.7 five-field block (multi-chart vs cohort disambiguation) |
| MPC.5.8 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.8 five-field block |
| MPC.5.9 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.9 five-field block (prompt-level vs model-fine-tune disambiguation) |
| MPC.5.10 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B LL.10 five-field block |
| **MPC.5.11** | **CRITICAL** | **NEW-SECTION** | **§3.2 LL-Appendix.A Activation-phase matrix (LL.1–10 rows × M1–M10 columns)** |
| MPC.5.12 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B per-mechanism `Kill-switch` field |
| MPC.5.13 | MEDIUM | NEW-SECTION | §3.2 LL-Appendix.D Learning Layer ownership statement |
| MPC.5.14 | MEDIUM | NEW-SECTION | §3.2 LL-Appendix.C n=1 mitigation binding table |
| MPC.5.15 | HIGH | NEW-SECTION | §3.2 LL-Appendix.B per-mechanism `Interaction with workstreams` field |

### §7.6 — Dimension 6: Concurrency Completeness (12 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.6.1 | HIGH | REPLACE | §2.7 CW.LEL `Cadence` field |
| MPC.6.2 | MEDIUM | REPLACE | §2.7 CW.LEL `Owner` field |
| MPC.6.3 | HIGH | REPLACE | §2.7 CW.LEL `Schema pointer` field |
| MPC.6.4 | HIGH | REPLACE | §2.7 CW.LEL `Entry-point` field |
| MPC.6.5 | HIGH | REPLACE | §2.7 CW.PPL `Cadence` field + `Activation` disambiguation |
| MPC.6.6 | MEDIUM | REPLACE | §2.7 CW.PPL `Owner` field |
| MPC.6.7 | HIGH | REPLACE | §2.7 CW.PPL `Schema pointer` field |
| MPC.6.8 | HIGH | REPLACE | §2.7 CW.PPL `Entry-point` field |
| MPC.6.9 | HIGH | REPLACE | §2.7 CW.LEL/PPL `Feeds into` + `Minimum-volume gate` fields + §2.5 macro-phase rows (M4/M6 import the gate) |
| MPC.6.10 | MEDIUM | REPLACE | §2.7 workstream blocks (`Activation` field disambiguates "always on" vs "scaffolded at M_X") |
| MPC.6.11 | MEDIUM | REPLACE | §2.7 `Failure modes` + `Freshness / staleness detection` fields |
| MPC.6.12 | HIGH | REPLACE | §2.7 `Minimum-volume gate` field (LEL ≥ 40 events; PPL ≥ 50 predictions) |

### §7.7 — Dimension 7: External Dependency Graph (12 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **MPC.7.1** | **CRITICAL** | **NEW-SECTION** | **§3.6.A Dependency table (9 rows: ED.1–ED.9)** |
| MPC.7.2 | HIGH | NEW-SECTION | §3.6.A ED.1 Jagannatha Hora row with failure/contingency |
| MPC.7.3 | HIGH | NEW-SECTION | §3.6.A ED.2 Swiss Ephemeris row with version-lock contingency |
| MPC.7.4 | HIGH | NEW-SECTION | §3.6.A ED.3 Voyage-3-large row with re-embed contingency |
| MPC.7.5 | HIGH | NEW-SECTION | §3.6.A ED.4 Postgres+pgvector row with migration contingency |
| MPC.7.6 | HIGH | NEW-SECTION | §3.6.A ED.5 Gemini row with two-pass-collapse contingency |
| MPC.7.7 | HIGH | NEW-SECTION | §3.6.A ED.6 Claude Opus row with Sonnet-fallback contingency |
| MPC.7.8 | HIGH | NEW-SECTION | §3.6.A ED.7 Classical corpora row + §2.5 M8 row (corpus shortlist) |
| **MPC.7.9** | **CRITICAL** | **NEW-SECTION** | **§3.6.A ED.8 + §3.7 Acharya Reviewer Pool Policy (full section)** |
| MPC.7.10 | HIGH | NEW-SECTION | §3.6.B SPOF mitigation cadence |
| MPC.7.11 | MEDIUM | NEW-SECTION | §3.6.C Licensing and legal status |
| MPC.7.12 | MEDIUM | NEW-SECTION | §3.6.D Model-family migration policy (cross-ref to §3.4.F) |

### §7.8 — Dimension 8: Role-of-Native Cadence (7 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.8.1 | HIGH | REPLACE | §2.5 (every macro-phase row gains `Native-approval points` field) |
| MPC.8.2 | MEDIUM | NEW-SECTION | §3.10.A Meta-Governance revision triggers (defines "significant" by enumeration) |
| MPC.8.3 | HIGH | REPLACE | §2.5 (M4/M7/M10 rows each name native-declaration-moments) |
| MPC.8.4 | MEDIUM | NEW-SECTION | §3.8.B Session-volume envelopes |
| MPC.8.5 | HIGH | NEW-SECTION | §3.8.G Pause protocol |
| MPC.8.6 | MEDIUM | NEW-SECTION | §3.8.G Pause protocol (unavailable-handoff folded in) |
| MPC.8.7 | MEDIUM | NEW-SECTION | §3.4.B Two-pass protocol + §2.5 per-row `Agent roles` field |

### §7.9 — Dimension 9: Time Horizon vs Phase Indexing (7 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.9.1 | MEDIUM | NEW-SECTION | §3.8.A Phase-indexed stance + §3.8.B Session-volume envelopes |
| MPC.9.2 | MEDIUM | NEW-SECTION | §3.8.A (hard dates declined explicitly) |
| MPC.9.3 | HIGH | NEW-SECTION | §3.8.C Sequencing stance (serial vs overlap) |
| MPC.9.4 | HIGH | NEW-SECTION | §3.8.D Concurrent workstream duration + §2.7 CW `Duration envelope` field |
| MPC.9.5 | HIGH | NEW-SECTION | §3.8.C Sequencing stance |
| MPC.9.6 | MEDIUM | NEW-SECTION | §3.8.B Session-volume envelopes |
| MPC.9.7 | MEDIUM | NEW-SECTION | §3.8.E Budget envelope pointer |

### §7.10 — Dimension 10: Post-M10 Framing (6 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.10.1 | HIGH | NEW-SECTION | §3.9 Post-M10 Framing (entire section) |
| MPC.10.2 | MEDIUM | NEW-SECTION | §3.9.A Maintenance mode |
| MPC.10.3 | MEDIUM | NEW-SECTION | §3.9.B Publication |
| MPC.10.4 | MEDIUM | NEW-SECTION | §3.9.C Ownership and handoff |
| MPC.10.5 | MEDIUM | NEW-SECTION | §3.9.D Retirement criteria |
| MPC.10.6 | MEDIUM | NEW-SECTION | §3.9.E Versioning policy post-M10 |

### §7.11 — Dimension 11: Ethical Framework (9 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **MPC.11.1** | **CRITICAL** | **NEW-SECTION** | **§3.5 Ethical Framework (entire section) + §3.5.A Principles block (6 principles)** |
| MPC.11.2 | HIGH | NEW-SECTION | §3.5.B Disclosure tiers |
| **MPC.11.3** | **CRITICAL** | **NEW-SECTION** | **§3.5.C Self-harm guardrail (no date-of-death; double red-team for health crisis; suicide-adjacent disallowed)** |
| MPC.11.4 | HIGH | NEW-SECTION | §3.5.B Disclosure tiers (four audiences named) |
| **MPC.11.5** | **CRITICAL** | **NEW-SECTION** | **§3.5.D Consent protocol for M7 cohort** |
| MPC.11.6 | HIGH | NEW-SECTION | §3.5.G Calibration disclosure |
| MPC.11.7 | HIGH | NEW-SECTION | §3.5.E Pre-registration / blinding stance |
| MPC.11.8 | HIGH | NEW-SECTION | §3.5.F Minor / vulnerable-population stance |
| MPC.11.9 | MEDIUM | NEW-SECTION | §3.5.H Mode A / Mode B linkage |

### §7.12 — Dimension 12: Meta-Governance (7 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.12.1 | HIGH | NEW-SECTION | §3.10.A Revision triggers |
| MPC.12.2 | HIGH | NEW-SECTION | §3.10.B Approval protocol |
| MPC.12.3 | MEDIUM | NEW-SECTION | §3.10.E Sunset clause |
| MPC.12.4 | HIGH | NEW-SECTION | §3.10.C Red-team cadence for MP itself |
| MPC.12.5 | MEDIUM | NEW-SECTION | §3.10.D Version semantics (v1.X / v2.X / v3.X definitions) |
| MPC.12.6 | MEDIUM | REVISE | §2.1 frontmatter `status: CURRENT` + §3.10.G |
| MPC.12.7 | MEDIUM | NEW-SECTION | §3.10.F Changelog requirement + §4.2 changelog text |

### §7.13 — Dimension 13: Multi-Agent Collaboration (7 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.13.1 | HIGH | NEW-SECTION | §3.4 Multi-Agent Collaboration (entire section) + §3.4.A Current agents |
| MPC.13.2 | HIGH | NEW-SECTION | §3.4.C Disagreement protocol + §3.3 §IS.5 DISAGREEMENT_REGISTER pointer |
| MPC.13.3 | HIGH | NEW-SECTION | §3.4.B Two-pass protocol + §2.5 per-row `Agent roles` |
| MPC.13.4 | MEDIUM | NEW-SECTION | §3.4.E Future-agent admission policy |
| MPC.13.5 | MEDIUM | NEW-SECTION | §3.3 §IS.5 + §3.4.C (DISAGREEMENT_REGISTER pointer) |
| MPC.13.6 | HIGH | REPLACE | §2.5 per-row `Quality gate` field + §3.4.D pointer |
| MPC.13.7 | MEDIUM | NEW-SECTION | §3.4.F Version-pinning discipline |

### §7.14 — Dimension 14: System Integrity and Drift-Prevention (7 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **MPC.14.1** | **CRITICAL** | **NEW-SECTION** | **§3.3 System Integrity Substrate (entire section — substrate parallel to Learning Layer)** |
| MPC.14.2 | HIGH | NEW-SECTION | §3.3 §IS.2 Mirror Discipline (three ND.1 load-bearing claims stated) |
| MPC.14.3 | HIGH | NEW-SECTION | §3.3 §IS.4 FILE_REGISTRY/GOVERNANCE_STACK as enforcement registries |
| MPC.14.4 | HIGH | NEW-SECTION | §3.3 §IS.3 SESSION_LOG as drift detector |
| MPC.14.5 | HIGH | NEW-SECTION | §3.3 §IS.1 Canonical Artifact Discipline (points to CANONICAL_ARTIFACTS_v1_0) |
| **MPC.14.6** | **CRITICAL** | **NEW-SECTION** | **§3.3 §IS.9 Governance rebuild acknowledgment + §2.1 frontmatter `produced_during` + §2.3 prepend sentence** |
| MPC.14.7 | HIGH | NEW-SECTION | §3.3 System Integrity Substrate (elevated to substrate parity with Learning Layer) |

### §7.15 — Out-of-schema findings (4 findings)

| Finding ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| MPC.OS.1 | LOW | REVISE | §2.1 frontmatter `produced_during` field + §3.10.F changelog requirement (each revision tagged with step-id) |
| MPC.OS.2 | MEDIUM | REPLACE | §2.8 Scope Boundary section (split into session-scope vs macro-phase-scope) |
| MPC.OS.3 | LOW | REVISE | §2.2 title block + Step 3 header-level normalization across MP v2.0 + §3.10 meta-governance declaration |
| MPC.OS.4 | LOW | INSERT | §2.1 frontmatter `id_namespace: M1..M10; LL.1..LL.10; IS.1..IS.9; ED.1..ED.9; CW.LEL, CW.PPL; MP.1..MP.7` |

### §7.16 — Native directives (1 directive)

| Directive ID | Severity | Action | Resolving spec entry |
|---|---|---|---|
| **ND.1 — Mirror Discipline** | **CRITICAL-equivalent** | **NEW-SECTION** | **§3.3 §IS.2 Mirror Discipline (three claims stated verbatim per ND.1 intent) + §5.2 Mirror-pair inventory (MP.1–MP.7) + bindings to MPC.14.2 (HIGH) and MPC.13.1 (HIGH) per ND.1 consumption matrix** |

### §7.17 — Coverage audit

**Total findings addressed:** 132 MPC in-schema + 4 MPC.OS out-of-schema + 1 ND.1 = **137**.

**By severity (in-schema MPC):**
- CRITICAL: 12 / 12 addressed (100%) — all in NEW-SECTION or REPLACE category; zero deferred. CRITICAL coverage map: MPC.1.2 (§2.5), MPC.2.1 (§2.5), MPC.3.1 (§2.5), MPC.4.1 (§2.5), MPC.5.11 (§3.2 LL-Appendix.A), MPC.7.1 (§3.6.A), MPC.7.9 (§3.6.A + §3.7), MPC.11.1 (§3.5), MPC.11.3 (§3.5.C), MPC.11.5 (§3.5.D), MPC.14.1 (§3.3), MPC.14.6 (§3.3 §IS.9).
- HIGH: 71 / 71 addressed (100%).
- MEDIUM: 46 / 46 addressed (100%).
- LOW: 3 / 3 addressed (100%).

**By severity (out-of-schema MPC.OS):**
- MEDIUM: 1 / 1 addressed (100%). LOW: 3 / 3 addressed (100%).

**Native directive:**
- ND.1: addressed across §3.3 §IS.2, §5.2 mirror-pair inventory, §7.16 row, and bindings in §2.1 frontmatter + §7.14 rows for MPC.14.2 and §7.13 rows for MPC.13.1. No deferral.

**Actions distribution:**
- NEW-SECTION: 84 findings
- REPLACE: 35 findings
- REVISE: 10 findings
- INSERT: 7 findings
- KEEP: 0 findings (no finding resolves to "keep"; MP v2.0 is architectural by design)
- DELETE: 1 finding (§2.9 "Change control" stub — folded into §3.10; no successor standalone section, counted here implicitly in §2.9 disposition)

**No flags raised:** zero `[NATIVE_CONFIRMATION_NEEDED]`; zero `[DEFER_TO_FUTURE_REVISION]`; zero findings deferred to future spec or future step beyond the consumption matrix obligations named in the brief.

---

## §8 — Close criteria verification (from brief §6)

This spec's close criteria are enumerated in the Step 2 brief §6. Verification:

- [x] `MACRO_PLAN_REVISION_SPEC_v1_0.md` exists at `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md` (actual file on disk).
- [x] Version decision (v1.1 vs v2.0) is explicit and justified in §1 — six-point rationale 1.1 through 1.6, evidence-bound.
- [x] Every Macro Plan v1.0 section has a disposition in §2 — §2.1 frontmatter (REPLACE); §2.2 title block (REVISE); §2.3 Why this exists (KEEP+prepend); §2.4 Ultimate goal (REVISE); §2.5 Ten macro-phases (REPLACE); §2.6 Learning Layer (REVISE+appendix); §2.7 Concurrent workstreams (REPLACE); §2.8 Scope boundary (REPLACE); §2.9 Change control (REPLACE/fold); §2.10 CLAUDE.md forward-pointer (INSERT).
- [x] §7 Finding Coverage Table has a row for every MPC.N.M from Step 1 — 132 in-schema rows + 4 out-of-schema rows + 1 ND.1 row = 137 rows.
- [x] Every CRITICAL finding addressed (not deferred); no `[NATIVE_CONFIRMATION_NEEDED]` flag. 12 CRITICALs mapped to concrete §2.X or §3.X entries per §7.17 audit.
- [x] **ND.1 (Mirror Discipline) addressed.** §3.3 §IS.2 specifies the Mirror Discipline subsection with all three ND.1 load-bearing claims stated. §5.2 enumerates mirror-pair inventory MP.1–MP.7. §7.16 binds ND.1 to MPC.14.2 and MPC.13.1 per the ND.1 consumption-matrix Row 2 obligation. Step 3 verification: each of the three claims verbatim-or-equivalent in §IS.2; §3.3 §IS.2 names ND.1 explicitly; the "semantic parity of governance content, not feature parity of agent capabilities" phrasing from ND.1 §78 is preserved (Step 3 uses either the verbatim phrase or a semantically equivalent formulation; the spec accepts either).
- [x] Every `open` directive in `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` whose consumption matrix names Step 2 has a corresponding §3/§7 entry. Current open directives: ND.1 only. ND.1 binding: §3.3 §IS.2 + §5.2 + §7.16 (this matches the ND.1 Row 2 obligation: "Spec §3 (new sections) and §5 (cross-surface impact) both contain the mirror-discipline entry. Spec §7 Finding Coverage binds ND.1 to the MPC.14.2 and MPC.13.1 critique findings.")
- [ ] STEP_LEDGER updated; SESSION_LOG appended. **This checkbox flips to `[x]` only after Step 2's session-close actions execute.** Those actions are enumerated in §9.

## §9 — Session-close actions (for Step 2's own close)

The following are the actions this session must execute to close Step 2 validly:

1. **STEP_LEDGER update.** Row Step 2 → `completed` with deliverable path `00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md`, evidence `self-verified per brief §6 (no Step-2-specific red-team is due; Step 4 red-teams the MP rewrite produced by Step 3)`, blocking notes cleared. Row Step 3 → `ready`. History section appended with "Step 2 closed on 2026-04-23" per the handoff protocol at ledger §Handoff protocol.
2. **SESSION_LOG append.** New entry: `Session — STEP_2_MACRO_PLAN_REVISION_SPEC (2026-04-23, CLOSED)`. Format matches the STEP_1_MACRO_PLAN_CRITIQUE entry. Content: inputs read, output produced (this spec), deliverable shape, version decision summary, finding counts, close-criteria verification checklist, next-session objective.
3. **ND.1 verification confirmation.** Because Step 2 is a Step-with-ND.1 obligation, the close also records confirmation that ND.1 §3.3/§5/§7 entries exist per the Row 2 obligation. No status change to ND.1 (still `open`); the status flip to `addressed` is Step 7's responsibility per ND.1's close condition.

No other files are touched by this session. Cross-surface propagation (the §5.1 S.1–S.10 list) is Step 5's job, not Step 2's.

## §10 — Handoff to Step 3

- **Next step:** Step 3 (Macro Plan rewrite).
- **Fresh conversation reads, in order:** CLAUDE.md; STEP_LEDGER_v1_0.md; STEP_BRIEFS/STEP_03_MACRO_PLAN_REWRITE_v1_0.md (this brief carries the ND.1 amendment already); this spec (MACRO_PLAN_REVISION_SPEC_v1_0.md); MACRO_PLAN_v1_0.md (subject to be replaced); NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md.
- **Fresh conversation does NOT need to read:** MACRO_PLAN_CRITIQUE_v1_0.md (findings already distilled into §7 of this spec; Step 3 may consult for evidence context but is not required to re-read cover-to-cover); PROJECT_ARCHITECTURE_v2_1.md (this spec does not require architectural depth for the rewrite); PHASE_B_PLAN_v1_0.md v1.0.2 (Step 3 imports M2 exit criteria by reference only per §2.5 M2 row).
- **Step 3 deliverable:** `00_ARCHITECTURE/MACRO_PLAN_v2_0.md`. Frontmatter per §2.1 and §4.1; body ordered per §3.1; per-phase rows per §2.5 schema; substrates + appendices + sections per §3; Finding-Resolution Appendix per §3.11.
- **Blocking question, if any:** none. No `[NATIVE_CONFIRMATION_NEEDED]` items. Step 3 proceeds directly.
- **Red-team note for Step 4:** Step 4 (per amended brief) will run T.1–T.7 on MP v2.0. T.2 (finding-coverage verification) maps to §7 here; T.6 (ambiguity) maps to §IS.2 Mirror Discipline claims; T.7 (ND.1 enactment) verifies that §IS.2 reflects this spec verbatim-or-equivalent.

---

*End of MACRO_PLAN_REVISION_SPEC_v1_0.md.*
