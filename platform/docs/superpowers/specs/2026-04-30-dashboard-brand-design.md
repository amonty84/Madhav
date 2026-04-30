# Dashboard Brand Design — Spec

**Date:** 2026-04-30  
**Status:** Approved  
**Scope:** Apply the MARSYS-JIS brand design system (Ink Immersion + Mandala) to the admin dashboard roster view.

---

## Goal

The login page establishes a strong brand identity: deep ink background, Mandala backdrop, gold palette, serif headings, uppercase action labels. The dashboard currently uses generic shadcn/Tailwind defaults and shares no visual language with it. This spec describes applying the design system consistently across all dashboard components so the experience feels unified from login through to the operator workspace.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Theme forcing | `ZoneRoot zone="ink"` in **dashboard layout only** | Dashboard is always the operator's tool; scoped to layout so shared `AppShell` is not affected |
| Mandala | Present at ~13% opacity + radial vignette | Atmospheric without competing with data; matches login treatment |
| Page title ornament | Devanagari dandas `॥` as **inline JSX text** flanking "Roster" | `bt-devanagari-rule` class is restricted to the Welcome H2 by CSS comment; dandas inlined directly |
| Typography | `bt-display` title, `bt-heading` card names, `bt-num` build %, `bt-label` metadata | Uses the 5-step scale already defined in globals.css |
| Primary action | `brand-cta` class on "+ New Client" | Matches login sign-in button treatment |
| Card surface | Translucent ink fill + gold border (matches `.brand-card`) | Consistent with the consume shell card treatment |
| Progress bar | 2px gold gradient fill on a dark track | Surfaced data density with zero clutter |

---

## Files to Change

### 1. `src/app/dashboard/layout.tsx`

Wrap the `AppShell` return in `ZoneRoot zone="ink"`. This scopes the `dark` class and `zone-ink` to the dashboard route only — admin, cockpit, build, and consume routes that also use `AppShell` are unaffected.

```tsx
// Before
return (
  <AppShell user={ctx.user} profile={ctx.profile} breadcrumb={[{ label: 'Roster', current: true }]}>
    {children}
  </AppShell>
)

// After
return (
  <ZoneRoot zone="ink" className="h-[100dvh]">
    <AppShell user={ctx.user} profile={ctx.profile} breadcrumb={[{ label: 'Roster', current: true }]}>
      {children}
    </AppShell>
  </ZoneRoot>
)
```

Import `ZoneRoot` from `@/components/shared/ZoneRoot`. **Keep `h-[100dvh]` on `AppShell`'s own wrapper div** — `h-[100dvh]` is viewport-absolute and would collapse the shell if removed. The `className="h-[100dvh]"` on `ZoneRoot` is cosmetic/optional; `AppShell`'s own sizing is authoritative.

**`src/components/shared/AppShell.tsx` — no change required.**

---

### 2. `src/components/shared/AppShellBreadcrumb.tsx`

Replace `bg-background border-border` with the ink-tinted bar style matching the consume shell header.

- Background: `bg-[rgba(8,5,2,0.5)]`
- Border: `border-[rgba(212,175,55,0.12)]`
- Active segment text: `text-[#fce29a]`
- Inactive segments: `text-[rgba(212,175,55,0.45)]`
- Separator dots: `text-[rgba(212,175,55,0.2)]`

---

### 3. `src/components/shared/AppShellRail.tsx`

The sigil link already uses `text-[var(--brand-gold)]`. Adjust:

- Active nav item: `bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.22)] text-[#d4af37]`  
  (replaces `bg-sidebar-accent text-sidebar-accent-foreground`)
- Inactive nav items: `text-[rgba(212,175,55,0.28)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]`
- Avatar trigger: `border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.07)] text-[rgba(212,175,55,0.6)] hover:bg-[rgba(212,175,55,0.12)]`

---

### 4. `src/app/dashboard/page.tsx`

Replace the plain container wrapper with a brand-immersive layout:

- Outer wrapper: `relative min-h-full overflow-hidden` — positions the Mandala and vignette
- Mandala: `<Mandala size={560} opacity={0.13} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />`
- Vignette overlay: `<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_25%,rgba(2,2,1,0.5)_65%,rgba(2,2,1,0.88)_100%)]" />`
- Content div: `relative z-10 py-8 px-4 container mx-auto`
- Page heading: `<h1 className="bt-display text-[#fce29a] mb-6"><span className="opacity-55 text-[#d4af37] font-serif mr-1">॥</span>Roster<span className="opacity-55 text-[#d4af37] font-serif ml-1">॥</span></h1>` — dandas inlined as JSX spans, **not** `bt-devanagari-rule` (that class is reserved for the Welcome H2 per the CSS comment in globals.css)
- "+ New Client" button: replace `buttonVariants()` with `brand-cta` class directly on the `<Link>`

---

### 5. `src/components/dashboard/RosterStatsRibbon.tsx`

Replace the muted ribbon surface with a `brand-card` treatment:

- Container: `brand-card rounded-lg px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm` (drop `bg-muted/40 border-border`)
- Stat numbers: `font-semibold tabular-nums text-[#d4af37]`
- Stat labels: `text-[rgba(212,175,55,0.5)]`
- Separator dots: `text-[rgba(212,175,55,0.2)] select-none`
- Clickable numbers: add `hover:text-[#fce29a] hover:brightness-110 transition-colors`

---

### 6. `src/components/dashboard/RosterFilters.tsx`

Apply the login-form input treatment to all filter controls:

