---
artifact: PORTAL_BUILD_TRACKER_PLAN_v0_1.md
version: 0.1.2
status: IMPLEMENTED
authored_by: Claude Code (Opus 4.6) acting as planning executor
authored_during: Madhav_PORTAL_BUILD_TRACKER_PLAN_v0_1 (planning_only session, halts on plan write)
authored_on: 2026-04-26
decisions_captured_on: 2026-04-26
purpose: >
  Implementation plan for a server-rendered Build Tracker dashboard inside the existing Madhav
  Next.js portal at madhav.marsys.in. Replaces the retired Cowork artifact path (CSP-blocked).
  Native reads canonical files through a server-side data layer (no iframe sandbox), at
  acharya-grade depth across plan / off-plan / intervention / parallel / health / activity views.
governing_clause: >
  CLAUDE.md §I principles (B.1, B.3, B.8, B.10, B.11) apply throughout; ONGOING_HYGIENE_POLICIES
  §C (scope-boundary) governs the implementation session's may_touch / must_not_touch declaration;
  this plan does NOT override CLAUDE.md §C item 0 because the implementation session will author
  its own CLAUDECODE_BRIEF.md from §11 of this document.
target_executor_for_implementation: Claude Code, Sonnet 4.6 (execution / token efficiency)
expected_implementation_session_count: 3 (with the option of a 4th if §6 G.1/G.2/G.4 governance
  extensions need their own dedicated session)
halt_after_plan: true
inputs_read_to_produce_plan:
  - elaborate.md (planning prompt)
  - CLAUDE.md (project mission + principles)
  - CANONICAL_ARTIFACTS_v1_0.md (artifact registry + MP.1–MP.8 mirror inventory)
  - CURRENT_STATE_v1_0.md (state pointer)
  - PHASE_B_PLAN_v1_0.md (M2 sub-phase plan B.0–B.10)
  - SESSION_LOG_SCHEMA_v1_0.md (entry structure)
  - ONGOING_HYGIENE_POLICIES_v1_0.md (§A–§O including §O build-state policy)
  - DISAGREEMENT_REGISTER_v1_0.md (DR schema)
  - CLAUDECODE_BRIEF.md (Madhav_M2A_Exec_6 — IN_PROGRESS; left alone)
  - platform/scripts/governance/serialize_build_state.py (existing serializer)
  - platform/package.json (Next.js 16.2.4, React 19.2.4, Firebase Auth, pg, @google-cloud/storage)
  - platform/src/app/{layout,dashboard/{page,layout},admin/page}.tsx (auth + IA conventions)
  - platform/src/lib/{firebase/server,db/client}.ts (existing infra clients)
---

# PORTAL BUILD TRACKER — Implementation Plan v0.1

*Discovery-phase plan for the Build Tracker portal component. Authored by Claude Code (Opus 4.6) on 2026-04-26 in response to `elaborate.md`. **Status: APPROVED_FOR_IMPLEMENTATION** (native approval captured 2026-04-26 — see §0 below). The implementation session opens against §11 ACs after `Madhav_M2A_Exec_6` closes (per Q.5 below).*

---

## §0 — Decisions captured (native approval 2026-04-26)

This section records the native's approvals and amendments to the v0.1 plan, captured at native review on 2026-04-26. The body of the plan (§1–§19) is **unchanged**; this section is the authoritative ruling on the open questions and amendments. When §0 and the body disagree, §0 wins.

### §0.1 — Q.1 – Q.8 dispositions

| Q | Disposition | Notes |
|---|---|---|
| **Q.1** | **APPROVED.** Hybrid GCS sharding (D.1.e) as specified. Top-level `build-state.json` + per-session shards at `gs://marsys-jis-build-state/sessions/{session_id}.json` + per-phase shards at `gs://marsys-jis-build-state/phases/{phase_id}.json`. | Single-fat-file alternative (D.1.d alone) rejected on render-cost grounds. |
| **Q.2** | **APPROVED with bootstrap requirement.** `00_ARCHITECTURE/COWORK_LEDGER.md` admitted as new canonical artifact (canonical_id `COWORK_LEDGER`, status `LIVING`, mirror_obligations `claude_only`). | Bootstrap rows must explicitly include: (a) this Cowork planning thread (`Madhav PORTAL_BUILD_TRACKER_PLAN — v0.1`); (b) the predecessor BUILD_TRACKER conversations — the AIMJISBuildTracker refresh-fix / GCS-JSON path parent thread; if separable, the `INTEGRATION_v0_1` / `GCS_BOOTSTRAP` / `GCS_PERMISSIONS_FIX` child contexts. The §P "Cowork ledger discipline" rule in `ONGOING_HYGIENE_POLICIES_v1_0.md` MUST specify cadence as **append-on-thread-close** (not append-on-substantive-event), so the rule stays easy to remember and entries stay at ≤5 lines each. |
| **Q.3** | **APPROVED.** `SESSION_CLOSE_TEMPLATE_v1_0.md` extended with optional `native_overrides[]` and `halts_encountered[]` blocks per the plan. LOW finding if absent (existing closed sessions stay valid). | Canonical test case during implementation: the `Madhav_M2A_Exec_5` AC.2 hard-stop / native override is the example these fields are designed to capture. The implementation session MAY backfill that single override into Exec_5's session record as a smoke-test of the schema; otherwise, the fields are populated forward from the next session that has an override or halt to record. |
| **Q.4** | **APPROVED as specified.** Eight-value `expected_session_class` enum: `m2_corpus_execution \| governance_aside \| planning_only \| fix_session \| red_team \| brief_authoring \| native_intervention \| cowork_orchestration`. | **Tagging rule (must be documented in §1.5 enum-addition prose):** future infrastructure-bootstrap sessions (e.g., the planned `Madhav_PORTAL_BUILD_TRACKER_IMPL_*` sessions) map to `governance_aside`, not a ninth value. Document this mapping inline in the SESSION_LOG_SCHEMA §1.5 addition so it is not re-litigated later. |
| **Q.5** | **OPTION (a): implementation opens AFTER `Madhav_M2A_Exec_6` closes.** | Two reasons. (1) Exec_6 is a substantive M2 session (Cloud SQL writes, edge ingestion, RAG graph construction) — splitting attention with a parallel 3-session portal build dilutes both. (2) When the portal launches, having Exec_6 + Exec_7 already closed means the dashboard's first cockpit render shows real B.4 progress, which is the right kind of integration smoke-test. The portal is not urgent enough to justify the parallel-aside path. |
| **Q.6** | **APPROVED — set explicitly.** `BUILD_STATE_GCS_BASE` MUST be set explicitly in Cloud Run env config. | Future-proofs against bucket rename, project migration, or an eventual switch to a signed-URL pattern. `dataSource.ts` MUST document the env var with a fallback to the default public URL for local-dev convenience only. Production must rely on the explicit env var, not the fallback. |
| **Q.7** | **APPROVED — portal verbatim for v0.1.** shadcn primitives + Tailwind + existing fonts (`Inter` sans / `Source Serif 4` serif per `app/layout.tsx`). | No new design surface in v0.1. A v0.2 polish pass can revisit density / "operator console" aesthetic after the cockpit has been used in practice. |
| **Q.8** | **APPROVED — 3 sessions.** Split: v0_1 (serializer + governance extensions); v0_2 (portal data layer + first views); v0_3 (remaining views + verification). | If v0_2 turns out denser than estimated, the implementation session may split organically into `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2` + `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2_continuation` without amending the plan. The session-count is a target, not a hard cap. |

### §0.2 — Amendments captured

#### §0.2.A.1 — FILE_REGISTRY version verification (read-before-bump)

The plan body §8.1 and §10.1.2 reference `FILE_REGISTRY_v1_6.md → v1.7`. The actual current `CURRENT` version on disk may be v1.5 or v1.6 depending on whether intermediate sessions bumped it (Madhav_M2A_Exec_6 was in flight at plan-authoring time and its close-time bump may or may not have landed when the implementation session opens).

**Implementation rule:** the implementation session MUST read `00_ARCHITECTURE/FILE_REGISTRY_v*.md` (and resolve via `CANONICAL_ARTIFACTS §1 FILE_REGISTRY` row) to determine the observed CURRENT version, then bump from THAT observed version — not from the assumed v1.6 named in the plan body. If observed is v1.5, bump to v1.6; if observed is v1.6, bump to v1.7; if observed is v1.7 or later, treat the implementation as a v1.X+1 minor-version amendment and document the surprise in the close-checklist's `prior_narrative_correction` block.

The §A archival policy (`ONGOING_HYGIENE_POLICIES §A`) applies regardless of version: predecessor receives SUPERSEDED banner + frontmatter flip in the same session as the bump.

#### §0.2.A.2 — Governance script report format verification (read-before-build)

The plan body §3.1 reads `00_ARCHITECTURE/drift_reports/*.json`, `schema_reports/*.json`, `mirror_reports/*.json` for the health view's trend visualization. The git status snapshot at plan-authoring time shows existing `drift_reports/`, `schema_reports/`, `mirror_reports/` directories carrying both `.json` and `.md` files (e.g., `DRIFT_REPORT_adhoc_20260426T100940Z.json` AND `.md`). However, the actual coverage and shape of the JSON files is not verified.

**Implementation rule:** the implementation session MUST inspect `00_ARCHITECTURE/{drift,schema,mirror}_reports/` before writing the trend reader. Three branches:

