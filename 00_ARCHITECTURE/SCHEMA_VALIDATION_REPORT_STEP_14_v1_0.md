---
artifact: SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md
version: 1.0
status: CLOSED
produced_during: STEP_14_SCHEMA_VALIDATION_RUN (2026-04-24)
session_id: STEP_14_SCHEMA_VALIDATION_RUN
validator_version: platform/scripts/governance/schema_validator.py (Step 12 extensions)
repo_root: "."
run_at: 2026-04-24T13:15:19.494048+00:00
exit_code: 3
verdict: RESIDUAL
implements: STEP_BRIEFS/STEP_14_SCHEMA_VALIDATION_RUN_v1_0.md §3 deliverable requirement
authoritative_side: claude
changelog:
  - v1.0 (2026-04-24, STEP_14_SCHEMA_VALIDATION_RUN):
      Initial report. schema_validator.py exit 3 BASELINE (46 MEDIUM/LOW; zero HIGH/CRITICAL).
      Verdict RESIDUAL. 46 pre-existing frontmatter-hygiene violations — exact match to Step 7
      / Step 12 / Step 12.1 / Step 13b / STEP_13b_CLOSE_MACHINERY_FIX schema baselines.
      Delta vs Step 7 baseline: 0 regressions, 0 improvements (stable frontmatter-hygiene
      backlog). Step 14 brief §4 read-only constraint honored. No new findings. STEP_LEDGER
      row 14 → completed; row 15 → ready.
---

# SCHEMA VALIDATION REPORT — STEP 14
## AM-JIS Governance Rebuild — Step 14 Baseline Schema-Validator Run

*Produced by `platform/scripts/governance/schema_validator.py` — Step 12 extensions active.*
*Session: `STEP_14_SCHEMA_VALIDATION_RUN` — 2026-04-24.*
*Companion raw output: `00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_14_RAW_v1_0.json`*

---

## §1 — Summary

| Field | Value |
|---|---|
| Exit code | **3** (MEDIUM/LOW only; 0=clean, 1=CRITICAL, 2=HIGH, 3=MEDIUM/LOW, 4=script error) |
| Total violations | **46** |
| CRITICAL | 0 |
| HIGH | 0 |
| MEDIUM | 35 |
| LOW | 11 |
| Files with violations | 38 |
| Run timestamp | 2026-04-24T13:15:19.494048+00:00 |

### Diff vs Step 7 baseline (`SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md`)

| Severity | Step 7 | Step 14 | Delta |
|---|---|---|---|
| CRITICAL | 0 | 0 | 0 |
| HIGH | 0 | 0 | 0 |
| MEDIUM | 35 | 35 | **0** |
| LOW | 11 | 11 | **0** |
| **Total** | **46** | **46** | **0** |

**Zero regressions. Zero improvements.** The 46 violations are the identical stable frontmatter-hygiene backlog present since Step 7 close and verified clean at Steps 9, 10, 11, 12, 12.1, 13b, and STEP_13b_CLOSE_MACHINERY_FIX. No new violations introduced; no violations resolved (Step 14 brief §4 is read-only — no corpus edits permitted). All 46 are classified BASELINE/RESIDUAL with named owning steps below.

---

## §2 — Per-file results

### 2.1 — Files with violations

38 files carry one or more violations. All violations are pre-existing frontmatter-hygiene issues; none are new as of Step 14.

#### 00_ARCHITECTURE/ layer (11 files, 11 violations)

