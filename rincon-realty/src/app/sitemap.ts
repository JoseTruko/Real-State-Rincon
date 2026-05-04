import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'
import { getAllPublishedProperties } from '@/lib/data/properties'
import { getCommunities } from '@/lib/data/communities'
import { getAgents } from '@/lib/data/agents'
import { getAllPublishedPosts } from '@/lib/data/blog'

type Entry = MetadataRoute.Sitemap[number]

const STATIC: Array<{ en: string; es: string }> = [
  { en: '',               es: ''               },
  { en: '/properties',    es: '/properties'    },
  { en: '/communities',   es: '/communities'   },
  { en: '/agents',        es: '/agents'        },
  { en: '/blog',          es: '/blog'          },
  { en: '/sell-with-us',  es: '/sell-with-us'  },
  { en: '/contact',       es: '/contact'       },
]

function alt(enUrl: string, esUrl: string) {
  return { languages: { en: enUrl, es: esUrl, 'x-default': enUrl } }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, communities, agents, posts] = await Promise.all([
    getAllPublishedProperties(),
    getCommunities(),
    getAgents(),
    getAllPublishedPosts(),
  ])

  const staticEntries: Entry[] = STATIC.map(({ en, es }) => ({
    url:        `${SITE_URL}${en}`,
    alternates: alt(`${SITE_URL}${en}`, `${SITE_URL}/es${es}`),
  }))

  const propertyEntries: Entry[] = properties.map((p) => ({
    url:          `${SITE_URL}/properties/${p.slug_en}`,
    lastModified: p.updated_at,
    alternates:   alt(
      `${SITE_URL}/properties/${p.slug_en}`,
      `${SITE_URL}/es/properties/${p.slug_es}`,
    ),
  }))

  const communityEntries: Entry[] = communities.map((c) => ({
    url:        `${SITE_URL}/communities/${c.slug}`,
    alternates: alt(
      `${SITE_URL}/communities/${c.slug}`,
      `${SITE_URL}/es/communities/${c.slug}`,
    ),
  }))

  const agentEntries: Entry[] = agents.map((a) => ({
    url:        `${SITE_URL}/agents/${a.slug}`,
    alternates: alt(
      `${SITE_URL}/agents/${a.slug}`,
      `${SITE_URL}/es/agents/${a.slug}`,
    ),
  }))

  const postEntries: Entry[] = posts.map((p) => ({
    url:          `${SITE_URL}/blog/${p.slug_en}`,
    lastModified: p.published_at ?? undefined,
    alternates:   alt(
      `${SITE_URL}/blog/${p.slug_en}`,
      `${SITE_URL}/es/blog/${p.slug_es}`,
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
