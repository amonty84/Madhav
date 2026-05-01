---
artifact: M4_A_PARALLEL_BRIEFS_v1_0.md
version: 1.0
status: READY
authored_by: Cowork-M4-W1-PLAN-AUTHORING-2026-05-01
authored_at: 2026-05-01
round: "Round 2 of M4 parallel execution (Round 1 = LEL toggle feature build, 659e031)"
tracks: [M4-A-T1-SWISS-EPHEMERIS, M4-A-T2-PPL-INFRA, M4-A-T3-RUBRIC-SCHEMA, M4-A-T4-GAP-AUDIT]
shared_contract:
  branch: post-merge-main
  native: "Abhisek Mohanty — birth: 1984-02-05, 10:43 IST, Bhubaneswar (20.27°N 85.84°E), Lahiri ayanamsha"
  lel_version: "1.3 (46 events; 11 with chart_state_at_event: status: pending_computation)"
  integration_note: >
    All 4 tracks write to non-overlapping files. Integration pass merges outputs
    after all 4 close. Native reviews Track T3 rubric proposal before event-match
    records begin (M4-A-S2, post-Round-2).
file_scope:
  T1: "01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md (version bump 1.3→1.4)"
  T2: "06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl, 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md, 06_LEARNING_LAYER/OBSERVATIONS/README.md"
  T3: "06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md, 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json"
  T4: "06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md, 06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json"
---

# M4-A Round 2 — Parallel Track Briefs

**Confirm to native: Yes, this is Round 2.**
Round 1 = LEL toggle feature build (4 tracks A–D, committed 659e031/68342ca, 2026-05-01).
This Round 2 is the first parallel batch of actual M4 corpus work (no feature flags; no platform code).

---

---

## TRACK T1 — Swiss Ephemeris Computation Pass (LEL v1.3 → v1.4)

**Paste this entire block into a fresh Claude Code / Antigravity session.**

---

