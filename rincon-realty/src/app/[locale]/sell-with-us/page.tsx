import { CheckCircle, Globe, Scale } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { SITE_NAME } from '@/config/site'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: locale === 'es' ? 'Vender con Nosotros' : 'Sell with Us',
    description: locale === 'es'
      ? 'Vende tu propiedad en Costa Rica con Rincón Realty. Valoración gratuita y alcance internacional.'
      : 'Sell your property in Costa Rica with Rincón Realty. Free valuation and international reach.',
    locale,
    enPath: '/sell-with-us',
  })
}

export default function SellWithUsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale

  const steps = [
    {
      num: '01',
      title: locale === 'es' ? 'Valoración gratuita' : 'Free valuation',
      desc: locale === 'es'
        ? 'Evaluamos el valor de mercado de tu propiedad sin costo.'
        : 'We assess your property\'s market value at no cost.',
    },
    {
      num: '02',
      title: locale === 'es' ? 'Listado profesional' : 'Professional listing',
      desc: locale === 'es'
        ? 'Fotos de alta calidad, descripciones bilingües y posicionamiento premium.'
        : 'High-quality photos, bilingual descriptions, and premium placement.',
    },
    {
      num: '03',
      title: locale === 'es' ? 'Marketing internacional' : 'International marketing',
      desc: locale === 'es'
        ? 'Llegamos a compradores de Norteamérica, Europa y más.'
        : 'We reach buyers from North America, Europe, and beyond.',
    },
    {
      num: '04',
      title: locale === 'es' ? 'Cierre y traspaso' : 'Close & transfer',
      desc: locale === 'es'
        ? 'Te guiamos en el proceso legal para un cierre sin problemas.'
        : 'We guide you through the legal process to a smooth closing.',
    },
  ]

  const valueProps = [
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      title: locale === 'es' ? 'Experiencia local' : 'Local expertise',
      desc: locale === 'es'
        ? 'Más de 10 años en el mercado de Guanacaste.'
        : 'Over 10 years in the Guanacaste market.',
    },
    {
      icon: <Globe className="h-6 w-6 text-accent" />,
      title: locale === 'es' ? 'Red de compradores internacionales' : 'International buyers network',
      desc: locale === 'es'
        ? 'Acceso a compradores de más de 20 países.'
        : 'Access to buyers from over 20 countries.',
    },
    {
      icon: <Scale className="h-6 w-6 text-accent" />,
      title: locale === 'es' ? 'Apoyo legal completo' : 'Full legal support',
      desc: locale === 'es'
        ? 'Te acompañamos en cada paso del proceso legal.'
        : 'We accompany you through every step of the legal process.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            {locale === 'es' ? `Vende con ${SITE_NAME}` : `Sell with ${SITE_NAME}`}
          </h1>
          <p className="text-white/70 text-xl">
            {locale === 'es'
              ? 'Conectamos tu propiedad con compradores internacionales calificados.'
              : 'We connect your property with qualified international buyers.'}
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center mb-12">
          {locale === 'es' ? 'Cómo funciona' : 'How it works'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-lg mb-4">
                {step.num}
              </div>
              <h3 className="font-heading font-semibold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="py-12 px-4 bg-neutral">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {valueProps.map((vp) => (
            <div key={vp.title} className="flex gap-4 items-start bg-surface border border-neutral-200 rounded-xl p-5">
              <div className="shrink-0 mt-0.5">{vp.icon}</div>
              <div>
                <p className="font-semibold text-ink">{vp.title}</p>
                <p className="text-sm text-neutral-500 mt-1">{vp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 px-4" id="contact-form">
        <div className="max-w-xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-ink text-center mb-8">
            {locale === 'es' ? 'Cuéntanos sobre tu propiedad' : 'Tell us about your property'}
          </h2>
          <div className="bg-surface border border-neutral-200 rounded-xl p-6">
            <ContactForm locale={locale} source="seller" />
          </div>
        </div>
      </section>
    </>
  )
}
