'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayoutComponent from '../../../../components/admin/AdminLayout'
import AdminReferrals from '../../../../components/admin/AdminReferrals'

export default function AdminReferralsPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background text-gray-100">
      <AdminLayoutComponent>
        <AdminReferrals />
      </AdminLayoutComponent>
    </div>
  )
}
