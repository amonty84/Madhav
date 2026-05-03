---
title: VERIFICATION FINDINGS — R1 + R2 acceptance verification + fresh audit
brief_id: VERIFICATION_R1_R2_FINDINGS
version: 1.0
status: COMPLETE
authored_at: 2026-04-29
generated_by: Claude Code (VS Code Anti-Gravity, claude-sonnet-4-6)
verification_runs:
  playwright: 14 live-tested / 11 SKIP (LLM-gated or headless-blocked)
  axe_violations: 0 critical, 2 serious, 2 moderate
  console_errors: 0
  hydration_warnings: 0
---

# Verification findings — R1 + R2

## §1 — Headline status

R1+R2 landed clean at the mechanical level (typecheck zero, tests 829/834) but **live verification reveals 4 blockers that must be fixed before R3 ships**: (1) force-dark is silently broken — the entire consume surface renders in light mode; (2) per-message metadata strip is structurally empty due to a server↔client key mismatch; (3) the methodology expander is non-functional because `methodology_block` is never emitted by the synthesis pipeline; (4) the single-`<h1>` constraint is violated in both empty-state and message-state. Six additional medium/low issues are documented for R3 backlog.

---

## §2 — Verification matrix results

### R1 checks

| ID | Status | Note |
|---|---|---|
| R1-V-1 | **FAIL** | `html` class stays `light` even after full hydration (3s+ wait). `ForceDarkMode` / `ConsumeForceDark` both fire but `next-themes` `enableSystem` re-applies `light` after their `useEffect`. See §3.1. |
| R1-V-2 | PASS | Mandala watermark visible; SVG opacity 0.12, 156 circles in DOM, positioned absolutely behind greeting. |
| R1-V-3 | PARTIAL | "New conversation" button confirmed gold border: `lab(74.54 12.93 56.69 / 0.35)`. WelcomeGreeting suggestion cards have `border-[var(--brand-gold-hairline)]` class, but rendered borderColor is pale (light mode) because force-dark is broken. |
| R1-V-4 | **FAIL** | Send button (`aria-label="Send message"`) has `backgroundImage: none`, not a gradient. Background resolves to light muted color in light mode. Gold gradient may exist in dark mode CSS but is not active. |
| R1-V-5 | PASS | Composer textarea focus ring: `outline: oklab(0.68 0.002 0.008 / 0.5) none 1px`. Ring present (light-mode gold-adjacent). |
| R1-V-6 | PASS | "New conversation" button: `textTransform: uppercase`, `borderColor: lab(74.54 12.93 56.69 / 0.35)`. ✓ |
| R1-V-7 | PASS (static) | `AssistantMessage.tsx` and `PendingAssistantBubble.tsx` both import `AssistantSigil` from `@/components/brand/AssistantSigil`, not Lucide `Sparkles`. Confirmed by `grep`. `AssistantSigil` is 8-petal + bindu SVG with `aria-hidden="true"`. |
| R1-V-8 | PASS | Prose container `clientWidth` = 643px at 1440px viewport. 643 / 68 ≈ 9.45px per ch — correct for Source Serif 4 at 15px. `max-w-[68ch]` applied to both `Markdown.tsx` and `StreamingMarkdown.tsx`. |
| R1-V-9 | **FAIL** | Methodology expander structurally dead: `methodology_block` never emitted by server in `messageMetadata`. Client reads `metadata.methodology_block ?? null` → always null. See §3.1 for root-cause trace. |
| R1-V-10 | PASS | Rename: Radix `[role="dialog"]` confirmed in DOM, no `page.on('dialog')` event fired (no native `window.prompt`). Screenshot: D2-rename-dialog.png. |
| R1-V-11 | SKIP | Streaming caret test requires an active LLM stream. Triggering synthesis would incur token cost; skipped per brief §7. Static inspection: `globals.css` has `caret-color: var(--brand-gold)` in `.dark` scope — not active in light mode. |

### R2 checks

