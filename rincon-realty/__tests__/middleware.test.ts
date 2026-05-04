import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '../middleware'

// Feature: costa-rica-real-estate
// Property 3: Middleware redirige a login sin sesión activa

// Mock next-intl middleware
const mockIntlMiddleware = vi.hoisted(() => vi.fn((_request: NextRequest) => NextResponse.next()))
vi.mock('next-intl/middleware', () => ({
  default: vi.fn(() => mockIntlMiddleware)
}))

// Mock Supabase client
const mockGetSession = vi.fn()
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession
    }
  }))
}))

// Mock i18n routing
vi.mock('@/i18n/routing', () => ({
  routing: {}
}))

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

describe('middleware authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default to no session
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockIntlMiddleware.mockReturnValue(NextResponse.next())
  })

  it('redirects admin routes to login when no session exists', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(path =>
          /^[a-zA-Z0-9_-]+$/.test(path) &&
          !path.includes('login') &&
          path !== '-'
        ),
        async (adminPath) => {
          const url = `https://example.com/admin/${adminPath}`
          const request = new NextRequest(url)

          const response = await middleware(request)

          expect(response.status).toBe(307)
          expect(response.headers.get('location')).toBe('https://example.com/admin/login')
        }
      ),
      { numRuns: 100 }
    )
  })

  it('does not redirect /admin/login', async () => {
    const request = new NextRequest('https://example.com/admin/login')

    const response = await middleware(request)

    // Should not be a redirect (intl middleware handles it)
    expect(response.status).not.toBe(307)
  })

  it('allows admin routes when session exists', async () => {
    // Mock session exists
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user' },
          access_token: 'test-token'
        }
      }
    })

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(path =>
          /^[a-zA-Z0-9_-]+$/.test(path) &&
          !path.includes('login') &&
          path !== '-'
        ),
        async (adminPath) => {
          const url = `https://example.com/admin/${adminPath}`
          const request = new NextRequest(url)

          const response = await middleware(request)

          // Should not redirect when session exists
          expect(response.status).not.toBe(307)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('passes non-admin routes to intl middleware', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant('/'),
          fc.constant('/properties'),
          fc.constant('/communities'),
          fc.constant('/agents'),
          fc.constant('/blog'),
          fc.constant('/contact'),
          fc.constant('/sell-with-us'),
          fc.constant('/compare'),
          fc.constant('/favorites'),
          fc.string({ minLength: 1, maxLength: 30 }).map(s => `/properties/${s}`),
          fc.string({ minLength: 1, maxLength: 30 }).map(s => `/communities/${s}`),
          fc.string({ minLength: 1, maxLength: 30 }).map(s => `/agents/${s}`),
          fc.string({ minLength: 1, maxLength: 30 }).map(s => `/blog/${s}`)
        ),
        async (publicPath) => {
          const url = `https://example.com${publicPath}`
          const request = new NextRequest(url)

          const response = await middleware(request)

          // Should not be an auth redirect
          expect(response.status).not.toBe(307)
          expect(response.headers.get('location') ?? '').not.toContain('/admin/login')
        }
      ),
      { numRuns: 100 }
    )
  })

  // Test specific admin paths that should be protected
  it('protects specific admin paths', async () => {
    const protectedPaths = [
      '/admin',
      '/admin/',
      '/admin/leads',
      '/admin/properties',
      '/admin/communities',
      '/admin/agents',
      '/admin/blog',
      '/admin/settings'
    ]

    for (const path of protectedPaths) {
      const request = new NextRequest(`https://example.com${path}`)
      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('https://example.com/admin/login')
    }
  })

  // Test that login page is not redirected
  it('allows access to login page without session', async () => {
    const loginPaths = [
      '/admin/login',
      '/admin/login/',
      '/admin/login?redirect=/admin/leads'
    ]

    for (const path of loginPaths) {
      const request = new NextRequest(`https://example.com${path}`)
      const response = await middleware(request)

      // Should not redirect to login (would create infinite loop)
      expect(response.status).not.toBe(307)
      expect(response.headers.get('location') ?? '').not.toContain('/admin/login')
    }
  })
})

/**
 * Validates: Requirements 3.1, 3.2, 3.5
 *
 * 3.1: THE Sistema SHALL proteger todas las rutas `/admin/*` mediante autenticación con Supabase Auth.
 * 3.2: WHEN un Visitante intenta acceder a una ruta `/admin/*` sin sesión activa, THE Sistema SHALL redirigirlo a `/admin/login`.
 * 3.5: THE Sistema SHALL implementar protección de rutas mediante middleware de Next.js que verifique la sesión en cada solicitud a `/admin/*`.
 */
