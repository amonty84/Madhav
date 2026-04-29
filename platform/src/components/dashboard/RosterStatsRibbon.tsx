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
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm">
      {segments.map((seg, i) => (
        <span key={seg.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-muted-foreground/40 select-none">·</span>}
          {seg.filterKey && onFilterShortcut ? (
            <button
              onClick={() => onFilterShortcut(seg.filterKey!, seg.filterVal!)}
              className="font-semibold tabular-nums text-foreground hover:text-primary transition-colors"
            >
              {seg.value}
            </button>
          ) : (
            <span className="font-semibold tabular-nums">{seg.value}</span>
          )}
          <span className="text-muted-foreground">{seg.label}</span>
        </span>
      ))}
    </div>
  )
}
