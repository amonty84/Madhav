# MARSYS-JIS Project State & Configuration

_Last updated: 2026-04-25 at Madhav_M2A_Exec_4 close (B.3 Embedding + HNSW complete; embed.py — Vertex AI text-multilingual-embedding-002 768-dim, BATCH_SIZE=10, HNSW m=16 ef_construction=64; 743/743 non-stale chunks embedded; b3_sanity_test.json: "Saturn 7th house Libra" → 2 distinct doc_types [AC-B3.4 ✓], p95=71.56ms Auth Proxy [AC-B3.3 accepted Option A]; GCP migration: Cloud SQL asia-south1 + Vertex AI [Voyage AI removed]; B.3 CLOSED; B.3.5 CGM Rebuild + red-team RT1–RT6 next). Per ND.1 Mirror Discipline, this file mirrors the composite state that the Claude-side `SESSION_LOG.md` + `CURRENT_STATE_v1_0.md` + active plan pointers declare. The mirror is adapted to Gemini's construct; it is not byte-identical. The authoritative machine-enforceable inventory of every mirror pair on the project is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md §2`. Post-Step-15, the Claude-side authoritative state surface is `CURRENT_STATE_v1_0.md`._

## Governance Rebuild CLOSED (Step 0 → Step 15 — COMPLETE 2026-04-24)

**The governance rebuild is complete.** All 16 steps (Step 0 → Step 15) closed as of 2026-04-24. M2 corpus-activation execution resumes; the first act of M2 resumption is the `PHASE_B_PLAN_v1_0.md` v1.0.3 amendment cycle (WARN.2/3/5/7). Gemini sessions may now resume L4 Discovery Layer execution coordination, governed by `CURRENT_STATE_v1_0.md` (now the authoritative Claude-side state surface).

- **Current executed step:** Step 15 (Governance baseline close) — status **`completed`** at STEP_15_GOVERNANCE_BASELINE_CLOSE close 2026-04-24. Red-team: 2/2 PASS (macro-phase-close cadence). Deliverable: `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md`. All 32 GA.N findings resolved (30 RESOLVED, 1 ACCEPTED_AS_POLICY GA.11, 1 DEFERRED_AS_DESIGN_CHOICE GA.27). Deferred items: WARN.2/3/5/7 → PHASE_B_PLAN v1.0.3 amendment. STEP_LEDGER retired to GOVERNANCE_CLOSED. CURRENT_STATE transitions to authoritative role. Rebuild-era banner removed from CLAUDE.md + .geminirules.
- **Next governance action:** Execute `Madhav_M2A_Exec_5` (Session 5 of 5) — B.3.5 CGM Rebuild + red-team RT1–RT6. Trigger: "Read CLAUDECODE_BRIEF.md and execute it." Red-team probes RT1–RT6 fire at Session 5 close (counter = 3, threshold = 3, fires now). Set CLAUDECODE_BRIEF.md status: COMPLETE at Session 5 close.
- **Steps remaining:** **0 (governance rebuild complete).** Steady-state governance discipline fully active. M2 active execution: B.0 closed, M2A Plan produced, B.1 complete, B.2 complete, B.3 complete.

## Active Phase: M2 Corpus Activation — L4 Discovery Layer

The project is in active execution at **M2 Corpus Activation**, governed by `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` v1.0.3. **B.0 is completed** (Madhav 17, 2026-04-24). **M2A planning is complete** (Madhav_M2A_Plan_Foundation_Stack, 2026-04-25). **B.1 Ingestion is complete** (Madhav_M2A_Exec, 2026-04-25). **B.2 Chunking is complete** (Madhav_M2A_Exec_2 + Madhav_M2A_Exec_3, 2026-04-25): 759 rows in rag_chunks (499 msr_signal + 25 ucn_section + 81 cdlm_cell + 102 l1_fact + 52 domain_report [16 stale]); all 8 B.2 ACs pass. **B.3 Embedding + HNSW is complete** (Madhav_M2A_Exec_4, 2026-04-25): 743 embeddings in rag_embeddings; Vertex AI text-multilingual-embedding-002 768-dim; HNSW index present; b3_sanity_test.json written; AC-B3.3 accepted Option A (Auth Proxy overhead). Next Claude Code session: `Madhav_M2A_Exec_5` (B.3.5 CGM Rebuild + red-team RT1–RT6). Trigger: "Read CLAUDECODE_BRIEF.md and execute it." M2 turns the static M1 corpus into an LLM-navigable graph+vector substrate with a Discovery Engine that surfaces patterns, resonances, contradictions, and clusters. The M2 plan is the B.0–B.10 sequence.

### Two-pass execution model

1. **Pass 1 (Gemini 2.5 Pro):** Proposes patterns, links, and hypotheses with evidence and mechanisms. High recall.
2. **Pass 2 (Claude Opus 4.7):** Reconciles and validates against the strict project principles. Conflicts between passes open `DIS.class.output_conflict` entries in `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K.2`; silent overwriting is forbidden.

### Artifacts used by L4

