import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { SITE_NAME, SITE_CONFIG_DEFAULTS } from '@/config/site'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: locale === 'es' ? 'Contacto' : 'Contact',
    description: locale === 'es'
      ? `Contáctanos en ${SITE_NAME}. Estamos aquí para ayudarte.`
      : `Contact us at ${SITE_NAME}. We're here to help.`,
    locale,
    enPath: '/contact',
  })
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  const config = SITE_CONFIG_DEFAULTS

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — info */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink mb-4">
            {locale === 'es' ? 'Contáctanos' : 'Get in touch'}
          </h1>
          <p className="text-neutral-600 text-lg mb-8">
            {locale === 'es'
              ? 'Estamos aquí para ayudarte a encontrar tu propiedad ideal en Costa Rica.'
              : "We're here to help you find your ideal property in Costa Rica."}
          </p>

          <div className="flex flex-col gap-4">
            {config.contact_email && (
              <a
                href={`mailto:${config.contact_email}`}
                className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <span>{config.contact_email}</span>
              </a>
            )}
            {config.contact_phone && (
              <a
                href={`tel:${config.contact_phone}`}
                className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span>{config.contact_phone}</span>
              </a>
            )}
            <div className="flex items-center gap-3 text-neutral-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span>Guanacaste, Costa Rica</span>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-surface border border-neutral-200 rounded-xl p-6">
          <ContactForm locale={locale} source="form" />
        </div>
      </div>
    </div>
  )
}
