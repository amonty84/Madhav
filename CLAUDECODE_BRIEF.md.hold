---
artifact: CLAUDECODE_BRIEF
brief_version: "5.0"
status: READY
prepared_by: Cowork (Claude Sonnet — Cowork session COW-03, 2026-04-25)
prepared_on: 2026-04-25
milestone: M2A
title: "M2A-Exec — Foundation Stack (B.1–B.3.5) Execution Brief"
active_macro_phase: M2
active_sub_phases: [B.1, B.2, B.3, B.3.5]
executor: Claude Code Extension (Google Anti-Gravity IDE)
session_type: execution
sessions_total: 5
model: claude-sonnet-4-6
plan_artifact: 00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md
planned_by_model: claude-opus-4-7
red_team_due: true
red_team_fires_at: Madhav_M2A_Exec_5
red_team_counter_at_entry: 3
red_team_probe_count: 6
supersedes: "CLAUDECODE_BRIEF v4.0 (Madhav_M2A_Plan_Foundation_Stack — COMPLETE 2026-04-25)"
cowork_plan_review: "ACCEPTED — all 8 AC passed in Madhav_M2A_Plan_Foundation_Stack"
---

# Claude Code Brief — Madhav M2A-Exec: Foundation Stack (B.1–B.3.5)

## ⚠ READ THIS ENTIRE FILE BEFORE DOING ANYTHING ELSE

This brief is written by Cowork and governs **five sequential execution sessions** for Milestone
A. You are the executor (Sonnet). The plan was produced by Opus in `Madhav_M2A_Plan_Foundation_Stack`
and is located at `00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md` (53KB, READY_FOR_EXEC). That file
is your primary execution specification — this brief is its governance wrapper.

**Do not re-derive the plan.** Read the plan. Execute it. Surface stop-conditions to Abhisek.

---

## §ORIENT — Orientation (run on any model before CHECKPOINT 1)

Read this entire brief. Then read `00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md` in full.
Determine which session you are (§SESSION_DETECTION). Report session number and scope.

**Do NOT cross CHECKPOINT 1 until orientation is confirmed and all pre-conditions pass.**

---

## §SESSION_DETECTION — Which session am I?

Read `00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2`. Map `last_session_id` to your session:

| last_session_id | Your session | Session label | Scope |
|---|---|---|---|
| `Madhav_M2A_Plan_Foundation_Stack` | **Session 1** | `Madhav_M2A_Exec` | B.1 complete |
| `Madhav_M2A_Exec` | **Session 2** | `Madhav_M2A_Exec_2` | B.2 doc-types 1–3 |
| `Madhav_M2A_Exec_2` | **Session 3** | `Madhav_M2A_Exec_3` | B.2 doc-types 4–5 + doc-type 6 code + B.2 ACs |
| `Madhav_M2A_Exec_3` | **Session 4** | `Madhav_M2A_Exec_4` | B.3 complete |
| `Madhav_M2A_Exec_4` | **Session 5** | `Madhav_M2A_Exec_5` | B.3.5 complete + red-team |
| `Madhav_M2A_Exec_5` | **MILESTONE COMPLETE** | — | Report to Abhisek; no further execution |

**Unrecognised `last_session_id`:** STOP and report — do not guess which session to run.

---

## §MODEL_DEPLOYMENT

```yaml
execution_model:   claude-sonnet-4-6   # Anti-Gravity: "Sonnet" — all 5 execution sessions
planning_model:    claude-opus-4-7     # Anti-Gravity: "Default (recommended) — Opus 4.7" — NOT used in Exec
gemini_agent:      gemini-web-panel    # Anti-Gravity Gemini panel — human-mediated; Session 5 CHECKPOINT 2 only
```

All five sessions execute on Sonnet. There is no intra-session model switch except at the
checkpoint gates defined below.

---

══════════════════════════════════════════════════════════
**CHECKPOINT 1 — SWITCH TO SONNET (every session)**
In Anti-Gravity: select **"Sonnet"**
Then reply: **"Sonnet ready."** — Claude Code will not proceed until it receives this reply.
══════════════════════════════════════════════════════════

---

══════════════════════════════════════════════════════════
**CHECKPOINT 2 — GEMINI INTERACTION (Session 5 / M2A-Exec.5 only)**
This checkpoint fires at B.3.5 Task 4a. See §SESSION_5 for the exact protocol.
Reply: **"Gemini response saved."** + file path of the saved response.
Claude Code will not proceed to Task 4b until it receives this reply.
══════════════════════════════════════════════════════════

---

## §CONSTRAINTS — OBS-derived execution constraints

The following constraints are derived from `M2A_EXEC_PLAN_v1_0.md §OBS` observations. They
bind all five sessions.

**OBS.1 — FILE_REGISTRY `is_current: true` field absent.**
The `is_current: true` field does not exist in `FILE_REGISTRY_v1_4.md`. For any task that
requires "current document count", derive `file_registry_snapshot_count` by counting rows with
status `CURRENT` or `Current`. Confirmed count: **35**. Use 35 as `current_document_count` in
`ingestion_manifest.json`.

