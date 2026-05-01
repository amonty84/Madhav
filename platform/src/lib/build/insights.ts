import type { BuildState, InsightCard } from './types'

function isOnPlanClass(cls: string) {
  return cls === 'm2_corpus_execution'
}

export function deriveInsights(state: BuildState): InsightCard[] {
  const cards: InsightCard[] = []
  const si = state.sessions_index ?? []
  const subs = state.phase_plan.sub_phases

  // 1. Phase on-plan checks for closed sub-phases
  for (const sp of subs) {
    if (sp.status !== 'completed') continue
    const actual = sp.session_count_actual ?? 0
    const est = sp.session_count_estimated
    if (!est) continue
    const delta = actual - est
    if (delta === 0) {
      cards.push({
        id: `onplan-${sp.phase_id}`,
        severity: 'positive',
        text: `${sp.phase_id} closed in ${actual} session${actual !== 1 ? 's' : ''} — exactly on estimate.`,
      })
    } else if (delta > 0) {
      cards.push({
        id: `overplan-${sp.phase_id}`,
        severity: 'concern',
        text: `${sp.phase_id} used ${actual} sessions vs ${est} estimated (+${delta}).`,
      })
    } else {
      cards.push({
        id: `underplan-${sp.phase_id}`,
        severity: 'positive',
        text: `${sp.phase_id} closed in ${actual} sessions vs ${est} estimated (${delta}).`,
      })
    }
  }

  // 2. Drift baseline holding
  const drift = state.governance.scripts_trend.drift_detector
  if (drift.length >= 3) {
    const recent = drift.slice(-12)
    const allAtTwo = recent.every((d) => d.exit_code === 2)
    const lastExitCode = drift.at(-1)?.exit_code ?? 0
    if (allAtTwo) {
      cards.push({
        id: 'drift-baseline',
        severity: 'positive',
        text: `Drift baseline holding — last ${recent.length} runs at exit 2, no new findings.`,
      })
    } else if (lastExitCode > 2) {
      cards.push({
        id: 'drift-regression',
        severity: 'concern',
        text: `Drift exit code is ${lastExitCode} — regression detected. Review drift report.`,
      })
    }
  }

  // 3. Off-plan share in active macro phase
  const m2Sessions = si.filter(
    (s) => s.phase_id?.startsWith('B.') || s.class === 'm2_corpus_execution'
  )
  if (m2Sessions.length > 0) {
    const offPlan = m2Sessions.filter((s) => !isOnPlanClass(s.class)).length
    const pct = Math.round((offPlan / m2Sessions.length) * 100)
    const severity = pct > 40 ? 'concern' : pct > 20 ? 'info' : 'positive'
    cards.push({
      id: 'offplan-share',
      severity,
      text: `Off-plan share: ${pct}% of M2-phase sessions (${offPlan} of ${m2Sessions.length}).`,
    })
  }

  // 4. Cadence projection
  if (si.length >= 7) {
    const recent7 = si.slice(0, 7)
    const dates = recent7
      .map((s) => s.date ? new Date(s.date).getTime() : null)
      .filter(Boolean) as number[]
    if (dates.length >= 2) {
      const spanDays = (Math.max(...dates) - Math.min(...dates)) / 86_400_000 || 1
      const sessionsPerDay = recent7.length / Math.max(spanDays, 1)
      const pending = subs.filter((s) => s.status === 'pending' || s.status === 'in_progress').length
      const avgSessionsPerSub = subs
        .filter((s) => s.session_count_estimated)
        .reduce((a, b) => a + (b.session_count_estimated ?? 1), 0) /
        Math.max(subs.filter((s) => s.session_count_estimated).length, 1)
      const remainingSessions = pending * avgSessionsPerSub
      const etaDays = sessionsPerDay > 0 ? Math.round(remainingSessions / sessionsPerDay) : null
      if (etaDays !== null && etaDays < 365) {
        cards.push({
          id: 'cadence-projection',
          severity: 'info',
          text: `At current cadence (~${sessionsPerDay.toFixed(1)} sessions/day), M2 closes in ~${etaDays} days.`,
        })
      }
    }
  }

  // 5. Mirror freshness
  const stalePairs = (state.mirror_pairs ?? []).filter(
    (mp) => mp.days_since_verified !== null && mp.days_since_verified > 14
  )
  if (stalePairs.length > 0) {
    cards.push({
      id: 'mirror-stale',
      severity: 'concern',
      text: `${stalePairs.length} mirror pair${stalePairs.length > 1 ? 's' : ''} not verified in >14 days: ${stalePairs.map((p) => p.pair_id).join(', ')}.`,
    })
  } else if (state.mirror_pairs?.length) {
    cards.push({
      id: 'mirror-fresh',
      severity: 'positive',
      text: `All ${state.mirror_pairs.length} mirror pairs verified within 14 days.`,
    })
  }

  return cards.slice(0, 6)
}
