'use client'

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { createDevMock } from './mock'

/**
 * Cliente Supabase para uso en componentes del cliente (browser).
 * Respeta las políticas RLS con la clave anónima.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('placeholder')) {
    return createDevMock() as any
  }

  return createSupabaseBrowserClient(url, key)
}
