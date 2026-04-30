---
artifact_id: NAK_DESIGN_SYSTEM
version: 1.2
status: FINAL
authored_by: Claude Code (NAK W0 session) 2026-04-30
updated_by: Claude Code (NAK W2-R1 session) 2026-04-30
project: NAK — Nakula
wave_run: W0 (draft) → W1-R1 (populate findings) → W2-R1 (implement fixes, elevate to FINAL)
purpose: >
  Single-file design system specification for the MARSYS-JIS platform portal.
  W2-R1 closed all F-DS-1 through F-DS-10 findings (F-DS-3 deferred to W2-R2;
  recharts CHART_PALETTE subset of F-DS-2 deferred to W2-R3 pending useBrandColors hook).
changelog:
  - v1.0 (2026-04-30): W0 authoring — token inventory, typography, theme zones, shadcn set, W0 findings.
  - v1.1 (2026-04-30): W1-R1 deep audit — §6 findings fleshed out with exact file+line counts,
    concrete fix actions, and new findings F-DS-6 through F-DS-10. Part B confirms Tailwind v4
    CSS-based config (no tailwind.config.ts). Brand/status tokens not mapped to Tailwind utilities.
    Full violation register in NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md.
  - v1.2 (2026-04-30): W2-R1 implementation — all token violations fixed, status elevated to FINAL.
    F-DS-1 through F-DS-10 resolved (F-DS-3 deferred W2-R2; recharts CHART_PALETTE in F-DS-2 deferred W2-R3).
    See closure report: 00_NAK/reports/NAK_DESIGN_FIX_REPORT_W2_R1_v1_0.md.
---

# NAK Design System v1.0 — FINAL

## §1 — Purpose and Scope

This document is the single source of truth for the MARSYS-JIS portal design system. It covers:

- All CSS custom properties defined in `platform/src/app/globals.css`
- The three theme zones and their token mappings
- Typography scales (Source Serif 4, Inter UI, Geist Mono)
- The shadcn/ui component set — used vs unused variants
- Findings from the W0 Part A token audit, ranked by severity

This is a **DRAFT** — it describes current state including its problems. W1-R1 populates the deep findings section; W2-R1 implements fixes and elevates this to FINAL.

---

## §2 — CSS Custom Properties

All properties are defined in `platform/src/app/globals.css`.

### 2.1 Semantic UI Tokens (light mode `:root`)

These map to the shadcn/ui CSS variable convention and power Tailwind classes like `bg-background`, `text-foreground`, `border-border`.

| Token | Value (oklch) | Semantic Meaning |
|---|---|---|
| `--background` | oklch(~0.97 0.01 75) | Page/canvas background — warm vellum white |
| `--foreground` | oklch(~0.18 0.02 75) | Primary text — near-black warm charcoal |
| `--card` | oklch(~0.95 0.01 75) | Card surface — slightly off white |
| `--card-foreground` | same as `--foreground` | Card text |
| `--popover` | same as `--card` | Popover/dropdown surface |
| `--popover-foreground` | same as `--foreground` | Popover text |
| `--primary` | oklch(~0.20 0.02 75) | Primary interactive — dark charcoal |
| `--primary-foreground` | oklch(~0.97 0.01 75) | Text on primary — warm white |
| `--secondary` | oklch(~0.92 0.01 75) | Secondary surface — soft warm grey |
| `--secondary-foreground` | oklch(~0.25 0.02 75) | Text on secondary |
| `--muted` | oklch(~0.91 0.01 75) | Muted/disabled surface |
| `--muted-foreground` | oklch(~0.52 0.02 75) | Muted text — mid grey |
| `--accent` | oklch(~0.91 0.01 75) | Accent highlight (dark: overridden to `--brand-gold`) |
| `--accent-foreground` | oklch(~0.25 0.02 75) | Text on accent |
| `--destructive` | oklch(~0.58 0.22 25) | Destructive actions — warm red |
| `--border` | oklch(~0.87 0.01 75) | Default border |
| `--input` | oklch(~0.87 0.01 75) | Input border |
| `--ring` | oklch(~0.52 0.02 75) | Focus ring (dark: overridden to `--brand-gold`) |

