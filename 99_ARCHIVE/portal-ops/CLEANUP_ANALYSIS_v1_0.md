---
artifact: CLEANUP_ANALYSIS_v1_0.md
version: 1.0
status: ANALYSIS_ONLY — no files deleted; awaiting native approval before any action
produced_on: 2026-04-27
produced_by: Cowork (Claude Sonnet 4.6)
methodology: >
  Pass 1 — full directory enumeration + frontmatter status extraction for all versioned files,
  cross-referenced against CANONICAL_ARTIFACTS_v1_0.md §1 registry.
  Pass 2 — independent verification: reference graph check (grep for each flagged file by name
  across the entire corpus), policy constraint check (ONGOING_HYGIENE_POLICIES §A + CLAUDE.md §C
  explicit retain instructions), diff check on 99_ARCHIVE duplicates.
scope: All files under project root excluding .git/, .venv/, node_modules/, platform/.next/
---

# MARSYS-JIS Corpus Cleanup Analysis v1.0
## Analysis Only — No Files Deleted

---

## Executive Summary

Total project files audited (excluding .git, .venv, node_modules, platform/.next): ~500+ files.
**~158 files are candidates for deletion** across four clearly safe categories.
An additional **9 domain report v1_0 files** are flagged for review (cited in governance audit docs; safe to archive but not outright delete without accepting dangling references).

The dominant cleanup win is **104 auto-generated adhoc timestamped machine reports** (drift detector + schema validator CI runs) that accumulated in `drift_reports/` and `schema_reports/` during the governance rebuild sessions. These are pure operational noise — no canonical registration, no references in any living doc.

---

## § 1 — CANONICAL CURRENT (DO NOT TOUCH)

Cross-referenced against `CANONICAL_ARTIFACTS_v1_0.md §1`. These are the authoritative, active, live files. Not listed here as candidates.

| canonical_id | Path | Version | Status |
|---|---|---|---|
| FORENSIC | `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | 8.0 | CURRENT |
| LEL | `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | 1.2 | CURRENT (frontmatter says CLOSED — known artefact of the population session; CANONICAL_ARTIFACTS is authoritative) |
| MSR | `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | 3.0 | CURRENT |
| UCN | `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | 4.1 | CURRENT |
| CDLM | `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` | 1.2 | CURRENT |
| RM | `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` | 2.1 | CURRENT |
| CGM | `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | 9.0 | CURRENT |
| FILE_REGISTRY | `00_ARCHITECTURE/FILE_REGISTRY_v1_13.md` | 1.13 | CURRENT |
| PROJECT_ARCHITECTURE | `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | 2.2 | CURRENT |
| MACRO_PLAN | `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | 2.0 | CURRENT |
| PHASE_B_PLAN | `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | 1.0.3 | CURRENT |
| + all other §1 CURRENT/LIVING/AUTHORITATIVE entries | | | |

Also keep: all L3 domain reports at their _v1_1_ versions (CURRENT/CLOSED-as-latest), Remedial Codex v2_0 parts, all temporal engine files, all discovery layer current artifacts.

---

## § 2 — BATCH A: Pure Temp / Session Prompt Artifacts (13 files) — SAFE TO DELETE

These files have no frontmatter registration in CANONICAL_ARTIFACTS, no references in any living governance document, and no astrological data value. They are one-time-use session scaffolding.

