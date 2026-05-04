/**
 * Mock de Supabase para desarrollo sin base de datos real.
 * Soporta encadenamiento completo de métodos y retorna datos vacíos.
 */

function createQueryBuilder(): any {
  const builder: any = {
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    in: () => builder,
    contains: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => Promise.resolve({ data: [], count: 0, error: null }).then(resolve),
  }
  return builder
}

export function createDevMock() {
  return {
    from: () => ({
      ...createQueryBuilder(),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => createQueryBuilder(),
      delete: () => createQueryBuilder(),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  }
}
