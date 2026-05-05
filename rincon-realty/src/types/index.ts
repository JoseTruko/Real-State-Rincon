// ============================================================
// Rincón Realty — Tipos de dominio
// ============================================================

export type Locale = 'en' | 'es'

export type PropertyType     = 'house' | 'land' | 'farm'
export type PropertyStatus   = 'draft' | 'published'
export type BlogStatus       = 'draft' | 'published'
export type ContactSource    = 'form' | 'whatsapp' | 'email_reveal' | 'seller'
export type ContactStatus    = 'new' | 'contacted' | 'closed'
export type CommissionStatus = 'none' | 'pending' | 'confirmed' | 'paid'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Community {
  id: string
  slug: string
  name_en: string
  name_es: string
  description_en: string
  description_es: string
  image_url: string
  coordinates: Coordinates
  active: boolean
  sort_order: number
  created_at: string
}

export interface Agent {
  id: string
  slug: string
  full_name: string
  photo_url: string
  title_en: string
  title_es: string
  bio_en: string
  bio_es: string
  email: string
  phone: string
  whatsapp: string
  languages: string[]
  years_experience: number
  linkedin_url: string | null
  active: boolean
  created_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  alt_text: string
  sort_order: number
  created_at: string
}

export interface Property {
  id: string
  slug_en: string
  slug_es: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  price_usd: number
  type: PropertyType
  status: PropertyStatus
  featured: boolean
  community_id: string | null
  agent_id: string | null
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number
  construction_m2: number | null
  year_built: number | null
  legal_status: string | null
  hoa_fees: number | null
  coordinates: Coordinates
  amenities: Record<string, boolean>
  meta_title_en: string | null
  meta_title_es: string | null
  meta_description_en: string | null
  meta_description_es: string | null
  created_at: string
  updated_at: string
  // Relations (joined)
  community?: Pick<Community, 'id' | 'slug' | 'name_en' | 'name_es'>
  agent?: Pick<Agent, 'id' | 'slug' | 'full_name' | 'photo_url' | 'email' | 'phone' | 'whatsapp' | 'title_en' | 'title_es'>
  images?: PropertyImage[]
}

export interface BlogPost {
  id: string
  slug_en: string
  slug_es: string
  title_en: string
  title_es: string
  content_en: string
  content_es: string
  excerpt_en: string
  excerpt_es: string
  cover_image_url: string
  category: string
  author_id: string | null
  meta_title: string | null
  meta_description: string | null
  status: BlogStatus
  published_at: string | null
  created_at: string
  author?: Pick<Agent, 'id' | 'slug' | 'full_name' | 'photo_url' | 'title_en' | 'title_es'>
}

export interface Contact {
  id: string
  property_id: string | null
  agent_id: string | null
  name: string
  email: string
  phone: string | null
  message: string
  source: ContactSource
  status: ContactStatus
  commission_status: CommissionStatus
  commission_notes: string | null
  created_at: string
  property?: Pick<Property, 'id' | 'title_en' | 'slug_en'>
  agent?: Pick<Agent, 'id' | 'full_name' | 'email'>
}

export interface SiteConfig {
  site_name: string
  site_description_en: string
  site_description_es: string
  contact_email: string
  contact_phone: string
  whatsapp_number: string
  facebook_url: string
  instagram_url: string
  canonical_url: string
  meta_description_en: string
  meta_description_es: string
}

export interface PropertyFilters {
  type?: PropertyType
  community_id?: string
  agent_id?: string
  price_min?: number
  price_max?: number
  area_min?: number
  area_max?: number
  page?: number
  featured?: boolean
}

// Tipo para PropertyCard (subset de Property)
export type PropertyCardData = Pick<
  Property,
  | 'id'
  | 'slug_en'
  | 'slug_es'
  | 'title_en'
  | 'title_es'
  | 'price_usd'
  | 'type'
  | 'area_m2'
  | 'bedrooms'
  | 'bathrooms'
  | 'featured'
  | 'community'
  | 'images'
>