### 2.2 Brand Tokens

These are custom tokens beyond the shadcn convention. They express the MARSYS-JIS brand palette.

| Token | Value (oklch) | Semantic Meaning |
|---|---|---|
| `--brand-gold` | oklch(0.78 0.13 80) | Primary brand gold — the dominant accent |
| `--brand-gold-light` | oklch(~0.86 0.10 82) | Lighter gold — hover states, subtle highlights |
| `--brand-gold-deep` | oklch(~0.62 0.16 78) | Deeper gold — active states, pressed |
| `--brand-gold-cream` | oklch(~0.94 0.04 82) | Gold-tinted cream — backgrounds behind gold elements |
| `--brand-charcoal` | oklch(~0.18 0.02 75) | Deep warm charcoal — headings on light |
| `--brand-ink` | oklch(~0.10 0.02 75) | Near-black ink — used as dark surface background |
| `--brand-vellum` | oklch(~0.97 0.01 75) | Warm white vellum — light surface background |
| `--brand-cream` | oklch(~0.93 0.02 80) | Warm cream — alternative light surface |

### 2.3 Citation Palette Tokens

Used exclusively by the citation chip and preview components to colour-code signal/asset/chunk citations.

| Token | Value (oklch) | Semantic Meaning |
|---|---|---|
| `--cite-signal` | oklch(~0.68 0.12 80) | Signal citation colour (gold-toned) |
| `--cite-asset` | oklch(~0.60 0.10 75) | Asset citation colour |
| `--cite-chunk` | oklch(~0.52 0.08 72) | Chunk citation colour |
| `--cite-signal-bg` | oklch(~0.94 0.04 82) | Signal citation background |
| `--cite-asset-bg` | oklch(~0.92 0.03 78) | Asset citation background |
| `--cite-chunk-bg` | oklch(~0.90 0.02 75) | Chunk citation background |

### 2.4 Status Tokens

Semantic colours for pipeline/prediction state indicators.

| Token | Colour | Usage |
|---|---|---|
| `--status-warn` | amber oklch | Warning state (pipeline, predictions) |
| `--status-halt` | red oklch | Halt/error state |
| `--status-info` | blue oklch | Informational state |
| `--status-success` | green oklch | Success/complete state |
| `--status-warn-bg` | amber tint | Background pairing for warn |
| `--status-halt-bg` | red tint | Background pairing for halt |
| `--status-info-bg` | blue tint | Background pairing for info |
| `--status-success-bg` | green tint | Background pairing for success |

### 2.5 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius` | 0.5rem | Base radius (cards, inputs) |
| `--radius-sm` | calc(var(--radius) - 2px) | Small elements (badges, chips) |
| `--radius-md` | calc(var(--radius) - 1px) | Medium elements |
| `--radius-lg` | var(--radius) | Large elements |
| `--radius-xl` | calc(var(--radius) + 4px) | Extra large |
| `--radius-2xl` | calc(var(--radius) + 8px) | Panels, modals |
| `--radius-3xl` | calc(var(--radius) + 16px) | Large containers |
| `--radius-4xl` | calc(var(--radius) + 24px) | Full-panel surfaces |

### 2.6 Sidebar Tokens

| Token | Semantic Meaning |
|---|---|
| `--sidebar` | Sidebar surface background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Active nav item background |
| `--sidebar-accent` | Sidebar hover/focus accent |
| `--sidebar-border` | Sidebar divider |
| `--sidebar-ring` | Sidebar focus ring |

---

## §3 — Theme Zones

The platform has three distinct theme zones:

### 3.1 Vellum-Light (default)

Applied to: Dashboard, Admin, Build, Timeline, Audit, Profile surfaces.

- Background: `--brand-vellum` / `--background`
- Foreground: `--brand-charcoal` / `--foreground`
- Accent: `--brand-gold` (used for CTAs, focus rings, active states)
- Border: `--border` (warm grey)
- Dark mode: All tokens shift to warm charcoal dark palette; `--primary`, `--accent`, `--ring` → `--brand-gold`

