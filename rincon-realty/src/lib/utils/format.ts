import type { Locale } from '@/types'

/**
 * Formatea un precio en USD con separadores de miles.
 * Ejemplo: 450000 → "$450,000"
 */
export function formatPrice(usd: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd)
}

/**
 * Formatea un área en m² con separadores de miles.
 * Ejemplo: 1200 → "1,200 m²"
 */
export function formatArea(m2: number, locale: Locale = 'en'): string {
  return `${new Intl.NumberFormat(locale === 'es' ? 'es-CR' : 'en-US').format(m2)} m²`
}

/**
 * Selecciona el campo localizado de un objeto según el locale activo.
 * Fallback a _en si el campo _es está vacío o no existe.
 *
 * @example
 * localizedField(property, 'title', 'es') // → property.title_es ?? property.title_en
 */
export function localizedField<T extends Record<string, any>>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  const localeKey = `${field}_${locale}` as keyof T
  const fallbackKey = `${field}_en` as keyof T
  const value = obj[localeKey]
  if (typeof value === 'string' && value.trim() !== '') return value
  const fallback = obj[fallbackKey]
  if (typeof fallback === 'string') return fallback
  return ''
}

/**
 * Estima el tiempo de lectura de un texto en minutos.
 */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

/**
 * Formatea una fecha ISO a formato legible.
 */
export function formatDate(iso: string, locale: Locale = 'en'): string {
  return new Date(iso).toLocaleDateString(locale === 'es' ? 'es-CR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
