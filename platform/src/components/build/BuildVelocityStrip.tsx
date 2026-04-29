'use client'

import type { SessionIndex } from '@/lib/build/types'
import { CadenceArea } from './charts/CadenceArea'
import { OnOffPlanDonut } from './charts/OnOffPlanDonut'

interface Props {
  sessions: SessionIndex[]
}

function interventionFrequency(sessions: SessionIndex[], windowSize = 7) {
  // Count sessions with non-null drift_exit > 2 OR class = red_team/native_intervention
  const recent = sessions.slice(0, windowSize)
  const prior = sessions.slice(windowSize, windowSize * 2)
  const isIntervention = (s: SessionIndex) =>
    s.class === 'red_team' ||
    s.class === 'native_intervention' ||
    (s.drift_exit !== null && s.drift_exit > 2)
  return {
    recent: recent.filter(isIntervention).length,
    prior: prior.filter(isIntervention).length,
  }
}

export function BuildVelocityStrip({ sessions }: Props) {
  const { recent, prior } = interventionFrequency(sessions)
  const trend = recent > prior ? '↑' : recent < prior ? '↓' : '→'

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="bt-label mb-4">Build velocity</p>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cadence area chart */}
        <CadenceArea sessions={sessions} days={30} height={110} />

        {/* On/off plan donut */}
        <OnOffPlanDonut sessions={sessions} height={110} />

        {/* Intervention frequency */}
        <div className="flex flex-col justify-between">
          <p className="bt-label mb-2">Interventions (last 7 vs prior 7)</p>
          <div className="flex items-end gap-3">
            <div className="text-center">
              <p className="bt-mega">{recent}</p>
              <p className="bt-label">last 7</p>
            </div>
            <p className="bt-num text-muted-foreground mb-2">{trend}</p>
            <div className="text-center">
              <p className="bt-num text-2xl">{prior}</p>
              <p className="bt-label">prior 7</p>
            </div>
          </div>
          <p className="bt-body text-muted-foreground mt-2">
            {recent === 0 ? 'No interventions this window.' : `${recent} interventions detected.`}
          </p>
        </div>
      </div>
    </div>
  )
}
