import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params
  const service = createServiceClient()

  const { data: req } = await service
    .from('access_requests')
    .select('status')
    .eq('id', id)
    .single<{ status: 'pending' | 'approved' | 'rejected' }>()
  if (!req) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request is not pending.' }, { status: 409 })
  }

  const { error } = await service
    .from('access_requests')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user.uid,
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
