---
artifact: GANGA_INDEX.md
version: 1.0
status: CURRENT
purpose: >
  Index for the Ganga/ convenience folder. Points to canonical document locations.
  This folder holds ONLY files unique to it (HTMLs, handoff guide, active brief).
  All canonical governance MDs live in 00_ARCHITECTURE/ — read them there.
  Do not copy or maintain duplicates here.
---

# Ganga/ Folder — What Lives Here

This folder is a **human-browsing convenience folder**, not a canonical location.
Do not maintain duplicate copies of governance documents here — they will drift.

---

## Files in this folder (unique — not duplicated elsewhere)

| File | What it is |
|---|---|
| `GANGA_PROJECT_OVERVIEW.html` | Visual project overview — gate flow, workstream table, status board |
| `GANGA_CRITICAL_GAP_ANALYSIS.html` | Opus 4.7 critical gap analysis — 5 missing elements, Workstream L |
| `NEW_CONVERSATION_HANDOFF.md` | Step-by-step guide for starting a new Ganga conversation |
| `CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md` | Active G1 production fix brief (execute after G0 closes) |

---

## Canonical governance documents (read from 00_ARCHITECTURE/)

| Document | Canonical path |
|---|---|
| Bootstrap (entry point) | `00_ARCHITECTURE/PROJECT_GANGA_BOOTSTRAP.md` |
| Master plan (114 items) | `00_ARCHITECTURE/PROJECT_GANGA_PLAN_v1_0.md` |
| Protocol (naming / file locks) | `00_ARCHITECTURE/PROJECT_GANGA_PROTOCOL.md` |
| Session log (append-only) | `00_ARCHITECTURE/PROJECT_GANGA_SESSION_LOG.md` |
| Phase tracker (living status) | `00_ARCHITECTURE/GANGA_PHASE_TRACKER.md` |

---

## To pick up in a new conversation

See `NEW_CONVERSATION_HANDOFF.md` in this folder, or paste directly:

```
GANGA

Pick up Project Ganga. Read PROJECT_GANGA_BOOTSTRAP.md in 00_ARCHITECTURE/ first,
then orient from GANGA_PHASE_TRACKER.md and PROJECT_GANGA_PLAN_v1_0.md.
Tell me current state, open items, and what the next session should be.
```
