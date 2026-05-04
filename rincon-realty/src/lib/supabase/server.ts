import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createDevMock } from './mock'

/**
 * Cliente Supabase para uso en React Server Components y Route Handlers.
 * Usa cookies de Next.js para mantener la sesión del usuario.
 * Respeta las políticas RLS con la clave anónima.
 */
export async function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // En desarrollo sin base de datos real, retornar un mock con encadenamiento completo
  if (!url || !key || url.includes('placeholder')) {
    return createDevMock() as any
  }
  
  const cookieStore = await cookies()

  return createSupabaseServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll puede fallar en RSC — ignorar
        }
      },
    },
  })
}
