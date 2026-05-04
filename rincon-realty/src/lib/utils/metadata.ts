import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { SITE_NAME, SITE_URL } from '@/config/site'

interface BuildMetadataOptions {
  title: string
  description: string
  image?: string | null
  locale: Locale
  /** Path without locale prefix, e.g. '/properties/ocean-villa'. Use '' for home. */
  enPath: string
  /** ES path when it differs from enPath (bilingual slugs like property/blog pages). */
  esPath?: string
  /** Pass true for the home page where the title IS the site name. */
  noSuffix?: boolean
}

export function buildMetadata({
  title,
  description,
  image,
  locale,
  enPath,
  esPath,
  noSuffix,
}: BuildMetadataOptions): Metadata {
  // The root layout already applies template '%s | SITE_NAME'.
  // For the home page (noSuffix) we use absolute to prevent 'Rincón Realty | Rincón Realty'.
  const titleField: Metadata['title'] = noSuffix ? { absolute: title } : title

  const enUrl    = `${SITE_URL}${enPath}`
  const esUrl    = `${SITE_URL}/es${esPath ?? enPath}`
  const canonical = locale === 'es' ? esUrl : enUrl

  const ogImages = image ? [{ url: image, width: 1200, height: 630, alt: title }] : []

  return {
    title: titleField,
    description,
    alternates: {
      canonical,
      languages: {
        en:          enUrl,
        es:          esUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'website',
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}
