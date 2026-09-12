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

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editClient, setEditClient] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', website: '', relation_since: '', description: '' })

  function loadClients() {
    setLoading(true)
    fetch(`${API}/clients`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.ok) setClients(data.clients)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadClients() }, [])

  function openAdd() {
    setEditClient(null)
    setForm({ name: '', phone: '', email: '', website: '', relation_since: '', description: '' })
    setShowModal(true)
  }

  function openEdit(client) {
    setEditClient(client)
    setForm({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
      website: client.website || '',
      relation_since: client.relation_since || '',
      description: client.description || '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    const method = editClient ? 'PUT' : 'POST'
    const body = editClient ? { id: editClient.id, ...form } : form

    await fetch(`${API}/clients`, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(body),
    })
    setShowModal(false)
    loadClients()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this client and all their projects/referrals?')) return
    await fetch(`${API}/clients?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    loadClients()
  }

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-white">Clients</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-primary text-background rounded-md font-semibold hover:opacity-90 transition border border-primary text-sm"
        >
          <i className="fas fa-plus mr-2"></i>Add Client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-center py-8">
          No clients yet. Add your first client above.
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map(client => (
            <div key={client.id} className="card border border-slate flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-xs font-bold text-gray-300 uppercase flex-shrink-0">
                  {client.name?.slice(0, 2)}
                </div>
                <div>
                  <Link href={`/admin/clients/${client.id}`} className="font-semibold text-gray-200 hover:text-primary transition">
                    {client.name}
                  </Link>
                  <div className="flex gap-4 text-xs text-gray-400 mt-0.5">
                    {client.phone && <span><i className="fas fa-phone mr-1"></i>{client.phone}</span>}
                    <span><i className="fas fa-folder mr-1"></i>{client.project_count || 0} projects</span>
                    <span><i className="fas fa-share-alt mr-1"></i>{client.total_referrals || 0} referrals</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="px-3 py-1 text-xs border border-slate rounded-md text-gray-300 hover:border-primary hover:text-primary transition"
                >
                  View
                </Link>
                <button
                  onClick={() => openEdit(client)}
                  className="px-3 py-1 text-xs border border-slate rounded-md text-gray-300 hover:border-primary hover:text-primary transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="px-3 py-1 text-xs border border-red-500/30 rounded-md text-red-400 hover:bg-red-900/20 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-secondary border border-slate rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-heading font-semibold text-white mb-4">
              {editClient ? 'Edit Client' : 'Add Client'}
            </h2>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Name', required: true },
                { key: 'phone', label: 'Phone' },
                { key: 'email', label: 'Email' },
                { key: 'website', label: 'Website' },
                { key: 'relation_since', label: 'Client Since (year)' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
                  <input
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                    required={field.required}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100 resize-none"
                />
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
                {editClient ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
