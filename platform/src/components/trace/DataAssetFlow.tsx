'use client'

/**
 * DataAssetFlow — TRACE-4 (W2-TRACE-B).
 *
 * SVG Sankey-style diagram. Left column lists each data-asset node; right
 * column is a single Context Assembly sink. Each asset routes one ribbon
 * to the sink with stroke-width proportional to its share of the total
 * context tokens. Zero-contributing assets render dashed grey.
 *
 * UI-only: receives `nodes` + `total_context_tokens` from the parent (the
 * SSE handler hydrates on `context_assembly_done`).
 */

import { useState } from 'react'

export interface DataAssetNode {
  asset_id: string
  tool_name: string
  tokens_contributed: number
  is_zero: boolean
}

interface DataAssetFlowProps {
  nodes: DataAssetNode[]
  total_context_tokens: number
  isLoading: boolean
}

const TOOL_COLOR: Record<string, string> = {
  bundle_load: 'rgba(244,209,96,0.85)',
  vector_search: 'rgba(190,150,240,0.85)',
  msr_sql: 'rgba(140,210,170,0.85)',
  cgm_lookup: 'rgba(140,190,240,0.85)',
  rm_lookup: 'rgba(240,170,100,0.85)',
}
const DEFAULT_COLOR = 'rgba(212,175,55,0.7)'
const ZERO_COLOR = 'rgba(212,175,55,0.25)'

function colorFor(node: DataAssetNode): string {
  if (node.is_zero) return ZERO_COLOR
  return TOOL_COLOR[node.tool_name] ?? DEFAULT_COLOR
}

function pct(tokens: number, total: number): number {
  if (total <= 0) return 0
  return (tokens / total) * 100
}

export function DataAssetFlow({
  nodes,
  total_context_tokens,
  isLoading,
}: DataAssetFlowProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Data Asset Flow
        </div>
        <svg
          viewBox="0 0 360 180"
          width="100%"
          height="180"
          className="block"
          aria-label="Loading data asset flow"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x={8}
              y={12 + i * 26}
              width={120}
              height={18}
              rx={3}
              className="fill-[rgba(212,175,55,0.06)] animate-pulse"
            />
          ))}
          <rect
            x={232}
            y={12}
            width={120}
            height={148}
            rx={4}
            className="fill-[rgba(212,175,55,0.04)] animate-pulse"
          />
        </svg>
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="px-4 py-3 text-[10px] italic text-[rgba(212,175,55,0.4)]">
        No data assets recorded.
      </div>
    )
  }

  // Layout
  const nodeH = 22
  const nodeGap = 8
  const padTop = 12
  const padBottom = 12
  const leftX = 8
  const leftW = 120
  const rightX = 232
  const rightW = 120
  const height = padTop + padBottom + nodes.length * nodeH + (nodes.length - 1) * nodeGap
  const width = 360
  const sinkH = nodes.length * nodeH + (nodes.length - 1) * nodeGap
  const sinkY = padTop
  const sinkCenterY = sinkY + sinkH / 2

  const maxStrokeW = 14
  const minStrokeW = 1.5

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Data Asset Flow
        </span>
        <span className="ml-auto text-[10px] text-[rgba(212,175,55,0.5)]">
          {nodes.length} assets · {total_context_tokens} tok
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        className="block"
        aria-label="Data asset flow diagram"
      >
        {/* Ribbons (rendered first so nodes overlay) */}
        {nodes.map((node, i) => {
          const yLeft =
            padTop + i * (nodeH + nodeGap) + nodeH / 2
          const share = pct(node.tokens_contributed, total_context_tokens)
          const strokeW = node.is_zero
            ? 1
            : Math.max(
                minStrokeW,
                Math.min(maxStrokeW, (share / 100) * maxStrokeW + 1.5),
              )
          const x1 = leftX + leftW
          const x2 = rightX
          const cx1 = x1 + (x2 - x1) * 0.5
          const cx2 = x1 + (x2 - x1) * 0.5
          const d = `M${x1},${yLeft} C${cx1},${yLeft} ${cx2},${sinkCenterY} ${x2},${sinkCenterY}`
          const stroke = colorFor(node)
          const isHovered = hovered === node.asset_id
          return (
            <path
              key={`ribbon-${node.asset_id}-${i}`}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeW}
              strokeDasharray={node.is_zero ? '4 3' : undefined}
              strokeOpacity={isHovered ? 1 : 0.75}
              strokeLinecap="round"
            />
          )
        })}

        {/* Asset nodes (left column) */}
        {nodes.map((node, i) => {
          const y = padTop + i * (nodeH + nodeGap)
          const share = pct(node.tokens_contributed, total_context_tokens)
          const isHovered = hovered === node.asset_id
          const fill = node.is_zero
            ? 'rgba(13,10,5,0.5)'
            : 'rgba(13,10,5,0.7)'
          const strokeColor = colorFor(node)
          return (
            <g
              key={`node-${node.asset_id}-${i}`}
              onMouseEnter={() => setHovered(node.asset_id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={leftX}
                y={y}
                width={leftW}
                height={nodeH}
                rx={3}
                fill={fill}
                stroke={strokeColor}
                strokeWidth={isHovered ? 1.5 : 1}
                strokeDasharray={node.is_zero ? '3 2' : undefined}
              />
              <text
                x={leftX + 6}
                y={y + nodeH / 2 + 3}
                fontSize={9}
                fill={
                  node.is_zero
                    ? 'rgba(212,175,55,0.5)'
                    : 'rgba(252,226,154,0.9)'
                }
                fontFamily="ui-monospace, monospace"
              >
                {node.asset_id.length > 14
                  ? `${node.asset_id.slice(0, 13)}…`
                  : node.asset_id}
              </text>
              <text
                x={leftX + leftW - 6}
                y={y + nodeH / 2 + 3}
                fontSize={8}
                fill="rgba(212,175,55,0.55)"
                textAnchor="end"
              >
                {share.toFixed(0)}%
              </text>
              {/* Native SVG tooltip */}
              <title>
                {`${node.asset_id}\n${node.tool_name}\n${
                  node.tokens_contributed
                } tokens (${share.toFixed(1)}%)`}
              </title>
            </g>
          )
        })}

        {/* Context Assembly sink */}
        <rect
          x={rightX}
          y={sinkY}
          width={rightW}
          height={sinkH}
          rx={4}
          fill="rgba(212,175,55,0.08)"
          stroke="rgba(212,175,55,0.4)"
          strokeWidth={1}
        />
        <text
          x={rightX + rightW / 2}
          y={sinkCenterY - 4}
          fontSize={10}
          fill="rgba(252,226,154,0.95)"
          textAnchor="middle"
          fontWeight={600}
        >
          Context Assembly
        </text>
        <text
          x={rightX + rightW / 2}
          y={sinkCenterY + 10}
          fontSize={9}
          fill="rgba(212,175,55,0.6)"
          textAnchor="middle"
        >
          {total_context_tokens} tok
        </text>
      </svg>

      {/* Legend / hovered detail strip */}
      {hovered && (
        <div className="text-[10px] text-[rgba(212,175,55,0.7)] truncate">
          {(() => {
            const n = nodes.find((x) => x.asset_id === hovered)
            if (!n) return null
            const share = pct(n.tokens_contributed, total_context_tokens)
            return `${n.asset_id} · ${n.tool_name} · ${n.tokens_contributed} tok (${share.toFixed(1)}%)`
          })()}
        </div>
      )}
    </div>
  )
}
