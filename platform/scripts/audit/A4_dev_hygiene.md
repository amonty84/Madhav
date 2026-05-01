---
phase: A.4
title: Dev Hygiene + Build Cache State
status: COMPLETE
executed_at: 2026-04-28
executor: Claude Code (Sonnet 4.6)
verdict: GREEN — no stale processes; dev:clean script added
---

# A.4 — Dev Hygiene + Build Cache State

## Stream 1 — Running Dev Processes
`pgrep -fl 'next-server|next dev'` returned no output — **no running Next.js dev server at audit time**. Clean state.

Last server (PID 62628, started Phase 13 verify session) has since exited.

## Stream 2 — .next Cache State
`.next/` directory exists but contains only `dev/` subdirectory — no `BUILD_ID` present. This is expected: `.next` was cleared during Phase 13 verify session (`rm -rf platform/.next`), and the dev server that ran after only produced the in-progress `dev/` output (no completed production build). Cache is clean.

## Stream 3 — dev:clean script added
Added to `platform/package.json`:
```json
"dev:clean": "pkill -f 'next dev' 2>/dev/null; rm -rf .next && next dev"
```

Usage: `npm run dev:clean` — kills any running `next dev` process, wipes `.next` cache, starts fresh dev server.

## Anti-pattern documentation
**Dev-server-staleness anti-pattern:** Turbopack dev server can hold cached module graphs and compiled outputs in `.next/` that diverge from current source after major changes (new env vars loaded, SQL queries changed, server components modified). Symptoms:

- Old code path executing despite edited source
- Env vars not picked up (Next.js reads `.env.local` at startup, not runtime)
- Stale type-checks from prior compilation

**Rule:** Any time env vars change or a server restart is suspected to be needed, prefer `npm run dev:clean` over `npm run dev`. The Phase 13 symptom (vector_search running with 0ms latency before `GCP_PROJECT` was added) would have been caught immediately with this habit.