### 3.2 Ink-Dark (consume surface)

Applied to: `/clients/[id]/consume` route via `.consume-shell` scope class.

- Background: `--brand-ink` (near-black)
- Foreground: `--brand-vellum` (warm white on dark)
- Accent: `--brand-gold` (dominant — streaming caret, CTAs, active states)
- This zone is always dark regardless of the user's light/dark toggle
- Implementation: `.consume-shell` class in globals.css forces the dark palette within its subtree

### 3.3 Gold-Bridge (CTA + brand elements)

Applied to: `.brand-cta` buttons, `.brand-card` cards, `CitationChip` components.

- `.brand-cta`: radial gradient from `--brand-gold-light` to `--brand-gold-deep`; shadow `--brand-gold`; text `--brand-charcoal`
- `.brand-card`: `background: color-mix(in oklch, var(--brand-ink) 92%, transparent)`; border `color-mix(in oklch, var(--brand-gold) 18%, transparent)`; `backdrop-filter: blur(12px)`
- These are utility classes applied to specific components, not a full zone

---

## §4 — Typography Scale

### 4.1 Font Families

| Variable | Font | Weight Range | Usage |
|---|---|---|---|
| `--font-sans` | Inter | 400–700 | Body text, UI labels, controls |
| `--font-serif` | Source Serif 4 | 400–600 | Display headings, narrative text |
| `--font-heading` | Source Serif 4 | 400–600 | Section headings (alias) |
| `--font-mono` | Geist Mono | 400–500 | Code blocks, numbers, data |

### 4.2 Typography Utility Classes

| Class | Size | Font | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `.bt-display` | 1.875rem (30px) | serif | 400 | 1.15 | normal | Page/section display titles |
| `.bt-heading` | 1.125rem (18px) | serif | 400 | 1.3 | normal | Card headings, sub-section titles |
| `.bt-body` | 0.875rem (14px) | sans | 400 | 1.5 | normal | Primary body text |
| `.bt-label` | 0.6875rem (11px) | sans | 500 | 1.4 | 0.08em | Labels, badges, ALL CAPS UI text |
| `.bt-mono` | 0.8125rem (13px) | mono | 400 | 1.4 | normal | Code, IDs, data values |
| `.bt-num` | 1.625rem (26px) | sans | 400 | 1.1 | normal | Metric numbers (tabular-nums) |
| `.bt-mega` | 2.75rem (44px) | sans | 700 | 1.0 | normal | Hero stat numbers (tabular-nums) |

### 4.3 Status Typography Classes

| Class | Pairing | Usage |
|---|---|---|
| `.bt-status-complete` | `--status-success` | Completed state labels |
| `.bt-status-active` | `--status-info` | Active/in-flight state labels |
| `.bt-status-pending` | `--status-warn` | Pending/waiting state labels |
| `.bt-status-blocked` | `--status-halt` | Blocked/error state labels |

---

## §5 — shadcn/ui Component Set

The platform uses the shadcn/ui component library initialised with the oklch warm palette.

### 5.1 Components in use

| Component | File | Usage Count | Variants Used | Notes |
|---|---|---|---|---|
| `Button` | `ui/button.tsx` | 15+ | default, outline, ghost, destructive, link | Most-used primitive; CVA-based |
| `Dialog` | `ui/dialog.tsx` | 10+ | standard | Used in all modal flows |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | 8+ | standard | Nav actions, context menus |
| `AlertDialog` | `ui/alert-dialog.tsx` | 3 | standard | Destructive confirmations only |
| `Badge` | `ui/badge.tsx` | 5 | default, outline, secondary | Status tags, disclosure tiers |
| `Input` | `ui/input.tsx` | 8+ | standard | All text inputs |
| `Card` | `ui/card.tsx` | 2 | standard | Rarely used directly; most cards use `.brand-card` |
| `Label` | `ui/label.tsx` | 2 | standard | Form labels |
| `Avatar` | `ui/avatar.tsx` | 2 | standard | User avatars in nav/profile |
| `Separator` | `ui/separator.tsx` | 2 | horizontal | Section dividers |
| `Sheet` | `ui/sheet.tsx` | 2 | side | Mobile nav drawer; trace drawer |
| `ScrollArea` | `ui/scroll-area.tsx` | 1 | standard | Scrollable sidebar lists |
| `Tabs` | `ui/tabs.tsx` | 1 | standard | Tab panel navigation |
| `Sonner` | `ui/sonner.tsx` | 1 | standard | Toast notification provider |

