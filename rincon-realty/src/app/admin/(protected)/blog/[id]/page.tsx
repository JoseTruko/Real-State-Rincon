import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import BlogPostForm from '@/app/admin/components/blog/BlogPostForm'
import type { BlogPost } from '@/types'

interface Props {
  params: { id: string }
}

export default async function EditBlogPostPage({ params }: Props) {
  const supabase = await createServerClient()

  const [{ data: post }, { data: agents }] = await Promise.all([
    supabase.from('blog_posts').select('*').eq('id', params.id).single(),
    supabase.from('agents').select('id, full_name').eq('active', true).order('full_name'),
  ])

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar artículo</h1>
        <p className="text-sm text-neutral-500 mt-1">{post.title_en}</p>
      </div>
      <BlogPostForm post={post as unknown as BlogPost} agents={agents ?? []} />
    </div>
  )
}
