'use client'
import { useEffect, useState } from 'react'

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

const TYPE_LABELS = {
  project_payment: 'Project Payment',
  referral_bonus: 'Referral Bonus',
  maintenance: 'Maintenance',
  other: 'Other',
}

const STATUS_STYLES = {
  paid: 'bg-green-900/30 text-green-400 border border-green-500/30',
  pending: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30',
  partial: 'bg-blue-900/30 text-blue-400 border border-blue-500/30',
}

export default function AdminEarnings() {
  const [earnings, setEarnings] = useState([])
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editEarning, setEditEarning] = useState(null)
  const [form, setForm] = useState({
    client_id: '',
    project_id: '',
    amount: '',
    type: 'project_payment',
    description: '',
    status: 'pending',
  })

  function loadData() {
    setLoading(true)
    Promise.all([
      fetch(`${API}/earnings`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/clients`, { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([earningsData, clientsData]) => {
        if (earningsData.ok) setEarnings(earningsData.earnings || [])
        if (clientsData.ok) setClients(clientsData.clients || [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (form.client_id) {
      fetch(`${API}/projects?client_id=${form.client_id}`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => {
          if (data.ok) setProjects(data.projects || [])
          else setProjects([])
        })
    } else {
      setProjects([])
    }
  }, [form.client_id])

  const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const paidEarnings = earnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const pendingEarnings = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + Number(e.amount || 0), 0)

  const clientTotals = {}
  earnings.forEach(e => {
    const name = e.client_name || 'Unknown'
    if (!clientTotals[name]) clientTotals[name] = { total: 0, paid: 0, pending: 0, count: 0 }
    clientTotals[name].total += Number(e.amount || 0)
    clientTotals[name].count++
    if (e.status === 'paid') clientTotals[name].paid += Number(e.amount || 0)
    if (e.status === 'pending') clientTotals[name].pending += Number(e.amount || 0)
  })

  function openAdd() {
    setEditEarning(null)
    setForm({ client_id: '', project_id: '', amount: '', type: 'project_payment', description: '', status: 'pending' })
    setProjects([])
    setShowModal(true)
  }

  function openEdit(earning) {
    setEditEarning(earning)
    setForm({
      client_id: earning.client_id || '',
      project_id: earning.project_id || '',
      amount: earning.amount || '',
      type: earning.type || 'project_payment',
      description: earning.description || '',
      status: earning.status || 'pending',
    })
    setShowModal(true)
  }

  async function handleSave() {
    const method = editEarning ? 'PUT' : 'POST'
    const body = editEarning ? { id: editEarning.id, ...form } : form

    await fetch(`${API}/earnings`, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(body),
    })
    setShowModal(false)
    loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this earning record?')) return
    await fetch(`${API}/earnings?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    loadData()
  }

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-white">Earnings</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-primary text-background rounded-md font-semibold hover:opacity-90 transition border border-primary text-sm"
        >
          <i className="fas fa-plus mr-2"></i>Add Earning
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card border border-slate p-4">
          <div className="text-xs text-gray-400 mb-1">Total Earnings</div>
          <div className="text-2xl font-heading font-bold text-white">{formatCurrency(totalEarnings)}</div>
        </div>
        <div className="card border border-slate p-4">
          <div className="text-xs text-gray-400 mb-1">Paid</div>
          <div className="text-2xl font-heading font-bold text-green-400">{formatCurrency(paidEarnings)}</div>
        </div>
        <div className="card border border-slate p-4">
          <div className="text-xs text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-heading font-bold text-yellow-400">{formatCurrency(pendingEarnings)}</div>
        </div>
      </div>

      {earnings.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-center py-8">
          No earnings yet. Add your first earning above.
        </div>
      ) : (
        <div className="card border border-slate overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate bg-secondary/50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Project</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map(e => (
                <tr key={e.id} className="border-b border-slate/50 hover:bg-secondary/30 transition">
                  <td className="px-4 py-3 text-gray-200">{e.client_name || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">{e.project_name || '-'}</td>
                  <td className="px-4 py-3 text-right font-medium text-white">{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-3 text-gray-300">{TYPE_LABELS[e.type] || e.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[e.status] || ''}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(e)}
                        className="px-3 py-1 text-xs border border-slate rounded-md text-gray-300 hover:border-primary hover:text-primary transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-3 py-1 text-xs border border-red-500/30 rounded-md text-red-400 hover:bg-red-900/20 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(clientTotals).length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-heading font-semibold text-white mb-3">
            <i className="fas fa-chart-pie mr-2 text-primary"></i>Earnings by Client
          </h2>
          <div className="space-y-2">
            {Object.entries(clientTotals).map(([name, data]) => (
              <div key={name} className="card border border-slate p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-200">{name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{data.count} earning{data.count !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-heading font-bold">{formatCurrency(data.total)}</div>
                  <div className="flex gap-3 text-xs mt-0.5">
                    <span className="text-green-400">Paid: {formatCurrency(data.paid)}</span>
                    <span className="text-yellow-400">Pending: {formatCurrency(data.pending)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-secondary border border-slate rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-heading font-semibold text-white mb-4">
              {editEarning ? 'Edit Earning' : 'Add Earning'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Client</label>
                <select
                  value={form.client_id}
                  onChange={e => setForm({ ...form, client_id: e.target.value, project_id: '' })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                >
                  <option value="">Select client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project</label>
                <select
                  value={form.project_id}
                  onChange={e => setForm({ ...form, project_id: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                >
                  <option value="">Select project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                >
                  <option value="project_payment">Project Payment</option>
                  <option value="referral_bonus">Referral Bonus</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate rounded-md text-gray-300 hover:border-primary transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-background rounded-md font-semibold hover:opacity-90 transition border border-primary text-sm"
              >
                {editEarning ? 'Save Changes' : 'Add Earning'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
