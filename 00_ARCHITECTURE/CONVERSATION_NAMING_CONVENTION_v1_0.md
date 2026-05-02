---
artifact: CONVERSATION_NAMING_CONVENTION_v1_0.md
version: 1.5
status: LIVING
role: >
  Single source of truth for the conversation-naming convention used in Cowork
  sessions on this project. Specifies the format, the complete rebuild-era
  name ledger, the post-rebuild format, and the session-open rule that has
  every fresh Claude session propose the conversation name at the top of its
  first response so the native can rename the Cowork thread without having to
  remember the scheme.
produced_during: STEP_2_MACRO_PLAN_REVISION_SPEC (2026-04-23)
authoritative_side: Claude (Claude-only artifact; no Gemini-side counterpart required)
mirror_obligations: >
  None. This artifact is Claude-only. When Step 9 rebuilds CLAUDE.md, the
  session-open rule here is absorbed into CLAUDE.md's mandatory reading
  instruction and then mirror-discipline (ND.1) applies via CLAUDE.md ↔
  .geminirules, not via this file directly.
consumers:
  - every fresh Claude session on this project
  - Step 9 (CLAUDE.md rebuild) — will formalize the session-open rule inside CLAUDE.md
  - native (reference when renaming Cowork threads)
update_policy: >
  Amend inline when a step closes or the ledger advances; no version bump for
  name-status updates. Version bump to v1.1 if the format changes (e.g., a new
  axis is added for cohort-specific sessions). Supersedure is Step 15's option.
canonical_source_of_truth: >
  STEP_LEDGER_v1_0.md is authoritative for current-step state. This artifact is
  a DERIVED list that tracks the ledger. If the ledger moves, this file
  follows; if this file contradicts the ledger, the ledger wins.
date: 2026-04-23
---

# Conversation Naming Convention v1.0

## §1 — Format

Conversations in Cowork are named:

```
Madhav NN — [stage]
```

- **`Madhav`** — the project anchor (matches the workspace folder name).
- **`NN`** — zero-padded two-digit index keyed to the current stage in the project's own taxonomy (see §2 and §3 for which taxonomy is in force when).
- **`—`** — em-dash (not hyphen).
- **`[stage]`** — the short title of the current stage, drawn from the authoritative source (STEP_LEDGER or PHASE_B_PLAN or MACRO_PLAN depending on era).

**Separator note.** Cowork titles are plain text; the em-dash renders cleanly. If your client replaces em-dash with a hyphen, either form is acceptable — the name is a human label, not a parsed identifier.

## §2 — Rebuild-era names (Step 0 → Step 15)

The governance rebuild is the current workflow. Each step corresponds to one conversation. The full ledger:

| Conversation name | Step | Brief | Status |
|---|---|---|---|
| `Madhav 00 — Grounding` | Step 0 | STEP_00 brief | completed |
| `Madhav 01 — Macro Plan Critique` | Step 1 | STEP_01 brief | completed |
| `Madhav 02 — Macro Plan Revision Spec` | Step 2 | STEP_02 brief | **in_progress (current)** |
| `Madhav 03 — Macro Plan Rewrite (v2.0)` | Step 3 | STEP_03 brief | pending |
| `Madhav 04 — Macro Plan Red-team` | Step 4 | STEP_04 brief | pending |
| `Madhav 05 — Macro Plan Closure + Propagate` | Step 5 | STEP_05 brief | pending |
| `Madhav 05A — Project Architecture Refresh (v2.2)` | Step 5A | STEP_5A brief | pending |
| `Madhav 06 — Governance Integrity Protocol Design` | Step 6 | STEP_06 brief | pending |
| `Madhav 07 — Governance Integrity Implementation` | Step 7 | STEP_07 brief | pending |
| `Madhav 08 — Governance Integrity Red-team` | Step 8 | STEP_08 brief | pending |
| `Madhav 09 — CLAUDE.md Rebuild` | Step 9 | STEP_09 brief | pending |
| `Madhav 10 — SESSION_LOG Schema + CURRENT_STATE` | Step 10 | STEP_10 brief | pending |
| `Madhav 11 — Learning Layer Scaffold Decision` | Step 11 | STEP_11 brief | pending |
| `Madhav 12 — Ongoing Hygiene Policies` | Step 12 | STEP_12 brief | pending |
| `Madhav 13 — Drift-Detection Baseline Run` | Step 13 | STEP_13 brief | pending |
| `Madhav 14 — Schema-Validator Baseline Run` | Step 14 | STEP_14 brief | pending |
| `Madhav 15 — Governance Baseline Close` | Step 15 | STEP_15 brief | pending |

