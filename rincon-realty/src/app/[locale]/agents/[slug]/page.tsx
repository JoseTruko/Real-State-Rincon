import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Globe, Briefcase, ExternalLink } from 'lucide-react'
import { getAgentBySlug } from '@/lib/data/agents'
import { getProperties } from '@/lib/data/properties'
import PropertyCard from '@/components/property/PropertyCard'
import ContactForm from '@/components/contact/ContactForm'
import WhatsAppButton from '@/components/property/WhatsAppButton'
import { localizedField } from '@/lib/utils/format'
import { buildMetadata } from '@/lib/utils/metadata'
import { SITE_URL } from '@/config/site'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 3600

interface AgentDetailProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: AgentDetailProps): Promise<Metadata> {
  const locale = params.locale as Locale
  const agent = await getAgentBySlug(params.slug)
  if (!agent) return { title: 'Agent not found' }

  return buildMetadata({
    title: agent.full_name,
    description: localizedField(agent, 'bio', locale).slice(0, 160),
    image: agent.photo_url || null,
    locale,
    enPath: `/agents/${agent.slug}`,
  })
}

export default async function AgentDetailPage({ params }: AgentDetailProps) {
  const locale = params.locale as Locale
  const agent = await getAgentBySlug(params.slug)

  if (!agent) notFound()

  const { properties: agentProperties } = await getProperties({ agent_id: agent.id, page: 1 })

  const bio = localizedField(agent, 'bio', locale)
  const title = localizedField(agent, 'title', locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: agent.full_name,
    jobTitle: title,
    email: agent.email,
    ...(agent.phone ? { telephone: agent.phone } : {}),
    url: `${SITE_URL}${locale === 'es' ? '/es' : ''}/agents/${agent.slug}`,
    ...(agent.photo_url ? { image: agent.photo_url } : {}),
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* Main */}
        <div>
          {/* Agent header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-neutral-100">
              {agent.photo_url ? (
                <Image src={agent.photo_url} alt={agent.full_name} fill sizes="128px" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary font-bold text-4xl">
                  {agent.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-ink">{agent.full_name}</h1>
              {title && <p className="text-neutral-500 text-lg mt-1">{title}</p>}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-neutral-600">
                {agent.languages.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    {agent.languages.join(', ')}
                  </span>
                )}
                {agent.years_experience > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {agent.years_experience} {locale === 'es' ? 'años de experiencia' : 'years of experience'}
                  </span>
                )}
                {agent.linkedin_url && (
                  <a
                    href={agent.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-semibold text-ink mb-3">
                {locale === 'es' ? 'Sobre mí' : 'About me'}
              </h2>
              <p className="text-neutral-600 leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Properties */}
          <div>
            <h2 className="font-heading text-xl font-semibold text-ink mb-4">
              {locale === 'es' ? 'Propiedades' : 'Properties'}
            </h2>
            {agentProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {agentProperties.slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} property={property} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="text-neutral-500">
                {locale === 'es' ? 'No hay propiedades disponibles.' : 'No properties available.'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar — Contact form */}
        <aside>
          <div className="sticky top-20 bg-surface border border-neutral-200 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold text-ink">
              {locale === 'es' ? `Contactar a ${agent.full_name}` : `Contact ${agent.full_name}`}
            </h3>
            {agent.whatsapp && (
              <WhatsAppButton agentId={agent.id} locale={locale} />
            )}
            <ContactForm agentId={agent.id} locale={locale} />
          </div>
        </aside>
      </div>
    </div>
    </>
  )
}
