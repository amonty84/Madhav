# MARSYS-JIS Platform — Design Spec
**Date:** 2026-04-17

> This spec was produced through collaborative brainstorming. See the implementation plan at `docs/superpowers/plans/2026-04-17-amjis-platform.md`.

---

## Context

The MARSYS-JIS project is a forensic-grade astrological knowledge base (42,000+ lines of structured markdown across 5 layers). All content currently lives as flat markdown files managed through Claude Code CLI sessions. This spec defines a hosted web platform to productize it.

## Two Modules

1. **Build** — Claude-chat interface for the astrologer to construct a client's data pyramid
2. **Consume** — Claude-chat interface for clients to query insights and reports from their pyramid

## User Roles

- **Astrologer** (owner): Build + Consume access across all clients
- **Client**: Consume-only, scoped to their own chart

## App Structure

Single app, client-centric routing:
- Astrologer → Client Roster → click client → workspace (Build / Consume toggle)
- Client → directly to their Consume view

## Build Module

**Layout:** Chat (left, flex-1) + Pyramid Status panel (right, 280px)

Pyramid status shows 5 layers with badges: ✓ complete / ⟳ in-progress / ○ not started. Clicking a layer loads its documents into the chat context.

**Claude tools (read + write):**
`list_documents`, `read_document`, `create_document`, `update_document`, `append_to_document`, `update_layer_status`, `run_ephemeris`, `run_computation`, `search_in_document`, `get_pyramid_status`

**Claude config:** `claude-sonnet-4-6`, extended thinking enabled (`budgetTokens: 8000`)

## Consume Module

**Layout:** Report Library sidebar (220px, left) + Chat (flex-1, center)

Reports are clickable — open inline above chat. Domain suggestion chips in input area.

**Claude tools (read-only):**
`get_birth_data`, `get_planetary_positions`, `get_dasha_periods`, `get_layer_document`, `search_signals`, `get_domain_report`, `get_transits`, `get_pyramid_status`

**Whole-Chart-Read Protocol:** System prompt mandates `get_layer_document(L2.5, 'cgm')` call before any domain answer, mirroring MARSYS-JIS architecture §H.4.

**Claude config:** `claude-sonnet-4-6`, extended thinking disabled

## Claude API

- Vercel AI SDK (`ai` + `@ai-sdk/anthropic`), `streamText()` with tool calls
- Prompt caching: `cache_control: ephemeral` on system prompt + loaded documents
- Max tokens: 8192 (Consume), 16384 (Build)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend + API | Next.js 15 (App Router), Vercel |
| Styling | Tailwind CSS + shadcn/ui (dark theme) |
| State | Zustand + TanStack Query |
| Database + Auth + Storage | Supabase (Postgres + RLS + Storage) |
| AI | Vercel AI SDK + Anthropic SDK |
| Python Sidecar | FastAPI on Railway (wraps `.tools/` scripts) |

## Database Schema

```sql
profiles(id, role, name, created_at)
charts(id, client_id, name, birth_date, birth_time, birth_place, birth_lat, birth_lng, ayanamsa, house_system, created_at)
pyramid_layers(id, chart_id, layer, sublayer, status, version, updated_at)
documents(id, chart_id, layer, name, storage_path, version, created_at, updated_at)
conversations(id, chart_id, user_id, module, title, created_at)
messages(id, conversation_id, role, content, tool_calls, created_at)
reports(id, chart_id, domain, title, storage_path, version, created_at, updated_at)
```

**Key RLS decisions:**
- All chat persistence via server-side API routes with service role (no client-side DB writes)
- Astrologer bootstrapped via seed migration keyed to `ASTROLOGER_EMAIL` env var
- Document `name` field = canonical logical name (e.g. `cgm`); `storage_path` = actual file (e.g. `L2.5/cgm_v1.0.md`). Tools use `name`; implementation resolves via DB lookup.

## File Storage

Supabase Storage bucket `chart-documents`, structured as `/charts/{chart_id}/L1/`, `/L2/`, `/L2.5/`, `/L3/`.

## Python Sidecar

FastAPI on Railway wrapping `.tools/` scripts:
`POST /ephemeris`, `/event_chart_states`, `/eclipses`, `/retrogrades`, `/sade_sati`, `/jaimini_drishti`, `/v7_additions`

Server-side only. API-key protected.

## App Routes

```
/login
/dashboard
/clients/new
/clients/[id]/build
/clients/[id]/consume
/clients/[id]/reports/[domain]
```

## Implementation Phases

1. **Foundation** — Next.js init, Supabase schema, auth, client management, roster dashboard
2. **Python Sidecar** — FastAPI wrapping `.tools/`, deployed to Railway
3. **Build Module** — 10 Claude tools, streaming chat API, Build UI
4. **Consume Module** — 8 Claude tools, streaming chat API, Consume UI + Report Library
5. **Polish + Deploy** — RLS audit, error states, mobile, Vercel deploy, data migration

## Verification Checklist

1. New signup → `client` role → can only see their own Consume view
2. Astrologer → create client → Build chat → Claude generates document → appears in Storage + pyramid badge ✓
3. Consume chat → "What does 2027 look like?" → tool call accordion shows `get_layer_document(L2.5, cgm)` fired first
4. Build chat → Claude calls `run_ephemeris()` → Railway responds → result in chat
5. Client A session → hit `/api/documents?chart_id=<client_B_id>` → 0 rows returned
6. Two messages in same conversation → second message shows Anthropic cache hit
