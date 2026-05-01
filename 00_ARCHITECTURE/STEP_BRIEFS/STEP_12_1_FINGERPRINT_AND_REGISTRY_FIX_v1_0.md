---
step: 12.1
title: Fingerprint + registry fix (Step 12 implementation defects detected by Step 13)
version: 1.0
status: CURRENT
produced_in: STEP_13_DRIFT_DETECTION_BASELINE (2026-04-24, post-regression-detection insertion)
inserted_via: ledger-amendment per Step 5A insertion precedent
authorized_by: native (Cowork thread `Madhav 13 — Drift-Detection Baseline Run`, 2026-04-24)
consumed_by: Step 13 re-execution (which re-runs drift_detector and produces a fresh baseline report)
modeled_on: STEP_BRIEFS/STEP_5A_PROJECT_ARCHITECTURE_REFRESH_v1_0.md
---

# STEP 12.1 — Fingerprint + Registry Fix

## 1. Objective

Discharge the two Step 12 close-claim vs file-content discrepancies that `STEP_13_DRIFT_DETECTION_BASELINE` detected and catalogued in `00_ARCHITECTURE/DRIFT_REPORT_STEP_13_v1_0.md §3.2`:

1. **9 HIGH `fingerprint_mismatch`** — replace 9 literal placeholder strings in `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` rows with computed sha256 fingerprints. Affected rows (canonical_id : current placeholder text):
   - `CLAUDE` : `<rotated-at-step-12-close>`
   - `GEMINIRULES` : `<rotated-at-step-12-close>`
   - `PROJECT_STATE` : `<rotated-at-step-12-close>`
   - `STEP_LEDGER` : `<rotated-at-step-12-close>`
   - `CURRENT_STATE` : `<rotated-at-step-12-close>`
   - `GOVERNANCE_STACK` : `<rotated-at-step-12-close>`
   - `FILE_REGISTRY` : `<rotated-at-step-12-close>`
   - `CANONICAL_ARTIFACTS` (self-row) : `<rotated-at-step-12-close>`
   - `ONGOING_HYGIENE_POLICIES` : `<computed-at-step-12-close>`

2. **1 MEDIUM `registry_disagreement`** — add a row for `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` to `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md §9.1` per the FILE_REGISTRY §9.1 delta-row schema. Step 12 close-history block (STEP_LEDGER row 12) explicitly claims this row was added; the registry file does not carry it.

Expected outcome at Step 12.1 close: `drift_detector.py` exit 3 (BASELINE — only the 98 WARN.2-whitelisted phantom_references + 1 LOW SESSION_LOG `<populated…>` placeholder remain), zero HIGH, zero CRITICAL. STEP_LEDGER row 13 transitions from `blocked` to `ready` automatically as the Step 12.1 close-criterion.

## 2. Inputs

**MUST read** (in this order):

1. `CLAUDE.md` (v2.0)
2. `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` — verify row 12.1 = `ready`; row 13 = `blocked`; History "Step 12.1 inserted" + "Step 13 NOT-CLOSED" blocks.
3. `00_ARCHITECTURE/STEP_BRIEFS/STEP_12_1_FINGERPRINT_AND_REGISTRY_FIX_v1_0.md` (this brief).
4. `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` (post-Step-13-insertion LIVE; carries Step 12.1 next-session objective).
5. `00_ARCHITECTURE/DRIFT_REPORT_STEP_13_v1_0.md` — the regression detail; especially §2.2, §2.5, §3.2, §5 (recommended remediation).
6. `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — the file being modified; familiarize with §0 fingerprint-rotation rules + §1 row schema.
7. `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` — the file being modified; familiarize with §9.1 delta-row schema (look at how the ONGOING_HYGIENE_POLICIES row is structured for sibling entries already present).
8. `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md §A` (archival policy — relevant to §J implementation-actions index for the FILE_REGISTRY §9.1 row format).
9. `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` + `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md`.
10. `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §H` (drift-detector spec — to confirm the post-fix `drift_detector.py` re-run interpretation).

**MAY run:** `drift_detector.py`, `schema_validator.py`, `mirror_enforcer.py` (close-machinery requirement).

## 3. Deliverables

### 3.1 Primary edits

**File 1: `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`** — 9 row updates. For each affected row:

```yaml
# Before:
fingerprint_sha256: "<rotated-at-step-12-close>"   # or "<computed-at-step-12-close>"
last_verified_session: STEP_12_ONGOING_HYGIENE_POLICIES   # or earlier
last_verified_on: 2026-04-24

