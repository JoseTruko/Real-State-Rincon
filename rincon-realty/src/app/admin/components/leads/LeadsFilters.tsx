'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { Agent } from '@/types'

interface LeadsFiltersProps {
  agents: Pick<Agent, 'id' | 'full_name'>[]
  currentFilters: {
    status?: string
    source?: string
    agent_id?: string
    date_from?: string
    date_to?: string
  }
}

export default function LeadsFilters({ agents, currentFilters }: LeadsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/admin/leads?${params.toString()}`)
    },
    [router, searchParams],
  )

  function clearFilters() {
    router.push('/admin/leads')
  }

  const hasFilters = Object.values(currentFilters).some(Boolean)

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Estado</label>
          <select
            value={currentFilters.status ?? ''}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="text-sm rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos</option>
            <option value="new">Nuevo</option>
            <option value="contacted">Contactado</option>
            <option value="closed">Cerrado</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Fuente</label>
          <select
            value={currentFilters.source ?? ''}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="text-sm rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas</option>
            <option value="seller">Vendedor</option>
            <option value="form">Formulario</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email_reveal">Email reveal</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Agente</label>
          <select
            value={currentFilters.agent_id ?? ''}
            onChange={(e) => updateFilter('agent_id', e.target.value)}
            className="text-sm rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Desde</label>
          <input
            type="date"
            value={currentFilters.date_from ?? ''}
            onChange={(e) => updateFilter('date_from', e.target.value)}
            className="text-sm rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Hasta</label>
          <input
            type="date"
            value={currentFilters.date_to ?? ''}
            onChange={(e) => updateFilter('date_to', e.target.value)}
            className="text-sm rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-500 hover:text-red-600 transition-colors py-2"
          >
            Limpiar filtros ✕
          </button>
        )}
      </div>
    </div>
  )
}
