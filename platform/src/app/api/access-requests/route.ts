import { NextResponse } from 'next/server'
import { query } from '@/lib/db/client'

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

  // Reject if a pending request already exists for this email.
  const { rows: pendingRows } = await query<{ id: string }>(
    'SELECT id FROM access_requests WHERE lower(email)=lower($1) AND status=\'pending\'',
    [email]
  )
  if (pendingRows.length > 0) {
    return NextResponse.json(
      { error: 'A request for this email is already pending review.' },
      { status: 409 },
    )
  }

  try {
    await query(
      'INSERT INTO access_requests (full_name, email, reason, status) VALUES ($1,$2,$3,\'pending\') RETURNING id',
      [fullName, email, reason]
    )
  } catch (err) {
    console.error('[access-requests] insert failed', err)
    return NextResponse.json({ error: 'Could not submit request.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