| File | Violations | Severity | Rule |
|---|---|---|---|
| `00_ARCHITECTURE/B0_KICKOFF_PROMPT_FOR_CLAUDE_CODE.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |
| `00_ARCHITECTURE/CLAUDE.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |
| `00_ARCHITECTURE/DATA_INTEGRITY_AUDIT_PLAN_v1_0.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_1.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |
| `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | 1 | LOW | `frontmatter_field_missing[architecture_governance/artifact]` (loose-YAML) |
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | 1 | LOW | `frontmatter_field_missing[architecture_governance/artifact]` (loose-YAML) |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0_RECONCILER_PASS_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[architecture_governance/artifact]` |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | 1 | MEDIUM | `frontmatter_field_missing[architecture_governance/artifact]` |
| `00_ARCHITECTURE/SESSION_LOG.md` | 1 | MEDIUM | `frontmatter_missing[architecture_governance]` |

#### 01_FACTS_LAYER/ (4 files, 4 violations)

| File | Violations | Severity | Rule |
|---|---|---|---|
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` | 1 | MEDIUM | `frontmatter_field_missing[l1_facts/artifact]` |
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l1_facts/artifact]` |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` | 1 | MEDIUM | `frontmatter_field_missing[l1_facts/artifact]` |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | 1 | MEDIUM | `frontmatter_field_missing[l1_facts/artifact]` |

#### 025_HOLISTIC_SYNTHESIS/ (5 files, 6 violations)

| File | Violations | Severity | Rule |
|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/CGM_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l2_5_cgm/artifact]` |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l2_5_cgm/artifact]` |
| `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l2_5_msr/artifact]` |
| `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l2_5_msr/signal_count]` |
| `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | 1 | MEDIUM | `frontmatter_missing[l2_5_msr]` |

#### 03_DOMAIN_REPORTS/ (18 files, 25 violations)

| File | Violations | Severity | Rule(s) |
|---|---|---|---|
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md` | 1 | LOW | `frontmatter_field_missing[l3_domain_reports/artifact]` (loose-YAML) |
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md` | 1 | LOW | `frontmatter_field_missing[l3_domain_reports/artifact]` (loose-YAML) |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_1.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_0.md` | 3 | MEDIUM | `artifact` + `version` + `status` missing |
| `03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_1.md` | 3 | MEDIUM | `artifact` + `version` + `status` missing |
| `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_0.md` | 3 | LOW | `artifact` + `version` + `status` missing (loose-YAML) |
| `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_1.md` | 3 | LOW | `artifact` + `version` + `status` missing (loose-YAML) |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_1.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_1.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_1.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_1.md` | 1 | LOW | `frontmatter_field_missing[l3_domain_reports/artifact]` (loose-YAML) |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_1.md` | 1 | MEDIUM | `frontmatter_field_missing[l3_domain_reports/artifact]` |

### 2.2 — Files passing clean (no violations)

