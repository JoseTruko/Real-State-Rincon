'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { createBlogPost, updateBlogPost } from '@/app/admin/actions/blog'
import { generateSlug } from '@/lib/utils/slug'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/app/admin/components/ImageUpload'
import TiptapEditor from '@/app/admin/components/TiptapEditor'
import type { BlogPost, Agent } from '@/types'

interface BlogPostFormProps {
  post?: BlogPost
  agents: Pick<Agent, 'id' | 'full_name'>[]
}

interface FormValues {
  title_en: string
  title_es: string
  content_en: string
  content_es: string
  excerpt_en: string
  excerpt_es: string
  category: string
  author_id: string
  status: 'draft' | 'published'
  published_at: string
  meta_title: string
  meta_description: string
  slug_en: string
  slug_es: string
}

const CATEGORIES = [
  'Market Trends', 'Investment', 'Lifestyle', 'Community', 'Legal & Finance', 'Tips & Guides',
]

export default function BlogPostForm({ post, agents }: BlogPostFormProps) {
  const isEdit = !!post
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.cover_image_url ?? null)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title_en: post?.title_en ?? '',
      title_es: post?.title_es ?? '',
      content_en: post?.content_en ?? '',
      content_es: post?.content_es ?? '',
      excerpt_en: post?.excerpt_en ?? '',
      excerpt_es: post?.excerpt_es ?? '',
      category: post?.category ?? 'Market Trends',
      author_id: post?.author_id ?? '',
      status: post?.status ?? 'draft',
      published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
      meta_title: post?.meta_title ?? '',
      meta_description: post?.meta_description ?? '',
      slug_en: post?.slug_en ?? '',
      slug_es: post?.slug_es ?? '',
    },
  })

  const titleEn = watch('title_en')
  const titleEs = watch('title_es')

  useEffect(() => {
    if (titleEn && !isEdit) setValue('slug_en', generateSlug(titleEn))
  }, [titleEn]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (titleEs && !isEdit) setValue('slug_es', generateSlug(titleEs))
  }, [titleEs]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: FormValues) {
    setServerError('')
    const formData = new FormData()
    Object.entries(values).forEach(([key, val]) => {
      if (val !== null && val !== undefined) formData.append(key, String(val))
    })
    if (coverImageUrl) formData.set('cover_image_url', coverImageUrl)

    const result = isEdit
      ? await updateBlogPost(post!.id, formData)
      : await createBlogPost(formData)

    if (result?.error && '_form' in result.error) {
      setServerError(result.error._form?.[0] ?? 'Error desconocido')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Títulos y slugs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Título EN *"
            {...register('title_en', { required: 'Requerido' })}
            error={errors.title_en?.message}
          />
          <Input
            label="Título ES *"
            {...register('title_es', { required: 'Requerido' })}
            error={errors.title_es?.message}
          />
          <Input label="Slug EN" {...register('slug_en')} placeholder={generateSlug(titleEn || 'slug-en')} />
          <Input label="Slug ES" {...register('slug_es')} placeholder={generateSlug(titleEs || 'slug-es')} />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Extractos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['excerpt_en', 'excerpt_es'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                {field === 'excerpt_en' ? 'Extracto EN' : 'Extracto ES'}
              </label>
              <textarea
                rows={2}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register(field)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Contenido EN</h2>
        <Controller
          name="content_en"
          control={control}
          rules={{ required: 'Requerido' }}
          render={({ field }) => (
            <TiptapEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Write content in English..."
            />
          )}
        />
        {errors.content_en && <p className="text-xs text-red-600">{errors.content_en.message}</p>}
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Contenido ES</h2>
        <Controller
          name="content_es"
          control={control}
          rules={{ required: 'Requerido' }}
          render={({ field }) => (
            <TiptapEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Escribe el contenido en español..."
            />
          )}
        />
        {errors.content_es && <p className="text-xs text-red-600">{errors.content_es.message}</p>}
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Publicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Categoría *</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('category', { required: 'Requerido' })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Autor</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('author_id')}
            >
              <option value="">Sin autor</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Estado</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('status')}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <Input
            label="Fecha de publicación"
            type="datetime-local"
            {...register('published_at')}
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <ImageUpload
          bucket="blog-images"
          onUpload={setCoverImageUrl}
          currentUrl={coverImageUrl}
          label="Imagen de portada"
        />
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Meta título" {...register('meta_title')} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Meta descripción</label>
            <textarea
              rows={2}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('meta_description')}
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Crear artículo'}
        </Button>
        <a href="/admin/blog">
          <Button type="button" variant="ghost">Cancelar</Button>
        </a>
      </div>
    </form>
  )
}
