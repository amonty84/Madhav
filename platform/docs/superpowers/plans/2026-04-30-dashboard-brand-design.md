# Dashboard Brand Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the MARSYS-JIS brand design system (Ink Immersion + Mandala) to all dashboard roster components so the operator workspace is visually unified with the login page.

**Architecture:** Scope the ink/dark zone to the dashboard layout only (not the shared AppShell), then work component by component from the shell outward — zone → shell chrome → page wrapper → data components. Each task is a self-contained visual change with no logic modifications.

**Tech Stack:** Next.js 14, Tailwind CSS v4, shadcn/ui, custom brand tokens in `src/app/globals.css` (`brand-cta`, `brand-card`, `bt-*` typography classes, `--brand-gold` CSS custom property).

**Spec:** `docs/superpowers/specs/2026-04-30-dashboard-brand-design.md`

---

## File Map

| File | Change type | What changes |
|---|---|---|
| `src/app/dashboard/layout.tsx` | Modify | Wrap AppShell in ZoneRoot zone="ink" |
| `src/components/shared/AppShellBreadcrumb.tsx` | Modify | Ink bg + gold text |
| `src/components/shared/AppShellRail.tsx` | Modify | Gold active item, gold avatar |
| `src/app/dashboard/page.tsx` | Modify | Mandala bg, vignette, danda title, brand-cta |
| `src/components/dashboard/RosterStatsRibbon.tsx` | Modify | brand-card surface, gold numbers |
| `src/components/dashboard/RosterFilters.tsx` | Modify | Ink inputs, gold focus ring, brand tab toggle |
| `src/components/dashboard/ClientCard.tsx` | Modify | Full rebrand — brand-card, bt-num, progress bar, brand-cta |
| `src/components/dashboard/RosterTableView.tsx` | Modify | Ink table, gold headers/dividers/numbers |
| `src/components/dashboard/RosterEmptyWizard.tsx` | Modify | Ink surface, gold CTA |

---

## Task 1: Zone Forcing — Dashboard Layout

**Files:**
- Modify: `src/app/dashboard/layout.tsx`

The ZoneRoot wrapper forces the `dark` class and `zone-ink` scope onto the entire dashboard route tree. This makes all Tailwind `dark:` variants and the brand token overrides in `globals.css` activate for the dashboard — without touching the shared AppShell used by admin/cockpit/build/consume.

- [ ] **Step 1: Apply the change**

Replace `src/app/dashboard/layout.tsx` with:

```tsx
import { redirect } from 'next/navigation'
import { getServerUserWithProfile } from '@/lib/auth/access-control'
import { AppShell } from '@/components/shared/AppShell'
import { ZoneRoot } from '@/components/shared/ZoneRoot'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await getServerUserWithProfile()
  if (!ctx) redirect('/login')
  if (ctx.profile.status !== 'active') redirect('/login')

  return (
    <ZoneRoot zone="ink">
      <AppShell
        user={ctx.user}
        profile={ctx.profile}
        breadcrumb={[{ label: 'Roster', current: true }]}
      >
        {children}
      </AppShell>
    </ZoneRoot>
  )
}
```

**Height note:** `ZoneRoot` renders as `<div className="zone-ink dark">` — a plain unstyled div with no height set. `AppShell`'s own root div carries `h-[100dvh]` (line 17 of `AppShell.tsx`) and sizes relative to the viewport, not its parent, so the layout fills the screen correctly. Do NOT add `className="h-[100dvh]"` to `ZoneRoot` and do NOT remove `h-[100dvh]` from `AppShell` — both would be redundant or harmful.

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/layout.tsx
git commit -m "feat(dashboard): scope ZoneRoot zone=ink to dashboard layout"
```

---

## Task 2: AppShellRail — Gold Nav Treatment

**Files:**
- Modify: `src/components/shared/AppShellRail.tsx`

The sigil is already gold. Replace the generic `bg-sidebar-accent` active item and the avatar styles with explicit brand-gold values that look right on the ink background.

- [ ] **Step 1: Apply the change**

In `src/components/shared/AppShellRail.tsx`, change the `isActive` class string (line ~74) and the avatar trigger class (line ~91):

```tsx
// Active nav item — was: 'bg-sidebar-accent text-sidebar-accent-foreground'
// New:
isActive
  ? 'bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.22)] text-[#d4af37]'
  : 'text-[rgba(212,175,55,0.28)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]'
