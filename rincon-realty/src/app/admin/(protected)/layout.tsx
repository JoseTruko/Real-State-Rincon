import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import AdminSidebar from '@/app/admin/components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const navItems = [
    { href: '/admin/leads',       label: 'Leads',         icon: '👥' },
    { href: '/admin/properties',  label: 'Propiedades',   icon: '🏠' },
    { href: '/admin/communities', label: 'Comunidades',   icon: '🏘️' },
    { href: '/admin/agents',      label: 'Agentes',       icon: '👨‍💼' },
    { href: '/admin/blog',        label: 'Blog',          icon: '📝' },
    { href: '/admin/settings',    label: 'Configuración', icon: '⚙️' },
  ]

  return (
    <div className="flex h-screen bg-neutral-50 font-body">
      <AdminSidebar navItems={navItems} userEmail={session.user?.email} />

      <main className="flex-1 overflow-auto">
        <div className="pt-14 md:pt-0 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
