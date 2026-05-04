import { createServerClient } from '@/lib/supabase/server'
import PropertyForm from '@/app/admin/components/properties/PropertyForm'

export default async function NewPropertyPage() {
  const supabase = await createServerClient()

  const [{ data: communities }, { data: agents }] = await Promise.all([
    supabase.from('communities').select('id, name_en').eq('active', true).order('name_en'),
    supabase.from('agents').select('id, full_name').eq('active', true).order('full_name'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nueva propiedad</h1>
        <p className="text-sm text-neutral-500 mt-1">Completa los campos para crear una nueva propiedad.</p>
      </div>
      <PropertyForm
        communities={communities ?? []}
        agents={agents ?? []}
      />
    </div>
  )
}
