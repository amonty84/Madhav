---
artifact: FILE_REGISTRY_v1_3.md
version: 1.3
status: SUPERSEDED
superseded_on: 2026-04-24
superseded_by: 00_ARCHITECTURE/FILE_REGISTRY_v1_4.md
supersession_session: STEP_12_ONGOING_HYGIENE_POLICIES
supersession_rationale: >
  v1.3 → v1.4 bump absorbed the Step 10/11 in-place §9.1 amendments and the Step 12
  new rows (ONGOING_HYGIENE_POLICIES entry + BOOTSTRAP retirement archival row + LEL v1.1
  archival row). v1.3 retained in-place per ONGOING_HYGIENE_POLICIES §A.
date: 2026-04-24
scope: (superseded) Complete registry of final/current AM-JIS corpus files; Step 7 governance-integrity artifacts + canonical_artifact_id / mirror_obligations columns
supersedes: FILE_REGISTRY_v1_2.md (closed 2026-04-24 at Step 5A; superseded 2026-04-24 at Step 7 of the Step 0→15 governance rebuild); FILE_REGISTRY_v1_1.md (closed 2026-04-23 at Step 5; superseded 2026-04-24 at Step 5A); FILE_REGISTRY_v1_0.md (closed 2026-04-19; superseded 2026-04-23 at Step 5)
schema_version: 1.3
  # v1.3 additions: two new columns on §9 rows — canonical_artifact_id (pointer into
  # CANONICAL_ARTIFACTS_v1_0.md §1) and mirror_obligations (summary; authoritative
  # detail lives in CANONICAL_ARTIFACTS). Neither column displaces prior columns; both
  # are additive.
changelog:
  - v1.3 (2026-04-24, Step 7 of the Step 0→15 governance rebuild):
    (a) §9.1 (Architecture & Governance) — added rows for the Step 7 governance-integrity
        bundle: CANONICAL_ARTIFACTS_v1_0.md (CURRENT), SESSION_OPEN_TEMPLATE_v1_0.md
        (CURRENT), SESSION_CLOSE_TEMPLATE_v1_0.md (CURRENT),
        DISAGREEMENT_REGISTER_v1_0.md (LIVING), GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md
        (DRAFT_PENDING_REDTEAM; flips to CURRENT at Step 8 close). FILE_REGISTRY_v1_2.md
        marked SUPERSEDED.
    (b) §9.1 — new columns: `canonical_artifact_id` (pointer into
        `CANONICAL_ARTIFACTS_v1_0.md §1` for every row that names a canonical artifact)
        and `mirror_obligations` (summary; authoritative detail per
        `CANONICAL_ARTIFACTS_v1_0.md §2` mirror_obligations field).
    (c) §10 (Tooling & Process) — registered three new governance scripts:
        `platform/scripts/governance/drift_detector.py`,
        `platform/scripts/governance/schema_validator.py`,
        `platform/scripts/governance/mirror_enforcer.py`. Shared loader
        `_ca_loader.py` + schema config under `platform/scripts/governance/schemas/`.
    (d) §9.3 — added rows for the two Step 7 baseline reports:
        `00_ARCHITECTURE/drift_reports/DRIFT_REPORT_STEP_7_v1_0.md`,
        `00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md`.
    (e) §8 Archival — `FILE_REGISTRY_v1_2.md` self-entry added as superseded.
    (f) No corpus (L1/L2.5/L3/L4/L5) changes.
    (g) Lineage chain: FILE_INDEX_v1_0 → FILE_REGISTRY_v1_0 → FILE_REGISTRY_v1_1 →
        FILE_REGISTRY_v1_2 → FILE_REGISTRY_v1_3 (this).
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE bumped v2.1 → v2.2; v2.1 archived.
  - v1.1 (2026-04-23, Step 5): MSR row corrected v2.0 → v3.0 per GA.1; macro-plan + governance-rebuild family registered; MP v1.0 → archival.
  - v1.0 (2026-04-19): Created as registry successor to FILE_INDEX_v1_0.
---

