'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ModelId, StyleId } from '@/components/chat/ModelStylePicker'

const DEFAULT_MODEL: ModelId = 'claude-sonnet-4-6'
const DEFAULT_STYLE: StyleId = 'acharya'
const VALID_MODELS: ModelId[] = ['claude-sonnet-4-6', 'claude-haiku-4-5', 'claude-opus-4-7']
const VALID_STYLES: StyleId[] = ['acharya', 'brief', 'client']

function keyFor(chartId: string) {
  return `amjis:consume-prefs:${chartId}`
}

interface Prefs {
  model: ModelId
  style: StyleId
}

export function useChatPreferences(chartId: string) {
  const [prefs, setPrefs] = useState<Prefs>({ model: DEFAULT_MODEL, style: DEFAULT_STYLE })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(chartId))
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<Prefs>
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefs({
        model: VALID_MODELS.includes(parsed.model as ModelId) ? (parsed.model as ModelId) : DEFAULT_MODEL,
        style: VALID_STYLES.includes(parsed.style as StyleId) ? (parsed.style as StyleId) : DEFAULT_STYLE,
      })
    } catch {}
  }, [chartId])

  const setModel = useCallback(
    (model: ModelId) => {
      setPrefs(cur => {
        const next = { ...cur, model }
        try {
          localStorage.setItem(keyFor(chartId), JSON.stringify(next))
        } catch {}
        return next
      })
    },
    [chartId]
  )

  const setStyle = useCallback(
    (style: StyleId) => {
      setPrefs(cur => {
        const next = { ...cur, style }
        try {
          localStorage.setItem(keyFor(chartId), JSON.stringify(next))
        } catch {}
        return next
      })
    },
    [chartId]
  )

  return { model: prefs.model, style: prefs.style, setModel, setStyle }
}
