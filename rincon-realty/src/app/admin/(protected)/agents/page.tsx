import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import { deleteAgent } from '@/app/admin/actions/agents'
import DeleteButton from '@/app/admin/components/DeleteButton'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function AdminAgentsPage() {
  const supabase = await createServerClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('id, full_name, email, phone, active, photo_url, years_experience, title_en')
    .order('full_name', { ascending: true })

  type AgentRow = Pick<import('@/types').Agent, 'id' | 'full_name' | 'email' | 'phone' | 'active' | 'photo_url' | 'years_experience' | 'title_en'>
  const rows = (agents ?? []) as AgentRow[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Agentes</h1>
          <p className="text-sm text-neutral-500 mt-1">{rows.length} agentes en total</p>
        </div>
        <Link href="/admin/agents/new">
          <Button variant="primary">+ Nuevo agente</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 bg-white rounded-xl border border-neutral-200">
          No hay agentes aún. <Link href="/admin/agents/new" className="text-primary underline">Crear el primero</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Foto', 'Nombre', 'Título', 'Email', 'Teléfono', 'Exp.', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-neutral-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {rows.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    {a.photo_url ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image src={a.photo_url} alt={a.full_name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-medium">
                        {a.full_name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{a.full_name}</td>
                  <td className="px-4 py-3 text-neutral-600 text-xs">{a.title_en}</td>
                  <td className="px-4 py-3 text-neutral-600">{a.email}</td>
                  <td className="px-4 py-3 text-neutral-600">{a.phone}</td>
                  <td className="px-4 py-3 text-neutral-600">{a.years_experience} años</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {a.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/agents/${a.id}`}>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </Link>
                      <DeleteButton onDelete={deleteAgent.bind(null, a.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
