---
artifact: elaborate_v0_2.md
purpose: >
  Planning prompt for v0.2 of the Build Tracker portal. v0.1 (planned + implemented
  2026-04-26 across PORTAL_BUILD_TRACKER_PLAN_v0_1 + IMPL_v0_1/v0_2/v0_3) shipped
  the architecture but the content density is well below what the native asked for
  in the original elaborate.md. The native is "not very impressed." This prompt
  briefs the planning session for a substantive v0.2 redesign that closes specific
  data bugs, adds visual depth, and turns the portal from a status page into a
  research-instrument cockpit.
authored_by: Cowork (Claude Opus 4.7) on 2026-04-26
authored_during: Cowork conversation post-IMPL_v0_3, after native review of live portal
target_executor_for_planning: Claude Code, Opus 4.6
target_executor_for_implementation: Claude Code, Sonnet 4.6
session_class: planning_only — produces plan artifact, then HALTS; does NOT implement
halt_after_plan: true
governing_clause: CLAUDE.md §I principles apply; this file does not override CLAUDE.md §C item 0
predecessor_planning_artifact: 00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md (status IMPLEMENTED, all 28 ACs PASS but content density underdelivered)
predecessor_elaborate: elaborate.md (kept for audit; do NOT re-execute it)
---

# elaborate_v0_2.md — Build Tracker v0.2 Planning Prompt

## §0 — How to use this file

You are Claude Code Opus 4.6. The native has just told you to read this file and follow its instructions. Your job is to **produce a detailed v0.2 implementation plan**, not to implement.

Read the entire file before doing anything else. After reading:

1. Read the standard mandatory items per CLAUDE.md §C.
2. Read `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md` (status IMPLEMENTED) to understand what was built. Read `elaborate.md` (the v0.1 prompt) to understand the original ambition.
3. Read the current portal source under `platform/src/app/build/**` and `platform/src/components/build/**` and `platform/src/lib/build/**`. Pay special attention to `app/build/page.tsx` (cockpit), `app/build/plan/page.tsx` (the plan view the native is unhappy with), `app/build/plan/[phase_id]/page.tsx` (drill-down), and `components/build/PlanTree.tsx`.
4. Read `platform/scripts/governance/serialize_build_state.py` v0.2.0 — particularly the PHASE_B_PLAN reader that produces the broken `phase_plan.sub_phases` array. Also the live `build-state.json` at `https://storage.googleapis.com/marsys-jis-build-state/build-state.json` to confirm the bug shape.
5. Read `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` to understand what the canonical sub-phases B.0–B.10 actually are and how they're structured in the file. The bug below says the parser is conflating document-structure headers with sub-phase definition headers.
6. Produce the plan as `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_2.md` with frontmatter `status: DRAFT_PENDING_NATIVE_REVIEW`.
7. **HALT.** Same protocol as v0.1: do not run governance scripts, do not append to SESSION_LOG, do not rotate CURRENT_STATE, do not modify CLAUDECODE_BRIEF.md, do not touch portal source. Emit a final halt message naming the plan path and instructing the native to switch to Sonnet 4.6 for implementation.

## §1 — What's changed since v0.1, and why we're back

v0.1 closed with all 28 ACs PASS. Architecturally it is sound: RSC, GCS shards (top-level + per-session + per-phase), role-gated, refresh-button reads canonical state. Everything works.

The native ran it, said "I'm not very impressed," and named two specific complaints plus a structural critique that emerged from inspection.

**Native complaint A — sub-phase sequencing is broken.** On `/build/plan` the M2 sub-phases render in the wrong order (B.1 first, B.0 in the middle, B.3.5 grouped wrong) and with the wrong titles ("Restatement", "Assumptions challenged", "Locked Clarifications"). Diagnosis: the serializer's PHASE_B_PLAN reader is greedily matching `## §B.N` headers anywhere in the file, not specifically the sub-phase definition headers. The result is that the document's own §1 / §2 / §3 internal structure ("§B.1 — Restatement" etc.) is being treated as sub-phases. The actual sub-phases (B.0 Discovery Layer Scaffold, B.1 Corpus Ingestion, etc.) appear later in the file and get sorted to the bottom by file position. **This is a serializer bug, not a portal-render bug** — the JSON itself is wrong. Fix in `platform/scripts/governance/serialize_build_state.py` and re-emit shards.

