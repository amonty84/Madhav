---
artifact_id: PORTAL_REDESIGN_TRACKER
version: 1.0.5
status: LIVING
authored_by: Cowork (Opus)
authored_at: 2026-04-29
owner: Abhisek Mohanty
role: >
  Single-file phase ledger for the Portal Redesign workstream (R0 → R7).
  Carries the redesign-scoped "you are here" pointer, per-phase status, EXEC_BRIEF
  pointers, closure report pointers, session IDs that landed each phase, dates,
  parallelism declarations (parallelizable_with: [...]), and follow-ups deferred
  out of each phase. Updated at every redesign session close. Companion to
  PORTAL_REDESIGN_VISION_v1_0.md (the strategic doc) and the per-phase
  EXEC_BRIEF_PORTAL_REDESIGN_R*_v1_0.md files (the execution briefs).
companion_artifacts:
  vision: 00_ARCHITECTURE/PORTAL_REDESIGN_VISION_v1_0.md (DRAFT, v1.0.1)
  briefs:
    - EXEC_BRIEF_PORTAL_REDESIGN_R0_FOUNDATION_v1_0.md (AUTHORED 2026-04-29)
    - EXEC_BRIEF_PORTAL_REDESIGN_R1_ROSTER_v1_0.md (AUTHORED 2026-04-29)
    - EXEC_BRIEF_PORTAL_REDESIGN_R2_CHART_PROFILE_v1_0.md (AUTHORED 2026-04-29)
    - EXEC_BRIEF_PORTAL_REDESIGN_R5_TIMELINE_v1_0.md (AUTHORED 2026-04-29)
    - EXEC_BRIEF_PORTAL_REDESIGN_R6_COCKPIT_v1_0.md (AUTHORED 2026-04-29)
    - EXEC_BRIEF_PORTAL_REDESIGN_R4_CONSUME_POLISH_v1_0.md (AUTHORED 2026-04-29 — unblocked when trace-fix went on hold)
    - "(R3, R7 briefs deferred — R3 awaits R2 close, R7 is the polish pass and authors after R6 close)"
relates_to:
  - PROJECT_ARCHITECTURE_v2_2.md §D.11 (UX surfaces)
  - MACRO_PLAN_v2_0.md §M2 Corpus Activation (the redesign sits inside M2 as a UX workstream)
  - CURRENT_STATE_v1_0.md (project-wide you-are-here; the redesign tracker is the workstream-scoped analog)
  - GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §F (scope declaration), §K (mirror discipline), §H (drift/schema/mirror checks)
  - ONGOING_HYGIENE_POLICIES_v1_0.md §C (scope-boundary enforcement), §D (SESSION_LOG completeness)
  - CLAUDECODE_BRIEF.md (per-session active scope; sessions opening a redesign phase point CLAUDECODE_BRIEF at the corresponding EXEC_BRIEF)
mirror_obligations:
  claude_side: 00_ARCHITECTURE/PORTAL_REDESIGN_TRACKER_v1_0.md
  gemini_side: none (no Gemini-side counterpart per declared mirror_pairs; redesign is Claude-only)
  mirror_mode: claude_only
  authoritative_side: claude
  asymmetries: >
    No Gemini-side mirror. The redesign workstream is platform-UI-scoped and
    Gemini's primary role is L4 Discovery Layer (PROJECT_ARCHITECTURE_v2_2.md §D.11),
    which the redesign does not touch. If a future redesign phase introduces a
    Gemini-facing surface (e.g., Discovery view), this asymmetry declaration is
    reopened.
update_rules: >
  Every redesign session-close updates this file as part of the atomic close,
  before SESSION_LOG append. Specifically: §2 canonical state block fields are
  refreshed (active_phase, last_redesign_session_id, last_close_at,
  next_phase_committed_to); §3 phase ledger row for the phase that just closed
  flips to status: closed and gains its session_id, closed_at, and follow_ups
  fields; the row for the next phase, if newly committed-to, flips from
  pending to authored once its EXEC_BRIEF is authored and to in_flight when its
  CLAUDECODE_BRIEF is set. The session-close checklist field
  redesign_tracker_updated: true affirms the update happened. Sessions outside
  the redesign workstream carry redesign_tracker_updated: n/a.
