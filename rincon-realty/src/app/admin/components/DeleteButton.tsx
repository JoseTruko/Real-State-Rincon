'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface DeleteButtonProps {
  onDelete: () => Promise<{ error?: string } | void>
  label?: string
}

export default function DeleteButton({ onDelete, label = 'Eliminar' }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setLoading(true)
    setError('')
    const result = await onDelete()
    if (result && 'error' in result && result.error) {
      setError(result.error)
      setLoading(false)
    }
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">¿Confirmar?</span>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={loading}>
          No
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDelete}
          loading={loading}
        >
          Sí
        </Button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={() => setConfirming(true)}
    >
      {label}
    </Button>
  )
}
