import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CompareBar from '@/components/compare/CompareBar'
import HtmlLang from '@/components/layout/HtmlLang'
import type { Locale } from '@/types'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLang />
      <Navbar />
      <main>{children}</main>
      <Footer locale={locale as Locale} />
      <CompareBar />
    </NextIntlClientProvider>
  )
}