**Native complaint B — only M2 expands; M1 doesn't.** The plan tree (`components/build/PlanTree.tsx`) hardcodes "expand only the active macro phase." M1 Corpus Completeness has 8 milestones (per the old artifact's `M1_PHASES` data) that are completely invisible. The native wants every macro-phase to be expandable / collapsible so the full project arc is navigable. M3–M10 should also have their planned milestones visible, even if status-only.

**Native complaint C — visual / UX is too plain.** "Use graphs, colours, modern UI/UX things to make it look better." Translation: the v0.1 aesthetic is mostly white cards, neutral text, two amber accents, a few SVG bars. For a research-instrument cockpit this reads as utility, not authority. The native wants visual density, color-coding by class/severity/status, real charts (not just sparklines), and a "wow when I open it" feel.

**Cowork-side critique (recorded for the planning session).** Beyond the native's named items, Cowork inspection of v0.1 surfaced a deeper set of gaps. These are the depth issues. The planning session should treat them as first-class scope:

- **Plan view is a clickable index, not a plan view.** "Sub-phases at a glance" lists `phase_id | title | status` with nothing else. The data layer has `session_count_actual`, `session_count_estimated`, `ac_total`, `ac_passed`, `deliverables_complete`, `deliverables_pending` per sub-phase — none rendered.
- **Corpus state is invisible.** rag_chunks=993, rag_graph_nodes=1735, rag_graph_edges=3814, MSR=499 signals, CGM=234 nodes + 22 reconciled edges, 9 CURRENT L3 reports — none of these numbers appear anywhere on the cockpit. For a "build tracker," not showing what's been built is the foundational miss.
- **Off-plan / aside visibility was promised, not delivered.** elaborate.md §1 named "what other non beyond the plan" as a top requirement. The session_class enum was added in IMPL_v0_1 (G.4 closure) but the plan view doesn't expose it. There's no "off-plan time spent: 4 sessions on build-tracker infrastructure" summary, no comparison of on-plan vs off-plan velocity, no per-phase breakdown of the asides that interrupted it.
- **Intervention surface is structurally ready but factually empty.** The page exists. It shows `1 RT pass, 0 open NDs, 1 addressed (ND.1), 0 DRs`. But this project has had multiple interventions never logged: P2_VIOLATION caught mid-Exec_5, native override of AC.2 hard-stop in GCS_PERMISSIONS_FIX, brief-supersession events, the 22-vs-21 edge-count correction, FILE_REGISTRY-version mismatch resolved during IMPL_v0_1. None visible because G.2/G.3 fields are optional and no past session has retroactively populated them.
- **Sparklines are too small.** 240×48 px each, three of them, on a page that's otherwise mostly whitespace. Trends should dominate health, not sit in a row.
- **No graph visualizations on a knowledge-graph project.** Zero. No graph density, no domain-coverage bar, no edge-class breakdown, no L3-coverage map, no signal-citation distribution.
- **No insight surface.** The dashboard reports state. It doesn't say "M2A took 5 sessions vs estimated 5 — on plan" or "drift exit code held at 2 for 12 consecutive sessions — no regressions" or "if cadence holds, M2 closes in ~25 sessions." Facts without narrative.
- **No timeline / chronology.** Sessions in tables and feeds; no visual showing when each session ran or how cadence changed.
- **No cost / budget surface.** The artifact had a $315 M2 budget pill. Not in v0.1.
- **Visual hierarchy is flat.** Everything is uniform-weight Card components. The most important number on a page doesn't dominate.
- **Phase detail page has good structure, boring presentation.** AC list is `ac_id` + status badge; no AC description text, no test text, no result snippet, no residual surface.
- **No comparative analytics.** "How long did B.3 take vs B.4?" "AC failure trend?" "Intervention frequency?" — derivable from existing data; not derived.
- **No annotations layer.** Read-only. The native can't tag a session as "important," flag a phase as "watch this," or add a personal note from the dashboard.

The planning session should weigh which of these to resolve in v0.2, which to defer to v0.3, and which to argue against. No single session of implementation will fix all of them; aim for the highest-leverage subset.

## §2 — Goals (in priority order)

1. **Correctness.** The dashboard must show *true* state, not artifacts of parsing bugs. Fix the sub_phases serializer issue. Re-validate every other field on the JSON for similar conflations. The sequencing bug is the visible tip — there may be others (e.g., does `sessions_index` ordering match real chronology, or file-position?).