**Amendment / insertion rule.** When the native inserts a new step (precedent: Step 5A was inserted after Step 0 closed), a new row is added here in the same session that amends the ledger. The naming preserves the numeric sort order (Step 5A sorts between 5 and 6 as `05A`).

**Red-team, amendment, and continuation sessions.** If a single step needs more than one conversation (context compaction, native-issued amendment mid-step, or a red-team pass for a step that merits one), append a dotted-suffix:

- `Madhav 02.1 — Macro Plan Revision Spec (cont.)` — continuation after compaction
- `Madhav 02.RT — Macro Plan Revision Spec Red-team` — red-team pass (rare at this granularity, but reserve the form)
- `Madhav 02.AMD — ND.X Amendment` — native-directive amendment surfacing during Step 2

## §3 — Post-rebuild format (forward-looking)

After Step 15 closes, M2 corpus-activation resumes from `PHASE_B_PLAN_v1_0.md` B.0. The numeric index switches from step-based to phase-based. Proposed format for M2 era:

```
Madhav B0 — [sub-phase short title]
Madhav B1 — [sub-phase short title]
...
Madhav B10 — [sub-phase short title]
```

Where `BN` corresponds to the `B.N` phase in `PHASE_B_PLAN`. Example expected names (Step 3 via MP v2.0 may refine these):

| Expected conversation name | PHASE_B_PLAN phase |
|---|---|
| `Madhav B0 — Kickoff + Repo Scaffold` | B.0 |
| `Madhav B1 — Graph Schema + Ingest` | B.1 |
| `Madhav B2 — Vector Index Build` | B.2 |
| `Madhav B3 — CGM Rebuild (→ v9_0)` | B.3 |
| `Madhav B4 — Discovery Engine Skeleton` | B.4 |
| `Madhav B5 — Pattern/Resonance/Contradiction/Cluster Discovery` | B.5 |
| `Madhav B6 — Discovery Register Consolidation` | B.6 |
| `Madhav B7 — L2.5 Delta Processing` | B.7 |
| `Madhav B8 — Validator Suite (P1–P9)` | B.8 |
| `Madhav B9 — Red-team + Acharya-grade Review` | B.9 |
| `Madhav B10 — M2 Closure` | B.10 |

For M3 onward, the format is `Madhav M3-NN — [sub-phase]`, `Madhav M4-NN — [sub-phase]`, etc. The M3–M10 phase-plans are each written during the opening of that phase, so the sub-phase enumeration is unknown now and will be filled in as phases are scoped.

**Cross-cutting workstreams.** Two non-phase workstreams run in parallel — LEL (Life Event Log) and PPL (Prospective Prediction Log). Sessions dedicated primarily to one of these workstreams use:

- `Madhav LEL-NN — [short title]` for LEL-focused sessions (e.g., `Madhav LEL-03 — 2019 Career-pivot events elicited`)
- `Madhav PPL-NN — [short title]` for PPL-focused sessions

## §4 — Session-open rule

At the start of every fresh Claude session on this project, after reading CLAUDE.md mandatory reading and the STEP_LEDGER, **Claude proposes the conversation name at the top of its first substantive response**. Format:

```
Proposed conversation name: **Madhav NN — [stage]**
(Rename this Cowork thread via the UI to match.)
```

**Derivation.** Claude derives the name from the STEP_LEDGER's current row (the single row with status `in_progress` OR the next `ready` row if none is `in_progress`), using the format specified in §1. During the rebuild, Claude consults §2 table directly for the canonical short title.

**Edge cases:**

- **Continuation after compaction.** If the previous conversation was `Madhav NN — [stage]` and hit compaction or context-fill before the step closed, the fresh session proposes `Madhav NN.1 — [stage] (cont.)`.
- **Amendment session.** If the session is triggered by a native directive amendment (precedent: the ND.1 amendment after Step 1), the name is `Madhav NN.AMD — ND.X Amendment`.
- **Ambiguous ledger state** (multiple steps `in_progress`, or none `ready`). Claude halts per STEP_LEDGER §Cross-step invariants and proposes no name; the session does not proceed until the native resolves.

