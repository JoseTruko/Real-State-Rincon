import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { deleteProperty } from '@/app/admin/actions/properties'
import DeleteButton from '@/app/admin/components/DeleteButton'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { Property } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminPropertiesPage() {
  const supabase = await createServerClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('id, title_en, type, price_usd, status, featured, created_at, community:communities(name_en)')
    .order('created_at', { ascending: false })

  const rows = (properties ?? []) as (Pick<Property, 'id' | 'title_en' | 'type' | 'price_usd' | 'status' | 'featured' | 'created_at'> & { community: { name_en: string } | null })[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Propiedades</h1>
          <p className="text-sm text-neutral-500 mt-1">{rows.length} propiedades en total</p>
        </div>
        <Link href="/admin/properties/new">
          <Button variant="primary">+ Nueva propiedad</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 bg-white rounded-xl border border-neutral-200">
          No hay propiedades aún. <Link href="/admin/properties/new" className="text-primary underline">Crear la primera</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Título', 'Tipo', 'Precio', 'Comunidad', 'Estado', 'Destacada', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-neutral-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {rows.map((prop) => (
                <tr key={prop.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink max-w-[200px] truncate">{prop.title_en}</td>
                  <td className="px-4 py-3">
                    <Badge variant={prop.type}>
                      {prop.type === 'house' ? 'Casa' : prop.type === 'land' ? 'Terreno' : 'Finca'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    ${prop.price_usd.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {prop.community?.name_en ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prop.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {prop.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {prop.featured ? '⭐' : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/properties/${prop.id}`}>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </Link>
                      <DeleteButton
                        onDelete={deleteProperty.bind(null, prop.id)}
                        label="Eliminar"
                      />
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
