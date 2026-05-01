'use client'

/**
 * QueryTimeline — TRACE-7 (W2-TRACE-B).
 *
 * Hand-authored SVG horizontal timeline. X-axis is time-from-query-start
 * (ms); each step is a rectangle at `(started_at - query_start, latency_ms)`
 * coordinates. Steps that share approximately the same start time (within
 * 50ms) stack vertically into lanes. Color codes status; click emits the
 * step_seq via `onStepClick` so a parent panel can drill in.
 *
 * UI-only: hydrated incrementally by the parent as
 * `step_start`/`step_done`/`step_error` events arrive; layout finalises on
 * `query_done`.
 */

import { useMemo } from 'react'

export interface TimelineStep {
  step_seq: number
  step_type: string
  label: string
  started_at: number
  latency_ms: number | null
  status: 'running' | 'done' | 'error' | 'zero_rows'
  is_parallel_group?: boolean
}

interface QueryTimelineProps {
  steps: TimelineStep[]
  isLoading: boolean
  onStepClick?: (step_seq: number) => void
}

const STATUS_FILL: Record<TimelineStep['status'], string> = {
  running: 'rgba(212,175,55,0.35)',
  done: 'rgba(120,210,160,0.7)',
  error: 'rgba(240,150,120,0.85)',
  zero_rows: 'rgba(244,209,96,0.75)',
}

const PARALLEL_THRESHOLD_MS = 50
const LANE_HEIGHT = 18
const LANE_GAP = 4
const LEFT_GUTTER = 6
const RIGHT_GUTTER = 6
const TOP_PAD = 20
const BOTTOM_AXIS = 14
const VIEW_WIDTH = 720