```
PROJECT: MARSYS-JIS — Jyotish instrument for native Abhisek Mohanty.
BRANCH: post-merge-main
SESSION ID: M4-A-T1-SWISS-EPHEMERIS

MANDATORY READING (do before any work):
1. /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md
2. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2
3. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.1
4. /Users/Dev/Vibe-Coding/Apps/Madhav/01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md (full file — it is LEL v1.3)

SCOPE — ONE TASK ONLY:
Run the Swiss Ephemeris temporal scripts for all 11 LEL events with
  chart_state_at_event: status: pending_computation
and write the computed chart states back into the LEL file, bumping it
to version 1.4.

NATIVE BIRTH DATA (do not re-derive — use exactly):
  name: Abhisek Mohanty
  date: 1984-02-05
  time: 10:43 IST (UTC+5:30)
  place: Bhubaneswar, Odisha, India
  lat: 20.2961° N
  lon: 85.8245° E
  ayanamsha: Lahiri (as used throughout this project)

THE 11 PENDING EVENTS (read exact IDs + descriptions from LEL v1.3; use
these proxy dates where the LEL carries only year or year-month):

  EVT.2000.XX.XX.01  proxy date: 2000-06-01  (Aptech course, post-10th boards)
  EVT.2004.XX.XX.02  proxy date: 2004-06-01  (CMU exchange selected but declined)
  EVT.2007.XX.XX.03  proxy date: 2007-09-01  (sleep disorder onset, post-knee surgery)
  EVT.2012.XX.XX.02  proxy date: 2012-09-01  (XIMB IRC President, second year ~2012)
  EVT.2021.XX.XX.02  proxy date: 2021-04-01  (CMU Tepper MBA selection)
  EVT.2021.XX.XX.03  proxy date: 2021-09-01  (second sand quarry stalled)
  EVT.2022.XX.XX.02  proxy date: 2022-06-01  (serious affair during MBA)
  EVT.2025.XX.XX.02  proxy date: 2025-06-01  (sleep disorder resolved via Lemborexant)
  EVT.2026.01.XX.01  proxy date: 2026-01-15  (focus/clarity shift Jan–Feb 2026)
  EVT.2026.03.20.01  exact date: 2026-03-20  (Marsys Technology project closed)
  EVT.2026.04.08.01  exact date: 2026-04-08  (sand quarry public hearing closed)

SCRIPTS TO RUN (already exist in the repo from M3):
  platform/scripts/temporal/compute_vimshottari.py
  platform/scripts/temporal/compute_yogini.py
  platform/scripts/temporal/compute_transits.py

For each of the 11 events, run all three scripts with the event's proxy/exact date.
Check each script's CLI interface first (--help or read the file header) to
confirm the exact arguments. The scripts use pyswisseph (already installed).

WHAT TO WRITE BACK (per event):
Replace each event's chart_state_at_event block:

  chart_state_at_event:
    status: pending_computation
    note: Added v1.3 — chart state requires Swiss Ephemeris computation pass.

With the computed data:

  chart_state_at_event:
    status: computed_proxy_date   # use "computed_exact_date" for events with exact dates
    computation_date: 2026-05-01
    computation_session: M4-A-T1-SWISS-EPHEMERIS
    proxy_date_used: YYYY-MM-DD   # the date you ran the scripts on
    vimshottari:
      maha_dasha: <lord> (<start_date> – <end_date>)
      antar_dasha: <lord> (<start_date> – <end_date>)
      pratyantar_dasha: <lord> (<start_date> – <end_date>)
    yogini:
      maha_dasha: <name>/<lord> (<start_date> – <end_date>)
      antar_dasha: <name>/<lord> (<start_date> – <end_date>)
    key_transits:
      saturn_sign: <sign>
      jupiter_sign: <sign>
      rahu_sign: <sign>
      sade_sati_active: true/false

If a script errors for a particular date, log the error verbatim in the
chart_state_at_event block under `computation_error:` and continue with
the other 10 events. Do not fabricate values (B.10 hard rule).

VERSION BUMP:
After all 11 blocks are written, update the LEL frontmatter:
  version: 1.3  →  1.4
  changelog: add entry:
    - v1.4 (2026-05-01, M4-A-T1-SWISS-EPHEMERIS): Swiss Ephemeris computation
      pass for 11 pending_computation events. All chart states populated
      (proxy dates where exact dates unavailable). M4-A-S1 AC.M4A.1 discharged.

ACCEPTANCE CRITERIA (verify before commit):
  AC.T1.1 — All 11 EVT blocks have chart_state_at_event.status != pending_computation
  AC.T1.2 — Each block has vimshottari + yogini + key_transits OR a computation_error note
  AC.T1.3 — No values fabricated — all from script output
  AC.T1.4 — LEL version is 1.4 in frontmatter; changelog entry present
  AC.T1.5 — No other files touched (FORENSIC frozen; nothing in 06_LEARNING_LAYER)

MUST NOT TOUCH:
  01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md (frozen)
  06_LEARNING_LAYER/** (Track T2/T3/T4 scope)
  platform/**
  025_HOLISTIC_SYNTHESIS/**
  Any 00_ARCHITECTURE/** except SESSION_LOG.md (append-only at close)

COMMIT when done:
  git add 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md
  git commit -m "feat(lel): v1.3→v1.4 — Swiss Ephemeris pass for 11 pending events (M4-A-T1)"

Then append a SESSION_LOG entry in 00_ARCHITECTURE/SESSION_LOG.md:

  **M4-A-T1-SWISS-EPHEMERIS** | 2026-05-01 | CLOSED
  Swiss Ephemeris computation pass. 11 LEL events advanced from
  pending_computation to computed state. LEL v1.3→v1.4.
  [List any events that errored with computation_error]
  AC.T1.1–T1.5: [PASS/PARTIAL per AC]
  Commit: [hash]
```

---

---

## TRACK T2 — PPL Migration + 06_LL OBSERVATIONS Scaffold

**Paste this entire block into a fresh Claude Code / Antigravity session.**

---

