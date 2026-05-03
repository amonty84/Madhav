'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ALL_EVENT_COLUMNS,
  COLUMN_STORAGE_KEY,
  DEFAULT_VISIBLE_COLUMNS,
  type EventColumnId,
} from './types'

function readFromStorage(): EventColumnId[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(COLUMN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    const allowed = new Set<string>(ALL_EVENT_COLUMNS)
    const filtered = parsed.filter(
      (v): v is EventColumnId => typeof v === 'string' && allowed.has(v),
    )
    return filtered.length > 0 ? filtered : null
  } catch {
    return null
  }
}

function writeToStorage(cols: EventColumnId[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(cols))
  } catch {
    // localStorage may be unavailable (private mode quota, etc.) — fail silently
  }
}

export function useColumnVisibility(): {
  visible: EventColumnId[]
  isVisible: (col: EventColumnId) => boolean
  toggle: (col: EventColumnId) => void
  reset: () => void
} {
  const [visible, setVisible] = useState<EventColumnId[]>(() => {
    return readFromStorage() ?? [...DEFAULT_VISIBLE_COLUMNS]
  })

  useEffect(() => {
    writeToStorage(visible)
  }, [visible])

  const toggle = useCallback((col: EventColumnId) => {
    setVisible((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
    )
  }, [])

  const reset = useCallback(() => {
    setVisible([...DEFAULT_VISIBLE_COLUMNS])
  }, [])

  const isVisible = useCallback(
    (col: EventColumnId) => visible.includes(col),
    [visible],
  )

  return { visible, isVisible, toggle, reset }
}
