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
    { path: '/admin/analytics', label: 'Activity', icon: 'fas fa-chart-bar' },
    { path: '/admin/referral-links', label: 'Referral Links', icon: 'fas fa-link' },
    { path: '/admin/earnings', label: 'Earnings', icon: 'fas fa-coins' },
  ]

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-4 md:mb-6">
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
    </>
  )

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-20 left-4 z-30 bg-secondary border border-slate rounded-lg px-3 py-2 text-gray-300 hover:text-white transition"
      >
        <i className="fas fa-bars mr-2"></i>Menu
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        hidden md:block w-52 lg:w-56 flex-shrink-0
        p-6
      `}>
        <nav className="sticky top-24 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
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

          <hr className="border-slate my-4" />

          <Link
            href="/"
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

      <aside className={`
        md:hidden fixed top-0 left-0 z-50
        w-64 h-full
        bg-tertiary border-r border-slate
        p-6
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  )
}
