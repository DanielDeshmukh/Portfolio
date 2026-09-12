'use client'
import { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import HireMe from '../../components/HireMe'

export default function HirePage() {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer || null }),
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <HireMe />
      </main>
    </div>
  )
}