**Search input and selects:**
```
bg-[rgba(8,6,3,0.7)] border border-[rgba(212,175,55,0.2)] text-[#fce29a] 
placeholder:text-[#6a5830] rounded-md px-3 text-sm
focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20
```

**Disabled dasha select:** add `opacity-40 cursor-not-allowed`

**View toggle:** Replace `bg-muted` container with login tab-toggle style:
```
flex h-8 items-center rounded-[8px] border border-[rgba(212,175,55,0.2)] 
bg-[rgba(8,6,3,0.6)] p-[3px] text-sm
```
Active button:
```
rounded-[5px] bg-gradient-to-b from-[#3a2c10] to-[#241a07] 
font-medium uppercase tracking-[0.06em] text-[#fce29a] 
shadow-[inset_0_0_0_1px_rgba(212,175,55,0.25)]
```
Inactive button:
```
rounded-[5px] font-medium uppercase tracking-[0.06em] 
text-[rgba(212,175,55,0.35)] hover:text-[#fce29a] transition-colors
```

**Slider label and range input:** `text-[rgba(212,175,55,0.45)] text-sm` + `accent-[#d4af37]`

---

### 7. `src/components/dashboard/ClientCard.tsx`

Replace shadcn `Card/CardHeader/CardContent` with a custom brand surface:

**Card wrapper:**
```
brand-card rounded-xl p-4 flex flex-col gap-3 
hover:border-[rgba(212,175,55,0.35)] transition-colors
```

**Name row:**
- Name: `bt-heading text-[#fce29a]`
- Health dot: keep `bg-emerald-500` / `bg-amber-400` — add `shadow-[0_0_4px_currentColor]`

**Build percentage:** `bt-num text-[#d4af37]` with `%` in muted gold at smaller size

**Progress bar** (new): 2px track `bg-[rgba(212,175,55,0.1)] rounded-full`, fill `bg-gradient-to-r from-[#a26d0e] to-[#f4d160]` width = `pyramidPercent%`

**Metadata:** `bt-label` with inline `style={{ color: 'rgba(212,175,55,0.42)' }}` — same reason as table headers; `.bt-label` color must be overridden with inline style

**Moment phrase:** `text-[rgba(212,175,55,0.3)] text-xs truncate`

**Remove** shadcn `Badge` — the build % displayed as `bt-num` is sufficient.

**Action buttons:**
- Primary (Profile): `brand-cta text-xs rounded-md px-3 py-1.5 flex-1`
- Ghost (Build / Consume): `border border-[rgba(212,175,55,0.22)] bg-transparent text-[rgba(212,175,55,0.55)] text-xs font-semibold uppercase tracking-[0.08em] rounded-md px-3 py-1.5 hover:text-[#fce29a] hover:border-[rgba(212,175,55,0.4)] transition-colors`

---

### 8. `src/components/dashboard/RosterTableView.tsx`

- Outer wrapper: `overflow-x-auto rounded-lg border border-[rgba(212,175,55,0.15)]`
- `thead`: `bg-[rgba(8,6,3,0.6)]`
- Header cells: `bt-label bt-label-upper px-3 py-2` with an inline `style={{ color: 'rgba(212,175,55,0.45)' }}` — `.bt-label` sets `color: var(--color-muted-foreground)` directly in CSS which takes precedence over Tailwind `text-[...]` utilities; use inline style to guarantee the gold override wins
- Sort buttons: `hover:text-[#d4af37] transition-colors`
- Row hover: `hover:bg-[rgba(212,175,55,0.04)]`
- Row divider: `divide-[rgba(212,175,55,0.1)]`
- Name cell: `text-[#fce29a] font-medium`
- Birth cell: `text-[rgba(212,175,55,0.6)]` primary, `text-[rgba(212,175,55,0.38)]` secondary
- Build % cell: `tabular-nums text-[#d4af37] font-semibold`
- Last activity: `text-[rgba(212,175,55,0.42)]`
- Action buttons: same ghost style as ClientCard

---

### 9. `src/components/dashboard/RosterEmptyWizard.tsx`

- Container: add `bg-[radial-gradient(ellipse_at_50%_50%,rgba(13,10,5,0.4)_0%,rgba(2,2,1,0.9)_100%)] rounded-xl border border-[rgba(212,175,55,0.15)]`
- Mandala `opacity`: raise to `0.22`
- Heading: `bt-heading text-[#fce29a]`
- Body text: `text-[rgba(212,175,55,0.45)]`
- CTA button: replace `buttonVariants({ size: 'lg' })` with `brand-cta text-sm rounded-lg px-6 py-3`

---

## What Does NOT Change

- The `Mandala` component itself — used as-is
- The `brand-cta`, `brand-card`, `bt-*` CSS class definitions in `globals.css` — consumed, not modified
- The `ZoneRoot` component — used as-is
- The sidebar sigil gold treatment — already correct
- All logic, data fetching, routing, filter state — untouched

---

## Acceptance Criteria

1. Dashboard shell forces dark/ink mode regardless of system theme preference
2. Mandala renders centered in the content area at ~13% opacity with radial vignette
3. Page title "Roster" displays in serif with `॥` dandas flanking it
4. "+ New Client" uses the gold gradient `brand-cta` treatment
5. Stats ribbon uses `brand-card` surface with gold numbers
6. Each `ClientCard` shows: serif name, `bt-num` build %, 2px progress bar, gold ghost action buttons
7. Filter inputs have ink background + gold focus ring
8. View toggle matches the login tab-toggle visual style
9. Table view has ink background, gold hairline dividers, `bt-label-upper` headers
10. Empty wizard gets ink surface and gold CTA
11. No logic, routing, or data-fetching changes
12. TypeScript compiles without errors
