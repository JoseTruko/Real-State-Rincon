import { createClient } from '@supabase/supabase-js'
import { createDevMock } from './mock'

/**
 * Cliente Supabase sin cookies — sólo para queries de lectura pública
 * dentro de unstable_cache (que no admite funciones dinámicas como cookies()).
 * Las tablas públicas (communities, agents, properties, blog_posts) tienen
 * RLS de lectura abierta para anon, por lo que no se necesita sesión.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabasePublic =
  !url || !key || url.includes('placeholder')
    ? (createDevMock() as any)
    : createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
