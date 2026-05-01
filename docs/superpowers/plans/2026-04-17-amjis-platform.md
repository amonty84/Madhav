# MARSYS-JIS Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hosted multi-client Jyotish AI platform with a Build module (astrologer builds data pyramids via Claude chat) and a Consume module (clients query their pyramid via Claude chat + report library).

**Architecture:** Next.js 15 App Router frontend + Supabase (Postgres + Auth + Storage) + Anthropic Claude API via Vercel AI SDK with tool use + FastAPI Python sidecar on Railway for Swiss Ephemeris computations. Role-based routing: astrologer sees all clients; clients see only their own Consume view.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Vercel AI SDK, @ai-sdk/anthropic, Zustand, TanStack Query, Vitest, Playwright, FastAPI, pyswisseph, Railway, Vercel

**Spec:** `docs/superpowers/specs/2026-04-17-amjis-platform-design.md`

---

## File Map

```
platform/                               ← Next.js app root (inside /Users/Dev/Vibe-Coding/Apps/Madhav/)
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← Root layout, dark theme, TanStack Query provider
│   │   ├── page.tsx                    ← Redirect to /dashboard or /login
│   │   ├── login/
│   │   │   └── page.tsx               ← Magic link + Google OAuth login
│   │   ├── dashboard/
│   │   │   └── page.tsx               ← Client roster (astrologer) or redirect (client)
│   │   ├── clients/
│   │   │   ├── new/
│   │   │   │   └── page.tsx           ← New client onboarding form
│   │   │   └── [id]/
│   │   │       ├── layout.tsx         ← Client workspace: top bar + Build/Consume nav
│   │   │       ├── page.tsx           ← Redirect to /build
│   │   │       ├── build/
│   │   │       │   └── page.tsx       ← Build module: chat + pyramid panel
│   │   │       ├── consume/
│   │   │       │   └── page.tsx       ← Consume module: report library + chat
│   │   │       └── reports/
│   │   │           └── [domain]/
│   │   │               └── page.tsx   ← Full-page report reader
│   │   └── api/
│   │       ├── auth/
│   │       │   └── callback/
│   │       │       └── route.ts       ← Supabase OAuth callback
│   │       ├── clients/
│   │       │   └── route.ts           ← GET/POST clients (service role)
│   │       ├── charts/
│   │       │   └── [id]/
│   │       │       └── route.ts       ← GET chart details
│   │       ├── documents/
│   │       │   └── route.ts           ← GET/POST/PUT documents (service role)
│   │       ├── pyramid/
│   │       │   └── route.ts           ← GET/PUT pyramid layer status
│   │       ├── reports/
│   │       │   └── route.ts           ← GET/POST reports
│   │       ├── conversations/
│   │       │   └── route.ts           ← GET/POST conversations + messages
│   │       ├── chat/
│   │       │   ├── build/
│   │       │   │   └── route.ts       ← Build streaming chat (Vercel AI SDK + tool handlers)
│   │       │   └── consume/
│   │       │       └── route.ts       ← Consume streaming chat
│   │       └── compute/
│   │           └── [type]/
│   │               └── route.ts       ← Proxy to Python sidecar
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             ← Browser Supabase client
│   │   │   ├── server.ts             ← Server Supabase client (cookies)
│   │   │   └── types.ts              ← Generated DB types (Database interface)
│   │   ├── claude/
│   │   │   ├── build-tools.ts        ← 10 Build tool definitions + handlers
│   │   │   ├── consume-tools.ts      ← 8 Consume tool definitions + handlers
│   │   │   └── system-prompts.ts     ← Build + Consume system prompt builders
│   │   └── utils.ts                  ← Shared helpers (formatDate, etc.)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ClientCard.tsx        ← Client card with dasha state + pyramid %
│   │   │   └── ClientRoster.tsx      ← Grid of ClientCards + search
│   │   ├── build/
│   │   │   ├── BuildChat.tsx         ← Streaming chat panel for Build
│   │   │   └── PyramidStatusPanel.tsx ← Layer status badges (right panel)
│   │   ├── consume/
│   │   │   ├── ConsumeChat.tsx       ← Streaming chat panel for Consume
│   │   │   ├── ReportLibrary.tsx     ← Left sidebar: report list
│   │   │   └── ReportReader.tsx      ← Inline report markdown renderer
│   │   └── shared/
│   │       ├── ChatMessage.tsx       ← Message bubble + markdown rendering
│   │       ├── ToolCallAccordion.tsx ← Collapsed tool calls, expandable
│   │       └── StreamingCursor.tsx   ← Animated cursor during stream
│   ├── hooks/
│   │   ├── useChart.ts              ← TanStack Query hook for chart data
│   │   ├── usePyramid.ts            ← TanStack Query hook for pyramid status
│   │   └── useConversation.ts       ← Zustand store for active conversation
│   └── middleware.ts                ← Supabase auth session refresh
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql   ← All tables + RLS policies
│   │   └── 002_seed_astrologer.sql  ← Bootstrap astrologer profile
│   └── config.toml                  ← Local Supabase config
├── python-sidecar/
│   ├── main.py                      ← FastAPI app entry
│   ├── routers/
│   │   ├── ephemeris.py
│   │   ├── events.py
│   │   ├── eclipses.py
│   │   ├── retrogrades.py
│   │   ├── sade_sati.py
│   │   ├── jaimini.py
│   │   └── v7_additions.py
│   ├── Dockerfile
│   └── requirements.txt
├── tests/
│   ├── unit/
│   │   ├── lib/claude/build-tools.test.ts
│   │   ├── lib/claude/consume-tools.test.ts
│   │   └── lib/claude/system-prompts.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── clients.spec.ts
│       ├── build.spec.ts
│       └── consume.spec.ts
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── .env.local.example
```

---

## Phase 1: Foundation

**Milestone:** App boots, auth works, a client can be created, and the client roster renders.

---

### Task 1: Initialize Next.js project

**Files:** Create `platform/` directory and all config files.

- [ ] **Step 1.1: Create the Next.js app**

```bash
cd /Users/Dev/Vibe-Coding/Apps/Madhav
npx create-next-app@latest platform \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

- [ ] **Step 1.2: Install core dependencies**

```bash
cd platform
npm install @supabase/supabase-js @supabase/ssr
npm install ai @ai-sdk/anthropic
npm install @tanstack/react-query zustand
npm install react-markdown remark-gfm
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 1.3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
# Choose: Dark theme, CSS variables, Default style
```

Add components we'll need:

```bash
npx shadcn@latest add button input card badge separator scroll-area avatar dropdown-menu dialog sheet tabs toast label
```

- [ ] **Step 1.4: Create `.env.local.example`**

Create `platform/.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
ASTROLOGER_EMAIL=mail.abhisek.mohanty@gmail.com
PYTHON_SIDECAR_URL=http://localhost:8000
PYTHON_SIDECAR_API_KEY=your-sidecar-key
```

Copy to `.env.local` and fill in values after Supabase setup.

- [ ] **Step 1.5: Configure Vitest**

Create `platform/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

Create `platform/src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 1.6: Commit**

```bash
cd /Users/Dev/Vibe-Coding/Apps/Madhav/platform
git init
git add .
git commit -m "feat: initialize Next.js 15 platform with Supabase, AI SDK, shadcn"
```

---

### Task 2: Supabase schema and RLS

**Files:** `supabase/migrations/001_initial_schema.sql`, `supabase/migrations/002_seed_astrologer.sql`

- [ ] **Step 2.1: Create a Supabase project**

Go to supabase.com → New project. Copy the project URL, anon key, and service role key into `.env.local`.

- [ ] **Step 2.2: Write the schema migration**

Create `platform/supabase/migrations/001_initial_schema.sql`:

```sql
-- profiles: extends auth.users
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  role        text not null check (role in ('astrologer', 'client')) default 'client',
  name        text,
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, name)
  values (
    new.id,
    case when new.email = current_setting('app.astrologer_email', true) then 'astrologer' else 'client' end,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- charts
create table public.charts (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  birth_date   date not null,
  birth_time   time not null,
  birth_place  text not null,
  birth_lat    numeric,
  birth_lng    numeric,
  ayanamsa     text not null default 'lahiri',
  house_system text not null default 'sripathi',
  created_at   timestamptz default now()
);

-- pyramid_layers
create table public.pyramid_layers (
  id         uuid primary key default gen_random_uuid(),
  chart_id   uuid not null references public.charts(id) on delete cascade,
  layer      text not null,
  sublayer   text not null,
  status     text not null default 'not_started'
             check (status in ('not_started', 'in_progress', 'complete')),
  version    text,
  updated_at timestamptz default now(),
  unique(chart_id, layer, sublayer)
);

-- documents
create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  chart_id     uuid not null references public.charts(id) on delete cascade,
  layer        text not null,
  name         text not null,
  storage_path text not null,
  version      text not null default '1.0',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(chart_id, name)
);

