---
artifact: GOVERNANCE_BASELINE_v1_0.md
version: 1.0
status: CLOSED
canonical_id: GOVERNANCE_BASELINE
produced_during: STEP_15_GOVERNANCE_BASELINE_CLOSE
produced_on: 2026-04-24
authoritative_side: claude
mirror_obligations:
  claude_side: 00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md
  gemini_side: null
  mirror_mode: claude_only
  asymmetries: >
    Closed sealing artifact; Claude-resident by construction. Gemini-side
    .gemini/project_state.md §Governance Rebuild Closed block reflects the
    Step 15 closure state (MP.2 composite mirror update at this step close).
role: >
  The sealing artifact for the Step 0 → Step 15 governance rebuild. Declares
  the rebuild closed, records the baseline state at the moment of closure,
  and provides the authoritative hand-off point from the rebuild arc to steady-
  state M2 Corpus Activation execution. After this file is produced and Step 15
  closes, the STEP_LEDGER is retired, CURRENT_STATE_v1_0.md becomes the sole
  authoritative state-pointer, and the three governance scripts (drift_detector.py,
  schema_validator.py, mirror_enforcer.py) operate under the steady-state cadence
  declared in ONGOING_HYGIENE_POLICIES_v1_0.md.
consumers:
  - Every future session opening the AM-JIS project — verifies rebuild was closed
  - ONGOING_HYGIENE_POLICIES_v1_0.md §H quarterly governance pass — uses this file
    as the baseline-state anchor for drift comparison
  - CURRENT_STATE_v1_0.md — cites this file as the rebuild-close artifact
changelog:
  - v1.0 (2026-04-24, Step 15 of the Step 0 → Step 15 governance rebuild):
    Initial and final version. Sealing artifact. Status CLOSED immediately on
    production — this file is not amended; it records the point-in-time baseline.
---

# GOVERNANCE BASELINE v1.0
## AM-JIS Project — Step 0 → Step 15 Governance Rebuild Closure Record

*Produced in Step 15 of the Step 0 → Step 15 governance rebuild.*
*Status: CLOSED — this artifact is a point-in-time sealed record.*

---

## §1 — Declaration

**The Step 0 → Step 15 AM-JIS governance rebuild is closed on 2026-04-24.**

This file is the baseline state record. It seals the rebuild arc that began on 2026-04-23 when a grounding audit (`GROUNDING_AUDIT_v1_0.md`) found 32 findings (4 CRITICAL, 11 HIGH, 12 MEDIUM, 5 LOW) spanning version drift, phantom references, absent enforcement, and schema gaps across the project's governance surfaces.

The rebuild arc produced:

- A revised ten-macro-phase strategic plan (`MACRO_PLAN_v2_0.md`) addressing all Macro Plan critique findings.
- A refreshed architectural blueprint (`PROJECT_ARCHITECTURE_v2_2.md`) incorporating multi-agent collaboration discipline and the Learning Layer.
- A full governance and integrity protocol (`GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`) with six axioms, six axes, and thirteen mechanical controls.
- An implemented integrity system: three governance scripts (`drift_detector.py`, `schema_validator.py`, `mirror_enforcer.py`), a machine-readable canonical-path registry (`CANONICAL_ARTIFACTS_v1_0.md`), session templates, and a disagreement register.
- A rebuilt master instruction file (`CLAUDE.md v2.0`) and parity-updated Gemini-side surfaces (`.geminirules`, `.gemini/project_state.md`).
- A SESSION_LOG schema (`SESSION_LOG_SCHEMA_v1_0.md`) and a canonical state pointer (`CURRENT_STATE_v1_0.md`).
- A Learning Layer scaffold decision and directory scaffold (`06_LEARNING_LAYER/`).
- A consolidated hygiene policy set (`ONGOING_HYGIENE_POLICIES_v1_0.md`).
- Two baseline enforcement runs: drift baseline (`DRIFT_REPORT_STEP_13_v1_1.md`, verdict CLEAN) and schema baseline (`SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md`, verdict RESIDUAL).

At the moment this file is produced, the three governance scripts produce the following clean-baseline output:

```
drift_detector.py:     exit 3 — 100 findings (98 WARN.2-whitelisted MEDIUM + 2 LOW bootstrap-placeholders; zero HIGH, zero CRITICAL)
schema_validator.py:   exit 3 — 46 violations (35 MEDIUM + 11 LOW; zero HIGH, zero CRITICAL; 46 pre-existing frontmatter-hygiene items with named owners)
mirror_enforcer.py:    exit 0 — 8/8 pairs PASS; ND.1 holds
```