| ID | Status | Note |
|---|---|---|
| R2-V-1 | PASS\* | After hover on last assistant message: `Copy`, `Retry` (= Regenerate), `Good response`, `Bad response` all confirmed visible with `opacity:1`. \*Label deviation: `Retry` ≠ spec's `Regenerate`. |
| R2-V-2 | SKIP | `navigator.clipboard.readText()` blocked in headless context (security policy). Copy button click confirmed; clipboard content unverifiable in headless. |
| R2-V-3 | SKIP | Regenerate ("Retry") triggers LLM synthesis; not tested to avoid token cost. |
| R2-V-4 | SKIP | Error boundary isolation requires a deliberately broken message fixture. Not reproducible without dev tooling injection. |
| R2-V-5 | SKIP | Validator failure requires a known-bad prompt triggering `VALIDATOR_FAILURE_HALT`. Not tested to avoid LLM cost and risk of false positives. |
| R2-V-6 | SKIP | Panel mode requires `panel_opt_in: true` with an active synthesis call. Not tested. |
| R2-V-7 | **FAIL** | Metadata strip always empty. Server sends `metadata.model` (key: `model`) but `AssistantMessage.tsx` reads `metadata.model_id`. Same mismatch for `style_id` (never sent), `disclosure_tier` (never sent). All strip badges silently omitted. |
| R2-V-8 | **FAIL** | No `<time>` elements rendered on any conversation page. Server never includes `created_at` in `messageMetadata`. `AssistantMessage.tsx` reads `meta.created_at ?? message.created_at` — both undefined. |
| R2-V-9 | PASS | No sticky `[role="banner"]` element carrying disclosure tier text at page top. ✓ |
| R2-V-10 | **FAIL** | Empty state: `h1` count = 2 (ChatShell title + WelcomeGreeting). With messages: `h1` count = 2 (ChatShell title + markdown `#` heading rendered as `<h1>` in prose). Both `Markdown.tsx` and `StreamingMarkdown.tsx` render `#` → `<h1>`. |
| R2-V-11 | PASS | `aria-live="polite"` confirmed on `.chat-prose` (StreamingMarkdown wrapper). VirtualizedMessageList scroll container has no `aria-live`. ✓ |
| R2-V-12 | PARTIAL | `aria-busy="false"` confirmed on `.chat-prose` elements post-streaming. Cannot verify `aria-busy="true"` during streaming without live LLM call. Static code review confirms `StreamingMarkdown` sets `aria-busy={isStreaming}`. |
| R2-V-13 | **FAIL** | axe `color-contrast` [serious] violation. Root cause: force-dark broken — page renders in light mode, gold-on-light fails WCAG 1.4.3. Affected: "New conversation" button, chartMeta text, one sm:block element. |
| R2-V-14 | SKIP | No citation markers (`[signal:…]`) found in test conversation messages; no chips rendered. Cannot test reskin. Static: `CitationChip.tsx` uses `--cite-signal/asset/chunk` tokens (hue 50–80 range), not amber/sky/violet. |
| R2-V-15 | PASS | `≋ signal · ⊞ asset · § chunk` legend visible in WelcomeGreeting. ✓ |
| R2-V-16 | SKIP | No citation chips to click; panel width not testable. Static: `max-w-md sm:max-w-lg lg:max-w-xl` → 448/512/576px all ≥ 448px (28rem). |
| R2-V-17 | SKIP | No citation chips to trigger focus trap. Static code review: focus trap implemented in `CitationPreview.tsx` (Tab/Shift-Tab cycle, Escape restores focus). |
| R2-V-18 | PASS | Double-click on conversation title h1: inline input appeared and became active. ✓ |
| R2-V-19 | PASS | At 375×812: "1984-02-05 · Bhubaneswar" visible in header. `display: block`, not hidden. ✓ |
| R2-V-20 | PARTIAL PASS | `shared/ChatMessage.tsx` imported only by `BuildChat.tsx` (must_not_touch); `shared/StreamingCursor.tsx` and `shared/ToolCallAccordion.tsx` imported only within `shared/ChatMessage.tsx`. Correct intentional retention documented in R2 close report §B.2. Zero consume-path imports. |

---

## §3 — Critical investigation answers

### §3.1 — Methodology block plumbing

**Verdict: `methodology_block` is absent throughout the stack. The expander is structurally non-functional.**

