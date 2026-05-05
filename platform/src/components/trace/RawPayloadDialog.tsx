'use client'

import { useEffect } from 'react'

interface RawPayloadDialogProps {
  title: string
  payload: unknown
  onClose: () => void
}

export function RawPayloadDialog({ title, payload, onClose }: RawPayloadDialogProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
      data-testid="raw-payload-dialog"
    >
      <div className="w-[80vw] h-[70vh] rounded-xl border border-[rgba(212,175,55,0.3)] bg-[oklch(0.08_0.01_70)] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(212,175,55,0.1)]">
          <p className="text-sm font-medium text-[#d4af37]">{title}</p>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-sm"
            data-testid="raw-dialog-close"
          >
            ✕ Close
          </button>
        </div>
        <pre className="flex-1 overflow-auto p-4 text-xs text-zinc-300 font-mono whitespace-pre-wrap break-words">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </div>
  )
}
