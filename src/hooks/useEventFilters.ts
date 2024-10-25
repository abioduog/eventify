"use client"

import { useCallback, useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

interface Event {
  id: number
  title: string
  date: string
  location: string
  description: string
  price: number
  category: string
}

export function useEventFilters(events: Event[]) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const search = searchParams.get('search')?.toLowerCase()
      const category = searchParams.get('category')
      const minPrice = Number(searchParams.get('minPrice'))
      const maxPrice = Number(searchParams.get('maxPrice'))
      const location = searchParams.get('location')?.toLowerCase()

      if (search && !event.title.toLowerCase().includes(search) && 
          !event.description.toLowerCase().includes(search)) {
        return false
      }

      if (category && category !== 'All' && event.category !== category) {
        return false
      }

      if (minPrice && event.price < minPrice) {
        return false
      }

      if (maxPrice && event.price > maxPrice) {
        return false
      }

      if (location && !event.location.toLowerCase().includes(location)) {
        return false
      }

      return true
    })
  }, [events, searchParams])

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])

  return {
    filteredEvents,
    updateFilters,
    clearFilters,
  }
}