Any future session that observes a finding at HIGH or CRITICAL severity, or sees `mirror_enforcer.py` exit non-zero, is detecting a **regression** against this baseline.

---

## §2 — Closure matrix (all 32 GA.N findings)

One row per finding from `GROUNDING_AUDIT_v1_0.md`. Columns: finding ID, severity, closing step, resolving artifact, verdict.

| Finding | Severity | Closing Step | Resolving Artifact | Verdict |
|---|---|---|---|---|
| **GA.1** — FILE_REGISTRY + GOVERNANCE_STACK claim MSR_v2_0 CURRENT (MSR_v3_0 actual) | CRITICAL | Step 7 | `CANONICAL_ARTIFACTS_v1_0.md §1` MSR row; `FILE_REGISTRY_v1_4.md`; `drift_detector.py` cross-surface path-version enforcement | RESOLVED |
| **GA.2** — project_state.md reports 500 signals (actual 499) | MEDIUM | Step 9 | `.gemini/project_state.md` re-authored; `CANONICAL_ARTIFACTS §1` MSR row `numeric_invariants: signal_count: 499` | RESOLVED |
| **GA.3** — UCN_v4_0 unreferenced in project_state.md | LOW | Step 7 | `.geminirules` L2.5 canonical-path block; `.gemini/project_state.md` Canonical Corpus State; `MP.5` enforcement rule | RESOLVED |
| **GA.4** — MACRO_PLAN stale: "CGM not rebuilt on v8.0" | HIGH | Step 3 | `MACRO_PLAN_v2_0.md §M1` M1 status correctly reflects CGM_v2_0 rebuilt on FORENSIC_v8_0 | RESOLVED |
| **GA.5** — MACRO_PLAN stale: "four L3 reports stale" | HIGH | Step 3 | `MACRO_PLAN_v2_0.md §M1` removes stale claim; all nine L3 reports at v1.1+ per GAP_RESOLUTION_SESSION | RESOLVED |
| **GA.6** — Learning Layer described in present tense; directory absent | MEDIUM | Step 11 | `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` (verdict SCAFFOLD); `06_LEARNING_LAYER/` scaffold with LL.1–LL.4 stubs clearly marked `STATUS: STUB — activates at M4` | RESOLVED |
| **GA.7** — project_state.md anchors to superseded twinkly-puzzling-quokka.md | HIGH | Step 5 | `.gemini/project_state.md` rewritten at Step 5 (twinkly reference dropped; PHASE_B_PLAN v1.0.2 + MP v2.0 pointers adopted) | RESOLVED |
| **GA.8** — AM_JIS_BOOTSTRAP_HANDOFF.md existence unverified | LOW | Step 12 | File confirmed to exist; retired at Step 12 per native decision with SUPERSEDED banner pointing to successors (CLAUDE.md v2.0 + PROJECT_ARCHITECTURE_v2_2 + MACRO_PLAN_v2_0 + CURRENT_STATE_v1_0) | RESOLVED |
| **GA.9** — LEL v1.2 not listed in CLAUDE.md | CRITICAL | Step 9 | `CLAUDE.md v2.0 §E` Concurrent workstreams: LEL v1.2 explicitly surfaced with M4 prerequisite and cadence; `CANONICAL_ARTIFACTS §1` LEL row registered | RESOLVED |
| **GA.10** — GOVERNANCE_STACK unreferenced in CLAUDE.md | HIGH | Step 9 | `CLAUDE.md v2.0 §D` cites CANONICAL_ARTIFACTS by reference; GOVERNANCE_STACK is a canonical artifact in `CANONICAL_ARTIFACTS §1`; session templates reference it via close-checklist machinery | RESOLVED |
| **GA.11** — MAINTENANCE/FALSIFIER/CONTRADICTION/AUDIT artifacts unreferenced | MEDIUM | Steps 9 + 12 | Accepted as correct scope-separation per `PROJECT_ARCHITECTURE_v2_2 §B.2` + `ONGOING_HYGIENE_POLICIES §0`: those are corpus-subject-layer maintenance artifacts; governance-layer mandatory reading covers governance surfaces only. Not an omission — a design boundary. | ACCEPTED_AS_POLICY |
| **GA.12** — LEL v1.1 predecessor not archived | LOW | Step 12 | `LIFE_EVENT_LOG_v1_1.md` received SUPERSEDED banner + frontmatter flip per `ONGOING_HYGIENE_POLICIES §B` at Step 12 close | RESOLVED |
| **GA.13** — sync mechanism procedural, not mechanical | CRITICAL | Step 7 | `mirror_enforcer.py` operates over `CANONICAL_ARTIFACTS §2` MP.1–MP.8 inventory; runs at every session close; exit non-zero on desync → close fails. Mechanical enforcement replacing honor system. | RESOLVED |
| **GA.14** — no drift-detection script | HIGH | Step 7 | `platform/scripts/governance/drift_detector.py` implemented at Step 7; runs at every session close; exit code 2 fails close. Exit 3 BASELINE is the known-residual floor. | RESOLVED |
| **GA.15** — no session-open handshake | MEDIUM | Step 7 | `SESSION_OPEN_TEMPLATE_v1_0.md` implemented; `schema_validator.py --handshake` validates at open; non-empty `must_not_touch` is required | RESOLVED |
| **GA.16** — no session-close checklist | MEDIUM | Step 7 | `SESSION_CLOSE_TEMPLATE_v1_0.md` implemented; `schema_validator.py` validates close block; SESSION_LOG append is atomic with the close | RESOLVED |
| **GA.17** — SESSION_LOG naming inconsistency | MEDIUM | Step 10 | `SESSION_LOG_SCHEMA_v1_0.md §1` canonical naming schema; `validate_session_log_entries()` in `schema_validator.py` enforces it | RESOLVED |
| **GA.18** — multi-option next-objective entries | LOW | Step 10 | `SESSION_LOG_SCHEMA_v1_0.md §4` requires single committed next-objective; schema enforced at Step 10 close | RESOLVED |
| **GA.19** — "you are here" marker absent | MEDIUM | Step 10 | `CURRENT_STATE_v1_0.md` produced at Step 10 as canonical machine-readable state pointer; `drift_detector.py` cross-checks it against STEP_LEDGER (rebuild era) / SESSION_LOG (always) | RESOLVED |
| **GA.20** — scope-boundary unenforced | MEDIUM | Step 7 (declaration) + Step 12 (compliance) | Step 7: SESSION_OPEN_TEMPLATE requires `declared_scope.may_touch` + non-empty `must_not_touch`. Step 12: `validate_scope_boundary()` + `validate_files_touched_completeness()` in `schema_validator.py` checks `files_touched` against declared scope at close. Both layers closed. | RESOLVED |
| **GA.21** — no automated SESSION_LOG completeness check | LOW | Step 12 | `validate_files_touched_completeness()` added to `schema_validator.py` at Step 12 | RESOLVED |
| **GA.22** — M1 exit criteria under-specified | HIGH | Step 3 | `MACRO_PLAN_v2_0.md §M1` explicit exit criteria enumerated | RESOLVED |
| **GA.23** — Learning Layer mechanisms undefined | HIGH | Step 3 | `MACRO_PLAN_v2_0.md §Learning Layer` defines ten mechanisms with inputs, outputs, and sequencing | RESOLVED |
| **GA.24** — concurrent workstreams cadence/schema unspecified | HIGH | Step 3 | `MACRO_PLAN_v2_0.md §Cross-cutting workstreams` specifies LEL cadence + Prospective Prediction Logging with entry schema | RESOLVED |
| **GA.25** — external dependencies not enumerated | MEDIUM | Step 3 | `MACRO_PLAN_v2_0.md §External Dependency Graph §3.3.E` enumerates Jagannatha Hora, Swiss Ephemeris, Voyage-3-large, Postgres+pgvector, Gemini 2.5 Pro, Opus 4 router | RESOLVED |
| **GA.26** — native's role/cadence not specified in Macro Plan | MEDIUM | Step 3 | `MACRO_PLAN_v2_0.md §3.4.A` specifies native role, approval gates per macro-phase, and daily-session cadence | RESOLVED |
| **GA.27** — no time horizon in Macro Plan | MEDIUM | Step 3 | `MACRO_PLAN_v2_0.md §3.2 meta` acknowledges intentional non-binding posture; macro-phases have sequence-dependency, not calendar dates. Accepted as design choice per MP §3.4.D | DEFERRED (design choice, not oversight — documented in MP §3.2) |
| **GA.28** — no post-M10 framing | LOW | Step 3 | `MACRO_PLAN_v2_0.md §Post-M10 Framing §3.6` added | RESOLVED |
| **GA.29** — ethical framework absent | MEDIUM | Step 3 | `MACRO_PLAN_v2_0.md §Ethical Framework §3.5` added: probabilistic/calibrated outputs, consenting audiences, disclosure tiers | RESOLVED |
| **GA.30** — meta-governance absent from Macro Plan | HIGH | Step 3 | `MACRO_PLAN_v2_0.md §Meta-Governance §3.4.D` specifies MP revision/red-team/retirement triggers | RESOLVED |
| **GA.31** — multi-agent collaboration discipline unspecified | HIGH | Step 3 + Step 5A | `MACRO_PLAN_v2_0.md §Multi-Agent Collaboration §3.4.B` + `PROJECT_ARCHITECTURE_v2_2 §D.11.2` MP.1–MP.8 inventory + ND.1 Mirror Discipline directive | RESOLVED |
| **GA.32** — system integrity not a project axis | CRITICAL | Step 6 + Step 7 | `MACRO_PLAN_v2_0.md §System Integrity Substrate §IS.1–IS.9` as a cross-cutting substrate; `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` full specification; three scripts + registry as implementation | RESOLVED |

