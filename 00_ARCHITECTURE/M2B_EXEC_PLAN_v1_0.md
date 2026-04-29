---
artifact: M2B_EXEC_PLAN
version: "1.0"
status: READY_FOR_EXEC
produced_by: "Cowork orchestration thread Madhav_M2A_Exec_7 (Cowork session, predecessor to Claude Code execution sessions Exec_7..Exec_12)"
produced_on: 2026-04-26
planned_by_model: claude-opus-4-7
execution_model: claude-sonnet-4-6
milestone: "M2B — Graph + Discovery + Retrieval Stack"
sub_phases_covered: [B.4_full, B.5, B.6]
predecessor_milestone: "M2A — Foundation Stack (B.1–B.3.5; CLOSED at Madhav_M2A_Exec_5; documented in M2A_EXEC_PLAN_v1_0.md)"
session_window_at_authoring: >
  M2B Session 1 of 7 (B.4 Session 1 of 2 — Tasks 1+2+4+5) was executed at Madhav_M2A_Exec_6
  (CLOSED 2026-04-26) ahead of this plan's authoring; that session is enumerated retroactively
  here at §PLAN.B4_S1 for completeness. Sessions 2–7 (B.4 Task 3 SUPPORTS / B.4 Task 3 CONTRADICTS
  + close / B.5 S1–S3 / B.6 S1) execute against this plan from Exec_7 forward.
estimated_remaining_sessions: 6
  # Sessions 2–7 of M2B. Per-phase: B.4_TASK3_SUPPORTS = 1 session (Exec_7); B.4_TASK3_CONTRADICTS_AND_CLOSE = 1 session (Exec_8); B.5 = 3 sessions (Exec_9–Exec_11; PHASE_B_PLAN §B.5 velocity); B.6 = 1 session (Exec_12; PHASE_B_PLAN §B.6 velocity).
estimated_remaining_cost_usd: 80
  # Per PHASE_B_PLAN §E.7 actor × phase cost matrix: B.4 remainder ≈ $15 (SUPPORTS+CONTRADICTS Gemini batches); B.5 ≈ $55 (3 sessions, mid-phase red-team); B.6 ≈ $2 (deterministic). Subject to +75% reconciler-context-overrun buffer per §E.7 → potential up to ~$140. M2A actual was $0–5 against $20 forecast; reconciler discipline holds.
red_team_cadence_during_m2b: >
  At Exec_7 close: counter 1 → 2 (M2 execution).
  At Exec_8 close: counter 2 → 3 → cadence fires → red-team prompt run; counter resets to 0.
  At Exec_9 close: counter 0 → 1.
  At Exec_10 close: counter 1 → 2.
  Plus mid-phase B.5 red-team per PHASE_B_PLAN §B.5 line 706 — not a session-cadence event but a PHASE-cadence event (per MACRO_PLAN §IS.8 cadence clause (b)).
  At Exec_11 close (B.5 phase close): counter 2 → 3 → cadence fires → red-team prompt run; counter resets to 0.
  At Exec_12 close: counter 0 → 1.
mirror_pair_touches_during_m2b: >
  MP.1 (CLAUDE.md / .geminirules): no Claude-side substantive change expected; MP.4 of Gemini side
  may reflect phase progression. MP.2 (composite / project_state.md): touched at every session close.
  MP.4 (PHASE_B_PLAN / Gemini-side phase pointer): touched at B.4 close (Exec_8), B.5 close
  (Exec_11), B.6 close (Exec_12). MP.5 (FILE_REGISTRY / Gemini L2.5 path subset): touched whenever
  FILE_REGISTRY bumps; expected v1.7 at Exec_7, v1.8+ as new B.5/B.6 artifacts register.
companion_artifact: "Per-session CLAUDECODE_BRIEF.md authored by Cowork before each Claude Code session. This plan is the multi-session ground truth; per-session briefs are the executor's contract."
exec_7_brief_status_at_authoring: >
  The Exec_7 brief was authored at /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDECODE_BRIEF.md as the
  primary deliverable of this Cowork orchestration session, but was overwritten on the same day
  (2026-04-26) by the Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 brief (Session 1 of a 3-session
  governance_aside sprint per PORTAL_BUILD_TRACKER_PLAN_v0_1.md). The portal sprint's brief
  explicitly acknowledges and commits to reactivating the Exec_7 brief when M2 corpus execution
  resumes. The Exec_7 brief content is preserved at
  00_ARCHITECTURE/CLAUDECODE_BRIEF_M2A_Exec_7_PENDING.md (status: PENDING_ACTIVATION). At the
  moment the portal sprint closes (after 3 governance_aside sessions), Cowork re-publishes the
  PENDING brief to CLAUDECODE_BRIEF.md (with deltas if portal-sprint deliverables — e.g.
  serializer v0.2.0, COWORK_LEDGER, FILE_REGISTRY v1.7+ — change references). M2B session
  sequencing is unaffected: Exec_7 is the next M2 corpus session after the portal sprint's
  Session 3 closes.
---

# M2B Execution Plan v1.0 — Graph + Discovery + Retrieval Stack (B.4 full + B.5 + B.6)

*Produced in `Cowork orchestration thread Madhav_M2A_Exec_7` (2026-04-26) per native instruction "Author M2B plan alongside Exec_7 brief" (Cowork question 2 answer 2026-04-26). Executor: Claude Code Extension (Sonnet 4.6). Input to Cowork for per-session CLAUDECODE_BRIEF authoring.*

*Companion to `M2A_EXEC_PLAN_v1_0.md` (READY_FOR_EXEC at 2026-04-25; M2A executed Madhav_M2A_Exec → Madhav_M2A_Exec_5; M2A CLOSED). M2B picks up at B.4 Session 1 (already executed at Madhav_M2A_Exec_6) and continues through B.6.*

---

## §OBS — Pre-Condition Observations

The following pre-conditions hold at the moment of M2B plan authoring (2026-04-26, post-Exec_6 close).

**OBS.1 — `rag/ledger.py` is a stub; B.4 acceptance demands implementation.**

- PHASE_B_PLAN §G B.0 Task 9 + §F.1 Hook 1 originally specified ledger implementation at B.0; the actual B.0 deliverable is a 7-line module with the docstring "Implementation deferred to Phase B.5".
- PHASE_B_PLAN §B.4 acceptance criteria include "Ledger contains two-pass events for every Gemini-proposed edge" + "Each Gemini-batch ledger event has a `gemini_response_ref` pointing to an existing raw response file."
- B.3.5 reconciler at Madhav_M2A_Exec_5 satisfied a precursor of this requirement via per-batch `_reconciled.md` + `cgm_edges_manifest_v1_0.json`, which functioned as a de-facto file-based ledger. For B.4 SUPPORTS / CONTRADICTS, a queryable form is needed (per-edge events keyed by `event_id`) so B.5's mining-event ledger extends the same surface.
- **Resolution:** Implement minimal `append_two_pass_event(event: dict)` JSONL writer + `read_events_for_batch(batch_id: str)` reader at Exec_7 per `CLAUDECODE_BRIEF.md §AC.1` (B.4 SUPPORTS sub-task brief). Schema in `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json` (NEW). Storage in `06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl` (NEW). Full B.5 mining-event support (`get_acceptance_rate(batch_id)` etc.) extends the same ledger at B.5 Task 0.

**OBS.2 — `rag/prediction_ledger.py` is a stub; B.5 demands implementation.**

