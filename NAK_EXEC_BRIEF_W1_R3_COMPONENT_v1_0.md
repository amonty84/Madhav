---
artifact: NAK_EXEC_BRIEF_W1_R3_COMPONENT
version: 1.0
status: AUTHORED
authored_by: Claude Code (NAK W0 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R3
title: UX Component Audit and A11y First Pass
scope: platform/src/components/**, platform/src/app/**/*.tsx (read-only)
parallelizable_with: [W1-R1, W1-R2]
gate: W0 (must be closed before W1-R3 starts)
input_from: NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md Part C
---

# NAK W1-R3 — UX Component Audit and A11y First Pass Exec Brief

## §1 — Purpose

W0 produced a 149-component inventory with shallow descriptions and flagged 9 suspect duplicates. W1-R3 goes deep on two axes:

1. **Duplicate resolution:** For each of the 9 suspect components, read both files and determine: same component re-exported, diverged copies, or different components with confusingly identical names. Recommend: consolidate, deprecate, or rename.

2. **A11y first pass:** Walk every component in `consume/`, `shared/`, `chat/`, and `ui/` (the user-facing surfaces) and flag missing accessibility attributes: `aria-label`, `role`, keyboard trap risks, focus management gaps, missing `alt` text, colour contrast issues.

W1-R3 also creates the `NAK_COMPONENT_AUDIT_v1_0.md` living doc that W2-R3 will use to execute fixes.

W1-R3 makes **zero code changes**. It reads and documents.

## §2 — Scope

```yaml
may_touch:
  - platform/src/components/**             # read all components
  - platform/src/app/**/*.tsx              # read pages and layouts
  - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md    # create + populate

must_not_touch:
  - platform/src/**/*.tsx                  # AUDIT ONLY — no code changes
  - platform/src/**/*.ts                   # AUDIT ONLY
  - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md      # W1-R1 territory
  - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md    # W1-R2 territory
  - 00_ARCHITECTURE/**
```

## §3 — Acceptance Criteria

### AC-1: Component audit report committed

File: `00_NAK/reports/NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md`

The report must contain:

**Part A — Duplicate resolution**

For each of the 9 suspect components from W0:

| Suspect | Dir 1 | Dir 2 | Verdict | Recommendation |
|---|---|---|---|---|
| CitationChip | chat/ | citations/ | same/diverged/different | consolidate/deprecate/rename |
| TracePanel | citations/ | trace/ | … | … |
| AnswerView | citations/ | consume/ | … | … |
| TierPicker | consume/ | disclosure/ | … | … |
| RosterTableView | dashboard/ | profile/ | … | … |
| SessionTimeline | build/ | timeline/ | … | … |
| ZoneRoot | build/ | shared/ | … | … |
| MessageList | chat/ (unused) | — | unused | delete |

Read both files for each suspect pair. The verdict must be based on reading the actual code, not guessing from the name.

**Part B — A11y first pass**

Walk every component in:
- `consume/` (client-facing, highest priority)
- `shared/` (AppShell, rail, breadcrumb — chrome)
- `chat/` (ChatShell, Composer, MessageList variants)
- `ui/` (base primitives)

For each component, record:

```
component | missing_aria | keyboard_trap_risk | focus_mgmt_gap | contrast_risk | severity
```

A11y severity: HIGH (keyboard users blocked), MEDIUM (screen reader misses content), LOW (best-practice gap, not blocking).

**Part C — Page/layout surface map**

Walk `platform/src/app/**/*.tsx` (pages and layouts). For each surface:
- What components does it render?
- What is the route pattern?
- Does it have a `<title>` / `<meta>` via Next.js `metadata`?
- Is there an error boundary (`error.tsx`) in the same segment? (cross-reference with W1-R2)

Produce a table: `route | components rendered | has_metadata | has_error_boundary`.

**Part D — Unused component confirmation**

Confirm `chat/MessageList` is truly unused (0 non-test imports). If any other 0-import components are found, list them.

### AC-2: NAK_COMPONENT_AUDIT_v1_0.md created

File: `00_NAK/NAK_COMPONENT_AUDIT_v1_0.md` (status: DRAFT)

Content:
- The resolved duplicate list (from Part A) with recommended actions
- The a11y findings list from Part B, sorted by severity
- A list of components confirmed for deletion at W2-R3

### AC-3: W1-R3 closure row in NAK_TRACKER updated

`00_NAK/NAK_TRACKER_v1_0.md` §3 W1-R3 row:
- `status: closed`, `session_id`, `closed_at` set

## §4 — Suggested Work Sequence

1. Read `NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md Part C` (the 9 suspects list).
2. For each suspect pair, read both files. Record the verdict.
3. Walk `consume/` components for a11y issues — this is the highest-priority surface.
4. Walk `shared/` (AppShell, rail, breadcrumb) — these frame every page.
5. Walk `chat/` (Composer, AdaptiveMessageList, WelcomeGreeting).
6. Walk `ui/` base primitives for a11y compliance.
7. Walk `platform/src/app/**/*.tsx` to build the surface map.
8. Confirm `chat/MessageList` zero-import status via grep.
9. Write the closure report. Author `NAK_COMPONENT_AUDIT_v1_0.md`. Update tracker.

## §5 — Suspect Components to Resolve

These are the 9 flagged in W0. Read both files for each pair before recording a verdict:

| Suspect | File 1 | File 2 |
|---|---|---|
| CitationChip | `components/chat/CitationChip.tsx` | `components/citations/CitationChip.tsx` |
| TracePanel | `components/citations/TracePanel.tsx` | `components/trace/TracePanel.tsx` |
| AnswerView | `components/citations/AnswerView.tsx` | `components/consume/AnswerView.tsx` |
| TierPicker | `components/consume/TierPicker.tsx` | `components/disclosure/TierPicker.tsx` |
| RosterTableView | `components/dashboard/RosterTableView.tsx` | `components/profile/RosterTableView.tsx` |
| SessionTimeline | `components/build/SessionTimeline.tsx` | `components/timeline/SessionTimeline.tsx` |
| ZoneRoot | `components/build/ZoneRoot.tsx` | `components/shared/ZoneRoot.tsx` |
| MessageList | `components/chat/MessageList.tsx` | — (unused, no pair) |

## §6 — A11y Focus Areas

For the a11y pass, prioritise these patterns:

1. **Interactive elements without labels:** `<button>` with only icon content and no `aria-label`. Very common in icon-only buttons (CommandPalette, ShareButton, ScrollToBottomButton).
2. **Dialog focus management:** When a `Dialog` or `Sheet` opens, does focus move inside it? When it closes, does focus return to the trigger?
3. **Live regions for streaming content:** `AdaptiveMessageList` and `StreamingMarkdown` produce content dynamically. Is there an `aria-live` region?
4. **Keyboard accessibility in ConsumeChat:** The consume surface is client-facing. Can a keyboard-only user navigate, submit queries, and read responses?
5. **Colour contrast:** The `.consume-shell` dark palette uses gold on near-black. Confirm oklch(0.78 0.13 80) on oklch(0.10 0.02 75) passes WCAG AA (4.5:1 for normal text, 3:1 for large).

## §7 — Output Files

| File | Status at close |
|---|---|
| `00_NAK/reports/NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md` | COMPLETE |
| `00_NAK/NAK_COMPONENT_AUDIT_v1_0.md` | DRAFT |

---

*End of NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md*