**OBS.3 — `06_LEARNING_LAYER/` uses Step 11 directory names.**
The directory `06_LEARNING_LAYER/` contains Step 11 governance-rebuild names
(e.g., `SIGNAL_WEIGHT_CALIBRATION/`, `CALIBRATION_TABLES/`). These are **NOT** the Phase B
names from `PHASE_B_PLAN_v1_0.md §F.1`. Do **NOT** rename, restructure, or create new
directories under `06_LEARNING_LAYER/` in M2A. Only `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json`
is may_touch (for cgm_edge_proposals registration in Session 5 only).

**OBS.4 — Validator stub docstrings incorrectly say "Phase B.4".**
When implementing `p1_layer_separation.py`, `p2_citation.py`, and `p5_signal_id_resolution.py`
(Session 1), correct all docstring references from "Phase B.4" to "Phase B.1". This is a
known defect in the B.0 stubs — do not propagate it.

**OBS.5 — `PROMPT_REGISTRY/INDEX.json` has one placeholder entry.**
Session 5 will add the `gemini.cgm_edge_proposals` entry via `prompt_registry.py`'s
`register_prompt()` call. Append to the existing JSON structure — do not reset or recreate
the file.

**OBS.6 — Gemini prompts folder is currently empty.**
`035_DISCOVERY_LAYER/PROMPTS/gemini/` exists but contains no files and no `responses/`
subdirectory. Session 5 creates both `cgm_edge_proposals_v1_0.md` and the `responses/`
subdirectory. Create the subdirectory via mkdir before saving the raw response file.

**OBS.7 — CGM_v2_0 is the CURRENT CGM.**
`025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` is the current canonical CGM. Session 5 regenerates it
as `CGM_v9_0.md` and archives v2.0. The version jump (v2.0 → v9.0) is intentional per
`CGM_VERSIONING_RATIONALE` in project governance — do not question or alter it.

---

## §SCOPE — Consolidated may_touch / must_not_touch

### may_touch (complete list across all 5 sessions)

```
# Session 1 — B.1 Ingestion
platform/python-sidecar/rag/models.py
platform/python-sidecar/rag/ingest.py
platform/python-sidecar/rag/validators/p1_layer_separation.py
platform/python-sidecar/rag/validators/p2_citation.py
platform/python-sidecar/rag/validators/p5_signal_id_resolution.py
platform/python-sidecar/rag/validators/fixtures/p1_trigger_vocab.json
platform/python-sidecar/rag/validators/fixtures/p1_reject_interpretive_l1.json
platform/python-sidecar/rag/validators/fixtures/p1_reject_no_layer_tag.json
platform/python-sidecar/rag/validators/fixtures/p1_reject_mixed_no_bridge.json
platform/python-sidecar/rag/validators/fixtures/p1_accept_fact_only.json
platform/python-sidecar/rag/validators/fixtures/p1_accept_interp_only.json
platform/python-sidecar/rag/validators/fixtures/p2_reject_no_citation.json
platform/python-sidecar/rag/validators/fixtures/p2_reject_nonexistent_id.json
platform/python-sidecar/rag/validators/fixtures/p2_accept_valid_ids.json
platform/python-sidecar/rag/validators/fixtures/p2_accept_empty_l1_chunk.json
platform/python-sidecar/rag/validators/fixtures/p5_reject_nonexistent_signal.json
platform/python-sidecar/rag/validators/fixtures/p5_accept_valid_signal.json
platform/python-sidecar/rag/validators/test_p1_p2_p5.py
00_ARCHITECTURE/STALENESS_REGISTER.md
verification_artifacts/RAG/ingestion_manifest.json

# Session 2 — B.2 Chunking (doc-types 1–3)
platform/python-sidecar/rag/chunkers/__init__.py
platform/python-sidecar/rag/chunkers/msr_signal.py
platform/python-sidecar/rag/chunkers/ucn_section.py
platform/python-sidecar/rag/chunkers/cdlm_cell.py

# Session 3 — B.2 Chunking (doc-types 4–5 + doc-type 6 code) + B.2 ACs
platform/python-sidecar/rag/chunkers/l1_fact.py
platform/python-sidecar/rag/chunkers/domain_report.py
platform/python-sidecar/rag/chunkers/cgm_node.py
platform/python-sidecar/rag/chunk.py
verification_artifacts/RAG/chunking_report.json

# Session 4 — B.3 Embedding
platform/python-sidecar/rag/embed.py
verification_artifacts/RAG/b3_sanity_test.json
verification_artifacts/RAG/unindexed_chunks.jsonl    # only if Voyage errors occur

# Session 5 — B.3.5 CGM Rebuild + red-team
025_HOLISTIC_SYNTHESIS/CGM_v9_0.md
99_ARCHIVE/CGM_v2_0.md                              # moved from 025_HOLISTIC_SYNTHESIS/
035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md
035_DISCOVERY_LAYER/PROMPTS/gemini/responses/       # create subdirectory
035_DISCOVERY_LAYER/PROMPTS/gemini/responses/YYYY-MM-DD_B3-5_batch1_raw.md
06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json        # append cgm_edge_proposals entry only
verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md

# Every session — governance close machinery
00_ARCHITECTURE/CURRENT_STATE_v1_0.md
00_ARCHITECTURE/SESSION_LOG.md
00_ARCHITECTURE/FILE_REGISTRY_v1_4.md               # row updates per session
.geminirules
.gemini/project_state.md
CLAUDECODE_BRIEF.md                                  # status: COMPLETE only (Session 5 only)
```

