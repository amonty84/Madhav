import { NextResponse } from 'next/server'

// Legacy OAuth callback route — retained for redirect safety; not used after Firebase Auth migration.
export function GET(request: Request) {
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/login`)
}
