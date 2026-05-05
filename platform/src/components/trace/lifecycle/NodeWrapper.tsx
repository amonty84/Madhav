interface NodeWrapperProps {
  children: React.ReactNode
  selected: boolean
  status: 'ok' | 'empty' | 'failed' | 'skipped'
  testId: string
  label?: string
  onClick: () => void
}

export function NodeWrapper({ children, selected, status, testId, label, onClick }: NodeWrapperProps) {
  const borderClass = {
    ok: 'border-[rgba(212,175,55,0.5)]',
    empty: 'border-amber-400/50 border-dashed',
    failed: 'border-red-400/60',
    skipped: 'border-zinc-600/50',
  }[status]

  const ringClass = selected
    ? 'ring-2 ring-[rgba(212,175,55,0.8)] ring-offset-1 ring-offset-[oklch(0.10_0.012_70)]'
    : ''

  return (
    <div
      role="button"
      tabIndex={0}
      data-testid={testId}
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      className={`rounded-lg border ${borderClass} ${ringClass} bg-[oklch(0.13_0.012_70)] p-3 cursor-pointer
        hover:border-[rgba(212,175,55,0.7)] transition-colors`}
    >
      {children}
    </div>
  )
}
