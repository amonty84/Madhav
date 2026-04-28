import type { MacroPhaseEntry } from '@/lib/build/types'

export function JourneyStrip({ arc, activeId }: { arc: MacroPhaseEntry[]; activeId: string }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {arc.map((m, idx) => {
        const isActive = m.id === activeId || m.status === 'active'
        const isDone = m.status === 'completed'
        return (
          <div key={m.id} className="flex items-center gap-1 shrink-0">
            <div
              className={[
                'flex items-center gap-2 rounded-full border px-3 py-1.5',
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : isDone
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-border bg-background text-muted-foreground',
              ].join(' ')}
            >
              <span className="bt-mono text-xs">{m.id}</span>
              <span className="bt-body text-xs">{m.title}</span>
              {isDone && <span className="text-xs opacity-60">✓</span>}
            </div>
            {idx < arc.length - 1 && (
              <div className={`h-px w-3 ${isDone ? 'bg-emerald-400/60' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