## §5 — Session-open prompt template (for the native)

Until Step 9 formally integrates this rule into CLAUDE.md, the native can ensure the name is proposed by including this one-line pre-prompt at the top of any fresh Claude session:

```
Before you start, read the STEP_LEDGER and propose this conversation's name per CONVERSATION_NAMING_CONVENTION_v1_0.md.
```

After Step 9 closes, this pre-prompt becomes unnecessary — the rebuilt CLAUDE.md names this convention in its mandatory-reading list and the session-open emission is automatic.

## §6 — Integration with Step 9 (CLAUDE.md rebuild)

The rebuilt CLAUDE.md (Step 9 deliverable) absorbs the §4 session-open rule via a new mandatory-reading item:

> Read `00_ARCHITECTURE/CONVERSATION_NAMING_CONVENTION_v1_0.md` and emit the proposed conversation name at the top of your first response per §4 of that file.

At that point, ND.1 Mirror Discipline applies via CLAUDE.md ↔ `.geminirules` and the Gemini-side mirror picks up a corresponding instruction. This file itself remains Claude-only (per the frontmatter `authoritative_side` and `mirror_obligations` declarations).

## §5.5 — COW series (Cowork Oversight conversations)

Cowork sessions that do **not** correspond to a specific Claude Code execution phase — strategic design, system setup, cross-cutting housekeeping, tooling decisions, or explicit oversight reviews — use the **COW** (Cowork Oversight) series:

```
Madhav COW-NN — [short topic title]
```

- **`COW`** — fixed prefix. Stands for "Cowork Oversight". These are Cowork-primary sessions: Cowork is both executor and recorder.
- **`NN`** — zero-padded two-digit sequence, starting at `01`, incrementing with each COW conversation regardless of other series.
- **`—`** — em-dash (same as §1).
- **`[short topic title]`** — 3–6 words naming the milestone the conversation closes.

**What belongs in the COW series:**
- Strategic planning and phase design sessions
- Tooling or workflow infrastructure setup (build trackers, brief templates, logging systems)
- Governance design sessions that are Cowork-led (not Claude Code-executed)
- Cross-cutting decisions not assignable to a single B.N or M.N phase
- Post-Claude-Code review and debrief sessions
- Any session where the primary output is a brief, a decision record, or a Cowork artifact rather than a codebase change

**What does NOT belong in the COW series:**
- Claude Code execution sessions — those are `Madhav NN —` or `Madhav BN —`
- LEL or PPL sessions — those use their own prefixes (§3)

**Ledger (authoritative source: `00_ARCHITECTURE/CONVERSATION_LOG.md`):**

| Conversation name | Date | Topics | Status |
|---|---|---|---|
| `Madhav COW-01 — Build Tracker + Claude Code Workflow + Conversation Structure` | 2026-04-24 | Cowork/Claude Code division, CLAUDECODE_BRIEF system, build tracker artifact, conversation structuring | closed |

### COW open/close ritual

**Conversation open:**
1. Read `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` §2 (you-are-here position).
2. Read the tail of `00_ARCHITECTURE/CONVERSATION_LOG.md` (last 2–3 entries) to recall recent context.
3. Propose the conversation name at the top of the first response: `**Proposed: Madhav COW-NN — [topic]**`
4. Declare the scope: 1–3 items forming a meaningful milestone. Confirm with the native before starting substantive work.

**Conversation close:**
1. Summarize what was accomplished (decisions made, artifacts created/edited, systems established).
2. Write the `CONVERSATION_LOG.md` entry for this conversation.
3. Propose the next conversation name and scope: `**Proposed next: Madhav COW-NN+1 — [topic]**`
4. If any Claude Code brief was produced, confirm it is saved and the build tracker artifact is updated.

---

## §8 — M2 Milestone series (Claude Code sessions, post-rebuild)

The `BN` format in §3 was designed before the milestone model was established. It is superseded by the `M2X` series for all Claude Code execution sessions. The `BN` rows in §3 are retained as a historical reference only — do not use them for new sessions.

### §8.1 — Format

Claude Code sessions (Opus planning + Sonnet execution) use:

```
Madhav M2X-Plan — [milestone title]   ← Opus planning session
Madhav M2X-Exec — [milestone title]   ← Sonnet execution session
```

