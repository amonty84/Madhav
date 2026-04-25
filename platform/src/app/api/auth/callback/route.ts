import { NextResponse } from 'next/server'

// Supabase OAuth callback — no longer used after Firebase Auth migration.
export function GET(request: Request) {
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/login`)
}
