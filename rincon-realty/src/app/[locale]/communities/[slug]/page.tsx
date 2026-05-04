import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getCommunityBySlug } from '@/lib/data/communities'
import { getProperties } from '@/lib/data/properties'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyMap from '@/components/map/PropertyMap'
import { localizedField } from '@/lib/utils/format'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 3600

interface CommunityDetailProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: CommunityDetailProps): Promise<Metadata> {
  const locale = params.locale as Locale
  const community = await getCommunityBySlug(params.slug)
  if (!community) return { title: 'Community not found' }

  const name = localizedField(community, 'name', locale)
  return buildMetadata({
    title: locale === 'es'
      ? `Propiedades en ${name}, Guanacaste`
      : `Properties for Sale in ${name}, Guanacaste`,
    description: localizedField(community, 'description', locale).slice(0, 160),
    image: community.image_url || null,
    locale,
    enPath: `/communities/${community.slug}`,
  })
}

export default async function CommunityDetailPage({ params }: CommunityDetailProps) {
  const locale = params.locale as Locale
  const community = await getCommunityBySlug(params.slug)

  if (!community) notFound()

  const { properties } = await getProperties({ community_id: community.id })

  const name = localizedField(community, 'name', locale)
  const description = localizedField(community, 'description', locale)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      {community.image_url && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl mb-8 bg-neutral-100">
          <Image
            src={community.image_url}
            alt={name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <h1 className="absolute bottom-6 left-6 font-heading text-3xl sm:text-4xl font-bold text-white">
            {name}
          </h1>
        </div>
      )}

      {!community.image_url && (
        <h1 className="font-heading text-3xl font-bold text-ink mb-6">{name}</h1>
      )}

      {/* Description */}
      {description && (
        <p className="text-neutral-600 text-lg leading-relaxed mb-8 max-w-3xl">{description}</p>
      )}

      {/* Map */}
      {community.coordinates && (
        <div className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-ink mb-4">
            {locale === 'es' ? 'Ubicación' : 'Location'}
          </h2>
          <PropertyMap
            coordinates={community.coordinates}
            title={name}
            zoom={12}
            showApproximateCircle={false}
          />
        </div>
      )}

      {/* Properties */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-ink mb-6">
          {locale === 'es' ? `Propiedades en ${name}` : `Properties in ${name}`}
          <span className="text-neutral-400 text-lg font-normal ml-2">({properties.length})</span>
        </h2>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">
            {locale === 'es' ? 'No hay propiedades disponibles en esta comunidad.' : 'No properties available in this community.'}
          </p>
        )}
      </div>
    </div>
  )
}
