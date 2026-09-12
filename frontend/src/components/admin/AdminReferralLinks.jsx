'use client'

import { useState, useEffect } from 'react'

const BASE_URL = 'https://danieldeshmukh-portfolio.vercel.app/hire'

export default function AdminReferralLinks() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [customCode, setCustomCode] = useState('')
  const [customUtmSource, setCustomUtmSource] = useState('')
  const [customUtmMedium, setCustomUtmMedium] = useState('')
  const [customUtmCampaign, setCustomUtmCampaign] = useState('')
  const [customCopied, setCustomCopied] = useState(false)

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects`, { headers: getHeaders() })
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : data.projects || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedProject) return
    setLoading(true)
    const year = new Date().getFullYear()
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/referrals?project_id=${selectedProject}&year=${year}`, { headers: getHeaders() })
      .then(res => res.json())
      .then(data => { setReferrals(Array.isArray(data) ? data : data.referrals || []); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [selectedProject])

  const buildLink = (code) => `${BASE_URL}?ref=${code}`

  const buildCustomLink = () => {
    if (!customCode.trim()) return ''
    let url = `${BASE_URL}?ref=${customCode.trim()}`
    const params = []
    if (customUtmSource.trim()) params.push(`utm_source=${encodeURIComponent(customUtmSource.trim())}`)
    if (customUtmMedium.trim()) params.push(`utm_medium=${encodeURIComponent(customUtmMedium.trim())}`)
    if (customUtmCampaign.trim()) params.push(`utm_campaign=${encodeURIComponent(customUtmCampaign.trim())}`)
    if (params.length) url += '&' + params.join('&')
    return url
  }

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* fallback */ }
  }

  const shareLink = async (link, code) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Referral Link: ${code}`, url: link })
      } catch { /* user cancelled */ }
    } else {
      copyToClipboard(link, `share-${code}`)
    }
  }

  const copyCustom = async () => {
    const link = buildCustomLink()
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCustomCopied(true)
      setTimeout(() => setCustomCopied(false), 2000)
    } catch { /* fallback */ }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-400">Referral Links</h1>
        <p className="text-slate-400 mt-1 text-sm">Manage and generate referral links for your projects.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Select Project</label>
        <select
          value={selectedProject}
          onChange={(e) => { setSelectedProject(e.target.value); setReferrals([]) }}
          className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="">— Choose a project —</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name || p.title}</option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Active Referral Codes</h2>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading referrals…</p>
          ) : referrals.length === 0 ? (
            <p className="text-slate-500 text-sm">No referral codes found for this project.</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((r) => {
                const link = buildLink(r.code)
                const isActive = r.status === 'active' || !r.status
                return (
                  <div key={r.id || r.code} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-amber-300 font-semibold tracking-wide">{r.code}</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/40 text-slate-400'}`}>
                            {isActive ? 'Active' : 'Used'}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-slate-400 truncate bg-slate-900/50 rounded px-2 py-1">{link}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(link, r.code)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
                        >
                          {copiedId === r.code ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          onClick={() => shareLink(link, r.code)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 transition-colors"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                    {r.created_at && (
                      <p className="text-[11px] text-slate-500 mt-2">Created {new Date(r.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Generate Custom Link</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Referral Code *</label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="e.g. PARTNER123"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-100 font-mono focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">UTM Source</label>
            <input
              type="text"
              value={customUtmSource}
              onChange={(e) => setCustomUtmSource(e.target.value)}
              placeholder="e.g. twitter"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">UTM Medium</label>
            <input
              type="text"
              value={customUtmMedium}
              onChange={(e) => setCustomUtmMedium(e.target.value)}
              placeholder="e.g. social"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">UTM Campaign</label>
            <input
              type="text"
              value={customUtmCampaign}
              onChange={(e) => setCustomUtmCampaign(e.target.value)}
              placeholder="e.g. summer_promo"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {customCode.trim() && (
          <div className="bg-slate-900/70 border border-slate-600 rounded-lg p-3">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5">Generated Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-xs text-amber-300 break-all leading-relaxed">{buildCustomLink()}</code>
              <button
                onClick={copyCustom}
                className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
              >
                {customCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
