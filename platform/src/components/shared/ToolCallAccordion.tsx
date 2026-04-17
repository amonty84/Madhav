'use client'

import { useState } from 'react'

export interface ToolCall {
  toolName: string
  args: Record<string, unknown>
  result?: unknown
}

interface Props {
  toolCalls: ToolCall[]
}

export function ToolCallAccordion({ toolCalls }: Props) {
  const [open, setOpen] = useState(false)

  if (toolCalls.length === 0) return null

  return (
    <div className="mt-2 text-xs border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
      >
        <span>Claude used {toolCalls.length} tool{toolCalls.length !== 1 ? 's' : ''}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="divide-y">
          {toolCalls.map((tc, i) => (
            <div key={i} className="px-3 py-2 space-y-1">
              <p className="font-mono font-semibold text-foreground">{tc.toolName}</p>
              <pre className="whitespace-pre-wrap break-all text-muted-foreground bg-muted/30 rounded p-2 text-[11px]">
                {JSON.stringify(tc.args, null, 2)}
              </pre>
              {tc.result !== undefined && (
                <>
                  <p className="text-muted-foreground font-semibold">Result</p>
                  <pre className="whitespace-pre-wrap break-all text-muted-foreground bg-muted/30 rounded p-2 text-[11px]">
                    {JSON.stringify(tc.result, null, 2)}
                  </pre>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
