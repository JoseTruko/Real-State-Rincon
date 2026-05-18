'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createAgent, updateAgent } from '@/app/admin/actions/agents'
import { generateSlug } from '@/lib/utils/slug'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/app/admin/components/ImageUpload'
import type { Agent } from '@/types'

interface AgentFormProps {
  agent?: Agent
}

interface FormValues {
  full_name: string
  title_en: string
  title_es: string
  bio_en: string
  bio_es: string
  email: string
  phone: string
  whatsapp: string
  years_experience: number
  linkedin_url: string
  active: boolean
  slug: string
}

const LANGUAGES_OPTIONS = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese']

export default function AgentForm({ agent }: AgentFormProps) {
  const isEdit = !!agent
  const router = useRouter()
  const [photoUrl, setPhotoUrl] = useState<string | null>(agent?.photo_url ?? null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(agent?.languages ?? ['English'])
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      full_name: agent?.full_name ?? '',
      title_en: agent?.title_en ?? '',
      title_es: agent?.title_es ?? '',
      bio_en: agent?.bio_en ?? '',
      bio_es: agent?.bio_es ?? '',
      email: agent?.email ?? '',
      phone: agent?.phone ?? '',
      whatsapp: agent?.whatsapp ?? '',
      years_experience: agent?.years_experience ?? 0,
      linkedin_url: agent?.linkedin_url ?? '',
      active: agent?.active ?? true,
      slug: agent?.slug ?? '',
    },
  })

  const fullName = watch('full_name')

  useEffect(() => {
    if (fullName && !isEdit) setValue('slug', generateSlug(fullName))
  }, [fullName]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleLanguage(lang: string) {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  async function onSubmit(values: FormValues) {
    setServerError('')
    const formData = new FormData()
    Object.entries(values).forEach(([key, val]) => {
      if (val !== null && val !== undefined) formData.append(key, String(val))
    })
    if (photoUrl) formData.set('photo_url', photoUrl)
    selectedLanguages.forEach((lang) => formData.append('languages', lang))

    const result = isEdit
      ? await updateAgent(agent!.id, formData)
      : await createAgent(formData)

    if (result?.error) {
      if ('_form' in result.error) {
        setServerError(result.error._form?.[0] ?? 'Error desconocido')
      } else {
        const firstError = Object.values(result.error).flat()[0]
        setServerError(firstError ?? 'Por favor revisa los campos del formulario')
      }
      return
    }

    router.push('/admin/agents')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Información personal</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <ImageUpload
            bucket="agent-photos"
            onUpload={setPhotoUrl}
            currentUrl={photoUrl}
            label="Foto"
            className="sm:w-40 sm:shrink-0"
          />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre completo *"
              {...register('full_name', { required: 'Requerido' })}
              error={errors.full_name?.message}
            />
            <Input label="Slug" {...register('slug')} placeholder={generateSlug(fullName || 'slug')} />
            <Input
              label="Email *"
              type="email"
              {...register('email', { required: 'Requerido' })}
              error={errors.email?.message}
            />
            <Input
              label="Teléfono *"
              {...register('phone', { required: 'Requerido' })}
              error={errors.phone?.message}
            />
            <Input
              label="WhatsApp *"
              {...register('whatsapp', { required: 'Requerido' })}
              error={errors.whatsapp?.message}
            />
            <Input
              label="Años de experiencia"
              type="number"
              {...register('years_experience', { valueAsNumber: true })}
            />
            <Input label="LinkedIn URL" {...register('linkedin_url')} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" {...register('active')} className="h-4 w-4 accent-primary" />
          <label htmlFor="active" className="text-sm font-medium text-ink">Activo</label>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Título y bio</h2>
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
          {(['bio_en', 'bio_es'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">
                {field === 'bio_en' ? 'Bio EN *' : 'Bio ES *'}
              </label>
              <textarea
                rows={5}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register(field, { required: 'Requerido' })}
              />
              {errors[field] && <p className="text-xs text-red-600">{errors[field]?.message}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
        <h2 className="font-heading font-semibold text-ink">Idiomas</h2>
        <div className="flex flex-wrap gap-3">
          {LANGUAGES_OPTIONS.map((lang) => (
            <label key={lang} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                className="h-4 w-4 accent-primary"
              />
              {lang}
            </label>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Crear agente'}
        </Button>
        <a href="/admin/agents">
          <Button type="button" variant="ghost">Cancelar</Button>
        </a>
      </div>
    </form>
  )
}
