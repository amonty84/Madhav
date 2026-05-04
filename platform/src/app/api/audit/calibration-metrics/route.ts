import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { computeCalibrationMetrics } from '@/lib/prediction/queries'

export async function GET() {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const metrics = await computeCalibrationMetrics('native:abhisek')
  return NextResponse.json(metrics)
}
