import { getSiteConfigMap } from '@/app/admin/actions/settings'
import SettingsForm from '@/app/admin/components/settings/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const config = await getSiteConfigMap()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Configuración del sitio</h1>
        <p className="text-sm text-neutral-500 mt-1">Gestiona la información global del sitio web.</p>
      </div>
      <SettingsForm config={config} />
    </div>
  )
}
