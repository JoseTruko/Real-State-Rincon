import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import PropertyForm from '@/app/admin/components/properties/PropertyForm'
import type { Property } from '@/types'

interface Props {
  params: { id: string }
}

export default async function EditPropertyPage({ params }: Props) {
  const supabase = await createServerClient()

  const [{ data: property }, { data: communities }, { data: agents }] = await Promise.all([
    supabase
      .from('properties')
      .select('*, images:property_images(*)')
      .eq('id', params.id)
      .single(),
    supabase.from('communities').select('id, name_en').eq('active', true).order('name_en'),
    supabase.from('agents').select('id, full_name').eq('active', true).order('full_name'),
  ])

  if (!property) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar propiedad</h1>
        <p className="text-sm text-neutral-500 mt-1">{property.title_en}</p>
      </div>
      <PropertyForm
        property={property as unknown as Property}
        communities={communities ?? []}
        agents={agents ?? []}
      />
    </div>
  )
}
