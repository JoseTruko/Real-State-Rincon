import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import { createServerClient } from '@/lib/supabase/server'
import type { Community } from '@/types'

export const getCommunities = unstable_cache(
  async (): Promise<Community[]> => {
    const { data, error } = await supabasePublic
      .from('communities')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
    if (error) return []
    return (data ?? []) as Community[]
  },
  ['communities-list'],
  { tags: ['communities'], revalidate: 3600 },
)

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data as Community
}
