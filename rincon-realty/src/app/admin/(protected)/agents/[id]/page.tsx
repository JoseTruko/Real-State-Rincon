import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import AgentForm from '@/app/admin/components/agents/AgentForm'
import type { Agent } from '@/types'

interface Props {
  params: { id: string }
}

export default async function EditAgentPage({ params }: Props) {
  const supabase = await createServerClient()

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!agent) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar agente</h1>
        <p className="text-sm text-neutral-500 mt-1">{agent.full_name}</p>
      </div>
      <AgentForm agent={agent as Agent} />
    </div>
  )
}
