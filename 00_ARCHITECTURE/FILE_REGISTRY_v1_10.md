---
artifact: FILE_REGISTRY_v1_10.md
version: "1.10"
status: SUPERSEDED
date: 2026-04-27
scope: Delta registry for Madhav_M2A_Exec_9 — B.5 Discovery Engine Session 1 deliverables (pre-mining gate code, pattern schema + register, Gemini Pass-1 prompt, reconciler pipeline, 11 validated patterns, eval gate pass).
supersedes: FILE_REGISTRY_v1_9.md (2026-04-26, Madhav_M2A_Exec_8)
schema_version: 1.8
changelog:
  - "v1.10 (2026-04-27, Madhav_M2A_Exec_9 close — B.5 Session 1 complete):"
  - "  (a) §9.1 — FILE_REGISTRY row updated to v1.10 (this file); FILE_REGISTRY_v1_9 flipped to SUPERSEDED in §9.1."
  - "  (b) §9.12 NEW — Exec_9 deliverables: pre-mining gate, pattern schema, PATTERN_REGISTER, Gemini prompt, reconciler, eval runner, batch files, b5_session1_summary."
  - "  (c) §9.2–§9.11, §10 — unchanged from v1.9 by reference."
  - "v1.9 (2026-04-26, Madhav_M2A_Exec_8): B.4 Task 3 CONTRADICTS sub-task + phase final close."
  - "v1.8 (2026-04-26, Madhav_M2A_Exec_7): B.4 Task 3 SUPPORTS sub-task."
  - "v1.7 (2026-04-26): Portal Build Tracker 3-session sprint."
  - "v1.6 (2026-04-26): B.4 Session 1 CGM edges manifest + graph.py."
  - "v1.5 (2026-04-26): B.3.5 CGM Rebuild + Build Tracker Integration."
---

# MARSYS-JIS File Registry — Final Corpus (v1.10)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-27 (v1.10 published at Madhav_M2A_Exec_9 close; supersedes v1.9)

---

## §9.1 — Registry version row

| artifact | version | status | date |
|---|---|---|---|
| `FILE_REGISTRY_v1_10.md` | 1.10 | CURRENT | 2026-04-27 |
| `FILE_REGISTRY_v1_9.md` | 1.9 | SUPERSEDED | 2026-04-26 |

---

## §9.2–§9.11 — Earlier deliverables

See `FILE_REGISTRY_v1_9.md §9.2–§9.11` — unchanged.

---

## §9.12 — Madhav_M2A_Exec_9 deliverables (B.5 Discovery Engine Session 1 — Pre-mining gate + Pattern Mining)

### §9.12.1 — Code (Python sidecar — pre-mining gate)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/prediction_ledger.py` | 1.0 (promoted from 7-line stub) | CURRENT | `append_prediction(entry)` — validates against `prediction_schema_v0_1.json`, auto-assigns PRED.NNN, appends to `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl`. |
| `platform/python-sidecar/rag/validators/p7_three_interpretation.py` | 1.0 (promoted from stub) | CURRENT | `validate(record, threshold=0.7)` — significance-gated ≥2 alternatives check. Returns `ValidatorResult`. |
| `platform/python-sidecar/rag/validators/p8_confidence.py` | 1.0 (promoted from stub) | CURRENT | `validate(record)` — falsifier-conditions enforcement for forward-looking artifacts. |
| `platform/python-sidecar/rag/ledger.py` | in-place addition | CURRENT | Added `get_acceptance_rate(batch_id)`. Added `_VERDICT_EVENT_TYPES` + `_ACCEPT_EVENT_TYPES` frozensets. |
| `platform/python-sidecar/rag/tests/test_p7_three_interpretation.py` | 1.0 | CURRENT | NEW. 13 tests; all pass. |
| `platform/python-sidecar/rag/tests/test_p8_confidence.py` | 1.0 | CURRENT | NEW. 10 tests; all pass. |
| `platform/python-sidecar/rag/tests/test_prediction_ledger.py` | 1.0 | CURRENT | NEW. 8 tests; all pass. |
| `platform/python-sidecar/rag/tests/test_ledger.py` | in-place extension | CURRENT | Extended: `TestGetAcceptanceRate` class with 7 new tests. All pass. |

### §9.12.2 — Code (Python sidecar — pattern mining reconciler)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/reconcilers/pattern_mining_reconciler.py` | 1.0 | CURRENT | NEW. `reconcile_batch(raw_response_path, batch_id)` — YAML extractor + P1/P2/P5/P7/P8 validator stack + JSON schema validate + accept/reject ledger events + PATTERN_REGISTER append + MD mirror regen + forward-looking prediction logging + anomaly check. |
| `platform/python-sidecar/rag/reconcilers/run_pattern_pipeline.py` | 1.0 | CURRENT | NEW. Orchestrates batch list: finds raw response by glob, calls `reconcile_batch`, appends `batch_acceptance_rates.json`, halts on ACCEPTANCE_RATE_ANOMALY. |
| `platform/python-sidecar/rag/reconcilers/__init__.py` | in-place update | CURRENT | Comment extended: `# PATTERN MINING: pattern_mining_reconciler, run_pattern_pipeline (Exec_9)`. |
| `platform/python-sidecar/rag/eval/run_eval.py` | 1.0 (promoted from stub) | CURRENT | `run_discovery_sanity(seed_set_path)` — Vertex AI embed + HNSW k=10 + recall@10 check. B.5 scope only; full RAGAS harness deferred to B.9 (STALENESS_REGISTER). Fixed: `_project_root()` `.parent×4` → `.parents[4]`. |

