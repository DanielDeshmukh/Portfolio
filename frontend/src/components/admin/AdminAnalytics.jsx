'use client'
import { useEffect, useState } from 'react'

const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

function parseUA(ua) {
  if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' }
  let browser = 'Other'
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'

  let os = 'Other'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop'

  return { browser, os, device }
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/analytics`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d.stats) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>
  if (!data) return <div className="text-red-400 py-8">Failed to load activity data</div>

  const browserCounts = {}
  const osCounts = {}
  const deviceCounts = {}
  ;(data.recentActivity || []).forEach(a => {
    const { browser, os, device } = parseUA(a.user_agent)
    browserCounts[browser] = (browserCounts[browser] || 0) + 1
    osCounts[os] = (osCounts[os] || 0) + 1
    deviceCounts[device] = (deviceCounts[device] || 0) + 1
  })

  const browserList = Object.entries(browserCounts).sort((a, b) => b[1] - a[1])
  const osList = Object.entries(osCounts).sort((a, b) => b[1] - a[1])
  const deviceList = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])

  const uniquePaths = new Set((data.byPath || []).map(p => p.path)).size
  const avgViews = data.byPath?.length ? Math.round(data.totalViews / data.byPath.length) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Activity</h1>
        <p className="text-gray-400 text-sm mt-1">Visitor insights and recent portfolio activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: data.totalViews ?? 0, icon: 'fas fa-eye', color: 'text-blue-400' },
          { label: 'Unique Visitors', value: data.uniqueVisitors ?? 0, icon: 'fas fa-user', color: 'text-green-400' },
          { label: 'Pages Tracked', value: uniquePaths, icon: 'fas fa-file', color: 'text-yellow-400' },
          { label: 'Avg Views/Page', value: avgViews, icon: 'fas fa-chart-line', color: 'text-purple-400' },
        ].map(card => (
          <div key={card.label} className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <i className={`${card.icon} ${card.color} text-lg`}></i>
              <div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <div className="text-xs text-gray-400">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4"><i className="fas fa-globe mr-2 text-primary"></i>Browsers</h2>
          {browserList.length === 0 ? <p className="text-gray-500 text-sm">No data</p> : (
            <div className="space-y-3">
              {browserList.map(([name, count]) => {
                const max = browserList[0][1]
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{name}</span>
                      <span className="text-gray-500 font-mono text-xs">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/60 rounded-full" style={{ width: `${(count / max) * 100}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4"><i className="fas fa-desktop mr-2 text-green-400"></i>Operating Systems</h2>
          {osList.length === 0 ? <p className="text-gray-500 text-sm">No data</p> : (
            <div className="space-y-3">
              {osList.map(([name, count]) => {
                const max = osList[0][1]
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{name}</span>
                      <span className="text-gray-500 font-mono text-xs">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-green-500/60 rounded-full" style={{ width: `${(count / max) * 100}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4"><i className="fas fa-mobile-alt mr-2 text-yellow-400"></i>Device Type</h2>
          {deviceList.length === 0 ? <p className="text-gray-500 text-sm">No data</p> : (
            <div className="space-y-3">
              {deviceList.map(([name, count]) => {
                const max = deviceList[0][1]
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{name}</span>
                      <span className="text-gray-500 font-mono text-xs">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500/60 rounded-full" style={{ width: `${(count / max) * 100}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
        <h2 className="text-lg font-heading font-semibold text-white mb-4"><i className="fas fa-file-alt mr-2 text-primary"></i>Page Performance</h2>
        {data.byPath?.length === 0 ? <p className="text-gray-400 text-sm">No page data</p> : (
          <div className="space-y-3">
            {(data.byPath || []).sort((a, b) => b.views - a.views).map((p, i) => {
              const maxViews = Math.max(...data.byPath.map(x => x.views), 1)
              const pct = (p.views / maxViews) * 100
              return (
                <div key={p.path || i} className="flex items-center gap-4">
                  <div className="w-40 sm:w-56 text-sm text-gray-300 font-mono truncate shrink-0">{p.path}</div>
                  <div className="flex-1">
                    <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-gray-400 w-12 text-right shrink-0">{p.views}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
        <h2 className="text-lg font-heading font-semibold text-white mb-4"><i className="fas fa-clock mr-2 text-primary"></i>Recent Visits</h2>
        {data.recentActivity?.length === 0 ? <p className="text-gray-400 text-sm">No activity yet</p> : (
          <div className="space-y-0">
            {(data.recentActivity || []).map((a, i) => {
              const { browser, os, device } = parseUA(a.user_agent)
              return (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate/20 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-gray-200">{a.path}</span>
                      <span className="text-[10px] text-gray-500 bg-background px-1.5 py-0.5 rounded">{browser}</span>
                      <span className="text-[10px] text-gray-500 bg-background px-1.5 py-0.5 rounded">{os}</span>
                      <span className="text-[10px] text-gray-500 bg-background px-1.5 py-0.5 rounded">{device}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{timeAgo(a.viewed_at)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
