import AgentForm from '@/app/admin/components/agents/AgentForm'

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nuevo agente</h1>
        <p className="text-sm text-neutral-500 mt-1">Completa los campos para crear un nuevo perfil de agente.</p>
      </div>
      <AgentForm />
    </div>
  )
}
