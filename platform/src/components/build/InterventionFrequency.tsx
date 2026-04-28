'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { SessionIndex } from '@/lib/build/types'

interface Props {
  sessions: SessionIndex[]
  height?: number
}

function isIntervention(s: SessionIndex) {
  return (
    s.class === 'red_team' ||
    s.class === 'native_intervention' ||
    (s.drift_exit !== null && s.drift_exit > 2)
  )
}

function binByWeek(sessions: SessionIndex[], weeks = 12) {
  const now = new Date()
  const bins: Record<string, number> = {}
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const key = d.toISOString().slice(0, 10)
    bins[key] = 0
  }
  const weekKeys = Object.keys(bins).sort()
  for (const s of sessions) {
    if (!isIntervention(s)) continue
    const date = s.date ?? ''
    // find which week bin this belongs to
    for (let i = weekKeys.length - 1; i >= 0; i--) {
      if (date >= weekKeys[i]) {
        bins[weekKeys[i]]++
        break
      }
    }
  }
  return weekKeys.map((k) => ({ week: k.slice(5), count: bins[k] }))
}

export function InterventionFrequency({ sessions, height = 200 }: Props) {
  const data = binByWeek(sessions)
  const avg = data.length ? data.reduce((s, d) => s + d.count, 0) / data.length : 0

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="bt-label mb-1">Intervention frequency (last 12 weeks)</p>
      <p className="bt-body text-muted-foreground mb-4">
        Red-team sessions, native interventions, or drift regressions (exit &gt;2). Avg:{' '}
        {avg.toFixed(1)}/week.
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={((v: number) => [v, 'interventions']) as never}
            contentStyle={{ fontSize: 11 }}
          />
          <ReferenceLine
            y={avg}
            stroke="#f59e0b"
            strokeDasharray="4 3"
            label={{ value: 'avg', fontSize: 9, fill: '#f59e0b' }}
          />
          <Bar dataKey="count" fill="#ef4444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
