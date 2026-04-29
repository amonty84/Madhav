---
artifact: elaborate.md
purpose: >
  Planning brief for the Build Tracker portal component. The Cowork-artifact tracker
  is being retired (Cowork iframe sandbox CSP blocks the external fetch path that
  was assumed). The replacement lives in the user's existing Next.js portal on
  Cloud Run as a server-rendered build dashboard reading canonical project files.
  This file is the planning prompt — it tells Claude Code Opus what to think about,
  what trade-offs exist, what canonical surfaces matter, where the gaps are, and
  what shape the eventual implementation must take. The planning session HALTS
  after producing the plan; the native then switches the executor model from Opus
  to Sonnet and opens a fresh implementation session against the produced plan.
authored_by: Cowork (Claude Opus 4.7) on 2026-04-26
authored_during: Cowork conversation post Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX, after Cowork artifact path proved unworkable
target_executor_for_planning: Claude Code (Anti-Gravity / VS Code), Opus 4.6 (architecture / planning strength)
target_executor_for_implementation: Claude Code, Sonnet 4.6 (execution / token efficiency)
session_class: planning_only — produces plan artifact, then HALTS; does NOT implement
halt_after_plan: true
governing_clause: CLAUDE.md §I principles apply; this file does not override CLAUDE.md §C item 0 because no CLAUDECODE_BRIEF.md is being authored for the planning session — instead this file IS the planning prompt and must be read in full at session open
---

# elaborate.md — Build Tracker Portal Planning Prompt

## §0 — How to use this file

You are Claude Code. You have just been told to read this file and follow its instructions. The file is a planning prompt for a substantial new addition to the Madhav portal. Your job is to **produce a detailed implementation plan**, not implement.

Read the entire file before doing anything else. After reading:

1. Read the standard mandatory items per CLAUDE.md §C (CLAUDE.md, CANONICAL_ARTIFACTS, PROJECT_ARCHITECTURE, MACRO_PLAN, PHASE_B_PLAN, GOVERNANCE_INTEGRITY_PROTOCOL, the session templates, CURRENT_STATE, GROUNDING_AUDIT, NATIVE_DIRECTIVES, ONGOING_HYGIENE_POLICIES). You need this context to ground the plan.
2. Read every file enumerated in §3 below. You need to actually look at what's in them, not just know they exist.
3. Inspect the user's portal codebase. The portal is the Next.js app on Cloud Run at `madhav.marsys.in`. Find it in the repo (likely under a path like `platform/web/`, `app/`, `src/`, `web/`, or similar — locate it). Understand its component structure, routing pattern, auth integration, and existing patterns before proposing where the build component lands.
4. Produce the plan as `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md` with frontmatter `status: DRAFT_PENDING_NATIVE_REVIEW`.
5. **HALT.** Emit a final message instructing the native: "Plan complete at `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md`. Review and confirm or revise. When ready to implement, switch the executor model from Opus to Sonnet, open a fresh Claude Code session, and instruct it to read the plan and execute it."

You do not run governance scripts at this halt point. You do not append to SESSION_LOG. You do not rotate CURRENT_STATE. This is a draft-for-review pause, not a session close. The implementation session, when it opens, runs full close discipline.

## §1 — What we're building, and why this is hard

The AM-JIS project has been tracking build state via a Cowork artifact (`amjis-build-tracker`). The artifact had a static `STATE` block that Cowork updated manually after each Claude Code session — error-prone and stale. We tried to fix this by having the artifact `fetch()` from a GCS-hosted `build_state.json`. The infrastructure works (bucket created, IAM granted, CORS configured, JSON uploaded automatically at every session close per `ONGOING_HYGIENE_POLICIES §O`). But the Cowork artifact iframe sandbox blocks external `fetch()` via CSP — the request never leaves the iframe, presenting as `TypeError: Failed to fetch` regardless of how the URL is configured. This is a structural limitation of Cowork artifacts; only `window.cowork.callMcpTool` to a connected MCP works for external data, and there is no GCS connector.

Conclusion: the dashboard belongs in a real web surface, not a Cowork artifact. The user's existing portal (`amjis-web` on Cloud Run, hosted at `madhav.marsys.in`) is that surface. It runs server-side Node.js / Next.js, can fetch any HTTPS URL or read its own filesystem with no CSP issue, and is already behind Firebase Auth.

