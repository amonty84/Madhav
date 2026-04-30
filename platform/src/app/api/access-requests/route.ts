import { NextResponse } from 'next/server'
import { query } from '@/lib/db/client'
import { res } from '@/lib/errors'

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
    return res.badRequest('invalid request body')
  }

  const fullName = (body.full_name ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  const reason = (body.reason ?? '').trim().slice(0, 500) || null

  if (!fullName || fullName.length > 100) {
    return res.badRequest('Full name is required (max 100 characters).')
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return res.badRequest('A valid email address is required.')
  }

  // Reject if a pending request already exists for this email.
  let pendingRows: { id: string }[]
  try {
    const result = await query<{ id: string }>(
      'SELECT id FROM access_requests WHERE lower(email)=lower($1) AND status=\'pending\'',
      [email]
    )
    pendingRows = result.rows
  } catch (err) {
    console.error('[access-requests] pending-check failed', err)
    return res.dbError()
  }
  if (pendingRows.length > 0) {
    return res.conflict('A request for this email is already pending review.')
  }

  try {
    await query(
      'INSERT INTO access_requests (full_name, email, reason, status) VALUES ($1,$2,$3,\'pending\') RETURNING id',
      [fullName, email, reason]
    )
  } catch (err) {
    console.error('[access-requests] insert failed', err)
    return res.internal('Could not submit request.')
  }

  return NextResponse.json({ ok: true })
}
