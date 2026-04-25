'use client'

import { useEffect } from 'react'

// Forces the `dark` class on <html> while mounted, regardless of the user's
// next-themes preference. Restores prior state on unmount. Used on auth and
// admin surfaces (login, request access, forgot password, reset password,
// /admin) where the gold-on-black brand requires dark mode.
//
// Direct DOM mutation avoids fighting next-themes' internal state — we don't
// touch localStorage, so the user's chosen theme on /dashboard and /chat is
// preserved.
export function ForceDarkMode() {
  useEffect(() => {
    const root = document.documentElement
    const hadDark = root.classList.contains('dark')
    const hadLight = root.classList.contains('light')
    root.classList.remove('light')
    root.classList.add('dark')
    return () => {
      if (!hadDark) root.classList.remove('dark')
      if (hadLight) root.classList.add('light')
    }
  }, [])
  return null
}
