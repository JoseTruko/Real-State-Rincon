'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils/cn'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(newLocale: 'en' | 'es') {
    if (newLocale === locale) return
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'px-2 py-1 rounded transition-colors duration-200',
          locale === 'en'
            ? 'text-accent font-semibold'
            : 'text-white/60 hover:text-white',
        )}
      >
        EN
      </button>
      <span className="text-white/30">/</span>
      <button
        onClick={() => switchLocale('es')}
        className={cn(
          'px-2 py-1 rounded transition-colors duration-200',
          locale === 'es'
            ? 'text-accent font-semibold'
            : 'text-white/60 hover:text-white',
        )}
      >
        ES
      </button>
    </div>
  )
}
