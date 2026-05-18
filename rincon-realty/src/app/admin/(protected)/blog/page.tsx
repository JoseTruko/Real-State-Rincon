import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import { deleteBlogPost } from '@/app/admin/actions/blog'
import DeleteButton from '@/app/admin/components/DeleteButton'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const supabase = await createServerClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title_en, category, status, published_at, cover_image_url, author:agents(full_name)')
    .order('created_at', { ascending: false })

  type PostRow = { id: string; title_en: string; category: string; status: string; published_at: string | null; cover_image_url: string | null; author: { full_name: string } | null }
  const rows = (posts ?? []) as PostRow[]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Blog</h1>
          <p className="text-sm text-neutral-500 mt-1">{rows.length} artículos en total</p>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="primary">+ Nuevo artículo</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 bg-white rounded-xl border border-neutral-200">
          No hay artículos aún. <Link href="/admin/blog/new" className="text-primary underline">Crear el primero</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Imagen', 'Título', 'Categoría', 'Autor', 'Estado', 'Publicado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-neutral-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {rows.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    {post.cover_image_url ? (
                      <div className="relative w-16 h-10 rounded overflow-hidden">
                        <Image src={post.cover_image_url} alt={post.title_en} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">Sin img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink max-w-[200px] truncate">{post.title_en}</td>
                  <td className="px-4 py-3 text-neutral-600 text-xs">{post.category}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {(post.author as any)?.full_name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('es-CR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </Link>
                      <DeleteButton onDelete={deleteBlogPost.bind(null, post.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
