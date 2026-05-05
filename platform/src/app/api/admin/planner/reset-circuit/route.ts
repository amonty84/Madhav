// POST /api/admin/planner/reset-circuit
// Super-admin only. Resets the in-process PlannerCircuitBreaker singleton to
// closed state. Use when the circuit is stuck open after a provider outage.
import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { plannerCircuit } from '@/lib/pipeline/planner_circuit_breaker'

export async function POST() {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    plannerCircuit.reset()
    return NextResponse.json({ reset: true, metrics: plannerCircuit.getMetrics() })
  } catch (err) {
    console.error('[admin/planner/reset-circuit] failed', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
