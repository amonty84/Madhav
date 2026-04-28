---
artifact: FILE_REGISTRY_v1_7.md
version: 1.7
status: SUPERSEDED
superseded_by: FILE_REGISTRY_v1_8.md (2026-04-26, Madhav_M2A_Exec_7 close)
date: 2026-04-26
scope: Delta registry for Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 Session 1 deliverables — serializer v0.2.0, three JSON schemas, COWORK_LEDGER, governance extensions (SESSION_CLOSE_TEMPLATE, SESSION_LOG_SCHEMA, ONGOING_HYGIENE_POLICIES, CANONICAL_ARTIFACTS amendments).
supersedes: FILE_REGISTRY_v1_6.md (2026-04-26, Madhav_M2A_Exec_6)
schema_version: 1.7
changelog:
  - v1.7 amended-in-place (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3 / PORTAL_BUILD_TRACKER Session 3):
    §9.9 Session 3 table appended: 5 new components (InterventionList, ActivityFeed, MirrorPairsTable,
    HealthTrend, HealthSparkline) + 4 stub-to-full replacements (interventions, parallel, health, activity).
  - v1.7 amended-in-place (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2 / PORTAL_BUILD_TRACKER Session 2):
    §9.9 portal stub row replaced with full portal source tree (26 new files: lib/build/*, components/build/*, app/build/** routes + stubs).
  - v1.7 (2026-04-26, Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 / PORTAL_BUILD_TRACKER Session 1):
    (a) §9.1 — FILE_REGISTRY row updated to v1.7 (this file); FILE_REGISTRY_v1_6 flipped to SUPERSEDED in §8.
    (b) §9.9 NEW — Session 1 deliverables: COWORK_LEDGER.md (new canonical artifact), serialize_build_state.py
        v0.2.0, build_state.schema.json v0.2, build_state_session_detail.schema.json (new),
        build_state_phase_detail.schema.json (new), amendments to SESSION_CLOSE_TEMPLATE,
        SESSION_LOG_SCHEMA, ONGOING_HYGIENE_POLICIES, CANONICAL_ARTIFACTS.
    (c) §8 — FILE_REGISTRY_v1_6 archival row added.
    (d) §1–§7, §9.2–§9.8, §10 — unchanged from v1.6 by reference.
  - v1.6 (2026-04-26): B.4 Session 1 CGM edges manifest + graph.py.
  - v1.5 (2026-04-26): B.3.5 CGM Rebuild + Build Tracker Integration.
  - v1.4 (2026-04-24/2026-04-25): Step 12 governance bundle + B.1 ingestion deliverables.
  - v1.3 (2026-04-24, Step 7): governance-integrity bundle.
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE v2.1 → v2.2.
  - v1.1 (2026-04-23, Step 5): MSR v2.0 → v3.0; MP v2.0.
  - v1.0 (2026-04-19): registry successor to FILE_INDEX_v1_0.
---

# MARSYS-JIS File Registry — Final Corpus (v1.7)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-26 (v1.7 published at Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 Session 1; supersedes v1.6)

The v1.7 revision is **delta-style relative to v1.6**. Changed sections: §8 (FILE_REGISTRY_v1_6 archival), §9.1 (registry self-row), §9.9 (Session 1 deliverables). All other sections are unchanged from v1.6. The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`.

---

## §1–§3 — L0, L1, L2

See `FILE_REGISTRY_v1_4.md §1–§3` — unchanged.

---

## §4 — L2.5 Holistic Synthesis (Canonical)

See `FILE_REGISTRY_v1_6.md §4` — unchanged.

---

## §5–§7 — L3, L4, L5

See `FILE_REGISTRY_v1_4.md §5–§7` — unchanged.

---

## §8 — Archival

*Superseded artifacts retained in-place per ONGOING_HYGIENE_POLICIES §A.*

| File | Superseded By | Supersession Session | Date | Notes |
|---|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` (this) | Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 | 2026-04-26 | Portal Build Tracker Session 1 governance extension delta |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | Madhav_M2A_Exec_5 | 2026-04-26 | B.3.5 CGM Rebuild; archive copy at `99_ARCHIVE/CGM_v2_0.md` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md` | Madhav_M2A_Exec_6 | 2026-04-26 | B.4 Session 1 manifest + graph deliverables |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` | Madhav_M2A_Exec_5 | 2026-04-26 | B.3.5 CGM Rebuild delta |

*Additional archival rows preserved from v1.4 §8 by reference.*

---

## §9 — Tooling & Process

### §9.1 — Architecture & Governance artifacts (v1.7 delta)

*Updated rows at v1.7 only. All other rows carry from v1.6 §9.1 by reference.*

| File | Version | Status | canonical_artifact_id | Mirror obligations (summary) |
|---|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` | 1.7 | **CURRENT** | FILE_REGISTRY | MP.5 (adapted_parity_subset) — Gemini-side carries only L2.5 paths; governance rows are Claude-only; no Gemini-side update required for this bump |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md` | 1.6 | **SUPERSEDED** | — | Superseded 2026-04-26 by v1.7 |

*All other §9.1 rows unchanged from v1.6 §9.1.*

### §9.2–§9.8

See `FILE_REGISTRY_v1_6.md §9.2–§9.8` — unchanged.

### §9.9 — Portal Build Tracker Session 1 deliverables (NEW at v1.7)

#### Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 Session 1 (governance extension + serializer v0.2.0)

**New canonical artifact:**

| File | Version | Status | canonical_artifact_id | Notes |
|---|---|---|---|---|
| `00_ARCHITECTURE/COWORK_LEDGER.md` | 1.0 | **LIVING** | COWORK_LEDGER | New at Session 1. Project-side record of Cowork platform threads. 5 bootstrap entries covering predecessor Cowork threads (2026-04-26). Cadence: append-on-thread-close per ONGOING_HYGIENE_POLICIES §P. Serializer reads this file at every session close. |

**Serializer and schemas (amended / new):**

| File | Version | Status | Notes |
|---|---|---|---|
| `platform/scripts/governance/serialize_build_state.py` | 0.2.0 | **LIVE** | v0.1.0 → v0.2.0. New readers: native_directives, disagreement_register, staleness_register, red_team_reports, phase_b_plan, macro_arc, drift/schema/mirror history, cowork_ledger, current_brief. New shard assembly (`assemble_all_shards()`). Extended `assemble_build_state()`. New CLI flags: `--emit-shards`, `--shard-dir`, `--version`, `--trend-n`. |
| `platform/scripts/governance/schemas/build_state.schema.json` | 0.2 | **CURRENT** | v0.1 → v0.2. `additionalProperties: true` at top level. New required fields: disagreement_register, red_team_passes, staleness_register, sessions_index, phases_index, cowork_ledger, workstreams. Extended: macro_arc, sub_phases, scripts_trend, native_directives.entries. Optional: current_brief, staleness_seconds_since_last_close. |
| `platform/scripts/governance/schemas/build_state_session_detail.schema.json` | 1.0 | **NEW** | Per-session shard schema for `gs://marsys-jis-build-state/sessions/{session_id}.json`. Required: session_id, schema_version. Key nullable fields: session_open, session_close, header, body_excerpts. Arrays: files_touched, deliverables, residuals, halts_encountered, native_overrides. `_note` field for legacy entries. |
| `platform/scripts/governance/schemas/build_state_phase_detail.schema.json` | 1.0 | **NEW** | Per-phase shard schema for `gs://marsys-jis-build-state/phases/{phase_id}.json`. Required: phase_id, schema_version, title, status. Status enum: completed/in_progress/pending/unknown. Arrays: sessions, acceptance_criteria, deliverables_complete, deliverables_pending, dependencies_inbound, dependencies_outbound. |

**Governance amendments:**

| File | Amendment | Session |
|---|---|---|
| `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` | Added `native_overrides: []` and `halts_encountered: []` optional blocks; updated `build_state_serialized` to serializer_version "0.2.0" + `shards_emitted` + `cowork_ledger_referenced` fields. | Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 |
| `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | Added §1.5 between §1.4 and §2: 8-element `expected_session_class` enum (m2_corpus_execution, governance_aside, planning_only, fix_session, red_team, brief_authoring, native_intervention, cowork_orchestration). Serializer infers class with `inferred: true` for pre-adoption entries. | Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 |
| `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` | §O extended: `shards_emitted` and `cowork_ledger_referenced` sub-fields added to close-checklist field description. §P new: Cowork ledger discipline (append-on-thread-close, ≤5 lines per entry). | Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | COWORK_LEDGER row added to §1. fingerprint_sha256: 8333c090b373a084932a85a89869de819721f26fa38139ebbb0c48e00c32cffa. | Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 |

**Session brief (governance infrastructure):**

| File | Status | Notes |
|---|---|---|
| `CLAUDECODE_BRIEF.md` | COMPLETE (at session close) | Self-authored brief for Session 1 scope. Overrides prior Madhav_M2A_Exec_7 brief (set to COMPLETE at this session close). |

**Portal source tree — Session 2 deliverables (Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2):**

| Path | Status | Notes |
|---|---|---|
| `platform/src/lib/build/types.ts` | NEW | TS types mirroring GCS schema_version 0.2.0 (BuildState, SessionDetail, PhaseDetail, + all sub-types). |
| `platform/src/lib/build/dataSource.ts` | NEW | `server-only`; `fetchBuildState()`, `fetchSessionDetail(id)`, `fetchPhaseDetail(id)`. Env var `BUILD_STATE_GCS_BASE`. |
| `platform/src/lib/build/format.ts` | NEW | `relativeTime`, `stalenessLabel`, `daysUntil`, `truncateFingerprint`, `exitCodeVariant/Label`, `statusVariant`, `formatDate`. |
| `platform/src/lib/build/parsers/sessionClass.ts` | NEW | `normalizeSessionClass` + `sessionClassLabel` for the 8-element `expected_session_class` enum. |
| `platform/src/components/build/BuildHeader.tsx` | NEW | `use client`; nav links + RefreshButton + avatar dropdown. |
| `platform/src/components/build/RefreshButton.tsx` | NEW | `use client`; `router.refresh()` with spinner. |
| `platform/src/components/build/StatusPill.tsx` | NEW | RSC; status string → Badge variant. |
| `platform/src/components/build/ScriptVerdictBadge.tsx` | NEW | RSC; exit code integer → colored Badge. |
| `platform/src/components/build/CockpitGrid.tsx` | NEW | RSC; renders all Cockpit cards (phase position, script verdicts, gauges, recent activity, brief panel). |
| `platform/src/components/build/BriefPanel.tsx` | NEW | RSC; renders current_brief or "[no active brief]". |
| `platform/src/components/build/PhaseGrid.tsx` | NEW | RSC; renders B.0–B.10 phase cards with status pills and drill-down links. |
| `platform/src/components/build/SessionTable.tsx` | NEW | `use client`; sortable + filterable table of sessions_index (62 rows). |
| `platform/src/components/build/SessionDetail.tsx` | NEW | RSC; renders one session shard with graceful fallbacks for null shard and legacy entries. |
| `platform/src/components/build/RegistryTable.tsx` | NEW | `use client`; sortable canonical artifact table with fingerprint truncation. |
| `platform/src/app/build/layout.tsx` | NEW | RSC; auth gate (super_admin); BuildHeader. |
| `platform/src/app/build/page.tsx` | NEW | RSC; Cockpit — fetches BuildState → CockpitGrid. force-dynamic. |
| `platform/src/app/build/plan/page.tsx` | NEW | RSC; Plan view — macro arc strip + PhaseGrid. force-dynamic. |
| `platform/src/app/build/plan/[phase_id]/page.tsx` | NEW | RSC; Phase drill-down — fetchPhaseDetail → detail cards. force-dynamic. |
| `platform/src/app/build/sessions/page.tsx` | NEW | RSC; Session table — fetches BuildState → SessionTable. force-dynamic. |
| `platform/src/app/build/sessions/[session_id]/page.tsx` | NEW | RSC; Session detail — fetchSessionDetail → SessionDetail. force-dynamic. |
| `platform/src/app/build/registry/page.tsx` | NEW | RSC; Registry — fetches BuildState → RegistryTable. force-dynamic. |
| `platform/src/app/build/error.tsx` | NEW | `use client` error boundary for /build route group. |
| `platform/src/app/build/interventions/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `platform/src/app/build/parallel/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `platform/src/app/build/health/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `platform/src/app/build/activity/page.tsx` | NEW | Stub: "Coming in Session 3". |

**Portal source tree — Session 3 deliverables (Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3):**

| Path | Status | Notes |
|---|---|---|
| `platform/src/components/build/InterventionList.tsx` | NEW | RSC; renders RedTeamSection (passes + residuals), NDSection (open+addressed NDs), DRSection (empty state). |
| `platform/src/components/build/ActivityFeed.tsx` | NEW | RSC; reverse-chron session cards with Link wrapper, ScriptVerdictBadge, StatusPill. |
| `platform/src/components/build/MirrorPairsTable.tsx` | NEW | RSC; responsive table with pair_id, claude/gemini side, mirror_mode, days_since_verified badge. |
| `platform/src/components/build/HealthTrend.tsx` | NEW | `use client`; three-panel sparkline grid + quarterly pass countdown + staleness register table. |
| `platform/src/components/build/HealthSparkline.tsx` | NEW | `use client`; custom SVG bar sparkline (D.5.d); bar height ∝ exit_code; color-coded. |
| `platform/src/app/build/interventions/page.tsx` | REPLACED | Stub → full impl; fetchBuildState → InterventionList. force-dynamic; RefreshButton. |
| `platform/src/app/build/parallel/page.tsx` | REPLACED | Stub → full impl; workstreams grid + MirrorPairsTable + cowork_ledger + LEL/PPL cards. force-dynamic; RefreshButton. |
| `platform/src/app/build/health/page.tsx` | REPLACED | Stub → full impl; fetchBuildState → HealthTrend. force-dynamic; RefreshButton. |
| `platform/src/app/build/activity/page.tsx` | REPLACED | Stub → full impl; newest 20 sessions reversed → ActivityFeed. force-dynamic; RefreshButton. |

---

## §10 — Tooling & Process (scripts)

See `FILE_REGISTRY_v1_4.md §10` — unchanged.

---

*Registry v1.7 produced 2026-04-26 at Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 (Portal Build Tracker Session 1); amended in-place at Session 2 (v0_2) and Session 3 (v0_3, 2026-04-26). Supersedes v1.6 dated 2026-04-26. The machine-readable canonical-path registry is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`; this file's `canonical_artifact_id` column points into it.*
