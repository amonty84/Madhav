---
artifact: CURRENT_STATE_v1_0.md
version: 1.0
status: LIVE
produced_during: STEP_10_SESSION_LOG_SCHEMA (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
authoritative_side: claude
role: >
  Machine-readable, single-file "you-are-here" pointer for the MARSYS-JIS project. Answers —
  in one grep — the question a fresh session asks: which macro-phase is active, which
  phase-plan row is in flight, which governance step is ready, which session last closed,
  and what the next session is committed to. Updated at every session close.
implements: >
  GROUNDING_AUDIT_v1_0.md GA.19 (you-are-here marker, full-surface layer — Step 0 installed
  a minimal STEP_LEDGER pointer; Step 10 upgrades to this proper state file per §I.5 of the
  governance integrity protocol). Companion to SESSION_LOG_SCHEMA_v1_0.md which closes
  GA.17 + GA.18 at the entry-format layer.
supersedes: >
  The ad-hoc "you are here" prose previously living in CLAUDE.md §F and in
  `.gemini/project_state.md` §"Governance Rebuild In Progress". Those surfaces remain, but
  post-Step-10 they should CITE this file rather than DUPLICATE its fields. CLAUDE.md §F +
  §C item #8 are updated in this same Step 10 session with single-line pointers to this
  file (protocol §M.1 P5 minimal-edit rule). Full CLAUDE.md migration to cite-CURRENT_STATE-
  by-reference lands at Step 15 (GOVERNANCE_BASELINE_v1_0) close per the rebuild-era banner's
  "this banner is replaced with a steady-state pointer to CURRENT_STATE_v1_0.md" clause.
mirror_obligations:
  claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
  gemini_side: ".gemini/project_state.md — state-block + Governance Rebuild section reflect the same fields (MP.2 composite mirror)"
  mirror_mode: adapted_parity_state
  authoritative_side: claude
  mirror_pair_id: "MP.2 (composite — CURRENT_STATE joins SESSION_LOG + STEP_LEDGER + active plan pointers on the Claude side)"
  asymmetries: >
    Claude-side is a single canonical YAML block (this file's §2) plus a narrative §3.
    Gemini-side is free-form Gemini-idiom prose in .gemini/project_state.md §"Governance
    Rebuild In Progress" + §"Canonical Corpus State". Semantic parity, not byte-identity.
    Post-Step-15, both sides update their banners to reflect "rebuild closed"; this file
    remains LIVE while the project runs.
update_rules: >
  Every session-close checklist (SESSION_CLOSE_TEMPLATE_v1_0.md §2) updates this file as
  part of the atomic close. The close checklist's `current_state_updated: true` field
  affirms the update happened. Pre-Step-10 sessions carry `current_state_updated: n/a`
  per the template's rebuild-era convention; post-Step-10 sessions flip this to `true`.
  Post-Step-15, `step_ledger_updated` is dropped from the close-checklist; only
  `current_state_updated` remains as the state-transition field.
consumers:
  - CLAUDE.md §F + §C item #8 — cite this file as the primary you-are-here surface
  - .geminirules §F + §C item #8 (MP.1 mirror of the Claude-side citations)
  - .gemini/project_state.md — reflects CURRENT_STATE fields in Gemini-idiom prose (MP.2)
  - platform/scripts/governance/schema_validator.py — `validate_current_state()` added in
    Step 10 checks required fields present + cross-checks against STEP_LEDGER (during
    rebuild era) and SESSION_LOG (always)
  - platform/scripts/governance/drift_detector.py — verifies CURRENT_STATE fields agree
    with STEP_LEDGER's current `ready`/`in_progress` row and SESSION_LOG's latest
    `session_close.session_id`
  - Every session-close checklist from Step 10 onward
changelog:
  - v1.0 (2026-04-24, Step 10 of the Step 0 → Step 15 governance rebuild):
      Initial state file. §2 canonical state block (YAML) populated to reflect the moment
      of this Step 10 close: M2 paused, PHASE_B_PLAN v1.0.2 paused, Step 10 completed,
      Step 11 ready, last_session_id = STEP_10_SESSION_LOG_SCHEMA, next_session_objective
      = "Execute Step 11 — Learning Layer scaffold decision". §3 narrative supplements
      the YAML with the human-reading rationale. §4 update-rules spell out how subsequent
      sessions maintain the file. §5 disagreement-resolution rule names STEP_LEDGER as
      authoritative during the rebuild era; post-Step-15, THIS file is authoritative.
  - v1.0 amended-in-place (2026-04-24, Step 15 close — STEP_15_GOVERNANCE_BASELINE_CLOSE):
      State-block transition to GOVERNANCE_CLOSED. §2 YAML: active_governance_step → Step_15
      completed; active_macro_phase_status → active; active_phase_plan_version → 1.0.3
      (amendment cycle); next_governance_step → null; cross_check_authority → CURRENT_STATE;
      last_session_id → STEP_15_GOVERNANCE_BASELINE_CLOSE; next_session_objective →
      PHASE_B_PLAN v1.0.3 amendment. §3 narrative refreshed to reflect rebuild closed and M2
      active. §5.1 note updated to reflect §5.2 (CURRENT_STATE) now in force.
  - v1.0 amended-in-place (2026-04-27, Madhav_PORTAL_QUALITY_v0_1 — portal quality governance aside):
      last_session_id → Madhav_PORTAL_QUALITY_v0_1; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work).
      red_team_counter unchanged at 1 (governance aside — does NOT increment per ONGOING_HYGIENE_POLICIES §G).
      next_session_objective remains Madhav_M2A_Exec_10.
      Deliverables: 10 portal quality fixes across /build/* routes —
      (1) PlanTree.tsx statusDot: completed→emerald, unknown→muted/15;
      (2) PhaseGrid.tsx statusDot+statusBadge: completed→emerald;
      (3) naturalSort helper in format.ts + applied in PhaseGrid + PlanTree + activity/page;
      (4) derive.ts macroCompletionPercent: weights partial active macro via phaseCompletionPercent;
      (5) health/page.tsx: tri-state healthy/unhealthy/unknown badge;
      (6) serialize_build_state.py: workstreams derived from source (not hardcoded);
      (7) serialize_build_state.py: cowork_ledger reversed to newest-first + M2 milestone
          status rebuild after enrichment + _phase_id_sort_key comparison fix;
      (8) parallel/page.tsx: .reverse() removed;
      (9) FreshnessIndicator.tsx new component + layout.tsx footer;
      (10) AcCriteriaList/JourneyStrip/plan-phase page status colors → emerald canonical.
      lint=exit0, typecheck=0 new errors, naturalSort 6/6 PASS, serializer smoke exit0.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_M2A_Exec_10 close — B.5 Session 2 complete):
      active_phase_plan_sub_phase → "B.5 Session 2 complete (pattern top-off: 21 total patterns; resonance walk: 13 total resonances; cluster annotation deferred to Exec_11 per Q3)";
      last_session_id → Madhav_M2A_Exec_10; next_session_objective → Madhav_M2A_Exec_11
      (B.5 Session 3 — Cluster + Contradictions + B.5 Close + Red-team).
      Deliverables: PAT.012–PAT.022 (11 new patterns), RES.001–RES.009 (9 new resonances),
      M2B amendment applied (cluster-defer), AC.4 pass_1_actor backfill, AC.4.5 PRED.004 backfill,
      RESONANCE_REGISTER_v1_0 produced, prediction_ledger updated (PRED.011–014).
      Governance: drift=exit2 (59), schema=exit2 (61), mirror=exit0.
      build_state serialized + GCS upload 200. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-25, Madhav_M2A_Exec close — B.1 Ingestion complete):
      active_phase_plan_sub_phase → "B.1 complete"; last_session_id → Madhav_M2A_Exec;
      next_session_objective → Madhav_M2A_Exec_2 (B.2 doc-types 1–3). B.1 deliverables:
      models.py, ingest.py, P1/P2/P5 validators, STALENESS_REGISTER.md, ingestion_manifest.json
      (35 current docs, 499 signals). 6/6 AC-B1.x pass. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-25, Madhav_M2A_Exec_2 close — B.2 doc-types 1–3 populated):
      active_phase_plan_sub_phase → "B.2 partial — doc-types 1–3 populated";
      last_session_id → Madhav_M2A_Exec_2; next_session_objective → Madhav_M2A_Exec_3
      (B.2 doc-types 4–5 + doc-type 6 code + B.2 ACs). B.2 S1 deliverables:
      chunkers/__init__.py, msr_signal.py (499 chunks), ucn_section.py (25 chunks),
      cdlm_cell.py (81 chunks). DB totals: 605 rows in rag_chunks.
      Partial-progress targets all pass: msr_signal=499, ucn_section≥1 per Part, cdlm_cell=81.
      migration 005 applied to Supabase (pgvector + 8 tables + 9 indexes).
      mirror_enforcer.py exit 0 (8/8 pairs clean). §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-25, Madhav_M2A_Exec_3 close — B.2 complete):
      active_phase_plan_sub_phase → "B.2 complete";
      last_session_id → Madhav_M2A_Exec_3; next_session_objective → Madhav_M2A_Exec_4
      (B.3 Embedding + HNSW). B.2 S2 deliverables: l1_fact.py (102 L1 chunks),
      domain_report.py (52 L3 chunks; 16 stale from 4 stale reports), cgm_node.py
      (code only; FileNotFoundError guard for CGM_v9_0.md), chunk.py orchestrator.
      chunking_report.json: p1_violations=0, truncation_events=5. DB totals: 759 rows in
      rag_chunks. All 8 B.2 ACs pass. mirror_enforcer.py exit 0 (8/8 pairs clean).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-25, Madhav_M2A_Exec_4 close — B.3 complete):
      active_phase_plan_sub_phase → "B.3 complete";
      last_session_id → Madhav_M2A_Exec_4; next_session_objective → Madhav_M2A_Exec_5
      (B.3.5 CGM Rebuild + red-team RT1–RT6). GCP migration: Cloud SQL + Vertex AI
      text-multilingual-embedding-002 (768-dim); Voyage AI removed; BATCH_SIZE=10.
      743/743 non-stale chunks embedded. HNSW m=16 ef_construction=64.
      b3_sanity_test.json: "Saturn 7th house Libra" → 2 distinct doc_types (AC-B3.4 ✓);
      p95=71.56ms Auth Proxy overhead (AC-B3.3 accepted Option A).
      mirror_enforcer.py exit 0 (8/8 pairs clean). §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_BUILD_TRACKER_INTEGRATION_v0_1 — governance aside):
      last_session_id → Madhav_BUILD_TRACKER_INTEGRATION_v0_1; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (B.3.5 complete; governance aside, no M2 corpus work).
      red_team_counter unchanged at 0 (governance aside — not a red-team session).
      next_session_objective remains Madhav_M2A_Exec_6.
      Deliverables: serialize_build_state.py, build_state.schema.json, build_state.example.json,
      SESSION_CLOSE_TEMPLATE extended (§2 + §5 + §6 build_state_serialized block),
      ONGOING_HYGIENE_POLICIES extended (§O policy + §J index row),
      FILE_REGISTRY_v1_5 §9.7 added. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_M2A_Exec_5 close — B.3.5 CGM Rebuild + red-team):
      active_phase_plan_sub_phase → "B.3.5 complete (Gemini two-pass pending native action)";
      last_session_id → Madhav_M2A_Exec_5; next_session_objective → B.4 RAG Query Engine +
      Gemini two-pass carry-forward. M2A Foundation Stack: 5/5 sessions done.
      Deliverables: CGM_v9_0.md (234 nodes), FILE_REGISTRY_v1_5, cgm_edge_proposals_v1_0.md
      (registered), RED_TEAM_M2A_v1_0.md (RT1–RT6 PASS, 2 known_residuals).
      red_team_counter reset to 0 (cadence fired — RT1–RT6 all pass at B.3.5 close per
      MACRO_PLAN §IS.8 cadence clause (a): every third session).
      CANONICAL_ARTIFACTS CGM row rotated v2.0→v9.0; FILE_REGISTRY row rotated v1.4→v1.5.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_M2A_Exec_5 reconciler continuation — AC-B3.5.6 close):
      active_phase_plan_sub_phase → "B.3.5 complete (AC-B3.5.6 SATISFIED)".
      AC-B3.5.6 SATISFIED: 27 Gemini-proposed edges reconciled — 10 accepted as-is, 15 rejected
      (P2 violations from PROMPT_P2_VIOLATION in cgm_edge_proposals_v1_0.md INPUT DATA), 11
      corrected edges derived directly from FORENSIC_v8_0 §2.1. Net 21 accepted edges.
      Reconciler artifact written: 035_DISCOVERY_LAYER/PROMPTS/gemini/responses/
      2026-04-26_B3-5_batch1_reconciled.md. next_session_objective updated: carry-forward
      priority is now cgm_edge_proposals_v1_1.md + edge ingestion (not Gemini prompt re-run).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX — governance aside):
      last_session_id → Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work).
      red_team_counter unchanged at 0 (governance aside — not a red-team session).
      next_session_objective remains Madhav_M2A_Exec_6.
      Deliverables: GCS bucket-level IAM allUsers:objectViewer granted; CORS set (origin:*);
      ONGOING_HYGIENE_POLICIES §O extended with Operational Setup sub-block.
      Public URL verified 200+CORS. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_BUILD_TRACKER_GCS_BOOTSTRAP — governance aside):
      last_session_id → Madhav_BUILD_TRACKER_GCS_BOOTSTRAP; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work).
      red_team_counter unchanged at 0 (governance aside — not a red-team session).
      next_session_objective remains Madhav_M2A_Exec_6.
      Deliverables: GCS bucket marsys-jis-build-state (asia-south1) created; build-state.json
      uploaded via serializer; public-read object ACL set; canonical URI recorded in
      ONGOING_HYGIENE_POLICIES §O Enforcement. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2 — Portal Build Tracker Session 2):
      last_session_id → Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2; last_session_* block populated.
      active_phase_plan_sub_phase updated to include Session 2 complete.
      red_team_counter unchanged at 1 (governance_aside; does NOT increment).
      next_session_objective updated: Session 2 complete; Session 3 still pending.
      Deliverables: 26 new portal source files (lib/build/*, components/build/*, app/build/**).
      TypeScript: 0 errors. GCS: build-state.json re-uploaded (generated_by_session: v0_2).
      Governance: drift=exit2(59), schema=exit2(52), mirror=exit0. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3 — Portal Build Tracker Session 3 COMPLETE):
      active_phase_plan_sub_phase updated: Session 3 of 3 complete.
      last_session_id → Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3.
      red_team_counter unchanged at 1 (governance_aside; does NOT increment).
      next_session_objective → Madhav_M2A_Exec_7 exclusively (all portal sessions complete).
      Deliverables: 5 new components (InterventionList, ActivityFeed, MirrorPairsTable, HealthTrend,
      HealthSparkline); 4 stub pages converted to full implementations (/build/{interventions,parallel,
      health,activity}). All 6 Session 3 ACs pass (AC.14–AC.17, AC.19 final, AC.24).
      Governance: drift_detector exit=2 (58), schema_validator exit=2, mirror_enforcer exit=0.
      PORTAL_BUILD_TRACKER_PLAN_v0_1.md flipped to IMPLEMENTED. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_COW_M2A_Exec_8_BRIEF_AUTHORING — Cowork governance aside):
      last_session_id → Madhav_COW_M2A_Exec_8_BRIEF_AUTHORING; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; Exec_7's
      "B.4 Task 3 SUPPORTS sub-task complete" state stands until Exec_8 actually runs).
      red_team_counter unchanged at 2 (governance aside — does NOT increment per
      ONGOING_HYGIENE_POLICIES §G).
      next_session_objective remains Madhav_M2A_Exec_8 (CONTRADICTS sub-task + B.4 phase final close).
      Deliverables: CLAUDECODE_BRIEF_M2A_Exec_8.md authored at /CLAUDECODE_BRIEF.md (replacing
      Exec_7 COMPLETE in-place). 19-AC structure mirroring Exec_7 precision pattern; CONTRADICTS-
      specific scope (Claude→Gemini inverted ordering per §E.5; minimal p6_uvc_consistency.py
      scope creep documented; new claude/ prompt path tier; ledger schema v0.1 extension decision
      at AC.1; B.4 phase final close gates at AC.12; red-team cadence fire AC.13 — RT.M2B.1–RT.M2B.6
      + KR-1/2/3/4 re-verify; close-side ACs.15–.19 standard governance + GCS upload + mirror updates).
      Sibling reference cited throughout: M2B_EXEC_PLAN_v1_0.md §PLAN.B4_TASK3_CONTRADICTS_AND_CLOSE.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_M2A_Exec_8 close — B.4 CONTRADICTS + B.4 phase final close):
      active_phase_plan_sub_phase → "B.4 complete (Tasks 1+2+3+4+5; full Task 3 SUPPORTS+CONTRADICTS); B.4 phase final close at Madhav_M2A_Exec_8".
      active_phase_plan_status → active (M2 still active; B.5 next).
      red_team_counter → 0 (cadence fired: counter 2→3→reset; RT.M2B.1–6 + KR-1/2/3/4 all PASS).
      last_session_id → Madhav_M2A_Exec_8; last_session_* block populated; close_state → atomically_closed.
      next_session_objective → Madhav_M2A_Exec_9 (B.5 Session 1 Setup + Pattern Mining).
      next_session_proposed_cowork_thread_name → "Madhav M2A-Exec-9 — B.5 Session 1 (Setup + Pattern Mining)".
      Deliverables: p6_uvc_consistency.py PARTIAL_IMPL stub; CONTRADICTS two-pass pipeline code;
      two_pass_events_schema_v0_1.json extended; claude/ prompt + 2 Pass-1 batch files; 2 Gemini adjudication files;
      +30 CONTRADICTS ledger events (total 462); 4 CONTRADICTS edges (DB: nodes=1753, edges=3915);
      RED_TEAM_M2B_PHASE_B4_v1_0.md (all PASS); FILE_REGISTRY v1.9; PlanTree.tsx bugfix; CLAUDECODE_BRIEF COMPLETE.
      Governance: drift=exit2, schema=exit2, mirror=exit0 (8/8 clean).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_M2A_Exec_7 close — B.4 Task 3 SUPPORTS sub-task complete):
      active_phase_plan_sub_phase → "B.4 Task 3 SUPPORTS sub-task complete (CONTRADICTS sub-task + B.4 phase final close deferred to Exec_8)";
      red_team_counter → 2 (Exec_7 is M2 execution; increments toward cadence=3).
      last_session_id → Madhav_M2A_Exec_7; last_session_* block populated; close_state → atomically_closed.
      Deliverables (file): cgm_supports_edges_v1_0.md prompt (registered v1.0); cgm_edge_proposals v1.1
      registered (residual cleanup); rag/ledger.py minimal impl (append_two_pass_event +
      read_events_for_batch); two_pass_events_schema_v0_1.json; rag/reconcilers/cgm_supports_reconciler.py;
      rag/reconcilers/persist_from_reconciled.py; rag/graph.persist_supports_edges helper;
      cgm_supports_edges_manifest_v1_0.json (101 logical edges); ucn_section_node_map.json (17 unique UCN targets).
      Deliverables (DB): 97 SUPPORTS edges in rag_graph_edges (101 logical accepted; 4 cross-batch
      duplicates collapsed by ON CONFLICT DO UPDATE on edge_id sha256). 17 new ucn_section nodes
      in rag_graph_nodes. Totals: rag_graph_nodes=1752 (+17), rag_graph_edges=3911 (+97).
      9 Gemini batches run (216 proposed total): batch1 (CAREER) 11→8, batch2 (CHILDREN) 14→4,
      batch3 (FINANCIAL) 28→7, batch4 (HEALTH) 3→0 [GATE FAIL], batch5 (PARENTS) 45→44,
      batch6 (PSYCHOLOGY) 40→2, batch7 (RELATIONSHIPS) 15→0 [GATE FAIL], batch8 (SPIRITUAL) 32→8,
      batch9 (TRAVEL) 28→28. Ledger: 432 two-pass events written to two_pass_events.jsonl.
      DIS.001 / DIS.class.l3_zero_supports OPENED + RESOLVED in-session: HEALTH_LONGEVITY +
      RELATIONSHIPS L3 reports lack formal UCN §X.Y citations; native chose Option B (accept
      gap as data) over Option A (re-run with relaxed sub-prompt). Resolution recorded in
      DISAGREEMENT_REGISTER_v1_0 §4.
      Governance: drift_detector exit=2 (58 findings; pre-existing residuals — fingerprint
      rotations + canonical_path CGM v9_0 vs v2_0 carry-over); schema_validator exit=2
      (50 violations; pre-existing); mirror_enforcer exit=0 (8/8 pairs clean).
      build_state serialized + GCS HTTP/2 200 + CORS preserved.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-26, Madhav_M2A_Exec_6 — B.4 Session 1 full close):
      active_phase_plan_sub_phase → "B.4 Session 1 of 2 complete (Tasks 1+2+4+5; Task 3 SUPPORTS two-pass deferred to Exec_7)";
      red_team_counter → 1 (Madhav_M2A_Exec_6 is M2 execution; increments toward cadence=3).
      last_session_id → Madhav_M2A_Exec_6; last_session_* block populated; close_state → atomically_closed.
      File/code deliverables: cgm_edges_manifest_v1_0.json (22 reconciled CGM edges);
      CGM_v9_0.md frontmatter amended; FILE_REGISTRY v1.5 → v1.6; rag/graph.py (full B.4 impl);
      chunk.py (doc-type 6 activated); CANONICAL_ARTIFACTS CGM row rotated; .gemini/project_state.md updated.
      DB deliverables: 234 cgm_node chunks (total 993); 234 embeddings (total 977);
      HNSW p95=96.8ms; rag_graph_nodes=1735, rag_graph_edges=3814; graph.json exported.
      KR-1 CLOSED (stale=16), KR-2 CLOSED (all ceilings pass), KR-3 NEW (cgm_node NL rank by_design).
      PLN.SATURN hops=2=496; deterministic edges=3792 >> baseline=957.
      build_state serialized + GCS HTTP/2 200 + CORS access-control-allow-origin:*.
      Governance: drift_detector exit=2, schema_validator exit=2, mirror_enforcer exit=0.
      prior_narrative_correction: prior next_session_objective said "21 reconciled edges" —
      correct count post-batch-2 is 22. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_COW_M2A_Exec_10_BRIEF_AUTHORING — Cowork governance aside):
      last_session_id → Madhav_COW_M2A_Exec_10_BRIEF_AUTHORING; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; Exec_9's
      "B.5 Session 1 complete" state stands until Exec_10 actually runs).
      red_team_counter unchanged at 1 (governance aside — does NOT increment per
      ONGOING_HYGIENE_POLICIES §G).
      next_session_objective remains Madhav_M2A_Exec_10 (B.5 Session 2 — Pattern Expansion + Resonance Mapping)
      with significantly elaborated objective text per the three native decisions Q1+Q2+Q3 captured at
      this session's AskUserQuestion handshake. next_session_proposed_cowork_thread_name updated to
      "Madhav M2A-Exec-11 — B.5 Session 3 (Cluster + Contradictions + B.5 Close + Red-team)" reflecting
      cluster-defer per Q3.
      Deliverables: CLAUDECODE_BRIEF_M2A_Exec_10.md authored at /CLAUDECODE_BRIEF.md (replacing Exec_9
      COMPLETE in-place per CLAUDE.md §C item 0). 24-AC structure mirroring Exec_9 precision pattern;
      three native decision points Q1 (Pass-1 actor revert to Gemini→Claude), Q2 (hard-halt on first
      acceptance-rate anomaly), Q3 (cluster annotation defer to Exec_11) captured as governing brief
      frontmatter and threaded through ACs; AC.4.5 NEW for PRED.004/PAT.005 prediction_ledger
      reconciliation (Exec_9 records claim 4 entries; actual file has 3 — surfaced as Exec_9 close-state
      inconsistency; default Path A backfill).
      COWORK_LEDGER §3 entry 6 appended per ONGOING_HYGIENE_POLICIES §P.
      Sibling reference cited throughout brief: M2B_EXEC_PLAN_v1_0.md §PLAN.B5_S2 (to be amended in-place
      by Exec_10 per AC.3 for cluster defer).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_COW_M2A_Exec_14_BRIEF_AUTHORING — Cowork governance aside):
      last_session_id → Madhav_COW_M2A_Exec_14_BRIEF_AUTHORING; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; Exec_13's
      "B.7 complete (Router + Plan Library)" state stands until Exec_14 actually runs).
      red_team_counter unchanged at 1 (governance aside — does NOT increment per
      ONGOING_HYGIENE_POLICIES §G).
      next_session_objective updated: CLAUDECODE_BRIEF now READY; trigger phrase added.
      Deliverables: CLAUDECODE_BRIEF.md for Exec_14 authored at /CLAUDECODE_BRIEF.md (replacing
      Exec_13 COMPLETE in-place per CLAUDE.md §C item 0). 16-AC structure (AC.0–AC.16); composite
      endpoint design (classify_query → retrieve → synthesize in POST /rag/synthesize); SynthesisAnswer
      schema (11 fields) + DerivationEntry schema (5 fields); P7 gate (3 interpretations when
      significance ≥ 0.7); P5 gate (no out-of-bundle refs); synthesis_golden_v1_0.json spec
      (10 queries: 5 P7-gated, 5 standard); CF.1 carried (claude-opus-4.7 pending);
      CF.2 CLOSED (20/20 router eval). COWORK_LEDGER §3 entry 10 appended per ONGOING_HYGIENE_POLICIES §P.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-05-01, M3-W1-OPEN-PHASE-PLAN — M3 phase plan authored):
      active_phase_plan flipped null → PHASE_M3_PLAN_v1_0.md (v1.0); active_phase_plan_version → "1.0";
      active_phase_plan_sub_phase → "M3-A — Eval Baseline + Discovery Engine Activation + DIS.009 Disposition (not yet started)";
      active_phase_plan_status → active.
      last_session_id → M3-W1-OPEN-PHASE-PLAN; last_session_agent → claude-sonnet-4-6;
      last_session_cowork_thread_name → "M3-W1-OPEN-PHASE-PLAN"; close_state → atomically_closed.
      previous_session_id → KARN-W8-R2-M2-CLOSE.
      next_session_objective → M3-W1-A1 (Eval baseline capture + DIS.009 written analysis).
      next_session_proposed_cowork_thread_name → "M3-W1-A1 — Eval Baseline + DIS.009 Analysis".
      red_team_counter: 0 (plan-only session; not incremented per governance-aside equivalence).
      Deliverables: PHASE_M3_PLAN_v1_0.md (M3 phase plan; 4 sub-phases M3-A through M3-D;
      eval-baseline gate declared; DIS.009 disposition gate at M3-A close).
      Governance: mirror_enforcer=exit0 (8/8); drift_detector=exit2 (259 pre-existing);
      schema_validator=exit2 (100 pre-existing). No new critical findings.
      .gemini/project_state.md updated (MP.2 + MP.4 active plan pointer).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-05-01, KARN-W8-R2-M2-CLOSE — M2 CLOSED):
      active_macro_phase flipped M2 → M3; active_macro_phase_title → "Temporal Animation / Discovery Layer (Pattern + Contradiction Engines)";
      active_macro_phase_status → active (M3 just opened, M2 sealed).
      active_phase_plan → null (M3 phase plan to be authored at M3 open per HANDOFF_M2_TO_M3_v1_0.md);
      active_phase_plan_version → null; active_phase_plan_sub_phase → "M2 closed; M3 phase plan pending first M3 session";
      active_phase_plan_status → pending_m3_open.
      last_session_id → KARN-W8-R2-M2-CLOSE; last_session_* block populated; close_state → atomically_closed.
      previous_session_id → KARN-W8-R1-REDTEAM-SMOKE.
      red_team_counter → 0 (cadence fired at W8-R1 per MACRO_PLAN §IS.8 (b) macro-phase close; reset).
      next_session_objective → KARN-W9-M3-OPEN per HANDOFF_M2_TO_M3_v1_0.md.
      next_session_proposed_cowork_thread_name → "KARN-W9 — M3 OPEN".
      Deliverables: M2_CLOSE_v1_0.md (M2 sealing artifact, quality bar 8 PASS / 1 WARN / 0 FAIL);
      HANDOFF_M2_TO_M3_v1_0.md (M3 orientation memo); CURRENT_STATE flipped (this entry);
      .geminirules + .gemini/project_state.md propagated to adapted parity (W6/W7 Cowork-stream
      additions + M2 close state); SESSION_LOG W8-R2 entry + M2 macro-phase seal block appended.
      Mirror updates recorded in close-checklist mirror_updates_propagated block.
      M2 quality bar at close: Audit 1 98.99% / Audit 2 95.52% / Audit 3 95.52% / red-team PASS /
      eval-harness scaffolded (baseline STUB — manual native run is documented path).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-29, Phase_14G_Lockdown_Verification — Phase 14 SEALED):
      last_session_id → Phase_14G_Lockdown_Verification; last_session_* block populated.
      active_phase_plan_sub_phase updated: Phase 14 SEALED — Lockdown Verification complete.
      red_team_counter unchanged (Phase 14G is parallel platform work — does not increment).
      next_session_objective: Madhav_M2A_Exec_15 (B.9) or Phase 11B (legacy deletion).
      Deliverables:
        verification_artifacts/PHASE_14G/ produced: schema_snapshot.sql, data_audit.json,
          tool_registry.json, schema_validator.txt, drift_detector.txt, mirror_enforcer.txt,
          validator_diff.md, smoke_evidence.json, PHASE_14_FINDINGS_DISCHARGE_v1_0.md.
        PHASE_14_LOCKDOWN_v1_0.md sealing artifact produced (see 00_ARCHITECTURE/).
        PHASE_14G_LOCKDOWN_VERIFICATION_REPORT_v1_0.md produced (see 00_ARCHITECTURE/).
        CAPABILITY_MANIFEST.json: 36 missing fingerprints populated; 22 TRANSITIONAL entries
          flipped to LOCKED; manifest_fingerprint rotated.
        Findings: 29 total — 9 CLOSED, 6 WHITELISTED, 14 DEFERRED (all non-blocking).
        Smoke gate: SATISFIED (11/11 real audit_log sessions use msr_sql; 0/11 use rag_search).
        Anomalies resolved: sade_sati_phases=46 CORRECT; cgm_edges=21 (1 self-loop gap, DEFERRED).
        Validators post-14G: drift_detector=222/exit2 (−36 from 258; fingerprints fixed);
          schema_validator=76/exit2 (unchanged); mirror_enforcer=0/exit0.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-29, Phase_14C_Stream_H — Phase 14C COMPLETE):
      last_session_id → Phase_14C_Stream_H; last_session_* block populated.
      active_phase_plan_sub_phase updated: Phase 14C COMPLETE (all 12 done-criteria PASS).
      red_team_counter unchanged (Phase 14C is parallel platform work, not M2 corpus — does not increment).
      next_session_objective: Madhav_M2A_Exec_15 (B.9) or Phase 11B (legacy deletion).
      Deliverables:
        Schema migrations 014–017 applied (chart_facts, ephemeris_daily, eclipses, retrogrades, life_events, sade_sati_phases).
        CHART_FACTS_EXTRACTION_v1_0.yaml (589 facts, native-validated, FORENSIC v8.0 projection).
        ephemeris_daily: 660,726 rows, Swiss Ephemeris Lahiri sidereal, 1900-01-01..2100-12-31.
        eclipses: 913 rows, retrogrades: 2,462 rows, life_events: 36 rows, sade_sati_phases: 46 rows.
        6 pipeline writers wired into main.py _run_l1_writers(); 7 TypeScript LLM tools in consumeTools.
        CAPABILITY_MANIFEST.json v1.5 (102 entries; directory-path bug fixed on L25_TOOLS_v1_0).
        L1_STRUCTURED_LAYER_v1_0.md + PHASE_14C_L1_STRUCTURED_TABLES_REPORT_v1_0.md produced.
        Governance: drift_detector=258/exit2 (+122 from 136; mainly missing fingerprints for 14C/D/E entries);
          schema_validator=75/exit2 (+5 from 70); mirror_enforcer=0/exit0. No new CRITICAL.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-28, Madhav_PHASE11A_CUTOVER_STAGE1 — Phase 11A Pipeline Cutover Stage 1 governance aside):
      last_session_id → Madhav_PHASE11A_CUTOVER_STAGE1; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; B.8 complete state stands).
      red_team_counter unchanged at 2 (governance aside — does NOT increment per ONGOING_HYGIENE_POLICIES §G).
      next_session_objective unchanged → Madhav_M2A_Exec_15 (B.9).
      Deliverables: NEW_QUERY_PIPELINE_ENABLED default flipped false→true; AUDIT_ENABLED default flipped false→true
      in platform/src/lib/config/feature_flags.ts. platform/.env.example feature-flags section added documenting
      revert paths. platform/tests/unit/config/index.test.ts updated: new default-true assertions for both flags +
      env-var override test (MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED=false reverts to legacy). platform/scripts/cutover/
      stage1_smoke.ts created (8-class smoke script: env guard + 8 HTTP queries + audit_log count + 2 audit-detail
      fetches). cutover:stage1-smoke npm script registered in platform/package.json. CURRENT_STATE, SESSION_LOG, and
      CLAUDE.md §F updated. Reversibility: legacy path reachable via MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED=false.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-28, Madhav_M2A_Exec_14 close — B.8 Synthesis Layer complete):
      active_phase_plan_sub_phase → "B.8 complete (Synthesis Layer)".
      red_team_counter → 2 (Exec_14 is M2 execution session; no cadence fire at 2).
      last_session_id → Madhav_M2A_Exec_14; last_session_* block populated; close_state → atomically_closed.
      next_session_objective → Madhav_M2A_Exec_15 (B.9 per PHASE_B_PLAN_v1_0.md §B.9).
      Deliverables: synthesis_v1_0.md (P5/P6/P7 enforcement; 600-word cap; 2 worked examples);
      synthesize.py (ANTHROPIC_MODEL=claude-opus-4-6; temp=0.2; max_tokens=4096;
      _load_synthesis_prompt + _build_bundle_context + synthesize + SynthesisError);
      rag_synthesize.py (POST /rag/synthesize; composite classify→retrieve→synthesize; SynthesisError→422);
      main.py v1.3 (rag_synthesize_router added); synthesizeClient.ts (DerivationEntry+SynthesisAnswer
      interfaces; ragSynthesize() async function); synthesis_golden_v1_0.json (10 queries;
      5 P7-gated all confirmed sig≥0.7; SQ.010 rephrased factual per CF.3 protocol);
      synthesis_eval_v1_0.json (derivation=10/10, p7=10/10, p5=10/10 — all 100% PASS);
      schemas.py v1.1 (DerivationEntry+SynthesisAnswer added); FILE_REGISTRY v1.15.
      Spec gap documented: max_tokens 1500→4096 (P7 3-interpretation JSON exceeds 1500 tokens);
      length constraint added to synthesis_v1_0.md (600-word answer_text cap).
      CF.1 carry-forward: upgrade to claude-opus-4.7 when available.
      build_state serialized + GCS upload.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_M2A_Exec_13 close — B.7 Router + Plan Library complete):
      active_phase_plan_sub_phase → "B.7 complete (Router + Plan Library)".
      red_team_counter → 1 (Exec_13 is M2 execution session; no cadence fire at 1).
      last_session_id → Madhav_M2A_Exec_13; last_session_* block populated; close_state → atomically_closed.
      next_session_objective → Madhav_M2A_Exec_14 (B.8 per PHASE_B_PLAN_v1_0.md §B.8).
      Deliverables: schemas.py QueryPlan (7 fields, pydantic); plans_v1_0.md (5 plan types + exploratory fallback,
      significance rubric, WCR enforcement rule, worked examples); router_v1_0.md (claude-opus-4-6; 7 examples;
      disambiguation rules A+B added to fix interpretive_single vs multidomain + timing vs interpretive);
      router.py (ANTHROPIC_MODEL=claude-opus-4-6, _load_router_prompt, classify_query with WCR enforcer + static
      fallback); rag_router.py (POST /rag/route); main.py v1.2 (rag_router_router added); routerClient.ts
      (QueryPlanType 6-value union, QueryPlan interface, ragRoute() function); router_eval_v1_0.json (20/20 PASS,
      WCR invariant 15/15 PASS); FILE_REGISTRY v1.14.
      AC.7: 20/20 (100% — exceeded the 18/20 gate). AC.8: 15/15 WCR invariant PASS.
      CF.1 carry-forward: upgrade ANTHROPIC_MODEL to claude-opus-4.7 when available.
      build_state serialized + GCS upload PASS.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_COW_M2A_Exec_13_BRIEF_AUTHORING — Cowork governance aside):
      last_session_id → Madhav_COW_M2A_Exec_13_BRIEF_AUTHORING; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; Exec_12's
      "B.6 complete (M2B CLOSED)" state stands until Exec_13 actually runs).
      red_team_counter unchanged at 0 (governance aside — does NOT increment per ONGOING_HYGIENE_POLICIES §G).
      next_session_objective updated: CLAUDECODE_BRIEF now READY; trigger phrase added.
      Deliverables: CLAUDECODE_BRIEF.md for Exec_13 authored at /CLAUDECODE_BRIEF.md (replacing Exec_12
      COMPLETE in-place per CLAUDE.md §C item 0). 15-AC structure (AC.0–AC.15); native decisions Q1
      (claude-opus-4-6 router; CQ6 override; CF.1 carry-forward) + Q2 (no M2C_EXEC_PLAN) encoded as
      governing brief frontmatter. Pre-flight assertions, QueryPlan schema (7 fields), 5 plan types +
      exploratory fallback, significance rubric, WCR enforcer rule, CF.1/CF.2 carry-forwards specified.
      COWORK_LEDGER §3 entry 9 appended per ONGOING_HYGIENE_POLICIES §P.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_COW_M2A_Exec_12_BRIEF_AUTHORING — Cowork governance aside):
      last_session_id → Madhav_COW_M2A_Exec_12_BRIEF_AUTHORING; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; Exec_11's
      "B.5 complete" state stands until Exec_12 actually runs).
      red_team_counter unchanged at 0 (governance aside — does NOT increment per ONGOING_HYGIENE_POLICIES §G).
      next_session_objective remains Madhav_M2A_Exec_12 (B.6 Hybrid Retrieval Library).
      Deliverables: CLAUDECODE_BRIEF.md for Exec_12 authored at /CLAUDECODE_BRIEF.md (replacing Exec_11
      COMPLETE in-place per CLAUDE.md §C item 0). 16-AC structure; native decisions Q1 (reconciler
      pre-flight — run_pattern_pipeline.py DR-write fix before B.6 code) + Q2 (Vertex Ranking API
      first, cross-encoder/ms-marco-MiniLM-L-6-v2 fallback) encoded as governing brief frontmatter.
      retrieve.py with 5 modes (vector, bm25, graph_walk, hybrid_rrf, auto), RRF k=60, layer-balance
      enforcer, Whole-Chart-Read invariant (B.11), cgm_node boost (+0.3 for chart-state queries),
      reranker, FastAPI router + TypeScript shim, 20-query golden eval set, 11-probe red-team
      (RT.M2B.1–6 + RT.B6.7–11), M2B milestone close gates. 5 carry-forwards from Exec_11
      addressed in scope. COWORK_LEDGER §3 entry 8 appended per ONGOING_HYGIENE_POLICIES §P.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_M2A_Exec_12 close — B.6 Hybrid Retrieval Library complete + M2B milestone CLOSED):
      active_phase_plan_sub_phase → "B.6 complete (M2B CLOSED)".
      red_team_counter → 0 (cadence fired: §IS.8(b) M2B milestone close; counter 0→1→red-team fires→reset to 0).
      last_session_id → Madhav_M2A_Exec_12; last_session_* block populated; close_state → atomically_closed.
      next_session_objective → Madhav_M2A_Exec_13 (B.7 per PHASE_B_PLAN_v1_0.md).
      Deliverables: run_pattern_pipeline.py DR-write fix (AC.0 backport; 8 unit tests pass);
      retrieve.py 5-mode hybrid retrieval library (vector, bm25, graph_walk, hybrid_rrf, auto;
      RRF k=60; layer-balance enforcer ≥1 per 5 doc types; WCR invariant; cgm_boost +0.3;
      Vertex AI Ranking API probe + cross-encoder fallback); rag_retrieve.py FastAPI router
      POST /rag/retrieve; main.py registered; retrieveClient.ts TypeScript shim;
      retrieval_golden_v1_0.json (20 queries, 5 classes; v1.1 corrected — live DB-verified IDs);
      run_eval.py extended (retrieval_eval mode); retrieval_eval_v1_0.json PASS
      (precision@10=0.32, recall@10=0.8875, layer_balance=1.0, kr3_cgm_top5=1.0);
      RED_TEAM_M2B_PHASE_B6_v1_0.md (11 probes all PASS); FILE_REGISTRY v1.13.
      AC.8 live eval PASS (post-context-compaction continuation with Cloud SQL Auth Proxy;
      golden set corrected to v1.1 — recycled IDs + wrong signal prefix fixed).
      AC.15 GCS upload PASS (gsutil to gs://marsys-jis-build-state/build_state.json; HTTP 200).
      mirror_updates: .geminirules + .gemini/project_state.md → B.6 complete (M2B CLOSED).
      CLAUDECODE_BRIEF.md → COMPLETE. §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_M2A_Exec_11 close — B.5 Session 3 complete + B.5 phase final close):
      active_phase_plan_sub_phase → "B.5 complete (22 patterns, ≥10 resonances, ≥5 contradictions, ≥10 clusters; B.5 phase final close at Madhav_M2A_Exec_11)".
      red_team_counter → 0 (cadence fired: counter 2→3→reset; RT.M2B.1–6 + RT.B5.7–10 + KR-3/KR-4 all PASS).
      last_session_id → Madhav_M2A_Exec_11; last_session_* block populated; close_state → atomically_closed.
      next_session_objective → Madhav_M2A_Exec_12 (B.6 Hybrid Retrieval Library).
      Deliverables: CLUSTER_ATLAS_v1_0.json (12 clusters CLUS.001–CLUS.012; KMeans/HDBSCAN; 12 domains);
      CONTRADICTION_REGISTER_v1_0.json (8 contradictions CON.001–CON.008; CONFIRMED; 3 HIGH + 5 MED);
      cluster_schema_v0_1.json + contradiction_schema_v0_1.json (new); two_pass_events_schema_v0_1.json extended
      (cluster event types + gemini_revalidation_pass1); cluster_reconciler.py + run_cluster_pipeline.py +
      contradiction_reconciler.py + run_contradiction_pipeline.py (new code); cluster_annotation_v1_0.md prompt +
      contradiction_scan_v1_0.md prompt (new); PROMPT_REGISTRY/INDEX.json → 10 entries (backfill: claude.pattern_revalidation
      + gemini.contradiction_adjudication); p6_retroactive_sweep_v1_0.json (0 flags; PARTIAL-IMPL whitelisted);
      b5_session3_summary.json (all 8 bars PASS); RED_TEAM_M2B_PHASE_B5_v1_0.md (12 probes all PASS);
      FILE_REGISTRY v1.12; CANONICAL_ARTIFACTS fingerprints rotated (DISAGREEMENT_REGISTER + FILE_REGISTRY rows).
      mirror_updates: .geminirules + .gemini/project_state.md → B.5 COMPLETE state. CLAUDECODE_BRIEF.md → COMPLETE.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-04-27, Madhav_COW_M2A_Exec_11_BRIEF_AUTHORING — Cowork governance aside):
      last_session_id → Madhav_COW_M2A_Exec_11_BRIEF_AUTHORING; last_session_* block populated.
      active_phase_plan_sub_phase unchanged (governance aside — no M2 corpus work; Exec_10's
      "B.5 Session 2 complete" state stands until Exec_11 actually runs).
      red_team_counter unchanged at 2 (governance aside — does NOT increment per ONGOING_HYGIENE_POLICIES §G).
      next_session_objective remains Madhav_M2A_Exec_11 (B.5 Session 3 — Cluster + Contradictions + B.5 Close + Red-team).
      Deliverables: CLAUDECODE_BRIEF.md for Exec_11 authored at /CLAUDECODE_BRIEF.md (replacing Exec_10
      COMPLETE in-place per CLAUDE.md §C item 0). 18-section brief; native decisions Q1 (resolve DIS.003/4/5
      + tighten acceptance-rate prompts via mandatory self-audit block), Q2 (soft re-validation gate for
      PAT.005–011 — DR+annotate, B.5 close not blocked), Q3 (backfill-only DRs DIS.006/7/8 for reconciler
      silent-failure) encoded as governing frontmatter. New schemas: cluster_schema_v0_1.json (CLUS.NNN,
      kmeans|hdbscan, ≥3 signal_ids), contradiction_schema_v0_1.json (CONT.NNN, 5 tension types). Pattern
      schema additive extension: re_validation_status + re_validation_event_id. 17 ACs defined; 5 carry-forwards
      to Exec_12 listed at §16. Combined red-team (counter→3) spec at §13: RT.M2B.1–6 + RT.B5.7–10 + KR-3/KR-4.
      COWORK_LEDGER §3 entry 7 appended per ONGOING_HYGIENE_POLICIES §P.
      §3 narrative refreshed.
---

# CURRENT STATE v1.0
## MARSYS-JIS Project — Canonical "You Are Here" Pointer

*Implements GA.19 at the full-surface layer per `GROUNDING_AUDIT_v1_0.md §6.3` +
`GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §I.5`. Companion to `SESSION_LOG_SCHEMA_v1_0.md`
(GA.17 + GA.18 closure). Produced in Step 10 of the Step 0 → Step 15 governance rebuild.*

---

## §1 — How to read this file

- **§2** is the canonical machine-readable state block. A YAML fence. The fields it carries
  are the authoritative current state of the project at the moment of the last session close.
- **§3** is a human-readable narrative derived from §2. Reading §3 answers "what is actually
  going on" in prose; reading §2 answers the same question in a form `drift_detector.py` can
  parse. The two must agree.
- **§4** spells out the update protocol: who touches the file, when, and how a session
  verifies consistency.
- **§5** names the disagreement-resolution rule: during the rebuild era, STEP_LEDGER wins
  conflicts; post-Step-15, this file wins.

A fresh session that opens the project and wants to know "where are we now?" reads §2, cross-
checks against STEP_LEDGER (during rebuild era) or against SESSION_LOG's latest `session_close`
block (post-rebuild era), and proceeds.

---

## §2 — Canonical state block

```yaml
current_state:
  # ------------------------------------------------------------------
  # Macro-phase position (per MACRO_PLAN_v2_0.md §"Ten macro-phase arc")
  # ------------------------------------------------------------------
  active_macro_phase: M3                       # M2 CLOSED 2026-05-01 at KARN-W8-R2-M2-CLOSE; M3 is currently-active
  active_macro_phase_title: "Temporal Animation / Discovery Layer (Pattern + Contradiction Engines)"
  active_macro_phase_status: active
    # One of: active | paused_governance_rebuild | paused_native_hold | closed
    # M2 flipped to closed at KARN-W8-R2-M2-CLOSE (2026-05-01); M3 active.
    # M2 sealing artifact: 00_ARCHITECTURE/M2_CLOSE_v1_0.md
    # M2→M3 handoff memo: 00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md

  # ------------------------------------------------------------------
  # Phase-plan expansion (M3 phase plan TBD; first M3 session decides whether to expand
  #   MACRO_PLAN §M3 into a PHASE_C_PLAN_v1_0.md or drive M3 directly from MACRO_PLAN.)
  # ------------------------------------------------------------------
  active_phase_plan: 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md
  active_phase_plan_version: "1.0"
  active_phase_plan_sub_phase: >
    M3-A — Eval Baseline + Discovery Engine Activation + DIS.009 Disposition
    (NOT YET STARTED; PHASE_M3_PLAN_v1_0.md authored at M3-W1-OPEN-PHASE-PLAN 2026-05-01;
    M3-A entry-blocked on BASELINE_RUN_W9.json capture)
    # PHASE_M3_PLAN_v1_0.md is the active M3 phase plan (v1.0, authored 2026-05-01).
    # Sub-phases: M3-A (Discovery Engine + DIS.009) → M3-B (Vimshottari + Yogini + Transit) →
    # M3-C (Chara + Narayana + KP + Varshaphala + Shadbala) → M3-D (Validator + Close).
    # Hard prerequisite: BASELINE_RUN_W9.json must be captured before M3-A retrieval changes.
  active_phase_plan_status: active

  # ------------------------------------------------------------------
  # Governance step (Step 0 → Step 15 rebuild)
  # ------------------------------------------------------------------
  active_governance_step: "Step_15"              # most recently completed (set at close per §4.2)
  active_governance_step_title: "Governance baseline close — GOVERNANCE_BASELINE_v1_0.md produced"
  active_governance_step_status: completed
    # Step 15 atomically closed 2026-04-24 at STEP_15_GOVERNANCE_BASELINE_CLOSE.
    # All 32 GA.N findings addressed: 30 RESOLVED, 1 ACCEPTED_AS_POLICY (GA.11),
    # 1 DEFERRED_AS_DESIGN_CHOICE (GA.27). Script verdicts at close:
    # drift_detector.py exit 3 BASELINE (100 BASELINE findings; no regressions from Step 14).
    # schema_validator.py exit 3 BASELINE (46 MEDIUM/LOW; zero HIGH/CRITICAL; Step 14 baseline
    # unchanged — known-residuals whitelist holds).
    # mirror_enforcer.py exit 0 CLEAN (8/8 pairs PASS; ND.1 holds).
    # Red-team: 2/2 prompts PASS (macro-phase-close cadence per MACRO_PLAN §IS.8).
    # Deliverable: GOVERNANCE_BASELINE_v1_0.md (§1–§10 sealing artifact).
    # STEP_LEDGER row 15 → completed; STEP_LEDGER status → GOVERNANCE_CLOSED (retired).
    # CURRENT_STATE transitions to authoritative state surface.
    # THIS IS THE FINAL GOVERNANCE-REBUILD STEP. No next governance step (Step 16 does not exist).
    # STEP_LEDGER is now retired. CURRENT_STATE is now the sole authoritative state surface.
  next_governance_step: null
  next_governance_step_title: null
  next_governance_step_status: null
    # Governance rebuild complete. No next step. See next_session_objective for M2 resumption pointer.

  # ------------------------------------------------------------------
  # Red-team counter (ONGOING_HYGIENE_POLICIES §G addition at Step 12)
  # ------------------------------------------------------------------
  red_team_counter: 0
    # Reset to 0 at KARN-W8-R2-M2-CLOSE (2026-05-01) — cadence fired at W8-R1 per
    # MACRO_PLAN §IS.8 (b) macro-phase close: REDTEAM_M2_v1_0.md verdict PASS (9/9 axes;
    # 0 findings; 0 fixes applied). M2 close cadence discharged.
    # M3 first session resumes counting from 0.
    # Historical M2 cadence trail: Exec_8→0; Exec_9→1; Exec_10→2; Exec_11→0 (B.5 close
    # cadence fired); Exec_12→0 (M2B close cadence fired); Exec_13→1; Exec_14→2;
    # Phase 14 work did not increment (parallel platform stream); W8-R1 IS.8 PASS → reset.

  # ------------------------------------------------------------------
  # Native-directive state (ND.N)
  # ------------------------------------------------------------------
  open_native_directives: []                     # list of ND.N IDs with status `open` or
                                                 # `partially_addressed`; empty = none open
  addressed_native_directives: ["ND.1"]          # for audit trail
  nd_note: "ND.1 (Mirror Discipline) addressed 2026-04-24 at STEP_7 close; no open directive."

  # ------------------------------------------------------------------
  # Last-session pointer
  # ------------------------------------------------------------------
  last_session_id: BHISMA-W1-S4-CONVERGENCE
    # BHISMA Wave 1 convergence. Parallel infrastructure elevation sprint (KARN-W9).
    # All three streams (S1 Model Family, S2 LLM Pipeline, S3 Trace Command Center) converged.
    # Sealing artifact: 00_ARCHITECTURE/BHISMA_CLOSE_v1_0.md.
  last_session_closed_at: 2026-05-01T00:00:00+05:30
  last_session_attempted_close_at: 2026-05-01T00:00:00+05:30
  last_session_agent: claude-sonnet-4-6
  last_session_cowork_thread_name: "BHISMA-W1-S1-MODEL-FAMILY"
  last_session_close_state: atomically_closed
  last_session_drift_verdict: >
    Governance-aside parallel workstream (platform code only; no corpus changes).
    tsc: 9 pre-existing errors (AppShell/ReportGallery); zero new.
    vitest: exit 0 (all suites pass).
    Mirror scripts not re-run (BHISMA is Claude-only; no Gemini-side counterpart per
    BHISMA log §Relationship to KARN). red_team_counter: 0 (unchanged — governance-aside
    equivalence; BHISMA does not increment per ONGOING_HYGIENE_POLICIES §G).
  last_session_deliverable: >
    BHISMA Wave 1 closed (2026-05-01). Three parallel streams converged:
    S1 — multi-provider model family (4 providers / 11 models / FAMILY_WORKER / PipelineError
         hard-fail / health.ts / cost.ts / 3 flags retired / 4 observability flags added).
    S2 — LLM-first pipeline (planner.ts + RCS 17 tools / citation_check.ts / synthesis_done
         + context_assembly trace steps / token_count backfill / LLM_FIRST_PLANNER_ENABLED=false).
    S3 — Trace Command Center (warm-gold TracePanel + QueryDNAPanel + RetrievalScorecard
         + CostPerformanceBar + AnalyticsTab).
    Convergence: tsc PASS / vitest PASS / BHISMA_CLOSE_v1_0.md / SESSION_LOG appended /
    CURRENT_STATE amended. GAP.P.9 eval STUB persists (secrets required; non-blocking).
  previous_session_id: M3-W1-OPEN-PHASE-PLAN
    # M3 first session. Plan-only. Produced PHASE_M3_PLAN_v1_0.md.

  # ------------------------------------------------------------------
  # Next-session commitment (single committed objective per SESSION_LOG_SCHEMA §4)
  # ------------------------------------------------------------------
  next_session_objective: >
    M3-W1-A1 (first M3-A execution session) — Eval baseline capture + DIS.009 written
    analysis (no retrieval changes). Per PHASE_M3_PLAN_v1_0.md §3.1: capture
    BASELINE_RUN_W9.json (hard gate); perform read-only DIS.009 written analysis (R1/R2/R3
    option framing); no retrieval-affecting code committed until baseline captured.
    Session ID pattern: M3-W1-A1-EVAL-BASELINE or similar (finalized at session open per
    PROJECT_M3_SESSION_LOG.md naming convention).
  next_session_proposed_cowork_thread_name: "M3-W1-A1 — Eval Baseline + DIS.009 Analysis"
  red_team_due_note: >
    Counter at 0 (reset at KARN-W8-R2 close — W8-R1 IS.8 macro-phase-close cadence fired).
    Plan-only session (M3-W1-OPEN) did NOT increment per governance-aside equivalence.
    M3-A execution sessions begin counting from 0; next §IS.8(a) every-third fire at
    M3 counter=3 (expected mid-M3-A or M3-A close depending on session count).

  # ------------------------------------------------------------------
  # Freshness metadata (for drift detection)
  # ------------------------------------------------------------------
  file_updated_at: 2026-05-01T00:00:00+05:30
  file_updated_by_session: BHISMA-W1-S4-CONVERGENCE
  cross_check_hash: >
    Derived from the tuple (active_governance_step, last_session_id, next_governance_step)
    = (Step_15 completed, BHISMA-W1-S4-CONVERGENCE, null).
    STEP_LEDGER is GOVERNANCE_CLOSED; drift_detector.py cross-checks against
    SESSION_LOG's latest `session_close.session_id` (always).
  cross_check_authority: CURRENT_STATE           # post-Step-15; STEP_LEDGER is GOVERNANCE_CLOSED
```

---

## §3 — Narrative (human-reading surface — must agree with §2)

At the close of BHISMA-W1-S4-CONVERGENCE (2026-05-01) — **BHISMA Wave 1 platform elevation CLOSED**:

**BHISMA.** The parallel infrastructure elevation sprint (KARN-W9) converged. Three streams closed: S1 (multi-provider model family + hard-fail pipeline + health/cost telemetry), S2 (LLM-first unified planner behind `LLM_FIRST_PLANNER_ENABLED`, default off), S3 (warm-gold Trace Command Center with four new panels). Platform is now BHISMA-elevated. GAP.P.9 eval baseline STUB persists — first session with auth secrets runs the paired baseline and records the planner delta; that same session is the M3-W1-A1-EVAL-BASELINE session. `LLM_FIRST_PLANNER_ENABLED` flips to true after that run confirms acceptable delta. Sealing artifact: `00_ARCHITECTURE/BHISMA_CLOSE_v1_0.md`.

**M3 phase plan.** Unchanged. `PHASE_M3_PLAN_v1_0.md` v1.0 is the active M3 phase plan. Next committed session remains `M3-W1-A1-EVAL-BASELINE`.

*(Below: retained narrative from prior session close M3-W1-OPEN-PHASE-PLAN for audit trail.)*

At the close of M3-W1-OPEN-PHASE-PLAN (2026-05-01) — **PHASE_M3_PLAN_v1_0.md authored**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer (Pattern + Contradiction Engines), active. Phase plan is now set: `PHASE_M3_PLAN_v1_0.md` (v1.0). Sub-phases M3-A through M3-D defined. M3-A is the first execution sub-phase, entry-blocked on BASELINE_RUN_W9.json.

**Phase plan.** PHASE_M3_PLAN_v1_0.md v1.0 is the authoritative M3 phase plan. Sub-phase assignments: M3-A = Discovery Engine Activation + DIS.009 Disposition; M3-B = Vimshottari + Yogini + Transit Engine; M3-C = Chara + Narayana + KP + Varshaphala + Shadbala; M3-D = Temporal Validator + Red-Team + M3 Close. Hard prerequisite: BASELINE_RUN_W9.json must be captured before any M3-A retrieval-affecting change. DIS.009 disposition decision point declared at M3-A close (AC.M3A.4).

**Session.** Plan-only; no corpus or platform mutations. Governance scripts at close: mirror_enforcer exit=0 (8/8 clean), drift exit=2 (259 pre-existing), schema exit=2 (100 pre-existing). No new regressions. red_team_counter remains 0 (plan-only session does not increment).

---

*(Below: retained narrative from prior session close KARN-W8-R2-M2-CLOSE for audit trail.)*

At the close of KARN-W8-R2-M2-CLOSE (2026-05-01) — **M2 (Corpus Activation) SEALED**:

**Macro-phase.** The project is in **M3 — Temporal Animation / Discovery Layer (Pattern + Contradiction Engines)**, active. M2 closed at this session. The M2 sealing artifact is `00_ARCHITECTURE/M2_CLOSE_v1_0.md`; the M2→M3 handoff memo is `00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md`.

**Phase-plan expansion.** `PHASE_B_PLAN_v1_0.md` (v1.0.3) is SUPERSEDED-AS-COMPLETE for M2. The M3 phase plan is to be authored at the first M3 session (`KARN-W9-M3-OPEN`) — the decision on whether to expand `MACRO_PLAN_v2_0.md §M3` into a `PHASE_C_PLAN_v1_0.md` or to drive M3 directly from MACRO_PLAN is a native-approval point at M3 open.

**M2 quality bar at close (final).**
- Audit 1 (MSR→FORENSIC): **98.99%** (490/495) ≥ 95% — PASS
- Audit 2 (UCN→MSR): **95.52%** (128/134) ≥ 90% — PASS
- Audit 3 (CGM→MSR): **95.52%** (128/134) ≥ 95% — PASS
- Eval harness scaffold: 24 fixtures + runner + A/B — PASS
- Eval baseline run: STUB — auth-cookie required for headless run; manual native follow-up — WARN (deferred; non-blocking)
- Per-tool planner: 15/15 vitest — PASS
- Composition rules: 39/39 vitest — PASS
- Red-team pass: REDTEAM_M2_v1_0.md verdict **PASS** (9/9 axes; 0 findings; 0 fixes) — PASS
- New query pipeline default: NEW_QUERY_PIPELINE_ENABLED=true (Phase 11A Stage 1, 2026-04-28) — PASS

**Overall:** 8 PASS / 1 WARN / 0 FAIL.

**Platform live state at M2 close (carry into M3).** Query pipeline (default): `classify → [per_tool_planner: optional] → compose → retrieve(parallel) → validate → synthesize → audit`. Retrieval tools: 17 (5 L2.5 structured + 7 L1 structured + 5 RAG). Structured tables: 6 L1 + 6 L2.5 + 4 L3.5 register tables. CAPABILITY_MANIFEST: v1.7 effective (with `entry_count` +3 latent miscount carried as known-deferred).

**Mirror discipline.** Adapted parity holds across MP.1–MP.8. W6/W7 Cowork-stream additions (composition rules, per-tool planner, provenance audits, eval harness) propagated to `.geminirules` + `.gemini/project_state.md` in this session per ND.1. Recorded in close-checklist `mirror_updates_propagated` block.

**Governance step.** Step 15 completed. CURRENT_STATE is authoritative.

**Native directives.** ND.1 addressed (held throughout M2). No open directives.

**Red-team.** `red_team_counter: 0` — reset at this close (W8-R1 IS.8 macro-phase-close cadence fired; verdict PASS). M3 first session resumes counting from 0.

**Open items inherited from M2 (non-blocking — see `M2_CLOSE_v1_0.md §Known deferred items`).** (1) CAPABILITY_MANIFEST `entry_count` +3 latent miscount — manifest-audit pass; (2) SIG.MSR.207 absent from `MSR_v3_0.md` — investigate; (3) UCN inline citation pass (Option A) — aspirational, not gating; (4) Eval baseline manual run — M3-S1 hard prerequisite; (5) UI-test fixture errors (`AppShell.test.tsx` + `ReportGallery.test.tsx`) — pre-W6 drift; (6) DIS.009 — Q2-soft-gated; resolve alongside M3 Pattern Engine activation.

**Concurrent workstreams that survive M2 close.** Life Event Log (LEL) — continue adding events; M4 prerequisite. Prospective Prediction Logging — substrate at `06_LEARNING_LAYER/PREDICTION_LEDGER/`; all time-indexed predictions log with confidence/horizon/falsifier *before* outcome. Portal Redesign on `redesign/r0-foundation` — R0 closed 2026-04-29; R1–R6 parallel-ready; does not block M3.

**Next-session commitment.** `KARN-W9-M3-OPEN` — first M3 session.

---

## §4 — Update protocol

### §4.1 — Who updates

Every session that executes a governance step or closes a macro-phase sub-phase updates
this file as part of its session-close checklist. The SESSION_CLOSE_TEMPLATE's
`current_state_updated` field affirms the update happened:

- **Rebuild era (Steps 10 – 14):** `current_state_updated: true` is required from Step 10
  forward. Steps 0 – 9 carry `current_state_updated: n/a` retroactively since this file
  did not exist during those sessions.
- **Step 15 close:** `current_state_updated: true` + `step_ledger_updated: true` (STEP_LEDGER
  is retired at Step 15 close per the rebuild-era banner). Post-Step-15, the template is
  amended to drop `step_ledger_updated`.
- **Post-Step-15 sessions:** `current_state_updated: true` is required for every session
  that materially changes the state (which is every normal session; a pure read-only session
  does not modify state and may carry `current_state_updated: false` with justification).

### §4.2 — What changes at each update

The fields that rotate at every session close:

- `last_session_id`, `last_session_closed_at`, `last_session_agent`,
  `last_session_cowork_thread_name` → populated from the closing session's own
  `session_close` block.
- `active_governance_step_status` → transitions from `in_progress` (mid-session) to
  `completed` (end of session) for the step this session executed.
- `next_governance_step`, `next_governance_step_title`, `next_governance_step_status` →
  advance to the next row in STEP_LEDGER (during the rebuild era) or the next sub-phase in
  PHASE_B_PLAN / MACRO_PLAN (post-rebuild).
- `next_session_objective`, `next_session_proposed_cowork_thread_name` → committed next
  objective per `SESSION_LOG_SCHEMA_v1_0.md §4`.
- `file_updated_at`, `file_updated_by_session`, `cross_check_hash` → session-close timestamp
  and ID.

The fields that rotate at macro-phase transitions:

- `active_macro_phase`, `active_macro_phase_title`, `active_macro_phase_status` — only on
  macro-phase close (e.g., M2 → M3 transition).
- `active_phase_plan`, `active_phase_plan_version`, `active_phase_plan_sub_phase`,
  `active_phase_plan_status` — when the active phase-plan changes (new version, new sub-
  phase, or phase-plan swap at macro-phase transition).

The fields that rotate at native-directive events:

- `open_native_directives`, `addressed_native_directives`, `nd_note` — on issuance of a new
  ND.N, or on status transition of an existing one.

### §4.3 — Atomic write

Updates happen as part of the atomic SESSION_LOG append (per protocol §G.4). The sequence
is: run governance scripts → populate YAML at §2 → update §3 narrative to match → run
`schema_validator.py --repo-root .` (checks this file too, post-Step-10 extension) → emit
SESSION_CLOSE YAML with `current_state_updated: true` → schema_validator validates the
close YAML → SESSION_LOG append fires. If any step fails, the session does not close;
this file is not updated until a retry succeeds.

### §4.4 — Consistency check with STEP_LEDGER (rebuild era)

During Steps 10 – 15, every update to this file must agree with STEP_LEDGER. Specifically:

- `active_governance_step` must equal the STEP_LEDGER row that is `in_progress` or (at
  session close) the row that was just marked `completed`.
- `next_governance_step` must equal the STEP_LEDGER row that is `ready` (there is at most
  one).
- `active_governance_step_status` must equal the STEP_LEDGER row's `status` field.

`drift_detector.py` enforces this at session close. Any disagreement opens a finding the
session must resolve before marking close.

### §4.5 — Consistency check with SESSION_LOG (always)

The `last_session_id` field must equal the SESSION_LOG tail entry's `session_id` (header +
`session_close.session_id`). If they disagree, either the session close did not fire
atomically (a bug in the close flow) or this file has been edited outside a session close
(a violation of §4.1). Either case is a finding.

---

## §5 — Disagreement-resolution rule

### §5.1 — Rebuild era (Steps 10 – 14, up to but not including Step 15 close) — NOW HISTORICAL

**STEP_LEDGER wins** *during the rebuild era only.* The rebuild era ended at Step 15 close 2026-04-24. STEP_LEDGER is now GOVERNANCE_CLOSED. **§5.2 (CURRENT_STATE wins) is now in force.** This §5.1 is preserved as an audit trail of the authority rule that governed Steps 10–14.

Rationale (preserved for audit): STEP_LEDGER was the rebuild workflow's single source of truth; this file was a derived state-pointer. Flipping authority mid-rebuild would have been a governance surprise.

### §5.2 — Post-Step-15 (GOVERNANCE_BASELINE closed)

**CURRENT_STATE (this file) wins.** Step 15 closes `GOVERNANCE_BASELINE_v1_0.md` and
transitions STEP_LEDGER to `GOVERNANCE_CLOSED` (or archives it entirely per the Step 15
decision). From that moment on, this file is authoritative for state. CLAUDE.md §C item #8's
"while STEP_LEDGER is LIVE" clause drops off and the mandatory-reading list points to this
file instead.

### §5.3 — Between sessions

Between sessions — when no session is open — §5.1 / §5.2 apply based on whether Step 15 has
closed. A drift detected during a fresh session's open handshake must be resolved before any
substantive work begins; the session commits to the authoritative surface per §5.1 / §5.2
and corrects the non-authoritative surface as its first substantive edit.

---

## §6 — GA-finding closure record

| Finding | Severity | Closure |
|---------|----------|---------|
| GA.17 — SESSION_LOG naming inconsistency | MEDIUM | Closed at schema layer by `SESSION_LOG_SCHEMA_v1_0.md §1` (Step 10 sibling deliverable). |
| GA.18 — Multi-option next-objective | LOW | Closed at schema layer by `SESSION_LOG_SCHEMA_v1_0.md §4` (Step 10 sibling deliverable). |
| GA.19 — "You are here" marker | MEDIUM | **Fully closed** by THIS file. Step 0 installed a minimal marker in CLAUDE.md; Step 10 upgrades to this proper state file per protocol §I.5. |

GA.1/GA.2 (MSR version drift) are not closed by this file — they are closed by
`CANONICAL_ARTIFACTS_v1_0.md` being authoritative and `drift_detector.py` enforcing the
cross-surface consistency. This file references CANONICAL_ARTIFACTS rather than duplicating
its canonical-path declarations, consistent with the cite-by-reference discipline.

---

*End of CURRENT_STATE_v1_0.md — amended in-place 2026-04-24 at Step 15 (GOVERNANCE_BASELINE_CLOSE) to transition from rebuild-era secondary surface to steady-state authoritative state pointer. §2 YAML, §3 narrative, §5.1 authority rule all updated. Governance rebuild CLOSED.*