# After:
fingerprint_sha256: <64-hex-sha256-computed-at-Step-12.1-close>
last_verified_session: STEP_12.1_FINGERPRINT_AND_REGISTRY_FIX
last_verified_on: <Step-12.1-session-date>
```

**Computation procedure** (per `CANONICAL_ARTIFACTS_v1_0.md §0` fingerprint-rotation rule):
1. After all other Step 12.1 file edits land (FILE_REGISTRY §9.1 row addition; STEP_LEDGER amendments; CURRENT_STATE state-block; .gemini/project_state.md mirror; this brief unchanged), compute `sha256sum` of each of the 9 files.
2. Write the computed values into the 9 CANONICAL_ARTIFACTS rows.
3. **Bootstrap chicken-and-egg note**: writing the CANONICAL_ARTIFACTS edits modifies CANONICAL_ARTIFACTS itself, rotating its own fingerprint. Step 7 documented this with the pattern "compute → write → re-compute as the session's final action". For the CANONICAL_ARTIFACTS self-row, use the pattern: write the OTHER 8 fingerprints first, then compute CA's sha256 with the placeholder still in CA's self-row, then update the self-row to that computed value as the session's final atomic edit. Acknowledge in this Step 12.1 close that the CA self-row is computed-pre-self-rotation (Step 7-pattern). The next session opening verifies parity.

**File 2: `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md`** — add a row to §9.1 for `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md`. Use the schema established by the existing §9.1 rows (which the Step 12.1 session reads to mirror conventions exactly). At minimum the row should declare: file path, version 1.0, status CURRENT, produced_during STEP_12_ONGOING_HYGIENE_POLICIES, canonical_artifact_id ONGOING_HYGIENE_POLICIES, mirror_obligations claude_only.

### 3.2 Mandatory close-machinery (every session)

- `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` — row 12.1 status `ready` → `completed` with deliverable list + History block; row 13 status `blocked` → `ready` (per Step 12.1 close-criterion).
- `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` — state-block transition (active_governance_step Step_13 → Step_12.1 completed; next_governance_step Step_13 → Step_13 ready; last_session_id → STEP_12.1_FINGERPRINT_AND_REGISTRY_FIX; next_session_objective for Step 13 re-execution).
- `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` — append `§15 STEP_12.1 amendment log` (or similar; follow the §11 STEP_7 / §12 STEP_10 / §13 STEP_12 numbering pattern; if §14 cumulative-index already exists per Step 12 close, the new entry goes as §15). Cite both Step 13 regression-detection event AND Step 12.1 fix.
- `.gemini/project_state.md` — MP.2 composite mirror update.
- `.geminirules` — MP.1 mirror amendment IF and ONLY IF CLAUDE.md is touched (single-line §F pointer refresh — likely required since CURRENT_STATE state-block changes); if CLAUDE.md is not touched, no .geminirules amendment is required for MP.1.
- `00_ARCHITECTURE/SESSION_LOG.md` — Step 12.1 entry per `SESSION_LOG_SCHEMA_v1_0.md §2` post-adoption format. Atomic close fires only after all checks pass.
- Standard `drift_reports/`, `schema_reports/`, `mirror_reports/` outputs for STEP_12.1.

## 4. Constraints

- **Targeted scope.** Only the 2 primary edits (CANONICAL_ARTIFACTS + FILE_REGISTRY) plus the standard close-machinery. Do NOT touch any L1/L2/L2.5/L3/L4/L5 corpus. Do NOT touch MACRO_PLAN, PROJECT_ARCHITECTURE, PHASE_B_PLAN, GOVERNANCE_INTEGRITY_PROTOCOL, ONGOING_HYGIENE_POLICIES, SESSION_OPEN/CLOSE_TEMPLATE, NATIVE_DIRECTIVES, DISAGREEMENT_REGISTER, DRIFT_REPORT_STEP_13_v1_0.md (preserve as audit trail), STEP_BRIEFS/** (this brief stays as written), governance scripts, platform/src/**, 06_LEARNING_LAYER/**.
- **Detector discipline.** The post-fix `drift_detector.py` re-run uses the exact Step-7-vintage script with no modifications (per Step 13 brief §5 rule #2 inheritance). Expected exit: 3 (BASELINE only).
- **Fingerprint rotation discipline.** Per CANONICAL_ARTIFACTS §0: rotate `last_verified_session` + `last_verified_on` fields atomically with each fingerprint update. Do NOT compute fingerprints from in-memory state — read the file from disk after all other edits land.
- **Bootstrap-placeholder forward policy.** The remaining `<populated-at-step-10-close-after-session-log-entry-appended>` placeholder for SESSION_LOG (1 LOW finding) is a pre-existing Step 10-introduced bootstrap that the detector's `<populated*>` regex downgrades to LOW. Per ONGOING_HYGIENE_POLICIES §F (exit-code-3 known_residuals whitelist), this LOW persists as BASELINE in perpetuity until SESSION_LOG is appended in this session, after which compute the new sha256 and rotate the SESSION_LOG row's placeholder to a real fingerprint as part of Step 12.1 close.
- **No silent close-yaml exit-code masking.** If the post-fix `drift_detector.py` re-run returns exit 2 (HIGH still present), Step 12.1 does NOT close. Halt and report to native — same protocol Step 13 used.

## 5. Discipline rules

- Closed artifact (single closed deliverable per session per CLAUDE.md §M).
- Every CANONICAL_ARTIFACTS row update is reflected in `files_touched` of the session-close checklist with `mutation_type: modified` and the before/after sha256.
- The new FILE_REGISTRY §9.1 row uses the same schema as sibling §9.1 rows — read the file before editing to mirror conventions exactly. Do NOT invent novel fields.
- Per `ONGOING_HYGIENE_POLICIES_v1_0.md §C`, Step 12.1's `declared_scope.may_touch` MUST enumerate every path it edits, and `declared_scope.must_not_touch` MUST be non-empty.

## 6. Close criteria

- [ ] `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — 9 placeholder strings replaced with computed sha256 values; `last_verified_session` + `last_verified_on` updated on each affected row.
- [ ] `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` — §9.1 row for ONGOING_HYGIENE_POLICIES_v1_0.md added.
- [ ] `drift_detector.py` post-fix re-run: exit code **3** (BASELINE only); zero HIGH; zero CRITICAL; the 9 `fingerprint_mismatch` resolved; the 1 `registry_disagreement` resolved.
- [ ] `schema_validator.py` re-run: exit 3 unchanged from baseline (or exit 0 if validators improved cleanly).
- [ ] `mirror_enforcer.py` re-run: exit 0; 8/8 pairs PASS.
- [ ] STEP_LEDGER row 12.1 → `completed`; row 13 → `ready`; History block appended.
- [ ] CURRENT_STATE state-block transitioned (next_governance_step → Step_13).
- [ ] `.gemini/project_state.md` MP.2 mirror updated.
- [ ] GOVERNANCE_STACK §15 STEP_12.1 amendment log appended.
- [ ] SESSION_LOG appended atomically (per SESSION_LOG_SCHEMA §2).
- [ ] Native-directive verification: no open ND.N names Step 12.1; native_directive_per_step_verification: [].