- **(a) JSON sidecars exist for every report and carry exit_code + finding_count fields.** Implement the trend reader as planned in §3.1; populate `governance.scripts_trend.*` arrays with the most recent N=30 entries each.
- **(b) JSON sidecars are partial / inconsistent.** Implementation session decides between extending the governance scripts to emit JSON sidecars consistently (which is out of the implementation session's `may_touch` scope per §12 — `platform/scripts/governance/**` is must_not_touch except for `serialize_build_state.py` and the schemas) and surfacing only the most-recent exit-code triple in v0.1 with the trend visualization deferred to v0.2.
- **(c) Reports are markdown-only.** Surface only the most-recent exit-code triple in v0.1; defer trend visualization to v0.2; document the deferral in §3.4 as a footnote (per the amendment instruction).

The implementation session's choice between (a)/(b)/(c) MUST be documented as a footnote appended to the plan body's §3.4 ("What we *do not* serialize") at the time of the implementation session, named `§3.4 Footnote — A.2 disposition (added <YYYY-MM-DD> by <session_id>)`.

**Important:** because `platform/scripts/governance/**` (other than the named files in §12 `may_touch`) is `must_not_touch` for v0.1 portal scope, branch (b)'s "extend the governance scripts to emit JSON sidecars" path requires either a scope amendment (native-approved) or a separate `fix_session`-class session. The implementation session SHOULD prefer branch (c) over branch (b) for v0.1 unless a JSON sidecar can be added trivially as part of `serialize_build_state.py` itself (e.g., the serializer reads the markdown reports and synthesizes its own sidecar — that *is* in scope).

### §0.3 — Pre-implementation gating

The following preconditions MUST hold before the implementation session opens:

1. `Madhav_M2A_Exec_6` is CLOSED (status: clean close or partial-close-resolved). Verify via `CURRENT_STATE_v1_0.md §2 last_session_id` and `last_session_close_state`.
2. `Madhav_M2A_Exec_7` (B.4 Task 3 + B.4 phase final close) has either CLOSED, or the native has authorized opening the portal-build session ahead of Exec_7. Strict reading of Q.5 disposition allows the portal build to open *immediately* after Exec_6 close; Exec_7 is not a hard precondition.
3. `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md` (this file) status is `APPROVED_FOR_IMPLEMENTATION` (set 2026-04-26 in this same amendment).

The implementation session reads this amended plan as its primary input, authors a fresh `CLAUDECODE_BRIEF.md` from §11 ACs (per §17 Q.5 ordering), and runs full session-close discipline.

---

## §1 — Architecture summary

### 1.1 Data flow (one diagram)

```
                             ┌──────────────────────────────────────────┐
                             │        Local repo on user's Mac         │
                             │                                          │
                             │  00_ARCHITECTURE/                        │
                             │   ├── CURRENT_STATE_v1_0.md  (YAML §2)  │
                             │   ├── CANONICAL_ARTIFACTS_v1_0.md       │
                             │   ├── SESSION_LOG.md         (~7500 ln) │
                             │   ├── ONGOING_HYGIENE_POLICIES_v1_0.md  │
                             │   ├── NATIVE_DIRECTIVES_FOR_REVISION    │
                             │   ├── DISAGREEMENT_REGISTER_v1_0.md     │
                             │   ├── STALENESS_REGISTER.md             │
                             │   ├── PHASE_B_PLAN_v1_0.md              │
                             │   ├── MACRO_PLAN_v2_0.md                │
                             │   ├── drift_reports/ schema_reports/    │
                             │   │   mirror_reports/                    │
                             │   ├── (NEW) COWORK_LEDGER.md            │
                             │   └── (NEW) WORKSTREAMS.md (deferred)   │
                             │                                          │
                             │  CLAUDECODE_BRIEF.md (root, optional)   │
                             │  verification_artifacts/RAG/RED_TEAM_*  │
                             └──────────────┬───────────────────────────┘
                                            │
                                            │ (1) at session close — every session
                                            ▼
            ┌──────────────────────────────────────────────────┐
            │ platform/scripts/governance/                     │
            │   serialize_build_state.py  (extended at v0.2.0)  │
            │                                                   │
            │ Reads all sources → emits THREE artifacts:       │
            │   • build_state.json     (cockpit + indexes)     │
            │   • sessions/{id}.json   (per-session detail)    │
            │   • phases/{phase_id}.json (per-phase rollup)    │
            │                                                   │
            │ Validates each against build_state.schema.json   │
            │ Uploads atomically to GCS                        │
            └──────────────┬───────────────────────────────────┘
                           │
                           │ (2) gsutil cp / google-cloud-storage SDK
                           ▼
                ┌────────────────────────────────────────┐
                │ gs://marsys-jis-build-state/           │
                │   build-state.json    (top-level)      │
                │   sessions/{id}.json  (one per close)  │
                │   phases/{phase_id}.json               │
                │   workstreams.json    (v0.2)           │
                │                                          │
                │ public-read (objectViewer/allUsers);    │
                │ CORS allows *; cache-control max-age=60 │
                └──────────────┬─────────────────────────┘
                               │
                               │ (3) HTTPS GET — server-side, no CSP issue
                               ▼
        ┌────────────────────────────────────────────────────────────┐
        │ Cloud Run: amjis-web (Next.js 16.2.4 RSC, asia-south1)     │
        │                                                              │
        │ /build                              [route group]            │
        │   /build/page.tsx              ── Cockpit / Overview         │
        │   /build/plan/page.tsx         ── Plan view (B.0–B.10 + M)   │
        │   /build/sessions/page.tsx     ── Session log table          │
        │   /build/sessions/[id]/page.tsx── Session drill-down         │
        │   /build/phases/[id]/page.tsx  ── Phase drill-down           │
        │   /build/interventions/page    ── Red-team / ND / DR / halt  │
        │   /build/parallel/page         ── LEL, PPL, Cowork, mirror   │
        │   /build/health/page           ── Drift/schema/mirror trend  │
        │   /build/activity/page         ── Reverse-chron feed         │
        │   /build/registry/page         ── Canonical artifact table   │
        │                                                              │
        │ All pages: getServerUserWithProfile() guard → 'super_admin'  │
        │ All pages: lib/build/dataSource.ts fetches from GCS           │
        │ Refresh: ↺ button = revalidatePath('/build/...')             │
        └──────────────────────────────────────────────────────────────┘
                               ▲
                               │ user clicks ↺
                               │ Browser ↔ Cloud Run (ordinary HTTPS;
                               │ Firebase session cookie carries auth)
                               │
                       ┌───────┴────────┐
                       │ Native's browser│
                       │ madhav.marsys.in│
                       └─────────────────┘
```

### 1.2 Architecture in prose (3 sentences)

The implementation extends the existing `serialize_build_state.py` to emit a richer JSON corpus (one top-level state file plus per-session and per-phase detail files) at every session close, uploads it atomically to the existing public-read GCS bucket, and adds a server-rendered `/build` route group inside the Next.js portal that consumes those JSON files server-side, sidestepping the Cowork iframe CSP that broke the prior artifact path. Authentication piggybacks on the portal's existing Firebase Auth + `super_admin` role gate (`getServerUserWithProfile()`), and the IA places the dashboard alongside `/dashboard` and `/admin` rather than replacing either. Refresh is "click-to-refetch": React Server Components re-render from the latest GCS object on each request — sub-second, no caching layer in v0.1 — leaving SSE / live file-watcher as a v0.2 enhancement once the v0.1 surface is in production.

### 1.3 Boundary with existing infrastructure

| Existing | This plan touches it as | Reason |
|---|---|---|
| Cloud Run `amjis-web` | Adds new route group `/build` | Same service; same auth; new pages only |
| Firebase Auth + `profiles.role` | Reuses `getServerUserWithProfile()` middleware | No new auth code; same gate as `/dashboard/layout.tsx` |
| Cloud SQL `amjis-postgres` | Not touched | Build-tracker reads canonical files via GCS, not DB |
| GCS `marsys-jis-build-state` bucket | Adds objects under `sessions/*` + `phases/*` prefixes | Bucket already public-read + CORS configured (Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX) |
| `serialize_build_state.py` v0.1.0 | Bumps to v0.2.0; backward-compatible JSON shape (additive fields) | One canonical parser per D.6.b |
| Cowork artifact `amjis-build-tracker` | Retired (separate native action; not in this plan's scope) | The artifact remains broken; the portal supersedes it |

---

## §2 — Decision record (D.1 – D.8)

For each decision: enumerated options, recommendation, rationale, and the falsifier that would invalidate the recommendation.

### D.1 — How does canonical state reach Cloud Run?

**Options reviewed:**

- **D.1.a — Bake repo into Docker image.** Rejected. Image lag (Cloud Build cycle ≈ 3–5 min) defeats sub-second refresh; every state change requires a redeploy.
- **D.1.b — Git-pull on each request.** Rejected. Requires the Cloud Run container to hold git credentials and an up-to-date remote; the user does not push every session close, so freshness depends on a behaviour the user has not committed to. Also: pulling a 7,498-line SESSION_LOG on every request is a wasteful round-trip when only deltas matter.
- **D.1.c — GCS sync of `00_ARCHITECTURE/` directory.** Rejected as primary mechanism (kept as a fallback for full-text drill-down — see §3.4 below). Adds a close-hook step that rsyncs ~30 markdown files; latency is bounded but still requires the portal to parse markdown server-side at each request. We already have a serializer; using it is cheaper than re-parsing.
- **D.1.d — Read only from `build_state.json` GCS object (extended).** Recommended for v0.1 cockpit / health / overview / plan / activity views. The serializer becomes the canonical parser per D.6.b. Risk: a single ~200 KB JSON gets reloaded on every page in the route group. Mitigated by §1.2 (server-side fetch is one HTTP round-trip per request; GCS edge-cached at `cache-control: public, max-age=60`).
- **D.1.e — Hybrid: D.1.d for indexes + per-session/per-phase JSON shards for drill-down.** **RECOMMENDED.**

**Recommendation: D.1.e (hybrid).**

Top-level `build-state.json` carries the cockpit, indexes (one row per session, one row per phase, one row per ND, one row per DR, one row per artifact), and the activity feed metadata. Per-session JSON files at `gs://marsys-jis-build-state/sessions/{session_id}.json` carry session_open + body + session_close + files_touched + drift/schema/mirror reports — these are loaded only when the user clicks into a session. Per-phase JSON files at `gs://marsys-jis-build-state/phases/{phase_id}.json` (`B.4`, `M2`, etc.) carry the rollup of every session that touched the phase, plus AC progress. The serializer emits all three at every session close.

**Rationale.** The user wants depth, but depth doesn't have to mean a single fat blob. Sharding by session_id + phase_id keeps the top-level payload small (cockpit < 50 KB), allows cheap cache invalidation per shard, and lets drill-down views fetch only what they render. The existing `serialize_build_state.py` already reads four canonical files; extending it to emit shards is additive code, not a rewrite.

**Falsifier.** If a future need requires a dimension that the serializer cannot reasonably extract (e.g., live mid-session AC progress where the brief is being edited concurrently), this hybrid breaks down and we move toward D.1.c (GCS-synced architecture directory) or D.1.b (git pull). v0.2 SSE plan handles the "live during a session" case via a different mechanism (file-watcher on the user's Mac pushing to a Pub/Sub topic) — see §7.

**State-of-the-data caveat.** The shards are written at session close. Mid-session state (an in-progress brief, a half-edited file) is not reflected until the session closes. The cockpit makes this explicit via `last_session_closed_at` timestamp + a `staleness_seconds_since_last_close` field rendered in the header. The v0.2 SSE channel is what closes the mid-session-staleness gap.

### D.2 — Refresh strategy

**Options reviewed:**

- **D.2.a — Server-side render on every request, no caching.** Recommended for v0.1.
- **D.2.b — Server-side render with short-TTL cache (30 s).** Deferred to v0.2 unless contention is observed; Next.js 16 RSC caching primitives let us layer this in without refactor.
- **D.2.c — Server-side render + SSE channel for live updates.** Deferred to v0.2 (separate work, see §7).
- **D.2.d — Cron-based DB snapshot.** Rejected. Adds Cloud SQL row-lifecycle to a system whose canonical sources are already files; introduces a third source of truth.

**Recommendation: D.2.a + explicit ↺ button.**

Each `/build/*` page is a React Server Component that re-fetches from GCS on every request. The ↺ button is just a `router.refresh()` call (Next.js App Router) that invalidates the current segment's cache. With Next 16 + RSC, no client-side data store is needed.

**Rationale.** The user is the only person looking at this dashboard. There is no traffic-volume reason to cache. Sub-second freshness is the requirement; D.2.a meets it. The GCS object's own `cache-control: public, max-age=60` provides a ceiling on staleness when a fresh upload coincides with a refresh click — acceptable because the staleness window is bounded by the session-close cadence (which is at minimum minutes apart).

**Falsifier.** If the user invites a second viewer (advisor, collaborator, hypothetical reviewer) and the dashboard starts seeing simultaneous tabs, D.2.b becomes worth the complexity. Until then, D.2.a is correct.

### D.3 — Where in the portal does the build component live?

**Options reviewed:**

- **D.3.a — Standalone `/build` route.** Recommended.
- **D.3.b — Integrated into existing nav.** Recommended *in addition*: a "Build" link in `DashboardHeader` (super_admin only).
- **D.3.c — Modal / drawer overlay.** Rejected. Twelve dense views need full-page real estate.
- **D.3.d — Admin sub-route.** Rejected as the primary surface (the build tracker is not an admin function — it is the native's own cockpit). However, the auth gate is the same as the admin panel's (super_admin), so we re-use `getServerUserWithProfile()`.

**Recommendation: D.3.a + D.3.b.**

`/build/*` is the URL hierarchy; a single nav link lands the user at `/build` (the Cockpit). Each sub-view is its own bookmarkable URL. The portal's existing IA already has `/dashboard`, `/admin`, `/clients/[id]/{build,consume}`, and `/share/[slug]`; `/build` slots in alongside `/admin` as a top-level operator-only surface.

**Rationale.** Bookmarkability matters for the native's working pattern (deep links from external notes, Slack, Cowork conversation memory). Modal / drawer would lose the URL surface. Re-using `DashboardLayout`'s shell (`DashboardHeader` + container) gives us free access to the existing super_admin badge, sign-out flow, and theme management.

**Falsifier.** If the portal IA is being restructured (the `/dashboard` → `/clients` migration was recent per `clients/` route), we revisit. As of 2026-04-26 the IA is stable.

### D.4 — Auth scope

**Options reviewed:**

- **D.4.a — Firebase Auth, native-only via email match.** Acceptable fallback if the role machinery is unreliable.
- **D.4.b — Firebase Auth + super_admin role check via `getServerUserWithProfile()`.** Recommended.
- **D.4.c — No auth (public).** Rejected for the obvious reason: governance metadata + intervention details are not for public consumption.

**Recommendation: D.4.b.**

The portal already has `lib/auth/access-control.ts::getServerUserWithProfile()` which returns `{ user, profile }` where `profile.role` is one of `super_admin | client | ...` (per the existing `profiles` table inferred from `dashboard/layout.tsx` and `admin/page.tsx`). The `/build` layout file gates on `ctx.profile.role !== 'super_admin' → redirect('/dashboard')`. This is the same gate `/admin/layout.tsx` uses; there is no new auth surface to build.

**Rationale.** Re-use the existing role machinery. If the role is ever wrong (e.g., the native's account is somehow not super_admin), the immediate symptom is a redirect; that is the desired failure mode.

**Falsifier.** If a future requirement admits a second role (e.g., `auditor` who can read but not act), we extend the gate to `role in ('super_admin', 'auditor')`. The single-role check today is the simplest correct gate.

### D.5 — Visualization library

**Options reviewed:**

- **D.5.a — Plain HTML + CSS + minimal JS.** What the Cowork artifact used.
- **D.5.b — Recharts (React).** Ergonomic for sparklines / progress bars.
- **D.5.c — Chart.js.** No reason to add a non-React library to a React codebase.
- **D.5.d — Custom SVG components.** Maximum control; more code.

**Recommendation: D.5.a + D.5.d for v0.1.**

The portal already has `tailwindcss@4`, `framer-motion@12`, `lucide-react@1.8`, and Tailwind component primitives via `shadcn`. For v0.1 we use Tailwind + a small set of custom SVG sparkline components (≤ 100 lines total). No new dependency for v0.1.

If v0.2 grows the visualization need (cohort distributions, dasha-window timelines, prediction-vs-outcome scatter), we add `recharts` as a single dep and migrate the v0.1 custom SVGs to Recharts equivalents — that migration cost is small because the v0.1 sparklines are the only chart-like elements.

**Rationale.** The portal's bundle is already large; adding Recharts now for ~5 sparklines is over-investment. shadcn-style cards + Tailwind progress bars + a 60-line SVG sparkline component cover v0.1 needs.

**Falsifier.** If v0.1 visual review reveals more chart types are needed (e.g., per-domain edge-count distribution histograms for B.4 acceptance), we cut Recharts in. Booked as a v0.2 candidate, not a blocker.

### D.6 — Schema-first vs prose-first parsing

**Options reviewed:**

- **D.6.a — Parse markdown + YAML on demand server-side.** Re-parses on each request.
- **D.6.b — Extend `serialize_build_state.py` to be the canonical parser.** Recommended.
- **D.6.c — TypeScript parsers in the portal.** Rejected — duplicates Python loader logic.

**Recommendation: D.6.b.**

`serialize_build_state.py` is the canonical parser; it already reads four files via the existing `_ca_loader.py`. The implementation extends it with three readers (NATIVE_DIRECTIVES, DISAGREEMENT_REGISTER, STALENESS_REGISTER), three new emitters (per-session / per-phase / workstreams), and a stricter schema. The portal consumes JSON only.

**Rationale.** Single canonical parser. Single rotation point. The portal becomes a pure rendering layer.

**Falsifier.** If the JSON shape gets unwieldy enough that the serializer becomes a maintenance burden (>1500 lines), we split it into multiple Python modules under `platform/scripts/governance/build_state/`. Today the file is ~425 lines and clean.

### D.7 — Canonical-surface extensions

The §6 gaps are addressed individually; the resolution table is at §6's end.

### D.8 — Plan deliverable shape

**Options reviewed:**

- **D.8.a — One large document.** Recommended (this file).
- **D.8.b — Multiple documents.** Rejected — the implementation session reads one plan and acts; multiple files dilute attention.
- **D.8.c — One document + sibling artifacts authored later.** Compatible with our recommendation: the JSON schemas in §3.5 and §6 governance extensions are *authored by the implementation session*, not pre-authored here.

**Recommendation: D.8.a.**

This single file contains every decision, file-by-file diff, and AC. The implementation session will produce the JSON schemas, the new TypeScript modules, and any §6 governance-surface additions during execution per the file-by-file plan in §10.

---

## §3 — Data layer plan

### 3.1 What the serializer reads

| Source file | Section | Used for |
|---|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | §2 YAML block | cockpit pointer (active phase / sub-phase / last + next session / red_team_counter) |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | §1 + §2 YAML blocks | artifact registry view; mirror-pair freshness for parallel view |
| `00_ARCHITECTURE/SESSION_LOG.md` | All `## ` headers + body content (legacy + post-Step-10 schema-conformant) | session log table; per-session detail; activity feed |
| `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | §2 entry structure | parser dispatch (legacy markdown header vs schema YAML extraction) |
| `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` | §H quarterly-pass date; §G red-team threshold | health view countdown; cockpit red-team gauge |
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | §"Ten macro-phase arc"; §IS.8 cadence | macro arc view; phase rollup |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | §G B.0–B.10 task tables; acceptance criteria | plan view; per-phase rollup |
| `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` | All ND.N entries + status | intervention view ND list; cockpit open-ND count |
| `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` | §4 entry table (currently empty) | intervention view DR list; cockpit open-DR count |
| `00_ARCHITECTURE/STALENESS_REGISTER.md` | rows + dates | parallel/health view; staleness countdown per artifact |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | §C five-layer summary | macro arc view sidebar |
| `00_ARCHITECTURE/drift_reports/*.json` | most recent N (e.g., 30) | health view drift trend |
| `00_ARCHITECTURE/schema_reports/*.json` | most recent N | health view schema trend |
| `00_ARCHITECTURE/mirror_reports/*.json` | most recent N | health view mirror trend; mirror-pair last-verified-session |
| `verification_artifacts/RAG/RED_TEAM_*.md` | verdict + findings + residuals | intervention view red-team list |
| `CLAUDECODE_BRIEF.md` (root, if present and `status != COMPLETE`) | frontmatter + AC list | brief view; current-execution panel |
| **NEW** `00_ARCHITECTURE/COWORK_LEDGER.md` (per §6 G.1) | thread entries | parallel view Cowork list (graceful "data-not-available" if file missing) |

### 3.2 Output shape — three artifacts

#### 3.2.1 Top-level `build_state.json` (~50–80 KB compressed)

Extends the existing v0.1.0 shape (additive only; no breaking changes). New top-level keys:

```json
{
  "schema_version": "0.2.0",
  "generated_at": "...",
  "generated_by_session": "...",
  "generator_version": "0.2.0",
  "source_fingerprints": { "...": "sha256" },
  "macro_phase": { "id":"M2","title":"Corpus Activation","status":"active",
                   "macro_arc": [{"id":"M1","title":"Corpus Completeness","status":"completed"}, ...] },
  "phase_plan": { "...existing v0.1...", "sub_phases": [
        {"id":"B.0","title":"Foundations","status":"completed",
         "session_count_actual":1,"session_count_estimated":1,
         "ac_total":7,"ac_passed":7,"sessions_consumed":["Madhav_15_..."]},
        {"id":"B.4","title":"Graph Construction","status":"in_progress",
         "session_count_actual":1,"session_count_estimated":2,...}
   ]},
  "governance": { "...existing...", "scripts_trend": {
        "drift_detector": [{"session_id":"...", "exit":2,"finding_count":59}, ...],
        "schema_validator": [...], "mirror_enforcer": [...]
   }},
  "last_session": { "...existing..." },
  "next_session": { "...existing..." },
  "native_directives": { "...existing v0.1, plus": "entries":[
        {"nd_id":"ND.1","status":"addressed","title":"Mirror Discipline",
         "issued_on":"...","addressed_on":"2026-04-24","consumption_matrix":[...]}
   ]},
  "disagreement_register": { "open_count": 0, "resolved_count": 0,
        "entries": [...] },                    // currently empty
  "canonical_artifacts": [...existing...],
  "mirror_pairs": [...existing v0.1, plus": last_verified_session, days_since_verified ],
  "red_team_passes": [
        {"session_id":"Madhav_M2A_Exec_5","verdict":"PASS","findings":[...],
         "residuals":["KR-1","KR-2"],"performed_on":"2026-04-26",
         "report_path":"verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md"}, ...
  ],
  "staleness_register": [
        {"path":"03_DOMAIN_REPORTS/career_v6_partial.md","since":"2026-03-12","reason":"FORENSIC v6→v8"}
  ],
  "current_brief": null | { "session_id":"Madhav_M2A_Exec_6","status":"IN_PROGRESS",
        "ac_total":19,"ac_passed_known":0, "may_touch":[...], "must_not_touch":[...] },
  "sessions_index": [
        {"session_id":"...","title":"...","date":"...","class":"m2_corpus_execution",
         "phase_id":"B.4","drift_exit":2,"schema_exit":2,"mirror_exit":0,
         "deliverable_one_liner":"...","detail_shard":"sessions/Madhav_M2A_Exec_6.json"}
   ],
  "phases_index": [
        {"phase_id":"B.4","detail_shard":"phases/B.4.json","status":"in_progress","...":...}
   ],
  "cowork_ledger": [   // per §6 G.1; empty array if COWORK_LEDGER.md absent
        {"thread_name":"Madhav PORTAL_BUILD_TRACKER_PLAN — v0.1","opened_on":"2026-04-26",
         "purpose":"...","outcomes":["this plan"], "spawned_sessions":[]}
   ],
  "workstreams": [    // per §6 G.6 (deferred to v0.2 file); v0.1 emits a hard-coded list
        {"id":"LEL","title":"Life Event Log maintenance","status":"current","last_activity":"2026-04-25"},
        {"id":"PPL","title":"Prospective prediction logging","status":"substrate_only"},
        {"id":"BUILD_TRACKER","title":"Build tracker / portal","status":"in_progress"},
        {"id":"GOVERNANCE_HYGIENE","title":"Governance asides","status":"recurring"}
  ]
}
```

#### 3.2.2 Per-session detail `sessions/{session_id}.json` (5–50 KB each)

```json
{
  "session_id": "Madhav_M2A_Exec_6",
  "schema_version": "0.2.0",
  "header": {"date":"2026-04-26","title":"B.4 Graph Construction Session 1 of 2",
             "agent":"claude-sonnet-4-6","cowork_thread":"Madhav M2A-Exec-6 — B.4 RAG Query Engine"},
  "session_open": { ...verbatim YAML block extracted from SESSION_LOG entry... },
  "session_close": { ...verbatim YAML block, including files_touched, drift_exit, etc... },
  "body_excerpts": {
        "objective":"...", "outputs_produced":["..."], "outcome_narrative":"...",
        "scope_discipline":"..."
  },
  "files_touched": [{"path":"...","reason":"..."}],
  "deliverables": ["cgm_edges_manifest_v1_0.json", "rag/graph.py", "..."],
  "residuals": ["KR-1 still open at file-side; DB-side closed this session"],
  "linked_reports": {
        "drift": "drift_reports/DRIFT_REPORT_..._JSON",
        "schema":"schema_reports/...","mirror":"mirror_reports/..."
  },
  "halts_encountered": [ /* §6 G.3 — empty until template extension lands */ ],
  "native_overrides":  [ /* §6 G.2 — empty until template extension lands */ ],
  "phase_id": "B.4",
  "session_class": "m2_corpus_execution",  /* §6 G.4 enum */
  "previous_session_id": "Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX",
  "next_session_id": null
}
```

For legacy entries (pre-Step-10), the parser falls back to header + body-text extraction; YAML blocks are absent → those fields are `null` and the UI renders "[legacy entry — no structured YAML]".

#### 3.2.3 Per-phase rollup `phases/{phase_id}.json` (10–100 KB each)

```json
{
  "phase_id": "B.4",
  "schema_version": "0.2.0",
  "title": "Graph Construction",
  "macro_phase": "M2",
  "spec_pointer": "00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md#phase-b4-graph-construction",
  "status": "in_progress",
  "session_count_actual": 1,
  "session_count_estimated": 2,
  "sessions": [
        {"session_id":"Madhav_M2A_Exec_6","contribution":"Tasks 1+2+4+5; DB ACs blocked",
         "deliverables":["cgm_edges_manifest_v1_0.json","rag/graph.py","..."],
         "residuals_carry_forward":["AC.4-9 DB-blocked"]}
  ],
  "acceptance_criteria": [
        {"ac_id":"AC.13.B.4 node count","status":"deferred_to_session_2"}
  ],
  "deliverables_complete": ["cgm_edges_manifest_v1_0.json","rag/graph.py"],
  "deliverables_pending":  ["B.4 graph.json export","SUPPORTS edges manifest"],
  "dependencies_inbound":  ["B.3.5 (CGM_v9_0 nodes)","B.3 (HNSW)"],
  "dependencies_outbound": ["B.5 (discovery patterns over the graph)"]
}
```

### 3.3 Schema definitions

The implementation session authors:

- `platform/scripts/governance/schemas/build_state.schema.json` (extends v0.1; bump to v0.2)
- `platform/scripts/governance/schemas/build_state_session_detail.schema.json` (NEW)
- `platform/scripts/governance/schemas/build_state_phase_detail.schema.json` (NEW)

All three are validated by the serializer pre-upload (`--validate-against-schema`). An invalid shard fails the close per `ONGOING_HYGIENE_POLICIES §O` failure-mode (`build_state_serialization_failed` HIGH).

### 3.4 What we *do not* serialize

- Full SESSION_LOG body text (we extract `objective`, `outputs_produced`, `outcome_narrative`, `scope_discipline`; the rest is rendered by linking back to the markdown source on GitHub or local file path).
- Full markdown of canonical files (the cockpit shows fingerprint + version + last_verified_session; full text is one click away via the registry view's "view source" link, which opens GitHub blob view if the repo is pushed, else a local-file-path display the native can copy).
- DB-side state (`rag_chunks` row counts, embedding counts) — that's RAG-build state, not governance-build state. The portal could be extended later if the user wants RAG metrics in the same surface; out of scope for v0.1.

### 3.5 Storage / cache / serve

| Artifact | Storage | Cache-control | Refresh trigger | Reader |
|---|---|---|---|---|
| `build_state.json` | `gs://marsys-jis-build-state/build-state.json` | `public, max-age=60` | Every session close | `lib/build/dataSource.ts::fetchBuildState()` |
| `sessions/{id}.json` | `gs://marsys-jis-build-state/sessions/{id}.json` | `public, max-age=300` | Session close (only the closing session's shard updated) | `fetchSessionDetail(id)` |
| `phases/{id}.json` | `gs://marsys-jis-build-state/phases/{id}.json` | `public, max-age=120` | Sessions close that touch the phase | `fetchPhaseDetail(id)` |

CORS already allows `*` per `Madhav_BUILD_TRACKER_GCS_PERMISSIONS_FIX`. The portal does **server-side** fetches; CORS is not strictly required for the server fetch, but is preserved so a future client-side widget could read directly.

---

## §4 — Component tree

Next.js 16 App Router conventions. All `/build/*` pages are **React Server Components** (default). Client interactivity is opt-in via `'use client'` in the leaf interactive components (sortable tables, filter dropdowns, ↺ button).

```
platform/src/app/build/
├── layout.tsx                      // RSC; auth gate (super_admin); BuildHeader; nav
├── page.tsx                        // RSC; the Cockpit (overview)
├── plan/
│   ├── page.tsx                    // RSC; B.0–B.10 plan grid + macro arc strip
│   └── [phase_id]/page.tsx         // RSC; per-phase drill-down
├── sessions/
│   ├── page.tsx                    // RSC; session table (filter+sort via client child)
│   └── [session_id]/page.tsx       // RSC; per-session drill-down
├── interventions/
│   └── page.tsx                    // RSC; red-team / ND / DR / halts
├── parallel/
│   └── page.tsx                    // RSC; LEL, PPL, Cowork, mirror pairs
├── health/
│   └── page.tsx                    // RSC; drift/schema/mirror trend charts
├── activity/
│   └── page.tsx                    // RSC; reverse-chron session feed
├── registry/
│   └── page.tsx                    // RSC; canonical artifact table
└── error.tsx                       // RSC; 'use client' optional; standard next error boundary
```

Library code (server-only):

```
platform/src/lib/build/
├── dataSource.ts                   // server-only; fetches GCS objects
├── types.ts                        // TS types mirroring the JSON schemas
├── format.ts                       // formatters (relative-time, exit-code badge, etc.)
└── parsers/
    ├── currentState.ts             // (light validation only — JSON already validated)
    └── sessionClass.ts             // enum normalizer per §6 G.4
```

UI components (`platform/src/components/build/*`):

```
platform/src/components/build/
├── BuildHeader.tsx                 // 'use client'; nav links + refresh button
├── CockpitGrid.tsx                 // RSC; composes Cards
├── PhaseGrid.tsx                   // RSC; B.0–B.10 grid with status pills
├── SessionTable.tsx                // 'use client'; sortable + filterable
├── SessionDetail.tsx               // RSC; renders one session shard
├── PhaseDetail.tsx                 // RSC
├── InterventionList.tsx            // RSC; red-team / ND / DR sections
├── HealthTrend.tsx                 // 'use client'; small SVG sparklines (D.5 choice)
├── HealthSparkline.tsx             // 'use client'; primitive
├── ActivityFeed.tsx                // RSC; reverse-chron card list
├── RegistryTable.tsx               // 'use client'; sortable
├── MirrorPairsTable.tsx            // RSC
├── BriefPanel.tsx                  // RSC; current-brief surface
├── ScriptVerdictBadge.tsx          // RSC; reusable exit-code → badge mapping
├── StatusPill.tsx                  // RSC; reusable
└── RefreshButton.tsx               // 'use client'; calls router.refresh()
```

Per-component data dependency:

| Component | Reads | Refresh on |
|---|---|---|
| CockpitGrid | `build_state.json::{macro_phase, phase_plan, governance, last_session, next_session}` | request |
| PhaseGrid | `build_state.json::phase_plan.sub_phases[]` | request |
| SessionTable | `build_state.json::sessions_index[]` | request; client-side filter/sort no refetch |
| SessionDetail | `sessions/{id}.json` | request |
| PhaseDetail | `phases/{phase_id}.json` | request |
| InterventionList | `build_state.json::{red_team_passes, native_directives, disagreement_register}` | request |
| HealthTrend | `build_state.json::governance.scripts_trend.*` | request |
| ActivityFeed | `build_state.json::sessions_index[]` (newest 20) | request |
| RegistryTable | `build_state.json::canonical_artifacts[]` | request |
| MirrorPairsTable | `build_state.json::mirror_pairs[]` | request |
| BriefPanel | `build_state.json::current_brief` (null if no brief or COMPLETE) | request |

Refresh behaviour: every page is `dynamic = 'force-dynamic'` (Next 16 RSC) so each request re-fetches. The ↺ button calls `router.refresh()` — for the user this looks like sub-second.

---

## §5 — API / route specs

v0.1 has **no new API routes**. All data flows through server-side fetches inside RSCs. No `/api/build/*` endpoints in v0.1.

**Justification.** With server-side rendering, the pages themselves are the API. Adding `/api/build/state` would only be useful to a JS client (not present in v0.1) or to an external consumer (out of scope).

**v0.2 additions** (named here for visibility, not implemented):

- `/api/build/sse` — Server-Sent Events stream pushing file-change events; powered by a watchdog daemon on the user's Mac that publishes to Cloud Pub/Sub or directly hits a Cloud Run endpoint.
- `/api/build/state` — JSON pass-through for external scripts (curl / external cron).

---

## §6 — Auth flow

`/build/layout.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { getServerUserWithProfile } from '@/lib/auth/access-control'
import { BuildHeader } from '@/components/build/BuildHeader'

export default async function BuildLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getServerUserWithProfile()
  if (!ctx) redirect('/login')
  if (ctx.profile.status !== 'active') redirect('/login')
  if (ctx.profile.role !== 'super_admin') redirect('/dashboard')

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <BuildHeader userInitial={(ctx.user.email?.[0] ?? 'U').toUpperCase()} />
      {children}
    </div>
  )
}
```

This mirrors `dashboard/layout.tsx` exactly, with the additional super_admin check (which `dashboard/layout.tsx` does not have because clients also use it).

**Failure modes:**

- No session → redirect `/login` (existing portal behaviour).
- Suspended account → redirect `/login` (matches `dashboard/layout.tsx`).
- Authenticated but not super_admin → redirect `/dashboard` (graceful: the user lands on a page they can use).

---

## §7 — Refresh + caching strategy (explicit answer to D.2)

| Layer | v0.1 | v0.2 |
|---|---|---|
| RSC fetch | `force-dynamic`, no Next.js cache | + `revalidate = 30` for non-cockpit views |
| GCS object | `cache-control: public, max-age=60` (existing) | unchanged |
| Browser | no client-side cache (RSC) | service-worker prefetch (probably overkill) |
| Refresh trigger | ↺ button (`router.refresh()`) + page reload | + SSE events from a v0.2 daemon → auto-refresh affected segments |
| Mid-session staleness | exposed via `staleness_seconds_since_last_close` field | reduced to seconds via SSE channel |

The freshness contract for v0.1: **data is current as of the last session close**, which the cockpit displays prominently. If the user wants to see mid-session state (e.g., a brief is being edited but the session has not closed), v0.1 cannot show it; v0.2 adds the file-watcher daemon that does.

---

## §8 — Governance integration

### 8.1 Files modified by the implementation (governance side)

| File | Change | Rationale |
|---|---|---|
| `platform/scripts/governance/serialize_build_state.py` | v0.1.0 → v0.2.0; add three readers + three emitters | D.6.b |
| `platform/scripts/governance/schemas/build_state.schema.json` | v0.1 → v0.2 (additive) | shape extended |
| `platform/scripts/governance/schemas/build_state_session_detail.schema.json` | NEW | per-session shard |
| `platform/scripts/governance/schemas/build_state_phase_detail.schema.json` | NEW | per-phase shard |
| `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` | extend with optional `native_overrides[]` and `halts_encountered[]` blocks (per §6 G.2 + G.3) | gap closure |
| `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | add `expected_session_class` enum to §1.5 (per §6 G.4) | gap closure |
| `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` | extend §O with shard-emission fields (`build_state_serialized.shards_emitted: int`); add §P "Cowork ledger discipline" (per §6 G.1) | hygiene rule for new policy |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | add row for `COWORK_LEDGER` (per §6 G.1); fingerprint rotates | new canonical_id |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md` → v1.7 | add rows for new portal files + new canonical files | registry hygiene |
| `00_ARCHITECTURE/COWORK_LEDGER.md` | NEW (per §6 G.1) | new canonical artifact |

### 8.2 Files NOT modified (corpus-side)

- All of `01_FACTS_LAYER/**`, `025_HOLISTIC_SYNTHESIS/**`, `03_DOMAIN_REPORTS/**`, `04_REMEDIAL_CODEX/**`, `05_TEMPORAL_ENGINES/**`, `06_LEARNING_LAYER/**`.
- `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md`, `MACRO_PLAN_v2_0.md`, `PROJECT_ARCHITECTURE_v2_2.md`, `M2A_EXEC_PLAN_v1_0.md`, `GOVERNANCE_BASELINE_v1_0.md`, `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`, `STEP_LEDGER_v1_0.md`, `NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md`, `STALENESS_REGISTER.md` — all read-only here.
- `CLAUDECODE_BRIEF.md` (Madhav_M2A_Exec_6 IN_PROGRESS — leave alone; the implementation session writes its own brief in a fresh root-level CLAUDECODE_BRIEF.md *only after* Madhav_M2A_Exec_6 closes; if the M2A_Exec_6 brief is still IN_PROGRESS, the implementation session waits or routes the brief to a different filename — see §17 Open question Q.5).

### 8.3 Mirror discipline (MP.1 – MP.8)

- **MP.1** (CLAUDE.md ↔ .geminirules) — no edit; portal additions are not mentioned in CLAUDE.md.
- **MP.2** (composite ↔ .gemini/project_state.md) — state-block updates at session close (last_session_id rotation; that is the standard close action, not a special build-tracker action).
- **MP.3 – MP.4 – MP.8** — no edit.
- **MP.5** (FILE_REGISTRY ↔ Gemini-side L2.5 path block) — registry bumps v1.6 → v1.7; the Gemini-side carries only L2.5 paths per declared asymmetry, and portal/serializer additions are not L2.5 paths → Gemini-side unchanged. PASS_DECLARED_ASYMMETRY.
- **MP.6** (GOVERNANCE_STACK Claude-only) — amendment log entry per close discipline.
- **MP.7** (SESSION_LOG Claude-only) — append.

`mirror_enforcer.py` exit 0 on the 8/8 pairs.

### 8.4 Script-level guarantees

The implementation session must verify:

- `drift_detector.py` exit ≤ 3 with all new findings (if any) listed in `known_residuals` block.
- `schema_validator.py` exit ≤ 3 with the same.
- `mirror_enforcer.py` exit 0.
- `serialize_build_state.py` v0.2.0 — runs and emits all three artifact classes; uploads cleanly to GCS.

---

## §9 — §6 gaps disposition

| Gap | Description | v0.1 disposition | Owner action |
|---|---|---|---|
| **G.1** Cowork conversations not logged | Threads run parallel; no canonical surface | **Address now.** New file `00_ARCHITECTURE/COWORK_LEDGER.md` (canonical_id `COWORK_LEDGER`; LIVING). Cowork appends a row per thread close (≤ 5 lines per thread). Bootstrap rows: this very thread + the BUILD_TRACKER predecessor threads. | Implementation session creates the file with bootstrap rows; native + Cowork take over append cadence post-deployment. |
| **G.2** Native overrides not logged | Halt-and-ask overrides happen conversationally | **Address now (template extension only).** Extend SESSION_CLOSE_TEMPLATE §2 with optional `native_overrides[]` block. Schema validator does not require it (LOW finding if absent). Sessions that had overrides backfill from memory at next touch. | Implementation session edits SESSION_CLOSE_TEMPLATE; existing closed sessions are not retrofitted (per ongoing-hygiene §6 forward-only retrofit). |
| **G.3** Halt-and-ask outcomes not structured | Halts surface only in narrative | **Address now (template extension only).** Extend SESSION_CLOSE_TEMPLATE §2 with optional `halts_encountered[]` block. | Same as G.2. |
| **G.4** On-plan vs off-plan classification implicit | `expected_session_class` is free-form | **Address now (enum).** Add §1.5 to SESSION_LOG_SCHEMA naming the enum: `m2_corpus_execution \| governance_aside \| planning_only \| fix_session \| red_team \| brief_authoring \| native_intervention \| cowork_orchestration`. Existing entries grandfathered (legacy parser falls back to inference). | Implementation session edits SESSION_LOG_SCHEMA; serializer emits enum with `inferred: true` flag for pre-extension sessions. |
| **G.5** AC progress not tracked mid-session | Briefs have ACs; only "all pass" at close | **Defer to v0.2.** v0.1 shows ACs with the close-time pass/fail count only. v0.2 adds an optional `ac_progress.jsonl` file the in-flight session writes after each AC; serializer reads it. | None for v0.1. |
| **G.6** Parallel workstreams not formally enumerated | LEL + PPL named in CLAUDE.md §E only | **Partial address — hard-coded for v0.1; canonical file deferred.** Serializer emits the four-element `workstreams` array (LEL, PPL, BUILD_TRACKER, GOVERNANCE_HYGIENE) with status fields derived from existing surfaces. v0.2 promotes to a canonical `00_ARCHITECTURE/WORKSTREAMS.md` file. | Implementation session hard-codes; v0.2 implements the canonical surface. |

---

## §10 — File-by-file diff plan

For each file, the implementation session produces (or modifies) it. Implementation order is left to the implementation session's brief; below is the dependency order.

### 10.1 NEW files

#### 10.1.1 `00_ARCHITECTURE/COWORK_LEDGER.md`

Frontmatter: canonical_id `COWORK_LEDGER`, status `LIVING`, authoritative_side `claude`, mirror_obligations `claude_only`, schema fields per §1 / §2 of the file's body.

Body (skeleton):

```
# COWORK LEDGER — Cowork Conversation History
## §1 — Purpose
   <prose explaining cadence + low-effort discipline>
## §2 — Entry schema
   thread_name, opened_on, closed_on (or null), purpose, outcomes[], spawned_sessions[]
## §3 — Entries
   <bootstrap rows for the predecessor build-tracker threads + this planning thread>
```

#### 10.1.2 `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md`

Adds rows for: COWORK_LEDGER, the three JSON schemas, the build/* portal source tree (one row per page or one umbrella row per the §10 IRC convention), the build_state shard prefixes.

#### 10.1.3 `platform/scripts/governance/schemas/build_state.schema.json` (NEW or REPLACE)

Replaces the v0.1 schema with v0.2 (additive). The implementation session diffs against the existing v0.1 schema to confirm additivity.

#### 10.1.4 `platform/scripts/governance/schemas/build_state_session_detail.schema.json`

NEW. JSON Schema for the per-session shard.

#### 10.1.5 `platform/scripts/governance/schemas/build_state_phase_detail.schema.json`

NEW. JSON Schema for the per-phase shard.

#### 10.1.6 `platform/src/app/build/layout.tsx`

Auth guard layout (see §6 above). ~25 lines.

#### 10.1.7 `platform/src/app/build/page.tsx`

The Cockpit. RSC; awaits `fetchBuildState()`; renders `<CockpitGrid state={state} />`. ~40 lines.

#### 10.1.8 `platform/src/app/build/plan/page.tsx`

Plan view. RSC; awaits `fetchBuildState()`; renders `<PhaseGrid sub_phases={...} macro_arc={...} />`. ~50 lines.

#### 10.1.9 `platform/src/app/build/plan/[phase_id]/page.tsx`

Per-phase drill-down. RSC; awaits `fetchPhaseDetail(phase_id)`; renders `<PhaseDetail detail={...} />`. ~40 lines.

#### 10.1.10 `platform/src/app/build/sessions/page.tsx`

Session log table view. RSC; awaits `fetchBuildState()`; renders `<SessionTable rows={state.sessions_index} />` (client component handles sort/filter). ~40 lines.

#### 10.1.11 `platform/src/app/build/sessions/[session_id]/page.tsx`

Per-session drill-down. RSC; awaits `fetchSessionDetail(session_id)`; renders `<SessionDetail detail={...} />`. ~40 lines.

#### 10.1.12 `platform/src/app/build/interventions/page.tsx`

RSC; renders `<InterventionList rt={...} nd={...} dr={...} />`. ~50 lines.

#### 10.1.13 `platform/src/app/build/parallel/page.tsx`

RSC; renders mirror pairs + Cowork ledger + LEL/PPL panels + workstreams list. ~60 lines.

#### 10.1.14 `platform/src/app/build/health/page.tsx`

RSC; renders `<HealthTrend>` x3 + staleness register + quarterly pass countdown. ~60 lines.

#### 10.1.15 `platform/src/app/build/activity/page.tsx`

RSC; renders `<ActivityFeed sessions={state.sessions_index.slice(-20).reverse()} />`. ~30 lines.

#### 10.1.16 `platform/src/app/build/registry/page.tsx`

RSC; renders `<RegistryTable artifacts={state.canonical_artifacts} />`. ~30 lines.

#### 10.1.17 `platform/src/app/build/error.tsx`

Standard error boundary. ~20 lines.

#### 10.1.18 `platform/src/lib/build/dataSource.ts`

```ts
import 'server-only'
const GCS_BASE = process.env.BUILD_STATE_GCS_BASE
  ?? 'https://storage.googleapis.com/marsys-jis-build-state'

export async function fetchBuildState(): Promise<BuildState> {
  const r = await fetch(`${GCS_BASE}/build-state.json`, { cache: 'no-store' })
  if (!r.ok) throw new Error(`GCS fetch failed: ${r.status}`)
  return r.json() as Promise<BuildState>
}

export async function fetchSessionDetail(id: string): Promise<SessionDetail | null> {
  const r = await fetch(`${GCS_BASE}/sessions/${encodeURIComponent(id)}.json`,
                       { cache: 'no-store' })
  if (r.status === 404) return null
  if (!r.ok) throw new Error(`GCS session fetch failed: ${r.status}`)
  return r.json() as Promise<SessionDetail>
}
// fetchPhaseDetail similarly
```

~80 lines incl. PhaseDetail variant.

#### 10.1.19 `platform/src/lib/build/types.ts`

TS types mirroring the JSON schemas. Generated manually for v0.1 (a future iteration could codegen via `json-schema-to-typescript` but introducing that dependency is out of scope). ~250 lines.

#### 10.1.20 `platform/src/lib/build/format.ts`

Helpers: `relativeTime(date)`, `exitCodeBadge(n)`, `statusPillVariant(status)`. ~80 lines.

#### 10.1.21 `platform/src/lib/build/parsers/sessionClass.ts`

Maps free-form `expected_session_class` strings to the enum (per §6 G.4). ~30 lines.

#### 10.1.22 `platform/src/components/build/*.tsx`

~16 files per §4 component tree, average 60 lines each.

### 10.2 MODIFIED files

#### 10.2.1 `platform/scripts/governance/serialize_build_state.py`

Diff:

- Bump `GENERATOR_VERSION` to `"0.2.0"` and `SCHEMA_VERSION` to `"0.2.0"`.
- Add readers: `_read_native_directives`, `_read_disagreement_register`, `_read_staleness_register`, `_read_red_team_reports`, `_read_phase_b_plan`, `_read_macro_plan`, `_read_drift_history`, `_read_schema_history`, `_read_mirror_history`, `_read_cowork_ledger`, `_read_current_brief`.
- Extend `assemble_build_state` to populate the new top-level keys.
- New functions: `assemble_session_detail(session_id)`, `assemble_phase_detail(phase_id)`.
- New CLI flags: `--emit-shards` (default false; default true under `--upload-to-gcs`), `--shard-dir`.
- New upload routine that uploads three artifact classes atomically (use a tmp prefix then rename; if rename fails, the previous build-state.json remains in place).
- Backward compat: default invocation (no new flags) still emits the v0.1-shape file at the existing path; v0.1 schema continues to validate. v0.2 adds **only optional** keys, so v0.1 readers see them as unknown fields and the JSON-schema with `additionalProperties: true` continues to validate.

Total added/modified lines: ~600. The current file is ~425 lines.

#### 10.2.2 `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md`

Adds two optional fields under §2 close YAML:

```yaml
native_overrides: []        # see ONGOING_HYGIENE_POLICIES §P (added)
halts_encountered: []
```

Schema validator: presence not required; if present, validates against an inline schema documented in §2.

#### 10.2.3 `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md`

Adds §1.5: `expected_session_class` enum. Sessions before this extension carry inferred values flagged in the per-session shard.

#### 10.2.4 `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md`

- Extends §O with `shards_emitted` and `cowork_ledger_referenced` fields on `build_state_serialized`.
- Adds §P "Cowork ledger discipline" — Cowork appends to COWORK_LEDGER.md at thread close; cadence is "low-effort, ≤5 lines per thread".

#### 10.2.5 `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`

Adds row for `COWORK_LEDGER`. Fingerprint rotates.

### 10.3 RETIRED / superseded files

None. The Cowork artifact `amjis-build-tracker` is retired but it lives outside the repo (Cowork-platform-side); not within the implementation's reach.

---

## §11 — Acceptance criteria for the implementation session

Numbered AC list, end-to-end testable. The implementation session's CLAUDECODE_BRIEF.md will copy these verbatim.

| # | Acceptance criterion | Test method |
|---|---|---|
| **AC.1** | `serialize_build_state.py --version` returns `0.2.0`. | `python3 platform/scripts/governance/serialize_build_state.py --version` |
| **AC.2** | Serializer with `--emit-shards --validate-against-schema` writes one top-level + one shard per session in SESSION_LOG_SCHEMA-conformant entries + one shard per phase declared in PHASE_B_PLAN. | Inspect output directory; count files. |
| **AC.3** | Each emitted JSON validates against its respective schema. | `--validate-against-schema` exits 0. |
| **AC.4** | The top-level `build_state.json` contains every key listed in §3.2.1 with non-null values where applicable. | `jq` queries against the file. |
| **AC.5** | `gs://marsys-jis-build-state/build-state.json` is updated with the new shape (HTTP 200 + JSON body containing `"schema_version": "0.2.0"`). | `curl -s https://storage.googleapis.com/marsys-jis-build-state/build-state.json | jq .schema_version` |
| **AC.6** | At least one `gs://marsys-jis-build-state/sessions/{id}.json` exists (e.g., for the closing session itself). | `curl -sI https://storage.googleapis.com/marsys-jis-build-state/sessions/<closing_session>.json` |
| **AC.7** | At least one `gs://marsys-jis-build-state/phases/{id}.json` exists (e.g., `B.4.json`). | curl. |
| **AC.8** | Existing `--validate-only` (v0.1 mode without new flags) still produces a v0.2-shape file that v0.1 consumers can read (backward compat). | Snapshot test against an old reader. |
| **AC.9** | `madhav.marsys.in/build` returns HTTP 200 for super_admin; redirects clients to `/dashboard`; redirects logged-out users to `/login`. | `curl` with each cookie state. |
| **AC.10** | `/build` Cockpit renders all sections in §1.1 (Cockpit / overview): active phase, sub-phase, last/next session, three exit codes, red-team gauge, days-to-quarterly-pass, open-ND count, open-DR count, last 3 deliverables. | Visual inspection by native. |
| **AC.11** | `/build/plan` renders B.0–B.10 grid with status pills; clicking B.4 navigates to `/build/plan/B.4`. | Click-through test. |
| **AC.12** | `/build/sessions` lists every entry from SESSION_LOG (legacy + post-Step-10) with sortable/filterable columns: session_id, date, class, phase_id, exit codes. | DOM count == sessions_index.length; filter narrows DOM count appropriately. |
| **AC.13** | `/build/sessions/Madhav_M2A_Exec_5` (or any closed session) drill-down shows session_open + body + session_close + files_touched + linked drift/schema/mirror reports. | Verify against the session's own SESSION_LOG entry. |
| **AC.14** | `/build/interventions` lists red-team passes (>= 1: M2A_v1_0), open NDs (= 0), addressed NDs (>= ND.1), DR entries (= 0 currently). | Counts match canonical files. |
| **AC.15** | `/build/parallel` lists at least: LEL v1.2 row, PPL substrate row, Cowork ledger entries (>= the bootstrap rows), four workstreams, MP.1–MP.8 mirror table with `last_verified_session` per pair. | Visual + count. |
| **AC.16** | `/build/health` renders three sparklines (drift / schema / mirror trend over last N sessions), staleness register entries, quarterly pass countdown (next 2026-07-24 per ONGOING_HYGIENE_POLICIES §H). | Visual; date countdown matches policy. |
| **AC.17** | `/build/activity` reverse-chronological feed shows newest 20 session closes; each card links to its `/build/sessions/[id]` detail. | Click-through test. |
| **AC.18** | `/build/registry` lists every canonical artifact from CANONICAL_ARTIFACTS §1 with version, status, fingerprint (truncated), days-since-rotation. | Row count == CANONICAL_ARTIFACTS rows; spot-check 3 fingerprints. |
| **AC.19** | The ↺ button on `/build` triggers a new GCS fetch and the rendered timestamps update. | Time-difference observation. |
| **AC.20** | If `CLAUDECODE_BRIEF.md` exists at repo root with `status != COMPLETE`, the Cockpit renders a "Current Brief" panel naming the brief's session_id, AC count, and `may_touch` summary. | Set the brief; reload. |
| **AC.21** | `00_ARCHITECTURE/COWORK_LEDGER.md` exists with frontmatter, schema, and >= 4 bootstrap rows (this planning thread + 3 BUILD_TRACKER predecessor threads). | File presence + grep. |
| **AC.22** | `SESSION_CLOSE_TEMPLATE_v1_0.md` carries the `native_overrides[]` and `halts_encountered[]` blocks under §2. | grep for both keys in the template. |
| **AC.23** | `SESSION_LOG_SCHEMA_v1_0.md` §1.5 names the eight-element `expected_session_class` enum. | grep for `m2_corpus_execution`, `governance_aside`, etc. |
| **AC.24** | `mirror_enforcer.py` exit 0 on the 8/8 pairs. `drift_detector.py` exit ≤ 3; `schema_validator.py` exit ≤ 3 (residuals whitelisted). | Run all three. |
| **AC.25** | `FILE_REGISTRY_v1_7.md` exists; v1.6 banner-superseded; new rows present for COWORK_LEDGER, three schemas, portal sources. | File presence + grep. |
| **AC.26** | `ONGOING_HYGIENE_POLICIES_v1_0.md` carries §P (Cowork ledger discipline) + §O `shards_emitted` field. | grep. |
| **AC.27** | `CANONICAL_ARTIFACTS_v1_0.md` has a `COWORK_LEDGER` row at §1; its fingerprint matches the actual file's sha256 at session close. | sha256sum cross-check. |
| **AC.28** | The Cockpit `staleness_seconds_since_last_close` field renders sensibly (e.g., "12 minutes ago", or "5 days ago"). | Visual; spot-check the source field. |

### Total: 28 ACs.

---

## §12 — `may_touch` / `must_not_touch` for the implementation session

### `may_touch`

```
platform/src/app/build/**
platform/src/components/build/**
platform/src/lib/build/**
platform/scripts/governance/serialize_build_state.py
platform/scripts/governance/schemas/build_state.schema.json
platform/scripts/governance/schemas/build_state_session_detail.schema.json
platform/scripts/governance/schemas/build_state_phase_detail.schema.json
00_ARCHITECTURE/COWORK_LEDGER.md
00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md
00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md
00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md
00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md
00_ARCHITECTURE/FILE_REGISTRY_v1_6.md          # supersession banner if bumping
00_ARCHITECTURE/FILE_REGISTRY_v1_7.md          # NEW
00_ARCHITECTURE/CURRENT_STATE_v1_0.md          # state-block update at close
00_ARCHITECTURE/SESSION_LOG.md                 # append at close
00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md       # amendment log at close
.geminirules                                   # if MP.1 mirror update needed (likely none)
.gemini/project_state.md                       # MP.2 state-block update at close
CLAUDECODE_BRIEF.md                            # the implementation session authors its own brief
```

### `must_not_touch`

```
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
03_DOMAIN_REPORTS/**
04_REMEDIAL_CODEX/**
05_TEMPORAL_ENGINES/**
06_LEARNING_LAYER/**
035_DISCOVERY_LAYER/**                          # M2 corpus scope
00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md
00_ARCHITECTURE/MACRO_PLAN_v2_0.md
00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md
00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md
00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md
00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md
00_ARCHITECTURE/STEP_LEDGER_v1_0.md            # GOVERNANCE_CLOSED
00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md   # read-only
00_ARCHITECTURE/STALENESS_REGISTER.md          # read-only
00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md  # read-only unless a DIS opens
00_ARCHITECTURE/CONVERSATION_NAMING_CONVENTION_v1_0.md   # frozen
00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md            # not extending in v0.1
00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md                  # CLOSED
platform/python-sidecar/**                      # M2 RAG-build scope; this is portal scope
platform/supabase/migrations/**                 # not relevant
platform/src/app/dashboard/**                   # don't refactor existing dashboard
platform/src/app/admin/**                       # don't refactor admin
platform/src/app/clients/**                     # don't refactor clients
platform/src/app/api/**                         # no API changes in v0.1
platform/src/lib/firebase/**                    # auth infra frozen
platform/src/lib/auth/**                        # auth helpers frozen
platform/src/lib/db/**                          # DB clients frozen (build view doesn't use DB)
platform/src/lib/storage/**                     # GCS clients frozen
platform/src/components/{admin,chat,clients,consume,dashboard,shared,ui}/**
                                               # UI primitives okay to import; no edits
99_ARCHIVE/**
verification_artifacts/**                      # read-only here
```

A nuance: `platform/src/components/ui/**` (shadcn primitives) is import-only; the implementation may import from it but must not edit any file inside.

---

## §13 — Session-count estimate for implementation

**3 sessions.** Possibly 4 if §6 G.1/G.2/G.4 governance extensions hit a snag.

| # | Session focus | Deliverables | ACs covered |
|---|---|---|---|
| **Session 1** | Serializer extension + JSON schemas + COWORK_LEDGER + governance template/schema extensions | serialize_build_state.py v0.2.0, three schemas, COWORK_LEDGER.md (with bootstrap rows), SESSION_CLOSE_TEMPLATE + SESSION_LOG_SCHEMA + ONGOING_HYGIENE_POLICIES extensions, CANONICAL_ARTIFACTS row, FILE_REGISTRY v1.7 | AC.1–AC.8, AC.21–AC.27 |
| **Session 2** | Portal data layer + Cockpit + Plan + Sessions + drill-downs | `lib/build/*`, `components/build/*` half, `/build/{layout,page,plan,sessions}` routes | AC.9–AC.13, AC.18, AC.19, AC.20, AC.28 |
| **Session 3** | Remaining views + polish + verify all ACs | `/build/{interventions,parallel,health,activity,registry}` + remaining components + visual pass | AC.14–AC.18, AC.19 final, AC.24 closing |

Two-session compression (S1+S2 merged) is technically possible but risky — Session 1 alone is governance-heavy with template / schema cascades; combining it with portal work invites scope spread.

---

## §14 — Test strategy

### 14.1 Unit-ish coverage

- **Serializer.** `pytest platform/scripts/governance/test_serialize_build_state.py` — at minimum: golden JSON for a fixture canonical-files snapshot; schema validation for all three artifact classes; legacy entry parser test (one pre-Step-10 SESSION_LOG entry); post-schema entry parser test (one Madhav_M2A_Exec_* entry).
- **TS types.** `tsc --noEmit` over `platform/src/lib/build/*` proves the types compile.

### 14.2 Integration

- **Local**: `npm run dev` then visit `localhost:3000/build` with the dev Firebase Auth + super_admin role. Each AC.10 – AC.18 surface clicked through.
- **GCS-side**: serializer run with `--upload-to-gcs gs://marsys-jis-build-state/build-state.json`; verify HTTP 200 + CORS via the same curl pattern in `ONGOING_HYGIENE_POLICIES §O`.

### 14.3 Mock data scenarios (edge cases for view robustness)

The implementation session must verify the renderer does not crash on:

1. **Missing fields.** A SESSION_LOG legacy entry with no `session_open` / `session_close` blocks → SessionDetail renders "[legacy entry — structured YAML absent]" gracefully.
2. **Unfamiliar session class.** A future entry with `expected_session_class: "research_pass"` (not in the v0.1 enum) → table row renders the raw string with a "[unknown class]" annotation; no error.
3. **Empty DR / ND lists.** v0.1 has zero DR entries; the InterventionList renders the section with "No open disagreements." copy, not an empty void.
4. **Missing brief.** `CLAUDECODE_BRIEF.md` absent or `status: COMPLETE` → BriefPanel renders "[no active brief]".
5. **GCS object missing.** A `sessions/{id}.json` that has not been written yet (e.g., for a session that closed before the new serializer landed) → SessionDetail renders "[per-session shard not yet generated; serializer will produce it at next session close]" plus a summary from the top-level sessions_index.
6. **Stale top-level vs fresh shard.** Top-level `build_state.json` lags by one session because the upload had a transient failure → cockpit's `staleness_seconds_since_last_close` shows the lag; the activity feed surfaces the discrepancy.

### 14.4 Manual acharya-grade pass

Native runs through every AC visually after the implementation session closes; signs off in `RAG_READINESS_REPORT_v1_0.md`-style note (or this plan's `status: IMPLEMENTED` flip).

---

## §15 — Rollout plan

### 15.1 Deploy

1. Implementation session pushes its branch (or commits to `feature/amjis-platform`).
2. Cloud Build picks up the change, builds the Next.js image, deploys to `amjis-web` (Cloud Run, asia-south1).
3. The serializer addition is Python-side; it does not require a deploy — the user runs it locally at session close as part of the existing close-checklist.
4. Verify: `curl https://madhav.marsys.in/build` (with super_admin cookie) returns 200.

### 15.2 Cutover

The Cowork artifact `amjis-build-tracker` is **not modified by this plan**. Native (or Cowork) decides separately whether to:
- Retire the artifact (mark it deprecated; redirect to `madhav.marsys.in/build`).
- Replace it with a smaller artifact that just embeds an iframe / link to the portal.

Either is out of scope.

### 15.3 Rollback

The portal additions are additive — they do not modify existing portal routes. If `/build` breaks, no other portal surface is affected.

The serializer change is a v0.2.0 bump that emits **additional** JSON keys; v0.1 readers (none currently exist outside the broken Cowork artifact) continue to see a valid v0.1-shape blob. If the v0.2 emission breaks, revert `serialize_build_state.py` to v0.1.0; the portal then renders empty arrays for the new fields and degrades gracefully (per §14.3 mock data scenarios).

---

## §16 — Out-of-scope explicit list

This plan's implementation does NOT:

- Edit canonical files in any of L1, L2.5, L3 corpus (`01_FACTS_LAYER`, `025_HOLISTIC_SYNTHESIS`, `03_DOMAIN_REPORTS`).
- Modify `PHASE_B_PLAN`, `MACRO_PLAN`, `PROJECT_ARCHITECTURE` (frozen).
- Mutate state on click (the dashboard is read-only).
- Send notifications (no email, no Slack, no PagerDuty).
- Expose any public endpoint (all routes are super_admin-gated).
- Implement SSE / live-update channel (deferred to v0.2).
- Implement an `/api/build/*` JSON pass-through (deferred to v0.2).
- Add caching layers (Redis, Cloud CDN) beyond the GCS object's `cache-control: max-age=60`.
- Retire the Cowork artifact (separate native action).
- Refactor existing portal routes (`/dashboard`, `/admin`, `/clients`).
- Pre-build for M3+ macro-phases (the dashboard reads existing state; it does not anticipate temporal-engine outputs).
- Touch `06_LEARNING_LAYER/**` (pre-build forbidden).
- Add the canonical `WORKSTREAMS.md` file (deferred to v0.2; v0.1 hard-codes the four workstreams in the serializer).
- Add the canonical AC progress tracking surface (G.5; deferred).
- Implement structured halt-and-ask outcomes beyond the optional template field (G.3; the dashboard surfaces the field if present, but no tooling forces sessions to populate it).
- Run governance scripts as part of the planning session (the planning session HALTS per elaborate.md §9).
- Append to SESSION_LOG (planning session does not close as a normal session).
- Modify any in-progress brief at root (Madhav_M2A_Exec_6 is left alone).

---

## §17 — Open questions for the native

Before the implementation session opens, the native should confirm:

**Q.1 — Approve `D.1.e` (hybrid GCS sharding)?** The alternative is a fatter single-file approach (D.1.d) with all session bodies inlined. Sharding is recommended; the cost is ~50–100 small JSON objects in the bucket.

**Q.2 — Approve adding `00_ARCHITECTURE/COWORK_LEDGER.md`?** This is a new canonical artifact (canonical_id `COWORK_LEDGER`). Adoption commits Cowork (a separate Claude conversation surface) to a low-effort cadence: 5 lines per thread close. Native must accept this discipline; alternatively, defer G.1 to v0.2.

**Q.3 — Approve `SESSION_CLOSE_TEMPLATE_v1_0.md` extension with `native_overrides[]` and `halts_encountered[]`?** These are *optional* fields (LOW finding if absent), so existing sessions are not retroactively in violation. The cost is one template surface bump and a downstream amendment log entry.

**Q.4 — Approve `SESSION_LOG_SCHEMA_v1_0.md` §1.5 enum addition?** The enum is open-ended in spirit (we documented eight values, and a future addition is a minor-version schema bump). Native confirms the eight chosen values are sufficient for v0.1: `m2_corpus_execution`, `governance_aside`, `planning_only`, `fix_session`, `red_team`, `brief_authoring`, `native_intervention`, `cowork_orchestration`.

**Q.5 — When does the implementation session open?** Two scenarios:

  - (a) After Madhav_M2A_Exec_6 closes (Auth Proxy comes up, DB ACs pass, brief completes) — the implementation session is the "next session" after Exec_7. Cleaner ordering; the dashboard's first cockpit render shows Exec_6 / Exec_7 as the most recent activity.
  - (b) In parallel, while Exec_6 is still IN_PROGRESS — the implementation session class is `governance_aside`. The dashboard launches earlier, but its first render shows Exec_6 still IN_PROGRESS, which is itself useful evidence that the cockpit handles in-flight state.

**Q.6 — `BUILD_STATE_GCS_BASE` env var.** The `dataSource.ts` defaults to the public GCS URL. Should the implementation session set the env var explicitly in Cloud Run config (preferred for explicit) or rely on the default (preferred for simpler)?

**Q.7 — UI design language.** The portal uses shadcn primitives + Tailwind + a serif/sans font pair. Should `/build` adopt the same language verbatim (recommended), or explore a denser "operator console" aesthetic for the cockpit (more Cowork-artifact-like)? The recommended path is "verbatim portal language" for v0.1 to minimize design surface; a v0.2 polish pass can explore density.

**Q.8 — Acceptable session count.** Is 3 sessions tolerable, or should the implementation be split / merged differently? The alternatives are 2 sessions (more risk) or 4 sessions (more careful, with G.1/G.2/G.4 in their own session).

---

## §18 — Naming conventions

This plan: `Madhav_PORTAL_BUILD_TRACKER_PLAN_v0_1` per `CONVERSATION_NAMING_CONVENTION_v1_0.md`. Cowork thread name: `Madhav PORTAL_BUILD_TRACKER_PLAN — v0.1`.

Implementation sessions:

- `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1` — Session 1 (serializer + governance extensions).
- `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2` — Session 2 (portal data layer + first views).
- `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3` — Session 3 (remaining views + verification).

Each implementation session is `expected_session_class: governance_aside` (per §6 G.4 enum; rationale: portal infrastructure work is parallel to M2 corpus execution and does not increment the red-team counter).

Plan artifact: `00_ARCHITECTURE/PORTAL_BUILD_TRACKER_PLAN_v0_1.md`. Frontmatter `status: DRAFT_PENDING_NATIVE_REVIEW`. After native review and approval → `APPROVED_FOR_IMPLEMENTATION`. After implementation completes → `IMPLEMENTED` with a pointer to the implementation session's deliverables block appended to §19.

---

## §19 — Implementation deliverables

### §19.1 — Session 1: Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 (2026-04-26)

**session_id:** `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1`
**expected_session_class:** `governance_aside`
**ACs covered:** AC.1–AC.8 (serializer + GCS) + AC.21–AC.27 (governance extensions) — 15 of 28 total ACs.
**Status:** COMPLETE. All 15 ACs pass.

**Deliverables:**

| Artifact | Change | Notes |
|---|---|---|
| `platform/scripts/governance/serialize_build_state.py` | v0.1.0 → v0.2.0 | New readers (native_directives, disagreement_register, staleness_register, red_team_reports, phase_b_plan, macro_arc, drift/schema/mirror history, cowork_ledger, current_brief); shard assembly; `--emit-shards`, `--shard-dir`, `--version`, `--trend-n` CLI flags |
| `platform/scripts/governance/schemas/build_state.schema.json` | v0.1 → v0.2 | `additionalProperties: true`; 7 new required fields; extended properties |
| `platform/scripts/governance/schemas/build_state_session_detail.schema.json` | NEW | Per-session shard schema |
| `platform/scripts/governance/schemas/build_state_phase_detail.schema.json` | NEW | Per-phase shard schema |
| `00_ARCHITECTURE/COWORK_LEDGER.md` | NEW | canonical_id COWORK_LEDGER; 5 bootstrap entries |
| `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` | Amended | `native_overrides[]` + `halts_encountered[]` optional blocks; serializer v0.2 fields |
| `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | Amended | §1.5 `expected_session_class` enum (8 values) added |
| `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` | Amended | §O extended (`shards_emitted`, `cowork_ledger_referenced`); §P "Cowork ledger discipline" added |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | Amended | COWORK_LEDGER row added; FILE_REGISTRY path v1.6 → v1.7 |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` | NEW (supersedes v1.6) | §9.9 Session 1 deliverables |

**GCS:** `build-state.json` uploaded; 52 session shards (`sessions/*.json`) uploaded. HTTP/2 200 ✓. Schema validation PASS.
**Governance scripts:** drift exit=2, schema exit=2, mirror exit=0.

**§3.4 footnote — branch (a) disposition:**
All three report types use branch (a): drift reports have `drift_report.exit_code` + `findings[]`; schema reports have `schema_validation_report.exit_code` + `summary.total`; mirror reports have flat `exit_code` + `pairs_failed`. Integer coercion added in serializer to handle `<populated-at-close-run>` string placeholders in legacy SESSION_LOG entries.

**Residuals carried forward:**
- Portal data layer (Session 2): `/build` route group, RSC data fetchers, Firebase Auth gate, cockpit + 9 views. (AC.9–AC.20 — Session 2 scope)
- Portal remaining views (Session 3): navigation, history, parallel workstreams, scroll handling. (AC.28 — Session 3 scope per plan §18)

**SESSION_LOG entry:** `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1` (appended at session close).

---

### §19.2 — Session 2: Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2 (2026-04-26)

**session_id:** `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2`
**expected_session_class:** `governance_aside`
**ACs covered:** AC.9–AC.13, AC.18–AC.20, AC.28 — 9 of 28 total ACs (cumulative: 24 of 28).
**Status:** COMPLETE. All 9 Session 2 ACs pass.

**Deliverables:**

| Artifact | Change | Notes |
|---|---|---|
| `platform/src/lib/build/types.ts` | NEW | TS types mirroring GCS schema_version 0.2.0. BuildState, SessionDetail, PhaseDetail, 15+ sub-types. |
| `platform/src/lib/build/dataSource.ts` | NEW | `server-only`. fetchBuildState(), fetchSessionDetail(id), fetchPhaseDetail(id). GCS_BASE env var. |
| `platform/src/lib/build/format.ts` | NEW | relativeTime, stalenessLabel (with clamp-to-0), daysUntil, truncateFingerprint(12 chars), exitCodeVariant/Label, statusVariant, formatDate. |
| `platform/src/lib/build/parsers/sessionClass.ts` | NEW | normalizeSessionClass + sessionClassLabel for 8-element enum. |
| `platform/src/components/build/BuildHeader.tsx` | NEW | `use client`. Nav links (8 routes), RefreshButton, avatar dropdown. |
| `platform/src/components/build/RefreshButton.tsx` | NEW | `use client`. router.refresh() with spinner via useTransition. |
| `platform/src/components/build/StatusPill.tsx` | NEW | RSC. status string → Badge variant. |
| `platform/src/components/build/ScriptVerdictBadge.tsx` | NEW | RSC. exit code integer → colored Badge. |
| `platform/src/components/build/CockpitGrid.tsx` | NEW | RSC. Staleness banner + Phase Position (4 cards) + Governance Health (4 cards) + Recent Activity + BriefPanel. |
| `platform/src/components/build/BriefPanel.tsx` | NEW | RSC. current_brief → panel or "[no active brief]". |
| `platform/src/components/build/PhaseGrid.tsx` | NEW | RSC. sub_phases[] → clickable phase cards with status pills and /build/plan/[id] links. |
| `platform/src/components/build/SessionTable.tsx` | NEW | `use client`. Sortable + filterable (by session_id, title, class, phase_id). ScriptVerdictBadge per row. |
| `platform/src/components/build/SessionDetail.tsx` | NEW | RSC. session shard → header + objective + deliverables + files_touched + linked_reports + residuals + halts. Legacy fallback + null-shard fallback. |
| `platform/src/components/build/RegistryTable.tsx` | NEW | `use client`. Sortable canonical artifact table. Fingerprint truncated to 12 chars. daysSince computed client-side. |
| `platform/src/app/build/layout.tsx` | NEW | RSC. Auth gate: getServerUserWithProfile() → redirect /login if not active, redirect /dashboard if not super_admin. BuildHeader with userInitial. |
| `platform/src/app/build/page.tsx` | NEW | RSC. Cockpit. force-dynamic. fetchBuildState() → CockpitGrid. |
| `platform/src/app/build/plan/page.tsx` | NEW | RSC. Plan view. force-dynamic. macro arc badge strip + PhaseGrid. |
| `platform/src/app/build/plan/[phase_id]/page.tsx` | NEW | RSC. Phase drill-down. force-dynamic. await params. fetchPhaseDetail → detail cards + null-shard fallback. |
| `platform/src/app/build/sessions/page.tsx` | NEW | RSC. Session table. force-dynamic. fetchBuildState() → SessionTable(rows). |
| `platform/src/app/build/sessions/[session_id]/page.tsx` | NEW | RSC. Session detail. force-dynamic. await params. fetchSessionDetail → SessionDetail. |
| `platform/src/app/build/registry/page.tsx` | NEW | RSC. Registry. force-dynamic. fetchBuildState() → RegistryTable(canonical_artifacts). |
| `platform/src/app/build/error.tsx` | NEW | `use client` error boundary for /build route group. |
| `platform/src/app/build/interventions/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `platform/src/app/build/parallel/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `platform/src/app/build/health/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `platform/src/app/build/activity/page.tsx` | NEW | Stub: "Coming in Session 3". |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` | Amended in-place | Portal stub row → 26 new file rows. Changelog entry added. |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Amended in-place | last_session_id rotated; Session 2 state-block. |
| `CLAUDECODE_BRIEF.md` | COMPLETE | Session 2 brief set to COMPLETE at close. |

**GCS:** `build-state.json` re-uploaded (generated_by_session: Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2). HTTP/2 200 ✓. Schema validation PASS.
**TypeScript:** `tsc --noEmit` — 0 errors from new build tracker code.
**Governance scripts:** drift exit=2 (59 findings, pre-existing), schema exit=2 (52 violations, pre-existing), mirror exit=0.
**Next.js 16 conventions verified:** params is `Promise<{...}>` → `await params` in dynamic routes; fetch uses `{ cache: 'no-store' }`; `export const dynamic = 'force-dynamic'` on all pages.

**Residuals carried forward (Session 3):**
- `/build/interventions`: red-team passes, open NDs, DR entries, halts list (AC.14).
- `/build/parallel`: LEL, PPL, Cowork ledger, mirror pairs (AC.15).
- `/build/health`: drift/schema/mirror sparklines, staleness register, quarterly countdown (AC.16).
- `/build/activity`: reverse-chron session feed with card links (AC.17).
- AC.19 final: ↺ button verified in deployed Cloud Run instance.
- AC.24 closing: governance scripts run at Session 3 close after full deploy.

**SESSION_LOG entry:** `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_2` (appended at session close).

---

### §19.3 — Session 3: Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3 (2026-04-26)

**session_id:** `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3`
**expected_session_class:** `governance_aside`
**ACs covered:** AC.14–AC.17, AC.19 final, AC.24 — 6 of 28 total ACs (cumulative: 28/28 — all ACs pass).
**Status:** COMPLETE. All 6 Session 3 ACs pass. Plan status → IMPLEMENTED.

**Deliverables:**

| Artifact | Change | Notes |
|---|---|---|
| `platform/src/components/build/InterventionList.tsx` | NEW | RSC. RedTeamSection (list of passes with verdict/residuals), NDSection (open+addressed NDs), DRSection (empty state: "No open disagreements."). |
| `platform/src/components/build/ActivityFeed.tsx` | NEW | RSC. Reverse-chron list of SessionIndex with Link wrapper, ScriptVerdictBadge, StatusPill, date. |
| `platform/src/components/build/MirrorPairsTable.tsx` | NEW | RSC. Responsive table with pair_id, claude_side, gemini_side, mirror_mode, days_since_verified badge. |
| `platform/src/components/build/HealthTrend.tsx` | NEW | `use client`. Three-panel sparkline grid + quarterly pass countdown card + staleness register table. |
| `platform/src/components/build/HealthSparkline.tsx` | NEW | `use client`. Custom SVG sparkline (custom SVG per plan D.5.d). Bar height = exit_code/4 × height; color by exit code (green=0, yellow=2, orange=3, red=4+). |
| `platform/src/app/build/interventions/page.tsx` | REPLACED | Stub → full impl. fetchBuildState() → InterventionList(red_team_passes, native_directives, disagreement_register). |
| `platform/src/app/build/parallel/page.tsx` | REPLACED | Stub → full impl. fetchBuildState() → workstreams grid + MirrorPairsTable + cowork_ledger cards + LEL/PPL static cards. |
| `platform/src/app/build/health/page.tsx` | REPLACED | Stub → full impl. fetchBuildState() → HealthTrend(scripts_trend, staleness_register, next_quarterly_pass, days_to_pass). |
| `platform/src/app/build/activity/page.tsx` | REPLACED | Stub → full impl. fetchBuildState() → ActivityFeed(newest 20 sessions reversed). |
| `CLAUDECODE_BRIEF.md` | COMPLETE | Session 3 brief self-authored at session open; COMPLETE at session close. |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Amended in-place | last_session_id → v0_3; sub_phase, narrative, deliverable fields updated. |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_7.md` | Amended in-place | 5 new component rows added. |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Amended in-place | Amendment log entry added. |
| `.gemini/project_state.md` | Amended in-place | State-block updated (MP.2 mirror). |

**TypeScript:** `tsc --noEmit` — 0 errors from new build tracker code (only pre-existing Supabase test stubs unrelated to portal).
**Governance scripts (AC.24):** drift exit=2 (58 findings, pre-existing), schema exit=2 (pre-existing), mirror exit=0 (8/8 pairs clean).
**All new pages:** `export const dynamic = 'force-dynamic'` present; RefreshButton included (AC.19 final).

**SESSION_LOG entry:** `Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3` (appended at session close).

---

## §20 — Changelog

- **v0.1 (2026-04-26)** — Initial plan authored by Claude Code (Opus 4.6) in response to `elaborate.md`. Covers cockpit + 12 views (collapsed to 9 routes via shared composition). Decision record D.1–D.8 fixed. Six gap-resolution decisions taken (G.1–G.4 addressed; G.5 + G.6 deferred to v0.2). Three implementation sessions estimated. 28 ACs. Status `DRAFT_PENDING_NATIVE_REVIEW`.
- **v0.1.3 (2026-04-26)** — §19.3 appended: Session 3 deliverables (Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_3). Status PARTIALLY_IMPLEMENTED → IMPLEMENTED. All 28 ACs pass (cumulative across 3 sessions). 5 new components + 4 stub pages converted to full implementations. Governance scripts: drift=2, schema=2, mirror=0.
- **v0.1.2 (2026-04-26)** — §19.1 appended: Session 1 deliverables (Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1). Status APPROVED_FOR_IMPLEMENTATION → PARTIALLY_IMPLEMENTED. §3.4 footnote: branch (a) disposition recorded.
- **v0.1.1 (2026-04-26)** — Decisions captured at native review on 2026-04-26. Q.1–Q.8 dispositions recorded in §0.1; amendments A.1 (FILE_REGISTRY version verification — read observed CURRENT before bumping; do not assume v1.6) and A.2 (governance script report format verification — read disk shape before writing trend reader; document branch (a)/(b)/(c) choice as §3.4 footnote at implementation time) recorded in §0.2. Pre-implementation gating recorded in §0.3 (open after `Madhav_M2A_Exec_6` close per Q.5 option (a)). Status flipped `DRAFT_PENDING_NATIVE_REVIEW` → `APPROVED_FOR_IMPLEMENTATION`. Frontmatter `version` 0.1 → 0.1.1; `decisions_captured_on: 2026-04-26` field added. Body §1–§19 unchanged; §0 supersedes the body where they disagree. No governance scripts run; SESSION_LOG not appended; CURRENT_STATE not rotated (per native instruction at amendment time).

---

*End of PORTAL_BUILD_TRACKER_PLAN_v0_1.md. Authored by Claude Code (Opus 4.6) on 2026-04-26 during the planning_only session `Madhav_PORTAL_BUILD_TRACKER_PLAN_v0_1`. Decisions captured in-place 2026-04-26 at v0.1.1; status `APPROVED_FOR_IMPLEMENTATION`. The planning session HALTS after this amendment is written. The implementation session opens fresh after `Madhav_M2A_Exec_6` closes, with Sonnet 4.6 as executor; it reads this amended plan (including §0) as its primary input and authors its own `CLAUDECODE_BRIEF.md` from §11 ACs.*
