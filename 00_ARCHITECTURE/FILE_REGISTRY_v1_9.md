---
artifact: FILE_REGISTRY_v1_9.md
version: 1.9
status: CURRENT
date: 2026-04-26
scope: Delta registry for Madhav_M2A_Exec_8 — B.4 Task 3 CONTRADICTS sub-task deliverables (inverted two-pass pipeline, schema extension, P6 validator stub, Gemini challenger prompt, Pass-1 batch files, ledger CONTRADICTS events, 4 CONTRADICTS edges persisted, red-team pass, B.4 phase final close, PlanTree.tsx bugfix).
supersedes: FILE_REGISTRY_v1_8.md (2026-04-26, Madhav_M2A_Exec_7)
schema_version: 1.8
changelog:
  - v1.9 (2026-04-26, Madhav_M2A_Exec_8 close — B.4 CONTRADICTS sub-task + phase final close):
    (a) §9.1 — FILE_REGISTRY row updated to v1.9 (this file); FILE_REGISTRY_v1_8 flipped to SUPERSEDED in §8.
    (b) §9.11 NEW — Exec_8 deliverables: CONTRADICTS pipeline code, schema extension, prompts, ledger events, graph edges, red-team artifact, PlanTree.tsx bugfix.
    (c) §8 — FILE_REGISTRY_v1_8 archival row added.
    (d) §1–§7, §9.2–§9.10, §10 — unchanged from v1.8 by reference.
  - v1.8 (2026-04-26, Madhav_M2A_Exec_7): B.4 Task 3 SUPPORTS sub-task.
  - v1.7 (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 → v0_3): Portal Build Tracker 3-session sprint.
  - v1.6 (2026-04-26): B.4 Session 1 CGM edges manifest + graph.py.
  - v1.5 (2026-04-26): B.3.5 CGM Rebuild + Build Tracker Integration.
  - v1.4 (2026-04-24/2026-04-25): Step 12 governance bundle + B.1 ingestion deliverables.
  - v1.3 (2026-04-24, Step 7): governance-integrity bundle.
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE v2.1 → v2.2.
  - v1.1 (2026-04-23, Step 5): MSR v2.0 → v3.0; MP v2.0.
  - v1.0 (2026-04-19): registry successor to FILE_INDEX_v1_0.
---

# MARSYS-JIS File Registry — Final Corpus (v1.9)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-26 (v1.9 published at Madhav_M2A_Exec_8 close; supersedes v1.8)