- **`M2`** — macro-phase anchor. Changes to `M3`, `M4`, etc. at phase transitions.
- **`X`** — milestone letter: `A`, `B`, `C`, `D`, `E` for M2's five milestones.
- **`-Plan`** / **`-Exec`** — session type. Plan = Opus generates TODO list; Exec = Sonnet executes it.
- **`—`** — em-dash.
- **`[milestone title]`** — short human-readable title (3–5 words).

Continuations: `Madhav M2A-Exec.2 — Foundation Stack (cont.)`

### §8.2 — M2 milestone ledger

B.0 completed Madhav 17 (2026-04-24). Milestones below cover B.1 onward.

| Milestone | Conversation name | Type | Sub-phases | Est. sessions | Est. cost | Status |
|---|---|---|---|---|---|---|
| A | `Madhav M2A-Plan — Foundation Stack` | Opus planning | B.1–B.3.5 | 1 | $0 | **closed** |
| A | `Madhav M2A-Exec — Foundation Stack` | Sonnet execution | B.1–B.3.5 | 5 | ~$6 | **next** |
| B | `Madhav M2B-Plan — Knowledge Graph` | Opus planning | B.4 | 1 | $0 | pending |
| B | `Madhav M2B-Exec — Knowledge Graph` | Opus+Sonnet execution | B.4 | 2 | ~$20 | pending |
| C | `Madhav M2C-Plan — Discovery Engine` | Opus planning | B.5 | 1 | $0 | pending |
| C | `Madhav M2C-Exec — Discovery Engine` | Opus execution | B.5 | 3 | ~$55 | pending |
| D | `Madhav M2D-Plan — Query Interface` | Opus planning | B.6–B.8 | 1 | $0 | pending |
| D | `Madhav M2D-Exec — Query Interface` | Sonnet execution | B.6–B.8 | 3 | ~$12 | pending |
| E | `Madhav M2E-Plan — Validation + Handoff` | Opus planning | B.9–B.10 | 1 | $0 | pending |
| E | `Madhav M2E-Exec — Validation + Handoff` | Sonnet execution | B.9–B.10 | 3–4 | ~$15 | pending |

**Milestone grouping rationale:**
- **M2A (B.1–B.3.5):** Pure infrastructure — parse, chunk, embed, CGM. All deterministic. No
  runtime LLM calls until B.3.5 Gemini pass, which uses deterministic P1/P2/P5 validators for
  reconciliation. One contiguous block before any LLM pipeline work. Sonnet for execution.
- **M2B (B.4):** First milestone with meaningful LLM reasoning (Gemini→Claude SUPPORTS/
  CONTRADICTS edge proposals). Isolated to allow focused graph-quality review. Mixed model
  execution: Sonnet for infra, Opus checkpoint for reconciliation.
- **M2C (B.5):** Heart of the build. Full LLM discovery pipeline. Opus throughout execution
  (pattern/resonance/contradiction/cluster mining, two-pass, P6/P7/P8 validators). Highest cost.
- **M2D (B.6–B.8):** Full query stack — retrieval, routing, synthesis. Deterministic
  implementation code; runtime uses Opus (router, synthesis) but implementation is Sonnet.
- **M2E (B.9–B.10):** Eval harness, red-team, UI, deployment. Sonnet execution.

### §8.3 — Full conversation sequence (M2)

Every milestone follows the same four-conversation rhythm:

```
COW-NN  →  M2X-Plan  →  M2X-Exec  →  COW-NN+1
 (brief)    (Opus plan)  (execute)    (review + next brief)
```

Cowork writes the brief → Opus plans → Sonnet (or Opus, see §8.6) executes → Cowork reviews output and writes next brief.

**COW conversation opening ritual:** At the start of every COW session, Cowork immediately
proposes the milestone scope in a single line:

> "This session: **M2X — [Milestone Title]** covering [B.N–B.M]. Steps: [one-line summary]."

Confirm before any file work begins.

**Within Claude Code (Anti-Gravity IDE), every brief uses a 3-phase structure with model
checkpoints** (see §8.5). The model is not locked for the full session — checkpoints gate
model switches at natural phase boundaries. The user switches the model in Anti-Gravity IDE
and replies to continue.

### §8.4 — Model specification in briefs

Every `CLAUDECODE_BRIEF.md` Cowork produces includes a `§model_deployment` section. This
section is authoritative — Claude Code reads it and uses these models exactly as specified.

