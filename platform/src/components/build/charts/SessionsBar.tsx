'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { getClassColor } from '../colors'

interface SessionRow {
  session_id: string
  contribution?: string | null
  deliverables?: string[]
  class?: string
}

interface Props {
  sessions: SessionRow[]
  height?: number
}

export function SessionsBar({ sessions, height = 140 }: Props) {
  const data = sessions.map((s) => ({
    id: s.session_id.slice(-8),
    full_id: s.session_id,
    deliverables: s.deliverables?.length ?? 0,
    cls: s.class ?? 'unknown',
    contribution: s.contribution ?? '',
  }))

  return (
    <div>
      <p className="bt-label mb-2">Sessions contributed</p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <XAxis dataKey="id" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={((v: number) => [v, 'deliverables']) as never}
            labelFormatter={((label: string, payload: { payload?: { full_id?: string } }[]) =>
              payload?.[0]?.payload?.full_id ?? label) as never}
            contentStyle={{ fontSize: 11 }}
          />
          <Bar dataKey="deliverables" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getClassColor(entry.cls)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