Trace:

1. **Synthesis pipeline** (`platform/src/lib/synthesis/`): `grep -r "methodology_block"` → zero hits. The orchestrator never produces this field.

2. **API route** (`platform/src/app/api/chat/consume/route.ts`): Both code paths (v1 legacy, v2 `NEW_QUERY_PIPELINE_ENABLED`) emit `messageMetadata` only for `part.type === 'start'` and `part.type === 'finish'`:
   - v2 first turn: `{ conversationId, model, pipeline: 'v2' }`
   - v2 subsequent: `{ model, pipeline: 'v2' }`
   - v1: `{ model }` (+ `{ truncated: true }` on max-token hit)
   - **`methodology_block` is never emitted in any path.**

3. **Client hook** (`platform/src/hooks/useChatSession.ts`): `onFinish` only reads `metadata.conversationId` for URL sync. All other metadata fields pass through the AI SDK `useChat` message store untouched.

4. **Client component** (`platform/src/components/chat/AssistantMessage.tsx:76`): `metadata.methodology_block?: string` typed, then `methodologyBlock={metadata.methodology_block ?? null}` passed to `DisclosureTierBadge`. Since the field is never populated, the expander receives `null` and renders nothing.

**Required fix**: Add `methodology_block` emission to the v2 synthesis orchestrator result, then include it in the `messageMetadata` callback on `part.type === 'finish'`. R3 or a targeted patch.

---

### §3.2 — shared/* retention

Import graph:

| File | Imported by | In production? |
|---|---|---|
| `shared/ChatMessage.tsx` | `build/BuildChat.tsx` (must_not_touch) | Yes — BuildChat path only |
| `shared/StreamingCursor.tsx` | `shared/ChatMessage.tsx` only | Transitive; yes via BuildChat |
| `shared/ToolCallAccordion.tsx` | `shared/ChatMessage.tsx` only | Transitive; yes via BuildChat |

**Conclusion**: Retention is correct. All three form a cluster used exclusively by BuildChat. No consume-path imports exist. No broken imports introduced by R2.

---

### §3.3 — VirtualizedMessageList aria-live

**Resolved by R2.** `VirtualizedMessageList.tsx` scroll container (`div.relative.flex-1.overflow-y-auto`) has no `aria-live` attribute. The `-1 LOC` noted in R2 close report §A was effective. axe scan also confirms no misplaced `aria-live` violation.

---

### §3.4 — Pre-existing test failures

| Test | File | Classification | Rationale |
|---|---|---|---|
| `astrologer can create a client…` | `tests/e2e/clients.spec.ts` | Environmental | Playwright spec imported into vitest context. Error: "Playwright Test did not expect test() to be called here." Wrong runner, not a product bug. |
| `operational gradient flags default to false` | `tests/unit/config/index.test.ts` | Brittle test | Phase 11A cutover set `NEW_QUERY_PIPELINE_ENABLED=true` as default. Test asserts `false`. Test needs updating to match new intended default. |
| `runParityCheck — FAIL: missing_from_manifest > detects drift…` | `src/scripts/manifest/__tests__/parity_validator.test.ts` | Product issue | Parity count assertion fails; manifest state diverged from test fixture. |
| `runParityCheck — report structure > GOVERNANCE_CLOSED artifacts…` | `src/scripts/manifest/__tests__/parity_validator.test.ts` | Product issue | GOVERNANCE_CLOSED count mismatch in report structure. |
| `buildTools > read_document > returns document content` | `tests/unit/lib/claude/build-tools.test.ts` | Mock issue | `chartDocsBucket is not a function` — mock for GCS bucket not wired correctly after refactor. |
| `buildTools > read_document > returns error when document not found` | `tests/unit/lib/claude/build-tools.test.ts` | Mock issue | Error message mismatch: expected `'Document not found: missing'`, got `'Document not found'`. Cascades from above mock failure. |

---

### §3.5 — Force-dark hydration

**Zero hydration warnings captured.** However, force-dark silently fails without any React error:

