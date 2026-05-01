---
artifact_id: NAK_VISION
version: 1.0
status: CURRENT
authored_by: Cowork (Opus)
authored_at: 2026-04-30
owner: Abhisek Mohanty
project: NAK — Nakula
project_abbrev: NAK
scope: platform/src/ — all UI surfaces, API routes, hooks, components, design system
relates_to:
  - CLAUDE.md (project master instructions, KARN workstream)
  - 00_ARCHITECTURE/PORTAL_REDESIGN_VISION_v1_0.md (prior UX vision — NAK inherits its gains)
  - platform/src/app/globals.css (design system root)
  - platform/src/components/ (entire component library)
parallel_to: KARN (M2 Corpus Activation — Jyotish instrument workstream)
supersedes: none
---

# Project Nakula — NAK Vision v1.0
## "Make it unbreakable. Make it coherent. Make it feel like one instrument."

---

## §1 — Mission

The Portal Redesign workstream (R0–R7) composed the right surfaces. Project NAK hardens them.

Where the Portal Redesign asked *"what should exist?"*, NAK asks *"does what exists actually work — reliably, correctly, and as one coherent system?"*

NAK is a robustness and coherence programme across the entire `platform/src/` codebase. It operates in parallel to KARN (the Jyotish corpus M2 workstream), touching only the portal layer. It does not introduce new surfaces, does not change the data model, and does not alter any API contracts. Its mandate is to make every surface the redesign built — and every surface that predated it — fail-proof, design-consistent, and UX-correct.

**The instrument must never leave the native stranded.** A blank screen, a cryptic error code, a spinner that never resolves, a button that does nothing — these break the working session and erode trust. NAK closes every one of those gaps.

---

## §2 — What "robust" means in this context

Five properties, in order of priority:

1. **Fail-proof** — every code path that can throw, rejects, or returns an unexpected shape is handled. No unhandled promise rejections. No uncaught runtime errors. No blank white screens on bad state.

2. **Communicative on failure** — when something goes wrong the user sees a clear, layman-readable message explaining what happened and what to do next. Not "500 Internal Server Error". Not a stack trace. Something like: *"We couldn't load your chart data — please check your connection and try again. If this keeps happening, contact support."*

3. **Graceful degradation** — where a non-critical component fails (e.g., the Trace panel), the rest of the surface continues to function. Partial failure is not total failure.

4. **Predictable** — the UI behaves identically across repeated interactions. No race conditions visible to the user. No flickering states. No actions that sometimes work and sometimes don't.

5. **Transparent** — loading states are always present, always resolve, and always communicate what is happening. Empty states are always intentional and always instructive.

---

## §3 — Five strategic pillars

### Pillar 1 — Design System Formalization

**The problem:** The design system exists implicitly in `globals.css` and the shadcn/ui config, but it has never been written down as a formal document. Components across surfaces use tokens inconsistently — some hard-code hex values where a CSS variable should be used, some use margin/padding values outside the spacing scale, some import colour values from Tailwind's default palette instead of the oklch brand palette. There is no authoritative reference for "what is the correct button variant for a destructive action?" or "what is the correct heading hierarchy on a vellum-light surface?"

**NAK's answer:** Author `NAK_DESIGN_SYSTEM_v1_0.md` — the living specification for every token, every component variant, every spacing rule, every type style, every motion token, and every icon guideline. Then audit every component file against it. Fix divergences. The design system document becomes the answer to every future "what should this look like?" question.

**Scope:** `platform/src/app/globals.css`, `platform/src/components/ui/`, all shadcn primitives, all brand components, all surface-level components, `tailwind.config.ts`.

**Success signal:** A developer adding a new component can look at `NAK_DESIGN_SYSTEM_v1_0.md` and know exactly which token, which variant, and which spacing value to use — with no guesswork. `globals.css` is the single source of truth; no component hard-codes a brand colour.

---

### Pillar 2 — Robustness and Error Handling

**The problem:** API routes return errors in inconsistent shapes. Some return `{ error: "..." }`, some return `{ message: "..." }`, some throw. Client-side hooks handle some errors and silently swallow others. Several surfaces have no `error.tsx` boundary. The `ErrorBoundary` component exists but is not applied uniformly. When an API call fails mid-conversation the user sees nothing — not even a toast.

**NAK's answer:** Establish an error handling framework (`NAK_ERROR_FRAMEWORK_v1_0.md`) that defines: the canonical API error shape, the four failure modes (network, auth, data, system) and their user-facing messages, the three error display patterns (inline, toast, full-page boundary), and the retry/fallback strategy for each failure class. Then implement it everywhere — every `fetch`, every `useQuery`, every streaming endpoint, every `error.tsx` file.

