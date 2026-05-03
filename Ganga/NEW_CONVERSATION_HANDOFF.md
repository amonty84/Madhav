---
artifact: NEW_CONVERSATION_HANDOFF.md
version: 1.0
authored_by: Claude (Cowork — GANGA-OPEN session) 2026-05-04
purpose: >
  Step-by-step guide for picking up Project Ganga in a fresh Claude conversation.
  Everything a new Ganga session needs to know is already in the governance files
  and memory — this guide tells you exactly how to activate it.
---

# How to Pick Up Project Ganga in a New Conversation

## What carries over automatically

Claude's persistent memory has already been updated in this session. When you open
any new conversation with the Madhav workspace selected, Claude will have:

- Project Ganga state (what it is, 114 items, 11 workstreams, gate structure)
- The production blocker status (deepseek-v4-flash → PF-S1 brief ready)
- The Opus critical analysis findings (Workstream L, synthesis quality gap)
- The gate sequence (G0 → G1 → G2 → G3 → G4)
- All BHISMA history that led to Ganga

## Step-by-step: opening a new Ganga conversation

### Step 1 — Open new Claude conversation
- Open the Claude desktop app
- Click "New Conversation" (or close this thread and start fresh)
- In the workspace selector, choose **Madhav** (same folder as this conversation)

### Step 2 — Paste the magic phrase

Copy and paste this exactly as your first message:

```
GANGA

Pick up Project Ganga. Read PROJECT_GANGA_BOOTSTRAP.md in 00_ARCHITECTURE/ first,
then orient from GANGA_PHASE_TRACKER.md and PROJECT_GANGA_PLAN_v1_0.md.
Tell me current state, open items, and what the next session should be.
```

Claude will:
1. Read PROJECT_GANGA_BOOTSTRAP.md → get oriented
2. Read GANGA_PHASE_TRACKER.md → see current gate + open items
3. Read PROJECT_GANGA_PLAN_v1_0.md → understand full 114-item scope
4. Propose a thread name (GANGA-G0-STACK-AUDIT)
5. Report state + recommend next action

### Step 3 — Claude proposes the thread name

The first thing Claude will tell you is the Cowork thread name for this session.
Accept it. It should be: `GANGA-G0-STACK-AUDIT` (since G0 is the first gate).

### Step 4 — Tell Claude what you want to do

After orientation, direct Claude to the next action. Options:

**Option A — Author the G0 brief (LLM stack audit):**
```
Author CLAUDECODE_BRIEF_GANGA_G0_S1_v1_0.md for the Gate 0 LLM stack audit.
Scope: K.1 (model × stack × role matrix), K.2 (NIM model selection), K.3 (MODEL_REGISTRY_v1_0.md).
This is the blocking prerequisite for everything else.
```

**Option B — Go straight to executing PF-S1 (if G0 already done):**
```
G0 is complete. Execute the production fix.
Read CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md in 00_ARCHITECTURE/briefs/ and
give me the Claude Code trigger phrase to run it in Antigravity.
```

**Option C — Author the synthesis prompt (Gate 3 work):**
```
Jump to Gate 3. Author SYNTHESIS_PROMPT_v1_0.md following the L.1 spec
in PROJECT_GANGA_PLAN_v1_0.md Workstream L — L.1.1 through L.1.8.
This is the highest-value artifact in the entire project.
```

---

## What lives where (quick reference)

| What you need | Where to find it |
|---|---|
| Current state + next action | `Ganga/GANGA_PHASE_TRACKER.md` |
| Full 114-item scope | `Ganga/PROJECT_GANGA_PLAN_v1_0.md` |
| Session naming + file locks | `Ganga/PROJECT_GANGA_PROTOCOL.md` |
| Session history | `Ganga/PROJECT_GANGA_SESSION_LOG.md` |
| Production fix brief | `Ganga/CLAUDECODE_BRIEF_BHISMA_PF_S1_v1_0.md` |
| Critical gap analysis (HTML) | `Ganga/GANGA_CRITICAL_GAP_ANALYSIS.html` |
| Project overview (HTML) | `Ganga/GANGA_PROJECT_OVERVIEW.html` |
| Canonical governance | `00_ARCHITECTURE/PROJECT_GANGA_*.md` + `00_ARCHITECTURE/GANGA_PHASE_TRACKER.md` |

Note: The files in `Ganga/` are copies for easy access. The canonical versions
live in `00_ARCHITECTURE/` and are what Claude Code sessions read.

---

## What happened in the prior conversation (BHISMA → Ganga)

| Session | What was accomplished |
|---|---|
| BHISMA Wave 1 (2026-05-01) | Model registry, NVIDIA NIM, planner code, Trace Command Center |
| BHISMA Wave 2 (2026-05-03) | UQE, budget arbiter, MON tables, EVAL golden set, planner prompt v1.1→v1.6 |
| BHISMA Phase 1 (2026-05-04) | CI gate, cleanup, TOOLS-S1 logging, TRACE-S1 planner params |
| BHISMA → Ganga rename (2026-05-04) | Opus critical analysis, Workstream L identified, governance docs authored |

**The one thing that has never worked in production:** The LLM planner. `deepseek-v4-flash`
is an invalid model ID. It routes to `deepseek-reasoner` which rejects `toolChoice`. 100%
fallback to classify() on every query since LLM_FIRST_PLANNER_ENABLED was flipped on. The
brief to fix this (PF-S1) is ready and waiting in `Ganga/` and `00_ARCHITECTURE/briefs/`.

---

## Conversation name for the new thread

Suggest this as the Cowork thread name when starting:

`GANGA-G0-STACK-AUDIT`

Or if you're jumping straight to G1 execution:

`GANGA-G1-PROD-FIX`

---

*This file lives in Ganga/ for easy human reference. It is not a governance artifact
— the canonical governance entry point is PROJECT_GANGA_BOOTSTRAP.md.*
