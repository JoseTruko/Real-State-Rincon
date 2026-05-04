'use client'

import { useState } from 'react'
import { updateSiteConfig } from '@/app/admin/actions/settings'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface SettingsFormProps {
  config: Record<string, string>
}

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: 'site_name', label: 'Nombre del sitio' },
  { key: 'contact_email', label: 'Email de contacto', type: 'email' },
  { key: 'contact_phone', label: 'Teléfono de contacto' },
  { key: 'whatsapp_number', label: 'Número WhatsApp' },
  { key: 'facebook_url', label: 'URL de Facebook', type: 'url' },
  { key: 'instagram_url', label: 'URL de Instagram', type: 'url' },
  { key: 'canonical_url', label: 'URL canónica', type: 'url' },
]

const TEXT_AREAS: { key: string; label: string }[] = [
  { key: 'site_description_en', label: 'Descripción del sitio EN' },
  { key: 'site_description_es', label: 'Descripción del sitio ES' },
  { key: 'meta_description_en', label: 'Meta descripción global EN' },
  { key: 'meta_description_es', label: 'Meta descripción global ES' },
]

export default function SettingsForm({ config }: SettingsFormProps) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await updateSiteConfig(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          Configuración guardada correctamente.
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Información general</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, type }) => (
            <Input
              key={key}
              label={label}
              name={key}
              type={type ?? 'text'}
              defaultValue={config[key] ?? ''}
            />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading font-semibold text-ink">Descripciones y SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEXT_AREAS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">{label}</label>
              <textarea
                name={key}
                rows={3}
                defaultValue={config[key] ?? ''}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </section>

      <Button type="submit" variant="primary" loading={loading}>
        Guardar cambios
      </Button>
    </form>
  )
}