### must_not_touch

```
# Corpus and synthesis — read-only (except CGM output in Session 5)
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**                            # except CGM_v9_0.md creation + CGM_v2_0 archive
02_ANALYTICAL_LAYER/**
03_DOMAIN_REPORTS/**

# 06_LEARNING_LAYER — no structural changes in M2A
06_LEARNING_LAYER/**                                 # EXCEPT 06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json (Session 5 only)

# Governance — read-only
00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md
00_ARCHITECTURE/MACRO_PLAN_v2_0.md
00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md
00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md
00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md
00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md
00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md               # read-only; produced by M2A-Plan
CLAUDE.md

# Platform — outside M2A scope
platform/supabase/migrations/**
platform/src/**
platform/python-sidecar/main.py
platform/python-sidecar/routers/**
```

---

## §EXEC_PLAN_REFERENCE — Key plan sections

For each session's tasks, the authoritative specification is `M2A_EXEC_PLAN_v1_0.md`.
Resolve all ambiguity by reading the plan. The sections are:

```
§OBS    — 7 observations (cross-check with §CONSTRAINTS above)
§DEPS   — 12-row dependency map (hard gates D1–D12)
§RISKS  — Risk tables per sub-phase + 6 red-team probes (RT1–RT6)
§PLAN   — Sub-phase tasks with stop conditions
  B.1 Tasks 1, 2, 1.5, 3, 4
  B.2 Sessions 2 and 3 (doc-types 1–6, chunk.py orchestrator)
  B.3 Tasks 1 (embed.py) and 2 (sanity test)
  B.3.5 Tasks 1–6 + red-team execution
§AC     — 26 consolidated acceptance criteria (AC-B1.1 through AC-B3.5.8)
§MANIFEST — Complete artifact list (mirrors may_touch above)
§SESSION_PACKAGING — Session boundary rationale
```

---

## §SESSION_1 — Madhav_M2A_Exec (B.1 Ingestion)

**Pre-condition check before CHECKPOINT 1:**
```
CURRENT_STATE last_session_id == "Madhav_M2A_Plan_Foundation_Stack"
platform/python-sidecar/rag/models.py           exists (skeleton)
platform/python-sidecar/rag/ingest.py           exists (skeleton)
platform/python-sidecar/rag/validators/p1_layer_separation.py   exists (skeleton)
platform/python-sidecar/rag/validators/p2_citation.py           exists (skeleton)
platform/python-sidecar/rag/validators/p5_signal_id_resolution.py  exists (skeleton)
platform/python-sidecar/rag/embed.py            exists (skeleton)
platform/python-sidecar/rag/chunk.py            exists (skeleton)
verification_artifacts/RAG/baseline_edge_count.json   exists
06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json    exists
```
If any file is missing: **STOP and report** — do not proceed.

**Scope:** Execute `M2A_EXEC_PLAN_v1_0.md §PLAN B.1` Tasks 1, 2, 1.5, 3, 4 in order.
- Task 1: Implement `models.py` (7 Pydantic models: Document, Chunk, Signal, GraphNode, GraphEdge, RegisterEntry, LedgerEvent)
- Task 2: Implement `ingest.py` (scan_corpus scanning `01_FACTS_LAYER/`, `025_HOLISTIC_SYNTHESIS/`, `02_ANALYTICAL_LAYER/`, `03_DOMAIN_REPORTS/`)
- Task 1.5: Implement P1/P2/P5 validators + all 12 fixture files + `test_p1_p2_p5.py` (correct docstrings from "Phase B.4" → "Phase B.1" per OBS.4)
- Task 3: Create `00_ARCHITECTURE/STALENESS_REGISTER.md` (≥4 stale entries)
- Task 4: Run ingest to produce `verification_artifacts/RAG/ingestion_manifest.json` with `current_document_count: 35`

**Session 1 ACs (must all pass before close):**

