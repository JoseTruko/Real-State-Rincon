import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import { createServerClient } from '@/lib/supabase/server'
import type { Agent } from '@/types'

export const getAgents = unstable_cache(
  async (): Promise<Agent[]> => {
    const { data, error } = await supabasePublic
      .from('agents')
      .select('*')
      .eq('active', true)
      .order('full_name', { ascending: true })
    if (error) return []
    return (data ?? []) as Agent[]
  },
  ['agents-list'],
  { tags: ['agents'], revalidate: 3600 },
)

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data as Agent
}