**Summary:** 30 RESOLVED, 1 ACCEPTED_AS_POLICY (GA.11 — scope-separation design boundary), 1 DEFERRED_AS_DESIGN_CHOICE (GA.27 — intentional non-binding timeline per MP §3.2). Zero findings abandoned without disposition.

---

## §3 — Artifacts produced in Steps 0–15

Canonical artifacts (registered in `CANONICAL_ARTIFACTS_v1_0.md §1`):

| Step(s) | Path | Version | Status | canonical_id |
|---|---|---|---|---|
| 0 | `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` | 1.0 | CLOSED | — |
| 1 | `00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md` | 1.0 | CLOSED | — |
| 2 | `00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md` | 1.0 | CLOSED | — |
| 3 + 4 + 5 | `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | 2.0 | CURRENT | MACRO_PLAN |
| 4 | `00_ARCHITECTURE/MACRO_PLAN_REDTEAM_v1_0.md` | 1.0 | CLOSED | — |
| 5 | `00_ARCHITECTURE/FILE_REGISTRY_v1_1.md` | 1.1 | SUPERSEDED | — |
| 5A | `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | 2.2 | CURRENT | PROJECT_ARCHITECTURE |
| 5A | `00_ARCHITECTURE/FILE_REGISTRY_v1_2.md` | 1.2 | SUPERSEDED | — |
| 6 | `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` | 1.0 | CURRENT | GOVERNANCE_INTEGRITY_PROTOCOL |
| 7 | `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | 1.0 | CURRENT | CANONICAL_ARTIFACTS |
| 7 | `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` | 1.0 | CURRENT | SESSION_OPEN_TEMPLATE |
| 7 | `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` | 1.0 | CURRENT | SESSION_CLOSE_TEMPLATE |
| 7 | `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` | 1.0 | LIVING | DISAGREEMENT_REGISTER |
| 7 | `00_ARCHITECTURE/FILE_REGISTRY_v1_3.md` | 1.3 | SUPERSEDED | — |
| 7 | `platform/scripts/governance/drift_detector.py` | Step 7 + Step 12 extensions | CURRENT | — |
| 7 | `platform/scripts/governance/schema_validator.py` | Step 7 + Step 12 extensions | CURRENT | — |
| 7 | `platform/scripts/governance/mirror_enforcer.py` | Step 7 | CURRENT | — |
| 7 | `platform/scripts/governance/_ca_loader.py` | Step 7 | CURRENT | — |
| 7 | `platform/scripts/governance/schemas/artifact_schemas.yaml` | Step 7 + Step 12 extensions | CURRENT | — |
| 8 | `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md` | 1.0 | CLOSED | — |
| 9 | `CLAUDE.md` | 2.0 | CURRENT | CLAUDE |
| 9 | `.geminirules` | re-authored-STEP_12 | LIVE | GEMINIRULES |
| 10 | `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | 1.0 | CURRENT | SESSION_LOG_SCHEMA |
| 10 | `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | 1.0 | LIVE | CURRENT_STATE |
| 11 | `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` | 1.0 | CURRENT | LEARNING_LAYER_SCAFFOLD_DECISION |
| 11 | `06_LEARNING_LAYER/README.md` | — | STUB | — |
| 11 | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` (LL.1) | — | STUB | — |
| 11 | `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/README.md` (LL.2) | — | STUB | — |
| 11 | `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/README.md` (LL.3) | — | STUB | — |
| 11 | `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/README.md` (LL.4) | — | STUB | — |
| 12 | `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` | 1.0 | CURRENT | ONGOING_HYGIENE_POLICIES |
| 12 | `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | 1.4 | CURRENT | FILE_REGISTRY |
| 13 | `00_ARCHITECTURE/drift_reports/DRIFT_REPORT_STEP_13_v1_1.md` | 1.1 | CLOSED CLEAN | — |
| 14 | `00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md` | 1.0 | CLOSED RESIDUAL | — |
| 15 | `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md` | 1.0 | CLOSED | GOVERNANCE_BASELINE |

Amended-in-place artifacts (not version-bumped but materially updated across steps):

| Artifact | Updated In |
|---|---|
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Steps 5, 5A, 7, 10, 11, 12, 12.1, 13b, 14, 15 (amendment logs §9–§18) |
| `00_ARCHITECTURE/SESSION_LOG.md` | Every step (atomic append at each session close) |
| `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` | Every step (row transitions + History blocks) |
| `.gemini/project_state.md` | Steps 5, 5A, 7, 9, 10, 11, 12, 12.1, 13b, 13b-fix, 14, 15 (MP.2 mirror) |

Superseded artifacts (retained in-place per `ONGOING_HYGIENE_POLICIES §A`):

| Path | Superseded By | Step |
|---|---|---|
| `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | `MACRO_PLAN_v2_0.md` | 5 |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | `PROJECT_ARCHITECTURE_v2_2.md` | 5A |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` | Chain to v1.4 | pre-Step-0 |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_1.md` | `FILE_REGISTRY_v1_2.md` | 5 |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_2.md` | `FILE_REGISTRY_v1_3.md` | 5A |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_3.md` | `FILE_REGISTRY_v1_4.md` | 12 |
| `AM_JIS_BOOTSTRAP_HANDOFF.md` | CLAUDE.md v2.0 + PA_v2_2 + MP_v2_0 + CURRENT_STATE | 12 |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` | `LIFE_EVENT_LOG_v1_2.md` | 12 |

---

## §4 — Governance scripts

Three scripts reside at `platform/scripts/governance/`. All three are run at every session close as part of the atomic SESSION_LOG append. Exit codes are the enforcement gate.

### drift_detector.py

**Purpose.** Detects divergence between governance surfaces — canonical path/version claims, fingerprint mismatches, supersession-banner gaps, phantom references, SESSION_LOG–CURRENT_STATE disagreements.

**Invocation:**
```bash
python3 platform/scripts/governance/drift_detector.py --repo-root .
```

**Clean-state output at this baseline:**
```
drift_detector: 100 findings; exit=3
  # 98 MEDIUM — WARN.2-whitelisted phantom_references (PHASE_B_PLAN + MACRO_PLAN v1.0 live
  #              pointers in corpus files; deferred to PHASE_B_PLAN v1.0.3 amendment cycle)
  # 2  LOW   — bootstrap_placeholder pattern in CANONICAL_ARTIFACTS self-row and SESSION_LOG row
  # 0  HIGH, 0 CRITICAL