2. **All macro-phases collapsible/expandable, sub-phase shape consistent across them.** Every M1–M10 entry should expand to show its planned milestones / sub-phases / sessions. M1 has 8 milestones; M2 has 12 sub-phases; M3–M10 have planned milestones from MACRO_PLAN exit criteria. The data shape per macro-phase should be consistent (the serializer emits the same shape for all macro-phases).

3. **Density before polish.** Add the data, then style it. The plan view should answer "what's the state of every sub-phase right now?" without a click — session counts, AC progress, deliverables shipped, last activity per sub-phase, all visible at the index level.

4. **Visible corpus state.** The cockpit should lead with corpus density: rag_chunks, graph nodes/edges, MSR signals, L3 coverage, CGM node count. These are *what's being built*. Show them.

5. **Off-plan visibility, where it lives.** A "build velocity" surface that shows on-plan vs off-plan session breakdown per macro-phase, intervention frequency over time, and a way to filter/group by session_class.

6. **Visual identity.** Color-code by status (greens for completed, ambers for in-progress, neutrals for pending, reds for failed/blocked). Color-code by session_class (m2_corpus_execution, governance_aside, fix_session, etc.). Use real charts where appropriate (Recharts is approved if needed; v0.1 deferred this and the deferral cost is now visible). Strong typographic hierarchy — the most important number on the page should dominate by 2–3× weight or size.

7. **Insight surface.** Where derivable, surface narrative: "M2A took 5 sessions on a 5-session estimate." "Drift exit holding at 2 baseline for N sessions." "Intervention frequency: M (last 7 sessions) vs N (prior 7)." This is what turns a status page into a cockpit.

## §3 — Specific concrete bugs the v0.2 implementation must fix

Each is testable. The plan should number these and the implementation session should treat them as first-class ACs.

