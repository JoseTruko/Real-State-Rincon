'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import { createProperty, updateProperty, addPropertyImage, deletePropertyImage } from '@/app/admin/actions/properties'
import { generateSlug } from '@/lib/utils/slug'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/app/admin/components/ImageUpload'
import MapPickerWrapper from '@/components/map/MapPickerWrapper'
import TiptapEditor from '@/app/admin/components/TiptapEditor'
import type { Property, Community, Agent, PropertyImage } from '@/types'

interface PropertyFormProps {
  property?: Property
  communities: Pick<Community, 'id' | 'name_en'>[]
  agents: Pick<Agent, 'id' | 'full_name'>[]
}

const AMENITIES = [
  { key: 'pool', label: 'Piscina' },
  { key: 'gym', label: 'Gimnasio' },
  { key: 'garage', label: 'Garage' },
  { key: 'security', label: 'Seguridad' },
  { key: 'ocean_view', label: 'Vista al mar' },
  { key: 'mountain_view', label: 'Vista a la montaña' },
  { key: 'furnished', label: 'Amueblado' },
  { key: 'air_conditioning', label: 'Aire acondicionado' },
  { key: 'garden', label: 'Jardín' },
  { key: 'terrace', label: 'Terraza' },
  { key: 'solar_panels', label: 'Paneles solares' },
  { key: 'well_water', label: 'Agua de pozo' },
  { key: 'gated_community', label: 'Condominio cerrado' },
]

interface FormValues {
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  type: 'house' | 'land' | 'farm'
  price_usd: number
  area_m2: number
  bedrooms: number | null
  bathrooms: number | null
  construction_m2: number | null
  year_built: number | null
  legal_status: string
  hoa_fees: number | null
  lat: number
  lng: number
  community_id: string
  agent_id: string
  status: 'draft' | 'published'
  featured: boolean
  slug_en: string
  slug_es: string
  meta_title_en: string
  meta_title_es: string
  meta_description_en: string
  meta_description_es: string
}