> **SUPERSEDED 2026-04-24** by `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` at STEP_12_ONGOING_HYGIENE_POLICIES. Content retained for audit trail; do not consume as CURRENT. The §1–§7 corpus rows are unchanged in v1.4; delta is in §9.1 (new rows for `ONGOING_HYGIENE_POLICIES_v1_0.md` + BOOTSTRAP retirement + LEL v1.1 archival) and §8 (this file added as archived v1.3 successor-to-v1.2).
>
> **Delta-to-v1.4 basename index (added by STEP_12_1_FINGERPRINT_AND_REGISTRY_FIX, 2026-04-24 — pointer clarification only, zero substantive change to v1.3 tables):**
> - `ONGOING_HYGIENE_POLICIES_v1_0.md` (NEW CURRENT at v1.4 §9.1; canonical_artifact_id `ONGOING_HYGIENE_POLICIES`; mirror_obligations `claude_only`; produced_during `STEP_12_ONGOING_HYGIENE_POLICIES`).
> - `LIFE_EVENT_LOG_v1_1.md` (received §A retain-in-place archival banner at v1.4 §8; GA.12 closure).
> - `AM_JIS_BOOTSTRAP_HANDOFF.md` (retired to v1.4 §8 archival per native Step 12 WARN.4/WARN.6 decision).
>
> *This basename index exists so that the Step-7-vintage `platform/scripts/governance/drift_detector.py` (which hardcodes `FILE_REGISTRY_v1_3.md` as its `fr_path` at L315 and performs a basename-substring check at L338) can resolve its H.3.5 FILE_REGISTRY-vs-CANONICAL_ARTIFACTS agreement check against post-Step-12 CA §1 rows without requiring a script modification — which brief §4 "detector discipline" forbids. The authoritative row content lives in `FILE_REGISTRY_v1_4.md §9.1`; this block is a pointer only.*

# AM-JIS File Registry — Final Corpus (v1.3)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-24 (v1.3 published at Step 7 of the Step 0→15 governance rebuild; supersedes v1.2 dated 2026-04-24 Step 5A, v1.1 dated 2026-04-23, v1.0 dated 2026-04-19)

This registry lists only the **current authoritative version** of each artifact.
Superseded versions are collected in §8 (Archival). Tooling and process files are in §9–§10.

