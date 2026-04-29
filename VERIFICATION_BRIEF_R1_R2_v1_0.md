---
title: VERIFICATION BRIEF — R1 + R2 acceptance verification + fresh consume-page audit
brief_id: VERIFICATION_R1_R2
version: 1.0
status: COMPLETE
authored_at: 2026-04-29
authored_by: Cowork audit session (claude-opus-4-7)
target_executor: Claude Code (VS Code Anti-Gravity)
session_scope: Verification + investigation only — NO code changes
predecessor: EXEC_BRIEF_UI_R2_CRITICAL_UX_v1_0.md (status COMPLETE)
estimated_runtime: 60–90 minutes
---

# VERIFICATION BRIEF — R1 + R2 acceptance verification + fresh consume-page audit

## §0 — Orientation (read before doing anything)

**This brief is verification + investigation ONLY. Do not write or edit any production code. Do not modify any file under `platform/src/`, `platform/supabase/`, or any governance file.** The only files you may create are the deliverables listed in §6.

This brief is **outside the M2 governance arc**. Skip the standard CLAUDE.md mandatory-reading sequence (PROJECT_ARCHITECTURE, MACRO_PLAN, etc. are not relevant). Do not emit a SESSION_OPEN or SESSION_CLOSE. Do not log to SESSION_LOG.

You will need to read:

1. This file in full.
2. `EXEC_BRIEF_UI_R1_BRAND_SPINE_v1_0.md` §6 (verification walkthrough) and §8 (close report) — the R1 acceptance items and what was actually delivered.
3. `EXEC_BRIEF_UI_R2_CRITICAL_UX_v1_0.md` §6 and §8 — same for R2.

Everything else is on a need-to-read basis (e.g., a component file you want to confirm a Playwright assertion matches the actual DOM structure).

When done, populate §7 with your findings and set `status: COMPLETE` in this brief's frontmatter. Stop. Do not start R3.

## §1 — What this verification is for

R1 (brand spine) and R2 (critical UX + accessibility) both shipped with mechanical checks green: typecheck zero, lint clean, tests passing. **What's missing is the live behavioral verification** — does the user-facing experience actually match the acceptance criteria? The §6 walkthroughs in both briefs require an authenticated session, which the executor sessions did not run.

This brief asks Claude Code to:

1. **Stand up a Playwright + axe-core test harness** against a local dev server.
2. **Run the §6 walkthroughs from R1 and R2 as automated checks** with screenshots.
3. **Independently re-audit the consume page** in its current post-R2 state and report any new issues.
4. **Produce a single findings report** with severity-ranked items, screenshots, console-error captures, and accessibility violations.

No fixes. No code changes. The native reviews the findings and decides whether to ship corrective patches before R3 or fold them into R3 scope.

## §2 — Setup

### 2.1 — Dev server

Start the Next.js dev server:

```bash
cd platform
npm install                                # if needed
npm run dev
```

Default URL: `http://localhost:3000`. Confirm by visiting `/login` and seeing the black-and-gold ceremonial form.

### 2.2 — Playwright + axe-playwright

Install (project-local, dev-dependency only — do NOT commit):

```bash
cd platform
npx playwright install chromium             # browser binary
npm install --save-dev --no-package-lock @playwright/test @axe-core/playwright
```

If the project already has Playwright wired (check `platform/playwright.config.*`), use that config. Otherwise, write a minimal config to `platform/verification/playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './specs',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    storageState: './state/auth.json',         // populated in 2.4
  },
  reporter: [['html', { outputFolder: './report' }], ['list']],
});
```

**All verification artifacts live under `platform/verification/`. This directory is NOT committed — add it to `.gitignore` if not already covered.**

### 2.3 — Authenticated session

The consume page requires login. Two options, in order of preference:

**Option A — native provides test credentials.** If a `.env.test` or similar fixture exists with a test super_admin account, use it. Otherwise ask the native at session start: *"To run the live verification I need a super_admin test account. What email/password should I use, or should I create a fresh one through the admin panel?"*

