import { describe, expect, it } from 'vitest'
import { buildCanonicalUrl } from '../sitemap'

describe('buildCanonicalUrl', () => {
  it('joins the site base and path without double slashes', () => {
    expect(buildCanonicalUrl('https://example.com/', '/properties')).toBe('https://example.com/properties')
    expect(buildCanonicalUrl('https://example.com', 'properties')).toBe('https://example.com/properties')
  })

  it('keeps the home path as the site root', () => {
    expect(buildCanonicalUrl('https://example.com/', '/')).toBe('https://example.com')
  })
})