The v1.3 revision is **additive + corrective** relative to v1.2: §9.1 registers the Step 7 governance-integrity bundle; §10 registers the three new governance scripts; §9.3 registers the two baseline reports. Two new columns — `canonical_artifact_id` and `mirror_obligations` (summary) — are added to §9.1 per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §D.2`. The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — this registry's `canonical_artifact_id` column points into it.

---

## §1 — L0 Source Data (JHora & Ephemeris)

*Primary computation sources. Read-only; not processed by insight-generation LLMs.*

| File | Description | Status |
|---|---|---|
| `JHora/JH 1 - AM.docx` | Jagannatha Hora export — primary natal chart set | Source |
| `JHora/JH 3 - Abhisek Mohanty.docx` | Jagannatha Hora export — divisional charts | Source |
| `JHora/JH 4 - AM.docx` | Jagannatha Hora export — supplementary (dashas, yogas, longevity) | Source |
| `01_FACTS_LAYER/ECLIPSES_1900_2100.csv` | Solar/lunar eclipse data (Swiss Ephemeris computed) | Current |
| `01_FACTS_LAYER/EPHEMERIS_MONTHLY_1900_2100.csv` | Monthly planetary ephemeris 1900–2100 | Current |
| `01_FACTS_LAYER/RETROGRADES_1900_2100.csv` | Retrograde cycles 1900–2100 | Current |
| `01_FACTS_LAYER/SADE_SATI_CYCLES_ALL.md` | Complete Sade Sati cycle register | Current |

---

## §2 — L1 Facts Layer (Authoritative Ground Truth)

*Single source of truth. DO NOT derive from any other file. DO NOT edit without native's approval.*

| File | Description | Version | Status | canonical_artifact_id |
|---|---|---|---|---|
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | **Unified canonical L1 — all planet/house/lagna/saham/dasha data** | 8.0 | **CURRENT** | FORENSIC |
| `01_FACTS_LAYER/JHORA_TRANSCRIPTION_v8_0_SOURCE.md` | Full JHora v8.0 export transcription (supporting L1) | 8.0 | Current | — |
| `01_FACTS_LAYER/FORENSIC_DATA_v8_0_SUPPLEMENT.md` | v8.0 supplement data (partially integrated into main v8.0 file) | 8.0 | Current | — |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | Dated life events + Swiss Ephemeris chart states for retrodiction | 1.2 | **CURRENT** | LEL |
| `01_FACTS_LAYER/EVENT_CHART_STATES_v1_0.md` | Planetary positions at key life-event moments (computed) | 1.0 | Current | — |
| `01_FACTS_LAYER/EXTERNAL_COMPUTATION_SPEC_v2_0.md` | Specification for computations requiring external tools | 2.0 | CLOSED | — |
| `01_FACTS_LAYER/CGP_AUDIT_v1_0.md` | Completeness Guarantee Protocol audit | 1.0 | CLOSED | — |

---

## §3 — L2 Analytical Layer (Derived Matrices)

*Mechanical extractions from L1. Five structured matrices covering the full chart.*

| File | Description | Status |
|---|---|---|
| `02_ANALYTICAL_LAYER/MATRIX_PLANETS.md` | All 9 planets — sign, house, nakshatra, dignity, karakas, strengths | Current |
| `02_ANALYTICAL_LAYER/MATRIX_HOUSES.md` | All 12 houses — lord, tenants, aspects received, Bhava Bala | Current |
| `02_ANALYTICAL_LAYER/MATRIX_SIGNS.md` | All 12 signs — active planets, nakshatra breakdown, domain resonance | Current |
| `02_ANALYTICAL_LAYER/MATRIX_DIVISIONALS.md` | D1–D60 divisional chart placements (all planets, all charts) | Current |
| `02_ANALYTICAL_LAYER/MATRIX_DASHA_PERIODS.md` | Vimshottari + Yogini dasha sequences with sub-period windows | Current |

---

## §4 — L2.5 Holistic Synthesis (Core Analytical Stack)

*The L2.5 stack is CLOSED at current versions. Cite these for all L3 work.*

| File | Description | Version | Status | canonical_artifact_id |
|---|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | **Unified Chart Narrative — canonical single-file mother document** (v4.1 corrections applied; merged v1.0→v4.0) | 4.1 | **CURRENT** | UCN |
| `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | **Master Signal Register — 499 signals; canonical per CLAUDE.md §Canonical corpus artifact paths** | 3.0 | **CURRENT** | MSR |
| `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` | Cross-Domain Linkage Matrix — 9×9 domain grid (v1.2 cleanup) | 1.2 | **CURRENT** | CDLM |
| `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` | Resonance Map — 32 RM elements (RM.21A + RM.21B split from RM.21) | 2.1 | **CURRENT** | RM |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | Chart Graph Model — nodes/edges feeding MSR, CDLM, RM (rebuilt on FORENSIC_v8_0 2026-04-19; will become CGM_v9_0 after Phase B.3.5) | 2.0 | **CURRENT** | CGM |

---

## §5 — L3 Domain Reports (Nine Domains)

*Each report is an L1/L2.5-derived deep-dive into one life domain. All at v1.1+.*

