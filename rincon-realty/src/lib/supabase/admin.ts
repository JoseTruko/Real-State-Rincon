import { createClient } from '@supabase/supabase-js'
import { createDevMock } from './mock'

/**
 * Cliente Supabase con service_role — bypasea RLS completamente.
 *
 * ⚠️ SOLO usar en Route Handlers del servidor (API routes).
 * NUNCA importar en componentes del cliente ni exponer al navegador.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = (!url || !serviceKey || url.includes('placeholder'))
  ? createDevMock() as any
  : createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
