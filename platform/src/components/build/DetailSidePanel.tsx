import type { ReactNode } from 'react'

interface Section {
  label: string
  body: ReactNode
}

export function DetailSidePanel({
  title,
  subtitle,
  sections,
}: {
  title: string
  subtitle?: string
  sections: Section[]
}) {
  return (
    <aside className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="border-b border-border pb-3">
        <h3 className="bt-heading">{title}</h3>
        {subtitle && <p className="bt-body mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-3 space-y-4">
        {sections.map((s) => (
          <div key={s.label}>
            <p className="bt-label mb-1.5">{s.label}</p>
            <div className="bt-body">{s.body}</div>
          </div>
        ))}
      </div>
    </aside>
  )
}
