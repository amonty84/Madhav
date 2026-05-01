---
artifact: 06_LEARNING_LAYER/README.md
version: 1.0
status: SCAFFOLD
expose_to_chat: false
native_id: "abhisek"
layer: "L6"
produced_during: STEP_11_LEARNING_LAYER_SCAFFOLD (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
authoritative_side: claude
role: >
  Orientation surface for any session entering the Learning Layer substrate. Names the
  ten mechanisms (LL.1–LL.10), points to the authoritative MP appendices for activation
  timing and per-mechanism specifications, and re-states the binding guardrails from
  the Step 11 decision record.
implements: GROUNDING_AUDIT_v1_0.md GA.6 — full-surface layer closure (paired with the
  decision record at 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md)
provenance: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §3
---

# 06_LEARNING_LAYER — Substrate Scaffold

**Status:** scaffolded at Step 11 of the Step 0 → Step 15 governance rebuild (2026-04-24).
The scaffold is **empty**. No mechanism is active; no parameter has been calibrated; no
observation has been recorded. Activation per `MACRO_PLAN_v2_0.md §LL-Appendix.A`.

This README answers the question a fresh session asks on entering this directory: *what
is here, what is each piece for, and what may I do with it?*

---

## §1 — What this substrate is

The Learning Layer is a cross-cutting substrate that progressively calibrates the
instrument against empirical evidence without overwriting the classical-prior corpus
(L1 facts + L2.5 holistic synthesis + L3 domain reports). It is parallel to — not
sequential with — the Discovery Layer (`035_DISCOVERY_LAYER/`). It runs across macro-phases
M2 through M10; the activation matrix in MP v2.0 §LL-Appendix.A names which mechanism
fires at which phase.

Authoritative documentation lives in:

- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §"The Learning Layer — a cross-cutting substrate"`
  — load-bearing principles, six learning-discipline rules, n=1 risk stance.
- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.A` — activation-phase matrix
  (mechanism × M-phase grid).
- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B` — per-mechanism specification
  (input, output, kill-switch, owner, dependencies, workstream interaction).
- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.C` — n=1 risk-mitigation binding table.
- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.D` — ownership (native approves;
  Claude scaffolds; Gemini red-teams).
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md §D.10` — workstream-layer summary.
- `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` — Step 11 decision record;
  the source-of-truth for this scaffold's existence and shape.

This README **summarizes** for navigability; it does **not** restate authoritative content.
Disagreement between this README and any of the above resolves in favor of the upstream
artifact.

---

## §2 — The ten mechanisms

Per MP v2.0 §LL-Appendix.A activation-phase matrix:

| ID | Name | Scaffold | Active | Notes |
|----|------|----------|--------|-------|
| LL.1 | Signal weight calibration | M2 | M4+ | **Stub present in this directory** |
| LL.2 | Graph edge weight learning | M2 | M4+ | **Stub present** |
| LL.3 | Embedding space adaptation | M2 | M4+ | **Stub present** |
| LL.4 | Prompt optimization | M2 | M4+ | **Stub present** |
| LL.5 | Retrieval ranking learning | M2 | M4+ | Dormant M3; *no stub at Step 11* |
| LL.6 | Plan selection learning | M2 | M4+ | Dormant M3; *no stub at Step 11* |
| LL.7 | Discovery prior shaping | M2 | M4+ (native) / M7+ (cohort) | Dormant M3; *no stub at Step 11* |
| LL.8 | Bayesian model updating | M4 | M5+ | *Activates at M5; no stub here* |
| LL.9 | Counterfactual learning from misses | M5 | M6+ | *Activates at M6; no stub here* |
| LL.10 | LLM fine-tuning | M7 | M10 | Strict fine-tune at M10; LL.4 promotion always-on from M4; *no stub here* |

The four "Stub present" mechanisms are the M2-available subset for which Step 11 produced
mechanism stubs (LL.1–LL.4). Each stub is an empty `README.md` carrying the activation
banner. LL.5–LL.7 also scaffold at M2 per the matrix but **dormant at M3**; their stubs
are the M4 calibration session's responsibility (when they activate). LL.8–LL.10 scaffold
at M4/M5/M7 and are out of Step 11's scope per the brief's "do NOT pre-build later
macro-phases" constraint.

---

## §3 — Directory layout

```
06_LEARNING_LAYER/
├── README.md                                    ← this file
├── LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md     ← lives at 00_ARCHITECTURE/, not here;
│                                                  pointer for navigability
├── SIGNAL_WEIGHT_CALIBRATION/                   ← LL.1 stub
│   └── README.md                                ← STATUS: STUB — activates at M4
├── GRAPH_EDGE_WEIGHT_LEARNING/                  ← LL.2 stub
│   └── README.md
├── EMBEDDING_SPACE_ADAPTATION/                  ← LL.3 stub
│   └── README.md
├── PROMPT_OPTIMIZATION/                         ← LL.4 stub
│   └── README.md
├── OBSERVATIONS/                                ← shadow-mode observation accumulator
│   └── .gitkeep                                 ← empty until M4 first calibration
└── PARAMETER_UPDATES/                           ← Bayesian-update landing zone
    └── .gitkeep                                 ← empty until M4 first calibration
```

What is **not** here (and why):

- No `signal_weights/`, `edge_weights/`, `embedding_adapters/`, `prompts/` under any
  mechanism — those are M4 calibration outputs per MP §LL-Appendix.B.
- No `retrieval_rankers/`, `plan_selectors/`, `discovery_priors/`, `bayesian_posteriors/`,
  `miss_registry/`, `finetuned_models/` — those are LL.5–LL.10 scope, not Step 11.
- No `PROMPT_REGISTRY/`, `PREDICTION_LEDGER/`, `SCHEMAS/` (and no `prediction_ledger.jsonl`
  or schema files) — those are PHASE_B_PLAN B.0's substrate-hook scaffold (see §6 below).
  When M2 execution resumes post-Step-15, B.0 adds them as **siblings** to the mechanism
  stubs above.

---

## §4 — Operational subdirectories

### §4.1 — `OBSERVATIONS/`

Accumulator for shadow-mode observations toward the per-mechanism N-observation threshold
(≥3 per MP §"Learning discipline" rule #3). Currently empty. First populated at the M4
calibration session that fires LL.1 for the first time.

Each observation is a JSON record with provenance: which mechanism, which signal/edge/
prompt was observed, what the empirical outcome was, what SESSION_LOG entry produced it,
and what the held-out partition was at that moment (per MP rule #4).

### §4.2 — `PARAMETER_UPDATES/`

Bayesian-update landing zone after the two-pass Gemini/Claude protocol approves a
parameter update (per MP §"Learning discipline" rule #3 + rule #5). Currently empty.
Also the destination for per-mechanism N-override amendments to MP §LL-Appendix.B
(deferred to Step 12 per the decision record §5.4).

Each update is versioned per mechanism (monotonically increasing); reversal is performed
by retracting the version + logging the retraction in `OBSERVATIONS/` next to the data
that motivated it.

---

## §5 — Binding guardrails

These guardrails are restated from `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5` and bind
every session that touches any file in this directory.

1. **Empty-scaffold guardrail (§5.1).** Step 11's scaffold is empty. A non-empty mechanism
   subdirectory before the M-phase named in its banner is a violation.
2. **Population-gate guardrail (§5.2).** No mechanism fires in M2; first observations are
   admitted only after M4 Empirical Calibration begins.
3. **Two-pass-approval guardrail (§5.3).** Every parameter update requires both agents'
   approval evidence in the SESSION_LOG entry that performs the write.
4. **Per-mechanism N deferral (§5.4).** N defaults to 3 per mechanism (the MP minimum).
   Per-mechanism overrides are deferred to Step 12 or to the activating M-phase session,
   whichever fires first.
5. **Classical-priors-locked guardrail (§5.5).** Learning modulates; never overwrites.
   No write to L1/L2.5/L3 from a Learning Layer pipeline. Modulators live exclusively
   under this directory.
6. **Auditable-reversible-versioned guardrail (§5.6).** Every write rotates the affected
   mechanism stub's "Last update" footer with the SESSION_LOG entry ID and parameter
   version. Every parameter version is monotonically increasing per mechanism.
7. **Drift-detector / schema-validator coverage (§5.7).** Step 12 ongoing-hygiene
   policies will commit a `learning_layer_stub` validator class with STATUS-banner regex
   check and population-gate rule. Until Step 12 closes, indirect coverage applies.

The non-negotiable learning discipline (six rules; full text in MP §"Learning Layer"):

1. Classical priors are locked; learning modulates, never overwrites.
2. Bayesian posterior framing with tight priors; frequentist overfit is rejected.
3. Every parameter update requires ≥N independent observations (N defaults to 3).
4. Held-out prospective data is sacrosanct.
5. Every learned parameter is auditable, reversible, versioned, logged.
6. The prior is the classical corpus; evidence earns the right to modulate.

---

## §6 — PHASE_B_PLAN B.0 forthcoming extension

When M2 execution resumes (post-Step-15), `PHASE_B_PLAN_v1_0.md §F.1` Hook 1 extends this
scaffold by adding three sibling subdirectories with their substrate hooks:

- `PROMPT_REGISTRY/INDEX.json` — feeds LL.4 prompt versioning at activation.
- `PREDICTION_LEDGER/prediction_ledger.jsonl` — feeds the CW.PPL prospective-prediction
  workstream + (later) LL.9 counterfactual learning. Starts empty.
- `SCHEMAS/prediction_schema_v0_1.json` + `SCHEMAS/prompt_registry_schema_v0_1.json` —
  substrate schemas for the ledger/registry write paths.

These are **siblings** to the mechanism stubs (`SIGNAL_WEIGHT_CALIBRATION/`, etc.), not
duplicates. The M2 session that performs this extension does not modify or delete any
file Step 11 produced; it only adds. `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §7`
documents the coordination rationale (resolution of Step 4 red-team WARN.1).

---

## §7 — Provenance

This README, the four mechanism stubs (LL.1–LL.4), and the two operational subdirectory
`.gitkeep` markers are the Step 11 scaffold deliverable per
`STEP_BRIEFS/STEP_11_LEARNING_LAYER_SCAFFOLD_v1_0.md §3.3`.

The decision to scaffold (vs amend MP wording) is recorded in
`00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` §1 — verdict SCAFFOLD per
native input 2026-04-24.

GA.6 closure is recorded in PROJECT_ARCHITECTURE_v2_2 §D.10 + this README's existence +
the decision record's §9.

---

*End of 06_LEARNING_LAYER/README.md — produced at Step 11 of the Step 0 → Step 15
governance rebuild — 2026-04-24.*
