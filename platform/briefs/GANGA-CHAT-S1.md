---
status: COMPLETE
session_id: GANGA-CHAT-S1
session_scope: Chat interface hardening — error states, queryId metadata, streaming consistency, UX polish
authored: 2026-05-05
authored_by: Claude Sonnet 4.6 (Cowork audit session)
depends_on: GANGA-TRACE-S1 (run after trace session; shares no file conflicts)
model: claude-sonnet-4-6
---

# CLAUDECODE_BRIEF — GANGA-CHAT-S1

## §0 — Governing scope

Engineering-domain session. Do NOT touch `00_ARCHITECTURE/`, `01_FACTS_LAYER/`,
`06_LEARNING_LAYER/`, or `platform/src/lib/pipeline/**`.

Trigger phrase: `"Read platform/BRIEFS/GANGA-CHAT-S1.md and execute it."`

---

## §1 — Background

Audit of the chat interface (2026-05-05) found four classes of issues that degrade
the user experience without being blocked by GANGA-TRACE-S1 work:

1. **Error states are silent** — when `status === 'error'` (AI SDK error), the UI
   shows nothing actionable. There is no error message, no retry button, and
   `canSend` silently allows re-send. The user has no idea what went wrong.

2. **Legacy pipeline missing queryId in metadata** — the legacy streamText path
   (lines 877–1011 of `consume/route.ts`) never puts `queryId` in
   `messageMetadata`. So even if `NEW_QUERY_PIPELINE_ENABLED=true` is the current
   production state, any fallback to the legacy path leaves `currentQueryId=undefined`
   in `useChatSession`, making the trace panel unable to connect.

3. **`editAndResubmit` doesn't reset queryId** — when a user edits and re-sends
   an earlier message, `currentQueryId` retains the previous query's ID. The trace
   drawer continues showing the old query's trace while the new one runs.

4. **`smoothStream` inconsistency** — the v2 pipeline applies
   `experimental_transform: smoothStream({ delayInMs: 20, chunking: 'word' })`.
   The legacy streamText path does not. This creates a jarring difference in
   rendering smoothness when the pipeline falls back.

---

## §2 — Changes

### CHANGE-1 — Error state UI in ConsumeChat

**File:** `platform/src/components/consume/ConsumeChat.tsx`

**Problem:** When `chat.status === 'error'`, nothing visually indicates the failure.
The input remains active, the user can re-send, but there is no error message.

**Fix:** Add an error banner between the message list and the input bar. The banner:
- Is visible only when `status === 'error'` and `error` is non-null
- Shows a concise, user-friendly message derived from the error
- Has a "Try again" button that calls `chat.regenerate()` or re-sends the last
  user message
- Has an "×" dismiss button that clears the error state via `chat.setMessages`
  (truncate to the last successful assistant message)

The error message mapping:

```typescript
function friendlyErrorMessage(err: Error | undefined): string {
  if (!err) return 'Something went wrong. Please try again.'
  const msg = err.message.toLowerCase()
  if (msg.includes('rate') || msg.includes('429')) {
    return 'The model is busy right now. Wait a few seconds and try again.'
  }
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return 'The request took too long. Try a shorter question or switch to a faster model.'
  }
  if (msg.includes('context') || msg.includes('token') || msg.includes('length')) {
    return 'The conversation is too long. Start a new conversation to continue.'
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Network error. Check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}
```

**Error banner HTML structure** (use existing Tailwind classes from the file):
```tsx
{status === 'error' && error && (
  <div className="mx-4 mb-2 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 flex items-start gap-3">
    <span className="text-red-400 text-sm flex-1">
      {friendlyErrorMessage(error)}
    </span>
    <button
      onClick={() => regenerate()}
      className="text-xs text-red-300 hover:text-red-100 underline shrink-0"
    >
      Try again
    </button>
    <button
      onClick={() => {
        // Truncate to last assistant message, clearing the error state
        const lastAssistant = [...messages].reverse().findIndex(m => m.role === 'assistant')
        if (lastAssistant >= 0) {
          setMessages(messages.slice(0, messages.length - lastAssistant))
        }
      }}
      className="text-xs text-red-400/60 hover:text-red-300 shrink-0"
    >
      ✕
    </button>
  </div>
)}
```