```
PROJECT: MARSYS-JIS — Jyotish instrument for native Abhisek Mohanty.
BRANCH: post-merge-main
SESSION ID: M4-A-T2-PPL-INFRA

MANDATORY READING (do before any work):
1. /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md
2. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2
3. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.1 (AC.M4A.5 + AC.M4A.6)
4. /Users/Dev/Vibe-Coding/Apps/Madhav/06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md
5. /Users/Dev/Vibe-Coding/Apps/Madhav/06_LEARNING_LAYER/PREDICTION_LEDGER/schema_v0_1.json

SCOPE — THREE TASKS:

TASK 1 — PPL Migration (AC.M4A.5):
The file 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §9 contains two held-out
predictions (PRED.M3D.HOLDOUT.001 and PRED.M3D.HOLDOUT.002) logged at
M3-W4-D1-VALIDATOR-REDTEAM on 2026-05-01. These must be migrated to the
canonical PPL substrate: 06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl

READ the LEL §9 block (search for "§9 — PROSPECTIVE PREDICTION SUBSECTION")
to get the exact YAML for both predictions.

The existing prediction_ledger.jsonl already has PRED.001–PRED.014 (from M2).
Read it to understand the format before appending.

APPEND two new lines to prediction_ledger.jsonl (one JSON object per line,
JSONL format), converting the YAML to JSON:

Line for PRED.M3D.HOLDOUT.001:
{
  "prediction_id": "PRED.M3D.HOLDOUT.001",
  "source_artifact": "00_ARCHITECTURE/EVAL/M3_HELD_OUT_SAMPLE_v1_0.md",
  "source_row": "Row 7 — FUTURE.2026-08-15",
  "emitted_at": "2026-05-01",
  "emitted_by_session": "M3-W4-D1-VALIDATOR-REDTEAM",
  "migrated_at": "2026-05-01",
  "migrated_by_session": "M4-A-T2-PPL-INFRA",
  "prediction_window": {"start_date": "2026-08-15", "end_date": "2026-08-15"},
  "horizon_days": 106,
  "confidence": "MED",
  "claim_text": "<copy verbatim from LEL §9>",
  "falsifier_conditions": ["<copy verbatim from LEL §9>"],
  "related_artifact_ids": ["PRED.001", "PRED.005"],
  "outcome": null,
  "outcome_source": null,
  "outcome_recorded_at": null,
  "partition": "held_out"
}

Line for PRED.M3D.HOLDOUT.002: same structure, pull all fields from LEL §9.
Add "partition": "held_out" to both entries.

DO NOT modify 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md — Track T1 is writing
to that file in parallel. The LEL §9 migration annotations (migrated: true)
will be applied in the integration pass after all tracks close.

TASK 2 — LL.1 STUB Banner Removal (AC.M4A.6):
File: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md

Find the block:
  STATUS: STUB — activates at M4. Do not populate until M3 closed + ...

Replace with:
  STATUS: ACTIVE-PENDING (M4-A) — M3 CLOSED 2026-05-01. LEL gate CLEARED
  (46 events). Waiting on calibration scoring rubric native-approval (Track
  T3) before first signal_weights/ write. Population begins at M4-B.

Also update the frontmatter:
  status: STUB  →  status: ACTIVE-PENDING
  activates_at: M4  (keep as-is — already correct)
Add to the "Last update" section:
  Updated M4-A-T2-PPL-INFRA (2026-05-01): STUB banner removed.
  Status: ACTIVE-PENDING. signal_weights/ directory not yet created
  (created at M4-B first calibration cycle per PHASE_M4_PLAN §3.2).

TASK 3 — OBSERVATIONS Directory Scaffold:
Create 06_LEARNING_LAYER/OBSERVATIONS/README.md with this content:

---
artifact: 06_LEARNING_LAYER/OBSERVATIONS/README.md
version: 1.0
status: SCAFFOLD
produced_during: M4-A-T2-PPL-INFRA
produced_on: 2026-05-01
role: >
  Observation records for the MARSYS-JIS Learning Layer substrate.
  This directory holds the empirical ground-truth records that fuel
  LL.1–LL.7 calibration mechanisms. Contents are populated across M4.
---

# 06_LEARNING_LAYER/OBSERVATIONS

This directory holds M4-A and M4-B empirical records:

| File | What it is | Produced by |
|---|---|---|
| CALIBRATION_RUBRIC_v1_0.md | Scoring rubric for LEL↔MSR signal match | M4-A Track T3 |
| lel_event_match_records_schema.json | JSON schema for event-match records | M4-A Track T3 |
| lel_event_match_records.json | Per-event match records (all 46 events) | M4-A-S2 (post-rubric approval) |
| LEL_GAP_AUDIT_v1_0.md | Decade-by-decade LEL gap analysis | M4-A Track T4 |
| msr_domain_buckets.json | MSR signals grouped by life-event domain | M4-A Track T4 |

*Directory created M4-A Track T2 (2026-05-01). All files except README.md
are authored by the tracks listed above — do not create them here.*

ACCEPTANCE CRITERIA:
  AC.T2.1 — prediction_ledger.jsonl has two new JSONL lines for PRED.M3D.HOLDOUT.001/002;
             existing PRED.001–014 lines are intact (not modified)
  AC.T2.2 — Both new entries have "partition": "held_out" and "migrated_by_session": "M4-A-T2-PPL-INFRA"
  AC.T2.3 — 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md status updated to ACTIVE-PENDING;
             STUB banner replaced with ACTIVE-PENDING text
  AC.T2.4 — 06_LEARNING_LAYER/OBSERVATIONS/README.md created with the scaffold content above
  AC.T2.5 — 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md NOT touched (T1 owns this file)

MUST NOT TOUCH:
  01_FACTS_LAYER/** (T1 owns; do not touch even LEL §9)
  06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md (T3 scope)
  06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records*.json (T3 scope)
  06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md (T4 scope)
  06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json (T4 scope)
  platform/**
  025_HOLISTIC_SYNTHESIS/**

COMMIT when done:
  git add 06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl
  git add 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md
  git add 06_LEARNING_LAYER/OBSERVATIONS/README.md
  git commit -m "feat(m4-a): PPL migration + LL.1 STUB→ACTIVE-PENDING + OBSERVATIONS scaffold (M4-A-T2)"

Then append SESSION_LOG entry:

  **M4-A-T2-PPL-INFRA** | 2026-05-01 | CLOSED
  PPL migration: PRED.M3D.HOLDOUT.001 + .002 appended to prediction_ledger.jsonl
  (partition: held_out). LL.1 STUB banner replaced with ACTIVE-PENDING.
  06_LEARNING_LAYER/OBSERVATIONS/ directory scaffolded (README.md).
  AC.T2.1–T2.5: [PASS/PARTIAL per AC]
  Commit: [hash]
```

