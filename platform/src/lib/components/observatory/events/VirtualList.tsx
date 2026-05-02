'use client'

import * as React from 'react'

interface VirtualListProps<T> {
  items: readonly T[]
  rowHeight: number
  viewportHeight: number
  overscan?: number
  renderRow: (item: T, index: number) => React.ReactNode
  className?: string
  testId?: string
  // Optional onScrollEnd hook for infinite-load triggers — not used by S1.12
  // since pagination is explicit via "Load more"; kept for future ergonomics.
  onScrollEnd?: () => void
}

// Dependency-free fixed-row-height windowing. Renders only the rows whose
// indices fall in [startIndex, endIndex). The full scrollable area is sized
// to `items.length * rowHeight` so the scrollbar tracks the dataset honestly.
export function VirtualList<T>({
  items,
  rowHeight,
  viewportHeight,
  overscan = 3,
  renderRow,
  className,
  testId,
  onScrollEnd,
}: VirtualListProps<T>): React.ReactElement {
  const [scrollTop, setScrollTop] = React.useState(0)

  const totalHeight = items.length * rowHeight
  const visibleCount = Math.max(1, Math.ceil(viewportHeight / rowHeight))
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)

  const slice = items.slice(startIndex, endIndex)
  const offsetY = startIndex * rowHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const next = e.currentTarget.scrollTop
    setScrollTop(next)
    if (onScrollEnd && next + viewportHeight >= totalHeight - rowHeight) {
      onScrollEnd()
    }
  }

  return (
    <div
      data-testid={testId}
      className={className}
      onScroll={handleScroll}
      style={{ height: viewportHeight, overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {slice.map((item, i) => (
            <div
              key={startIndex + i}
              data-row-index={startIndex + i}
              style={{ height: rowHeight }}
            >
              {renderRow(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
