import type { SiteConfig } from '@/types'

// ============================================================
// SITE_NAME — cambiar aquí para renombrar el sitio globalmente
// ============================================================
export const SITE_NAME = 'Rincón Realty'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rinconrealtycr.com'

export const SITE_CONFIG_DEFAULTS: SiteConfig = {
  site_name:           SITE_NAME,
  site_description_en: 'Luxury real estate in Guanacaste & Rincón de la Vieja, Costa Rica',
  site_description_es: 'Bienes raíces de lujo en Guanacaste y Rincón de la Vieja, Costa Rica',
  contact_email:       process.env.ADMIN_EMAIL ?? '',
  contact_phone:       '',
  whatsapp_number:     process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  facebook_url:        '',
  instagram_url:       '',
  canonical_url:       SITE_URL,
  meta_description_en: 'Find your dream property in Costa Rica — houses, land & farms for sale in Guanacaste.',
  meta_description_es: 'Encuentra tu propiedad ideal en Costa Rica — casas, terrenos y fincas en venta en Guanacaste.',
}
