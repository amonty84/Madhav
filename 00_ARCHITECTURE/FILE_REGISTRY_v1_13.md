---
artifact: FILE_REGISTRY_v1_13.md
version: "1.13"
status: CURRENT
date: 2026-04-27
scope: Delta registry for Madhav_M2A_Exec_12 — B.6 Hybrid Retrieval Library + M2B milestone close.
supersedes: FILE_REGISTRY_v1_12.md (2026-04-27, Madhav_M2A_Exec_11)
schema_version: 1.8
changelog:
  - "v1.13 (2026-04-27, Madhav_M2A_Exec_12 close — B.6 complete + M2B CLOSED):"
  - "  (a) §9.1 — FILE_REGISTRY row updated to v1.13 (this file); FILE_REGISTRY_v1_12 flipped to SUPERSEDED."
  - "  (b) §9.15 NEW — Exec_12 deliverables: hybrid retrieval library, FastAPI router, TypeScript shim, retrieval golden set, eval runner extension, B.6 red-team, DR-opening fix, governance close chain."
  - "  (c) §9.2–§9.14 — unchanged from v1.12 by reference."
  - "v1.12 (2026-04-27, Madhav_M2A_Exec_11): B.5 Session 3 complete."
  - "v1.11 (2026-04-26, Madhav_M2A_Exec_10): B.5 Session 2 complete."
  - "v1.10 (2026-04-27, Madhav_M2A_Exec_9): B.5 Session 1 complete."
---

# MARSYS-JIS File Registry — Final Corpus (v1.13)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-27 (v1.13 published at Madhav_M2A_Exec_12 close; supersedes v1.12)

---

## §9.1 — Registry version row

| artifact | version | status | date |
|---|---|---|---|
| `FILE_REGISTRY_v1_13.md` | 1.13 | CURRENT | 2026-04-27 |
| `FILE_REGISTRY_v1_12.md` | 1.12 | SUPERSEDED | 2026-04-27 |
| `FILE_REGISTRY_v1_11.md` | 1.11 | SUPERSEDED | 2026-04-26 |
| `FILE_REGISTRY_v1_10.md` | 1.10 | SUPERSEDED | 2026-04-27 |

---

## §9.2–§9.14 — Earlier deliverables

See `FILE_REGISTRY_v1_12.md §9.2–§9.14` — unchanged.

---

## §9.15 — Madhav_M2A_Exec_12 deliverables (B.6 Hybrid Retrieval Library + M2B milestone close)

### §9.15.1 — AC.0 backport fix

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/reconcilers/run_pattern_pipeline.py` | 1.1 | CURRENT | Pattern mining pipeline orchestrator. Backport fix: added `_DR_FILE`, `_open_disagreement_register_entry()`, `dr_entries_opened` to summary dict. Anomaly halt path now opens real DIS.class.acceptance_rate_anomaly entry in DISAGREEMENT_REGISTER_v1_0.md. Root cause: original (Exec_9 v1.0) predated Q2 native DR-write decision; resonance/cluster/contradiction pipelines already had the fix; pattern pipeline backported at Exec_12 per Exec_11 §17 carry-forward. |
| `platform/python-sidecar/rag/tests/test_run_pattern_pipeline.py` | 1.0 | CURRENT | Unit tests for run_pattern_pipeline.py. 8 tests in 2 classes: TestAnomalyOpensDR (4 tests: AC.0 DR-write verification) + TestRunPipeline (4 tests: happy path, hard-halt, missing file exit, batch rates file). All 8 pass. |

### §9.15.2 — Code (Python sidecar — hybrid retrieval library)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/retrieve.py` | 1.0 | CURRENT | Hybrid retrieval library. 5 modes: vector (pgvector cosine), bm25 (BM25Okapi), graph_walk (NetworkX 1-hop + cgm_boost +0.3), hybrid_rrf (RRF k=60 fusion of all 3), auto (classifier → mode selection + WCR). Reranker: Vertex AI Ranking API (probe) → cross-encoder/ms-marco-MiniLM-L-6-v2 fallback. Layer-balance enforcer: ≥1 chunk per {l1_fact, msr_signal, ucn_section, domain_report, cgm_node}. Whole-Chart-Read invariant (B.11): auto-includes UCN+CDLM for interpretive queries. |
| `platform/python-sidecar/rag/routers/rag_retrieve.py` | 1.0 | CURRENT | FastAPI router for `/rag/retrieve` endpoint. POST. RetrieveRequest: query, mode (5-way Literal), k (1–50), rerank (bool). Returns list[dict] of RetrievalResult.__dict__. |
| `platform/python-sidecar/rag/routers/__init__.py` | 1.0 | CURRENT | Package init for rag.routers. |
| `platform/python-sidecar/main.py` | 1.1 | CURRENT | FastAPI app entry point. Extended: imports rag_retrieve_router; registers at `/rag` prefix with verify_api_key dependency. |
| `platform/python-sidecar/requirements.txt` | 1.1 | CURRENT | Extended: added `rank-bm25>=0.2.2`, `sentence-transformers>=3.0.0`. |