- PHASE_B_PLAN §B.5 Task 0 spec: implement `prediction_ledger.py` with `append_prediction(entry: Prediction)` method.
- Actual: 8-line stub.
- **Resolution:** B.5 Session 1 first task (per PHASE_B_PLAN §B.5 Task 0). Schema reference: `06_LEARNING_LAYER/PREDICTION_LEDGER/schema_v0_1.json` (already exists). Storage: `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` (already exists, empty).

**OBS.3 — KR-3 (cgm_node NL-retrieval rank 7) shapes B.6 architecture.**

- Per `RED_TEAM_M2A_v1_0.md §5 known_residuals KR-3` (NEW at Exec_6 close): cgm_node chunks rank 7 in NL semantic search but rank 1 in structured retrieval. Status: `by_design` — YAML/structured chunks underperform prose chunks in NL embeddings; this is expected and not a defect.
- **Implication for B.6:** the hybrid retrieval library (PHASE_B_PLAN §B.6) must combine vector + BM25 + graph-walk with explicit retrieval-mode signals so the router can route structured queries (e.g., "what is Saturn's house?") to graph-walk over CGM nodes, and NL-interpretive queries (e.g., "explain the soul's mission") to vector + UCN. **The Voyage rerank step in §B.6 is decorrelated from the embedding model swap to Vertex AI text-multilingual-embedding-002 (B.3 deliverable);** B.6 needs to reconcile reranker model with Vertex embedding space — this is a B.6 design-time decision, not a §B.6 implementation surprise.
- **Resolution:** B.6 brief calls out the hybrid-retrieval mode-routing requirement explicitly; reranker-vs-embedding-model alignment is a B.6 design decision (acceptable: native Vertex reranker if available; fallback: cross-encoder over Vertex top-50; do NOT swap embedding model).

**OBS.4 — `35_DISCOVERY_LAYER/QUERY_TAXONOMY/` does not exist; B.7 prereq.**

- PHASE_B_PLAN §B.7 Task 2: "Plan taxonomy in `035_DISCOVERY_LAYER/QUERY_TAXONOMY/plans_v1_0.md`."
- Actual: directory absent.
- **Impact on M2B:** none — B.7 is post-M2B (M2C scope). Surfaced here for cross-milestone tracking.

**OBS.5 — Mid-phase B.5 eval requires 5 seed known facts.**

- PHASE_B_PLAN §B.5 mid-phase gate: "After the first 5 patterns are validated: run `rag/eval/run_eval.py --mode=discovery_sanity --seed_set=5` against 5 seeded known facts (authored as part of B.5 setup)."
- Actual: 5 seeded known facts not yet authored. They are an explicit B.5 setup deliverable (sibling to Task 0).
- **Resolution:** B.5 Session 1 (Exec_9) authors the 5 seed facts before pattern mining begins. Path: `verification_artifacts/RAG/discovery_sanity_seed_set_v1_0.json` (NEW). Format: 5 entries per `{seed_id, claim_text, expected_chunks_rank<=10, expected_signals, expected_l3_evidence_report}`. Source: drawn from UCN_v4_0 + L3 reports — facts that any retrieval system over this corpus must recover.

**OBS.6 — Discovery-engine register file paths.**

- PHASE_B_PLAN §B.5 acceptance names four registers: PATTERN_REGISTER, RESONANCE_REGISTER, CONTRADICTION_REGISTER, CLUSTER_ATLAS. Each `.md` + `.json` mirror.
- Actual: none exist. They are explicit B.5 deliverables.
- Path convention (per pattern): `035_DISCOVERY_LAYER/<REGISTER>_v1_0.md` + `.json`. Confirm against PHASE_B_PLAN §B.5 wording (which is path-implicit — uses register names without explicit paths). Executor at B.5 brief publishes the chosen path.

**OBS.7 — KR-1 / KR-2 CLOSED at Exec_6 close.**

- Per `RED_TEAM_M2A_v1_0.md §5 known_residuals` post-Exec_6: KR-1 (RT4 stale-L3 propagation DB-side) CLOSED; KR-2 (RT5 token ceiling DB-side) CLOSED. KR-3 (cgm_node NL retrieval) NEW — by_design.
- **Resolution:** No M2B carry-forward. M2B can assume DB-side stale-flag and token-ceiling discipline holds.

---

## §DEPS — Cross-Phase Dependency Map

