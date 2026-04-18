'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { UIMessage } from 'ai'

// Session-local branching. When a user edits a message, the pre-edit message
// list is archived under the edited message's id. The user can navigate back
// through archived versions. NOT persisted — a page reload loses the branches,
// which is the explicit MVP tradeoff vs. the schema-level refactor this would
// otherwise require.

interface ViewingBranch {
  editId: string
  index: number // 0 = oldest archived branch at this edit point
}

export function useBranches(conversationId: string | undefined) {
  const [branches, setBranches] = useState<Record<string, UIMessage[][]>>({})
  const [viewing, setViewing] = useState<ViewingBranch | null>(null)

  // Clear all branch state whenever we switch conversations.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBranches({})
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewing(null)
  }, [conversationId])

  const archiveBranch = useCallback((editId: string, snapshot: UIMessage[]) => {
    setBranches(b => {
      const existing = b[editId] ?? []
      return { ...b, [editId]: [...existing, snapshot] }
    })
    setViewing(null)
  }, [])

  // editId → [oldest … newest-archived, live]. Total count is archived + 1.
  const stats = useMemo(() => {
    const s: Record<string, { total: number; current: number }> = {}
    for (const [editId, arr] of Object.entries(branches)) {
      const total = arr.length + 1
      let current = total - 1 // live
      if (viewing && viewing.editId === editId) current = viewing.index
      s[editId] = { total, current }
    }
    return s
  }, [branches, viewing])

  const goToBranch = useCallback(
    (editId: string, index: number) => {
      const versions = branches[editId]
      if (!versions) return
      const total = versions.length + 1
      if (index < 0 || index >= total) return
      if (index === total - 1) {
        setViewing(null)
      } else {
        setViewing({ editId, index })
      }
    },
    [branches]
  )

  const stepBranch = useCallback(
    (editId: string, delta: -1 | 1) => {
      const s = stats[editId]
      if (!s) return
      goToBranch(editId, s.current + delta)
    },
    [stats, goToBranch]
  )

  // When viewing an archived branch, expose that snapshot; otherwise null so
  // the caller falls back to live messages.
  const viewingMessages = useMemo<UIMessage[] | null>(() => {
    if (!viewing) return null
    return branches[viewing.editId]?.[viewing.index] ?? null
  }, [viewing, branches])

  return {
    branches,
    stats,
    viewing,
    isViewingArchived: viewingMessages !== null,
    viewingMessages,
    archiveBranch,
    goToBranch,
    stepBranch,
    returnToLive: () => setViewing(null),
  }
}
