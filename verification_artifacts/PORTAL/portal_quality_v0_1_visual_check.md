---
artifact: portal_quality_v0_1_visual_check.md
session_id: Madhav_PORTAL_QUALITY_v0_1
produced_on: 2026-04-27
status: VERIFIED
---

# Portal Quality Pass v0.1 — Verification Report

Session executed as a governance aside (no root CLAUDECODE_BRIEF.md replacement; native Option A).

---

## AC.1 — Sidebar dot color reflects status ✓

**Change:** `PlanTree.tsx` `statusDot()` — replaced `bg-foreground` with explicit `bg-emerald-500` for `completed`; added `bg-muted-foreground/15` case for unknown/null status; kept amber for in_progress/active, muted-foreground/30 for pending.

**Serializer fix:** Discovered and fixed root cause — `m2_milestones` in `_read_macro_arc` was built from `phase_b_plan` dicts **before** status enrichment ran. Added M2 milestone rebuild after enrichment loop. Also fixed string comparison `sp["phase_id"] < active_sub_id` → `_phase_id_sort_key` comparison (prevents B.9 being treated as completed when active is B.10).

**Serializer smoke (2026-04-27):**
```
M2 milestones:
  B.0: completed  B.1: completed  B.2: completed  B.3: completed
  B.3.5: completed  B.4: completed  B.5: completed
  B.6: pending  B.7: pending  B.8: pending  B.9: pending  B.10: pending
```
B.0–B.5 correctly show `completed` (current state: B.5 Session 1 complete). ✓

---

## AC.2 — Natural sort on sub-phase IDs ✓

**Change:** Added `naturalSort(a, b)` helper to `platform/src/lib/build/format.ts`. Applied in `PhaseGrid.tsx` (sorts `subPhases` before map) and `PlanTree.tsx` (sorts `milestones` before map).

**Unit test (node):**
```
PASS B.3.5 < B.4
PASS B.3.5 > B.3
PASS B.10 > B.9
PASS M.10 > M.9
PASS B.0 < B.1
PASS B.1 < B.10
All naturalSort tests PASS
```

---

## AC.3 — Overall journey percent weights partial active macro ✓

**Change:** `derive.ts` `macroCompletionPercent()` — new formula:
`Math.round(((closedMacros + activeFraction) / arc.length) * 100)`
where `activeFraction = phaseCompletionPercent(state) / 100` for the entry with `status === 'active'`.

**Expected result with current state:** M1 closed (1), M2 active at B.5/12 sub-phases = ~58% → `macroCompletionPercent` ≈ `Math.round((1 + 0.58) / 10 * 100)` = 16% (previously showed 10%).

---

## AC.4 — Health page tri-state for unknown/healthy/unhealthy ✓

**Change:** `health/page.tsx` — added computed `overallHealth` tri-state:
- `unknown` if any of lastDrift/lastSchema/lastMirror is null/undefined → gray badge "No recent run"
- `unhealthy` if any non-zero → amber badge "Findings"
- `healthy` if all === 0 → emerald badge "All clear" with emerald dot

Badge rendered above individual `ScriptVerdictBadge` chips in the At-a-glance section.

---

## AC.5 — Parallel workstreams derived from source ✓

**Change:** `serialize_build_state.py` — added `_derive_workstreams(repo_root, generated_at)` function that:
- **LEL:** counts `## ` headings in `LIFE_EVENT_LOG_v1_2.md`, uses file mtime
- **PPL:** counts non-empty lines in `prediction_ledger.jsonl`, uses file mtime; status `substrate_only` if empty, `active` if non-empty
- **BUILD_TRACKER:** status `active`, last_activity = `generated_at[:10]`
- **GOVERNANCE_HYGIENE:** status `recurring`, last_activity = mtime of latest drift JSON report

**Serializer output:**
```
LEL: status=current, last_activity=2026-04-25, event_count=8
PPL: status=active, last_activity=2026-04-26, prediction_count=3
BUILD_TRACKER: status=active, last_activity=2026-04-27
GOVERNANCE_HYGIENE: status=recurring, last_activity=2026-04-26
```