The v1.9 revision is **delta-style relative to v1.8**. Changed sections: §8 (FILE_REGISTRY_v1_8 archival), §9.1 (registry self-row), §9.11 (Exec_8 deliverables). All other sections are unchanged from v1.8. The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`.

---

## §1–§7 — L0, L1, L2, L2.5, L3, L4, Tooling

See `FILE_REGISTRY_v1_7.md §1–§7` — unchanged.

---

## §8 — Archival / superseded

| Predecessor | Superseded at | Successor | Reason |
|---|---|---|---|
| FILE_REGISTRY_v1_8.md | 2026-04-26, Madhav_M2A_Exec_8 | FILE_REGISTRY_v1_9.md | Exec_8 CONTRADICTS deliverables (§9.11) added; row §9.1 rotated. |
| FILE_REGISTRY_v1_7.md | 2026-04-26, Madhav_M2A_Exec_7 | FILE_REGISTRY_v1_8.md | Exec_7 SUPPORTS deliverables (§9.10) added. |
| (Earlier rows preserved in v1.8 §8) | — | — | See `FILE_REGISTRY_v1_8.md §8`. |

---

## §9.1 — Registry self-row

| Path | Version | Status | Role |
|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_9.md` | 1.9 | CURRENT | This file. Delta registry for Exec_8. |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_8.md` | 1.8 | SUPERSEDED | Exec_7 SUPPORTS deliverables. |

---

## §9.2–§9.10 — Earlier deliverables

See `FILE_REGISTRY_v1_8.md §9.2–§9.10` — unchanged.

---

## §9.11 — Madhav_M2A_Exec_8 deliverables (B.4 Task 3 CONTRADICTS sub-task + phase final close)

### §9.11.1 — Code (Python sidecar)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/validators/p6_uvc_consistency.py` | 1.0 PARTIAL_IMPL | CURRENT | NEW. Minimal surface: `ConflictFlag` dataclass + `scan_ucn_vs_l3()` keyword heuristic. Scan returns 0 flags (expected for curated corpus). Partial-impl registered in STALENESS_REGISTER §4. |
| `platform/python-sidecar/rag/tests/test_p6_uvc_consistency.py` | 1.0 | CURRENT | NEW. 5 smoke tests (imports, list return, valid fields, unique ids, construction). 5/5 pass. |
| `platform/python-sidecar/rag/reconcilers/cgm_contradicts_pass1.py` | 1.0 | CURRENT | NEW. Three scan functions: `scan_a_p1_layer_bleed`, `scan_b_p6_uvc_conflict`, `scan_c_rahu_as_pk`. Writes batch YAML files + appends `claude_proposal` ledger events. |
| `platform/python-sidecar/rag/reconcilers/cgm_contradicts_reconciler.py` | 1.0 | CURRENT | NEW. Reconciler for Gemini challenger-pass adjudications. Parses YAML raw files, validates accepted edges, appends accept/reject ledger events, calls `persist_contradicts_edges`. |
| `platform/python-sidecar/rag/reconcilers/run_contradicts_pipeline.py` | 1.0 | CURRENT | NEW. Orchestrates Pass-1 and reconcile modes. Writes manifest + count JSON. |
| `platform/python-sidecar/rag/reconcilers/__init__.py` | in-place update | CURRENT | Added comment documenting both SUPPORTS and CONTRADICTS modules. |
| `platform/python-sidecar/rag/graph.py` | in-place addition | CURRENT | Added `persist_contradicts_edges(edges, repo_root)` helper mirroring `persist_supports_edges`. |

### §9.11.2 — Schemas + ledger

| Path | Version | Status | Role |
|---|---|---|---|
| `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json` | 0.1 amended in-place | CURRENT | Additive extension: `event_type` enum expanded to 6 values; `gemini_response_ref` type → `["string","null"]`; new optional fields: `hypothesis_id`, `conflict_type`, `claude_severity_prior`, `claude_rationale`; if/then/else chain for `gemini_challenge_accept` + `gemini_challenge_reject`. |
| `06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl` | append-only | LIVE | +30 CONTRADICTS events: 15 `claude_proposal` (10 Batch A p1_layer_bleed, 5 Batch C rahu_as_pk); 10 `gemini_challenge_reject` (Batch A all); 4 `gemini_challenge_accept` + 1 `gemini_challenge_reject` (Batch C). Total: 462 events. |
| `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` | in-place update | LIVE | New entry: `claude.cgm_contradicts_edges` v1.0 with sha256 hash. |

