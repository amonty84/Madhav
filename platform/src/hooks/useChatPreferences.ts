'use client'

import { useCallback, useEffect, useState } from 'react'
import type { StyleId } from '@/components/chat/ModelStylePicker'
import {
  DEFAULT_STACK_ID,
  STACK_ROUTING,
  type ModelStack,
} from '@/lib/models/registry'

export type { ModelStack }

const DEFAULT_STACK: ModelStack = DEFAULT_STACK_ID
const DEFAULT_STYLE: StyleId = 'acharya'
const VALID_STYLES: StyleId[] = ['acharya', 'brief', 'client']

const VALID_STACKS = Object.keys(STACK_ROUTING) as ModelStack[]

function keyFor(chartId: string) {
  return `marsys-jis:consume-prefs:${chartId}`
}

interface Prefs {
  stack: ModelStack
  style: StyleId
}

export function useChatPreferences(chartId: string) {
  const [prefs, setPrefs] = useState<Prefs>({ stack: DEFAULT_STACK, style: DEFAULT_STYLE })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(chartId))
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<Prefs>
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefs({
        stack: parsed.stack && VALID_STACKS.includes(parsed.stack) ? parsed.stack : DEFAULT_STACK,
        style: VALID_STYLES.includes(parsed.style as StyleId) ? (parsed.style as StyleId) : DEFAULT_STYLE,
      })
    } catch {}
  }, [chartId])

  const setStack = useCallback(
    (stack: ModelStack) => {
      setPrefs(cur => {
        const next = { ...cur, stack }
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

  return { stack: prefs.stack, style: prefs.style, setStack, setStyle }
}
