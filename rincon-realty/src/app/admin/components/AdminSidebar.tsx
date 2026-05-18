'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_NAME } from '@/config/site'
import LogoutButton from '@/app/admin/components/LogoutButton'

interface NavItem {
  href: string
  label: string
  icon: string
}

interface AdminSidebarProps {
  navItems: NavItem[]
  userEmail: string | undefined
}

export default function AdminSidebar({ navItems, userEmail }: AdminSidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 bg-white border-b border-neutral-200">
        <span className="font-heading text-lg font-bold text-ink">{SITE_NAME}</span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-20 w-64',
          'bg-white shadow-sm border-r border-neutral-200 flex flex-col',
          'transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className="hidden md:block p-6">
          <h1 className="font-heading text-xl font-bold text-ink">{SITE_NAME}</h1>
          <p className="text-sm text-neutral-500 mt-1">Panel de administración</p>
        </div>

        {/* Spacer for mobile top bar */}
        <div className="md:hidden h-14 shrink-0" />

        <nav className="px-4 flex-1 overflow-y-auto py-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-lg hover:bg-neutral-100 hover:text-ink transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-neutral-500 truncate min-w-0">{userEmail}</div>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  )
}
