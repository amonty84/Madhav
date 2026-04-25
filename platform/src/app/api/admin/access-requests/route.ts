import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const service = createServiceClient()
  const { data, error } = await service
    .from('access_requests')
    .select('id, full_name, email, reason, status, requested_at, reviewed_at')
    .eq('status', 'pending')
    .order('requested_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ requests: data ?? [] })
}