### §9.15.3 — Code (TypeScript — retrieval client)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/src/lib/rag/retrieveClient.ts` | 1.0 | CURRENT | TypeScript shim for POST /rag/retrieve. Exports: `ragRetrieve()`, `RetrieveRequest`, `RetrievalResult`, `RetrieveResponse` interfaces, `RetrievalMode` type. Reads `NEXT_PUBLIC_SIDECAR_URL` + `SIDECAR_API_KEY` from env. |

### §9.15.4 — Evaluation artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `verification_artifacts/RAG/retrieval_golden_v1_0.json` | 1.0 | CURRENT | 20-query retrieval golden set. 5 classes: l1_fact_lookup×5, msr_signal_retrieval×5, ucn_interpretive×3, domain_report_lookup×3, chart_state_structured×4. All expected_chunk_ids verified against live DB via b3/b4 sanity tests + discovery_sanity_seed_set. Thresholds: precision@10≥0.7, recall@10≥0.6, layer_balance_pass_rate=1.0, kr3_cgm_top5_rate≥0.75. |
| `platform/python-sidecar/rag/eval/run_eval.py` | 1.1 | CURRENT | Evaluation runner. Extended for B.6: added `--mode=retrieval_eval` and `run_retrieval_assessment()` function computing precision@10, recall@10, layer_balance_pass_rate, kr3_cgm_top5_rate against retrieval_golden_v1_0.json. Live run requires Cloud SQL Auth Proxy (DATABASE_URL). |

### §9.15.5 — Verification artifacts (red-team + governance)

| Path | Version | Status | Role |
|---|---|---|---|
| `verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B6_v1_0.md` | 1.0 | CURRENT | B.6 phase close + M2B milestone close red-team. 11 probes (RT.M2B.1-6, RT.B6.7-11) + KR-3/KR-4. Overall: PASS. KR-3 transitions from by_design to addressed_in_B6 via cgm_boost. |

### §9.15.6 — Governance updates (Exec_12)

| Path | Version | Status | Change |
|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_13.md` | 1.13 | CURRENT | This file. |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | 1.0 | CURRENT (fingerprints rotated) | FILE_REGISTRY row updated to v1.13; current session fingerprints populated at AC.11. |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | 1.0 | LIVE (updated) | active_phase_plan_sub_phase → "B.6 complete (M2B CLOSED)"; last_session → Madhav_M2A_Exec_12; m2b_milestone_closed → true; red_team_counter → 0. |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | 1.0 | CURRENT (updated) | Exec_12 session closure noted; B.6 complete; M2B milestone registered. |
| `.geminirules` | re-authored-Exec_12 | LIVE | MP.1/MP.4 mirror: phase pointer updated to "B.6 complete (M2B CLOSED)"; B.6 retrieval library facts added. |
| `.gemini/project_state.md` | re-authored-Exec_12 | LIVE | MP.2 mirror: sub_phase updated; active_sessions; state_snapshot updated. |
| `CLAUDECODE_BRIEF.md` | — | COMPLETE | status field set to COMPLETE at AC.16. |

---

*End of FILE_REGISTRY_v1_13.md — v1.13 (Madhav_M2A_Exec_12 close — B.6 + M2B milestone — 2026-04-27).*
