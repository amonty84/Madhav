'use client'

import { useEffect } from 'react'

interface Bindings {
  onPalette?: () => void
  onNewChat?: () => void
  onToggleSidebar?: () => void
  onShortcutsHelp?: () => void
  onEscape?: () => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return true
  if (target.isContentEditable) return true
  return false
}

export function useHotkeys(bindings: Bindings) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k' && !e.shiftKey) {
        e.preventDefault()
        bindings.onPalette?.()
        return
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault()
        bindings.onNewChat?.()
        return
      }
      if (mod && e.key.toLowerCase() === 'b' && !e.shiftKey) {
        if (isTypingTarget(e.target)) return
        e.preventDefault()
        bindings.onToggleSidebar?.()
        return
      }
      if (mod && e.key === '/') {
        e.preventDefault()
        bindings.onShortcutsHelp?.()
        return
      }
      if (e.key === 'Escape') {
        bindings.onEscape?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bindings])
}
