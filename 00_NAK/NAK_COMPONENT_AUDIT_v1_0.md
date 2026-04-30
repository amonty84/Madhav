---
artifact_id: NAK_COMPONENT_AUDIT
version: 1.1
status: FINAL
authored_by: Claude Code (NAK W1-R3 session) 2026-04-30
revised_by: Claude Code (NAK W2-R3 session) 2026-04-30
project: NAK — Nakula
wave_run: W2-R3 (elevated to FINAL)
role: >
  Carries the resolved duplicate list, a11y findings sorted by severity, and the
  confirmed-for-deletion list. Elevated to FINAL at W2-R3 close — all FIX verdicts resolved,
  MessageList confirmed KEEP-AS-IS, no components for deletion.
changelog:
  - v1.0 (2026-04-30): Initial DRAFT authored by W1-R3.
  - v1.1 (2026-04-30): Elevated to FINAL at W2-R3 close. All HIGH + MEDIUM a11y findings fixed.
      5 error boundaries created. Metadata added to dashboard/admin/clients layouts.
      All LOW a11y items addressed. MessageList KEEP-AS-IS confirmed. No components deleted.
---

# NAK Component Audit v1.1 (FINAL)

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

### HIGH — Fixed in W2-R3 ✅

| ID | Component | File | Issue | Resolution |
|---|---|---|---|---|
| A11Y-1 | AppShell | `shared/AppShell.tsx` | No skip-nav link. | ✅ Added `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` before AppShellRail. Added `id="main-content"` to `<main>`. |
| A11Y-2 | ChatShell Reports button | `chat/ChatShell.tsx` | No `aria-label` on mobile (text hidden). | ✅ Added `aria-label={rightPanelLabel}` to the Reports toggle button. |
| A11Y-3 | CommandPalette items | `chat/CommandPalette.tsx` | No `role="listbox"` / `role="option"` / `aria-selected`. | ✅ Added `role="combobox"` + `aria-controls` + `aria-activedescendant` to input. Added `id="command-palette-listbox"` + `role="listbox"` to container. Added `role="option"` + `aria-selected={isActive}` + `id` to each command button. |

### MEDIUM — Fixed in W2-R3 ✅

| ID | Component | File | Issue | Resolution |
|---|---|---|---|---|
| A11Y-4 | ConsumeChat scroll container | `consume/ConsumeChat.tsx` | No `role="log"` on conversation scroll container. | ✅ Added `role="log"` + `aria-label="Conversation"` + `aria-live="polite"` to the scroll container div. |
| A11Y-5 | StreamingAnswer | `consume/StreamingAnswer.tsx` | No `role="log"` on outer container. | ✅ Added `role="log"` + `aria-label="Conversation"` + `aria-live="polite"` to the outer div. |
| A11Y-6 | trace/TracePanel buttons | `trace/TracePanel.tsx` | StepRow/LayerRow/drilldown buttons lack explicit `aria-label`. | ✅ Added `aria-label={step.step_name.replace(/_/g, ' ')}` to StepRow. Added `aria-label` + `aria-expanded` to LayerRow toggle. Added `aria-label` to drilldown item buttons. |
| A11Y-7 | ConsumeChat Trace/Panel toggles | `consume/ConsumeChat.tsx` | `title`-only on Trace and Panel controls. | ✅ Replaced `title` with `aria-label` on Trace button and Panel label. |

### LOW — Fixed in W2-R3 ✅

| ID | Component | File | Issue | Resolution |
|---|---|---|---|---|
| A11Y-8 | AppShellRail nav links | `shared/AppShellRail.tsx` | Both `title` and `aria-label` on same `<Link>` — redundant. | ✅ Removed `title` attribute, kept `aria-label`. |
| A11Y-9 | ChatShell mobile sidebar | `chat/ChatShell.tsx` | `showCloseButton={false}` — no visible close button. | ✅ Removed `showCloseButton={false}` (defaults to true). |
| A11Y-10 | trace/TracePanel "← Back" | `trace/TracePanel.tsx` | Button text ambiguous without context. | ✅ Changed to "← Back to overview" with `aria-label="Back to context overview"`. |
| A11Y-11 | StreamingDots spans | `chat/StreamingDots.tsx` | Individual dot spans not `aria-hidden`. | ✅ Added `aria-hidden="true"` to each dot span. |

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
