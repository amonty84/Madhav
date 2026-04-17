import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface LayerEntry {
  layer: string
  sublayer: string
  status: 'not_started' | 'in_progress' | 'complete'
}

interface Props {
  layers: LayerEntry[]
  isUpdating?: string
}

const LAYER_ORDER = ['L1', 'L2', 'L2.5', 'L3', 'L4']

function statusVariant(status: LayerEntry['status']): 'default' | 'secondary' | 'outline' {
  if (status === 'complete') return 'default'
  if (status === 'in_progress') return 'secondary'
  return 'outline'
}

function statusLabel(status: LayerEntry['status']): string {
  if (status === 'complete') return 'done'
  if (status === 'in_progress') return 'active'
  return 'pending'
}

export function PyramidStatusPanel({ layers, isUpdating }: Props) {
  // Group by layer
  const grouped = LAYER_ORDER.reduce<Record<string, LayerEntry[]>>((acc, lname) => {
    acc[lname] = layers.filter(l => l.layer === lname)
    return acc
  }, {})

  // Also capture any layers not in the known order
  const extraLayers = [...new Set(layers.map(l => l.layer))].filter(
    l => !LAYER_ORDER.includes(l)
  )
  extraLayers.forEach(l => {
    grouped[l] = layers.filter(e => e.layer === l)
  })

  const allGroups = [...LAYER_ORDER, ...extraLayers]

  return (
    <aside className="w-[280px] shrink-0 border-l flex flex-col overflow-y-auto">
      <div className="px-3 py-2 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Pyramid Status
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {allGroups.map(lname => {
          const sublayers = grouped[lname]
          if (!sublayers || sublayers.length === 0) return null

          return (
            <div key={lname} className="mb-3">
              <p className="text-xs font-medium text-foreground px-1 mb-1">{lname}</p>
              <div className="space-y-1">
                {sublayers.map(sl => (
                  <div
                    key={sl.sublayer}
                    className="flex items-center justify-between px-2 py-1 rounded hover:bg-muted/50"
                  >
                    <span className="text-xs text-muted-foreground truncate mr-2" title={sl.sublayer}>
                      {sl.sublayer}
                    </span>
                    <Badge
                      variant={statusVariant(sl.status)}
                      className={cn(
                        'text-[10px] px-1.5 py-0 h-4 shrink-0',
                        isUpdating === sl.sublayer && 'animate-pulse'
                      )}
                    >
                      {statusLabel(sl.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {layers.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No layers yet
          </p>
        )}
      </div>
    </aside>
  )
}
