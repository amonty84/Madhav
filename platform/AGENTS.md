<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Locked UI design decisions (Consume module)

These three behaviors were silently reverted in commits `a37ede8` (parking bundle, 2026-05-01) and `eb427e3` ("four post-redesign tweaks", 2026-05-01) after the Portal Redesign workstream closed (PORTAL_REDESIGN_TRACKER ARCHIVED v1.0.12, 2026-04-30). They were restored 2026-05-02 by native direction. The PORTAL_REDESIGN_TRACKER is sealed and cannot record this; this section is the durable lock surface for the platform repo.

Any change to one of these three lines must be raised with the native first. The corresponding code site carries a matching `// LOCKED` comment.

| # | Decision | File | Anchor |
|---|---|---|---|
| 1 | Left sidebar is **auto-collapsible**, default collapsed (`useState(true)`). The hover strip on the left edge expands it. Do not flip the default to `false`. | `src/components/consume/ConsumeChat.tsx` | `desktopSidebarCollapsed` initial state |
| 2 | The Trace button (super_admin + pipelineEnabled) lives in the **top-right header** via `ChatShell`'s `headerActions` prop, **not** in the input toolbar above the composer. Do not move it back into the bottom toolbar. | `src/components/consume/ConsumeChat.tsx` | `<ChatShell ... headerActions={...}>` |
| 3 | The composer textarea is **fixed-size** (plain `<textarea rows={3}>` with `overflow-y-auto`). Do not reintroduce `react-textarea-autosize`, `minRows`/`maxRows`, or CSS `field-sizing: content`. Long prompts scroll inside the fixed box. | `src/components/chat/Composer.tsx` | composer `<textarea>` |

If a future redesign reopens any of these three decisions, the right sequence is: (a) raise it with the native, (b) author a new versioned design-decisions artifact under `00_ARCHITECTURE/` (the redesign tracker is archived and will not be reopened), (c) update this section to point at the new artifact, (d) only then change the code.