### 5.2 Variants not in use (likely unnecessary)

The following shadcn/ui components are **not imported** anywhere in `platform/src/`:

- `Accordion` — not used; `ToolCallAccordion` is a custom implementation
- `Calendar` / `DatePicker` — not used
- `Checkbox` — not used (admin tables use custom row selection)
- `Combobox` — not used
- `Form` (react-hook-form wrapper) — not used; forms are manual
- `HoverCard` — not used
- `Menubar` — not used
- `NavigationMenu` — not used (custom `AppShellRail`)
- `Popover` — not used as a standalone (may be within other shadcn components)
- `Progress` — not used
- `RadioGroup` — not used
- `Select` — not used (custom `DropdownMenu` used for selections)
- `Skeleton` — not used; loading states use custom animated elements
- `Slider` — not used
- `Switch` — not used
- `Table` — not used; all tables are custom
- `Textarea` — not used; `Composer` uses a custom textarea
- `Tooltip` — may be used internally; not confirmed as a standalone import

---

## §6 — Findings from W1-R1 Deep Audit (ranked by severity)

> **Status:** W2-R1 CLOSED (2026-04-30). All findings resolved or explicitly deferred.
> Original violation register: `00_NAK/reports/NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md`.
> Closure report: `00_NAK/reports/NAK_DESIGN_FIX_REPORT_W2_R1_v1_0.md`.

---

### F-DS-1 (HIGH) ✅ RESOLVED W2-R1 — Admin module: 64 hardcoded hex violations, zero CSS variable usage

**Affected files:** `admin/styles.ts` (24), `admin/UsersTable.tsx` (20), `admin/PendingRequestsTable.tsx` (7), `admin/ApproveDialog.tsx` (3), `admin/ConfirmDialog.tsx` (2), `admin/EditUsernameDialog.tsx` (2), `admin/NewUserDialog.tsx` (2), `admin/AdminClient.tsx` (2), `admin/AdminSignOut.tsx` (2).

**Issue:** 64 hardcoded hex literals across 9 files. `styles.ts` is the master palette file — it pre-composes Tailwind class strings with `[#d4af37]`, `[#fce29a]`, `[#0e0b06]` etc. All downstream components import from `styles.ts`, so fixing `styles.ts` first propagates the correction automatically. The module hardcodes the dark ink-gold palette unconditionally — does not respond to the user's light/dark toggle (MISSING_DARK_MODE for entire module).

**Recurring hex → correct token mappings (see full report for all):**
- `#d4af37`, `#f4d160` → `var(--brand-gold)`, `var(--brand-gold-light)`
- `#fce29a` → `var(--brand-gold-cream)`
- `#0e0b06`, `#0a0805` → `var(--brand-ink)`
- `#9b834f`, `#7a5210` → `var(--muted-foreground)` (dark)
- `rgba(212,175,55,0.35)` → `var(--brand-gold-hairline)`

**Resolution (W2-R1):** `admin/styles.ts` migrated (24 hex → brand tokens); 8 downstream components swept for inline violations. All 64 violations closed.

---

### F-DS-2 (MEDIUM) ✅ RESOLVED W2-R1 (recharts CHART_PALETTE subset deferred W2-R3) — Build module: 52 violations (chart colours + component oklch)

**Affected files:** `build/colors.ts` (24), `build/InsightCards.tsx` (4), `build/CorpusDensityHero.tsx` (10), `build/HealthSparkline.tsx` (6), `build/InterventionFrequency.tsx` (3), `build/charts/TrendLine.tsx` (4), `build/charts/OnOffPlanDonut.tsx` (2), `build/charts/CadenceArea.tsx` (2).

