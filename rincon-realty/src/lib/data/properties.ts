import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import { createServerClient } from '@/lib/supabase/server'
import type { Property, PropertyFilters, PropertyCardData } from '@/types'

const PROPERTY_CARD_SELECT = `
  id, slug_en, slug_es, title_en, title_es,
  price_usd, type, area_m2, bedrooms, bathrooms, featured,
  community:communities(id, slug, name_en, name_es),
  images:property_images(id, url, alt_text, sort_order)
`

export const getFeaturedProperties = unstable_cache(
  async (limit = 6): Promise<PropertyCardData[]> => {
    const { data, error } = await supabasePublic
      .from('properties')
      .select(PROPERTY_CARD_SELECT)
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data?.length) {
      const { data: fallback } = await supabasePublic
        .from('properties')
        .select(PROPERTY_CARD_SELECT)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)
      return (fallback ?? []) as unknown as PropertyCardData[]
    }
    return data as unknown as PropertyCardData[]
  },
  ['featured-properties'],
  { tags: ['properties'], revalidate: 3600 },
)

/**
 * Fetches properties with filters for the listing page.
 */
export async function getProperties(filters: PropertyFilters = {}) {
  const supabase = await createServerClient()
  const page = filters.page ?? 1
  const limit = 12
  const offset = (page - 1) * limit

  let query = supabase
    .from('properties')
    .select(`
      id, slug_en, slug_es, title_en, title_es,
      price_usd, type, area_m2, bedrooms, bathrooms, featured,
      community:communities(id, slug, name_en, name_es),
      images:property_images(id, url, alt_text, sort_order)
    `, { count: 'exact' })
    .eq('status', 'published')

  if (filters.type)         query = query.eq('type', filters.type)
  if (filters.community_id) query = query.eq('community_id', filters.community_id)
  if (filters.agent_id)     query = query.eq('agent_id', filters.agent_id)
  if (filters.price_min)    query = query.gte('price_usd', filters.price_min)
  if (filters.price_max)    query = query.lte('price_usd', filters.price_max)
  if (filters.area_min)     query = query.gte('area_m2', filters.area_min)
  if (filters.area_max)     query = query.lte('area_m2', filters.area_max)
  if (filters.featured)     query = query.eq('featured', true)

  query = query
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, count, error } = await query

  return {
    properties: (data ?? []) as unknown as PropertyCardData[],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

/**
 * Fetches all published properties for sitemap generation.
 */
export async function getAllPublishedProperties(): Promise<
  Pick<Property, 'slug_en' | 'slug_es' | 'updated_at'>[]
> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('properties')
    .select('slug_en, slug_es, updated_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as Pick<Property, 'slug_en' | 'slug_es' | 'updated_at'>[]
}

/**
 * Fetches a single property by slug (EN or ES).
 */
export async function getPropertyBySlug(slug: string, locale: 'en' | 'es' = 'en'): Promise<Property | null> {
  const supabase = await createServerClient()
  const slugField = locale === 'es' ? 'slug_es' : 'slug_en'
  const altSlugField = locale === 'es' ? 'slug_en' : 'slug_es'

  // Try primary slug field first, fall back to the other locale's slug.
  // This allows the language switcher to work on property detail pages even
  // when the URL carries the opposite locale's slug.
  const { data } = await supabase
    .from('properties')
    .select(`
      *,
      community:communities(*),
      agent:agents(*),
      images:property_images(*)
    `)
    .or(`${slugField}.eq.${slug},${altSlugField}.eq.${slug}`)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) return null
  return data as unknown as Property
}
