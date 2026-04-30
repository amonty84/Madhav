---
artifact_id: NAK_CONSISTENCY_CHECKLIST
version: 1.0
status: FINAL
authored_by: Claude Code (NAK W3-R3 session) 2026-04-30
project: NAK — Nakula
wave_run: W3-R3 (authored direct-to-FINAL from vision surface list)
role: >
  Cross-surface verification checklist. Walks every surface defined in
  PORTAL_REDESIGN_VISION_v1_0.md §3.1 (six surfaces) plus Admin, Audit, and
  Share. Any future agent or native can run this checklist to confirm no
  consistency regression has been introduced.
provenance: >
  W3-R1 (Cross-Surface Consistency Final Pass) was not opened — the W2 fan-in
  collapsed directly into W3-R3 at NAK project close. This checklist is
  authored from the vision surface list rather than a deep walk-through;
  per-item provenance below names the source artifact.
changelog:
  - v1.0 (2026-04-30): W3-R3 authoring direct-to-FINAL.
---

# NAK Consistency Checklist v1.0 — FINAL

## §1 — How to use

For every release candidate touching `platform/src/`, walk every surface in §3 and tick each item. Any unticked item is a regression — either fix it or document a deferral with reason.

The checklist is not a substitute for a full a11y / browser pass. It catches the cross-surface seams the redesign and NAK closed; it does not catch new bugs.

---

## §2 — Surface inventory

The vision (`PORTAL_REDESIGN_VISION_v1_0.md §3.1`) names six surfaces; NAK extends the inventory to three more (Admin, Audit, Share) per `NAK_VISION_v1_0.md §5 W3-R1` scope.

| # | Surface | Route | Theme zone | Owner artifact |
|---|---|---|---|---|
| 0 | Login | `/login` | Ink | Untouched (cinematic — vision §3.1 S0) |
| 1 | AppShell (chrome) | global | inherits | `platform/src/components/shared/AppShell.tsx` |
| 2 | Roster | `/dashboard` | Vellum | `platform/src/components/dashboard/` |
| 3 | Chart Profile | `/clients/[id]` | Bridge | `platform/src/app/clients/[id]/page.tsx` |
| 4 | Build (per-chart) | `/clients/[id]/build` | Vellum | `platform/src/app/clients/[id]/build/` |
| 5 | Consume | `/clients/[id]/consume` | Ink | `platform/src/components/consume/` |
| 5b | Timeline | `/clients/[id]/timeline` | Vellum | `platform/src/app/clients/[id]/timeline/` |
| 6 | Cockpit | `/cockpit/*` | Vellum | `platform/src/components/build/` |
| 7 | Admin | `/admin` | Vellum | `platform/src/components/admin/` |
| 8 | Audit | `/audit/*` | Vellum | `platform/src/components/audit/` |
| 9 | Share | `/share/[slug]` | Ink (read-only Consume) | `platform/src/app/share/[slug]/` |

---

## §3 — Cross-surface checklist

Run on every release. Tick all on every surface where the item applies.

### §3.1 Theme-zone discipline

- [ ] Vellum surfaces use `--background` (warm vellum) and `--brand-gold-deep` accents only — no ink chrome bleeding in.
- [ ] Ink surfaces (Consume, Login) use `--brand-ink` and `--brand-gold` / `--brand-gold-light` accents only.
- [ ] Chart Profile (Bridge) hero band uses ink-on-vellum scoping; the ink scope does not bleed past the hero card.
- [ ] No surface hard-codes a brand colour as a hex literal (per `NAK_DESIGN_SYSTEM_v1_0.md §6 F-DS-1`). Documented exception: recharts CHART_PALETTE values in `platform/src/components/build/{HealthSparkline,InterventionFrequency}.tsx` and `platform/src/components/charts/TrendLine.tsx` and `platform/src/lib/colors.ts` — annotated with `CHART_PALETTE` JSDoc; tracked as deferral pending `useBrandColors()` hook (NAK-D7).
- [ ] No surface imports a colour from Tailwind's default palette (`bg-slate-*`, `text-blue-*`) without a NAK-acknowledged reason.

