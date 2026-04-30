---
artifact: NAK_CLAUDECODE_BRIEF
status: COMPLETE
authored_on: 2026-04-30
authored_by: Cowork (Opus)
project: NAK — Nakula
wave_run: W2-R3
title: Component Fix — A11y and Error Boundaries
exec_brief: 00_NAK/NAK_EXEC_BRIEF_W2_R3_COMPONENT_FIX_v1_0.md
branch: nak/w2-r3-component-fix
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r3
---

# NAK CLAUDECODE_BRIEF — W2-R3 Component Fix

Session type: W2 Fix Run — code changes permitted within may_touch scope.

## Acceptance criteria

- [ ] AC-1: All HIGH a11y findings fixed (A11Y-1, A11Y-2, A11Y-3)
- [ ] AC-2: 5 error.tsx boundaries created (dashboard, admin, audit, build, share)
- [ ] AC-3: All MEDIUM a11y findings fixed (A11Y-4 through A11Y-7) + LOW items
- [ ] AC-4: Missing page-level metadata titles added
- [ ] AC-5: NAK_COMPONENT_AUDIT_v1_0.md elevated DRAFT → FINAL
- [ ] AC-6: Closure report 00_NAK/reports/NAK_COMPONENT_FIX_REPORT_W2_R3_v1_0.md committed
- [ ] AC-7: NAK_TRACKER_v1_0.md W2-R3 row status → closed
- [ ] AC-8: npm test passes — zero new failures vs W0 baseline

## may_touch

- platform/src/components/shared/**
- platform/src/components/chat/ChatShell.tsx
- platform/src/components/chat/CommandPalette.tsx
- platform/src/components/chat/AdaptiveMessageList.tsx
- platform/src/components/consume/ConsumeChat.tsx
- platform/src/components/consume/StreamingAnswer.tsx
- platform/src/components/trace/TracePanel.tsx (aria only — no token changes, W2-R1 owns tokens)
- platform/src/app/dashboard/error.tsx (new)
- platform/src/app/admin/error.tsx (new)
- platform/src/app/audit/error.tsx (new)
- platform/src/app/clients/[id]/build/error.tsx (new)
- platform/src/app/share/[slug]/error.tsx (new)
- platform/src/app/**/layout.tsx (metadata only)
- 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md
- 00_NAK/NAK_TRACKER_v1_0.md

## must_not_touch

- platform/src/app/api/**
- platform/src/lib/**
- platform/src/app/globals.css
- platform/src/components/admin/**
- platform/src/components/trace/TracePanel.tsx style/token changes (W2-R1 territory)
- 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md
- 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md