**Issue:** Two categories:
1. **Status-palette violations (28 violations):** `colors.ts` and component-level `[oklch(...)]` classes use hardcoded colour literals that should reference `var(--status-*)` tokens. Specifically: phase status colours (completed/active/blocked), exit code colours (0=green, 2=amber, 4=red), health sparkline colours.
2. **CHART_PALETTE exceptions (24 violations):** Session type colours (`#3b82f6` blue, `#a855f7` purple, etc.), plan-type colours (`#6366f1` indigo). These serve as categorical/data-visualization colours with no equivalent in the brand token system. Document as `CHART_PALETTE` constants — keep hardcoded but isolate in `colors.ts`.

**Special consideration — recharts SVG props:** `stroke="#f59e0b"`, `fill="#ef4444"` etc. in recharts props cannot accept CSS `var()` syntax. Fix requires a `useBrandColors()` hook that resolves CSS variables at runtime.

**Resolution (W2-R1):** `--color-status-*` added to `@theme inline` (F-DS-8 prerequisite). `colors.ts` status palette migrated to `var(--status-*)`. `InsightCards.tsx` and `CorpusDensityHero.tsx` oklch classes → token utilities. Recharts SVG props (24 CHART_PALETTE hex values in `classColors`, `severityColors`, `exitCodeColor`, `HealthSparkline`, `InterventionFrequency`, `TrendLine`) annotated as CHART_PALETTE exceptions — deferred to W2-R3 pending `useBrandColors()` hook.

---

### F-DS-3 (MEDIUM) ⏭ DEFERRED W2-R2 — cockpit/error.tsx: no design token usage

**Affected file:** `src/app/cockpit/error.tsx`

**Issue:** The cockpit error boundary uses raw Tailwind + inline style props with no design token classes. Inconsistent with `src/app/error.tsx` which properly uses the `Button` component.

**Fix action (W2-R2):** Refactor to use `Button` component and standard Tailwind token classes.

---

### F-DS-4 (LOW) ✅ RESOLVED W2-R1 — profile/: inline style hex fallbacks

**Affected files:** `profile/RoomCard.tsx` (line 25, 32), `profile/ProfileSideRail.tsx` (lines 28, 79), `profile/DashaCountdown.tsx` (line 39).

**Issue (updated from W0):** 5 inline `style={{ color: 'var(--token, #hex)' }}` props carry hex fallbacks that duplicate the token value. The tokens are defined and will always resolve — the fallbacks are maintenance dead-weight. The violations are NOT oklch literals but hex fallbacks in CSS variable calls.

**Resolution (W2-R1):** Hex fallbacks removed from `RoomCard.tsx` (lines 25, 32), `ProfileSideRail.tsx` (lines 28, 79), `DashaCountdown.tsx` (line 39).

---

### F-DS-5 (LOW) ✅ RESOLVED W2-R1 — .brand-card: defined but never used

**Issue (W1-R1 finding):** `.brand-card` utility class is defined in `globals.css` (lines 182–186) but has zero usages across `platform/src/`. It is dead CSS. `.brand-cta` is actively used (3 usages) and should be retained.

**Resolution (W2-R1):** `.brand-card` block removed from `globals.css`.

---

### F-DS-6 (HIGH — NEW) ✅ RESOLVED W2-R1 — trace/TracePanel.tsx: 50+ slate-* violations

**Affected file:** `trace/TracePanel.tsx` (~800 lines)

**Issue:** Not caught in W0 (directory `trace/` was out of W0 audit scope). The entire component uses GitHub's `slate-*` dark palette (`slate-500` through `slate-900`) for all surface, text, and border colours — zero brand token usage. Also includes two hardcoded hex values: `bg-[#0d1117]` and `bg-[#161b27]`. This creates a visual inconsistency when the trace panel renders inside the consume surface (which correctly uses the brand-ink palette).