| File | Reason |
|---|---|
| `_TMP_GEMINI_PASTE_THIS_batchA.md` | Temp paste file, prefix `_TMP_` declares its nature |
| `_TMP_GEMINI_PASTE_THIS_batchC.md` | Same |
| `elaborate.md` | Root-level scratch doc with no version suffix; topic (Build Tracker portal) is superseded by v0_2 and the feature itself was retired |
| `elaborate_v0_2.md` | Planning brief for the Cowork artifact tracker — the file itself says the artifact is "being retired"; the feature it planned has been superseded |
| `MIGRATION_FULL_PROMPT.md` | One-time session prompt for a migration task; migration long complete |
| `MIGRATION_SESSION1_PROMPT.md` | Same — migration prompt |
| `MIGRATION_SESSION2_PROMPT.md` | Same — migration prompt |
| `RENAME_PROMPT.md` | One-time rename instruction prompt |
| `SESSION_RESUME_PROMPT.md` | Session handoff prompt, superseded by SESSION_OPEN_TEMPLATE governance |
| `CLAUDECODE_BRIEF.md` | Status: **COMPLETE** (for B.6 Exec_12 session). Per CLAUDE.md §C item 0: "If status is already COMPLETE… skip this item." No further use. |
| `AGENT_BRIEF_CORPUS_CLEANUP_v1_0.md` | Created 2026-04-19 for pre-vectorization corpus cleanup. Corpus has since been vectorized (READINESS_REPORT: GO 2026-04-22) and the project is now at B.6 Exec_12. Task is done. |
| `AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md` | Same era, same status — corpus verification executed and completed. The verification output is in `corpus_verification_report_v1_0.md` and `verification_artifacts/`. |
| `Plans/let-s-plan-this-a-jazzy-thunder.md` | Auto-named planning session artifact (single file in Plans/). Not in any registry, not referenced anywhere. |

**Second-pass verification:** grep found zero references to these files from any living governance document. All confirmed orphans.

---

## § 3 — BATCH B: Superseded Versioned Data / Governance Assets (~36 files) — SAFE TO DELETE

Files self-declaring `status: SUPERSEDED` in frontmatter, confirmed superseded by CANONICAL_ARTIFACTS §1, and confirmed by second-pass grep that references to them exist only in other superseded files or historical governance audit docs (not in living docs).

### 3.1 — 01_FACTS_LAYER (3 files)

| File | Superseded by | Notes |
|---|---|---|
| `01_FACTS_LAYER/FORENSIC_DATA_v8_0_SUPPLEMENT.md` | `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | Status: SUPERSEDED. Content absorbed into v8_0 mainline. |
| `01_FACTS_LAYER/EXTERNAL_COMPUTATION_SPEC_v1_0.md` | `EXTERNAL_COMPUTATION_SPEC_v2_0.md` | Status: SUPERSEDED SAME-SESSION — the approach was challenged and replaced in the same session it was created. v2_0 exists and is CLOSED. |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` | `LIFE_EVENT_LOG_v1_2.md` | Status: SUPERSEDED. v1_2 is the canonical LEL per CANONICAL_ARTIFACTS. |

**Note — KEEP:** `FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` — CLAUDE.md §C item 2 explicitly: "v6.0 is retained as archival only." Do not delete. `FORENSIC_DATA_v7_0_SUPPLEMENT.md` — status CLOSED but is the derivation audit trail for v8_0; keep as audit artifact.

### 3.2 — 025_HOLISTIC_SYNTHESIS (2 files)

| File | Superseded by | Notes |
|---|---|---|
| `025_HOLISTIC_SYNTHESIS/CGM_v1_0.md` | `CGM_v9_0.md` | Status: SUPERSEDED. No archive copy required — the CGM lineage from v1_0→v2_0→v9_0 is documented in CGM_v9_0 changelog. |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | `CGM_v9_0.md` | Status: SUPERSEDED. Archive copy confirmed exists at `99_ARCHIVE/CGM_v2_0.md`. Live-directory copy is redundant. |

**Note — KEEP (policy-protected):** `UCN_v1_0.md`, `UCN_v1_1.md`, `UCN_v2_0.md`, `UCN_v3_0.md` — all four explicitly state in frontmatter "retain for diff archaeology" or "retained for preserved sections." Do not delete despite SUPERSEDED status.

### 3.3 — 04_REMEDIAL_CODEX (2 files)

| File | Superseded by | Notes |
|---|---|---|
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md` | `REMEDIAL_CODEX_v2_0_PART1.md` | Status: SUPERSEDED. v2_0 parts are CURRENT. |
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md` | `REMEDIAL_CODEX_v2_0_PART2.md` | Status: SUPERSEDED. |

### 3.4 — 035_DISCOVERY_LAYER (1 file)

