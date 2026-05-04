'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/slug'

const blogSchema = z.object({
  title_en: z.string().min(2, 'Title EN is required'),
  title_es: z.string().min(2, 'Título ES es requerido'),
  content_en: z.string().min(10, 'Content EN is required'),
  content_es: z.string().min(10, 'Contenido ES es requerido'),
  excerpt_en: z.string().optional().default(''),
  excerpt_es: z.string().optional().default(''),
  category: z.string().min(1, 'Category is required'),
  cover_image_url: z.string().optional().nullable(),
  author_id: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'published']),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  slug_en: z.string().optional(),
  slug_es: z.string().optional(),
})

export async function createBlogPost(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = blogSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { slug_en, slug_es, status, published_at, ...rest } = parsed.data

  const finalSlugEn = slug_en || generateSlug(rest.title_en)
  const finalSlugEs = slug_es || generateSlug(rest.title_es)

  const publishedAt = status === 'published'
    ? (published_at || new Date().toISOString())
    : null

  const { error } = await supabaseAdmin.from('blog_posts').insert({
    ...rest,
    slug_en: finalSlugEn,
    slug_es: finalSlugEs,
    status,
    published_at: publishedAt,
  })

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/blog')
  revalidatePath('/[locale]/blog', 'page')
  revalidateTag('blog')
  redirect('/admin/blog')
}

export async function updateBlogPost(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = blogSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { slug_en, slug_es, status, published_at, ...rest } = parsed.data

  const finalSlugEn = slug_en || generateSlug(rest.title_en)
  const finalSlugEs = slug_es || generateSlug(rest.title_es)

  // Keep existing published_at if already published; set now if newly publishing
  const { data: existing } = await supabaseAdmin
    .from('blog_posts')
    .select('published_at, status')
    .eq('id', id)
    .single()

  let publishedAt: string | null = null
  if (status === 'published') {
    publishedAt = published_at || existing?.published_at || new Date().toISOString()
  }

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update({
      ...rest,
      slug_en: finalSlugEn,
      slug_es: finalSlugEs,
      status,
      published_at: publishedAt,
    })
    .eq('id', id)

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath('/[locale]/blog', 'page')
  revalidateTag('blog')
  redirect('/admin/blog')
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/blog')
  revalidatePath('/[locale]/blog', 'page')
  revalidateTag('blog')
  return { success: true }
}
