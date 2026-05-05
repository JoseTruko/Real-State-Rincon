import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatPrice, formatArea, localizedField } from '@/lib/utils/format'
import type { PropertyCardData, Locale } from '@/types'
import FavoriteButton from './FavoriteButton'
import CompareButton from './CompareButton'

interface PropertyCardProps {
  property: PropertyCardData
  locale: Locale
  showCompareButton?: boolean
  showFavoriteButton?: boolean
}

export default function PropertyCard({
  property,
  locale,
  showCompareButton = true,
  showFavoriteButton = true,
}: PropertyCardProps) {
  const title = localizedField(property, 'title', locale)
  const slug = locale === 'es' ? property.slug_es : property.slug_en
  const prefix = locale === 'es' ? '/es' : ''
  const coverImage = property.images?.[0]
  const communityName = property.community
    ? localizedField(property.community, 'name', locale)
    : null

  const typeLabels: Record<string, string> = {
    house: locale === 'es' ? 'Casa' : 'House',
    land:  locale === 'es' ? 'Terreno' : 'Land',
    farm:  locale === 'es' ? 'Finca' : 'Farm',
  }

  return (
    <article className="group bg-surface border border-neutral-200 rounded-xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt_text || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <Maximize2 className="h-10 w-10 text-neutral-300" />
          </div>
        )}

        {/* Action buttons overlay */}
        {(showFavoriteButton || showCompareButton) && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            {showFavoriteButton && (
              <FavoriteButton slug={property.slug_en} />
            )}
            {showCompareButton && (
              <CompareButton propertyId={property.id} propertyTitle={title} locale={locale} />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Price */}
        <p className="text-xl font-semibold text-primary font-heading">
          {formatPrice(property.price_usd, locale)}
        </p>

        {/* Title */}
        <h3 className="text-base font-medium text-ink leading-snug line-clamp-2 font-heading">
          {title}
        </h3>

        {/* Location */}
        {communityName && (
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{communityName}</span>
          </div>
        )}

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-neutral-600 border-t border-neutral-100 pt-3 mt-auto">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Maximize2 className="h-4 w-4" />
            {formatArea(property.area_m2, locale)}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`${prefix}/properties/${slug}`}
          className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-medium px-4 py-2.5 hover:bg-primary/90 transition-colors duration-200"
        >
          {locale === 'es' ? 'Ver detalles' : 'View details'}
        </Link>
      </div>
    </article>
  )
}
