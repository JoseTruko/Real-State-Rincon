'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { createBrowserClient } from '@/lib/supabase/client'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton'
import { useLocale } from 'next-intl'
import type { PropertyCardData, Locale } from '@/types'

export default function FavoritesPage() {
  const locale = useLocale() as Locale
  const { favorites, count } = useFavorites()
  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [loading, setLoading] = useState(false)
  const prefix = locale === 'es' ? '/es' : ''

  useEffect(() => {
    if (favorites.length === 0) {
      setProperties([])
      return
    }

    setLoading(true)
    const supabase = createBrowserClient()

    supabase
      .from('properties')
      .select(`
        id, slug_en, slug_es, title_en, title_es,
        price_usd, type, area_m2, bedrooms, bathrooms, featured,
        community:communities(id, slug, name_en, name_es),
        images:property_images(id, url, alt_text, sort_order)
      `)
      .in('slug_en', favorites)
      .then(({ data }: { data: unknown[] | null }) => {
        setProperties((data ?? []) as unknown as PropertyCardData[])
        setLoading(false)
      })
  }, [favorites])

  if (count === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-ink mb-2">
          {locale === 'es' ? 'Propiedades guardadas' : 'Saved properties'}
        </h1>
        <p className="text-neutral-500 mb-6">
          {locale === 'es'
            ? 'Aún no tienes propiedades guardadas. Explora y haz clic en el corazón para guardarlas.'
            : "You haven't saved any properties yet. Browse and click the heart icon to save them."}
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">
        {locale === 'es' ? 'Propiedades guardadas' : 'Saved properties'}
      </h1>
      <p className="text-neutral-500 mb-8">
        {count} {locale === 'es' ? 'propiedades guardadas' : 'saved properties'}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCardSkeleton count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} locale={locale} />
          ))}
          {/* Show unavailable placeholders for favorites not found in DB */}
          {favorites
            .filter((slug) => !properties.some((p) => p.slug_en === slug))
            .map((slug) => (
              <div
                key={slug}
                className="bg-surface border border-neutral-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 opacity-60"
              >
                <Heart className="h-8 w-8 text-neutral-300" />
                <p className="text-sm text-neutral-500">
                  {locale === 'es' ? 'Ya no disponible' : 'No longer available'}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