| # | Criterion | Verification |
|---|---|---|
| AC-B1.1 | ingestion_manifest.json exists with `current_document_count: 35` | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert d['current_document_count']==35"` |
| AC-B1.2 | 499 MSR signals parseable | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert d['signal_count']==499"` |
| AC-B1.3 | Every Document has non-null layer | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert all(r['layer'] for r in d['documents'])"` |
| AC-B1.4 | STALENESS_REGISTER.md exists with ≥4 stale entries | `grep -c "is_stale: true" 00_ARCHITECTURE/STALENESS_REGISTER.md` ≥ 4 |
| AC-B1.5 | P1/P2/P5 validators pass all meta-tests | `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v` → all PASS |
| AC-B1.6 | models.py importable without error | `python -c "from rag.models import Document, Chunk, Signal, GraphNode, GraphEdge, RegisterEntry, LedgerEvent; print('OK')"` |

**Session 1 close ID:** `Madhav_M2A_Exec`

---

## §SESSION_2 — Madhav_M2A_Exec_2 (B.2 Chunking — doc-types 1–3)

**Pre-condition check:** All Session 1 ACs verified in verification_artifacts/.
B.1 hard gate D1: validators implemented and passing (P1/P2/P5 pytest = all PASS).

**Scope:** Execute `M2A_EXEC_PLAN_v1_0.md §PLAN B.2 Session 2`.
- Implement `chunkers/__init__.py`
- Implement `chunkers/msr_signal.py` → produces `msr_signal` doc-type chunks; target 499 chunks from `MSR_v3_0.md`
- Implement `chunkers/ucn_section.py` → produces `ucn_section` doc-type chunks; ≥1 chunk per major Part section
- Implement `chunkers/cdlm_cell.py` → produces `cdlm_cell` doc-type chunks; target 81 cells from `CDLM_v1_1.md`

For each chunker: consult `035_DISCOVERY_LAYER/SCHEMAS/chunker_spec_v1_0.md` for the
authoritative spec. Cite the spec section in code comments. Every chunk must carry:
`layer`, `doc_type`, `chunk_id`, `token_count`, `is_stale` fields.

All doc-type 1–3 chunks must pass P1 (layer tag present and correct for L2.5 docs).

**Session 2 partial-progress targets (verified in rag_chunks):**

| Chunker | Target |
|---|---|
| msr_signal | 499 rows in rag_chunks |
| ucn_section | ≥1 per major UCN Part |
| cdlm_cell | 81 rows in rag_chunks |

**Note:** Session 2 does NOT close B.2 — it ends at doc-types 1–3 populated. Do NOT run
full B.2 ACs. Document partial state in `CURRENT_STATE_v1_0.md`.

**Session 2 close ID:** `Madhav_M2A_Exec_2`

---

## §SESSION_3 — Madhav_M2A_Exec_3 (B.2 Chunking — doc-types 4–5 + doc-type 6 code + B.2 ACs)

**Pre-condition check:** Doc-types 1–3 populated in rag_chunks (from Session 2).

