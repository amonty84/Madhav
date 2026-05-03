---
artifact: NAK_EXEC_BRIEF_W1_R1_DESIGN
version: 1.0
status: AUTHORED
authored_by: Claude Code (NAK W0 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R1
title: Design System Deep Audit
scope: platform/src/app/globals.css, platform/src/components/ui/**, platform/src/components/brand/**, tailwind.config.ts (read-only)
parallelizable_with: [W1-R2, W1-R3]
gate: W0 (must be closed before W1-R1 starts)
input_from: NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md Part A + NAK_DESIGN_SYSTEM_v1_0.md §6
---

# NAK W1-R1 — Design System Deep Audit Exec Brief

## §1 — Purpose

W0 produced a shallow token compliance table (16 dirs, ✅/⚠️/❌ ratings) and a design system draft that documents current state at high level. W1-R1 goes deep on the design system specifically: it reads every file in the compliance-flagged dirs, documents every violation precisely (file + line), and populates `NAK_DESIGN_SYSTEM_v1_0.md §6` with actionable findings that W2-R1 can fix mechanically.

W1-R1 makes **zero code changes**. It reads and documents.

## §2 — Scope

```yaml
may_touch:
  - platform/src/app/globals.css           # read
  - platform/src/components/ui/**          # read
  - platform/src/components/brand/**       # read
  - platform/src/components/admin/**       # read (HIGH severity — full sweep)
  - platform/src/components/build/**       # read (MEDIUM severity — full sweep)
  - platform/src/components/dashboard/**   # read (MEDIUM severity)
  - platform/src/components/consume/**     # read (MEDIUM severity)
  - platform/src/components/audit/**       # read (LOW severity)
  - platform/src/components/profile/**     # read (LOW severity)
  - tailwind.config.ts                     # read
  - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md      # populate §6 findings + §5 shadcn gaps

must_not_touch:
  - platform/src/**/*.tsx                  # AUDIT ONLY — no code changes
  - platform/src/**/*.ts                   # AUDIT ONLY
  - platform/src/**/*.css                  # AUDIT ONLY
  - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md    # W1-R2 territory
  - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md    # W1-R3 territory
  - 00_ARCHITECTURE/**
```

## §3 — Acceptance Criteria

### AC-1: Violation register committed

File: `00_NAK/reports/NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md`

The report must contain:

**Part A — Per-file violation table**

Walk every file in `admin/`, `build/`, `dashboard/`, `consume/`, `audit/`, `profile/` (the non-✅ dirs from W0). For each violation, record:

```
file | line(s) | violation_type | current_value | correct_token | severity
```

Violation types:
- `HARDCODED_HEX` — literal hex colour (#d4af37, #0e0b06, etc.)
- `HARDCODED_OKLCH` — inline `oklch(...)` literal that should be a CSS variable
- `ARBITRARY_TAILWIND` — `text-[#...]`, `bg-[oklch(...)]` arbitrary Tailwind values
- `INLINE_STYLE_COLOR` — `style={{ color: "..." }}` inline style props for colour
- `MISSING_DARK_MODE` — component sets colours that won't respond to dark mode

**Part B — Tailwind config audit**

Read `tailwind.config.ts` in full. Document:
- Which brand tokens are correctly extended into Tailwind (e.g., `brand-gold: 'var(--brand-gold)'`)
- Which brand tokens are missing from the Tailwind extension (i.e., you can't use `text-brand-gold` without them)
- Whether the semantic tokens (`bg-background`, `text-foreground`) are correctly mapped

**Part C — shadcn/ui variant audit**

Read every file in `platform/src/components/ui/`. For each component:
- List all CVA variants defined
- List which variants are actually used (grep import sites)
- Flag variants with 0 usages as removal candidates

**Part D — .brand-card audit**

Read all usages of `.brand-card` class across `platform/src/`. Document:
- Every file that applies `.brand-card`
- Whether that usage should be migrated to a `Card` variant or retained as-is
- Recommendation: deprecate `.brand-card` in favour of `data-variant="brand"` on the shadcn Card, or keep as utility

### AC-2: NAK_DESIGN_SYSTEM_v1_0.md §6 populated

The W0 DRAFT findings (F-DS-1 through F-DS-5) must be fleshed out with:
- Exact file + line counts for each finding
- Concrete "fix action" per finding (which token replaces which literal)
- Any new findings discovered during the deep audit (F-DS-6+)

### AC-3: W1-R1 closure row in NAK_TRACKER updated

`00_NAK/NAK_TRACKER_v1_0.md` §3 W1-R1 row:
- `status: closed`
- `session_id`: set
- `closed_at`: set

## §4 — Suggested Work Sequence

1. Read `tailwind.config.ts` first — this tells you which tokens can already be used as Tailwind classes vs which require `var(...)` inline.
2. Sweep `admin/` first (HIGH severity, densest violations). Build the per-file violation table as you go.
3. Sweep `build/`, `dashboard/`, `consume/`, `audit/`, `profile/` (MEDIUM/LOW).
4. Sweep `ui/` for variant audit.
5. Grep for `.brand-card` usages and document the migration recommendation.
6. Populate `NAK_DESIGN_SYSTEM_v1_0.md §6` with concrete findings.
7. Write the closure report. Update the tracker row.

## §5 — Key Files from W0

These files contain the most violations and should be read in full:

**admin/ (HIGH):**
- `platform/src/components/admin/UsersTable.tsx`
- `platform/src/components/admin/styles.ts` (or equivalent)
- `platform/src/components/admin/ApproveDialog.tsx`
- `platform/src/components/admin/NewUserDialog.tsx`

**build/ (MEDIUM — sample):**
- `platform/src/components/build/BuildHeader.tsx`
- `platform/src/components/build/CockpitGrid.tsx`
- `platform/src/components/build/DashaCountdown.tsx`

**consume/ (MEDIUM — .consume-shell scope):**
- `platform/src/components/consume/ConsumeChat.tsx`
- `platform/src/components/consume/PanelAnswerView.tsx`

## §6 — Output Files

| File | Status at close |
|---|---|
| `00_NAK/reports/NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md` | COMPLETE |
| `00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` | version bump to 1.1 with populated §6 |

---

*End of NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md*
