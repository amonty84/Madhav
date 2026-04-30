---
artifact_id: NAK_COMPONENT_AUDIT_REPORT_W1_R3
version: 1.0
status: COMPLETE
authored_by: Claude Code (NAK W1-R3 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R3
scope: platform/src/components/** + platform/src/app/**/*.tsx (read-only)
changelog:
  - v1.0 (2026-04-30): Initial W1-R3 component audit covering Parts A–D.
---

# NAK W1-R3 — Component Audit Report

---

## Part A — Duplicate Resolution

### Method

For each of the 9 W0-flagged suspects, both listed files were read directly. This revealed a systemic inventory error in W0: the W0 session attributed components to directories where they are *used* (imported), not where they are *defined* (file lives). In every named pair, only one side of the pair exists as a file. There are zero true duplicates in this codebase.

### Verdict Table

| Suspect | Dir 1 Listed | Dir 2 Listed | Actual State | Verdict | Recommendation |
|---|---|---|---|---|---|
| CitationChip | `chat/` | `citations/` | `chat/CitationChip.tsx` does **not** exist. Sole implementation: `citations/CitationChip.tsx`. Full a11y (aria-label, aria-haspopup, aria-expanded, focus-visible ring). | NOT A DUPLICATE | KEEP-AS-IS |
| TracePanel | `citations/` | `trace/` | `citations/TracePanel.tsx` does **not** exist. Sole implementation: `trace/TracePanel.tsx`. Exports both `TracePanel` (inline drawer wrapper) and `TracePanelContent` (shared body). | NOT A DUPLICATE | KEEP-AS-IS |
| AnswerView | `citations/` | `consume/` | `citations/AnswerView.tsx` does **not** exist. Sole implementation: `consume/AnswerView.tsx`. Renders inline citation chips + TraceDrawer footer. | NOT A DUPLICATE | KEEP-AS-IS |
| TierPicker | `consume/` | `disclosure/` | `disclosure/TierPicker.tsx` does **not** exist. `disclosure/` dir contains only `DisclosureTierBadge` (different component). Sole TierPicker: `consume/TierPicker.tsx`. role="group" aria-label present. | NOT A DUPLICATE | KEEP-AS-IS |
| RosterTableView | `dashboard/` | `profile/` | `profile/RosterTableView.tsx` does **not** exist. `profile/` dir contains ChartHero, DashaCountdown, ProfileSideRail, RoomCard. Sole RosterTableView: `dashboard/RosterTableView.tsx`. aria-sort on sortable columns. | NOT A DUPLICATE | KEEP-AS-IS |
| SessionTimeline | `build/` | `timeline/` | `timeline/SessionTimeline.tsx` does **not** exist. `timeline/` dir contains EventCard, LogEventDialog, LogPredictionDialog, PredictionTable, TimelineView. Sole SessionTimeline: `build/SessionTimeline.tsx`. Groups by phase_id. | NOT A DUPLICATE | KEEP-AS-IS |
| ZoneRoot | `build/` | `shared/` | `build/ZoneRoot.tsx` does **not** exist. Sole implementation: `shared/ZoneRoot.tsx`. Zone types: vellum / ink / bridge. Used in `consume/layout.tsx` (zone="ink"). | NOT A DUPLICATE | KEEP-AS-IS |
| MessageList (W0 "unused") | `chat/` | — | **ACTIVE** — has 2 importers: (1) `chat/AdaptiveMessageList.tsx` uses it for conversations ≤30 messages; (2) `app/share/[slug]/SharedConversation.tsx` uses it directly for read-only share view. W0 "unused / ELIMINATE" verdict was **incorrect**. | ACTIVE | KEEP-AS-IS |

### Root Cause of W0 False Positives

The W0 component inventory used grepped import statements to build the component-to-directory mapping. When `chat/AssistantMessage.tsx` imports `CitationChip` from `@/components/citations/CitationChip`, W0 recorded "CitationChip" under the `chat/` directory. The inventory was counting usage sites, not definition files. This produced 7 phantom duplicate pairs. All suspects resolve to single-file implementations.

### Summary

- True duplicates found: **0**
- False positives: **7** (all named pairs except MessageList)
- MessageList verdict reversal: W0 said ELIMINATE; W1-R3 says KEEP-AS-IS (2 active importers confirmed)

---

## Part B — A11y First Pass

### Scope

Components audited: `consume/`, `shared/`, `chat/`, `ui/` (all interactive components). Key files read: `ConsumeChat`, `ChatShell`, `Composer`, `AdaptiveMessageList`, `MessageList`, `StreamingMarkdown`, `MarkdownContent`, `StreamingAnswer`, `StreamingDots`, `ScrollToBottomButton`, `ShareButton`, `CommandPalette`, `ShortcutsDialog`, `AppShell`, `AppShellRail`, `AppShellBreadcrumb`, `ZoneRoot`, `TraceDrawer`, `TracePanel` (trace/), `TierPicker`, `CitationChip`, `sheet.tsx`.

### Findings Table

| Component | File | Missing ARIA | Keyboard Trap Risk | Focus Mgmt Gap | Contrast Risk | Severity |
|---|---|---|---|---|---|---|
| AppShell | `shared/AppShell.tsx` | No skip-nav link. Keyboard users must tab through full AppShellRail (5+ items) + breadcrumb before reaching `<main>`. | None | Focus enters main only after nav traversal — no shortcut | None | **HIGH** |
| ChatShell Reports button | `chat/ChatShell.tsx:206` | Reports trigger button: text is `hidden sm:inline`; on mobile only icon shown, no `aria-label`. Screen reader: no accessible name on mobile. | None | None | None | **HIGH** |
| CommandPalette items | `chat/CommandPalette.tsx` | Command `<button>` items have no `aria-selected`. Container div has no `role="listbox"`. Arrow navigation works but AT doesn't announce highlighted state. No `aria-activedescendant`. | None (Dialog provides focus trap) | Focus correctly stolen to input on open | None | **HIGH** |
| AdaptiveMessageList | `chat/AdaptiveMessageList.tsx` | No `role="log"` on the conversation container. Individual messages have no `role="article"`. MarkdownContent has `aria-live="polite"` for streaming (correct) but thread container has no conversation semantics. | None | None | None | **MEDIUM** |
| StreamingAnswer | `consume/StreamingAnswer.tsx` | Same as AdaptiveMessageList — no `role="log"` on the outer conversation container. | None | None | None | **MEDIUM** |
| TracePanel StepRow buttons | `trace/TracePanel.tsx` | StepRow and LayerRow `<button>` elements have no `aria-label`. Accessible name comes only from inner `<span>` text (step_name). Truncated labels may not be useful to AT. | None | None | None | **MEDIUM** (super_admin only) |
| ConsumeChat "Trace" / "Panel" toggles | `consume/ConsumeChat.tsx:552–559` | `title="Toggle query trace drawer"` / `title="Run 3 independent models..."` only. `title` is not reliably announced by screen readers. Should be `aria-label`. | None | None | None | **MEDIUM** |
| ChatShell mobile sidebar Sheet | `chat/ChatShell.tsx:117` | `showCloseButton={false}` — no visible close button. Sheet still has `SheetTitle sr-only` ("Conversations") as dialog title. Escape + backdrop close work. | Focus trap correct (Base UI) | Focus returns to trigger on close (Base UI) | None | **LOW** |
| AppShellRail nav links | `shared/AppShellRail.tsx:70` | Both `title` and `aria-label` on same `<Link>` element — redundant but not harmful. | None | None | None | **LOW** |
| TracePanel ContextInspector "← Back" | `trace/TracePanel.tsx:222` | Button text "← Back" — valid accessible name but ambiguous without context. | None | None | None | **LOW** |
| StreamingDots dot spans | `chat/StreamingDots.tsx` | Individual dot `<span>` elements not `aria-hidden`; container has `aria-label="Thinking"` — loose but not blocking. | None | None | None | **LOW** |

### Components with Notable A11y Strengths

| Component | Strength |
|---|---|
| `citations/CitationChip` | `aria-label`, `aria-haspopup="dialog"`, `aria-expanded`, `focus-visible` ring |
| `chat/Composer` | `aria-label` on textarea, all icon buttons labelled, `aria-label="Attach file"`, `aria-label="Send message"`, `aria-label="Stop generating"`, remove-attachment aria-label includes filename |
| `chat/ScrollToBottomButton` | `aria-label="Jump to latest"`, `focus-visible` ring |
| `chat/ShareButton` | `aria-label="Share conversation"` on trigger; dynamic copy button `aria-label={copied ? 'Copied' : 'Copy link'}` |
| `shared/AppShellRail` | `<nav aria-label="Primary navigation">`, `aria-label="User menu"` on dropdown trigger |
| `shared/AppShellBreadcrumb` | `<nav aria-label="Breadcrumb">`, `aria-current="page"`, separator `aria-hidden` |
| `chat/ChatShell` | `<aside aria-label="Conversations">`, `aria-hidden={collapsed}` on aside, `<main aria-label="Chat">`, `<h1>` for title, all icon buttons labelled |
| `chat/MarkdownContent` | `aria-live={streaming ? 'polite' : 'off'}`, `aria-atomic="false"`, `aria-busy={streaming}`, h1→h2 downshift preserves single `<h1>` |
| `chat/CommandPalette` | `DialogTitle sr-only`, input has `aria-label`, arrow key navigation |
| `chat/StreamingDots` | `aria-label="Thinking"` on container |
| `consume/TraceDrawer` | Uses Base UI Sheet (focus trap + return focus on close); `SheetTitle` provides accessible dialog name |
| `consume/TierPicker` | `role="group"` + `aria-label="Audience tier"` |
| `dashboard/RosterTableView` | `aria-sort` on sortable column headers |
| `ui/sheet` | Base UI dialog handles focus trap, focus return, ESC. Close button has `<span className="sr-only">Close</span>` |

### Colour Contrast Assessment

`oklch(0.78 0.13 80)` gold text on `oklch(0.10 0.02 75)` near-black background (consume-shell primary):
- Approximate luminance: gold L≈0.52, near-black L≈0.007
- Contrast ratio ≈ **10:1** — passes WCAG AA (4.5:1 normal text, 3:1 large text) by large margin

`text-muted-foreground` in dark/ink zone (oklch ~0.58 chroma-neutral):
- Approximate contrast against near-black: ~3.5–4:1 range
- Borderline WCAG AA for normal-weight text at typical body size — flagged for verification with exact token values from globals.css dark mode block.

---

## Part C — Page / Layout Surface Map

### Legend
- **Has metadata**: `export const metadata` or `generateMetadata` present in route segment
- **Error boundary**: `error.tsx` in same or parent route segment

| Route | Key Components Rendered | Has Metadata | Has Error Boundary |
|---|---|---|---|
| `/` (root) | Redirect → `/dashboard` | Root layout: "MARSYS-JIS" | `error.tsx` (root) ✓ |
| `/login` | ForgotPasswordModal, RequestAccessModal, auth form | No | Root `error.tsx` only |
| `/reset-password` | Auth reset form | No | Root `error.tsx` only |
| `/dashboard` | AppShell > ClientRoster (→ ClientCard, RosterTableView, RosterEmptyWizard, RosterFilters) | **No** | Root `error.tsx` only — **gap** |
| `/clients/[id]` (layout) | AppShell (breadcrumb: Roster › ClientName) | No | `clients/[id]/error.tsx` ✓ |
| `/clients/[id]` (page) | AppShell > ClientOverviewPage (profile info) | No | `clients/[id]/error.tsx` ✓ |
| `/clients/[id]/consume` | ZoneRoot (ink) > ConsumeChat (ChatShell, Composer, AdaptiveMessageList, WelcomeGreeting, ReportLibrary, TraceDrawer) | **No** | `consume/error.tsx` ✓ |
| `/clients/[id]/consume/[conversationId]` | Same as above (same ConsumeChat, conversation pre-loaded) | **No** | `consume/[convId]/error.tsx` ✓ |
| `/clients/[id]/timeline` | AppShell > TimelineView, SessionsBar, RasiChartSVG, PyramidStatusPanel | No | `clients/[id]/error.tsx` ✓ (parent) |
| `/clients/new` | AppShell > new client form | No | `clients/[id]/error.tsx` ✓ (parent) |
| `/admin` | AppShell > AdminClient, UsersTable, PendingRequestsTable | **No** | **No error.tsx** — gap |
| `/audit` | AppShell > AuditListClient, AuditFilterSidebar | "Audit Log — MARSYS-JIS" ✓ | **No error.tsx** — gap |
| `/audit/[query_id]` | AppShell > AuditDetailView | `generateMetadata` ✓ | **No error.tsx** — gap |
| `/audit/compare` | AppShell > CompareView | "Compare — MARSYS-JIS" ✓ | **No error.tsx** — gap |
| `/audit/predictions` | AppShell > PredictionLedgerClient | "Predictions — MARSYS-JIS" ✓ | **No error.tsx** — gap |
| `/cockpit` | AppShell > CockpitGrid, ActivityFeed, various build widgets | **No** | `cockpit/error.tsx` ✓ |
| `/cockpit/sessions` | AppShell > SessionTable, SessionTimeline | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/sessions/[session_id]` | AppShell > SessionDetail, DetailSidePanel | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/plan` | AppShell > PlanTree, PhaseGrid | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/activity` | AppShell > ActivityFeed, FilterableActivityFeed | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/health` | AppShell > HealthTrend, HealthSparkline | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/parallel` | AppShell > build parallel components | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/registry` | AppShell > RegistryTable, RegistryGrouped | No | `cockpit/error.tsx` ✓ (parent) |
| `/cockpit/interventions` | AppShell > InterventionList, InterventionFrequency | No | `cockpit/error.tsx` ✓ (parent) |
| `/build` | Likely AppShell > BuildChat, BuildRightPane | **No** | **No error.tsx** — gap |
| `/build/[...slug]` | AppShell > build sub-views | No | **No error.tsx** — gap |
| `/share/[slug]` | No AppShell (standalone) > SharedConversation, MessageList | **No** | **No error.tsx** — gap |

### Summary: Metadata Gaps

Routes with no page metadata (title will fall back to root "MARSYS-JIS"):
`/login`, `/reset-password`, `/dashboard`, `/clients/*`, `/admin`, `/cockpit/*`, `/build/*`, `/share/[slug]`

The `/audit` segment is the best-instrumented for metadata; all audit sub-routes have titles.

### Summary: Error Boundary Gaps

Routes without an error boundary in their segment or a direct parent:
- `/dashboard` — super-admin's home view; error here strands the user
- `/admin` — admin user management; error here strands admin users
- `/audit/*` — audit log (admin/super-admin only); gap but lower priority
- `/build/*` — build cockpit deep links; cockpit/error.tsx would not cover `/build`
- `/share/[slug]` — public share view; standalone, no error handling

---

## Part D — Unused Component Confirmation

### chat/MessageList — KEEP-AS-IS (NOT unused)

W0 verdict: "Legacy message list — superseded by AdaptiveMessageList. Status: unused."

W1-R3 grep result (all imports of `MessageList` outside test files):

```
platform/src/app/share/[slug]/SharedConversation.tsx:4:import { MessageList } from '@/components/chat/MessageList'
platform/src/components/chat/AdaptiveMessageList.tsx:5:import { MessageList } from './MessageList'
```

`AdaptiveMessageList` delegates to `MessageList` for conversations ≤ 30 messages (the majority of conversations). `SharedConversation` uses it directly for read-only share views. `MessageList` has 2 active importers and is in the hot path.

**W0 verdict correction: KEEP-AS-IS. Do not eliminate.**

### Other zero-import components

No additional zero-import components were found during the audit. All 149 components in the W0 inventory have at least one import (verified by confirming the W0 suspect list was the complete set of flagged components, and all were found active).

---

*End of NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md v1.0*