Place this immediately above the `ChatInput` component in the render tree.

Also: expose `regenerate` and `setMessages` from `useChatSession` return if not
already exposed. Looking at the hook's return: `regenerate` ✅ already exposed,
`setMessages` ✅ already exposed.

---

### CHANGE-2 — Legacy pipeline: emit queryId in messageMetadata

**File:** `platform/src/app/api/chat/consume/route.ts`

**Problem:** The legacy streamText path (lines ~877–1011, the block after the
`NEW_QUERY_PIPELINE_ENABLED` branch) creates `const queryId = crypto.randomUUID()`
at line 878 but never puts it in `messageMetadata`. The `start` part metadata only
carries `conversationId`, `model`, and `stack`.

**Fix:** In the legacy path's `toUIMessageStreamResponse` `messageMetadata` callback:

```typescript
// Legacy path — find this block:
messageMetadata: ({ part }) => {
  if (part.type === 'start' && isFirstTurn) {
    return { conversationId: finalConversationId, model: modelId, stack: selectedStack }
  }
  if (part.type === 'start') {
    return { model: modelId, stack: selectedStack }
  }
  // ...
}

// Change to:
messageMetadata: ({ part }) => {
  if (part.type === 'start' && isFirstTurn) {
    return { conversationId: finalConversationId, model: modelId, stack: selectedStack, queryId }
  }
  if (part.type === 'start') {
    return { model: modelId, stack: selectedStack, queryId }
  }
  // ...
}
```

This ensures `useChatSession`'s `useEffect` that extracts `meta?.queryId` works
for the legacy path too.

---

### CHANGE-3 — useChatSession: reset queryId on editAndResubmit

**File:** `platform/src/hooks/useChatSession.ts`

**Problem:** `editAndResubmit` truncates messages and calls `chat.sendMessage`.
The new message will arrive with a new `queryId` in its metadata. However,
between the edit call and the new message arriving, `currentQueryId` retains
the previous query's ID. The trace drawer opens the OLD trace while the new
query is running. This causes the user to see stale trace data.

**Fix:** In `editAndResubmit`, reset `currentQueryId` to `undefined` before sending:

```typescript
const editAndResubmit = useCallback(
  (id: string, newText: string) => {
    const idx = chat.messages.findIndex(m => m.id === id)
    if (idx === -1) return
    const truncated = chat.messages.slice(0, idx)
    chat.setMessages(truncated)
    // Reset queryId so TracePanel clears and waits for the new query's ID
    lastSeenQueryId.current = undefined
    setCurrentQueryId(undefined)
    chat.sendMessage(
      { text: newText },
      { body: { chartId, conversationId: persistedId, stack, style } }
    )
  },
  [chat, chartId, persistedId, stack, style]
)
```

Also add the same reset to `regenerate`:

```typescript
const regenerate = useCallback(() => {
  lastSeenQueryId.current = undefined
  setCurrentQueryId(undefined)
  chat.regenerate({ body: { chartId, conversationId: persistedId, stack, style } })
}, [chat, chartId, persistedId, stack, style])
```

---

### CHANGE-4 — Legacy pipeline: add smoothStream

**File:** `platform/src/app/api/chat/consume/route.ts`

**Problem:** Legacy streamText call does not apply `smoothStream`. When the v2
pipeline is disabled or falls through, streaming text appears as raw chunks
rather than smooth word-by-word rendering.

**Fix:** Add the same `experimental_transform` used in the v2 path:

```typescript
// In the legacy streamText call, add:
experimental_transform: smoothStream({ delayInMs: 20, chunking: 'word' }),
```

