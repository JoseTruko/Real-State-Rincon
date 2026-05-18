import Link from 'next/link'
import { Mail, Phone, ExternalLink, ArrowRight } from 'lucide-react'
import { SITE_NAME, SITE_CONFIG_DEFAULTS } from '@/config/site'
import type { Locale, SiteConfig } from '@/types'

interface FooterProps {
  locale: Locale
  config?: Partial<SiteConfig>
}

export default function Footer({ locale, config = {} }: FooterProps) {
  const merged = { ...SITE_CONFIG_DEFAULTS, ...config }
  const prefix = locale === 'es' ? '/es' : ''
  const year = new Date().getFullYear()

  const quickLinks = [
    { href: prefix || '/',           label: locale === 'es' ? 'Inicio' : 'Home' },
    { href: `${prefix}/properties`,  label: locale === 'es' ? 'Propiedades' : 'Properties' },
    { href: `${prefix}/communities`, label: locale === 'es' ? 'Comunidades' : 'Communities' },
    { href: `${prefix}/agents`,      label: locale === 'es' ? 'Agentes' : 'Agents' },
    { href: `${prefix}/blog`,        label: 'Blog' },
    { href: `${prefix}/contact`,     label: locale === 'es' ? 'Contacto' : 'Contact' },
  ]

  const sellPoints = locale === 'es'
    ? ['Listado profesional bilingüe', 'Alcance a compradores internacionales', 'Apoyo legal en cada paso']
    : ['Professional bilingual listing', 'Reach for international buyers', 'Legal support every step']

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-heading text-xl font-bold text-accent mb-3">{SITE_NAME}</p>
            <p className="text-sm text-white/60 leading-relaxed">
              {locale === 'es' ? merged.site_description_es : merged.site_description_en}
            </p>
            {(merged.instagram_url || merged.facebook_url) && (
              <div className="flex gap-3 mt-5">
                {merged.instagram_url && (
                  <a
                    href={merged.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {merged.facebook_url && (
                  <a
                    href={merged.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              {locale === 'es' ? 'Enlaces' : 'Links'}
            </p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell with us */}
          <div>
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              {locale === 'es' ? 'Vende tu propiedad' : 'Sell your property'}
            </p>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {locale === 'es'
                ? 'Conectamos tu propiedad con compradores internacionales que buscan en Guanacaste.'
                : 'We connect your property with international buyers searching in Guanacaste.'}
            </p>
            <ul className="flex flex-col gap-1.5 mb-5">
              {sellPoints.map((pt) => (
                <li key={pt} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
            <Link
              href={`${prefix}/sell-with-us`}
              className="inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:text-accent/80 transition-colors"
            >
              {locale === 'es' ? 'Más información' : 'Learn more'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </p>
            <ul className="flex flex-col gap-3">
              {merged.contact_email && (
                <li>
                  <a
                    href={`mailto:${merged.contact_email}`}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    {merged.contact_email}
                  </a>
                </li>
              )}
              {merged.contact_phone && (
                <li>
                  <a
                    href={`tel:${merged.contact_phone}`}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {merged.contact_phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {year} {SITE_NAME}. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <div className="flex gap-4">
            <Link href={prefix || '/'} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              EN
            </Link>
            <Link href="/es" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              ES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
