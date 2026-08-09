import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'
import { getAllPublishedProperties } from '@/lib/data/properties'
import { getCommunities } from '@/lib/data/communities'
import { getAgents } from '@/lib/data/agents'
import { getAllPublishedPosts } from '@/lib/data/blog'

type Entry = MetadataRoute.Sitemap[number]

const STATIC: Array<{ en: string; es: string }> = [
  { en: '/', es: '/es' },
  { en: '/properties', es: '/es/properties' },
  { en: '/communities', es: '/es/communities' },
  { en: '/agents', es: '/es/agents' },
  { en: '/blog', es: '/es/blog' },
  { en: '/sell-with-us', es: '/es/sell-with-us' },
  { en: '/contact', es: '/es/contact' },
]

export function buildCanonicalUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  if (!path || path === '/') {
    return normalizedBase
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function alt(enPath: string, esPath: string) {
  return {
    languages: {
      en: buildCanonicalUrl(SITE_URL, enPath),
      es: buildCanonicalUrl(SITE_URL, esPath),
      'x-default': buildCanonicalUrl(SITE_URL, enPath),
    },
  }
}

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, communities, agents, posts] = await Promise.all([
    getAllPublishedProperties(),
    getCommunities(),
    getAgents(),
    getAllPublishedPosts(),
  ])

  const staticEntries: Entry[] = STATIC.map(({ en, es }) => ({
    url: buildCanonicalUrl(SITE_URL, en),
    lastModified: new Date(),
    alternates: alt(en, es),
  }))

  const propertyEntries: Entry[] = properties.map((p) => ({
    url: buildCanonicalUrl(SITE_URL, `/properties/${p.slug_en}`),
    lastModified: p.updated_at,
    alternates: alt(
      `/properties/${p.slug_en}`,
      `/es/properties/${p.slug_es}`,
    ),
  }))

  const communityEntries: Entry[] = communities.map((c) => ({
    url: buildCanonicalUrl(SITE_URL, `/communities/${c.slug}`),
    alternates: alt(
      `/communities/${c.slug}`,
      `/es/communities/${c.slug}`,
    ),
  }))

  const agentEntries: Entry[] = agents.map((a) => ({
    url: buildCanonicalUrl(SITE_URL, `/agents/${a.slug}`),
    alternates: alt(
      `/agents/${a.slug}`,
      `/es/agents/${a.slug}`,
    ),
  }))

  const postEntries: Entry[] = posts.map((p) => ({
    url: buildCanonicalUrl(SITE_URL, `/blog/${p.slug_en}`),
    lastModified: p.published_at ?? undefined,
    alternates: alt(
      `/blog/${p.slug_en}`,
      `/es/blog/${p.slug_es}`,
    ),
  }))

  return [
    ...staticEntries,
    ...propertyEntries,
    ...communityEntries,
    ...agentEntries,
    ...postEntries,
  ]
}
