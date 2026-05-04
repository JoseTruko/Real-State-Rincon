import { getAgents } from '@/lib/data/agents'
import AgentCard from '@/components/agent/AgentCard'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 3600

interface AgentsPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: AgentsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: locale === 'es' ? 'Nuestros Agentes' : 'Our Agents',
    description: locale === 'es'
      ? 'Conoce al equipo de agentes de Rincón Realty en Guanacaste, Costa Rica.'
      : 'Meet the Rincón Realty team of agents in Guanacaste, Costa Rica.',
    locale,
    enPath: '/agents',
  })
}

export default async function AgentsPage({ params }: AgentsPageProps) {
  const locale = params.locale as Locale
  const agents = await getAgents()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">
        {locale === 'es' ? 'Nuestros agentes' : 'Our agents'}
      </h1>
      <p className="text-neutral-500 mb-8">
        {locale === 'es'
          ? 'Expertos locales listos para ayudarte a encontrar tu propiedad ideal.'
          : 'Local experts ready to help you find your ideal property.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} locale={locale} />
        ))}
      </div>
    </div>
  )
}
