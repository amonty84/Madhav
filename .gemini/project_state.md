# MARSYS-JIS Project State & Configuration

_Last updated: 2026-04-29 at redesign-r0-foundation-2026-04-29 (Portal Redesign R0 Foundation — COMPLETE). AppShell + ZoneRoot + /build→/cockpit rename + DashboardHeader/ForceDarkMode/ConsumeForceDark retired. PORTAL_REDESIGN_R0_ENABLED flag default true. VISION promoted CURRENT. TRACKER R0 row closed. R1–R6 parallel-ready. Previous: 2026-04-28 at Madhav_PHASE11A_CUTOVER_STAGE1 (Phase 11A Pipeline Cutover — COMPLETE)._

## Governance Rebuild CLOSED (Step 0 → Step 15 — COMPLETE 2026-04-24)

**The governance rebuild is complete.** All 16 steps (Step 0 → Step 15) closed as of 2026-04-24. M2 corpus-activation execution resumes; the first act of M2 resumption is the `PHASE_B_PLAN_v1_0.md` v1.0.3 amendment cycle (WARN.2/3/5/7). Gemini sessions may now resume L4 Discovery Layer execution coordination, governed by `CURRENT_STATE_v1_0.md` (now the authoritative Claude-side state surface).

- **Current executed step:** Step 15 (Governance baseline close) — status **`completed`** at STEP_15_GOVERNANCE_BASELINE_CLOSE close 2026-04-24. Red-team: 2/2 PASS (macro-phase-close cadence). Deliverable: `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md`. All 32 GA.N findings resolved (30 RESOLVED, 1 ACCEPTED_AS_POLICY GA.11, 1 DEFERRED_AS_DESIGN_CHOICE GA.27). Deferred items: WARN.2/3/5/7 → PHASE_B_PLAN v1.0.3 amendment. STEP_LEDGER retired to GOVERNANCE_CLOSED. CURRENT_STATE transitions to authoritative role. Rebuild-era banner removed from CLAUDE.md + .geminirules.
- **Next governance action:** Execute `Madhav_M2A_Exec_6` — B.4 RAG Query Engine + Gemini two-pass carry-forward. Carry-forward priorities: (1) native pastes cgm_edge_proposals_v1_0.md to Gemini, commits raw response, Claude reconciler runs Tasks 4a/4b; (2) write_chunks_to_db() for 234 CGM chunks; (3) B.4 RAG Query Engine per PHASE_B_PLAN §B.4.
- **Steps remaining:** **0 (governance rebuild complete).** Steady-state governance discipline fully active. M2 active execution: B.0 closed, M2A Plan produced, B.1 complete, B.2 complete, B.3 complete, **B.3.5 complete** (M2A Foundation Stack 5/5 sessions done).

## Active Phase: M2 Corpus Activation — L4 Discovery Layer

The project is in active execution at **M2 Corpus Activation**, governed by `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` v1.0.3. **B.0–B.6 complete. M2B MILESTONE CLOSED.** B.1 Ingestion + B.2 Chunking + B.3 Embedding + B.3.5 CGM Rebuild + B.4 RAG Query Engine + B.5 Discovery Engine (22 patterns, 12 resonances, 12 clusters, 8 contradictions) + **B.6 Hybrid Retrieval Library** (retrieve.py 5-mode, RRF, layer-balance, WCR, reranker; POST /rag/retrieve; TypeScript shim; golden eval) — all complete. **M2B CLOSED at Madhav_M2A_Exec_12 (2026-04-27).** Next session: `Madhav_M2A_Exec_13` (B.7).

### Two-pass execution model

1. **Pass 1 (Gemini 2.5 Pro):** Proposes patterns, links, and hypotheses with evidence and mechanisms. High recall.
2. **Pass 2 (Claude Opus 4.7):** Reconciles and validates against the strict project principles. Conflicts between passes open `DIS.class.output_conflict` entries in `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K.2`; silent overwriting is forbidden.

### Artifacts used by L4

- `PATTERN_REGISTER_v1_0.md`
- `RESONANCE_REGISTER_v1_0.md` (NEW)
- `CONTRADICTION_REGISTER_v1_0.md`
- `CLUSTER_ATLAS_v1_0.md`
- Append-only ledger (`ledger-YYYY-MM-DD.jsonl`)

