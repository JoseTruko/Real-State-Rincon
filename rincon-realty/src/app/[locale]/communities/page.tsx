import { getCommunities } from '@/lib/data/communities'
import CommunityCard from '@/components/community/CommunityCard'
import { SITE_NAME } from '@/config/site'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 3600

interface CommunitiesPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: CommunitiesPageProps): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: locale === 'es' ? 'Comunidades en Guanacaste' : 'Communities in Guanacaste',
    description: locale === 'es'
      ? 'Explora las comunidades de Guanacaste y Rincón de la Vieja, Costa Rica.'
      : 'Explore communities in Guanacaste & Rincón de la Vieja, Costa Rica.',
    locale,
    enPath: '/communities',
  })
}

export default async function CommunitiesPage({ params }: CommunitiesPageProps) {
  const locale = params.locale as Locale
  const communities = await getCommunities()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">
        {locale === 'es' ? 'Comunidades' : 'Communities'}
      </h1>
      <p className="text-neutral-500 mb-8">
        {locale === 'es'
          ? 'Descubre las zonas más exclusivas de Guanacaste y Rincón de la Vieja.'
          : 'Discover the most exclusive areas of Guanacaste & Rincón de la Vieja.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} locale={locale} />
        ))}
      </div>
    </div>
  )
}
