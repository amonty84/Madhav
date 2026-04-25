---
artifact: LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md
version: 1.0
status: CURRENT
produced_during: STEP_11_LEARNING_LAYER_SCAFFOLD (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
authoritative_side: claude
role: >
  Closed decision record for Step 11 of the Step 0 → Step 15 governance rebuild. Resolves
  GA.6 ("phantom reference to 06_LEARNING_LAYER/") by recording the native verdict on
  whether to materially scaffold the Learning Layer directory or amend MACRO_PLAN_v2_0
  wording to defer it. Single artifact; closed-session discipline; once published it does
  not amend itself — subsequent Learning Layer evolution lives in
  06_LEARNING_LAYER/PARAMETER_UPDATES/ amendments to §LL-Appendix.B and in M2 phase B.0
  hook-extension work, not in this file.
implements: >
  GROUNDING_AUDIT_v1_0.md GA.6 (06_LEARNING_LAYER phantom reference) — closure at the
  full-surface layer. CLAUDE.md §F currently-executing marker referenced Step 11 as
  ready; this artifact marks Step 11 complete.
consumes:
  - 00_ARCHITECTURE/STEP_BRIEFS/STEP_11_LEARNING_LAYER_SCAFFOLD_v1_0.md (binding spec)
  - 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §"The Learning Layer — a cross-cutting substrate"
    + §LL-Appendix.A Activation-phase matrix + §LL-Appendix.B per-mechanism specifications
  - 00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md §D.10 Learning Layer Substrate workstream
  - 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md §F Learning Layer Hooks (B.0 substrate)
  - 00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md §3.1 (GA.6 phantom-reference finding)
consumed_by:
  - Step 12 (Ongoing hygiene policies) — picks up the per-mechanism N-override booking
    that MP v2.0 §"Learning discipline rule #3" defers to "Step 11 scaffold or activation
    phase, whichever comes first"
  - PHASE_B_PLAN B.0 (when M2 execution resumes post-Step-15) — extends the scaffold with
    PROMPT_REGISTRY/, PREDICTION_LEDGER/, SCHEMAS/ substrate hooks per PBP §F.1
  - Future M4 calibration session — first to populate any LL.1–LL.4 mechanism with real
    weights; bound by §5 guardrails of this file
mirror_obligations:
  claude_side: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md
  gemini_side: null
  mirror_mode: claude_only
  authoritative_side: claude
  asymmetries: >
    Decision record is Claude-resident — closed governance artifact like other STEP_N
    closure records. Gemini-side reflects the Step 11 closure via .gemini/project_state.md
    state-block transition (Step 11 completed; Step 12 ready) per MP.2 composite mirror,
    not via a parallel decision file.
changelog:
  - v1.0 (2026-04-24, Step 11 of the Step 0 → Step 15 governance rebuild):
      Initial closed decision record. §1 verdict SCAFFOLD; §2 rationale citing MP
      §Learning Layer + §LL-Appendix.A + PHASE_B_PLAN §F + GA.6; §3 implementation
      enumerating the four LL.1–LL.4 mechanism stubs + OBSERVATIONS/ + PARAMETER_UPDATES/
      empty subdirs + top-level README; §4 implementation-not-taken (NO_SCAFFOLD path
      preserved for audit trail); §5 guardrails (empty stubs only, no premature
      population, ≥3-observation threshold, classical priors locked); §6 CANONICAL_ARTIFACTS
      update plan; §7 PHASE_B_PLAN B.0 coordination note (WARN.1 from Step 4 red-team
      resolved at the design-intent layer, deferred at the implementation layer until M2
      execution resumes); §8 red-team self-check against brief §8.
date: 2026-04-24
---

# LEARNING LAYER SCAFFOLD DECISION v1.0
## MARSYS-JIS Project — Step 11 Decision Record

*Closed governance artifact produced in Step 11 of the Step 0 → Step 15 governance rebuild
per `STEP_BRIEFS/STEP_11_LEARNING_LAYER_SCAFFOLD_v1_0.md` (binding spec). Resolves
`GROUNDING_AUDIT_v1_0.md` finding **GA.6** at the full-surface layer.*

---

## §1 — Decision

**Verdict: SCAFFOLD.**

`06_LEARNING_LAYER/` is materially scaffolded as part of this Step 11 close, with the file
inventory enumerated in §3. The four M2-available mechanisms (LL.1 Signal weight
calibration, LL.2 Graph edge weight learning, LL.3 Embedding space adaptation,
LL.4 Prompt optimization) each receive a stub README carrying an explicit
`STATUS: STUB — activates at M4. Do not populate until [prerequisite]` banner. Two empty
sibling directories (`OBSERVATIONS/` and `PARAMETER_UPDATES/`) carry `.gitkeep` markers.
A top-level `README.md` enumerates all ten LL mechanisms with per-mechanism activation
phase per `MACRO_PLAN_v2_0.md §LL-Appendix.A`.

**Native input.** The verdict was confirmed in-band by the native (Marsys, on behalf of
Abhisek Mohanty) on 2026-04-24, selecting **"SCAFFOLD (empty stubs) — Recommended"** from
the three options surfaced under brief §4 ("decision is a native-input surface; recommended
verdict is SCAFFOLD with empty stubs"). The verdict matches the brief's recommendation.

**What this decision is not.** It is not a commitment to populate any mechanism in M2.
It is not a re-litigation of MP v2.0 §LL-Appendix.A activation timing (the matrix is
authoritative — LL.1–LL.4 scaffold at M2, active from M4). It is not an admission of any
M4–M10 infrastructure into the M2 governance scope.

---

## §2 — Rationale

### §2.1 — Why SCAFFOLD over NO_SCAFFOLD

**Primary reason: scaffold-pending is the explicitly-declared MP v2.0 state.**

`MACRO_PLAN_v2_0.md §"The Learning Layer — a cross-cutting substrate"` (line 148) reads:

> "It sits in `06_LEARNING_LAYER/` as a sibling to the Discovery Layer. **Directory
> `06_LEARNING_LAYER/` is scaffold-pending as of v2.0 publication; the LL scaffold
> decision is Step 11 of the governance rebuild. Sessions reading v2.0 before Step 11
> closes must not assume the directory exists.**"

The MP wording is not ambiguous: scaffold-pending, with Step 11 named as the decision
moment. It does not future-tense the layer (e.g., "will be scaffolded in M4"); it
present-tenses a substrate that "sits in `06_LEARNING_LAYER/`". A NO_SCAFFOLD verdict
would require editing this load-bearing wording across MP §Learning Layer +
§LL-Appendix.A header + §LL-Appendix.B per-mechanism Output rows (every "scaffold-pending"
qualifier across LL.1–LL.10) + PROJECT_ARCHITECTURE_v2_2 §D.10 + PHASE_B_PLAN §F.1
"Hook 1: `06_LEARNING_LAYER/` scaffolded in B.0". Scope explosion across four canonical
artifacts plus a forward-looking M2 execution plan that already prescribes B.0 scaffolding.

By contrast, SCAFFOLD requires only:
- this decision record;
- the scaffold bundle itself (top-level README + four mechanism stubs + two empty subdirs);
- a CANONICAL_ARTIFACTS row addition for the Learning Layer entry;
- mirror updates to .geminirules + .gemini/project_state.md (state-block reflects Step 11
  close + the new directory's existence);
- governance ledger / log / report rotation that every closing step performs anyway.

Scope ratio favors SCAFFOLD by approximately one order of magnitude.

### §2.2 — Why SCAFFOLD now over scaffold-when-first-mechanism-fires

A second reasonable position is: leave the directory unscaffolded until M4, when LL.1
first activates. The brief §4 explicitly addresses this by recommending SCAFFOLD now:

> "Rationale: the Macro Plan already commits to the substrate, PHASE_B_PLAN names four
> mechanisms as M2-available, and a scaffolded directory with guardrails is lower-risk
> than a conceptual placeholder that a future session might misread."

Three concrete failure modes that scaffold-now prevents:

1. **Future-session phantom-reference recurrence.** A session reading MP v2.0 between
   now and M4 sees the present-tense "sits in `06_LEARNING_LAYER/`" and goes looking for
   the directory. With NO_SCAFFOLD, the directory still doesn't exist and the session
   has to either (a) re-discover the deferral via cross-reading PHASE_B_PLAN + GROUNDING_AUDIT
   + this decision record, or (b) misread MP and act as if the layer exists. With SCAFFOLD,
   the session finds the directory and the README's "STATUS: STUB" banners explain exactly
   what state each mechanism is in.

2. **Premature population at PHASE_B_PLAN B.0.** PHASE_B_PLAN §F.1 already prescribes
   scaffolding `06_LEARNING_LAYER/` in B.0 with sub-directories `PROMPT_REGISTRY/`,
   `PREDICTION_LEDGER/`, `SCHEMAS/`. Step 4 red-team flagged this as **WARN.1**
   (coordination, not contradiction) — the question being whether B.0's scaffold work
   would be the first scaffold or whether Step 11 would scaffold first. With SCAFFOLD now,
   the answer is: Step 11 produces the mechanism-stub layer (LL.1–LL.4 + OBSERVATIONS/ +
   PARAMETER_UPDATES/) and B.0 will produce the substrate-hook layer (PROMPT_REGISTRY/,
   PREDICTION_LEDGER/, SCHEMAS/, prediction_ledger.jsonl, prompt_registry_schema_v0_1.json,
   prediction_schema_v0_1.json) as **siblings**, not duplicates. See §7.

3. **Discipline-rule §3 N-override window closure.** MP v2.0 §"Learning discipline rule #3"
   says per-mechanism overrides for the ≥N-observation threshold "land at Step 11 scaffold
   or at the mechanism's activation phase, whichever comes first, and are logged as an
   amendment to §LL-Appendix.B; never less than 3." SCAFFOLD now provides the file-level
   anchor (`06_LEARNING_LAYER/PARAMETER_UPDATES/`) where future amendments are recorded.
   NO_SCAFFOLD would force every per-mechanism amendment between now and M4 to live
   somewhere ad-hoc until the directory exists. Step 12 (ongoing hygiene policies) is the
   right place to commit per-mechanism N values; this decision record honors MP's
   "whichever comes first" clause by **deferring per-mechanism N values to Step 12** with
   an explicit guardrail (§5.4) that no amendment lands until then.

### §2.3 — Why this is not pre-build for M3/M4/M5/M6/M7

The brief §4 final constraint reads: "Do NOT pre-build M4/M5/M6/M7 infrastructure
(explicit scope-boundary rule from Macro Plan)."

This SCAFFOLD verdict produces only:
- empty README files explaining what each mechanism *will* do at activation;
- empty `OBSERVATIONS/` and `PARAMETER_UPDATES/` directories with `.gitkeep` markers;
- no algorithm code;
- no weight files (no signal_weights/, no edge_weights/, no embedding_adapters/, no prompts/);
- no schema files (deferred to PHASE_B_PLAN B.0 per §7);
- no Bayesian update logic (LL.8 is M5);
- no counterfactual learning (LL.9 is M6);
- no cohort infrastructure (LL.7 cohort mode + LL.10 are M7+).

The four mechanism stubs each carry the activation banner naming their target M-phase
(M4 for all four). A future M4 session is the first session permitted to populate a
mechanism's register (LL.1: signal_weights/; LL.2: edge_weights/; LL.3: embedding_adapters/;
LL.4: prompts/). LL.5–LL.10 do not get stubs in this scaffold per §LL-Appendix.A activation
matrix (they scaffold at M4, M5, M6, M7 respectively per the matrix; their scaffold is the
activating phase's responsibility, not Step 11's). The top-level README enumerates LL.5–LL.10
in the activation table for navigability without admitting any infrastructure for them.

### §2.4 — GA.6 closure

`GROUNDING_AUDIT_v1_0.md §3.1 06_LEARNING_LAYER/` (lines 141–149) reads:

| Reference | Claim |
|---|---|
| MACRO_PLAN_v1_0 §"Learning Layer" | "It sits in `06_LEARNING_LAYER/` as a sibling to the Discovery Layer." |
| MACRO_PLAN_INSTALLATION session log | "`06_LEARNING_LAYER/` ... to be scaffolded in Phase 2 expansion — not now" |
| Actual filesystem | Directory does not exist |

GA.6 is the phantom-reference finding: the directory is named authoritatively in MP but
does not exist on disk. SCAFFOLD eliminates the gap by making the directory exist. The
existence of the directory plus the explicit "STATUS: STUB" banners on each mechanism
README means future sessions reading either MP or the filesystem reach the same conclusion:
"the substrate exists; mechanisms are scaffolded; activation is per the LL-Appendix.A
matrix."

GA.6 status post-this-decision: **closed at the full-surface layer.** PROJECT_ARCHITECTURE
v2.2 §D.10 already names this Step 11 deliverable as the closure mechanism (lines 1037 +
1044 of PROJECT_ARCHITECTURE).

---

## §3 — Implementation (SCAFFOLD path)

The following file inventory is created under `06_LEARNING_LAYER/` as part of this Step 11
close. All files are committed within `declared_scope.may_touch` per the Step 11
session-open handshake.

### §3.1 — Top-level README

`06_LEARNING_LAYER/README.md` — orientation for any session entering the directory.
Carries:

- The ten-mechanism inventory with per-mechanism activation phase from MP §LL-Appendix.A.
- The four-mechanism subset that scaffolds at M2 (LL.1–LL.4) — these are the mechanisms
  with stub READMEs in this directory.
- The six remaining mechanisms (LL.5–LL.10) that scaffold at later phases — listed for
  navigability; no infrastructure for them in this scaffold.
- The two operational subdirectories (`OBSERVATIONS/` and `PARAMETER_UPDATES/`) with
  their roles.
- A pointer to MP §"The Learning Layer — a cross-cutting substrate" + §LL-Appendix.A–D
  for authoritative detail.
- A pointer to PHASE_B_PLAN §F.1 for the substrate-hook extension that lands at M2 B.0
  execution.
- The non-negotiable learning-discipline rules from MP (six rules, summarized).
- The §5 guardrails of this decision record.

### §3.2 — Mechanism stubs (LL.1–LL.4)

Each stub is a single `README.md` file under a directory named for the mechanism. No
implementation files, no weight files, no logic. Each carries the activation banner per
brief §5 discipline rule #2 and a one-paragraph explanation of I/O and dependencies sourced
from MP §LL-Appendix.B.

- `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` (LL.1)
- `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/README.md` (LL.2)
- `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/README.md` (LL.3)
- `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/README.md` (LL.4)

Each banner reads:

```
STATUS: STUB — activates at M4. Do not populate until [prerequisite per LL-Appendix.B].
```

The `[prerequisite]` is filled per mechanism from MP §LL-Appendix.B (e.g., LL.1's
prerequisite is "M3 closed (temporal engine produces per-event signal-firing records);
LEL events match against MSR signals; PPL outcomes available").

### §3.3 — Operational subdirectories

- `06_LEARNING_LAYER/OBSERVATIONS/` with `.gitkeep` — accumulator for shadow-mode
  observations toward the per-mechanism N-observation threshold (≥3 per MP discipline
  rule #3). Empty at scaffold; populated post-M4 first calibration cycle.
- `06_LEARNING_LAYER/PARAMETER_UPDATES/` with `.gitkeep` — Bayesian-update landing zone
  after the two-pass Gemini/Claude protocol approves a parameter update. Also the
  destination for per-mechanism N-override amendments to §LL-Appendix.B per MP discipline
  rule #3 (booked to Step 12). Empty at scaffold.

Both `.gitkeep` files carry a one-line comment naming the directory's role and a pointer
to the parent README §"§5 Guardrails" for the population gate.

### §3.4 — What is NOT created

Per brief §4 constraints + §5 guardrail #2:

- No `signal_weights/` directory under SIGNAL_WEIGHT_CALIBRATION/.
- No `edge_weights/` under GRAPH_EDGE_WEIGHT_LEARNING/.
- No `embedding_adapters/` under EMBEDDING_SPACE_ADAPTATION/.
- No `prompts/` under PROMPT_OPTIMIZATION/.
- No `retrieval_rankers/`, `plan_selectors/`, `discovery_priors/`, `bayesian_posteriors/`,
  `miss_registry/`, `finetuned_models/` (LL.5–LL.10 — scaffold at M4/M5/M6/M7, not Step 11).
- No `prediction_ledger.jsonl`, `PROMPT_REGISTRY/INDEX.json`, or `SCHEMAS/*.json` (these
  are PHASE_B_PLAN B.0's scaffold, not Step 11's — see §7).
- No DBN spec files (LL.8 — scaffolds at M4 per §LL-Appendix.A).
- No cohort registry (LL.7 cohort mode — M7).
- No fine-tune dataset placeholders (LL.10 — M7 scaffold, M10 active).

If a future session needs to know "where will the calibration weights live?", the answer
is in the LL.1 stub README + §LL-Appendix.B LL.1 Output row (`signal_weights/` to be
created at M4 first calibration). Step 11's job is to make that future creation legible
in advance, not to perform it.

### §3.5 — Banner provenance

The `STATUS: STUB` banner format follows the brief §5 discipline rule #2 verbatim:
`STATUS: STUB — activates at [M_N]. Do not populate until [prerequisite].` This banner is
the regex anchor that future drift-detector extensions (booked to Step 12 per §6.2) will
use to identify Learning Layer stubs and gate their population.

---

## §4 — Implementation (NO_SCAFFOLD path) — not taken; preserved for audit trail

Had the verdict been NO_SCAFFOLD, the implementation would have been:

- `MACRO_PLAN_v2_0.md §"The Learning Layer — a cross-cutting substrate"` line 148:
  remove the present-tense "It sits in `06_LEARNING_LAYER/` as a sibling..." clause and
  replace with future-tense "It will sit under `06_LEARNING_LAYER/` once the first
  mechanism scaffolds at M4. Sessions reading this section before that moment must not
  assume the directory exists; the substrate is a planning commitment, not a present fact."
- §LL-Appendix.A header: replace the "scaffold" cells in the M2 column with "scaffold-deferred"
  (keep the activation-from-M4 cells unchanged).
- §LL-Appendix.B per-mechanism Output rows: replace each "(scaffold-pending)" qualifier
  with "(scaffold-deferred-until-activation-M_N)".
- `PROJECT_ARCHITECTURE_v2_2.md §D.10` paragraph "Scaffold status (2026-04-24)": replace
  the "deferred to Step 11" wording with "Step 11 verdict: defer to first activation; see
  LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md".
- `PHASE_B_PLAN_v1_0.md §F.1`: explicitly mark Hook 1 as "deferred to first activation" with
  a forward pointer to the M4 session that scaffolds.
- Native confirmation flag in this decision record §1, since edits to MP v2.0 break the
  freeze established at Step 5 close.

NOT TAKEN. Native verdict is SCAFFOLD; this section preserves the alternate implementation
plan for audit-trail completeness only. Do not act on §4.

---

## §5 — Guardrails

These guardrails bind every future session that touches `06_LEARNING_LAYER/`. They are
re-stated in the top-level README and (selectively) in each mechanism stub's README.

### §5.1 — Empty-scaffold guardrail

**The Step 11 scaffold is empty.** No mechanism has weights, logic, observations, or
parameter updates at Step 11 close. A future session that finds non-empty content under
any mechanism's mechanism-name subdirectory has caught a violation — not of this decision
record alone, but of the broader "do not pre-build later macro-phases" rule from MP
§"Scope Boundary" and PROJECT_ARCHITECTURE §D.10 §"Scaffold status".

### §5.2 — Population-gate guardrail

**No Learning Layer mechanism fires in M2.** First observations are admitted only after
M4 Empirical Calibration begins, per MP §"Learning discipline" rule #4 ("held-out
prospective data is sacrosanct; the model never sees outcome before prediction") + rule #3
(≥N independent observations; N defaults to 3, never less). The activation matrix
§LL-Appendix.A is authoritative; this scaffold does not change it.

### §5.3 — Two-pass-approval guardrail

**Every parameter update requires the two-pass Gemini/Claude protocol** per MP
§"Learning discipline" rule #3. No mechanism may write to `PARAMETER_UPDATES/` without
both agents recording approval evidence in the SESSION_LOG entry that performs the write.
First parameter update is at the earliest M4; this guardrail applies retroactively to any
Step 11+ session that attempts an early write.

### §5.4 — Per-mechanism N-override deferral

**Per-mechanism N values are deferred to Step 12.** MP §"Learning discipline rule #3"
says per-mechanism overrides "land at Step 11 scaffold or at the mechanism's activation
phase, whichever comes first." This decision record exercises the "whichever comes first"
clause by **electing not to commit per-mechanism N values now**, on the grounds that:

- Step 12 (Ongoing hygiene policies) has explicit scope to commit cross-mechanism policy
  values — it is the more appropriate venue.
- Per-mechanism N for LL.5–LL.10 has no operational meaning until those mechanisms have
  Output destinations (M4–M10), and committing values now risks anchoring on figures the
  M4+ data may justify revising.
- LL.1–LL.4 first-firing N can be committed at the M4 calibration session opening, where
  the empirical context informs the choice. This is consistent with the "activation phase,
  whichever comes first" alternative.

Default: **N = 3 per mechanism, no override** until either Step 12 or the activating
M-phase session amends. This default is binding from this decision record forward.

### §5.5 — Classical-priors-locked guardrail

**Learning modulates; never overwrites the classical-prior corpus** per MP §"Learning
discipline" rule #1. No Learning Layer write may modify any L1 fact (`01_FACTS_LAYER/**`),
any L2.5 holistic-synthesis artifact (`025_HOLISTIC_SYNTHESIS/**` — MSR, UCN, CDLM, RM,
CGM), or any L3 domain report (`03_DOMAIN_REPORTS/**`). Modulators (calibration weights,
edge-weight scalers, embedding adapters) live exclusively under `06_LEARNING_LAYER/` and
are read by retrieval/scoring code that combines them with the classical prior at query
time, never by writing back to the prior.

### §5.6 — Auditable-reversible-versioned guardrail

**Every parameter update is auditable, reversible, versioned, and logged** per MP
§"Learning discipline" rule #5. Concrete obligations:

- Every write to `PARAMETER_UPDATES/` carries the SESSION_LOG entry ID that performed it.
- Every write rotates the affected mechanism stub's README's "Last update" footer with
  the SESSION_LOG entry ID and the parameter version.
- Every parameter version is monotonically increasing per mechanism.
- Reversal protocol: retract the parameter version + log the retraction in the same
  mechanism's `OBSERVATIONS/` directory (so the reversal evidence sits next to the data
  that motivated it, not buried in SESSION_LOG history).

### §5.7 — Drift-detector / schema-validator coverage

This scaffold is empty enough that current drift-detector and schema-validator (Step 7
implementation; Step 10 extensions) cover it adequately. Specifically:

- The four mechanism stub READMEs each carry frontmatter; schema_validator's
  architecture_governance class will validate frontmatter structure (Step 12 hygiene may
  want to introduce a learning_layer_stub class with the STATUS-banner regex check).
- The top-level README and operational-subdirectory `.gitkeep` markers are the only
  non-frontmatter content; current detectors process them as plain text.
- Step 12 ongoing hygiene is the right venue to commit a `learning_layer_stub` class +
  STATUS-banner regex + population-gate rule. Booked.

---

## §6 — CANONICAL_ARTIFACTS update plan

### §6.1 — New row at §1 — Architecture & Governance subsection

A row is added to `CANONICAL_ARTIFACTS_v1_0.md §1` for this decision record:

```yaml
canonical_id: LEARNING_LAYER_SCAFFOLD_DECISION
path: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md
version: "1.0"
status: CURRENT
fingerprint_sha256: <populated-at-step-11-close>
mirror_obligations:
  claude_side: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md
  gemini_side: null
  mirror_mode: claude_only
  authoritative_side: claude
  asymmetries: "Closed governance decision artifact; Claude-resident. Gemini-side reflects Step 11 closure via .gemini/project_state.md state-block transition (MP.2 composite mirror), not via a parallel decision file."
last_verified_session: STEP_11_LEARNING_LAYER_SCAFFOLD
last_verified_on: 2026-04-24
notes: "Step 11 closure record. Resolves GA.6 at the full-surface layer. SCAFFOLD verdict per native input 2026-04-24. §3 implementation enumerates the 06_LEARNING_LAYER/ scaffold bundle; §5 guardrails bind every future Learning-Layer-touching session; §7 documents the PHASE_B_PLAN B.0 coordination."
```

### §6.2 — Learning Layer scaffold-bundle representation

The four mechanism stub READMEs + the two operational subdirectory `.gitkeep` markers
+ the top-level README do not each get a CANONICAL_ARTIFACTS row. CANONICAL_ARTIFACTS
lists only artifacts with a stable canonical_id (per its own §0 update_rules bullet 5).
Stubs are tracked through:

- this decision record (§3 inventory) — the source-of-truth for what was scaffolded;
- FILE_REGISTRY §9.1 (Step 12 hygiene action — adds rows for the bundle when v1.3 → v1.4
  bump lands);
- the directory's existence on disk — drift_detector reads the filesystem.

A future session that promotes a mechanism's scaffold to a populated state would add a
mechanism-specific canonical_id row at that promotion moment (e.g., `LL_SIGNAL_WEIGHTS`
when M4 first writes to `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/`),
not now.

### §6.3 — Fingerprint rotation plan

The Step 11 close rotates fingerprints for:
- `LEARNING_LAYER_SCAFFOLD_DECISION` — new row, populated to actual sha256 at close.
- `STEP_LEDGER` — row 11 → completed; row 12 → ready; History entries open + close.
- `SESSION_LOG` — Step 11 entry appended.
- `CURRENT_STATE` — Step 11 → completed; Step 12 → ready transition.
- `CLAUDE` — **untouched**. CLAUDE.md §F currently-executing marker references STEP_LEDGER;
  STEP_LEDGER is the source-of-truth and rotates above. CLAUDE.md does not need a §F edit
  per protocol §M.1 P5 minimal-edit rule (the marker pointer is to the LIVE ledger; the
  ledger contents change, not the marker).
- `GEMINIRULES` — single MP.1 mirror update (state-block reflects Step 11 close + Learning
  Layer scaffold existence pointer).
- `PROJECT_STATE` — single MP.2 composite update (state-block transitions Step 11 → completed;
  Step 12 → ready; Learning Layer scaffold registered in canonical corpus state).

`CANONICAL_ARTIFACTS` self-row, FILE_REGISTRY v1.3 → v1.4 bump, and GOVERNANCE_STACK §13
STEP_11 amendment log are deferred to Step 12 per the precedent set in Step 9 + Step 10
handoff notes (in-place §X amendments OK; full version bump is a Step 12 hygiene action).

---

## §7 — PHASE_B_PLAN B.0 coordination (WARN.1 resolution)

**Coordination, not contradiction.** PHASE_B_PLAN_v1_0.md §F.1 prescribes a different
scaffold structure for `06_LEARNING_LAYER/` at M2 B.0 execution:

```
06_LEARNING_LAYER/
  README.md
  PROMPT_REGISTRY/INDEX.json
  PREDICTION_LEDGER/prediction_ledger.jsonl  (starts empty)
  SCHEMAS/prediction_schema_v0_1.json
  SCHEMAS/prompt_registry_schema_v0_1.json
```

This is the **substrate-hook layer** — registry/ledger/schema infrastructure that supports
M2 retrieval-bundle assembly and prediction-emission discipline (B.0 Hook 1, Hook 2 per
PBP §F). It is not the **mechanism-stub layer** that Step 11 produces. Step 4 red-team
flagged this as **WARN.1** ("PHASE_B_PLAN B.0 scaffolds `06_LEARNING_LAYER/` while MP v2.0
marks it scaffold-pending (Step 11 decision). Coordination, not contradiction; governance
rebuild runs before M2 B-execution resumes per CLAUDE.md banner.").

**Resolution.** The two scaffold layers are **siblings**, not duplicates. When M2
execution resumes (post-Step-15), B.0 extends Step 11's scaffold by adding:
- `06_LEARNING_LAYER/PROMPT_REGISTRY/` (with INDEX.json) — feeds LL.4 prompt versioning;
- `06_LEARNING_LAYER/PREDICTION_LEDGER/` (with prediction_ledger.jsonl) — feeds CW.PPL
  ledger workstream + LL.9 future counterfactual learning;
- `06_LEARNING_LAYER/SCHEMAS/` (with the two v0.1 JSON schemas) — substrate for the
  ledger/registry write paths.

Step 11's scaffold is mechanism-stub-oriented (LL.1–LL.4 + OBSERVATIONS/ + PARAMETER_UPDATES/).
B.0's extension is substrate-hook-oriented (PROMPT_REGISTRY + PREDICTION_LEDGER + SCHEMAS).
The top-level `06_LEARNING_LAYER/README.md` produced by Step 11 names B.0's forthcoming
extension explicitly so that the M2 session reading the README finds the coordination
documented and acts as B.0's plan prescribes (sibling additions; no overwriting; no
re-scaffolding).

**WARN.1 status post-Step-11:** **resolved at the design-intent layer.** The implementation-
layer obligation (B.0's actual write of the substrate hooks) remains a B.0 deliverable when
M2 execution resumes. Step 4 red-team can confirm closure of WARN.1 at Step 4's next
cadence-cycle review or at the post-Step-15 macro-plan red-team (whichever fires first).

---

## §8 — Red-team self-check (against brief §8 prompts)

### §8.1 — Brief §8 Prompt 1

> "Does a fresh session now know why `06_LEARNING_LAYER/` is (or isn't) there?"

**PASS.** Three concentric answer surfaces:

1. **The directory itself.** `ls 06_LEARNING_LAYER/` lists the README + four mechanism
   subdirectories + the two operational subdirectories. The directory's existence is the
   first answer.
2. **The top-level README.** A session reading `06_LEARNING_LAYER/README.md` finds the
   ten-mechanism inventory, the four-at-M2 / six-at-later-phases breakdown, the
   STATUS-STUB-banner format documented, and a forward pointer to MP §LL-Appendix.A for
   authoritative activation timing. The README also names this decision record as the
   provenance.
3. **This decision record.** A session reading
   `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` finds the verdict, the
   rationale (§2), the inventory (§3), the guardrails (§5), the CANONICAL_ARTIFACTS update
   plan (§6), and the PHASE_B_PLAN coordination note (§7). A session that wants to know
   "why is the directory here at all?" has it answered in §2.1; "why are some mechanism
   directories present and others absent?" in §2.3 + §3.4; "why are there guardrail rules
   on what I can write?" in §5.

The fresh-session knowledge surface is overdetermined; ambiguity-by-design is impossible.

### §8.2 — Brief §8 Prompt 2

> "Is there any path by which a session can populate a stub mechanism without a
> corresponding Life Event or prediction validation?"

**PASS — protected by guardrails §5.2 + §5.3 + §5.5 + §5.7.**

The threat model is: a future session sees the empty `signal_weights/` slot promised by
LL.1's stub README and writes weights to it without going through M4 calibration. Four
overlapping defenses:

1. **Guardrail §5.2 (population gate).** "First observations are admitted only after M4
   Empirical Calibration begins." A session that attempts to populate before M4 is
   violating a stated rule that lives in this decision record + the stub README's banner.
2. **Guardrail §5.3 (two-pass approval).** Every parameter update requires both agents'
   approval evidence in the SESSION_LOG entry. A unilateral write fails the close-checklist
   `mirror_updates_propagated` block.
3. **Guardrail §5.5 (classical-priors-locked).** Even an authorized M4+ write is bounded
   to `06_LEARNING_LAYER/`; any attempt to modify L1/L2.5/L3 from a Learning Layer pipeline
   is a violation that the drift-detector will catch (cross-folder write with no rationale
   in declared_scope).
4. **Guardrail §5.7 (drift-detector / schema-validator coverage extension at Step 12).**
   Step 12 commits a `learning_layer_stub` validator class with STATUS-banner regex check
   and population-gate rule; non-empty mechanism subdirectories before the M-phase named
   in the banner fail validation.

**Residual exposure.** Between Step 11 close and Step 12 close, the validator coverage is
indirect (general drift-detection catches cross-folder writes; schema_validator catches
missing frontmatter). A bad-faith session that writes an empty `signal_weights/` directory
inside SIGNAL_WEIGHT_CALIBRATION/ before Step 12 closes would create the directory without
firing any validator. **Mitigation:** the stub README banner is the human-readable
deterrent; this decision record §5.2 is the documented rule; the M4 session opens with
this decision record in its mandatory-reading list and is the first authorized writer.
Booked: Step 12 brief should explicitly include the `learning_layer_stub` class as a
named scope item.

---

## §9 — Closure declaration

**GA.6 closed at the full-surface layer.** This decision record + the §3 scaffold bundle
constitute the resolution. The PROJECT_ARCHITECTURE_v2_2.md §D.10 paragraph "Scaffold
status (2026-04-24)" no longer requires action — its forward-pointer to this decision
record is now back-referenced from this record.

**WARN.1 (Step 4 red-team)** resolved at the design-intent layer; implementation-layer
B.0 obligation remains.

**Step 11 close criteria (per brief §6) verified inline:**
- [x] Decision record exists (this file).
- [x] SCAFFOLD chosen → `06_LEARNING_LAYER/` exists with required READMEs and empty subdirs
  (per §3; verified at Step 11 close-side filesystem check).
- [x] CANONICAL_ARTIFACTS reflects decision (§6.1 row added at close).
- [x] drift_detector + schema_validator pass (Step 11 close-side script run; reports under
  `00_ARCHITECTURE/{drift,schema,mirror}_reports/`).
- [x] STEP_LEDGER updated (row 11 → completed; row 12 → ready); SESSION_LOG appended.

**Step 12 (Ongoing hygiene policies) is unblocked at this Step 11 close.**

---

*End of LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md — Step 11 of the Step 0 → Step 15 governance rebuild — 2026-04-24.*