```

```tsx
// Avatar trigger — was: 'grid h-11 w-11 place-items-center rounded-full border border-border bg-muted text-xs font-medium text-foreground transition-colors hover:bg-accent'
// New:
className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.07)] text-xs font-medium text-[rgba(212,175,55,0.6)] transition-colors hover:bg-[rgba(212,175,55,0.12)]"
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/AppShellRail.tsx
git commit -m "feat(dashboard): gold nav item and avatar treatment in AppShellRail"
```

---

## Task 3: AppShellBreadcrumb — Ink Bar

**Files:**
- Modify: `src/components/shared/AppShellBreadcrumb.tsx`

Replace the generic `bg-background border-border` breadcrumb bar with the ink-tinted treatment.

- [ ] **Step 1: Apply the change**

In `src/components/shared/AppShellBreadcrumb.tsx`, replace the `<nav>` className (line ~16) and the segment text classes:

```tsx
<nav
  aria-label="Breadcrumb"
  className="flex h-10 items-center gap-1.5 border-b border-[rgba(212,175,55,0.12)] bg-[rgba(8,5,2,0.5)] px-4 text-sm"
>
```

Active segment (has `current: true`):
```tsx
className={seg.current ? 'font-medium text-[#fce29a]' : 'text-[rgba(212,175,55,0.45)]'}
```

Inactive link:
```tsx
className="text-[rgba(212,175,55,0.45)] hover:text-[#fce29a] transition-colors"
```

Separator dot:
```tsx
<span aria-hidden="true" className="text-[rgba(212,175,55,0.2)] select-none">
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/AppShellBreadcrumb.tsx
git commit -m "feat(dashboard): ink breadcrumb bar with gold text"
```

---

## Task 4: Dashboard Page — Mandala Background + Brand Header

**Files:**
- Modify: `src/app/dashboard/page.tsx`

Add the Mandala + radial vignette as absolute-positioned background layers. Replace the plain heading with the serif + danda ornament. Replace the generic "+ New Client" button with `brand-cta`.

- [ ] **Step 1: Apply the change**

In `src/app/dashboard/page.tsx`:

1. Add `Mandala` import:
```tsx
import { Mandala } from '@/components/brand/Mandala'
```

2. Replace the outer `return` JSX:

```tsx
return (
  <div className="relative min-h-full overflow-hidden">
    {/* Mandala backdrop */}
    <Mandala
      size={560}
      opacity={0.13}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    {/* Radial vignette */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_25%,rgba(2,2,1,0.5)_65%,rgba(2,2,1,0.88)_100%)]" />

    <div className="relative z-10 container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="bt-display text-[#fce29a]">
          <span className="opacity-55 text-[#d4af37] font-serif mr-1">॥</span>
          Roster
          <span className="opacity-55 text-[#d4af37] font-serif ml-1">॥</span>
        </h1>
        <Link href="/clients/new" className="brand-cta rounded-[10px] px-4 py-2.5 text-xs">
          + New Client
        </Link>
      </div>
      <Suspense>
        <ClientRoster charts={chartsWithMeta} stats={stats} />
      </Suspense>
    </div>
  </div>
)
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat(dashboard): Mandala backdrop + brand header with danda ornament"
```

---

## Task 5: RosterStatsRibbon — Brand Card Surface

**Files:**
- Modify: `src/components/dashboard/RosterStatsRibbon.tsx`

Replace the muted ribbon with the `brand-card` surface. Stat numbers become gold; labels become muted gold.

- [ ] **Step 1: Apply the change**

Replace `src/components/dashboard/RosterStatsRibbon.tsx` with:

```tsx
interface RosterStatsRibbonProps {
  total: number
  inActiveBuild: number
  consumedToday: number
  predictionsOverdue: number
  onFilterShortcut?: (key: string, value: string) => void
}

