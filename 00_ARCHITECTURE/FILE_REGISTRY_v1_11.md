---
artifact: FILE_REGISTRY_v1_11.md
version: "1.11"
status: CURRENT
date: 2026-04-26
scope: Delta registry for Madhav_M2A_Exec_10 — B.5 Discovery Engine Session 2 deliverables (resonance walk reconciler, resonance register, pattern top-off PAT.012–022, PRED.011–014, M2B amendment).
supersedes: FILE_REGISTRY_v1_10.md (2026-04-27, Madhav_M2A_Exec_9)
schema_version: 1.8
changelog:
  - "v1.11 (2026-04-26, Madhav_M2A_Exec_10 close — B.5 Session 2 complete):"
  - "  (a) §9.1 — FILE_REGISTRY row updated to v1.11 (this file); FILE_REGISTRY_v1_10 flipped to SUPERSEDED."
  - "  (b) §9.13 NEW — Exec_10 deliverables: resonance_walk_reconciler, RESONANCE_REGISTER, pattern top-off, prediction_ledger update, M2B amendment."
  - "  (c) §9.2–§9.12 — unchanged from v1.10 by reference."
  - "v1.10 (2026-04-27, Madhav_M2A_Exec_9): B.5 Session 1 complete."
  - "v1.9 (2026-04-26): B.4 CONTRADICTS + phase close."
---

# MARSYS-JIS File Registry — Final Corpus (v1.11)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-26 (v1.11 published at Madhav_M2A_Exec_10 close; supersedes v1.10)

---

## §9.1 — Registry version row

| artifact | version | status | date |
|---|---|---|---|
| `FILE_REGISTRY_v1_11.md` | 1.11 | CURRENT | 2026-04-26 |
| `FILE_REGISTRY_v1_10.md` | 1.10 | SUPERSEDED | 2026-04-27 |

---

## §9.2–§9.11 — Earlier deliverables

See `FILE_REGISTRY_v1_10.md §9.2–§9.12` — unchanged.

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

(See FILE_REGISTRY_v1_10.md for details)

---

## §9.13 — Madhav_M2A_Exec_10 deliverables (B.5 Discovery Engine Session 2 — Resonance Mapping + Pattern Expansion)

### §9.13.1 — Code (Python sidecar — resonance walk)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/reconcilers/resonance_walk_reconciler.py` | 1.0 | CURRENT | NEW. `reconcile_batch(raw_response_path, batch_id)` for resonances. |
| `platform/python-sidecar/rag/reconcilers/run_resonance_pipeline.py` | 1.0 | CURRENT | NEW. Orchestrates resonance batch list. |

### §9.13.2 — Registers + Discovery Artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.json` | 1.0 | LIVE | NEW. 9 resonances RES.001–RES.009. |
| `035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.md` | 1.0 | LIVE | MD mirror. |
| `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json` | 1.0 (amended) | LIVE | Added PAT.012–PAT.022 (11 new patterns; total 22). |
| `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` | append-only | LIVE | Added PRED.011–PRED.014. |

### §9.13.3 — Prompts + Responses (B.5 resonance mapping)

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/gemini/resonance_walk_v1_0.md` | 1.0 | CURRENT | NEW. Resonance mapping prompt. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_resonance_walk_batch1_raw.md` | 1.0 | CURRENT | Batch 1 raw. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_resonance_walk_batch2_raw.md` | 1.0 | CURRENT | Batch 2 raw. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_resonance_walk_batch3_raw.md` | 1.0 | CURRENT | Batch 3 raw. |

### §9.13.4 — Verification + Governance

| Path | Change | Status |
|---|---|---|
| `verification_artifacts/RAG/b5_session2_summary.json` | 1.0 | CURRENT | NEW. Session summary. |
| `00_ARCHITECTURE/M2B_EXEC_PLAN_v1_0.md` | amended in-place (cluster-defer) | LIVE |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Exec_10 update | LIVE |
| `00_ARCHITECTURE/SESSION_LOG.md` | Exec_10 entry | LIVE |

---

## §10 — Cross-references

See `FILE_REGISTRY_v1_10.md §10` — unchanged.

---

*End of FILE_REGISTRY_v1_11.md — published at Madhav_M2A_Exec_10 close 2026-04-26.*