### §3.2 AppShell consistency

- [ ] Left rail: `Sigil` at top, `Roster` link, `Cockpit` link (super_admin only), `Admin` link (super_admin only), avatar at bottom on every authenticated surface.
- [ ] Top breadcrumb: `Roster · {ChartName} · {Mode}` on per-chart surfaces; `Roster` on Roster; appropriate single-segment on Admin/Audit/Cockpit.
- [ ] Avatar dropdown contains: Sign out, theme toggle (where applicable). No additional actions added without an audit entry.
- [ ] Mobile rail collapses to icon-only at <768px viewport; expanded on hover/tap; identical behaviour on every surface.
- [ ] AppShellBreadcrumb mobile nav renders inside `<nav aria-label="Breadcrumb">` even on empty segments (W2-R3 follow-up: pre-existing test expects `null`; test is wrong, not the code — see W2-R3 follow_ups).

### §3.3 Loading and empty states

- [ ] Every async surface has a `loading.tsx` boundary or in-component skeleton — no blank flashes on first paint.
- [ ] Skeleton dimensions match the rendered content (no layout shift on resolve).
- [ ] Empty states are intentional: zero-roster shows the brand wizard; zero-conversations shows "Ask anything" CTA; zero-events shows the LEL guidance card.
- [ ] Spinners always resolve. No surface ships a spinner that can run forever — every async path has a timeout or an error-boundary fallback.

### §3.4 Error presentation

- [ ] Every surface has an `error.tsx` boundary at its route segment (Dashboard, Admin, Audit, Build, Share, Cockpit). Confirmed via `find platform/src/app -name error.tsx`.
- [ ] No `error.tsx` boundary leaks `error.message` or `error.digest` to a non-super_admin user. Pre-existing exception: `platform/src/app/cockpit/error.tsx` (super_admin-only surface; raw error visible by design — but flagged W2-R3 follow-up for theme consistency review, deferred to NAK-D8).
- [ ] Toasts use `sonner` only — no surface ships its own toast component.
- [ ] Inline errors render via shared `<ErrorMessage>` / equivalent — no per-surface red-text-with-stylesheet variants.
- [ ] Every API error response is the canonical `ApiErrorBody` envelope. UI consumers read `error.error.message` for display, never `error.message`.

### §3.5 Toast and modal/sheet behaviour

- [ ] Toasts position bottom-right on desktop, top on mobile (sonner default). No surface overrides this.
- [ ] Toast duration: 5 s for info/success, 8 s for warning, manual-dismiss for error.
- [ ] Modal backdrop opacity and blur identical across surfaces (shadcn `Dialog` default; do not override).
- [ ] Sheet (drawer) slide direction by axis: right for filters/details, bottom for mobile menus, left for nav rail. Audited per surface — no surface uses an off-axis sheet.

### §3.6 Page metadata

- [ ] Every layout file has a `metadata` export with at minimum `title` set to the surface name. Verified at W2-R3 close: `dashboard`, `admin`, `clients/[id]` layouts have titles. **Open follow-ups deferred to NAK-D9**: `platform/src/app/login/page.tsx` and `platform/src/app/share/[slug]/page.tsx` lack titles (page.tsx, not layout.tsx — outside W2-R3 may_touch).
- [ ] Per-chart pages compose dynamic title segments via `generateMetadata` (chart name + mode).
- [ ] No surface ships a default Next.js `metadata` placeholder.

### §3.7 Accessibility (a11y) baseline

