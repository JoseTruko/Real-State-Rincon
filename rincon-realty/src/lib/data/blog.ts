import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import { createServerClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/types'

export const getLatestPosts = unstable_cache(
  async (limit = 3): Promise<BlogPost[]> => {
    const { data, error } = await supabasePublic
      .from('blog_posts')
      .select(`*, author:agents(id, slug, full_name, photo_url, title_en, title_es)`)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) return []
    return (data ?? []) as unknown as BlogPost[]
  },
  ['latest-posts'],
  { tags: ['blog'], revalidate: 600 },
)

export async function getBlogPosts(page = 1, perPage = 9): Promise<{ posts: BlogPost[]; total: number }> {
  const supabase = await createServerClient()
  const offset = (page - 1) * perPage

  const { data, count, error } = await supabase
    .from('blog_posts')
    .select(`*, author:agents(id, slug, full_name, photo_url, title_en, title_es)`, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (error) return { posts: [], total: 0 }
  return { posts: (data ?? []) as unknown as BlogPost[], total: count ?? 0 }
}

export async function getAllPublishedPosts(): Promise<
  Pick<BlogPost, 'slug_en' | 'slug_es' | 'published_at'>[]
> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('slug_en, slug_es, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return (data ?? []) as unknown as Pick<BlogPost, 'slug_en' | 'slug_es' | 'published_at'>[]
}

export async function getBlogPostBySlug(slug: string, locale: 'en' | 'es' = 'en'): Promise<BlogPost | null> {
  const supabase = await createServerClient()
  const slugField = locale === 'es' ? 'slug_es' : 'slug_en'

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`*, author:agents(*)`)
    .eq(slugField, slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return data as unknown as BlogPost
}