**Option B — reuse the native's existing browser session.** Have Playwright open a non-headless browser with `storageState` empty, prompt the native to log in once, then save the session state to `platform/verification/state/auth.json`. Subsequent runs reuse it. This is the safest path — no credentials in plaintext.

Whichever path, store the resulting `auth.json` outside git.

### 2.4 — Test target chart

The consume page lives at `/clients/[id]/consume`. Pick the chart that has the fullest message history (likely Abhisek's own canonical chart). Capture the chart `id` from the dashboard URL and store it as a constant in the spec:

```ts
const TEST_CHART_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

If no conversation has any messages yet, the verification suite includes a "send a probe message" step (§3.1) that creates one.

## §3 — Verification matrix

Each item below is one Playwright test or assertion. The spec file is `platform/verification/specs/consume.spec.ts`. Group tests by acceptance source (R1, R2, fresh).

### 3.1 — R1 acceptance items (brand spine)

Reference: `EXEC_BRIEF_UI_R1_BRAND_SPINE_v1_0.md` §6.

| ID | Check | Method |
|---|---|---|
| R1-V-1 | Force-dark on consume — `<html>` has `class="dark"` regardless of system preference | Navigate to `/clients/[id]/consume`, assert `await page.locator('html').getAttribute('class')` contains `'dark'`. Then `emulateMedia({ colorScheme: 'light' })` and re-assert it stays `dark`. |
| R1-V-2 | Mandala watermark visible on empty state | Open a fresh conversation. Screenshot. Assert an SVG with role/test-id matching the mandala component is rendered with computed `opacity` between `0.08` and `0.15`. |
| R1-V-3 | Suggestion cards have gold hairline borders | Assert at least one suggestion card's computed `border-color` resolves to gold (oklch with hue ~80, alpha < 0.5). |
| R1-V-4 | Send button is gold gradient with uppercase tracking-wide label | Assert the button's `background-image` includes a `linear-gradient`, `text-transform` is `uppercase`, `letter-spacing` ≥ 2px. |
| R1-V-5 | Composer focus ring is visibly gold | Focus the textarea, assert `box-shadow` or `outline-color` resolves to gold. |
| R1-V-6 | Sidebar New-chat button is gold-bordered, uppercase | Same approach as R1-V-3 + R1-V-4. |
| R1-V-7 | Assistant avatar is the sigil (NOT Sparkles) | Send a probe message; on the assistant bubble, assert the avatar SVG has 9 circles (1 outer ring + 8 petals + 1 bindu) and NOT the Lucide Sparkles path. |
| R1-V-8 | Prose width ≤ 68ch on wide viewport | At 1440px, send a long message ("Tell me about my D9 chart in detail."). Assert the `clientWidth` of the prose container is ≤ `68 * 8` ≈ 544 pixels (rough — adjust per measured `1ch`). |
| R1-V-9 | Methodology expander wired and default-expanded for super_admin | After a completed assistant message, assert a node with text matching `/methodology/i` exists AND if metadata.methodology_block is non-null, the expander is open by default. **If the expander never appears, screenshot the metadata strip and dump `window.__lastMessageMetadata` (or equivalent) to verify whether `methodology_block` is reaching the client.** |
| R1-V-10 | Sidebar rename + delete use shadcn dialog (NOT `window.prompt`/`confirm`) | Open kebab menu, click Rename. Assert no native prompt appears (no `page.on('dialog')` event); a Radix Dialog node is in the DOM. Same for Delete. |
| R1-V-11 | Streaming caret is gold | Send a message; while streaming, capture the caret element's computed color. Assert it's in the gold range. |

### 3.2 — R2 acceptance items (critical UX + accessibility)

Reference: `EXEC_BRIEF_UI_R2_CRITICAL_UX_v1_0.md` §6.

| ID | Check | Method |
|---|---|---|
| R2-V-1 | StreamingAnswer affordance parity — completed answer shows Copy/Regenerate/Rate | After a completed message, hover the bubble. Assert role=button elements with names matching `/copy/i`, `/regenerate/i`, `/rate|thumbs/i` are visible. |
| R2-V-2 | Copy actually works | Click Copy. Read clipboard via `await page.evaluate(() => navigator.clipboard.readText())`. Assert content is non-empty and matches the rendered message text. |
| R2-V-3 | Regenerate triggers re-synthesis | Click Regenerate. Assert a new streaming bubble appears within 5s. |
| R2-V-4 | Per-message error boundary isolates failures | (Skip if no easy fixture; document as untested if so. Optional: temporarily mount an error-throwing test message via dev tooling.) |
| R2-V-5 | Validator-failure card shows "EPISTEMIC HALT" kicker, gold-leaf rule, "Edit and retry" button | Trigger a failure (use a known-failing prompt; ask native if uncertain). Assert kicker text, presence of horizontal rule node, and button text. Click Edit and retry → assert the composer textarea now contains the original user text and is focused. |
| R2-V-6 | PanelAnswerView renders markdown (not plain text) | Enable Panel mode (per R1+R2 UI), send a query that produces multi-paragraph answer. Assert the final answer block contains `<h1>`/`<h2>`/`<ul>`/`<code>` per the input — i.e., it's rendered through markdown, not whitespace-pre-wrap. **If panel mode is gated behind a flag the test can't toggle, document and skip with explicit note.** |
| R2-V-7 | Per-message metadata strip renders | Assert the strip exists below each completed assistant message. Items shown match available `message.metadata` fields; items absent on metadata are NOT rendered as "undefined". |
| R2-V-8 | Reload preserves timestamps | Send a message at T0. Reload. Assert the rendered timestamp does NOT change to "now" (compare to T0 within 5s tolerance). **If the API doesn't surface `created_at`, the chip is hidden — that's acceptable; document explicitly.** |
| R2-V-9 | Sticky DisclosureTierBadge banner is gone | Assert no element with role=banner or class containing `sticky` carries the disclosure tier text at the top of the conversation. The tier chip should live inside per-message metadata strips only. |
| R2-V-10 | Single `<h1>` at all times | On the empty state and on a state with messages, assert `await page.locator('h1').count()` is exactly 1. |
| R2-V-11 | `aria-live` on streaming text node, NOT scroll container | While streaming, assert the streaming text wrapper has `aria-live="polite"` and the scroll container has no `aria-live` attribute. |
| R2-V-12 | `aria-busy` flips on assistant message during streaming | While streaming, assert `aria-busy="true"` on the assistant message root. After completion, `aria-busy="false"` or absent. |
| R2-V-13 | Markdown links meet contrast | Render a message containing a link. Use axe-core to assert no `color-contrast` violation on the anchor element. |
| R2-V-14 | Citation chips re-skinned (gold/saffron/bronze, NOT amber/sky/violet) | Send a query that returns citations. Capture computed `color` and `border-color` of each chip variant. Assert hue is in the 50–90 range (gold family), not 30 (amber), not 230 (sky), not 290 (violet). |
| R2-V-15 | Citation glyph legend visible on welcome | On empty conversation, assert a node containing `≋ signal · ⊞ asset · § chunk` (or the friendlier wording) is visible. |
| R2-V-16 | Citation panel ≥ 28rem | Click a citation chip. Assert the preview panel `clientWidth` ≥ 28 * 16 = 448 pixels. |
| R2-V-17 | Citation panel focus trap | Click a chip. Press Tab repeatedly. Assert focus stays inside the panel (the active element selector remains within the panel root). Press Escape. Assert focus returns to the chip. |
| R2-V-18 | Inline conversation-title editor | Double-click the header title. Assert an input becomes editable with the title pre-filled. Type a new title, press Enter. Assert the displayed title updates. Reload, assert it persisted (only if the rename API exists; else document). |
| R2-V-19 | Mobile chartMeta visible | Resize to 375×812. Assert chartMeta text is visible (not `display:none`, not `visibility:hidden`). |
| R2-V-20 | shared/* component duplication cleanup | Grep filesystem under `platform/src` for `import.*from.*shared/(ChatMessage|StreamingCursor|ToolCallAccordion)`. Assert zero imports. (R2 close report mentioned these were retained — verify whether the retention was correct or a deferred cleanup.) |

### 3.3 — Accessibility scan (axe-core)

Run the full axe scan on three states:

```ts
import AxeBuilder from '@axe-core/playwright';

test('a11y — empty consume', async ({ page }) => {
  await page.goto(`/clients/${TEST_CHART_ID}/consume`);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);  // capture, don't fail; just report
});
```

States:
- A: empty consume (welcome state)
- B: consume with messages (after probe message)
- C: validator-failure visible (if reproducible)

Report all violations (severity: critical / serious / moderate / minor) — do not fail the test, just collect them into the findings file.

### 3.4 — Console errors

For every test, attach a `page.on('console')` listener. Collect any `error` or `warning` messages into the findings file with the URL and trigger that produced them. Hydration mismatches go here.

### 3.5 — Screenshots

Capture full-page screenshots at:

- A1: `/login` (brand reference)
- A2: empty consume (welcome state) at 1440px
- A3: empty consume at 768px (tablet)
- A4: empty consume at 375px (mobile)
- B1: conversation with completed answer at 1440px (showing avatar, citations, metadata strip, methodology expander)
- B2: hover state showing message actions
- C1: validator-failure card
- C2: citation preview panel open
- D1: sidebar with 1+ conversations, kebab menu open
- D2: rename dialog open
- D3: delete dialog open

Save under `platform/verification/screenshots/{ID}.png`. Reference them by relative path in the findings report.

## §4 — Fresh investigation (independent audit)

After the matrix runs, do an independent pass on the consume page in its post-R2 state — do not rely solely on the audit's existing findings. Use the same heuristics as the original audit:

1. Brand consistency vs login (gold ladder, serif, mandala motif, ceremonial copy register).
2. Visual hierarchy (eye flow: composer → current answer → prior turns → chrome).
3. Layout & spacing rhythm.
4. Typography (sizes, weights, line-heights, prose width feel).
5. Color & dark-mode contrast (run axe contrast assertions).
6. Composer affordance (autosize, focus, keyboard shortcuts, send-button state).
7. Message rendering (user vs assistant differentiation, streaming, metadata strip, citation chips).
8. Validator-failure & divergence views (gravity, retry behavior).
9. Empty / loading / error states.
10. Sidebar (search, group headers, hover affordance, new-chat CTA, rename/delete dialogs).
11. Header / chrome (title, chartMeta, model picker, share, theme toggle).
12. Microinteractions (motion, dots, scroll-to-bottom, focus rings).
13. Accessibility (landmarks, h1, aria-live, focus order, target sizes ≥ 44×44, screen-reader labels).
14. Responsive behavior (375 / 768 / 1024 / 1440).
15. Information density vs mystic-instrument tone.
16. Copy / microcopy (placeholders, empty-states, button labels, error messages).
17. Component drift (any new duplicate components, type mismatches).
18. Dead/disabled UI (buttons that look interactive but route nowhere).

Surface every issue you find — even ones that were not in the original audit. Do not edit code to fix them; only report.

## §5 — Critical investigations

These specific questions need definitive answers from this verification pass:

1. **Methodology block plumbing.** Is `message.metadata.methodology_block` actually present on the assistant message in the API response, or is it dropped before reaching the client? If dropped, where (server route handler, useChatSession hook, message-store reducer)? **This is the single highest-priority answer.** Method: open DevTools network tab, inspect the streaming response payload from `/api/chat/consume` for any `methodology_block` field. If absent, grep server-side route handler for the field name; if present in response but not on `message.metadata`, grep client-side handler for where it's stripped.

2. **shared/* retention.** R2 close report noted `shared/ChatMessage.tsx`, `shared/StreamingCursor.tsx`, `shared/ToolCallAccordion.tsx` were retained. Confirm whether each is actually imported anywhere in the production tree (excluding tests of the dead components themselves). Output the import graph for each.

3. **VirtualizedMessageList aria-live.** R2 close report noted scope ambiguity. Confirm whether `VirtualizedMessageList.tsx` still has `aria-live` on the scroll container. If yes, that's a residual finding for R3 or a fix-now item.

4. **The 5 pre-existing test failures.** R2 mechanical-check report mentioned 5 unrelated test failures. List them by test name + file, classify as: (a) genuine product bugs the audit didn't catch, (b) brittle-test issues, (c) environmental issues (network, timing, fixtures).

5. **Force-dark hydration.** Capture any hydration warning emitted while loading consume. Force-dark via `next-themes` is a known mismatch hazard.

6. **Pre-existing lint error.** R2 mentioned 1 pre-existing lint. Locate it, classify it (style vs correctness), and surface it in findings.

## §6 — Deliverable

Produce a single Markdown file at `/Users/Dev/Vibe-Coding/Apps/Madhav/VERIFICATION_R1_R2_FINDINGS_v1_0.md`.

Structure:

```markdown
---
title: VERIFICATION FINDINGS — R1 + R2 acceptance verification + fresh audit
brief_id: VERIFICATION_R1_R2_FINDINGS
version: 1.0
status: COMPLETE
authored_at: <date>
generated_by: Claude Code (VS Code Anti-Gravity)
verification_runs:
  - playwright: <pass/total>
  - axe_violations: <critical> critical, <serious> serious, <moderate> moderate
  - console_errors: <count>
  - hydration_warnings: <count>
