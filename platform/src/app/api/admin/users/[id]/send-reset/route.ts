import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { adminAuth } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'

// Generates a Firebase password-reset link for the target user. Returns the
// link to the admin UI for copy-paste.
//
// TODO: wire SMTP so the link is automatically emailed instead of surfaced for
// manual copy. For v1, the admin shares the link directly with the user.
export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params

  const { rows } = await query<{ email: string | null }>(
    'SELECT email FROM profiles WHERE id=$1',
    [id]
  )
  const profile = rows[0] ?? null

  if (!profile?.email) {
    return NextResponse.json({ error: 'User has no email on file.' }, { status: 404 })
  }

  try {
    const link = await adminAuth.generatePasswordResetLink(profile.email)
    return NextResponse.json({ ok: true, reset_link: link })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not generate reset link.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