### §9.11.3 — Prompts + responses (CONTRADICTS two-pass)

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/claude/cgm_contradicts_edges_v1_0.md` | 1.0 | CURRENT | NEW. Claude Pass-1 invariant scanner prompt. Three batch type adjudication guidelines (A: P1 layer-bleed, B: P6 UVC-conflict, C: Rahu-as-PK). YAML output schema. |
| `035_DISCOVERY_LAYER/PROMPTS/claude/responses/2026-04-26_B4_contradicts_pass1_batchA.md` | 1.0 | CURRENT | NEW. Pass-1 Batch A hypotheses: 10 P1 layer-bleed candidates from L1 FORENSIC. |
| `035_DISCOVERY_LAYER/PROMPTS/claude/responses/2026-04-26_B4_contradicts_pass1_batchC.md` | 1.0 | CURRENT | NEW. Pass-1 Batch C hypotheses: 5 Rahu-as-PK dual-karaka candidates (SIG.MSR.226/320/321/430/432). |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_contradicts_batchA_raw.md` | 1.0 | CURRENT | NEW (native/Gemini-authored). Batch A adjudication: all 10 REJECTED HIGH. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_contradicts_batchC_raw.md` | 1.0 | CURRENT | NEW (native/Gemini-authored). Batch C adjudication: 4 ACCEPTED, 1 REJECTED HIGH. |

### §9.11.4 — Manifest + verification artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/cgm_contradicts_edges_manifest_v1_0.json` | 1.0 | CURRENT | NEW. 4 accepted CONTRADICTS edges with full provenance (source, target, conflict_type, gemini_confidence, steelman_reconciliation_excerpt). |
| `verification_artifacts/RAG/b4_contradicts_count.json` | 1.0 | CURRENT | NEW. Pipeline output: by_batch breakdown, totals, by_target_node_type. |
| `verification_artifacts/RAG/b4_edge_count.json` | in-place update | LIVE | contradicts_edges 0 → 4; b4_contradicts_complete=true; l3_gate fields; contradicts_summary block with per-batch details; b4_phase_final_close_at=Madhav_M2A_Exec_8. |
| `verification_artifacts/RAG/graph.json` | in-place update | LIVE | Re-exported at Exec_8 close. 1753 nodes / 3915 edges / 4 CONTRADICTS / 97 SUPPORTS. |
| `verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B4_v1_0.md` | 1.0 | CURRENT | NEW. Red-team pass RT.M2B.1–RT.M2B.6 + KR-1–KR-4. All 10 probes PASS. B.4 eligible for final close. |

### §9.11.5 — Governance amendments

| Path | Change | Status |
|---|---|---|
| `00_ARCHITECTURE/STALENESS_REGISTER.md` | §4 Partial-Implementation Registry added with p6_uvc_consistency.py row. | CURRENT |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Exec_8 changelog entry; §2 YAML state-block transition; B.4 complete, next=B.5. | LIVE |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | FILE_REGISTRY row rotated v1.8 → v1.9. | CURRENT |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Amendment log entry (Exec_8 close). | CURRENT |
| `00_ARCHITECTURE/SESSION_LOG.md` | Madhav_M2A_Exec_8 atomic entry appended; SESSION_LOG `## Body` H2 heading (Exec_7 entry) corrected to bold text (schema_validator heading-parse fix). | LIVE |
| `.geminirules` | MP.1 mirror — Exec_8 CONTRADICTS deliverables block. | LIVE |
| `.gemini/project_state.md` | MP.2 state-block updated to B.4 complete / B.5 next. | LIVE |
| `CLAUDECODE_BRIEF.md` | status: AUTHORED → COMPLETE; closed_session_id: Madhav_M2A_Exec_8. | COMPLETE |
| `platform/src/components/build/PlanTree.tsx` | Fixed React render-phase side-effect bug: `router.replace()` moved out of `setExpanded` updater into callback body; `expanded` added to `useCallback` dependency array. | CURRENT |

### §9.11.6 — DB-side state at Exec_8 close

| Table | Row count | Delta from Exec_7 |
|---|---|---|
| `rag_chunks` | 993 | unchanged |
| `rag_embeddings` | 977 | unchanged |
| `rag_graph_nodes` | 1753 | +1 (KARAKA.DUAL_SYSTEM_DIVERGENCE node) |
| `rag_graph_edges` | 3915 | +4 (CONTRADICTS: SIG.MSR.226/320/321/432 → KARAKA.DUAL_SYSTEM_DIVERGENCE) |

---

## §10 — Cross-references

See `FILE_REGISTRY_v1_8.md §10` — unchanged. Add: this file is referenced by `CANONICAL_ARTIFACTS_v1_0.md §1` (FILE_REGISTRY row).

---

*End of FILE_REGISTRY_v1_9.md — published at Madhav_M2A_Exec_8 close 2026-04-26.*
