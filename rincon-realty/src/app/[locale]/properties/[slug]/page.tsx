import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize2, Calendar, FileDown, MessageCircle } from 'lucide-react'
import { getPropertyBySlug } from '@/lib/data/properties'
import ImageGallery from '@/components/property/ImageGallery'
import PropertyMap from '@/components/map/PropertyMap'
import ContactForm from '@/components/contact/ContactForm'
import AgentCard from '@/components/agent/AgentCard'
import FavoriteButton from '@/components/property/FavoriteButton'
import CompareButton from '@/components/property/CompareButton'
import WhatsAppButton from '@/components/property/WhatsAppButton'
import Badge from '@/components/ui/Badge'
import RichTextRenderer from '@/components/blog/RichTextRenderer'
import { localizedField, formatPrice, formatArea } from '@/lib/utils/format'
import { SITE_NAME, SITE_URL } from '@/config/site'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 1800

interface PropertyDetailProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: PropertyDetailProps): Promise<Metadata> {
  const locale = params.locale as Locale
  const property = await getPropertyBySlug(params.slug, locale)
  if (!property) return { title: 'Property not found' }

  const title = localizedField(property, 'title', locale)
  const description = localizedField(property, 'meta_description', locale) ||
    localizedField(property, 'description', locale).slice(0, 160)
  const communityName = property.community
    ? localizedField(property.community, 'name', locale)
    : 'Costa Rica'
  const image = property.images?.[0]?.url

  return buildMetadata({
    title: locale === 'es'
      ? `${title} en Venta en ${communityName}`
      : `${title} for Sale in ${communityName}`,
    description,
    image,
    locale,
    enPath: `/properties/${property.slug_en}`,
    esPath: `/properties/${property.slug_es}`,
  })
}