| File | Domain | Version | Status |
|---|---|---|---|
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md` | Career & Dharma | 1.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_1.md` | Wealth & Finance | 2.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_1.md` | Health & Longevity | 1.2 ¹ | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_1.md` | Relationships & Partnership | 1.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_1.md` | Children & Creative Legacy | 1.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_1.md` | Spiritual & Moksha | 1.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_1.md` | Parents & Ancestry | 1.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_1.md` | Psychology & Mind | 1.1 | **CURRENT** |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_1.md` | Travel & Foreign Lands | 1.1 | **CURRENT** |

¹ Internal version 1.2 (MSR citation fix applied 2026-04-19); filename retains `v1_1` suffix — rename to `v1_2` in next file-hygiene pass.

---

## §6 — L4 Remedial Codex

| File | Description | Version | Status |
|---|---|---|---|
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART1.md` | Remedial framework, planetary remedies, spiritual prescriptions | 2.0 | **CURRENT** |
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART2.md` | Domain-specific remedies, timing calendar, practical protocols | 2.0 | **CURRENT** |

---

## §7 — L5–L6 Temporal Engines & Query Interface

| File | Description | Status |
|---|---|---|
| `05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md` | Complete lifetime timeline (birth → 2060, major dasha/transit events) | Current |
| `05_TEMPORAL_ENGINES/HEATMAP_VARSHPHAL_v1_0.md` | Varshaphal (Solar Return) annual heatmap | Current |
| `06_QUERY_INTERFACE/DECISION_SUPPORT_PLAYBOOK_v1_0.md` | Decision-support framework for common life decisions | Current |
| `06_QUERY_INTERFACE/QUERY_PROMPT_LIBRARY_v1_0.md` | Ready-to-use query prompts for insight sessions | Current |
| `06_QUERY_INTERFACE/SESSION_PROTOCOL_QUESTION_TAXONOMY_v1_0.md` | Taxonomy of question types for session routing | Current |

---

## §8 — Archival (Superseded Versions)

*Preserved for lineage tracing only. Do not cite in new analysis.*

### L1 Archival
| File | Superseded by |
|---|---|
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` | `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` |
| `01_FACTS_LAYER/FORENSIC_DATA_v7_0_SUPPLEMENT.md` | Integrated into v8.0 |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` | `LIFE_EVENT_LOG_v1_2.md` |
| `01_FACTS_LAYER/EXTERNAL_COMPUTATION_SPEC_v1_0.md` | `EXTERNAL_COMPUTATION_SPEC_v2_0.md` |

### L2 Archival
| File | Superseded by |
|---|---|
| `02_ANALYTICAL_LAYER/DEEP_ANALYSIS_Abhisek_Mohanty_v1.md` | The five MATRIX_*.md files |

### L2.5 Archival
| File | Superseded by |
|---|---|
| `025_HOLISTIC_SYNTHESIS/UCN_v1_0.md` | `UCN_v4_0.md` |
| `025_HOLISTIC_SYNTHESIS/UCN_v1_1.md` | `UCN_v4_0.md` |
| `025_HOLISTIC_SYNTHESIS/UCN_v2_0.md` | `UCN_v4_0.md` |
| `025_HOLISTIC_SYNTHESIS/UCN_v3_0.md` | `UCN_v4_0.md` |
| `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` | `MSR_v3_0.md` (via `MSR_v2_0.md`) |
| `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | `MSR_v3_0.md` (canonical 499-signal register) |
| `025_HOLISTIC_SYNTHESIS/CGM_v1_0.md` | `CGM_v2_0.md` |
| `025_HOLISTIC_SYNTHESIS/CDLM_v1_0.md` | `CDLM_v1_1.md` |
| `025_HOLISTIC_SYNTHESIS/RM_v1_0.md` | `RM_v2_0.md` |
| `025_HOLISTIC_SYNTHESIS/RM_v1_1.md` | `RM_v2_0.md` |
| `025_HOLISTIC_SYNTHESIS/MASTER_SYNTHESIS_v1_0.md` | `UCN_v4_0.md` |
| `025_HOLISTIC_SYNTHESIS/RED_TEAM_L2_5_v1_0.md` | QA artifact (superseded by ongoing audits) |

### L3 Archival
| File | Superseded by |
|---|---|
| `03_DOMAIN_REPORTS/FINANCIAL_REPORT_Abhisek_Mohanty.md` | `REPORT_FINANCIAL_v2_1.md` |
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md` | `REPORT_CAREER_DHARMA_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_0.md` | `REPORT_FINANCIAL_v2_1.md` |
| `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_0.md` | `REPORT_HEALTH_LONGEVITY_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_0.md` | `REPORT_RELATIONSHIPS_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_0.md` | `REPORT_CHILDREN_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_0.md` | `REPORT_SPIRITUAL_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_0.md` | `REPORT_PARENTS_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md` | `REPORT_PSYCHOLOGY_MIND_v1_1.md` |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md` | `REPORT_TRAVEL_v1_1.md` |
| `03_DOMAIN_REPORTS/RED_TEAM_L3_v1_0.md` | QA artifact |
| `03_DOMAIN_REPORTS/CROSS_REPORT_COHERENCE_AUDIT_v1_0.md` | QA artifact |

