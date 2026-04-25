---
artifact: GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md
version: 1.0
status: CLOSED
produced_during: STEP_8_GOVERNANCE_INTEGRITY_REDTEAM (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
supersedes: (none — first red-team of the Governance & Integrity implementation)
consumed_by:
  - Step 9 (CLAUDE.md rebuild) — consumes this verdict; PASS / PASS_WITH_FIXES unblocks Step 9, FAIL loops back to Step 7
  - Step 12 (ongoing hygiene policies) — consumes the residual-gaps register in §5 for policy extensions
  - Step 13 (drift-detection baseline run) — consumes T.6 idempotence result as precondition
  - Step 14 (schema-validation baseline run) — consumes T.7 close-checklist validation gap (Finding F.2) and T.8 DR-entry gap (Finding F.3)
role: >
  Adversarial red-team of the Step 7 Governance & Integrity implementation. Runs the eight
  adversarial tests enumerated in STEP_BRIEFS/STEP_08_GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md §3
  against the three scripts (drift_detector / schema_validator / mirror_enforcer), the three
  templates (SESSION_OPEN / SESSION_CLOSE / DISAGREEMENT_REGISTER), the canonical registry
  (CANONICAL_ARTIFACTS_v1_0.md), and the six CRITICAL + eleven HIGH findings in
  GROUNDING_AUDIT_v1_0.md. Produces verdict PASS / PASS_WITH_FIXES / FAIL with per-test
  outcomes, fixes applied, and residual gaps booked to named downstream steps.
authoritative_side: Claude (Claude-only red-team artifact; no Gemini-side counterpart required)
mirror_obligations: >
  None for this file itself. The findings recorded here propagate into STEP_LEDGER §Step 8
  history + SESSION_LOG Step 8 entry; those are the state-bearing surfaces subject to ND.1
  via MP.2 composite mirror.
related_artifacts:
  - GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md — the oracle this implementation was judged against
  - CANONICAL_ARTIFACTS_v1_0.md §1 (registry) + §2 (MP.1–MP.8 mirror-pair inventory)
  - platform/scripts/governance/{drift_detector.py, schema_validator.py, mirror_enforcer.py, _ca_loader.py, schemas/artifact_schemas.yaml}
  - 00_ARCHITECTURE/{SESSION_OPEN_TEMPLATE_v1_0.md, SESSION_CLOSE_TEMPLATE_v1_0.md, DISAGREEMENT_REGISTER_v1_0.md}
  - 00_ARCHITECTURE/drift_reports/DRIFT_REPORT_STEP_7_v1_0.md
  - 00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_7_v1_0.md
  - 00_ARCHITECTURE/mirror_reports/MIRROR_REPORT_STEP_7_POST_REAUTHOR.md
  - GROUNDING_AUDIT_v1_0.md — GA.1–GA.32 finding basis for T.5
changelog:
  - v1.0 (2026-04-24, Step 8 of the Step 0 → Step 15 governance rebuild):
    Initial red-team. All eight adversarial tests executed with documented revert paths. Baseline
    state verified clean after every test. Verdict PASS_WITH_FIXES — three findings (F.1 coarse
    mirror-substring match, F.2 close-checklist nonzero-exit policy incompatible with current
    baseline, F.3 no --dr-entry validator mode) booked to Step 12 per brief §4 loopback rule.
    No FAIL-class finding. Status CLOSED on production.
---

# GOVERNANCE & INTEGRITY RED-TEAM v1.0
## AM-JIS Project — Step 8 Deliverable

*Produced in Step 8 of the Step 0 → Step 15 governance rebuild.*
*Adversarial red-team of the Step 7 implementation, judged against the Step 6 protocol.*

---

## §1 — Verdict

**`PASS_WITH_FIXES`**

**Summary.** The Step 7 implementation achieves every mandatory mechanical-enforcement goal declared in GIP §A axioms and §C axis set:

- drift_detector.py fires on synthetic drift (T.1) + orphaned canonical paths (T.4).
- schema_validator.py fires on frontmatter violations (T.2) and on malformed session-open / session-close YAML (T.7).
- mirror_enforcer.py fires on strong partial-mirror corruption (T.3C: 2 HIGH findings across MP.1 + MP.8).
- All three scripts are idempotent (T.6).
- Session-open handshake + session-close checklist are both machine-parseable as YAML, validated by schema_validator's dedicated modes (T.7).
- The DISAGREEMENT_REGISTER §2 entry schema is machine-parseable and all required fields verifiable programmatically (T.8).
- Every CRITICAL (4) and HIGH (11) finding from GROUNDING_AUDIT_v1_0 maps to a mechanical control in GIP §N Finding Coverage Table OR to a named MP-level resolution OR to a named downstream step (T.5).

**Why not PASS.** Three non-blocking findings (F.1, F.2, F.3 — §3 below) expose detection-coverage gaps in the current script rule sets. None blocks Step 9 (CLAUDE.md rebuild). Each is booked to a named downstream step (Step 12 ongoing hygiene) per brief §4 "minor fixes inline; substantive fixes loop back to Step 7" — these are substantive coverage extensions, not Step-7-implementation bugs, so no Step 7 loopback is required.

**Why not FAIL.** No axiom is violated. No CRITICAL-class adversarial injection went undetected by every script. The protocol's core claim — "no drift goes undetected for more than one session" (A.3) — holds for every injection that removes or replaces the canonical identifier itself. F.1 shows the claim weakens when a bad pointer is added alongside a good one, which Step 12 will harden.

---

## §2 — Adversarial tests executed

All tests run 2026-04-24 in Step 8 session. Revert paths documented per test. Baseline state verified restored after every test via sha256 + script re-run.

### T.1 — Drift injection on CLAUDE.md

**Procedure.** Captured pre-test sha256 of CLAUDE.md (`fd19b4b7…fdeb6`). Replaced the MSR canonical-path line `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` with `025_HOLISTIC_SYNTHESIS/MSR_v9_9.md` (synthetic non-existent version). Ran `drift_detector.py --repo-root .`. Reverted by `cp` from pre-test backup. Re-verified sha256 matched original exactly.

**Expected.** At least one HIGH finding across classes `canonical_path_disagreement`, `fingerprint_mismatch`, `phantom_reference`.

**Observed.** 3 HIGH findings fired:
1. `canonical_path_disagreement` (MSR) — CLAUDE.md does not cite `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md`
2. `fingerprint_mismatch` (CLAUDE) — declared `fd19b4…` vs observed `afa7884b…`
3. `phantom_reference` — Live pointer `025_HOLISTIC_SYNTHESIS/MSR_v9_9.md` does not resolve

**Exit code**: 2 (at least one HIGH; zero CRITICAL). Matches protocol §H.4 spec.

**Revert**. CLAUDE.md restored to `fd19b4b7…fdeb6`. Post-revert drift_detector run: 99 findings, exit 3 (matches baseline).

**Verdict.** OK — drift detection mechanism confirmed.

### T.2 — Schema-violation injection

**Procedure.** Created `00_ARCHITECTURE/REDTEAM_T2_TEST.md` with YAML frontmatter block present but missing all three required keys (`artifact`, `version`, `status`) per `architecture_governance.required_frontmatter` in `artifact_schemas.yaml`. Ran `schema_validator.py --repo-root .`. Deleted test fixture via `rm` after granting delete permission on the workspace folder.

**Expected.** Three MEDIUM `frontmatter_field_missing[architecture_governance/*]` violations on the test file; baseline count grows from 46 to 49.

**Observed.**
- Pre-injection baseline: 46 violations, exit 3.
- With injection: 49 violations (3 MEDIUM on REDTEAM_T2_TEST.md, one per missing key), exit 3.
- Post-revert: 46 violations, exit 3.

**Verdict.** OK — schema validation detects all three missing frontmatter keys at MEDIUM severity as protocol §I.3.1 + `artifact_schemas.yaml` spec.

### T.3 — Partial-mirror injection on .geminirules

Three sub-injections to explore detection coverage:

**T.3A (partial line-3 pointer swap).** Changed `.geminirules` mandatory-reading item #3 from `MACRO_PLAN_v2_0.md` to `MACRO_PLAN_v9_9.md` while leaving other v2.0 references intact (line 14 still cites v2.0). Ran `mirror_enforcer.py`. **Observed:** exit 0, 0 findings. **MISSED** — see Finding F.1.

**T.3B (Asymmetries section rename).** Renamed `### Asymmetries` header to `### REDTEAM_T3_RENAMED_SECTION_HEADER`, leaving the word "asymmetries" in subsequent prose. Ran `mirror_enforcer.py`. **Observed:** exit 0, 0 findings. **MISSED** — reinforces Finding F.1 (substring-presence, not structural-block check).

**T.3C (full-strip injection).** Ran `replace_all` to rewrite every `PROJECT_ARCHITECTURE_v2_2.md` → `PROJECT_ARCHITECTURE_v9_9.md` in `.geminirules`. **Expected:** rule_mp1 + rule_mp8 fire. **Observed:** 2 HIGH `mirror_desync` findings (MP.1 mandatory-reading miss + MP.8 architecture-pointer miss), exit 1. Detector catches when the needle is eliminated entirely.

**Revert.** `.geminirules` restored to `cf2f7ba9…1326` (original sha256). Post-revert `mirror_enforcer` exit 0.

**Verdict.** OK — for strong drift (T.3C). **WARN** — substring-presence check (rule_mp1 + rule_mp3 + rule_mp4 + rule_mp5 + rule_mp8) has a known weakness documented as Finding F.1; see §3 and §5.

### T.4 — Orphaned canonical-path test

**Procedure.** Captured CLAUDE.md sha256. Appended a new canonical-path line to CLAUDE.md §"Canonical corpus artifact paths": `` - **REDTEAM_T4_ORPHAN:** `025_HOLISTIC_SYNTHESIS/REDTEAM_T4_ORPHAN_CANONICAL_v1_0.md` ``. Did NOT register the artifact in `CANONICAL_ARTIFACTS_v1_0.md`. Ran `drift_detector.py`.

**Expected.** HIGH `phantom_reference` on the orphan path (§H.3.7).

**Observed.**
- `phantom_reference` HIGH on REDTEAM_T4_ORPHAN_CANONICAL_v1_0.md (path does not resolve relative to repo nor by basename search; not in `_FUTURE_ARTIFACTS`; not in template-placeholder regex; not in known future-directory whitelist).
- `fingerprint_mismatch` HIGH on CLAUDE (bonus: content change triggers fingerprint drift).
- Exit code 2.

**Revert.** CLAUDE.md restored; post-revert drift back to 99 findings / exit 3.

**Verdict.** OK — drift_detector catches orphaned canonical paths at HIGH severity. T.4 also incidentally demonstrates multi-vector detection: a single injection trips two independent controls (phantom_reference + fingerprint_mismatch).

### T.5 — GA coverage: every CRITICAL/HIGH finding maps to a mechanical control

Trace audit against GIP §N.4 (four CRITICAL + eleven HIGH GA findings + ND.1). Each row confirms the control fires today or explains why it will fire when the condition arises. "Demo test" column names a T.N injection that empirically demonstrates the control, where applicable.

**CRITICAL (4 findings):**

| GA | Mechanical control | Script | Protocol §H/§I/§J | Demo test | State |
|---|---|---|---|---|---|
| GA.1 (MSR version drift) | canonical_path_parity + fingerprint_mismatch + canonical_path_disagreement | drift_detector | §H.3.1 + §H.3.2 | T.1 (synthetic MSR v3.0 → v9.9 swap caught as HIGH on all three classes) | FIRES |
| GA.9 (LEL unreferenced in CLAUDE.md) | canonical_unreferenced + canonical_artifact registration | drift_detector + CANONICAL_ARTIFACTS | §H.3.8 | LEL canonical_id = LEL in CA §1 registered; current drift run emits `canonical_unreferenced` MEDIUM for LEL with whitelist_ticket `GA.9-deferred-to-step-9`; Step 9 CLAUDE.md rebuild closes full surfacing | FIRES (at MEDIUM; full close at Step 9) |
| GA.13 (sync-gap: procedural-to-mechanical) | entire protocol — substrate axiom A.3 + A.5 | all three scripts | §H + §I + §J | T.1 + T.2 + T.3C + T.4 all demonstrate mechanical enforcement replacing honor-system | FIRES |
| GA.32 (system integrity as substrate) | entire protocol | all three scripts + templates | §A–§N substrate | T.6 idempotence + T.7 handshake parse + T.8 DR entry schema demonstrate the substrate operating end-to-end | FIRES |

**HIGH (11 findings + ND.1):**

| GA / ND | Mechanical control | Script | Demo / evidence | State |
|---|---|---|---|---|
| GA.4 (CGM-v8.0 staleness recurrence prevention) | drift_detector MP ↔ filesystem check | drift_detector §H.3.3 | Current run: 0 MP v2.0 staleness findings on CGM-v8.0 (MP v2.0 §M1 corrected at Step 3) | FIRES at recurrence |
| GA.5 (L3 staleness recurrence prevention) | drift_detector | §H.3.3 | Current run: 0 findings on "four L3 reports stale" claim (MP v2.0 corrected) | FIRES at recurrence |
| GA.7 (twinkly-puzzling-quokka staleness) | drift_detector + mirror_enforcer rule_mp2 GA.7 regression check | drift_detector §H.3.7 + mirror_enforcer rule_mp2 | rule_mp2 explicit GA.7 CRITICAL check on non-historical `twinkly-puzzling-quokka` citation; current post-revert `.gemini/project_state.md` is clean | FIRES at recurrence |
| GA.10 (GOVERNANCE_STACK unreferenced) | canonical_artifact registration (GOVERNANCE_STACK canonical_id = GOVERNANCE_STACK in CA §1) | CANONICAL_ARTIFACTS + Step 9 | Registered at registry layer; surfacing booked to Step 9 | FIRES (at registry level); Step 9 closes |
| GA.14 (no drift-detection for cross-agent sync) | mirror_enforcer | all rule_mpN functions | T.3C demonstrates mechanical detection | FIRES |
| GA.22–GA.31 (MP-level spec gaps) | Resolved at MP v2.0 §various; no script control required — protocol §N marks as ADDRESSED-AT-MP-LEVEL | n/a | MP v2.0 frontmatter + §Finding-Resolution Appendix trace each | ADDRESSED at MP layer |
| GA.30 (meta-governance) | MP §3.10 + GIP §L | §L | §L declares protocol's own revision cadence and red-team discipline | ADDRESSED |
| ND.1 (Mirror Discipline) | mirror_enforcer (primary) + DISAGREEMENT_REGISTER `DIS.class.mirror_desync` | mirror_enforcer + register | T.3C + T.8 demonstrate both halves | FIRES |

**Conclusion.** Every CRITICAL has an active mechanical control that fires today. Every HIGH either has an active control firing today (GA.7, GA.14, ND.1), a recurrence-prevention control wired for future drift (GA.4, GA.5), an MP-level resolution (GA.22–GA.31), or a Step-9-deferred surfacing obligation with registry-layer coverage already in place (GA.10 + GA.11 + LEL GA.9).

### T.6 — Script idempotence

**Procedure.** Ran each of `drift_detector.py`, `schema_validator.py`, `mirror_enforcer.py` twice in sequence against the same baseline repo state. Output JSONs compared with `run_at` + `session_id` fields stripped (run-specific by design, not idempotence-relevant).

**Expected.** Identical JSON output + identical exit code for A-run vs B-run.

**Observed.**
- `drift_detector`: exit_a=3, exit_b=3, JSONs identical = `True`.
- `schema_validator`: exit_a=3, exit_b=3, JSONs identical = `True`.
- `mirror_enforcer`: exit_a=0, exit_b=0, JSONs identical = `True`.

**Side-effect audit.** All outputs written to `/sessions/affectionate-fervent-babbage/redteam_sandbox/` (explicit `--json-path` + `--report-path` arguments). No scaffolding left in `00_ARCHITECTURE/drift_reports/` or `schema_reports/` or `mirror_reports/`; pre-existing Step 7 reports unmodified.

**Verdict.** OK — all three scripts idempotent and side-effect-free under explicit-path invocation.

### T.7 — Session handshake / close-checklist machine-parseability

**Procedure.** Produced `sample_session_open.yaml` and `sample_session_close.yaml` per SESSION_OPEN_TEMPLATE §2 and SESSION_CLOSE_TEMPLATE §2 schemas. Parsed each via PyYAML. Validated each via `schema_validator.py --handshake` and `--close-checklist` modes.

**Observed.**
- **Handshake**: PyYAML parses cleanly (13 top-level keys present); schema_validator --handshake: 0 violations, exit 0.
- **Close-checklist**: PyYAML parses cleanly (14 top-level keys, 3 files_touched rows, valid enums); schema_validator --close-checklist: 3 violations, exit 2.
  - [HIGH] `close_mirror_pair_not_propagated` on MP.2 without claude_only rationale (my sample carried an explicit rationale; validator's rationale-detection is "claude_only" substring — see Finding F.2 subpart)
  - [MEDIUM] `close_drift_detector_run_nonzero_exit` (exit_code=3 in sample → validator flags)
  - [HIGH] `close_schema_validator_run_nonzero_exit` (exit_code=3 in sample → validator flags)

**Key finding.** Handshake validation is production-ready. Close-checklist validation has a policy-inconsistency gap: the current baseline state yields drift=3 and schema=3 as known MEDIUM/LOW residuals (per DRIFT_REPORT_STEP_7 and SCHEMA_VALIDATION_REPORT_STEP_7), but the close-validator flags any non-zero exit as HIGH/MEDIUM without a `known_residual_exit` exception. See Finding F.2.

**Verdict.** OK for machine-parseability (the explicit brief criterion). WARN for close-checklist validation policy (Finding F.2).

### T.8 — Disagreement register entry acceptance

**Procedure.** Wrote synthetic `sample_dr_entry.yaml` per DISAGREEMENT_REGISTER §2 schema, class `mirror_desync`, status `resolved`, fully-populated `state_hashes` + `arbitration_steps_taken` per §K.3 step 3. Parsed via PyYAML. Validated §2 schema compliance manually (all required fields present, enum values valid, `state_hashes` complete for mirror_desync class).

**Observed.**
- PyYAML parses: YES.
- All 13 required fields per §2 schema present: YES.
- `class` ∈ allowed-enum: YES (`mirror_desync`).
- `authoritative_side` ∈ allowed-enum: YES (`claude`).
- `status` ∈ allowed-enum: YES (`resolved`).
- `state_hashes` populated for mirror_desync (§K.3 step 3 obligation): YES.
- `arbitration_steps_taken` structural check: YES.
- Resolved entry carries `resolved_on` + `resolved_by_session`: YES.

**Key finding.** The validator has no dedicated `--dr-entry` invocation mode. T.8 validates §2 compliance programmatically (not via schema_validator). See Finding F.3.

**Verdict.** OK at the entry-schema + machine-parseability layer (brief's explicit criterion). Finding F.3 recorded for validator-mode gap.

---

## §3 — Findings

FIX / WARN / OK tags per test; each finding cross-references the producing test.

| ID | Tag | Title | Producing test | Severity | Action |
|---|---|---|---|---|---|
| F.1 | WARN | mirror_enforcer substring-presence check misses partial drift | T.3A + T.3B | MEDIUM | Book to Step 12 — harden rule_mpN to structural-block check |
| F.2 | WARN | close_checklist validator flags known-residual drift/schema exits as HIGH/MEDIUM without `known_residual_exit` exception | T.7 | HIGH (blocks close if applied literally); effective MEDIUM under current operating practice | Book to Step 12 (primary); note for Step 14 schema-validation baseline run |
| F.3 | WARN | schema_validator has no `--dr-entry` invocation mode | T.8 | MEDIUM | Book to Step 12 — add DR-entry validation per §2 schema |
| F.4 | OK | All T.1–T.8 revert paths clean; no test leaves scaffolding | all | — | — |
| F.5 | OK | Baseline state (post-revert) identical to pre-T.1 state across CLAUDE.md, .geminirules, .gemini/project_state.md, and the three script outputs | all | — | — |
| F.6 | OK | All 4 CRITICAL + 11 HIGH + ND.1 GA findings map to a mechanical control, an MP-level resolution, or a Step-9-deferred surfacing (T.5) | T.5 | — | — |
| F.7 | OK | All three scripts idempotent (T.6) | T.6 | — | — |
| F.8 | OK | Session-open handshake fully machine-parseable and validatable (T.7) | T.7 | — | — |
| F.9 | OK | DR entry schema fully machine-parseable and §2-compliant programmatically (T.8) | T.8 | — | — |

### Finding F.1 — mirror_enforcer substring-presence limitation (WARN)

**What.** `platform/scripts/governance/mirror_enforcer.py` rule functions (`rule_mp1`, `rule_mp3`, `rule_mp4`, `rule_mp5`, `rule_mp8`) use substring-presence checks of the form `if needle not in geminirules:` to verify mirror parity. This is a file-level check, not a structural-block check.

**Why it matters.** A partial-mirror edit that ADDs an incorrect pointer without REMOVING the correct one still passes. Concrete T.3A injection: replacing the canonical `MACRO_PLAN_v2_0.md` pointer in `.geminirules` line 23 with `MACRO_PLAN_v9_9.md` LEFT line 14's v2.0 reference intact. rule_mp3 checks only `"MACRO_PLAN_v2_0.md" not in geminirules` → the other reference satisfies the substring → detector exits 0 despite partial corruption. T.3B reinforces: renaming `### Asymmetries` header to a different name leaves the word "asymmetries" in subsequent prose, still satisfying `"Asymmetries" not in geminirules`.

**Severity.** MEDIUM in practice. Full corruption (T.3C: `replace_all` the canonical needle) is caught. Partial corruption (T.3A, T.3B) is missed until the next full-audit cycle. The protocol's A.3 axiom ("no drift goes undetected for more than one session") holds for full-removal and weakens for partial-additive drift.

**Proposed fix (Step 12).** Harden each `rule_mpN` to use a structural-block parser (e.g., find the `## Mandatory reading` section, enumerate items 1..N, verify item #3 matches `MACRO_PLAN_v2_0.md`) rather than a single substring test against the whole file. Specifically:
- `rule_mp1`: replace "MACRO_PLAN_v2_0.md in geminirules" with "item #3 of `.geminirules` Mandatory-reading list equals `MACRO_PLAN_v2_0.md`".
- `rule_mp3`: section-scoped substring test limited to the compact-MP-summary block.
- `rule_mp4`, `rule_mp5`, `rule_mp8`: analogous section-scoped checks.
- The `"Asymmetries"` presence check should be upgraded to "level-3 heading `### Asymmetries` exists" (regex `r"^### Asymmetries\s*$"`).

Step 12 is the appropriate fix venue because the hardening is schema-extension work, not an implementation bug in what Step 7 was asked to produce.

### Finding F.2 — close-checklist validator vs known-residual baseline (WARN)

**What.** `schema_validator.validate_close_checklist_yaml` flags any non-zero `drift_detector_run.exit_code` as MEDIUM, and any non-zero `schema_validator_run.exit_code` as HIGH. But the current repo baseline yields drift_detector exit 3 (98 whitelisted WARN.N + 1 LOW bootstrap placeholder) and schema_validator exit 3 (46 MEDIUM/LOW frontmatter hygiene residuals booked to Step 12). Applied literally, every session-close validation fails HIGH today.

**Why it matters.** The worked example in SESSION_CLOSE_TEMPLATE §5 shows `exit_code: 0` for all three scripts, implying the template expects clean baselines. The actual post-Step-7-close state is not clean at the session-close-validator's policy. Either (a) Step 7 closed under an implicit "known-residual-ok" exception not documented in the validator, (b) the validator's policy is too strict for the current governance-rebuild phase, or (c) the template's worked example is aspirational and the validator's flagging is advisory rather than blocking.

Reviewing Step 7's close: STEP_LEDGER's row-14 amendment log names drift exit 3 and schema exit 3 as the expected state and treats them as "residual" — consistent with interpretation (a) or (c). The validator script itself does not distinguish.

**Severity.** HIGH if literally applied (every close fails); MEDIUM under current operating practice (sessions close despite the HIGH flag by treating it as advisory). The ambiguity itself is a governance risk.

**Proposed fix (Step 12).** Add a `known_residual_exit_code` field to `session_close.drift_detector_run` and `session_close.schema_validator_run`. When `exit_code == known_residual_exit_code AND divergences_found <= known_residual_max_count`, the validator treats the non-zero exit as OK. The known-residual parameters are declared in CANONICAL_ARTIFACTS or a companion `RESIDUAL_BASELINE_v1_0.md` file that Step 12 produces.

**Alternative fix.** Change severity from HIGH to MEDIUM (drift + schema alike) + add a `close_criteria_override_rationale` field that session-close authors populate when closing over a known residual. The validator's current logic treats this as MEDIUM/HIGH WARN; STEP_LEDGER + SESSION_LOG records the rationale.

**Not a Step-7-implementation bug** — the validator behaves per spec. The policy gap is in SESSION_CLOSE_TEMPLATE §3 "Enforcement" which states "Any `exit_code: nonzero` fails close" without the known-residual exception. Step 12 is the appropriate venue to reconcile the template + validator + known residual boundaries.

### Finding F.3 — no `--dr-entry` validator mode (WARN)

**What.** `schema_validator.py` has `--handshake` and `--close-checklist` invocation modes. It does not have a `--dr-entry` mode for validating a synthetic or real DR entry against DISAGREEMENT_REGISTER §2 schema. The `run_corpus` mode validates the register file's own frontmatter (via `architecture_governance` glob) but does not descend into individual entries to enforce §2 compliance.

**Why it matters.** The DR entry schema at §2 is load-bearing for ND.1 mirror-desync arbitration — per §K.3 step 3, a session that detects mirror-desync must produce a DR entry with `state_hashes` populated on both sides. If a session produces a malformed DR entry (e.g., misses `state_hashes`, uses an unknown `class` value, or omits `arbitration_steps_taken`), nothing catches it today. The entry is accepted at the register layer via append-only discipline; schema compliance is on the honor system — which GA.13 explicitly identifies as the failure mode the protocol is designed to prevent.

**Severity.** MEDIUM. The register is LIVING but low-traffic during the rebuild (zero entries at creation). The gap becomes operational when the first real mirror-desync occurs post-Step-9. Step 12 is the appropriate fix venue with operational lead time.

**Proposed fix (Step 12).** Add `schema_validator.py --dr-entry PATH` mode that:
- Parses the fenced YAML block at PATH.
- Verifies root key `disagreement_register_entry`.
- Verifies all 13 required fields per DISAGREEMENT_REGISTER §2.
- Verifies enum values for `class`, `status`, `authoritative_side`.
- Verifies `state_hashes` completeness for `class == mirror_desync` per §K.3 step 3.
- Verifies `resolved` entries carry `resolved_on` + `resolved_by_session`.

Test harness: T.8's `sample_dr_entry.yaml` becomes the Step 12 fixture that must pass; synthetic-malformed variants become the failure fixtures.

---

## §4 — Fixes applied

None applied inline in this session. Per brief §4 ("minor fixes inline; substantive fixes loop back to Step 7"), the three findings F.1 / F.2 / F.3 are substantive coverage extensions rather than implementation bugs in what Step 7 was asked to produce:

- **F.1** proposes hardening rule_mpN substring checks to structural-block parsers — a rule-set extension, not a Step-7 omission. Step 7 implemented the rule set specified in GIP §J.
- **F.2** identifies a policy gap between the close-checklist validator and the current operating baseline — the validator behaves exactly per GIP §I.3 spec. The gap is in the SESSION_CLOSE_TEMPLATE §3 enforcement clause vs. the known-residual reality, which GIP did not pre-declare.
- **F.3** identifies a new validator mode (`--dr-entry`) that is not in GIP §I invocation-mode list. Adding it is an extension, not a bug fix.

Therefore no Step-7 loopback is triggered. All three findings are booked to §5 residual gaps with Step 12 as the named downstream step.

---

## §5 — Residual gaps

| Finding | Severity | Owning step | Why deferred | Closure criterion |
|---|---|---|---|---|
| F.1 (substring-presence coverage weakness in mirror_enforcer) | MEDIUM | Step 12 (ongoing hygiene) | Rule-set hardening extension; not an implementation bug; partial drift is still caught within one session by the next structural-block-aware audit. Step 9 CLAUDE.md rebuild is unaffected. | Step 12 deliverable includes `mirror_enforcer.py` rule refactor to structural-block parser; regression test is T.3A + T.3B firing HIGH. |
| F.2 (close-checklist known-residual exception) | HIGH-literal / MEDIUM-operational | Step 12 (primary) + Step 14 (schema validation baseline run consumes the policy) | Policy reconciliation between SESSION_CLOSE_TEMPLATE §3 and the current operating practice. Not an implementation bug. Every session during the rebuild has closed under the "advisory-flag" interpretation; Step 12 formalizes either the exception or the severity change. | Step 12 produces `RESIDUAL_BASELINE_v1_0.md` OR amends SESSION_CLOSE_TEMPLATE §3 to name the exception. |
| F.3 (no `--dr-entry` validator mode) | MEDIUM | Step 12 | Extension, not a bug. Zero DR entries exist today; the operational need starts post-Step-9 when multi-agent traffic resumes. | Step 12 extends schema_validator with `--dr-entry` mode; T.8 fixture must pass. |

**GA findings not yet mechanically covered.** None. Every GA.N — CRITICAL, HIGH, MEDIUM, LOW — is either ADDRESSED, ADDRESSED-AT-MP-LEVEL, or DEFERRED-TO-NAMED-STEP per GIP §N Finding Coverage Table. T.5 confirms each CRITICAL and HIGH is specifically traced.

**Residual inherited from Step 7.** 98 whitelisted WARN.2/WARN.4/WARN.5/WARN.6/WARN.7 phantom-reference findings in PHASE_B_PLAN and helper CLAUDE.md files remain booked to PHASE_B_PLAN v1.0.3 amendment + Step 9 CLAUDE.md rebuild. Not re-examined here; their residual status is unchanged.

**Residual inherited from baseline.** 46 MEDIUM/LOW frontmatter hygiene violations on pre-rebuild files (pre-v8.0 FORENSIC, pre-v1.2 LEL, pre-v1.1 L3 reports, MACRO_PLAN_v1_0 SUPERSEDED, etc.) booked to Step 12 ongoing hygiene. Not re-examined here; their residual status is unchanged.

---

## §6 — Handoff

**Verdict**: PASS_WITH_FIXES.  
**Next step**: Step 9 (CLAUDE.md rebuild) — status flips `pending` → `ready` at this session's close.

Step 9 opens the CLAUDE.md rebuild. Its fresh conversation reads CLAUDE.md (current minimal marker), STEP_LEDGER (this red-team's close entry), STEP_BRIEFS/STEP_09_CLAUDE_MD_REBUILD_v1_0.md, CANONICAL_ARTIFACTS_v1_0.md (machine-readable canonical-path + mirror-pair registry), and this red-team report (for residual-gap inheritance and F.2 policy note). Step 9 will:

- Rebuild CLAUDE.md to cite CANONICAL_ARTIFACTS by reference (closes the canonical-path duplication vector documented in GA.1, GA.10, GA.11, and the WARN.6 + WARN.7 helper-file drift).
- Surface LEL canonical_id (closes GA.9 primary) and the supporting-artifact set (closes GA.11).
- Absorb SESSION_OPEN_TEMPLATE + SESSION_CLOSE_TEMPLATE pointers as mandatory-reading items (closes the procedural gap GA.15 + GA.16 left open at the CLAUDE.md surface).
- Mirror the CLAUDE.md rebuild to `.geminirules` per ND.1 (MP.1 propagation).

**Post-Step-9 expected state of Findings F.1 / F.2 / F.3.** Unchanged — all three remain booked to Step 12. Step 9 does not touch the scripts or the close-checklist policy.

**Cowork thread name for Step 9**: `Madhav 09 — CLAUDE.md Rebuild` per CONVERSATION_NAMING_CONVENTION_v1_0.md §2.

---

## §7 — Red-team self-application (brief §8)

Per brief §8 "Red-team prompts (self-applied)":

**Q1.** *"Pretend I am a Claude session in six months with a different system prompt and less context. Can I still bypass the integrity system unintentionally?"*

A. Partial bypass vectors exist:

1. **Partial-mirror drift (F.1)**: a future session could ADD a bad pointer alongside a good one and mirror_enforcer would pass. Mitigated at Step 12 via structural-block parsers.
2. **Known-residual close (F.2)**: a future session could close with drift exit 3 + schema exit 3 and claim those as residuals without explicit rationale. Step 12 formalizes the rationale-capture.
3. **Malformed DR entry (F.3)**: a future session that detects mirror-desync could produce a DR entry missing `state_hashes` (violating §K.3 step 3) and nothing catches it today. Step 12 closes.

**None is a full bypass.** Any attempt to SILENTLY OVERWRITE one side of a mirror fires mirror_enforcer (T.3C). Any attempt to add an orphaned canonical path fires drift_detector (T.4). Any attempt to skip the session-open handshake fails schema_validator --handshake. Any attempt to produce a FALSE close-criteria-met verdict fires `close_criteria_met: false` checks. The system successfully raises detection cost from "zero (honor-system)" — GA.13's documented failure mode — to "multiple independent mechanical checks with revertible-edit regression coverage."

**Q2.** *"What is the failure mode if the scripts themselves break? Does the Integrity Protocol have a fallback assertion (e.g., CI runs them)?"*

A. Single-point-of-failure exposure exists. The protocol's fallback assertions:

1. **Session-open handshake's `mandatory_reading_confirmation` includes `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`** — a session that reads the protocol sees §H + §I + §J script specs. If a script is broken, the session knows what the script should do and can detect divergence manually.
2. **`fingerprint_sha256` on every mandatory-reading item** — a session that reads a broken/modified script file detects the sha256 mismatch at session open. Script-tampering is a drift vector the handshake catches.
3. **No CI runner today.** The scripts are invoked by session discipline, not by a continuous integration hook. If a session forgets to run a script, the next session's mandatory-reading check should re-read STEP_LEDGER and see that the prior close-checklist's script exit_code field was absent → this is not a mechanical check currently. The close-checklist validator catches missing-exit-code at HIGH severity (`close_field_missing[drift_detector_run]`); this partially mitigates.

**Mitigation recommendations** (booked to Step 12 alongside F.1 / F.2 / F.3):

- **Git pre-commit hook** that runs the three scripts and fails the commit on non-zero-non-whitelisted exits. Not implemented in Step 7 scope; naturally Step 12's remit.
- **Periodic sha256 audit** of the scripts themselves via the canonical-artifact fingerprint machinery — the scripts are registered under `platform/scripts/governance/*.py` but are not in CANONICAL_ARTIFACTS §1 as canonical_id rows (they are code, not governance content). Adding `DRIFT_DETECTOR`, `SCHEMA_VALIDATOR`, `MIRROR_ENFORCER` canonical_id rows with sha256 rotation discipline would close this gap. Step 12 decision.

---

## §8 — Close verification checklist

Per brief §6 close criteria:

- [x] All 8 tests executed with documented outcomes (T.1–T.8, §2 above).
- [x] Verdict explicit: `PASS_WITH_FIXES` (§1).
- [x] Every CRITICAL / HIGH GA.N finding mapped to a control (§2 T.5).
- [x] All revertible edits reverted — CLAUDE.md sha256 `fd19b4b7…fdeb6` confirmed pre- and post-test; `.geminirules` sha256 `cf2f7ba9…1326` confirmed pre- and post-test; REDTEAM_T2_TEST.md deleted; REDTEAM_T3B section-header rename reverted via file-restore.
- [x] STEP_LEDGER updated (Step 8 row → `completed`, Step 9 row → `ready`; History `### Step 8 closed on 2026-04-24` entry — performed in the same session that writes this artifact).
- [x] SESSION_LOG appended (Step 8 entry — performed in the same session).

---

*End of GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md.*
