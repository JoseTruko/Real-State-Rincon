'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/slug'

function parseBool(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true'
}

const communitySchema = z.object({
  name_en: z.string().min(2, 'Name EN is required'),
  name_es: z.string().min(2, 'Nombre ES es requerido'),
  description_en: z.string().min(10, 'Description EN is required'),
  description_es: z.string().min(10, 'Descripción ES es requerida'),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  image_url: z.string().url().optional().nullable(),
  active: z.string().optional(),
  sort_order: z.coerce.number().int().nonnegative().optional(),
  slug: z.string().optional(),
})

export async function createCommunity(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = communitySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { lat, lng, active, slug, ...rest } = parsed.data

  const { error } = await supabaseAdmin.from('communities').insert({
    ...rest,
    slug: slug || generateSlug(rest.name_en),
    coordinates: { lat, lng },
    active: active === 'on',
  })

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/communities')
  revalidatePath('/[locale]/communities', 'page')
  revalidateTag('communities')
  redirect('/admin/communities')
}

export async function updateCommunity(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = communitySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { lat, lng, active, slug, ...rest } = parsed.data

  const { data: existing } = await supabaseAdmin
    .from('communities')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabaseAdmin
    .from('communities')
    .update({
      ...rest,
      slug: slug || existing?.slug || generateSlug(rest.name_en),
      coordinates: { lat, lng },
      active: parseBool(formData.get('active')),
    })
    .eq('id', id)

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/communities')
  revalidatePath(`/admin/communities/${id}`)
  revalidatePath('/[locale]/communities', 'page')
  revalidateTag('communities')
  redirect('/admin/communities')
}

export async function deleteCommunity(id: string) {
  const { error } = await supabaseAdmin.from('communities').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/communities')
  revalidatePath('/[locale]/communities', 'page')
  revalidateTag('communities')
  return { success: true }
}
