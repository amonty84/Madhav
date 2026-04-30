---
artifact_id: NAK_DESIGN_SYSTEM
version: 1.0
status: DRAFT
authored_by: Claude Code (NAK W0 session) 2026-04-30
project: NAK — Nakula
wave_run: W0 (draft) → W1-R1 (populate findings) → W2-R1 (implement fixes) → final
purpose: >
  Single-file design system specification for the MARSYS-JIS platform portal.
  W0 status DRAFT documents current state including its problems.
  W1-R1 adds deep findings. W2-R1 implements fixes and elevates to FINAL.
changelog:
  - v1.0 (2026-04-30): W0 authoring — token inventory, typography, theme zones, shadcn set, W0 findings.
---

# NAK Design System v1.0 — DRAFT

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

## §6 — Findings from W0 Part A (ranked by severity)

### F-DS-1 (HIGH) — Admin module: hardcoded hex values, zero CSS variable usage

**Affected files:** All components under `platform/src/components/admin/`, plus `styles.ts` helper.

**Issue:** The admin module uses hardcoded hex colour literals (#d4af37, #fce29a, #0e0b06, #9b834f, #211a08, #7a5210) throughout — including in a `styles.ts` helper that pre-composes class strings. None of the brand CSS variables (`--brand-gold`, `--brand-charcoal`, etc.) are referenced. The module does not respect the dark mode palette.

**Impact:** Admin surfaces will not respond to dark mode toggles. Future palette updates require manual find/replace across multiple files. Visual inconsistency between admin and the rest of the portal.

**Target fix (W2-R1):** Replace all hex literals with `var(--brand-gold)`, `var(--brand-charcoal)`, `var(--brand-ink)`, `var(--status-*)` equivalents. Remove `styles.ts` or migrate it to use Tailwind class names only.

---

### F-DS-2 (MEDIUM) — Build, dashboard, and consume: mixed compliance

**Affected dirs:** `components/build/`, `components/dashboard/`, `components/consume/`

**Issue:** Newer sub-components in these dirs use CSS vars correctly; older sub-components use arbitrary Tailwind color classes (`text-[#d4af37]`, `bg-[oklch(...)]`). No consistent enforcement.

**Impact:** Inconsistent visual output; arbitrary classes bypass dark mode handling.

**Target fix (W2-R1):** Sweep each dir; replace arbitrary color classes with Tailwind token classes (`text-brand-gold`) after confirming `tailwind.config.ts` extends `brand-gold` correctly.

---

### F-DS-3 (MEDIUM) — cockpit/error.tsx: no design token usage

**Affected file:** `src/app/cockpit/error.tsx`

**Issue:** The cockpit error boundary uses raw Tailwind + inline style props with no design token classes. Inconsistent with `src/app/error.tsx` which properly uses the `Button` component.

**Target fix (W2-R2):** Refactor to use `Button` component and standard Tailwind token classes.

---

### F-DS-4 (LOW) — audit/ and profile/: minor inline oklch literals

**Affected dirs:** `components/audit/`, `components/profile/`

**Issue:** Status colours occasionally set via `style={{ color: "oklch(...)" }}` inline rather than `className="text-status-warn"` or `var(--status-warn)`.

**Target fix (W2-R1):** Replace inline style props with Tailwind utility classes using the status token scale.

---

### F-DS-5 (LOW) — Card primitive underused; .brand-card used directly

**Issue:** The shadcn `Card` component is imported only twice. Most "card-like" surfaces use the `.brand-card` CSS utility class directly on `<div>` elements, bypassing the Card primitive's semantic structure.

**Impact:** Inconsistent card structure; `.brand-card` cannot be themed from the token layer alone.

**Target fix (W1-R1 investigate, W2-R1 decide):** Evaluate whether to deprecate `.brand-card` in favour of a `Card` variant with `data-variant="brand"`, or retain `.brand-card` as a standalone utility.

---

*End of NAK_DESIGN_SYSTEM_v1_0.md v1.0 — DRAFT. W1-R1 to populate §6 with deep findings; W2-R1 to implement and flip status to FINAL.*
