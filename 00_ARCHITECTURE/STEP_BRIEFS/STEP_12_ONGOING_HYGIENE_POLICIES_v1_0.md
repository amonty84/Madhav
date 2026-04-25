---
step: 12
title: Ongoing hygiene policies — archival, rotation, staleness, CI
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 13 (drift-detection run)
---

# STEP 12 — Ongoing Hygiene Policies

## 1. Objective

Institutionalize the hygiene rules that prevent the kind of drift the grounding audit found from re-accumulating. Produce `ONGOING_HYGIENE_POLICIES_v1_0.md` and update operating registries accordingly. Close hygiene findings (GA.12, GA.20, GA.21) and the Learning-Layer guardrail from Step 11.

## 2. Inputs

**MUST read:**

1. New CLAUDE.md
2. CURRENT_STATE_v1_0.md
3. STEP_LEDGER_v1_0.md
4. This brief
5. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`
6. `LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md` — existing maintenance policies; do not duplicate
7. `MAINTENANCE_SCHEDULE_v1_0.md`
8. `FILE_REGISTRY_v1_0.md` (or v1_1 if Step 5 bumped)
9. `GROUNDING_AUDIT_v1_0.md`

## 3. Deliverable

**File path:** `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md`

**Required structure:**

- **§A — Archival policy.** When a file is SUPERSEDED, where does it go? Retain-in-place with status flag (current behavior) vs move to `archive/`? Decide and justify. If move-based, specify move trigger (e.g., N days after supersede, or manual).
- **§B — Predecessor cleanup.** Resolves GA.12. LIFE_EVENT_LOG_v1_1 and any other predecessors lingering in live folders. One-time cleanup action listed here + standing rule.
- **§C — Scope-boundary enforcement.** Resolves GA.20. A session must declare its scope in SESSION_OPEN. If its SESSION_CLOSE touches files outside declared scope, schema_validator fails. Extend schema_validator accordingly.
- **§D — SESSION_LOG completeness.** Resolves GA.21. Extend schema_validator: if a commit or edit touches a file that is not listed in the session's SESSION_CLOSE, fail. (Implementation: parse `git diff` for the session window vs SESSION_CLOSE's files_touched list.)
- **§E — Staleness register.** Add or update the Staleness Register (likely already in PHASE_B_PLAN or GOVERNANCE_STACK). Rule: any CURRENT artifact whose last-modified date is more than 30 days old AND whose referenced canonical artifacts have bumped since — mark as STALE-SUSPECT. drift_detector flags.
- **§F — CI / cron cadence.** Recommend: drift_detector.py and schema_validator.py run on every session close (via SESSION_CLOSE template checklist) AND nightly via scheduled task if available. If scheduled tasks aren't configured, document the manual cadence.
- **§G — Red-team cadence.** Codify: every 3rd session, or every session that closes a major-version artifact, runs a red-team pass. The red-team session is a first-class step type with its own SESSION_LOG schema.
- **§H — Quarterly governance pass.** Every quarter, re-run the grounding audit and produce a delta report. Prevents governance-surface drift from slow creep.
- **§I — Review triggers for the Macro Plan.** When is the Macro Plan version-bumped? Non-trivial mechanism addition, macro-phase redefinition, external constraint change (e.g., new classical text corpus acquired, new agent class integrated).
- **§J — Implementation actions.** Every policy above gets a backing action: script change, registry edit, template addition, or documented human action. Step 12 performs the actions.

## 4. Constraints

- Do NOT duplicate content from LIVING_PROJECT_MAINTENANCE_GUIDE. Reference and extend.
- Do NOT introduce a new agent or tool. Use what Step 7 implemented.
- Do NOT defer a critical policy with "will revisit" language. Either the policy is in force at Step 12 close or it is explicitly out of scope with rationale.
- If scheduled tasks aren't available in this environment, document the gap and propose the manual cadence — do not require infrastructure the project doesn't have.

## 5. Discipline rules

- Closed artifact.
- Every policy points to the mechanism that enforces it (script, template field, schema rule, or documented human cadence).
- Preserve backward compatibility: no policy retroactively invalidates existing artifacts.

## 6. Close criteria

- [ ] `ONGOING_HYGIENE_POLICIES_v1_0.md` exists
- [ ] GA.12, GA.20, GA.21 closed or deferred with rationale
- [ ] schema_validator extended per §C and §D
- [ ] LIFE_EVENT_LOG_v1_1 archival action performed or documented
- [ ] Red-team cadence codified (closes the "red-team every 3rd session" into an actionable rule)
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 13 (drift-detection baseline run)

## 8. Red-team prompts

- "Does the hygiene policy set catch a session that edits 2026-04-XX files to retrofit history? (It should — retrofit is forbidden after Step 10.)"
- "If I add a new canonical artifact tomorrow, what policies trigger its inclusion in CANONICAL_ARTIFACTS and CLAUDE.md?"
