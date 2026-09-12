'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadClients } from '../utils/loadData'

export default function ClientDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [refInfo, setRefInfo] = useState(null)

  useEffect(() => {
    loadClients().then(data => {
      const found = data.clients.find(c => c.id === id)
      setClient(found)
      if (found) {
        fetch(`/api/referral-count?client_name=${encodeURIComponent(found.name)}`)
          .then(r => r.json())
          .then(d => { if (d.ok) setRefInfo(d.projects) })
          .catch(() => {})
      }
    })
  }, [id])

  const totalAvailable = refInfo ? refInfo.reduce((s, p) => s + parseInt(p.available || 0), 0) : 0

  function requestReferral() {
    const msg = encodeURIComponent(
      `Hi ${client?.name} team, I found Daniel through his portfolio and I'm interested in his services. Could you share a referral code with me? It would give me 50% off the first month's maintenance. Thank you!`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  if (!client) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-primary transition border border-slate hover:border-primary rounded-md px-3 py-1"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <img
              src={client.logo?.startsWith('http') ? client.logo : `/${client.logo}`}
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

          <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <i className="fas fa-gift text-primary"></i>
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">Referrals</h2>
                <p className="text-gray-400 text-xs">Ask this client for a referral code</p>
              </div>
            </div>

            {refInfo && refInfo.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {refInfo.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-background/50 rounded-lg px-4 py-2.5">
                      <span className="text-sm text-gray-300">{p.project_name}</span>
                      <div className="flex items-center gap-2">
                        {p.available > 0 ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            {p.available} slot{p.available !== 1 ? 's' : ''} left
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500">all slots used</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalAvailable > 0 ? (
                  <div className="bg-green-900/15 border border-green-500/20 rounded-lg p-4">
                    <p className="text-green-300 text-sm font-medium mb-2">
                      <i className="fas fa-check-circle mr-1"></i>
                      {totalAvailable} referral slot{totalAvailable !== 1 ? 's' : ''} available
                    </p>
                    <p className="text-gray-400 text-xs mb-3">Reach out and ask for a code. You&apos;ll get 50% off your first month&apos;s maintenance.</p>
                    <button
                      onClick={requestReferral}
                      className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <i className="fab fa-whatsapp text-base"></i>
                      Ask {client.name.split(' ')[0]} for a Referral
                    </button>
                  </div>
                ) : (
                  <div className="bg-background/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm">All referral slots used for this year.</p>
                    <p className="text-gray-500 text-xs mt-1">New slots reset next year, or contact Daniel directly.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-spinner fa-spin text-gray-500 text-sm"></i>
                </div>
                <p className="text-gray-500 text-xs">Loading referral info...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
