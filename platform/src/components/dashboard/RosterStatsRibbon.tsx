interface RosterStatsRibbonProps {
  total: number
  inActiveBuild: number
  consumedToday: number
  predictionsOverdue: number
  onFilterShortcut?: (key: string, value: string) => void
}

export function RosterStatsRibbon({
  total,
  inActiveBuild,
  consumedToday,
  predictionsOverdue,
  onFilterShortcut,
}: RosterStatsRibbonProps) {
  const segments: { label: string; value: number; filterKey?: string; filterVal?: string }[] = [
    { label: 'charts', value: total },
    { label: 'in active build', value: inActiveBuild, filterKey: 'buildMax', filterVal: '99' },
    { label: 'consumed today', value: consumedToday },
    ...(predictionsOverdue > 0
      ? [{ label: 'predictions overdue', value: predictionsOverdue }]
      : []),
  ]

  return (
    <div className="brand-card flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-4 py-2.5 text-sm">
      {segments.map((seg, i) => (
        <span key={seg.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[rgba(212,175,55,0.2)] select-none">·</span>}
          {seg.filterKey && onFilterShortcut ? (
            <button
              onClick={() => onFilterShortcut(seg.filterKey!, seg.filterVal!)}
              className="font-semibold tabular-nums text-[#d4af37] hover:text-[#fce29a] hover:brightness-110 transition-colors"
            >
              {seg.value}
            </button>
          ) : (
            <span className="font-semibold tabular-nums text-[#d4af37]">{seg.value}</span>
          )}
          <span className="text-[rgba(212,175,55,0.5)]">{seg.label}</span>
        </span>
      ))}
    </div>
  )
}
