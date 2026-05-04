import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/data/blog'
import { localizedField, formatDate } from '@/lib/utils/format'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Locale } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 600

interface BlogPageProps {
  params: { locale: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const locale = params.locale as Locale
  return buildMetadata({
    title: locale === 'es' ? 'Blog — Bienes Raíces en Costa Rica' : 'Blog — Costa Rica Real Estate',
    description: locale === 'es'
      ? 'Artículos sobre el mercado inmobiliario en Guanacaste, Costa Rica.'
      : 'Articles about the real estate market in Guanacaste, Costa Rica.',
    locale,
    enPath: '/blog',
  })
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const locale = params.locale as Locale
  const page = searchParams.page ? Number(searchParams.page) : 1
  const { posts, total } = await getBlogPosts(page, 9)
  const totalPages = Math.ceil(total / 9)
  const prefix = locale === 'es' ? '/es' : ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Blog</h1>
      <p className="text-neutral-500 mb-8">
        {locale === 'es'
          ? 'Noticias y consejos sobre el mercado inmobiliario en Costa Rica.'
          : 'News and tips about the real estate market in Costa Rica.'}
      </p>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const title = localizedField(post, 'title', locale)
              const excerpt = localizedField(post, 'excerpt', locale)
              const slug = locale === 'es' ? post.slug_es : post.slug_en

              return (
                <Link
                  key={post.id}
                  href={`${prefix}/blog/${slug}`}
                  className="group block bg-surface border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {post.cover_image_url && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                      <Image
                        src={post.cover_image_url}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {post.category}
                      </span>
                    )}
                    <h2 className="font-heading font-semibold text-ink mt-1 mb-2 line-clamp-2">{title}</h2>
                    {excerpt && (
                      <p className="text-sm text-neutral-500 line-clamp-3">{excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      {post.published_at && (
                        <p className="text-xs text-neutral-400">{formatDate(post.published_at, locale)}</p>
                      )}
                      <span className="text-sm text-primary font-medium">
                        {locale === 'es' ? 'Leer más →' : 'Read more →'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`${prefix}/blog?page=${page - 1}`}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm hover:bg-neutral transition-colors"
                >
                  {locale === 'es' ? 'Anterior' : 'Previous'}
                </Link>
              )}
              <span className="text-sm text-neutral-500">{page} / {totalPages}</span>
              {page < totalPages && (
                <Link
                  href={`${prefix}/blog?page=${page + 1}`}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm hover:bg-neutral transition-colors"
                >
                  {locale === 'es' ? 'Siguiente' : 'Next'}
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-neutral-500">
          {locale === 'es' ? 'No hay artículos publicados aún.' : 'No articles published yet.'}
        </p>
      )}
    </div>
  )
}
