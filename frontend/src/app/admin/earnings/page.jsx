'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayoutComponent from '../../../components/admin/AdminLayout'
import AdminEarnings from '../../../components/admin/AdminEarnings'

export default function AdminEarningsPage() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) router.push('/admin/login')
  }, [router])
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <main className="max-w-6xl mx-auto px-6 pt-6 pb-20">
        <AdminLayoutComponent><AdminEarnings /></AdminLayoutComponent>
      </main>
    </div>
  )
}
