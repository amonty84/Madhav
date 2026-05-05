'use client'

import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { key: 'j / k', desc: 'Next / previous step' },
  { key: '1 – 9', desc: 'Jump to step N' },
  { key: '/', desc: 'Filter lifecycle graph' },
  { key: 'c', desc: 'Copy step JSON to clipboard' },
  { key: '?', desc: 'Toggle this help' },
  { key: 'Esc', desc: 'Close / go back' },
]

interface ShortcutHelpOverlayProps {
  onClose: () => void
}

export function ShortcutHelpOverlay({ onClose }: ShortcutHelpOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      data-testid="shortcut-help-overlay"
      className="absolute inset-0 z-[55] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        ref={overlayRef}
        className="bg-[oklch(0.12_0.014_70)] border border-[rgba(212,175,55,0.3)] rounded-xl p-6 min-w-[280px] shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-200">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="text-zinc-500 hover:text-zinc-300 text-xs"
          >
            ✕
          </button>
        </div>
        <table className="w-full text-xs">
          <tbody>
            {SHORTCUTS.map(s => (
              <tr key={s.key} className="border-b border-zinc-800/50 last:border-0">
                <td className="py-2 pr-4">
                  <kbd className="font-mono text-[#d4af37] bg-[rgba(212,175,55,0.08)] px-1.5 py-0.5 rounded border border-[rgba(212,175,55,0.2)] text-[11px]">
                    {s.key}
                  </kbd>
                </td>
                <td className="py-2 text-zinc-400">{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