```yaml
## §model_deployment

planning_model:   claude-opus-4-7      # Opus 4.7 — Anti-Gravity: "Default (recommended)"
execution_model:  claude-sonnet-4-6    # Sonnet 4.6 — Anti-Gravity: "Sonnet"
  # For long-running execution sessions (B.5): consider "Sonnet (1M context)" — $3/$15 per Mtok.
  # M2B and M2C override execution_model — see §8.6 per-milestone matrix.

# runtime_pipeline_calls: only present for milestones with LLM pipeline work (M2B–M2E)
runtime_pipeline_calls:
  pass_1_connector:          claude-opus-4-7              # pattern/resonance/cluster/CGM discovery
  pass_2_p1_p2_p3_p4_p5_p9: claude-sonnet-4-6            # rule-based validation (~700 calls)
  pass_2_p6_p7_p8:           claude-opus-4-7              # judgment-heavy validation
  contradiction_both_passes: claude-opus-4-7              # steelman reasoning, no downgrade
  router_runtime:            claude-opus-4-7              # CQ6 native override, no downgrade
  synthesis:                 claude-opus-4-7              # acharya-grade output face
  mechanical_io:             claude-haiku-4-5-20251001    # ledger writes, metrics, file I/O
```

**M2A** — no `runtime_pipeline_calls` block (pure infra; no pipeline LLM calls).
**M2B–M2E** — include the full block; Cowork prunes entries not in scope.

**Rationale:**
- Opus for planning: sequencing and dependency judgment cannot be delegated down.
- Sonnet for deterministic execution: production code following a well-specified TODO.
- Opus for pass-1 connector: divergent discovery requires breadth and Jyotish depth.
- Sonnet for pass-2 P1–P5/P9: rule-based — deterministic, Sonnet sufficient, saves ~$58 vs Opus.
- Opus for P6/P7/P8 + contradictions: UCN authority judgment and steelman reasoning require Opus.
- Haiku for mechanical I/O: spec fully determines output, zero judgment needed.

### §8.5 — Checkpoint protocol (model-switching gates)

Claude Code Extension in Google Anti-Gravity IDE does not auto-switch models. Instead,
every brief embeds explicit **CHECKPOINT** blocks at model-boundary points. Claude Code
pauses, instructs the user to switch the model, and waits for confirmation before continuing.

**The three-tier workflow uses two separate Claude Code sessions per milestone:**
planning (M2X-Plan) and execution (M2X-Exec). Each session has its own brief and its own
checkpoint structure. Both sessions start on any model, run a lightweight §ORIENT, then
immediately gate on CHECKPOINT 1 before any real work begins.

---

#### §8.5.1 — Planning brief (M2X-Plan) — applies to ALL milestones

Every planning brief uses exactly **1 checkpoint**: the Opus gate.

```
[Session opens — any model; lightweight §ORIENT only]

§ORIENT
  Read brief in full. Verify all pre-conditions listed in the brief.
  Report status. Do NOT proceed if any pre-condition fails.

══════════════════════════════════════════════════════════
CHECKPOINT 1 — SWITCH TO OPUS
Model needed: claude-opus-4-7  (Anti-Gravity: "Default (recommended) — Opus 4.7")
Action: Switch model in Google Anti-Gravity IDE, then reply: "Opus ready."
Claude Code will not proceed until it receives this exact reply.
══════════════════════════════════════════════════════════

§PLANNING  (Opus)
  Read PHASE_B_PLAN sub-phases in scope.
  Produce M2X_EXEC_PLAN_v1_0.md — full sequenced task plan.
  All planning work runs on Opus. No further model switch.

§CLOSE  (Opus)
  Governance scripts. CURRENT_STATE update. Mirror updates.
  SESSION_LOG append. Set CLAUDECODE_BRIEF.md status: COMPLETE.
```

---

#### §8.5.2 — Execution brief (M2X-Exec) — structure varies by milestone

Every execution brief opens identically (any model → §ORIENT → CHECKPOINT 1).
The model at CHECKPOINT 1 and any subsequent checkpoints vary by milestone.

**Infra milestones — M2A, M2D, M2E (Sonnet execution):**

