'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search } from 'lucide-react'
import type { Community, Locale, PropertyType } from '@/types'
import { localizedField } from '@/lib/utils/format'

interface SearchBarProps {
  communities: Array<Pick<Community, 'id' | 'name_en' | 'name_es'>>
  locale: Locale
  initialType?: string
  initialCommunity?: string
  initialPriceRange?: string
}

const PRICE_RANGES = [
  { value: '', label_en: 'Any price', label_es: 'Cualquier precio' },
  { value: '0-100000',    label_en: 'Under $100K',      label_es: 'Menos de $100K' },
  { value: '100000-300000', label_en: '$100K – $300K',  label_es: '$100K – $300K' },
  { value: '300000-600000', label_en: '$300K – $600K',  label_es: '$300K – $600K' },
  { value: '600000-1000000', label_en: '$600K – $1M',   label_es: '$600K – $1M' },
  { value: '1000000-99999999', label_en: 'Over $1M',    label_es: 'Más de $1M' },
]

export default function SearchBar({
  communities,
  locale,
  initialType = '',
  initialCommunity = '',
  initialPriceRange = '',
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useCallback(() => {
    const type      = (document.getElementById('sb-type') as HTMLSelectElement)?.value
    const community = (document.getElementById('sb-community') as HTMLSelectElement)?.value
    const priceRange = (document.getElementById('sb-price') as HTMLSelectElement)?.value

    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')

    if (type)      params.set('type', type)
    else           params.delete('type')

    if (community) params.set('community_id', community)
    else           params.delete('community_id')

    if (priceRange) {
      const [min, max] = priceRange.split('-')
      params.set('price_min', min)
      params.set('price_max', max)
    } else {
      params.delete('price_min')
      params.delete('price_max')
    }

    const target = pathname.includes('/properties') ? pathname : '/properties'
    router.push(`${target}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const typeOptions = [
    { value: '', label: locale === 'es' ? 'Todos los tipos' : 'All types' },
    { value: 'house', label: locale === 'es' ? 'Casa' : 'House' },
    { value: 'land',  label: locale === 'es' ? 'Terreno' : 'Land' },
    { value: 'farm',  label: locale === 'es' ? 'Finca' : 'Farm' },
  ]

  const selectClass = 'rounded-lg border border-neutral-300 bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 min-w-0'

  return (
    <div className="bg-surface rounded-xl p-3 sm:p-4 shadow-lg border border-neutral-200">
      {/* Mobile: 2x2 grid — Desktop: single row */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3">
        {/* Type */}
        <select id="sb-type" defaultValue={initialType} className={`${selectClass} col-span-1 sm:flex-1`}>
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Community */}
        <select id="sb-community" defaultValue={initialCommunity} className={`${selectClass} col-span-1 sm:flex-1`}>
          <option value="">{locale === 'es' ? 'Comunidad' : 'Community'}</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {localizedField(c, 'name', locale)}
            </option>
          ))}
        </select>

        {/* Price range */}
        <select id="sb-price" defaultValue={initialPriceRange} className={`${selectClass} col-span-1 sm:flex-1`}>
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {locale === 'es' ? r.label_es : r.label_en}
            </option>
          ))}
        </select>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="col-span-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors duration-200 sm:shrink-0 sm:px-6"
        >
          <Search className="h-4 w-4" />
          <span className="sm:inline">{locale === 'es' ? 'Buscar' : 'Search'}</span>
        </button>
      </div>
    </div>
  )
}
