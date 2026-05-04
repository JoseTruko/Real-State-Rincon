import { createServerClient } from '@/lib/supabase/server'
import BlogPostForm from '@/app/admin/components/blog/BlogPostForm'

export default async function NewBlogPostPage() {
  const supabase = await createServerClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('id, full_name')
    .eq('active', true)
    .order('full_name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nuevo artículo</h1>
        <p className="text-sm text-neutral-500 mt-1">Completa los campos para crear un nuevo artículo de blog.</p>
      </div>
      <BlogPostForm agents={agents ?? []} />
    </div>
  )
}