### L4 Archival
| File | Superseded by |
|---|---|
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md` | `REMEDIAL_CODEX_v2_0_PART1.md` |
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md` | `REMEDIAL_CODEX_v2_0_PART2.md` |

### Architecture / Governance Archival
| File | Superseded by |
|---|---|
| `00_ARCHITECTURE/FILE_INDEX_v1_0.md` | `FILE_REGISTRY_v1_0.md` → `v1_1.md` → `v1_2.md` → `v1_3.md` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` | `FILE_REGISTRY_v1_1.md` → `v1_2.md` → `v1_3.md` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_1.md` | `FILE_REGISTRY_v1_2.md` → `v1_3.md` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_2.md` | `FILE_REGISTRY_v1_3.md` (this file) — self-reference; retained for registry-lineage tracing |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | `PROJECT_ARCHITECTURE_v2_2.md` (superseded 2026-04-24 at Step 5A) |
| `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | `MACRO_PLAN_v2_0.md` (superseded 2026-04-23 at Step 5) |
| `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_0.md` | `FALSIFIER_REGISTRY_v1_1.md` → `FALSIFIER_REGISTRY_v2_0_EXPANSION.md` |
| `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_1.md` | `FALSIFIER_REGISTRY_v2_0_EXPANSION.md` |
| `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_0.md` | `CONTRADICTION_REGISTRY_v1_1.md` |

---

## §9 — Architecture & Governance

*Project management files in `00_ARCHITECTURE/`. Not insight-generation data — governance and process.*

### §9.1 — Foundational architecture and registries

