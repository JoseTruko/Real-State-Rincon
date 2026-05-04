import { Suspense } from 'react'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { getProperties } from '@/lib/data/properties'
import { getCommunities } from '@/lib/data/communities'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton'
import SearchBar from '@/components/search/SearchBar'
import { SITE_NAME } from '@/config/site'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale, PropertyType } from '@/types'
import type { Metadata } from 'next'

interface PropertiesPageProps {
  params: { locale: string }
  searchParams: {
    type?: string
    community_id?: string
    price_min?: string
    price_max?: string
    area_min?: string
    area_max?: string
    page?: string
    featured?: string
  }
}

export async function generateMetadata({ params }: PropertiesPageProps): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: locale === 'es' ? 'Propiedades en Venta' : 'Properties for Sale',
    description: locale === 'es'
      ? 'Explora casas, terrenos y fincas en venta en Guanacaste, Costa Rica.'
      : 'Browse houses, land & farms for sale in Guanacaste, Costa Rica.',
    locale,
    enPath: '/properties',
  })
}

export default async function PropertiesPage({ params, searchParams }: PropertiesPageProps) {
  const locale = params.locale as Locale

  const filters = {
    type: searchParams.type as PropertyType | undefined,
    community_id: searchParams.community_id,
    price_min: searchParams.price_min ? Number(searchParams.price_min) : undefined,
    price_max: searchParams.price_max ? Number(searchParams.price_max) : undefined,
    area_min: searchParams.area_min ? Number(searchParams.area_min) : undefined,
    area_max: searchParams.area_max ? Number(searchParams.area_max) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    featured: searchParams.featured === 'true' ? true : undefined,
  }

  const [{ properties, total, page, totalPages }, communities] = await Promise.all([
    getProperties(filters),
    getCommunities(),
  ])

  const prefix = locale === 'es' ? '/es' : ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink mb-2">
          {locale === 'es' ? 'Propiedades en venta' : 'Properties for sale'}
        </h1>
        <p className="text-neutral-500">
          {total > 0
            ? `${total} ${locale === 'es' ? 'propiedades encontradas' : 'properties found'}`
            : locale === 'es' ? 'No se encontraron propiedades' : 'No properties found'}
        </p>
      </div>

      {/* Search / Filter bar */}
      <div className="mb-8">
        <Suspense>
          <SearchBar communities={communities} locale={locale} />
        </Suspense>
      </div>

      {/* Results grid */}
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={locale} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`${prefix}/properties?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm hover:bg-neutral transition-colors"
                >
                  {locale === 'es' ? 'Anterior' : 'Previous'}
                </Link>
              )}
              <span className="text-sm text-neutral-500">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`${prefix}/properties?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm hover:bg-neutral transition-colors"
                >
                  {locale === 'es' ? 'Siguiente' : 'Next'}
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <SlidersHorizontal className="h-12 w-12 text-neutral-300" />
          <p className="text-lg font-medium text-ink">
            {locale === 'es' ? 'No se encontraron propiedades' : 'No properties found'}
          </p>
          <p className="text-neutral-500 text-sm">
            {locale === 'es' ? 'Intenta ajustar los filtros.' : 'Try adjusting your filters.'}
          </p>
          <Link
            href={`${prefix}/properties`}
            className="mt-2 inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
          </Link>
        </div>
      )}
    </div>
  )
}