---

---

## TRACK T3 — Calibration Rubric Proposal + Event-Match Schema

**Paste this entire block into a fresh Claude Code / Antigravity session.**

---

```
PROJECT: MARSYS-JIS — Jyotish instrument for native Abhisek Mohanty.
BRANCH: post-merge-main
SESSION ID: M4-A-T3-RUBRIC-SCHEMA

MANDATORY READING (do before any work):
1. /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md
2. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2
3. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.1 (AC.M4A.2 + AC.M4A.3)
4. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B LL.1
5. /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/MSR_v3_0.md (skim first 100 lines for structure)
6. /Users/Dev/Vibe-Coding/Apps/Madhav/01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §1–§3 only
   (for LEL structure; do not read the full 1700+ lines)

CONTEXT — WHY THIS TRACK EXISTS:
The LL.1 mechanism (Signal Weight Calibration) requires event-match records:
for each of the 46 LEL life events, we map which MSR signals should have been
"lit" (active) at that event's date and record whether they actually were.
This is the input that trains calibration weights.

BEFORE any event-match records can be written, native must approve the
CALIBRATION SCORING RUBRIC — how "match" is defined. This is NAP.M4.1
(Native Approval Point 1) from PHASE_M4_PLAN §5.

YOUR JOB: author two documents that give the native everything needed to
make NAP.M4.1 approval decision:

DOCUMENT 1 — CALIBRATION_RUBRIC_v1_0.md (DRAFT — awaiting native approval)
Path: 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md

This document proposes three alternative rubric options. For each option,
specify: (a) how "signal match" is scored, (b) tradeoffs, (c) worked example
using one concrete LEL event (suggest EVT.2023.07.XX.01 — Marsys founded —
since its signal stack is documented in LEL §8 retrodictive table).

The three options to propose (refine + expand each):

OPTION A — Binary Match (simplest):
  A signal "matches" an event if it was "lit" (active) within ±30 days
  of the event date per compute_transits.py / signal_activator.py output.
  match_score ∈ {0, 1} per signal per event.
  Calibration weight = (matched_signals / expected_signals) per event.
  Tradeoffs: Simple, interpretable. Misses orb gradations. 30-day window
  may be too wide for short events, too narrow for slow-moving dashas.

OPTION B — Graded Proximity Match (recommended baseline):
  A signal scores 1.0 if lit exactly at the event date;
  0.7 if lit within ±7 days;
  0.5 if lit within ±30 days;
  0.2 if lit within ±90 days;
  0.0 if not lit within ±90 days.
  match_score ∈ [0.0, 1.0] per signal per event.
  Separate grading for: dasha-level match (MD/AD/PD alignment) vs
  transit-level match (lit via transit only).
  Tradeoffs: More nuanced; requires the scoring function to be deterministic
  and reproducible. Adds complexity to calibration pipeline.

OPTION C — Domain-Bucket Match (if Option B is too granular at this stage):
  Group MSR signals into life-event domain buckets (career, health,
  relationship, finance, spiritual, family, travel, education).
  Score 1.0 if ≥1 signal in the matching domain bucket was lit at event date;
  0.5 if only adjacent-domain signals lit;
  0.0 if no domain-relevant signal lit.
  Tradeoffs: Coarser but robust. Easier to audit. Less fine-grained
  calibration. Better for initial cycle when many events have approximate dates.

For each option: include a worked example showing how EVT.2023.07.XX.01
(Marsys founded, 2023-07-01 approx) would be scored, referencing the
known signal stack from LEL §8: SIG.08 + CVG.02 + SIG.09 + SIG.14 +
RPT.DSH.01. Use whatever signal_activator.py or compute_transits.py output
you can access for 2023-07-01 (or describe what you would query).

Add a RECOMMENDATION section at the end: which option you recommend for the
first M4 calibration cycle and why (1 paragraph). This is your proposal;
native makes the final call.

Frontmatter:
---
artifact: 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md
version: 1.0-DRAFT
status: AWAITING_NATIVE_APPROVAL
native_approval_point: NAP.M4.1 (PHASE_M4_PLAN §5)
produced_during: M4-A-T3-RUBRIC-SCHEMA
produced_on: 2026-05-01
---

DOCUMENT 2 — lel_event_match_records_schema.json
Path: 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json

Write a JSON Schema (draft-07 compatible) for the event-match records file.
Each record represents one LEL event. Fields:

{
  "event_id": "EVT.YYYY.MM.DD.NN",   // string, required
  "event_date_used": "YYYY-MM-DD",   // string, required — the date used for script queries
  "event_date_confidence": "exact|approx-month|approx-year|proxy",  // enum
  "rubric_version": "1.0",           // string — which CALIBRATION_RUBRIC version used
  "partition": "training|held_out",  // enum, required
  "expected_lit_signals": [          // array of signal IDs expected to fire
    {
      "signal_id": "SIG.XXX",        // string
      "signal_domain": "career|health|relationship|finance|spiritual|family|travel|education|psychological|other",
      "basis": "classical_rule|temporal_engine|both"  // why this signal was expected
    }
  ],
  "actual_lit_signals": [            // array from signal_activator.py output
    {
      "signal_id": "SIG.XXX",
      "lit_score": 1.0,              // float 0.0–1.0 per rubric
      "lit_source": "transit|dasha|both"
    }
  ],
  "match_rate": 0.0,                 // float — overall match score per rubric
  "match_notes": "",                 // string — any acharya-grade observation
  "computation_session": "",         // string — session that populated this record
  "schema_version": "1.0"
}

The schema file should be a proper JSON Schema document (not just documentation),
with "type", "properties", "required", and "additionalProperties" fields.
Include a "$schema" field pointing to draft-07.

ACCEPTANCE CRITERIA:
  AC.T3.1 — CALIBRATION_RUBRIC_v1_0.md exists at correct path; status AWAITING_NATIVE_APPROVAL
  AC.T3.2 — Three rubric options defined (A, B, C) with tradeoffs for each
  AC.T3.3 — Worked example present for at least one option using EVT.2023.07.XX.01
  AC.T3.4 — Recommendation section present (Claude's proposal, clearly labeled as proposal)
  AC.T3.5 — lel_event_match_records_schema.json is valid JSON Schema draft-07
  AC.T3.6 — Schema covers all required fields listed above
  AC.T3.7 — No event-match records populated yet (records file does not exist —
             that is M4-A-S2 scope, after native approves rubric)

MUST NOT TOUCH:
  01_FACTS_LAYER/** (T1 owns)
  06_LEARNING_LAYER/PREDICTION_LEDGER/** (T2 owns)
  06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md (T2 owns)
  06_LEARNING_LAYER/OBSERVATIONS/README.md (T2 owns)
  06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md (T4 owns)
  06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json (T4 owns)
  platform/**
  025_HOLISTIC_SYNTHESIS/**

COMMIT when done:
  git add 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md
  git add 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json
  git commit -m "feat(m4-a): calibration rubric DRAFT + event-match schema (M4-A-T3)"

Then append SESSION_LOG entry:

  **M4-A-T3-RUBRIC-SCHEMA** | 2026-05-01 | CLOSED
  CALIBRATION_RUBRIC_v1_0.md authored (DRAFT, status: AWAITING_NATIVE_APPROVAL).
  Three options proposed (A: binary, B: graded-proximity, C: domain-bucket).
  Recommendation: [state which option was recommended].
  lel_event_match_records_schema.json authored (JSON Schema draft-07).
  NAP.M4.1 now ready for native review.
  AC.T3.1–T3.7: [PASS/PARTIAL per AC]
  Commit: [hash]
```