```
[Session opens — any model; lightweight §ORIENT only]

§ORIENT
  Read brief. Detect current session from CURRENT_STATE last_session_id.
  Verify pre-conditions for this session. Report. Stop if any fail.

══════════════════════════════════════════════════════════
CHECKPOINT 1 — SWITCH TO SONNET
Model needed: claude-sonnet-4-6  (Anti-Gravity: "Sonnet")
Action: Switch model in Google Anti-Gravity IDE, then reply: "Sonnet ready."
Claude Code will not proceed until it receives this exact reply.
══════════════════════════════════════════════════════════

§EXECUTION  (Sonnet)
  Execute per M2X_EXEC_PLAN_v1_0.md — all tasks for this session.
  Observe every stop condition in the plan.

§CLOSE  (Sonnet)
  Governance scripts. CURRENT_STATE update. Mirror updates.
  SESSION_LOG append. Set CLAUDECODE_BRIEF.md status: COMPLETE (final session only).
```

Additional intra-session checkpoints for specific sessions (e.g., the Gemini human-copy-paste
step in M2A-Exec.5) are documented as CHECKPOINT 2+ in the relevant brief — they are
content/workflow gates, not model switches.

**Mixed-model milestone — M2B (Sonnet infra → Opus reconciliation):**

```
[Session opens — any model; §ORIENT]

══════════════════════════════════════════════════════════
CHECKPOINT 1 — SWITCH TO SONNET
Action: Switch to Sonnet, then reply: "Sonnet ready."
══════════════════════════════════════════════════════════

§EXECUTION  (Sonnet — deterministic B.4 infra tasks)

══════════════════════════════════════════════════════════
CHECKPOINT 2 — SWITCH TO OPUS (reconciliation phase)
Model needed: claude-opus-4-7
Action: Switch model, then reply: "Opus ready for reconciliation."
══════════════════════════════════════════════════════════

§RECONCILIATION  (Opus — B.4 Gemini edge reconciliation)

§CLOSE  (Sonnet — switch back for deterministic close tasks)
```

**Full-LLM milestone — M2C (Opus throughout):**

```
[Session opens — any model; §ORIENT]

══════════════════════════════════════════════════════════
CHECKPOINT 1 — SWITCH TO OPUS
Action: Switch to Opus, then reply: "Opus ready."
══════════════════════════════════════════════════════════

§EXECUTION  (Opus — Discovery Engine is full LLM; no further model switch)
§CLOSE  (Opus)
```

---

**Rules for all checkpoints (universal):**
1. Claude Code never proceeds past a checkpoint without an explicit user reply.
2. The confirmation reply must match the exact phrase shown ("Opus ready." / "Sonnet ready." etc.).
3. If §ORIENT reveals a failed pre-condition, Claude Code reports and stops — it does NOT
   show the checkpoint or ask for a model switch.
4. CHECKPOINT 1 fires immediately after §ORIENT in every brief, planning or execution. No
   substantive work (no file reads beyond pre-condition checks, no code, no plan writing)
   happens before CHECKPOINT 1 clears.
5. The checkpoint phrases are fixed strings so the user can easily scan for them in the IDE.

---

### §8.6 — Model assignment matrix per milestone

| Milestone | Sub-phases | Plan brief | Exec brief | Plan CPs | Exec CPs | Notes |
|---|---|---|---|---|---|---|
| M2A | B.1–B.3.5 | Opus | Sonnet | 1 (Opus gate) | 1/session (Sonnet gate) + 1 content gate (M2A-Exec.5 Gemini step) | Pure infra |
| M2B | B.4 | Opus | Sonnet → Opus | 1 (Opus gate) | 2 (Sonnet gate → Opus reconciliation gate) | B.4 reconciliation needs Opus judgment |
| M2C | B.5 | Opus | Opus (no switch) | 1 (Opus gate) | 1 (Opus gate, stays throughout) | Full LLM pipeline |
| M2D | B.6–B.8 | Opus | Sonnet | 1 (Opus gate) | 1/session (Sonnet gate) | Deterministic implementation |
| M2E | B.9–B.10 | Opus | Sonnet | 1 (Opus gate) | 1/session (Sonnet gate) | Eval + UI |

**Universal rule (v1.4):** Every brief — planning OR execution — starts on any model, runs
§ORIENT, then fires CHECKPOINT 1 immediately. No planning work begins before "Opus ready."
No execution work begins before "Sonnet ready." (or "Opus ready." for M2C execution).

**Cowork's role in this session (COW-NN) is always Sonnet** — brief-writing, milestone
gating, and plan review are structured spec work that does not require Opus reasoning.
Model depth is deployed inside Claude Code where it has maximum leverage.

---

## §9 — COW series ledger (running)

