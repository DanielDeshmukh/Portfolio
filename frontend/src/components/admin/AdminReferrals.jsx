'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API = '/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

export default function AdminReferrals() {
  const { projectId } = useParams()
  const [codes, setCodes] = useState([])
  const [uses, setUses] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applyForm, setApplyForm] = useState({ code_id: '', referee_name: '', referee_phone: '' })
  const year = new Date().getFullYear()

  function loadReferrals() {
    setLoading(true)
    fetch(`${API}/referrals?project_id=${projectId}&year=${year}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setCodes(data.codes || [])
          setUses(data.uses || [])
          setDiscounts(data.discounts || [])
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadReferrals() }, [projectId])

  async function handleGenerate() {
    setGenerating(true)
    await fetch(`${API}/referrals`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action: 'generate', project_id: projectId, year }),
    })
    loadReferrals()
    setGenerating(false)
  }

  async function handleApply() {
    if (!applyForm.code_id || !applyForm.referee_name) return
    await fetch(`${API}/referrals`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action: 'apply', ...applyForm }),
    })
    setShowApplyModal(false)
    setApplyForm({ code_id: '', referee_name: '', referee_phone: '' })
    loadReferrals()
  }

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>

  const activeCodes = codes.filter(c => c.status === 'active')
  const usedCodes = codes.filter(c => c.status === 'used')

  return (
    <div>
      <Link href="/admin/clients" className="text-sm text-gray-400 hover:text-primary transition mb-4 inline-block">
        <i className="fas fa-arrow-left mr-1"></i>Back to Clients
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Referral Management</h1>
          <p className="text-sm text-gray-400 mt-1">Project ID: {projectId} | Year: {year}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating || activeCodes.length >= 3}
            className="px-4 py-2 bg-primary text-background rounded-md text-sm font-semibold hover:opacity-90 transition border border-primary disabled:opacity-50"
          >
            {generating ? 'Generating...' : `Generate Codes (${activeCodes.length}/3)`}
          </button>
          <button
            onClick={() => setShowApplyModal(true)}
            disabled={activeCodes.length === 0}
            className="px-4 py-2 bg-accent text-background rounded-md text-sm font-semibold hover:opacity-90 transition border border-accent disabled:opacity-50"
          >
            <i className="fas fa-share-alt mr-1"></i>Apply Referral
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card border border-slate text-center">
          <div className="text-3xl font-bold text-white">{codes.length}</div>
          <div className="text-xs text-gray-400 mt-1">Total Codes</div>
        </div>
        <div className="card border border-slate text-center">
          <div className="text-3xl font-bold text-green-400">{activeCodes.length}</div>
          <div className="text-xs text-gray-400 mt-1">Active Codes</div>
        </div>
        <div className="card border border-slate text-center">
          <div className="text-3xl font-bold text-yellow-400">{usedCodes.length}</div>
          <div className="text-xs text-gray-400 mt-1">Used Codes</div>
        </div>
      </div>

      <h2 className="text-lg font-heading font-semibold text-goldlight mb-3">Referral Codes ({year})</h2>
      {codes.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm text-center py-6 mb-8">
          No codes generated yet. Click &quot;Generate Codes&quot; above.
        </div>
      ) : (
        <div className="card border border-slate overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate">
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Slot</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Code</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => (
                <tr key={code.id} className="border-b border-slate/50 last:border-0">
                  <td className="px-4 py-2 text-gray-300">#{code.slot}</td>
                  <td className="px-4 py-2 font-mono text-gray-200">{code.code}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      code.status === 'active'
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                        : code.status === 'used'
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-900/30 text-gray-500 border border-gray-500/30'
                    }`}>
                      {code.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-400">{code.created_at ? new Date(code.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-lg font-heading font-semibold text-goldlight mb-3">Referral Usage</h2>
      {uses.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm text-center py-6 mb-8">
          No referrals used yet
        </div>
      ) : (
        <div className="card border border-slate overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate">
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Code</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Referee</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Phone</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {uses.map(use => (
                <tr key={use.id} className="border-b border-slate/50 last:border-0">
                  <td className="px-4 py-2 font-mono text-gray-300">{use.code}</td>
                  <td className="px-4 py-2 text-gray-200">{use.referee_name}</td>
                  <td className="px-4 py-2 text-gray-400">{use.referee_phone || '-'}</td>
                  <td className="px-4 py-2 text-gray-400">{use.used_at ? new Date(use.used_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-lg font-heading font-semibold text-goldlight mb-3">Discount Ledger</h2>
      {discounts.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm text-center py-6">
          No discounts tracked yet
        </div>
      ) : (
        <div className="card border border-slate overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate">
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Month</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id} className="border-b border-slate/50 last:border-0">
                  <td className="px-4 py-2 text-gray-200">{d.discount_month}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      d.discount_type === '100_bonus'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                    }`}>
                      {d.discount_type === '50_next' && '50% Off (Next Month)'}
                      {d.discount_type === '50_extends' && '50% Off (Extended)'}
                      {d.discount_type === '100_bonus' && '100% Off (Bonus)'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      d.status === 'applied'
                        ? 'text-green-400'
                        : d.status === 'expired'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-secondary border border-slate rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-heading font-semibold text-white mb-4">Apply Referral</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Select Code *</label>
                <select
                  value={applyForm.code_id}
                  onChange={e => setApplyForm({ ...applyForm, code_id: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                  required
                >
                  <option value="">-- Select a code --</option>
                  {activeCodes.map(code => (
                    <option key={code.id} value={code.id}>{code.code} (Slot #{code.slot})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Referee Name *</label>
                <input
                  value={applyForm.referee_name}
                  onChange={e => setApplyForm({ ...applyForm, referee_name: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                  placeholder="Person B's name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Referee Phone</label>
                <input
                  value={applyForm.referee_phone}
                  onChange={e => setApplyForm({ ...applyForm, referee_phone: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                  placeholder="Phone number (optional)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-slate rounded-md text-gray-300 hover:border-primary transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-primary text-background rounded-md font-semibold hover:opacity-90 transition border border-primary text-sm"
              >
                Apply Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
