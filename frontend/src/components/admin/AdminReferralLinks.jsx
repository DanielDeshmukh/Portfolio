'use client'

import { useState, useEffect } from 'react'

const BASE_URL = 'https://danieldeshmukh-portfolio.vercel.app/hire'
const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

export default function AdminReferralLinks() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [referralData, setReferralData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(null)
  const [newCode, setNewCode] = useState(null)

  useEffect(() => {
    fetch(`${API}/projects`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setProjects(data.projects || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedProject) { setReferralData(null); return }
    setLoading(true)
    const year = new Date().getFullYear()
    fetch(`${API}/referrals?project_id=${selectedProject}&year=${year}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { setReferralData(data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [selectedProject])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const buildLink = (code) => `${BASE_URL}?ref=${code}`

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Copied to clipboard')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showToast('Copied to clipboard')
    }
  }

  async function handleGenerate() {
    if (!selectedProject) return
    setGenerating(true)
    try {
      const res = await fetch(`${API}/referrals`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'generate', project_id: selectedProject }),
      })
      const data = await res.json()
      if (data.ok && data.codes?.length > 0) {
        const code = data.codes[0]
        const link = buildLink(code.code)
        setNewCode({ code: code.code, link })
        showToast('Code generated')
        const year = new Date().getFullYear()
        fetch(`${API}/referrals?project_id=${selectedProject}&year=${year}`, { headers: authHeaders() })
          .then(r => r.json())
          .then(d => setReferralData(d))
      } else {
        showToast(data.error || 'Failed to generate')
      }
    } catch {
      showToast('Failed to generate code')
    }
    setGenerating(false)
  }

  const codes = referralData?.codes || []
  const uses = referralData?.uses || []
  const usedCount = codes.filter(c => c.status === 'used').length
  const activeCount = codes.filter(c => c.status === 'active').length
  const remaining = Math.max(0, 3 - codes.length)
  const selectedName = projects.find(p => p.id === selectedProject)?.name || ''

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium animate-in slide-in-from-top-2">
          <i className="fas fa-check-circle"></i>
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Referral Links</h1>
        <p className="text-gray-400 text-sm mt-1">Generate and manage referral codes for your projects</p>
      </div>

      <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          <i className="fas fa-folder-open mr-2 text-primary"></i>Select Project
        </label>
        <select
          value={selectedProject}
          onChange={(e) => { setSelectedProject(e.target.value); setNewCode(null) }}
          className="w-full max-w-lg bg-background border border-slate rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-primary transition-colors text-sm"
        >
          <option value="">-- Choose a project --</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5 text-center">
              <i className="fas fa-check-circle text-green-400 text-lg mb-2"></i>
              <div className="text-2xl font-bold text-white">{usedCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">Used</div>
            </div>
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5 text-center">
              <i className="fas fa-clock text-yellow-400 text-lg mb-2"></i>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">Active</div>
            </div>
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5 text-center">
              <i className="fas fa-plus-circle text-blue-400 text-lg mb-2"></i>
              <div className="text-2xl font-bold text-white">{remaining}</div>
              <div className="text-xs text-gray-400 mt-0.5">Remaining</div>
            </div>
          </div>

          {newCode && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-check-circle text-green-400"></i>
                <span className="text-sm font-semibold text-green-300">New Code Generated</span>
              </div>
              <div className="flex items-center gap-3 bg-background rounded-lg p-3">
                <code className="flex-1 font-mono text-sm text-primary break-all">{newCode.code}</code>
                <button
                  onClick={() => copyToClipboard(newCode.code)}
                  className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30 transition-colors flex items-center gap-1.5"
                >
                  <i className="fas fa-copy"></i>Copy
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3 bg-background rounded-lg p-3">
                <code className="flex-1 font-mono text-xs text-gray-300 break-all">{newCode.link}</code>
                <button
                  onClick={() => copyToClipboard(newCode.link)}
                  className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30 transition-colors flex items-center gap-1.5"
                >
                  <i className="fas fa-link"></i>Copy Link
                </button>
              </div>
            </div>
          )}

          <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-heading font-semibold text-white">
                <i className="fas fa-ticket-alt mr-2 text-primary"></i>Codes ({selectedName})
              </h2>
              <button
                onClick={handleGenerate}
                disabled={generating || remaining === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  remaining === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-background hover:opacity-90'
                }`}
              >
                <i className={`fas ${generating ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                {generating ? 'Generating...' : 'Generate Code'}
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400 text-sm py-4">Loading...</p>
            ) : codes.length === 0 ? (
              <div className="text-center py-10">
                <i className="fas fa-ticket-alt text-3xl text-gray-600 mb-3"></i>
                <p className="text-gray-400 text-sm">No codes generated yet</p>
                <p className="text-gray-500 text-xs mt-1">Click "Generate Code" to create your first referral code</p>
              </div>
            ) : (
              <div className="space-y-3">
                {codes.map(code => {
                  const codeUses = uses.filter(u => u.code_id === code.id)
                  const link = buildLink(code.code)
                  return (
                    <div key={code.id} className="bg-background/50 border border-slate/30 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <code className="font-mono text-sm text-primary font-semibold">{code.code}</code>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              code.status === 'active'
                                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                : 'bg-green-500/15 text-green-400 border border-green-500/30'
                            }`}>
                              <i className={`fas ${code.status === 'active' ? 'fa-clock' : 'fa-check'}`}></i>
                              {code.status}
                            </span>
                            <span className="text-[10px] text-gray-500">Slot {code.slot}/3</span>
                          </div>
                          <div className="font-mono text-xs text-gray-400 truncate">{link}</div>
                          {codeUses.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              <i className="fas fa-user-check mr-1 text-green-400"></i>
                              Used by: {codeUses.map(u => u.referee_name).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors flex items-center gap-1.5"
                          >
                            <i className="fas fa-copy"></i>Code
                          </button>
                          <button
                            onClick={() => copyToClipboard(link)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/50 transition-colors flex items-center gap-1.5"
                          >
                            <i className="fas fa-link"></i>Link
                          </button>
                          {navigator.share && (
                            <button
                              onClick={() => navigator.share({ title: `Referral: ${code.code}`, url: link })}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/50 transition-colors flex items-center gap-1.5"
                            >
                              <i className="fas fa-share-alt"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {!selectedProject && (
        <div className="text-center py-16">
          <i className="fas fa-hand-pointer text-4xl text-gray-600 mb-4"></i>
          <p className="text-gray-400 text-sm">Select a project above to manage referral codes</p>
        </div>
      )}
    </div>
  )
}
