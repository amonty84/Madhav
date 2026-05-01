export default function ChartProfileLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero skeleton */}
      <div className="relative w-full overflow-hidden bg-muted" style={{ minHeight: 480 }}>
        <div className="flex flex-col items-center gap-6 px-6 py-10 md:flex-row md:items-start md:gap-10 md:px-12">
          <div className="h-[360px] w-[360px] shrink-0 animate-pulse rounded bg-muted-foreground/10" />
          <div className="flex flex-col gap-3 pt-0 md:pt-8">
            <div className="h-10 w-64 animate-pulse rounded bg-muted-foreground/10" />
            <div className="h-4 w-80 animate-pulse rounded bg-muted-foreground/10" />
            <div className="h-3 w-40 animate-pulse rounded bg-muted-foreground/10" />
          </div>
        </div>
      </div>

      {/* Room cards skeleton */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-lg border border-border p-5">
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
              <div className="mt-auto h-6 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
