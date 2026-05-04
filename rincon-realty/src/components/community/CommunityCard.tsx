import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { localizedField } from '@/lib/utils/format'
import type { Community, Locale } from '@/types'

interface CommunityCardProps {
  community: Pick<Community, 'slug' | 'name_en' | 'name_es' | 'description_en' | 'description_es' | 'image_url'>
  locale: Locale
  propertyCount?: number
}

export default function CommunityCard({ community, locale, propertyCount }: CommunityCardProps) {
  const name = localizedField(community, 'name', locale)
  const description = localizedField(community, 'description', locale)

  return (
    <Link
      href={`/communities/${community.slug}`}
      className="group block bg-surface border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        {community.image_url ? (
          <Image
            src={community.image_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/20" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-heading font-semibold text-lg leading-tight">{name}</p>
          {propertyCount != null && (
            <p className="text-white/70 text-xs mt-0.5">
              {propertyCount} {locale === 'es' ? 'propiedades' : 'properties'}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="p-4">
          <p className="text-sm text-neutral-600 line-clamp-2">{description}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary font-medium">
            {locale === 'es' ? 'Explorar' : 'Explore'}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      )}
    </Link>
  )
}
