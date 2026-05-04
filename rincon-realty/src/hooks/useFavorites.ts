'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'rr_favorites'

export interface UseFavoritesReturn {
  favorites: string[]
  addFavorite: (slug: string) => void
  removeFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  count: number
}

function readFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeToStorage(slugs: string[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  } catch {
    // ignore storage errors
  }
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    setFavorites(readFromStorage())
  }, [])

  const addFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      if (prev.includes(slug)) return prev
      const next = [...prev, slug]
      writeToStorage(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.filter((s) => s !== slug)
      writeToStorage(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  )

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    count: favorites.length,
  }
}
