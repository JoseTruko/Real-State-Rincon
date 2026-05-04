import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug } from '@/lib/data/blog'
import RichTextRenderer from '@/components/blog/RichTextRenderer'
import AgentCard from '@/components/agent/AgentCard'
import { localizedField, formatDate, readingTime } from '@/lib/utils/format'
import { SITE_NAME, SITE_URL } from '@/config/site'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 600

interface BlogPostDetailProps {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: BlogPostDetailProps): Promise<Metadata> {
  const locale = params.locale as Locale
  const post = await getBlogPostBySlug(params.slug, locale)
  if (!post) return { title: 'Post not found' }

  const title = localizedField(post, 'title', locale)
  return buildMetadata({
    title,
    description: post.meta_description ?? localizedField(post, 'excerpt', locale).slice(0, 160),
    image: post.cover_image_url || null,
    locale,
    enPath: `/blog/${post.slug_en}`,
    esPath: `/blog/${post.slug_es}`,
  })
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailProps) {
  const locale = params.locale as Locale
  const post = await getBlogPostBySlug(params.slug, locale)

  if (!post) notFound()

  const title = localizedField(post, 'title', locale)
  const content = localizedField(post, 'content', locale)
  const prefix = locale === 'es' ? '/es' : ''
  const minutes = readingTime(content)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href={prefix || '/'} className="hover:text-primary transition-colors">
          {locale === 'es' ? 'Inicio' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={`${prefix}/blog`} className="hover:text-primary transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-ink truncate max-w-[200px]">{title}</span>
      </nav>

      {/* Category */}
      {post.category && (
        <span className="text-xs font-medium text-primary uppercase tracking-wide">{post.category}</span>
      )}

      {/* Title */}
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink mt-2 mb-4 text-balance">{title}</h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-8">
        {post.published_at && (
          <span>{formatDate(post.published_at, locale)}</span>
        )}
        <span>{minutes} {locale === 'es' ? 'min de lectura' : 'min read'}</span>
        {post.author && (
          <span>
            {locale === 'es' ? 'Por' : 'By'}{' '}
            <Link href={`${prefix}/agents/${post.author.slug}`} className="text-primary hover:underline">
              {post.author.full_name}
            </Link>
          </span>
        )}
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8 bg-neutral-100">
          <Image
            src={post.cover_image_url}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <RichTextRenderer content={content} className="mb-10" />

      {/* Author card */}
      {post.author && (
        <div className="border-t border-neutral-200 pt-8">
          <p className="text-sm font-medium text-neutral-500 mb-3">
            {locale === 'es' ? 'Escrito por' : 'Written by'}
          </p>
          <AgentCard agent={post.author} locale={locale} />
        </div>
      )}
    </div>
  )
}
