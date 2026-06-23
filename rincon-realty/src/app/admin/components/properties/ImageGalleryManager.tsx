'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GripVertical, X, Check, AlertCircle } from 'lucide-react'
import { updatePropertyImageSortOrder } from '@/app/admin/actions/properties'
import type { PropertyImage } from '@/types'

interface ImageGalleryManagerProps {
  images: PropertyImage[]
  onDeleteImage: (image: PropertyImage) => void
  onSortOrderChanged: (images: PropertyImage[]) => void
  propertyId: string
}

export default function ImageGalleryManager({
  images,
  onDeleteImage,
  onSortOrderChanged,
  propertyId,
}: ImageGalleryManagerProps) {
  const [sortedImages, setSortedImages] = useState<PropertyImage[]>(
    [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  )
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary', 'ring-offset-2')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove('ring-2', 'ring-primary', 'ring-offset-2')

    if (!draggedId || draggedId === targetId) return

    const draggedIndex = sortedImages.findIndex((img) => img.id === draggedId)
    const targetIndex = sortedImages.findIndex((img) => img.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newImages = [...sortedImages]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)

    setSortedImages(newImages)
    setDraggedId(null)
    setSaveMessage('')
  }

  const handleSaveOrder = async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const imageIds = sortedImages.map((img) => img.id)
      const result = await updatePropertyImageSortOrder(propertyId, imageIds)

      if (result.success) {
        setSaveMessage('Orden guardado exitosamente')
        onSortOrderChanged(sortedImages)
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (error) {
      setSaveMessage('Error al guardar el orden')
      console.error('Error saving image order:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAndReorder = (image: PropertyImage) => {
    setSortedImages((prev) => prev.filter((img) => img.id !== image.id))
    onDeleteImage(image)
    setSaveMessage('')
  }

  const hasChanges =
    sortedImages.length !== images.length ||
    sortedImages.some(
      (img, idx) => img.id !== images[idx]?.id
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-ink">Orden de las imágenes</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Arrastra para reordenar las fotos. El nuevo orden se aplicará de izquierda a derecha y de arriba a abajo.
          </p>
        </div>
        {saveMessage && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              saveMessage.includes('Error')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {saveMessage.includes('Error') ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {saveMessage}
          </div>
        )}
      </div>

      {sortedImages.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
          <p className="text-neutral-500">No hay imágenes</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {sortedImages.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(img.id)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, img.id)}
                className="group relative cursor-move transition-all duration-200 rounded-lg"
              >
                {/* Image container */}
                <div className="relative h-32 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  <Image
                    src={img.url}
                    alt={img.alt_text || `Foto ${index + 1}`}
                    fill
                    className="object-cover group-hover:brightness-75 transition-all"
                  />

                  {/* Drag indicator */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <GripVertical className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteAndReorder(img)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Order number */}
                <div className="mt-2 text-center">
                  <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasChanges && (
            <button
              type="button"
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-neutral-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando orden...' : 'Guardar nuevo orden'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
