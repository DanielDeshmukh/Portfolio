'use client'
import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

function formatCurrency(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN')
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border border-slate rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/dashboard-stats`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { if (d.ok) setStats(d.stats) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>
  if (!stats) return <div className="text-red-400 py-8">Failed to load stats</div>

  const chartData = (stats.dailyEarnings || []).map(d => ({
    day: d.day ? new Date(d.day + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '',
    amount: d.total,
  }))

  const summaryCards = [
    { label: 'Total Earnings', value: formatCurrency(stats.totalEarnings), icon: 'fas fa-wallet', color: 'text-primary' },
    { label: 'Paid', value: formatCurrency(stats.paidEarnings), icon: 'fas fa-check-circle', color: 'text-green-400' },
    { label: 'Pending', value: formatCurrency(stats.pendingEarnings), icon: 'fas fa-clock', color: 'text-yellow-400' },
    { label: 'Clients', value: stats.totalClients, icon: 'fas fa-users', color: 'text-blue-400' },
    { label: 'Projects', value: stats.totalProjects, icon: 'fas fa-folder', color: 'text-purple-400' },
    { label: 'Referrals', value: stats.totalReferrals, icon: 'fas fa-share-alt', color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Payment flow and client overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-secondary/50 border border-slate/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <i className={`${card.icon} ${card.color}`}></i>
              <div>
                <div className="text-lg font-bold text-white">{card.value}</div>
                <div className="text-[11px] text-gray-400">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 ? (
        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-white">Payment Trend</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 90 days</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a54e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c9a54e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#c9a54e" strokeWidth={2} fill="url(#paymentGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6 text-center py-16">
          <i className="fas fa-chart-area text-3xl text-gray-600 mb-3"></i>
          <p className="text-gray-400">No payment data yet. Add earnings to see the chart.</p>
        </div>
      )}

      <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
        <h2 className="text-lg font-heading font-semibold text-white mb-4">Recent Earnings</h2>
        {stats.recentEarnings?.length === 0 ? (
          <p className="text-gray-400 text-sm">No earnings recorded yet</p>
        ) : (
          <div className="space-y-0">
            {(stats.recentEarnings || []).map((e, i) => (
              <div key={e.id || i} className="flex items-center justify-between py-3 border-b border-slate/20 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${e.status === 'paid' ? 'bg-green-400' : e.status === 'partial' ? 'bg-blue-400' : 'bg-yellow-400'}`}></div>
                  <div>
                    <span className="text-sm text-gray-200">{e.client_name || e.description || 'Earning'}</span>
                    {e.project_name && <span className="text-xs text-gray-500 ml-2">· {e.project_name}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{formatCurrency(e.amount)}</div>
                  <div className="text-[11px] text-gray-500">{e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '-'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
