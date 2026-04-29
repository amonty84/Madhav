'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { SessionIndex } from '@/lib/build/types'

interface Props {
  sessions: SessionIndex[]
  days?: number
  height?: number
}

function binByDay(sessions: SessionIndex[], days: number) {
  const now = new Date()
  const bins: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    bins[d.toISOString().slice(0, 10)] = 0
  }
  for (const s of sessions) {
    const key = (s.date ?? '').slice(0, 10)
    if (key in bins) bins[key]++
  }
  return Object.entries(bins).map(([date, count]) => ({ date: date.slice(5), count }))
}

export function CadenceArea({ sessions, days = 30, height = 120 }: Props) {
  const data = binByDay(sessions, days)
  return (
    <div>
      <p className="bt-label mb-2">Sessions / day (last {days}d)</p>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
          <defs>
            <linearGradient id="cadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(days / 6)}
          />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            formatter={((v: number) => [v, 'sessions']) as never}
            contentStyle={{ fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#cadGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
