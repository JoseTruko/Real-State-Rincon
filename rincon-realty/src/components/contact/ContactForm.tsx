'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { ContactSource, Locale } from '@/types'

interface ContactFormProps {
  propertyId?: string
  agentId?: string
  source?: ContactSource
  locale: Locale
  defaultMessage?: string
}

export default function ContactForm({
  propertyId,
  agentId,
  source = 'form',
  locale,
  defaultMessage = '',
}: ContactFormProps) {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: defaultMessage,
      source,
      property_id: propertyId,
      agent_id: agentId,
    },
  })

  const labels = {
    name:    locale === 'es' ? 'Nombre completo' : 'Full name',
    email:   locale === 'es' ? 'Correo electrónico' : 'Email address',
    phone:   locale === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)',
    message: locale === 'es' ? 'Mensaje' : 'Message',
    submit:  locale === 'es' ? 'Enviar mensaje' : 'Send message',
    sending: locale === 'es' ? 'Enviando...' : 'Sending...',
    successTitle: locale === 'es' ? '¡Mensaje enviado!' : 'Message sent!',
    successDesc:  locale === 'es' ? 'Nos pondremos en contacto pronto.' : "We'll be in touch shortly.",
  }

  async function onSubmit(data: ContactFormData) {
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(true)
      } else {
        setServerError(locale === 'es' ? 'Algo salió mal. Intenta de nuevo.' : 'Something went wrong. Please try again.')
      }
    } catch {
      setServerError(locale === 'es' ? 'Error de conexión. Intenta de nuevo.' : 'Connection error. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <p className="font-heading text-lg font-semibold text-ink">{labels.successTitle}</p>
        <p className="text-sm text-neutral-500">{labels.successDesc}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0"
        {...register('honeypot')}
      />

      {/* Hidden fields */}
      <input type="hidden" {...register('source')} />
      {propertyId && <input type="hidden" {...register('property_id')} />}
      {agentId && <input type="hidden" {...register('agent_id')} />}

      <Input
        id="contact-name"
        label={labels.name}
        placeholder="John Smith"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="contact-email"
        type="email"
        label={labels.email}
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="contact-phone"
        type="tel"
        label={labels.phone}
        placeholder="+1 555 000 0000"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-sm font-medium text-ink">
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          rows={4}
          className="rounded-lg border border-neutral-300 bg-surface px-3 py-2 text-sm text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-red-600" role="alert">{errors.message.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 text-center" role="alert">{serverError}</p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full gap-2">
        <Send className="h-4 w-4" />
        {isSubmitting ? labels.sending : labels.submit}
      </Button>
    </form>
  )
}
