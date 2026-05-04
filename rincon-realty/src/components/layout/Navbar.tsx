'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Heart } from 'lucide-react'
import { useLocale } from 'next-intl'
import { SITE_NAME } from '@/config/site'
import { useFavorites } from '@/hooks/useFavorites'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '@/lib/utils/cn'

export default function Navbar() {
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count: favCount } = useFavorites()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const prefix = locale === 'es' ? '/es' : ''

  const navLinks = [
    { href: `${prefix}/properties`,  label: locale === 'es' ? 'Propiedades' : 'Properties' },
    { href: `${prefix}/communities`, label: locale === 'es' ? 'Comunidades' : 'Communities' },
    { href: `${prefix}/agents`,      label: locale === 'es' ? 'Agentes' : 'Agents' },
    { href: `${prefix}/blog`,        label: 'Blog' },
    { href: `${prefix}/sell-with-us`, label: locale === 'es' ? 'Vender' : 'Sell with us' },
  ]

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 bg-secondary transition-all duration-300',
          scrolled && 'bg-secondary/95 backdrop-blur-sm shadow-md',
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href={prefix || '/'}
            className="font-heading text-xl font-bold text-accent shrink-0"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/65 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Favorites */}
            <Link
              href={`${prefix}/favorites`}
              className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition-colors duration-200"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5 text-white/70" />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold">
                  {favCount > 9 ? '9+' : favCount}
                </span>
              )}
            </Link>

            {/* Contact CTA */}
            <Link
              href={`${prefix}/contact`}
              className="hidden sm:inline-flex items-center rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent/90 transition-colors duration-200"
            >
              {locale === 'es' ? 'Contacto' : 'Contact Us'}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-secondary flex flex-col">
          <div className="flex items-center justify-between px-4 h-16">
            <span className="font-heading text-xl font-bold text-accent">{SITE_NAME}</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg text-white/80 hover:text-white py-3 border-b border-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`${prefix}/contact`}
              onClick={() => setMobileOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent text-white text-base font-medium px-6 py-3 hover:bg-accent/90 transition-colors"
            >
              {locale === 'es' ? 'Contacto' : 'Contact Us'}
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