`smoothStream` is already imported at the top of the file (it's used in the v2
path's synthesis orchestrator). Verify it's in the import list; if not, add it
from `'ai'`.

---

### CHANGE-5 — ConsumeChat: surface model/stack name in chat header

**File:** `platform/src/components/consume/ConsumeChat.tsx`

**Problem (UX polish):** Users who switch stacks don't have a clear indicator of
which model they're currently talking to. The stack selector exists but the
current-model name is not visible in the chat thread itself.

**Fix:** In the chat input area (near the send button or below it), add a compact
model indicator:

```tsx
<span className="text-[10px] text-brand-gold/40 font-mono ml-2">
  {currentModelLabel ?? selectedStack}
</span>
```

Where `currentModelLabel` is derived from the last assistant message's metadata:
```typescript
const lastModelId = [...messages].reverse()
  .find(m => m.role === 'assistant')
  ?.metadata?.model as string | undefined
const lastStack = [...messages].reverse()
  .find(m => m.role === 'assistant')
  ?.metadata?.stack as string | undefined
```

Show as `"Opus 4.7 · Anthropic"` or `"Nemotron 120B · NIM"` using
`getModelMeta(lastModelId)?.label` and `PROVIDER_LABEL[getModelMeta(lastModelId)?.provider]`.

This is a UX enhancement — keep it minimal and non-intrusive.

---

## §3 — Acceptance criteria

### AC.1 — Error banner visible on synthesis failure

Simulate a synthesis error (e.g., by temporarily setting an invalid API key for
one stack). The chat must show the error banner with a friendly message and
"Try again" / "✕" controls. No raw error objects or stack traces should be visible
to the user.

### AC.2 — Legacy queryId in metadata

In a test with `NEW_QUERY_PIPELINE_ENABLED=false` (or the v2 branch disabled),
the AI SDK `start` part metadata must include `queryId`. Verify via
`console.log(message.metadata)` in `useChatSession.onFinish`.

### AC.3 — editAndResubmit clears trace

After editing and re-sending a message, `currentQueryId` must be `undefined`
momentarily (trace drawer shows "no query selected") then update to the new
query's ID when the new `start` part arrives.

### AC.4 — Regenerate clears trace

Same as AC.3 but triggered by the regenerate action.

### AC.5 — smoothStream in legacy path

`streamText` call in the legacy path must include `experimental_transform:
smoothStream(...)`. Verify by code inspection (`npx grep` or Read).

### AC.6 — Model indicator visible

In the chat UI, after a response, a compact `"Opus 4.7 · Anthropic"` (or
equivalent for the active stack) label is visible near the input bar.

### AC.7 — tsc clean

`npx tsc --noEmit` returns 0 errors.

### AC.8 — Commit

Single commit:
```
feat(chat): interface hardening — error states, queryId metadata, UX polish

CHANGE-1: Error banner in ConsumeChat with friendly messages + retry/dismiss
CHANGE-2: Legacy pipeline emits queryId in messageMetadata (start part)
CHANGE-3: editAndResubmit + regenerate reset currentQueryId to prevent stale trace
CHANGE-4: smoothStream applied to legacy streamText path
CHANGE-5: Model/stack indicator label in chat input area
```

---

## §4 — File scope

### must_not_touch
```
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
00_ARCHITECTURE/**
06_LEARNING_LAYER/**
platform/src/lib/pipeline/**
platform/src/lib/synthesis/**
platform/src/lib/retrieve/**
platform/src/lib/trace/**
platform/src/components/trace/**
platform/src/lib/models/**
platform/src/lib/config/**
```

### may_touch
```
platform/src/components/consume/ConsumeChat.tsx    (CHANGE-1, CHANGE-5)
platform/src/hooks/useChatSession.ts               (CHANGE-3)
platform/src/app/api/chat/consume/route.ts         (CHANGE-2, CHANGE-4)
platform/tests/hooks/**                            (add queryId reset tests)
```

---

## §5 — Hard constraints

1. `friendlyErrorMessage` must not expose raw error messages, stack traces, or
   internal identifiers to the user.
2. The `queryId` in legacy metadata must use the same UUID already assigned at
   line 878 — do NOT generate a new one.
3. The model indicator (CHANGE-5) must be read-only; it is not a clickable model
   picker. The stack selector (if it exists in the UI) handles model switching.
4. No new feature flags.

---

*End of CLAUDECODE_BRIEF — GANGA-CHAT-S1 (authored 2026-05-05)*