| File | Superseded by | Notes |
|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md` | `cgm_edge_proposals_v1_1.md` | Status: SUPERSEDED. v1_1 is CURRENT in same directory. |

### 3.5 — 00_ARCHITECTURE (28 files)

**FILE_REGISTRY versions v1_0 through v1_12 — 13 files:**
All superseded by `FILE_REGISTRY_v1_13.md` (canonical). Their archival content is preserved within v1_13 §8 Archival section per governance policy. Files: `FILE_REGISTRY_v1_0.md`, `v1_1`, `v1_2`, `v1_3`, `v1_4`, `v1_5`, `v1_6`, `v1_7`, `v1_8`, `v1_9`, `v1_10`, `v1_11`, `v1_12.md`.

**Note on apparent status confusion:** v1_8, v1_9, v1_11, v1_12 have stale `status: CURRENT` in their frontmatter — this reflects their status _when they were canonical_. CANONICAL_ARTIFACTS §1 is authoritative: v1_13 is CURRENT.

**Other superseded governance files — 5 files:**

| File | Status | Notes |
|---|---|---|
| `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | SUPERSEDED | v2_0 is CURRENT. References in this file point to old session numbers. |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | SUPERSEDED | v2_2 is CURRENT and canonical. |
| `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_0.md` | CLOSED | v1_1 is CURRENT. Referenced only in old FILE_REGISTRY versions. |
| `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_0.md` | CLOSED | v1_1 is CURRENT. |
| `00_ARCHITECTURE/FALSIFIER_REGISTRY_v2_0_EXPANSION.md` | CLOSED | Supplement that was absorbed into the main registry. |

**Also in 00_ARCHITECTURE root (not in drift_reports/):**

| File | Status | Notes |
|---|---|---|
| `00_ARCHITECTURE/DRIFT_REPORT_STEP_13_v1_0.md` | CLOSED | Superseded by v1_1 in same directory. The v1_1 is the corrected version. Both exist at root level of 00_ARCHITECTURE — the step-specific ones in drift_reports/ are the canonical set. |
| `00_ARCHITECTURE/SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md` | CLOSED | This is a duplicate of `schema_reports/SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md`. Root copy is redundant. |

---

## § 4 — BATCH C: 99_ARCHIVE Deduplication (2 files) — SAFE TO DELETE

The 99_ARCHIVE directory contains two MSR sets:
- `99_ARCHIVE/MSR_v1_0.md` and `99_ARCHIVE/MSR_v2_0.md` — bare copies, no archive annotation header
- `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` and `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` — annotated copies with "# ARCHIVED: Superseded by MSR_v3_0.md (2026-04-22)" header

The annotated versions in `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/` are the properly curated ones. The bare copies at `99_ARCHIVE/` root are redundant duplicates from an earlier archiving pass.

**Second-pass diff check:** The files are NOT byte-identical — the annotated versions have an additional header line. The annotated versions are superior. Delete the bare copies; keep the annotated.

Files to delete:
- `99_ARCHIVE/MSR_v1_0.md`
- `99_ARCHIVE/MSR_v2_0.md`

---

## § 5 — BATCH D: Adhoc Timestamped Machine Reports (104 files) — SAFE TO DELETE

The governance CI scripts (`drift_detector.py`, `schema_validator.py`) emit timestamped output files on every run during the governance rebuild era. These accumulated:
- **38 files:** `00_ARCHITECTURE/drift_reports/DRIFT_REPORT_adhoc_YYYYMMDDTHHMMSSZ.md`
- **66 files:** `00_ARCHITECTURE/schema_reports/SCHEMA_REPORT_adhoc_YYYYMMDDTHHMMSSZ.md`

Total: **104 files** spanning 2026-04-24 to 2026-04-27.

**What to keep from these directories:** The named step-specific reports (STEP_7 through STEP_14, STEP_13b, etc.) are the canonical governance CI records and are cited in GOVERNANCE_BASELINE_v1_0.md §4. These 12 drift reports + 13 schema reports should be kept. Also keep the two `SCHEMA_REPORT_Madhav_M2A_Exec_8_*` reports (session-tagged, not adhoc).