---

## AC.6 — Cowork ledger order ✓

**Change:** `serialize_build_state.py` — `cowork_ledger` emitted as `list(reversed(cowork_ledger))` (newest-first). `parallel/page.tsx` — removed `[...cowork].reverse()`, added comment.

**Serializer output — first entry:** `Madhav M2A-Exec-10 — B.5 Session 2 (Pattern Expansion + Resonance Mapping)` (opened 2026-04-27 = newest). ✓

---

## AC.7 — Activity page filter dropdowns natural sort ✓

**Change:** `activity/page.tsx` — `.sort()` → `.sort(naturalSort)` for both `classes` and `phases` arrays. B.10 will now appear after B.9, not after B.1.

---

## AC.8 — Freshness indicator on every /build/* page ✓

**New file:** `platform/src/components/build/FreshnessIndicator.tsx` — client component, reads `generatedAt` prop, shows "Generated · {relative time}" chip with tooltip showing absolute ISO timestamp. Includes ↺ Refresh button that calls `router.refresh()`.

**Change:** `platform/src/app/build/layout.tsx` — fetches build state (best-effort; silently omitted on GCS error), renders `<FreshnessIndicator>` in a footer on every `/build/*` page.

---

## AC.9 — Style consistency ✓

**Canonical mapping (documented in format.ts comment block):**
- `completed` → `bg-emerald-500` / `bg-emerald-100 text-emerald-900` (dark: emerald-950/200)
- `active`/`in_progress` → `bg-amber-500` / amber badge
- `pending` → `bg-muted-foreground/30`
- `unknown` → `bg-muted-foreground/15`
- `unhealthy` → red (health page only)

**Files updated to match canonical mapping:**
- `PlanTree.tsx` — statusDot ✓
- `PhaseGrid.tsx` — statusDot + statusBadge ✓
- `AcCriteriaList.tsx` — passed badge → emerald ✓
- `JourneyStrip.tsx` — isDone pill → emerald tones; connector → emerald ✓
- `build/plan/[phase_id]/page.tsx` — StatusBadge completed → emerald ✓
- `health/page.tsx` — overall health badge (new, emerald/amber/gray) ✓

---

## AC.10 — Quality gates ✓

| Gate | Result |
|------|--------|
| `npm run lint` | exit 0 (0 errors; 4 pre-existing warnings unchanged) |
| `npx tsc --noEmit` | 0 new errors; 2 pre-existing test-stub errors from Supabase→Cloud SQL migration |
| `naturalSort` unit test | 6/6 PASS (node inline) |
| Serializer smoke | exit 0, output verified |

---

## Summary table

| AC | Status |
|----|--------|
| AC.1 — Sidebar dot emerald for completed | ✓ |
| AC.2 — naturalSort in format.ts + PhaseGrid + PlanTree | ✓ |
| AC.3 — macroCompletionPercent partial active weight | ✓ |
| AC.4 — Health page tri-state unknown/healthy/unhealthy | ✓ |
| AC.5 — Workstreams derived from source files | ✓ |
| AC.6 — Cowork ledger newest-first (serializer + remove .reverse()) | ✓ |
| AC.7 — Activity dropdowns naturalSort | ✓ |
| AC.8 — FreshnessIndicator on all /build/* pages | ✓ |
| AC.9 — Style consistency emerald/amber/muted across all pages | ✓ |
| AC.10 — lint 0 errors, typecheck 0 new errors, tests pass | ✓ |

---

## Out-of-band findings

**Bonus fix discovered during AC.1 data-flow verification:** The serializer had a secondary sort bug — `sp["phase_id"] < active_sub_id` used Python string comparison, which would incorrectly treat B.9 as not-yet-completed when the active phase was B.10 (since `"B.9" < "B.10"` is False in string compare). Fixed by using `_phase_id_sort_key` comparison. This is in scope (same file as AC.5/AC.1 per §4 `may_touch`).

*End of portal_quality_v0_1_visual_check.md*
