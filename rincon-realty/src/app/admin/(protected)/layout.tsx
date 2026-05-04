import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { SITE_NAME } from '@/config/site'
import LogoutButton from '@/app/admin/components/LogoutButton'

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
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-neutral-200 flex flex-col">
        <div className="p-6">
          <h1 className="font-heading text-xl font-bold text-ink">
            {SITE_NAME}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Panel de administración</p>
        </div>

        <nav className="px-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:bg-neutral-100 hover:text-ink transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500 truncate">
              {session.user?.email}
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
