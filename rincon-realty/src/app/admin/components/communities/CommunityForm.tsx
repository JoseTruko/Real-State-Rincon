'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createCommunity, updateCommunity } from '@/app/admin/actions/communities'
import { generateSlug } from '@/lib/utils/slug'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/app/admin/components/ImageUpload'
import type { Community } from '@/types'

interface CommunityFormProps {
  community?: Community
}

interface FormValues {
  name_en: string
  name_es: string
  description_en: string
  description_es: string
  lat: number
  lng: number
  active: boolean
  sort_order: number
  slug: string
}

export default function CommunityForm({ community }: CommunityFormProps) {
  const isEdit = !!community
  const [imageUrl, setImageUrl] = useState<string | null>(community?.image_url ?? null)
  const [serverError, setServerError] = useState('')

  const coords = community?.coordinates as any
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name_en: community?.name_en ?? '',
      name_es: community?.name_es ?? '',
      description_en: community?.description_en ?? '',
      description_es: community?.description_es ?? '',
      lat: coords?.lat ?? 10.5,
      lng: coords?.lng ?? -85.5,
      active: community?.active ?? true,
      sort_order: community?.sort_order ?? 0,
      slug: community?.slug ?? '',
    },
  })

  const nameEn = watch('name_en')

  useEffect(() => {
    if (nameEn && !isEdit) setValue('slug', generateSlug(nameEn))
  }, [nameEn]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: FormValues) {
    setServerError('')
    const formData = new FormData()
    Object.entries(values).forEach(([key, val]) => {
      if (val !== null && val !== undefined) formData.append(key, String(val))
    })
    if (imageUrl) formData.set('image_url', imageUrl)

    const result = isEdit
      ? await updateCommunity(community!.id, formData)
      : await createCommunity(formData)

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
        <h2 className="font-heading font-semibold text-ink">Información</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre EN *"
            {...register('name_en', { required: 'Requerido' })}
            error={errors.name_en?.message}
          />
          <Input
            label="Nombre ES *"
            {...register('name_es', { required: 'Requerido' })}
            error={errors.name_es?.message}
          />
          <Input label="Slug" {...register('slug')} placeholder={generateSlug(nameEn || 'slug')} />
          <Input label="Orden" type="number" {...register('sort_order', { valueAsNumber: true })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['description_en', 'description_es'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                {field === 'description_en' ? 'Descripción EN *' : 'Descripción ES *'}
              </label>
              <textarea
                rows={4}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register(field, { required: 'Requerido' })}
              />
              {errors[field] && <p className="text-xs text-red-600">{errors[field]?.message}</p>}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" {...register('active')} className="h-4 w-4 accent-primary" />
          <label htmlFor="active" className="text-sm font-medium text-ink">Activa</label>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Ubicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Latitud" type="number" step="any" {...register('lat', { valueAsNumber: true })} />
          <Input label="Longitud" type="number" step="any" {...register('lng', { valueAsNumber: true })} />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <ImageUpload
          bucket="community-images"
          onUpload={setImageUrl}
          currentUrl={imageUrl}
          label="Imagen de portada"
        />
      </section>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Crear comunidad'}
        </Button>
        <a href="/admin/communities">
          <Button type="button" variant="ghost">Cancelar</Button>
        </a>
      </div>
    </form>
  )
}
