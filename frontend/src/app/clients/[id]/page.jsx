'use client'
import Navbar from '../../../components/Navbar'
import ClientDetail from '../../../components/ClientDetail'

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <ClientDetail />
      </main>
    </div>
  )
}
