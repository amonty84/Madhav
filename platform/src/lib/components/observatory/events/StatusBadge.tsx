'use client'

import * as React from 'react'

interface StatusBadgeProps {
  status: string
}

// success=green, error=red, timeout=amber. Anything else falls back to neutral.
const STATUS_CLASSES: Record<string, string> = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  timeout: 'bg-amber-100 text-amber-800 border-amber-300',
}

export function StatusBadge({ status }: StatusBadgeProps): React.ReactElement {
  const tone = STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-800 border-gray-300'
  return (
    <span
      data-testid={`status-badge-${status}`}
      data-status={status}
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      {status}
    </span>
  )
}
