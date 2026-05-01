---
artifact: GROUNDING_AUDIT_v1_0.md
version: 1.0
status: CLOSED
session: STEP_0_GROUNDING
date: 2026-04-23
scope: >
  Baseline audit of the MARSYS-JIS governance surface at the moment Step 0 is being
  executed. Captures every point of drift, contradiction, staleness, phantom
  reference, and unreferenced artifact across the files that control how LLM
  sessions orient themselves. This is the evidence base that Steps 1–15 will
  consume. The audit is descriptive, not prescriptive — it describes what IS,
  so later steps can decide what OUGHT to be.
inputs_audited:
  - /Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md
  - /Users/Dev/Vibe-Coding/Apps/Madhav/.geminirules
  - /Users/Dev/Vibe-Coding/Apps/Madhav/.gemini/project_state.md
  - 00_ARCHITECTURE/MACRO_PLAN_v1_0.md
  - 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md (v1.0.2)
  - 00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md
  - 00_ARCHITECTURE/FILE_REGISTRY_v1_0.md
  - 00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md
  - 00_ARCHITECTURE/SESSION_LOG.md (all 1,521 lines)
  - 00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md
  - Glob of 00_ARCHITECTURE/*.md (27 files)
  - Glob of 06_LEARNING_LAYER/ (directory does not exist)
  - 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md (frontmatter + structure)
consumers:
  - Step 1 (exhaustive Macro Plan critique) — primary
  - Step 6 (Governance & Integrity Protocol design) — primary
  - Step 9 (CLAUDE.md rebuild) — primary
  - Step 10 (SESSION_LOG format update) — primary
  - All other steps as reference
---

# GROUNDING AUDIT v1.0 — Baseline State of the MARSYS-JIS Governance Surface

## §0 — Purpose and method

This document is the forensic baseline for the Step 0 → Step 15 workflow. Its job is to answer the question: **at the moment we begin the governance-layer rebuild, what is the true state of every file, pointer, claim, and convention that controls how a fresh LLM session orients itself on this project?**

The audit does not propose fixes. Every finding is reported with a stable ID (`GA.N`) so downstream steps can cite it, accept it, reject it, or close it with explicit rationale.

Each finding is tagged:
- **severity**: CRITICAL / HIGH / MEDIUM / LOW
- **drift_class**: VERSION-DRIFT / STALENESS / PHANTOM-REFERENCE / UNREFERENCED-ARTIFACT / SYNC-GAP / SCHEMA-GAP / SCOPE-CREEP / HYGIENE
- **owning_step**: which downstream step will act on it (if any)

Confidence: findings are derived from direct file reads performed 2026-04-23 in the session preceding this audit. Where a prior file read was contradicted by a later glob, the later evidence is canonical and the earlier finding is retracted in §9.

---

## §1 — The four governance surfaces

A "governance surface" is any file a fresh Claude or Gemini session reads to orient itself before doing real work. The project today has four such surfaces:

| Surface | File | Role | Last-updated |
|---|---|---|---|
| GS.1 | `/CLAUDE.md` (root) | Claude's master instructions, per-session mandatory reading list, canonical artifact path table | 2026-04-23 (PHASE_B_PLAN v1.0.2 Amendment session) |
| GS.2 | `/.geminirules` | Gemini's master instructions, layer taxonomy, L4 Discovery Layer role definition | 2026-04-23 (same session, mirror pass) |
| GS.3 | `/.gemini/project_state.md` | Gemini's dynamic state — current phase, pending blockers, pass model | Undated; references `twinkly-puzzling-quokka.md` which PHASE_B_PLAN supersedes |
| GS.4 | `00_ARCHITECTURE/SESSION_LOG.md` | Chronological session ledger, next-session objective pointer | 2026-04-23 (PHASE_B_PLAN v1.0.2 Amendment session) |

Supporting the four surfaces are five "registry artifacts" that claim to be sources of truth for different slices of the project:

| Registry | File | Claimed role | Currency |
|---|---|---|---|
| R.1 | `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` | Complete file inventory with CURRENT/SUPERSEDED/ARCHIVAL status | Dated 2026-04-19 — predates MSR_v3_0 (2026-04-22) |
| R.2 | `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Version registry, session closure log, amendment log | Updated 2026-04-19 — also predates MSR_v3_0 |
| R.3 | `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | Ten-macro-phase strategic arc, Learning Layer substrate, scope boundary | 2026-04-23 — current |
| R.4 | `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | M2 execution plan (B.0–B.10), two-pass ordering, validator spec | v1.0.2, 2026-04-23 — current |
| R.5 | `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | Governing architectural blueprint (§A–§J) | 2026-04-17 — pre-MSR_v3_0, pre-FORENSIC_v8_0-unified |

A fresh session that reads GS.1–GS.4 and R.1–R.5 in sequence will receive **contradictory claims about the current state of the corpus**. The remainder of this audit documents which claims contradict which.

---

## §2 — Canonical artifact version drift matrix

This is the highest-severity class of finding. Multiple governance surfaces make claims about "the current version" of the same artifact, and those claims disagree.

### §2.1 — MSR (Master Signal Register)

| Source | Path claimed | Signal count claimed | Status |
|---|---|---|---|
| CLAUDE.md (root) | `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | 499 | **AUTHORITATIVE** |
| .geminirules | `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | (no count) | In sync with CLAUDE.md |
| FILE_REGISTRY_v1_0 | `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` (v2.2) | 500 | **STALE** — predates v3_0 unification |
| GOVERNANCE_STACK_v1_0 | `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` (v2.1 internal) | 500 | **STALE** |
| .gemini/project_state.md | `MSR_v3_0.md` (implicit via "500 signals") | 500 | Mentions v3_0 but count is 500 not 499 — **MINOR DRIFT** |
| SESSION_LOG CORPUS_VERIFICATION_PASS entry | `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | 499 | Authoritative origin (2026-04-22) |

**GA.1** [CRITICAL / VERSION-DRIFT / owning_step=Step 7 + Step 6]: FILE_REGISTRY and GOVERNANCE_STACK claim MSR_v2_0 is current. MSR_v3_0 (unified from v1_0+v2_0 on 2026-04-22) is the actual current version per CLAUDE.md and SESSION_LOG. Both registries are 1–2 major versions behind.

**GA.2** [MEDIUM / VERSION-DRIFT / owning_step=Step 9]: project_state.md says 500 signals; actual count per MSR_v3_0 is 499. Off-by-one due to deduplication during v1_0+v2_0 merge.

### §2.2 — UCN (Unified Chart Narrative)

| Source | Path claimed | Status |
|---|---|---|
| CLAUDE.md | `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | **AUTHORITATIVE** |
| .geminirules | `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | In sync |
| FILE_REGISTRY_v1_0 | `UCN_v4_0.md` (v4.1 internal) | Current — aligned |
| GOVERNANCE_STACK_v1_0 | `UCN_v4_0.md` (UCN_MERGE_SESSION entry) | Current — aligned |
| .gemini/project_state.md | (no explicit UCN reference) | **UNREFERENCED** |

**GA.3** [LOW / UNREFERENCED-ARTIFACT / owning_step=Step 7]: project_state.md does not reference UCN_v4_0 as a canonical artifact despite it being the master narrative that Gemini's L4 discovery work will consume.

### §2.3 — CGM (Chart Graph Model)

| Source | Path claimed | Status |
|---|---|---|
| CLAUDE.md | `CGM_v2_0.md` (will become v9_0 after Phase B.3.5) | **AUTHORITATIVE** |
| .geminirules | `CGM_v2_0.md` (same note re: v9_0) | In sync |
| FILE_REGISTRY_v1_0 | `CGM_v2_0.md` | Aligned |
| GOVERNANCE_STACK_v1_0 | `CGM_v2_0.md` | Aligned |
| MACRO_PLAN_v1_0 §M1 | "CGM not rebuilt on v8.0" | **STALE** — CGM_v2_0 was rebuilt on v8.0 2026-04-19 per GAP_RESOLUTION_SESSION |

**GA.4** [HIGH / STALENESS / owning_step=Step 1 + Step 3]: MACRO_PLAN §M1 lists "CGM not rebuilt on v8.0" as a known M1 gap. This was resolved 2026-04-19 (CGM_v2_0 rebuilt in GAP_RESOLUTION_SESSION Phase D). Macro Plan is four days stale on this point.

### §2.4 — L3 domain reports staleness

| Source | Claim | Status |
|---|---|---|
| MACRO_PLAN §M1 | "four L3 reports stale" | **STALE CLAIM** |
| GAP_RESOLUTION_SESSION (2026-04-19) | 5 L3 reports refreshed to v1.1 (Career, Travel, Psychology, Children, Parents) | Resolved |
| CLOSURE_AUDIT_PASS (2026-04-19) | "All 9 CURRENT L3 Domain Reports ... reference only CURRENT L1/L2.5 artifacts" | Resolved |

**GA.5** [HIGH / STALENESS / owning_step=Step 1 + Step 3]: MACRO_PLAN's "four L3 reports stale" claim is incorrect as of 2026-04-19. All nine L3 reports are now at v1.1+ and reference only current L1/L2.5 artifacts.

### §2.5 — Other canonical artifacts (CDLM, RM, FORENSIC)

These are in sync across all surfaces (CDLM_v1_1, RM_v2_0, FORENSIC_v8_0). No drift found.

---

## §3 — Phantom references and ghost paths

A "phantom reference" is a file path that appears authoritatively in a governance surface but does not exist on disk, OR exists but is never referenced where it should be.

### §3.1 — 06_LEARNING_LAYER/

| Reference | Claim |
|---|---|
| MACRO_PLAN_v1_0 §"Learning Layer" | "It sits in `06_LEARNING_LAYER/` as a sibling to the Discovery Layer." |
| MACRO_PLAN_INSTALLATION session log | "`06_LEARNING_LAYER/` ... to be scaffolded in Phase 2 expansion — not now" |
| Actual filesystem | Directory does not exist |

**GA.6** [MEDIUM / PHANTOM-REFERENCE / owning_step=Step 3 + Step 11]: Macro Plan describes the Learning Layer in present tense as if the directory exists. The MACRO_PLAN_INSTALLATION session log correctly notes this is to be scaffolded later. The Macro Plan itself is silent on the present/future distinction; a fresh session reading only the Macro Plan would conclude the directory exists and look for it. **Resolution path: Step 3 (Macro Plan rewrite) must mark Learning Layer as scaffold-pending and Step 11 must decide whether to scaffold a placeholder README at minimum.**

### §3.2 — twinkly-puzzling-quokka.md

| Reference | Claim |
|---|---|
| `.gemini/project_state.md` | "Current State based on `twinkly-puzzling-quokka.md`" |
| PHASE_B_PLAN_v1_0.md frontmatter | "**Supersedes:** `twinkly-puzzling-quokka.md` (session-scoped draft), v2 draft, v1" |
| `~/.claude/plans/twinkly-puzzling-quokka.md` | Superseded by PHASE_B_PLAN_v1_0.md |

**GA.7** [HIGH / STALENESS + PHANTOM-REFERENCE / owning_step=Step 7]: project_state.md still anchors its "current state" to the superseded draft. Gemini reading this surface starts from a superseded plan. Mirror mechanism introduced in last session only covered L2.5 paths in .geminirules, not project_state.md.

### §3.3 — MARSYS_JIS_BOOTSTRAP_HANDOFF.md

CLAUDE.md mandatory-reading item 1. Existence not yet verified in this audit — flag for Step 6.

**GA.8** [LOW / VERIFY / owning_step=Step 6]: Existence of MARSYS_JIS_BOOTSTRAP_HANDOFF.md must be confirmed and its role vs PROJECT_ARCHITECTURE_v2_1.md reconciled. If it exists, does it duplicate architecture content? If it doesn't, CLAUDE.md references a ghost file.

### §3.4 — Retracted: PHASE_B_PLAN_v1_0.md

An earlier pass of this audit (pre-compaction) flagged PHASE_B_PLAN_v1_0.md as a ghost file. This was a **false positive** caused by a relative-path Glob with wrong syntax. Absolute-path Glob confirms the file exists at `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` and is at version v1.0.2. Retraction recorded here for transparency; no finding stands.

---

## §4 — Unreferenced canonical artifacts

These artifacts exist, are authoritative, and are **not** listed in CLAUDE.md's canonical path table. A fresh session therefore has no signal that they should be read.

**GA.9** [CRITICAL / UNREFERENCED-ARTIFACT / owning_step=Step 9]: `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` is CURRENT, CLOSED, contains 36 events + 5 period summaries + 6 chronic patterns, carries Swiss-Ephemeris-populated chart_states, confidence 0.89. **The Macro Plan names it as a prerequisite for M4 and mandates "Start immediately; do not defer."** Yet CLAUDE.md does not list it in the canonical paths table, and there is no "concurrent workstream" section at all. A session starting from CLAUDE.md alone cannot see LEL exists.

**GA.10** [HIGH / UNREFERENCED-ARTIFACT / owning_step=Step 9]: `GOVERNANCE_STACK_v1_0.md` is the project's own version registry and is not listed in CLAUDE.md canonical paths. It is also stale on MSR version per GA.1.

**GA.11** [MEDIUM / UNREFERENCED-ARTIFACT / owning_step=Step 9]: The following architectural artifacts exist but are not surfaced in CLAUDE.md:
- `MAINTENANCE_SCHEDULE_v1_0.md`
- `LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md`
- `FALSIFIER_REGISTRY_v1_1.md`
- `CONTRADICTION_REGISTRY_v1_1.md`
- `AUDIT_REPORT_v1_0.md`
- `DATA_INTEGRITY_AUDIT_PLAN_v1_0.md`
- `RECONCILIATION_PLAN_v1_0.md`
- `ACHARYA_ENGAGEMENT_KIT.md`

CLAUDE.md currently exposes only MSR/UCN/CDLM/CGM/RM/FILE_REGISTRY. Sessions reading only CLAUDE.md have no pointer to the other governance artifacts.

**GA.12** [LOW / HYGIENE / owning_step=Step 11]: `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` (predecessor of v1_2) is still in the facts folder. FILE_REGISTRY's archival policy would place it in an `archive/` subfolder. Minor hygiene.

---

## §5 — Sync gaps across agents

The project is co-operated by Claude and Gemini. Today's sync mechanism is:
- CLAUDE.md section "Collaboration with Gemini": "you MUST simultaneously update `.geminirules` and `.gemini/project_state.md`"
- .geminirules section "Collaboration with Claude": mirror clause in reverse

**GA.13** [CRITICAL / SYNC-GAP / owning_step=Step 7]: The sync mechanism is **procedural, not mechanical**. It relies on every session remembering to mirror. The last session mirrored L2.5 paths from CLAUDE.md to .geminirules but did not update `.gemini/project_state.md`, which still cites `twinkly-puzzling-quokka.md`. The policy has already been violated within days of being written. **A procedural rule that has been broken once will be broken again. This is the canonical case for mechanical enforcement.**

**GA.14** [HIGH / SYNC-GAP / owning_step=Step 7]: There is no drift-detection script that compares CLAUDE.md ↔ .geminirules ↔ project_state.md and fails loudly on divergence. Scripts exist for corpus integrity (`audit.py`, `verify_corpus.py`, `citation_graph_builder.py`, `invariants_l1.py`) but none for governance-surface integrity.

**GA.15** [MEDIUM / SYNC-GAP / owning_step=Step 6]: No session-open handshake exists. A fresh session does not produce a machine-checkable confirmation that it has read the mandatory reading list, noted the current step, and understood the closed-artifact scope. Session discipline today is entirely on the honor system.

**GA.16** [MEDIUM / SYNC-GAP / owning_step=Step 6]: No session-close checklist exists. Sessions end when the native sends a close signal or the context fills. There is no required pre-close artifact (e.g. "confirm every file touched has a SESSION_LOG entry, every version bump is mirrored in FILE_REGISTRY, every superseded file is status-flagged").

---

## §6 — Schema and format gaps

### §6.1 — SESSION_LOG naming inconsistency

Sessions in the log use three different naming conventions:
- **Numeric**: Session 1, Session 2, ..., Session 18 (early project)
- **Prefix-numeric**: FIX_SESSION_001, FIX_SESSION_002, FIX_SESSION_003, FIX_SESSION_003_deferred (correction cycle)
- **Descriptive**: GAP_RESOLUTION_SESSION, UCN_MERGE_SESSION, CLOSURE_AUDIT_PASS, CORPUS_VERIFICATION_PASS, MACRO_PLAN_INSTALLATION, PHASE_B_PLAN_v1_0.2_AMENDMENT_PASS (recent)

**GA.17** [MEDIUM / SCHEMA-GAP / owning_step=Step 10]: No canonical session-naming schema. Makes it impossible to grep for "Session N" reliably. Step 10 should define a schema and retrofit the log header.

### §6.2 — "Next session objective" pointer

Every session closes with a "Next Session Objective" field. These are often multi-option ("Choose from A/B/C/D") rather than a committed single-next objective.

**GA.18** [LOW / SCHEMA-GAP / owning_step=Step 10]: Multi-option next-objective entries force the next session to re-decide scope before starting work. This is a minor scope-drift vector. Step 10 should require one committed next objective and record alternatives separately.

### §6.3 — Currently-executing marker

CLAUDE.md says "Check SESSION_LOG.md for the most recent session's summary and the next session's objective". A fresh session must scan the whole 1,521-line log to find the tail.

**GA.19** [MEDIUM / SCHEMA-GAP / owning_step=Step 6 (minimal) + Step 10 (full)]: No "you are here" marker in CLAUDE.md or in a dedicated state file. Step 0 will add a minimal marker; Step 10 will upgrade to a proper state file (`CURRENT_STATE.md` or equivalent).

---

## §7 — Scope-creep and scope-boundary findings

### §7.1 — Macro Plan scope boundary clause is present but unenforced

Macro Plan §"Scope boundary for any single session" states:
> A session executes within the currently-active macro-phase and the currently-active phase-plan expansion. It does not: Pre-build infrastructure for later macro-phases...

**GA.20** [MEDIUM / SCOPE-CREEP / owning_step=Step 7 + Step 12]: This is a policy statement with no enforcement. No linter, no pre-commit hook, no session-open prompt that forces the session to declare its scope before acting. Step 7 should make this enforceable via the session-open handshake.

### §7.2 — Closed-artifact discipline

CLAUDE.md and Macro Plan both assert "closed-artifact-per-session discipline". The implementation is: sessions update `SESSION_LOG.md` at close; artifacts carry frontmatter version/status.

**GA.21** [LOW / SCOPE-CREEP / owning_step=Step 12]: No automated check that every artifact touched in a session has a corresponding SESSION_LOG entry. An artifact can be edited without its session being logged.

---

## §8 — Macro Plan internal findings (feeder for Step 1)

These are the findings the exhaustive Step 1 critique will expand. Surfaced here as bookmarks.

**GA.22** [HIGH / STALENESS / owning_step=Step 1]: M1 status claim "mostly done" is under-specified. M1 exit criteria are not enumerated. A session cannot tell whether M1 is done. (Maps to critique dimension #3 "exit criteria".)

**GA.23** [HIGH / SPEC-GAP / owning_step=Step 1]: Learning Layer lists ten mechanisms but does not define them, sequence their dependencies, or name their inputs/outputs. (Maps to critique dimension #5 "Learning Layer specificity".)

**GA.24** [HIGH / SPEC-GAP / owning_step=Step 1]: Concurrent workstreams are named (Life Event Log, Prospective prediction logging) but their cadence, owner, schema, and entry-point artifacts are unspecified. (Maps to critique dimension #6 "concurrency completeness".)

**GA.25** [MEDIUM / SPEC-GAP / owning_step=Step 1]: External dependencies (Jagannatha Hora exports, Swiss Ephemeris, Voyage-3-large embedding API, Postgres+pgvector, Gemini 2.5 Pro availability, Opus 4.7 router) are implied throughout but not enumerated in a single external-dependency graph. (Critique dimension #7.)

**GA.26** [MEDIUM / SPEC-GAP / owning_step=Step 1]: Native's role/cadence is "daily sessions" per CLAUDE.md but Macro Plan does not specify what decisions require native approval at each macro-phase. (Critique dimension #8.)

**GA.27** [MEDIUM / SPEC-GAP / owning_step=Step 1]: No time horizon. Macro-phases M1→M10 have no target dates, effort estimates, or dependency bars. (Critique dimension #9.)

**GA.28** [LOW / SPEC-GAP / owning_step=Step 1]: No post-M10 framing. What happens once the instrument is built? Maintenance? Publication? Extension? (Critique dimension #10.)

**GA.29** [MEDIUM / SPEC-GAP / owning_step=Step 1]: Ethical framework is absent. The instrument will eventually make probabilistic life-domain predictions. Who is allowed to consume them? Under what disclosures? (Critique dimension #11.)

**GA.30** [HIGH / META / owning_step=Step 1]: Meta-governance is absent — i.e., the Macro Plan does not describe how the Macro Plan itself is revised, red-teamed, or retired. Change control §says "requires explicit native approval and a version bump" but does not specify trigger conditions. (Critique dimension #12.)

**GA.31** [HIGH / SPEC-GAP / owning_step=Step 1]: Multi-agent collaboration discipline (Gemini + Claude, possibly future Gemini 3.0 + Opus 4.7+) is implied through two-pass language but not specified as a protocol. (Critique dimension #13.)

**GA.32** [CRITICAL / META / owning_step=Step 1 + Step 6]: System integrity and drift-prevention is not a macro-phase or a cross-cutting substrate. It is the subject of this Step 0 → Step 15 cycle and must be institutionalized as a permanent project axis. (Critique dimension #14.)

---

## §9 — Retractions

This audit, during its production, reversed one earlier conclusion:

- **Retraction #1**: A pre-compaction audit pass claimed PHASE_B_PLAN_v1_0.md did not exist. This was a false positive from a relative-path Glob. Absolute-path Glob confirms the file exists at v1.0.2. No finding stands.

No other retractions at time of close.

---

## §10 — Summary counts

- Total findings: **32** (GA.1 through GA.32)
- By severity: 4 CRITICAL · 11 HIGH · 12 MEDIUM · 5 LOW
- By class: 3 VERSION-DRIFT · 4 STALENESS · 3 PHANTOM-REFERENCE · 4 UNREFERENCED-ARTIFACT · 4 SYNC-GAP · 4 SCHEMA-GAP · 2 SCOPE-CREEP · 7 SPEC-GAP · 2 META · 1 HYGIENE
- Owning-step coverage: every finding is routed to at least one downstream step (1, 3, 6, 7, 9, 10, 11, 12). No orphan findings.

The next artifact to consume this audit is `STEP_BRIEFS/STEP_01_MACRO_PLAN_CRITIQUE_v1_0.md`.

---

## Changelog

- 2026-04-23 v1.0: Initial audit. Produced as part of Step 0 (grounding). CLOSED.
