import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import { deleteCommunity } from '@/app/admin/actions/communities'
import DeleteButton from '@/app/admin/components/DeleteButton'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function AdminCommunitiesPage() {
  const supabase = await createServerClient()

  const { data: communities } = await supabase
    .from('communities')
    .select('id, name_en, name_es, active, sort_order, image_url')
    .order('sort_order', { ascending: true })

  type CommunityRow = { id: string; name_en: string; name_es: string; active: boolean; sort_order: number; image_url: string | null }
  const rows = (communities ?? []) as CommunityRow[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Comunidades</h1>
          <p className="text-sm text-neutral-500 mt-1">{rows.length} comunidades en total</p>
        </div>
        <Link href="/admin/communities/new">
          <Button variant="primary">+ Nueva comunidad</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 bg-white rounded-xl border border-neutral-200">
          No hay comunidades aún. <Link href="/admin/communities/new" className="text-primary underline">Crear la primera</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Imagen', 'Nombre', 'Estado', 'Orden', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-neutral-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    {c.image_url ? (
                      <div className="relative w-14 h-10 rounded overflow-hidden">
                        <Image src={c.image_url} alt={c.name_en} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
                        Sin img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    <div>{c.name_en}</div>
                    <div className="text-xs text-neutral-500">{c.name_es}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {c.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/communities/${c.id}`}>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </Link>
                      <DeleteButton onDelete={deleteCommunity.bind(null, c.id)} />
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