**Scope:** `platform/src/app/api/` (all routes), `platform/src/hooks/`, `platform/src/components/` (all surfaces), `platform/src/app/**/error.tsx`.

**Success signal:** The native can induce any network failure, any auth expiry, any data corruption and always receive a clear, actionable message. No surface goes blank. No spinner runs forever.

---

### Pillar 3 — UX Component Audit

**The problem:** The portal has accumulated components across three phases of development (v1 chat, the Cockpit era, the Redesign era). Some components are used in ways that conflict with their intended purpose. Some shadcn primitives are wrapped in custom components that add no value and introduce inconsistency. Some components are present on a surface but serve no user need — they are technical artefacts the user has to navigate around.

**NAK's answer:** Produce `NAK_COMPONENT_AUDIT_v1_0.md` — a line-by-line inventory of every component on every surface, with a verdict for each: **Keep-as-is**, **Fix** (component is correct, usage is wrong), **Elevate** (component can serve a higher-value purpose), or **Eliminate** (component adds no user value and should be removed). Then implement the Fix and Elevate verdicts; eliminate the Eliminate verdicts with a clean deprecation.

**Scope:** Every `*.tsx` file under `platform/src/components/` and `platform/src/app/` (page and layout files).

**Accessibility note:** Component audit includes a first-pass accessibility review — `aria-*` attributes on interactive elements, keyboard navigation, focus traps in modals, colour contrast on non-standard surfaces.

**Success signal:** Every component on every surface has a deliberate reason to be there. The audit document can explain that reason in one sentence. No component silently fails or misleads.

---

### Pillar 4 — Portal Math Verification

**The problem:** "Portal math" means the data pipelines that power every visible surface — fetch chains, computed values, query parameters, pagination, state synchronisation across the conversation sidebar and the main panel, the classify→compose→retrieve→synthesise→audit pipeline, the LEL/prediction API, the pyramid completion calculus. These were built across many sessions by multiple agents and have never been audited end-to-end as a coherent system. Race conditions, stale closures, duplicate fetch calls, and mismatched pagination cursors are possible.

**NAK's answer:** Trace every data flow from the point of user interaction to the point of UI render. Verify: correct dependency arrays in hooks, no redundant re-fetches, correct cache invalidation after mutations, correct optimistic update rollback on failure, correct streaming backpressure handling in `ConsumeChat` and `BuildChat`. Document findings in `NAK_PORTAL_MATH_AUDIT_v1_0.md`.

**Scope:** `platform/src/hooks/`, `platform/src/app/api/`, `platform/src/lib/`, `platform/src/components/chat/` (hook consumption).

**Success signal:** `npm run dev` with network throttling to Slow 3G produces no waterfall of duplicate requests, no state desyncs, no stale data artefacts.

---

### Pillar 5 — Cross-Surface Consistency

**The problem:** Each surface was built and refined in its own session with its own agent. Global properties that should be identical everywhere — the AppShell rail behaviour on mobile, the breadcrumb rendering, loading skeleton dimensions, empty-state card design, toast positioning, modal backdrop opacity — vary subtly from surface to surface. The theme-zone discipline (vellum-light surfaces, ink-dark Consume, gold-bridge Chart Profile) is defined in the Vision but not mechanically enforced.

**NAK's answer:** Walk every surface in sequence. Measure: breadcrumb consistency, loading skeleton fidelity, empty-state design fidelity, toast/notification behaviour, modal/sheet behaviour, AppShell rail consistency (expanded vs collapsed state), mobile viewport behaviour. Document all deltas. Fix all deltas. Produce a cross-surface test checklist (`NAK_CONSISTENCY_CHECKLIST_v1_0.md`) that any future agent can run to verify no regression.

**Scope:** All six surfaces defined in `PORTAL_REDESIGN_VISION_v1_0.md §3.1` plus Admin, Audit, and Share surfaces.

**Success signal:** A user who navigates from Dashboard → Chart Profile → Consume → Timeline → Cockpit never encounters a seam — identical chrome, identical loading experience, identical error presentation, identical theme-zone transitions.

---

## §4 — Target scope boundary

NAK is **portal-only**. It does not touch:

