'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border border-slate rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-primary">{payload[0].value} views</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/dashboard-stats`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/analytics`, { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([dashData, analyticsData]) => {
        if (dashData.ok) {
          setStats(dashData.stats)
          setReferrals(dashData.recentReferrals || [])
        }
        if (analyticsData.ok) setAnalytics(analyticsData.stats)
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

  const chartData = (analytics?.dailyViews || []).map(d => ({
    day: d.day ? new Date(d.day + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '',
    views: d.views,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your portfolio and client activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center`}>
                <i className={`${card.icon} ${card.color}`}></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <div className="text-xs text-gray-400">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-heading font-semibold text-white">Views Over Time</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span>{analytics?.totalViews || 0} total</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400"></span>{analytics?.uniqueVisitors || 0} unique</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a54e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c9a54e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#c9a54e" strokeWidth={2} fill="url(#viewGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {analytics?.hourlyViews?.length > 0 && (
        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <h2 className="text-lg font-heading font-semibold text-white mb-4">Traffic by Hour (IST)</h2>
          <div className="flex items-end gap-1 h-32">
            {Array.from({ length: 24 }, (_, i) => {
              const found = analytics.hourlyViews.find(h => parseInt(h.hour) === i)
              const views = found ? found.views : 0
              const maxViews = Math.max(...analytics.hourlyViews.map(h => h.views), 1)
              const height = (views / maxViews) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/60 rounded-t-sm transition-all hover:bg-primary"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${i}:00 - ${views} views`}
                  ></div>
                  {i % 4 === 0 && <span className="text-[9px] text-gray-500">{i}h</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <h2 className="text-lg font-heading font-semibold text-white mb-4">Traffic Sources</h2>
          {analytics?.byReferrer?.length === 0 ? (
            <p className="text-gray-400 text-sm">No referrer data yet</p>
          ) : (
            <div className="space-y-3">
              {(analytics?.byReferrer || []).map((r, i) => {
                const maxVisits = Math.max(...(analytics?.byReferrer || []).map(x => x.visits), 1)
                const pct = (r.visits / maxVisits) * 100
                return (
                  <div key={r.source + i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate mr-2">{r.source}</span>
                      <span className="text-gray-400 font-mono text-xs shrink-0">{r.visits}</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-white">Recent Referrals</h2>
            <Link href="/admin/referral-links" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {referrals.length === 0 ? (
            <p className="text-gray-400 text-sm">No referrals yet</p>
          ) : (
            <div className="space-y-2">
              {referrals.slice(0, 5).map((r, i) => (
                <div key={r.id || i} className="flex items-center justify-between py-2 border-b border-slate/30 last:border-0">
                  <div>
                    <span className="text-sm text-gray-200">{r.referee_name}</span>
                    {r.referee_phone && <span className="text-xs text-gray-500 ml-2">{r.referee_phone}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{r.used_at ? new Date(r.used_at).toLocaleDateString('en-IN') : '-'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