-- conversations
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  chart_id   uuid not null references public.charts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id),
  module     text not null check (module in ('build', 'consume')),
  title      text,
  created_at timestamptz default now()
);

-- messages
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant', 'tool')),
  content         text,
  tool_calls      jsonb,
  created_at      timestamptz default now()
);

-- reports
create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  chart_id     uuid not null references public.charts(id) on delete cascade,
  domain       text not null,
  title        text not null,
  storage_path text not null,
  version      text not null default '1.0',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(chart_id, domain)
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.charts enable row level security;
alter table public.pyramid_layers enable row level security;
alter table public.documents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

-- profiles: own row only
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- charts: astrologer sees all; clients see only their own
create policy "charts: astrologer all" on public.charts
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'astrologer')
  );
create policy "charts: client own" on public.charts
  for select using (client_id = auth.uid());

-- pyramid_layers, documents, reports: same pattern
create policy "pyramid_layers: astrologer all" on public.pyramid_layers
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'astrologer')
  );
create policy "pyramid_layers: client read own" on public.pyramid_layers
  for select using (
    exists (select 1 from public.charts where id = chart_id and client_id = auth.uid())
  );

create policy "documents: astrologer all" on public.documents
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'astrologer')
  );
create policy "documents: client read own" on public.documents
  for select using (
    exists (select 1 from public.charts where id = chart_id and client_id = auth.uid())
  );

create policy "reports: astrologer all" on public.reports
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'astrologer')
  );
create policy "reports: client read own" on public.reports
  for select using (
    exists (select 1 from public.charts where id = chart_id and client_id = auth.uid())
  );

-- conversations, messages: no client-side access (all via service role API routes)
create policy "conversations: astrologer all" on public.conversations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'astrologer')
  );
create policy "messages: astrologer all" on public.messages
  for all using (
    exists (
      select 1 from public.conversations c
      join public.profiles p on p.id = auth.uid() and p.role = 'astrologer'
      where c.id = conversation_id
    )
  );

-- Storage bucket (run in Supabase dashboard Storage tab)
-- Bucket name: chart-documents, private
```

- [ ] **Step 2.3: Write astrologer seed migration**

Create `platform/supabase/migrations/002_seed_astrologer.sql`:

```sql
-- Run after creating the astrologer user account via Supabase Auth dashboard.
-- Replace the UUID with the actual auth.users.id of the astrologer account.
-- This is a one-time seed — the trigger handles future signups automatically.

-- First: sign up via the app with ASTROLOGER_EMAIL, then get the user ID from
-- Supabase dashboard → Authentication → Users, and run:
--
-- update public.profiles set role = 'astrologer' where id = '<user-uuid>';
--
-- The handle_new_user trigger checks app.astrologer_email for future signups,
-- but the very first signup happens before this setting is configured, so
-- a manual update is needed once.
```

- [ ] **Step 2.4: Apply migration in Supabase dashboard**

In Supabase → SQL editor, paste and run `001_initial_schema.sql`. Create the Storage bucket `chart-documents` (private) in the Storage tab.

- [ ] **Step 2.5: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase schema, RLS policies, astrologer seed"
```

---

### Task 3: Supabase client setup and types

**Files:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/types.ts`, `src/middleware.ts`

- [ ] **Step 3.1: Write the type definitions**

Create `platform/src/lib/supabase/types.ts`:

```typescript
export type Role = 'astrologer' | 'client'
export type PyramidStatus = 'not_started' | 'in_progress' | 'complete'
export type ConversationModule = 'build' | 'consume'
export type MessageRole = 'user' | 'assistant' | 'tool'

export interface Profile {
  id: string
  role: Role
  name: string | null
  created_at: string
}

export interface Chart {
  id: string
  client_id: string
  name: string
  birth_date: string
  birth_time: string
  birth_place: string
  birth_lat: number | null
  birth_lng: number | null
  ayanamsa: string
  house_system: string
  created_at: string
}

export interface PyramidLayer {
  id: string
  chart_id: string
  layer: string
  sublayer: string
  status: PyramidStatus
  version: string | null
  updated_at: string
}

export interface Document {
  id: string
  chart_id: string
  layer: string
  name: string
  storage_path: string
  version: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  chart_id: string
  user_id: string
  module: ConversationModule
  title: string | null
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: MessageRole
  content: string | null
  tool_calls: unknown | null
  created_at: string
}

export interface Report {
  id: string
  chart_id: string
  domain: string
  title: string
  storage_path: string
  version: string
  created_at: string
  updated_at: string
}
```

- [ ] **Step 3.2: Write browser Supabase client**

Create `platform/src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3.3: Write server Supabase client**

Create `platform/src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}
```

- [ ] **Step 3.4: Write auth middleware**

Create `platform/src/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isPublicRoute = request.nextUrl.pathname === '/'

  if (!user && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
```

- [ ] **Step 3.5: Write OAuth callback route**

Create `platform/src/app/api/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

- [ ] **Step 3.6: Commit**

```bash
git add src/lib/supabase/ src/middleware.ts src/app/api/auth/
git commit -m "feat: add Supabase clients, auth middleware, OAuth callback"
```

---

### Task 4: Auth pages and root layout

**Files:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/login/page.tsx`

- [ ] **Step 4.1: Write root layout**

Replace `platform/src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MARSYS-JIS Platform',
  description: 'Jyotish Intelligence System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
```

Create `platform/src/app/providers.tsx`:

```tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

- [ ] **Step 4.2: Write root redirect**

Replace `platform/src/app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  redirect(user ? '/dashboard' : '/login')
}
```

- [ ] **Step 4.3: Write login page**

Create `platform/src/app/login/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    setLoading(false)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      setSent(true)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>MARSYS-JIS Platform</CardTitle>
          <CardDescription>Sign in to access the Jyotish Intelligence System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <p className="text-sm text-muted-foreground text-center">
              Check your email for the magic link.
            </p>
          ) : (
            <>
              <form onSubmit={handleMagicLink} className="space-y-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send magic link'}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogle}>
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4.4: Run app and verify login page renders**

```bash
npm run dev
```

Open http://localhost:3000 — should redirect to /login and show the login card with dark theme.

- [ ] **Step 4.5: Commit**

```bash
git add src/app/
git commit -m "feat: add root layout, login page with magic link + Google OAuth"
```

---

### Task 5: Client management API and dashboard

**Files:** `src/app/api/clients/route.ts`, `src/app/dashboard/page.tsx`, `src/app/clients/new/page.tsx`, `src/components/dashboard/ClientCard.tsx`, `src/components/dashboard/ClientRoster.tsx`

- [ ] **Step 5.1: Write failing test for clients API**

Create `platform/tests/unit/api/clients.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// We test the business logic of the route handler, not the HTTP layer
// The handler uses createServiceClient() — we mock that module

vi.mock('@/lib/supabase/server', () => ({
  createServiceClient: vi.fn(),
}))

import { createServiceClient } from '@/lib/supabase/server'

describe('clients API', () => {
  it('returns charts for astrologer', async () => {
    const mockCharts = [
      { id: 'chart-1', name: 'Abhisek Mohanty', birth_date: '1984-02-05',
        birth_time: '10:43:00', birth_place: 'Bhubaneswar', ayanamsa: 'lahiri',
        house_system: 'sripathi', client_id: 'user-1', created_at: '2026-01-01' }
    ]
    const mockSelect = vi.fn().mockResolvedValue({ data: mockCharts, error: null })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({ from: mockFrom })

    const { GET } = await import('@/app/api/clients/route')
    const response = await GET()
    const body = await response.json()

    expect(body).toEqual(mockCharts)
    expect(mockFrom).toHaveBeenCalledWith('charts')
  })
})
```

- [ ] **Step 5.2: Run test to confirm it fails**

```bash
npm run test -- tests/unit/api/clients.test.ts
```

Expected: FAIL (module not found)

- [ ] **Step 5.3: Write the clients API route**

Create `platform/src/app/api/clients/route.ts`:

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('charts')
    .select('*, profiles!client_id(name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, birth_date, birth_time, birth_place, birth_lat, birth_lng, client_email } = body

  const supabase = createServiceClient()

  // Find or create client profile
  const { data: authUser } = await supabase.auth.admin.inviteUserByEmail(client_email)
  if (!authUser.user) {
    return NextResponse.json({ error: 'Could not create client user' }, { status: 400 })
  }

  const client_id = authUser.user.id

  const { data: chart, error } = await supabase
    .from('charts')
    .insert({ client_id, name, birth_date, birth_time, birth_place, birth_lat, birth_lng })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Initialize pyramid layers
  const layers = [
    { chart_id: chart.id, layer: 'L1', sublayer: 'facts' },
    { chart_id: chart.id, layer: 'L2', sublayer: 'analysis_mode_a' },
    { chart_id: chart.id, layer: 'L2', sublayer: 'analysis_mode_b' },
    { chart_id: chart.id, layer: 'L2.5', sublayer: 'synthesis' },
    { chart_id: chart.id, layer: 'L3', sublayer: 'domain_reports' },
    { chart_id: chart.id, layer: 'L4', sublayer: 'query_interface' },
  ]
  await supabase.from('pyramid_layers').insert(layers)

  return NextResponse.json(chart)
}
```

- [ ] **Step 5.4: Run test to confirm it passes**

```bash
npm run test -- tests/unit/api/clients.test.ts
```

Expected: PASS

- [ ] **Step 5.5: Write ClientCard component**

Create `platform/src/components/dashboard/ClientCard.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Chart } from '@/lib/supabase/types'

