'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCompare, X } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { createBrowserClient } from '@/lib/supabase/client'
import { formatPrice, formatArea, localizedField } from '@/lib/utils/format'
import { useLocale } from 'next-intl'
import type { Property, Locale } from '@/types'

export default function ComparePage() {
  const locale = useLocale() as Locale
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const prefix = locale === 'es' ? '/es' : ''

  useEffect(() => {
    if (compareList.length === 0) {
      setProperties([])
      return
    }

    setLoading(true)
    const supabase = createBrowserClient()
    const ids = compareList.map((item) => item.id)

    supabase
      .from('properties')
      .select(`*, community:communities(id, slug, name_en, name_es), images:property_images(*)`)
      .in('id', ids)
      .eq('status', 'published')
      .then(({ data }: { data: unknown[] | null }) => {
        setProperties((data ?? []) as unknown as Property[])
        setLoading(false)
      })
  }, [compareList])

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <GitCompare className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-ink mb-2">
          {locale === 'es' ? 'Comparar propiedades' : 'Compare properties'}
        </h1>
        <p className="text-neutral-500 mb-6">
          {locale === 'es'
            ? 'Explora propiedades y haz clic en "Comparar" para agregarlas aquí.'
            : 'Browse properties and click "Compare" to add them here.'}
        </p>
        <Link
          href={`${prefix}/properties`}
          className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {locale === 'es' ? 'Explorar propiedades' : 'Browse properties'}
        </Link>
      </div>
    )
  }

  const typeLabels: Record<string, string> = {
    house: locale === 'es' ? 'Casa' : 'House',
    land:  locale === 'es' ? 'Terreno' : 'Land',
    farm:  locale === 'es' ? 'Finca' : 'Farm',
  }

  const rows = [
    { label: locale === 'es' ? 'Precio' : 'Price', key: 'price' },
    { label: locale === 'es' ? 'Tipo' : 'Type', key: 'type' },
    { label: locale === 'es' ? 'Área' : 'Area', key: 'area' },
    { label: locale === 'es' ? 'Habitaciones' : 'Bedrooms', key: 'bedrooms' },
    { label: locale === 'es' ? 'Baños' : 'Bathrooms', key: 'bathrooms' },
    { label: locale === 'es' ? 'Comunidad' : 'Community', key: 'community' },
  ]

  function getCellValue(property: Property, key: string): string {
    switch (key) {
      case 'price':     return formatPrice(property.price_usd, locale)
      case 'type':      return typeLabels[property.type] ?? property.type
      case 'area':      return formatArea(property.area_m2, locale)
      case 'bedrooms':  return property.bedrooms != null ? String(property.bedrooms) : '—'
      case 'bathrooms': return property.bathrooms != null ? String(property.bathrooms) : '—'
      case 'community': return property.community ? localizedField(property.community, 'name', locale) : '—'
      default:          return '—'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink">
          {locale === 'es' ? 'Comparar propiedades' : 'Compare properties'}
        </h1>
        <button
          onClick={clearCompare}
          className="text-sm text-neutral-500 hover:text-ink transition-colors"
        >
          {locale === 'es' ? 'Limpiar todo' : 'Clear all'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500">
          {locale === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-32 text-left p-3 text-sm font-medium text-neutral-500"></th>
                {properties.map((property) => {
                  const title = localizedField(property, 'title', locale)
                  const slug = locale === 'es' ? property.slug_es : property.slug_en
                  const cover = property.images?.[0]

                  return (
                    <th key={property.id} className="p-3 text-left min-w-[220px]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3 bg-neutral-100">
                        {cover && (
                          <Image src={cover.url} alt={title} fill sizes="220px" className="object-cover" />
                        )}
                      </div>
                      <p className="font-heading font-semibold text-ink text-sm line-clamp-2 mb-2">{title}</p>
                      <div className="flex gap-2">
                        <Link
                          href={`${prefix}/properties/${slug}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {locale === 'es' ? 'Ver detalles' : 'View details'}
                        </Link>
                        <button
                          onClick={() => removeFromCompare(property.id)}
                          className="text-xs text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
                        >
                          <X className="h-3 w-3" />
                          {locale === 'es' ? 'Quitar' : 'Remove'}
                        </button>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const values = properties.map((p) => getCellValue(p, row.key))
                const allSame = values.every((v) => v === values[0])

                return (
                  <tr key={row.key} className="border-t border-neutral-100">
                    <td className="p-3 text-sm font-medium text-neutral-500">{row.label}</td>
                    {values.map((value, i) => (
                      <td
                        key={i}
                        className={`p-3 text-sm text-ink ${!allSame ? 'bg-accent/5' : ''}`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