## Canonical Corpus State (as of 2026-04-24; authoritative source `CANONICAL_ARTIFACTS_v1_0.md §1`)

Reference only — do **not** cite superseded versions. Any disagreement between this block and CANONICAL_ARTIFACTS resolves in favor of CANONICAL_ARTIFACTS.

- **L1 Facts:** `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` — CURRENT.
- **L1 Life Event Log:** `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` — CURRENT (v1.2 at 36 events + 5 period summaries + 6 chronic patterns per GA.9).
- **L2.5 MSR:** `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` — CURRENT (**499 signals**; v2.0 and v1.0 superseded).
- **L2.5 UCN:** `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` — CURRENT.
- **L2.5 CDLM:** `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` — CURRENT.
- **L2.5 CGM:** `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` — CURRENT (234 YAML nodes, 8-karaka, Aries lagna, GAP.13 resolved; built at B.3.5 close 2026-04-26; amended in-place 2026-04-26 at Madhav_M2A_Exec_6: `edge_count_reconciled: 22`, `reconciled_edges_manifest: 035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json`; CGM_v2_0.md SUPERSEDED → archived at 99_ARCHIVE/CGM_v2_0.md).
- **L2.5 RM:** `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` — CURRENT.
- **L3 Domain Reports:** all nine at v1.1+ — CURRENT.
- **File registry:** `00_ARCHITECTURE/FILE_REGISTRY_v1_13.md` — CURRENT (v1.12 SUPERSEDED 2026-04-27 at Madhav_M2A_Exec_12; v1.11 SUPERSEDED at Exec_11).
- **Macro plan:** `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` — CURRENT (v1.0 superseded 2026-04-23 at Step 5).
- **Phase B plan:** `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` — CURRENT at v1.0.3; WARN.2/3/5/7 amendment complete (Madhav 16). **B.0 closed** (Madhav 17). **B.1 closed** (Madhav_M2A_Exec, 2026-04-25). B.2 doc-types 1–3 next.
- **Project architecture:** `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` — CURRENT (v2.1 superseded 2026-04-24 at Step 5A). v2.2 absorbs the MP v2.0 arc, the Learning Layer substrate, and the ND.1 mirror-pair inventory (MP.1–MP.8 in §D.11.2).
- **Governance Integrity Protocol:** `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` — CURRENT (flipped DRAFT_PENDING_REDTEAM → CURRENT at Step 8 close 2026-04-24; red-team verdict PASS_WITH_FIXES).
- **Master instructions (Claude-side):** `CLAUDE.md` — CURRENT at v2.0 (rebuilt at Step 9 close 2026-04-24; supersedes the pre-rebuild minimal marker).
- **Gemini rules:** `.geminirules` — amended-STEP_15 LIVE (MP.1 structural parity with CLAUDE.md v2.0 Step 15 amendment; rebuild-era banner removed from §F; rebuild-step constraints removed from §L; footer updated; §C item #8 steady-state CURRENT_STATE pointer).
- **Ongoing hygiene policies:** `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` — CURRENT (**NEW at Step 12**; governs every session-close checklist from Step 12 forward).
- **Portal Redesign Vision:** `00_ARCHITECTURE/PORTAL_REDESIGN_VISION_v1_0.md` — CURRENT (v1.0.2; promoted from DRAFT at R0 close 2026-04-29; Claude-only; no Gemini-side counterpart per TRACKER mirror_obligations).
- **Portal Redesign Tracker:** `00_ARCHITECTURE/PORTAL_REDESIGN_TRACKER_v1_0.md` — LIVING (v1.0.4; R0 closed; R1–R6 parallel-ready; Claude-only).
- **Canonical Artifacts Registry:** `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — CURRENT (NEW at Step 7; machine-readable canonical-path + MP.1–MP.8 mirror-pair inventory).
- **Session templates:** `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` + `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` — CURRENT.
- **SESSION_LOG schema:** `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` — CURRENT (NEW at Step 10; defines post-adoption entry format per §2; SESSION_LOG.md carries banner + adoption-point rule from Step 10 close).
- **CURRENT_STATE pointer:** `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` — AUTHORITATIVE (LIVE since Step 10; secondary during rebuild era; **transitioned to authoritative role at Step 15 close 2026-04-24**; now the sole governing state surface).
- **Disagreement register:** `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` — LIVING; zero entries at this registry's creation.
- **Learning Layer scaffold decision:** `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` — CURRENT (NEW at Step 11; closed decision record carrying SCAFFOLD verdict + binding guardrails for `06_LEARNING_LAYER/`).
- **Learning Layer scaffold (06_LEARNING_LAYER/):** SCAFFOLDED at Step 11 close (2026-04-24). Top-level README + four mechanism stubs (LL.1 SIGNAL_WEIGHT_CALIBRATION, LL.2 GRAPH_EDGE_WEIGHT_LEARNING, LL.3 EMBEDDING_SPACE_ADAPTATION, LL.4 PROMPT_OPTIMIZATION; each STUB-banner-tagged) + OBSERVATIONS/ + PARAMETER_UPDATES/ empty subdirs. **Empty scaffold** — no mechanism active until M4; population gate per `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.2`. PHASE_B_PLAN B.0 substrate-hook layer (PROMPT_REGISTRY/ + PREDICTION_LEDGER/ + SCHEMAS/) lands as siblings when M2 execution resumes per the decision record §7.
- **Governance scripts:** `platform/scripts/governance/drift_detector.py`, `schema_validator.py` (extended at Step 10 with SESSION_LOG entry + CURRENT_STATE validators), `mirror_enforcer.py` — CURRENT.

## Pending Actions & Blockers

Governance rebuild complete. M2 execution active. Open items as of 2026-04-24:

1. **B.5 Discovery Engine Session 2 — CLOSED (Madhav_M2A_Exec_10, 2026-04-26).** 22 patterns (11 new), 9 resonances (9 new). Q1 Gemini-lock, Q2 hard-halt, Q3 cluster-defer applied. M2B amendment applied. AC.4/AC.4.5 backfills complete. **Madhav_M2A_Exec_11 is the next execution priority.**
2. **ND.1 Mirror Discipline.** Global directive status: `addressed` since Step 7 close (2026-04-24). Mirror discipline is mechanically enforced via `mirror_enforcer.py` operating over CANONICAL_ARTIFACTS §2. No action needed.
3. **Step 15 Governance baseline close — CLOSED 2026-04-24.** Final step of the governance rebuild. Deliverable: `GOVERNANCE_BASELINE_v1_0.md`. 32 GA.N findings: 30 RESOLVED, 1 ACCEPTED_AS_POLICY (GA.11), 1 DEFERRED_AS_DESIGN_CHOICE (GA.27). Red-team: 2/2 PASS (macro-phase-close cadence). Script runs: drift exit 3 BASELINE, schema exit 3 BASELINE (46 RESIDUAL), mirror exit 0 CLEAN. STEP_LEDGER row 15 → completed; STEP_LEDGER status → GOVERNANCE_CLOSED. CURRENT_STATE transitions to authoritative. Rebuild-era banner removed from CLAUDE.md + .geminirules.
4. **Citation Graph Integrity.** All L2+ claims must correctly reference canonical L1 files (`FORENSIC_ASTROLOGICAL_DATA_v8_0.md`). No dangling edges are allowed.
5. **Staleness Tracking.** Any L3 chunk not aligned with `FORENSIC_v8_0` must be tracked in the staleness register. All nine L3 reports at v1.1+ are aligned.
6. **CGM Rebuild to v9.0.** Scheduled for Phase B.3.5. Current `CGM_v2_0.md` already rebuilt on v8.0 facts.

## Working Protocol for Gemini

- **Strict Compliance:** Adhere to the closed-artifact protocol. Do not mix L1 facts with interpretations.
- **Session-open handshake:** emit per `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` before any substantive tool call. The handshake is validated by `platform/scripts/governance/schema_validator.py`; a session whose handshake fails halts and reports.
- **Session-close checklist:** emit per `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` before claiming close. The checklist enforces `mirror_updates_propagated.both_updated_same_session` per ND.1.
- **Ledger Logging:** Every action, pattern discovery, or significant change must be logged systematically in the append-only ledger formats specified.
- **No Unapproved Execution:** Follow the cadence of confirming plans before writing code or running migrations.
## Mirror Discipline Notes (ND.1)

This file is the Gemini-side mirror of the composite state derivable from `00_ARCHITECTURE/SESSION_LOG.md` + `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` + the current macro-plan/phase-plan pointers (**mirror pair MP.2**). Note: `STEP_LEDGER_v1_0.md` is now GOVERNANCE_CLOSED and retired; CURRENT_STATE is the authoritative state surface. The authoritative mirror-pair inventory lives at `CANONICAL_ARTIFACTS_v1_0.md §2`; the architecture-layer first pass is at `PROJECT_ARCHITECTURE_v2_2.md §D.11.2`.

| Pair | Claude-side | Gemini-side | Authoritative | Mode |
|---|---|---|---|---|
| MP.1 | `CLAUDE.md` | `.geminirules` | Claude | Adapted parity |
| MP.2 | composite(SESSION_LOG + CURRENT_STATE + active plan pointers) | `.gemini/project_state.md` (this file) | Claude | Adapted parity (state) |
| MP.3 | `MACRO_PLAN_v2_0.md` | compact MP ref here + in `.geminirules` | Claude | Adapted parity (summary) |
| MP.4 | `PHASE_B_PLAN_v1_0.md` (v1.0.3) | current-phase pointer here + `.geminirules` item #4 | Claude | Adapted parity (summary) |
| MP.5 | `FILE_REGISTRY_v1_12.md` (CURRENT since Exec_11; v1.11 SUPERSEDED 2026-04-27 — see CA §1 FILE_REGISTRY row) | L2.5 canonical-path block in `.geminirules` | Claude | Adapted parity (subset) — B.5/B.6 pipeline + code rows are Claude-only; no Gemini-side update required for v1.12 bump |
| MP.6 | `GOVERNANCE_STACK_v1_0.md` | (none — Claude-only) | Claude-only | n/a |
| MP.7 | `SESSION_LOG.md` | (none — Claude-only) | Claude-only | n/a |
| MP.8 | `PROJECT_ARCHITECTURE_v2_2.md` | compact architecture block here + in `.geminirules` | Claude | Adapted parity (summary) |

### Asymmetries

Per ND.1 "Asymmetries to preserve (not defects)", this file and its Claude-side composite each contain agent-specific constructs with no counterpart on the other side. The mirror does **not** synthesize fake counterparts.

- **Claude-only, no Gemini mirror**:
  - `SESSION_LOG.md` session-history entries (time-stamped, Claude-authored; MP.7 declared Claude-only). The Gemini-side visible here is only the current state, not the history.
  - `STEP_LEDGER_v1_0.md` rebuild-era per-step deliverable + evidence columns — historical ledger rows are Claude-authored; this file reflects only the current + next step state.
  - `GOVERNANCE_STACK_v1_0.md` amendment logs (MP.6 declared Claude-only).
  - `CANONICAL_ARTIFACTS_v1_0.md` itself — Claude-resident machine-readable registry; this file cites it by reference.
  - Claude-side MCP server / skills / Claude Code references.
- **Gemini-only, no Claude mirror**:
  - This file's "Gemini-rules idiom" phrasing ("Working Protocol for Gemini", "Gemini's Specific Role in L4") — addressed at this agent.
  - `.geminirules` Layer Architecture prose style and Gemini-tool expectations.
  - Gemini's append-only ledger formats (`ledger-YYYY-MM-DD.jsonl`), which are L4-execution-era artifacts and have no pre-rebuild Claude counterpart.

These asymmetries are declared per-pair in `CANONICAL_ARTIFACTS_v1_0.md §2 known_asymmetries` field and aggregately in `.geminirules` Asymmetries section. Drift between aggregate and per-pair declarations is itself a finding (class: `asymmetry_declaration_drift`) caught by `mirror_enforcer.py`.

### Resolution of GA.7 (Grounding Audit)

At registry date 2026-04-23, the prior reference to `twinkly-puzzling-quokka.md` in this file was dropped in favor of the authoritative `PHASE_B_PLAN_v1_0.md` v1.0.2 pointer and the `MACRO_PLAN_v2_0.md` pointer. `twinkly-puzzling-quokka.md` is not a canonical plan file; the authoritative M2 plan is `PHASE_B_PLAN_v1_0.md` v1.0.2. The drift detector's phantom-reference scan now catches any recurrence automatically.