But this isn't a port. The user has named explicit requirements that go beyond what the Cowork artifact ever did:

> "Real-time or near-real-time when I refresh it. Full visibility of what build actions we did, what other non beyond the plan, what all interventions that we do. Build a complete view, flexible, robust, make it detailed so that it's able to handle the build action that we are doing, the parallel actions that we are doing."

In other words, the dashboard is the **research instrument's cockpit**. It must show:

- Planned actions: PHASE_B_PLAN sub-phases, M2A vs M2B, expected sessions per phase.
- Off-plan / aside actions: governance asides (the entire build-tracker arc was three of these), hot fixes, ad-hoc corrections.
- Interventions: red-team passes (verdict, findings, residuals), native directives (ND.N), disagreement-register entries, halt-and-asks where the native overrode brief acceptance criteria, native overrides delivered conversationally in Cowork.
- Parallel workstreams: LEL maintenance, prospective prediction logging, Cowork conversations alongside Claude Code sessions, multi-agent (Claude + Gemini) coordination.
- Health metrics: drift / schema / mirror exit codes per session (and trend), known-residuals counts, red-team counter, mirror-pair fingerprint freshness, quarterly governance pass next-due date, staleness register.
- A live activity feed and the ability to click into any session for full detail.

Depth matters more than brevity. This is the user's cockpit, not a customer-facing dashboard.

## §2 — Goals, in priority order

1. **Sub-second refresh that reflects current canonical state.** Click ↺ → server reads canonical files → renders. No staleness window other than what's intrinsic to session-close cadence. Optionally, an SSE channel pushes updates as files change (nice-to-have, not required for v1).

2. **Full visibility into all of the dimensions named in §1.** Plan view, off-plan view, intervention view, parallel-workstream view, health view, activity feed. Each is its own surface and they all share the same underlying data.

3. **Robust to all session classes and intervention types.** The portal must not break or silently drop a session because its session_open YAML has unfamiliar fields. New session classes (governance_aside, planning_only, fix-session, native-override) should appear as their own filter without a code change to the renderer; the renderer reads what it sees.

4. **Flexible / extensible.** When a new dimension shows up (a new ND, a new red-team class, a new ledger), adding it to the dashboard should be one component file plus one data-loader, not a rewrite. Schema-driven where possible.

5. **Detailed.** When the user clicks B.4, they should see: the PHASE_B_PLAN spec for B.4, every session that touched B.4, the deliverables produced, the residuals carried forward, the dependencies, what's next. Drill-down is the whole point.

## §3 — Sources of truth (canonical files the dashboard derives state from)

Read each of these. The plan must explicitly map each dashboard surface to the source file(s) it pulls from.

### Primary state pointers

- `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` — §2 YAML block is the canonical "you are here." Active phase, active sub-phase, last session, next session, ND status, red-team counter, governance step.
- `00_ARCHITECTURE/SESSION_LOG.md` — append-only chronological log. Every session has a session_open + body + session_close. Older entries are legacy-format markdown headers; post-Step-10 entries are SESSION_LOG_SCHEMA conformant. The dashboard must handle both.
- `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` — defines the schema each post-Step-10 entry follows.
- `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — §1 has every canonical artifact with version + fingerprint + status; §2 has the MP.1–MP.8 mirror-pair inventory.

### Plan structure

- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` — M1 → M10 ten-macro-phase arc.
- `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` — B.0 → B.10 expansion of M2.
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` — five-layer architecture.

### Interventions / governance events

- `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` — every ND.N issued, status, consumption matrix.
- `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` — every DIS.class.* opened, current state.
- `00_ARCHITECTURE/STALENESS_REGISTER.md` — known-stale items being tracked.
- `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` — historical baseline (closed at Step 15, but referenced).
- `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md` — Step 15 sealing artifact.

### Operational policies

- `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` — §G red-team cadence rule, §H quarterly governance pass schedule, §O build-state policy, §I MP review triggers.
- `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` — six axes of governance integrity.
- `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` + `SESSION_CLOSE_TEMPLATE_v1_0.md` — handshake schemas.

### Verification artifacts

- `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` (and any other RED_TEAM_*.md) — red-team reports with verdicts + residuals.
- `verification_artifacts/RAG/baseline_edge_count.json`, `chunking_report.json` — pipeline metrics.
- `00_ARCHITECTURE/drift_reports/`, `schema_reports/`, `mirror_reports/` — per-session script outputs.

### Briefs and current execution

- `CLAUDECODE_BRIEF.md` at project root — current/most-recent brief. The planning session reads it to understand active execution.
- The brief has acceptance criteria; the dashboard could surface AC progress if the in-flight session writes back to it.

### Already-built infrastructure

- `platform/scripts/governance/serialize_build_state.py` — reads canonical files, writes `build_state.json`. The plan can reuse, extend, or supersede this.
- `platform/scripts/governance/schemas/build_state.schema.json` — the JSON contract.
- The GCS object `gs://marsys-jis-build-state/build-state.json` (public-read; refreshed at every session close per §O).
- The Cowork artifact `amjis-build-tracker` (broken; will be retired or repurposed).