---

# Verification findings — R1 + R2

## §1 — Headline status
[A 1–2 sentence verdict: "R1+R2 substantially landed; N regressions block R3 / N polish items recommended."]

## §2 — Verification matrix results
[Table of every R1-V-N and R2-V-N from §3.1/3.2 with PASS / FAIL / SKIP, link to screenshot if relevant, link to console-log capture if FAIL.]

## §3 — Critical investigation answers
### §3.1 — Methodology block plumbing
[Definitive answer with evidence — network payload screenshot or grep output.]

### §3.2 — shared/* retention
[Import graph for each.]

### §3.3 — VirtualizedMessageList aria-live
[Status + line reference.]

### §3.4 — Pre-existing test failures
[Table: test name, file, classification, rationale.]

### §3.5 — Force-dark hydration
[Captured warnings or "none".]

### §3.6 — Pre-existing lint
[Line reference + classification.]

## §4 — Fresh audit findings
[Severity-ranked list, same format as original audit: F-V-C-N (critical), F-V-H-N (high), F-V-M-N (medium), F-V-L-N (low). For each: where (path:line), what (observation), why it matters, suggested fix (do NOT implement).]

## §5 — Accessibility scan output
[Per-state axe violations grouped by severity. Include element selector + WCAG criterion.]

## §6 — Console errors collected
[List of console errors with trigger + frequency.]