- **B.1 — sub_phases serializer parses wrong headers.** In `platform/scripts/governance/serialize_build_state.py`, the PHASE_B_PLAN reader is matching `## §B.N` document-structure headers instead of sub-phase definition headers. Implementation must locate the actual sub-phase definitions in PHASE_B_PLAN.md (likely a specific section like §G or §B sub-phase tables, not the file's organizing TOC), parse them, sort by phase_id (with B.3.5 between B.3 and B.4 lexicographically — needs custom comparator), and emit. After fix, `phase_plan.sub_phases` should have exactly 12 entries: B.0 Discovery Layer Scaffold, B.1 Corpus Ingestion, B.2 Knowledge Graph Construction, B.3 Embedding + HNSW, B.3.5 CGM Rebuild, B.4 Discovery Registers (or Graph Construction per current plan version), B.5 Temporal & Dasha Mining, B.6 Contradiction Resolution, B.7 Query Router & Retrieval, B.8 Validation UI, B.9 Red-Team & Eval, B.10 M2 Formal Close. Verify titles against the old artifact's `M2_PHASES` data (which had the right shape) as a sanity check.

- **B.2 — macro_arc emit must include planned milestones for every macro-phase, not just M2.** Currently `macro_phase.macro_arc` carries `{id, title, status}` per phase. v0.2 needs `{id, title, status, milestones: [...]}` for every M1–M10. M1's 8 milestones should be readable from MACRO_PLAN_v2_0.md M1 exit criteria; M3–M10 milestones from their respective exit-criteria sections. Use the old artifact's `M1_PHASES` and `FUTURE` data as sanity reference.

- **B.3 — sessions_index ordering.** Verify the index is in chronological order (oldest first or newest first, but consistent). If file-position-based, document that explicitly and ensure it matches chronology.

- **B.4 — Activity feed claims "newest 20 of 62" but recent_sessions on cockpit only shows 3.** Increase the cockpit feed's depth to at least 7 (more if space allows) or add a "view all activity" link that's prominent (currently buried).

- **B.5 — Phase detail's `acceptance_criteria` rows are minimal.** Each row has only `ac_id` + status. Implementation should populate `description`, `test`, `result_snippet`, `residual_id` (if any) from the close YAML's evidence field. Phase shards may need a serializer extension.

## §4 — New visual / UX requirements

The native's verbatim ask: "use graphs, colours, modern UI UX things to make it look better." Translate to specific surface changes:

- **Color system, expanded.** Status colors (green / amber / red / neutral) for completion. Class colors for session_class (e.g., blue for m2_corpus_execution, purple for governance_aside, orange for fix_session, gray for planning_only). Severity colors for governance findings (BASELINE green, MEDIUM amber, HIGH red). Color must convey information at a glance, not just decorate. Document the color system in a new file (e.g., `platform/src/components/build/colors.ts`).

- **Charts.** The planning session should evaluate Recharts as a v0.2 dependency. Cases for charts:
  - Cockpit: corpus density bar / radial showing chunks-by-doc-type, edge-classes, L3 coverage.
  - Plan view: per-sub-phase completion bar with overlay showing planned vs actual session count.
  - Health: full-size trend lines (not 240×48 sparklines) for drift / schema / mirror exit codes over time.
  - Activity: timeline showing session cadence (gaps, bursts).
  - Intervention view: frequency-over-time (red-team passes, halts, native overrides).
  - Optional: a small graph-visualization of the chart-graph-model itself (can be deferred to v0.3 if scope is too big).

- **Typography hierarchy.** Currently `bt-display`, `bt-heading`, `bt-body`, `bt-num`, `bt-label`. Likely too few weights/sizes used too uniformly. The cockpit's most important number on each card should be 2–3× the size of supporting text. Consider a numeric display font (e.g., a tabular-figures variant) for stats so columns line up.

- **All macro-phases expandable.** Every M1–M10 entry in `PlanTree` (and wherever the journey is rendered) is collapsible. Default: M2 expanded (active), M1 collapsed, M3–M10 collapsed. Click to toggle. URL state should track which are expanded if reasonable.

- **Plan view restructure.** The current 3-column layout (tree / overview / side panel) keeps the tree always visible — good. But the center column is a list. Replace with a phase-grid where each sub-phase is a card showing: phase_id, title, status badge, session-count actual/estimated, AC progress bar, deliverables shipped/pending count, last-touched session link, days-since-touched. 12 cards in a 3- or 4-column grid. Click a card → navigate to the phase detail. The cards should stand alone as informative without needing the click.

- **Cockpit redesign.** Lead with corpus density. Three big numbers at top: "rag_chunks", "graph nodes/edges", "L3 coverage." Then "Where I am" + "Just finished" + "Working on next." Then "Build velocity" (sessions/day, on-plan vs off-plan, intervention frequency). Then "What needs attention" (open ACs, residuals, NDs, DRs). The "Today" card stays but gets visual weight matching its actual importance.

- **Activity feed depth.** Currently top-3 on cockpit, top-20 on activity page. Cockpit should show 7. Activity page should be filterable by session_class, phase_id, date range, drift-exit-code, with a search box (full-text against deliverable summaries).

- **Insight cards.** New card type that surfaces narrative derivations. Examples: "Drift baseline holding (12 sessions at exit 2)." "B.4 on plan: 1 of 2 sessions used." "Off-plan share: 21% of M2 sessions." Lives on cockpit and on each major view.

## §5 — Decision points the planning session must resolve

For each: enumerate options, recommend, give rationale + falsifier.

- **D.1 — Recharts in or out.** v0.1 deferred. v0.2 needs at least 4–5 chart types. Adopt Recharts as one dep, or stay with custom SVG, or pick a lighter alternative. Plan should weigh bundle cost vs ergonomics.

- **D.2 — How aggressive a redesign.** Three scopes: (a) targeted fixes only — bugs B.1–B.5, no visual restructure; (b) targeted + visual restructure of the plan view + cockpit only; (c) full v0.2 redesign across all 9 routes. The native's tone says (c). The planning session should size each and recommend.

- **D.3 — New canonical surfaces?** The intervention page is empty largely because past sessions never populated `native_overrides[]` and `halts_encountered[]`. Should v0.2 backfill those fields for past sessions (best-effort regex over SESSION_LOG bodies)? Or leave the empty surface and tell the native it'll fill organically as new sessions close? The planning session should weigh backfill effort vs benefit.

- **D.4 — Annotations layer.** Read-only dashboard or read-write notes? Read-write means new server actions, new DB table or a JSON file, new UI. Probably a v0.3 item. Planning session decides whether to scope.

- **D.5 — Auto-refresh / SSE.** v0.1 deferred SSE to v0.2. With the redesign happening anyway, is now the time to add SSE, or is server-side render on each request still sufficient? The native works at high session-cadence (multiple closes per hour during sprints); auto-refresh might be high-leverage.

- **D.6 — Implementation session count.** v0.1 was 3 sessions. v0.2 likely 2–4 depending on D.2 scope. Planning session decides.

## §6 — Constraints

Same as v0.1 elaborate.md §7 plus:

- **No retroactive PHASE_B_PLAN edits.** v1.0.3 is frozen. The serializer adapts to PHASE_B_PLAN's actual shape, not the other way around.
- **No retroactive SESSION_LOG edits.** Backfill (if D.3 chooses) happens via a separate annotation file or via the optional `native_overrides[]` / `halts_encountered[]` fields on new closes; closed entries are not retroactively rewritten.
- **No corpus work.** Same `must_not_touch` baseline as v0.1.
- **No new MCP integrations.** The portal already reads what it needs from GCS shards.

## §7 — What the v0.2 plan must contain

Same shape as v0.1 plan §8, with these additions:

- A bug-fix register listing each of the §3 bugs with reproduction, fix location, and verification test.
- A color-system specification (status / class / severity palettes with hex codes) that becomes a single source of truth for the implementation session.
- A wireframe-prose description of each redesigned view (cockpit, plan, plan/[phase_id]). Not images — narrative descriptions like "top row: three large stat cards (rag_chunks=N, graph nodes/edges = N/M, L3 coverage = N/9). Second row: Where-I-am card (60% width) + Today card (40% width)..." This is what the implementation session will translate to JSX.
- For Recharts (if D.1 = adopt), a list of which charts go where + their data shapes.
- For the macro-arc expansion (B.2), a concrete data shape spec for the new `milestones` field per macro-phase.

## §8 — HALT protocol (repeat from v0.1 §9)

After producing `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_2.md` with `status: DRAFT_PENDING_NATIVE_REVIEW`:

1. Do not run governance scripts.
2. Do not append to SESSION_LOG.
3. Do not rotate CURRENT_STATE.
4. Do not modify CLAUDECODE_BRIEF.md (preserved at the project root for activator handling per the Exec_7 PENDING brief).
5. Do not touch the portal source.
6. Emit a final halt message naming the plan path, the decisions made on D.1–D.6, the open questions for the native, and the trigger phrase for the implementation session: "Read `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_2.md` and execute it." Note that the implementation session should be Sonnet 4.6.

## §9 — Naming

This planning session: `Madhav_PORTAL_BUILD_TRACKER_PLAN_v0_2`. Cowork thread name: `Madhav PORTAL_BUILD_TRACKER_PLAN — v0.2`.

Implementation sessions: `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2_1` through `_v0_2_N` per D.6 decision.

Plan artifact: `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_2.md`. Frontmatter `status: DRAFT_PENDING_NATIVE_REVIEW` initially. After native review → `APPROVED_FOR_IMPLEMENTATION`. After implementation completes → `IMPLEMENTED`.

## §10 — Sequencing relative to M2 corpus work

Madhav_M2A_Exec_7 (B.4 Task 3 SUPPORTS) is the active queued M2 session and its brief is preserved at `00_ARCHITECTURE/CLAUDECODE_BRIEF_M2A_Exec_7_PENDING.md`. The native has not yet started Exec_7. The planning session should recommend whether v0.2 implementation runs:

- **(α)** before Exec_7 (portal v0.2 first, M2 corpus work resumes after);
- **(β)** after Exec_7 closes (M2 corpus work first);
- **(γ)** interleaved.

The native's tone suggests fixing the dashboard before staring at it during M2 work. Planning session weighs this.

## §11 — Tone (repeated from v0.1 §11)

Depth over brevity. The native ran v0.1 and saw a status page where they wanted a research-instrument cockpit. The plan must show the implementation session what "depth" specifically means for this project — not just instruct it to "be denser."

Every recommendation should cite which v0.1 file or which native complaint or which Cowork-critique item it addresses. The plan is being read by the native (sanity check) and the implementation session (file-by-file diff). It must serve both.

---

*End of elaborate_v0_2.md. Authored by Cowork 2026-04-26. Invocation: `Read elaborate_v0_2.md and follow its instructions.` with executor model = Opus 4.6.*