**Scope:** Execute `M2A_EXEC_PLAN_v1_0.md §PLAN B.2 Session 3`.
- Implement `chunkers/l1_fact.py` → doc-type `l1_fact`, layer `L1`; source: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`
- Implement `chunkers/domain_report.py` → doc-type `domain_report`, layer `L3`; apply STALENESS_REGISTER to set `is_stale` flag
- Implement `chunkers/cgm_node.py` → doc-type `cgm_node`; implement with `FileNotFoundError` guard (CGM_v9_0.md does not exist yet — code exists but cannot run until Session 5); see §DEPS D4
- Implement `chunk.py` orchestrator → dispatches to correct chunker based on doc_type; integrates P1/P2/P5 gating
- Produce `verification_artifacts/RAG/chunking_report.json` with `p1_violations: 0`

**B.2 hard gate D4:** `cgm_node.py` code must exist and be importable at B.2 close.
It must NOT be run (CGM_v9_0.md absent). The FileNotFoundError guard must be present.

**All B.2 ACs (run at Session 3 close):**

| # | Criterion | Verification |
|---|---|---|
| AC-B2.1 | Exactly 499 msr_signal chunks | `SELECT count(*) FROM rag_chunks WHERE doc_type='msr_signal';` = 499 |
| AC-B2.2 | Zero cross-layer chunks | `SELECT count(*) FROM rag_chunks WHERE (doc_type='msr_signal' AND layer!='L2.5') OR (doc_type='l1_fact' AND layer!='L1');` = 0 |
| AC-B2.3 | No chunk > 2000 tokens | `SELECT count(*) FROM rag_chunks WHERE token_count > 2000;` = 0 |
| AC-B2.4 | Stale chunk count matches STALENESS_REGISTER | `SELECT count(*) FROM rag_chunks WHERE is_stale=true AND doc_type='domain_report';` = STALENESS_REGISTER stale-report count |
| AC-B2.5 | ≥1 UCN chunk per major Part section | `SELECT count(DISTINCT metadata->>'part_title') FROM rag_chunks WHERE doc_type='ucn_section';` ≥ UCN Part count |
| AC-B2.6 | ≥81 CDLM cell chunks | `SELECT count(*) FROM rag_chunks WHERE doc_type='cdlm_cell';` = 81 |
| AC-B2.7 | CGM node chunker code exists and importable | `python -c "from rag.chunkers.cgm_node import chunk_cgm_nodes; print('OK')"` |
| AC-B2.8 | chunking_report.json has p1_violations: 0 | `python -c "import json; d=json.load(open('verification_artifacts/RAG/chunking_report.json')); assert d['p1_violations']==0"` |

**Session 3 close ID:** `Madhav_M2A_Exec_3`

---

## §SESSION_4 — Madhav_M2A_Exec_4 (B.3 Embedding + HNSW)

**Pre-condition check:** All B.2 ACs pass. rag_chunks populated (non-stale count ≈ 1,200).

**Scope:** Execute `M2A_EXEC_PLAN_v1_0.md §PLAN B.3` Tasks 1 and 2.

**Task 1 — Implement `embed.py`:**
- Voyage batch calls; pre-embedding text enrichment: prefix each chunk with `[{layer}] [{doc_type}]`
- Content-hash idempotency: skip chunks already in `rag_embeddings`
- Batch size: 100 chunks per Voyage call
- **Halt policy:** if Voyage returns any error → HALT; log unindexed chunk IDs to `verification_artifacts/RAG/unindexed_chunks.jsonl`; do NOT fall back to OpenAI
- After all batches: `CREATE INDEX ON rag_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);`

**Stop condition:** If `rag_embeddings` count ≠ non-stale `rag_chunks` count after completion
(embedding gap), STOP and report.

**Task 2 — Sanity retrieval test:**
Query: `"Saturn 7th house Libra"`
Expected top-3: ≥1 MSR signal, ≥1 UCN section, ≥1 L1 fact chunk (layer diversity)
Log to `verification_artifacts/RAG/b3_sanity_test.json`
If all top-3 are same doc_type, document this in close notes (layer imbalance warning —
not a hard stop).

**All B.3 ACs (run at Session 4 close):**

| # | Criterion | Verification |
|---|---|---|
| AC-B3.1 | ~1,200 embeddings (= non-stale chunk count ±5) | `SELECT count(*) FROM rag_embeddings;` within ±5 of `SELECT count(*) FROM rag_chunks WHERE is_stale=false;` |
| AC-B3.2 | HNSW index exists | `SELECT indexname FROM pg_indexes WHERE tablename='rag_embeddings' AND indexname LIKE '%hnsw%';` returns row |
| AC-B3.3 | HNSW p95 query < 50ms | 100 random vector queries; p95 latency measured in b3_sanity_test.json |
| AC-B3.4 | Sanity query returns ≥2 distinct doc_types in top-3 | `b3_sanity_test.json` top_3 doc_type distinct count ≥ 2 |
| AC-B3.5 | No unindexed chunks log | `wc -l verification_artifacts/RAG/unindexed_chunks.jsonl` = 0 OR file absent |

**Session 4 close ID:** `Madhav_M2A_Exec_4`

---

## §SESSION_5 — Madhav_M2A_Exec_5 (B.3.5 CGM Rebuild + Red-Team)

**Pre-condition check:** All B.3 ACs pass. `rag_embeddings` indexed. `cgm_node.py` importable.

**Scope:** Execute `M2A_EXEC_PLAN_v1_0.md §PLAN B.3.5` Tasks 1–6 + red-team execution.

### B.3.5 Tasks 1–3 (pre-CHECKPOINT 2, run on Sonnet)

**Task 1 — Read CGM_v2_0 structure:**
Read `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md`. Document (as internal session note, not a file):
node types used, edge types used, YAML conventions. Do not modify this file.

**Task 2 — Regenerate node assertions from L1 v8.0:**
Input: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`
- Regenerate all planet nodes, house nodes, lagna node
- Every positional value carries `[L1 source: FORENSIC_v8_0 §<section>]` tag
- 8-karaka fixed per `GAP_13_RESOLUTION_v1_0.md §2`; 7-karaka readings preserved as `karaka_system: "7-karaka-alternative"` on Pitrukaraka-dependent KRK nodes
- Stop condition: if any planet position cannot be resolved from FORENSIC_v8_0, emit `[EXTERNAL_COMPUTATION_REQUIRED]` with exact spec and STOP

**Task 3 — Regenerate edge assertions (deterministic):**
Regenerate ASPECTS, LORDS, OCCUPIES, OWNS edges from L1 v8.0.
Same stop condition as Task 2.

**Task 3.5 — Author + register `cgm_edge_proposals_v1_0.md`:**
Output: `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md`
Prompt structure per `M2A_EXEC_PLAN_v1_0.md §PLAN B.3.5 Task 3.5`:
- ROLE: Promiscuous connector, pass 1 of two-pass protocol
- TASK: Propose additional CGM edges (subtle aspects, Chalit shifts, dispositor chains, navamsha overlaps)
- INPUT schema: `{node_list: [...], existing_edge_types: [...], l1_basis_summary: "..."}`
- OUTPUT (strict YAML): `proposed_edges: [{source_node, edge_type, target_node, L1_basis, classical_basis_if_applicable, confidence_prior: LOW|MED|HIGH}]`
- CONSTRAINTS: Cite only from L1 v8.0; `[EXTERNAL_COMPUTATION_REQUIRED]` if uncertain

