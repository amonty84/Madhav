---
artifact: FILE_REGISTRY_v1_0.md
version: 1.0
status: CURRENT
date: 2026-04-19
scope: Complete registry of final/current AM-JIS corpus files
supersedes: FILE_INDEX_v1_0.md (Session 36, now stale)
---

# AM-JIS File Registry — Final Corpus

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-19

This registry lists only the **current authoritative version** of each artifact.
Superseded versions are collected in §8 (Archival). Tooling and process files are in §9–§10.

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

| File | Description | Version | Status |
|---|---|---|---|
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | **Unified canonical L1 — all planet/house/lagna/saham/dasha data** | 8.0 | **CURRENT** |
| `01_FACTS_LAYER/JHORA_TRANSCRIPTION_v8_0_SOURCE.md` | Full JHora v8.0 export transcription (supporting L1) | 8.0 | Current |
| `01_FACTS_LAYER/FORENSIC_DATA_v8_0_SUPPLEMENT.md` | v8.0 supplement data (partially integrated into main v8.0 file) | 8.0 | Current |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | Dated life events + Swiss Ephemeris chart states for retrodiction | 1.2 | **CURRENT** |
| `01_FACTS_LAYER/EVENT_CHART_STATES_v1_0.md` | Planetary positions at key life-event moments (computed) | 1.0 | Current |
| `01_FACTS_LAYER/EXTERNAL_COMPUTATION_SPEC_v2_0.md` | Specification for computations requiring external tools | 2.0 | CLOSED |
| `01_FACTS_LAYER/CGP_AUDIT_v1_0.md` | Completeness Guarantee Protocol audit | 1.0 | CLOSED |

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

| File | Description | Version | Status |
|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | **Unified Chart Narrative — canonical single-file mother document** (v4.1 corrections applied; merged v1.0→v4.0) | 4.1 | **CURRENT** |
| `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | Master Signal Register — 500 signals (v2.2 cleanup applied) | 2.2 | **CURRENT** |
| `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` | Cross-Domain Linkage Matrix — 9×9 domain grid (v1.2 cleanup) | 1.2 | **CURRENT** |
| `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` | Resonance Map — 35 RM elements, paradoxes, temporal patterns (v2.1 cleanup) | 2.1 | **CURRENT** |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | Chart Graph Model — nodes/edges feeding MSR, CDLM, RM | 2.0 | **CURRENT** |

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

*Classical remedies and prescriptions derived from the full corpus.*

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

*Preserved for lineage tracing only. Do not cite in new analysis. Do not load in insight-generation context.*

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
| `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` | `MSR_v2_0.md` |
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

---

## §9 — Architecture & Governance

*Project management files in `00_ARCHITECTURE/`. Not insight-generation data — governance and process.*

| File | Description |
|---|---|
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | Master governing blueprint (§A–§J) |
| `00_ARCHITECTURE/SESSION_LOG.md` | Running session history and objectives |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Artifact versioning and governance rules |
| `00_ARCHITECTURE/FALSIFIER_REGISTRY_v2_0_EXPANSION.md` | Current falsifier registry (all falsified claims) |
| `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_1.md` | Unresolved internal contradictions |
| `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md` | Data integrity audit — correction history record |
| `00_ARCHITECTURE/V8_0_RECONCILIATION_REPORT.md` | v8.0 reconciliation record (7 L1 errors corrected) |
| `00_ARCHITECTURE/DATA_INTEGRITY_AUDIT_PLAN_v1_0.md` | Audit methodology |
| `00_ARCHITECTURE/FIX_SESSION_001_COMPLETION.md` | Fix record: Jupiter placement corrections |
| `00_ARCHITECTURE/FIX_SESSION_002_COMPLETION.md` | Fix record: Special lagna/saham corrections |
| `00_ARCHITECTURE/PROJECT_WIDE_RED_TEAM_v1_0.md` | Project-level red-team findings |
| `00_ARCHITECTURE/RECONCILIATION_PLAN_v1_0.md` | Reconciliation planning record |
| `00_ARCHITECTURE/ACHARYA_ENGAGEMENT_KIT.md` | External acharya review package |
| `00_ARCHITECTURE/EXTERNAL_ACHARYA_REVIEW_INVITATION.md` | External review invitation letter |
| `00_ARCHITECTURE/MAINTENANCE_SCHEDULE_v1_0.md` | Ongoing maintenance calendar |
| `00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md` | Long-term maintenance guide |
| `00_ARCHITECTURE/PROJECT_COMPLETION_DOSSIER_v1_0.md` | Project completion milestone record |

---

## §10 — Tooling & Process Artifacts

| File | Description |
|---|---|
| `audit.py` | Data integrity scanner (v2 — LLM-aware, 157 baseline error-pattern matches) |
| `verify_corpus.py` | Multi-agent corpus verifier (Opus brain + Haiku workers) |
| `data_integrity_audit_report_v1_0.md` | Latest audit output (104 matches post-cleanup) |
| `corpus_verification_report_v1_0.md` | Worker-verified findings (0 live errors confirmed) |
| `corpus_verification_report_v1_0.json` | Machine-readable verification output |
| `AGENT_BRIEF_CORPUS_CLEANUP_v1_0.md` | Agent brief for corpus cleanup task (completed) |
| `AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md` | Agent brief for comprehensive 8-layer corpus verification (MSR merge + citation graph + 24 invariants) |
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

---

## Summary Count

| Category | Final/Current Files | Archival Files |
|---|---|---|
| L0 Source (JHora + CSV) | 7 | — |
| L1 Facts Layer | 7 | 4 |
| L2 Analytical Matrices | 5 | 1 |
| L2.5 Holistic Synthesis | 5 | 10 |
| L3 Domain Reports | 9 | 12 |
| L4 Remedial Codex | 2 | 2 |
| L5–L6 Temporal/Query | 5 | — |
| Architecture/Governance | 17 | — |
| Tooling & Process | 17 | — |
| **Total** | **74** | **29** |

---

*Registry produced 2026-04-19. Update when new artifacts are added or versions superseded.*