```

**Exit-code meaning:**
- `0` — zero findings (expected only in a fully clean repo)
- `1` — internal script error
- `2` — one or more HIGH or CRITICAL findings → **close fails**
- `3` — only MEDIUM/LOW, all whitelisted → BASELINE (acceptable close state)
- `4+` — reserved

**Deviation that indicates regression:** any exit 2 (HIGH/CRITICAL findings) that was not present at this baseline.

### schema_validator.py

**Purpose.** Validates frontmatter schema for all governance artifacts, session-open/close blocks, CURRENT_STATE fields, learning_layer_stub classes, scope-boundary declarations, files-touched completeness, SESSION_LOG entry structure, mirror structural blocks.

**Invocation:**
```bash
python3 platform/scripts/governance/schema_validator.py --repo-root .
```

**Clean-state output at this baseline:**
```
schema_validator: 46 violations; exit=3
  # 35 MEDIUM — pre-existing frontmatter-hygiene backlog (corpus files, PHASE_B_PLAN, SUPERSEDED
  #              artifacts); owner buckets: corpus-hygiene-pass, PHASE_B_PLAN-v1.0.3-amendment,
  #              SUPERSEDED-no-action, SESSION_LOG-by-design
  # 11 LOW    — pre-existing frontmatter-hygiene (same owner buckets)
  # 0  HIGH, 0 CRITICAL
