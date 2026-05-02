'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { defaultFilters, filtersToParams, parseFilters } from './serialization'
import type { ObservatoryFilters } from './types'

/** Reads/writes ObservatoryFilters from the URL query string. The single source
 *  of truth is the URL — every change pushes a new search-string via
 *  router.replace so the filtered view is shareable. */
export function useObservatoryFilters(): {
  filters: ObservatoryFilters
  setFilters: (next: ObservatoryFilters) => void
  patchFilters: (patch: Partial<ObservatoryFilters>) => void
  clearAll: () => void
} {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams?.toString() ?? '')),
    [searchParams],
  )

  const writeUrl = useCallback(
    (next: ObservatoryFilters) => {
      const qs = filtersToParams(next).toString()
      const path = pathname ?? ''
      router.replace(qs ? `${path}?${qs}` : path, { scroll: false })
    },
    [pathname, router],
  )

  const setFilters = useCallback(
    (next: ObservatoryFilters) => writeUrl(next),
    [writeUrl],
  )

  const patchFilters = useCallback(
    (patch: Partial<ObservatoryFilters>) => writeUrl({ ...filters, ...patch }),
    [filters, writeUrl],
  )

  const clearAll = useCallback(() => writeUrl(defaultFilters()), [writeUrl])

  return { filters, setFilters, patchFilters, clearAll }
}