```
                         M2A (CLOSED)
                              │
                              ▼
   ┌──────────────────── B.4 Session 1 (Exec_6 — DONE) ──────────────────┐
   │                                                                       │
   │  Outputs:                                                             │
   │  • rag_graph_nodes=1735, rag_graph_edges=3814 (deterministic+22 CGM)  │
   │  • cgm_edges_manifest_v1_0.json (22 reconciled edges)                 │
   │  • CGM_v9_0.md frontmatter amended (manifest pointer)                 │
   │  • FILE_REGISTRY v1.6                                                 │
   │  • rag/graph.py full impl                                              │
   │  • cgm_node chunks/embeddings DB-side (993 / 977)                     │
   │                                                                       │
   └────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
   ┌──────────────── B.4 Task 3 SUPPORTS (Exec_7) ──────────────────────┐
   │                                                                       │
   │  Inputs:                                                              │
   │  • rag_graph_nodes (existing 1735) — SUPPORTS targets need ucn_section
   │    nodes added (executor creates them)
   │  • UCN_v4_0.md (read for section list)
   │  • MSR_v3_0.md (read for source signals)
   │  • 9 v1.1 L3 reports (read for evidentiary chains)
   │
   │  Outputs:
   │  • cgm_supports_edges_v1_0.md (Gemini prompt)                         │
   │  • cgm_supports_edges_manifest_v1_0.json                              │
   │  • rag/ledger.py minimal impl + JSONL ledger                          │
   │  • two_pass_events_schema_v0_1.json                                    │
   │  • SUPPORTS edges in rag_graph_edges (target ≥9, realistic 50–200)    │
   │  • b4_supports_count.json (per-L3 report tally)                        │
   │  • graph.json updated                                                  │
   │  • PROMPT_REGISTRY: gemini.cgm_edge_proposals v1.1 + cgm_supports_edges v1.0
   │                                                                       │
   └────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
   ┌──────── B.4 Task 3 CONTRADICTS + B.4 phase final close (Exec_8) ────┐
   │                                                                       │
   │  Inputs:
   │  • CONTRADICTS prompt is Claude → Gemini per §E.5 (inverted ordering)
   │  • Claude scans P1 / P6 / Rahu-as-PK candidates from chunk set
   │  • Gemini's challenger pass filters Claude's candidates
   │
   │  Outputs:
   │  • cgm_contradicts_edges_v1_0.md (Claude-authored prompt, NEW path:
   │    035_DISCOVERY_LAYER/PROMPTS/claude/)
   │  • cgm_contradicts_edges_manifest_v1_0.json
   │  • CONTRADICTS edges in rag_graph_edges
   │  • Two-pass ledger events for every Claude-proposed edge with gemini_response_ref
   │  • B.4 phase final close: graph.json final, b4_edge_count.json final,
   │    PHASE_B_PLAN §B.4 acceptance signed off in full
   │  • [Red-team cadence fires at counter=3 — PHASE_B_PLAN §IS.8 (b) macro-phase
   │    sub-close OR (a) every-third-session — verify against MACRO_PLAN]
   │                                                                       │
   └────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
   ┌────────────── B.5 Session 1 (Exec_9): Setup + Pattern Mining ──────┐
   │                                                                       │
   │  Inputs:
   │  • rag_graph_edges (full B.4) including SUPPORTS + CONTRADICTS
   │  • full chunk + embedding corpus (993 / 977)
   │  • L3 narrative chains (Pass-2 reconciler reads for context)
   │
   │  Outputs:
   │  • rag/prediction_ledger.py minimal impl
   │  • discovery_sanity_seed_set_v1_0.json (5 known facts)
   │  • PATTERN_REGISTER_v1_0.md + .json (≥10 patterns toward 20 target)
   │  • Pattern-mining ledger events
   │  • Mid-phase eval: precision@10 ≥0.7 on 5 seeds
   │                                                                       │
   └────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
   ┌────────────── B.5 Session 2 (Exec_10): Resonance + Cluster ───────┐
   │                                                                       │
   │  Inputs:
   │  • PATTERN_REGISTER from Exec_9
   │  • CDLM cells (already in graph as CROSS_LINKS)
   │  • Voyage embeddings... wait — Vertex embeddings (re: B.3 swap).
   │    KMeans/HDBSCAN over the existing 977 Vertex embeddings.
   │
   │  Outputs:
   │  • RESONANCE_REGISTER_v1_0.md + .json (≥10 resonances)
   │  • CLUSTER_ATLAS_v1_0.md + .json (≥10 clusters)
   │  • Acceptance-rate logging in batch_acceptance_rates.json
   │                                                                       │
   └────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
   ┌────────── B.5 Session 3 (Exec_11): Contradictions + B.5 close ─────┐
   │                                                                       │
   │  Inputs:
   │  • Patterns + Resonances + Clusters
   │  • CONTRADICTS edges from B.4
   │  • Invariant scanner findings (P1/P2/P5 against full chunk set)
   │  • UCN-vs-L3 P6 conflicts surfaced
   │
   │  Outputs:
   │  • CONTRADICTION_REGISTER_v1_0.md + .json (≥5 contradictions)
   │  • Final B.5 acceptance: ≥20 patterns, ≥10 resonances, ≥5 contradictions, ≥10 clusters
   │  • Mid-phase red-team pass per PHASE_B_PLAN §B.5 line 706
   │  • Macro-phase cadence red-team per MACRO_PLAN §IS.8 (b) — B.5 phase close
   │                                                                       │
   └────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
   ┌────────────── B.6 Session 1 (Exec_12): Hybrid Retrieval Library ───┐
   │                                                                       │
   │  Inputs:
   │  • Full graph (1735+ nodes, 3814+SUPPORTS+CONTRADICTS edges)
   │  • Vertex embeddings (977 chunks)
   │  • Full discovery registers (Patterns / Resonances / Contradictions / Clusters)
   │  • Mode-routing requirement per OBS.3 (KR-3 implication)
   │
   │  Outputs:
   │  • rag/retrieve.py — vector + BM25 + graph-walk + RRF + reranker + layer-balance
   │  • TypeScript shim platform/src/lib/rag/retrieveClient.ts
   │  • Golden retrieval set (20 seed queries) — verification_artifacts/RAG/retrieval_golden_v1_0.json
   │  • Acceptance: precision@10 ≥0.7, recall@10 ≥0.6
   │  • M2B CLOSED                                                          │
   │                                                                       │
   └───────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          M2C (B.7 Router + B.8 Synthesis + ...)
```

---

## §RISKS — Risks and Sequencing Constraints

### B.4 Task 3 SUPPORTS Risks (Exec_7)

- **R.B4.S.1 — UCN section ID format ambiguity.** PHASE_B_PLAN §B.4 Task 3 spec says "signal → UCN section" but does not specify a stable section ID format. The ucn_section chunker produces 25 chunks for ~41 sections (Part-level boundary collapsing). **Mitigation:** Brief §AC.5 directs executor to inventory `rag_chunks` for `doc_type='ucn_section'`, derive a stable `UCN.SEC.<part>.<section>` ID format from the chunk metadata (chunkers already record section heading), and persist the logical-ID → chunk_id mapping in `verification_artifacts/RAG/ucn_section_node_map.json`. The Gemini prompt emits stable IDs; reconciler maps to chunk_ids.
- **R.B4.S.2 — L3 evidence-chain false positives.** Reconciler's "grep both signal_id and ucn_heading within 100-line window in L3 file" check may hit on incidental co-occurrence rather than narrative chain. **Mitigation:** sha256 anchoring in the executor's grep + manual review on the first batch (executor flags MED-confidence proposals for native review before bulk acceptance).
- **R.B4.S.3 — L3 zero-supports outcome.** Some L3 reports (e.g., REPORT_TRAVEL_v1_1 — historically the lowest signal-citation density) may produce zero SUPPORTS in Pass-1. **Mitigation:** Brief §AC.8 halt-and-surface; native decision (re-run focused batch vs. accept gap as DIS.class.l3_zero_supports). Default: re-run.

### B.4 Task 3 CONTRADICTS Risks (Exec_8)

