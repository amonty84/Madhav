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
  active_macro_phase: M2                       # M1 completed; M2 is currently-active
  active_macro_phase_title: "Corpus Activation"
  active_macro_phase_status: active
    # One of: active | paused_governance_rebuild | paused_native_hold | closed
    # Flipped from "paused_governance_rebuild" to "active" at Step 15 close 2026-04-24.

  # ------------------------------------------------------------------
  # Phase-plan expansion (per PHASE_B_PLAN_v1_0.md §"B.0 – B.10")
  # ------------------------------------------------------------------
  active_phase_plan: 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md
  active_phase_plan_version: "1.0.3"             # amendment complete (Madhav 16, 2026-04-24; resolved WARN.2/3/5/7)
  active_phase_plan_sub_phase: "B.3 complete"  # Madhav_M2A_Exec_4 closed 2026-04-25; all B.3 ACs pass (AC-B3.3 accepted Option A); B.3.5 CGM + red-team next
  active_phase_plan_status: active              # M2 active; B.3 complete; B.3.5 CGM Rebuild + red-team execution next

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
  red_team_counter: 3
    # Reset from 8 to 0 at Step 15 close (macro-phase-close red-team fired 2026-04-24;
    # 2/2 PASS). Incremented to 1 at Madhav 16 close. Incremented to 2 at Madhav 17 close.
    # Incremented to 3 at Madhav_M2A_Plan_Foundation_Stack close (2026-04-25).
    # Threshold reached (>=3). Cadence red-team is DUE.
    # Deferred to M2A-Exec (first code-delivery session) — planning-only session has no
    # code deliverables to probe. See red_team_due_note below.

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
  last_session_id: Madhav_M2A_Exec_4
    # Madhav_M2A_Exec_4 closed 2026-04-25. B.3 Embedding + HNSW.
    # GCP migration: Cloud SQL PostgreSQL 15 (asia-south1, db-g1-small), pgvector, Auth Proxy port 5433.
    # Voyage AI removed; replaced with Vertex AI text-multilingual-embedding-002 (768-dim, ADC, no API key).
    # BATCH_SIZE=10 (Vertex 20k token/request limit); re-chunked locally (Supabase paused).
    # embed.py: psycopg reads/writes, HNSW m=16 ef_construction=64 vector_cosine_ops.
    # 743 embeddings in rag_embeddings (all non-stale chunks). HNSW index present.
    # Sanity: "Saturn 7th house Libra" → top-3 sim 0.763/0.750/0.736; 2 distinct doc_types.
    # AC-B3.1 ✓ B3.2 ✓ B3.3 accepted-Option-A (p95=71.56ms > 50ms, Auth Proxy overhead) B3.4 ✓ B3.5 ✓.
    # mirror_enforcer.py exit 0 (8/8 pairs clean). red_team_counter stays at 3 (fires at Session 5).
  last_session_closed_at: 2026-04-25T22:00:00+05:30
  last_session_attempted_close_at: 2026-04-25T22:00:00+05:30
  last_session_agent: claude-sonnet-4-6
  last_session_cowork_thread_name: "Madhav M2A-Exec-4 — Foundation Stack Session 4"
  last_session_close_state: atomically_closed
  last_session_drift_verdict: >
    drift_detector exit=2 (34 findings; pre-existing carry-over).
    schema_validator exit=2 (46 violations; 1 HIGH pre-existing Madhav_16 naming disagreement;
    45 MEDIUM/LOW frontmatter fields; no new violations from B.3 scope).
    mirror_enforcer exit=0.
  last_session_deliverable: >
    B.3 complete — Foundation Stack Session 4. GCP migration (Supabase → Cloud SQL).
    Voyage AI → Vertex AI text-multilingual-embedding-002 (768-dim, GCP-native).
    embed.py: batch embed, pre-embedding enrichment ([{layer}] [{doc_type}] prefix),
    content-hash idempotency, HNSW index. 743/743 non-stale chunks embedded.
    b3_sanity_test.json: query "Saturn 7th house Libra", top-3 sims 0.763/0.750/0.736,
    2 distinct doc_types, p95=71.56ms (Auth Proxy overhead, Option A accepted).
    B.3 CLOSED. B.3.5 CGM Rebuild + red-team probes RT1–RT6 is next (Session 5).
  previous_session_id: Madhav_M2A_Exec_3
    # Closed 2026-04-25; B.2 Chunking doc-types 4–5 + doc-type 6 code + B.2 ACs session.

  # ------------------------------------------------------------------
  # Next-session commitment (single committed objective per SESSION_LOG_SCHEMA §4)
  # ------------------------------------------------------------------
  next_session_objective: >
    Execute **Madhav_M2A_Exec_5 — Foundation Stack Session 5 (B.3.5 CGM Rebuild + red-team)**
    per CLAUDECODE_BRIEF v5.0 §SESSION_5 and M2A_EXEC_PLAN_v1_0.md §PLAN B.3.5.
    Trigger phrase: "Read CLAUDECODE_BRIEF.md and execute it."
    Build CGM_v9_0.md (node-per-planet format), run cgm_node.py against it, verify
    CGM chunk ingestion. Red-team probes RT1–RT6 fire at this session close
    (counter = 3, threshold = 3, held through Sessions 1–4; fires now).
    Set CLAUDECODE_BRIEF.md status: COMPLETE at Session 5 close.
  next_session_proposed_cowork_thread_name: "Madhav M2A-Exec-5 — Foundation Stack Session 5"
  red_team_due_note: >
    Counter reached 3 at Madhav_M2A_Plan_Foundation_Stack close (2026-04-25).
    Deferred to M2A-Exec.5 (final Foundation Stack session). M2A_EXEC_PLAN §RISKS specifies
    6 probes (RT1–RT6) for B.1–B.3.5 deliverables.

  # ------------------------------------------------------------------
  # Freshness metadata (for drift detection)
  # ------------------------------------------------------------------
  file_updated_at: 2026-04-25T22:00:00+05:30
  file_updated_by_session: Madhav_M2A_Exec_4
  cross_check_hash: >
    Derived from the tuple (active_governance_step, last_session_id, next_governance_step)
    = (Step_15 completed, Madhav_M2A_Exec_4, null).
    STEP_LEDGER is GOVERNANCE_CLOSED; drift_detector.py cross-checks against
    SESSION_LOG's latest `session_close.session_id` (always).
  cross_check_authority: CURRENT_STATE           # post-Step-15; STEP_LEDGER is GOVERNANCE_CLOSED
