import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import CommunityForm from '@/app/admin/components/communities/CommunityForm'
import type { Community } from '@/types'

interface Props {
  params: { id: string }
}

export default async function EditCommunityPage({ params }: Props) {
  const supabase = await createServerClient()

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!community) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar comunidad</h1>
        <p className="text-sm text-neutral-500 mt-1">{community.name_en}</p>
      </div>
      <CommunityForm community={community as Community} />
    </div>
  )
}
