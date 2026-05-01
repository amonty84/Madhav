---
step: 1
title: Exhaustive critique of MACRO_PLAN_v1_0 across 14 dimensions
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 2 (revision spec)
---

# STEP 1 — Exhaustive Macro Plan Critique

## 1. Objective

Produce a single deliverable, `MACRO_PLAN_CRITIQUE_v1_0.md`, that forensically evaluates `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` across fourteen dimensions. The critique is **exhaustive, not triaged** — every dimension receives a full pass; no "skip for brevity" is acceptable. The output is the evidence base Step 2 uses to write the revision spec.

## 2. Inputs

**MUST read (in order):**

1. `/Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md`
2. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/STEP_LEDGER_v1_0.md`
3. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/STEP_BRIEFS/README.md`
4. This brief
5. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` — findings GA.4, GA.5, GA.6, GA.22–GA.32 are the seed catalog for this critique
6. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/MACRO_PLAN_v1_0.md` — subject of the critique
7. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` — upstream blueprint; critique must test Macro Plan alignment with it
8. `/Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` (v1.0.2) — downstream detail; critique must test Macro Plan → Phase Plan handoff

**MAY read (if a specific dimension calls for it):**

- `00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md`
- `00_ARCHITECTURE/MAINTENANCE_SCHEDULE_v1_0.md`
- `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_1.md`
- `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_1.md`
- `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md`
- `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md`
- `00_ARCHITECTURE/SESSION_LOG.md` (tail, for current-state verification)
- `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` (frontmatter only — Macro Plan M4 dependency)

**FORBIDDEN (out of scope):**

- Any file in `025_HOLISTIC_SYNTHESIS/` (MSR, UCN, CDLM, RM, CGM) — the critique is about the plan, not the corpus
- Any file in `03_DOMAIN_REPORTS/`
- Any file in `04_REMEDIAL/` or `05_TEMPORAL/`
- Any source code under `platform/`

## 3. Deliverable

**File path:** `00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md`

**Required frontmatter:**

```yaml
---
artifact: MACRO_PLAN_CRITIQUE_v1_0.md
version: 1.0
status: CLOSED
session: STEP_1_MACRO_PLAN_CRITIQUE
date: 2026-04-23 or later
scope: Exhaustive critique of MACRO_PLAN_v1_0.md across 14 dimensions.
subject_file: 00_ARCHITECTURE/MACRO_PLAN_v1_0.md
subject_version: v1.0 (dated 2026-04-23)
consumers:
  - Step 2 (revision spec)
  - Step 3 (rewrite)
  - Step 4 (red-team)