export function QueryTimeline({
  steps,
  isLoading,
  onStepClick,
}: QueryTimelineProps) {
  const layout = useMemo(() => {
    if (steps.length === 0) {
      return {
        items: [] as Array<{
          step: TimelineStep
          x: number
          width: number
          lane: number
        }>,
        totalLanes: 1,
        totalMs: 0,
        queryStart: 0,
      }
    }
    const queryStart = Math.min(...steps.map((s) => s.started_at))
    const ends = steps.map(
      (s) => s.started_at + (s.latency_ms ?? 0),
    )
    const queryEnd = Math.max(...ends, queryStart + 1)
    const totalMs = queryEnd - queryStart

    // Sort by start time so lane assignment is deterministic.
    const ordered = [...steps].sort((a, b) => a.started_at - b.started_at)

    // Lane assignment: a step joins an existing lane only if its start is
    // strictly after the lane's current end (with a small tolerance).
    const laneEnds: number[] = []
    const laneOf = new Map<number, number>()
    for (const s of ordered) {
      const start = s.started_at
      // First, identify all steps whose start is within PARALLEL_THRESHOLD
      // of this step among already-placed steps. They go into different
      // lanes by definition (they've already been seeded). For the current
      // step, find the lowest lane whose end <= start + epsilon.
      let lane = -1
      for (let i = 0; i < laneEnds.length; i++) {
        if (laneEnds[i] <= start + PARALLEL_THRESHOLD_MS) {
          lane = i
          break
        }
      }
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(0)
      }
      const dur = s.latency_ms ?? 0
      laneEnds[lane] = start + dur
      laneOf.set(s.step_seq, lane)
    }

    const totalLanes = Math.max(1, laneEnds.length)
    const usableW = VIEW_WIDTH - LEFT_GUTTER - RIGHT_GUTTER

    const items = ordered.map((s) => {
      const offset = s.started_at - queryStart
      const dur = s.latency_ms ?? 0
      const x = LEFT_GUTTER + (offset / totalMs) * usableW
      const widthRaw = (dur / totalMs) * usableW
      const width = Math.max(2, widthRaw)
      const lane = laneOf.get(s.step_seq) ?? 0
      return { step: s, x, width, lane }
    })

    return { items, totalLanes, totalMs, queryStart }
  }, [steps])

  if (isLoading) {
    const h = TOP_PAD + LANE_HEIGHT + BOTTOM_AXIS
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Query Timeline
        </div>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${h}`}
          width="100%"
          height={h}
          className="block"
          aria-label="Loading query timeline"
        >
          <line
            x1={LEFT_GUTTER}
            x2={VIEW_WIDTH - RIGHT_GUTTER}
            y1={TOP_PAD + LANE_HEIGHT / 2}
            y2={TOP_PAD + LANE_HEIGHT / 2}
            stroke="rgba(212,175,55,0.10)"
            strokeWidth={1}
          />
          <rect
            x={LEFT_GUTTER}
            y={TOP_PAD}
            width={120}
            height={LANE_HEIGHT}
            rx={2}
            fill="rgba(212,175,55,0.10)"
            className="animate-pulse"
          />
        </svg>
      </div>
    )
  }

  if (steps.length === 0) {
    return (
      <div className="px-4 py-3 text-[10px] italic text-[rgba(212,175,55,0.4)]">
        No timeline steps yet.
      </div>
    )
  }

  const height =
    TOP_PAD +
    layout.totalLanes * LANE_HEIGHT +
    Math.max(0, layout.totalLanes - 1) * LANE_GAP +
    BOTTOM_AXIS

  const fmtMs = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  // Three axis ticks: 0, mid, end
  const axisY =
    TOP_PAD +
    layout.totalLanes * LANE_HEIGHT +
    Math.max(0, layout.totalLanes - 1) * LANE_GAP +
    4

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Query Timeline
        </span>
        <span className="ml-auto text-[10px] text-[rgba(212,175,55,0.5)]">
          {steps.length} steps · {fmtMs(layout.totalMs)}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        width="100%"
        height={height}
        className="block"
        role="img"
        aria-label="Query execution timeline"
      >
        {/* Lane guides */}
        {Array.from({ length: layout.totalLanes }).map((_, i) => {
          const y = TOP_PAD + i * (LANE_HEIGHT + LANE_GAP) + LANE_HEIGHT / 2
          return (
            <line
              key={`lane-${i}`}
              x1={LEFT_GUTTER}
              x2={VIEW_WIDTH - RIGHT_GUTTER}
              y1={y}
              y2={y}
              stroke="rgba(212,175,55,0.08)"
              strokeWidth={1}
            />
          )
        })}

        {/* Bars */}
        {layout.items.map(({ step, x, width, lane }) => {
          const y = TOP_PAD + lane * (LANE_HEIGHT + LANE_GAP)
          const fill = STATUS_FILL[step.status]
          const isPulsing = step.status === 'running'
          const handleClick = () => onStepClick?.(step.step_seq)
          const tooltip = `#${step.step_seq} ${step.label} · ${step.step_type} · ${
            step.status
          }${step.latency_ms != null ? ` · ${fmtMs(step.latency_ms)}` : ''}`
          return (
            <g
              key={`bar-${step.step_seq}`}
              onClick={handleClick}
              style={{ cursor: onStepClick ? 'pointer' : 'default' }}
              className={isPulsing ? 'animate-pulse' : undefined}
            >
              <rect
                x={x}
                y={y}
                width={width}
                height={LANE_HEIGHT}
                rx={2}
                fill={fill}
                stroke={
                  step.status === 'error'
                    ? 'rgba(230,110,80,0.7)'
                    : 'rgba(212,175,55,0.25)'
                }
                strokeWidth={0.75}
              />
              {/* Step type abbrev label inside bar if wide enough */}
              {width >= 38 && (
                <text
                  x={x + 4}
                  y={y + LANE_HEIGHT / 2 + 3}
                  fontSize={9}
                  fill="rgba(8,5,2,0.85)"
                  fontWeight={600}
                  pointerEvents="none"
                >
                  {`${step.step_seq}·${step.step_type.slice(0, 3).toUpperCase()}`}
                </text>
              )}
              <title>{tooltip}</title>
            </g>
          )
        })}

        {/* Axis ticks */}
        <line
          x1={LEFT_GUTTER}
          x2={VIEW_WIDTH - RIGHT_GUTTER}
          y1={axisY}
          y2={axisY}
          stroke="rgba(212,175,55,0.20)"
          strokeWidth={1}
        />
        <text
          x={LEFT_GUTTER}
          y={axisY + 9}
          fontSize={8}
          fill="rgba(212,175,55,0.45)"
        >
          0ms
        </text>
        <text
          x={VIEW_WIDTH / 2}
          y={axisY + 9}
          fontSize={8}
          fill="rgba(212,175,55,0.45)"
          textAnchor="middle"
        >
          {fmtMs(layout.totalMs / 2)}
        </text>
        <text
          x={VIEW_WIDTH - RIGHT_GUTTER}
          y={axisY + 9}
          fontSize={8}
          fill="rgba(212,175,55,0.45)"
          textAnchor="end"
        >
          {fmtMs(layout.totalMs)}
        </text>
      </svg>
    </div>
  )
}
