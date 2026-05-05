'use client'

import { useState, useTransition } from 'react'
import { updateLeadStatus, updateCommissionStatus } from '@/app/admin/actions/leads'
import type { Contact, ContactStatus, CommissionStatus } from '@/types'

interface LeadsTableProps {
  leads: Contact[]
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  closed: 'Cerrado',
}

const COMMISSION_LABELS: Record<CommissionStatus, string> = {
  none: 'Sin comisión',
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  paid: 'Pagada',
}

const SOURCE_LABELS: Record<string, string> = {
  form:         'Formulario',
  whatsapp:     'WhatsApp',
  email_reveal: 'Email reveal',
  seller:       'Vendedor',
}

const SOURCE_COLORS: Record<string, string> = {
  seller: 'bg-orange-100 text-orange-700',
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-green-100 text-green-700',
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(id: string, status: ContactStatus) {
    startTransition(async () => { await updateLeadStatus(id, status) })
  }

  function handleCommissionChange(id: string, commission: CommissionStatus) {
    startTransition(async () => { await updateCommissionStatus(id, commission) })
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">
        No hay leads que coincidan con los filtros aplicados.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {['Nombre', 'Email', 'Teléfono', 'Fuente', 'Propiedad', 'Agente', 'Estado', 'Comisión', 'Fecha'].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-medium text-neutral-600 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="bg-white hover:bg-neutral-50 transition-colors">
              <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{lead.name}</td>
              <td className="px-4 py-3 text-neutral-600">
                <a href={`mailto:${lead.email}`} className="hover:text-primary">{lead.email}</a>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="hover:text-primary">{lead.phone}</a>
                ) : '—'}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${SOURCE_COLORS[lead.source] ?? 'bg-neutral-100 text-neutral-600'}`}>
                  {SOURCE_LABELS[lead.source] ?? lead.source}
                </span>
              </td>
              <td className="px-4 py-3 text-neutral-600 max-w-[150px] truncate">
                {lead.property
                  ? <a href={`/admin/properties/${lead.property_id}`} className="hover:text-primary">{lead.property.title_en}</a>
                  : '—'}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {lead.agent?.full_name ?? '—'}
              </td>
              <td className="px-4 py-3">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as ContactStatus)}
                  disabled={isPending}
                  className={`text-xs rounded-full px-2 py-1 font-medium border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[lead.status]}`}
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <select
                  value={lead.commission_status}
                  onChange={(e) => handleCommissionChange(lead.id, e.target.value as CommissionStatus)}
                  disabled={isPending}
                  className="text-xs rounded border border-neutral-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {Object.entries(COMMISSION_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap text-xs">
                {new Date(lead.created_at).toLocaleDateString('es-CR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
