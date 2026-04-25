import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface RequestBody {
  full_name?: string
  email?: string
  reason?: string
}

// Public route — anyone can submit an access request. The super-admin reviews
// the queue at /admin and either approves (creates a Firebase user + sends
// password-reset email) or rejects.
//
// TODO: rate-limit (single-tenant for now).
export async function POST(request: Request) {
  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  const fullName = (body.full_name ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  const reason = (body.reason ?? '').trim().slice(0, 500) || null

  if (!fullName || fullName.length > 100) {
    return NextResponse.json(
      { error: 'Full name is required (max 100 characters).' },
      { status: 400 },
    )
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  const service = createServiceClient()

  // Reject if this email already has an account.
  const { data: existingProfile } = await service
    .from('profiles')
    .select('id')
    .ilike('email', email)
    .maybeSingle()
  if (existingProfile) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Try signing in instead.' },
      { status: 409 },
    )
  }

  // Reject if a pending request already exists for this email.
  const { data: existingPending } = await service
    .from('access_requests')
    .select('id')
    .ilike('email', email)
    .eq('status', 'pending')
    .maybeSingle()
  if (existingPending) {
    return NextResponse.json(
      { error: 'A request for this email is already pending review.' },
      { status: 409 },
    )
  }

  const { error } = await service.from('access_requests').insert({
    full_name: fullName,
    email,
    reason,
    status: 'pending',
  })
  if (error) {
    console.error('[access-requests] insert failed', error)
    return NextResponse.json({ error: 'Could not submit request.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
