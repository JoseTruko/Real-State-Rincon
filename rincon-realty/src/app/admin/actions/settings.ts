'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'

const FIELDS = [
  'site_name', 'site_description_en', 'site_description_es',
  'contact_email', 'contact_phone', 'whatsapp_number',
  'facebook_url', 'instagram_url', 'canonical_url',
  'meta_description_en', 'meta_description_es',
] as const

export async function updateSiteConfig(formData: FormData) {
  const updates = FIELDS.map((key) => ({
    key,
    value: (formData.get(key) as string) ?? '',
  }))

  for (const { key, value } of updates) {
    const { error } = await supabaseAdmin
      .from('site_config')
      .upsert({ key, value }, { onConflict: 'key' })

    if (error) return { error: `Error updating ${key}: ${error.message}` }
  }

  revalidatePath('/admin/settings')
  return { success: true }
}

export async function getSiteConfigMap(): Promise<Record<string, string>> {
  const { data } = await supabaseAdmin
    .from('site_config')
    .select('key, value')

  if (!data) return {}
  return data.reduce((acc: Record<string, string>, row: { key: string; value: string | null }) => {
    acc[row.key] = row.value ?? ''
    return acc
  }, {} as Record<string, string>)
}