```

**Deviation that indicates regression:** any HIGH or CRITICAL violation, or any new MEDIUM/LOW violation not in the 46-item baseline.

### mirror_enforcer.py

**Purpose.** Checks semantic parity between Claude-side and Gemini-side of each MP.1–MP.8 mirror pair. Uses enforcement rules declared in `CANONICAL_ARTIFACTS §2`.

**Invocation:**
```bash
python3 platform/scripts/governance/mirror_enforcer.py --repo-root .
```

**Clean-state output at this baseline:**
```
mirror_enforcer: 0 findings; exit=0
  pairs checked=8; passed=8; failed=0; claude_only=2
  # MP.1 (CLAUDE.md ↔ .geminirules)                — PASS adapted_parity
  # MP.2 (composite ↔ .gemini/project_state.md)     — PASS adapted_parity_state
  # MP.3 (MACRO_PLAN ↔ Gemini summary)              — PASS adapted_parity_summary
  # MP.4 (PHASE_B_PLAN ↔ Gemini phase pointer)      — PASS adapted_parity_summary
  # MP.5 (FILE_REGISTRY ↔ Gemini L2.5 block)        — PASS adapted_parity_subset
  # MP.6 (GOVERNANCE_STACK — Claude-only)            — PASS_DECLARED_CLAUDE_ONLY
  # MP.7 (SESSION_LOG — Claude-only)                 — PASS_DECLARED_CLAUDE_ONLY
  # MP.8 (PROJECT_ARCHITECTURE ↔ Gemini summary)    — PASS adapted_parity_summary
