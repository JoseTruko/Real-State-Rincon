import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, Globe } from 'lucide-react'
import { localizedField } from '@/lib/utils/format'
import type { Agent, Locale } from '@/types'

interface AgentCardProps {
  agent: Pick<Agent, 'slug' | 'full_name' | 'photo_url' | 'title_en' | 'title_es'> & 
         Partial<Pick<Agent, 'email' | 'phone' | 'languages'>>
  locale: Locale
  compact?: boolean
}

export default function AgentCard({ agent, locale, compact = false }: AgentCardProps) {
  const title = localizedField(agent, 'title', locale)
  const prefix = locale === 'es' ? '/es' : ''

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
          {agent.photo_url ? (
            <Image src={agent.photo_url} alt={agent.full_name} fill sizes="40px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary font-semibold text-sm">
              {agent.full_name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{agent.full_name}</p>
          {title && <p className="text-xs text-neutral-500">{title}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-neutral-200 rounded-xl p-5 flex flex-col gap-4">
      {/* Photo + name */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-100">
          {agent.photo_url ? (
            <Image src={agent.photo_url} alt={agent.full_name} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
              {agent.full_name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-heading font-semibold text-ink">{agent.full_name}</p>
          {title && <p className="text-sm text-neutral-500">{title}</p>}
        </div>
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-2 text-sm text-neutral-600">
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{agent.email}</span>
          </a>
        )}
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{agent.phone}</span>
          </a>
        )}
        {agent.languages && agent.languages.length > 0 && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0" />
            <span>{agent.languages.join(', ')}</span>
          </div>
        )}
      </div>

      {/* View profile */}
      <Link
        href={`${prefix}/agents/${agent.slug}`}
        className="text-sm text-primary font-medium hover:underline"
      >
        {locale === 'es' ? 'Ver perfil' : 'View profile'} →
      </Link>
    </div>
  )
}