- After full page load + 3s wait, `document.documentElement.className` = `"…font-vars… light"` (no `dark` class).
- Both `ConsumeForceDark` (in `ConsumeChat.tsx`) and `ForceDarkMode` (in `consume/layout.tsx`) use `useEffect` to call `root.classList.remove('light'); root.classList.add('dark')`.
- Root cause: `next-themes` `ThemeProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem` also manages the `<html>` class via its own `useEffect`. When the system preference is `light`, next-themes fires its sync effect **after** `ForceDarkMode`'s effect, re-adding `light` and removing `dark`.
- This is a useEffect ordering race, not a hydration mismatch. No warning is emitted. The failure is invisible in CI.
- **Required fix**: Use `useTheme({ setTheme: 'dark' })` or `useTheme()` from `next-themes` directly inside `ConsumeForceDark` to set `dark` through next-themes' own state machine, which prevents the race. Alternatively, add a `forcedTheme="dark"` prop to `ThemeProvider` when under the consume route.

---

### §3.6 — Pre-existing lint

Two pre-existing errors (not introduced by R1 or R2):

| File | Line | Rule | Classification |
|---|---|---|---|
| `platform/src/components/consume/ConsumeChat.tsx` | 148 | `@typescript-eslint/no-set-state-in-effect` | Correctness: `setValidatorFailures()` called synchronously inside `useEffect` body without being wrapped in the cleanup path. Risk: cascading re-renders. Not introduced by R2. |
| `platform/src/components/build/RegistryTable.tsx` | 631 | `@typescript-eslint/no-this-alias` | Style: `const self = this` in a class method (must_not_touch build portal). Low risk. |

Additional unused variable introduced by R2 (warning, not error): `audienceTier` destructured at `ConsumeChat.tsx:80` but no longer used after the sticky banner removal. Tracked as R2 deferred item (see R2 close §C).

---

## §4 — Fresh audit findings

### F-V-C-1 (Critical) — Force-dark broken: consume renders in light mode

**Where**: `platform/src/components/consume/ConsumeForceDark.tsx`, `platform/src/components/auth/ForceDarkMode.tsx`, `platform/src/app/providers.tsx`

**What**: The entire consume surface renders in light mode (html class = `light`). Gold brand tokens (`--brand-gold`, `--brand-charcoal`, gradient CTAs) are defined under `.dark` scope in `globals.css` and are not active.

**Why it matters**: Every visual check relying on dark-mode rendering (gold gradient send button, gold focus rings, gold caret, dark prose background, dark suggestion cards) is broken in production. WCAG contrast violations are a direct consequence.

**Suggested fix**: Replace direct DOM mutation with `useTheme` from `next-themes`:
```tsx
import { useTheme } from 'next-themes'
export function ConsumeForceDark() {
  const { setTheme, theme } = useTheme()
  const prev = useRef(theme)
  useEffect(() => { prev.current = theme; setTheme('dark') }, [])
  useEffect(() => () => { if (prev.current) setTheme(prev.current) }, [])
  return null
}
```
This routes the change through next-themes' own state machine and prevents the race.

---

### F-V-H-1 (High) — Metadata strip key mismatch: strip always empty

**Where**: `platform/src/app/api/chat/consume/route.ts:210–218` (server) vs `platform/src/components/chat/AssistantMessage.tsx:71–76` (client)

**What**: Server emits `{ model: modelId }`. Client reads `metadata.model_id`. Mismatch → badge never renders. Same for `style_id` (never sent), `disclosure_tier` (never sent).

**Why it matters**: Per-message metadata strip (model, style, tier) — a R2 acceptance criterion — is always empty. Feature delivered at code level but silently non-functional.

**Suggested fix**: Either (a) change server to emit `model_id: modelId, style_id: style` in the `messageMetadata` callback, or (b) change client to read `metadata.model`. Option (a) is safer (adds fields without removing existing ones).

---

### F-V-H-2 (High) — methodology_block never emitted by synthesis pipeline

**Where**: `platform/src/lib/synthesis/` (no hits), `platform/src/app/api/chat/consume/route.ts:207–217`

**What**: The methodology expander in `DisclosureTierBadge` is gated on `methodologyBlock !== null`, which is always null because the server never emits this field. The feature was implemented on the client (R1 T7) without a corresponding server change.

