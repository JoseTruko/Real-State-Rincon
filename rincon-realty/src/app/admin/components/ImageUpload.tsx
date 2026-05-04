'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface ImageUploadProps {
  bucket: string
  folder?: string
  onUpload: (url: string) => void
  currentUrl?: string | null
  className?: string
  label?: string
}

export default function ImageUpload({
  bucket,
  folder = '',
  onUpload,
  currentUrl,
  className,
  label = 'Imagen',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar 10 MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const supabase = createBrowserClient()
      const ext = file.name.split('.').pop()
      const fileName = `${folder ? `${folder}/` : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      setPreviewUrl(data.publicUrl)
      onUpload(data.publicUrl)
    } catch (err: any) {
      setError(err.message ?? 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="text-sm font-medium text-ink">{label}</span>}

      {previewUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-neutral-200">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? 'Cambiar imagen' : 'Subir imagen'}
      </Button>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
