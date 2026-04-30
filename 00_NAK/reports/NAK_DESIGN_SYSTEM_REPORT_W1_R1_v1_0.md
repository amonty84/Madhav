---
artifact: NAK_DESIGN_SYSTEM_REPORT_W1_R1
version: 1.0
status: COMPLETE
authored_by: Claude Code (NAK W1-R1 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R1
title: Design System Deep Audit — Closure Report
input_from: NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md, NAK_DESIGN_SYSTEM_v1_0.md (DRAFT)
unblocks: W2-R1 (Design System Implementation)
---

# NAK W1-R1 — Design System Deep Audit Closure Report

---

## Preflight Note: Tailwind v4 (CSS-based config)

The project has **no `tailwind.config.ts`**. Tailwind v4 is configured entirely via CSS using the `@theme inline` block in `platform/src/app/globals.css`. This changes the framing for the entire audit:

- Tailwind utility classes like `text-brand-gold` only exist if `--color-brand-gold` appears in the `@theme inline` block.
- The standard shadcn/ui tokens (`--background`, `--foreground`, etc.) are correctly mapped via `--color-background: var(--background)`.
- **Brand tokens and status tokens are NOT mapped** — `text-brand-gold`, `bg-status-warn` etc. do **not** exist as Tailwind utilities in this project's current configuration.
- All "ARBITRARY_TAILWIND" violations referencing brand colours cannot simply be replaced with `text-brand-gold` until Part B's fix (extending `@theme inline`) is applied first in W2-R1.

---

## Part A — Per-file Violation Table

### Severity Key
- **HIGH** — hardcoded hex/oklch bypassing design tokens; MISSING_DARK_MODE
- **MEDIUM** — arbitrary Tailwind colour classes that reference raw values instead of tokens
- **LOW** — inline style colour props; soft Tailwind palette violations

### Admin (`platform/src/components/admin/`) — HIGH severity

The admin module has **zero CSS variable usage**. Every colour is a hardcoded hex literal. The module hardcodes a dark ink-on-gold palette unconditionally — it does not respond to the user's light/dark toggle.

The recurring hex values and their correct token equivalents:

| Hex Literal | Correct Token |
|---|---|
| `#d4af37`, `#f4d160` | `var(--brand-gold)`, `var(--brand-gold-light)` |
| `#fce29a` | `var(--brand-gold-cream)` |
| `#9b834f` | `var(--muted-foreground)` (dark) |
| `#7a5210` | `var(--muted-foreground)` or `var(--brand-gold-deep)` |
| `#0e0b06`, `#0a0805`, `rgba(8,6,3,0.96)` | `var(--brand-ink)` |
| `#211a08`, `#2a2210`, `#3a2c10`, `#1a1509` | `color-mix(in oklch, var(--brand-gold) 15-25%, transparent)` |
| `#6a5830` | `var(--muted-foreground)` (dark, muted) |
| `#1a1409` | `var(--brand-charcoal)` |
| `rgba(212,175,55,0.35)` | `var(--brand-gold-hairline)` |

---

**`admin/styles.ts`** — 24 violations. This is the master palette file for the module.

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 5 | ARBITRARY_TAILWIND | `border-[#2a2210]` | `border-[color-mix(in_oklch,var(--brand-gold)_18%,transparent)]` |
| 5 | ARBITRARY_TAILWIND | `bg-[#0e0b06]` | `bg-[var(--brand-ink)]` |
| 5 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 5 | ARBITRARY_TAILWIND | `placeholder:text-[#6a5830]` | `placeholder:text-muted-foreground` |
| 5 | ARBITRARY_TAILWIND | `focus:border-[#d4af37]` | `focus:border-[var(--brand-gold)]` |
| 5 | ARBITRARY_TAILWIND | `focus:ring-[#d4af37]/20` | `focus:ring-[var(--brand-gold)]/20` |
| 8 | ARBITRARY_TAILWIND | `from-[#f4d160]` | `from-[var(--brand-gold-light)]` |
| 8 | ARBITRARY_TAILWIND | `to-[#a26d0e]` | `to-[var(--brand-gold-deep)]` |
| 8 | ARBITRARY_TAILWIND | `text-[#1a1409]` | `text-[var(--brand-charcoal)]` |
| 8 | ARBITRARY_TAILWIND | `shadow-[0_0_0_1px_rgba(212,175,55,0.5)]` | `shadow-[0_0_0_1px_var(--brand-gold-hairline)]` |
| 11 | ARBITRARY_TAILWIND | `border-[#3a2c10]` | `border-[color-mix(in_oklch,var(--brand-gold)_22%,transparent)]` |
| 11 | ARBITRARY_TAILWIND | `text-[#d4af37]` | `text-[var(--brand-gold)]` |
| 11 | ARBITRARY_TAILWIND | `hover:border-[#d4af37]` | `hover:border-[var(--brand-gold)]` |
| 11 | ARBITRARY_TAILWIND | `hover:text-[#fce29a]` | `hover:text-[var(--brand-gold-cream)]` |
| 17 | ARBITRARY_TAILWIND | `border-[#211a08]` | `border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]` |
| 17 | ARBITRARY_TAILWIND | `bg-[#0a0805]` | `bg-[var(--brand-ink)]` |
| 20 | ARBITRARY_TAILWIND | `border-[rgba(212,175,55,0.35)]` | `border-[var(--brand-gold-hairline)]` |
| 20 | ARBITRARY_TAILWIND | `bg-[rgba(8,6,3,0.96)]` | `bg-[var(--brand-ink)]` |
| 20 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 22 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-[var(--muted-foreground)]` |
| 25 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-[var(--muted-foreground)]` |
| 27 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 29 | ARBITRARY_TAILWIND | `border-[#1a1509]` | `border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)]` |
| 29 | ARBITRARY_TAILWIND | `hover:bg-[#0e0b06]/60` | `hover:bg-[var(--brand-ink)]/60` |

---

**`admin/AdminClient.tsx`** — 2 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 33 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 36 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |

---

**`admin/AdminSignOut.tsx`** — 2 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 18 | ARBITRARY_TAILWIND | `text-[#d4af37]` | `text-[var(--brand-gold)]` |
| 18 | ARBITRARY_TAILWIND | `hover:text-[#fce29a]` | `hover:text-[var(--brand-gold-cream)]` |

---

**`admin/PendingRequestsTable.tsx`** — 7 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 56 | ARBITRARY_TAILWIND | `border-[#211a08]` | `border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]` |
| 57 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 58 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-muted-foreground` |
| 64 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-muted-foreground` |
| 82 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |
| 86 | ARBITRARY_TAILWIND | `text-[#d4af37]` | `text-[var(--brand-gold)]` |
| 87 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |

---

**`admin/UsersTable.tsx`** — 20 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 128 | ARBITRARY_TAILWIND | `border-[#211a08]` | `border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]` |
| 129 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 136 | ARBITRARY_TAILWIND | `border-[#2a2210]` | `border-[color-mix(in_oklch,var(--brand-gold)_18%,transparent)]` |
| 136 | ARBITRARY_TAILWIND | `bg-[#0e0b06]` | `bg-[var(--brand-ink)]` |
| 136 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 136 | ARBITRARY_TAILWIND | `placeholder:text-[#6a5830]` | `placeholder:text-muted-foreground` |
| 136 | ARBITRARY_TAILWIND | `focus:border-[#d4af37]` | `focus:border-[var(--brand-gold)]` |
| 145 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-muted-foreground` |
| 166 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-muted-foreground` |
| 168 | ARBITRARY_TAILWIND | `text-[#d4af37]` | `text-[var(--brand-gold)]` |
| 173 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |
| 174 | ARBITRARY_TAILWIND | `text-[#d4af37]` | `text-[var(--brand-gold)]` |
| 181 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |
| 187 | ARBITRARY_TAILWIND | `border-[#3a2c10]` + `text-[#d4af37]` + `hover:border-[#d4af37]` + `hover:text-[#fce29a]` | see styles.ts tokens above |
| 190 | ARBITRARY_TAILWIND | `bg-[#0e0b06]` + `text-[#fce29a]` | `bg-[var(--brand-ink)]` + `text-[var(--brand-gold-cream)]` |
| 275 | ARBITRARY_TAILWIND | `text-[#7a5210]` | `text-muted-foreground` |
| 283 | ARBITRARY_TAILWIND | `border-[#2a2210]` + `bg-[#0e0b06]` + `text-[#fce29a]` | see styles.ts tokens above |

Note on line 190 `DropdownMenuContent`: this bypasses shadcn's portal theming. Fix should use `className` without `bg-` override or style the dropdown via `--popover` token in the `.dark .consume-shell` scope.

---

**`admin/ApproveDialog.tsx`** — 3 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 58 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 130 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 133 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |

---

**`admin/ConfirmDialog.tsx`** — 2 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 37 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 40 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |

---

**`admin/EditUsernameDialog.tsx`** — 2 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 89 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 92 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |

---

**`admin/NewUserDialog.tsx`** — 2 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 123 | ARBITRARY_TAILWIND | `text-[#fce29a]` | `text-[var(--brand-gold-cream)]` |
| 126 | ARBITRARY_TAILWIND | `text-[#9b834f]` | `text-muted-foreground` |

---

**Admin module — MISSING_DARK_MODE (entire module)**

All admin components hardcode a permanent ink-dark palette. The admin surfaces do not respond to the system or user light/dark toggle. Affected files: all 9 listed above.

**Admin violation count: 64 violations across 9 files.**

---

### Build (`platform/src/components/build/`) — MEDIUM severity

The build module has two categories of violations:

1. **Chart/data visualization palette** (`colors.ts`, chart components): hardcoded hex/oklch for semantic data categories (session types, exit codes, health levels). These serve a specific visualization purpose and cannot be one-to-one mapped to brand tokens. W2-R1 disposition: keep as a `CHART_PALETTE` constant file, but replace values with named CSS variables where the brand palette applies (gold = active/warn, green = success, red = halt).

2. **Component-level** (`InsightCards.tsx`, `CorpusDensityHero.tsx`): arbitrary Tailwind `[oklch(...)]` classes in component JSX that should be replaced with the `bt-status-*` utility classes or status tokens.

---

**`build/colors.ts`** — 24 violations

| Lines | Violation type | Current value | Disposition |
|---|---|---|---|
| 5–10 | HARDCODED_OKLCH | `'oklch(0.78 0.13 145)'` etc. (phase status string values) | Map to `var(--status-success)`, `var(--status-warn)`, `var(--status-halt)`, `var(--muted-foreground)` |
| 14–18 | ARBITRARY_TAILWIND | `bg-[oklch(0.93_0.05_145)]` etc. (phase bg classes) | Map to `bg-[var(--status-success-bg)]`, `bg-[var(--status-warn-bg)]`, `bg-[var(--status-halt-bg)]` |
| 23–27 | ARBITRARY_TAILWIND | `text-[oklch(0.40_0.12_145)]` etc. (phase text classes) | Map to `bt-status-complete`, `bt-status-active`, `bt-status-blocked` utility classes |
| 33–41 | HARDCODED_HEX | `'#3b82f6'` etc. (session type colours) | CHART_PALETTE exception — document as data-viz-only, not brand tokens |
| 55–58 | HARDCODED_HEX | `'#22c55e'`, `'#f59e0b'`, `'#ef4444'`, `'#78716c'` (exit code colour map) | Use `var(--status-success)`, `var(--status-warn)`, `var(--status-halt)`, `var(--muted-foreground)` |
| 63–67 | HARDCODED_HEX | `'#22c55e'`, `'#86efac'`, `'#fbbf24'`, `'#f97316'`, `'#ef4444'` (health exit colors) | Use status tokens for 0/2/4; keep intermediate shades as CHART_PALETTE |

---

**`build/InsightCards.tsx`** — 4 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 15 | ARBITRARY_TAILWIND | `border-[oklch(0.78_0.13_145)]` | `border-[var(--status-success)]` |
| 15 | ARBITRARY_TAILWIND | `bg-[oklch(0.97_0.02_145)]` + dark variants | `bg-[var(--status-success-bg)]` + dark variant |
| 23 | ARBITRARY_TAILWIND | `text-[oklch(0.40_0.12_145)]` | use `bt-status-complete` class |
| 23 | ARBITRARY_TAILWIND | `dark:text-[oklch(0.78_0.13_145)]` | `dark:bt-status-complete` |

---

**`build/CorpusDensityHero.tsx`** — 10 violations

| Lines | Violation type | Current value | Correct token |
|---|---|---|---|
| 39 | INLINE_STYLE_COLOR | `background: item.color` (from colors.ts hex array) | Source from CSS-variable-based palette |
| 51–57 | HARDCODED_HEX | hex arrays for layer/treemap colouring | CHART_PALETTE exception — document as data-viz-only |
| 117 | ARBITRARY_TAILWIND | `bg-[oklch(0.93_0.05_145)] text-[oklch(0.40_0.12_145)]` + dark | Use `bt-status-complete` + `bg-[var(--status-success-bg)]` |
| 127 | ARBITRARY_TAILWIND | `bg-[oklch(0.93_0.05_145)] text-[oklch(0.40_0.12_145)]` | Use `bt-status-complete` + `bg-[var(--status-success-bg)]` |

---

**`build/HealthSparkline.tsx`** — 6 violations

| Lines | Violation type | Current value | Correct token |
|---|---|---|---|
| 6–9 | HARDCODED_HEX | `EXIT_COLORS` map: `'#22c55e'`, `'#86efac'`, `'#fbbf24'`, `'#f97316'` | 0→`var(--status-success)`, 2→`var(--status-warn)`, 4→`var(--status-halt)`; keep 1/3 as CHART_PALETTE |
| 10 | HARDCODED_HEX | `'#ef4444'` (exit 4) | `var(--status-halt)` |
| 14–15 | HARDCODED_HEX | `'#6b7280'` (null), `'#ef4444'` (fallback) | `var(--muted-foreground)`, `var(--status-halt)` |

---

**`build/InterventionFrequency.tsx`** — 3 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 72 | HARDCODED_HEX | `stroke="#f59e0b"` (recharts prop) | Cannot use CSS var in SVG attribute directly — use `stroke={getComputedStyle(document.documentElement).getPropertyValue('--status-warn')}` or move to CHART_PALETTE constant |
| 74 | HARDCODED_HEX | `fill: '#f59e0b'` (recharts label) | Same as above |
| 76 | HARDCODED_HEX | `fill="#ef4444"` (recharts Bar) | Same — should be `var(--status-halt)` resolved at runtime |

**Note on recharts violations:** SVG `stroke`/`fill` attributes cannot use CSS `var()` syntax directly. The correct fix is to resolve the CSS variable at runtime via `getComputedStyle` or to create a hook `useBrandColors()` that returns resolved oklch values. W2-R1 should create this hook.

---

**`build/charts/TrendLine.tsx`** — 4 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 62 | HARDCODED_HEX | `stroke="#fbbf24"` | `var(--status-warn)` resolved via hook |
| 66 | HARDCODED_HEX | `stroke="#6366f1"` | CHART_PALETTE exception (indigo = plan-type colour, not brand) |
| 76 | HARDCODED_HEX | `fill={exitCodeColor[...] ?? '#6366f1'}` | exitCodeColor → status tokens; fallback → `var(--muted-foreground)` |

---

**`build/charts/OnOffPlanDonut.tsx`** — 2 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 16 | HARDCODED_HEX | `color: '#3b82f6'` | CHART_PALETTE exception (on-plan = blue, semantic) |
| 17 | HARDCODED_HEX | `color: '#a855f7'` | CHART_PALETTE exception (off-plan = purple, semantic) |

---

**`build/charts/CadenceArea.tsx`** — 3 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 43 | HARDCODED_HEX | `stopColor="#6366f1"` | CHART_PALETTE exception |
| 44 | HARDCODED_HEX | `stopColor="#6366f1"` | CHART_PALETTE exception |
| 62 | HARDCODED_HEX | `stroke="#6366f1"` | CHART_PALETTE exception |

**Build violation count: 52 violations across 8 files (28 remediable via tokens; 24 CHART_PALETTE exceptions).**

---

### Consume (`platform/src/components/consume/`) — MEDIUM severity

**`consume/TraceDrawer.tsx`** — 4 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 23 | ARBITRARY_TAILWIND | `bg-[#0d1117]` | `bg-[var(--brand-ink)]` |
| 23 | ARBITRARY_TAILWIND | `border-l border-slate-800` | `border-l border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]` |
| 25 | ARBITRARY_TAILWIND | `bg-[#161b27]` | `bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]` |
| 25 | ARBITRARY_TAILWIND | `border-b border-slate-800` | `border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]` |

Note: `TraceDrawer` wraps `TracePanel` — see HIGH-severity finding F-DS-6 below.

---

### Audit (`platform/src/components/audit/`) — LOW severity

**`audit/AuditBadge.tsx`** — soft violations

| Line | Violation type | Current value | Assessment |
|---|---|---|---|
| 4–8 | ARBITRARY_TAILWIND | `bg-rose-100 text-rose-700` etc. (tier badge colours) | Intentional semantic colours per disclosure tier. Not brand tokens. Acceptable IF documented as a design decision. However, dark mode variants are provided (`dark:bg-*`), so MISSING_DARK_MODE does not apply. Recommendation: document in design system as "tier colour exception". |
| 7 | ARBITRARY_TAILWIND | `bg-slate-100 text-slate-600` (public_redacted tier) | Same — acceptable semantic exception. |

The `QueryClassBadge` uses `violet-`, `purple-`, `sky-`, `orange-`, `zinc-` colours. Same assessment: intentional semantic category colours, not brand token violations, but should be documented as exceptions.

---

### Profile (`platform/src/components/profile/`) — LOW severity

The profile components use CSS variable references (acceptable) but sometimes pair them with hex fallbacks that duplicate the token value. The hex fallbacks create a maintenance surface.

**`profile/RoomCard.tsx`** — 5 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 25 | ARBITRARY_TAILWIND | `bg-[color-mix(in_oklch,var(--brand-charcoal,_#0d0a05)_94%,...)]` | Drop hex fallback — token is defined; use `var(--brand-charcoal)` directly |
| 32 | INLINE_STYLE_COLOR | `style={{ color: 'var(--brand-gold-cream, #fce29a)' }}` | Drop hex fallback: `style={{ color: 'var(--brand-gold-cream)' }}` |
| 37 | INLINE_STYLE_COLOR | `style={{ color: 'var(--brand-gold)', opacity: 0.6 }}` | Acceptable — CSS var used correctly; no token violation |
| 51 | INLINE_STYLE_COLOR | `style={{ color: 'var(--brand-gold)' }}` | Acceptable |
| 59 | INLINE_STYLE_COLOR | `style={{ color: 'var(--brand-gold)' }}` | Acceptable |

**`profile/ProfileSideRail.tsx`** — 3 violations

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 28 | INLINE_STYLE_COLOR | `background: 'color-mix(in oklch, var(--brand-charcoal, #0d0a05) 96%,...)'` | Drop hex fallback on `--brand-charcoal` |
| 37 | INLINE_STYLE_COLOR | `borderColor: 'color-mix(in oklch, var(--brand-gold) 15%, transparent)'` | Acceptable — no violation |
| 79 | INLINE_STYLE_COLOR | `color: 'var(--brand-gold-cream, #fce29a)'` | Drop hex fallback |

**`profile/DashaCountdown.tsx`** — 1 violation

| Line | Violation type | Current value | Correct token |
|---|---|---|---|
| 39 | INLINE_STYLE_COLOR | `style={{ color: 'var(--brand-gold-cream, #fce29a)' }}` | Drop hex fallback |

**Profile violation count: 5 violations (3 hex fallback removals; 2 acceptable inline style usages).**

---

### NEW FINDING: Trace (`platform/src/components/trace/`) — HIGH severity

This is the largest single source of violations discovered in W1-R1. `TracePanel.tsx` is a 800-line component that uses GitHub's `slate-*` dark palette throughout, with zero brand token usage. Not covered in W0 because the directory is `trace/`, not in the original six audit dirs.

**`trace/TracePanel.tsx`** — 50+ violations

Pattern: the entire component uses `slate-{500,600,700,800,900}` as surface/text/border colours + `bg-[#0d1117]` and `bg-[#161b27]` as the panel backgrounds.

Representative violations (full line audit would replicate the entire file):

| Lines | Violation type | Current value | Correct token |
|---|---|---|---|
| 31, 39, 49 | ARBITRARY_TAILWIND | `bg-slate-700`, `bg-slate-500`, `text-slate-300/400` | `bg-[var(--brand-ink)]`, `text-[var(--brand-gold-cream)]`, `text-muted-foreground` |
| 101 | ARBITRARY_TAILWIND | `bg-slate-900 border-slate-700 text-slate-500` | brand-ink surface tokens |
| 110–111 | ARBITRARY_TAILWIND | `hover:bg-slate-800/60`, `bg-slate-800 border-l-blue-500` | `hover:bg-[var(--brand-ink)]/60`; gold left-border accent |
| 172–175 | ARBITRARY_TAILWIND | `border-slate-700/60`, `bg-slate-800/40` | brand-ink + gold-hairline border |
| 701, 803 | ARBITRARY_TAILWIND | `bg-[#161b27]` | `bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]` |
| 802 | ARBITRARY_TAILWIND | `bg-[#0d1117]` | `bg-[var(--brand-ink)]` |

**Trace violation count: 50+ violations in 1 file.**

**Action: W2-R1 must scope `TracePanel.tsx` as a separate remediation sub-task. Full sweep required.**

---

### Newly discovered out-of-scope violations (informational — not W1-R1 scope)

The following were found during the sweep. W1-R1 does not own them but they are documented for W2 planning:

| File | Violation | Notes |
|---|---|---|
| `chat/ConversationSidebar.tsx:285` | `border-[oklch(0.5_0.18_25)]/40` | Should be `border-[var(--status-halt)]/40` |
| `disclosure/DisclosureTierBadge.tsx:46` | `bg-slate-100/80 text-slate-700 border-slate-200/60` | Same assessment as AuditBadge — semantic tier colour |
| `globals.css:355–358` | `bt-status-complete/active/blocked` use hardcoded `oklch()` literals | Should reference `var(--status-success)`, `var(--status-warn)`, `var(--status-halt)` — see F-DS-9 |

---

## Part B — Tailwind Config Audit

### Configuration Model

The project uses **Tailwind v4 CSS-based configuration**. There is no `tailwind.config.ts`. Configuration is entirely in `platform/src/app/globals.css` via the `@theme inline` block.

### Tokens Correctly Mapped as Tailwind Utilities

The `@theme inline` block maps all standard shadcn/ui tokens:

| `@theme` mapping | Enabled Tailwind utility |
|---|---|
| `--color-background: var(--background)` | `bg-background`, `text-background` |
| `--color-foreground: var(--foreground)` | `text-foreground` |
| `--color-primary: var(--primary)` | `bg-primary`, `text-primary` |
| `--color-muted: var(--muted)` | `bg-muted` |
| `--color-muted-foreground: var(--muted-foreground)` | `text-muted-foreground` |
| `--color-destructive: var(--destructive)` | `text-destructive`, `border-destructive` |
| `--color-border: var(--border)` | `border-border` |
| `--color-ring: var(--ring)` | `ring-ring` |
| `--color-sidebar-*: var(--sidebar-*)` | `bg-sidebar`, `text-sidebar-foreground`, etc. |

### Brand Tokens — NOT Available as Tailwind Utilities

The following tokens are defined in `@theme inline` or `:root` **without the `--color-` prefix**, so they generate **no Tailwind utility classes**:

| Missing mapping | Token defined in | Would enable |
|---|---|---|
| `--color-brand-gold` | `@theme inline` | `text-brand-gold`, `bg-brand-gold`, `border-brand-gold` |
| `--color-brand-gold-light` | `@theme inline` | `text-brand-gold-light` etc. |
| `--color-brand-gold-deep` | `@theme inline` | `text-brand-gold-deep` etc. |
| `--color-brand-gold-cream` | `@theme inline` | `text-brand-gold-cream` etc. |
| `--color-brand-charcoal` | `@theme inline` | `text-brand-charcoal`, `bg-brand-charcoal` |
| `--color-brand-ink` | `@theme inline` | `bg-brand-ink` |
| `--color-brand-vellum` | `@theme inline` | `bg-brand-vellum` |
| `--color-brand-cream` | `:root` | `bg-brand-cream` |
| `--color-status-warn` | `:root` | `text-status-warn`, `bg-status-warn` |
| `--color-status-halt` | `:root` | `text-status-halt` |
| `--color-status-info` | `:root` | `text-status-info` |
| `--color-status-success` | `:root` | `text-status-success` |
| `--color-status-warn-bg` | `:root` | `bg-status-warn-bg` |
| `--color-status-halt-bg` | `:root` | `bg-status-halt-bg` |
| `--color-status-info-bg` | `:root` | `bg-status-info-bg` |
| `--color-status-success-bg` | `:root` | `bg-status-success-bg` |

**Fix for W2-R1:** Add the following to `@theme inline` in `globals.css`:

```css
/* Brand color utilities */
--color-brand-gold:        var(--brand-gold);
--color-brand-gold-light:  var(--brand-gold-light);
--color-brand-gold-deep:   var(--brand-gold-deep);
--color-brand-gold-cream:  var(--brand-gold-cream);
--color-brand-charcoal:    var(--brand-charcoal);
--color-brand-ink:         var(--brand-ink);
--color-brand-vellum:      var(--brand-vellum);
--color-brand-cream:       var(--brand-cream);

/* Status color utilities */
--color-status-warn:       var(--status-warn);
--color-status-halt:       var(--status-halt);
--color-status-info:       var(--status-info);
--color-status-success:    var(--status-success);
--color-status-warn-bg:    var(--status-warn-bg);
--color-status-halt-bg:    var(--status-halt-bg);
--color-status-info-bg:    var(--status-info-bg);
--color-status-success-bg: var(--status-success-bg);
```

After this fix, components can use `text-brand-gold`, `bg-brand-ink`, `text-status-warn` etc. as clean Tailwind utilities instead of `text-[var(--brand-gold)]` arbitrary classes.

**Note:** This fix must be applied in W2-R1 BEFORE the arbitrary-class violations in components are remediated. It is the unblocking prerequisite.

---

## Part C — shadcn/ui Variant Audit

### Button (`platform/src/components/ui/button.tsx`)

CVA variants defined:
- `variant`: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
- `size`: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

Usage count across `platform/src/` (explicit `variant=` prop only):

| Variant | Count | Verdict |
|---|---|---|
| `ghost` | 6 | USED |
| `destructive` | 4 | USED |
| `outline` | 2 | USED |
| `default` | 1 explicit + all defaultVariants | USED |
| `secondary` | 0 explicit | LOW USAGE — used via default only |
| `link` | 0 explicit | ZERO USAGE — removal candidate |

Size usage: no explicit size props found in grep; all components use defaultVariant `size="default"`.

**`secondary` verdict:** Defined for completeness but never explicitly invoked. Not a clear removal candidate since it's a standard shadcn primitive — keep.

**`link` verdict:** Zero explicit usages. Candidate for removal in W2-R3 component clean-up.

---

### Badge (`platform/src/components/ui/badge.tsx`)

CVA variants defined: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`

Usage count:

| Variant | Count | Verdict |
|---|---|---|
| `secondary` | 2 | USED |
| `outline` | 1 | USED |
| `destructive` | 1 | USED |
| `default` | 1 explicit + defaultVariants | USED |
| `ghost` | 0 explicit | ZERO USAGE — removal candidate |
| `link` | 0 explicit | ZERO USAGE — removal candidate |

**`ghost` + `link` verdict:** Both are zero-usage. Candidates for removal in W2-R3.

---

### Tabs (`platform/src/components/ui/tabs.tsx`)

CVA variants defined on `TabsList`: `default`, `line`

Usage: `line` variant has **zero explicit usages** found in `platform/src/`. Only `Tabs` with default layout is used (1 instance, in the audit filter surface).

**`line` verdict:** Zero usage — removal candidate.

---

### DropdownMenu (`platform/src/components/ui/dropdown-menu.tsx`)

Variant defined on `DropdownMenuItem`: `default`, `destructive`

Both variants used — `destructive` appears in admin menus.

---

### Components without CVA

No variants to audit: `alert-dialog.tsx`, `avatar.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `scroll-area.tsx`, `separator.tsx`, `sheet.tsx`, `sonner.tsx`.

---

## Part D — .brand-card Audit

### Current State

`.brand-card` is defined in `globals.css` (lines 182–186):
```css
.brand-card {
  border: 1px solid color-mix(in oklch, var(--brand-gold) 25%, transparent);
  background: color-mix(in oklch, var(--brand-ink) 92%, transparent);
  backdrop-filter: blur(8px);
}
```

**`.brand-card` is applied in zero component or page files across `platform/src/`.** It is dead CSS.

### .brand-cta Usage (companion utility)

`.brand-cta` is active — 3 usages:

| File | Line | Usage |
|---|---|---|
| `chat/Composer.tsx` | 233 | Send button (gold gradient CTA) |
| `consume/ValidatorFailureView.tsx` | 111 | Re-submit CTA after validator failure |
| `consume/SharedConsumeError.tsx` | 23 | Error-state CTA (navigate/retry) |

### Recommendation

**`.brand-card`: deprecate.** It was authored in anticipation of card surfaces using the ink+gold aesthetic, but all current card-like surfaces either use `className="bg-[var(--brand-ink)] ..."` directly or the `.consume-shell` theme zone. No consumer needs `.brand-card` as a utility class today.

**Action (W2-R1):** Remove `.brand-card` from `globals.css`. If the ink-card aesthetic is needed in future, implement it as a shadcn `Card` with `data-variant="brand"` prop, styled via the token layer.

**`.brand-cta`: retain.** It is actively used and represents a compound visual treatment (3-stop gradient + shadow + focus ring) that is genuinely easier as a utility class than as a CVA variant.

---

## Prioritised Fix List for W2-R1

### Priority 1 — Must fix before other fixes (unblocking)

1. **Add `--color-brand-*` and `--color-status-*` mappings to `@theme inline` in `globals.css`** — this enables `text-brand-gold` etc. as valid Tailwind utilities. Every subsequent fix depends on this.

### Priority 2 — Mechanical, high-impact (admin module)

2. **Migrate `admin/styles.ts`** — replace 24 hardcoded hex literals with CSS variable references. All downstream components that import from `styles.ts` will benefit automatically.
3. **Sweep remaining admin components** — after `styles.ts` is clean, remaining inline violations in `AdminClient.tsx`, `AdminSignOut.tsx`, `PendingRequestsTable.tsx`, `UsersTable.tsx`, `ApproveDialog.tsx`, `ConfirmDialog.tsx`, `EditUsernameDialog.tsx`, `NewUserDialog.tsx` should be swept in one pass.
4. **Add dark mode responsiveness to admin module** — wrap admin surfaces in the standard dark mode classes so the light-mode palette functions correctly.

### Priority 3 — High-impact new finding (trace module)

5. **Migrate `trace/TracePanel.tsx`** — full sweep of 50+ `slate-*` violations; replace with brand-ink surface tokens.
6. **Migrate `consume/TraceDrawer.tsx`** — 4 violations; aligns with TracePanel work.

### Priority 4 — Build module chart violations

7. **Create `useBrandColors()` hook** — resolves CSS variables at runtime for recharts SVG props. Required before chart color violations can be fixed.
8. **Migrate `build/colors.ts` status palette** — replace phase status oklch strings with `var(--status-*)` references. Keep session-type and plan-type hex values as documented CHART_PALETTE exceptions.
9. **Migrate `build/InsightCards.tsx` and `build/CorpusDensityHero.tsx`** — replace `[oklch(...)]` classes with `bt-status-*` utility classes.

### Priority 5 — Low-impact cleanup

10. **Fix `bt-status-complete/active/blocked` in `globals.css`** — replace hardcoded `oklch()` literals with `var(--status-*)` references.
11. **Remove `.brand-card` from `globals.css`**.
12. **Remove hex fallbacks from `profile/` components** — `RoomCard.tsx`, `ProfileSideRail.tsx`, `DashaCountdown.tsx`.
13. **Remove zero-usage variants** — `Button:link`, `Badge:ghost`, `Badge:link`, `TabsList:line` (W2-R3 scope).

### Priority 6 — Design decisions requiring native review

14. **`audit/AuditBadge.tsx` semantic tier colours** — document as TIER_COLOUR_EXCEPTION in design system or migrate to status token scale.
15. **Admin dark-mode-only constraint** — confirm with native: should admin be light-mode-aware, or intentionally always dark (ink palette)?

---

## Totals

| Directory | Severity | Violations |
|---|---|---|
| `admin/` (9 files) | HIGH | 64 |
| `trace/TracePanel.tsx` | HIGH (new) | 50+ |
| `build/` (8 files) | MEDIUM | 52 (28 token-fixable + 24 CHART_PALETTE) |
| `globals.css` meta | MEDIUM | 4 (bt-status-* + missing @theme mappings) |
| `consume/TraceDrawer.tsx` | MEDIUM | 4 |
| `profile/` (3 files) | LOW | 5 |
| `audit/AuditBadge.tsx` | LOW (soft) | 2 (design decision, not strict violation) |
| **Total** | | **181+ (161 token-fixable; 24 CHART_PALETTE; 2 design-decision)** |

---

*End of NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md v1.0*