After authoring, register via:
```python
from rag.prompt_registry import register_prompt
entry = register_prompt(
    path="035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md",
    version="1.0"
)
```
Verify `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` has the new entry.
Stop condition: STOP if registration fails (hash mismatch or INDEX.json not updated).

### B.3.5 Task 4a — Human-in-loop Gemini step (CHECKPOINT 2)

When you reach Task 4a:
1. Serialize the node list and existing edge types from Tasks 2–3 into the INPUT schema
2. Display the full prompt content + serialized INPUT to Abhisek
3. Emit CHECKPOINT 2 block:

══════════════════════════════════════════════════════════
**CHECKPOINT 2 — GEMINI INTERACTION**
1. In Anti-Gravity: open the **Gemini Agent panel**
2. Paste the prompt content + INPUT shown above into the Gemini panel
3. Copy Gemini's full response
4. Create: `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/<YYYY-MM-DD>_B3-5_batch1_raw.md`
   and paste Gemini's response as the file content
5. `git add` and `git commit` that file with message: `feat: B.3.5 Gemini edge proposals raw response`
6. Reply: **"Gemini response saved."** + the exact file path
Claude Code will not proceed to Task 4b until it receives this reply.
══════════════════════════════════════════════════════════

### B.3.5 Task 4b — Claude reconciler (post-CHECKPOINT 2)

Read the `responses/<YYYY-MM-DD>_B3-5_batch1_raw.md` file committed by the human step.
For each `proposed_edge` in Gemini output:
- P1 check: `L1_basis` must reference a FORENSIC_v8_0 section ID; reject if fabricated
- P2 check: `L1_basis` must resolve to a real fact in v8.0; reject if cited ID not in resolution_set
- P5 check: if references SIG.MSR.NNN, verify against MSR_v3_0 registry
- Accept / Reject / Defer each proposed edge with rationale

Write ledger event with:
```yaml
actor: "gemini-web-<YYYY-MM-DD>"
prompt_ref: "035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md"
prompt_version: "1.0"
prompt_hash: <from PROMPT_REGISTRY/INDEX.json>
gemini_response_ref: "035_DISCOVERY_LAYER/PROMPTS/gemini/responses/<YYYY-MM-DD>_B3-5_batch1_raw.md"
```

Stop condition: STOP if `gemini_response_ref` file does not exist on disk.

### B.3.5 Task 5 — Write CGM_v9_0.md

Output: `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md`
Required frontmatter:
```yaml
version: "9.0"
status: CURRENT
canonical_id: CGM
changelog: [regenerated from L1 v8.0; Gemini two-pass edges integrated; supersedes v2.0]
```
Content: all regenerated nodes (Task 2) + regenerated edges (Task 3) + accepted Gemini proposals (Task 4b)
Archive action: move `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` → `99_ARCHIVE/CGM_v2_0.md`
Stop condition: STOP if CGM_v9_0.md fails P1 validation on any node.

### B.3.5 Task 5.5 — Re-trigger doc-type 6 CGM chunker

```python
from rag.chunkers.cgm_node import chunk_cgm_nodes
chunks = chunk_cgm_nodes('025_HOLISTIC_SYNTHESIS/CGM_v9_0.md')
# write to rag_chunks
```
Required: For KRK-type nodes, `karaka_system` field must be set (7-karaka|8-karaka|both)
Also: embed new CGM node chunks via `embed.py` and update HNSW index
Stop condition: STOP if CGM node chunk count ≠ CGM_v9_0 node count.

### B.3.5 Task 6 — Update FILE_REGISTRY

In `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md`:
- Add `CGM_v9_0.md` row with status CURRENT
- Update `CGM_v2_0.md` row to status SUPERSEDED

### B.3.5 Red-Team Execution (fires here — counter reached threshold)

Run all 6 probes below. Record results in `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md`.
All 6 must pass before B.3.5 is declared closed.

| Probe | Target | Test |
|---|---|---|
| RT1 | P1 validator rejects fabricated L1 claim | Feed a chunk asserting "Sun in 8H" without `[L1 source:]` tag → P1 must reject |
| RT2 | P2 validator rejects nonexistent FORENSIC ID | Feed a chunk citing `§FORENSIC_999` (nonexistent) → P2 must reject |
| RT3 | P5 validator rejects nonexistent signal ID | Feed a chunk referencing `SIG.MSR.999` (not in MSR_v3_0 registry) → P5 must reject |
| RT4 | Stale L3 chunks excluded from embeddings | Verify: `SELECT count(*) FROM rag_embeddings e JOIN rag_chunks c ON e.chunk_id=c.chunk_id WHERE c.is_stale=true;` = 0 |
| RT5 | No chunk exceeds 2000 tokens | `SELECT count(*) FROM rag_chunks WHERE token_count > 2000;` = 0 |
| RT6 | CGM node integrity — every node has L1 source | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node' AND metadata->>'l1_source' IS NULL;` = 0 |

