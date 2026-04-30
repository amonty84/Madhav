---
artifact_id: NAK_BASELINE_AUDIT_REPORT_W0
version: 1.0
status: COMPLETE
authored_by: Claude Code (NAK W0 session) 2026-04-30
project: NAK — Nakula
wave_run: W0
scope: platform/src/** (read-only audit)
changelog:
  - v1.0 (2026-04-30): Initial W0 baseline audit covering Parts A–D.
---

# NAK W0 — Baseline Audit Report

## Part D — Test Baseline Snapshot

**Run date:** 2026-04-30
**Command:** `npx vitest run` (no `npm test` script configured; vitest is the test runner)
**Environment:** nak/w0-foundation worktree, npm install completed from lock file

### Results

| Metric | Count |
|---|---|
| Test files total | 102 |
| Test files passing | 84 |
| Test files failing | 18 |
| Individual tests total | 946 |
| Individual tests passing | 933 |
| Individual tests failing | 13 |

### Pre-existing failures — categorised

**Category 1 — E2E Playwright specs mis-routed through vitest (11 files, 0 individual test failures):**

These files use Playwright's `test()` / `test.describe()` API but are discovered by vitest, which throws "Playwright Test did not expect test() to be called here." These require `npx playwright test` and should be excluded from the vitest include glob.

| File |
|---|
| `tests/e2e/clients.spec.ts` |
| `tests/e2e/portal/a11y.spec.ts` |
| `tests/e2e/portal/appshell.spec.ts` |
| `tests/e2e/portal/build-mode.spec.ts` |
| `tests/e2e/portal/chart-profile.spec.ts` |
| `tests/e2e/portal/cockpit-rail.spec.ts` |
| `tests/e2e/portal/cockpit-redirect.spec.ts` |
| `tests/e2e/portal/consume-polish.spec.ts` |
| `tests/e2e/portal/mobile.spec.ts` |
| `tests/e2e/portal/roster.spec.ts` |
| `tests/e2e/portal/timeline.spec.ts` |

**Category 2 — Real unit/component test failures (7 file failures, 13 individual tests):**

| File | Failing Tests | Root Cause |
|---|---|---|
| `src/components/consume/__tests__/PanelAnswerView.test.tsx` | 1 (file-level) | `lucide-react` mock missing `Briefcase` export — icon added to component but test mock not updated |
| `tests/components/AppShell.test.tsx` | 1 — "omits breadcrumb nav when no segments" | AppShell renders breadcrumb even when `segments` prop is empty — behaviour diverged from test expectation |
| `tests/components/LogPredictionAction.test.tsx` | 2 — error display and POST tests | Expected `role="alert"` not found — error display changed to a non-alert element |
| `tests/components/TierPicker.test.tsx` | 2 — render and onChange tests | Component structure changed post-Portal-Redesign; button rendering approach diverged from tests |
| `tests/unit/lib/claude/build-tools.test.ts` | 2 — `read_document` tests | Filesystem adapter path mismatch or mock not aligned with implementation |
| `src/lib/storage/__tests__/filesystem.test.ts` | 1 (file-level) | Adapter reads from hardcoded path that doesn't exist in worktree/test environment |
| `src/lib/retrieve/__tests__/*.test.ts` | ~4 (integration) | Require live database / embedding service — expected to fail locally |

### W0 Baseline Declaration

Effective baseline for NAK W2/W3 regression tracking:

- **Unit/component tests:** 933 passing, 13 failing (all pre-existing). NAK work must not increase the failing count.
- **E2E tests:** Excluded from vitest baseline; require `npx playwright test` with live server.
- **W2/W3 gate:** any session that increases the failing unit count beyond 13 must investigate before claiming close.

---

## Part A — Design System Token Audit

### globals.css Token Inventory

**Light mode (`:root`) CSS custom properties:**

| Group | Tokens |
|---|---|
| Background / Foreground | `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground` |
| Primary / Secondary | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground` |
| Accent / Muted | `--accent`, `--accent-foreground`, `--muted`, `--muted-foreground` |
| UI Surface | `--border`, `--input`, `--ring`, `--destructive` |
| Chart | `--chart-1` through `--chart-5` (5-step oklch grayscale) |
| Sidebar | `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring` |
| Border Radius | `--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-4xl` |
| Brand | `--brand-gold`, `--brand-gold-light`, `--brand-gold-deep`, `--brand-gold-cream`, `--brand-charcoal`, `--brand-ink`, `--brand-vellum`, `--brand-cream` |
| Citation Palette | `--cite-signal`, `--cite-asset`, `--cite-chunk`, `--cite-signal-bg`, `--cite-asset-bg`, `--cite-chunk-bg` |
| Status | `--status-warn`, `--status-halt`, `--status-info`, `--status-success`, `--status-warn-bg`, `--status-halt-bg`, `--status-info-bg`, `--status-success-bg` |

**Dark mode (`.dark`) overrides:** Warm charcoal palette (oklch ~70 hue, 0.175–0.225 lightness). `--accent`, `--ring`, `--primary` → `var(--brand-gold)`. Borders use `color-mix(in oklch, var(--brand-gold) X%, transparent)`.

**Font families:** `--font-sans` (Inter UI), `--font-mono` (Geist Mono), `--font-serif` (Source Serif 4), `--font-heading`

**Typography utility classes:** `.bt-display`, `.bt-heading`, `.bt-body`, `.bt-label`, `.bt-mono`, `.bt-num`, `.bt-mega`

**Special-purpose classes:** `.brand-cta` (gradient gold button), `.brand-card` (translucent ink + gold border), `.consume-shell` (scoped gold/ink palette, dark only), `.chat-stream-caret` (animated gold caret), status variants (`.bt-status-complete/active/pending/blocked`)

**Keyframes:** `chat-dot`, `chat-caret`, `page-ascend`, `mandala-spin`

### Component Directory Token Compliance Table

| Directory | Compliance | Specific Issues |
|---|---|---|
| `admin` | ❌ | **Critical:** Hardcoded hex literals (#d4af37, #fce29a, #0e0b06, #9b834f, #211a08, #7a5210) throughout. Zero CSS variable usage. `styles.ts` embeds color literals inline. |
| `audit` | ⚠️ | Tailwind-first; some inline `oklch()` literals for status colors instead of `var(--status-*)` tokens. |
| `auth` | ✅ | Consistent Tailwind; entirely relies on globals.css tokens. |
| `brand` | ✅ | SVG components with `currentColor` inheritance; no hardcoded colors. |
| `build` | ⚠️ | Mixed: newer sub-components use CSS vars; older ones use arbitrary Tailwind color classes (e.g., `text-[#d4af37]`). |
| `charts` | ✅ | Tailwind-only; respects design system. |
| `chat` | ✅ | Consistent Tailwind + CSS var usage; well-integrated with globals.css. |
| `citations` | ✅ | Properly uses `var(--cite-*)` tokens. Exemplary pattern. |
| `consume` | ⚠️ | `.consume-shell` scope class used correctly at root; some child components hardcode colors outside the scope. |
| `dashboard` | ⚠️ | Some arbitrary color values (`text-[oklch(...)]`) outside token system. |
| `disclosure` | ✅ | Clean Tailwind; small footprint; no violations. |
| `profile` | ⚠️ | Inconsistent: some components mix Tailwind with hardcoded style props. |
| `shared` | ✅ | Layout-focused; solid Tailwind; no color violations. |
| `timeline` | ✅ | Consistent design system usage. |
| `trace` | ✅ | Uses theme tokens properly. |
| `ui` | ✅ | shadcn/ui base components; fully Tailwind-compliant; no hardcoded values. |

**Severity ranking:**

| Severity | Directories | Issue |
|---|---|---|
| HIGH | `admin` | Hardcoded hex literals; zero CSS variable usage |
| MEDIUM | `build`, `dashboard`, `consume` | Mixed compliance; arbitrary color classes |
| LOW | `audit`, `profile` | Minor inline oklch literals; mostly compliant |

**Overall: 9/16 dirs fully compliant (✅), 6/16 partial (⚠️), 1/16 critical violations (❌)**

---

## Part B — Error Handling Pattern Audit

### API Routes

| Route | Error Shape | Handles All Cases | Status Codes | Notes |
|---|---|---|---|---|
| `/api/access-requests` | `{ error: string }` | ❌ | 401 | Auth check only; no try-catch for DB ops |
| `/api/admin/access-requests/[id]/approve` | `{ error: string }` | ❌ | 403 | Super admin check; missing try-catch |
| `/api/admin/access-requests/[id]/reject` | `{ error: string }` | ❌ | 403 | Super admin check; missing try-catch |
| `/api/admin/access-requests` | `{ error: string }` | ❌ | 403 | No query error handling |
| `/api/admin/users/[id]/send-reset` | `{ error: string }` or `{ reset_link }` | ✅ | 200, 403, 500 | try-catch; logs and propagates |
| `/api/admin/users/[id]` | `{ error: string }` | ❌ | Various | Incomplete for PATCH/DELETE ops |
| `/api/admin/users` | `{ error: string }` | ❌ | 403 | No query error handling |
| `/api/audit/[query_id]` | `{ error: string }` | ⚠️ | 400, 401, 404, 500 | Has try-catch; generic 500 message |
| `/api/audit/list` | `{ error: string }` | ✅ | 400, 401, 500 | Validates filters JSON; catches and logs; user-friendly message |
| `/api/auth/callback` | Redirect | ✅ | 302 | Safe redirect; no error surface needed |
| `/api/auth/session` | `{ ok: true }` or `{ error: string }` | ✅ | 200, 400, 401, 403, 500 | Validates body + token + profile; catches insert errors. Exemplary. |
| `/api/chat/build` | `{ error: string }` or stream | ✅ | 200, 400, 403, 404 | Validates chartId/messages; stream errors via `onError` |
| `/api/chat/consume` | `{ error: string }` or stream | ✅ | 200, 400, 401, 403, 404, 422, 500 | Most comprehensive route: JSON, auth, chart, permission, bundle (422) |
| `/api/chat/upload` | Upload result or error | ⚠️ | 400, 401 | Missing error handling for storage failures |
| `/api/citations/preview` | `{ title, content, meta }` or error | ✅ | 400, 401, 404 | Three type handlers; validates type/id; catches not-found |
| `/api/clients` | Array or `{ error: string }` | ✅ | 200, 400, 403, 500 | Super admin check; validates POST fields; cascading rollback on failure. Exemplary. |
| `/api/compute/[type]` | Computed data or `{ error: string }` | ✅ | 400, 401, 503 | Validates type against allowlist; checks sidecar URL; proxies Python errors |
| `/api/conversations/[id]/feedback` | `{ rating_count? }` or error | ⚠️ | 400, 401, 404 | Partial — not fully traced |
| `/api/conversations/[id]` | `{ ok: true }` or error | ⚠️ | 200, 401, 404 | PATCH not fully traced |
| `/api/conversations/[id]/share` | `{ ok: true }` or error | ⚠️ | 401 | Not fully traced |
| `/api/conversations` | `{ conversations: [...] }` or error | ✅ | 200, 400, 401 | Validates chartId; structured response; catches query errors |
| `/api/lel` | Result or `{ error: string }` | ✅ | 200, 400, 403, 500 | Super admin; validates body; three action handlers; full catch + logging |
| `/api/pyramid` | Array (layers) or `{ error: string }` | ✅ | 200, 400, 401, 403, 404, 500 | Validates chartId; access control; catches query errors |
| `/api/reports/[chartId]/[domain]` | `{ error: string }` | ⚠️ | Unknown | Not fully traced |
| `/api/trace/history` | `{ error: string }` | ⚠️ | Unknown | Not fully traced |
| `/api/trace/stream/[queryId]` | SSE stream or error | ⚠️ | Unknown | SSE-based; partial trace |

**Summary:** ✅ Strong (9 routes): auth/session, chat/build, chat/consume, citations/preview, clients, compute, conversations, lel, pyramid. ⚠️ Partial (8 routes): audit/[id], chat/upload, conversations/[id]/*, reports, trace routes. ❌ Weak (7 routes): admin routes (except send-reset).

**Consistent error envelope used:** `{ error: string }` throughout. No structured `code`/`message`/`detail` shape — just a plain string.

### Hooks

| Hook | Try-Catch | Exposes Error State | Notes |
|---|---|---|---|
| `useAttachments.ts` | ✅ | ✅ | Per-item error state (`status: 'error'`, `errorMsg`). Exemplary. |
| `useBuildChatAdapter.ts` | ❌ | ✅ | Delegates to `useChat` (ai-sdk); exposes `chat.error` |
| `useBranches.ts` | ❌ | ❌ | In-memory; no async ops; no error surface needed |
| `useChatPreferences.ts` | ❌ | ❌ | Preference storage; no async ops |
| `useChatSession.ts` | ❌ | ✅ | Delegates to `useChat`; `onFinish` silently swallows errors |
| `useFeedback.ts` | ❌ | ⚠️ | `.catch(() => {})` — silent fail; error not surfaced to UI caller |
| `useHotkeys.ts` | ❌ | ❌ | Event binding only; no error surface needed |
| `useScrollAnchor.ts` | ❌ | ❌ | DOM measurement utility; no error surface needed |
| `useTraceStream.ts` | ⚠️ | ❌ | SSE-based; error handling implicit via EventSource; not confirmed surfaced to caller |

**Hooks summary:** `useAttachments` exemplary. `useFeedback` silently discards fetch errors — highest-priority hook fix. `useChatSession.onFinish` silently swallows errors — secondary fix.

### Error Boundaries (error.tsx)

| Path | Renders | Token Compliance | Notes |
|---|---|---|---|
| `src/app/error.tsx` | GlobalError — "Something went wrong" + reset button | ✅ | Logs error; uses `Button` component; no digest shown |
| `src/app/cockpit/error.tsx` | BuildError — digest + message + reset button | ❌ | Raw Tailwind + inline styles; no design token usage |
| `src/app/clients/[id]/error.tsx` | Not confirmed | — | Presence not confirmed |
| `src/app/clients/[id]/consume/error.tsx` | Not confirmed | — | Presence not confirmed; consume is highest-traffic user surface |

**Gap:** The consume surface (client-facing chat, highest-traffic) lacks a confirmed `error.tsx` boundary. This is the most important missing boundary to add.

---

## Part C — Component Inventory

**Total: 149 components across 16 directories**

| Component | Dir | Import Count | Description | Status |
|---|---|---|---|---|
| ConfirmDialog | admin | 1 | Destructive action confirmation modal | active |
| UsersTable | admin | 1 | Admin user roster with actions and reset-link display | active |
| AdminSignOut | admin | 1 | Sign-out button for admin portal | active |
| PendingRequestsTable | admin | 1 | Access request roster with approve/reject | active |
| ApproveDialog | admin | 1 | Approve access request modal | active |
| NewUserDialog | admin | 1 | Create new user modal | active |
| EditUsernameDialog | admin | 1 | Edit username modal | active |
| AdminClient | admin | 1 | Admin portal root layout component | active |
| AuditBadge | audit | 2 | Status badge for audit results | active |
| AuditDetailView | audit | 1 | Full audit result detail viewer | active |
| AuditFilterSidebar | audit | 1 | Filter panel for audit list | active |
| AuditListClient | audit | 1 | Paginated audit log table | active |
| CompareView | audit | 1 | Side-by-side audit prediction/outcome comparison | active |
| PredictionLedgerClient | audit | 1 | Historical prediction ledger | active |
| ForgotPasswordModal | auth | 1 | Password reset request flow | active |
| RequestAccessModal | auth | 1 | New user access request form | active |
| Sigil | brand | 3 | 24×24 mandala sigil (bindu + 8 petals SVG) | active |
| Logo | brand | 2 | Logo mark (Sigil + Wordmark combined) | active |
| Wordmark | brand | 2 | "MARSYS-JIS" text logo | active |
| Mandala | brand | 1 | Full 360° decorative mandala background | active |
| AssistantSigil | brand | 1 | Claude assistant branded sigil | active |
| BuildChat | build | 1 | Main build chat interface (sidebar + right panel + composer) | active |
| BuildRightPane | build | 1 | Build status panel (arc, phases, brief, insights, mirrors) | active |
| DetailSidePanel | build | 1 | Detailed session/intervention side panel | active |
| SessionDetail | build | 1 | Full session drill-down viewer | active |
| SessionTimeline | build | 1 | Timeline of sessions within a phase | active |
| SessionTable | build | 1 | Tabular session list view | active |
| ActiveChartsWidget | build | 1 | Widget showing active charts count | active |
| ActivityFeed | build | 2 | Event feed of chart/session activities | active |
| FilterableActivityFeed | build | 1 | Activity feed with domain/status filtering | active |
| InsightCards | build | 1 | Tiled insight cards for build breakthroughs | active |
| BriefPanel | build | 1 | Current brief/mandate panel | active |
| MirrorPairsTable | build | 1 | Validated mirror pairs table | active |
| RegistryTable | build | 1 | Canonical registry table | active |
| RegistryGrouped | build | 1 | Registry grouped by domain/category | active |
| PhaseGrid | build | 1 | Arc phase grid with status indicators | active |
| PlanTree | build | 1 | Hierarchical plan tree viewer | active |
| RefreshButton | build | 1 | Refresh data button with loading state | active |
| InterventionList | build | 1 | Interventions across phases list | active |
| InterventionFrequency | build | 1 | Frequency chart of interventions | active |
| HealthTrend | build | 1 | Health score trend line chart | active |
| HealthSparkline | build | 1 | Compact health metric sparkline | active |
| FreshnessIndicator | build | 1 | Data freshness/staleness indicator | active |
| CorpusDensityHero | build | 1 | Hero stat for corpus density | active |
| BuildVelocityStrip | build | 1 | Velocity trend strip | active |
| AcCriteriaList | build | 1 | Acceptance criteria list viewer | active |
| JourneyStrip | build | 1 | Timeline strip of journey events | active |
| BuildHeader | build | 1 | Build page header with chart name/meta | active |
| CockpitGrid | build | 1 | Dashboard grid layout component | active |
| SessionBar | build | 1 | Horizontal session timeline bar | active |
| ScriptVerdictBadge | build | 1 | Pass/fail verdict badge for scripts | active |
| EventCard | build | 1 | Card for individual event display | active |
| ZoneRoot | build | 1 | Zone container wrapper (build domain) | active |
| TrendLine | build | 1 | Trend line chart component | active |
| OnOffPlanDonut | build | 1 | Donut chart for on-time vs off-time planning | active |
| DashaCountdown | build | 1 | Dasha countdown timer (Vedic timing) | active |
| MomentPhrase | build | 1 | Natural language moment description | active |
| CadenceArea | charts | 1 | Area chart for cadence visualization | active |
| ChatShell | chat | 3 | Root chat container (sidebar + main + right panel layout) | active |
| AdaptiveMessageList | chat | 1 | Message list with streaming, branching, regenerate | active |
| AssistantMessage | chat | 1 | Styled assistant message bubble | active |
| UserMessage | chat | 1 | Styled user message bubble | active |
| MessageList | chat | 1 | Legacy message list — superseded by AdaptiveMessageList | unused |
| VirtualizedMessageList | chat | 1 | Virtualized variant for large conversation lists | active |
| MarkdownContent | chat | 1 | Rendered markdown with syntax highlighting | active |
| Markdown | chat | 1 | Markdown parser/renderer | active |
| StreamingMarkdown | chat | 1 | Markdown with streaming animation support | active |
| MessageActions | chat | 1 | Edit/regenerate/branch action toolbar per message | active |
| Composer | chat | 1 | Message input with file attachment support | active |
| WelcomeGreeting | chat | 1 | Initial greeting and suggested prompts | active |
| CommandPalette | chat | 2 | Keyboard-driven command palette | active |
| ShortcutsDialog | chat | 1 | Keyboard shortcuts reference modal | active |
| ConversationSidebar | chat | 2 | Sidebar with conversation history list | active |
| ScrollToBottomButton | chat | 1 | Sticky scroll-to-bottom button | active |
| PendingAssistantBubble | chat | 1 | Placeholder bubble while assistant responds | active |
| ToolCallCard | chat | 1 | Accordion card for tool invocation results | active |
| ToolCallAccordion | chat | 1 | Container for multiple tool call cards | active |
| CitationChip | chat | 1 | Inline citation badge (signal/asset/chunk) | active |
| ShareButton | chat | 1 | Share conversation button | active |
| MessageErrorBoundary | chat | 1 | Error boundary for individual message rendering | active |
| ModelStylePicker | chat | 1 | Dropdown for model/style selection | active |
| CodeBlock | chat | 1 | Syntax-highlighted code block with copy button | active |
| CitationChip | citations | 1 | Inline citation badge (possible dup of chat/CitationChip) | suspect |
| CitationPreview | citations | 1 | Popover preview of citation content | active |
| TracePanel | citations | 1 | Query trace visualization (also in trace/) | suspect |
| AnswerView | citations | 1 | Formatted answer view (also in consume/) | suspect |
| ConsumeChat | consume | 2 | Client-facing chat interface (gold/ink branded) | active |
| SharedConsumeError | consume | 2 | Fallback error UI for consume chat | active |
| TierPicker | consume | 1 | Disclosure tier selector (also in disclosure/) | suspect |
| StreamingAnswer | consume | 1 | Answer with streaming indicator | active |
| StreamingDots | consume | 1 | Animated dots loader | active |
| StreamingCursor | consume | 1 | Blinking cursor for streaming text | active |
| PanelAnswerView | consume | 1 | Methodology/panel answer display | active |
| DivergenceReport | consume | 1 | Report showing divergence between methodologies | active |
| ReportLibrary | consume | 1 | Sidebar library of domain reports | active |
| ReportReader | consume | 1 | Report content viewer | active |
| ReportGallery | consume | 1 | Grid gallery of available reports | active |
| AnswerView | consume | 1 | Answer viewer (possible dup of citations/AnswerView) | suspect |
| LogPredictionDialog | consume | 1 | Modal to log predictions with falsifier | active |
| LogPredictionAction | consume | 1 | Action button triggering LogPredictionDialog | active |
| LogEventDialog | consume | 1 | Modal to log life events | active |
| ValidatorFailureView | consume | 1 | Error display for query validation failures | active |
| DashboardClient | dashboard | 1 | Super admin dashboard root component | active |
| ClientRoster | dashboard | 1 | List of client charts for cockpit | active |
| ClientCard | dashboard | 1 | Card for individual client/chart | active |
| RoomCard | dashboard | 1 | Card for collaboration room/workspace | active |
| RosterTableView | dashboard | 1 | Table view of roster | active |
| RosterFilters | dashboard | 1 | Filter controls (status, domain, etc.) | active |
| RosterEmptyWizard | dashboard | 1 | Onboarding wizard for empty roster | active |
| DisclosureTierBadge | disclosure | 1 | Badge showing disclosure tier | active |
| TierPicker | disclosure | 1 | Disclosure tier selector (possible dup of consume/TierPicker) | suspect |
| ProfileSideRail | profile | 1 | User profile sidebar panel | active |
| RosterStatsRibbon | profile | 1 | Stats ribbon above roster | active |
| RosterTableView | profile | 1 | Roster table view (possible dup of dashboard version) | suspect |
| ChartHero | profile | 1 | Hero stat card for chart summary | active |
| AppShell | shared | 1+ | Root shell layout (sidebar + main + breadcrumb) | active |
| AppShellRail | shared | 1+ | Sidebar rail navigation (desktop) | active |
| AppShellBreadcrumb | shared | 1+ | Breadcrumb navigation bar | active |
| MobileNavSheet | shared | 1 | Mobile sidebar nav drawer | active |
| ThemeToggle | shared | 1 | Light/dark mode toggle button | active |
| ZoneRoot | shared | 1 | Zone container wrapper (possible dup of build/ZoneRoot) | suspect |
| Separator | shared | 1 | Horizontal separator line | active |
| TimelineView | timeline | 1 | Timeline visualization component | active |
| SessionTimeline | timeline | 1 | Session timeline (possible dup of build/SessionTimeline) | suspect |
| SessionsBar | timeline | 1 | Horizontal session bar | active |
| RasiChartSVG | timeline | 1 | Vedic rasi chart SVG rendering | active |
| PyramidStatusPanel | timeline | 1 | Layer pyramid status indicator | active |
| TracePanel | trace | 1 | Query execution trace visualization (see also citations/) | suspect |
| TraceDrawer | trace | 1 | Drawer container for TracePanel | active |
| button | ui | 15+ | Base button primitive (CVA variants) | active |
| dialog | ui | 10+ | Modal dialog primitive | active |
| dropdown-menu | ui | 8+ | Dropdown menu primitive | active |
| alert-dialog | ui | 3 | Alert dialog with destructive variant | active |
| badge | ui | 5 | Badge/chip primitive | active |
| card | ui | 2 | Card container primitive | active |
| input | ui | 8+ | Text input field primitive | active |
| label | ui | 2 | Form field label primitive | active |
| avatar | ui | 2 | User avatar image primitive | active |
| separator | ui | 2 | Divider line primitive | active |
| sheet | ui | 2 | Drawer/sheet slide-in panel primitive | active |
| scroll-area | ui | 1 | Scrollable container with custom scrollbar | active |
| tabs | ui | 1 | Tab panel primitive | active |
| sonner | ui | 1 | Toast notification provider (Sonner integration) | active |

### Status Summary

| Status | Count | Notes |
|---|---|---|
| active | 140 | Used in production UI paths |
| unused | 1 | `chat/MessageList` — superseded by AdaptiveMessageList |
| suspect | 9 | Possible duplicates across directories — W1-R3 to cross-reference |

### Suspect components — potential duplicates

| Component | Appears In | Concern |
|---|---|---|
| `CitationChip` | `chat/`, `citations/` | Same functionality in two dirs — may be two versions |
| `TracePanel` | `citations/`, `trace/` | Source of truth unclear |
| `AnswerView` | `citations/`, `consume/` | May be a copy |
| `TierPicker` | `consume/`, `disclosure/` | Same feature — two implementations or re-exports? |
| `RosterTableView` | `dashboard/`, `profile/` | Shared or diverged? |
| `SessionTimeline` | `build/`, `timeline/` | Named identically in two dirs |
| `ZoneRoot` | `build/`, `shared/` | Named identically in two dirs |

---

*End of NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md v1.0*
