'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/slug'

const propertySchema = z.object({
  title_en: z.string().min(2, 'Title EN is required'),
  title_es: z.string().min(2, 'Título ES es requerido'),
  description_en: z.string().min(10, 'Description EN is required'),
  description_es: z.string().min(10, 'Descripción ES es requerida'),
  type: z.enum(['house', 'land', 'farm']),
  price_usd: z.coerce.number().positive('Price must be positive'),
  area_m2: z.coerce.number().positive('Area must be positive'),
  bedrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  bathrooms: z.coerce.number().nonnegative().optional().nullable(),
  construction_m2: z.coerce.number().nonnegative().optional().nullable(),
  year_built: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  legal_status: z.string().optional().nullable(),
  hoa_fees: z.coerce.number().nonnegative().optional().nullable(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  community_id: z.preprocess(v => v === '' ? null : v, z.string().uuid().nullable().optional()),
  agent_id: z.preprocess(v => v === '' ? null : v, z.string().uuid().nullable().optional()),
  status: z.enum(['draft', 'published']),
  featured: z.string().optional(),
  slug_en: z.string().optional(),
  slug_es: z.string().optional(),
  meta_title_en: z.string().optional().nullable(),
  meta_title_es: z.string().optional().nullable(),
  meta_description_en: z.string().optional().nullable(),
  meta_description_es: z.string().optional().nullable(),
})

function parseBool(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true'
}

function parseAmenities(formData: FormData): Record<string, boolean> {
  const amenityKeys = [
    'pool', 'gym', 'garage', 'security', 'ocean_view', 'mountain_view',
    'furnished', 'air_conditioning', 'garden', 'terrace', 'solar_panels',
    'well_water', 'gated_community',
  ]
  return amenityKeys.reduce((acc, key) => {
    acc[key] = formData.get(`amenity_${key}`) === 'on'
    return acc
  }, {} as Record<string, boolean>)
}

export async function createProperty(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = propertySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { lat, lng, slug_en, slug_es, featured, ...rest } = parsed.data

  const finalSlugEn = slug_en || generateSlug(rest.title_en)
  const finalSlugEs = slug_es || generateSlug(rest.title_es)

  const { data, error } = await supabaseAdmin
    .from('properties')
    .insert({
      ...rest,
      slug_en: finalSlugEn,
      slug_es: finalSlugEs,
      coordinates: { lat, lng },
      featured: parseBool(formData.get('featured')),
      amenities: parseAmenities(formData),
    })
    .select('id')
    .single()

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/properties')
  revalidatePath('/[locale]/properties', 'page')
  revalidateTag('properties')
  redirect('/admin/properties')
}

export async function updateProperty(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = propertySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { lat, lng, slug_en, slug_es, featured, ...rest } = parsed.data

  // Preserve existing slugs — never auto-regenerate on update to avoid breaking URLs.
  // Only override if the user explicitly typed a non-empty value in the slug fields.
  const { data: existing } = await supabaseAdmin
    .from('properties')
    .select('slug_en, slug_es')
    .eq('id', id)
    .single()

  const finalSlugEn = slug_en || existing?.slug_en || generateSlug(rest.title_en)
  const finalSlugEs = slug_es || existing?.slug_es || generateSlug(rest.title_es)

  const { error } = await supabaseAdmin
    .from('properties')
    .update({
      ...rest,
      slug_en: finalSlugEn,
      slug_es: finalSlugEs,
      coordinates: { lat, lng },
      featured: parseBool(formData.get('featured')),
      amenities: parseAmenities(formData),
    })
    .eq('id', id)

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/properties')
  revalidatePath(`/admin/properties/${id}`)
  revalidatePath('/[locale]/properties', 'page')
  revalidateTag('properties')
  redirect('/admin/properties')
}

export async function deleteProperty(id: string) {
  // Delete images from Storage
  const { data: images } = await supabaseAdmin
    .from('property_images')
    .select('url')
    .eq('property_id', id)

  if (images?.length) {
    const paths = images.map((img: { url: string }) => {
      const url = new URL(img.url)
      const parts = url.pathname.split('/storage/v1/object/public/property-images/')
      return parts[1] ?? ''
    }).filter(Boolean)

    if (paths.length) {
      await supabaseAdmin.storage.from('property-images').remove(paths)
    }
  }

  // Delete property_images records
  await supabaseAdmin.from('property_images').delete().eq('property_id', id)

  // Delete property
  const { error } = await supabaseAdmin.from('properties').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/properties')
  revalidatePath('/[locale]/properties', 'page')
  revalidateTag('properties')
  return { success: true }
}

export async function addPropertyImage(
  propertyId: string,
  url: string,
  altText: string,
  sortOrder: number,
) {
  const { error } = await supabaseAdmin.from('property_images').insert({
    property_id: propertyId,
    url,
    alt_text: altText,
    sort_order: sortOrder,
  })

  if (error) return { error: error.message }

  revalidatePath(`/admin/properties/${propertyId}`)
  return { success: true }
}

export async function deletePropertyImage(imageId: string, url: string) {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/storage/v1/object/public/property-images/')
    if (parts[1]) {
      await supabaseAdmin.storage.from('property-images').remove([parts[1]])
    }
  } catch {}

  const { error } = await supabaseAdmin.from('property_images').delete().eq('id', imageId)
  if (error) return { error: error.message }

  return { success: true }
}