| Conversation name | Date | Topics | Status |
|---|---|---|---|
| `Madhav COW-01 — Build Tracker + Claude Code Workflow + Conversation Structure` | 2026-04-24 | Cowork/Claude Code division, CLAUDECODE_BRIEF system, build tracker, conversation structuring | closed |
| `Madhav COW-02 — M2 Workflow + Milestone Architecture` | 2026-04-25 | Three-tier workflow (Cowork→Opus→Sonnet), 5-milestone breakdown (A–E), model deployment strategy, naming convention v1.2 | closed |
| `Madhav COW-03 — M2A Brief + Workflow Governance` | 2026-04-25 | Madhav 16+17 review, M2A-Plan brief, course-correction to milestone architecture, checkpoint protocol, model assignment matrix, executor correction (Google Anti-Gravity IDE), naming convention v1.3, M2A-Plan review (8 AC pass), M2A-Exec brief (CLAUDECODE_BRIEF v5.0) | closed |

---

## §10 — MARSYS session naming (M3 onward, Cowork sessions)

Adopted 2026-05-02. Supersedes the ad-hoc `M3-WN-CN-DESCRIPTOR` format used during M3-A.

### §10.1 — Format

All Cowork sessions from M3 onward (including COW oversight sessions that are phase-specific) use:

```
MARSYS-{Mx}-R{round#}-S{session#}-{DESCRIPTOR}
```

- **`MARSYS`** — project anchor prefix. Fixed for all sessions on this project. Distinguishes MARSYS-JIS Cowork prompts from other projects in the same Anti-Gravity IDE.
- **`{Mx}`** — macro-phase: `M3`, `M4`, `M5` … `M10`.
- **`R{round#}`** — round number within the macro-phase, zero-padded to 1 digit (`R1`, `R2`, `R3`). A **round** is a parallel cluster of sessions that share no write targets; sessions within a round can run simultaneously.
- **`S{session#}`** — session number within the round, zero-padded to 1 digit (`S1`, `S2`, `S3`).
- **`{DESCRIPTOR}`** — 2–4 word screaming-snake-case label naming the primary deliverable (e.g., `M3A-CLOSE`, `LEL-V13`, `JH-EXPORT`, `ACHARYA-READINGS`).

**Examples:**

| Session ID | Meaning |
|---|---|
| `MARSYS-M3-R1-S1-M3A-CLOSE` | M3, Round 1, Session 1 — M3-A formal close |
| `MARSYS-M3-R1-S2-M3B-CLOSE` | M3, Round 1, Session 2 — M3-B formal close (parallel with S1) |
| `MARSYS-M3-R1-S3-LEL-V13` | M3, Round 1, Session 3 — LEL v1.3 event elicitation (parallel with S1+S2) |
| `MARSYS-M3-R2-S1-TEMPORAL-VALIDATOR` | M3, Round 2, Session 1 — Temporal validator harness |
| `MARSYS-M3-R3-S1-M3-CLOSE` | M3, Round 3, Session 1 — M3 macro-phase close (sequential) |
| `MARSYS-M4-R1-S1-PHASE-PLAN` | M4, Round 1, Session 1 — M4 phase plan authoring |

### §10.2 — Round semantics

A **round** groups sessions that are safe to run in parallel — no shared write targets, no database state conflicts. Round boundaries enforce the dependency chain:

- All sessions in round N must complete before any session in round N+1 opens.
- Sessions within the same round may run simultaneously in separate Cowork windows / Anti-Gravity tabs.
- Sequential sessions (no safe parallelism, or explicitly gated) are placed alone in their own round (`R{N}` containing a single `S1`).

### §10.3 — CLAUDECODE_BRIEF first line

Every CLAUDECODE_BRIEF produced for this project opens with the session ID on its own line:

```
# MARSYS-{Mx}-R{round#}-S{session#}-{DESCRIPTOR}
```

This allows the native to identify the brief at a glance and avoids project confusion when multiple briefs are open in the IDE.

### §10.4 — Cowork thread naming

The Cowork thread (conversation title) is set to the bare session ID:

```
MARSYS-M3-R1-S1-M3A-CLOSE
```

No `Madhav NN —` prefix for these sessions. The `MARSYS` prefix is the project anchor.

### §10.5 — Cross-cutting workstream sessions

LEL and PPL sessions that fall within a round use the same format:

