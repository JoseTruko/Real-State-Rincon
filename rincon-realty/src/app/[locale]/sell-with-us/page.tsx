import Image from 'next/image'
import { CheckCircle, Globe, Scale, ArrowRight, Camera } from 'lucide-react'
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
      ? 'Vende tu propiedad en Guanacaste con Rincón Realty. Alcance internacional y gestión completa.'
      : 'Sell your property in Guanacaste with Rincón Realty. International reach and full management.',
    locale,
    enPath: '/sell-with-us',
  })
}

export default function SellWithUsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale

  const steps = [
    {
      num: '01',
      title: locale === 'es' ? 'Listado profesional' : 'Professional listing',
      desc: locale === 'es'
        ? 'Fotografía de alta calidad, descripciones bilingües y posicionamiento premium en todos nuestros canales.'
        : 'High-quality photography, bilingual descriptions, and premium placement across all our channels.',
    },
    {
      num: '02',
      title: locale === 'es' ? 'Marketing internacional' : 'International marketing',
      desc: locale === 'es'
        ? 'Llegamos a compradores calificados de Norteamérica, Europa y más allá, con campañas enfocadas en tu propiedad.'
        : 'We reach qualified buyers from North America, Europe, and beyond with campaigns focused on your property.',
    },
    {
      num: '03',
      title: locale === 'es' ? 'Cierre y traspaso' : 'Close & transfer',
      desc: locale === 'es'
        ? 'Te acompañamos en cada paso del proceso legal para un cierre claro, seguro y sin complicaciones.'
        : 'We guide you through every step of the legal process for a clear, safe, and hassle-free closing.',
    },
  ]

  const valueProps = [
    {
      icon: <Camera className="h-7 w-7 text-accent" />,
      title: locale === 'es' ? 'Experiencia local' : 'Local expertise',
      desc: locale === 'es'
        ? 'Más de 10 años operando en Guanacaste. Conocemos el mercado, los precios y cómo posicionar tu propiedad.'
        : 'Over 10 years operating in Guanacaste. We know the market, the prices, and how to position your property.',
    },
    {
      icon: <Globe className="h-7 w-7 text-accent" />,
      title: locale === 'es' ? 'Alcance internacional' : 'International reach',
      desc: locale === 'es'
        ? 'Estamos posicionados para atraer a compradores extranjeros que buscan activamente propiedades en Costa Rica.'
        : 'We are positioned to attract foreign buyers actively searching for real estate in Costa Rica.',
    },
    {
      icon: <Scale className="h-7 w-7 text-accent" />,
      title: locale === 'es' ? 'Apoyo legal completo' : 'Full legal support',
      desc: locale === 'es'
        ? 'Coordinamos con abogados locales para que cada traspaso sea transparente, seguro y sin sorpresas.'
        : 'We coordinate with local attorneys to ensure every transfer is transparent, safe, and surprise-free.',
    },
  ]

  const contactBullets = locale === 'es'
    ? ['Sin compromisos — solo una conversación', 'Respondemos en menos de 24 horas', 'Atención en español e inglés']
    : ['No commitment — just a conversation', 'We respond in under 24 hours', 'Service in Spanish and English']

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-poster.webp"
            alt="Guanacaste, Costa Rica"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/65 to-secondary/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-28">
          <div className="max-w-2xl">
            <span className="inline-block text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-6 border border-accent/50 px-3 py-1.5 rounded-full">
              {locale === 'es' ? 'Guanacaste · Costa Rica' : 'Guanacaste · Costa Rica'}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {locale === 'es'
                ? <>Tu propiedad merece<br />los compradores correctos.</>
                : <>Your property deserves<br />the right buyers.</>}
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-xl">
              {locale === 'es'
                ? `En ${SITE_NAME} conectamos propiedades únicas en Guanacaste con compradores internacionales que entienden su valor.`
                : `At ${SITE_NAME} we connect unique Guanacaste properties with international buyers who understand their value.`}
            </p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/85 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
            >
              {locale === 'es' ? 'Cuéntanos sobre tu propiedad' : 'Tell us about your property'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Por qué nosotros ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink mb-3">
              {locale === 'es' ? 'Por qué vender con nosotros' : 'Why sell with us'}
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed">
              {locale === 'es'
                ? 'Combinamos conocimiento local con alcance internacional para obtener el mejor resultado para tu propiedad.'
                : 'We combine local knowledge with international reach to achieve the best outcome for your property.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {valueProps.map((vp) => (
              <div
                key={vp.title}
                className="bg-surface rounded-xl p-7 border-t-4 border-accent shadow-sm"
              >
                <div className="mb-5">{vp.icon}</div>
                <h3 className="font-heading font-semibold text-ink text-lg mb-2">{vp.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proceso ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center mb-16">
            {locale === 'es' ? 'El proceso, paso a paso' : 'The process, step by step'}
          </h2>

          <div className="flex flex-col sm:flex-row gap-0">
            {steps.map((step, i) => (
              <div key={step.num} className="flex-1 flex flex-col sm:items-center text-left sm:text-center relative">
                {/* Connector line between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-1/2 w-full h-px bg-accent/25 z-0" />
                )}
                <div className="relative z-10 flex sm:flex-col sm:items-center gap-4 sm:gap-0">
                  <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-secondary ring-4 ring-surface">
                    <span className="font-heading font-bold text-accent text-xl">{step.num}</span>
                  </div>
                  <div className="sm:mt-5 pb-8 sm:pb-0">
                    <h3 className="font-heading font-semibold text-ink mb-2">{step.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed sm:px-4">{step.desc}</p>
                  </div>
                </div>
                {/* Mobile vertical connector */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden absolute left-8 top-16 bottom-0 w-px bg-accent/25" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-secondary" id="contact-form">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Left — editorial copy */}
          <div className="lg:pt-4">
            <span className="inline-block text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-5 border border-accent/40 px-3 py-1 rounded-full">
              {locale === 'es' ? 'Empecemos' : "Let's get started"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              {locale === 'es'
                ? 'Tenemos compradores buscando en Guanacaste ahora mismo.'
                : 'We have buyers searching Guanacaste right now.'}
            </h2>
            <p className="text-white/65 leading-relaxed mb-8 text-sm">
              {locale === 'es'
                ? 'Cuéntanos sobre tu propiedad y nos ponemos en contacto para conversar sobre cómo posicionarla y conectarla con los compradores indicados.'
                : "Tell us about your property and we'll reach out to discuss how to position it and connect it with the right buyers."}
            </p>
            <ul className="space-y-3">
              {contactBullets.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-white/75 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="bg-surface rounded-xl p-6 shadow-lg">
            <ContactForm locale={locale} source="seller" />
          </div>
        </div>
      </section>
    </>
  )
}
