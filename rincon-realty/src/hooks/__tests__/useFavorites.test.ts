import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../useFavorites'

// Feature: costa-rica-real-estate
// Property 13: Favoritos — round-trip de agregar y eliminar

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

beforeEach(() => {
  localStorageMock.clear()
})

describe('useFavorites', () => {
  it('add → isFavorite=true, remove → isFavorite=false (round-trip)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (slug) => {
          localStorageMock.clear()
          const { result } = renderHook(() => useFavorites())

          act(() => result.current.addFavorite(slug))
          expect(result.current.isFavorite(slug)).toBe(true)

          act(() => result.current.removeFavorite(slug))
          expect(result.current.isFavorite(slug)).toBe(false)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('adding a slug does not affect other slugs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (slug1, slug2) => {
          fc.pre(slug1 !== slug2)
          localStorageMock.clear()
          const { result } = renderHook(() => useFavorites())

          act(() => result.current.addFavorite(slug1))
          expect(result.current.isFavorite(slug2)).toBe(false)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('count reflects the number of favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.count).toBe(0)

    act(() => result.current.addFavorite('slug-a'))
    expect(result.current.count).toBe(1)

    act(() => result.current.addFavorite('slug-b'))
    expect(result.current.count).toBe(2)

    act(() => result.current.removeFavorite('slug-a'))
    expect(result.current.count).toBe(1)
  })
})
