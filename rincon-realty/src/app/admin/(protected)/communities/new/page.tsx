import CommunityForm from '@/app/admin/components/communities/CommunityForm'

export default function NewCommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nueva comunidad</h1>
        <p className="text-sm text-neutral-500 mt-1">Completa los campos para crear una nueva comunidad.</p>
      </div>
      <CommunityForm />
    </div>
  )
}