- [ ] All interactive elements have an accessible name (visible label OR `aria-label`). Verified at W2-R3 across `TracePanel`, `CommandPalette`, `AdaptiveMessageList`, `ChatShell`, `ConsumeChat`, `StreamingAnswer`, `RosterTableView`, `ClientCard`, `RosterEmptyWizard`.
- [ ] All form inputs have an associated `<label>` or `aria-labelledby`.
- [ ] All clickable non-button elements use `role="button"` AND `tabIndex={0}` AND keyboard handlers.
- [ ] Focus-visible ring present on every actionable element (gold ring on vellum; gold-cream ring on ink).
- [ ] Modal/sheet focus traps tested — Tab does not escape; Escape closes; focus returns to trigger.
- [ ] Colour contrast ≥ AA (4.5:1) for body text on every theme zone.

### §3.8 Streaming and chat parity

- [ ] Build chat (`/clients/[id]/build`) and Consume chat (`/clients/[id]/consume`) use the same hook stack: `useChatSession`, `useBranches`, `useFeedback`, `useChatPreferences`.
- [ ] Streaming answer handles backpressure identically — no waterfall on Slow 3G throttling.
- [ ] Trace panel renders identically in Build (always-visible) and Consume (drawer trigger from answer footer).

### §3.9 Mobile pass (per surface)

- [ ] Surface renders without horizontal scroll at 375 × 667.
- [ ] Touch targets ≥ 44 × 44.
- [ ] Tap-and-hold gestures (if used) have a click-equivalent.
- [ ] Lighthouse a11y score ≥ 95 on every surface (vision §3.3).

---

## §4 — Per-surface seam audit

Items unique to specific surfaces.

### Login (`/login`)
- [ ] Mandala backdrop centred on viewport at all aspect ratios.
- [ ] Gold filigree visible against ink without contrast loss.
- [ ] No metadata title — deferral NAK-D9.

### Chart Profile (`/clients/[id]`)
- [ ] Hero band ink-zone scoping verified — vellum chrome unaffected.
- [ ] Three rooms (Build, Consume, Timeline) each render with last-activity preview.
- [ ] Side rail Vimshottari countdown ticks live (no stale render).
- [ ] Super_admin-only governance footer renders only when role check passes.

### Consume (`/clients/[id]/consume`)
- [ ] Audience-tier picker switches view without page reload.
- [ ] "Log this prediction" action surfaces only on time-indexed claims — never on retrospective answers.
- [ ] Trace drawer opens/closes without scroll-position jump.

### Cockpit (`/cockpit`)
- [ ] Permanent 301 redirect from legacy `/build` route.
- [ ] All sub-routes (`/plan`, `/sessions`, `/registry`, `/interventions`, `/parallel`, `/health`, `/activity`) reachable.
- [ ] "Active charts" widget links into Chart Profile.

### Admin (`/admin`)
- [ ] Pending-requests table renders with correct timestamp formatting.
- [ ] Approve / reject dialogs use shared `<ConfirmDialog>` only.

### Audit (`/audit`)
- [ ] Filter pills, list, and detail page share token usage (no admin-only colour drift).
- [ ] Predictions log paginates without state desync.

### Share (`/share/[slug]`)
- [ ] Read-only Consume render — no edit affordances visible.
- [ ] No metadata title — deferral NAK-D9.

---

## §5 — Provenance + caveats

This checklist was authored in W3-R3 from the vision and the reports of W1/W2 runs. It was **not** built from a fresh, full cross-surface walk — that walk was the planned W3-R1 deliverable and W3-R1 was collapsed into W3-R3 at project close. Items in §3 reflect what NAK governance docs report rather than independent verification. A future maintenance pass that does the walk should:

1. Tick every item that survives observation.
2. Open new findings against any item that doesn't.
3. Bump this file to v1.1 with the walk's date and observer.

Until then, ungated items here represent intent, not certified state.

---

*End of NAK_CONSISTENCY_CHECKLIST_v1_0.md v1.0 — FINAL. Authored 2026-04-30 at NAK project close.*