**Why the adhoc ones are safe to delete:** They are intermediate debugging runs, not referenced in any governance doc, not in CANONICAL_ARTIFACTS, and their findings were resolved within their originating sessions. The canonical governance record of what they found is in the named step-specific reports. The ONGOING_HYGIENE_POLICIES §F CI cadence section specifies named step reports as the canonical CI output — adhoc runs are not the canonical record.

---

## § 6 — BATCH E: Root-Level Generated Artifacts (3 files) — SAFE TO DELETE

| File | Status | Notes |
|---|---|---|
| `READINESS_REPORT.md` | Not in registry | 2026-04-22 corpus readiness report. Duplicate exists at `verification_artifacts/20260422_163824/READINESS_REPORT.md`. The verification_artifacts/ versioned copy is the canonical one. Root copy is a stray. |
| `corpus_verification_report_v1_0.md` | Not in registry | Product of AGENT_BRIEF_CORPUS_VERIFICATION execution. Verification done. Not cited by any live governance doc. Referenced only by the now-obsolete agent briefs (Batch A above). |
| `data_integrity_audit_report_v1_0.md` | Not in registry | Generated audit report. Not cited by any live governance doc. |

---

## § 7 — BATCH F: Superseded Domain Reports v1_0 (9 files) — NEEDS REVIEW

These files are explicitly `status: SUPERSEDED` or `status: CLOSED` (with a newer version in the same directory), but they are cited by name in several CLOSED governance documents: `AUDIT_REPORT_v1_0.md`, `GOVERNANCE_STACK_v1_0.md`, `SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md`, old FILE_REGISTRY versions, and `SESSION_LOG.md`.

Deleting them creates dangling references in those governance docs. Since those referencing docs are themselves CLOSED and read-only, the dangling references are inert — the governance docs won't break or become inconsistent in any operational sense. However, it's a cleaner outcome to move them to `99_ARCHIVE/03_DOMAIN_REPORTS/` rather than delete.

**Recommendation: Archive rather than delete** (move to `99_ARCHIVE/03_DOMAIN_REPORTS/`).

| File | Status | Superseded by |
|---|---|---|
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md` | No explicit SUPERSEDED (v1.0.1 internal) | v1_1 exists in same dir |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_0.md` | SUPERSEDED | `REPORT_CHILDREN_v1_1.md` (CLOSED-as-latest) |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_0.md` | SUPERSEDED | `REPORT_PARENTS_v1_1.md` (CLOSED-as-latest) |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md` | SUPERSEDED | `REPORT_PSYCHOLOGY_MIND_v1_1.md` (CURRENT) |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md` | SUPERSEDED | `REPORT_TRAVEL_v1_1.md` (CURRENT) |
| `03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_0.md` | CLOSED | `REPORT_FINANCIAL_v2_1.md` (CLOSED-as-latest) |
| `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_0.md` | CLOSED | `REPORT_HEALTH_LONGEVITY_v1_1.md` (CURRENT) |
| `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_0.md` | CLOSED | `REPORT_RELATIONSHIPS_v1_1.md` (CLOSED-as-latest) |
| `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_0.md` | CLOSED | `REPORT_SPIRITUAL_v1_1.md` (CLOSED-as-latest) |

---

## § 8 — POLICY-PROTECTED: KEEP (Explicit Policy Constraints)

Do NOT delete any of the following, regardless of superseded status:

| File | Protection | Source |
|---|---|---|
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` | Explicit: "v6.0 is retained as archival only" | CLAUDE.md §C item 2 |
| `01_FACTS_LAYER/FORENSIC_DATA_v7_0_SUPPLEMENT.md` | Audit trail for v8_0 derivation lineage | FORENSIC_v8_0 derivation chain |
| `025_HOLISTIC_SYNTHESIS/UCN_v1_0.md` | Explicit: "retain for diff archaeology" | UCN_v1_0 frontmatter |
| `025_HOLISTIC_SYNTHESIS/UCN_v1_1.md` | Explicit: "retain for diff archaeology" | UCN_v1_1 frontmatter |
| `025_HOLISTIC_SYNTHESIS/UCN_v2_0.md` | Explicit: "retain for diff archaeology" | UCN_v2_0 frontmatter |
| `025_HOLISTIC_SYNTHESIS/UCN_v3_0.md` | Explicit: "retain for diff archaeology" | UCN_v3_0 frontmatter |
| `MARSYS_JIS_BOOTSTRAP_HANDOFF.md` | Explicit: "audit trail retained at root-level path" | CLAUDE.md §C item 11 |
| `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` | GOVERNANCE_CLOSED but retained per CANONICAL_ARTIFACTS — "This row retained as audit trail" | CANONICAL_ARTIFACTS §1 STEP_LEDGER notes |
| All `00_ARCHITECTURE/STEP_BRIEFS/*.md` | Governance rebuild audit trail | ONGOING_HYGIENE_POLICIES §A |
| All named step-specific drift/schema/mirror reports | Canonical CI record per GOVERNANCE_BASELINE §4 | GOVERNANCE_BASELINE_v1_0.md §4 |