```

---

## §3 — Narrative (human-reading surface — must agree with §2)

At the close of Madhav_M2A_Exec_4 (2026-04-25):

**Macro-phase.** The project is in **M2 — Corpus Activation**, active. **B.3 Embedding + HNSW is COMPLETE**: 743 embeddings in `rag_embeddings` (all non-stale chunks). B.3.5 CGM Rebuild + red-team (Session 5) is next.

**Phase-plan expansion.** `PHASE_B_PLAN_v1_0.md` at v1.0.3. **B.3 complete.** GCP-native stack: Cloud SQL PostgreSQL 15 (asia-south1), Vertex AI `text-multilingual-embedding-002` (768-dim, ADC). HNSW index present (m=16, ef_construction=64, vector_cosine_ops). `b3_sanity_test.json`: "Saturn 7th house Libra" → top-3 sims 0.763/0.750/0.736, 2 distinct doc_types (AC-B3.4 ✓), p95=71.56ms Auth Proxy overhead (AC-B3.3 accepted Option A). AC-B3.1/B3.2/B3.5 all pass. `chunking_report.json`: p1_violations=0, stale_chunk_count=16, truncation_events=60, p5_warnings=499 (pre-existing baselines).

**Governance step.** Step 15 completed (GOVERNANCE_BASELINE_CLOSE, 2026-04-24). No next governance step. CURRENT_STATE is authoritative per §5.2.

**Native directives.** ND.1 addressed. No open directives.

**Red-team.** `red_team_counter: 3` (threshold = 3; cadence fire DUE). Held through Sessions 1–4; fires at Madhav_M2A_Exec_5. M2A_EXEC_PLAN §RISKS specifies 6 probes (RT1–RT6).

**Last Claude Code session.** `Madhav_M2A_Exec_4`, agent `claude-sonnet-4-6`, closed 2026-04-25. Deliverables: `embed.py` (Vertex AI 768-dim, HNSW), `b3_sanity_test.json`, `chunking_report.json` (re-run), GCP migration (`gcp_migrate.sh`, Cloud SQL Auth Proxy, `.env.rag`). Preceding session: `Madhav_M2A_Exec_3`.

**Next-session commitment.** `Madhav_M2A_Exec_5` — Session 5 (B.3.5 CGM Rebuild + red-team RT1–RT6). Trigger: "Read CLAUDECODE_BRIEF.md and execute it."

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