### The portal itself (locate this in the repo)

The portal codebase exists somewhere in the repo. Find it. It's the Next.js app deployed to `Cloud Run: amjis-web (asia-south1)` per `project_infra_state` memory. Read its directory structure, routing, auth integration, page layout, design system, existing components. The build component must fit the portal's existing conventions, not impose new ones.

## §4 — Views the dashboard must support

Each view is a section / surface in the dashboard. They share data but each has its own focus. The plan must specify, for each view: what it shows, which sources feed it, drill-down behavior, and refresh expectations.

1. **Cockpit / overview.** Single-screen summary: active macro-phase, active sub-phase, last session, next session, governance health (3 script exit codes), red-team counter, days-to-quarterly-pass, open ND count, open DR count, last 3 session deliverables. Auto-refreshes / refreshes on click.

2. **Plan view.** PHASE_B_PLAN sub-phases B.0–B.10 with done / in-progress / pending status, sessions consumed, sessions estimated, ACs progress. Click a phase → drill into all sessions that touched it + deliverables + carry-forwards.

3. **Macro arc view.** M1–M10 with current position. Brief summary per phase. Click → MACRO_PLAN sub-phase detail.

4. **Session log view.** All sessions, filterable by class (M2 corpus / governance aside / planning / fix / red-team / native-override / cowork-conversation), by sub-phase, by date range, by drift/schema/mirror verdict. Tabular with sortable columns. Click → full session detail.

5. **Off-plan / aside view.** Sessions whose `expected_session_class` is not the canonical M2 corpus path. Shows what the aside was for, what it accomplished, what it deferred. The build-tracker arc is currently three asides; the dashboard must surface them clearly so the user can see "off-plan work spent."

