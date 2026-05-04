import { createServerClient } from '@/lib/supabase/server'
import LeadsTable from '@/app/admin/components/leads/LeadsTable'
import LeadsExport from '@/app/admin/components/leads/LeadsExport'
import LeadsFilters from '@/app/admin/components/leads/LeadsFilters'
import type { Contact, ContactStatus } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: {
    status?: ContactStatus
    source?: string
    agent_id?: string
    date_from?: string
    date_to?: string
  }
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const supabase = await createServerClient()

  let query = supabase
    .from('contacts')
    .select(`
      *,
      property:properties(id, title_en, slug_en),
      agent:agents(id, full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.source) query = query.eq('source', searchParams.source)
  if (searchParams.agent_id) query = query.eq('agent_id', searchParams.agent_id)
  if (searchParams.date_from) query = query.gte('created_at', searchParams.date_from)
  if (searchParams.date_to) query = query.lte('created_at', `${searchParams.date_to}T23:59:59`)

  const { data: leads } = await query
  const { data: agents } = await supabase.from('agents').select('id, full_name').eq('active', true).order('full_name')

  const rows = (leads ?? []) as Contact[]

  // Métricas
  const { data: allLeads } = await supabase.from('contacts').select('status')
  const total = allLeads?.length ?? 0
  const newCount = allLeads?.filter((l: { status: string }) => l.status === 'new').length ?? 0
  const contactedCount = allLeads?.filter((l: { status: string }) => l.status === 'contacted').length ?? 0
  const closedCount = allLeads?.filter((l: { status: string }) => l.status === 'closed').length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Leads</h1>
          <p className="text-sm text-neutral-500 mt-1">{rows.length} leads con filtros actuales</p>
        </div>
        <LeadsExport leads={rows} />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total, color: 'text-ink' },
          { label: 'Nuevos', value: newCount, color: 'text-blue-600' },
          { label: 'Contactados', value: contactedCount, color: 'text-yellow-600' },
          { label: 'Cerrados', value: closedCount, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <LeadsFilters
        agents={agents ?? []}
        currentFilters={searchParams}
      />

      {/* Tabla */}
      <LeadsTable leads={rows} />
    </div>
  )
}
