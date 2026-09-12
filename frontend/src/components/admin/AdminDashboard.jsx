'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/dashboard-stats`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setStats(data.stats)
          setReferrals(data.recentReferrals || [])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>
  if (!stats) return <div className="text-red-400 py-8">Failed to load stats</div>

  const cards = [
    { label: 'Total Clients', value: stats.totalClients, icon: 'fas fa-users', color: 'text-blue-400' },
    { label: 'Total Projects', value: stats.totalProjects, icon: 'fas fa-folder', color: 'text-green-400' },
    { label: 'Active Codes', value: stats.activeCodes, icon: 'fas fa-ticket-alt', color: 'text-yellow-400' },
    { label: 'Total Referrals', value: stats.totalReferrals, icon: 'fas fa-share-alt', color: 'text-purple-400' },
    { label: 'Referrals This Month', value: stats.referralsThisMonth, icon: 'fas fa-calendar', color: 'text-orange-400' },
    { label: 'Pending Discounts', value: stats.pendingDiscounts, icon: 'fas fa-percent', color: 'text-primary' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="card border border-slate">
            <div className="flex items-center gap-3">
              <i className={`${card.icon} ${card.color} text-xl`}></i>
              <div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <div className="text-xs text-gray-400">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-heading font-semibold text-goldlight mb-4">Recent Referrals</h2>
      {referrals.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm">No referrals yet</div>
      ) : (
        <div className="card border border-slate overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate">
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Referee</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Phone</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, i) => (
                  <tr key={r.id || i} className="border-b border-slate/50 last:border-0">
                    <td className="px-4 py-2 text-gray-200">{r.referee_name}</td>
                    <td className="px-4 py-2 text-gray-400">{r.referee_phone || '-'}</td>
                    <td className="px-4 py-2 text-gray-400">{r.used_at ? new Date(r.used_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