**Why it matters**: Super-admin users expecting to see the synthesis methodology will see nothing. This was the primary super_admin UX feature of R1.

**Suggested fix**: (1) Add methodology capture to the synthesis orchestrator output; (2) include `methodology_block` in `messageMetadata` on `part.type === 'finish'`. Requires server-side change (outside R1/R2 scope; R3 candidate).

---

### F-V-H-3 (High) — Duplicate `<h1>` in both empty and message states

**Where**: `platform/src/components/chat/WelcomeGreeting.tsx:71`, `platform/src/components/chat/ChatShell.tsx:149`, `platform/src/components/chat/Markdown.tsx:59–60`, `platform/src/components/chat/StreamingMarkdown.tsx:64–65`

**What**: 
- **Empty state**: ChatShell h1 (chart name "Abhisek Mohanty") + WelcomeGreeting `<motion.h1>` greeting → 2 h1s.
- **Message state**: ChatShell h1 (conversation title) + markdown `#` headings rendered as `<h1>` in message body → 2+ h1s.

**Why it matters**: WCAG 2.4.6 (page sections), ARIA authoring practice: one `<h1>` per page.

**Suggested fix**: (a) Change `WelcomeGreeting` h1 to `<h2>` or `<p>` (the greeting is not a document title). (b) Downshift markdown headings in message context: `#` → `<h2>`, `##` → `<h3>`, etc. via custom `components` in ReactMarkdown.

---

### F-V-M-1 (Medium) — Timestamps never render

**Where**: `platform/src/app/api/chat/consume/route.ts`, `platform/src/components/chat/AssistantMessage.tsx:59–63`

**What**: `AssistantMessage` reads `meta.created_at ?? message.created_at` to render a timestamp. Neither field is sent in the stream metadata. No `<time>` elements appear.

**Suggested fix**: Emit `created_at: new Date().toISOString()` in `messageMetadata` on `part.type === 'finish'`, or pull from DB `created_at` when loading initial messages.

---

### F-V-M-2 (Medium) — Sidebar `<aside>` nested inside `<div>`, not top-level

**Where**: Sidebar component (confirmed by axe `landmark-complementary-is-top-level` violation)

**What**: The `<aside>` element (conversation sidebar) is wrapped inside container divs rather than being a direct child of `<body>` or `<main>`. WCAG complementary landmark should be at the top structural level.

**Suggested fix**: Ensure the aside is a direct child of the page body/layout or restructure the landmark hierarchy.

---

### F-V-M-3 (Medium) — `Sigil.tsx` is dead code

**Where**: `platform/src/components/brand/Sigil.tsx`

**What**: `Sigil.tsx` was created by R1 as the canonical sigil component, but production code uses `AssistantSigil.tsx` (via `@/components/brand/AssistantSigil`). `Sigil.tsx` has zero production imports.

**Suggested fix**: Unify `Sigil.tsx` and `AssistantSigil.tsx` into one canonical component. Deferred to R3 cleanup.

---

### F-V-M-4 (Medium) — `audienceTier` prop unused in `ConsumeChat`

**Where**: `platform/src/components/consume/ConsumeChat.tsx:67,80`

**What**: `audienceTier` is declared in `Props` and destructured, but no longer has any effect after the sticky banner was removed in R2. Unused variable warning in lint output.

**Suggested fix**: Remove from Props interface and destructuring. R3 cleanup.

---

### F-V-L-1 (Low) — "Retry" label vs spec's "Regenerate"

**Where**: `platform/src/components/chat/MessageActions.tsx:42`

**What**: The regenerate action button is labeled `aria-label="Retry"`. The R2 brief specified `/regenerate/i` matching. Minor semantic difference — the action works, label is ambiguous.

**Suggested fix**: Change to `aria-label="Regenerate"` to match specification and improve screen-reader UX.

---

## §5 — Accessibility scan output

Scanned: empty consume state + conversation-with-messages state. Zero critical violations.

### State A — Empty consume