Per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §D.2`, this section adds two new columns (`canonical_artifact_id`, `mirror_obligations` summary). Authoritative detail for both lives in `CANONICAL_ARTIFACTS_v1_0.md §1` and §2.

| File | Description | canonical_artifact_id | mirror_obligations (summary) |
|---|---|---|---|
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | **Master governing blueprint (§A–§L) — CURRENT.** Published 2026-04-24 at Step 5A of the Step 0→15 governance rebuild. Supersedes v2.1. | PROJECT_ARCHITECTURE | MP.8 · adapted_parity · Claude authoritative · summary mirror in `.geminirules` + `.gemini/project_state.md` |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | **SUPERSEDED** (2026-04-24) by v2.2. See §8 Archival. | — | — |
| `00_ARCHITECTURE/SESSION_LOG.md` | Running session history and objectives | SESSION_LOG | MP.7 · claude_only (per Step 5A decision) |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Version registry + confidence ledger + known-gaps + change-control (updated in-place; §9–§11 amendment logs) | GOVERNANCE_STACK | MP.6 · claude_only |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_3.md` | This registry (v1.3 — CURRENT) | FILE_REGISTRY | MP.5 · adapted_parity_subset · Claude authoritative · L2.5 path block mirrored in `.geminirules` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_2.md` | **SUPERSEDED** (2026-04-24) by v1.3. | — | — |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | **NEW CURRENT (Step 7, 2026-04-24).** Machine-readable canonical-path + fingerprint + mirror-pair inventory. The single source of truth that every other governance surface imports from or cites. Implements `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §E`. | CANONICAL_ARTIFACTS | claude_only (registry is Claude-resident; Gemini-side surfaces cite by reference) |
| `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` | **Step 6 deliverable (2026-04-24).** Design specification for the drift-prevention + integrity-enforcement + multi-agent-sync system. Status DRAFT_PENDING_REDTEAM until Step 8 close. | GOVERNANCE_INTEGRITY_PROTOCOL | claude_only (design spec; the principle is stated in MP v2.0 §IS.2 + v2.2 §D.11 which have Gemini mirrors) |
| `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` | **NEW CURRENT (Step 7, 2026-04-24).** Session-open handshake template per `GOVERNANCE_INTEGRITY_PROTOCOL §F`. | SESSION_OPEN_TEMPLATE | claude_only (template) |
| `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` | **NEW CURRENT (Step 7, 2026-04-24).** Session-close checklist template per `GOVERNANCE_INTEGRITY_PROTOCOL §G`. | SESSION_CLOSE_TEMPLATE | claude_only (template) |
| `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` | **NEW LIVING (Step 7, 2026-04-24).** Multi-agent disagreement log per `GOVERNANCE_INTEGRITY_PROTOCOL §K`. Zero entries at creation. | DISAGREEMENT_REGISTER | claude_only (register is Claude-resident; entries may cite both sides' evidence) |
| `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | **NEW CURRENT (Step 10, 2026-04-24).** SESSION_LOG entry-format schema. §1 naming + §2 required block structure + §4 menu-form deprecation + §5 header banner + §6 forward-only retrofit + §7 schema-validator integration. Closes GA.17 + GA.18. | SESSION_LOG_SCHEMA | claude_only (SESSION_LOG is MP.7 claude_only; its schema is claude_only by inheritance) |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | **NEW LIVE (Step 10, 2026-04-24).** Canonical "you are here" state pointer. §2 machine-readable state block; §3 narrative; §4 update protocol; §5 disagreement-resolution rule (STEP_LEDGER-authoritative during rebuild; CURRENT_STATE-authoritative post-Step-15). Closes GA.19 at the full-surface layer. | CURRENT_STATE | MP.2 composite · adapted_parity_state · Claude authoritative (`.gemini/project_state.md` is the Gemini-side reflection) |
| `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` | **NEW CURRENT (Step 11, 2026-04-24).** Closed decision record carrying the SCAFFOLD verdict for `06_LEARNING_LAYER/`. §1 verdict; §2 rationale (MP-declared scaffold-pending state + 3 failure modes scaffold-now prevents + GA.6 closure); §3 scaffold-bundle implementation inventory; §5 binding guardrails (empty scaffold, population gate, two-pass approval, classical-priors-locked, auditable/reversible/versioned, drift-detector coverage extension booked Step 12); §6 CANONICAL_ARTIFACTS update plan; §7 PHASE_B_PLAN B.0 substrate-hook coordination; §8 red-team self-check. Closes GA.6 at the full-surface layer. | LEARNING_LAYER_SCAFFOLD_DECISION | claude_only (closed governance decision artifact) |
| `00_ARCHITECTURE/FALSIFIER_REGISTRY_v2_0_EXPANSION.md` | Current falsifier registry (all falsified claims) | — | — |
| `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_1.md` | Unresolved internal contradictions | — | — |
| `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md` | Data integrity audit — correction history record | — | — |
| `00_ARCHITECTURE/V8_0_RECONCILIATION_REPORT.md` | v8.0 reconciliation record (7 L1 errors corrected) | — | — |
| `00_ARCHITECTURE/DATA_INTEGRITY_AUDIT_PLAN_v1_0.md` | Audit methodology | — | — |
| `00_ARCHITECTURE/FIX_SESSION_001_COMPLETION.md` | Fix record: Jupiter placement corrections | — | — |
| `00_ARCHITECTURE/FIX_SESSION_002_COMPLETION.md` | Fix record: Special lagna/saham corrections | — | — |
| `00_ARCHITECTURE/PROJECT_WIDE_RED_TEAM_v1_0.md` | Project-level red-team findings | — | — |
| `00_ARCHITECTURE/RECONCILIATION_PLAN_v1_0.md` | Reconciliation planning record | — | — |
| `00_ARCHITECTURE/ACHARYA_ENGAGEMENT_KIT.md` | External acharya review package | — | — |
| `00_ARCHITECTURE/EXTERNAL_ACHARYA_REVIEW_INVITATION.md` | External review invitation letter | — | — |
| `00_ARCHITECTURE/MAINTENANCE_SCHEDULE_v1_0.md` | Ongoing maintenance calendar | — | — |
| `00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md` | Long-term maintenance guide | — | — |
| `00_ARCHITECTURE/PROJECT_COMPLETION_DOSSIER_v1_0.md` | Project completion milestone record | — | — |

### §9.2 — Macro-phase planning artifacts