## §7 — Recommendation
[One of: "Ship R3 — no blockers found", "Fix items A/B/C before R3", or "Re-scope R3 to absorb new findings".]

## §8 — Screenshots index
[Linked list to `platform/verification/screenshots/*.png`.]
```

## §7 — Hard scope (what NOT to do)

- **Do NOT modify any production source file.** No edits to `platform/src/**`, `platform/supabase/**`, `00_*/**`, `01_*/**`, `02*/**`, `0[3-7]_*/**`, root EXEC_BRIEFs, CLAUDE.md, or governance surfaces.
- Do NOT install npm dependencies into `package.json` permanently — use `--no-package-lock` for verification dependencies, or install into a separate `platform/verification/package.json` if cleaner.
- Do NOT commit `platform/verification/` or any auth state file. Add to `.gitignore` if not already.
- Do NOT toggle feature flags in `platform/src/lib/config/feature_flags.ts` or `.env*`.
- Do NOT seed test data into the production database. If you need a fixture, ask the native first or use an isolated test database.
- Do NOT run any synthesis or pipeline jobs that incur LLM token costs without confirming with the native first. Send the minimum number of probe messages necessary (~3–5).

## §8 — Close protocol

1. Populate `VERIFICATION_R1_R2_FINDINGS_v1_0.md` per §6 schema.
2. Set this brief's frontmatter to `status: COMPLETE`.
3. Write a one-line headline summary to the chat, including the §7 recommendation.
4. Stop. Do not start R3. Do not implement fixes. Native reviews findings, decides next move.
