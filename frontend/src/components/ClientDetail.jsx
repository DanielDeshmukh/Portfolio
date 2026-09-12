import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadClients } from '../utils/loadData'

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)

  useEffect(() => {
    loadClients().then(data => {
      const found = data.clients.find(c => c.id === id)
      setClient(found)
    })
  }, [id])

  if (!client) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-primary transition border border-slate hover:border-primary rounded-md px-3 py-1"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <img
              src={`/${client.logo}`}
              alt={client.name}
              className="w-24 h-24 object-contain"
            />
            <div>
              <h1 className="text-4xl font-heading font-bold text-white">{client.name}</h1>
              <p className="text-accent mt-1">Client since {client.relationSince}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-heading font-semibold mb-3 text-goldlight">About</h2>
            <p className="text-gray-200 text-lg leading-relaxed">{client.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-heading font-semibold mb-3 text-goldlight">Contact Details</h2>
            <div className="card border border-slate space-y-3">
              {client.contact.phone && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone text-accent"></i>
                  <span className="text-gray-400 text-sm">Phone</span>
                  <a href={`tel:${client.contact.phone}`} className="text-gray-200 hover:text-primary transition">
                    {client.contact.phone}
                  </a>
                </div>
              )}
              {client.contact.email && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-accent"></i>
                  <span className="text-gray-400 text-sm">Email</span>
                  <a href={`mailto:${client.contact.email}`} className="text-gray-200 hover:text-primary transition">
                    {client.contact.email}
                  </a>
                </div>
              )}
              {client.contact.website && (
                <div className="flex items-center gap-3">
                  <i className="fas fa-globe text-accent"></i>
                  <span className="text-gray-400 text-sm">Website</span>
                  <a href={client.contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-primary transition">
                    {client.contact.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {client.projects && client.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-3 text-goldlight">Projects</h2>
              <div className="space-y-3">
                {client.projects.map((proj, i) => (
                  <div key={i} className="card border border-slate flex items-center justify-between">
                    <span className="text-gray-200 font-semibold">{proj.name}</span>
                    <div className="flex gap-3">
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-background rounded-md text-sm font-semibold hover:opacity-90 transition border border-primary"
                        >
                          <i className="fab fa-github"></i> GitHub
                        </a>
                      )}
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-background rounded-md text-sm font-semibold hover:opacity-90 transition border border-accent"
                        >
                          <i className="fas fa-globe"></i> Live
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