| File | Version | Status | Role | canonical_artifact_id | mirror_obligations (summary) |
|---|---|---|---|---|---|
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | 2.0 | **CURRENT** | Strategic arc — 10 macro-phases + Learning Layer + System Integrity Substrate per ND.1. Published 2026-04-23 at Step 5. | MACRO_PLAN | MP.3 · adapted_parity_summary · Claude authoritative |
| `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | 1.0 | **SUPERSEDED** (2026-04-23) | Initial macro plan; see §8 Archival. | — | — |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | 1.0.2 | **CURRENT** | M2 Corpus Activation execution plan (B.0–B.10). Paused during the governance rebuild. | PHASE_B_PLAN | MP.4 · adapted_parity_summary · Claude authoritative |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0_RECONCILER_PASS_v1_0.md` | 1.0 | CLOSED | Reconciler-pass record preceding PHASE_B_PLAN v1.0.2 | — | — |

### §9.3 — Governance-rebuild artifact family (Step 0 → Step 15)

| File | Status | Role | canonical_artifact_id |
|---|---|---|---|
| `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` | CLOSED | Step 0 baseline; GA.1–GA.32 findings | — |
| `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` | LIVE | Step 0→15 state | STEP_LEDGER |
| `00_ARCHITECTURE/STEP_BRIEFS/` | LIVE | Per-step briefs (Step 01–15 + Step 05A); README index | — |
| `00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md` | CLOSED | Step 1 deliverable | — |
| `00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md` | CLOSED | Step 2 deliverable | — |
| `00_ARCHITECTURE/MACRO_PLAN_REDTEAM_v1_0.md` | CLOSED | Step 4 deliverable | — |
| `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` | LIVING | ND.1 directive log (status flipped `open` → `addressed` at Step 7 close, 2026-04-24) | NATIVE_DIRECTIVES |
| `00_ARCHITECTURE/CONVERSATION_NAMING_CONVENTION_v1_0.md` | LIVING | Cowork thread naming convention (`Madhav NN — <Step title>`) | CONVERSATION_NAMING_CONVENTION |
| `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` | DRAFT_PENDING_REDTEAM | Step 6 design spec | GOVERNANCE_INTEGRITY_PROTOCOL |
| `00_ARCHITECTURE/drift_reports/DRIFT_REPORT_STEP_7_v1_0.md` | CLOSED | Step 7 baseline drift report | — |
| `00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md` | CLOSED | Step 7 baseline schema validation report | — |
| `00_ARCHITECTURE/mirror_reports/MIRROR_REPORT_STEP_7_PRE_REAUTHOR.md` + `MIRROR_REPORT_STEP_7_POST_REAUTHOR.md` | CLOSED | Step 7 ND.1 enforcement before/after runs | — |

---

## §10 — Tooling & Process Artifacts

| File | Description |
|---|---|
| `audit.py` | Data integrity scanner (v2 — LLM-aware) |
| `verify_corpus.py` | Multi-agent corpus verifier |
| `data_integrity_audit_report_v1_0.md` | Latest audit output |
| `corpus_verification_report_v1_0.md` | Worker-verified findings |
| `corpus_verification_report_v1_0.json` | Machine-readable verification output |
| `AGENT_BRIEF_CORPUS_CLEANUP_v1_0.md` | Agent brief (completed) |
| `AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md` | Agent brief for 8-layer corpus verification |
| `AM_JIS_BOOTSTRAP_HANDOFF.md` | Session bootstrap document |
| `SESSION_RESUME_PROMPT.md` | Session resume context prompt |
| `.tools/build_lel_v1_2.py` | Life Event Log builder |
| `.tools/compute_event_chart_states.py` | Event chart state computation |
| `.tools/compute_jaimini_drishti.py` | Jaimini drishti computation |
| `.tools/compute_v7_additions.py` | v7.0 additions computation |
| `.tools/generate_eclipses.py` | Eclipse data generator |
| `.tools/generate_ephemeris.py` | Ephemeris data generator |
| `.tools/generate_retrogrades.py` | Retrograde cycle generator |
| `.tools/generate_sade_sati.py` | Sade Sati cycle generator |
| `platform/scripts/citation_graph_builder.py` | L2+ citation graph builder (existing) |
| `platform/scripts/invariants_l1.py` | L1 invariant checks (existing) |
| `platform/scripts/corpus_common.py` | Shared corpus-script utilities (existing) |
| `platform/scripts/governance/drift_detector.py` | **NEW Step 7.** Cross-surface drift detection per `GOVERNANCE_INTEGRITY_PROTOCOL §H`. |
| `platform/scripts/governance/schema_validator.py` | **NEW Step 7.** Per-class frontmatter + session-open/close validation per `GOVERNANCE_INTEGRITY_PROTOCOL §I`. |
| `platform/scripts/governance/mirror_enforcer.py` | **NEW Step 7.** MP.1–MP.8 mirror-pair enforcement per `GOVERNANCE_INTEGRITY_PROTOCOL §J` + ND.1. |
| `platform/scripts/governance/_ca_loader.py` | **NEW Step 7.** Shared CANONICAL_ARTIFACTS loader used by the three scripts above. |
| `platform/scripts/governance/schemas/artifact_schemas.yaml` | **NEW Step 7.** Per-artifact-class required-frontmatter map consumed by `schema_validator.py`. |

