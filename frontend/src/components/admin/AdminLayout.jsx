'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { path: '/admin/clients', label: 'Clients', icon: 'fas fa-users' },
    { path: '/admin/analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
    { path: '/admin/referral-links', label: 'Referral Links', icon: 'fas fa-link' },
    { path: '/admin/earnings', label: 'Earnings', icon: 'fas fa-coins' },
  ]

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-20 left-4 z-50 bg-secondary border border-slate rounded-lg px-3 py-2 text-gray-300 hover:text-white transition"
      >
        <i className="fas fa-bars mr-2"></i>Menu
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed md:sticky top-0 md:top-24 left-0 z-50 md:z-auto w-56 h-screen md:h-auto bg-tertiary md:bg-transparent border-r border-slate md:border-0 p-4 md:p-0 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex-shrink-0`}>
        <div className="flex items-center justify-between mb-4 md:mb-0">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition
                  ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-secondary border border-transparent'
                  }`}
              >
                <i className={`${item.icon} w-4`}></i>
                {item.label}
              </Link>
            )
          })}

          <hr className="border-slate my-3" />

          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-secondary border border-transparent transition"
          >
            <i className="fas fa-arrow-left w-4"></i>
            Back to Portfolio
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent transition w-full text-left"
          >
            <i className="fas fa-sign-out-alt w-4"></i>
            Logout
          </button>
        </nav>
      </aside>

      <main className="md:ml-0 ml-0 pt-12 md:pt-0">
        {children}
      </main>
    </div>
  )
}
