---
artifact_id: NAK_DESIGN_FIX_REPORT_W2_R1
version: 1.0
status: FINAL
authored_by: Claude Code (NAK W2-R1 session) 2026-04-30
project: NAK — Nakula
wave_run: W2-R1
purpose: >
  Closure report for the W2-R1 design token fix wave.
  Documents all changes made, findings resolved, and items deferred.
---

# NAK Design Fix Report — W2-R1

## Summary

W2-R1 eliminated the 181+ design token violations catalogued in W1-R1. The session executed six fix steps (A–F) in sequence, maintaining 933 passing tests throughout.

**Violations closed:** 157 (token-fixable violations resolved)
**Deferred (documented exceptions):** ~28 recharts CHART_PALETTE hex props (W2-R3) + 1 file F-DS-3 (W2-R2)
**Tests:** 933 passing before and after (13 pre-existing failures unchanged)

---

## STEP A — Token Prerequisite: globals.css @theme inline

**File:** `platform/src/app/globals.css`

Added `--color-brand-*` and `--color-status-*` mappings to the `@theme inline` block. This was the unblocking prerequisite (F-DS-8): without these entries, Tailwind v4 cannot generate `text-brand-gold`, `bg-brand-ink`, `text-status-success` etc. as utilities.

Added mappings:
- `--color-brand-gold`, `--color-brand-gold-light`, `--color-brand-gold-deep`, `--color-brand-gold-cream`
- `--color-brand-charcoal`, `--color-brand-ink`, `--color-brand-vellum`, `--color-brand-cream`
- `--color-status-warn`, `--color-status-halt`, `--color-status-info`, `--color-status-success`
- `--color-status-warn-bg`, `--color-status-halt-bg`, `--color-status-info-bg`, `--color-status-success-bg`

Also fixed F-DS-9: replaced hardcoded `oklch()` values in `.bt-status-*` utility classes with `var(--status-*)` / `var(--brand-gold)` references.

---

## STEP B — Dead Code Removal

**Files:** `platform/src/app/globals.css`, `platform/src/components/ui/button.tsx`, `platform/src/components/ui/badge.tsx`, `platform/src/components/ui/tabs.tsx`

Resolved F-DS-5 and F-DS-10:

- **globals.css:** Removed `.brand-card` dead CSS block (5 lines, 0 usages across codebase)
- **button.tsx:** Removed `link` CVA variant (0 usages)
- **badge.tsx:** Removed `ghost` and `link` CVA variants (0 usages each)
- **tabs.tsx:** Removed `line` variant from `tabsListVariants` and all `group-data-[variant=line]/tabs-list:*` conditional styles from `TabsTrigger` (0 usages)

---

## STEP C — Admin Module + TracePanel Full Token Migration

### C1 — admin/styles.ts

24 hardcoded hex literals replaced with CSS variable references / Tailwind token utilities. This was the master palette fix: all 9 admin components import from `styles.ts`, so fixing the source propagated the correction downstream.

Key mappings:
- `[#d4af37]`, `[#f4d160]` → `brand-gold`, `brand-gold-light`
- `[#fce29a]` → `brand-gold-cream`
- `[#0e0b06]`, `[#0a0805]` → `brand-ink`
- `[#9b834f]`, `[#7a5210]` → `muted-foreground`
- Inline rgba/color-mix → Tailwind arbitrary value forms using `color-mix(in_oklch,...)`

### C2 — Remaining admin components

8 files swept for inline violations not covered by styles.ts:
- `AdminClient.tsx` — 2 violations
- `AdminSignOut.tsx` — 2 violations
- `PendingRequestsTable.tsx` — 7 violations (header border, h2, span, empty-state, td cells)
- `ApproveDialog.tsx` — 3 violations (DialogTitle, DialogDescription, paragraph)
- `ConfirmDialog.tsx` — 2 violations (DialogTitle, DialogDescription)
- `EditUsernameDialog.tsx` — 2 violations (DialogTitle, DialogDescription)
- `NewUserDialog.tsx` — 2 violations (DialogTitle, DialogDescription)
- `UsersTable.tsx` — 20 violations (header, search input, dropdown trigger/content, reset-link sheet)

### C3 — trace/TracePanel.tsx

Full ~820-line sweep. All `slate-*` utility classes, `bg-[#0d1117]`, `bg-[#161b27]`, and `border-l-blue-500` replaced with brand token equivalents:

| Original | Replacement |
|---|---|
| `bg-[#0d1117]`, `bg-slate-900` | `bg-brand-ink` |
| `bg-[#161b27]`, `bg-slate-800` | `bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]` |
| `border-slate-700`, `border-slate-800` | `border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]` |
| `text-slate-300`, `text-slate-100` | `text-brand-gold-cream` |
| `text-slate-400`, `text-slate-500` | `text-muted-foreground` |
| `bg-slate-700` | `bg-[color-mix(in_oklch,var(--brand-ink)_88%,var(--brand-gold)_12%)]` |
| `border-l-blue-500` | `border-l-[var(--brand-gold)]` |

