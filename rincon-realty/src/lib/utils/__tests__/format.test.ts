import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { localizedField, formatPrice } from '../format'

// Feature: costa-rica-real-estate
// Property 15: Contenido dinámico en el locale activo

describe('localizedField', () => {
  it('returns the locale field when it exists and is non-empty (non-whitespace)', () => {
    fc.assert(
      fc.property(
        // Use strings with at least one non-whitespace character
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (enVal, esVal) => {
          const obj = { title_en: enVal, title_es: esVal }
          expect(localizedField(obj, 'title', 'en')).toBe(enVal)
          expect(localizedField(obj, 'title', 'es')).toBe(esVal)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('falls back to _en when _es is empty', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (enVal) => {
          const obj = { title_en: enVal, title_es: '' }
          expect(localizedField(obj, 'title', 'es')).toBe(enVal)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('never returns undefined or null', () => {
    fc.assert(
      fc.property(
        fc.record({
          title_en: fc.string(),
          title_es: fc.string(),
        }),
        fc.constantFrom('en' as const, 'es' as const),
        (obj, locale) => {
          const result = localizedField(obj, 'title', locale)
          expect(result).not.toBeUndefined()
          expect(result).not.toBeNull()
          expect(typeof result).toBe('string')
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('formatPrice', () => {
  it('always returns a non-empty string for valid numbers', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10_000_000, noNaN: true }),
        (price) => {
          const result = formatPrice(price, 'en')
          expect(result.length).toBeGreaterThan(0)
          expect(result).toContain('$')
        }
      ),
      { numRuns: 100 }
    )
  })
})
