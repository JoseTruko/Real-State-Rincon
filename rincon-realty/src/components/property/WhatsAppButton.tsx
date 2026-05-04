'use client'

import { MessageCircle } from 'lucide-react'
import type { Locale } from '@/types'

interface WhatsAppButtonProps {
  agentId: string
  locale: Locale
  propertyId?: string
  className?: string
}

export default function WhatsAppButton({ agentId, locale, propertyId, className }: WhatsAppButtonProps) {
  async function handleClick() {
    const res = await fetch('/api/track-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'whatsapp',
        agent_id: agentId,
        ...(propertyId ? { property_id: propertyId } : {}),
      }),
    })
    const { redirect_url } = await res.json()
    if (redirect_url) window.open(redirect_url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={className ?? 'mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-600 transition-colors'}
    >
      <MessageCircle className="h-4 w-4" />
      {locale === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
    </button>
  )
}
