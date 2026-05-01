import { NextResponse } from 'next/server'
import { query } from '@/lib/db/client'

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

  const { rows } = await query<{ email: string | null; status: string }>(
    "SELECT email, status FROM profiles WHERE lower(username)=lower($1) AND status='active' LIMIT 1",
    [username.trim()]
  )
  const data = rows[0] ?? null

  if (!data || !data.email) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({ email: data.email })
}