```

**Deviation that indicates regression:** any exit non-zero.

---

## §5 — Governance guarantees (axioms restated as baseline commitments)

The six axioms from `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §A`, restated as standing commitments binding the project from this baseline forward:

**G.1 — Single source of truth per canonical artifact.** For every canonical artifact, exactly one file is CURRENT at any moment. All cross-surface references resolve to the same path and version. `CANONICAL_ARTIFACTS_v1_0.md §1` is the authoritative registry; every other surface cites it rather than duplicating its declarations.

**G.2 — Every cross-surface reference is resolvable and current.** No governance surface contains a live pointer to a non-existent file, a SUPERSEDED version without a supersedure banner, or a canonical path that contradicts CANONICAL_ARTIFACTS. `drift_detector.py` enforces this at every session close.

**G.3 — No drift goes undetected for more than one session.** `drift_detector.py` runs at every session close. Sessions that skip it or that yield exit 2 do not close. The honor-system regime (which broke within days, per GA.13) is replaced by mechanical enforcement.

**G.4 — Every session produces an auditable trace.** Every session emits a session-open handshake and a session-close checklist. Both are machine-readable. Both are appended to SESSION_LOG as part of atomic close. A session without a handshake or close checklist is not well-formed.

**G.5 — Mirror discipline is mechanically enforced.** `mirror_enforcer.py` operates over the MP.1–MP.8 inventory at every session close. ND.1 (Mirror Discipline) status: `addressed` since Step 7 (2026-04-24).

**G.6 — The governance system is self-governing.** Governance artifacts are themselves subject to `drift_detector.py`, `schema_validator.py`, and `mirror_enforcer.py`. The quarterly governance pass (per `ONGOING_HYGIENE_POLICIES §H`) audits governance surfaces for accumulated drift. The governance system does not exempt itself.

---

## §6 — What changed vs pre-Step-0

### Files created (new artifacts that did not exist before 2026-04-23)

- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` (v2.0; v1.0 SUPERSEDED)
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` (v2.2; v2.1 SUPERSEDED)
- `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`
- `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`
- `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md`
- `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md`
- `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md`
- `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md`
- `00_ARCHITECTURE/CURRENT_STATE_v1_0.md`
- `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md`
- `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md`
- `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` (v1.4; v1.3 and predecessors SUPERSEDED)
- `platform/scripts/governance/drift_detector.py`
- `platform/scripts/governance/schema_validator.py`
- `platform/scripts/governance/mirror_enforcer.py`
- `platform/scripts/governance/_ca_loader.py`
- `platform/scripts/governance/schemas/artifact_schemas.yaml`
- `06_LEARNING_LAYER/` scaffold (README + four LL.1–LL.4 stubs + two .gitkeep markers)
- `00_ARCHITECTURE/drift_reports/` (drift detector report archive)
- `00_ARCHITECTURE/schema_reports/` (schema validator report archive)
- `00_ARCHITECTURE/mirror_reports/` (mirror enforcer report archive)
- `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` (the rebuild's own workflow ledger)
- `00_ARCHITECTURE/STEP_BRIEFS/` (16 step briefs + README)
- `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md`
- `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md` (this file)

### Versions bumped

| Artifact | Pre-Step-0 | Post-Step-15 |
|---|---|---|
| MACRO_PLAN | v1.0 CURRENT | v2.0 CURRENT (v1.0 SUPERSEDED) |
| PROJECT_ARCHITECTURE | v2.1 CURRENT | v2.2 CURRENT (v2.1 SUPERSEDED) |
| FILE_REGISTRY | v1.0 CURRENT | v1.4 CURRENT (v1.0–v1.3 SUPERSEDED) |
| CLAUDE.md | pre-v2.0 (no version) | v2.0 CURRENT |
| .geminirules | pre-Step-7 | re-authored-STEP_12 LIVE |
| .gemini/project_state.md | undated (twinkly-quokka reference) | re-authored-STEP_15 LIVE |

### Policies installed

- Archival retain-in-place (`ONGOING_HYGIENE_POLICIES §A`)
- Predecessor-cleanup standing rule (`ONGOING_HYGIENE_POLICIES §B`)
- Scope-boundary enforcement at session-open + session-close (`ONGOING_HYGIENE_POLICIES §C`)
- SESSION_LOG completeness check (`ONGOING_HYGIENE_POLICIES §D`)
- Staleness register 30-day cadence (`ONGOING_HYGIENE_POLICIES §E`)
- CI / cron cadence with exit-code-3 whitelist (`ONGOING_HYGIENE_POLICIES §F`)
- Red-team cadence (every-third-session + macro-phase-close + 12-monthly) (`ONGOING_HYGIENE_POLICIES §G`)
- Quarterly governance pass (`ONGOING_HYGIENE_POLICIES §H`)
- Macro Plan review triggers + explicit WARN.2/3/5/7 re-defer (`ONGOING_HYGIENE_POLICIES §I`)
- Mirror discipline (`CANONICAL_ARTIFACTS §2` MP.1–MP.8; `mirror_enforcer.py`)

### Native directive

- **ND.1 — Mirror Discipline**: issued 2026-04-23, addressed 2026-04-24 at Step 7 close. Six per-step verifications (Steps 2/3/4/5A/6/7) confirmed. Status: `addressed`. No open directive at baseline close.

---

## §7 — What did not change

The governance rebuild touched **governance surfaces only**. The following corpus artifacts are unchanged from their pre-Step-0 state:

- `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` — L1 canonical chart data (FORENSIC v8.0); not touched.
- `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` — LEL v1.2, 36 events + 5 period summaries + 6 chronic patterns; not touched (only predecessor v1.1 received a SUPERSEDED banner, which is a surface change on the old file, not on v1.2).
- `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` — Master Signal Register, 499 signals; not touched.
- `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` — Unified Chart Narrative; not touched.
- `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` — Cross-Domain Linkage Matrix; not touched.
- `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` — Resonance Map; not touched.
- `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` — Chart Graph Model; not touched.
- All nine `03_DOMAIN_REPORTS/` L3 domain reports — not touched.
- `05_DISCOVERY_LAYER/` — Gemini L4 work; not touched.
- `PHASE_B_PLAN_v1_0.md` (v1.0.2) — M2 execution plan; not touched (rebuild-era pause; v1.0.3 amendment cycle booked per `ONGOING_HYGIENE_POLICIES §I`).

**The Jyotish corpus — every interpretation, every signal, every derivation — is exactly as it was before 2026-04-23.** The rebuild improved the infrastructure that protects and navigates the corpus, not the corpus itself.

---

## §8 — Known deferred items

Items that are explicitly out of scope for the governance rebuild but tracked for future action:

| Item | Origin | Owner | Target window |
|---|---|---|---|
| **WARN.2** — PHASE_B_PLAN §5 header + §N.10 live MACRO_PLAN v1.0 pointers | Step 5 | PHASE_B_PLAN v1.0.3 amendment session | M2 resume post-Step-15 |
| **WARN.3** — `025_HOLISTIC_SYNTHESIS/CLAUDE.md` live pointer to MACRO_PLAN_v1_0 | Step 5A | PHASE_B_PLAN v1.0.3 amendment session | M2 resume post-Step-15 |
| **WARN.5** — `B0_KICKOFF_PROMPT_FOR_CLAUDE_CODE.md` live MACRO_PLAN v1.0 pointer | Step 5 | PHASE_B_PLAN v1.0.3 amendment session | M2 resume post-Step-15 |
| **WARN.7** — `025_HOLISTIC_SYNTHESIS/CLAUDE.md` pointer to PROJECT_ARCHITECTURE_v2_1 | Step 5A | PHASE_B_PLAN v1.0.3 amendment session | M2 resume post-Step-15 |
| **GA.11 (partial)** — MAINTENANCE_SCHEDULE/FALSIFIER_REGISTRY etc. not in CLAUDE.md mandatory reading | Step 12 | Accepted as scope-separation policy; no action required unless new evidence shows a session was harmed by their absence | Quarterly governance pass |
| **GA.27** — Macro Plan time horizon intentionally non-binding | Step 3 | Accepted as design choice per MP §3.2 | Revisit at M5 per MP §3.4.D meta-governance |
| **Schema MEDIUM/LOW 46 violations** — pre-existing frontmatter hygiene backlog | Step 14 | Three owner buckets: corpus-hygiene-pass (post-M2 resume), PHASE_B_PLAN v1.0.3 (2 items), SUPERSEDED-no-action (historical files) | Per owner bucket |
| **PHASE_B_PLAN v1.0.3 amendment** — WARN.2/3/5/7 cleanup + B.0 scope refresh post-MP v2.0 | `ONGOING_HYGIENE_POLICIES §I` | First M2 session (PHASE_B_PLAN amendment) | M2 resume |

Rationale for all deferrals: each item is explicitly out of the governance rebuild's scope with a named owner and a named trigger. No item is deferred with vague "will revisit" language. Tracking mechanism: `ONGOING_HYGIENE_POLICIES §I` (WARN items) + `ONGOING_HYGIENE_POLICIES §K` (residual disposition).

---

## §9 — Resumption pointer

**The project now resumes M2 Corpus Activation per `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` v1.0.2 (paused since Step 0 open, 2026-04-23).**

Before executing any B.X phase-plan sub-phase, the first M2 resumption session MUST:

1. **Execute the PHASE_B_PLAN v1.0.3 amendment session** — resolve WARN.2/WARN.3/WARN.5/WARN.7 (live MACRO_PLAN v1.0 + PROJECT_ARCHITECTURE v2.1 pointers in corpus-adjacent files), refresh B.0 scope to reflect MP v2.0's revised M2 framing, and bump to v1.0.3 per `ONGOING_HYGIENE_POLICIES §I` rationale.
2. **Read the amended PHASE_B_PLAN v1.0.3** to understand B.0's updated scope.
3. **Execute Phase B.0** (or the first sub-phase the amended plan prescribes) per the phase-plan.

The active macro-phase is M2 — Corpus Activation. Active phase-plan: `PHASE_B_PLAN_v1_0.md` v1.0.2 (→ v1.0.3 at amendment). Phase-plan sub-phase: null (execution not yet begun; B.0 is the entry sub-phase). `CURRENT_STATE_v1_0.md` is now the authoritative state-pointer; it will be updated at each session close going forward.

**STEP_LEDGER is retired.** The STEP_LEDGER's rebuild-era role is fulfilled. Its final status is `GOVERNANCE_CLOSED` (see §2 / History). Future governance work happens via quarterly passes per `ONGOING_HYGIENE_POLICIES §H` or ad-hoc grounding audits triggered by new drift — not via a numbered-step ledger.

---

## §10 — Next governance cycle trigger

**Quarterly governance pass** per `ONGOING_HYGIENE_POLICIES_v1_0.md §H`.

- **First quarterly pass due:** 2026-07-24 (three calendar months after 2026-04-24 rebuild close).
- **Scope of each pass:** re-run all three governance scripts; check CANONICAL_ARTIFACTS fingerprints against disk; scan for new orphan predecessors; verify STEP_BRIEFS folder is still read-only historical; confirm 06_LEARNING_LAYER stubs still carry `STATUS: STUB` banners; check that no new native directive has been silently issued. Full scope per `ONGOING_HYGIENE_POLICIES §H`.
- **Ad-hoc trigger:** any session that detects a HIGH or CRITICAL finding at session-open should treat it as an immediate grounding event and halt substantive work until the finding is resolved — per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §A.3`.
- **Red-team trigger:** red-team counter resets to 0 at this Step 15 macro-phase-close red-team. Next cadence fire: every-third-session (counter ≥ 3) or next macro-phase close (M2 close), whichever comes first.

---

*End of GOVERNANCE_BASELINE_v1_0.md — Step 15 of the Step 0 → Step 15 governance rebuild — 2026-04-24.*
