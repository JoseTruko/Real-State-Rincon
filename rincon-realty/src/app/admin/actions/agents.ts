'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/slug'

function parseBool(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true'
}

const agentSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  title_en: z.string().min(2, 'Title EN is required'),
  title_es: z.string().min(2, 'Título ES es requerido'),
  bio_en: z.string().min(10, 'Bio EN is required'),
  bio_es: z.string().min(10, 'Bio ES es requerida'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(5, 'Phone is required'),
  whatsapp: z.string().min(5, 'WhatsApp is required'),
  years_experience: z.coerce.number().int().nonnegative(),
  linkedin_url: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  photo_url: z.string().optional().nullable(),
  active: z.string().optional(),
  slug: z.string().optional(),
})

export async function createAgent(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())

  // Parse languages array
  const languages = formData.getAll('languages').map(String)

  const parsed = agentSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { active, slug, ...rest } = parsed.data

  const { error } = await supabaseAdmin.from('agents').insert({
    ...rest,
    slug: slug || generateSlug(rest.full_name),
    languages: languages.length ? languages : ['English'],
    active: parseBool(formData.get('active')),
  })

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/agents')
  revalidatePath('/[locale]/agents', 'page')
  revalidateTag('agents')
  redirect('/admin/agents')
}

export async function updateAgent(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const languages = formData.getAll('languages').map(String)

  const parsed = agentSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { active, slug, ...rest } = parsed.data

  const { data: existing } = await supabaseAdmin
    .from('agents')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabaseAdmin
    .from('agents')
    .update({
      ...rest,
      slug: slug || existing?.slug || generateSlug(rest.full_name),
      languages: languages.length ? languages : ['English'],
      active: parseBool(formData.get('active')),
    })
    .eq('id', id)

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/admin/agents')
  revalidatePath(`/admin/agents/${id}`)
  revalidatePath('/[locale]/agents', 'page')
  revalidateTag('agents')
  redirect('/admin/agents')
}

export async function deleteAgent(id: string) {
  const { error } = await supabaseAdmin.from('agents').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/agents')
  revalidatePath('/[locale]/agents', 'page')
  revalidateTag('agents')
  return { success: true }
}
