---
artifact_id: NAK_COMPONENT_AUDIT
version: 1.0
status: DRAFT
authored_by: Claude Code (NAK W1-R3 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R3
role: >
  Living document. Carries the resolved duplicate list, a11y findings sorted by severity,
  and the confirmed-for-deletion list. W2-R3 reads this to prioritise fix work.
changelog:
  - v1.0 (2026-04-30): Initial DRAFT authored by W1-R3. To be elevated to FINAL at W2-R3 close.
---

# NAK Component Audit v1.0 (DRAFT)

---

## §1 — Resolved Duplicate List

All 9 suspects from the W0 baseline were false positives. See `reports/NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md Part A` for full analysis.

**Recommended actions from duplicate resolution:**

| Component | Single Canonical Location | Action |
|---|---|---|
| CitationChip | `components/citations/CitationChip.tsx` | No change needed. Remove phantom reference from W0 chat/ inventory. |
| TracePanel | `components/trace/TracePanel.tsx` | No change needed. `TracePanelContent` exported separately for TraceDrawer. |
| AnswerView | `components/consume/AnswerView.tsx` | No change needed. Correctly imports CitationChip from citations/. |
| TierPicker | `components/consume/TierPicker.tsx` | No change needed. Unrelated to `disclosure/DisclosureTierBadge`. |
| RosterTableView | `components/dashboard/RosterTableView.tsx` | No change needed. profile/ has no copy. |
| SessionTimeline | `components/build/SessionTimeline.tsx` | No change needed. timeline/ dir has `TimelineView`, different component. |
| ZoneRoot | `components/shared/ZoneRoot.tsx` | No change needed. Used by consume/layout.tsx correctly. |
| MessageList | `components/chat/MessageList.tsx` | KEEP. Active in AdaptiveMessageList (≤30 msgs) + SharedConversation. W0 "unused" was wrong. |

---

## §2 — A11y Findings (sorted by severity)

Source: `reports/NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md Part B`

### HIGH — Fix in W2-R3

| ID | Component | File | Issue | Fix |
|---|---|---|---|---|
| A11Y-1 | AppShell | `shared/AppShell.tsx` | No skip-nav link. Keyboard users traverse entire rail + breadcrumb before reaching `<main>`. Affects all portal pages. | Add `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` before AppShellRail. Add `id="main-content"` to `<main>`. |
| A11Y-2 | ChatShell Reports button | `chat/ChatShell.tsx:206` | `<button>` with icon + text (`hidden sm:inline`) + badge. On mobile, text hidden and no `aria-label` — button is unlabelled for screen readers. | Add `aria-label={rightPanelLabel}` to the Reports toggle button. |
| A11Y-3 | CommandPalette items | `chat/CommandPalette.tsx` | Plain `<button>` list with no `role="listbox"` / `role="option"` / `aria-selected`. Arrow navigation works but screen readers don't announce highlighted command. | Add `role="listbox"` to the list container. Add `role="option"` + `aria-selected={isActive}` to each command button. Add `aria-activedescendant` pointing to selected item id on the input element. |

### MEDIUM — Address in W2-R3

| ID | Component | File | Issue | Fix |
|---|---|---|---|---|
| A11Y-4 | AdaptiveMessageList | `chat/AdaptiveMessageList.tsx` | No `role="log"` on conversation container. Screen readers don't treat it as a live conversation. | Add `role="log"` + `aria-label="Conversation"` + `aria-live="polite"` to the conversation scroll container in ChatShell/ConsumeChat. |
| A11Y-5 | StreamingAnswer | `consume/StreamingAnswer.tsx` | Same as A11Y-4 — outer container has no `role="log"`. | Add `role="log"` + `aria-label="Conversation"` on the `<div className="flex w-full flex-col">`. |
| A11Y-6 | trace/TracePanel StepRow buttons | `trace/TracePanel.tsx` | StepRow/LayerRow/drilldown buttons lack explicit `aria-label`. Accessible name from truncated inner text only. (super_admin only) | Add `aria-label={step.step_name.replace(/_/g, ' ')}` to each StepRow button. |
| A11Y-7 | ConsumeChat Trace/Panel toggles | `consume/ConsumeChat.tsx:550–560` | `title` attribute only on "Trace" and "Panel" toggle buttons — not reliably announced. | Add `aria-label="Toggle query trace"` and `aria-label="Toggle panel mode"` to replace title-only labelling. |

### LOW — Best-practice gaps, not blocking

| ID | Component | File | Issue | Fix |
|---|---|---|---|---|
| A11Y-8 | AppShellRail nav links | `shared/AppShellRail.tsx:70` | Both `title` and `aria-label` on same `<Link>` — redundant, creates double announcement in some AT. | Remove `title` attribute, keep `aria-label`. |
| A11Y-9 | ChatShell mobile sidebar | `chat/ChatShell.tsx:117` | `showCloseButton={false}` on mobile Sheet — no visible close button, relies on Escape/backdrop. | Add a visible close button or ensure `showCloseButton={true}` on mobile. |
| A11Y-10 | trace/TracePanel "← Back" | `trace/TracePanel.tsx:222` | Button text ambiguous without context. | Change to "Back to context overview" or similar. |
| A11Y-11 | StreamingDots spans | `chat/StreamingDots.tsx` | Individual dot spans not `aria-hidden`. Loose but container `aria-label="Thinking"` covers it. | Add `aria-hidden="true"` to each dot span. |

### Colour Contrast

| Surface | Colors | Contrast Ratio | WCAG AA Pass |
|---|---|---|---|
| Gold text on consume-shell near-black | oklch(0.78 0.13 80) on oklch(0.10 0.02 75) | ≈10:1 | **Pass** (4.5:1 required) |
| `text-muted-foreground` in dark/ink zone | oklch(~0.58) on near-black | ~3.5–4:1 estimated | Borderline — verify against exact dark-mode token values |

---

## §3 — Confirmed for Deletion at W2-R3

Based on W1-R3 audit, **no components are confirmed for deletion**.

The W0 ELIMINATE candidate (`chat/MessageList`) was found to be actively used and has been reverted to KEEP-AS-IS. The 9 suspect "duplicates" were all false positives.

The delete list at W2-R3 open is **empty**. W2-R3 focus is exclusively on a11y fixes from §2.

---

## §4 — Key a11y Strengths to Preserve

The following a11y patterns are exemplary and must be maintained in W2-R3 fixes:

- `citations/CitationChip` — aria-label, aria-haspopup, aria-expanded pattern
- `chat/Composer` — per-button aria-label on all icon-only controls
- `chat/MarkdownContent` — aria-live/aria-atomic/aria-busy streaming pattern (do not break)
- `shared/AppShellBreadcrumb` — aria-label on nav, aria-current on active segment, aria-hidden separator
- `shared/AppShellRail` — Primary navigation landmark, User menu label
- `consume/TierPicker` — role="group" + aria-label on button groups
- `dashboard/RosterTableView` — aria-sort on sortable headers

---

*End of NAK_COMPONENT_AUDIT_v1_0.md v1.0 (DRAFT). Elevated to FINAL at W2-R3 close.*
