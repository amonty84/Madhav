'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Rating = 1 | -1 | null

export function useFeedback(conversationId: string | undefined) {
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [error, setError] = useState<string | null>(null)
  // Track which conversation id the ratings map is loaded for; prevents
  // stale ratings flashing after navigating between conversations.
  const loadedFor = useRef<string | null>(null)

  useEffect(() => {
    if (!conversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRatings({})
      setError(null)
      loadedFor.current = null
      return
    }
    if (loadedFor.current === conversationId) return
    let cancelled = false
    loadedFor.current = conversationId
    fetch(`/api/conversations/${conversationId}/feedback`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`fetch ${r.status}`))))
      .then((data: { feedback: { message_id: string; rating: 1 | -1 }[] }) => {
        if (cancelled) return
        const next: Record<string, Rating> = {}
        for (const row of data.feedback ?? []) next[row.message_id] = row.rating
        setRatings(next)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load ratings.')
      })
    return () => {
      cancelled = true
    }
  }, [conversationId])

  const rate = useCallback(
    (messageId: string, rating: Rating) => {
      if (!conversationId) return
      const prev = ratings[messageId] ?? null
      // Optimistic update
      setRatings(cur => ({ ...cur, [messageId]: rating }))
      setError(null)
      fetch(`/api/conversations/${conversationId}/feedback`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messageId, rating }),
      })
        .then(r => {
          if (!r.ok) throw new Error(`feedback ${r.status}`)
        })
        .catch((err: unknown) => {
          setRatings(cur => ({ ...cur, [messageId]: prev }))
          setError(err instanceof Error ? err.message : 'Failed to save rating.')
        })
    },
    [conversationId, ratings]
  )

  return { ratings, rate, error }
}
