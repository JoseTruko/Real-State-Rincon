import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Globe, MapPin, GitCompare } from 'lucide-react'
import { getFeaturedProperties } from '@/lib/data/properties'
import { getCommunities } from '@/lib/data/communities'
import { getLatestPosts } from '@/lib/data/blog'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton'
import CommunityCard from '@/components/community/CommunityCard'
import SearchBar from '@/components/search/SearchBar'
import { localizedField, formatDate } from '@/lib/utils/format'
import { SITE_NAME } from '@/config/site'
import type { Locale } from '@/types'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/utils/metadata'

export const revalidate = 3600

interface HomePageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: SITE_NAME,
    description: locale === 'es'
      ? 'Casas, terrenos y fincas en venta en Guanacaste y Rincón de la Vieja, Costa Rica.'
      : 'Houses, land & farms for sale in Guanacaste & Rincón de la Vieja, Costa Rica.',
    locale,
    enPath: '',
    noSuffix: true,
  })
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale as Locale

  const [featuredProperties, communities, latestPosts] = await Promise.all([
    getFeaturedProperties(6),
    getCommunities(),
    getLatestPosts(3),
  ])

  const prefix = locale === 'es' ? '/es' : ''

  return (
    <>
      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0 bg-secondary">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-poster.webp"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-accent/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">
            {locale === 'es'
              ? 'Guanacaste · Rincón de la Vieja · Costa Rica'
              : 'Guanacaste · Rincón de la Vieja · Costa Rica'}
          </p>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
            {locale === 'es'
              ? 'Encuentra tu lugar en el paraíso.'
              : 'Find your place in paradise.'}
          </h1>

          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Casas, terrenos y fincas en venta — seleccionados para compradores internacionales'
              : 'Homes, land & farms for sale — curated for international buyers'}
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto">
            <Suspense>
              <SearchBar communities={communities} locale={locale} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED PROPERTIES
      ============================================================ */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink">
            {locale === 'es' ? 'Propiedades destacadas' : 'Featured properties'}
          </h2>
          <Link
            href={`${prefix}/properties`}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            {locale === 'es' ? 'Ver todas' : 'View all'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCardSkeleton count={3} />
          </div>
        )}
      </section>

      {/* ============================================================
          COMPARE CALLOUT
      ============================================================ */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="shrink-0 bg-primary/10 rounded-xl p-3">
              <GitCompare className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-heading font-semibold text-ink text-lg">
                {locale === 'es' ? 'Compara propiedades en segundos' : 'Compare properties in seconds'}
              </p>
              <p className="text-sm text-neutral-500 mt-0.5">
                {locale === 'es'
                  ? 'Selecciona hasta 3 propiedades y compara precio, área, habitaciones y más en una sola vista.'
                  : 'Select up to 3 properties and compare price, area, bedrooms and more in a single view.'}
              </p>
            </div>
          </div>
          <Link
            href={`${prefix}/properties`}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-primary text-primary px-6 py-3 text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200"
          >
            {locale === 'es' ? 'Explorar y comparar' : 'Browse & compare'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================
          EXPLORE COMMUNITIES
      ============================================================ */}
      {communities.length > 0 && (
        <section className="py-16 px-4 bg-neutral">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink mb-8">
              {locale === 'es' ? 'Explorar comunidades' : 'Explore communities'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {communities.map((community) => (
                <CommunityCard key={community.id} community={community} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          SELL WITH US CTA
      ============================================================ */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
                {locale === 'es' ? '¿Pensando en vender?' : 'Thinking of selling?'}
              </h2>
              <p className="text-white/70 text-lg max-w-xl">
                {locale === 'es'
                  ? 'Conectamos tu propiedad con compradores internacionales. Valoración gratuita incluida.'
                  : 'We connect your property with international buyers. Free valuation included.'}
              </p>
            </div>
            <Link
              href={`${prefix}/sell-with-us`}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-accent text-white px-8 py-4 text-base font-semibold hover:bg-accent/90 transition-colors duration-200"
            >
              {locale === 'es' ? 'Saber más' : 'Learn more'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: <Star className="h-6 w-6 text-accent" />,
                title: locale === 'es' ? 'Valoración gratuita' : 'Free valuation',
                desc: locale === 'es' ? 'Evaluamos tu propiedad sin costo.' : 'We assess your property at no cost.',
              },
              {
                icon: <Globe className="h-6 w-6 text-accent" />,
                title: locale === 'es' ? 'Alcance internacional' : 'International reach',
                desc: locale === 'es' ? 'Compradores de todo el mundo.' : 'Buyers from around the world.',
              },
              {
                icon: <MapPin className="h-6 w-6 text-accent" />,
                title: locale === 'es' ? 'Experiencia local' : 'Local expertise',
                desc: locale === 'es' ? 'Conocemos el mercado de Guanacaste.' : 'Deep knowledge of the Guanacaste market.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/60 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOG PREVIEW
      ============================================================ */}
      {latestPosts.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink">
              {locale === 'es' ? 'Del blog' : 'From the blog'}
            </h2>
            <Link
              href={`${prefix}/blog`}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              {locale === 'es' ? 'Ver todos los artículos' : 'View all articles'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {latestPosts.map((post) => {
              const title = localizedField(post, 'title', locale)
              const excerpt = localizedField(post, 'excerpt', locale)
              const slug = locale === 'es' ? post.slug_es : post.slug_en

              return (
                <Link
                  key={post.id}
                  href={`${prefix}/blog/${slug}`}
                  className="group block bg-surface border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {post.cover_image_url && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                      <Image
                        src={post.cover_image_url}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {post.category && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-heading font-semibold text-ink mt-1 mb-2 line-clamp-2">{title}</h3>
                    {excerpt && (
                      <p className="text-sm text-neutral-500 line-clamp-2">{excerpt}</p>
                    )}
                    {post.published_at && (
                      <p className="text-xs text-neutral-400 mt-3">
                        {formatDate(post.published_at, locale)}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