### §9.12.3 — Schemas

| Path | Version | Status | Role |
|---|---|---|---|
| `06_LEARNING_LAYER/SCHEMAS/pattern_schema_v0_1.json` | 0.1 | CURRENT | NEW. Draft7. Required: `pattern_id` (^PAT\.\d{3}$), `claim_text`, `mechanism`, `domain` (11 enum values), `signals_referenced`, `classical_basis`, `alternatives`, `validator_results`, `confidence`, `is_forward_looking`, `ledger_event_ids` (minItems:2), `created_at`, `created_by_session`. Optional: `counter_cases`, `significance`, `time_indexed_falsifier`, `prediction_ledger_ref`. |
| `06_LEARNING_LAYER/SCHEMAS/prediction_schema_v0_1.json` | 0.1 amended in-place | CURRENT | Added `cross_domain` to domain enum (required for PAT.005/006 domain values). |
| `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json` | 0.1 amended in-place | CURRENT | Added `pattern_proposal`, `claude_pattern_accept`, `claude_pattern_reject` to event_type enum; optional `pattern_id` (12-char hex) + `pattern_payload` fields; if/then cascade for accept/reject pattern events. |
| `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` | in-place update | LIVE | New entry: `gemini.pattern_mining` v1.0 with sha256 hash. Total: 5 registered prompts. |

### §9.12.4 — Registers + discovery artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json` | 1.0 | LIVE | NEW (scaffolded; 11 patterns after Session 1). Canonical JSON store for validated patterns PAT.001–PAT.011. |
| `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.md` | 1.0 | LIVE | NEW. Auto-regenerated MD mirror of JSON register. Regenerated by `pattern_mining_reconciler.py` after each accept. |

### §9.12.5 — Prompts + responses (B.5 pattern mining)

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/gemini/pattern_mining_v1_0.md` | 1.0 | CURRENT | NEW. Gemini Pass-1 prompt. 5 sections (Role, Corpus context, YAML schema, per-batch seed template, good/bad examples). Registered in PROMPT_REGISTRY. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_pattern_mining_batch1_raw.md` | 1.0 | CURRENT | Batch 1 raw response (Gemini Pass-1; native-run). 4 proposals: PAT.001–PAT.004. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_pattern_mining_batch2_raw.md` | 1.0 | CURRENT | Batch 2 raw response (Claude Pass-1). 3 proposals: PAT.005–PAT.007. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_pattern_mining_batch3_raw.md` | 1.0 | CURRENT | Batch 3 raw response (Claude Pass-1). 4 proposals: PAT.008–PAT.011. |

### §9.12.6 — Verification artifacts + ledger

| Path | Version | Status | Role |
|---|---|---|---|
| `verification_artifacts/RAG/batch_acceptance_rates.json` | 1.0 | LIVE | Initialized at session open; 3 batch rows appended (batch1/2/3, all rate=1.0, anomaly_fired=true). |
| `verification_artifacts/RAG/b5_session1_summary.json` | 1.0 | CURRENT | NEW. Session summary: eval gate results, pattern mining totals, per-pattern index, domain distribution, anomaly notes. |
| `verification_artifacts/RAG/discovery_sanity_seed_set_v1_0.json` | 1.0 (corrected in-place) | CURRENT | Chunk IDs corrected: UUID format → 32-char MD5 hex (DB-actual format). 5 seeds. |
| `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` | append-only | LIVE | 4 new PRED entries: PRED.001 (PAT.001 career forward-looking), PRED.002 (PAT.005 cross_domain), PRED.003 (PAT.007 career MD transition), PRED.004 (PAT.011 spiritual Ketu gateway). |

### §9.12.7 — Governance amendments

| Path | Change | Status |
|---|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Exec_9 changelog entry; §2 YAML state-block → B.5 Session 1 complete; red_team_counter 0→1; next=Exec_10. | LIVE |
| `00_ARCHITECTURE/SESSION_LOG.md` | Madhav_M2A_Exec_9 atomic entry appended. | LIVE |
| `.geminirules` | MP.1 mirror — Exec_9 B.5 Session 1 state update + PATTERN_REGISTER reference. | LIVE |
| `.gemini/project_state.md` | MP.2 state-block updated to B.5 Session 1 complete / Session 2 next; red_team_counter=1. | LIVE |
| `CLAUDECODE_BRIEF.md` | status: PENDING_EXECUTION → COMPLETE; closed_session_id: Madhav_M2A_Exec_9. | COMPLETE |

### §9.12.8 — DB-side state at Exec_9 close (unchanged from Exec_8)

| Table | Row count | Delta |
|---|---|---|
| `rag_chunks` | 993 | unchanged |
| `rag_embeddings` | 977 | unchanged |
| `rag_graph_nodes` | 1753 | unchanged |
| `rag_graph_edges` | 3915 | unchanged |

*Pattern mining in B.5 operates on the existing graph — no new graph nodes/edges added this session.*

---

## §10 — Cross-references

See `FILE_REGISTRY_v1_9.md §10` — unchanged. Add: this file is referenced by `CANONICAL_ARTIFACTS_v1_0.md §1` (FILE_REGISTRY row, to be rotated at session close).

---

*End of FILE_REGISTRY_v1_10.md — published at Madhav_M2A_Exec_9 close 2026-04-27.*