**All B.3.5 ACs (run at Session 5 close):**

| # | Criterion | Verification |
|---|---|---|
| AC-B3.5.1 | CGM_v9_0 passes P1/P2/P5 validators | Run validators on CGM_v9_0 nodes — zero rejects |
| AC-B3.5.2 | Node positions match FORENSIC_v8_0 | `SELECT node_id FROM rag_chunks WHERE doc_type='cgm_node' AND metadata->>'l1_source' IS NULL;` = 0 rows |
| AC-B3.5.3 | CGM node chunk count = node count in CGM_v9_0 | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node';` = node_count in CGM_v9_0 header |
| AC-B3.5.4 | All KRK-type nodes have karaka_system set | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node' AND node_type='KRK' AND metadata->>'karaka_system' IS NULL;` = 0 |
| AC-B3.5.5 | cgm_edge_proposals registered in PROMPT_REGISTRY | `cat 06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json | python -c "import json,sys; d=json.load(sys.stdin); assert any(e['prompt_id']=='gemini.cgm_edge_proposals' for e in d['entries'])"` |
| AC-B3.5.6 | Gemini raw response file committed | `git log --oneline -- '035_DISCOVERY_LAYER/PROMPTS/gemini/responses/*'` returns ≥1 commit |
| AC-B3.5.7 | All 6 red-team probes pass | `cat verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` — all 6 probes = PASS |
| AC-B3.5.8 | FILE_REGISTRY updated with CGM_v9_0 CURRENT row | `grep "CGM_v9_0\|CURRENT" 00_ARCHITECTURE/FILE_REGISTRY_v1_4.md | grep CGM` returns CGM_v9_0 row |

**Session 5 close ID:** `Madhav_M2A_Exec_5`
**After Session 5 close:** Set `status: COMPLETE` in this CLAUDECODE_BRIEF.md.

---

## §CLOSE_PROTOCOL — Per-session close steps (every session)

Run these steps at the close of **every** session (1–5). The session number is in the
session ID you're closing.

**Step A — Run governance validators:**
```bash
python3 platform/scripts/governance/drift_detector.py
python3 platform/scripts/governance/schema_validator.py
python3 platform/scripts/governance/mirror_enforcer.py
```
`mirror_enforcer.py` must exit 0. Any non-zero: STOP and report.

**Step B — Run this session's ACs.** All must pass (see §SESSION_N above).
If any AC fails: STOP before updating CURRENT_STATE — do not claim close.

**Step C — Update `CURRENT_STATE_v1_0.md §2`:**

| Field | Value |
|---|---|
| `last_session_id` | This session's close ID (e.g., `Madhav_M2A_Exec`, `Madhav_M2A_Exec_2`, …) |
| `active_phase_plan_sub_phase` | e.g., `"B.1 complete"`, `"B.2 S1 complete"`, `"B.2 complete"`, `"B.3 complete"`, `"M2A complete"` |
| `next_session_objective` | Next session scope from §SESSION_DETECTION table |
| `red_team_counter` | Keep at 3 for Sessions 1–4; reset to **0** after Session 5 red-team runs |
| `file_updated_at` | Today's date |
| `file_updated_by_session` | This session's close ID |

**Step D — Mirror updates (adapted parity):**
- `.geminirules §F` — update execution position to reflect which B.X sub-phase just closed
- `.gemini/project_state.md` — update sub-phase pointer

**Step E — FILE_REGISTRY updates (if applicable):**
- Session 1: add `STALENESS_REGISTER.md` row
- Session 5: update CGM rows (per B.3.5 Task 6)

**Step F — Emit SESSION_CLOSE YAML + append SESSION_LOG atomically.**

Session-specific close YAML fields:

```yaml
# Session 1
session_id: Madhav_M2A_Exec
session_type: m2_milestone_execution
macro_phase: M2
milestone: M2A — Foundation Stack
sub_phase_completed: B.1
deliverables_produced: [models.py, ingest.py, validators (P1/P2/P5), STALENESS_REGISTER.md, ingestion_manifest.json]
red_team_due: false   # probes fire at Session 5; counter stays 3 but not yet fired
handoff_notes: "B.1 complete. Session 2 next: B.2 doc-types 1–3."

# Session 2
session_id: Madhav_M2A_Exec_2
sub_phase_completed: "B.2 partial — doc-types 1–3 populated"
deliverables_produced: [chunkers/__init__.py, msr_signal.py, ucn_section.py, cdlm_cell.py]

# Session 3
session_id: Madhav_M2A_Exec_3
sub_phase_completed: B.2
deliverables_produced: [l1_fact.py, domain_report.py, cgm_node.py, chunk.py, chunking_report.json]

# Session 4
session_id: Madhav_M2A_Exec_4
sub_phase_completed: B.3
deliverables_produced: [embed.py, b3_sanity_test.json, HNSW index]

# Session 5
session_id: Madhav_M2A_Exec_5
sub_phase_completed: "B.3.5 + M2A complete"
deliverables_produced: [CGM_v9_0.md, cgm_edge_proposals_v1_0.md, Gemini response file, RED_TEAM_M2A_v1_0.md]
red_team_due: true
red_team_fired: true
red_team_result: "6/6 probes pass"   # or actual results
unblocks: "Cowork COW-04 — M2B brief (B.4 Retrieval API)"
handoff_notes: "M2A complete. Milestone B is next. Proposed COW thread: Madhav COW-04 — M2B Brief."
```

