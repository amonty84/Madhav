'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { exitCodeColor } from '../colors'
import type { TrendEntry } from '@/lib/build/types'

interface Props {
  data: TrendEntry[]
  label: string
  height?: number
}

export function TrendLine({ data, label, height = 180 }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-muted-foreground bt-body" style={{ height }}>
        No data
      </div>
    )
  }

  const chartData = data.map((d, i) => ({
    i,
    date: d.run_at ? d.run_at.slice(0, 10) : `#${i}`,
    exit: d.exit_code ?? 0,
    findings: d.finding_count ?? 0,
  }))

  return (
    <div>
      <p className="bt-label mb-2">{label}</p>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 4]}
            ticks={[0, 1, 2, 3, 4]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={((value: number, name: string) =>
              name === 'exit' ? [`Exit ${value}`, 'Exit code'] : [value, 'Findings']) as never}
            labelFormatter={(label) => `Run: ${label}`}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine y={2} stroke="#fbbf24" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="exit"
            stroke="#6366f1"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props
              return (
                <circle
                  key={`dot-${payload.i}`}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={exitCodeColor[payload.exit as number] ?? '#6366f1'}
                  stroke="none"
                />
              )
            }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