export default function PropertyForm({ property, communities, agents }: PropertyFormProps) {
  const isEdit = !!property
  const [serverError, setServerError] = useState('')
  const [images, setImages] = useState<PropertyImage[]>(property?.images ?? [])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [amenities, setAmenities] = useState<Record<string, boolean>>(
    AMENITIES.reduce((acc, { key }) => {
      acc[key] = (property?.amenities as any)?.[key] === true
      return acc
    }, {} as Record<string, boolean>)
  )

  const coords = property?.coordinates as any
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title_en: property?.title_en ?? '',
      title_es: property?.title_es ?? '',
      description_en: property?.description_en ?? '',
      description_es: property?.description_es ?? '',
      type: property?.type ?? 'house',
      price_usd: property?.price_usd ?? 0,
      area_m2: property?.area_m2 ?? 0,
      bedrooms: property?.bedrooms ?? null,
      bathrooms: property?.bathrooms ?? null,
      construction_m2: property?.construction_m2 ?? null,
      year_built: property?.year_built ?? null,
      legal_status: property?.legal_status ?? '',
      hoa_fees: property?.hoa_fees ?? null,
      lat: coords?.lat ?? 10.5,
      lng: coords?.lng ?? -85.5,
      community_id: property?.community_id ?? '',
      agent_id: property?.agent_id ?? '',
      status: property?.status ?? 'draft',
      featured: property?.featured ?? false,
      slug_en: property?.slug_en ?? '',
      slug_es: property?.slug_es ?? '',
      meta_title_en: property?.meta_title_en ?? '',
      meta_title_es: property?.meta_title_es ?? '',
      meta_description_en: property?.meta_description_en ?? '',
      meta_description_es: property?.meta_description_es ?? '',
    },
  })

  const titleEn = watch('title_en')
  const titleEs = watch('title_es')
  const slugEn = watch('slug_en')
  const slugEs = watch('slug_es')

  // Auto-generate slugs when titles change (only if slug not manually set)
  useEffect(() => {
    if (titleEn && !isEdit) setValue('slug_en', generateSlug(titleEn))
  }, [titleEn]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (titleEs && !isEdit) setValue('slug_es', generateSlug(titleEs))
  }, [titleEs]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: FormValues) {
    setServerError('')
    const formData = new FormData()

    // Append all scalar fields
    Object.entries(values).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        formData.append(key, String(val))
      }
    })

    // Append amenities from state
    AMENITIES.forEach(({ key }) => {
      if (amenities[key]) formData.append(`amenity_${key}`, 'on')
    })

    const result = isEdit
      ? await updateProperty(property!.id, formData)
      : await createProperty(formData)

    if (result?.error && '_form' in result.error) {
      setServerError(result.error._form?.[0] ?? 'Error desconocido')
    }
  }

  async function handleNewImage(url: string) {
    if (!property?.id) return
    setUploadingImage(true)
    const result = await addPropertyImage(property.id, url, property.title_en, images.length)
    if (!result.error) {
      setImages((prev) => [
        ...prev,
        { id: Date.now().toString(), property_id: property.id, url, alt_text: '', sort_order: prev.length, created_at: '' },
      ])
    }
    setUploadingImage(false)
  }

  async function handleDeleteImage(image: PropertyImage) {
    await deletePropertyImage(image.id, image.url)
    setImages((prev) => prev.filter((img) => img.id !== image.id))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Títulos */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Títulos</h2>
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
          <Input
            label="Slug EN"
            {...register('slug_en')}
            placeholder={generateSlug(titleEn || 'slug-en')}
          />
          <Input
            label="Slug ES"
            {...register('slug_es')}
            placeholder={generateSlug(titleEs || 'slug-es')}
          />
        </div>
      </section>

      {/* Descripciones */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Descripciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['description_en', 'description_es'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                {field === 'description_en' ? 'Descripción EN *' : 'Descripción ES *'}
              </label>
              <Controller
                name={field}
                control={control}
                rules={{ required: 'Requerido' }}
                render={({ field: f }) => (
                  <TiptapEditor
                    value={f.value}
                    onChange={f.onChange}
                    placeholder={field === 'description_en' ? 'Property description in English…' : 'Descripción de la propiedad en español…'}
                  />
                )}
              />
              {errors[field] && (
                <p className="text-xs text-red-600">{errors[field]?.message}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Detalles */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Detalles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Tipo *</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('type', { required: 'Requerido' })}
            >
              <option value="house">Casa</option>
              <option value="land">Terreno</option>
              <option value="farm">Finca</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Estado *</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('status')}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <Input
            label="Precio USD *"
            type="number"
            {...register('price_usd', { required: 'Requerido', valueAsNumber: true })}
            error={errors.price_usd?.message}
          />
          <Input
            label="Área m² *"
            type="number"
            {...register('area_m2', { required: 'Requerido', valueAsNumber: true })}
            error={errors.area_m2?.message}
          />
          <Input
            label="Construcción m²"
            type="number"
            {...register('construction_m2', { valueAsNumber: true })}
          />
          <Input label="Habitaciones" type="number" {...register('bedrooms', { valueAsNumber: true })} />
          <Input label="Baños" type="number" step="0.5" {...register('bathrooms', { valueAsNumber: true })} />
          <Input label="Año de construcción" type="number" {...register('year_built', { valueAsNumber: true })} />
          <Input label="Estado legal" {...register('legal_status')} />
          <Input label="HOA fees USD/mes" type="number" {...register('hoa_fees', { valueAsNumber: true })} />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="featured" {...register('featured')} className="h-4 w-4 accent-primary" />
          <label htmlFor="featured" className="text-sm font-medium text-ink">Destacada</label>
        </div>
      </section>

      {/* Ubicación */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Ubicación</h2>
        <MapPickerWrapper
          lat={watch('lat')}
          lng={watch('lng')}
          onChange={(lat, lng) => {
            setValue('lat', lat, { shouldDirty: true })
            setValue('lng', lng, { shouldDirty: true })
          }}
        />
      </section>

      {/* Comunidad y Agente */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Relaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Comunidad</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('community_id')}
            >
              <option value="">Sin comunidad</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name_en}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Agente</label>
            <select
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('agent_id')}
            >
              <option value="">Sin agente</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Amenidades */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Amenidades</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AMENITIES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={amenities[key] ?? false}
                onChange={(e) => setAmenities((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Meta título EN" {...register('meta_title_en')} />
          <Input label="Meta título ES" {...register('meta_title_es')} />
          {(['meta_description_en', 'meta_description_es'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                {field === 'meta_description_en' ? 'Meta descripción EN' : 'Meta descripción ES'}
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

      {/* Imágenes (solo en edición) */}
      {isEdit && (
        <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-heading font-semibold text-ink">Imágenes</h2>

          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="relative h-28 rounded-lg overflow-hidden border border-neutral-200">
                    <Image src={img.url} alt={img.alt_text} fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <ImageUpload
            bucket="property-images"
            folder={property?.id}
            onUpload={handleNewImage}
            label="Agregar imagen"
          />
          {uploadingImage && <p className="text-sm text-neutral-500">Guardando...</p>}
        </section>
      )}

      {!isEdit && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
          Las imágenes se pueden agregar después de crear la propiedad.
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Crear propiedad'}
        </Button>
        <a href="/admin/properties">
          <Button type="button" variant="ghost">Cancelar</Button>
        </a>
      </div>
    </form>
  )
}
