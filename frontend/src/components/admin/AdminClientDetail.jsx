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

export default function AdminClientDetail() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [codes, setCodes] = useState({})
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectForm, setProjectForm] = useState({ name: '', github: '', live: '' })

  useEffect(() => {
    Promise.all([
      fetch(`${API}/clients`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/projects?client_id=${id}`, { headers: authHeaders() }).then(r => r.json()),
    ]).then(([clientsData, projectsData]) => {
      if (clientsData.ok) {
        const found = clientsData.clients.find(c => c.id === id)
        setClient(found)
      }
      if (projectsData.ok) {
        setProjects(projectsData.projects)
        projectsData.projects.forEach(p => loadCodes(p.id))
      }
    }).finally(() => setLoading(false))
  }, [id])

  function loadCodes(projectId) {
    const year = new Date().getFullYear()
    fetch(`${API}/referrals?project_id=${projectId}&year=${year}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setCodes(prev => ({ ...prev, [projectId]: data.codes }))
        }
      })
  }

  async function handleAddProject() {
    if (!projectForm.name) return
    await fetch(`${API}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ client_id: id, ...projectForm }),
    })
    setShowProjectModal(false)
    setProjectForm({ name: '', github: '', live: '' })

    const res = await fetch(`${API}/projects?client_id=${id}`, { headers: authHeaders() })
    const data = await res.json()
    if (data.ok) setProjects(data.projects)
  }

  async function handleDeleteProject(projectId) {
    if (!confirm('Delete this project and all its referral codes?')) return
    await fetch(`${API}/projects?id=${projectId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>
  if (!client) return <div className="text-red-400 py-8">Client not found</div>

  return (
    <div>
      <Link href="/admin/clients" className="text-sm text-gray-400 hover:text-primary transition mb-4 inline-block">
        <i className="fas fa-arrow-left mr-1"></i>Back to Clients
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-gray-300 uppercase border border-slate">
          {client.name?.slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">{client.name}</h1>
          <div className="flex gap-4 text-sm text-gray-400 mt-0.5">
            {client.phone && <span><i className="fas fa-phone mr-1"></i>{client.phone}</span>}
            {client.email && <span><i className="fas fa-envelope mr-1"></i>{client.email}</span>}
            {client.relation_since && <span>Client since {client.relation_since}</span>}
          </div>
        </div>
      </div>

      {client.description && (
        <div className="card border border-slate mb-6">
          <p className="text-gray-200 text-sm">{client.description}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-heading font-semibold text-goldlight">Projects</h2>
        <button
          onClick={() => setShowProjectModal(true)}
          className="px-3 py-1.5 bg-primary text-background rounded-md text-sm font-semibold hover:opacity-90 transition border border-primary"
        >
          <i className="fas fa-plus mr-1"></i>Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card border border-slate text-gray-400 text-sm text-center py-6">
          No projects yet
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const projectCodes = codes[project.id] || []
            const activeCount = projectCodes.filter(c => c.status === 'active').length

            return (
              <div key={project.id} className="card border border-slate p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-200">{project.name}</h3>
                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                      <span>
                        <i className="fas fa-ticket-alt mr-1"></i>
                        {activeCount}/3 active codes ({new Date().getFullYear()})
                      </span>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                          <i className="fab fa-github mr-1"></i>GitHub
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                          <i className="fas fa-globe mr-1"></i>Live
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/referrals/${project.id}`}
                      className="px-3 py-1 text-xs border border-primary/30 rounded-md text-primary hover:bg-primary/10 transition"
                    >
                      <i className="fas fa-ticket-alt mr-1"></i>Referrals
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-3 py-1 text-xs border border-red-500/30 rounded-md text-red-400 hover:bg-red-900/20 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {projectCodes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {projectCodes.map(code => (
                      <span
                        key={code.id}
                        className={`px-2 py-1 rounded text-xs font-mono border ${
                          code.status === 'active'
                            ? 'border-green-500/30 text-green-400 bg-green-900/10'
                            : code.status === 'used'
                            ? 'border-yellow-500/30 text-yellow-400 bg-yellow-900/10'
                            : 'border-gray-500/30 text-gray-500 bg-gray-900/10'
                        }`}
                      >
                        {code.code}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-secondary border border-slate rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-heading font-semibold text-white mb-4">Add Project</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project Name *</label>
                <input
                  value={projectForm.name}
                  onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">GitHub URL</label>
                <input
                  value={projectForm.github}
                  onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Live URL</label>
                <input
                  value={projectForm.live}
                  onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                  className="w-full px-3 py-2 bg-background rounded-md border border-slate focus:border-primary outline-none text-sm text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-slate rounded-md text-gray-300 hover:border-primary transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-primary text-background rounded-md font-semibold hover:opacity-90 transition border border-primary text-sm"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