---
```

**Required structure — exactly 14 numbered sections, one per dimension. Each section contains four blocks:**

- **§N.1 Findings** — bullet-point list of defects, gaps, contradictions, or ambiguities in the Macro Plan on this dimension. Every finding carries a stable ID (`MPC.N.M` where N is the dimension and M is the finding number within it).
- **§N.2 Evidence** — direct quotes or line references from the Macro Plan that support each finding. No finding without evidence.
- **§N.3 Severity** — each finding tagged CRITICAL / HIGH / MEDIUM / LOW with one-sentence rationale.
- **§N.4 Proposed fix direction** — one paragraph per finding, naming the fix direction without writing the fix itself (that is Step 2's job).

**The 14 dimensions (all mandatory, in this order):**

1. **Phase completeness** — are M1 through M10 each defined with clear scope, entry state, and exit state? (Seed finding: GA.22.)
2. **Sequencing and dependencies** — does each phase's input depend only on predecessors' outputs? Any latent forward dependencies?
3. **Exit criteria** — is each phase closable? What mechanically signals "M_N is complete"? (Seed: GA.22.)
4. **Risk surface** — what can go wrong at each phase and the Learning Layer? Are mitigations specified?
5. **Learning Layer specificity** — the ten mechanisms are named but not defined. Are their inputs, outputs, activation phase, and kill-switch specified? (Seed: GA.23.)
6. **Concurrency completeness** — the Life Event Log and prospective prediction logging run in parallel. Are their cadence, owner, schema, and entry-point artifacts specified? (Seed: GA.24.)
7. **External dependency graph** — Jagannatha Hora, Swiss Ephemeris, Voyage-3-large, Postgres+pgvector, Gemini availability, Opus availability, classical text corpora (M8), acharya reviewers (M10). Enumerated? Failure modes considered? (Seed: GA.25.)
8. **Role-of-native cadence** — what decisions require native approval at each phase? What is deferrable? What is mechanical? (Seed: GA.26.)
9. **Time horizon vs phase indexing** — Macro Plan indexes by phase, not time. Are effort estimates, target dates, or dependency bars provided? Should they be? (Seed: GA.27.)
10. **Post-M10 framing** — what is the project's steady state after M10? Maintenance, publication, extension, retirement? (Seed: GA.28.)
11. **Ethical framework** — the instrument makes probabilistic life-domain predictions. Who may consume them, under what disclosures, with what guardrails for self-harm-adjacent outputs? (Seed: GA.29.)
12. **Meta-governance** — how is the Macro Plan itself revised, red-teamed, or retired? Who can approve a version bump and under what trigger conditions? (Seed: GA.30.)
13. **Multi-agent collaboration discipline** — Claude + Gemini today, possibly more agents later. Is the protocol specified for each pass? Is there a protocol for *disagreement* between agents? (Seed: GA.31.)
14. **System integrity and drift-prevention** — should the Macro Plan name drift-prevention as a first-class project axis (not a macro-phase, a substrate like the Learning Layer)? (Seed: GA.32.)

**Close with a §15 Summary Table** — 14 rows (one per dimension), four columns (dimension, finding count, highest severity, proposed revision approach).

## 4. Constraints

- Do NOT rewrite the Macro Plan in this step. The deliverable is a critique only.
- Do NOT edit `MACRO_PLAN_v1_0.md`. It remains at v1.0 and CURRENT until Step 5 closes it.
- Do NOT propose a revised version number. Step 2 decides whether the revision is v1.1 (additive) or v2.0 (architectural).
- Do NOT collapse dimensions. Every one of the 14 gets a full pass, even if the finding in that dimension is "no defects — here is why".
- Do NOT add a 15th dimension. If a finding doesn't fit the 14, flag it in a §16 "Out-of-Schema Findings" appendix instead.

## 5. Discipline rules

- **Closed artifact**: the critique is produced in one session and closed. No "to be continued".
- **Exhaustive, not triaged**: the native has explicitly requested exhaustive mode. Findings that seem minor are still documented.
- **Layer separation**: the critique is L-meta (about governance), not L1/L2+. Do not cite astrological facts.
- **Evidence discipline**: every finding quotes or line-references the Macro Plan. Findings without evidence are rejected.
- **Stable IDs**: `MPC.N.M` for every finding. Never renumber after publication.

## 6. Close criteria

This step is marked completed in the ledger when all of these are true:

- [ ] `MACRO_PLAN_CRITIQUE_v1_0.md` exists at the specified path
- [ ] Frontmatter matches the template in §3
- [ ] Exactly 14 numbered sections + §15 Summary Table (+ optional §16 appendix) are present
- [ ] Every dimension has ≥1 finding OR an explicit "no defects" entry with rationale
- [ ] Every finding has a stable `MPC.N.M` ID, severity tag, and evidence pointer
- [ ] STEP_LEDGER updated with status=completed and deliverable path
- [ ] SESSION_LOG appended with Step 1 entry

## 7. Handoff

- **Next step:** Step 2 (Revision Spec)
- **File the next step will read:** the new `MACRO_PLAN_CRITIQUE_v1_0.md`
- **State transferred via ledger only:** confirmation that critique is CLOSED; summary counts (CRITICAL / HIGH / MEDIUM / LOW); pointer to §15 Summary Table
- **Do not pre-write Step 2.** If the critique reveals something unexpected that changes the revision approach, Step 2's fresh conversation decides, not this one.

## 8. Red-team prompts (for later verification)

Step 4 (red-team on the revised plan) and Step 15 (governance baseline) can stress-test this step's output with:

- "For each of the 14 dimensions, could an independent reviewer add a finding the critique missed? Run a fresh pass on any three randomly chosen dimensions."
- "For each CRITICAL/HIGH finding, does the proposed fix direction name *a specific revision to the Macro Plan text* or merely describe a gap?"
- "Are any findings actually artifacts of GROUNDING_AUDIT_v1_0 being wrong rather than Macro Plan being wrong? Trace every finding back to either Macro Plan line or Grounding Audit finding."
