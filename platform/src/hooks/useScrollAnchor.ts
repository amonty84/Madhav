'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseScrollAnchorOptions {
  thresholdPx?: number
}

interface UseScrollAnchorReturn {
  scrollRef: React.RefObject<HTMLDivElement | null>
  bottomRef: React.RefObject<HTMLDivElement | null>
  isAtBottom: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

/**
 * Pin-to-bottom scroll helper designed to survive streaming without shake.
 *
 * The previous implementation observed every child with a ResizeObserver and
 * re-registered them via a subtree MutationObserver on every DOM mutation,
 * then called scrollTo synchronously on each RO callback. The resulting scroll
 * event fed back into setState, causing an oscillation loop during streaming.
 *
 * This version:
 *   - uses ONE ResizeObserver on the container + its inner content wrapper
 *   - coalesces scroll writes into a single rAF
 *   - guards the scroll event listener so programmatic scrolls don't flip state
 *   - only calls setState when the at-bottom status actually changes
 */
export function useScrollAnchor(options: UseScrollAnchorOptions = {}): UseScrollAnchorReturn {
  const { thresholdPx = 96 } = options
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const pinToBottomRef = useRef(true)
  const programmaticScrollRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const scheduleScrollToBottom = useCallback(() => {
    if (!pinToBottomRef.current) return
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const el = scrollRef.current
      if (!el || !pinToBottomRef.current) return
      programmaticScrollRef.current = true
      el.scrollTop = el.scrollHeight
      requestAnimationFrame(() => {
        programmaticScrollRef.current = false
      })
    })
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return
    pinToBottomRef.current = true
    programmaticScrollRef.current = true
    el.scrollTo({ top: el.scrollHeight, behavior })
    setIsAtBottom(true)
    requestAnimationFrame(() => {
      programmaticScrollRef.current = false
    })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      if (programmaticScrollRef.current) return
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      const atBottom = distance <= thresholdPx
      if (atBottom !== pinToBottomRef.current) {
        pinToBottomRef.current = atBottom
        setIsAtBottom(atBottom)
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [thresholdPx])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver(() => scheduleScrollToBottom())

    // Observe the container plus every direct child. The container alone won't
    // fire on content growth (it has flex-1 with a fixed height). Children are
    // what grow — e.g. MessageList's root. ResizeObserver.observe is idempotent
    // per target, so re-observing is cheap.
    const observeAll = () => {
      ro.observe(el)
      for (let i = 0; i < el.children.length; i++) {
        ro.observe(el.children[i])
      }
    }
    observeAll()

    // Re-bind when direct children swap (e.g. WelcomeGreeting → MessageList).
    // subtree:false — we don't care about deep mutations here, only top-level.
    const mo = new MutationObserver(observeAll)
    mo.observe(el, { childList: true, subtree: false })

    return () => {
      ro.disconnect()
      mo.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scheduleScrollToBottom])

  return { scrollRef, bottomRef, isAtBottom, scrollToBottom }
}
