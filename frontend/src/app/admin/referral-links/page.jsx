'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayoutComponent from '../../../components/admin/AdminLayout'
import AdminReferralLinks from '../../../components/admin/AdminReferralLinks'

export default function AdminReferralLinksPage() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) router.push('/admin/login')
  }, [router])
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <AdminLayoutComponent><AdminReferralLinks /></AdminLayoutComponent>
    </div>
  )
}