interface Props {
  chart: Chart & { pyramidPercent: number }
}

export function ClientCard({ chart }: Props) {
  const percent = chart.pyramidPercent
  const statusColor = percent === 100 ? 'default' : percent > 0 ? 'secondary' : 'outline'

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{chart.name}</CardTitle>
          <Badge variant={statusColor}>{percent}%</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {chart.birth_date} · {chart.birth_place}
        </p>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/clients/${chart.id}/build`}>Build</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link href={`/clients/${chart.id}/consume`}>Consume</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 5.6: Write ClientRoster component**

Create `platform/src/components/dashboard/ClientRoster.tsx`:

```tsx
import { ClientCard } from './ClientCard'
import type { Chart } from '@/lib/supabase/types'

interface Props {
  charts: (Chart & { pyramidPercent: number })[]
}

export function ClientRoster({ charts }: Props) {
  if (charts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No clients yet. <a href="/clients/new" className="underline text-primary">Add your first client.</a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {charts.map((chart) => (
        <ClientCard key={chart.id} chart={chart} />
      ))}
    </div>
  )
}
```

- [ ] **Step 5.7: Write dashboard page**

Create `platform/src/app/dashboard/page.tsx`:

```tsx
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { ClientRoster } from '@/components/dashboard/ClientRoster'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Clients go directly to their Consume view
  if (profile?.role === 'client') {
    const service = createServiceClient()
    const { data: chart } = await service
      .from('charts')
      .select('id')
      .eq('client_id', user.id)
      .single()
    if (chart) redirect(`/clients/${chart.id}/consume`)
    redirect('/login')
  }

  // Astrologer: fetch all charts with pyramid completion
  const service = createServiceClient()
  const { data: charts } = await service
    .from('charts')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: layers } = await service
    .from('pyramid_layers')
    .select('chart_id, status')

  const pyramidPercents = new Map<string, number>()
  for (const chart of charts ?? []) {
    const chartLayers = (layers ?? []).filter((l) => l.chart_id === chart.id)
    const complete = chartLayers.filter((l) => l.status === 'complete').length
    pyramidPercents.set(chart.id, Math.round((complete / Math.max(chartLayers.length, 6)) * 100))
  }

  const chartsWithPercent = (charts ?? []).map((c) => ({
    ...c,
    pyramidPercent: pyramidPercents.get(c.id) ?? 0,
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">+ New Client</Link>
        </Button>
      </div>
      <ClientRoster charts={chartsWithPercent} />
    </div>
  )
}
```

- [ ] **Step 5.8: Write new client form**

Create `platform/src/app/clients/new/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', birth_date: '', birth_time: '', birth_place: '', client_email: '',
    birth_lat: '', birth_lng: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const chart = await res.json()
      router.push(`/clients/${chart.id}/build`)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              ['name', 'Full Name', 'text', 'Abhisek Mohanty'],
              ['client_email', 'Client Email', 'email', 'client@example.com'],
              ['birth_date', 'Birth Date', 'date', ''],
              ['birth_time', 'Birth Time (local)', 'time', ''],
              ['birth_place', 'Birth Place', 'text', 'Bhubaneswar, India'],
              ['birth_lat', 'Latitude', 'number', '20.2960'],
              ['birth_lng', 'Longitude', 'number', '85.8246'],
            ] as const).map(([field, label, type, placeholder]) => (
              <div key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  required={field !== 'birth_lat' && field !== 'birth_lng'}
                />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create Client'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5.9: Write client workspace layout**

Create `platform/src/app/clients/[id]/layout.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = createServiceClient()
  const { data: chart } = await service
    .from('charts')
    .select('name, birth_date')
    .eq('id', id)
    .single()

  if (!chart) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Dashboard
        </Link>
        <span className="font-medium">{chart.name}</span>
        <span className="text-xs text-muted-foreground">{chart.birth_date}</span>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/clients/${id}/build`}>Build</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/clients/${id}/consume`}>Consume</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
```

Create `platform/src/app/clients/[id]/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/clients/${id}/build`)
}
```

- [ ] **Step 5.10: E2E test for client creation flow (write first)**

Create `platform/tests/e2e/clients.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('astrologer can create a client and lands on build page', async ({ page }) => {
  // Requires a seeded astrologer session — see playwright.config.ts for storageState
  await page.goto('/clients/new')
  await page.fill('[id="name"]', 'Test Client')
  await page.fill('[id="client_email"]', 'testclient@example.com')
  await page.fill('[id="birth_date"]', '1990-01-15')
  await page.fill('[id="birth_time"]', '08:30')
  await page.fill('[id="birth_place"]', 'Mumbai, India')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/clients\/[a-f0-9-]+\/build/)
})
```

- [ ] **Step 5.11: Commit**

```bash
git add src/ tests/
git commit -m "feat: client management API, dashboard, roster, new client form"
```

---

## Phase 2: Python Sidecar

**Milestone:** All 7 ephemeris endpoints accessible from Next.js API route.

---

### Task 6: FastAPI sidecar wrapping `.tools/`

**Files:** `python-sidecar/main.py`, `python-sidecar/routers/*.py`, `python-sidecar/Dockerfile`, `python-sidecar/requirements.txt`

- [ ] **Step 6.1: Create the sidecar directory and copy tools**

```bash
cd /Users/Dev/Vibe-Coding/Apps/Madhav/platform
mkdir -p python-sidecar/routers
cp ../.tools/*.py python-sidecar/
```

- [ ] **Step 6.2: Write requirements.txt**

Create `platform/python-sidecar/requirements.txt`:

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
pyswisseph==2.10.3.2
pydantic==2.9.0
python-dotenv==1.0.1
```

- [ ] **Step 6.3: Write the FastAPI main entry**

Create `platform/python-sidecar/main.py`:

```python
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import ephemeris, events, eclipses, retrogrades, sade_sati, jaimini, v7_additions

app = FastAPI(title="MARSYS-JIS Compute Sidecar", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

API_KEY = os.environ.get("SIDECAR_API_KEY", "")

def verify_api_key(x_api_key: str = Header(...)):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

app.include_router(ephemeris.router, prefix="/ephemeris", dependencies=[Depends(verify_api_key)])
app.include_router(events.router, prefix="/event_chart_states", dependencies=[Depends(verify_api_key)])
app.include_router(eclipses.router, prefix="/eclipses", dependencies=[Depends(verify_api_key)])
app.include_router(retrogrades.router, prefix="/retrogrades", dependencies=[Depends(verify_api_key)])
app.include_router(sade_sati.router, prefix="/sade_sati", dependencies=[Depends(verify_api_key)])
app.include_router(jaimini.router, prefix="/jaimini_drishti", dependencies=[Depends(verify_api_key)])
app.include_router(v7_additions.router, prefix="/v7_additions", dependencies=[Depends(verify_api_key)])

@app.get("/health")
def health():
    return {"status": "ok"}
```

- [ ] **Step 6.4: Write each router (ephemeris example)**

Create `platform/python-sidecar/routers/ephemeris.py`:

```python
from fastapi import APIRouter
from pydantic import BaseModel
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import generate_ephemeris  # from copied .tools/ scripts

router = APIRouter()

class EphemerisRequest(BaseModel):
    birth_date: str       # YYYY-MM-DD
    birth_time: str       # HH:MM
    place: str
    lat: float
    lng: float
    date_from: str | None = None
    date_to: str | None = None

@router.post("")
def compute_ephemeris(req: EphemerisRequest):
    result = generate_ephemeris.compute(
        birth_date=req.birth_date,
        birth_time=req.birth_time,
        lat=req.lat,
        lng=req.lng,
        date_from=req.date_from,
        date_to=req.date_to,
    )
    return {"data": result}
```

Repeat the same pattern for remaining 6 routers, adapting the request model and calling the corresponding copied script.

- [ ] **Step 6.5: Write Dockerfile**

Create `platform/python-sidecar/Dockerfile`:

```dockerfile
FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 6.6: Test locally**

```bash
cd python-sidecar
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# In another terminal:
curl http://localhost:8000/health
```

Expected: `{"status":"ok"}`

- [ ] **Step 6.7: Write the Next.js proxy route**

Create `platform/src/app/api/compute/[type]/route.ts`:

```typescript
import { NextResponse } from 'next/server'

const SIDECAR_URL = process.env.PYTHON_SIDECAR_URL!
const SIDECAR_KEY = process.env.PYTHON_SIDECAR_API_KEY!

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const body = await request.json()

  const response = await fetch(`${SIDECAR_URL}/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': SIDECAR_KEY },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Compute error' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
```

- [ ] **Step 6.8: Deploy sidecar to Railway**

```
1. Push python-sidecar/ to a GitHub repo (or subdirectory of the platform repo)
2. railway login && railway init
3. railway up
4. Set env var: SIDECAR_API_KEY=<generate a random key>
5. Copy the Railway URL into PYTHON_SIDECAR_URL in Vercel env vars
```

- [ ] **Step 6.9: Commit**

```bash
git add python-sidecar/ src/app/api/compute/
git commit -m "feat: Python sidecar FastAPI wrapping .tools/ scripts + Next.js proxy"
```

---

## Phase 3: Build Module

**Milestone:** Full Build chat works end-to-end: Claude reads/writes documents, pyramid badges update live.

---

### Task 7: Claude Build tools

**Files:** `src/lib/claude/build-tools.ts`, `src/lib/claude/system-prompts.ts`

- [ ] **Step 7.1: Write failing tests for build tools**

Create `platform/tests/unit/lib/claude/build-tools.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { buildTools } from '@/lib/claude/build-tools'

describe('buildTools', () => {
  it('exports 10 tool definitions', () => {
    expect(buildTools).toHaveLength(10)
  })

  it('every tool has name, description, parameters', () => {
    for (const tool of buildTools) {
      expect(tool).toHaveProperty('name')
      expect(tool).toHaveProperty('description')
      expect(tool).toHaveProperty('parameters')
    }
  })

  it('includes required tool names', () => {
    const names = buildTools.map((t) => t.name)
    expect(names).toContain('list_documents')
    expect(names).toContain('read_document')
    expect(names).toContain('create_document')
    expect(names).toContain('update_document')
    expect(names).toContain('run_ephemeris')
    expect(names).toContain('get_pyramid_status')
  })
})
```

- [ ] **Step 7.2: Run test — confirm FAIL**

```bash
npm run test -- tests/unit/lib/claude/build-tools.test.ts
```

- [ ] **Step 7.3: Implement build-tools.ts**

Create `platform/src/lib/claude/build-tools.ts`:

```typescript
import { tool } from 'ai'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

export const buildTools = [
  tool({
    name: 'list_documents',
    description: 'List all documents for a chart, optionally filtered by layer (L1, L2, L2.5, L3, L4)',
    parameters: z.object({
      chart_id: z.string().uuid(),
      layer: z.string().optional(),
    }),
    execute: async ({ chart_id, layer }) => {
      const supabase = createServiceClient()
      let query = supabase.from('documents').select('id,name,layer,version,updated_at').eq('chart_id', chart_id)
      if (layer) query = query.eq('layer', layer)
      const { data, error } = await query.order('layer').order('name')
      if (error) return { error: error.message }
      return { documents: data }
    },
  }),

  tool({
    name: 'read_document',
    description: 'Read the full content of a document by its logical name',
    parameters: z.object({
      chart_id: z.string().uuid(),
      name: z.string(),
    }),
    execute: async ({ chart_id, name }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents')
        .select('storage_path, version')
        .eq('chart_id', chart_id)
        .eq('name', name)
        .single()
      if (!doc) return { error: `Document '${name}' not found` }

      const { data, error } = await supabase.storage
        .from('chart-documents')
        .download(`charts/${chart_id}/${doc.storage_path}`)
      if (error) return { error: error.message }

      const text = await data.text()
      return { content: text, version: doc.version }
    },
  }),

  tool({
    name: 'create_document',
    description: 'Create a new document in the pyramid. layer must be L1, L2, L2.5, L3, or L4.',
    parameters: z.object({
      chart_id: z.string().uuid(),
      layer: z.string(),
      name: z.string(),
      content: z.string(),
      version: z.string().default('1.0'),
    }),
    execute: async ({ chart_id, layer, name, content, version }) => {
      const supabase = createServiceClient()
      const storage_path = `${layer}/${name}_v${version}.md`
      const filePath = `charts/${chart_id}/${storage_path}`

      await supabase.storage.from('chart-documents').upload(filePath, content, {
        contentType: 'text/markdown',
        upsert: false,
      })

      const { error } = await supabase.from('documents').insert({
        chart_id, layer, name, storage_path, version,
      })
      if (error) return { error: error.message }

      return { success: true, storage_path }
    },
  }),

  tool({
    name: 'update_document',
    description: 'Update an existing document with new content, incrementing its version',
    parameters: z.object({
      chart_id: z.string().uuid(),
      name: z.string(),
      content: z.string(),
      changelog: z.string(),
      new_version: z.string(),
    }),
    execute: async ({ chart_id, name, content, new_version }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents')
        .select('layer, storage_path')
        .eq('chart_id', chart_id)
        .eq('name', name)
        .single()
      if (!doc) return { error: `Document '${name}' not found` }

      const new_path = `${doc.layer}/${name}_v${new_version}.md`
      await supabase.storage.from('chart-documents').upload(
        `charts/${chart_id}/${new_path}`, content,
        { contentType: 'text/markdown', upsert: true }
      )

      await supabase.from('documents')
        .update({ storage_path: new_path, version: new_version, updated_at: new Date().toISOString() })
        .eq('chart_id', chart_id)
        .eq('name', name)

      return { success: true, new_version, storage_path: new_path }
    },
  }),

  tool({
    name: 'append_to_document',
    description: 'Append content to an existing document without changing its version',
    parameters: z.object({
      chart_id: z.string().uuid(),
      name: z.string(),
      content: z.string(),
    }),
    execute: async ({ chart_id, name, content }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents').select('storage_path').eq('chart_id', chart_id).eq('name', name).single()
      if (!doc) return { error: `Document '${name}' not found` }

      const { data: existing } = await supabase.storage
        .from('chart-documents').download(`charts/${chart_id}/${doc.storage_path}`)
      const existingText = existing ? await existing.text() : ''

      await supabase.storage.from('chart-documents').upload(
        `charts/${chart_id}/${doc.storage_path}`,
        existingText + '\n\n' + content,
        { contentType: 'text/markdown', upsert: true }
      )

      await supabase.from('documents')
        .update({ updated_at: new Date().toISOString() })
        .eq('chart_id', chart_id).eq('name', name)

      return { success: true }
    },
  }),

  tool({
    name: 'update_layer_status',
    description: 'Update the status of a pyramid layer sublayer',
    parameters: z.object({
      chart_id: z.string().uuid(),
      layer: z.string(),
      sublayer: z.string(),
      status: z.enum(['not_started', 'in_progress', 'complete']),
      version: z.string().optional(),
    }),
    execute: async ({ chart_id, layer, sublayer, status, version }) => {
      const supabase = createServiceClient()
      const { error } = await supabase.from('pyramid_layers')
        .upsert({ chart_id, layer, sublayer, status, version, updated_at: new Date().toISOString() },
          { onConflict: 'chart_id,layer,sublayer' })
      if (error) return { error: error.message }
      return { success: true }
    },
  }),

  tool({
    name: 'run_ephemeris',
    description: 'Compute ephemeris data for a birth date/place via the Swiss Ephemeris service',
    parameters: z.object({
      birth_date: z.string(),
      birth_time: z.string(),
      place: z.string(),
      lat: z.number(),
      lng: z.number(),
      date_from: z.string().optional(),
      date_to: z.string().optional(),
    }),
    execute: async (params) => {
      const res = await fetch(`${process.env.PYTHON_SIDECAR_URL}/ephemeris`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.PYTHON_SIDECAR_API_KEY! },
        body: JSON.stringify(params),
      })
      if (!res.ok) return { error: 'Ephemeris computation failed' }
      return res.json()
    },
  }),

  tool({
    name: 'run_computation',
    description: 'Run a specific astrological computation via the sidecar (eclipses, retrogrades, sade_sati, jaimini_drishti, v7_additions, event_chart_states)',
    parameters: z.object({
      type: z.enum(['eclipses', 'retrogrades', 'sade_sati', 'jaimini_drishti', 'v7_additions', 'event_chart_states']),
      params: z.record(z.unknown()),
    }),
    execute: async ({ type, params }) => {
      const res = await fetch(`${process.env.PYTHON_SIDECAR_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.PYTHON_SIDECAR_API_KEY! },
        body: JSON.stringify(params),
      })
      if (!res.ok) return { error: `${type} computation failed` }
      return res.json()
    },
  }),

  tool({
    name: 'search_in_document',
    description: 'Search for a query string within a specific document',
    parameters: z.object({
      chart_id: z.string().uuid(),
      name: z.string(),
      query: z.string(),
    }),
    execute: async ({ chart_id, name, query }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents').select('storage_path').eq('chart_id', chart_id).eq('name', name).single()
      if (!doc) return { error: 'Document not found' }

      const { data } = await supabase.storage
        .from('chart-documents').download(`charts/${chart_id}/${doc.storage_path}`)
      const text = data ? await data.text() : ''
      const lines = text.split('\n')
      const matches = lines
        .map((line, i) => ({ line: i + 1, content: line }))
        .filter((l) => l.content.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 20)

      return { matches, total: matches.length }
    },
  }),

  tool({
    name: 'get_pyramid_status',
    description: 'Get the current completion status of all pyramid layers for a chart',
    parameters: z.object({ chart_id: z.string().uuid() }),
    execute: async ({ chart_id }) => {
      const supabase = createServiceClient()
      const { data, error } = await supabase
        .from('pyramid_layers')
        .select('layer,sublayer,status,version,updated_at')
        .eq('chart_id', chart_id)
        .order('layer')
      if (error) return { error: error.message }
      return { layers: data }
    },
  }),
]
```

- [ ] **Step 7.4: Run tests — confirm PASS**

```bash
npm run test -- tests/unit/lib/claude/build-tools.test.ts
```

- [ ] **Step 7.5: Write system prompts**

Create `platform/src/lib/claude/system-prompts.ts`:

```typescript
import type { Chart, PyramidLayer } from '@/lib/supabase/types'

export function buildSystemPrompt(chart: Chart, layers: PyramidLayer[]): string {
  const statusSummary = layers
    .map((l) => `  ${l.layer}/${l.sublayer}: ${l.status}${l.version ? ` (${l.version})` : ''}`)
    .join('\n')

  return `You are an expert Jyotish research assistant building the data pyramid for ${chart.name} \
(born ${chart.birth_date}, ${chart.birth_time}, ${chart.birth_place}). \
Ayanamsa: ${chart.ayanamsa}. House system: ${chart.house_system}.

Current pyramid status:
${statusSummary}

Architecture: MARSYS-JIS 5-layer system
  L1 → Facts (raw chart data, life events, ephemeris — NO interpretation)
  L2 → Analysis (Mode A: curated depth; Mode B: exhaustive matrices)
  L2.5 → Holistic Synthesis (Chart Graph Model, Signal Register, UCN)
  L3 → Domain Reports (Finance, Career, Health, Relations, etc.)
  L4 → Query Interface

Operating principles (non-negotiable):
- Facts only in L1; interpretations belong in L2+
- Every L2+ claim MUST cite specific L1 IDs via derivation ledger
- Three-interpretation discipline on significant claims (enumerate A/B/C, weigh, select)
- No fabricated computations — use run_ephemeris() or run_computation() tools
- Versioning discipline: every artifact carries version metadata and changelog
- Layer separation is inviolable

Quality standard: Acharya-grade. An independent senior Jyotish acharya reviewing this corpus \
must reach: "this is my own level" or above. Nothing less is acceptable.

When you complete a layer or sublayer, call update_layer_status() to mark it.`
}

export function consumeSystemPrompt(
  chart: Chart,
  reports: { domain: string; title: string; version: string }[]
): string {
  const reportList = reports.length > 0
    ? reports.map((r) => `  - ${r.domain}: ${r.title} (v${r.version})`).join('\n')
    : '  (none yet — in progress)'

  return `You are a Jyotish intelligence system for ${chart.name} \
(born ${chart.birth_date}, ${chart.birth_place}).

You have access to a complete astrological data pyramid via tools. Use them to give precise, \
acharya-grade responses.

MANDATORY PROTOCOL: Before answering ANY domain-specific question (career, finance, health, \
relationships, timing, spirituality, etc.), you MUST first call:
  get_layer_document(chart_id="${chart.id}", layer="L2.5", name="cgm")
This reads the Holistic Synthesis layer, which is required for whole-chart-read compliance.

Available reports (pre-generated, use get_domain_report to retrieve full text):
${reportList}

Quality standard: Acharya-grade. Be precise about confidence levels. \
Name ambiguities rather than smoothing over them. Never fabricate chart data.`
}
```

- [ ] **Step 7.6: Commit**

```bash
git add src/lib/claude/
git commit -m "feat: Claude Build tools (10) and system prompt builders"
```

---

### Task 8: Build streaming chat API route

**Files:** `src/app/api/chat/build/route.ts`

- [ ] **Step 8.1: Write the Build chat API route**

Create `platform/src/app/api/chat/build/route.ts`:

```typescript
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { buildTools } from '@/lib/claude/build-tools'
import { buildSystemPrompt } from '@/lib/claude/system-prompts'
import { NextResponse } from 'next/server'

export const maxDuration = 120

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, chart_id, conversation_id } = await request.json()

  const service = createServiceClient()

  const { data: chart } = await service
    .from('charts').select('*').eq('id', chart_id).single()
  if (!chart) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })

  const { data: layers } = await service
    .from('pyramid_layers').select('*').eq('chart_id', chart_id)

  const system = buildSystemPrompt(chart, layers ?? [])

  const result = streamText({
    model: anthropic('claude-sonnet-4-6', {
      cacheControl: true,
    }),
    system,
    messages,
    tools: Object.fromEntries(buildTools.map((t) => [t.name, t])),
    maxTokens: 16384,
    experimental_providerMetadata: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 8000 },
      },
    },
    onFinish: async ({ text, toolCalls }) => {
      if (!conversation_id) return
      await service.from('messages').insert([
        { conversation_id, role: 'user', content: messages.at(-1)?.content },
        { conversation_id, role: 'assistant', content: text, tool_calls: toolCalls },
      ])
    },
  })

  return result.toDataStreamResponse()
}
```

- [ ] **Step 8.1b: Add chart ownership check to the Build route**

The Build route uses the service role (bypassing RLS), so verify the authenticated user is the astrologer before proceeding. Add after the user check:

```typescript
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
if (profile?.role !== 'astrologer') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

The Consume route should verify the user owns the chart (or is the astrologer):

```typescript
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
if (profile?.role === 'client') {
  const { data: chart } = await supabase.from('charts').select('client_id').eq('id', chart_id).single()
  if (chart?.client_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}
```

- [ ] **Step 8.2: Test the route manually**

```bash
# With the dev server running and a real chart_id:
curl -X POST http://localhost:3000/api/chat/build \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is the current pyramid status?"}],"chart_id":"<real-chart-id>"}'
```

Expected: streaming SSE response with text + possible tool call.

- [ ] **Step 8.3: Commit**

```bash
git add src/app/api/chat/build/
git commit -m "feat: Build streaming chat API route with tool use and prompt caching"
```

---

### Task 9: Build module UI

**Files:** `src/app/clients/[id]/build/page.tsx`, `src/components/build/BuildChat.tsx`, `src/components/build/PyramidStatusPanel.tsx`, `src/components/shared/ChatMessage.tsx`, `src/components/shared/ToolCallAccordion.tsx`

- [ ] **Step 9.1: Write shared ChatMessage component**

Create `platform/src/components/shared/ChatMessage.tsx`:

```tsx
'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ToolCallAccordion } from './ToolCallAccordion'
import type { Message } from 'ai'

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-4 py-3`}>
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mb-2">
            {message.toolInvocations.map((inv) => (
              <ToolCallAccordion key={inv.toolCallId} invocation={inv} />
            ))}
          </div>
        )}
        {message.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
```

Create `platform/src/components/shared/ToolCallAccordion.tsx`:

```tsx
'use client'
import { useState } from 'react'
import type { ToolInvocation } from 'ai'

export function ToolCallAccordion({ invocation }: { invocation: ToolInvocation }) {
  const [open, setOpen] = useState(false)
  const isResult = invocation.state === 'result'

  return (
    <div className="border border-border/50 rounded text-xs mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-2 py-1 text-left hover:bg-muted/50"
      >
        <span className={`w-2 h-2 rounded-full ${isResult ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
        <span className="font-mono text-muted-foreground">{invocation.toolName}</span>
        <span className="ml-auto text-muted-foreground">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-2 py-1 border-t border-border/50 font-mono text-muted-foreground whitespace-pre-wrap max-h-48 overflow-auto">
          <div className="text-xs mb-1 text-foreground/50">args</div>
          {JSON.stringify(invocation.args, null, 2)}
          {isResult && (
            <>
              <div className="text-xs mt-2 mb-1 text-foreground/50">result</div>
              {JSON.stringify(invocation.result, null, 2)}
            </>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 9.2: Write PyramidStatusPanel**

Create `platform/src/components/build/PyramidStatusPanel.tsx`:

```tsx
'use client'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import type { PyramidLayer } from '@/lib/supabase/types'

const LAYER_ORDER = ['L1', 'L2', 'L2.5', 'L3', 'L4']
const LAYER_LABELS: Record<string, string> = {
  L1: 'Facts',
  L2: 'Analysis',
  'L2.5': 'Synthesis',
  L3: 'Reports',
  L4: 'Query',
}

interface Props {
  chartId: string
  onLayerClick?: (layer: string) => void
}

export function PyramidStatusPanel({ chartId, onLayerClick }: Props) {
  const { data: layers, isLoading } = useQuery<PyramidLayer[]>({
    queryKey: ['pyramid', chartId],
    queryFn: () => fetch(`/api/pyramid?chart_id=${chartId}`).then((r) => r.json()),
    refetchInterval: 5000,
  })

  if (isLoading) return <div className="p-4 text-xs text-muted-foreground">Loading…</div>

  const grouped = LAYER_ORDER.map((layer) => ({
    layer,
    label: LAYER_LABELS[layer] ?? layer,
    sublayers: (layers ?? []).filter((l) => l.layer === layer),
  }))

  return (
    <div className="w-72 border-l h-full overflow-y-auto p-4 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Data Pyramid
      </h3>
      {grouped.map(({ layer, label, sublayers }) => (
        <div key={layer}>
          <div className="text-xs font-medium mb-1 text-foreground/70">{layer} · {label}</div>
          {sublayers.length === 0 ? (
            <Badge variant="outline" className="text-xs">○ not started</Badge>
          ) : (
            <div className="space-y-1">
              {sublayers.map((s) => (
                <button
                  key={s.sublayer}
                  onClick={() => onLayerClick?.(s.layer)}
                  className="w-full flex items-center gap-2 text-left"
                >
                  <Badge
                    variant={s.status === 'complete' ? 'default' : s.status === 'in_progress' ? 'secondary' : 'outline'}
                    className="text-xs w-full justify-start"
                  >
                    {s.status === 'complete' ? '✓' : s.status === 'in_progress' ? '⟳' : '○'}{' '}
                    {s.sublayer}{s.version ? ` v${s.version}` : ''}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 9.3: Write pyramid status API route**

Create `platform/src/app/api/pyramid/route.ts`:

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chart_id = searchParams.get('chart_id')
  if (!chart_id) return NextResponse.json([], { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('pyramid_layers')
    .select('*')
    .eq('chart_id', chart_id)
    .order('layer')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { chart_id, layer, sublayer, status, version } = body

  const supabase = createServiceClient()
  const { error } = await supabase.from('pyramid_layers')
    .upsert({ chart_id, layer, sublayer, status, version, updated_at: new Date().toISOString() },
      { onConflict: 'chart_id,layer,sublayer' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 9.4: Write BuildChat component**

Create `platform/src/components/build/BuildChat.tsx`:

```tsx
'use client'
import { useChat } from 'ai/react'
import { useQueryClient } from '@tanstack/react-query'
import { ChatMessage } from '@/components/shared/ChatMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useRef } from 'react'

interface Props {
  chartId: string
  conversationId?: string
}

export function BuildChat({ chartId, conversationId }: Props) {
  const queryClient = useQueryClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat/build',
    body: { chart_id: chartId, conversation_id: conversationId },
    onFinish: () => {
      // Refresh pyramid status after each response (Claude may have updated layers)
      queryClient.invalidateQueries({ queryKey: ['pyramid', chartId] })
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-12">
            Start building the data pyramid. Ask Claude to generate L1 facts, run computations, or create analysis.
          </div>
        )}
        {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Message Claude…"
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '…' : '↑'}
        </Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 9.5: Write Build page**

Create `platform/src/app/clients/[id]/build/page.tsx`:

```tsx
import { BuildChat } from '@/components/build/BuildChat'
import { PyramidStatusPanel } from '@/components/build/PyramidStatusPanel'

export default async function BuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <BuildChat chartId={id} />
      </div>
      <PyramidStatusPanel chartId={id} />
    </div>
  )
}
```

- [ ] **Step 9.6: Smoke test Build module end-to-end**

```
1. Log in as astrologer
2. Create a new client
3. Open Build page
4. Type: "What is the current pyramid status?"
5. Verify: Claude responds, tool call accordion shows get_pyramid_status call
6. Type: "Create a simple L1 test document with name 'test-doc' and content '# Test'"
7. Verify: create_document tool fires, document appears in Supabase Storage, pyramid badge pulses
```

- [ ] **Step 9.7: Commit**

```bash
git add src/ 
git commit -m "feat: Build module UI — chat, pyramid status panel, tool call accordion"
```

---

## Phase 4: Consume Module

**Milestone:** Client can chat with Claude backed by their full pyramid and browse generated reports.

---

### Task 10: Claude Consume tools

**Files:** `src/lib/claude/consume-tools.ts`

- [ ] **Step 10.1: Write failing tests**

Create `platform/tests/unit/lib/claude/consume-tools.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { consumeTools } from '@/lib/claude/consume-tools'

describe('consumeTools', () => {
  it('exports 8 tool definitions', () => {
    expect(consumeTools).toHaveLength(8)
  })

  it('all tools are read-only (no create/update/delete in names)', () => {
    const names = consumeTools.map((t) => t.name)
    for (const name of names) {
      expect(name).not.toMatch(/create|update|delete|append/)
    }
  })

  it('includes get_layer_document for Whole-Chart-Read protocol', () => {
    expect(consumeTools.map((t) => t.name)).toContain('get_layer_document')
  })
})
```

- [ ] **Step 10.2: Run test — confirm FAIL**

```bash
npm run test -- tests/unit/lib/claude/consume-tools.test.ts
```

- [ ] **Step 10.3: Implement consume-tools.ts**

Create `platform/src/lib/claude/consume-tools.ts`:

```typescript
import { tool } from 'ai'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

export const consumeTools = [
  tool({
    name: 'get_birth_data',
    description: 'Get the birth metadata and chart configuration for this client',
    parameters: z.object({ chart_id: z.string().uuid() }),
    execute: async ({ chart_id }) => {
      const supabase = createServiceClient()
      const { data } = await supabase.from('charts').select('*').eq('id', chart_id).single()
      return data ?? { error: 'Chart not found' }
    },
  }),

  tool({
    name: 'get_planetary_positions',
    description: 'Get planetary positions from the facts layer. divisional can be D1, D9, D10, etc.',
    parameters: z.object({
      chart_id: z.string().uuid(),
      divisional: z.string().default('D1'),
    }),
    execute: async ({ chart_id, divisional }) => {
      const supabase = createServiceClient()
      const docName = divisional === 'D1' ? 'forensic_data' : `forensic_data_${divisional.toLowerCase()}`
      const { data: doc } = await supabase
        .from('documents').select('storage_path').eq('chart_id', chart_id).eq('name', docName).single()
      if (!doc) {
        // Fall back to main forensic data
        const { data: main } = await supabase
          .from('documents').select('storage_path').eq('chart_id', chart_id)
          .ilike('name', 'forensic_data%').order('name').limit(1).single()
        if (!main) return { error: 'No facts layer found' }
        const { data: file } = await supabase.storage.from('chart-documents')
          .download(`charts/${chart_id}/${main.storage_path}`)
        return { content: file ? await file.text() : '' }
      }
      const { data: file } = await supabase.storage.from('chart-documents')
        .download(`charts/${chart_id}/${doc.storage_path}`)
      return { content: file ? await file.text() : '' }
    },
  }),

  tool({
    name: 'get_dasha_periods',
    description: 'Get the Vimshottari dasha state at a given date. date defaults to today.',
    parameters: z.object({
      chart_id: z.string().uuid(),
      date: z.string().optional(),
    }),
    execute: async ({ chart_id }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents').select('storage_path')
        .eq('chart_id', chart_id).ilike('name', '%dasha%').order('updated_at', { ascending: false }).limit(1).single()
      if (!doc) return { error: 'No dasha data found' }
      const { data: file } = await supabase.storage.from('chart-documents')
        .download(`charts/${chart_id}/${doc.storage_path}`)
      return { content: file ? await file.text() : '' }
    },
  }),

  tool({
    name: 'get_layer_document',
    description: 'Read a specific document by its logical name. Use this for the Whole-Chart-Read protocol (get cgm from L2.5 first).',
    parameters: z.object({
      chart_id: z.string().uuid(),
      layer: z.string(),
      name: z.string(),
    }),
    execute: async ({ chart_id, name }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents').select('storage_path, version').eq('chart_id', chart_id).eq('name', name).single()
      if (!doc) return { error: `Document '${name}' not found — this layer may not be built yet` }

      const { data: file } = await supabase.storage.from('chart-documents')
        .download(`charts/${chart_id}/${doc.storage_path}`)
      return { content: file ? await file.text() : '', version: doc.version }
    },
  }),

  tool({
    name: 'search_signals',
    description: 'Full-text search across the Master Signal Register or Deep Analysis for specific signals',
    parameters: z.object({
      chart_id: z.string().uuid(),
      query: z.string(),
    }),
    execute: async ({ chart_id, query }) => {
      const supabase = createServiceClient()
      const { data: docs } = await supabase
        .from('documents').select('name, storage_path, layer').eq('chart_id', chart_id)
        .in('layer', ['L2', 'L2.5'])

      const results: { document: string; line: number; content: string }[] = []
      for (const doc of docs ?? []) {
        const { data: file } = await supabase.storage.from('chart-documents')
          .download(`charts/${chart_id}/${doc.storage_path}`)
        if (!file) continue
        const text = await file.text()
        text.split('\n').forEach((line, i) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({ document: doc.name, line: i + 1, content: line.trim() })
          }
        })
        if (results.length >= 30) break
      }
      return { results: results.slice(0, 30), total: results.length }
    },
  }),

  tool({
    name: 'get_domain_report',
    description: 'Get the full text of a specific L3 domain report (finance, career, health, relations, etc.)',
    parameters: z.object({
      chart_id: z.string().uuid(),
      domain: z.string(),
    }),
    execute: async ({ chart_id, domain }) => {
      const supabase = createServiceClient()
      const { data: report } = await supabase
        .from('reports').select('storage_path, title, version').eq('chart_id', chart_id).eq('domain', domain).single()
      if (!report) return { error: `No ${domain} report found yet` }

      const { data: file } = await supabase.storage.from('chart-documents')
        .download(`charts/${chart_id}/${report.storage_path}`)
      return {
        title: report.title,
        version: report.version,
        content: file ? await file.text() : '',
      }
    },
  }),

  tool({
    name: 'get_transits',
    description: 'Get planetary transit positions within a date range from the ephemeris CSV',
    parameters: z.object({
      chart_id: z.string().uuid(),
      from: z.string(),
      to: z.string(),
    }),
    execute: async ({ chart_id, from, to }) => {
      const supabase = createServiceClient()
      const { data: doc } = await supabase
        .from('documents').select('storage_path').eq('chart_id', chart_id).eq('name', 'ephemeris').single()
      if (!doc) return { error: 'No ephemeris data found' }

      const { data: file } = await supabase.storage.from('chart-documents')
        .download(`charts/${chart_id}/${doc.storage_path}`)
      if (!file) return { error: 'Could not read ephemeris' }

      const csv = await file.text()
      const lines = csv.split('\n').filter((l) => l >= from && l <= to)
      return { transits: lines.slice(0, 100) }
    },
  }),

  tool({
    name: 'get_pyramid_status',
    description: 'Check what layers are built for this chart',
    parameters: z.object({ chart_id: z.string().uuid() }),
    execute: async ({ chart_id }) => {
      const supabase = createServiceClient()
      const { data } = await supabase
        .from('pyramid_layers').select('layer,sublayer,status,version').eq('chart_id', chart_id).order('layer')
      return { layers: data ?? [] }
    },
  }),
]
```

- [ ] **Step 10.4: Run tests — confirm PASS**

```bash
npm run test -- tests/unit/lib/claude/consume-tools.test.ts
```

- [ ] **Step 10.5: Write Consume chat API route**

> **Important:** Also apply the Consume chart ownership authorization from Step 8.1b to this route — add the `profile.role` + `chart.client_id` check after the user auth check before calling the LLM.

Create `platform/src/app/api/chat/consume/route.ts`:

```typescript
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { consumeTools } from '@/lib/claude/consume-tools'
import { consumeSystemPrompt } from '@/lib/claude/system-prompts'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, chart_id, conversation_id } = await request.json()

  const service = createServiceClient()

  const [chartRes, reportsRes] = await Promise.all([
    service.from('charts').select('*').eq('id', chart_id).single(),
    service.from('reports').select('domain,title,version').eq('chart_id', chart_id),
  ])

  if (!chartRes.data) return NextResponse.json({ error: 'Chart not found' }, { status: 404 })

  const system = consumeSystemPrompt(chartRes.data, reportsRes.data ?? [])

  const result = streamText({
    model: anthropic('claude-sonnet-4-6', { cacheControl: true }),
    system,
    messages,
    tools: Object.fromEntries(consumeTools.map((t) => [t.name, t])),
    maxTokens: 8192,
    onFinish: async ({ text, toolCalls }) => {
      if (!conversation_id) return
      await service.from('messages').insert([
        { conversation_id, role: 'user', content: messages.at(-1)?.content },
        { conversation_id, role: 'assistant', content: text, tool_calls: toolCalls },
      ])
    },
  })

  return result.toDataStreamResponse()
}
```

- [ ] **Step 10.6: Write Consume UI components**

Create `platform/src/components/consume/ReportLibrary.tsx`:

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Report } from '@/lib/supabase/types'

interface Props {
  chartId: string
  selectedDomain: string | null
  onSelect: (domain: string) => void
}

const DOMAIN_ICONS: Record<string, string> = {
  finance: '💰', career: '💼', health: '🏥', relations: '❤️',
  children: '👶', spiritual: '🔮', parents: '👨‍👩‍👦', psychology: '🧠',
  travel: '✈️',
}

export function ReportLibrary({ chartId, selectedDomain, onSelect }: Props) {
  const { data: reports } = useQuery<Report[]>({
    queryKey: ['reports', chartId],
    queryFn: () => fetch(`/api/reports?chart_id=${chartId}`).then((r) => r.json()),
  })

  return (
    <div className="w-56 border-r flex flex-col h-full">
      <div className="p-3 border-b">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reports</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {(reports ?? []).map((r) => (
            <button
              key={r.domain}
              onClick={() => onSelect(r.domain)}
              className={`w-full text-left rounded px-2 py-1.5 text-sm flex items-center gap-2 transition-colors ${
                selectedDomain === r.domain ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              }`}
            >
              <span>{DOMAIN_ICONS[r.domain] ?? '📄'}</span>
              <span className="truncate capitalize">{r.domain}</span>
            </button>
          ))}
          {(reports ?? []).length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-1">No reports yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
```

Create `platform/src/components/consume/ConsumeChat.tsx`:

```tsx
'use client'
import { useChat } from 'ai/react'
import { ChatMessage } from '@/components/shared/ChatMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useRef } from 'react'

const DOMAIN_CHIPS = [
  'What does 2027 look like?',
  'Tell me about my financial timing',
  'What is my career trajectory?',
  'Explain my current dasha',
]

interface Props {
  chartId: string
  conversationId?: string
}

export function ConsumeChat({ chartId, conversationId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: '/api/chat/consume',
    body: { chart_id: chartId, conversation_id: conversationId },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-sm">
              Ask anything about your chart, timing, or life domains.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DOMAIN_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="text-xs border rounded-full px-3 py-1 hover:bg-muted transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about your chart…"
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '…' : '↑'}
        </Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 10.7: Write reports API route**

Create `platform/src/app/api/reports/route.ts`:

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chart_id = searchParams.get('chart_id')
  if (!chart_id) return NextResponse.json([], { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('reports').select('*').eq('chart_id', chart_id).order('domain')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 10.8: Write Consume page**

Create `platform/src/app/clients/[id]/consume/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { use } from 'react'
import { ConsumeChat } from '@/components/consume/ConsumeChat'
import { ReportLibrary } from '@/components/consume/ReportLibrary'
import { ReportReader } from '@/components/consume/ReportReader'

export default function ConsumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  return (
    <div className="flex flex-1 overflow-hidden">
      <ReportLibrary chartId={id} selectedDomain={selectedDomain} onSelect={setSelectedDomain} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDomain && (
          <ReportReader
            chartId={id}
            domain={selectedDomain}
            onClose={() => setSelectedDomain(null)}
          />
        )}
        <div className={selectedDomain ? 'flex-1' : 'h-full'}>
          <ConsumeChat chartId={id} />
        </div>
      </div>
    </div>
  )
}
```

First, extend the reports API route to support fetching report content by domain (add to the existing `route.ts`):

```typescript
// Add to platform/src/app/api/reports/route.ts — GET handler extension
// When ?domain= param is supplied, return the file content too
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chart_id = searchParams.get('chart_id')
  const domain = searchParams.get('domain')
  if (!chart_id) return NextResponse.json([], { status: 400 })

  const supabase = createServiceClient()

  if (domain) {
    // Single report with full content
    const { data: report } = await supabase
      .from('reports').select('*').eq('chart_id', chart_id).eq('domain', domain).single()
    if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: file } = await supabase.storage
      .from('chart-documents').download(`charts/${chart_id}/${report.storage_path}`)
    const content = file ? await file.text() : ''
    return NextResponse.json({ ...report, content })
  }

  // All reports (no content)
  const { data, error } = await supabase
    .from('reports').select('*').eq('chart_id', chart_id).order('domain')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

Create `platform/src/components/consume/ReportReader.tsx`:

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  chartId: string
  domain: string
  onClose: () => void
}

export function ReportReader({ chartId, domain, onClose }: Props) {
  const { data, isLoading } = useQuery<{ content: string; title: string }>({
    queryKey: ['report-content', chartId, domain],
    queryFn: () =>
      fetch(`/api/reports?chart_id=${chartId}&domain=${domain}`).then((r) => r.json()),
  })

  return (
    <div className="border-b h-80 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm font-medium capitalize">{domain} Report</span>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data?.content ?? 'Report not available yet.'}
            </ReactMarkdown>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
```

- [ ] **Step 10.9: E2E test — Whole-Chart-Read protocol fires**

Add to `platform/tests/e2e/consume.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('Consume chat fires get_layer_document(L2.5, cgm) before domain answer', async ({ page }) => {
  await page.goto('/clients/<test-chart-id>/consume')
  await page.fill('[placeholder="Ask about your chart…"]', 'What does 2027 look like for my finances?')
  await page.keyboard.press('Enter')

  // Wait for tool call accordion to appear
  const accordion = page.locator('text=get_layer_document').first()
  await expect(accordion).toBeVisible({ timeout: 30000 })
})
```

- [ ] **Step 10.10: Commit**

```bash
git add src/
git commit -m "feat: Consume module — tools, streaming chat, report library, report reader"
```

---

## Phase 5: Polish + Deploy

**Milestone:** Production-ready, RLS-verified, deployed to Vercel.

---

### Task 11: RLS security audit

- [ ] **Step 11.1: Verify client isolation manually**

```bash
# Log in as Client A, get their session token, then hit the API as Client A
# trying to access Client B's chart_id — expect 0 rows or 403
curl -H "Authorization: Bearer <client-A-token>" \
  "https://your-project.supabase.co/rest/v1/documents?chart_id=eq.<client-B-chart-id>&select=id" \
  -H "apikey: <anon-key>"
```

Expected: `[]` (empty array — RLS blocks it)

- [ ] **Step 11.2: Verify service role bypass works for API routes**

All `/api/*` routes use `createServiceClient()` which uses `SUPABASE_SERVICE_ROLE_KEY`. Confirm these routes work correctly for both astrologer and client requests by checking that the service role key is never exposed in client-side code:

```bash
grep -r "SUPABASE_SERVICE_ROLE_KEY" src/ --include="*.ts" --include="*.tsx"
```

Expected: Only appears in `src/lib/supabase/server.ts`. No `NEXT_PUBLIC_` prefix.

- [ ] **Step 11.3: Add error boundaries**

Create `platform/src/app/error.tsx`:

```tsx
'use client'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

- [ ] **Step 11.4: Commit**

```bash
git add src/app/error.tsx
git commit -m "feat: error boundary, RLS audit passed"
```

---

### Task 12: Deploy to Vercel

- [ ] **Step 12.1: Push to GitHub**

```bash
git remote add origin https://github.com/<your-org>/amjis-platform.git
git push -u origin main
```

- [ ] **Step 12.2: Deploy on Vercel**

```
1. vercel.com → New Project → import from GitHub
2. Set root directory to: platform/
3. Set environment variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ANTHROPIC_API_KEY
   ASTROLOGER_EMAIL
   PYTHON_SIDECAR_URL  (Railway URL)
   PYTHON_SIDECAR_API_KEY
4. Deploy
```

- [ ] **Step 12.3: Set Supabase Auth redirect URLs**

In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URLs: `https://your-vercel-domain.vercel.app/api/auth/callback`

- [ ] **Step 12.4: Seed Abhisek's chart with existing MARSYS-JIS data**

```
1. Log in as astrologer at the deployed URL
2. Create client "Abhisek Mohanty" via /clients/new with correct birth data
3. Use the Supabase dashboard Storage tab to upload all files from:
   /Users/Dev/Vibe-Coding/Apps/Madhav/01_FACTS_LAYER/ → charts/{chart_id}/L1/
   /Users/Dev/Vibe-Coding/Apps/Madhav/02_ANALYTICAL_LAYER/ → charts/{chart_id}/L2/
   /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/ → charts/{chart_id}/L2.5/
   /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/ → charts/{chart_id}/L3/
4. Register documents in the DB: for each uploaded file, insert a row in the documents table
   with the logical name (e.g., 'forensic_data', 'life_event_log', 'cgm') and storage_path
5. Mark pyramid layers as 'complete' for all populated layers
```

- [ ] **Step 12.5: Run full verification checklist**

```
✓ New client signup → gets 'client' role → redirected to /clients/{id}/consume
✓ Astrologer → Build → "What is the pyramid status?" → Claude responds with layer data
✓ Astrologer → Build → "Create L1 document" → badge turns ✓
✓ Client → Consume → "What does 2027 look like?" → tool call shows get_layer_document(L2.5, cgm) fired first
✓ Client → Consume → Report Library → click Finance → report renders
✓ RLS: client A cannot access client B's chart (tested in Step 11.1)
✓ Prompt caching: open Network tab → second message in conversation → Anthropic-Processing-Ms drops
```

- [ ] **Step 12.6: Final commit and tag**

```bash
git add .
git commit -m "feat: Vercel deployment, data migration, full verification passed"
git tag v1.0.0
git push origin main --tags
```

---

## Summary

| Phase | Milestone | Key outputs |
|---|---|---|
| 1 Foundation | App boots, auth, client management | Next.js + Supabase + auth + dashboard |
| 2 Python Sidecar | Ephemeris API live | FastAPI on Railway + 7 compute endpoints |
| 3 Build Module | Full Build chat works | 10 Claude tools + streaming chat + pyramid panel |
| 4 Consume Module | Client can chat + read reports | 8 Claude tools + report library + WCR protocol |
| 5 Deploy | Production on Vercel | RLS audit + data migration + live URL |