| Severity | ID | WCAG | Description | Affected element |
|---|---|---|---|---|
| serious | `color-contrast` | 1.4.3 | Foreground/background contrast below 4.5:1 | `.border-[var(--brand-gold-hairline)]` (New conversation button), `.tracking-[0.24em]` (chartMeta text) |
| moderate | `landmark-complementary-is-top-level` | — | `<aside>` not at top structural level | `.text-sidebar-foreground` (sidebar) |

### State B — Conversation with messages

| Severity | ID | WCAG | Description | Affected element |
|---|---|---|---|---|
| serious | `color-contrast` | 1.4.3 | Same as State A | Same nodes + `.sm:block` hidden-on-mobile text |
| moderate | `landmark-complementary-is-top-level` | — | Same as State A | Same sidebar `<aside>` |

**Root cause of all contrast failures**: Force-dark broken → light mode → gold tokens on near-white background fail WCAG 1.4.3. If force-dark is fixed, contrast violations are expected to resolve for dark mode rendering.

State C (validator-failure) not tested — see §3.4.

---

## §6 — Console errors collected

**Zero console errors or warnings** captured across all test states and viewports (empty consume, conversation with messages, 375px mobile, 768px tablet).

**Zero hydration warnings** captured. The force-dark failure is a silent client-side useEffect ordering issue, not a hydration mismatch — React does not warn about it.

---

## §7 — Recommendation

**Fix items A/B/C before R3:**

**A (blocker)** — Fix force-dark. Without it, the entire consume brand (gold gradients, dark background, dark prose) is broken in production. Fix via `useTheme` from next-themes rather than direct DOM mutation. Estimated: ~15 min.

**B (blocker)** — Fix metadata key mismatch (`model_id`/`model`). The per-message metadata strip is a R2 acceptance criterion that is silently non-functional. Fix: emit `model_id` on server side or read `model` on client side. Estimated: ~5 min each.

**C (blocker)** — Fix duplicate `<h1>`. Both empty-state (WelcomeGreeting h1 + ChatShell h1) and message-state (ChatShell h1 + markdown `#` headings as h1) violate single-h1 rule. Fix: downgrade WelcomeGreeting to h2; add heading-level downshift to Markdown/StreamingMarkdown. Estimated: ~20 min.

**Deferred to R3 backlog** (non-blocking but tracked):
- methodology_block plumbing (requires synthesis changes — larger scope)
- Timestamps (requires server metadata change)
- Sidebar aside landmark structure
- Sigil.tsx deduplication
- audienceTier prop removal
- "Retry" → "Regenerate" label

---

## §8 — Screenshots index

All screenshots taken in headless Chromium. Note: all screenshots show **light mode** rendering due to force-dark failure (F-V-C-1).

| ID | File | Description |
|---|---|---|
| A1 | `platform/verification/screenshots/A1-login-1440.png` | Login page at 1440px (brand reference — dark mode working here, ForceDarkMode already applied) |
| A2 | `platform/verification/screenshots/A2-empty-consume-1440.png` | Empty consume (welcome state) at 1440px — **light mode** |
| A3 | `platform/verification/screenshots/A3-empty-consume-768.png` | Empty consume at 768px tablet |
| A4 | `platform/verification/screenshots/A4-empty-consume-375.png` | Empty consume at 375px mobile |
| A4m | `platform/verification/screenshots/A4-mobile-conversation.png` | Conversation at 375px — chartMeta visible |
| B1 | `platform/verification/screenshots/B1-conversation-1440.png` | Conversation with messages at 1440px |
| B1f | `platform/verification/screenshots/B1-conversation-full.png` | Full-page conversation (scrolled) |
| B2 | `platform/verification/screenshots/B2-message-hover.png` | Message hover state showing action buttons |
| D1 | `platform/verification/screenshots/D1-sidebar-with-kebab.png` | Sidebar with conversations and kebab menu open |
| D2 | `platform/verification/screenshots/D2-rename-dialog.png` | Rename dialog (shadcn Dialog, not native prompt) |
| D3 | `platform/verification/screenshots/D3-delete-dialog.png` | Delete confirmation dialog |

Screenshots C1 (validator-failure) and C2 (citation panel) not captured — validator failure could not be triggered without LLM synthesis; no citation chips found in test conversation messages.
