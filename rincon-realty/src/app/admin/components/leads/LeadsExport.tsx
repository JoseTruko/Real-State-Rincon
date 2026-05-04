'use client'

import Button from '@/components/ui/Button'
import type { Contact } from '@/types'

interface LeadsExportProps {
  leads: Contact[]
}

const HEADERS = ['Nombre', 'Email', 'Teléfono', 'Fuente', 'Propiedad', 'Agente', 'Estado', 'Comisión', 'Mensaje', 'Fecha']

const SOURCE_LABELS: Record<string, string> = {
  form: 'Formulario',
  whatsapp: 'WhatsApp',
  email_reveal: 'Email reveal',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  closed: 'Cerrado',
}

const COMMISSION_LABELS: Record<string, string> = {
  none: 'Sin comisión',
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  paid: 'Pagada',
}

function escapeCsv(value: string | null | undefined): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export default function LeadsExport({ leads }: LeadsExportProps) {
  function handleExport() {
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone ?? '',
      SOURCE_LABELS[lead.source] ?? lead.source,
      (lead.property as any)?.title_en ?? '',
      (lead.agent as any)?.full_name ?? '',
      STATUS_LABELS[lead.status] ?? lead.status,
      COMMISSION_LABELS[lead.commission_status] ?? lead.commission_status,
      lead.message,
      new Date(lead.created_at).toLocaleDateString('es-CR'),
    ])

    const csvContent = [HEADERS, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n')

    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} disabled={leads.length === 0}>
      Exportar CSV ({leads.length})
    </Button>
  )
}
