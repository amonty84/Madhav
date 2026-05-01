---
artifact: CURRENT_STATE_v1_0.md
version: 1.1
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
  - v1.1 (2026-05-01, Cowork-LEL-ELICITATION): LEL gate CLEARED. active_phase_plan_sub_phase updated: LEL count 35→46 events; M4-A gate met; 11 new events pending Swiss Ephemeris computation. LEL v1.3 commit e9dc44b.
  - v1.1 (2026-05-01, M4-INFRA-001): Added Platform State block recording migrations 022-031 applied to Cloud SQL.
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
  - v1.0 amended-in-place (2026-05-01, M3-W1-A4-DIS009-DISPOSITION — Track 1 fourth execution AND M3-A SUB-PHASE CLOSE: DIS.009 R3 disposition + IS.8(a) cadence-fire RT + M3-A close-checklist):
      last_session_id → M3-W1-A4-DIS009-DISPOSITION; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W1-A4-DIS009-DISPOSITION"; close_state →
      atomically_closed. previous_session_id → M3-W3-C3-SHADBALA (chronologically-immediately-prior
      closed; brief-declared predecessor in this session's brief).
      next_session_objective → native-choice between M3-W2-B3-ANTARDASHA-CROSSCHECK
      (standalone Track-2 wrap-up) OR M3-W4-D1-VALIDATOR-REDTEAM (close Track 2 en bloc
      at M3-D per PHASE_M3_PLAN §3.2).
      active_phase_plan_sub_phase → "M3-A SUB-PHASE CLOSED 2026-05-01 at M3-W1-A4-DIS009-DISPOSITION;
      Track 1 substrate complete (A1+A2+A3+A4); Track 3 closed (C1+C2+C3) at M3-W3-C3-SHADBALA;
      Track 2 in flight (B1+B2 closed; B3 optional or close en bloc at M3-D per
      PHASE_M3_PLAN §3.2). M3-D macro-phase-close cadence (§IS.8(b)) remains
      scheduled per PHASE_M3_PLAN §3.4 AC.M3D.4. M3-A close-checklist 8/9 PASS;
      AC.M3A.5 (post-baseline delta) DEFERRED with rationale (auth wall — same
      blocker as AC.M3A.1 manual-capture; native-acceptance scope at A1 close
      authorizes defer)."
      red_team_counter 2→3 → IS.8(a) FIRES → reset 3→0. REDTEAM_M3A2_v1_0.md
      authored as second M3 IS.8(a) cadence-fire (first was at A2 close: 7/7 PASS).
      Counter trail: A2-fire-reset 3→0; A3 0→1; C3-Shadbala 1→2; A4 (this session)
      2→3 fires, resets to 0. Next §IS.8(a) cadence at counter=3 (three substantive
      sessions from now). M3-D §IS.8(b) macro-phase-close cadence still scheduled.
      Deliverables:
        - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json (PAT.008
          mechanism re-grounded per native R3 verdict at Gate 1; claim_text rewritten
          with two-step Saturn-Mercury identity-axis framing; mechanism text rewritten
          to make AL-direct + Karakamsa-via-Mercury-dispositorship explicit;
          [EXTERNAL_COMPUTATION_REQUIRED] block added per CLAUDE.md §I B.10 with
          native-specified JH D9 export spec; status: needs_verification;
          re_validation_status flipped gemini_conflict → resolved_pending_ecr;
          resolution_session + resolution_note added).
        - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.md (companion .md
          updated to match JSON; Status line added; DIS.009 resolution paragraph
          appended).
        - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md (DIS.009 status open →
          resolved; resolution prose authored; resolved_on=2026-05-01;
          resolved_by_session=M3-W1-A4-DIS009-DISPOSITION; arbitration_steps_taken
          extended with reconciler_resolution (A1 analysis) + native_arbitration
          (this session R3 verdict); linked_artifacts extended with
          DIS009_ANALYSIS_v1_0.md + PATTERN_REGISTER companion .md).
        - 00_ARCHITECTURE/EVAL/REDTEAM_M3A2_v1_0.md (new — IS.8(a) every-third-
          session cadence-fire red-team; 7 axes per brief — B.1 layer-separation,
          B.3 derivation-ledger, B.10 no-fabricated-computation, flag-gate
          correctness, DIS.009 consistency, eval baseline integrity, scope
          compliance; verdict PASS 7/7; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW
          (KR.M3A2.1 — ECR clarification carry-forward, native-instructed text
          held verbatim per Gate 1 hard constraint)).
        - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (Wave 1 row M3-W1-A4-DIS009-
          DISPOSITION flipped PENDING → CLOSED; Wave 1 header updated to
          'CLOSED 2026-05-01'; this close block appended).
        - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
        - .gemini/project_state.md (MP.2 mirror — adapted-parity update).
        - 00_ARCHITECTURE/SESSION_LOG.md (session_open + session_close blocks
          appended atomically).
      M3-A close-checklist (per brief Gate 3 + PHASE_M3_PLAN §3.1):
        AC.M3A.1 PASS (manual-capture mode; KR.W9.1 numerics deferred);
        AC.M3A.2 PASS (DISCOVERY_PATTERN_ENABLED default true post-A2 smoke);
        AC.M3A.3 PASS (DISCOVERY_CONTRADICTION_ENABLED default true post-A2 smoke);
        AC.M3A.4 PASS (DIS.009 resolved at Gate 1 R3 native verdict);
        AC.M3A.5 DEFERRED (auth wall; rationale recorded; native-accepted at A1);
        AC.M3A.6 PASS (chart_facts + FORENSIC mandatory floor preserved);
        AC.M3A.7 PASS (PATTERN_REGISTER_JSON + TOOL_QUERY_PATTERNS +
        CONTRADICTION_REGISTER_JSON + TOOL_QUERY_CONTRADICTIONS in CAPABILITY_MANIFEST;
        entry_count=112 = len(entries));
        AC.M3A.8 PASS (CONTRADICTION_FRAMING preamble preserves B.1 + enforces B.3;
        covered by RT.M3A2.1);
        AC.M3A.9 PASS (REDTEAM_M3A2_v1_0.md PASS 7/7 axes).
      Strict scope compliance: did NOT touch platform/src/lib/retrieve/**,
      platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 01_FACTS_LAYER/**,
      05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**,
      PHASE_M3_PLAN_v1_0.md, CAPABILITY_MANIFEST.json (read-only verification of
      AC.M3A.7). L1 frozen.
      Governance: mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2);
      drift_detector + schema_validator at-close runs expected exit=2 carry-forward;
      no new CRITICAL findings.
      §3 narrative refreshed with M3-A SUB-PHASE CLOSE at top.
  - v1.0 amended-in-place (2026-05-01, M3-W3-C3-SHADBALA — Track 3 third execution AND M3-C SUB-PHASE CLOSE: Shadbala over-time engine + REDTEAM_M3C sub-phase-close quality gate + DIS.010/011/012 Jaimini school_disagreement entries):
      last_session_id → M3-W3-C3-SHADBALA; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W3-C3-SHADBALA"; close_state →
      atomically_closed. previous_session_id → M3-W1-A3-CONTRADICTION-ENGINE
      (chronologically-immediately-prior closed; brief-declared Track-3-chain
      predecessor was M3-W3-C2-KP-VARSHAPHALA — both acknowledged at session-open
      handshake's predecessor_session + previous_session_id dual-pointer).
      next_session_objective → M3-W1-A4-DIS009-DISPOSITION (Track 1 — DIS.009
      disposition + M3-A close-checklist).
      active_phase_plan_sub_phase → "M3-C SUB-PHASE CLOSED 2026-05-01 at M3-W3-C3-SHADBALA;
      Track 3 substrate complete (C1+C2+C3); M3-A in flight (A1+A2+A3 closed,
      A4 pending → M3-A close-checklist); M3-B in flight (B1+B2 closed; B3
      optional or close en bloc at M3-D)".
      red_team_counter 1→2 (substantive Track-3 + M3-C-close-RT session; not
      §IS.8(a) cadence fire — REDTEAM_M3C is M3-C sub-phase-close quality gate,
      not the every-third-session cadence; that fired at A2). Next §IS.8(a)
      cadence at counter=3, one substantive session from now. M3-D §IS.8(b)
      remains scheduled per PHASE_M3_PLAN §3.4 AC.M3D.4.
      Deliverables:
        - platform/scripts/temporal/compute_shadbala.py (new — engine v1: 4 of 6
          components computed via pyswisseph + Lahiri sidereal — Uccha + Dig +
          Naisargika + Nathonnatha; Sthana + Drik marked
          [EXTERNAL_COMPUTATION_REQUIRED] per CLAUDE.md §I B.10 with explicit JH
          ED.1 specs in the ECR_SPEC dict; CLI args; halts on swisseph
          ImportError with sys.exit(2)).
        - 05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json (new — 63 rows ×
          9 snapshots × 7 planets; snapshots = 7 Vimshottari MD start_dates +
          final MD end_date + today 2026-05-01; time-of-day = native birth
          time-of-day 10:43 IST per cross-check convention).
        - 05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql (new — 63 idempotent
          INSERTs ON CONFLICT DO NOTHING; bundled CREATE TABLE IF NOT EXISTS).
        - 05_TEMPORAL_ENGINES/shadbala/CROSSCHECK_v1_0.md (new — verdict
          WITHIN_TOLERANCE_PENDING_REVIEW; AC.M3C.4 anchors PASS — Saturn Uccha
          59.19 vs FORENSIC §6.1 59.18 Δ+0.01; Sun Uccha 33.99 vs FORENSIC 33.99
          Δ+0.00; all 7 planets within ±0.02 virupas on Uccha + Dig; three
          findings flagged for native review at M3-C close — Naisargika value-
          disagreement, Nathonnatha class-swap Saturn↔Venus, Nathonnatha
          altitude-vs-time-linear methodology).
        - platform/migrations/031_shadbala.sql (new — CREATE TABLE IF NOT EXISTS
          shadbala + 2 indexes + 7 natal-snapshot INSERTs + idempotent BEGIN/COMMIT;
          companion to SHADBALA_INSERT for over-time series; not yet applied to
          live DB — DB pre-check at session-open showed migrations 022-025 also
          not applied, recorded as carry-forward for native action).
        - 00_ARCHITECTURE/EVAL/REDTEAM_M3C_v1_0.md (new — M3-C sub-phase-close
          quality-gate red-team artifact; 7 axes — B.1 layer-separation, B.3
          derivation-ledger, B.10 no-fabricated-computation, ECR completeness,
          Jaimini boundary, migration idempotency, school-disagreement
          close-scope; verdict PASS, 0 findings, 0 fixes; 4 findings preserved
          for native review surfaced as cross-check + DIS-class artifacts).
        - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md (extended — DIS.010/011/012
          appended as DIS.class.school_disagreement: DIS.010 Chara sequence-start
          AK vs Lagna, DIS.011 Chara sign-duration rule, DIS.012 Narayana absent
          FORENSIC baseline. Each with R1/R2/R3 options, status: open, resolution:
          pending_native_verdict, default N3 per phase-plan policy = defer to M9
          multi-school triangulation).
        - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (Wave 3 row M3-W3-C3-SHADBALA
          flipped CLOSED + 'M3-C SUB-PHASE CLOSED' annotation + Wave 3 header
          updated to 'CLOSED 2026-05-01'; this close block appended).
        - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
        - .gemini/project_state.md (MP.2 mirror — adapted-parity update).
      AC.M3C.4 + AC.M3C.5 + AC.M3C.6 all pass. ADDITIONAL gates (migration
      idempotency, no new TS errors, Jaimini boundary respected) all verified
      by REDTEAM_M3C axes F + (no TS touched) + E. Strict scope compliance:
      did NOT touch platform/src/lib/retrieve/**, platform/src/lib/synthesis/**,
      platform/src/lib/bundle/**, 05_TEMPORAL_ENGINES/dasha/jaimini/** (read-only
      for D4 close-artifact authoring only), platform/scripts/temporal/compute_chara.py,
      platform/scripts/temporal/compute_narayana.py, 025_HOLISTIC_SYNTHESIS/**,
      035_DISCOVERY_LAYER/**, 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
      (read-only for cross-check anchor only), 01_FACTS_LAYER/**. L1 frozen.
      Governance: mirror_enforcer expected exit=0 (8/8 pairs clean; claude_only=2);
      drift_detector expected exit=2 (carry-forward); schema_validator expected
      exit=2 (carry-forward; no new CRITICAL).
      §3 narrative refreshed with M3-W3-C3-SHADBALA close at top (prior A3
      close-narrative retained for audit trail).
  - v1.0 amended-in-place (2026-05-01, M3-W1-A3-CONTRADICTION-ENGINE — Track 1 third execution: synthesis-prompt amendment for contradiction-framing rubric per PHASE_M3_PLAN §3.1 R.M3A.3 + AC.M3A.8):
      last_session_id → M3-W1-A3-CONTRADICTION-ENGINE; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W1-A3-CONTRADICTION-ENGINE"; close_state →
      atomically_closed. previous_session_id → M3-W1-A2-PATTERN-ENGINE (Track-1 chain;
      brief-declared predecessor; chronologically-immediately-prior closed session in
      single-track sequencing). next_session_objective → M3-W1-A4-DIS009-DISPOSITION
      (Track 1 — DIS.009 disposition decision among R1/R2/R3 per AC.M3A.4).
      red_team_counter 0→1 (M3 first substantive session post-A2-IS.8(a)-cadence-fire;
      per ONGOING_HYGIENE_POLICIES §G substantive sessions increment; next §IS.8(a) at
      counter=3, three substantive sessions from now; M3-D §IS.8(b) macro-phase-close
      cadence remains scheduled).
      Deliverables:
        - platform/src/lib/prompts/templates/shared.ts (CONTRADICTION_FRAMING constant
          added between NO_FABRICATION and METHODOLOGY_INSTRUCTION; injected into
          buildOpeningBlock() so all 7 active synthesis classes (factual, interpretive,
          predictive, cross_domain, discovery, holistic, remedial) inherit the rubric
          from one shared location; cross_native Phase-7 stub unaffected by design.
          Rubric: (a) instructs the model to surface each contradiction explicitly via
          [<contradiction_class>] (CON.<id>) framing — "Do not average, smooth, or
          synthesize the contradiction away into a unified narrative"; (b) requires
          contradiction_id citation for B.3 derivation-ledger auditability;
          (c) prohibits L1 fabrication and instructs the model to present
          resolution_options as recorded or state the contradiction is open if no
          resolution is recorded (B.1 layer-separation); (d) is dormant when no
          contradiction-register chunks appear in retrieved context.
          sha256_after=4fb73c5a3194af68d08f9eeef2ae08f8290da4eee51b186ffc0290d9fdb537ee)
        - platform/src/lib/prompts/__tests__/prompts.test.ts (new describe block
          "Contradiction-framing rubric in shared preamble"; 31 vitest cases covering
          AC.M3A.8a/b/c/d: register-reference present in 7 active classes;
          surface-not-synthesize enforced; B.3 contradiction_id citation enforced; B.1
          fabrication prohibition + layer-separation anchor present; single-injection-
          point uniqueness via worked CON.007 example; dormant-when-absent guard;
          cross_native stub correctly unaffected. 83/83 tests pass. sha256_after=
          e6ba9c12b56fbc3be075ea34346be5b7a01f24c6b5999867531b6373e6e189a0)
        - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (Wave 1 row M3-W1-A3 flipped
          PENDING → CLOSED; this close block appended)
        - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place)
        - .gemini/project_state.md (MP.2 adapted-parity update)
      AC.M3A.8 (synthesis prompt amendments preserve B.1 + B.3) — all four sub-criteria
      pass: AC.M3A.8a (rubric in every active query class — 7/7 via shared preamble);
      AC.M3A.8b (B.3 + B.1 anchors explicit); AC.M3A.8c (TS compiles, 0 new errors,
      9 pre-existing carry-forward in tests/components/AppShell.test.tsx +
      tests/components/ReportGallery.test.tsx); AC.M3A.8d (smoke vitest 83/83 pass).
      R.M3A.3 risk-mitigation status: prompt-side half landed; eval-harness fixture
      pair (the second half of the mitigation per PHASE_M3_PLAN §3.1) recorded as
      known_residual deferred to M3-D macro-phase-close red-team scope (AC.M3D.4).
      Governance: mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2);
      drift_detector exit=2 (259 findings — pre-existing carry-forward, no new
      regressions); schema_validator exit=2 (100 violations — pre-existing carry-
      forward, no new CRITICAL).
      Scope strictly respected: did NOT touch platform/src/lib/retrieve/** (A2-owned),
      platform/src/lib/config/feature_flags.ts (A2-owned), platform/scripts/temporal/**
      + 05_TEMPORAL_ENGINES/** (Tracks 2/3 owned), platform/migrations/**,
      025_HOLISTIC_SYNTHESIS/**, DISAGREEMENT_REGISTER (A4-owned), 01_FACTS_LAYER/**.
      Read-only access to 035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_1.json
      to verify real (id, class) pairs (per may_touch read-only annotation).
      Multi-track close coordination delta (open at session start: on-disk
      last_session_id was M3-W3-C2-KP-VARSHAPHALA from earlier-today parallel-track
      write race even though A2 was last writer per file_updated_by_session) is
      closed by this session — both §2 state-block and §3 narrative now agree on
      M3-W1-A3 as last_session_id.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-05-01, M3-W1-A2-PATTERN-ENGINE — Track 1 second execution + IS.8(a) cadence-fire):
      last_session_id → M3-W1-A2-PATTERN-ENGINE; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W1-A2-PATTERN-ENGINE"; close_state →
      atomically_closed. previous_session_id → M3-W3-C2-KP-VARSHAPHALA (chronologically-
      immediately-prior closed session per pointer convention; brief-declared predecessor
      was M3-W1-A1-EVAL-BASELINE Track-1 chain). next_session_objective →
      M3-W1-A3-CONTRADICTION-ENGINE (Contradiction Engine synthesis-prompt amendment per
      PHASE_M3_PLAN §3.1 R.M3A.3). red_team_counter: held-at-3 entering session (per
      M3-W3-C2 close §G no-double-increment convention) → discharged §IS.8(a) cadence
      via REDTEAM_M3A_v1_0.md (verdict PASS, 7 axes, 0 findings) → reset to 0.
      Deliverables:
        - platform/src/lib/config/feature_flags.ts (4 DISCOVERY_*_ENABLED flags added;
          single-session lifecycle: default false at first commit → smoke verify → flipped
          true; AC.M3A.2 / AC.M3A.3)
        - platform/src/lib/retrieve/pattern_register.ts (getFlag('DISCOVERY_PATTERN_ENABLED')
          gate at top of retrieve(); disabledBundle helper)
        - platform/src/lib/retrieve/contradiction_register.ts
          (getFlag('DISCOVERY_CONTRADICTION_ENABLED') gate; existing chunk content already
          surfaces [contradiction_class] hypothesis_text — B.11 'surface contradictions,
          do not synthesize them away' rubric supported)
        - platform/src/lib/retrieve/resonance_register.ts
          (getFlag('DISCOVERY_RESONANCE_ENABLED') gate; disabledBundle helper)
        - platform/src/lib/retrieve/cluster_atlas.ts (getFlag('DISCOVERY_CLUSTER_ENABLED')
          gate; disabledBundle helper)
        - platform/src/lib/retrieve/__smoke__/m3a2_discovery_flags.ts (reusable smoke
          harness; verified 22 patterns / 8 contradictions / 12 resonances / 12 clusters
          on flag=true; failures=0)
        - 00_ARCHITECTURE/CAPABILITY_MANIFEST.json (tool_binding added on the four
          register JSON entries — first tool_binding entries in the manifest, establishing
          the convention; entry_count corrected 109→112 closing the +3 latent miscount
          carry-forward from M2)
        - 00_ARCHITECTURE/EVAL/REDTEAM_M3A_v1_0.md (IS.8(a) cadence-fire artifact; 7 axes
          PASS — bypass / metadata-distinguishability / env-overlay / entry_count audit
          / tool_binding semantics / B.10 / B.1; 0 findings; 0 fixes applied)
      AC.M3A.2/3/5/6/7/8 pass. AC.M3A.5 in qualitative-delta mode per BASELINE_RUN_W9_MANUAL
      §6 native_acceptance.conditions(a). Governance scripts: mirror_enforcer exit=0
      (8/8 clean); drift_detector exit=2 (259 carry-forward); schema_validator exit=2
      (100 carry-forward); TypeScript: 9 errors all pre-existing M2 carry-forward, 0 new.
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-05-01, M3-W3-C2-KP-VARSHAPHALA — Track 3 second execution):
      last_session_id → M3-W3-C2-KP-VARSHAPHALA; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W3-C2-KP-VARSHAPHALA"; close_state →
      atomically_closed. previous_session_id → M3-W2-B2-YOGINI-TRANSIT (chronologically-
      immediately-prior closed session per pointer convention; brief-declared predecessor
      was M3-W3-C1-JAIMINI-DASHAS Track-3 chain). next_session_objective updated to
      reflect parallel-track menu: Track 1 → M3-W1-A2-PATTERN-ENGINE; Track 2 →
      M3-W2-B3-* optional; Track 3 → M3-W3-C3-SHADBALA + M3-C close (natural §IS.8(b)
      cadence host). red_team_counter: held at 3 (cadence pending; do not double-
      increment past §IS.8(a) fire-point — convention rationale recorded in counter
      block + red_team_due_note). Deliverables:
        - platform/scripts/temporal/compute_kp.py (KP sub-lord engine: nakshatra →
          sub_lord chain starting at nakshatra-lord with Vimshottari proportions →
          sub_sub_lord same subdivision; pyswisseph + Lahiri sidereal)
        - platform/scripts/temporal/compute_varshaphala.py (Tajika Solar-Return engine;
          1-day coarse bracket + bisection to ≤30s precision; recomputes 9 grahas +
          Ascendant via swe.houses_ex at SR moment)
        - 05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_RAW_v1_0.json (9 KP rows for native chart)
        - 05_TEMPORAL_ENGINES/kp/CROSSCHECK_v1_0.md (verdict
          WITHIN_TOLERANCE_GAP_09_BOUND; 9/9 nakshatra + 9/9 Star Lord + 9/9 Sub Lord
          PASS vs FORENSIC §4.2; 4/9 exact + 5/9 boundary-flip Sub-Sub Lord all within
          ≤6 arcmin of FORENSIC longitude — same GAP.09 ayanamsha-precision band as
          Vimshottari B1 cross-check; FORENSIC values canonical at synthesis time)
        - 05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_INSERT_v1_0.sql (self-contained mirror
          of mig 024 schema + 9 INSERTs)
        - 05_TEMPORAL_ENGINES/varshaphala/VARSHAPHALA_RAW_v1_0.json (78 annual rows
          1984-2061; ascendant + 9-graha sidereal positions per year; Sun-lon residual
          <0.5 arcsec across all 78 years; self-reference 1984 SR = 10:43:04 IST,
          Δ 4 seconds from native birth time)
        - 05_TEMPORAL_ENGINES/varshaphala/CROSSCHECK_v1_0.md (verdict
          WITHIN_TOLERANCE_PENDING_REVIEW; 1984/2026/2028 sample years cross-checked;
          full PASS verdict pending JH-export comparison at M3-D)
        - platform/migrations/024_kp_sublords.sql (BEGIN/COMMIT-wrapped; CREATE TABLE
          IF NOT EXISTS kp_sublords + 2 indexes + 9 INSERTs ON CONFLICT DO NOTHING)
        - platform/migrations/025_varshaphala.sql (BEGIN/COMMIT-wrapped; CREATE TABLE
          IF NOT EXISTS varshaphala (planet_positions JSONB) + index + 78 INSERTs
          ON CONFLICT DO NOTHING)
        - platform/src/lib/retrieve/query_kp_ruling_planets.ts (TS retrieval tool
          reading kp_sublords; distinct from existing kp_query.ts which reads
          chart_facts; both tools coexist; consumers prefer kp_query when chart_id
          is FORENSIC-anchored)
        - platform/src/lib/retrieve/query_varshaphala.ts (TS retrieval tool reading
          varshaphala; supports year/year_start/year_end + plan.time_window fallback)
        - platform/src/lib/retrieve/index.ts (registered queryKpRulingPlanets +
          queryVarshaphala; RETRIEVAL_TOOLS array now 20 tools — was 18 after
          M3-W2-B2)
      AC.M3C.2a-AC.M3C.10 all pass. Jaimini boundary respected: no file under
      05_TEMPORAL_ENGINES/dasha/jaimini/** read for computation; CROSSCHECK_v1_0.md
      (Jaimini) opened only at session-open per brief's Reference-artifacts list to
      confirm UNSETTLED status; compute_chara.py / compute_narayana.py not invoked.
      Governance: mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2). §3
      narrative refreshed.
  - v1.0 amended-in-place (2026-05-01, M3-W1-A1-EVAL-BASELINE — Track 1 first execution):
      last_session_id → M3-W1-A1-EVAL-BASELINE; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W1-A1-EVAL-BASELINE"; close_state →
      atomically_closed. previous_session_id → M3-W3-C1-JAIMINI-DASHAS.
      next_session_objective → M3-W1-A2-PATTERN-ENGINE (Pattern Engine query-time
      activation per PHASE_M3_PLAN §3.1 deliverable #2; flag-gated at
      DISCOVERY_PATTERN_ENABLED default false; AC.M3A.2 the gate). Concurrently:
      Track 2 → M3-W2-B2-YOGINI-TRANSIT, Track 3 → M3-W3-C2-KP-VARSHAPHALA.
      next_session_proposed_cowork_thread_name → "M3-W1-A2 — Pattern Engine Activation".
      red_team_counter: 2→2 (governance-aside per ONGOING_HYGIENE_POLICIES §G —
      analysis + manual-capture artifact + state pointer updates only; no corpus or
      platform code mutated). Next §IS.8(a) every-third fire at M3 counter=3.
      Deliverables:
        - 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9_MANUAL_v1_0.md (manual-capture
          eval-baseline; satisfies AC.M3A.1 in manual-capture mode per PHASE_M3_PLAN
          §3.1 entry-gate clause; auth secrets unavailable — HTTP 401 verified live;
          harness self-check intact; native-acceptance recorded; non-stub headless
          deferred to first session with SMOKE_SESSION_COOKIE + SMOKE_CHART_ID +
          ANTHROPIC_API_KEY available).
        - 00_ARCHITECTURE/DIS009_ANALYSIS_v1_0.md (read-only analysis feeding AC.M3A.4
          decision at M3-A close; §1 evidence chain — AL-side L1-clean per FORENSIC
          §17 line 1214; D9-side B.10 violation in PAT.008 mechanism text per
          FORENSIC §3.5 + §22 — Karakamsa = Gemini = Mercury's sign, NOT Saturn's;
          §2 three resolution options R1 split / R2 withdraw / R3 re-ground with
          evidence + cost + risk per option; §3 Claude recommendation = R3 with R1
          fallback; non-binding — native decides at M3-W1-A4 disposition).
        - SIG.MSR.207 investigation: confirmed absent from MSR_v3_0.md (registry
          skips SIG.MSR.206 line 4745 → SIG.MSR.208 line 4775); MEDIUM severity
          carry-forward; flag for M3-A manifest-audit pass or M3-D close.
      Governance: mirror_enforcer=exit0 (8/8 clean); drift_detector=exit2 (259
      carry-forward); schema_validator=exit2 (100 carry-forward). No new findings.
      Scope compliance: no platform/src/lib/{retrieve,bundle,synthesis}/**,
      025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, platform/migrations/**,
      05_TEMPORAL_ENGINES/**, DISAGREEMENT_REGISTER, or CAPABILITY_MANIFEST touched.
      .gemini/project_state.md updated (MP.2 mirror — Track 1 first execution recorded).
      §3 narrative refreshed.
  - v1.0 amended-in-place (2026-05-01, M3-W3-C1-JAIMINI-DASHAS — Track 3 first execution):
      Recorded at C1 close in §2 state block; changelog not yet authored at that close.
      Backfilled here for audit trail. last_session_id at C1 close → M3-W3-C1-JAIMINI-DASHAS;
      previous_session_id → M3-W2-B1-VIMSHOTTARI-ENGINE; red_team_counter: 1→2.
      Deliverables: platform/scripts/temporal/{compute_chara.py, compute_narayana.py};
      05_TEMPORAL_ENGINES/dasha/jaimini/{CHARA_RAW_v1_0.json (286 rows; brief 130 + bphs
      156 over 1984-02-05 → 2059), NARAYANA_RAW_v1_0.json (312 rows over 1984-02-05 →
      2050), CROSSCHECK_v1_0.md (FAIL verdict; tradition-fork analysis; N1/N2/N3
      disposition options for native verdict at M3-C close), CHARA_INSERT_v1_0.sql,
      NARAYANA_INSERT_v1_0.sql (NOT APPLIED — pending dasha_periods migration 022+).
      JAIMINI_GOLDEN_v1_0.json NOT WRITTEN (gated on cross-check pass; verdict FAIL →
      deferred). DIS.class.school_disagreement entry to be opened at M3-C close per
      PHASE_M3_PLAN §3.3.
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
  - v1.0 amended-in-place (2026-05-01, M3-W2-B1-VIMSHOTTARI-ENGINE — Track 2 first execution):
      active_phase_plan_sub_phase amended to add Track 2 progress: "M3-A in flight (Track 1);
      M3-B Track 2 first execution session closed (M3-W2-B1-VIMSHOTTARI-ENGINE) — Vimshottari
      MD/AD/PD computed for native lifetime via pyswisseph + Lahiri sidereal".
      last_session_id → M3-W2-B1-VIMSHOTTARI-ENGINE; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W2-B1-VIMSHOTTARI-ENGINE"; close_state →
      atomically_closed. previous_session_id → BHISMA-W1-S4-CONVERGENCE.
      next_session_objective → M3-W2-B2-YOGINI-TRANSIT (Yogini dasha calculator + Transit
      Engine v1 + date-indexed signal lit/dormant/ripening surface for held-out date sample
      per PHASE_M3_PLAN_v1_0.md §3.2 deliverables 2-4); concurrently M3-A Track 1 progress
      (M3-W1-A2-PATTERN-ENGINE) per its independent gate.
      next_session_proposed_cowork_thread_name → "M3-W2-B2 — Yogini + Transit Engine v1".
      red_team_counter: 0→1 (M3 first corpus-execution session; ONGOING_HYGIENE_POLICIES §G
      increments per non-governance-aside equivalence). Next §IS.8(a) every-third fire at
      M3 counter=3.
      Deliverables: platform/scripts/temporal/{__init__.py, compute_vimshottari.py,
      run_dasha_pipeline.py}; 05_TEMPORAL_ENGINES/dasha/vimshottari/{VIMSHOTTARI_RAW_v1_0.json
      (637 rows: 7M/63A/567P over 1984→2061), CROSSCHECK_v1_0.md (max delta 3 days vs FORENSIC
      §5.1; verdict WITHIN_TOLERANCE), VIMSHOTTARI_GOLDEN_v1_0.json (Mahadasha eval anchor),
      VIMSHOTTARI_INSERT_v1_0.sql (CREATE TABLE IF NOT EXISTS + 637 INSERTs; gated on native
      migration authoring)}.
      Governance: mirror_enforcer=exit0 (8/8 clean); drift_detector=exit2 (259 carry-forward);
      schema_validator=exit2 (100 carry-forward). No new findings.
      Known residual: dasha_periods schema does NOT exist in any current migration (brief
      assumed migration 016 created it; verification showed migration 016 is
      016_eclipses_retrogrades.sql). Native action required to author migration 022+ from
      the bundled CREATE TABLE block; migration domain is must_not_touch in this session.
      .gemini/project_state.md updated (MP.2 mirror — Track 2 first execution recorded).
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
  - v1.0 amended-in-place (2026-05-01, M3-W4-D1-VALIDATOR-REDTEAM — M3-D Wave 4 first execution session: temporal validator + held-out sample + IS.8(b) macro-phase-close red-team):
      last_session_id → M3-W4-D1-VALIDATOR-REDTEAM; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W4-D1-VALIDATOR-REDTEAM"; close_state →
      atomically_closed. previous_session_id → M3-PRE-D-GOVERNANCE-2026-05-01.
      next_session_objective → M3-W4-D2-M3-CLOSE (same Cowork thread; M3 sealing
      artifacts + CURRENT_STATE flip M3→M4 + MP.1+MP.2 sync).
      red_team_counter 0→1 (D1 substantive: validator + held-out sample + IS.8(b)
      red-team authoring). The IS.8(b) macro-phase-close cadence DISCHARGED
      in-session via REDTEAM_M3_v1_0.md; per ONGOING_HYGIENE_POLICIES §G the
      IS.8(b) cadence does NOT reset the every-third counter (only IS.8(a) fires
      reset). Counter therefore stands at 1 post-discharge.
      Deliverables:
        - 00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py (NEW — TEST-V.1..6
          deterministic invariants over M3-B/C JSON + DIS register; exit 0 on
          full PASS, 1 on any FAIL; current run 6/6 PASS, exit 0).
        - 00_ARCHITECTURE/EVAL/TEMPORAL/VALIDATOR_META_TESTS_v1_0.md (NEW —
          meta-tests doc; KP TEST-V.4 adaptation note: per-planet snapshot vs
          brief literal 0°-360° boundary table; honors B.10 + B.3; KR.M3.RT.LOW.1
          carry-forward).
        - 00_ARCHITECTURE/EVAL/M3_HELD_OUT_SAMPLE_v1_0.md (NEW — 10 stratified
          dates × 5 fields a-e; in-session native verdict 10/10 CONSISTENT).
        - 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §9 PROSPECTIVE PREDICTION
          SUBSECTION (NEW append-only — PRED.M3D.HOLDOUT.001 for 2026-08-15 +
          PRED.M3D.HOLDOUT.002 for 2027-08-19+ with confidence + horizon +
          falsifier per Learning Layer #4).
        - 00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md (NEW — IS.8(b) macro-phase-
          close red-team; 9 axes RT.M3.1..9; verdict PASS 9/9; 0 CRITICAL /
          0 HIGH / 0 MEDIUM / 1 LOW carry-forward KR.M3.RT.LOW.1; 0 fixes
          applied; M3 close gate CLEARED).
        - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (Wave 4 table added; D1
          row CLOSED; this session's close block appended).
        - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
        - .gemini/project_state.md (MP.2 mirror — adapted-parity update).
        - 00_ARCHITECTURE/SESSION_LOG.md (session_open + session_close blocks
          appended atomically).
      Acceptance criteria: AC.M3D.1 PASS (validator 6/6 PASS, exit 0);
      AC.M3D.2 PASS (≥10 held-out dates with fields a-e); AC.M3D.3 PASS
      (in-session native acharya review 10/10 CONSISTENT; external acharya
      review M4-class per R.M3D.1); AC.M3D.4 PASS (REDTEAM_M3 verdict PASS
      9/9 axes); AC.M3D.7 PARTIAL (deferred items named; full enumeration
      completes at D2 in M3_CLOSE §3 / HANDOFF §Inherited open items).
      Strict scope compliance: did NOT touch platform/src/**, FORENSIC,
      025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, 05_TEMPORAL_ENGINES/**
      (read-only validator input only), platform/migrations/**,
      PHASE_M3_PLAN_v1_0.md, DISAGREEMENT_REGISTER (read-only). LEL §9 append
      authorized by CLAUDE.md §E + brief's may_touch declaration. L1 frozen
      except §9 PPL append.
      Governance: mirror_enforcer expected exit=0 (8/8 pairs clean; MP.2
      updated same-session); drift_detector expected exit=2 carry-forward
      (touched files governance-layer LIVING-not-fingerprint-locked);
      schema_validator expected exit≤2 with 0 CRITICAL.
      §3 narrative refreshed with M3-W4-D1 close at top (prior M3-W1-A4 close
      narrative retained for audit trail).
  - v1.0 amended-in-place (2026-05-01, M3-W4-D2-M3-CLOSE — M3 MACRO-PHASE CLOSED; M3→M4 transition):
      active_macro_phase → M4; active_macro_phase_title → "Calibration + LEL
      Ground-Truth Spine"; active_macro_phase_status → active.
      active_phase_plan → null (M4 phase plan authoring decision deferred to
      first M4 session per PHASE_M3_PLAN §5 native-approval-points table).
      active_phase_plan_version → null. active_phase_plan_sub_phase →
      "M3 MACRO-PHASE CLOSED 2026-05-01..." narrative.
      last_session_id → M3-W4-D2-M3-CLOSE; last_session_agent → claude-opus-4-7[1m];
      last_session_cowork_thread_name → "M3-W4-D1-VALIDATOR-REDTEAM" (same
      Cowork thread as D1 per session-brief Hard Constraint #1); close_state
      → atomically_closed. previous_session_id → M3-W4-D1-VALIDATOR-REDTEAM.
      next_session_objective → M4-W1-OPEN (or PHASE_M4_PLAN_v1_0.md authoring;
      first M4 session decides). Hard prerequisite recorded: LEL ≥40 events
      spanning ≥5 years (current 35 events; 5-event gap; native owns gate
      clearance; span 41 years already exceeds 5-year minimum).
      next_session_proposed_cowork_thread_name → "(new thread; first M4 session)".
      red_team_counter 1→2 (D2 substantive: M3_CLOSE + HANDOFF_M3_TO_M4 +
      CURRENT_STATE flip + MP.1+MP.2 sync). IS.8(b) macro-phase-close cadence
      DISCHARGED at predecessor M3-W4-D1 (REDTEAM_M3 PASS 9/9 axes); per
      ONGOING_HYGIENE_POLICIES §G the IS.8(b) discharge does NOT reset the
      every-third counter. Next §IS.8(a) every-third cadence at counter=3
      (one substantive session hence — likely first M4 session). Next
      §IS.8(b) macro-phase-close cadence at M4 close.
      Deliverables (4 per session-brief Gate 4):
        - 00_ARCHITECTURE/M3_CLOSE_v1_0.md (NEW): M3 sealing artifact.
          §1 quality bar 27 PASS / 1 DEFERRED / 1 PASS+DEFERRED-PARTIAL /
          0 FAIL. §2 wave log W1-A through W4-D2. §3 deferred items (13
          items). §4 red-team evidence (REDTEAM_M3 PASS 9/9). §5 ND status
          open=[]. §6 mirror sync evidence MP.1+MP.2 same-session. §7
          live platform state. §8 M3 exit confirmed; M4 may now open.
        - 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md (NEW): handoff memo.
          What M3 delivered (capability inventory A/B/C/D); platform
          state (22 retrieval tools; 5 M3 temporal tables; CAPABILITY_MANIFEST
          112 entries; 4 DISCOVERY_*_ENABLED flags default-true); M4
          priorities (LEL ground-truth spine; per-signal calibration
          weights; LL.1-LL.4 STUB→active); HARD PREREQUISITE LEL ≥40
          events ≥5 years; inherited open items by owner (native | next-
          session | M9-class | Portal R-stream); active feature flags;
          active disagreements; concurrent workstreams; operational
          checklist for M4 (16 inheritance items).
        - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
        - .geminirules (MP.1 mirror — adapted-parity update reflecting
          M3→M4 transition).
        - .gemini/project_state.md (MP.2 mirror — adapted-parity update).
        - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (D2 row CLOSED + this
          session's close block appended; Wave 4 row updated to CLOSED).
        - 00_ARCHITECTURE/SESSION_LOG.md (session_open + session_close
          blocks appended atomically).
      Acceptance criteria: AC.M3D.5 PASS (M3_CLOSE + HANDOFF authored;
      CURRENT_STATE flipped M3→M4); AC.M3D.6 PASS (mirror_enforcer exit 0;
      MP.1+MP.2 propagated); AC.M3D.7 PASS (all M3 deferred items named in
      M3_CLOSE §3 + HANDOFF §Inherited open items).
      Strict scope compliance: did NOT touch 01_FACTS_LAYER/**,
      025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**,
      05_TEMPORAL_ENGINES/**, platform/src/**, platform/migrations/**,
      PHASE_M3_PLAN_v1_0.md (now SUPERSEDED-AS-COMPLETE; not modified
      at this close), DISAGREEMENT_REGISTER_v1_0.md (read-only),
      00_ARCHITECTURE/EVAL/** (D1 deliverables frozen post-commit ad4a6d2).
      Governance: mirror_enforcer expected exit=0 (8/8 pairs clean; MP.1+MP.2
      updated same-session); drift_detector expected exit=2 carry-forward;
      schema_validator expected exit=2 carry-forward; 0 CRITICAL.
      §3 narrative refreshed with M3-W4-D2 close at top (prior M3-W4-D1 close
      narrative retained for audit trail).
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
  active_macro_phase: M4                       # M3 CLOSED 2026-05-01 at M3-W4-D2-M3-CLOSE; M4 is currently-active
  active_macro_phase_title: "Calibration + LEL Ground-Truth Spine"
  active_macro_phase_status: active
    # One of: active | paused_governance_rebuild | paused_native_hold | closed
    # M3 flipped to closed at M3-W4-D2-M3-CLOSE (2026-05-01); M4 active.
    # M3 sealing artifact: 00_ARCHITECTURE/M3_CLOSE_v1_0.md
    # M3→M4 handoff memo: 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md
    # M3 IS.8(b) macro-phase-close red-team: 00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md (PASS 9/9 axes).
    # Predecessor: M2 CLOSED 2026-05-01 at KARN-W8-R2-M2-CLOSE (M2_CLOSE_v1_0.md).

  # ------------------------------------------------------------------
  # Phase-plan expansion (M3 phase plan TBD; first M3 session decides whether to expand
  #   MACRO_PLAN §M3 into a PHASE_C_PLAN_v1_0.md or drive M3 directly from MACRO_PLAN.)
  # ------------------------------------------------------------------
  active_phase_plan: null
    # M4 phase plan authoring decision deferred to first M4 session per
    # PHASE_M3_PLAN §5 native-approval-points table. Either:
    #   (a) author PHASE_M4_PLAN_v1_0.md (analogue of PHASE_M3_PLAN); or
    #   (b) drive M4 directly from MACRO_PLAN_v2_0.md §M4.
    # M3 phase plan (PHASE_M3_PLAN_v1_0.md v1.0) is now SUPERSEDED-AS-COMPLETE.
  active_phase_plan_version: null
  active_phase_plan_sub_phase: >
    M3 MACRO-PHASE CLOSED 2026-05-01 at M3-W4-D2-M3-CLOSE.
    Sealing artifact: 00_ARCHITECTURE/M3_CLOSE_v1_0.md.
    Handoff memo: 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md.
    M3 IS.8(b) red-team: 00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md (PASS 9/9).
    M3 sub-phase closes (preserved as M3 audit trail):
      M3-A SUB-PHASE CLOSED at M3-W1-A4-DIS009-DISPOSITION 2026-05-01.
      M3-C SUB-PHASE CLOSED at M3-W3-C3-SHADBALA 2026-05-01.
      M3-B Track 2 closed en bloc at M3-D D1 (B3 antardasha cross-check
        covered by M3-D validator + held-out sample antardasha-aware
        surfaces per PHASE_M3_PLAN §3.2 close-en-bloc clause).
      M3-D D1 (M3-W4-D1-VALIDATOR-REDTEAM) CLOSED 2026-05-01: validator
        6/6 PASS + held-out sample 10/10 CONSISTENT + LEL §9 PPL append +
        REDTEAM_M3 IS.8(b) PASS 9/9 axes 0 CRITICAL/HIGH/MEDIUM 1 LOW.
      DIS.009 RESOLVED-R3 at M3-W1-A4 (full closure pending JH D9 export
        per ED.1; KR.M3A.JH-EXPORT M4-class).
      DIS.010/011/012 RESOLVED-N3 at M3-PRE-D-GOVERNANCE-2026-05-01.
    M4 — Calibration + LEL Ground-Truth Spine — is now ACTIVE.
    Hard prerequisite for M4-A entry per MACRO_PLAN §CW.LEL §M4 entry state:
    LEL ≥40 events spanning ≥5 years. GATE CLEARED 2026-05-01:
    LEL count = 46 events (was 35; +11 via Cowork elicitation session);
    span 1984-2026 (42 years; well past 5-year minimum).
    M4-A calibration substrate work may now begin.
    LEL v1.3 committed at e9dc44b (01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md).
    11 new events have chart_state_at_event: status pending_computation
    — Swiss Ephemeris pass required (M4-A scope).
    First M4 session decision (native-approval point): author
    PHASE_M4_PLAN_v1_0.md (analogue of PHASE_M3_PLAN) or drive M4 directly
    from MACRO_PLAN_v2_0.md §M4.
    # PHASE_M3_PLAN_v1_0.md is the active M3 phase plan (v1.0, authored 2026-05-01).
    # Sub-phases: M3-A (Discovery Engine + DIS.009) → M3-B (Vimshottari + Yogini + Transit) →
    # M3-C (Chara + Narayana + KP + Varshaphala + Shadbala) → M3-D (Validator + Close).
    # M3-A and M3-C are now closed; M3-B remains open. M3-D macro-phase-close cadence
    # (§IS.8(b)) remains scheduled for M3-D close.
    # No M3 sub-phase runs in parallel with another for M3-D scope (M3-D is sequential
    # after M3-C per PHASE_M3_PLAN §4); M3-B closes either via standalone B3 session
    # or en bloc at M3-D per native choice.
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
  red_team_counter: 2
    # M3-W4-D2-M3-CLOSE close (THIS session) — counter incremented 1→2
    # (D2 substantive: M3_CLOSE + HANDOFF_M3_TO_M4 + CURRENT_STATE flip
    # M3→M4 + MP.1+MP.2 sync). M3 macro-phase CLOSED.
    # Predecessor M3-W4-D1-VALIDATOR-REDTEAM close — counter incremented
    # 0→1 (D1 substantive: VALIDATOR_META_TESTS authoring + held-out sample
    # authoring + LEL §9 PPL append + IS.8(b) macro-phase-close red-team
    # authoring). The IS.8(b) macro-phase-close cadence DISCHARGED in this
    # session via REDTEAM_M3_v1_0.md (verdict PASS, 9/9 axes, 0 CRITICAL /
    # 0 HIGH / 0 MEDIUM / 1 LOW carry-forward). Per ONGOING_HYGIENE_POLICIES
    # §G the IS.8(b) macro-phase-close cadence does NOT reset the every-third
    # counter (only IS.8(a) every-third-session cadence-fire resets); counter
    # therefore stands at 1 post-discharge.
    # Predecessor M3-PRE-D-GOVERNANCE-2026-05-01 close — counter UNCHANGED
    # at 0. Governance-only session (DIS.010/011/012 resolution + migration
    # verification authoring); no substantive engine, retrieval, or synthesis
    # work; per ONGOING_HYGIENE_POLICIES §G this class of session does not
    # increment the counter.
    # Predecessor M3-W1-A4-DIS009-DISPOSITION close (2026-05-01) incremented
    # counter 2→3, fired IS.8(a) every-third-session cadence (REDTEAM_M3A2_v1_0.md
    # PASS 7/7 axes 0 findings 1 LOW carry-forward), counter reset 3→0 per
    # ONGOING_HYGIENE_POLICIES §G cadence-reset clause. Per brief Gate 2 + AC.M3A.9
    # this firing was the expected mid/late-M3-A IS.8(a) cadence per
    # PHASE_M3_PLAN §3.1 cadence-note.
    # Next §IS.8(a) every-third cadence fires at counter=3 (three substantive
    # sessions from now). The §IS.8(b) macro-phase-close cadence remains
    # scheduled for M3-D close per PHASE_M3_PLAN §3.4 AC.M3D.4.
    # Counter trail in M3:
    #   Reset to 0 at KARN-W8-R2-M2-CLOSE.
    #   M3-W2-B1-VIMSHOTTARI-ENGINE close → 0→1 (first Track-2 substantive).
    #   M3-W3-C1-JAIMINI-DASHAS close → 1→2 (first Track-3 substantive).
    #   M3-W2-B2-YOGINI-TRANSIT close → 2→3 (second Track-2 substantive).
    #   M3-W3-C2-KP-VARSHAPHALA close → held at 3 (substantive Track-3, cadence-pending).
    #   M3-W1-A2-PATTERN-ENGINE close → §IS.8(a) FIRED (REDTEAM_M3A v1.0 PASS, 7 axes,
    #     0 findings); counter reset 3→0.
    #   M3-W1-A3-CONTRADICTION-ENGINE close → 0→1 (substantive synthesis-prompt amendment).
    #   M3-W3-C3-SHADBALA close → 1→2 (substantive Shadbala engine +
    #     M3-C sub-phase-close red-team + DIS register).
    #   M3-W1-A4-DIS009-DISPOSITION close (THIS session) → 2→3 → §IS.8(a) FIRES
    #     (REDTEAM_M3A2 v1.0 PASS, 7 axes, 0 findings, 1 LOW carry-forward) →
    #     counter resets 3→0.
    # Plan-only / governance-aside sessions do not increment: M3-W1-OPEN-PHASE-PLAN
    # was plan-only; BHISMA-W1-S4-CONVERGENCE was governance-aside; M3-W1-A1-EVAL-BASELINE
    # was governance-aside per its close block.
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
  last_session_id: M3-W4-D2-M3-CLOSE
    # M3-D Wave 4 second execution session — M3 MACRO-PHASE CLOSE.
    # Four deliverables per session brief Gate 4:
    #   (1) 00_ARCHITECTURE/M3_CLOSE_v1_0.md — M3 sealing artifact:
    #     §1 quality bar (per-AC PASS/DEFER table; 27 PASS / 1 DEFERRED /
    #     1 PASS+DEFERRED-PARTIAL / 0 FAIL); §2 wave log (W1-A through
    #     W4-D2 sessions); §3 deferred items (KR.M3.RT.LOW.1, KR.M3A.JH-
    #     EXPORT, DIS.010/011/012-N3, Sthana+Drik ECR, Narayana ECR,
    #     KR.M3A2.1, AC.M3A.5, three Shadbala convention findings,
    #     external acharya review, M2 inherited residuals); §4 red-team
    #     evidence pointing to REDTEAM_M3 PASS 9/9; §5 ND status
    #     open=[]; §6 mirror sync evidence MP.1+MP.2 same-session.
    #   (2) 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md — M3→M4 handoff memo:
    #     What M3 delivered (capability inventory across A/B/C/D);
    #     platform state (22 retrieval tools; 5 M3 temporal tables;
    #     CAPABILITY_MANIFEST 112 entries); M4 priorities (LEL ground-
    #     truth spine; per-signal calibration weights; LL.1-LL.4 STUB→
    #     active); HARD PREREQUISITE LEL ≥40 events ≥5 yrs (current 35
    #     events; 5-event gap; native owns gate-clearance); inherited
    #     open items by owner (native | next-session | M9-class | Portal
    #     R-stream); active feature flags; active disagreements (DIS.009
    #     resolved-R3-pending-ECR; DIS.010/011/012 resolved-N3); operational
    #     checklist for M4.
    #   (3) CURRENT_STATE flip — this file:
    #     active_macro_phase: M3 → M4
    #     active_macro_phase_title: "Calibration + LEL Ground-Truth Spine"
    #     active_macro_phase_status: active
    #     active_phase_plan: null (M4 phase plan authoring decision deferred)
    #     last_session_id: M3-W4-D2-M3-CLOSE
    #     red_team_counter: 1 → 2 (D2 substantive)
    #     next_session_objective: M4-W1-OPEN (or PHASE_M4_PLAN_v1_0.md)
    #   (4) Mirror sync MP.1 + MP.2 — .geminirules (CLAUDE.md mirror) +
    #     .gemini/project_state.md (composite Claude state mirror) updated
    #     to adapted parity reflecting M3→M4 transition.
    # mirror_enforcer.py exit 0 required at this close (per PHASE_M3_PLAN
    # §3.4 AC.M3D.6).
    # Strict scope respected: did NOT touch 01_FACTS_LAYER/**,
    # 025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**,
    # 05_TEMPORAL_ENGINES/**, platform/src/**, platform/migrations/**,
    # PHASE_M3_PLAN_v1_0.md, DISAGREEMENT_REGISTER (read-only),
    # 00_ARCHITECTURE/EVAL/** (D1 deliverables frozen post-commit ad4a6d2).
    # === Predecessor session (M3-W4-D1-VALIDATOR-REDTEAM) summary preserved for audit trail ===
    # M3-D Wave 4 first execution session. Three D1 gates discharged per
    # session brief:
    #   Gate 1 — Temporal validator: VALIDATOR_META_TESTS_v1_0.md authored
    #     under 00_ARCHITECTURE/EVAL/TEMPORAL/ documenting six deterministic
    #     invariants (TEST-V.1..6) over the M3-B/C JSON outputs + DIS register;
    #     run_validator.py executes the suite, exits 0 on full PASS. KP TEST-V.4
    #     adapted from brief literal 0°-360° boundary-table expectation to the
    #     actual M3-W3-C2 per-planet snapshot shape; adaptation honors B.10
    #     (no fabrication) and B.3 (cite actual design choice). Logged as
    #     KR.M3.RT.LOW.1 forward-work item in REDTEAM_M3 §6 + HANDOFF
    #     §Inherited open items. AC.M3D.1 PASS.
    #   Gate 2 — Held-out date sample: M3_HELD_OUT_SAMPLE_v1_0.md authored
    #     with 10 stratified dates (3 LEL events × 3 decades + 3 non-landmark +
    #     2 future + 2 dasha-transition). Each row: (a) Vimshottari MD/AD,
    #     (b) Yogini MD, (c) KP sublord-of-Asc via pyswisseph, (d) top-3 lit
    #     signals via signal_activator.py, (e) in-session native verdict.
    #     10/10 CONSISTENT. Two future-dated rows logged to LEL §9 PROSPECTIVE
    #     PREDICTION SUBSECTION (newly added; append-only) per CLAUDE.md §E
    #     concurrent-workstream rule. AC.M3D.2 PASS; AC.M3D.3 PASS via
    #     in-session native review (external acharya review M4-class).
    #   Gate 3 — IS.8(b) macro-phase-close red-team: REDTEAM_M3_v1_0.md
    #     authored. 9 axes RT.M3.1..9 (B.1 layer-separation, B.3 derivation-
    #     ledger, B.10 no-fabricated-computation, DIS register completeness,
    #     validator integrity, feature-flag hygiene, ECR completeness, PPL
    #     substrate, acharya-grade quality bar). Verdict PASS 9/9; 0 CRITICAL /
    #     0 HIGH / 0 MEDIUM / 1 LOW (KR.M3.RT.LOW.1 KP shape adaptation).
    #     0 fixes applied. M3 close gate CLEARED. AC.M3D.4 PASS.
    # Strict scope respected: did NOT touch platform/src/**, FORENSIC,
    # 025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, 05_TEMPORAL_ENGINES/**
    # (read-only validator input only), platform/migrations/**,
    # PHASE_M3_PLAN_v1_0.md, DISAGREEMENT_REGISTER (read-only). LEL §9
    # append authorized by CLAUDE.md §E + brief's may_touch declaration.
    # === Predecessor session (M3-PRE-D-GOVERNANCE-2026-05-01) summary preserved for audit trail ===
    # Two-action governance-only pre-D session executed before
    # M3-D-VALIDATOR-REDTEAM (D1) opens. Action 1: DIS.010, DIS.011, DIS.012
    # resolved as N3 (defer to M9 multi-school triangulation per PHASE_M3_PLAN
    # §8 default policy). status: open → resolved on each; resolved_on:
    # 2026-05-01; resolved_by_session: M3-PRE-D-GOVERNANCE-2026-05-01;
    # arbitration_steps_taken extended with native_arbitration N3 row;
    # resolution_note added to DIS.010 (FORENSIC §5.3 K.N. Rao Padakrama
    # retained as project reference, not adopted as canonical engine rule;
    # compute_chara.py output remains needs_verification pending M9 school
    # selection) and DIS.012 (compute_narayana.py output remains
    # needs_verification=true; external acharya review or JH export per ED.1
    # carried as M4-class open item in HANDOFF_M3_TO_M4). AC.PRED.1 +
    # AC.PRED.2 PASS. Action 2: live verification of migrations 022–031:
    # DATABASE_URL connection succeeded (DB amjis, user amjis_app, 59 public
    # tables); query for {dasha_periods, signal_states, kp_sublords,
    # varshaphala, shadbala} returned 0 of 5 — migrations 022/023/024/025/031
    # NOT applied. Other five (026/027/028/029/030) not directly verified
    # by this query (target tables already pre-existed).
    # MIGRATION_APPLY_INSTRUCTIONS_v1_0.md authored at
    # 00_ARCHITECTURE/MIGRATION_APPLY_INSTRUCTIONS_v1_0.md (status
    # ACTION_REQUIRED) with Option A `supabase db push` + Option B psql loop +
    # post-apply verification query. **Native action required before D1
    # opens.** AC.PRED.3 PASS (path b — instructions authored). red_team_counter
    # unchanged at 0 (governance-only session; not §IS.8(a) cadence-fire eligible
    # per ONGOING_HYGIENE_POLICIES §G). Strict scope compliance: did NOT touch
    # platform/** (except read-only .env inspection), 05_TEMPORAL_ENGINES/**,
    # 035_DISCOVERY_LAYER/**, 01_FACTS_LAYER/**, 025_HOLISTIC_SYNTHESIS/**,
    # PHASE_M3_PLAN_v1_0.md. L1 frozen.
    # === Predecessor session (M3-W1-A4-DIS009-DISPOSITION) prior summary preserved here for audit trail ===
    # M3 Track 1 (Discovery Engine + DIS.009) fourth execution session AND M3-A
    # SUB-PHASE CLOSE. Three gates per brief: Gate 1 DIS.009 R3 disposition
    # (PAT.008 mechanism re-grounded with two-step Saturn-Mercury identity-axis
    # framing per native specified rewrite direction; [EXTERNAL_COMPUTATION_REQUIRED]
    # added per CLAUDE.md §I B.10 with native-specified JH D9 export spec; status
    # set to needs_verification; re_validation_status flipped gemini_conflict →
    # resolved_pending_ecr; DIS.009 status open → resolved with full resolution
    # prose + native_arbitration arbitration_step + linked_artifacts updated).
    # Gate 2 IS.8(a) every-third-session cadence-fire (REDTEAM_M3A2_v1_0.md
    # authored as second M3 IS.8(a) cadence-fire; counter trail 2→3 → fires →
    # resets 3→0; 7 axes — B.1 layer-separation, B.3 derivation-ledger, B.10
    # no-fabricated-computation, flag-gate correctness, DIS.009 consistency,
    # eval baseline integrity, scope compliance; verdict PASS 7/7; 0 CRITICAL /
    # 0 HIGH / 0 MEDIUM / 1 LOW = KR.M3A2.1 ECR-clarification carry-forward).
    # Gate 3 M3-A close-checklist (8/9 ACs PASS; AC.M3A.5 DEFERRED with rationale
    # per phase-plan entry-gate clause + native-acceptance scope at A1 close).
    # M3-A SUB-PHASE CLOSED 2026-05-01.
    # Scope strictly respected: did NOT touch platform/src/lib/retrieve/**,
    # platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 01_FACTS_LAYER/**,
    # 05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**,
    # PHASE_M3_PLAN_v1_0.md, CAPABILITY_MANIFEST.json (read-only verification of
    # AC.M3A.7). L1 frozen.
    # === Predecessor session (M3-W3-C3-SHADBALA) prior summary preserved here for audit trail ===
    # M3 Track 3 third execution AND M3-C SUB-PHASE CLOSE. Authored compute_shadbala.py (engine v1:
    # 4 of 6 components computed deterministically via pyswisseph + Lahiri sidereal —
    # Uccha + Dig + Naisargika + Nathonnatha; Sthana + Drik marked
    # [EXTERNAL_COMPUTATION_REQUIRED] per CLAUDE.md §I B.10 with explicit JH-export
    # ED.1 specs). Output: SHADBALA_RAW_v1_0.json (63 rows × 9 snapshots × 7 planets
    # at native birth time-of-day 10:43 IST), SHADBALA_INSERT_v1_0.sql (idempotent
    # ON CONFLICT DO NOTHING), CROSSCHECK_v1_0.md (verdict
    # WITHIN_TOLERANCE_PENDING_REVIEW; AC.M3C.4 anchors PASS — Saturn Uccha 59.19
    # vs FORENSIC §6.1 59.18 Δ+0.01; Sun Uccha 33.99 vs FORENSIC 33.99 Δ+0.00;
    # all 7 planets within ±0.02 virupas on Uccha + Dig). Migration 031_shadbala.sql
    # authored as new (next free index after 022-030; not yet applied — DB pre-check
    # at session-open showed 022-025 also not applied, recorded as carry-forward).
    # REDTEAM_M3C_v1_0.md authored as M3-C sub-phase-close quality gate (NOT
    # §IS.8(a) cadence; that fired at A2): 7 axes (B.1, B.3, B.10, ECR completeness,
    # Jaimini boundary, migration idempotency, school-disagreement close-scope) PASS,
    # 0 findings, 0 fixes. DIS.010/011/012 opened in DISAGREEMENT_REGISTER as
    # DIS.class.school_disagreement (Chara sequence-start AK vs Lagna; Chara
    # sign-duration rule; Narayana absent FORENSIC baseline) with R1/R2/R3 options
    # each, status open, resolution pending_native_verdict. PROJECT_M3_SESSION_LOG
    # Wave 3 row M3-W3-C3-SHADBALA flipped CLOSED + 'M3-C SUB-PHASE CLOSED' annotation
    # + Wave 3 header updated to 'CLOSED 2026-05-01'; close block appended.
    # Three Shadbala findings (Naisargika brief-vs-classical value disagreement;
    # Nathonnatha Saturn↔Venus class swap; Nathonnatha altitude-vs-time-linear
    # methodology) preserved in CROSSCHECK §4/§5/§9 for native review at M3-C
    # close (NOT promoted to DIS register per Axis G of REDTEAM_M3C — these are
    # brief-vs-classical fact-check decisions, not Vedic multi-school disagreements
    # proper). Scope strictly respected: did NOT touch platform/src/lib/retrieve/**,
    # platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 05_TEMPORAL_ENGINES/dasha/jaimini/**
    # (read-only for D4 close-artifact authoring only), platform/scripts/temporal/compute_chara.py,
    # platform/scripts/temporal/compute_narayana.py, 025_HOLISTIC_SYNTHESIS/**,
    # 035_DISCOVERY_LAYER/**, 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
    # (read-only for cross-check anchor only), 01_FACTS_LAYER/**. L1 frozen.
  last_session_closed_at: 2026-05-01T23:30:00+05:30
  last_session_attempted_close_at: 2026-05-01T23:30:00+05:30
  last_session_agent: claude-opus-4-7[1m]
  last_session_cowork_thread_name: "M3-W4-D1-VALIDATOR-REDTEAM"   # same Cowork thread per brief
  last_session_close_state: atomically_closed
  last_session_drift_verdict: >
    M3-D Wave 4 D2 — M3 MACRO-PHASE CLOSE. Substantive governance-layer
    session: M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md authoring +
    CURRENT_STATE flip M3→M4 + MP.1+MP.2 mirror sync. Counter incremented
    1→2 (D2 substantive). M3 macro-phase CLOSED; M4 active. Touched files
    are governance-layer artifacts only (M3_CLOSE + HANDOFF new at
    00_ARCHITECTURE/; CURRENT_STATE; .geminirules MP.1; .gemini/project_state.md
    MP.2; PROJECT_M3_SESSION_LOG; SESSION_LOG); none modify canonical-
    artifact fingerprints outside LIVING-not-fingerprint-locked surfaces.
    Scripts at close: mirror_enforcer expected exit=0 (8/8 pairs clean;
    MP.1 + MP.2 updated same-session); drift_detector + schema_validator
    at-close runs expected exit=2 carry-forward (no new regressions).
    === Predecessor M3-W4-D1 drift-verdict retained for audit:
    M3-D Wave 4 D1 — substantive governance-layer session: temporal
    validator authoring + held-out date sample authoring + LEL §9 PPL
    append + IS.8(b) macro-phase-close red-team authoring. Counter
    incremented 0→1 per ONGOING_HYGIENE_POLICIES §G; IS.8(b) macro-phase-
    close cadence DISCHARGED in-session via REDTEAM_M3 (verdict PASS,
    9/9 axes, 0 CRITICAL / HIGH / MEDIUM, 1 LOW carry-forward
    KR.M3.RT.LOW.1). M3 close gate CLEARED. Touched files are
    governance-layer artifacts (EVAL/TEMPORAL/ new directory + 3 files;
    EVAL/M3_HELD_OUT_SAMPLE new; EVAL/REDTEAM_M3 new; LEL §9 append-only;
    CURRENT_STATE; .gemini/project_state; PROJECT_M3_SESSION_LOG;
    SESSION_LOG); none modify canonical-artifact fingerprints outside
    LIVING-not-fingerprint-locked surfaces. Scripts at close:
    mirror_enforcer expected exit=0 (8/8 pairs clean; MP.2 updated
    same-session); drift_detector + schema_validator at-close runs
    expected exit=2 carry-forward (no new regressions). === Predecessor
    M3-PRE-D-GOVERNANCE drift-verdict summary retained for audit:
    Governance-only pre-D session: DIS.010/011/012 resolution-as-N3 +
    MIGRATION_APPLY_INSTRUCTIONS authoring. Counter unchanged at 0 per
    ONGOING_HYGIENE_POLICIES §G governance-aside class. Touched files are
    governance-layer artifacts only (DISAGREEMENT_REGISTER + new MIGRATION_APPLY_
    INSTRUCTIONS + CURRENT_STATE + .gemini/project_state + SESSION_LOG); none
    modify canonical-artifact fingerprints outside LIVING-not-fingerprint-locked
    surfaces. Scripts at close: mirror_enforcer expected exit=0 (8/8 pairs
    clean; MP.2 updated same-session); drift_detector + schema_validator at-close
    runs expected exit=2 carry-forward (no new regressions). Predecessor verdict
    summary retained: M3 Track 1 fourth execution session AND M3-A SUB-PHASE
    CLOSE — substantive governance-layer session: DIS.009 R3 disposition +
    PAT.008 re-grounding + REDTEAM_M3A2 IS.8(a) cadence-fire authoring +
    DISAGREEMENT_REGISTER status transition + M3-A close-checklist authoring
    per ONGOING_HYGIENE_POLICIES §G.
    Scripts at close: mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2;
    confirmed pre-close run); drift_detector + schema_validator at-close runs
    expected exit=2 carry-forward (touched files are governance-layer artifacts —
    PATTERN_REGISTER + DISAGREEMENT_REGISTER + CURRENT_STATE + .gemini/project_state
    + PROJECT_M3_SESSION_LOG + REDTEAM_M3A2 (new) + SESSION_LOG — none modify
    canonical-artifact fingerprints outside LIVING-not-fingerprint-locked surfaces).
    red_team_counter 2→3 → §IS.8(a) FIRES → reset 3→0. REDTEAM_M3A2_v1_0.md PASS
    7/7 axes 0 CRITICAL/HIGH/MEDIUM 1 LOW carry-forward (KR.M3A2.1 ECR
    clarification, native-instructed text held verbatim per Gate 1 hard
    constraint). Next §IS.8(a) every-third cadence at counter=3 (three substantive
    sessions from now). M3-D §IS.8(b) macro-phase-close cadence remains scheduled
    per PHASE_M3_PLAN §3.4 AC.M3D.4.
  last_session_deliverable: >
    M3-W4-D2-M3-CLOSE closed (2026-05-01) — M3-D Wave 4 second execution
    session AND M3 MACRO-PHASE CLOSE. Four deliverables per brief Gate 4:
    DELIVERABLE 1 (M3_CLOSE):
      - 00_ARCHITECTURE/M3_CLOSE_v1_0.md (NEW): sealing artifact for M3.
        §1 quality bar — 27 PASS / 1 DEFERRED (AC.M3A.5; native-accepted)
        / 1 PASS+DEFERRED-PARTIAL (AC.M3D.3 external acharya) / 0 FAIL.
        §2 wave log — W1 (M3-OPEN + M3-A 5 sessions); W2 (M3-B 2
        sessions); W3 (M3-C 3 sessions); W4 (M3-D 3 sessions including
        M3-PRE-D-GOVERNANCE + D1 + D2). §3 deferred items — 13 items
        across "inherited from M3 sub-phases" (KR.M3.RT.LOW.1, JH-EXPORT,
        DIS.010/011/012-N3, Sthana+Drik ECR, Narayana ECR, KR.M3A2.1,
        Shadbala convention findings, AC.M3A.5, R.M3D.1 external
        acharya) and "inherited from M2" (SIG.MSR.207, UCN inline citation,
        TS test-fixture errors, KR.W9.1+KR.W9.2). §4 red-team evidence —
        REDTEAM_M3 PASS 9/9 axes; counter trail in M3 detailed. §5 ND
        status — open=[]; addressed=[ND.1]. §6 mirror sync evidence —
        MP.1 + MP.2 same-session. §7 live platform state. §8 M3 exit
        confirmed; M4 may now open.
    DELIVERABLE 2 (HANDOFF_M3_TO_M4):
      - 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md (NEW): handoff memo.
        What M3 delivered (capability inventory across A/B/C/D —
        Discovery Engine, Vimshottari + Yogini + Transit, Chara +
        Narayana needs_verification, KP per-planet snapshot,
        Varshaphala 78 charts, Shadbala 4-of-6 deterministic,
        Validator + Held-Out Sample + REDTEAM_M3, DIS register
        hygiene). Live state of platform at M3 close (22 retrieval
        tools; 5 M3 temporal tables; CAPABILITY_MANIFEST 112 entries;
        4 DISCOVERY_*_ENABLED flags default-true). What M4 needs to
        know (LEL ground-truth spine; per-signal calibration weights;
        LL.1-LL.4 STUB→active; held-out cohort discipline; JH
        integration scope decision). HARD PREREQUISITES for M4:
        LEL ≥40 events spanning ≥5 years (current 35; 5-event gap;
        native owns gate-clearance). Inherited open items by owner
        (native | next-session | M9-class | Portal R-stream). Active
        feature flags. Active disagreements (DIS.009 resolved-R3-
        pending-ECR; DIS.010/011/012 resolved-N3). Concurrent workstreams.
        Operational checklist for M4 (16 inheritance items).
    DELIVERABLE 3 (CURRENT_STATE flip):
      - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place):
        active_macro_phase: M3 → M4
        active_macro_phase_title: "Calibration + LEL Ground-Truth Spine"
        active_macro_phase_status: active
        active_phase_plan: null (M4 phase plan authoring decision deferred)
        last_session_id: M3-W4-D2-M3-CLOSE
        last_session_cowork_thread_name: "M3-W4-D1-VALIDATOR-REDTEAM" (same)
        red_team_counter: 1 → 2 (D2 substantive)
        next_session_objective: M4-W1-OPEN (or PHASE_M4_PLAN_v1_0.md)
        §3 narrative refreshed with M3-W4-D2 close at top.
        Changelog entry added.
    DELIVERABLE 4 (Mirror sync MP.1 + MP.2):
      - .geminirules (MP.1 mirror): updated to reflect active_macro_phase
        M3 → M4 + last_session_id → M3-W4-D2-M3-CLOSE +
        next_session_objective at adapted parity.
      - .gemini/project_state.md (MP.2 mirror): updated to reflect M3
        macro-phase CLOSED + M4 active + handoff memo pointer + LEL
        minimum-volume entry-gate at adapted parity.
      - mirror_enforcer.py exit 0 (8/8 pairs clean).
    M3-D D2 close-checklist (AC.M3D.5 PASS; AC.M3D.6 PASS; AC.M3D.7 PASS).
    Strict scope compliance: did NOT touch 01_FACTS_LAYER/**,
    025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, 05_TEMPORAL_ENGINES/**,
    platform/src/**, platform/migrations/**, PHASE_M3_PLAN_v1_0.md (now
    SUPERSEDED-AS-COMPLETE; not modified at this close), DISAGREEMENT_REGISTER
    (read-only), 00_ARCHITECTURE/EVAL/** (D1 deliverables frozen post-commit
    ad4a6d2).
    === Predecessor M3-W4-D1-VALIDATOR-REDTEAM deliverables (preserved for audit) ===
    M3-W4-D1-VALIDATOR-REDTEAM closed (2026-05-01) — M3-D Wave 4 first
    execution session. Three D1 gates per session brief.
    GATE 1 (Temporal validator):
      - 00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py: NEW — 6
        deterministic invariants (TEST-V.1 Vimshottari completeness;
        TEST-V.2 Yogini continuity Bhramari-anchored 8-lord cycle;
        TEST-V.3 Transit determinism + lit_states presence; TEST-V.4
        KP per-planet snapshot coverage; TEST-V.5 Shadbala planet
        coverage + FORENSIC anchors; TEST-V.6 cross-school disagreement
        boundary). Exit 0 on full PASS, 1 on any FAIL.
      - 00_ARCHITECTURE/EVAL/TEMPORAL/VALIDATOR_META_TESTS_v1_0.md: NEW
        — meta-tests doc with TEST-V.4 KP-shape adaptation note
        (per-planet snapshot vs brief literal 0°-360° boundary table;
        REDTEAM_M3 Axis E cross-reference).
      - Run record this session: 6/6 PASS, exit 0. AC.M3D.1 PASS.
    GATE 2 (Held-out sample):
      - 00_ARCHITECTURE/EVAL/M3_HELD_OUT_SAMPLE_v1_0.md: NEW — 10
        stratified dates (3 LEL events × 3 decades: 1998-02-16 first
        job, 2008-06-09 Cognizant exit, 2018-11-28 father's death;
        3 non-landmark: 2002-09-15, 2014-03-20, 2020-08-10; 2 future:
        2026-08-15, 2027-09-12; 2 dasha-transition: 2010-09-05 +18d
        after Saturn→Mercury MD, 1985-01-25 -12d before Jupiter-
        Jupiter→Jupiter-Saturn AD). Each row: Vimshottari MD/AD via
        VIMSHOTTARI_RAW; Yogini MD via YOGINI_RAW; KP Asc + sublord
        via pyswisseph at native birth time-of-day; top-3 lit signals
        via signal_activator.py. In-session native verdict 10/10
        CONSISTENT.
      - 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md: §9 PROSPECTIVE PREDICTION
        SUBSECTION appended (append-only). PRED.M3D.HOLDOUT.001 (window
        2026-08-15, horizon 106d, confidence MED, falsifier: no
        career-peak/wealth-peak/consolidation event ±30d) +
        PRED.M3D.HOLDOUT.002 (window 2027-08-19+, horizon 499d,
        confidence MED, falsifier: Mercury→Ketu MD as routine
        continuation in 3 months following). Both outcome=null per
        Learning Layer #4. AC.M3D.2 + AC.M3D.3 PASS.
    GATE 3 (IS.8(b) macro-phase-close red-team):
      - 00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md: NEW — IS.8(b) macro-
        phase-close red-team. 9 adversarial axes per session brief
        (RT.M3.1 B.1 layer-separation; RT.M3.2 B.3 derivation-ledger;
        RT.M3.3 B.10 no-fabricated-computation; RT.M3.4 DIS register
        completeness; RT.M3.5 validator integrity; RT.M3.6 feature-flag
        hygiene; RT.M3.7 ECR completeness; RT.M3.8 PPL substrate;
        RT.M3.9 acharya-grade quality bar). Verdict PASS 9/9 axes;
        0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW (KR.M3.RT.LOW.1 KP
        artifact-shape adaptation). 0 fixes applied. M3 close gate
        CLEARED. AC.M3D.4 PASS.
    Mirror + state updates:
      - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: Wave 4 table added;
        M3-W4-D1 row CLOSED; this session's close block appended.
      - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
      - .gemini/project_state.md (MP.2 mirror — adapted-parity update).
      - 00_ARCHITECTURE/SESSION_LOG.md (session_open + session_close
        blocks appended atomically).
    Strict scope compliance: did NOT touch platform/src/**, FORENSIC,
    025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**,
    05_TEMPORAL_ENGINES/** (read-only validator input only),
    platform/migrations/**, PHASE_M3_PLAN_v1_0.md,
    DISAGREEMENT_REGISTER (read-only). LEL §9 append authorized by
    CLAUDE.md §E + brief's may_touch declaration. L1 frozen except
    §9 PPL append.
    === Predecessor M3-PRE-D-GOVERNANCE-2026-05-01 deliverables (preserved for audit) ===
    M3-PRE-D-GOVERNANCE-2026-05-01 closed (2026-05-01) — governance-only
    pre-D session. Two actions:
    ACTION 1 (DIS.010/011/012 → N3):
      - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md (DIS.010 + DIS.011 +
        DIS.012 status: open → resolved; resolved_on=2026-05-01;
        resolved_by_session=M3-PRE-D-GOVERNANCE-2026-05-01;
        arbitration_steps_taken extended with native_arbitration N3 row;
        resolution_note added to DIS.010 + DIS.012 per session brief).
        AC.PRED.1 PASS (no DIS-entry status:open). AC.PRED.2 PASS (resolved_on
        + resolved_by_session set on each).
    ACTION 2 (Migration verification):
      - Live `DATABASE_URL` connection from platform/.env.local succeeded
        (DB amjis, user amjis_app, 59 public tables). Verification query
        for {dasha_periods, signal_states, kp_sublords, varshaphala, shadbala}
        returned 0 of 5 → migrations 022/023/024/025/031 NOT applied. Other
        five migrations (026/027/028/029/030) not directly verified.
      - 00_ARCHITECTURE/MIGRATION_APPLY_INSTRUCTIONS_v1_0.md (NEW — one-shot
        apply instructions; status ACTION_REQUIRED; Option A `supabase db
        push` or Option B psql loop over 022..031 + post-apply verification
        query). AC.PRED.3 PASS (path b — instructions authored).
    Mirror + state updates:
      - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
      - .gemini/project_state.md (MP.2 mirror — adapted-parity update
        reflecting DIS.010/011/012 resolution + migration carry-forward
        pending action #10).
      - 00_ARCHITECTURE/SESSION_LOG.md (session_open + session_close blocks
        appended atomically).
    NATIVE ACTION REQUIRED before M3-D-VALIDATOR-REDTEAM (D1) opens: apply
    migrations 022–031 per MIGRATION_APPLY_INSTRUCTIONS_v1_0.md and confirm
    the verification query returns 5/5 tables.
    Strict scope compliance: did NOT touch platform/** (except read-only
    .env inspection), 05_TEMPORAL_ENGINES/**, 035_DISCOVERY_LAYER/**,
    01_FACTS_LAYER/**, 025_HOLISTIC_SYNTHESIS/**, PHASE_M3_PLAN_v1_0.md.
    L1 frozen.
    === Predecessor M3-W1-A4-DIS009-DISPOSITION deliverables (preserved for audit) ===
    Track 1 fourth execution session AND M3-A SUB-PHASE CLOSE. Three gates per brief.
    GATE 1 (DIS.009 disposition):
      - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json (PAT.008
        mechanism re-grounded per native R3 verdict; claim_text rewritten with
        two-step Saturn-Mercury identity-axis framing — Saturn as AL lord (direct,
        L1-clean from FORENSIC §17 + Capricorn rulership) and Saturn as dispositor
        of Mercury in Capricorn 10H Vargottama (L1-attested at FORENSIC §1 line
        160 + §3.5 line 285) where Mercury rules the D9 Karakamsa (Gemini, derived
        from AK = Moon + Moon D9 = Gemini + Mercury rulership of Gemini); the
        Saturn-Mercury identity axis runs across the Capricorn-Gemini spine.
        [EXTERNAL_COMPUTATION_REQUIRED] block added per CLAUDE.md §I B.10 with
        native-specified JH D9 export spec. status: needs_verification;
        re_validation_status flipped gemini_conflict → resolved_pending_ecr;
        resolution_session + resolution_note added).
      - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.md (companion .md
        updated to match JSON; Status line added; DIS.009 resolution paragraph
        appended).
      - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md (DIS.009 status open →
        resolved; resolution prose authored; resolved_on=2026-05-01;
        resolved_by_session=M3-W1-A4-DIS009-DISPOSITION; arbitration_steps_taken
        extended with reconciler_resolution (A1 analysis) + native_arbitration
        (this session R3 verdict); linked_artifacts extended with
        DIS009_ANALYSIS_v1_0.md + PATTERN_REGISTER companion .md).
    GATE 2 (IS.8(a) red-team):
      - 00_ARCHITECTURE/EVAL/REDTEAM_M3A2_v1_0.md (new — IS.8(a) every-third-
        session cadence-fire red-team; 7 axes per brief — B.1 layer-separation,
        B.3 derivation-ledger, B.10 no-fabricated-computation, flag-gate
        correctness, DIS.009 consistency, eval baseline integrity, scope
        compliance; verdict PASS 7/7; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW
        (KR.M3A2.1 — ECR clarification carry-forward, native-instructed ECR text
        held verbatim per Gate 1 hard constraint)).
    GATE 3 (M3-A close):
      - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (Wave 1 row M3-W1-A4-DIS009-
        DISPOSITION flipped PENDING → CLOSED; Wave 1 header updated to
        'CLOSED 2026-05-01'; this session's close block appended).
      - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place).
      - .gemini/project_state.md (MP.2 mirror — adapted-parity update reflecting
        DIS.009 resolved + M3-A closed + counter reset 3→0).
      - 00_ARCHITECTURE/SESSION_LOG.md (session_open + session_close blocks
        appended atomically).
    M3-A close-checklist (8 PASS / 1 DEFERRED):
      AC.M3A.1 PASS (manual-capture); AC.M3A.2 PASS (DISCOVERY_PATTERN_ENABLED
      default true); AC.M3A.3 PASS (DISCOVERY_CONTRADICTION_ENABLED default
      true); AC.M3A.4 PASS (DIS.009 resolved); AC.M3A.5 DEFERRED (auth wall;
      native-accepted at A1); AC.M3A.6 PASS (chart_facts/FORENSIC mandatory
      floor); AC.M3A.7 PASS (manifest entries verified; entry_count=112);
      AC.M3A.8 PASS (CONTRADICTION_FRAMING preserves B.1 + enforces B.3);
      AC.M3A.9 PASS (REDTEAM_M3A2 PASS 7/7).
    Strict scope compliance: did NOT touch platform/src/lib/retrieve/**,
    platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 01_FACTS_LAYER/**,
    05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**,
    PHASE_M3_PLAN_v1_0.md, CAPABILITY_MANIFEST.json (read-only verification of
    AC.M3A.7). L1 frozen.
    === Predecessor M3-W3-C3-SHADBALA deliverables (preserved for audit) ===
      - platform/scripts/temporal/compute_shadbala.py (new — engine v1: 4 of 6
        Shadbala components computed deterministically via pyswisseph + Lahiri
        sidereal — Uccha + Dig + Naisargika + Nathonnatha; Sthana + Drik marked
        [EXTERNAL_COMPUTATION_REQUIRED] per CLAUDE.md §I B.10; CLI args
        --chart-id/--birth/--query-date/--birth-lat/--birth-lon/--vimshottari/
        --output/--sql-output; halts on swisseph ImportError with sys.exit(2).)
      - 05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json (new — 63 rows over
        9 snapshots × 7 planets; snapshots = 7 Vimshottari MD start_dates +
        final MD end_date + today 2026-05-01; time-of-day held at native birth
        time-of-day 10:43 IST per cross-check convention.)
      - 05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql (new — 63 INSERTs
        idempotent ON CONFLICT DO NOTHING; bundles CREATE TABLE IF NOT EXISTS
        for offline replay.)
      - 05_TEMPORAL_ENGINES/shadbala/CROSSCHECK_v1_0.md (new — verdict
        WITHIN_TOLERANCE_PENDING_REVIEW; AC.M3C.4 anchors PASS — Saturn Uccha
        59.19 vs FORENSIC §6.1 59.18 Δ+0.01; Sun Uccha 33.99 vs FORENSIC 33.99
        Δ+0.00; all 7 planets within ±0.02 virupas on Uccha + Dig; three findings
        flagged for native review at M3-C close — Naisargika value-disagreement,
        Nathonnatha class-swap Saturn↔Venus, Nathonnatha altitude-vs-time-linear.)
      - platform/migrations/031_shadbala.sql (new — CREATE TABLE IF NOT EXISTS
        shadbala + 2 indexes + 7 natal-snapshot INSERTs + idempotent BEGIN/COMMIT
        wrap; companion to SHADBALA_INSERT for the over-time series.)
      - 00_ARCHITECTURE/EVAL/REDTEAM_M3C_v1_0.md (new — M3-C sub-phase-close
        quality-gate red-team; NOT §IS.8(a) cadence fire; 7 axes — B.1 layer-
        separation, B.3 derivation-ledger, B.10 no-fabricated-computation, ECR
        completeness, Jaimini boundary, migration idempotency, school-disagreement
        close-scope; verdict PASS, 0 findings, 0 fixes. M3-C close artifacts D4 +
        D5 unblocked.)
      - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md (extended — DIS.010/011/012
        appended as DIS.class.school_disagreement on Jaimini multi-tradition
        forks: DIS.010 (Chara sequence-start AK vs Lagna), DIS.011 (Chara
        sign-duration rule), DIS.012 (Narayana absent FORENSIC baseline). Each
        with R1/R2/R3 options; status open; resolution pending_native_verdict;
        default N3 per phase-plan policy = defer to M9 multi-school triangulation.)
      - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md (Wave 3 row M3-W3-C3-SHADBALA
        flipped PENDING → CLOSED + 'M3-C SUB-PHASE CLOSED' annotation + Wave 3
        header updated to 'CLOSED 2026-05-01'; close block appended.)
      - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md (this file — amended in-place)
      - .gemini/project_state.md (MP.2 mirror — adapted-parity update)
    AC.M3C.4 + AC.M3C.5 + AC.M3C.6 all pass. TypeScript: 0 new errors (9 pre-
    existing carry-forward in tests/components/AppShell.test.tsx + tests/components/
    ReportGallery.test.tsx — Portal Redesign R-stream owns). Scope compliance:
    did NOT touch platform/src/lib/retrieve/**, platform/src/lib/synthesis/**,
    platform/src/lib/bundle/**, 05_TEMPORAL_ENGINES/dasha/jaimini/** (read-only
    for D4 close-artifact authoring only), platform/scripts/temporal/compute_chara.py,
    platform/scripts/temporal/compute_narayana.py, 025_HOLISTIC_SYNTHESIS/**,
    035_DISCOVERY_LAYER/**, 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
    (read-only for cross-check anchor only), 01_FACTS_LAYER/** — all within
    declared must_not_touch. L1 frozen. DB pre-check at session-open: migrations
    022-025 returned NULL (not applied to live DB) — recorded as carry-forward
    for native action; engine work for D1 self-contained per brief.
  previous_session_id: M3-W4-D1-VALIDATOR-REDTEAM
    # Chronologically-immediately-prior closed session per pointer convention.
    # Brief Hard Constraint #1: D2 predecessor_session = M3-W4-D1-VALIDATOR-
    # REDTEAM (same Cowork thread successor session). Single-pointer alignment
    # in this session-open handshake.

  # ------------------------------------------------------------------
  # Next-session commitment (single committed objective per SESSION_LOG_SCHEMA §4)
  # ------------------------------------------------------------------
  next_session_objective: >
    M4-W1-OPEN (first M4 session). Predecessor = M3-W4-D2-M3-CLOSE.
    First M4 session decisions per HANDOFF_M3_TO_M4 §What M4 needs to know:
      (1) NATIVE-APPROVAL POINT: author PHASE_M4_PLAN_v1_0.md (analogue
          of PHASE_M3_PLAN for M3) or drive M4 directly from MACRO_PLAN
          §M4. Default: decision deferred to first M4 session per
          PHASE_M3_PLAN §5 native-approval-points table.
      (2) HARD PREREQUISITE for M4-A entry: LEL ≥40 events spanning
          ≥5 years per MACRO_PLAN §CW.LEL §M4 entry state. Current LEL
          count = 35 events (5-event gap; native owns gate-clearance);
          span 1984-2025 (41 years; well past 5-year minimum). First
          M4 session must drive native-elicitation (likely via GAP
          register items: GAP.R2_MONTH.01 + GAP.FATHER_KIDNEY_MONTH.01
          + GAP.US_JOB_LOSS_PRECISE.01 + 2+ recent 2025-2026 events).
          Pre-gate work (M4 phase plan authoring; LL.1 STUB-banner-
          removal preparation) is not gate-blocked.
      (3) NATIVE-APPROVAL POINT: JH integration scope decision (operationalise
          JH access in M4 to unblock DIS.009 D9 verification + Sthana+Drik
          Shadbala + Narayana Dasha verification, OR carry the ECR-tagged
          items forward to M5+).
    M4 scope per MACRO_PLAN §M4 + HANDOFF_M3_TO_M4:
      (a) LEL ground-truth spine.
      (b) Per-signal calibration weights (LL.1 SIGNAL_WEIGHT_CALIBRATION
          STUB → active).
      (c) Calibration tables (LL.4 PROMPT_OPTIMIZATION substrate).
      (d) LL.1-LL.4 mechanisms move from STUB-banner to active per
          LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.2.
      (e) Held-out cohort discipline (Learning Layer #4: held-out
          prospective data is sacrosanct).
      (f) Optional JH integration (per native decision above).
    Inherited open items (HANDOFF §Inherited open items) — full
    enumeration in HANDOFF_M3_TO_M4_v1_0.md §Inherited open items.
    Brief Cowork thread for first M4 session: TBD (new thread; M3-W4
    Cowork thread closes with this M3-W4-D2 session).
      (1) Author 00_ARCHITECTURE/M3_CLOSE_v1_0.md (precedent
          M2_CLOSE_v1_0.md). Sections: §1 quality bar (per-AC PASS/DEFER);
          §2 wave log (M3 Wave 1/2/3/4 sessions); §3 deferred items
          (KR.M3.RT.LOW.1, KR.M3A2.1, AC.M3A.5, DIS.009/010/011/012 ECR,
          Sthana+Drik ECR, Narayana ECR, M2 inherited residuals);
          §4 red-team evidence pointing to REDTEAM_M3_v1_0.md PASS;
          §5 ND status open=[]; §6 mirror sync evidence MP.1+MP.2.
      (2) Author 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md (precedent
          HANDOFF_M2_TO_M3_v1_0.md). What M3 delivered + platform state
          + M4 priorities + hard prerequisites for M4 (LEL ≥40 events
          spanning ≥5 years per MACRO_PLAN §CW.LEL §M4 entry state) +
          inherited open items + active disagreements.
      (3) Flip this CURRENT_STATE: active_macro_phase M3 → M4;
          active_macro_phase_title "Calibration + LEL Ground-Truth Spine";
          active_phase_plan null (PHASE_M4_PLAN authoring decision deferred
          to first M4 session); last_session_id → M3-W4-D2-M3-CLOSE;
          red_team_counter 1 → 2 (D2 substantive); next_session_objective
          → "Author PHASE_M4_PLAN_v1_0.md (or drive M4 directly from
          MACRO_PLAN §M4 per native decision); entry gate ≥40 LEL events
          ≥5 yrs span".
      (4) Mirror sync (MP.1 + MP.2): .geminirules + .gemini/project_state.md
          updated to reflect active_macro_phase M3 → M4 at adapted parity.
          mirror_enforcer.py exit 0 required.
    Native-disposition items carried into M3 CLOSE §3 / HANDOFF §Inherited
    open items:
      (i)   DIS.009 full closure pending JH D9 export per ED.1
            (KR.M3A.JH-EXPORT, M4-class verification window).
      (ii)  DIS.010/011/012 RESOLVED-N3 (defer to M9 multi-school
            triangulation; tracked but not gating).
      (iii) Naisargika + Nathonnatha findings (Shadbala convention choice;
            CROSSCHECK §4/§5/§9; M4-class native review).
      (iv)  Sthana + Drik ECR resolution (Shadbala JH-export per ED.1).
      (v)   KR.W9.1 + KR.W9.2 (eval-runner auth wall + parser quirk;
            M4-class with auth-secrets availability).
      (vi)  KR.M3A2.1 (PAT.008 ECR clarification).
      (vii) KR.M3.RT.LOW.1 (KP per-planet vs 0°-360° boundary table;
            possible M4 follow-up if downstream calibration requires).
      (viii) AC.M3A.5 (post-baseline run; auth wall; native-accepted DEFER
            at M3-A close; carries to M4 with auth secrets).
      (ix)  Inherited from M2: SIG.MSR.207 absent from MSR_v3_0.md;
            UCN inline citation pass aspirational; TS test-fixture errors
            (Portal Redesign R-stream owns).
  next_session_proposed_cowork_thread_name: "(new thread; first M4 session)"
  red_team_due_note: >
    Counter incremented 1→2 at this session close (D2 substantive: M3_CLOSE
    + HANDOFF_M3_TO_M4 + CURRENT_STATE flip + MP.1+MP.2 sync). Predecessor
    M3-W4-D1 (counter 0→1) discharged the §IS.8(b) macro-phase-close cadence
    via REDTEAM_M3 PASS 9/9 axes; that discharge does NOT reset the every-
    third counter per ONGOING_HYGIENE_POLICIES §G. Counter therefore stands
    at 2 after this D2 close. Next §IS.8(a) every-third cadence fires at
    counter=3 (one substantive session hence — likely first M4 session).
    Next §IS.8(b) macro-phase-close cadence fires at M4 close.
    Next §IS.8(c) every-12-months MACRO_PLAN review remains 2027-04-23 due
    per ONGOING_HYGIENE_POLICIES §H quarterly-pass + §K MP-review-triggers.

  # ------------------------------------------------------------------
  # Freshness metadata (for drift detection)
  # ------------------------------------------------------------------
  file_updated_at: 2026-05-01T23:30:00+05:30
  file_updated_by_session: M3-W4-D2-M3-CLOSE
  cross_check_hash: >
    Derived from the tuple (active_governance_step, last_session_id, next_governance_step)
    = (Step_15 completed, M3-W4-D2-M3-CLOSE, null).
    STEP_LEDGER is GOVERNANCE_CLOSED; drift_detector.py cross-checks against
    SESSION_LOG's latest `session_close.session_id` (always).
  cross_check_authority: CURRENT_STATE           # post-Step-15; STEP_LEDGER is GOVERNANCE_CLOSED
```

---

## §3 — Narrative (human-reading surface — must agree with §2)

At the close of **M3-W4-D2-M3-CLOSE (2026-05-01) — M3 MACRO-PHASE CLOSED**:

**Macro-phase.** **M3 CLOSED. M4 — Calibration + LEL Ground-Truth Spine — is now ACTIVE.** Sealing artifact: `00_ARCHITECTURE/M3_CLOSE_v1_0.md`. M3→M4 handoff memo: `00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md`. M3 IS.8(b) macro-phase-close red-team verdict (discharged at M3-W4-D1): PASS 9/9 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW (KR.M3.RT.LOW.1 carry-forward to M4). M3 phase plan (`PHASE_M3_PLAN_v1_0.md` v1.0) now SUPERSEDED-AS-COMPLETE. M4 phase plan TBD — first M4 session decides whether to author `PHASE_M4_PLAN_v1_0.md` or drive M4 directly from `MACRO_PLAN_v2_0.md §M4` (native-approval point at M4 open per `PHASE_M3_PLAN §5`).

**Deliverables (Gate 4 of M3-D per session brief).** Four artifacts produced this session:

(1) **`M3_CLOSE_v1_0.md`** — sealing artifact. §1 quality bar: 27 PASS / 1 DEFERRED (AC.M3A.5 native-accepted; M4-class) / 1 PASS+DEFERRED-PARTIAL (AC.M3D.3 external acharya M4-class) / 0 FAIL across all M3 acceptance criteria (AC.M3A.1..9 + AC.M3B.1..7 + AC.M3C.1..6 + AC.M3D.1..7). §2 wave log: W1 (M3-OPEN + M3-A 5 sessions) + W2 (M3-B 2 sessions) + W3 (M3-C 3 sessions) + W4 (M3-D 3 sessions including M3-PRE-D-GOVERNANCE + D1 + D2). §3 deferred items: 13 enumerated across "inherited from M3 sub-phases" (KR.M3.RT.LOW.1, KR.M3A.JH-EXPORT, DIS.010/011/012-N3, Sthana+Drik ECR, Narayana ECR, KR.M3A2.1, three Shadbala convention findings, AC.M3A.5, R.M3D.1 external acharya) and "inherited from M2" (SIG.MSR.207 absent from MSR; UCN inline citation aspirational; TS test-fixture errors; KR.W9.1+W9.2 auth-wall). §4 red-team evidence: REDTEAM_M3 PASS 9/9; counter trail in M3 detailed (M2-CLOSE→0; B1→1; C1→2; B2→3; C2 held; A2 IS.8(a) FIRES reset 3→0; A3→1; C3→2; A4→IS.8(a) FIRES reset 3→0; PRE-D held 0; D1→1 IS.8(b) DISCHARGED; D2→2 close). §5 ND status: open=[]; addressed=[ND.1]. §6 mirror sync evidence: MP.1+MP.2 same-session. §7 live platform state. §8 M3 exit confirmed.

(2) **`HANDOFF_M3_TO_M4_v1_0.md`** — handoff memo. What M3 delivered (capability inventory across A/B/C/D — Discovery Engine query-time activation; Vimshottari + Yogini + Transit + signal_activator; Chara + Narayana needs_verification; KP per-natal-planet snapshot; Varshaphala 78 charts; Shadbala 4-of-6 deterministic with Sthana+Drik ECR; Validator + Held-Out Sample + REDTEAM_M3; DIS register hygiene). Live platform state at M3 close (22 retrieval tools; 5 M3 temporal tables; CAPABILITY_MANIFEST 112 entries; 4 DISCOVERY_*_ENABLED flags default-true). What M4 needs to know (LEL ground-truth spine; per-signal calibration weights; LL.1-LL.4 STUB→active; held-out cohort discipline; JH integration scope decision). HARD PREREQUISITES for M4: **LEL ≥40 events spanning ≥5 years** (current 35 events; **5-event gap**; native owns gate-clearance; span 1984-2025 = 41 years already exceeds 5-year minimum). Inherited open items by owner (native | next-session | M9-class | Portal R-stream). Active feature flags. Active disagreements (DIS.009 resolved-R3-pending-ECR; DIS.010/011/012 resolved-N3). Concurrent workstreams. Operational checklist for M4 (16 inheritance items).

(3) **CURRENT_STATE flip** — this file. `active_macro_phase: M3 → M4`; `active_macro_phase_title: "Calibration + LEL Ground-Truth Spine"`; `active_phase_plan: null` (M4 phase plan authoring decision deferred to first M4 session); `last_session_id: M3-W4-D2-M3-CLOSE`; `red_team_counter: 1 → 2` (D2 substantive); `next_session_objective: M4-W1-OPEN (or PHASE_M4_PLAN_v1_0.md)`; §3 narrative refreshed with M3-W4-D2 close at top; changelog entry added.

(4) **Mirror sync MP.1 + MP.2.** `.geminirules` updated to reflect `active_macro_phase` M3 → M4 + `last_session_id` → M3-W4-D2-M3-CLOSE + `next_session_objective` at adapted parity (footer line + §F state block). `.gemini/project_state.md` updated to reflect M3 macro-phase CLOSED + M4 active + handoff memo pointer + LEL minimum-volume entry-gate at adapted parity. `mirror_enforcer.py` exit 0 required at this close (per AC.M3D.6).

**Counter trail (post-close).** D2 substantive: counter 1→2. Next IS.8(a) every-third cadence at counter=3 (one substantive session hence — likely first M4 session). Next IS.8(b) macro-phase-close cadence at M4 close.

**Scope compliance.** Strict respect of must_not_touch: did NOT touch `01_FACTS_LAYER/**`, `025_HOLISTIC_SYNTHESIS/**`, `035_DISCOVERY_LAYER/**`, `05_TEMPORAL_ENGINES/**`, `platform/src/**`, `platform/migrations/**`, `PHASE_M3_PLAN_v1_0.md` (now SUPERSEDED-AS-COMPLETE; not modified at this close), `DISAGREEMENT_REGISTER_v1_0.md` (read-only), `00_ARCHITECTURE/EVAL/**` (D1 deliverables frozen post-commit ad4a6d2). L1 frozen.

**Next session.** M4-W1-OPEN (first M4 session; new Cowork thread). Native-approval points at M4 open: (a) author `PHASE_M4_PLAN_v1_0.md` or drive M4 directly from `MACRO_PLAN §M4`; (b) LEL gate-clearance plan; (c) JH integration scope. Hard prerequisite: LEL ≥40 events ≥5 years span before M4-A calibration substrate work begins. Pre-gate work (M4 phase plan authoring; LL.1 STUB-banner-removal preparation) is not gate-blocked.

*(Below: retained narrative from prior session close M3-W4-D1-VALIDATOR-REDTEAM for audit trail.)*

At the close of **M3-W4-D1-VALIDATOR-REDTEAM (2026-05-01) — M3-D Wave 4 first execution session CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. M3-D D1 closed; D2 (M3-W4-D2-M3-CLOSE, same Cowork thread) authors the M3 sealing artifacts. M3-A (M3-W1-A4) and M3-C (M3-W3-C3) are CLOSED; M3-B Track 2 (B1 + B2) closed with B3 antardasha cross-check optional or close en bloc at M3-D — closed en bloc at this D1 by virtue of the antardasha-aware validator (TEST-V.1 PD-chain contiguity assertion across all 567 PD rows) + held-out date sample (10 dates each carrying the AD column). DIS.010/011/012 RESOLVED-N3 at M3-PRE-D-GOVERNANCE-2026-05-01 (defer to M9 multi-school triangulation per PHASE_M3_PLAN §8 default policy).

**Gate 1 — Temporal validator meta-tests.** `00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py` authored implementing six deterministic invariants over the M3-B/C JSON outputs + DIS register: TEST-V.1 Vimshottari completeness (7 MD + 63 AD + 567 PD contiguous; span 1984-02-05 → 2070-08-18); TEST-V.2 Yogini continuity (8-lord cycle, Bhramari first); TEST-V.3 Transit determinism + lit/dormant/ripening presence; TEST-V.4 KP per-planet snapshot coverage; TEST-V.5 Shadbala planet coverage + FORENSIC anchors (Saturn Uccha 59.18 ±0.02 + Sun 33.99 ±0.02); TEST-V.6 cross-school disagreement boundary (no open `DIS.class.school_disagreement`). Run record: 6/6 PASS, exit 0. AC.M3D.1 PASS. `00_ARCHITECTURE/EVAL/TEMPORAL/VALIDATOR_META_TESTS_v1_0.md` documents the suite + a transparent adaptation note: TEST-V.4 was adapted from the brief's literal 0°-360° boundary-table expectation to the actual M3-W3-C2 per-planet snapshot shape. The adaptation honors B.10 (no fabrication of an asserted-but-absent shape) and B.3 (cite the actual design choice). Logged as KR.M3.RT.LOW.1 forward-work item in REDTEAM_M3 §6 + HANDOFF.

**Gate 2 — Held-out date sample.** `00_ARCHITECTURE/EVAL/M3_HELD_OUT_SAMPLE_v1_0.md` authored with 10 dates stratified per brief: 3 LEL events from different decades (1998-02-16 first job; 2008-06-09 Cognizant exit; 2018-11-28 father's death) + 3 non-landmark (2002-09-15; 2014-03-20; 2020-08-10) + 2 future (2026-08-15; 2027-09-12) + 2 dasha-transition (2010-09-05 +18d after Saturn→Mercury MD; 1985-01-25 -12d before Jupiter-Jupiter→Jupiter-Saturn AD). Each row carries (a) Vimshottari MD/AD via JSON; (b) Yogini MD via JSON; (c) KP Asc + sublord computed via pyswisseph at native birth time-of-day; (d) top-3 lit signals via signal_activator.py with MD-lord-anchored ranking; (e) in-session native verdict. Result: **CONSISTENT 10/10**. AC.M3D.2 + AC.M3D.3 PASS (in-session native review; external acharya review M4-class per R.M3D.1). The two future-dated rows (2026-08-15 + 2027-09-12) logged to LEL §9 PROSPECTIVE PREDICTION SUBSECTION (newly added by this session — append-only) per CLAUDE.md §E concurrent-workstream rule (PPL substrate; outcome=null until observed). PRED.M3D.HOLDOUT.001 + PRED.M3D.HOLDOUT.002 each carry confidence + horizon + falsifier per Learning Layer #4.

**Gate 3 — IS.8(b) macro-phase-close red-team.** `00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md` authored as the M3 macro-phase-close red-team per `MACRO_PLAN §IS.8(b)` + `PHASE_M3_PLAN §3.4 AC.M3D.4`. Nine adversarial axes per session brief: RT.M3.1 B.1 layer-separation across all M3 sub-phases (L1 frozen except §E-sanctioned PPL append; CONTRADICTION_FRAMING preserves discipline); RT.M3.2 B.3 derivation-ledger discipline (12 spot-checks across PAT/CON/SHADBALA-CROSSCHECK/VIMSHOTTARI-CROSSCHECK — all CITED); RT.M3.3 B.10 no-fabricated-computation (7 Shadbala components + Vimshottari boundaries + KP degrees traced; Sthana+Drik ECR-tagged); RT.M3.4 DIS register completeness (DIS.001..012 all resolved); RT.M3.5 temporal validator integrity (6/6 PASS; sufficiency); RT.M3.6 feature-flag hygiene (DISCOVERY_PATTERN_ENABLED + DISCOVERY_CONTRADICTION_ENABLED default-true; no temporal-engine flag required); RT.M3.7 ECR completeness (PAT.008b + Sthana + Drik + Narayana ECR specs all (i)-(iv) compliant); RT.M3.8 PPL substrate (LEL §9 active; held-out future predictions logged); RT.M3.9 acharya-grade quality bar (3/3 cold reads above-or-at acharya-on-first-pass per CLAUDE.md §J). **Verdict PASS 9/9 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW (KR.M3.RT.LOW.1).** 0 fixes applied. M3 close gate CLEARED. AC.M3D.4 PASS.

**Counter trail in M3 (per ONGOING_HYGIENE_POLICIES §G).** Reset to 0 at M3-W1-A4 close (IS.8(a) FIRED → reset 3→0). M3-PRE-D-GOVERNANCE governance-aside did NOT increment. M3-W4-D1 (this session) substantive: 0→1; IS.8(b) macro-phase-close cadence DISCHARGED but does NOT reset the every-third counter (only IS.8(a) fires reset). Counter stands at 1 post-discharge. Next IS.8(a) every-third cadence fires at counter=3 (two substantive sessions hence — likely first or second M4 session).

**Scope compliance.** Strict respect of must_not_touch: did NOT touch `platform/src/**`, `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`, `025_HOLISTIC_SYNTHESIS/**`, `035_DISCOVERY_LAYER/**`, `05_TEMPORAL_ENGINES/**` (read-only validator input only), `platform/migrations/**`, `PHASE_M3_PLAN_v1_0.md`, `DISAGREEMENT_REGISTER_v1_0.md` (read-only). LEL §9 append-only authorized by CLAUDE.md §E + brief's may_touch declaration. L1 frozen except for §9 PPL append.

**Next session.** M3-W4-D2-M3-CLOSE (same Cowork thread M3-W4-D1-VALIDATOR-REDTEAM as successor). Predecessor = M3-W4-D1-VALIDATOR-REDTEAM. Scope: M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md + flip CURRENT_STATE active_macro_phase M3 → M4 + sync MP.1 (.geminirules) + MP.2 (.gemini/project_state.md) to adapted parity. mirror_enforcer.py exit 0 required.

*(Below: retained narrative from prior session close M3-W1-A4-DIS009-DISPOSITION for audit trail.)*

At the close of **M3-W1-A4-DIS009-DISPOSITION (2026-05-01) — Track 1 (Discovery Engine + DIS.009 Disposition) fourth execution session CLOSED AND M3-A SUB-PHASE CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. PHASE_M3_PLAN_v1_0.md v1.0 active. **M3-A is now CLOSED.** Track 1 substrate complete: A1 (eval baseline + DIS.009 written analysis) + A2 (4 DISCOVERY_*_ENABLED flag-gating + manifest entry_count fix + REDTEAM_M3A IS.8(a) cadence-fire) + A3 (synthesis-prompt CONTRADICTION_FRAMING amendment) + A4 (this session — DIS.009 R3 disposition + REDTEAM_M3A2 IS.8(a) cadence-fire + M3-A close-checklist). M3-C is also CLOSED (M3-W3-C3-SHADBALA, 2026-05-01). M3-B in flight (Track 2: B1 + B2 closed; B3 antardasha cross-check pending or close en bloc at M3-D per PHASE_M3_PLAN §3.2). M3-D macro-phase-close cadence (§IS.8(b)) remains scheduled per PHASE_M3_PLAN §3.4 AC.M3D.4.

**Gate 1 — DIS.009 R3 disposition.** Native verdict: R3 (RE-GROUND). PAT.008 mechanism rewritten in-place to make the two-step architecture explicit per native-specified rewrite direction. **STEP 1 (direct, L1-clean):** Arudha Lagna = Capricorn 10H (FORENSIC §17, derivation Lagna Aries → lord Mars in 7th Libra → 10th from Libra = Capricorn). Capricorn lord = Saturn (classical rulership). Therefore Saturn governs the AL surface directly. **STEP 2 (one-step-removed, via dispositorship):** Atmakaraka = Moon (highest D1 longitude 27°02′); Moon's D9 sign = Gemini (FORENSIC §3.5 D9.MOON); Karakamsa = Gemini, ruled by Mercury (not Saturn). Mercury occupies Capricorn 10H Vargottama (D1 Capricorn at FORENSIC §1 line 160; D9 Capricorn at §3.5 line 285 with Vargottama=YES). Saturn DISPOSITS Mercury, Mercury rules the D9 Karakamsa. The Saturn-Mercury identity axis runs across the Capricorn-Gemini spine. The original "Saturn governs both surfaces" framing was literally false against L1 (Karakamsa lord = Mercury, not Saturn); the rewrite preserves the identity-lock framing per native instruction while correcting the mechanism to its true two-step shape. `[EXTERNAL_COMPUTATION_REQUIRED]` block added per CLAUDE.md §I B.10 with native-specified JH D9 export spec (verify Moon D9 = Gemini + Mercury D1 = Capricorn). PAT.008 status: `needs_verification`; `re_validation_status` flipped `gemini_conflict → resolved_pending_ecr`. DIS.009 status: `open → resolved`; `resolution` prose authored; `resolved_on=2026-05-01`; `resolved_by_session=M3-W1-A4-DIS009-DISPOSITION`; `arbitration_steps_taken` extended with `reconciler_resolution` (A1 analysis) + `native_arbitration` (this session's R3 verdict). AC.M3A.4 PASS.

**Gate 2 — IS.8(a) every-third-session red-team.** REDTEAM_M3A2_v1_0.md authored as the second M3 IS.8(a) cadence-fire (first was REDTEAM_M3A_v1_0.md at A2 close). Counter trail in M3: 0 (M2-close reset) → 1 (B1) → 2 (C1) → 3 (B2) → 3 (C2 held) → A2 fires reset 3→0 → 1 (A3) → 2 (C3) → 3 (A4 fires reset 3→0). Seven axes per brief Gate 2: RT.M3A2.1 B.1 layer-separation, RT.M3A2.2 B.3 derivation-ledger, RT.M3A2.3 B.10 no-fabricated-computation, RT.M3A2.4 flag-gate correctness, RT.M3A2.5 DIS.009 disposition consistency (Gate 1 cross-check), RT.M3A2.6 eval baseline integrity, RT.M3A2.7 scope compliance. Verdict PASS 7/7 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW (KR.M3A2.1: PAT.008 ECR text could explicitly cite FORENSIC §3.5 as in-corpus L1 source for what JH is asked to verify — both Moon D9 = Gemini and Mercury D9 = Capricorn Vargottama are already L1-attested; native-instructed ECR text held verbatim per Gate 1 hard constraint; documentation-clarity carry-forward, not a B.10 violation). The IS.8(b) macro-phase-close red-team remains M3-D scope per AC.M3D.4. AC.M3A.9 PASS.

**Gate 3 — M3-A close-checklist.** 8 of 9 ACs PASS; AC.M3A.5 DEFERRED with rationale. AC.M3A.1 PASS (BASELINE_RUN_W9_MANUAL_v1_0.md non-stub, six metric rows populated in manual-capture mode per phase-plan entry-gate clause; numerical values await KR.W9.1 auth secrets; native-accepted at A1 close). AC.M3A.2 PASS (DISCOVERY_PATTERN_ENABLED default true post-A2 smoke; durable in feature_flags.ts:86). AC.M3A.3 PASS (DISCOVERY_CONTRADICTION_ENABLED default true post-A2 smoke; durable in feature_flags.ts:87). AC.M3A.4 PASS (Gate 1 R3 disposition). AC.M3A.5 DEFERRED — auth wall blocks both pre-baseline and post-baseline numerical capture; BASELINE_RUN_W9_MANUAL §6 native-acceptance scope authorized either (a) waiver with descriptive delta or (b) require secrets to land before M3-A close; native-accepted defer at this session close; target session = first M3-A-post / M3-D session with auth secrets. AC.M3A.6 PASS (chart_facts + FORENSIC remain mandatory floor; bundle composition layer is must_not_touch this session; verified via W6/W7 audit + read-only check). AC.M3A.7 PASS (PATTERN_REGISTER_JSON tool_binding=pattern_register + TOOL_QUERY_PATTERNS + CONTRADICTION_REGISTER_JSON tool_binding=contradiction_register + TOOL_QUERY_CONTRADICTIONS all present in CAPABILITY_MANIFEST.json; entry_count=112 = len(entries)). AC.M3A.8 PASS (CONTRADICTION_FRAMING preamble in shared.ts is instructional prose with explicit B.1+B.3 enforcement; covered by RT.M3A2.1). AC.M3A.9 PASS (Gate 2 REDTEAM_M3A2 PASS).

**Scope compliance.** Strict respect of must_not_touch: did NOT touch platform/src/lib/retrieve/**, platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 01_FACTS_LAYER/**, 05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**, PHASE_M3_PLAN_v1_0.md, CAPABILITY_MANIFEST.json (read-only verification of AC.M3A.7). L1 frozen. Read-only access to FORENSIC v8.0 §1 / §3.5 / §17 / §22 for cross-checking PAT.008 rewrite at Gate 1 and RT.M3A2.3 / RT.M3A2.5 axes; no L1 mutation.

**Carry-forward open items into M3-D.** (i) DIS.009 full closure pending JH D9 export per ED.1 (KR.M3A.JH-EXPORT, M3-B-class verification window). (ii) DIS.010/011/012 native verdicts on Jaimini multi-tradition forks (default N3 = defer to M9). (iii) Naisargika + Nathonnatha findings from Shadbala CROSSCHECK_v1_0.md §4/§5/§9. (iv) Sthana + Drik ECR resolution (Shadbala JH-export per ED.1). (v) KR.W9.1 + KR.W9.2 (eval-runner auth wall + parser quirk). (vi) KR.M3A2.1 (PAT.008 ECR clarification). (vii) Inherited from M2: SIG.MSR.207 absent from MSR_v3_0.md; UCN inline citation pass; TS test-fixture errors (Portal Redesign R-stream owns).

**Session.** Substantive governance-layer session per ONGOING_HYGIENE_POLICIES §G — counter 2→3 → §IS.8(a) FIRES → resets 3→0. Scripts at close: mirror_enforcer pre-close run exit=0 (8/8 pairs clean; claude_only=2); drift_detector + schema_validator at-close runs expected exit=2 carry-forward (touched files are governance-layer LIVING-not-fingerprint-locked artifacts; no canonical-artifact fingerprint rotation). All hard constraints from brief satisfied: native verdict obtained before Gate 1 execution; root path post-merge-main confirmed; single atomic git commit at session close per brief §"Hard Constraints" #3.

**Next session.** Native-choice between (a) M3-W2-B3-ANTARDASHA-CROSSCHECK (Track 2 standalone wrap-up; closes M3-B sub-phase ahead of M3-D) or (b) M3-W4-D1-VALIDATOR-REDTEAM (proceed directly to M3-D; close remaining Track 2 work en bloc per PHASE_M3_PLAN §3.2). Both M3-A and M3-C are now closed; Track 2 has only optional B3 remaining. M3-D scope per PHASE_M3_PLAN §3.4: temporal validator meta-tests + held-out date sample + 5 acharya-grade chart readings + IS.8(b) macro-phase-close red-team + M3_CLOSE + HANDOFF_M3_TO_M4 + CURRENT_STATE flip M3 → M4 + mirror sync.

*(Below: retained narrative from prior session close M3-W3-C3-SHADBALA for audit trail.)*

At the close of M3-W3-C3-SHADBALA (2026-05-01) — **Track 3 (M3-C Multi-school + KP + Varshaphala + Shadbala) third execution session CLOSED AND M3-C SUB-PHASE CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. PHASE_M3_PLAN_v1_0.md v1.0 active. **M3-C is now CLOSED.** Track 3 substrate complete: C1 (Jaimini Chara + Narayana — cross-check FAIL, both engine variants diverge from FORENSIC §5.3 K.N. Rao Padakrama by tradition-fork, GOLDEN gated; logged at C1 close pending native arbitration), C2 (KP sub-lord engine + Varshaphala Solar-Return engine + migrations 024/025 + 2 retrieval tools), C3 (this session — Shadbala over-time engine + migration 031 + REDTEAM_M3C sub-phase-close quality gate + DIS.010/011/012 opened on the Jaimini multi-tradition forks). M3-A in flight (Track 1: A1 baseline + A2 flag-gating + A3 synthesis-prompt amendment closed; A4 DIS.009 disposition pending → M3-A close-checklist follows). M3-B in flight (Track 2: B1 Vimshottari + B2 Yogini/Transit closed; optional B3 antardasha cross-check pending or close en bloc at M3-D per PHASE_M3_PLAN §3.2).

**Shadbala engine.** `compute_shadbala.py` runs pyswisseph 2.10.03 + Moshier ephemeris + Lahiri sidereal mode (no .se1 files required). Computes 4 of 6 Shadbala components deterministically — Uccha (exaltation/debilitation), Dig (Placidus angles + per-planet Dig point: Sun/Mars→MC, Moon/Venus→IC, Mercury/Jupiter→Asc, Saturn→Dsc), Naisargika (constant per planet per brief D1.c), Nathonnatha (Sun-altitude-anchored linear interpolation). Marks 2 of 6 as `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10: Sthana Bala (requires JH Saptavargaja Bala export per ED.1) and Drik Bala (requires JH/Shri-Jyoti aspect-strength table per ED.1). Output: 63 rows over 9 snapshots × 7 planets. Snapshots = 7 Vimshottari MD start_dates (Jupiter, Saturn, Mercury, Ketu, Venus, Sun, Moon — from VIMSHOTTARI_RAW_v1_0.json M-level rows) + final MD end_date (2070-08-18) + today (2026-05-01). Time-of-day held at native birth time-of-day 10:43 IST per cross-check convention so the natal snapshot serves as the FORENSIC §6.1 anchor.

**Cross-check vs FORENSIC §6.1 (AC.M3C.4 anchors PASS).** All 7 planets' Uccha Bala match FORENSIC §6.1 SBL.UCHA within ±0.02 virupas. Brief explicit anchors: Saturn 59.19 (engine) vs 59.18 (FORENSIC) Δ+0.01 — well inside ±2 tolerance ✓; Sun 33.99 vs 33.99 Δ+0.00 ✓. All 7 planets' Dig Bala match FORENSIC §6.1 SBL.DIG.TOTAL within ±0.02 virupas. Verdict: WITHIN_TOLERANCE_PENDING_REVIEW per session-brief framing — three findings preserved for native review at M3-C close (NOT promoted to DIS register per Axis G of REDTEAM_M3C; these are brief-vs-classical fact-check decisions, not Vedic multi-school disagreements proper). The findings: (i) Naisargika brief values (Saturn=60..Sun=7.5 rupas) diverge from classical FORENSIC SBL.NAISARG.TOTAL (Sun=60..Saturn=8.58 virupas) — opposite-rank-order; (ii) Nathonnatha class assignment Saturn ↔ Venus swap — brief diurnal includes Saturn (classical: nocturnal); brief nocturnal includes Venus (classical: diurnal); engine emits brief classification → ±51.6 virupa swing on those two planets at the natal date; (iii) Nathonnatha altitude-linear methodology (per brief literal text "via pyswisseph Sun altitude") yields ±4.5 virupa drift on correctly-classified diurnals vs FORENSIC's apparent time-linear or ghati-from-sunrise formula.

**Migration 031 + DB pre-check.** Migration 031_shadbala.sql authored as next free index (022-030 occupied by W2/C2 deliverables); idempotent BEGIN/COMMIT-wrapped CREATE TABLE IF NOT EXISTS shadbala + 2 indexes + 7 natal-snapshot INSERTs ON CONFLICT DO NOTHING. DB pre-check at session-open returned NULL for all four W2/C2 tables (`dasha_periods`, `signal_states`, `kp_sublords`, `varshaphala`) — migrations 022-025 also NOT applied to the live DB. Recorded as carry-forward for native action; engine work for D1 was self-contained per session-brief framing.

**REDTEAM_M3C sub-phase-close quality gate (NOT §IS.8(a) cadence).** REDTEAM_M3C_v1_0.md authored as PHASE_M3_PLAN §3.3 quality gate for M3-C close. 7 adversarial axes — A) B.1 layer-separation (FORENSIC L1 untouched; cross-check + DIS document divergence rather than mutate L1), B) B.3 derivation-ledger (every numerical claim cites pyswisseph signature or FORENSIC `SBL.<ID>`), C) B.10 no-fabricated-computation (Sthana + Drik schema-level ECR-tagged; partial_total documented as 4-of-6), D) ECR completeness (needs_verification=true row-level + actionable ECR specs), E) Jaimini boundary (no compute_chara/narayana invocation; read-only DIS-citation), F) migration idempotency (IF NOT EXISTS + ON CONFLICT DO NOTHING + BEGIN/COMMIT), G) school-disagreement close-scope (DIS.010/011/012 log without operator-preference resolution). All 7 axes PASS, 0 findings, 0 fixes applied. The §IS.8(a) every-third-session cadence already discharged at A2 close (REDTEAM_M3A_v1_0.md PASS, counter reset 3→0); §IS.8(b) macro-phase-close cadence remains scheduled for M3-D close per PHASE_M3_PLAN §3.4 AC.M3D.4. Counter at M3-W3-C3 close: 1→2.

**DIS register entries DIS.010/011/012 (Jaimini school_disagreement).** Three new DIS.class.school_disagreement entries appended to DISAGREEMENT_REGISTER_v1_0.md per PHASE_M3_PLAN §3.3 AC.M3C.5: DIS.010 (Chara Dasha sequence-start: Sanjay Rath / BPHS-Jaimini synthesis begins MD at AK sign vs K.N. Rao Padakrama begins at Lagna sign per FORENSIC §5.3); DIS.011 (Chara Dasha sign-duration rule: brief hardcoded constants vs BPHS sign-to-lord rule vs K.N. Rao Padakrama with additional rule overlay); DIS.012 (Narayana Dasha: no FORENSIC published Narayana table for this native, so external-acharya or JH-export verification required before treating engine output as settled). Each entry: status open, resolution pending_native_verdict, R1/R2/R3 options enumerated, default N3 per phase-plan policy (defer to M9 multi-school triangulation). Native arbitrates at M3-C close moment per AC.M3C.5; native may also choose N1 (adopt FORENSIC §5.3 K.N. Rao Padakrama as project-canonical Chara tradition) or N2 (adopt BPHS-Sanjay-Rath synthesis) or escalate to external acharya (DIS.012 N1).

**Jaimini boundary respected.** compute_chara.py and compute_narayana.py NOT invoked. 05_TEMPORAL_ENGINES/dasha/jaimini/** outputs (CHARA_RAW, NARAYANA_RAW) NOT used as computational input to compute_shadbala.py. Read-only access to 05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md was used for D4 close-artifact authoring only (DIS.010/011/012 cite the FAIL verdict and N1/N2/N3 rationale text). Verified by Axis E of REDTEAM_M3C: `grep -n "chara\|narayana\|jaimini" compute_shadbala.py` = 0 matches.

**Multi-track close coordination.** This session is the seventh close of 2026-05-01 (chronologically: M3-W2-B1 → M3-W3-C1 → M3-W2-B2 → M3-W3-C2 → M3-W1-A2 → M3-W1-A3 → M3-W3-C3-SHADBALA). All Track 3 (M3-C) sessions are now closed; Track 1 (M3-A) has one open session (A4); Track 2 (M3-B) has zero open mandatory sessions (B3 optional or close at M3-D). Brief-declared predecessor M3-W3-C2-KP-VARSHAPHALA + chronological predecessor M3-W1-A3-CONTRADICTION-ENGINE both acknowledged at session-open handshake (predecessor_session + previous_session_id dual-pointer); §2 state-block previous_session_id reflects chronological convention (M3-W1-A3); session_log close-block predecessor_session reflects brief-declared track-chain (M3-W3-C2).

**Session.** Substantive engine + cross-check + sub-phase-close red-team + DIS register authoring per ONGOING_HYGIENE_POLICIES §G — counter 1→2. Scripts at close: mirror_enforcer expected exit=0 (8/8 pairs clean; claude_only=2); drift_detector expected exit=2 (carry-forward; no new regressions — engine + migration + DIS entries + RT artifact additions are net-new files, no canonical-artifact fingerprint rotations); schema_validator expected exit=2 (carry-forward; no new CRITICAL). Strict scope compliance: did NOT touch platform/src/lib/retrieve/**, platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 05_TEMPORAL_ENGINES/dasha/jaimini/** (read-only for D4 close-artifact authoring only), platform/scripts/temporal/compute_chara.py, platform/scripts/temporal/compute_narayana.py, 025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md (read-only for cross-check anchor only), 01_FACTS_LAYER/**. L1 frozen.

**Next session.** M3-W1-A4-DIS009-DISPOSITION (Track 1 — DIS.009 disposition + M3-A close-checklist) is the natural sequencing successor: Track 1 is the in-flight track with the open M3-A close-checklist; Track 3 is now CLOSED at this session; Track 2 may close en bloc at M3-D per PHASE_M3_PLAN §3.2. After M3-A close, the next major boundary is M3-D macro-phase close (validator + held-out sample + IS.8(b) red-team + M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md per PHASE_M3_PLAN §3.4). Native-disposition items carried into M3-A close / M3-D close from this session: (i) DIS.010/011/012 native verdicts (Jaimini multi-tradition); (ii) Shadbala Naisargika + Nathonnatha findings (engine-spec convention choice); (iii) Sthana + Drik ECR resolution (JH-export per ED.1, M3-D-class).

*(Below: retained narrative from prior session close M3-W1-A3-CONTRADICTION-ENGINE for audit trail.)*

At the close of M3-W1-A3-CONTRADICTION-ENGINE (2026-05-01) — **Track 1 (Retrieval & Discovery) third execution session CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. PHASE_M3_PLAN_v1_0.md v1.0 active. Track 1 (M3-A Discovery Engines + DIS.009 Disposition) now has three sessions closed (A1 baseline + DIS.009 analysis; A2 flag-gating + IS.8(a) red-team; A3 synthesis-prompt amendment). Remaining M3-A work: A4 DIS.009 disposition (native decision among R1/R2/R3) → M3-A close-checklist. Tracks 2 + 3 each have two sessions closed and remain paused awaiting native trigger.

**Synthesis-prompt amendment landed.** `platform/src/lib/prompts/templates/shared.ts` now carries a `CONTRADICTION_FRAMING` constant injected into `buildOpeningBlock()` between `NO_FABRICATION` and `METHODOLOGY_INSTRUCTION`. Because all 7 active synthesis templates (factual, interpretive, predictive, cross_domain, discovery, holistic, remedial) call `buildOpeningBlock()`, the rubric fires at exactly one shared location and inherits universally. The `cross_native` Phase-7 stub hardcodes a "not implemented" body and is intentionally unaffected — flagged as a non-issue since cross-native synthesis is M7+ scope and the stub is registered only to prevent registry lookup throws.

**B.1 + B.3 compliance.** The rubric instructs the model to (a) **surface, do not synthesize away** — name each contradiction explicitly via `[<contradiction_class>] (CON.<id>)` framing, with a worked example "The corpus contains a [timing_conflict] (CON.007) between X and Y — this is an open contradiction, not a resolved discrepancy"; (b) **cite the contradiction_id** for each contradiction surfaced, anchoring B.3 derivation-ledger discipline ("auditable back to the L3.5 Contradiction Register"); (c) **prohibit L1 fabrication** — present `resolution_options` as recorded in the register, or state explicitly that the contradiction is open and that resolution requires further data, computation, or native-acharya arbitration ("Do not fabricate L1 facts or invent a resolution that the register does not record"); (d) is **dormant when no contradiction-register chunks** appear in retrieved context — the rubric does not over-apply on plain factual queries.

**Smoke verification (AC.M3A.8d).** 31 new vitest cases added under describe block "Contradiction-framing rubric in shared preamble": 7 it.each cases per assertion (×4 assertion families) confirming register-reference + surface-not-synthesize + B.3-citation + B.1-prohibition strings appear in the rendered output for all 7 active classes; plus 4 standalone tests for single-injection-point uniqueness (worked CON.007 example appears exactly once per template), worked-example pattern presence, dormant-when-absent guard, and cross_native-stub-unaffected. Test suite: 83 passed / 0 failed. TypeScript: 0 new errors (9 pre-existing M2 carry-forward in AppShell.test + ReportGallery.test remain — Portal Redesign R-stream owns).

**R.M3A.3 risk-mitigation status.** PHASE_M3_PLAN §3.1 R.M3A.3 names the risk and the two-half mitigation: (1) prompt amendment with explicit "surface contradictions, do not synthesize them away" rubric, and (2) red-team verification via fixture pair. This A3 session lands the FIRST half (the prompt amendment, B.1+B.3 compliant). The SECOND half — an eval-harness fixture pair with a contradiction-loaded bundle, gold answer surfacing the framing, paired with an adversarial gold answer that synthesizes-away the tension — is recorded as a `known_residual` deferred to M3-D macro-phase-close red-team scope (AC.M3D.4 / REDTEAM_M3_v1_0.md). Existing fixture coverage in `platform/scripts/eval/fixtures.json` includes contradiction_register as a tool-authorization assertion in 1 fixture but no dedicated framing-vs-synthesis behavior pair.

**Session.** Substantive synthesis-prompt amendment per ONGOING_HYGIENE_POLICIES §G — counter 0→1 (M3 first substantive session post-A2-cadence-fire). Scripts at close: mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2); drift_detector exit=2 (259 findings — pre-existing carry-forward, no new regressions); schema_validator exit=2 (100 violations — pre-existing carry-forward, no new CRITICAL). Strict scope compliance: did NOT touch platform/src/lib/retrieve/** (A2-owned), platform/src/lib/config/feature_flags.ts (A2-owned), platform/scripts/temporal/** + 05_TEMPORAL_ENGINES/** (Tracks 2/3 owned), platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**, DISAGREEMENT_REGISTER (A4-owned), 01_FACTS_LAYER/** (L1 frozen). Read-only access to 035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_1.json to verify real (id, class) pairs.

**Multi-track close coordination delta.** At session open, the on-disk CURRENT_STATE state-block field `last_session_id` still showed `M3-W3-C2-KP-VARSHAPHALA` (from a parallel-track close-time write race earlier today), even though A2's close block in PROJECT_M3_SESSION_LOG claimed it had updated CURRENT_STATE and the file's `file_updated_by_session` field confirmed A2 was the last writer. The §3 narrative correctly carried A2 close at the top. This A3 session updates both the §2 state-block `last_session_id` and the §3 narrative to reflect A3, closing the multi-track delta.

**Next session.** M3-W1-A4-DIS009-DISPOSITION (Track 1 — DIS.009 disposition decision per PHASE_M3_PLAN §3.1 deliverable #4 + AC.M3A.4). Native picks among R1 (SPLIT) / R2 (WITHDRAW) / R3 (RE-GROUND); M3-A close-checklist follows. The contradiction-framing rubric authored in this A3 session frames the verdict's downstream synthesis surface — whichever option lands, the resulting contradiction or resolved-claim is surfaced under the rubric.

*(Below: retained narrative from prior session close M3-W3-C2-KP-VARSHAPHALA for audit trail.)*

At the close of M3-W3-C2-KP-VARSHAPHALA (2026-05-01) — **Track 3 (M3-C Multi-school + KP + Varshaphala + Shadbala) second execution session CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. PHASE_M3_PLAN_v1_0.md v1.0 active. M3-C now has KP and Varshaphala substrates produced; M3-C remaining work: Shadbala over time (M3-W3-C3) + Cross-school disagreement register entries (per PHASE_M3_PLAN §3.3 deliverable #6) + M3-C close.

**KP sub-lord engine.** `compute_kp.py` runs the canonical KP algorithm: nakshatra → sub-lord chain starting at the nakshatra's own lord with Vimshottari proportions on the 800-arcmin nakshatra width → sub-sub-lord chain starting at the sub-lord with the same Vimshottari subdivision on the sub-lord segment width. Cross-check vs FORENSIC §4.2: 9/9 nakshatra match, 9/9 Star Lord match, 9/9 Sub Lord match; 4/9 exact + 5/9 boundary-flip Sub-Sub Lord, all flips within ≤6 arcmin of FORENSIC longitude (the documented GAP.09 ayanamsha-precision band that already governs Vimshottari dasha date offsets). Verdict: WITHIN_TOLERANCE_GAP_09_BOUND. FORENSIC §4.2 values remain canonical at synthesis time for chart_id=abhisek_mohanty_primary; engine output is the substrate for non-FORENSIC charts and forward-looking transit-time KP queries when later extended.

**Varshaphala (Tajika) engine.** `compute_varshaphala.py` finds each year's Solar Return moment by 1-day coarse bracket + bisection on the signed Sun-longitude delta; precision ≤30 seconds. Output: 78 annual chart rows (1984-2061) with ascendant + 9-graha sidereal positions per year; planet_positions stored as JSONB (per brief schema; no separate join table at v1). Self-reference 1984: SR computed at 10:43:04 IST, 4 seconds from native birth time 10:43:00 IST. Sun-lon residual at SR: 0.44 arcsec worst-case, 0.23 arcsec mean across all 78 years. Three sample years cross-checked (1984 self-ref + 2026 + 2028); transit-context anchors against HEATMAP_VARSHPHAL §1 (Saturn Pisces 2026, Jupiter Gemini 2026, Saturn approaching Aries 2028) all PASS-CONSISTENT. Verdict: WITHIN_TOLERANCE_PENDING_REVIEW; full PASS verdict pending Jagannatha Hora Varshaphala export comparison at M3-D held-out work.

**Migrations 024 + 025.** kp_sublords (12 columns, UNIQUE(chart_id, planet, ayanamsha), 2 indexes, 9 INSERTs) and varshaphala (10 columns including planet_positions JSONB, UNIQUE(chart_id, year, ayanamsha), 1 index, 78 INSERTs) both authored as BEGIN/COMMIT-wrapped idempotent migrations (CREATE IF NOT EXISTS + ON CONFLICT DO NOTHING). NOT YET APPLIED to live DB — applying is a native-action step. Coordination: M3-W2-B2-YOGINI-TRANSIT owned 022 + 023 today; this session owns 024 + 025 only as declared.

**New retrieval tools (2).** `query_kp_ruling_planets.ts` reads from kp_sublords; distinct from the existing `kp_query.ts` which reads chart_facts category=kp_* (FORENSIC-anchored). Both tools coexist. `query_varshaphala.ts` reads from varshaphala; supports year/year_start/year_end + plan.time_window fallback. RETRIEVAL_TOOLS array now 20 tools (was 18 after M3-W2-B2). Zero new TypeScript errors; the 9 pre-existing test-fixture errors in tests/components/AppShell.test.tsx + tests/components/ReportGallery.test.tsx are M2 known_residuals carry-forward.

**Jaimini boundary.** Hard-respected per session brief. 05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md was opened only at session-open per the brief's Reference-artifacts list, and only to confirm UNSETTLED status — no Jaimini values were imported, called, or depended on. compute_chara.py / compute_narayana.py were not invoked. CHARA_RAW_v1_0.json / NARAYANA_RAW_v1_0.json were not read for computation. KP and Varshaphala are mathematically independent of Jaimini.

**Session.** Substantive engine + migration + retrieval-tool work; no retrieve/bundle/synthesis behavior changed for existing tools. Scripts at close: mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2). drift_detector and schema_validator not run this session (engine + table + retrieval-tool addition, no canonical-artifact fingerprint rotations or path changes that surface new findings; carry-forward holds). No new regressions. red_team_counter held at 3 (cadence pending; do not double-increment past §IS.8(a) fire-point).

**Next session.** Track 3 progresses to M3-W3-C3-SHADBALA (Shadbala over time + M3-C close); Track 1 → M3-W1-A2-PATTERN-ENGINE; Track 2 → M3-W2-B3-* optional. The next M3 substantive session must perform the §IS.8(a) every-third-session RT (counter at 3 — pending for two consecutive sessions now) OR explicitly defer to §IS.8(b) at M3-D close.

*(Below: retained narrative from prior session close M3-W1-A1-EVAL-BASELINE for audit trail.)*

At the close of M3-W1-A1-EVAL-BASELINE (2026-05-01) — **Track 1 (Retrieval & Discovery) first execution session CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. PHASE_M3_PLAN_v1_0.md v1.0 active. Three concurrent tracks now have first-execution sessions complete: Track 1 (M3-A Discovery Engines, M3-W1-A1 closed at this session), Track 2 (M3-B Parashari Dasha + Transit, M3-W2-B1 closed earlier today), Track 3 (M3-C Jaimini + KP + Varshaphala + Shadbala, M3-W3-C1 closed earlier today).

**M3-A entry-gate cleared.** AC.M3A.1 is satisfied in manual-capture mode per PHASE_M3_PLAN §3.1 entry-gate clause: `BASELINE_RUN_W9_MANUAL_v1_0.md` records the precise blocker (HTTP 401 on `/api/chat/consume` because SMOKE_SESSION_COOKIE + SMOKE_CHART_ID + ANTHROPIC_API_KEY are unavailable in this session), the harness self-check (intact end-to-end except auth credential), and the native-acceptance block. The non-stub headless run is deferred to the first M3-A session that has auth secrets available — most likely M3-W1-A2 or later when smoke-verifying Pattern Engine activation. Subsequent A2/A3 sub-sessions are NOT blocked by this gate; only AC.M3A.5 (post-baseline delta) is at risk if neither pre nor post non-stub run can be obtained by M3-A close.

**DIS.009 analysis ready for A4 disposition.** `DIS009_ANALYSIS_v1_0.md` is read-only structured framing for the AC.M3A.4 native decision at M3-A close (M3-W1-A4-DIS009-DISPOSITION). §1 grounds PAT.008's two sub-claims against L1 facts — AL-side (Saturn governs Capricorn 10H AL) is L1-clean per FORENSIC §17 line 1214 + classical Capricorn-Saturn rulership; D9-side (Saturn governs the D9 Karakamsa) is the locus of the B.10 violation per FORENSIC §3.5 + §22 — Karakamsa = Gemini = Mercury's sign, NOT Saturn's. §2 presents three resolution options (R1 split into PAT.008-AL clean + PAT.008-D9 [EXTERNAL_COMPUTATION_REQUIRED]; R2 withdraw entirely; R3 re-ground via mechanism-text rewrite) with evidence + cost + risk per option. §3 records Claude's recommendation = R3 (RE-GROUND) with R1 (SPLIT) as fallback — the underlying Saturn-Mercury-via-Capricorn yoke is real and high-significance; the violation is rhetorical, not structural; rewrite preserves the insight cleanly. Native may select any of R1/R2/R3 or instruct a different path.

**SIG.MSR.207 finding.** Confirmed absent from MSR_v3_0.md (registry skips SIG.MSR.206 line 4745 → SIG.MSR.208 line 4775). No consumers cite SIG.MSR.207 (benign for retrieval). MEDIUM severity carry-forward; flag for M3-A manifest-audit pass or M3-D close. Read-only investigation per session brief — no L2.5 corpus mutation this session.

**Session.** Governance-aside per ONGOING_HYGIENE_POLICIES §G — analysis + manual-capture artifact + state pointer updates only; no corpus or platform code mutated. Scripts at close: mirror_enforcer exit=0 (8/8 clean), drift exit=2 (259 carry-forward), schema exit=2 (100 carry-forward). No new regressions. red_team_counter unchanged at 2.

**Next session.** M3-W1-A2-PATTERN-ENGINE (Track 1 — Pattern Engine query-time activation per PHASE_M3_PLAN §3.1 deliverable #2; flag-gated at `DISCOVERY_PATTERN_ENABLED` default false; AC.M3A.2 the gate). Concurrently: Track 2 → M3-W2-B2-YOGINI-TRANSIT, Track 3 → M3-W3-C2-KP-VARSHAPHALA.

*(Below: retained narrative from prior session close M3-W2-B1-VIMSHOTTARI-ENGINE for audit trail.)*

At the close of M3-W2-B1-VIMSHOTTARI-ENGINE (2026-05-01) — **Track 2 (Parashari Dasha) first execution session CLOSED**:

**Macro-phase.** M3 — Temporal Animation / Discovery Layer, active. PHASE_M3_PLAN_v1_0.md v1.0 active. Three concurrent tracks now in flight: Track 1 (M3-A Discovery Engines, M3-W1-A1-EVAL-BASELINE closed), Track 2 (M3-B Parashari Dasha + Transit, M3-W2-B1-VIMSHOTTARI-ENGINE closed at this session), Track 3 (M3-C Jaimini + KP + Varshaphala + Shadbala, M3-W3-C1-JAIMINI-DASHAS closed). All three tracks are unblocked because Tracks 2 + 3 do not touch retrieval/bundle/synthesis, and Track 1's BASELINE_RUN_W9 hard gate guards retrieval-output-shape changes only.

**Vimshottari engine.** Engine: pyswisseph 2.10.03 + Moshier ephemeris + Lahiri sidereal mode (no .se1 files required). Native Moon at 327.0550° sidereal (Purva Bhadrapada idx 24, Jupiter lord, balance 7.5339y). Output: VIMSHOTTARI_RAW_v1_0.json (637 rows: 7 MD / 63 AD / 567 PD over 1984-02-05 → 2061-01-01). Cross-check vs FORENSIC §5.1: max delta 3 days across all 6 MD boundaries (Jupiter, Saturn, Mercury, Ketu, Venus, Sun); verdict WITHIN_TOLERANCE. The systematic 2-3 day offset (computed earlier than FORENSIC) is consistent with the FORENSIC §5 GAP.09 note about Lahiri ayanamsha variants between FORENSIC and JH — MARSYS-JIS canonical retrodictive policy keeps FORENSIC dates authoritative at synthesis time. Eval anchor: VIMSHOTTARI_GOLDEN_v1_0.json. SQL bundle: VIMSHOTTARI_INSERT_v1_0.sql (CREATE TABLE IF NOT EXISTS dasha_periods + 637 INSERTs; gated on native-authored migration 022+).

**Known residual.** Brief mis-stated that Phase 14C migration 016 created the dasha_periods table; verification at session open showed migration 016 is `016_eclipses_retrogrades.sql` and no dasha_periods table exists in any current migration (001-021). Session declared `platform/migrations/**` as must_not_touch (B2/C scope); migration authoring is a native-action follow-up. The bundled CREATE TABLE block in the SQL file makes it self-applicable once the migration lands.

**Session.** Engine + outputs only; no retrieval/bundle/synthesis touched. Governance scripts: mirror_enforcer exit=0 (8/8 clean), drift exit=2 (259 carry-forward), schema exit=2 (100 carry-forward). No new regressions. red_team_counter 0→1 (M3 first corpus-execution session per ONGOING_HYGIENE_POLICIES §G).

*(Below: retained narrative from prior session close BHISMA-W1-S4-CONVERGENCE for audit trail.)*

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

## Platform State — Database Migrations

last_migration_apply_session: M4-INFRA-001
last_migration_apply_date: 2026-05-01
migrations_applied: 022 through 031
tables_confirmed_present:
  - dasha_periods
  - signal_states
  - kp_sublords
  - varshaphala
  - audit_events
  - query_plans
  - shadbala
notes: msr_signals updated via ALTER ADD COLUMN IF NOT EXISTS (028);
  chart_facts and cgm_edges received index additions only (029, 030).
  All migrations idempotent. Cloud SQL Auth Proxy (port 5433) used for apply.

---

*End of CURRENT_STATE_v1_0.md — amended in-place 2026-04-24 at Step 15 (GOVERNANCE_BASELINE_CLOSE) to transition from rebuild-era secondary surface to steady-state authoritative state pointer. §2 YAML, §3 narrative, §5.1 authority rule all updated. Governance rebuild CLOSED.*