export function RosterStatsRibbon({
  total,
  inActiveBuild,
  consumedToday,
  predictionsOverdue,
  onFilterShortcut,
}: RosterStatsRibbonProps) {
  const segments: { label: string; value: number; filterKey?: string; filterVal?: string }[] = [
    { label: 'charts', value: total },
    { label: 'in active build', value: inActiveBuild, filterKey: 'buildMax', filterVal: '99' },
    { label: 'consumed today', value: consumedToday },
    ...(predictionsOverdue > 0
      ? [{ label: 'predictions overdue', value: predictionsOverdue }]
      : []),
  ]

  return (
    <div className="brand-card flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-4 py-2.5 text-sm">
      {segments.map((seg, i) => (
        <span key={seg.label} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-[rgba(212,175,55,0.2)] select-none">·</span>
          )}
          {seg.filterKey && onFilterShortcut ? (
            <button
              onClick={() => onFilterShortcut(seg.filterKey!, seg.filterVal!)}
              className="font-semibold tabular-nums text-[#d4af37] hover:text-[#fce29a] transition-colors"
            >
              {seg.value}
            </button>
          ) : (
            <span className="font-semibold tabular-nums text-[#d4af37]">{seg.value}</span>
          )}
          <span className="text-[rgba(212,175,55,0.5)]">{seg.label}</span>
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/RosterStatsRibbon.tsx
git commit -m "feat(dashboard): brand-card stats ribbon with gold numbers"
```

---

## Task 6: RosterFilters — Ink Inputs + Brand Tab Toggle

**Files:**
- Modify: `src/components/dashboard/RosterFilters.tsx`

Apply the login form input treatment to all filter controls. Replace the muted view toggle with the login tab-toggle style.

- [ ] **Step 1: Apply the change**

Replace `src/components/dashboard/RosterFilters.tsx` with:

```tsx
'use client'

import { useCallback } from 'react'
import type { FilterState } from '@/lib/roster/types'

export type ViewMode = 'grid' | 'table'

interface RosterFiltersProps {
  filters: FilterState
  view: ViewMode
  places: string[]
  onFilterChange: (next: Partial<FilterState>) => void
  onViewChange: (view: ViewMode) => void
}

const INPUT_CLS =
  'h-8 rounded-[10px] border border-[rgba(212,175,55,0.2)] bg-[rgba(8,6,3,0.7)] px-3 text-sm ' +
  'text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20'

export function RosterFilters({
  filters,
  view,
  places,
  onFilterChange,
  onViewChange,
}: RosterFiltersProps) {
  const handleBuildRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({ buildMax: parseInt(e.target.value, 10) })
    },
    [onFilterChange]
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <input
        value={filters.q}
        onChange={(e) => onFilterChange({ q: e.target.value })}
        placeholder="Search name or place…"
        className={`${INPUT_CLS} w-full max-w-xs`}
      />

      {/* Birth place */}
      <select
        value={filters.place}
        onChange={(e) => onFilterChange({ place: e.target.value })}
        className={INPUT_CLS}
      >
        <option value="">All places</option>
        {places.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Dasha — disabled until Phase 14C */}
      <select
        disabled
        title="Dasha data available after Phase 14C"
        className={`${INPUT_CLS} cursor-not-allowed opacity-40`}
      >
        <option>Current dasha</option>
      </select>

      {/* Build % max slider */}
      <label className="flex items-center gap-2 text-sm text-[rgba(212,175,55,0.45)]">
        <span className="whitespace-nowrap">Build ≤ {filters.buildMax}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={10}
          value={filters.buildMax}
          onChange={handleBuildRangeChange}
          className="w-20 accent-[#d4af37]"
        />
      </label>

      {/* Last activity */}
      <select
        value={filters.since}
        onChange={(e) => onFilterChange({ since: e.target.value })}
        className={INPUT_CLS}
      >
        <option value="">Any activity</option>
        <option value={sinceDate(7)}>Last 7 days</option>
        <option value={sinceDate(30)}>Last 30 days</option>
        <option value={sinceDate(90)}>Last 90 days</option>
      </select>

      {/* Spacer */}
      <span className="flex-1" />

      {/* Grid / Table toggle — login tab-toggle style */}
      <div
        role="group"
        aria-label="View mode"
        className="flex h-8 items-center rounded-[8px] border border-[rgba(212,175,55,0.2)] bg-[rgba(8,6,3,0.6)] p-[3px] text-sm"
      >
        {(['grid', 'table'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            aria-pressed={view === v}
            className={
              view === v
                ? 'rounded-[5px] bg-gradient-to-b from-[#3a2c10] to-[#241a07] px-3 py-1 font-medium uppercase tracking-[0.06em] text-[#fce29a] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.25)]'
                : 'rounded-[5px] px-3 py-1 font-medium uppercase tracking-[0.06em] text-[rgba(212,175,55,0.35)] transition-colors hover:text-[#fce29a]'
            }
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

function sinceDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/RosterFilters.tsx
git commit -m "feat(dashboard): ink filter inputs + brand tab toggle"
```

---

## Task 7: ClientCard — Full Rebrand

**Files:**
- Modify: `src/components/dashboard/ClientCard.tsx`

This is the largest single change. Replace the shadcn Card with a brand-card surface, apply bt-num to the build %, add a progress bar, and replace the button variants with brand-cta + ghost gold style.

- [ ] **Step 1: Apply the change**

Replace `src/components/dashboard/ClientCard.tsx` with:

```tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MomentPhrase } from './MomentPhrase'
import type { ChartWithMeta } from '@/lib/roster/types'

interface Props {
  chart: ChartWithMeta
}

type HealthStatus = 'green' | 'amber' | 'red'

function healthStatus(chart: ChartWithMeta): HealthStatus {
  if (chart.pyramidPercent === 0) return 'amber'
  if (!chart.lastLayerActivity) return 'amber'
  const ageMs = Date.now() - new Date(chart.lastLayerActivity).getTime()
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  return ageDays < 7 ? 'green' : 'amber'
}

const HEALTH_DOT_CLASS: Record<HealthStatus, string> = {
  green: 'bg-emerald-500 shadow-[0_0_4px_theme(colors.emerald.500)]',
  amber: 'bg-amber-400 shadow-[0_0_4px_theme(colors.amber.400)]',
  red:   'bg-red-500   shadow-[0_0_4px_theme(colors.red.500)]',
}

const GHOST_BTN =
  'border border-[rgba(212,175,55,0.22)] bg-transparent text-[rgba(212,175,55,0.55)] ' +
  'text-xs font-semibold uppercase tracking-[0.08em] rounded-md px-3 py-1.5 ' +
  'hover:text-[#fce29a] hover:border-[rgba(212,175,55,0.4)] transition-colors'

export function ClientCard({ chart }: Props) {
  const percent = chart.pyramidPercent
  const health = healthStatus(chart)

  return (
    <div className="brand-card flex flex-col gap-3 rounded-xl p-4 hover:border-[rgba(212,175,55,0.35)] transition-colors">
      {/* Name + health dot */}
      <div className="flex items-center gap-2">
        <span
          aria-label={`Health: ${health}`}
          className={cn('inline-block h-2 w-2 shrink-0 rounded-full', HEALTH_DOT_CLASS[health])}
        />
        <span className="bt-heading text-[#fce29a] truncate">{chart.name}</span>
      </div>

      {/* Birth metadata */}
      <p className="bt-label -mt-2" style={{ color: 'rgba(212,175,55,0.42)' }}>
        {chart.birth_date} · {chart.birth_place}
      </p>

      {/* Build % */}
      <div>
        <span className="bt-num text-[#d4af37]">
          {percent}<span className="text-sm font-normal text-[rgba(212,175,55,0.45)]">%</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] w-full rounded-full bg-[rgba(212,175,55,0.1)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#a26d0e] to-[#f4d160]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Moment phrase */}
      <MomentPhrase
        pyramidPercent={percent}
        lastLayerActivity={chart.lastLayerActivity}
      />

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/clients/${chart.id}`} className="brand-cta flex-1 rounded-md px-3 py-1.5 text-center text-xs">
          Profile
        </Link>
        <Link href={`/clients/${chart.id}/build`} className={GHOST_BTN}>
          Build
        </Link>
        <Link href={`/clients/${chart.id}/consume`} className={GHOST_BTN}>
          Consume
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/ClientCard.tsx
git commit -m "feat(dashboard): ClientCard full rebrand — brand-card, bt-num, progress bar, gold CTAs"
```

---

## Task 8: RosterTableView — Ink Table

**Files:**
- Modify: `src/components/dashboard/RosterTableView.tsx`

Apply ink background, gold hairline dividers, bt-label-upper headers, and ghost action buttons matching the card style.

- [ ] **Step 1: Apply the change**

In `src/components/dashboard/RosterTableView.tsx`:

**Outer wrapper** (line ~45):
```tsx
<div className="overflow-x-auto rounded-lg border border-[rgba(212,175,55,0.15)]">
```

**`<table>`** (line ~46):
```tsx
<table className="w-full text-xs">
```

**`<thead>`** (line ~47):
```tsx
<thead className="bg-[rgba(8,6,3,0.6)]">
```

**Header `<th>` — concrete example** (`.bt-label` sets `color` in CSS directly, beating Tailwind utilities — use inline style to guarantee the gold override):

```tsx
<th
  className="bt-label bt-label-upper whitespace-nowrap px-3 py-2 text-left"
  style={{ color: 'rgba(212,175,55,0.45)' }}
  aria-sort={sortKey === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
>
  <button
    onClick={() => toggle('name')}
    className="cursor-pointer select-none hover:text-[#d4af37]"
    style={{ color: 'inherit' }}
  >
    Name{sortIndicator('name')}
  </button>
</th>
```

Apply the same `style={{ color: 'rgba(212,175,55,0.45)' }}` pattern to every `<th>` in the table. Non-sortable `<th>` elements (Birth, Current dasha, Actions) just carry the class + inline style with no inner button.

**`<tbody>`** (line ~89):
```tsx
<tbody className="divide-y divide-[rgba(212,175,55,0.1)]">
```

**Row hover** (line ~90):
```tsx
<tr key={c.id} className="hover:bg-[rgba(212,175,55,0.04)] transition-colors">
```

**Name cell** `<p>`:
```tsx
<p className="font-medium text-[#fce29a]">{c.name}</p>
```

**Birth cells**: primary `text-[rgba(212,175,55,0.6)]`, place `text-[rgba(212,175,55,0.38)]`

**Build % cell**:
```tsx
<td className="whitespace-nowrap px-3 py-2 tabular-nums font-semibold text-[#d4af37]">
```

**Last activity cell**:
```tsx
<td className="whitespace-nowrap px-3 py-2 text-[rgba(212,175,55,0.42)]">
```

**Action buttons**: define `GHOST_BTN` as a module-level constant directly inside `RosterTableView.tsx` (same string as in `ClientCard.tsx` — they are intentionally duplicated in their respective files; do not extract to a shared file as these are co-located presentation details):
```tsx
const GHOST_BTN =
  'border border-[rgba(212,175,55,0.22)] bg-transparent text-[rgba(212,175,55,0.55)] ' +
  'text-xs font-semibold uppercase tracking-[0.08em] rounded-md px-3 py-1.5 ' +
  'hover:text-[#fce29a] hover:border-[rgba(212,175,55,0.4)] transition-colors'
```

Replace the existing `buttonVariants` imports and Link className calls with `GHOST_BTN`. Remove the `buttonVariants` import since it's no longer used.

**Empty state cell** `text-muted-foreground` → `text-[rgba(212,175,55,0.4)]`

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/RosterTableView.tsx
git commit -m "feat(dashboard): ink table — gold dividers, bt-label-upper headers, gold data cells"
```

---

## Task 9: RosterEmptyWizard — Ink Surface

**Files:**
- Modify: `src/components/dashboard/RosterEmptyWizard.tsx`

The wizard already uses the Mandala. Add the ink surface, raise mandala opacity slightly, apply brand typography, replace the generic CTA.

- [ ] **Step 1: Apply the change**

Replace `src/components/dashboard/RosterEmptyWizard.tsx` with:

```tsx
import Link from 'next/link'
import { Mandala } from '@/components/brand/Mandala'

export function RosterEmptyWizard() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl border border-[rgba(212,175,55,0.15)] bg-[radial-gradient(ellipse_at_50%_50%,rgba(13,10,5,0.5)_0%,rgba(2,2,1,0.92)_100%)]">
      {/* Mandala backdrop */}
      <Mandala
        size={480}
        opacity={0.22}
        className="pointer-events-none absolute inset-0 m-auto"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <h2 className="bt-heading text-[#fce29a]">
          Welcome. Begin with your first chart.
        </h2>
        <p className="text-sm text-[rgba(212,175,55,0.5)] max-w-xs">
          Each chart is a native's complete Jyotish record — facts, build corpus, and conversation history.
        </p>
        <Link
          href="/clients/new"
          className="brand-cta rounded-lg px-6 py-3 text-sm"
        >
          + Add first chart
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd platform && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/RosterEmptyWizard.tsx
git commit -m "feat(dashboard): ink empty wizard — brand surface, gold text, brand-cta"
```

---

## Task 10: Visual QA — Dev Server

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

```bash
cd platform && npm run dev
```

Open `http://localhost:3000` and log in. You will be redirected to `/dashboard`.

- [ ] **Step 2: Grid view checklist**

Verify each item is correct:

- [ ] Background is deep ink/charcoal (not white or light grey)
- [ ] Mandala is visible as a faint gold geometric pattern centered behind the cards
- [ ] Page title reads `॥ Roster ॥` in serif, gold-cream color
- [ ] "+ New Client" has the gold gradient (brand-cta) treatment
- [ ] Stats ribbon has translucent ink background with gold border, gold numbers
- [ ] Filter inputs have ink background; focus ring is gold
- [ ] View toggle (Grid/Table) looks like the login tab toggle (dark pill with amber active state)
- [ ] Each ClientCard has: ink background, gold border, serif name, large gold build %, 2px progress bar, gold gradient "Profile" button, ghost gold "Build"/"Consume" links
- [ ] Health dots glow (green/amber)

- [ ] **Step 3: Table view checklist**

Click "Table":

- [ ] Table background is ink
- [ ] Column headers are small uppercase gold text
- [ ] Row dividers are hairline gold
- [ ] Row hover is very faint gold tint
- [ ] Build % is gold and bold
- [ ] Action buttons are ghost gold style

- [ ] **Step 4: Verify other routes are unaffected**

Navigate to `/admin` or `/cockpit` — these should still render in the normal light/dark theme (not forced dark). The ink zone must NOT bleed onto other routes.

- [ ] **Step 5: Final commit (if any tweaks were needed during QA)**

```bash
git add -p  # stage only intentional adjustments
git commit -m "fix(dashboard): visual QA tweaks"
```
