'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

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
    <div className="flex min-h-[calc(100vh-5rem)] gap-6">
      <aside className="w-48 flex-shrink-0">
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

          <hr className="border-slate my-3" />

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

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