---

## §ESCALATION — Hard stops (any session)

Stop immediately and report to Abhisek if:

- `CURRENT_STATE_v1_0.md` `last_session_id` does not match your expected previous session (wrong session order)
- Any pre-condition file listed in the session's §SESSION_N is missing
- `mirror_enforcer.py` exits non-zero
- Any AC fails verification
- Voyage API returns errors during B.3 embedding (log unindexed chunks, do not fall back)
- A planet position in B.3.5 Task 2 cannot be resolved from FORENSIC_v8_0 (emit `[EXTERNAL_COMPUTATION_REQUIRED]`)
- `cgm_edge_proposals_v1_0.md` registration fails in PROMPT_REGISTRY
- Gemini raw response file does not exist on disk before Task 4b begins
- Any file outside `may_touch` would need to be modified to complete a task — stop and report rather than expand scope

---

## §HOW_TO_START — Instructions for Abhisek (each of the 5 sessions)

### Sessions 1–4 (Sonnet execution, no Gemini interaction)

1. Open the `Madhav` project folder in **Google Anti-Gravity IDE**.
2. Open the Claude Code extension panel.
3. Start with **any model** — the session opens with orientation only.
4. First message: **"Read CLAUDECODE_BRIEF.md and execute it."**
5. When Claude Code hits **CHECKPOINT 1**: select **"Sonnet"** in Anti-Gravity, then reply **"Sonnet ready."**
6. Session runs to completion; all ACs verified; close artifacts produced.
7. Check `CURRENT_STATE_v1_0.md` for confirmation of session close.

*(Sessions 1–4 have no CHECKPOINT 2.)*

### Session 5 (Sonnet execution + Gemini interaction)

1–5 same as above (Sonnet).
6. When Claude Code hits **CHECKPOINT 2**:
   - Open the **Gemini Agent panel** in Anti-Gravity
   - Paste the prompt + INPUT exactly as shown by Claude Code
   - Copy Gemini's full response
   - Create the response file as instructed (path shown by Claude Code)
   - `git add` and `git commit` the response file
   - Reply: **"Gemini response saved. <file path>"**
7. Claude Code continues with Task 4b (reconciliation), Tasks 5–6, and red-team.
8. All 8 Session 5 ACs verified; red-team 6/6 probes recorded; milestone closed.

---

## §COWORK_REVIEW — M2A-Plan review (for the record)

```yaml
review_status: ACCEPTED
reviewed_on: 2026-04-25
cowork_session: COW-03
plan_quality: production-grade
obs_count: 7
deps_complete: true   # 12-row dependency map with 10 hard gates
risks_identified: true  # per-sub-phase risk tables + 6 red-team probes
session_packaging_accepted: true  # 5-session split per PHASE_B_PLAN velocity forecast
ac_count: 26  # AC-B1.1 through AC-B3.5.8
planned_by_model_note: >
  M2A_EXEC_PLAN_v1_0.md frontmatter shows planned_by_model: claude-sonnet-4-6.
  CHECKPOINT 1 may not have switched to Opus 4.7 in the plan session, or metadata
  was not updated. Plan quality is production-grade regardless; all 8 plan ACs passed.
  Accepted as-is. Note for future: verify model string in frontmatter at plan session open.
notes: >
  Plan is comprehensive. B.3.5 Gemini two-pass protocol is well-specified.
  OBS.3 (06_LEARNING_LAYER naming) and OBS.4 (validator docstring correction)
  are critical — embedded as §CONSTRAINTS above. Proceed with M2A-Exec.
```

---

*Brief prepared by Cowork (Claude Sonnet, Cowork session COW-03, 2026-04-25).*
*Executor: Claude Code Extension (Google Anti-Gravity IDE), model: claude-sonnet-4-6.*
*Template version: 5.0. Supersedes v4.0 (Madhav_M2A_Plan_Foundation_Stack — COMPLETE 2026-04-25).*
*Implements 2-checkpoint protocol per CONVERSATION_NAMING_CONVENTION v1.3 §8.5 (CHECKPOINT 1: Sonnet switch; CHECKPOINT 2: Gemini interaction at B.3.5 Task 4a).*
