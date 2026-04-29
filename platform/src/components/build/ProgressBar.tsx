export function ProgressBar({
  percent,
  label,
  tone = 'default',
}: {
  percent: number
  label?: string
  tone?: 'default' | 'active' | 'warning'
}) {
  const clamped = Math.max(0, Math.min(100, percent))
  const fillColor =
    tone === 'active'
      ? 'bg-foreground'
      : tone === 'warning'
        ? 'bg-amber-500'
        : 'bg-muted-foreground'
  return (
    <div>
      {label && (
        <div className="bt-body mb-1 flex items-baseline justify-between">
          <span>{label}</span>
          <span className="text-muted-foreground tabular-nums">{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${fillColor} transition-[width] duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