- `PATTERN_REGISTER_v1_0.md`
- `RESONANCE_REGISTER_v1_0.md`
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
- **L2.5 CGM:** `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` — CURRENT (rebuilt on FORENSIC_v8_0 2026-04-19; will become `CGM_v9_0.md` after Phase B.3.5).
- **L2.5 RM:** `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` — CURRENT.
- **L3 Domain Reports:** all nine at v1.1+ — CURRENT.
- **File registry:** `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` — CURRENT (**v1.3 superseded 2026-04-24 at Step 12**; v1.2 superseded 2026-04-24 at Step 7; v1.1 superseded 2026-04-24 at Step 5A; v1.0 superseded 2026-04-23 at Step 5). v1.4 is delta-style: §1–§7 unchanged bulk retained in v1.3; §9.1/§8/§9.4/§9.5 carry Step 12 additions.
- **Macro plan:** `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` — CURRENT (v1.0 superseded 2026-04-23 at Step 5).
- **Phase B plan:** `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` — CURRENT at v1.0.3; WARN.2/3/5/7 amendment complete (Madhav 16). **B.0 closed** (Madhav 17). **B.1 closed** (Madhav_M2A_Exec, 2026-04-25). B.2 doc-types 1–3 next.
- **Project architecture:** `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` — CURRENT (v2.1 superseded 2026-04-24 at Step 5A). v2.2 absorbs the MP v2.0 arc, the Learning Layer substrate, and the ND.1 mirror-pair inventory (MP.1–MP.8 in §D.11.2).
- **Governance Integrity Protocol:** `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` — CURRENT (flipped DRAFT_PENDING_REDTEAM → CURRENT at Step 8 close 2026-04-24; red-team verdict PASS_WITH_FIXES).
- **Master instructions (Claude-side):** `CLAUDE.md` — CURRENT at v2.0 (rebuilt at Step 9 close 2026-04-24; supersedes the pre-rebuild minimal marker).
- **Gemini rules:** `.geminirules` — amended-STEP_15 LIVE (MP.1 structural parity with CLAUDE.md v2.0 Step 15 amendment; rebuild-era banner removed from §F; rebuild-step constraints removed from §L; footer updated; §C item #8 steady-state CURRENT_STATE pointer).
- **Ongoing hygiene policies:** `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` — CURRENT (**NEW at Step 12**; governs every session-close checklist from Step 12 forward).
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

1. **PHASE_B_PLAN v1.0.3 amendment — CLOSED (Madhav 16, 2026-04-24).** WARN.2/3/5/7 resolved. **B.0 Discovery Layer Scaffold — CLOSED (Madhav 17, 2026-04-24).** 035_DISCOVERY_LAYER/ scaffolded, RAG skeleton (31 Python files), pgvector migration, Learning Layer hooks. **B.1 Ingestion — CLOSED (Madhav_M2A_Exec, 2026-04-25).** models.py, ingest.py, P1/P2/P5 validators + 12 fixtures, STALENESS_REGISTER.md (4 stale L3 reports), ingestion_manifest.json (35 current, 499 signals). 6/6 AC-B1.x pass. **B.2 Chunking doc-types 1–3 — CLOSED (Madhav_M2A_Exec_2, 2026-04-25).** chunkers/__init__.py, msr_signal.py (499 chunks), ucn_section.py (25 chunks, all major UCN Parts), cdlm_cell.py (81 chunks). 605 rows in rag_chunks. Supabase migration 005 live. **B.2 Chunking complete — CLOSED (Madhav_M2A_Exec_3, 2026-04-25).** l1_fact.py (102 L1 chunks; P1 STOP enforcement; HTML comment + table-row stripping before P1 validation), domain_report.py (52 L3 chunks; 16 stale from 4 stale reports; STALENESS_REGISTER propagation), cgm_node.py (code-only; FileNotFoundError guard for CGM_v9_0.md), chunk.py orchestrator, chunking_report.json (p1_violations=0, stale_chunk_count=16, truncation_events=5). 759 rows total in rag_chunks. All 8 B.2 ACs pass. **B.3 Embedding + HNSW — CLOSED (Madhav_M2A_Exec_4, 2026-04-25).** embed.py — Vertex AI text-multilingual-embedding-002 768-dim (Voyage AI removed; GCP migration to Cloud SQL asia-south1); BATCH_SIZE=10 (20k token limit); HNSW m=16 ef_construction=64 vector_cosine_ops; 743/743 non-stale chunks embedded; b3_sanity_test.json produced ("Saturn 7th house Libra" → top-3 sims 0.763/0.750/0.736; 2 distinct doc_types; p95=71.56ms Auth Proxy overhead, Option A accepted). AC-B3.1/2/4/5 pass; AC-B3.3 accepted deviation. **B.3.5 CGM Rebuild + red-team RT1–RT6 is the next execution priority.** (Session 5; red_team_counter=3 fires now)
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
| MP.5 | `FILE_REGISTRY_v1_4.md` (CURRENT since Step 12; v1.3 SUPERSEDED — see CA §1 FILE_REGISTRY row) | L2.5 canonical-path block in `.geminirules` | Claude | Adapted parity (subset) |
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