## 7. Handoff

- **Next step (CLEAN/RESIDUAL outcome at Step 12.1 close):** Step 13 re-execution in a fresh session. The fresh session reads CLAUDE.md → STEP_LEDGER (verifies row 13 = `ready`) → STEP_BRIEFS/STEP_13_DRIFT_DETECTION_RUN_v1_0.md (the original Step 13 brief — reused) → CURRENT_STATE → DRIFT_REPORT_STEP_13_v1_0.md (the original CLOSED REGRESSION report, preserved as audit trail) — and runs `drift_detector.py` again. If clean, produces a fresh `DRIFT_REPORT_STEP_13_v1_1.md` (or amends-in-place per native preference at re-execution time) with verdict CLEAN or RESIDUAL, atomically closes Step 13, and unblocks Step 14.
- **Next step (REGRESSION outcome at Step 12.1 close):** halt and report to native. The 9 fingerprint placeholders + 1 missing FILE_REGISTRY row remain unresolved. Iterate on Step 12.1 implementation, do NOT advance to Step 13 re-execution. (This is unlikely if the brief is followed exactly — both fixes are mechanical.)

Proposed Cowork thread name for the Step 12.1 session: `Madhav 12.1 — Fingerprint + Registry Fix` per `CONVERSATION_NAMING_CONVENTION_v1_0.md §2`.

## 8. Red-team prompts (inline self-check at session close)

- "After my fingerprint rotation, does `drift_detector.py` actually report exit 3 — or am I assuming it does without re-running?" — verify by post-fix re-run; capture the exact exit code in the session-close YAML.
- "Did I mirror the FILE_REGISTRY §9.1 row schema exactly, or did I invent fields? Are sibling §9.1 rows (e.g., the BOOTSTRAP retirement row, the LEL_v1_1 archival row) using the same field set as the row I just added?" — diff against existing §9.1 rows; the schema is implicit in the file's prior content.
- "Did the CANONICAL_ARTIFACTS self-row fingerprint computation account for its own pre-self-rotation state?" — confirm the Step-7-pattern was followed (write other 8 first; compute CA hash; update self-row last as final atomic edit).

---

*End of STEP_12_1_FINGERPRINT_AND_REGISTRY_FIX_v1_0.md — produced 2026-04-24 by `STEP_13_DRIFT_DETECTION_BASELINE` post-regression-detection ledger amendment, modeled on Step 5A insertion precedent.*
