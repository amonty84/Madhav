---
artifact_id: PORTAL_REDESIGN_R0_REPORT
version: 1.0
status: COMPLETE
phase: R0 Foundation
authored_by: Claude Code (Sonnet 4.6)
authored_at: 2026-04-29
session_id: redesign-r0-foundation-2026-04-29
exec_brief: EXEC_BRIEF_PORTAL_REDESIGN_R0_FOUNDATION_v1_0.md
branch: redesign/r0-foundation
---

# Portal Redesign R0 Foundation — Closure Report

## Summary

R0 Foundation closed 2026-04-29. All §1–§8 deliverables from `EXEC_BRIEF_PORTAL_REDESIGN_R0_FOUNDATION_v1_0.md` are complete. The foundation layer is live on branch `redesign/r0-foundation` and ready for PR merge to `main`.

---

## §1 — Deliverables completed

| Deliverable | File(s) | Status |
|---|---|---|
| `<AppShell>` component | `platform/src/components/shared/AppShell.tsx` | ✅ |
| `<AppShellRail>` (left nav rail, avatar dropdown, sign-out) | `platform/src/components/shared/AppShellRail.tsx` | ✅ |
| `<AppShellBreadcrumb>` | `platform/src/components/shared/AppShellBreadcrumb.tsx` | ✅ |
| `<ZoneRoot zone="vellum\|ink\|bridge">` | `platform/src/components/shared/ZoneRoot.tsx` | ✅ |
| Zone CSS rules | `platform/src/app/globals.css` (additive) | ✅ |
| `PORTAL_REDESIGN_R0_ENABLED` feature flag (default true) | `platform/src/lib/config/feature_flags.ts` | ✅ |
| `/build → /cockpit` permanent redirect | `platform/src/app/build/page.tsx` + `[...slug]/page.tsx` | ✅ |
| Cockpit app migrated | `platform/src/app/cockpit/` (all sub-routes) | ✅ |
| BuildHeader: NAV_LINKS `/build/*` → `/cockpit/*`, avatar removed | `platform/src/components/build/BuildHeader.tsx` | ✅ |
| `DashboardHeader` retired | deleted from codebase | ✅ |
| `ForceDarkMode` retired | deleted from codebase | ✅ |
| `ConsumeForceDark` retired | deleted from codebase | ✅ |
| Dashboard layout: AppShell swap + flag gate | `platform/src/app/dashboard/layout.tsx` | ✅ |
| Audit layout: AppShell swap + flag gate | `platform/src/app/audit/layout.tsx` | ✅ |
| Admin layout: AppShell swap + flag gate | `platform/src/app/admin/layout.tsx` | ✅ |
| Clients layout: AppShell swap + flag gate | `platform/src/app/clients/[id]/layout.tsx` | ✅ |
| Cockpit layout: AppShell swap + flag gate | `platform/src/app/cockpit/layout.tsx` | ✅ |
| Consume layout: ZoneRoot `zone="ink"` | `platform/src/app/clients/[id]/consume/layout.tsx` | ✅ |
| Login page: ZoneRoot `zone="ink"` | `platform/src/app/login/page.tsx` | ✅ |
| Unit tests: ZoneRoot (6 cases) | `platform/tests/components/ZoneRoot.test.tsx` | ✅ |
| Unit tests: AppShell (8 cases) | `platform/tests/components/AppShell.test.tsx` | ✅ |
| E2e smoke: AppShell authenticated routes | `platform/tests/e2e/portal/appshell.spec.ts` | ✅ |
| E2e smoke: /build → /cockpit redirects | `platform/tests/e2e/portal/cockpit-redirect.spec.ts` | ✅ |
| Config test additions (PORTAL_REDESIGN_R0_ENABLED) | `platform/tests/unit/config/index.test.ts` | ✅ |
| VISION promoted DRAFT → CURRENT | `00_ARCHITECTURE/PORTAL_REDESIGN_VISION_v1_0.md` | ✅ |
| TRACKER updated (R0 row closed, §2 refreshed) | `00_ARCHITECTURE/PORTAL_REDESIGN_TRACKER_v1_0.md` | ✅ |
| VISION + TRACKER added to CANONICAL_ARTIFACTS | `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md §1` | ✅ |
| CLAUDE.md §C item #12 added | `CLAUDE.md` | ✅ |

