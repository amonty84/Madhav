'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

// Routes the dark-mode pin through next-themes' own state machine so the
// library won't overwrite the class on its own hydration effect tick.
// Used on auth and admin surfaces where gold-on-black brand requires dark mode.
export function ForceDarkMode() {
  const { setTheme, resolvedTheme } = useTheme()
  useEffect(() => {
    const prev = resolvedTheme ?? 'system'
    setTheme('dark')
    return () => { setTheme(prev) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
