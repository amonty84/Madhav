interface GhostPillProps {
  label: string
  tooltip: string
  selected: boolean
}

export function GhostPill({ label, tooltip, selected }: GhostPillProps) {
  return (
    <div
      data-testid="ghost-pill"
      title={tooltip}
      aria-label={`${label}: ${tooltip}`}
      className={`rounded px-1.5 py-0.5 text-[10px] border cursor-default ${
        selected
          ? 'border-[rgba(212,175,55,0.5)] text-[#d4af37] bg-[rgba(212,175,55,0.08)]'
          : 'border-zinc-700/50 text-zinc-500 opacity-50'
      }`}
    >
      {label}
    </div>
  )
}