---

## § 9 — ACTIVE / IN-FLIGHT (KEEP)

Files that are currently active drafts or referenced execution plans:

| File | Status | Reason to keep |
|---|---|---|
| `PANEL_IMPLEMENTATION_BRIEF_v1_0.md` | AUTHORED | Memory notes: trigger for next Claude Code session. Active. |
| `00_ARCHITECTURE/PANEL_SYNTHESIS_ADDENDUM_v0_1.md` | DRAFT_PROPOSAL | Authored today (2026-04-27). Active architectural design. |
| `00_ARCHITECTURE/CONSUME_DESIGN_v0_1.md` | DRAFT_PROPOSAL | Authored 2026-04-26. Active architectural design. |
| `00_ARCHITECTURE/CLAUDECODE_BRIEF_PORTAL_QUALITY_v0_1.md` | DRAFT | Active portal quality brief. |
| `00_ARCHITECTURE/CLAUDECODE_BRIEF_PORTAL_BUILD_TRACKER_IMPL_v0_1_HOLD.md` | HELD_PENDING_LATER_ACTIVATION | Held, not cancelled. |
| `00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md` | READY_FOR_EXEC (now historical) | Referenced from SESSION_LOG + STALENESS_REGISTER. Governance audit trail. |
| `00_ARCHITECTURE/M2B_EXEC_PLAN_v1_0.md` | READY_FOR_EXEC | Referenced from STALENESS_REGISTER + RED_TEAMs. Governance audit trail. |
| `00_ARCHITECTURE/GAP_13_RESOLUTION_v1_0.md` | CURRENT | Referenced by PHASE_B_PLAN, M2A_EXEC_PLAN, SESSION_LOG. |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0_RECONCILER_PASS_v1_0.md` | ISSUED | Referenced in SESSION_LOG as an intermediate governance artifact. |

---

## § 10 — SUMMARY TABLE

| Batch | Files | Action | Count |
|---|---|---|---|
| A — Temp/session prompts | Root-level temp + session + completed briefs | DELETE | 13 |
| B — Superseded versioned assets | Superseded data + governance files | DELETE | 36 |
| C — 99_ARCHIVE duplicates | Unannotated bare MSR copies | DELETE | 2 |
| D — Adhoc machine reports | timestamped drift + schema CI runs | DELETE | 104 |
| E — Root generated artifacts | corpus/readiness/integrity reports | DELETE | 3 |
| F — Domain reports v1_0 | Superseded but cited in old governance docs | ARCHIVE to 99_ARCHIVE/03_DOMAIN_REPORTS/ | 9 |
| **TOTAL ACTIONABLE** | | | **~167 files** |

---

## § 11 — INDEPENDENT SECOND-PASS VERIFICATION NOTES

The following specific concerns were checked on the second pass and cleared:

**1. LEL v1_2 frontmatter says CLOSED — is it really CURRENT?**
Confirmed: CANONICAL_ARTIFACTS §1 LEL row explicitly says `status: CURRENT`. The "CLOSED" frontmatter is a known artifact of the Swiss-Ephemeris population session. CANONICAL_ARTIFACTS is authoritative.

**2. CGM_v2_0.md in live dir vs 99_ARCHIVE — which to delete?**
The live-dir version has `status: SUPERSEDED + archive_path: "99_ARCHIVE/CGM_v2_0.md"` — it points to its own archive. The 99_ARCHIVE copy has stale `status: CURRENT` (from before the supersession was applied). The live-dir version has the better frontmatter but is in the wrong location. Recommendation: delete the live-dir copy; leave 99_ARCHIVE copy (which is the intended archive). The stale CURRENT status in the archive copy is inert since 99_ARCHIVE files are not read by governance scripts.

**3. UCN v1_0–v3_0 "retain for diff archaeology" — confirmed?**
Confirmed. Every UCN_v1_x/v2_0/v3_0 frontmatter contains explicit retain instructions. Do not delete.

**4. MARSYS_JIS_BOOTSTRAP_HANDOFF.md — retired or active?**
Confirmed retired and intentionally retained. Frontmatter says "Retired 2026-04-24 at STEP_12_ONGOING_HYGIENE_POLICIES." CLAUDE.md §C item 11 says "audit trail retained at root-level path." Do not delete.

**5. Domain reports v1_0 — do the referencing governance docs break if deleted?**
Reference check: these files are cited in `AUDIT_REPORT_v1_0.md` (CLOSED), `GOVERNANCE_STACK_v1_0.md` (CURRENT — keep!), `FILE_REGISTRY_v1_2`/`v1_3` (superseded), `SESSION_LOG.md` (LIVE). The GOVERNANCE_STACK reference is in a historical inventory table; the SESSION_LOG reference is in past-session entries. Deleting these files would not break any current operational flow, but creates inert dangling references in historical records. Archive is cleaner than delete.

**6. FILE_REGISTRY v1_8, v1_9, v1_11, v1_12 showing CURRENT in frontmatter — false positive?**
Confirmed: their frontmatter status is stale (reflects when they were canonical). CANONICAL_ARTIFACTS §1 names v1_13 as CURRENT. Cross-check: FILE_REGISTRY v1_13 frontmatter explicitly says "v1.12 SUPERSEDED." Safe to delete.

**7. Adhoc drift/schema reports — any referenced by living docs?**
Reference check: zero living docs (current status: CURRENT, LIVING, AUTHORITATIVE, or LIVE) reference any `DRIFT_REPORT_adhoc_*` or `SCHEMA_REPORT_adhoc_*` file. GOVERNANCE_BASELINE §4 references only the named step-specific reports. Safe to delete all 104 adhoc files.

**8. CLAUDECODE_BRIEF.md status COMPLETE — confirmed?**
Confirmed: `status: COMPLETE` in frontmatter, authored_on 2026-04-27 for B.6 Exec_12. CLAUDE.md §C item 0 says: "If status is already COMPLETE, or the file does not exist, skip this item." Safe to delete.

---

## § 12 — RECOMMENDED EXECUTION ORDER (when native approves)

If proceeding:
1. Delete Batch A (pure temp/session artifacts) — no risk, no references
2. Delete Batch D (104 adhoc machine reports) — biggest file count win, zero risk
3. Delete Batch C (2 bare 99_ARCHIVE duplicates) — trivial
4. Delete Batch E (3 root-level generated artifacts)
5. Delete Batch B superseded data assets (Facts Layer, 025 CGM v1+v2 live copies, Remedial Codex v1, Discovery prompt, Architecture superseded)
6. Delete Batch B FILE_REGISTRY v1_0–v1_12 (governance tidying)
7. For Batch F (domain reports v1_0): move to `99_ARCHIVE/03_DOMAIN_REPORTS/` rather than delete (safer)

**Do not delete without explicit approval.** This analysis is read-only.

---

*End of CLEANUP_ANALYSIS_v1_0.md — produced 2026-04-27 by Cowork (Sonnet 4.6). Dual-pass methodology: Pass 1 enumeration + frontmatter scan; Pass 2 reference graph check + policy constraint verification + diff checks.*
