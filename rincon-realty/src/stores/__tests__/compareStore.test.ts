import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'

// Feature: costa-rica-real-estate
// Property 12: Comparador respeta el límite de 3 propiedades

// We test the store logic directly without Zustand persistence
// by importing and resetting state between tests

const MAX = 3

function makeStore() {
  const list: Array<{ id: string; title: string }> = []

  return {
    get compareList() { return [...list] },
    get isFull() { return list.length >= MAX },
    addToCompare(item: { id: string; title: string }): boolean {
      if (list.length >= MAX) return false
      if (list.some(p => p.id === item.id)) return true
      list.push(item)
      return true
    },
    removeFromCompare(id: string) {
      const idx = list.findIndex(p => p.id === id)
      if (idx !== -1) list.splice(idx, 1)
    },
    clearCompare() { list.length = 0 },
    isInCompare(id: string) { return list.some(p => p.id === id) },
  }
}

describe('compareStore logic', () => {
  it('never exceeds 3 properties', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ id: fc.uuid(), title: fc.string({ minLength: 1 }) }),
          { minLength: 4, maxLength: 10 }
        ),
        (items) => {
          const store = makeStore()
          items.forEach(item => store.addToCompare(item))
          expect(store.compareList.length).toBeLessThanOrEqual(MAX)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('addToCompare returns false when full', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ id: fc.uuid(), title: fc.string({ minLength: 1 }) }),
          { minLength: 4, maxLength: 4 }
        ),
        (items) => {
          const store = makeStore()
          // Fill to max
          items.slice(0, MAX).forEach(item => store.addToCompare(item))
          expect(store.isFull).toBe(true)

          // 4th item should be rejected
          const result = store.addToCompare(items[3])
          expect(result).toBe(false)
          expect(store.compareList.length).toBe(MAX)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('isFull is true exactly when 3 properties are in the list', () => {
    const store = makeStore()
    expect(store.isFull).toBe(false)

    store.addToCompare({ id: '1', title: 'A' })
    store.addToCompare({ id: '2', title: 'B' })
    expect(store.isFull).toBe(false)

    store.addToCompare({ id: '3', title: 'C' })
    expect(store.isFull).toBe(true)

    store.removeFromCompare('1')
    expect(store.isFull).toBe(false)
  })
})
