export default function TimelineLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 h-7 w-32 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-lg border border-border p-4">
            <div className="mt-1 h-4 w-16 shrink-0 animate-pulse rounded bg-muted" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