- `MARSYS-M3-R1-S3-LEL-V13` (LEL v1.3 update — part of M3-R1)
- `MARSYS-PPL-R1-S1-SCAFFOLD` (PPL sessions not bound to a specific macro-phase use `PPL` in the Mx slot)

### §10.6 — Backward compatibility

Sessions before M3 (Steps 0–15, COW-01–03, M2A–E) retain their original naming. The MARSYS prefix applies from M3-R1-S1 onward. `CURRENT_STATE_v1_0.md`, `SESSION_LOG.md`, and `CAPABILITY_MANIFEST.json` reflect the old naming for historical entries and new naming for sessions from 2026-05-02 onward.

### §10.7 — Round/session map (M3 authoritative; M4+ indicative)

The full round/session breakdown per macro-phase is maintained as the **MARSYS-JIS Phase → Round → Session Map** (HTML artifact, Cowork session 2026-05-02). Reference the artifact for the complete breakdown and CLAUDECODE_BRIEF prompts. The map is updated at each macro-phase plan session (`MARSYS-M{x}-R1-S1-PHASE-PLAN`).

---

## §7 — Update log

- **2026-04-23 v1.0** — Initial. Produced during STEP_2_MACRO_PLAN_REVISION_SPEC. Rebuild-era names enumerated; post-rebuild format projected; session-open rule + pre-prompt template specified.
- **2026-04-24 v1.1** — Added §5.5 COW series (Cowork Oversight conversations). Establishes `Madhav COW-NN` format, COW ledger pointer to CONVERSATION_LOG.md, and open/close ritual. First entry: COW-01 (this conversation). Produced during Madhav COW-01.
- **2026-04-25 v1.2** — Added §8 M2 Milestone series. Supersedes §3 `BN` format for Claude Code sessions. Establishes `M2X-Plan` / `M2X-Exec` naming, full M2 milestone ledger (A–E), four-conversation rhythm per milestone, and `§model_deployment` brief section spec with model rationale. Added §9 COW ledger (moved from §5.5 inline). Produced during Madhav COW-02.
- **2026-04-25 v1.4** — Produced during Madhav COW-03. Rewrote §8.5 checkpoint protocol to reflect the separated planning+execution session design. Added §8.5.1 (planning brief — universal 1-checkpoint Opus gate) and §8.5.2 (execution brief — varies by milestone). Universal rule: every brief, planning OR execution, starts on any model, runs §ORIENT, then fires CHECKPOINT 1 before any substantive work. No planning work before "Opus ready."; no execution work before the appropriate confirmation phrase. Updated §8.6 model matrix to show separate Plan/Exec checkpoint counts per milestone. Old combined-session §8.5 design (CP1=Opus, CP2=Sonnet in one session) is superseded.
- **2026-04-25 v1.3** — Produced during Madhav COW-03. (1) Revised milestone groupings: M2A=B.1–B.3.5, M2B=B.4, M2C=B.5, M2D=B.6–B.8, M2E=B.9–B.10 — with rationale table. B.0 marked complete. (2) Added §8.5 checkpoint protocol: 2-checkpoint standard (infra), 3-checkpoint extended (M2B), 1-checkpoint single-model (M2C). Gates model switches in Google Anti-Gravity IDE via explicit user confirmation. (3) Added §8.6 model assignment matrix per milestone. (4) Updated executor reference to Google Anti-Gravity IDE (correcting prior "VS Code" error). (5) Updated §8.3 COW opening ritual: one-line scope proposal at session open. (6) Updated §8.4 model strings to reflect latest known versions (verify in Anti-Gravity). (7) Closed COW-02 in ledger; added COW-03.
- **2026-05-02 v1.5** — Added §10 MARSYS session naming standard. New format `MARSYS-{Mx}-R{round#}-S{session#}-{DESCRIPTOR}` replaces ad-hoc M3-WN-CN naming used in early M3-A sessions. Applies from M3-R1-S1 onward. Sections: §10.1 format + examples, §10.2 round semantics (parallel-cluster definition), §10.3 CLAUDECODE_BRIEF first-line rule, §10.4 Cowork thread naming, §10.5 cross-cutting workstream sessions, §10.6 backward compatibility, §10.7 round/session map reference. Produced during M3-W1-A4-DIS009-DISPOSITION Cowork session (2026-05-02).

---

*End of CONVERSATION_NAMING_CONVENTION_v1_0.md v1.5.*