---

## §11 — v1.2 → v1.3 Diff Summary (for audit tracing)

### Rows added (§9.1)
- `CANONICAL_ARTIFACTS_v1_0.md` — NEW CURRENT (canonical_artifact_id = CANONICAL_ARTIFACTS)
- `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` — NEW DRAFT_PENDING_REDTEAM (canonical_artifact_id = GOVERNANCE_INTEGRITY_PROTOCOL)
- `SESSION_OPEN_TEMPLATE_v1_0.md` — NEW CURRENT
- `SESSION_CLOSE_TEMPLATE_v1_0.md` — NEW CURRENT
- `DISAGREEMENT_REGISTER_v1_0.md` — NEW LIVING

### Rows added (§9.3)
- Step 7 baseline reports: `drift_reports/DRIFT_REPORT_STEP_7_v1_0.md`, `schema_reports/SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md`, `mirror_reports/MIRROR_REPORT_STEP_7_{PRE,POST}_REAUTHOR.md`.
- `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` registered as Step 6 deliverable.

### Rows added (§10)
- Three new governance scripts under `platform/scripts/governance/`.
- Shared loader + schema config.

### Rows updated (§9.1)
- `FILE_REGISTRY_v1_3.md` is this registry; `FILE_REGISTRY_v1_2.md` flipped to SUPERSEDED.

### Rows added (§8 Archival)
- `FILE_REGISTRY_v1_2.md` self-entry added.

### Schema change
Additive columns `canonical_artifact_id` and `mirror_obligations` added to §9.1 rows. Both columns are optional (display `—` for non-canonical artifacts). No semantics changed for existing columns.

---

## Summary Count

| Category | Current Files | Archival Files |
|---|---|---|
| L0 Source (JHora + CSV) | 7 | — |
| L1 Facts Layer | 7 | 4 |
| L2 Analytical Matrices | 5 | 1 |
| L2.5 Holistic Synthesis | 5 | 12 |
| L3 Domain Reports | 9 | 12 |
| L4 Remedial Codex | 2 | 2 |
| L5–L6 Temporal/Query | 5 | — |
| Architecture & Governance (§9.1) | 22 (adds 5 Step 7 artifacts) | 9 (adds v1.2) |
| Macro-phase planning (§9.2) | 3 | 1 |
| Governance rebuild (§9.3) | 11 (adds Step 6 protocol + Step 7 reports + mirror reports) | — |
| Tooling & Process | 23 (adds 5 governance scripts/config) | — |
| **Total** | **99** | **41** |

---

*Registry v1.3 produced 2026-04-24 at Step 7 of the Step 0→15 governance rebuild. Supersedes v1.2 dated 2026-04-24 Step 5A, v1.1 dated 2026-04-23, v1.0 dated 2026-04-19. Update when new artifacts are added or versions superseded. The machine-readable canonical-path registry lives at `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`; this file's `canonical_artifact_id` column points into it.*