consumers:
  - Every redesign session-open handshake reads this file's §2 state block to
    confirm which phase is in flight and which parallel phases are safe.
  - PORTAL_REDESIGN_VISION §4.3.5 names the parallelizable_with field as the
    operational source of truth for parallelism collision detection.
  - A future parallelism_check.py governance script (capture as a follow-up in
    R0's closure report) reads this file's §3 ledger to decide whether a
    session opening phase R[N] collides with an in-flight phase R[M].
changelog:
  - v1.0.9 (2026-04-30): R5 Timeline closed. Fan-out complete — R0 through R6 all closed; R5 last. §2 state block: last_redesign_session_id→redesign-r5-timeline-2026-04-30, post_r0_parallel_ready→[] (all fan-out phases closed). §3 R5 row: status→closed, closure_report + session_id + closed_at set, follow_ups populated. R2 Timeline Room CTA now enabled. Authored by Claude Code (Sonnet 4.6) at R5 close.
  - v1.0.8 (2026-04-30): R4 Consume polish closed. §2 state block: last_redesign_session_id→redesign-r4-consume-polish-2026-04-30, post_r0_parallel_ready→[R5] (R6+R1+R2+R4 closed), trace_fix_status confirmed on_hold. §3 R4 row: status→closed, closure_report + session_id + started_at + closed_at set, follow_ups populated. Authored by Claude Code (Sonnet 4.6) at R4 close.
  - v1.0.7 (2026-04-30): R2 Chart Profile closed. §2 state block: last_redesign_session_id→redesign-r2-chart-profile-2026-04-30, post_r0_parallel_ready→[R4, R5] (R6+R1+R2 closed), deferred_briefs→[R7] (R3 now unblocked). §3 R2 row: status→closed, closure_report + session_id + started_at + closed_at set, follow_ups populated. Authored by Claude Code (Sonnet 4.6) at R2 close.
  - v1.0.6 (2026-04-30): R1 Roster closed. §2 state block: last_redesign_session_id→redesign-r1-roster-2026-04-30, post_r0_parallel_ready→[R2, R4, R5] (R6+R1 now closed). §3 R1 row: status→closed, closure_report + session_id + started_at + closed_at set, follow_ups populated. Authored by Claude Code (Sonnet 4.6) at R1 close.
  - v1.0.5 (2026-04-30): R6 Cockpit elevation closed. §2 state block: last_redesign_session_id→redesign-r6-cockpit-2026-04-30, last_close_at→2026-04-30. §3 R6 row: status→closed, closure_report set, session_id set, closed_at set, follow_ups populated. deferred_briefs remains [R3, R7] — R7 now unblocked by R6 close (pending R1–R4). Authored by Claude Code (Sonnet 4.6) at R6 close.
  - v1.0.4 (2026-04-29): R0 Foundation closed. §2 state block: active_phase→null, last_redesign_session_id set, vision_status→CURRENT, canonical_artifacts_entry→true, claude_md_section_C_updated→true. §3 R0 row: status→closed, closure_report + session_id + closed_at set, follow_ups populated (forced scope expansions + playwright note). Version bumped 1.0.3→1.0.4. Authored by Claude Code (Sonnet 4.6) at R0 close.
  - v1.0.3 (2026-04-29): CLAUDECODE_BRIEF activation. Trace-fix
    CLAUDECODE_BRIEF.md parked to CLAUDECODE_BRIEF_TRACE_FIX_2026-04-29.md.hold;
    fresh CLAUDECODE_BRIEF.md authored at project root pointing at
    EXEC_BRIEF_PORTAL_REDESIGN_R0_FOUNDATION_v1_0.md. §2 state block field
    next_phase_clausecode_brief_set flipped to true. R0 session is ready to
    start in Claude Code (Sonnet 4.6, Anti-Gravity / VS Code). No phase rows
    changed. Authored by Cowork (Opus).
  - v1.0.2 (2026-04-29): Trace-fix on-hold amendment. Native put trace-fix
    workstream on hold; R4 collision dissolved. trace_fix_status flipped from
    in_flight to on_hold. R4 row updated: trace_fix_collision flipped to false
    with sticky-note about resumption rule; status flipped from pending to
    authored with brief pointer (EXEC_BRIEF_PORTAL_REDESIGN_R4_CONSUME_POLISH_v1_0.md
    authored same session). post_r0_parallel_ready expanded from [R1, R2, R5, R6]
    to [R1, R2, R4, R5, R6] (5 phases parallel-ready post-R0). deferred_briefs
    contracted from [R3, R4, R7] to [R3, R7]. Companion VISION amendment
    bumps to v1.0.2 with §4.3.2 rewrite. Authored by Cowork (Opus).
  - v1.0.1 (2026-04-29): Brief authoring sweep. Four additional EXEC_BRIEFs
    authored in this session (R0 Foundation, R1 Roster, R5 Timeline, R6
    Cockpit). R0/R1/R2/R5/R6 phase rows flipped from status:pending to
    status:authored with brief pointers and authored_at dates. §2 state block
    field next_phase_brief_authored flipped to true. R3, R4, R7 remain
    pending — R3 brief awaits R2 close (its hook-compatibility audit findings
    will shape the brief), R4 awaits trace-fix merge, R7 is the polish pass
    that authors after R6 close. Authored by Cowork (Opus).
  - v1.0.0 (2026-04-29): Initial tracker. All eight phase rows seeded with
    status: pending. R2 row carries the only authored EXEC_BRIEF pointer; the
    rest of the brief pointers populate as each phase reaches the head of the
    queue. Active phase: none (redesign has not started — R0 brief not yet
    authored). Authored by Cowork (Opus) in the same session that authored
    PORTAL_REDESIGN_VISION_v1_0.md and the R2 EXEC_BRIEF.
---

# Portal Redesign Tracker v1.0 — Phase Ledger (LIVING)

## §1 — Purpose

This file is the **redesign-scoped "you are here" pointer**. It answers in one read:

- Which redesign phase is active right now? Which phases have closed? Which are pending?
- For the active phase, where is its EXEC_BRIEF? Where is its closure report? Which session landed it?
- Which other phases are safe to run in parallel with the active phase?
- What follow-ups did each closed phase intentionally defer?

It is the workstream-scoped analog of `00_ARCHITECTURE/CURRENT_STATE_v1_0.md`. `CURRENT_STATE` answers project-wide ("which macro-phase is M-active, which governance step closed last"); this file answers redesign-only ("which R-phase is in flight, which R-phases can fan out").

## §2 — Canonical state block

```yaml
# This block is updated at every redesign session-close before SESSION_LOG append.
# Out-of-band edits to this block fail drift_detector.py once the parallelism_check
# script lands (currently advisory).

active_phase: null                      # Fan-out complete — R0 through R6 all closed 2026-04-30
in_flight_parallel_phases: []           # none
last_redesign_session_id: redesign-r5-timeline-2026-04-30
last_close_at: "2026-04-30"
next_phase_committed_to: null           # R3 authorable (unblocked by R2); R7 authorable; native decides
next_phase_brief_authored: true         # all fan-out briefs authored and closed
next_phase_clausecode_brief_set: false  # R3/R7 await brief authoring
post_r0_parallel_ready: []              # all fan-out phases closed; R3 + R7 are the remaining pipeline
deferred_briefs: [R7]                   # R3 unblocked + authorable; R7 authorable (all R0–R6 closed)
trace_fix_status: on_hold               # trace fix parked; R4 collision dissolved
vision_status: CURRENT                  # promoted at R0 close 2026-04-29
canonical_artifacts_entry: true         # VISION + TRACKER added to CANONICAL_ARTIFACTS §1 at R0 close
claude_md_section_C_updated: true       # CLAUDE.md §C item #12 added at R0 close
```

When a redesign session opens, it reads this block to determine: (a) whether the brief it was handed is consistent with `next_phase_committed_to`, (b) whether `in_flight_parallel_phases` declares any other concurrent phase whose `may_touch` would collide. If a collision is detected, the session halts before tool use.

## §3 — Phase ledger

The phase ledger is the authoritative per-phase record. Each row is updated at the redesign session-close that lands that phase. `parallelizable_with` is the operational source of truth for collision detection per VISION §4.3.5.

### R0 — Foundation

```yaml
phase_id: R0
phase_name: Foundation — AppShell + theme zones + /build → /cockpit rename
status: closed
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R0_FOUNDATION_v1_0.md
closure_report: 00_ARCHITECTURE/PORTAL_REDESIGN_R0_REPORT_v1_0.md
session_id: redesign-r0-foundation-2026-04-29
authored_at: 2026-04-29
started_at: "2026-04-29"
closed_at: "2026-04-29"
risk: LOW                                # navigation surfaces only
estimated_sessions: 1
depends_on: []                           # R0 is the gate
parallelizable_with: []                  # R0 must run alone; everything else gates on it
sub_phases: []                           # not split further
key_deliverables:
  - <AppShell> component (left rail + breadcrumb)
  - <ZoneRoot zone="vellum|ink|bridge"> theme scope
  - /build → /cockpit route rename with permanent 301
  - DashboardHeader retired in favor of AppShell
  - ForceDarkMode + ConsumeForceDark replaced by <ZoneRoot zone="ink">
trace_fix_collision: false               # safe parallel with active trace fix
follow_ups:
  - "reset-password/page.tsx and ConsumeChat.tsx were forced-scope-expanded to remove deleted ForceDarkMode/ConsumeForceDark refs; documented in R0 report"
  - "Playwright smoke tests (appshell.spec.ts, cockpit-redirect.spec.ts) require dev server — run manually before R0 PR merge"
  - "Author parallelism_check.py governance script (VISION §4.3.5; captured as advisory note in R0 report)"
```

### R1 — Roster modernization

```yaml
phase_id: R1
phase_name: Roster — stats ribbon + filters + grid/table toggle + upgraded ClientCard
status: closed
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R1_ROSTER_v1_0.md
closure_report: 00_ARCHITECTURE/PORTAL_REDESIGN_R1_REPORT_v1_0.md
session_id: redesign-r1-roster-2026-04-30
authored_at: 2026-04-29
started_at: "2026-04-30"
closed_at: "2026-04-30"
risk: LOW
estimated_sessions: 1
depends_on: [R0]
parallelizable_with: [R2, R5, R6]
sub_phases: []
key_deliverables:
  - <RosterStatsRibbon> (top of /dashboard)
  - <RosterFilters> (search + filter row, URL query params)
  - <RosterTableView> (composed from RegistryTable patterns)
  - upgraded <ClientCard> (moment phrase, health dot)
  - <RosterEmptyWizard> (Mandala backdrop, zero-client state)
  - lib/roster/ module (types, stats server-query, filter helpers)
trace_fix_collision: false
follow_ups:
  - "per-chart mirror_pair_status: no DB column; health dot uses freshness only — add column + rewire if needed"
  - "inActiveBuild secondary criterion 'last close < 7d' deferred (no last_close_at column)"
  - "predictionsOverdue: hardcoded to 0; wired in R5 per brief §1"
  - "node_modules symlink in Madhav-r1/platform/ must be recreated if worktree is re-checked-out"
  - "E2e roster.spec.ts: run manually with SMOKE_SESSION_COOKIE before PR merge"
```

### R2 — Chart Profile (keystone)

```yaml
phase_id: R2
phase_name: Chart Profile — keystone surface (NEW /clients/[id])
status: closed
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R2_CHART_PROFILE_v1_0.md
closure_report: 00_ARCHITECTURE/PORTAL_REDESIGN_R2_REPORT_v1_0.md
session_id: redesign-r2-chart-profile-2026-04-30
authored_at: 2026-04-29
started_at: "2026-04-30"
closed_at: "2026-04-30"
risk: MEDIUM                             # one new page; one new SVG renderer; B.10 visual verification required
estimated_sessions: 2                    # 3 if rasi-renderer or B.10 verification surfaces friction
depends_on: [R0]                         # R1 nice-to-have but not strict (R2 can land before R1 if R1 is delayed)
parallelizable_with: [R1, R5, R6]
sub_phases:
  - id: R2a
    name: RasiChartSVG renderer
    risk: MEDIUM
    notes: Pure leaf component; could even land before R0 if started early
    parallelizable_with: [R2b]
  - id: R2b
    name: RoomCard + ProfileSideRail + DashaCountdown
    risk: LOW
    parallelizable_with: [R2a]
  - id: R2c
    name: ChartHero + page composition + tests + B.10 visual verification
    risk: LOW
    depends_on: [R2a, R2b]
    parallelizable_with: []
key_deliverables:
  - <RasiChartSVG> (gold-on-charcoal North Indian style, from L1 forensic data)
  - <ChartHero> (Bridge zone — vellum page + ink hero band)
  - <RoomCard> ×3 instances (Build, Consume, Timeline-preview)
  - <ProfileSideRail> with <DashaCountdown>
  - replace silent redirect with real /clients/[id]/page.tsx
  - one-line ClientCard href change (primary CTA → /clients/[id])
trace_fix_collision: false
follow_ups:
  - South Indian chart style (deferred to R2+; no EXEC_BRIEF yet)
  - Click-to-house tooltips on RasiChartSVG (deferred to R2+)
  - Pratyantar-level DashaCountdown (L1 has MD/AD only; Pratyantar requires Phase 14C extension)
```

### R3 — Build mode upgrade

```yaml
phase_id: R3
phase_name: Build mode — three-pane cockpit (per-client)
status: pending
exec_brief: null
closure_report: null
session_id: null
authored_at: null
started_at: null
closed_at: null
risk: MEDIUM                             # /api/chat/build hook compatibility audit needed first
estimated_sessions: 2                    # R3a audit + R3b UI swap
depends_on: [R0, R2]                     # R2 because Continue-building CTA originates in R2's Build Room
parallelizable_with: [R4, R5, R6]        # R4 only safe in parallel if trace fix has merged
                                         # — see VISION §4.3.2; otherwise serialize R3 → trace-fix-merge → R4
sub_phases:
  - id: R3a
    name: /api/chat/build hook-compatibility audit
    risk: LOW
    notes: Independent investigation; produces written audit; no code changes
    parallelizable_with: [R3b]           # only the *audit* is parallelizable; the swap depends on the audit
  - id: R3b
    name: BuildChat shell swap + right-pane widget composition
    risk: MEDIUM
    depends_on: [R3a]
    parallelizable_with: []
key_deliverables:
  - hook-compatibility audit report (R3a output)
  - BuildChat replaced with ChatShell + AdaptiveMessageList + Composer
  - right pane: JourneyStrip + BriefPanel + InsightCards + MirrorPairsTable + PyramidStatusPanel (collapsed)
  - feature parity with Consume (sidebar, branches, streaming, model picker, command palette)
trace_fix_collision: false               # R3 doesn't modify chat components; just composes them
                                         # but R3 should not begin before trace-fix merges (re-composing moving target)
follow_ups: []
```

### R4 — Consume polish

```yaml
phase_id: R4
phase_name: Consume polish — report gallery + trace drawer + tier picker + prediction-log
status: closed
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R4_CONSUME_POLISH_v1_0.md
closure_report: 00_ARCHITECTURE/PORTAL_REDESIGN_R4_REPORT_v1_0.md
session_id: redesign-r4-consume-polish-2026-04-30
authored_at: 2026-04-29
started_at: "2026-04-30"
closed_at: "2026-04-30"
risk: LOW
estimated_sessions: 1
depends_on: [R0]
parallelizable_with: [R1, R2, R3, R5, R6]
sub_phases: []
key_deliverables:
  - <ReportGallery> (replaces flat ReportLibrary list) — LANDED
  - lib/consume/domain-icons.ts (extracted shared icon + freshness logic) — LANDED
  - <TraceDrawer> (collapses TracePanel into side drawer) — LANDED
  - TracePanelContent extracted from TracePanel (shared render body) — LANDED
  - <TierPicker> (super_admin can flip audience tiers; persists to ?tier= URL) — LANDED
  - <LogPredictionAction> + LogPredictionDialog (writes to /api/lel) — LANDED
  - lib/consume/prediction-detection.ts (7-pattern regex heuristic) — LANDED
  - /api/lel route.ts (minimal POST endpoint) — LANDED
  - AnswerView footer slot (traceId + LogPredictionAction) — LANDED
  - PanelAnswerView traceId prop — LANDED
  - ConsumeChat wired: TraceDrawer + TierPicker + ReportLibrary view — LANDED
trace_fix_collision: false
trace_fix_serialization_rule: >
  trace_fix_status remained on_hold throughout R4 execution.
  If trace-fix work resumes post-R4, it rebuilds against <TraceDrawer> surface
  (the always-on <TracePanel> usage in ConsumeChat is retired as of R4).
follow_ups:
  - "E2E tests (consume-polish.spec.ts) require dev server + SMOKE_SESSION_COOKIE + SMOKE_CHART_ID — run manually before R4 PR merge"
  - "TierPicker omits acharya_reviewer tier per brief; expand when that tier requires QA"
  - "R5 may land a richer /api/lel endpoint; review R4 route.ts for consolidation"
  - "trace_fix_status still on_hold — if resumed, trace-fix author should work against R4 TraceDrawer surface"
```

### R5 — Timeline (LEL surface)

```yaml
phase_id: R5
phase_name: Timeline — NEW /clients/[id]/timeline (LEL + prediction log)
status: closed
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R5_TIMELINE_v1_0.md
closure_report: 00_ARCHITECTURE/PORTAL_REDESIGN_R5_REPORT_v1_0.md
session_id: redesign-r5-timeline-2026-04-30
authored_at: 2026-04-29
started_at: "2026-04-30"
closed_at: "2026-04-30"
risk: MEDIUM                             # new route; no schema change (LEL is markdown)
estimated_sessions: 1                    # landed in 1 session
depends_on: [R0]                         # nice-to-have: R2 (so the Timeline Room CTA in Profile becomes enabled)
parallelizable_with: [R1, R2, R3, R6]
sub_phases: []
key_deliverables:
  - new /clients/[id]/timeline route
  - <TimelineView> reading from 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md
  - <PredictionTable> for active prospective predictions
  - <EventCard>, <LogEventDialog>, <LogPredictionDialog>
  - LEL parser (two-pass: js-yaml + regex fallback; 36 events / 0 hard errors)
  - LEL writer (append-only, in-process mutex, round-trip validation)
  - /api/lel POST endpoint (super_admin only)
  - 11 unit tests passing (7 parser + 4 writer)
trace_fix_collision: false
follow_ups:
  - "R2 Timeline Room CTA flip (disabled → href) deferred — R2 not yet closed at R5 close; execute when R2 closes"
  - "drift_detector.py exit 2 is pre-existing (233 findings from before R5); not a regression; carry forward to pre-existing debt cleanup"
  - "E2E timeline.spec.ts requires running dev server + SMOKE_SESSION_COOKIE env — run manually before R5 PR merge"
  - "Outcome-capture UI dialog (markPredictionOutcome) deferred to R4 scope per VISION"
```

### R6 — Cockpit elevation

```yaml
phase_id: R6
phase_name: Cockpit — elevate to AppShell rail + Active charts widget
status: closed
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R6_COCKPIT_v1_0.md
closure_report: 00_ARCHITECTURE/PORTAL_REDESIGN_R6_REPORT_v1_0.md
session_id: redesign-r6-cockpit-2026-04-30
authored_at: 2026-04-29
started_at: "2026-04-30"
closed_at: "2026-04-30"
risk: LOW
estimated_sessions: 1
depends_on: [R0]                         # R6 is internals-untouched; just rail promotion + one new widget
parallelizable_with: [R1, R2, R3, R5]
sub_phases: []
key_deliverables:
  - Cockpit promoted to AppShell left rail (super_admin only) — verified no-op (R0 already correct)
  - <ActiveChartsWidget> on CockpitGrid linking into Chart Profiles via /clients/{id}
  - BuildHeader nav cleanup — verified no-op (R0 already removed avatar)
  - getActiveCharts() in dataSource.ts with 60s cache + healthDot logic
  - cockpit-rail.spec.ts (4 Playwright tests) + ActiveChartsWidget.test.tsx (6 Vitest tests)
trace_fix_collision: false
follow_ups:
  - "R7 brief now authorable — polish pass scope is now fully defined by what landed in R0–R6"
  - "getActiveCharts cache TTL is module-level; consider Redis/KV if Cloud Run cold starts prove costly (deferred post-R7)"
  - "ActiveChartsWidget could show a miniature chart thumbnail — deferred post-R7 polish"
```

### R7 — Polish

```yaml
phase_id: R7
phase_name: Polish — accessibility + mobile + animation + perceived-perf
status: pending
exec_brief: null
closure_report: null
session_id: null
authored_at: null
started_at: null
closed_at: null
risk: LOW
estimated_sessions: 1
depends_on: [R0, R1, R2, R3, R4, R6]     # R7 is the polish pass; touches everything
parallelizable_with: []                  # by definition R7 runs alone
sub_phases: []
key_deliverables:
  - Lighthouse a11y ≥ 95 on every redesign surface
  - mobile pass: Chart Profile, Build, Roster table view
  - animation timings audit (Mandala backdrop, ProgressBar transitions, ascend transitions)
  - perceived-perf audit: streaming dots, skeleton states
  - feature flag cleanup: PORTAL_REDESIGN_R*_ENABLED flags removed; legacy paths deleted
trace_fix_collision: false               # trace fix is long-merged by R7
follow_ups: []
```

## §4 — Update protocol

When a redesign session closes, it MUST:

1. Refresh §2 canonical state block (all fields).
2. Update §3 row for the phase that just closed: `status: closed`, populate `session_id`, `closed_at`, `closure_report`, `follow_ups`.
3. If a new phase is being committed to, update its row: `status: authored` (when EXEC_BRIEF lands) or `in_flight` (when CLAUDECODE_BRIEF.md is set to point at it).
4. Validate: §2 `active_phase` matches the §3 row whose `status` is `in_flight`. Validate: §2 `in_flight_parallel_phases` is the set of all §3 rows with `status: in_flight`. Validate: every closed-phase row has non-null `session_id` and `closure_report`.
5. Append the close to `00_ARCHITECTURE/SESSION_LOG.md` per the standard close-checklist.
6. Set close-checklist field `redesign_tracker_updated: true`.

A session-close that fails to update this tracker fails the close-checklist and does not claim close.

When a parallelism_check governance script lands (post-R0 follow-up), the script reads §3 `parallelizable_with` and §3 `may_touch` (the latter sourced from each phase's EXEC_BRIEF) to mechanically detect collisions; until then this rule is enforced advisorily.

## §5 — Promotion to CURRENT

This artifact promotes from `status: LIVING` (which is its steady-state) to inclusion in `CANONICAL_ARTIFACTS_v1_0.md §1` when:

- R0 closes successfully.
- The companion `PORTAL_REDESIGN_VISION_v1_0.md` promotes from `DRAFT` to `CURRENT` in the same R0 close.
- An entry is added to `CANONICAL_ARTIFACTS_v1_0.md §1` as `canonical_id: PORTAL_REDESIGN_TRACKER`, `status: LIVING`.
- `CLAUDE.md §C — Mandatory reading (per session)` adds both VISION and TRACKER at item #12 (or appropriate position).
- `mirror_enforcer.py` exit 0 — Claude-only mirror, no Gemini-side update needed.

Until then this artifact is informational and any session is free to challenge or amend it.

---

*End of PORTAL_REDESIGN_TRACKER_v1_0.md (LIVING, 2026-04-29).*