export default async function PropertyDetailPage({ params }: PropertyDetailProps) {
  const locale = params.locale as Locale
  const property = await getPropertyBySlug(params.slug, locale)

  if (!property) notFound()

  const title = localizedField(property, 'title', locale)
  const description = localizedField(property, 'description', locale)
  const communityName = property.community ? localizedField(property.community, 'name', locale) : null
  const prefix = locale === 'es' ? '/es' : ''

  const typeLabels: Record<string, string> = {
    house: locale === 'es' ? 'Casa' : 'House',
    land:  locale === 'es' ? 'Terreno' : 'Land',
    farm:  locale === 'es' ? 'Finca' : 'Farm',
  }

  const defaultMessage = locale === 'es'
    ? `Estoy interesado/a en la propiedad: ${title}`
    : `I am interested in the property: ${title}`

  const propertyUrl = `${SITE_URL}${locale === 'es' ? '/es' : ''}/properties/${locale === 'es' ? property.slug_es : property.slug_en}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description.slice(0, 500),
    url: propertyUrl,
    offers: {
      '@type': 'Offer',
      price: property.price_usd,
      priceCurrency: 'USD',
    },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href={prefix || '/'} className="hover:text-primary transition-colors">
          {locale === 'es' ? 'Inicio' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={`${prefix}/properties`} className="hover:text-primary transition-colors">
          {locale === 'es' ? 'Propiedades' : 'Properties'}
        </Link>
        {communityName && (
          <>
            <span>/</span>
            <Link
              href={`${prefix}/communities/${property.community?.slug}`}
              className="hover:text-primary transition-colors"
            >
              {communityName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink truncate max-w-[200px]">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* ============================================================
            MAIN COLUMN
        ============================================================ */}
        <div className="flex flex-col gap-8">
          {/* Gallery */}
          {property.images && property.images.length > 0 && (
            <ImageGallery images={property.images} title={title} />
          )}

          {/* Title row */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={property.type}>{typeLabels[property.type]}</Badge>
              {property.featured && (
                <Badge variant="featured">{locale === 'es' ? 'Destacada' : 'Featured'}</Badge>
              )}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ink mb-2">{title}</h1>
            <p className="text-2xl font-bold text-primary">{formatPrice(property.price_usd, locale)}</p>
          </div>

          {/* Location */}
          {communityName && (
            <div className="flex items-center gap-2 text-neutral-600">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <Link
                href={`${prefix}/communities/${property.community?.slug}`}
                className="hover:text-primary transition-colors font-medium"
              >
                {communityName}
              </Link>
            </div>
          )}

          {/* Key info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {property.bedrooms != null && (
              <div className="bg-surface border border-neutral-200 rounded-xl p-4 text-center">
                <Bed className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{property.bedrooms}</p>
                <p className="text-xs text-neutral-500">{locale === 'es' ? 'Habitaciones' : 'Bedrooms'}</p>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="bg-surface border border-neutral-200 rounded-xl p-4 text-center">
                <Bath className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{property.bathrooms}</p>
                <p className="text-xs text-neutral-500">{locale === 'es' ? 'Baños' : 'Bathrooms'}</p>
              </div>
            )}
            <div className="bg-surface border border-neutral-200 rounded-xl p-4 text-center">
              <Maximize2 className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-ink">{formatArea(property.area_m2, locale)}</p>
              <p className="text-xs text-neutral-500">{locale === 'es' ? 'Área total' : 'Total area'}</p>
            </div>
            {property.year_built && (
              <div className="bg-surface border border-neutral-200 rounded-xl p-4 text-center">
                <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{property.year_built}</p>
                <p className="text-xs text-neutral-500">{locale === 'es' ? 'Año' : 'Year built'}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-ink mb-4">
                {locale === 'es' ? 'Descripción' : 'Description'}
              </h2>
              <RichTextRenderer content={description} />
            </div>
          )}

          {/* Map */}
          {property.coordinates && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-ink mb-4">
                {locale === 'es' ? 'Ubicación' : 'Location'}
              </h2>
              <PropertyMap
                coordinates={property.coordinates}
                title={title}
              />
            </div>
          )}
        </div>

        {/* ============================================================
            SIDEBAR
        ============================================================ */}
        <aside className="flex flex-col gap-6">
          {/* Sticky price + actions */}
          <div className="sticky top-20 flex flex-col gap-4">
            <div className="bg-surface border border-neutral-200 rounded-xl p-5">
              <p className="font-heading text-2xl font-bold text-primary mb-4">
                {formatPrice(property.price_usd, locale)}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2 mb-4">
                <FavoriteButton slug={property.slug_en} className="flex-1 h-10 rounded-lg" />
                <CompareButton
                  propertyId={property.id}
                  propertyTitle={title}
                  className="flex-1 h-10 rounded-lg"
                />
                {/* PDF download */}
                <a
                  href={`/api/properties/${property.id}/pdf?locale=${locale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-neutral-200 hover:bg-neutral transition-colors"
                  title={locale === 'es' ? 'Descargar PDF' : 'Download PDF'}
                >
                  <FileDown className="h-4 w-4 text-neutral-600" />
                </a>
              </div>

              {/* Agent card */}
              {property.agent && (
                <div className="border-t border-neutral-100 pt-4">
                  <AgentCard agent={property.agent} locale={locale} />

                  {/* WhatsApp button */}
                  {property.agent.whatsapp && (
                    <WhatsAppButton
                      propertyId={property.id}
                      agentId={property.agent.id}
                      locale={locale}
                    />
                  )}                </div>
              )}
            </div>

            {/* Contact form */}
            <div className="bg-surface border border-neutral-200 rounded-xl p-5">
              <h3 className="font-heading text-lg font-semibold text-ink mb-4">
                {locale === 'es' ? 'Enviar consulta' : 'Send inquiry'}
              </h3>
              <ContactForm
                propertyId={property.id}
                agentId={property.agent?.id}
                locale={locale}
                defaultMessage={defaultMessage}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  )
}

// WhatsApp button is now in @/components/property/WhatsAppButton
