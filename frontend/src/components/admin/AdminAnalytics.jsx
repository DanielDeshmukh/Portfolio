'use client'
import { useEffect, useState } from 'react'

const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`${API}/analytics`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.ok) setData(d)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>
  if (error || !data) return <div className="text-red-400 py-8">Failed to load</div>

  const statCards = [
    { label: 'Total Views', value: data.totalViews ?? 0, icon: 'fas fa-eye', color: 'text-blue-400' },
    { label: 'Views Today', value: data.viewsToday ?? 0, icon: 'fas fa-calendar-day', color: 'text-green-400' },
    { label: 'Views This Week', value: data.viewsThisWeek ?? 0, icon: 'fas fa-calendar-week', color: 'text-yellow-400' },
  ]

  const pageViews = [...(data.pageViews || [])].sort((a, b) => b.views - a.views)
  const referrals = [...(data.referralClicks || [])].sort((a, b) => b.clicks - a.clicks)

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map(card => (
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

      <h2 className="text-lg font-heading font-semibold text-goldlight mb-4">Page Views by Path</h2>
      {pageViews.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm mb-8">No page view data</div>
      ) : (
        <div className="card border border-slate overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate">
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Path</th>
                  <th className="text-right px-4 py-2 text-gray-400 font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {pageViews.map((p, i) => (
                  <tr key={p.path || i} className="border-b border-slate/50 last:border-0">
                    <td className="px-4 py-2 text-gray-200">{p.path}</td>
                    <td className="px-4 py-2 text-gray-400 text-right">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h2 className="text-lg font-heading font-semibold text-goldlight mb-4">Referral Clicks</h2>
      {referrals.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm">No referral data</div>
      ) : (
        <div className="card border border-slate overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate">
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Code</th>
                  <th className="text-right px-4 py-2 text-gray-400 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, i) => (
                  <tr key={r.code || i} className="border-b border-slate/50 last:border-0">
                    <td className="px-4 py-2 text-gray-200">{r.code}</td>
                    <td className="px-4 py-2 text-gray-400 text-right">{r.clicks}</td>
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
