'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ModelId, StyleId } from '@/components/chat/ModelStylePicker'
import { DEFAULT_MODEL_ID, isValidModelId } from '@/lib/models/registry'

const DEFAULT_MODEL: ModelId = DEFAULT_MODEL_ID
const DEFAULT_STYLE: StyleId = 'acharya'
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
        model: parsed.model && isValidModelId(parsed.model) ? parsed.model : DEFAULT_MODEL,
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