**Resolution (W2-R1):** Full sweep completed. All `slate-*` utilities, `bg-[#0d1117]`, `bg-[#161b27]`, and `border-l-blue-500` replaced with brand token equivalents via targeted Edit and sed pass. `TraceDrawer.tsx` shell also fixed (F-DS-6 carried 4 DrawerShell violations catalogued separately as STEP D3).

---

### F-DS-7 (MEDIUM — NEW) ✅ RESOLVED W2-R1 — build/colors.ts: central chart palette needs documentation boundary

**Affected file:** `build/colors.ts`

**Issue:** The file mixes two categories: (a) phase-status colours that should reference `var(--status-*)` tokens, and (b) categorical session-type colours that have no brand-token equivalent. Currently both categories are hardcoded without distinction. This creates ambiguity for future maintainers about which values are token-fixable and which are intentional CHART_PALETTE constants.

**Resolution (W2-R1):** `statusColors`, `statusBg`, `statusText` migrated to `var(--status-*)` / token utilities. `classColors`, `severityColors`, `exitCodeColor` annotated as CHART_PALETTE with explanatory JSDoc comments.

---

### F-DS-8 (MEDIUM — NEW) ✅ RESOLVED W2-R1 — Brand and status tokens not mapped as Tailwind utilities

**Issue:** Tailwind v4 CSS-based config. There is no `tailwind.config.ts`. Brand tokens (`--brand-gold` etc.) are defined in `@theme inline` but without the `--color-` prefix, so `text-brand-gold` etc. do NOT exist as Tailwind utilities. Same for status tokens (`--status-warn` etc. defined in `:root`).

**This is the unblocking prerequisite for all other fixes.** Until `--color-brand-*` and `--color-status-*` are added to `@theme inline`, components cannot replace `text-[var(--brand-gold)]` arbitrary classes with `text-brand-gold` clean Tailwind utilities.

**Resolution (W2-R1):** `--color-brand-*` and `--color-status-*` mappings added to `@theme inline` in `globals.css` as STEP A. Tailwind utilities `text-brand-gold`, `bg-brand-ink`, `text-status-success`, `bg-status-success-bg` etc. are now available project-wide.

---

### F-DS-9 (LOW — NEW) ✅ RESOLVED W2-R1 — globals.css bt-status-* use hardcoded oklch instead of tokens

**Affected file:** `platform/src/app/globals.css`, lines 355–362.

**Issue:**
```css
.bt-status-complete { color: oklch(0.40 0.12 145); }   /* should be var(--status-success) */
.bt-status-active   { color: oklch(0.45 0.12 75);  }   /* no --status-active token; use brand-gold or muted */
.bt-status-blocked  { color: oklch(0.40 0.18 27);  }   /* should be var(--status-halt) */
```
The status utility classes in globals.css itself do not reference the `--status-*` tokens they were authored to represent.

**Resolution (W2-R1):** `bt-status-complete`, `bt-status-active`, `bt-status-blocked` (and their `.dark` variants) updated to `var(--status-success)`, `var(--brand-gold)`, `var(--status-halt)` respectively. Also added `bt-status-pending` for completeness.

---

### F-DS-10 (LOW — NEW) ✅ RESOLVED W2-R1 — shadcn variant dead code

**Affected files:** `ui/button.tsx`, `ui/badge.tsx`, `ui/tabs.tsx`

**Issue (W1-R1 finding):** Zero-usage CVA variants identified:
- `Button` `link` variant — 0 explicit usages
- `Badge` `ghost` + `link` variants — 0 explicit usages
- `TabsList` `line` variant — 0 explicit usages

**Resolution (W2-R1):** Zero-usage variants removed in STEP B: `Button` `link` variant, `Badge` `ghost` + `link` variants, `TabsList` `line` variant (and all associated conditional styles in `TabsTrigger`).

---

*End of NAK_DESIGN_SYSTEM_v1_0.md v1.2 — FINAL. All F-DS-1 through F-DS-10 resolved or deferred. Closure report: `00_NAK/reports/NAK_DESIGN_FIX_REPORT_W2_R1_v1_0.md`.*