---

---

## TRACK T4 — LEL Gap Audit + MSR Domain Cross-Reference

**Paste this entire block into a fresh Claude Code / Antigravity session.**

---

```
PROJECT: MARSYS-JIS — Jyotish instrument for native Abhisek Mohanty.
BRANCH: post-merge-main
SESSION ID: M4-A-T4-GAP-AUDIT

MANDATORY READING (do before any work):
1. /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md
2. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2
3. /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.1 (AC.M4A.7)
4. /Users/Dev/Vibe-Coding/Apps/Madhav/01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §2 (event list only — search for all EVT.* lines)
5. /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/MSR_v3_0.md (skim for domain labels)

CONTEXT:
Per MACRO_PLAN §M4 Risks §(b): "Native selectively logs memorable events;
audit surfaces systematic gaps." This audit is AC.M4A.7 in PHASE_M4_PLAN.
Additionally, the MSR domain cross-reference (msr_domain_buckets.json)
prepares for event-match record population in M4-A-S2 by pre-categorizing
the 499 MSR signals into life-event domain buckets.

SCOPE — TWO DOCUMENTS:

DOCUMENT 1 — LEL_GAP_AUDIT_v1_0.md
Path: 06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md

Steps:
(a) Read all EVT.* event IDs from LIFE_EVENT_LOG_v1_2.md. Extract event IDs,
    dates, and categories. Build a chronological list covering 1984–2026.

(b) Group events by DECADE:
    1984–1989, 1990–1999, 2000–2009, 2010–2019, 2020–2026

(c) For each decade, count events per major CATEGORY:
    career, education, health, relationship, family, financial, psychological,
    spiritual, travel, other.

(d) Identify GAPS: a "gap" is any decade × category cell with 0 events where
    a native's life plausibly should have entries (use judgment; flag but do
    not fabricate). Also flag any period > 3 years with no events at all.

(e) For each gap, note:
    - gap_id (e.g., GAP.M4A.01, GAP.M4A.02, ...)
    - decade + category
    - reason it is a gap (explicit absence vs implied absence)
    - disposition options: accept (data is genuinely sparse) | elicit (ask native)
                          | infer (document as "no known event" without elicitation)
    - default disposition: accept (unless obvious major life area is blank)

(f) Summary statistics:
    - Total events: 46 (v1.3)
    - Events per decade table
    - Events per category table
    - Count of flagged gaps

The document should be acharya-grade useful — something that helps the next
session decide whether to elicit more events before M4-A closes.

Frontmatter:
---
artifact: 06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md
version: 1.0
status: COMPLETE
produced_during: M4-A-T4-GAP-AUDIT
produced_on: 2026-05-01
lel_version_audited: 1.3 (46 events)
---

DOCUMENT 2 — msr_domain_buckets.json
Path: 06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json

The MSR (Master Signal Register) has 499 signals. For event-match records
to work, signals need to be grouped into life-event domain buckets that
correspond to LEL event categories.

Steps:
(a) Read MSR_v3_0.md to understand the signal IDs and domains.
    The MSR likely has signals organized by domain (career, health, etc.).

(b) For each MSR signal, identify its primary domain bucket from:
    career, education, health, relationship, family, financial,
    psychological, spiritual, travel, general (for signals spanning multiple
    domains).

(c) Produce msr_domain_buckets.json:
{
  "schema_version": "1.0",
  "produced_by": "M4-A-T4-GAP-AUDIT",
  "produced_on": "2026-05-01",
  "msr_version": "3.0",
  "total_signals": 499,
  "domain_buckets": {
    "career": ["SIG.001", "SIG.002", ...],
    "education": [...],
    "health": [...],
    "relationship": [...],
    "family": [...],
    "financial": [...],
    "psychological": [...],
    "spiritual": [...],
    "travel": [...],
    "general": [...]
  },
  "multi_domain_signals": [
    {"signal_id": "SIG.XXX", "primary": "career", "secondary": ["financial"]}
  ],
  "notes": "Domain assignments are approximate; based on signal description in MSR v3.0."
}

IMPORTANT: If MSR_v3_0.md is very large (>500 lines), read it in sections.
If domain labels aren't explicit in MSR, derive them from signal descriptions.
If uncertain on a signal, assign to "general" — do not fabricate domain.

ACCEPTANCE CRITERIA:
  AC.T4.1 — LEL_GAP_AUDIT_v1_0.md exists; covers all 5 decades (1984–2026)
  AC.T4.2 — Gap table present with gap_id, decade, category, disposition for each gap
  AC.T4.3 — Summary statistics table (events per decade + per category) present
  AC.T4.4 — msr_domain_buckets.json valid JSON; "domain_buckets" covers all 9 buckets
  AC.T4.5 — msr_domain_buckets.json has reasonable coverage (at least 400 of 499 signals
             assigned — if MSR read is incomplete, document which signals could not be read)
  AC.T4.6 — No values fabricated; if signal domain is uncertain, use "general"

MUST NOT TOUCH:
  01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md (T1 owns — read-only)
  06_LEARNING_LAYER/PREDICTION_LEDGER/** (T2 owns)
  06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md (T2 owns)
  06_LEARNING_LAYER/OBSERVATIONS/README.md (T2 owns)
  06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md (T3 owns)
  06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json (T3 owns)
  platform/**
  025_HOLISTIC_SYNTHESIS/** (read-only for MSR)

COMMIT when done:
  git add 06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md
  git add 06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json
  git commit -m "feat(m4-a): LEL gap audit v1.0 + MSR domain buckets (M4-A-T4)"

Then append SESSION_LOG entry:

  **M4-A-T4-GAP-AUDIT** | 2026-05-01 | CLOSED
  LEL_GAP_AUDIT_v1_0.md: decade-by-decade gap analysis on 46 events.
  [N] gaps flagged (GAP.M4A.01–NN); [X] accept, [Y] elicit-recommended, [Z] infer.
  msr_domain_buckets.json: [N] of 499 MSR signals categorized into domain buckets.
  AC.T4.1–T4.6: [PASS/PARTIAL per AC]
  Commit: [hash]
```

---

---

## POST-ROUND-2 INTEGRATION CHECKLIST

After all 4 tracks close, run this integration pass (single session):

1. **Verify non-overlap:** confirm T1–T4 touched only their declared files.
2. **LEL §9 annotation:** Add `migrated: true` to LEL §9 PRED.M3D.HOLDOUT.001/002
   entries (deferred from T2 to avoid merge conflict with T1).
3. **Native reviews NAP.M4.1:** Present Track T3's CALIBRATION_RUBRIC_v1_0.md
   to native for approval. Until approved, event-match record population
   (the actual `lel_event_match_records.json` data) does not start.
4. **CURRENT_STATE update:** record M4-A Round 2 complete; active sub-phase
   state updated.
5. **SESSION_LOG integration entry** appended.

Native decision needed post-integration: which of Option A / B / C
(from T3 rubric proposal) to use for event-match records.

---

*End of M4_A_PARALLEL_BRIEFS_v1_0.md*
