'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import type { Locale } from '@/types'

interface WhatsAppButtonProps {
  agentId: string
  locale: Locale
  propertyId?: string
  className?: string
}

export default function WhatsAppButton({ agentId, locale, propertyId, className }: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const t = {
    btn:         locale === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp',
    title:       locale === 'es' ? 'Antes de continuar' : 'Before we connect',
    subtitle:    locale === 'es' ? 'Déjanos tu nombre para personalizar la atención.' : 'Share your name so the agent can greet you.',
    namePlaceholder: locale === 'es' ? 'Tu nombre *' : 'Your name *',
    phonePlaceholder: locale === 'es' ? 'Tu teléfono (opcional)' : 'Your phone (optional)',
    submit:      locale === 'es' ? 'Abrir WhatsApp' : 'Open WhatsApp',
    cancel:      locale === 'es' ? 'Cancelar' : 'Cancel',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/track-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'whatsapp',
          agent_id: agentId,
          name: name.trim(),
          phone: phone.trim() || undefined,
          ...(propertyId ? { property_id: propertyId } : {}),
        }),
      })
      const { redirect_url } = await res.json()
      if (redirect_url) window.open(redirect_url, '_blank')
      setOpen(false)
      setName('')
      setPhone('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? 'mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-600 transition-colors'}
      >
        <MessageCircle className="h-4 w-4" />
        {t.btn}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading font-semibold text-ink text-lg">{t.title}</h3>
                <p className="text-sm text-neutral-500 mt-0.5">{t.subtitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors ml-4 shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                autoFocus
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={!name.trim() || loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 text-white px-4 py-2.5 text-sm font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {loading ? '...' : t.submit}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors text-center"
              >
                {t.cancel}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