| Out of scope | Reason |
|---|---|
| `01_FACTS_LAYER/`, `025_HOLISTIC_SYNTHESIS/`, all corpus layers | KARN territory |
| `platform/python-sidecar/` | Independent service; separate hardening pass if needed |
| Database schema / migrations | No schema changes; NAK works with existing data contracts |
| Auth model | No auth changes; errors in auth flow are surfaced but fixes scoped to UX only |
| `00_ARCHITECTURE/` governance files | KARN territory |
| Any `EXEC_BRIEF_*.md` or `CLAUDECODE_BRIEF*.md` outside `00_NAK/` | KARN's brief pool |

Within `platform/src/`, **everything is in scope** for audit. Fixes are scoped to the minimum change that resolves the finding — NAK does not add features.

---

## §5 — Wave plan overview

NAK executes in four waves. Each wave except W0 fans out to three parallel Claude Code runs. The full plan lives in `00_NAK/NAK_TRACKER_v1_0.md`; the parallel execution mechanics live in `00_NAK/NAK_RUNBOOK_v1_0.md`.

```
W0 — Foundation (gate)
│   Single run. Must close before W1 starts.
│   Produces: baseline audit, design system draft, error framework draft,
│             component inventory, W1 exec briefs (R1–R3).
│
W1 — Audit Wave (3 parallel runs)
│   W1-R1  Design System Deep Audit
│   W1-R2  Error Handling & Robustness Audit
│   W1-R3  UX Component Audit + A11y First Pass
│   Each run produces a findings report. W1 closes when all three runs close.
│   W1's findings seed W2's fix briefs.
│
W2 — Fix Wave (3 parallel runs)
│   W2-R1  Design System Implementation
│   W2-R2  Error Handling Implementation
│   W2-R3  Component Fix / Eliminate
│   Each run implements its W1 findings. W2 closes when all three runs close.
│   W2's outcomes seed W3's verification briefs.
│
W3 — Verification & Polish (3 parallel runs)
    W3-R1  Cross-Surface Consistency Final Pass
    W3-R2  Integration Testing & QA
    W3-R3  Documentation Seal (design system + consistency checklist final)
    W3 close = NAK project close.
```

**Wave dependency rule:** W1 cannot start until W0 closes. W2 cannot start until all three W1 runs close. W3 cannot start until all three W2 runs close. Within a wave, runs are fully parallel-safe by scope isolation (see `NAK_RUNBOOK_v1_0.md §3`).

---

## §6 — Success criteria (project close)

NAK closes when all of the following are true:

1. `NAK_DESIGN_SYSTEM_v1_0.md` at `status: FINAL` — every token, variant, and spacing rule documented.
2. `NAK_ERROR_FRAMEWORK_v1_0.md` at `status: FINAL` — canonical error shape, four failure modes, three display patterns, retry strategy.
3. `NAK_COMPONENT_AUDIT_v1_0.md` at `status: FINAL` — every component has a verdict; all Fix/Elevate/Eliminate verdicts implemented.
4. `NAK_PORTAL_MATH_AUDIT_v1_0.md` at `status: FINAL` — all hook dependency arrays verified, no duplicate fetches, no race conditions.
5. `NAK_CONSISTENCY_CHECKLIST_v1_0.md` at `status: FINAL` — cross-surface checklist passes on all six main surfaces + Admin + Audit + Share.
6. Zero unhandled promise rejections in the browser console under normal operation.
7. Every surface has an `error.tsx` boundary that renders a user-friendly fallback.
8. `npm test` passes with zero regressions from the NAK starting baseline.
9. `NAK_TRACKER_v1_0.md` §2 state block: `nak_status: COMPLETE`, all wave/run rows `status: closed`.

---

## §7 — Relationship to KARN

NAK is parallel to, not inside, KARN. The two workstreams share the same git repository and operate in separate branches/worktrees by convention. They must not touch the same files in the same session.

**Coordination rule:** NAK may_touch `platform/src/**`. NAK must_not_touch `00_ARCHITECTURE/**`, `01_FACTS_LAYER/**`, `025_HOLISTIC_SYNTHESIS/**`, `03_DOMAIN_REPORTS/**`, `04_REMEDIAL_CODEX/**`, `05_TEMPORAL_ENGINES/**`, `06_LEARNING_LAYER/**`, any `EXEC_BRIEF_*.md` outside `00_NAK/`, and `CLAUDECODE_BRIEF*.md` files that belong to active KARN sessions.

If a NAK session needs to amend `CLAUDE.md` (e.g., to add a §C read-at-open for NAK's governance docs), the native's explicit approval is required and the change is made in a dedicated commit, not bundled into a NAK fix wave.

---

*End of NAK_VISION_v1_0.md — authored 2026-04-30. Governs Project Nakula from W0 Foundation through W3 close.*
