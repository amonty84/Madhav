---
artifact: FILE_REGISTRY_v1_8.md
version: 1.8
status: CURRENT
date: 2026-04-26
scope: Delta registry for Madhav_M2A_Exec_7 — B.4 Task 3 SUPPORTS sub-task deliverables (rag/ledger.py minimal impl, rag/reconcilers/* package, cgm_supports_edges_v1_0.md prompt, two_pass_events_schema_v0_1.json + JSONL ledger, cgm_supports_edges_manifest_v1_0.json, ucn_section_node_map.json, b4_supports_count.json, DISAGREEMENT_REGISTER amendment with DIS.001 + new class).
supersedes: FILE_REGISTRY_v1_7.md (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1)
schema_version: 1.8
changelog:
  - v1.8 (2026-04-26, Madhav_M2A_Exec_7 close — B.4 Task 3 SUPPORTS sub-task):
    (a) §9.1 — FILE_REGISTRY row updated to v1.8 (this file); FILE_REGISTRY_v1_7 flipped to SUPERSEDED in §8.
    (b) §9.10 NEW — Exec_7 deliverables: cgm_supports_edges_v1_0.md prompt; rag/ledger.py minimal impl;
        rag/reconcilers/{cgm_supports_reconciler,run_supports_pipeline,persist_from_reconciled}.py;
        rag/graph.persist_supports_edges helper (in-place graph.py addition); rag/tests/test_ledger.py;
        06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json;
        06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl (432 events);
        035_DISCOVERY_LAYER/cgm_supports_edges_manifest_v1_0.json (101 logical SUPPORTS edges);
        verification_artifacts/RAG/ucn_section_node_map.json (17 unique UCN.SEC.* targets);
        verification_artifacts/RAG/b4_supports_count.json; 9 raw + 9 reconciled response files;
        DISAGREEMENT_REGISTER §1 DIS.class.l3_zero_supports class added; DIS.001 entry opened+resolved.
    (c) §8 — FILE_REGISTRY_v1_7 archival row added.
    (d) §1–§7, §9.2–§9.9, §10 — unchanged from v1.7 by reference.
  - v1.7 (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 → v0_3): Portal Build Tracker 3-session sprint.
  - v1.6 (2026-04-26): B.4 Session 1 CGM edges manifest + graph.py.
  - v1.5 (2026-04-26): B.3.5 CGM Rebuild + Build Tracker Integration.
  - v1.4 (2026-04-24/2026-04-25): Step 12 governance bundle + B.1 ingestion deliverables.
  - v1.3 (2026-04-24, Step 7): governance-integrity bundle.
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE v2.1 → v2.2.
  - v1.1 (2026-04-23, Step 5): MSR v2.0 → v3.0; MP v2.0.
  - v1.0 (2026-04-19): registry successor to FILE_INDEX_v1_0.
---

# MARSYS-JIS File Registry — Final Corpus (v1.8)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-26 (v1.8 published at Madhav_M2A_Exec_7 close; supersedes v1.7)

The v1.8 revision is **delta-style relative to v1.7**. Changed sections: §8 (FILE_REGISTRY_v1_7 archival), §9.1 (registry self-row), §9.10 (Exec_7 deliverables). All other sections are unchanged from v1.7. The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`.

---

## §1–§7 — L0, L1, L2, L2.5, L3, L4, Tooling

See `FILE_REGISTRY_v1_7.md §1–§7` — unchanged.

---

## §8 — Archival / superseded

| Predecessor | Superseded at | Successor | Reason |
|---|---|---|---|
| FILE_REGISTRY_v1_7.md | 2026-04-26, Madhav_M2A_Exec_7 | FILE_REGISTRY_v1_8.md | Exec_7 deliverables (§9.10) added; row §9.1 rotated. |
| FILE_REGISTRY_v1_6.md | 2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 | FILE_REGISTRY_v1_7.md | Portal Build Tracker Session 1 deliverables. |
| (Earlier rows preserved in v1.7 §8) | — | — | See `FILE_REGISTRY_v1_7.md §8`. |

---

## §9.1 — Registry self-row

| Path | Version | Status | Notes |
|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_8.md` | 1.8 | CURRENT | This file. |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` | 1.7 | SUPERSEDED | See §8. |

---

## §9.2–§9.9 — Earlier deliverables

See `FILE_REGISTRY_v1_7.md §9.2–§9.9` — unchanged.

---

## §9.10 — Madhav_M2A_Exec_7 deliverables (B.4 Task 3 SUPPORTS sub-task)

### §9.10.1 — Code (Python sidecar)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/ledger.py` | minimal-impl | CURRENT | `append_two_pass_event` + `read_events_for_batch` against two_pass_events_schema_v0_1.json. Replaces 7-line stub. |
| `platform/python-sidecar/rag/reconcilers/__init__.py` | 1.0 | CURRENT | NEW package init. |
| `platform/python-sidecar/rag/reconcilers/cgm_supports_reconciler.py` | 1.0 | CURRENT | Pass-2 reconciler: parse Gemini raw YAML → P1/P2/P5 + L3-chain check → reconciled.md + ledger events. |
| `platform/python-sidecar/rag/reconcilers/run_supports_pipeline.py` | 1.0 | CURRENT | Orchestrator: 9-batch pipeline with persist + manifest + count. |
| `platform/python-sidecar/rag/reconcilers/persist_from_reconciled.py` | 1.0 | CURRENT | Recovery script — re-derive accepted edges from existing reconciled.md + raw.md without re-running reconciler. |
| `platform/python-sidecar/rag/graph.py` | in-place addition | CURRENT (B.4 freeze exception per brief §3) | Added `persist_supports_edges(edges, repo_root)` helper at end. Existing surface unchanged. |
| `platform/python-sidecar/rag/tests/__init__.py` | 1.0 | CURRENT | NEW. |
| `platform/python-sidecar/rag/tests/test_ledger.py` | 1.0 | CURRENT | 8 smoke tests (pass schema, fail schema, round-trip, event_id stability). 8/8 pass. |

### §9.10.2 — Schemas + ledger

| Path | Version | Status | Role |
|---|---|---|---|
| `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json` | 0.1 | CURRENT | JSON Schema for ledger entries (gemini_proposal, claude_reconcile_accept, claude_reconcile_reject). |
| `06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl` | append-only | LIVE | 432 events from Exec_7 9-batch reconciliation. B.5 mining-event ledger extends this surface. |
| `06_LEARNING_LAYER/LEDGER/.gitkeep` | — | CURRENT | NEW dir marker. |
| `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` | 0.1 | LIVE | Updated: gemini.cgm_edge_proposals → v1.1; gemini.cgm_supports_edges → v1.0 (NEW); placeholder hash corrected. |

### §9.10.3 — Prompts + responses

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_supports_edges_v1_0.md` | 1.0 | CURRENT | NEW. 83KB prompt with 9-batch strategy, embedded 495-signal MSR + 44-section UCN + per-L3 citation index. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_supports_batch{1..9}_raw.md` | 1.0 | CURRENT | NEW (×9). Gemini Pass-1 raw YAML responses. 216 proposed edges total. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_supports_batch{1..9}_reconciled.md` | 1.0 | CURRENT | NEW (×9). Claude Pass-2 reconciler artifacts with §1 result summary + §2 verdict tables. |

### §9.10.4 — Manifest + verification artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/cgm_supports_edges_manifest_v1_0.json` | 1.0 | CURRENT | 101 SUPPORTS edge entries (logical). Per-edge: edge_id (CGM_SUPPORTS_NNN), source/target node_id, l3_evidence_report+section, confidence_prior, source_batch, source_reconciled_artifact, accepted_at, accepted_by_session. Carries `l3_gate_disposition: DIS.001`. |
| `verification_artifacts/RAG/ucn_section_node_map.json` | 1.0 | CURRENT | NEW. 17 stable UCN.SEC.X.Y → node_id mappings (node_id = stable_id; chunk_id NULL for graph-side records). |
| `verification_artifacts/RAG/b4_supports_count.json` | 1.0 | CURRENT | NEW. Per-L3 SUPPORTS counts + aggregate (proposed/accepted/rejected by P1/P2/P5/L3-chain) + L3 gate disposition. |
| `verification_artifacts/RAG/b4_edge_count.json` | in-place update | LIVE | supports_edges 0 → 97; SUPPORTS in edges_by_type populated; supports_edges_logical_accepted=101; dedup_note added; L3 gate fields. |
| `verification_artifacts/RAG/graph.json` | in-place update | LIVE | Re-exported from DB at Exec_7 close. 1752 nodes / 3911 edges / 97 SUPPORTS. |

### §9.10.5 — Governance amendments

| Path | Change | Status |
|---|---|---|
| `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` | §1 added DIS.class.l3_zero_supports; §4 entry DIS.001 opened+resolved in-session. | CURRENT |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Exec_7 changelog entry; §2 YAML state-block transition; §3 narrative refresh. | LIVE |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | FILE_REGISTRY row rotated v1.7 → v1.8. | CURRENT |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Amendment log entry (Exec_7 close). | CURRENT |
| `00_ARCHITECTURE/SESSION_LOG.md` | Madhav_M2A_Exec_7 atomic entry appended. | LIVE |
| `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` | KR-4 added: L3 v1.2 UCN-citation gap (HEALTH_LONGEVITY + RELATIONSHIPS reports). | LIVE |
| `.geminirules` | MP.1 mirror — Exec_7 deliverables block. | LIVE |
| `.gemini/project_state.md` | MP.2 state-block updated. | LIVE |
| `CLAUDECODE_BRIEF.md` | status: PENDING_ACTIVATION → COMPLETE; closed_session_id: Madhav_M2A_Exec_7. | COMPLETE |

### §9.10.6 — DB-side state at Exec_7 close

| Table | Row count | Delta from Exec_6 |
|---|---|---|
| `rag_chunks` | 993 | unchanged |
| `rag_embeddings` | 977 | unchanged |
| `rag_graph_nodes` | 1752 | +17 (new ucn_section nodes) |
| `rag_graph_edges` | 3911 | +97 (SUPPORTS; 4 cross-batch dups collapsed) |

---

## §10 — Cross-references

See `FILE_REGISTRY_v1_7.md §10` — unchanged. Add: this file is referenced by `CANONICAL_ARTIFACTS_v1_0.md §1` (FILE_REGISTRY row).

---

*End of FILE_REGISTRY_v1_8.md — published at Madhav_M2A_Exec_7 close 2026-04-26.*
