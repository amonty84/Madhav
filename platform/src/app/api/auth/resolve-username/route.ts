import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Resolves a username to an email so the login page can call
// signInWithEmailAndPassword. Public route — does not require a session.
//
// Security note: returns the same generic 404 whether the username exists or
// not, so we don't leak username existence. The same shape on every miss
// means an attacker can't distinguish "no such username" from "wrong password"
// further along the flow.
//
// TODO: rate-limit (single-tenant for now; revisit when public sign-up volume
// justifies it).
export async function POST(request: Request) {
  let username: string | undefined
  try {
    const body = await request.json()
    username = body?.username
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  if (!username || typeof username !== 'string' || !username.trim()) {
    return NextResponse.json({ error: 'username required' }, { status: 400 })
  }

  const service = createServiceClient()
  const { data } = await service
    .from('profiles')
    .select('email, status')
    .ilike('username', username.trim())
    .single<{ email: string | null; status: 'pending' | 'active' | 'disabled' }>()

  if (!data || !data.email || data.status !== 'active') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({ email: data.email })
}