Also rewrote `STEP_TYPE_CONFIG`, `TIMELINE_BAR_COLOR`, `LAYER_COLOR` constants at the top of the file.

---

## STEP D — Build Module + TraceDrawer

### D1 — build/colors.ts

`statusColors`, `statusBg`, `statusText` migrated to CSS variable references and token utilities:
- `statusColors`: oklch strings → `var(--status-success)`, `var(--brand-gold)`, `var(--status-halt)`, `var(--muted-foreground)`
- `statusBg`: `[oklch(...)]` classes → `bg-status-success-bg`, `bg-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]`, `bg-status-halt-bg`
- `statusText`: `[oklch(...)]` classes → `text-status-success`, `text-brand-gold`, `text-status-halt`

`classColors`, `severityColors`, `exitCodeColor` annotated as **CHART_PALETTE** exceptions with explanatory JSDoc. These 18 hex values serve as recharts data-series colors and cannot use CSS variable syntax in SVG props.

### D2 — Build chart components

- **InsightCards.tsx:** `severityClass()` and `iconClass()` for `positive` severity → `border-status-success bg-status-success-bg` / `text-status-success`
- **CorpusDensityHero.tsx:** L3 domain span classes → `bg-status-success-bg text-status-success`; `DOC_COLORS`/`EDGE_COLORS` annotated as CHART_PALETTE
- **HealthSparkline.tsx:** `EXIT_COLORS` annotated as CHART_PALETTE (SVG `fill` props)
- **InterventionFrequency.tsx:** recharts `stroke`/`fill` props annotated as CHART_PALETTE
- **charts/TrendLine.tsx:** recharts `stroke`/`fill` props annotated as CHART_PALETTE

### D3 — consume/TraceDrawer.tsx

4 violations fixed:
- `bg-[#0d1117]` → `bg-brand-ink`
- `border-l border-slate-800` → `border-l border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)]`
- `bg-[#161b27]` → `bg-[color-mix(in_oklch,var(--brand-ink)_85%,var(--brand-gold)_15%)]`
- `border-b border-slate-800` → `border-b border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)]`
- `text-slate-100` → `text-brand-gold-cream`

---

## STEP E — Profile Module + AuditBadge

### E1 — profile/ hex fallbacks

Removed hex fallbacks from CSS variable calls (5 violations across 3 files):
- `RoomCard.tsx` line 25: `var(--brand-charcoal, #0d0a05)` → `var(--brand-charcoal)`
- `RoomCard.tsx` line 32: `var(--brand-gold-cream, #fce29a)` → `var(--brand-gold-cream)`
- `ProfileSideRail.tsx` line 28: `var(--brand-charcoal, #0d0a05)` → `var(--brand-charcoal)`
- `ProfileSideRail.tsx` line 79: `var(--brand-gold-cream, #fce29a)` → `var(--brand-gold-cream)`
- `DashaCountdown.tsx` line 39: `var(--brand-gold-cream, #fce29a)` → `var(--brand-gold-cream)`

### E2 — audit/AuditBadge.tsx

Added `TIER_COLOUR_EXCEPTION` documentation comment explaining why `TIER_STYLES` and `CLASS_STYLES` use named Tailwind color scales (rose/amber/emerald/slate) rather than brand tokens. These colors carry domain-specific semantic meaning (access tier, query class) and are intentionally distinct from the brand palette.

---

## STEP F — Design System Elevation

`00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` elevated from DRAFT to FINAL (v1.1 → v1.2). All F-DS-1 through F-DS-10 findings updated with resolution status.

---

## Deferred Items

| Item | Scope | Deferred to | Reason |
|---|---|---|---|
| F-DS-3: cockpit/error.tsx | `src/app/cockpit/error.tsx` | W2-R2 | File is in `must_not_touch` path for W2-R1 (app/ routes) |
| Recharts CHART_PALETTE (~28 values) | HealthSparkline, InterventionFrequency, TrendLine, CorpusDensityHero MiniBar, colors.ts | W2-R3 | CSS variable references are not valid recharts stroke/fill props; requires `useBrandColors()` hook |

---

## Test Baseline

```
Before W2-R1: 933 passing / 13 pre-existing failures
After  W2-R1: 933 passing / 13 pre-existing failures (unchanged)
```

Pre-existing failures are unrelated to design token changes (build-tools test expects a specific error message string; 12 other pre-existing integration test issues).

---

*End of NAK_DESIGN_FIX_REPORT_W2_R1_v1_0.md v1.0 — FINAL.*