6. **Intervention view.** Red-team passes (every `red_team_pass.performed: true` block + verdict + findings + residuals); native directives (every ND.N + status + consumption matrix progress); disagreement-register entries; halt-and-ask events (sessions where the brief halted and the native overrode — these aren't currently structured; see §6 gaps).

7. **Parallel workstreams view.** LEL maintenance status (last bump date, event count, confidence). Prospective prediction ledger (predictions logged, horizons elapsed, scoring status). Cowork conversation ledger (see §6 — this requires a new file). Multi-agent coordination (mirror-pair fingerprint freshness, last MP.N rotation per pair).

8. **Health / governance view.** Per-session: drift_detector exit code, schema_validator exit code, mirror_enforcer exit code, known_residuals count. Trend over last N sessions. Mirror-pair table with last_verified_session and days-since. Quarterly pass countdown. Red-team counter + threshold + days since last fire.

9. **Activity feed.** Reverse-chronological stream of session closes. Each card: session id, date, deliverable summary, drift verdict, links to artifacts produced. Auto-refreshes / refreshes on click.

10. **Brief view.** Current `CLAUDECODE_BRIEF.md` if status != COMPLETE. Shows the brief's session_id, active context, ACs (and progress if surfaceable), hard constraints. Detected via filesystem read.

11. **Canonical artifact registry view.** Tabular: every canonical_id, path, version, status, fingerprint, last_verified_session, days-since-rotation. Filter by mirror_pair_id. Click → artifact detail (frontmatter + first N lines).

12. **Drill-down per session.** Click any session anywhere → full session_open + body + session_close, files_touched, drift / schema / mirror reports linked, deliverables, residuals, mirror updates propagated, native directive verifications.

The plan is allowed to argue that some of these collapse into one view, but the underlying capability must exist.

## §5 — Decision points the planning session must resolve

For each: enumerate options, name a recommendation with rationale, identify what could falsify the recommendation.

### D.1 — How does canonical state reach Cloud Run?

The portal runs on Cloud Run; the canonical files live in the user's local repo. Options:

- **D.1.a — Bake repo into Docker image.** `00_ARCHITECTURE/` and other read-only directories baked at build time. Pros: simplest. Cons: requires redeploy for every state change; defeats the "sub-second refresh" goal because the image lags behind the repo.
- **D.1.b — Git-pull on each request.** Cloud Run container does `git fetch && git pull` before reading files. Pros: always current. Cons: slow first-request-after-change; assumes the repo has a remote and the user pushes; adds container-needs-git-credentials complexity.
- **D.1.c — GCS sync of `00_ARCHITECTURE/` directory.** A close-hook step rsyncs the architecture directory to a GCS bucket. Cloud Run reads files from GCS server-side. Pros: clean separation; no git credentials. Cons: extra close-hook step; latency = GCS sync time + read time.
- **D.1.d — Read only from the existing `build_state.json` GCS object.** Extend the serializer to carry every dimension the dashboard needs into one rich JSON. Cloud Run reads the JSON server-side. Pros: leverages existing infra; one source. Cons: JSON gets large (~200KB+); loses ability to render arbitrary file content (e.g., full SESSION_LOG bodies, mirror reports).
- **D.1.e — Hybrid: GCS for `build_state.json` + GCS-synced architecture dir for full-text views.** Best of both. Plan should evaluate.

The recommendation should weigh deployment cadence against latency requirements. The answer probably depends on whether the user pushes to git regularly.

### D.2 — Refresh strategy

- **D.2.a — Server-side render on every request, no caching.** Click refresh → server re-reads → renders. Sub-second. Simple.
- **D.2.b — Server-side render with short-TTL cache** (e.g., 30s). Reduces read pressure if multiple users / tabs. Single-user use case probably doesn't need this.
- **D.2.c — Server-side render + SSE channel for live updates.** Server has a file watcher (chokidar / watchfiles) that pushes events when canonical files change. Client gets updates without clicking. Real-time feel. More complex; requires persistent connection.
- **D.2.d — Cron-based snapshot in DB / KV** (e.g., Cloud SQL row, Redis key). Cron job reads canonical files every N seconds and updates the snapshot. Page reads from snapshot. Trade-off between freshness and read frequency.

D.2.a is probably right for v1. D.2.c is the eventual right answer if the user wants real-time.

### D.3 — Where in the portal does the build component live?

- **D.3.a — Standalone `/build` route.** Top-level page accessible by URL. Bookmarkable. Recommended.
- **D.3.b — Integrated into existing nav.** If the portal has a sidebar or nav menu, add an item.
- **D.3.c — Modal / drawer overlay.** Probably wrong; this is a dense surface that needs full-page space.
- **D.3.d — Admin panel sub-route.** Acceptable if the portal has an admin section the native is the only user of.

The plan should recommend based on the portal's existing IA. Read the portal first.

### D.4 — Auth scope

- **D.4.a — Firebase Auth, native-only via email match.** `mail.abhisek.mohanty@gmail.com` is the only allowed account. Reject all others with a 403.
- **D.4.b — Firebase Auth + a `super_admin` role check.** The `profiles` table per `project_infra_state` has a `role` column including `super_admin`. Use it.
- **D.4.c — No auth (public).** Wrong. The dashboard exposes governance metadata, internal session names, intervention details — not for public consumption.

The plan should recommend D.4.b if the role is consistently set, D.4.a as fallback. The auth guard is one middleware in Next.js.

### D.5 — Visualization library

- **D.5.a — Plain HTML + CSS + minimal JS.** What the Cowork artifact used. Lightweight.
- **D.5.b — Recharts (React).** If the portal uses React (likely, since it's Next.js). Ergonomic for the trend / sparkline / progress visualizations.
- **D.5.c — Chart.js.** If non-React or if the portal already uses it.
- **D.5.d — Custom SVG components.** Maximum control; more code.

The recommendation should match what the portal already uses. Don't introduce a new chart library if the portal has one.

### D.6 — Schema-first vs prose-first parsing

The canonical files are markdown with YAML blocks. The dashboard needs structured data. Options:

- **D.6.a — Parse markdown + YAML on demand server-side.** Re-parse on each request. Use the existing `_ca_loader.py` pattern.
- **D.6.b — Extend `serialize_build_state.py` to be the canonical parser.** Everything goes through one Python script that produces a rich JSON. Portal consumes the JSON. This becomes the contract.
- **D.6.c — TypeScript parsers in the portal.** Re-implement the parsers in the portal's language. Duplicates logic.

D.6.b is probably right (single canonical parser), but it requires the serializer to grow into a more substantial tool. The plan should evaluate what would have to be added.

### D.7 — Canonical-surface extensions

Some dashboard dimensions don't have canonical sources today (see §6). The plan must decide for each:

- Add the missing canonical surface (new file, governance discipline applies)
- Surface a "data-not-available" placeholder in the dashboard
- Defer the dimension to v0.2

### D.8 — Plan deliverable shape

What does the planning session produce, exactly?

- **D.8.a — One large document** with architecture + file-by-file diff plan + acceptance criteria.
- **D.8.b — Multiple documents:** PLAN.md (architecture decisions), DIFF.md (file-by-file), AC.md (acceptance criteria for implementation), SCHEMA.md (data contracts).
- **D.8.c — One document + sibling artifacts** for any new schemas / contracts that emerge.

The recommendation should match what the implementation session would actually need to read. D.8.c is probably right.

## §6 — Gaps in the current canonical surface

Some things the dashboard needs to surface aren't currently logged anywhere canonical. The plan must address each: propose a minimal extension or accept a "not-tracked-yet" placeholder.

### G.1 — Cowork conversations are not logged

Cowork threads happen in parallel with Claude Code sessions. The build-tracker arc spent significant Cowork time (this very conversation, plus the predecessor planning conversations). None of it appears in canonical files. The dashboard's "parallel workstreams" view is incomplete without it.

Proposal candidate: a new file `00_ARCHITECTURE/COWORK_LEDGER.md` (append-only) listing each Cowork conversation by thread name, purpose, outcomes, which Claude Code sessions it spawned. Updated by Cowork at thread close (low effort: a few lines per thread). Governance impact: new canonical_id, FILE_REGISTRY row, mirror discipline assessment.

### G.2 — Native overrides are not logged

When Claude Code halts and asks the native, and the native overrides the brief's hard constraint (as happened in `Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX` AC.2), that override happens conversationally in Cowork. It's an intervention. The dashboard's "intervention view" should show it.

Proposal candidate: extend `SESSION_CLOSE_TEMPLATE §2` with a `native_overrides[]` block: each entry has the AC overridden, the override rationale (verbatim from the native), and the closing session's notes on how the override affected the deliverable. Or: a separate `00_ARCHITECTURE/NATIVE_OVERRIDES_LEDGER.md`.

### G.3 — Halt-and-ask outcomes are not structured

Briefs contain hard-stop conditions. When a session hits one, it halts. The halt may or may not result in an override (G.2). Either way, the halt itself is a meaningful event that the dashboard should surface separately from a clean-pass session.

Proposal candidate: extend session_close YAML with a `halts_encountered[]` block: each entry has the AC that triggered the halt, the resolution (override / scope-amend / different-approach / abort).

### G.4 — Off-plan vs on-plan classification is implicit

Today, the dashboard would have to infer aside-vs-canonical from `expected_session_class` + naming heuristics. That's brittle.

Proposal candidate: make `expected_session_class` an enum with a fixed set of values: `m2_corpus_execution | governance_aside | planning_only | fix_session | red_team | brief_authoring | native_intervention`. Document the enum in `SESSION_LOG_SCHEMA §X`. Validators check membership.

### G.5 — AC progress isn't tracked mid-session

Briefs have ACs. Sessions either close-with-all-ACs-pass or don't close. The dashboard can show "this session's brief had 11 ACs" only after close. Mid-flight progress isn't visible.

Proposal candidate: optional. The plan can skip this for v1 and revisit if useful.

### G.6 — Parallel workstreams aren't formally enumerated

CLAUDE.md §E names two concurrent workstreams (LEL, Prospective Prediction Logging). The dashboard needs a third: build-tracker / portal infrastructure. And a fourth: governance hygiene (asides like the build-tracker arc). Proposing them all as first-class workstreams with their own status pages would clarify the visibility problem.

Proposal candidate: a `00_ARCHITECTURE/WORKSTREAMS.md` enumerating each parallel workstream, status, last activity, owner. Or: surface them implicitly by parsing session metadata and grouping.

## §7 — Constraints

### Scope (must_not_touch baseline)

The implementation session — and this planning session — must not touch:

- `01_FACTS_LAYER/**` — corpus, off-limits
- `025_HOLISTIC_SYNTHESIS/**` — corpus, off-limits
- `03_DOMAIN_REPORTS/**` — corpus, off-limits
- `04_REMEDIAL_CODEX/**`
- `05_TEMPORAL_ENGINES/**`
- `06_LEARNING_LAYER/**` — pre-build forbidden
- `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` — frozen in v1.0.3
- `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` — frozen
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` — frozen
- `00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md`
- `00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md`
- M2 corpus code: `**/embed.py`, `**/ingest.py`, `**/chunkers/**`

### Scope (may_touch baseline)

The plan may propose touching, with rationale:

- The portal source tree (whatever path it lives at — locate it)
- `platform/scripts/governance/serialize_build_state.py` and its schema (extend the serializer if D.6.b is chosen)
- `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` (if §6 G.2 / G.3 / G.4 are addressed)
- `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` (if any session-log-schema extension)
- `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` (if a new operational rule is added)
- `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` (if a new canonical_id is registered)
- `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` (rows for new files)
- `.geminirules`, `.gemini/project_state.md` (mirror updates if any Claude-side change has Gemini relevance — likely not for portal-internal changes)
- New canonical files proposed in §6 (e.g., `COWORK_LEDGER.md`, `WORKSTREAMS.md`, `NATIVE_OVERRIDES_LEDGER.md`)

### Existing infrastructure to respect

From `project_infra_state` memory:

- Cloud Run service `amjis-web` (asia-south1) — Next.js portal
- Cloud Run service `amjis-sidecar` (asia-south1) — Python sidecar (Swiss Ephemeris, ephemeris compute)
- Cloud SQL `amjis-postgres` (PostgreSQL 15 + pgvector, asia-south1)
- Firebase Auth (Google) — session cookies via `lib/firebase/server.ts`
- Secret Manager: `amjis-db-password`, `amjis-voyage-api-key`
- Cloud Build + Artifact Registry — git-to-image pipeline
- Cloud Load Balancer + static IP `34.54.231.91` — domain `madhav.marsys.in`
- GCS bucket `marsys-jis-build-state` (created at `Madhav_BUILD_TRACKER_GCS_BOOTSTRAP`) — public-read on the single object `build-state.json`
- Existing `lib/db/client.ts` (Pool singleton; Auth Proxy in dev), `lib/storage/client.ts` (GCS helpers), `lib/firebase/server.ts` (Auth Admin) per the memory note.
- 33 source files use the new db/storage clients per the memory.

### Governance discipline

- Standard CLAUDECODE_BRIEF flow for the implementation session: scope declaration at open, ACs at close, drift / schema / mirror exit codes, mirror discipline, SESSION_LOG append.
- This planning session does **not** follow normal close discipline (per §0). It produces the plan and halts.
- The implementation session(s) follow full discipline.

## §8 — What the plan must contain

The plan deliverable (`00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md`) must cover, at minimum:

1. **Architecture summary** — data flow from canonical files through to rendered dashboard, in one diagram + prose.
2. **Decision record** — for each D.1–D.8 in §5, the decision made + rationale + falsifiers.
3. **Data layer plan** — what the serializer (or replacement) reads, what shape the data lands in, where it gets stored / cached / served. Schema definitions for any new structured data.
4. **Component tree** — Next.js page hierarchy (`/build`, `/build/sessions/[id]`, `/build/phases/[id]`, etc.). Per-component: data dependencies, props, refresh behavior.
5. **API / route specs** if any (e.g., `/api/build/state`, `/api/build/sessions`, `/api/build/sse`).
6. **Auth flow** — middleware placement, redirect behavior on unauthorized.
7. **Refresh + caching strategy** — explicit answer to D.2.
8. **Governance integration** — what canonical files change, what new files are created, what FILE_REGISTRY rows get added, what SESSION_CLOSE_TEMPLATE / SESSION_LOG_SCHEMA / ONGOING_HYGIENE_POLICIES extensions are required.
9. **§6 gaps disposition** — for each of G.1–G.6, the decision (address now / address later / accept gap).
10. **File-by-file diff plan** — for the implementation session: every file created, every file edited, with a one-paragraph "what changes" summary per file.
11. **Acceptance criteria for the implementation session** — the same shape as `Madhav_BUILD_TRACKER_*` ACs, testable end-to-end. Probably 12–18 ACs across the implementation surface.
12. **`may_touch` / `must_not_touch` proposal for the implementation session** — based on the file-by-file diff plan.
13. **Session-count estimate for implementation** — 2 sessions? 4? Why?
14. **Test strategy** — how to verify the portal renders correctly across all views. Includes mock data scenarios for testing edge cases (missing fields, unfamiliar session classes, etc.).
15. **Rollout plan** — how to deploy, how to verify in production, rollback plan.
16. **Out-of-scope explicit list** — what this implementation does NOT do (e.g., editing canonical files, mutating state, sending notifications, exposing public endpoints). Anything the user might assume is included but isn't.
17. **Open questions for the native** — anything the planning session couldn't decide and needs the native's input on. The native will resolve these before the implementation session opens.

## §9 — HALT protocol (repeat)

After producing the plan file:

1. Do **not** run `drift_detector.py`, `schema_validator.py`, `mirror_enforcer.py`. The plan file is a draft; it doesn't yet warrant validation.
2. Do **not** append to `SESSION_LOG.md`.
3. Do **not** rotate `CURRENT_STATE.md`.
4. Do **not** modify `CLAUDECODE_BRIEF.md` (note: that file is for `Madhav_M2A_Exec_6` which is the IN_PROGRESS B.4 work — leave it alone).
5. Do **not** touch the portal source tree, even to "preview" how the implementation would look.
6. Do **not** create stub files for the implementation. The plan describes what gets created; it does not pre-create.

Emit a final message of roughly this form:

> Plan produced at `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md`.
> Decisions made on D.1–D.8: [one-line summary each].
> Open questions for the native: [bulleted list, if any].
> Next steps: review the plan, confirm or revise. When ready to implement, switch the executor model from Opus to Sonnet, open a fresh Claude Code session, and instruct it: "Read `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md` and execute it." That session will author its own `CLAUDECODE_BRIEF.md` from the plan's §11 ACs and run normal close discipline.

Then end the session. No further action.

## §10 — Naming conventions

This planning session: `Madhav_PORTAL_BUILD_TRACKER_PLAN_v0_1` per CONVERSATION_NAMING_CONVENTION_v1_0.md. Cowork thread name: `Madhav PORTAL_BUILD_TRACKER_PLAN — v0.1`.

The implementation sessions (when they fire) will be `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1` and follow-ups (`_v0_2` if the v0_1 plan splits into multiple sessions).

The plan artifact: `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md`. Frontmatter `status: DRAFT_PENDING_NATIVE_REVIEW`. After native review and approval, status → `APPROVED_FOR_IMPLEMENTATION`. After implementation completes, status → `IMPLEMENTED` and a pointer to the implementation session's deliverables is appended.

## §11 — A note on tone

The user has explicitly asked for depth. Resist the urge to compress. If you find yourself writing "etc." or "and similar," expand it. If a decision has three real options, list all three with rationale, not the recommended one with a parenthetical. The plan is being read by both the native (who will sanity-check the architectural choices) and the implementation session (which needs the file-by-file diff to be unambiguous).

That said — depth is not the same as bloat. Every paragraph should earn its place. If a section is just restating something the canonical files already say, cite the canonical file and move on. The plan's value is in the connections it draws and the decisions it makes, not in re-deriving the project context from scratch.

---

*End of elaborate.md. Authored by Cowork 2026-04-26 to orient the planning session for the Build Tracker portal component. The planning session is invoked by the native via "Read elaborate.md and follow its instructions" with executor model = Opus 4.6.*