- **R.B4.C.1 — Inverted two-pass ordering.** §E.5: CONTRADICTS is Claude → Gemini (Claude high-recall, Gemini filter). This is structurally different from SUPPORTS (Gemini → Claude). The executor must build Claude-side hypothesis generation (invariant scan + textual tension surfaces) then prompt Gemini for accept/reject — not run a Gemini Pass-1 then reconcile. **Mitigation:** B.4 CONTRADICTS brief (authored at Cowork pre-Exec_8) specifies the inverted flow explicitly; existing reconciler scaffold (Exec_7's cgm_supports_reconciler.py) is NOT reusable as-is; new `cgm_contradicts_pass1.py` (Claude-side hypothesis generator) + `cgm_contradicts_reconciler.py` (Gemini-side challenger pass adjudicator).
- **R.B4.C.2 — Possible zero CONTRADICTS.** The chart may legitimately produce zero contradictions if the corpus is internally coherent. PHASE_B_PLAN §B.4 acceptance is process-gate (every Claude proposal has ledger event) not count-gate, so zero-contradictions does NOT block B.4 close. But B.5's CONTRADICTION_REGISTER §B.5 acceptance demands ≥5 contradictions — meaning B.4's zero-CONTRADICTS scenario forces B.5 to do the heavy lifting. **Mitigation:** Brief notes B.4 CONTRADICTS is high-recall (Claude proposes liberally per Pass-1 mandate); B.5 contradiction scan (PHASE_B_PLAN §B.5 line 674) re-runs broader.
- **R.B4.C.3 — Rahu-as-PK class candidates.** PHASE_B_PLAN §B.5 line 676 calls out Rahu-as-PK as a specific candidate class for contradictions. Whether this surfaces at B.4 (graph-edge level) or B.5 (register-entry level) is a scope question. **Mitigation:** Brief allows B.4 to surface Rahu-as-PK candidates as graph edges; B.5 elaborates them as register entries with full mechanism.

### B.5 Discovery Engine Risks (Exec_9–Exec_11)

- **R.B5.1 — Reconciler context overrun.** PHASE_B_PLAN §E.7 + line 269: "B.4/B.5 reconciler input context at 8K–10K tokens for complex patterns (not the 4K profile used in B.3.5/edge work); this raises effective reconciler cost by ~62%." **Mitigation:** $315 budget per §E.7 (+75% buffer); per-batch acceptance-rate monitoring per PHASE_B_PLAN §B.5 line 692; emit `[ACCEPTANCE_RATE_ANOMALY]` if rate <15% or >80%.
- **R.B5.2 — Mid-phase eval seed-recall failure.** PHASE_B_PLAN §B.5 mid-phase gate: seed recall must be ≥0.8 on 5 seeds before proceeding. If retrieval is bad, halt and fix retrieval BEFORE proceeding to bulk pattern mining. **Mitigation:** B.5 Session 1 brief structures Task 0 + 5 seed authoring + initial 5-pattern validation before mid-phase eval gate; halt-and-surface if seed recall <0.8.
- **R.B5.3 — P6 degraded mode resolution.** PHASE_B_PLAN §H + line 257 + line 848: P6 (UCN-vs-L3 consistency) operates in degraded mode through B.4; B.5 must do retroactive review before CONTRADICTION_REGISTER closes. The degraded-mode count tracked at phase close. **Mitigation:** B.5 Session 3 brief includes a P6 retroactive sweep over all `[P6_UNCHECKED]` events in the ledger; a non-zero count without resolution blocks B.5 phase close.
- **R.B5.4 — Forward-looking-claim P8 enforcement.** PHASE_B_PLAN §B.5 line 660 + 688: P8 validator extension fires "no falsifier → cannot be classified forward-looking". Ensures every prediction carries `falsifier_conditions`. **Mitigation:** B.5 Session 1 brief gates the P8 implementation as a pre-mining requirement (Task 0).
- **R.B5.5 — Cluster annotation embedding-space mismatch.** PHASE_B_PLAN §B.5 line 682: "KMeans/HDBSCAN over Voyage embeddings of L2.5 signal chunks only." But the embedding model is now Vertex AI text-multilingual-embedding-002 (B.3 swap). Voyage clusters would be on a different space than retrievable chunks. **Mitigation:** B.5 Session 2 brief uses Vertex embeddings for clustering; PHASE_B_PLAN §B.5 line 682 wording updated only at B.5 brief authoring (the brief acknowledges the swap; PHASE_B_PLAN itself is frozen at v1.0.3 — no inline edit).

### B.6 Hybrid Retrieval Library Risks (Exec_12)

- **R.B6.1 — Reranker model selection.** PHASE_B_PLAN §B.6 specs Voyage rerank but B.3 swapped to Vertex. **Mitigation:** Brief allows native Vertex reranker if available (preferred); fallback: cross-encoder over Vertex top-50. NO embedding-model swap.
- **R.B6.2 — Mode-routing ambiguity for hybrid retrieval.** KR-3 implication (cgm_node NL rank 7) means structured queries should route to graph-walk preferentially; NL-interpretive queries to vector + UCN. The router (B.7) does final routing, but B.6 must expose the retrieval modes and let the router select. **Mitigation:** Brief specifies multi-mode `retrieve(query: str, mode: Literal['vector', 'bm25', 'graph_walk', 'hybrid_rrf', 'auto'])` API surface.
- **R.B6.3 — Layer-balance invariant evaluation.** PHASE_B_PLAN §B.6 acceptance: "Layer balance invariant holds." This requires a retrieval bundle to draw from L1+L2.5+L3 in balanced proportion (per PROJECT_ARCHITECTURE §H.4 Whole-Chart-Read). **Mitigation:** Brief includes layer-balance check in the golden retrieval set; ≥1 chunk from each of {l1_fact, msr_signal, ucn_section, domain_report, cgm_node} in every interpretive bundle.

### Red-Team Probes for M2B-Exec Sessions

Per PHASE_B_PLAN §G B.10 + MACRO_PLAN §IS.8, the standing 6 red-team probes apply. M2B-specific probes per session-cadence (every 3rd session) + phase-close:

- **RT.M2B.1 — Mirror desync after FILE_REGISTRY bump.** After every FILE_REGISTRY version bump (expected v1.7 at Exec_7, v1.8+ as new artifacts register), `mirror_enforcer.py` exits 0 on MP.5 with the new path block.
- **RT.M2B.2 — Stale L3 propagation in graph.** No SUPPORTS or CONTRADICTS edge points to a chunk from a SUPERSEDED L3 report (v1.0). Verified via SQL: `SELECT count(*) FROM rag_graph_edges WHERE edge_type IN ('SUPPORTS','CONTRADICTS') AND target_node_id IN (SELECT id FROM rag_chunks WHERE doc_type='domain_report' AND is_stale=true);` must equal 0.
- **RT.M2B.3 — Ledger event coverage.** Every persisted SUPPORTS / CONTRADICTS edge in `rag_graph_edges` has a corresponding `claude_reconcile_accept` event in `two_pass_events.jsonl`. Verified via SQL JOIN.
- **RT.M2B.4 — Prompt registry synchrony.** Every prompt referenced in any ledger event resolves to a CURRENT entry in `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` with matching hash.
- **RT.M2B.5 — Pattern register two-pass trail.** Every PATTERN_REGISTER entry has a complete two-pass ledger trail: gemini_proposal → claude_reconcile_* events resolvable by `pattern_id`.
- **RT.M2B.6 — Discovery-engine seed recall.** B.5 mid-phase gate seed_set recall ≥0.8 (5 seeds); if drift to <0.8 at later session, halt and fix retrieval before proceeding.

---

## §PLAN — Sub-Phase Execution Plan

### §PLAN.B4_S1 — Phase B.4 Session 1 of 2 (Exec_6 — DONE)

**Status.** CLOSED at Madhav_M2A_Exec_6 (2026-04-26). Recorded retroactively for completeness.

**Deliverables produced (verified at Exec_6 close):**
- `rag/graph.py` full implementation
- `cgm_edges_manifest_v1_0.json` (22 reconciled CGM edges)
- `CGM_v9_0.md` frontmatter amendment (manifest pointer + edge_count_reconciled:22)
- `FILE_REGISTRY_v1_6.md`
- `rag_graph_nodes`=1735, `rag_graph_edges`=3814 (3792 deterministic + 22 reconciled)
- `chunk.py` doc-type 6 activated; 234 cgm_node chunks ingested + embedded; HNSW p95=96.8ms
- KR-1 CLOSED, KR-2 CLOSED, KR-3 NEW (by_design)
- `verification_artifacts/RAG/{graph,b4_edge_count,b4_node_count,b4_sanity_test,kr1_kr2_db_verification,cgm_chunks_ingestion_report}.json`

**Acceptance.** All 19 ACs of `Madhav_M2A_Exec_6` brief PASS. CLAUDECODE_BRIEF.md status: COMPLETE.

---

### §PLAN.B4_TASK3_SUPPORTS — Phase B.4 Task 3 SUPPORTS (Exec_7)

**Brief.** `CLAUDECODE_BRIEF.md` (this Cowork session's primary deliverable; sibling to this plan).

**Objective.** Run Gemini→Claude two-pass for SUPPORTS edges. Produce `cgm_supports_edges_v1_0.md` prompt; native runs against Gemini; Claude reconciler validates with P1/P2/P5 + L3-chain check; persist accepted to `rag_graph_edges`. Author minimal `rag/ledger.py` implementation. Register prompts.

**Tasks.** AC.0 pre-flight; AC.1 ledger.py; AC.2 prompt registry; AC.3 SUPPORTS prompt; AC.4 Gemini batch (native action); AC.5 reconciler; AC.6 persist; AC.7 b4_supports_count.json; AC.8 L3 acceptance gate; AC.9 graph re-export; AC.10 governance scripts; AC.11 CURRENT_STATE; AC.12 SESSION_LOG; AC.13 GCS upload; AC.14 mirror updates.

**Two-pass ordering.** Gemini → Claude per §E.5.

**Acceptance criteria.** Per CLAUDECODE_BRIEF.md §5 (14 ACs). Phase-level: ≥1 SUPPORTS per CURRENT v1.1 L3 report (9 minimum); zero dangling edges; ledger event for every Gemini proposal; INDEX.json carries v1.1 + new v1.0 entries.

**Cost.** ~$5 (one Gemini batch, possibly nine sub-batches per L3 report). **Velocity.** 1 session.

**Stop-markers.** `[L1_REFERENCE_UNRESOLVED]`, `[GRAPH_DANGLING_EDGE]`, `[L3_ZERO_SUPPORTS]` (NEW class — see §RISKS R.B4.S.3).

---

### §PLAN.B4_TASK3_CONTRADICTS_AND_CLOSE — Phase B.4 Task 3 CONTRADICTS + B.4 phase final close (Exec_8)

**Brief.** Authored by Cowork pre-Exec_8 per the post-Exec_7 handoff in `CLAUDECODE_BRIEF.md §10`.

**Objective.** Run Claude→Gemini inverted two-pass for CONTRADICTS edges. Author `cgm_contradicts_edges_v1_0.md` (Claude-authored prompt for Gemini's challenger pass). Claude generates contradiction hypotheses from invariant scan + textual tension; Gemini accepts/rejects with rationale; persist to `rag_graph_edges`. Re-run B.4 acceptance with both SUPPORTS and CONTRADICTS present; B.4 phase final close.

**Tasks.**
1. Author Claude-side `cgm_contradicts_pass1.py` — generates contradiction hypotheses by: (a) running `p1_layer_separation` over the chunk set and flagging cross-layer drift; (b) running `p6_uvc_consistency` (B.5 deliverable; pre-emptive minimal impl needed for B.4 — surface as B.4 scope creep similar to ledger.py at Exec_7) over UCN claims vs. L3 narratives; (c) Rahu-as-PK class candidates per PHASE_B_PLAN §B.5 line 676.
2. Author `cgm_contradicts_edges_v1_0.md` Gemini-side challenger prompt (ROLE: Critical Reviewer; TASK: accept/reject Claude's contradiction proposals with rationale).
3. Native runs prompt against Gemini; commits raw response.
4. `cgm_contradicts_reconciler.py` reads Gemini's accept/reject; persists accepted CONTRADICTS to `rag_graph_edges`; appends two-pass ledger events (Claude-proposal + Gemini-accept/reject).
5. Register both new prompts in INDEX.json.
6. Re-export graph.json with full edge set; refresh b4_edge_count.json; author b4_contradicts_count.json.
7. **B.4 phase final close.** Update CURRENT_STATE: `active_phase_plan_sub_phase` → `"B.4 complete (Tasks 1+2+3+4+5; full Task 3 SUPPORTS+CONTRADICTS)"`; `next_session_objective` → B.5 Session 1.
8. Macro-phase cadence red-team per `MACRO_PLAN §IS.8 (b)` — B.4 phase close fires the red-team prompt regardless of session counter.

**Two-pass ordering.** Claude → Gemini per §E.5 (inverted from SUPPORTS).

**Acceptance criteria.**
- Process gate: every Claude-proposed CONTRADICTS edge has a `claude_proposal` ledger event + `gemini_challenge_accept` or `gemini_challenge_reject` event with `gemini_response_ref`.
- Count gate: zero count-gated; CONTRADICTS may legitimately be zero (per R.B4.C.2).
- B.4 phase final acceptance per PHASE_B_PLAN §B.4: node count = chunks + unique fact_ids + unique signal_ids + 9 domains + ucn_section nodes; deterministic edges ≥ baseline_edge_count (957); SUPPORTS ≥1 per L3 report (from Exec_7); CONTRADICTS process gate (this session); zero dangling edges; ledger covers every two-pass event.
- Red-team: MACRO_PLAN §IS.8 (b) macro-phase cadence — 6 red-team probes (RT1–RT6 from §B.10 + RT.M2B.1–RT.M2B.6 from §RISKS) PASS.

**Cost.** ~$10 (Gemini challenger pass + Claude P1/P6 invariant compute). **Velocity.** 1 session.

**Stop-markers.** `[CONTRADICTS_LEDGER_GAP]` if any persisted CONTRADICTS edge lacks ledger trail; `[REDTEAM_FAIL]` if any RT.M2B probe fails.

---

### §PLAN.B5_S1 — Phase B.5 Session 1 of 3 (Exec_9): Setup + Pattern Mining

**Brief.** Authored by Cowork pre-Exec_9.

**Objective.** Pre-mining setup (Task 0): implement `prediction_ledger.py`, P7 + P8 validator extensions, `ledger.get_acceptance_rate()`, batch_acceptance_rates.json initialization, 5 seed known facts. Begin pattern mining with first 5 patterns through reconciler. Mid-phase gate (seed recall ≥0.8 on 5 seeds) before bulk mining.

**Tasks (per PHASE_B_PLAN §B.5):**
0. **Task 0 (pre-mining gate):** prediction_ledger.py impl; P7/P8 validator extensions; pytest passing; batch_acceptance_rates.json initialized; 5 seed facts in `discovery_sanity_seed_set_v1_0.json`.
1. Enumerate candidate pattern seeds from the graph (signal co-occurrence sets, domain-spanning subgraphs, dasha-windowed signal clusters). NEW: leverage SUPPORTS edges for seed enumeration (signal co-occurrence within an L3 narrative chain is a strong seed).
2. Author `pattern_mining_v1_0.md` Gemini Pass-1 prompt; native runs.
3. Claude Pass-2 reconciler on first 5 patterns.
4. Mid-phase eval: `rag/eval/run_eval.py --mode=discovery_sanity --seed_set=5` → seed recall ≥0.8 OR halt-and-fix.
5. Continue pattern mining toward 20-pattern target; emit batch acceptance-rate logs.
6. Author PATTERN_REGISTER_v1_0.md + .json with at least 10 patterns by Exec_9 close (remaining 10+ slip to Exec_10/11 if cost-bound).

**Two-pass ordering.** Gemini → Claude per §E.5.

**Acceptance criteria.**
- Task 0 deliverables in place; pytest passing.
- 5 seed facts authored.
- Mid-phase eval seed_recall ≥0.8.
- ≥10 patterns in PATTERN_REGISTER (interim target; full ≥20 by B.5 close).
- Acceptance rates logged every batch; `[ACCEPTANCE_RATE_ANOMALY]` not fired.
- Every pattern has complete two-pass ledger trail.

**Cost.** ~$15. **Velocity.** 1 session.

**Stop-markers.** `[SEED_RECALL_FAIL]` (mid-phase eval fail); `[ACCEPTANCE_RATE_ANOMALY]` (rate <15% or >80%); `[PREDICTION_NO_FALSIFIER]` (P8 fail).

---

### §PLAN.B5_S2 — Phase B.5 Session 2 of 3 (Exec_10): Pattern top-off + Resonance walk

**Brief.** Authored by Cowork pre-Exec_10. *[Amended in-place 2026-04-27 per native shaping choice Q3 — cluster annotation deferred to §PLAN.B5_S3; see changelog.]*

**Objective.** Pattern top-off (PATTERN_REGISTER toward ≥20 total) + Resonance walk (RESONANCE_REGISTER ≥10). Cluster annotation deferred to §PLAN.B5_S3 per native shaping choice 2026-04-27 Q3 (Cowork brief Madhav_M2A_Exec_10 AC.3).

**Tasks.**
1. Continue pattern mining — top off PATTERN_REGISTER toward ≥20 total (Exec_9 closed at 11; need ≥9 new patterns). Batches 4–6 with Gemini Pass-1 (hard-locked per Q1).
2. Acceptance-rate logging for all new pattern batches; hard-halt on first anomaly per Q2.
3. Author `resonance_walk_v1_0.md` Gemini prompt.
4. Build RESONANCE_REGISTER_v1_0.md + .json (≥10 resonances). Resonance batches 1–3 with Gemini Pass-1.
5. ~~**Cluster annotation** (DEFERRED to §PLAN.B5_S3 per Q3).~~
6. ~~Author `cluster_annotation_v1_0.md` Gemini prompt (DEFERRED to §PLAN.B5_S3).~~
7. ~~Build CLUSTER_ATLAS_v1_0.md + .json (DEFERRED to §PLAN.B5_S3).~~
8. Acceptance-rate logging for resonance batches; hard-halt on first anomaly per Q2.

**Two-pass ordering.** Gemini → Claude per §E.5 (both pattern and resonance). Pass-1 actor HARD LOCKED to Gemini for all Exec_10 batches (Q1 decision 2026-04-27).

**Acceptance criteria.**
- ≥20 total patterns (PAT.001–PAT.020+).
- ≥10 resonances (RES.001–RES.010+).
- All Gemini batches have acceptance-rate within [15%, 80%] OR first anomaly halted + DR opened + native restart logged.
- Every pattern + resonance has complete two-pass ledger trail.
- Every new entry has `pass_1_actor: "gemini"`.

**Cost.** ~$25. **Velocity.** 1 session.

---

### §PLAN.B5_S3 — Phase B.5 Session 3 of 3 (Exec_11): Cluster annotation + Contradiction register + B.5 close + red-team

**Brief.** Authored by Cowork pre-Exec_11. *[Amended in-place 2026-04-27 per native shaping choice Q3 — cluster annotation tasks (5, 6, 7) inserted from §PLAN.B5_S2; see changelog.]*

**Objective.** Cluster annotation (deferred from §PLAN.B5_S2) + Contradiction scan → CONTRADICTION_REGISTER + Mid-phase B.5 red-team + Macro-phase cadence red-team + B.5 phase final close. Also includes PAT.005–PAT.011 Gemini re-validation pass (Exec_9 carry-forward per Q1).

**Tasks.**
1. **Pattern/Resonance top-off (if needed):** if Exec_10 closed with <20 patterns or <10 resonances, run additional batches until phase-close bars are met.
2. **PAT.005–PAT.011 Gemini re-validation pass.** Per Q1 lock + Exec_9 carry-forward (1): run each of the 7 claude_self patterns through Gemini Pass-1 (seed reconstructed from signals_referenced + mechanism); append Gemini Pass-1 event_id to ledger_event_ids. If any fails Gemini re-validation, open DR for native decision.
3. **Cluster annotation:** KMeans/HDBSCAN over **Vertex embeddings** (per OBS.3 / R.B5.5 — Voyage spec in PHASE_B_PLAN §B.5 line 682 superseded by B.3 embedding swap). Filter to MSR signal chunks only. Gemini Pass-1 annotates per §E.4 prompt; Claude Pass-2 validates.
4. Author `cluster_annotation_v1_0.md` Gemini prompt.
5. Build CLUSTER_ATLAS_v1_0.md + .json (≥10 clusters).
6. **Contradiction scan:** Claude's invariant scanner runs P1/P2/P5 across all chunks → contradiction flags. Compares L3 domain claims against UCN for P6 conflicts (P6 retroactive review per R.B5.3). Rahu-as-PK class candidates surfaced.
7. Gemini Pass-1 (challenger pass for B.5 — note this is consistent with B.4 CONTRADICTS Claude→Gemini flow; B.5 contradictions extend the B.4 set with full register entries). Per §E.5: Contradictions = Claude → Gemini; Reconciliations = Gemini → Claude.
8. For each Gemini-proposed reconciliation, Claude validates.
9. Author CONTRADICTION_REGISTER_v1_0.md + .json (≥5 contradictions).
10. Mid-phase red-team per PHASE_B_PLAN §B.5 line 706.
11. Final B.5 acceptance check: ≥20 patterns, ≥10 resonances, ≥5 contradictions, ≥10 clusters; every entry has complete two-pass trail; every forward-looking claim has prediction_ledger row; zero validated entries violate any P1–P9; 100% structurally reproducible per §E.9.
12. Macro-phase cadence red-team per MACRO_PLAN §IS.8 (b) — B.5 phase close fires the red-team prompt. Also fires every-third-session cadence (counter reaches 3 at Exec_11 close) — COMBINED artifact RED_TEAM_M2B_PHASE_B5_v1_0.md.
13. **B.5 phase final close.** Update CURRENT_STATE: `active_phase_plan_sub_phase` → `"B.5 complete"`; `next_session_objective` → B.6.

**Two-pass ordering.** Mixed per §E.5.

**Acceptance criteria.**
- B.5 acceptance per PHASE_B_PLAN §B.5 line 698-704.
- Both red-team passes (mid-phase + macro-phase) PASS.
- P6 retroactive sweep: zero unresolved `[P6_UNCHECKED]` events.

**Cost.** ~$15. **Velocity.** 1 session.

**Stop-markers.** `[CONTRADICTION_COUNT_BELOW_5]` (full B.5 acceptance fail); `[P6_RESIDUE]` (unresolved P6 events); `[REDTEAM_FAIL]`.

---

### §PLAN.B6_S1 — Phase B.6 Hybrid Retrieval Library (Exec_12)

**Brief.** Authored by Cowork pre-Exec_12.

**Objective.** Build the retrieval library that the discovery engine (re-run) and the thin query UI consume. Exposes Python lib + TypeScript shim. Mode-routing per OBS.3 implication.

**Tasks.**
1. `platform/python-sidecar/rag/retrieve.py` — multi-mode retrieve:
   - `vector` mode: Vertex embeddings + HNSW search.
   - `bm25` mode: BM25 over chunk text (sklearn or rank_bm25).
   - `graph_walk` mode: NetworkX traversal over rag_graph; expand from seed nodes; rank by reverse-BFS depth.
   - `hybrid_rrf` mode: Reciprocal Rank Fusion combining vector + BM25 + graph_walk.
   - `auto` mode: heuristic mode-selection by query shape (preview of B.7 router, internal-only).
2. **Reranker:** per R.B6.1 — native Vertex reranker if available; else cross-encoder over Vertex top-50.
3. **Layer-balance enforcer:** every interpretive bundle includes ≥1 chunk from each of {l1_fact, msr_signal, ucn_section, domain_report, cgm_node}.
4. **Whole-Chart-Read invariant:** interpretive_* class queries (preview of B.7 plan taxonomy) auto-include UCN + CDLM chunks.
5. TypeScript shim `platform/src/lib/rag/retrieveClient.ts` — calls FastAPI endpoint.
6. Golden retrieval set: `verification_artifacts/RAG/retrieval_golden_v1_0.json` — 20 seed queries with expected top-10 chunk IDs.
7. Eval: precision@10 ≥0.7, recall@10 ≥0.6 on the golden set.

**Two-pass ordering.** None — deterministic retrieval code. Eval-set tests are single-pass QA per PHASE_B_PLAN §B.6 line 718.

**Acceptance criteria.**
- precision@10 ≥0.7, recall@10 ≥0.6 on 20 golden queries.
- Layer-balance invariant: 100% of interpretive bundles satisfy.
- Mode-routing functional: each mode returns valid bundles; `auto` mode shows correct mode-selection on 5 sample queries (manual review).
- KR-3 mitigation visible: structured queries route to `graph_walk` preferentially; cgm_node chunks rank in top-5 for chart-state queries.

**Cost.** ~$2. **Velocity.** 1 session.

**Stop-markers.** `[RETRIEVAL_PRECISION_FAIL]` (precision@10 <0.7); `[RETRIEVAL_RECALL_FAIL]` (recall@10 <0.6); `[LAYER_BALANCE_VIOLATION]`.

---

## §AC — Consolidated Acceptance Criteria (M2B-level)

The M2B milestone is CLOSED when all of the following hold:

| ID | Criterion | Verification |
|---|---|---|
| M2B.AC.1 | B.4 Session 1 deliverables present | Exec_6 close artifacts (already verified at Exec_6 close) |
| M2B.AC.2 | B.4 SUPPORTS edges persisted; ≥1 per CURRENT v1.1 L3 report | `b4_supports_count.json` per-report tally |
| M2B.AC.3 | B.4 CONTRADICTS edges persisted (count not gated); ledger trail per edge | `b4_contradicts_count.json` + `two_pass_events.jsonl` JOIN |
| M2B.AC.4 | B.4 phase final close declared at Exec_8 | CURRENT_STATE active_phase_plan_sub_phase contains "B.4 complete" |
| M2B.AC.5 | B.5 ≥20 patterns + ≥10 resonances + ≥5 contradictions + ≥10 clusters | PATTERN/RESONANCE/CONTRADICTION/CLUSTER register `.json` count — cluster sub-target (≥10) AND contradiction sub-target (≥5) both verified at Exec_11 (per Q3 scope amendment 2026-04-27) |
| M2B.AC.6 | B.5 every entry has complete two-pass ledger trail; every forward-looking claim has prediction_ledger row | Ledger JOIN + P8 validator |
| M2B.AC.7 | B.5 phase final close at Exec_11 | CURRENT_STATE active_phase_plan_sub_phase contains "B.5 complete" |
| M2B.AC.8 | B.6 retrieval library precision@10 ≥0.7, recall@10 ≥0.6 on 20 golden queries | `retrieval_eval_v1_0.json` |
| M2B.AC.9 | B.6 layer-balance invariant: 100% interpretive bundles | `retrieval_eval_v1_0.json` layer_balance_pass field |
| M2B.AC.10 | M2B-cadence red-team probes RT.M2B.1–RT.M2B.6 PASS at applicable sessions | session red-team reports |
| M2B.AC.11 | Mirror discipline holds across all M2B sessions; mirror_enforcer exit 0 every close | per-session `mirror_reports/` |
| M2B.AC.12 | No FILE_REGISTRY desync between Claude side and Gemini L2.5 subset | session-close `mirror_enforcer` exit 0 |
| M2B.AC.13 | Build-state serializer + GCS upload succeeds at every session close | per-session `build_state_serialized` block; GCS HTTP/2 200 verification |

---

## §MANIFEST — Artifact Manifest

### B.4 Session 1 (Exec_6) — already produced

- `platform/python-sidecar/rag/graph.py`
- `035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json`
- `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` (frontmatter amended)
- `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md`
- `verification_artifacts/RAG/{graph,b4_edge_count,b4_node_count,b4_sanity_test,kr1_kr2_db_verification,cgm_chunks_ingestion_report}.json`
- `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` (KR-1/KR-2 CLOSED, KR-3 NEW)

### B.4 Task 3 SUPPORTS (Exec_7) — to produce

- `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_supports_edges_v1_0.md`
- `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_supports_batch<N>_raw.md` (one per batch)
- `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_supports_batch<N>_reconciled.md`
- `035_DISCOVERY_LAYER/cgm_supports_edges_manifest_v1_0.json`
- `platform/python-sidecar/rag/ledger.py` (replaces stub)
- `platform/python-sidecar/rag/reconcilers/cgm_supports_reconciler.py`
- `platform/python-sidecar/rag/reconcilers/__init__.py`
- `platform/python-sidecar/rag/tests/test_ledger.py`
- `06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl`
- `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json`
- `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` (updated with v1.1 + v1.0)
- `verification_artifacts/RAG/{b4_supports_count, ucn_section_node_map, b4_edge_count, graph}.json`
- `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` (bump from v1_6)
- Updates: `CURRENT_STATE`, `CANONICAL_ARTIFACTS`, `GOVERNANCE_STACK`, `SESSION_LOG`, `.geminirules`, `.gemini/project_state.md`

### B.4 Task 3 CONTRADICTS + close (Exec_8) — to produce

- `035_DISCOVERY_LAYER/PROMPTS/claude/cgm_contradicts_edges_v1_0.md` (Claude-authored prompt for Gemini's challenger)
- `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-XX-XX_B4_contradicts_batch<N>_raw.md`
- `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-XX-XX_B4_contradicts_batch<N>_reconciled.md`
- `035_DISCOVERY_LAYER/cgm_contradicts_edges_manifest_v1_0.json`
- `platform/python-sidecar/rag/reconcilers/cgm_contradicts_pass1.py`
- `platform/python-sidecar/rag/reconcilers/cgm_contradicts_reconciler.py`
- `platform/python-sidecar/rag/validators/p6_uvc_consistency.py` (minimal — full B.5)
- `verification_artifacts/RAG/{b4_contradicts_count, b4_edge_count, graph}.json`
- `verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B4_v1_0.md` (B.4 phase-close red-team)
- `00_ARCHITECTURE/FILE_REGISTRY_v1_8.md`

### B.5 Session 1 (Exec_9) — to produce

- `platform/python-sidecar/rag/prediction_ledger.py` (replaces stub)
- `platform/python-sidecar/rag/validators/{p7_significance,p8_falsifier}.py`
- `platform/python-sidecar/rag/tests/test_prediction_ledger.py`
- `verification_artifacts/RAG/discovery_sanity_seed_set_v1_0.json`
- `verification_artifacts/RAG/batch_acceptance_rates.json`
- `035_DISCOVERY_LAYER/PROMPTS/gemini/pattern_mining_v1_0.md`
- `035_DISCOVERY_LAYER/PATTERN_REGISTER_v1_0.{md,json}` (interim ≥10)
- `verification_artifacts/RAG/discovery_sanity_eval_v1_0.json`

### B.5 Session 2 (Exec_10) — to produce

- `035_DISCOVERY_LAYER/PROMPTS/gemini/resonance_walk_v1_0.md`
- `035_DISCOVERY_LAYER/PROMPTS/gemini/cluster_annotation_v1_0.md`
- `035_DISCOVERY_LAYER/RESONANCE_REGISTER_v1_0.{md,json}` (≥10)
- `035_DISCOVERY_LAYER/CLUSTER_ATLAS_v1_0.{md,json}` (≥10)
- `035_DISCOVERY_LAYER/PATTERN_REGISTER_v1_0.{md,json}` (extended toward 20)

### B.5 Session 3 (Exec_11) — to produce

- `035_DISCOVERY_LAYER/PROMPTS/claude/contradiction_scan_v1_0.md`
- `035_DISCOVERY_LAYER/CONTRADICTION_REGISTER_v1_0.{md,json}` (≥5)
- `verification_artifacts/RAG/RED_TEAM_M2B_MIDPHASE_B5_v1_0.md` (mid-phase)
- `verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B5_v1_0.md` (B.5 phase-close)
- `verification_artifacts/RAG/p6_retroactive_sweep_v1_0.json`

### B.6 Session 1 (Exec_12) — to produce

- `platform/python-sidecar/rag/retrieve.py`
- `platform/src/lib/rag/retrieveClient.ts`
- `verification_artifacts/RAG/retrieval_golden_v1_0.json`
- `verification_artifacts/RAG/retrieval_eval_v1_0.json`
- `verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B6_v1_0.md`

### Session-close artifacts (every M2B session)

- `00_ARCHITECTURE/{drift_reports, schema_reports, mirror_reports}/<session_id>_*.md`
- `00_ARCHITECTURE/SESSION_LOG.md` append (atomic)
- `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` state-block update
- `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` fingerprint rotations
- `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` amendment log
- `.geminirules` + `.gemini/project_state.md` mirror updates
- GCS build-state upload verification

---

## §SESSION_PACKAGING — Session Boundary Recommendations

### Recommended packaging: 7 sessions (1 done, 6 remaining)

| Session | Phase | Scope | Cost | Velocity |
|---------|-------|-------|------|----------|
| Exec_6 (DONE) | B.4 S1 | Tasks 1+2+4+5; KR-1/KR-2 close; cgm_node DB ingestion | $0 | 1 session |
| Exec_7 | B.4 Task 3 SUPPORTS | Gemini→Claude two-pass for SUPPORTS; ledger.py impl | $5 | 1 session |
| Exec_8 | B.4 Task 3 CONTRADICTS + close | Claude→Gemini for CONTRADICTS; B.4 phase final close; macro-cadence red-team | $10 | 1 session |
| Exec_9 | B.5 S1 | Setup (prediction_ledger, P7/P8); pattern mining first 5 + mid-phase eval; ≥10 patterns | $15 | 1 session |
| Exec_10 | B.5 S2 | Resonance walk; cluster annotation; pattern mining top-up | $25 | 1 session |
| Exec_11 | B.5 S3 + close | Contradictions; mid-phase red-team; B.5 phase final close + macro-cadence red-team | $15 | 1 session |
| Exec_12 | B.6 | Hybrid retrieval library; reranker; layer-balance; golden eval; M2B CLOSED | $2 | 1 session |

### Justification

- **Exec_7 / Exec_8 split.** B.4 Task 3 has SUPPORTS (Gemini→Claude) and CONTRADICTS (Claude→Gemini) sub-tasks with distinct two-pass orderings + scaffolds. Splitting keeps acceptance gates tight and blast-radius bounded if one half fails. Native scope decision in Cowork orchestration thread Madhav_M2A_Exec_7 (2026-04-26).
- **B.5 = 3 sessions per PHASE_B_PLAN.** §B.5 line 706 explicitly names 3 sessions including a mid-phase red-team. Pre-mining setup (Task 0) bundled into Session 1 to avoid a separate "setup-only" session.
- **B.6 = 1 session per PHASE_B_PLAN.** §B.6 line 722 affirms 1 session at $2 cost. Deterministic; no two-pass overhead.
- **Cost vs. PHASE_B_PLAN forecast.** PHASE_B_PLAN §E.7 budgets B.4=$19.50, B.5=$55, B.6=$2 — total $76.50. M2A actual was well under forecast ($0–5 vs. $20). M2B forecast: $72 (modest). Buffer: +75% per §E.7 reconciler-overrun clause → up to $130 cap. Stop-marker fires if any phase exceeds forecast +20%.
- **Red-team cadence.** Counter trajectory: 1 (post-Exec_6) → 2 (Exec_7) → 3 → fires at Exec_8 (also macro-phase cadence) → 0 → 1 (Exec_9) → 2 (Exec_10) → 3 → fires at Exec_11 (also macro-phase cadence) → 0 → 1 (Exec_12). Every M2B session is covered by either session-cadence or macro-phase-cadence red-team.
- **Mirror discipline.** Touched at every close per the mirror_pair_touches_during_m2b frontmatter clause. No mirror desync across M2B is the M2B.AC.11 acceptance.

### Alternative packagings (rejected)

- **6 sessions** (B.4 Task 3 in single session) — rejected per native scope decision; SUPPORTS+CONTRADICTS scaffolds too divergent for one-session bundle without tail risk.
- **8 sessions** (split B.5 S1 into setup-only + first-5-mining) — rejected; pre-mining setup is small enough to bundle with first 5 patterns; mid-phase eval gate naturally divides the session.

---

## §APPENDIX — Reference glossary

- **SUPPORTS edge.** `signal → UCN section` graph edge expressing "this MSR signal provides evidence for this UCN claim, as demonstrated by an L3 narrative chain." Two-pass: Gemini → Claude per §E.5.
- **CONTRADICTS edge.** `chunk → chunk` graph edge expressing textual tension between two corpus claims. Two-pass: Claude → Gemini per §E.5 (inverted ordering).
- **L3 evidence chain.** A passage in an L3 v1.1 report that cites both an MSR signal and a UCN section in the same narrative argument. Reconciler verifies via co-occurrence within a 100-line window.
- **Layer-balance invariant.** Every interpretive retrieval bundle draws from L1 + L2.5 + L3 in non-zero proportion. Enforced at B.6.
- **Whole-Chart-Read invariant.** Interpretive queries auto-include UCN + CDLM chunks. Enforced at B.7 (preview at B.6).
- **KR-3.** cgm_node chunks rank 7 in NL semantic search but rank 1 in structured retrieval. Status: by_design. Shapes B.6 mode-routing.

---

---

## §CHANGELOG

| Version | Date | Session | Change |
|---|---|---|---|
| v1.0 (initial) | 2026-04-26 | Madhav_M2A_Exec_7 Cowork authoring | Initial M2B exec plan covering B.4_full, B.5 (3 sessions), B.6 (1 session). |
| v1.0 amended in-place | 2026-04-27 | Madhav_M2A_Exec_10 | Native shaping choice Q3 (Cowork brief AC.3): cluster annotation deferred from §PLAN.B5_S2 to §PLAN.B5_S3. §PLAN.B5_S2 objective updated to "Pattern top-off + Resonance walk"; tasks 5–7 (cluster annotation) struck out and moved to §PLAN.B5_S3 as tasks 3–5. §PLAN.B5_S3 renamed to include "Cluster annotation"; PAT.005–PAT.011 Gemini re-validation pass added as task 2. M2B.AC.5 verification-target column updated: cluster + contradiction sub-targets explicitly verified at Exec_11. Additive amendment; no version bump. Authoritative sibling reference for Exec_10 + Exec_11 reflects new scope shape. |

---

*End of M2B_EXEC_PLAN_v1_0.md. Ready for executor consumption from Madhav_M2A_Exec_7 forward. Per-session CLAUDECODE_BRIEF.md authored by Cowork is the executor's contract; this plan is the multi-session ground truth.*