---

## §2 — Forced scope expansions (documented)

Two files outside the strict R0 `may_touch` list required intervention because they imported the deleted components (`ForceDarkMode`, `ConsumeForceDark`). Leaving them would have caused a compilation failure:

| File | Change |
|---|---|
| `platform/src/app/reset-password/page.tsx` | Replaced `ForceDarkMode` import + JSX with `ZoneRoot zone="ink"` |
| `platform/src/components/consume/ConsumeChat.tsx` | Removed `ConsumeForceDark` import + JSX (`<ConsumeForceDark />`) |

These are pure import-substitution / deletion changes with no logic impact. Documented here per the forced-scope rule in the exec brief.

---

## §3 — Type system fixes

1. **`FeatureFlag` union** — `PORTAL_REDESIGN_R0_ENABLED` was added to `platform/src/lib/config/feature_flags.ts` (union + defaults). TypeScript previously rejected all layout `getFlag('PORTAL_REDESIGN_R0_ENABLED')` calls.

2. **`AppShell` profile type** — The `status` field in the AppShell / AppShellRail profile interface was widened from `'active' | 'inactive'` (incorrect) to `status?: string`. The real DB `ProfileAuth.status` is `'pending' | 'active' | 'disabled'`; neither shell component uses the status field (status gate happens in the layout before AppShell renders), so the widening is safe.

3. **Stale config test** — `operational gradient flags default to false` test incorrectly asserted `PANEL_MODE_ENABLED: false` (that flag was flipped to `true` in Phase 11A). Corrected the test to remove `PANEL_MODE_ENABLED` from the "defaults false" list.

---

## §4 — Branch context

The `redesign/r0-foundation` branch was created from `main` (governance-only). `feature/amjis-platform` (the platform code branch) was merged in to provide `platform/src/`. All R0 work was committed on `redesign/r0-foundation`. The branch is ready for a PR to `main`.

---

## §5 — Known residuals / follow-ups

1. **Playwright smoke tests require a dev server.** `appshell.spec.ts` requires `SMOKE_SESSION_COOKIE`; `cockpit-redirect.spec.ts` requires no auth. Both are skip-guarded in CI unless the env vars are set. Run manually before PR merge: `npx playwright test tests/e2e/portal/`.

2. **`parallelism_check.py` governance script** — referenced in `PORTAL_REDESIGN_VISION_v1_0.md §4.3.5` as a future check. Not in scope for R0; defer to a future session.

3. **`PORTAL_REDESIGN_R0_ENABLED` flag** — default `true`. To revert to legacy layouts: `MARSYS_FLAG_PORTAL_REDESIGN_R0_ENABLED=false`. Feature flag removal (with full legacy-path deletion) is R7 scope.

4. **Platform Hygiene CLAUDECODE_BRIEF.md** — current `CLAUDECODE_BRIEF.md` was replaced by Cowork with a Platform Hygiene brief before R0 completed. That brief (H.2 + M.1 + M.2) is the next pending session; it is independent of and does not conflict with R0.

---

## §6 — Governance scripts

`mirror_enforcer.py`, `drift_detector.py`, and `schema_validator.py` should be run as part of the PR pre-merge check. R0 only touches platform UI and governance artifact updates (VISION + TRACKER + CANONICAL_ARTIFACTS + CLAUDE.md). No Gemini-side mirror update required (TRACKER frontmatter declares `mirror_mode: claude_only`).

---

*End of PORTAL_REDESIGN_R0_REPORT_v1_0.md (status: COMPLETE, 2026-04-29).*
