'use client'

import { useState } from 'react'
import type { AcCriterion } from '@/lib/build/types'

interface Props {
  criteria: AcCriterion[]
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  const tone =
    s === 'pass' || s === 'passed'
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
      : s === 'failed' || s === 'fail'
        ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200'
        : 'bg-muted text-muted-foreground'
  return (
    <span className={`bt-label shrink-0 rounded px-1.5 py-0.5 ${tone}`}>
      {status}
    </span>
  )
}

function AcRow({ ac }: { ac: AcCriterion }) {
  const [open, setOpen] = useState(false)
  const hasDetail = ac.description || ac.test || ac.result_snippet

  return (
    <li className="border-b border-border last:border-0">
      <button
        onClick={() => hasDetail && setOpen((p) => !p)}
        className={`flex w-full items-baseline gap-3 px-0 py-2.5 text-left ${hasDetail ? 'cursor-pointer hover:bg-muted/40 rounded' : ''}`}
      >
        <span className="bt-mono shrink-0 text-xs">{ac.ac_id}</span>
        {ac.description && (
          <span className="bt-body flex-1 text-foreground line-clamp-1">{ac.description}</span>
        )}
        <StatusBadge status={ac.status} />
        {hasDetail && (
          <span className="bt-label shrink-0 text-muted-foreground">{open ? '▾' : '▸'}</span>
        )}
      </button>

      {open && hasDetail && (
        <div className="pb-3 pl-4 space-y-2.5 border-l-2 border-border ml-2">
          {ac.description && (
            <div>
              <p className="bt-label mb-0.5">Description</p>
              <p className="bt-body">{ac.description}</p>
            </div>
          )}
          {ac.test && (
            <div>
              <p className="bt-label mb-0.5">Test</p>
              <p className="bt-body">{ac.test}</p>
            </div>
          )}
          {ac.result_snippet && (
            <div>
              <p className="bt-label mb-0.5">Result</p>
              <p className="bt-mono text-xs whitespace-pre-wrap bg-muted/60 rounded px-2 py-1.5">
                {ac.result_snippet}
              </p>
            </div>
          )}
          {ac.residual_id && (
            <p className="bt-label">
              Residual: <span className="bt-mono text-xs">{ac.residual_id}</span>
            </p>
          )}
        </div>
      )}
    </li>
  )
}

export function AcCriteriaList({ criteria }: Props) {
  if (!criteria.length) return null
  return (
    <ul className="divide-y-0">
      {criteria.map((ac) => (
        <AcRow key={ac.ac_id} ac={ac} />
      ))}
    </ul>
  )
}