All files under `00_ARCHITECTURE/` that carry proper `---` frontmatter with `artifact`, `version`, and `status` keys pass. Governance-layer artifacts (CANONICAL_ARTIFACTS, STEP_LEDGER, CURRENT_STATE, GOVERNANCE_INTEGRITY_PROTOCOL, SESSION_CLOSE_TEMPLATE, SESSION_OPEN_TEMPLATE, ONGOING_HYGIENE_POLICIES, GROUNDING_AUDIT, NATIVE_DIRECTIVES, DISAGREEMENT_REGISTER, STEP_BRIEFS/*, drift_reports/*, schema_reports/*, mirror_reports/*) all pass clean. The `06_LEARNING_LAYER/` directory (5 files) passes clean — all four mechanism stubs + top-level README carry compliant frontmatter per Step 11 + Step 12 `learning_layer_stub` validator class.

---

## §3 — Rule coverage

The following schema-validator rule families were active during this run (per Step 7 + Step 10 + Step 12 extensions):

| Rule family | Scope | Files inspected | Files with violations | Passing |
|---|---|---|---|---|
| `frontmatter_missing[architecture_governance]` | `00_ARCHITECTURE/*.md` | 112 | 7 | 105 |
| `frontmatter_field_missing[architecture_governance/artifact]` | `00_ARCHITECTURE/*.md` | 112 | 4 | 108 |
| `frontmatter_field_missing[l1_facts/*]` | `01_FACTS_LAYER/*.md` | 13 | 4 | 9 |
| `frontmatter_missing[l2_5_msr]` | `025_HOLISTIC_SYNTHESIS/MSR*.md` | 3 | 1 | 2 |
| `frontmatter_field_missing[l2_5_msr/artifact]` | `025_HOLISTIC_SYNTHESIS/MSR*.md` | 3 | 1 | 2 |
| `frontmatter_field_missing[l2_5_msr/signal_count]` | `025_HOLISTIC_SYNTHESIS/MSR*.md` | 3 | 1 | 2 |
| `frontmatter_field_missing[l2_5_cgm/artifact]` | `025_HOLISTIC_SYNTHESIS/CGM*.md` | 2 | 2 | 0 |
| `frontmatter_field_missing[l3_domain_reports/*]` | `03_DOMAIN_REPORTS/*.md` | 22 | 18 | 4 |
| `validate_session_log_entries` (Step 10) | `00_ARCHITECTURE/SESSION_LOG.md` | 1 | 0 | 1 |
| `validate_current_state` (Step 10) | `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | 1 | 0 | 1 |
| `validate_scope_boundary` (Step 12) | session scope declarations | — | 0 | PASS |
| `validate_files_touched_completeness` (Step 12) | session close checklists | — | 0 | PASS |
| `validate_learning_layer_stub` (Step 12) | `06_LEARNING_LAYER/*/README.md` | 4 | 0 | 4 |
| `validate_mirror_structural_block` (Step 12) | `.geminirules`, `.gemini/project_state.md` | 2 | 0 | 2 |
| `validate_dr_entry_yaml` (Step 12) | `DISAGREEMENT_REGISTER_v1_0.md` | 1 | 0 | 1 |

**All Step 12 extension rules fire cleanly (zero violations).** The only violations are pre-existing frontmatter-hygiene issues on corpus and governance files whose `artifact:` field or full frontmatter block was not installed at their original authoring time.

---

## §4 — Residual violations

All 46 violations are classified **RESIDUAL — pre-existing BASELINE**. They appeared at Step 7 close and have been present unchanged through every subsequent schema run. No finding in this list is new as of Step 14.

### Classification table

| # | Rule | Severity | File | Owner / Deferral |
|---|---|---|---|---|
| 1 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/DATA_INTEGRITY_AUDIT_PLAN_v1_0.md` | Pre-Step-7. Owning step: Step 12 ongoing-hygiene or M2-phase corpus hygiene pass. Deferred WARN.3-family. |
| 2 | `frontmatter_field_missing[architecture_governance/artifact]` | LOW | `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | Pre-Step-7. MP uses loose-YAML `title:` not `artifact:`. Owning step: PHASE_B_PLAN v1.0.3 amendment cycle (WARN.2/WARN.3 family). |
| 3 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | SUPERSEDED file. No frontmatter retrofit needed on SUPERSEDED artifacts per ONGOING_HYGIENE §A. Owner: none (intentional). |
| 4 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/SESSION_LOG.md` | SESSION_LOG is a rolling log, not a versioned artifact; its schema is defined in SESSION_LOG_SCHEMA. Deferred by design. Owner: post-rebuild governance pass. |
| 5 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/FILE_REGISTRY_v1_1.md` | SUPERSEDED file. Same rationale as row 3. |
| 6 | `frontmatter_field_missing[architecture_governance/artifact]` | MEDIUM | `00_ARCHITECTURE/PHASE_B_PLAN_v1_0_RECONCILER_PASS_v1_0.md` | Pre-Step-7. PHASE_B_PLAN family; owner PHASE_B_PLAN v1.0.3 amendment cycle. |
| 7 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | Pre-Step-7. PHASE_B_PLAN v1.0.2 uses legacy header style; owner PHASE_B_PLAN v1.0.3. |
| 8 | `frontmatter_field_missing[architecture_governance/artifact]` | LOW | `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | SUPERSEDED file with loose-YAML frontmatter. Same rationale as row 2. |
| 9 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/CLAUDE.md` | `00_ARCHITECTURE/CLAUDE.md` is a sub-folder helper (WARN.6/WARN.7 family) deferred to post-Step-15 CLAUDE.md family refresh. |
| 10 | `frontmatter_field_missing[architecture_governance/artifact]` | MEDIUM | `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | Pre-Step-7. PROJECT_ARCHITECTURE uses `title:` not `artifact:`. Owner: next PROJECT_ARCHITECTURE version bump. |
| 11 | `frontmatter_missing[architecture_governance]` | MEDIUM | `00_ARCHITECTURE/B0_KICKOFF_PROMPT_FOR_CLAUDE_CODE.md` | Pre-Step-7. Phase-B execution artifact. Owner: PHASE_B_PLAN v1.0.3 / M2 resume (WARN.5 family). |
| 12 | `frontmatter_field_missing[l1_facts/artifact]` | MEDIUM | `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | L1 canonical. `artifact:` field absent; existing frontmatter uses `canonical_id:`. Owning: M2-phase L1 hygiene pass. |
| 13 | `frontmatter_field_missing[l1_facts/artifact]` | MEDIUM | `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` | ARCHIVAL file. Same rationale as row 12. |
| 14 | `frontmatter_field_missing[l1_facts/artifact]` | MEDIUM | `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | L1 canonical. Same rationale as row 12. |
| 15 | `frontmatter_field_missing[l1_facts/artifact]` | MEDIUM | `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` | ARCHIVAL file. Same rationale as row 12. |
| 16 | `frontmatter_field_missing[l2_5_msr/artifact]` | MEDIUM | `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` | ARCHIVAL file. Owner: M2-phase L2.5 hygiene pass. |
| 17 | `frontmatter_field_missing[l2_5_msr/signal_count]` | MEDIUM | `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | ARCHIVAL file. `signal_count:` field added to schema after v2.0 was authored. Owner: M2-phase L2.5 hygiene pass. |
| 18 | `frontmatter_missing[l2_5_msr]` | MEDIUM | `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | Current MSR. Inline frontmatter not yet installed. Owner: next MSR version bump (M2 B.2 or later). |
| 19 | `frontmatter_field_missing[l2_5_cgm/artifact]` | MEDIUM | `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | Current CGM. Same rationale as row 18. Owner: next CGM version bump (M2 B.3.5+). |
| 20 | `frontmatter_field_missing[l2_5_cgm/artifact]` | MEDIUM | `025_HOLISTIC_SYNTHESIS/CGM_v1_0.md` | ARCHIVAL file. |
| 21–26 | `frontmatter_field_missing[l3_domain_reports/*]` | MEDIUM | 6× L3 domain reports (CHILDREN v1.0/v1.1, PARENTS v1.0/v1.1, RELATIONSHIPS v1.0/v1.1) | L3 corpus. `artifact:` field absent from all older-format domain reports. Owner: M2-phase L3 hygiene pass. |
| 27–30 | `frontmatter_field_missing[l3_domain_reports/artifact]` + `/version` + `/status` | MEDIUM×3 + MEDIUM×3 | REPORT_FINANCIAL_v2_0.md (3) + REPORT_FINANCIAL_v2_1.md (3) | L3 corpus. Three required fields absent. Owner: M2-phase L3 hygiene pass. |
| 31–32 | `frontmatter_field_missing[l3_domain_reports/*]` | LOW | REPORT_CAREER_DHARMA_v1_0.md + v1_1.md | L3 corpus (loose-YAML). Owner: M2-phase L3 hygiene pass. |
| 33–38 | `frontmatter_field_missing[l3_domain_reports/*]` | LOW×3 + LOW×3 | REPORT_HEALTH_LONGEVITY_v1_0.md (3) + v1_1.md (3) | L3 corpus (loose-YAML; three required fields absent each). Owner: M2-phase L3 hygiene pass. |
| 39 | `frontmatter_field_missing[l3_domain_reports/artifact]` | MEDIUM | `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_0.md` | L3 corpus. Owner: M2-phase L3 hygiene pass. |
| 40 | `frontmatter_field_missing[l3_domain_reports/artifact]` | LOW | `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_1.md` | L3 corpus (loose-YAML). |
| 41–42 | `frontmatter_field_missing[l3_domain_reports/artifact]` | MEDIUM | REPORT_TRAVEL_v1_0.md + v1_1.md | L3 corpus. |
| 43–44 | `frontmatter_field_missing[l3_domain_reports/artifact]` | MEDIUM | REPORT_PSYCHOLOGY_MIND_v1_0.md + v1_1.md | L3 corpus. |

**Summary of owner buckets:**
- **SUPERSEDED / ARCHIVAL files — no action needed:** rows 3, 5, 8, 13, 15, 16, 20 (7 violations)
- **PHASE_B_PLAN v1.0.3 amendment cycle (WARN.2/3/5 family):** rows 2, 6, 7, 11 (4 violations)
- **CLAUDE.md family refresh post-Step-15 (WARN.6/7):** row 9 (1 violation)
- **Next canonical-artifact version bump (MP/PA/CGM/MSR):** rows 8, 10, 18, 19 (deferred — not yet due) (4 violations)
- **M2-phase corpus hygiene pass (L1/L2.5/L3):** rows 12, 14, 17, 18, 21–44 (30 violations)
- **SESSION_LOG / design-by-intent (no frontmatter expected):** row 4 (1 violation)

---

## §5 — Verdict

**RESIDUAL**

`schema_validator.py` exits **3** (MEDIUM/LOW only). Zero HIGH violations. Zero CRITICAL violations. The 46 MEDIUM/LOW violations are the identical stable frontmatter-hygiene backlog that has been present and classified since Step 7 close (2026-04-24). Every violation has a named owner bucket and an explicit deferral rationale. No violations are unaccounted-for or surprising.

Comparison to the known_residuals whitelist per `ONGOING_HYGIENE_POLICIES_v1_0.md §F`: the Step 12 hygiene-policy exit-code definition designates exit code 3 (MEDIUM/LOW only) as **BASELINE** for step-close purposes. The Step 14 brief §4 constraint ("read-only step — no file modifications other than the report") is fully honored.

**Close criterion met:** verdict CLEAN or RESIDUAL per Step 14 brief §6 → ✅ **RESIDUAL satisfies the close criterion.**

---

## §6 — Red-team self-check

Per Step 14 brief §8:

**Red-team prompt 1:** *"Does the validator inspect every file under `00_ARCHITECTURE/` and `025_HOLISTIC_SYNTHESIS/`, or only a curated list?"*

**Answer:** The validator uses `pathlib.Path(repo_root).rglob('*.md')` filtered by artifact class globs defined in `schemas/artifact_schemas.yaml`. It does not use a curated list. During this run it inspected all 112 `.md` files under `00_ARCHITECTURE/`, all 18 under `025_HOLISTIC_SYNTHESIS/`, all 13 under `01_FACTS_LAYER/`, all 22 under `03_DOMAIN_REPORTS/`, and all 5 under `06_LEARNING_LAYER/`. The `platform/` and hidden directories are not inspected (as expected — they carry Python/YAML scripts, not governance artifacts). ✅ PASS.

**Red-team prompt 2:** *"Does `SESSION_LOG.md` validate entry-by-entry or only as one blob?"*

**Answer:** Since Step 10, `schema_validator.py` includes `validate_session_log_entries()` which parses the SESSION_LOG file entry-by-entry, checking each for the `session_open` / body / `session_close` structural triple per `SESSION_LOG_SCHEMA_v1_0.md §2`. This was the rule that fired 2 HIGH `session_log_entry_session_id_disagreement_heading` violations during the Step 13b initial run (against the Step 12.1 heading-format defect at line 3583), which were resolved in-session. During this Step 14 run: **0 violations from `validate_session_log_entries`** — the Step 13b heading-fix holds. ✅ PASS.

---

## §7 — Companion outputs

| Output | Path | Description |
|---|---|---|
| Raw JSON | `00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_14_RAW_v1_0.json` | Machine-readable full violation list from the validator run |
| This report | `00_ARCHITECTURE/SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md` | Human-readable structured report per Step 14 brief §3 |

---

*End of SCHEMA_VALIDATION_REPORT_STEP_14_v1_0.md — Step 14 of the Step 0 → Step 15 governance rebuild — 2026-04-24.*
