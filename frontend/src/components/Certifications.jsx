import React, { useEffect, useState } from 'react'

const loadCertificates = async () => {
  try {
    const response = await fetch('/data/certificates.json')
    return await response.json()
  } catch (err) {
    console.error('Error loading certificates:', err)
    return { certificates: [] }
  }
}

export default function Certifications() {
  const [certificates, setCertificates] = useState([])
  const [selectedCert, setSelectedCert] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadCertificates().then(data => setCertificates(data.certificates || []))
  }, [])

  if (certificates.length === 0) return null

  const DOMAIN_MAP = {
    "AI & Tools": {
      icon: "fas fa-robot",
      ids: ["anthropic", "CS50", "samsung", "b10x"]
    },
    "Web Dev": {
      icon: "fas fa-code",
      ids: ["freeCodeCamp"]
    },
    "Finance": {
      icon: "fas fa-chart-line",
      ids: ["b10x"]
    },
    "Workshops": {
      icon: "fas fa-chalkboard-teacher",
      ids: ["samsung", "b10x"]
    }
  }

  const visibleCertificates = showAll ? certificates : certificates.slice(0, 4)
  const groupedCerts = visibleCertificates.reduce((acc, cert) => {
    if (!acc[cert.id]) acc[cert.id] = []
    acc[cert.id].push(cert)
    return acc
  }, {})

  return (
    <section id="certifications" className="mt-12">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-heading font-semibold text-goldlight">Certifications & Achievements</h2>
        {certificates.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors"
          >
            {showAll ? 'Show Less' : `Show More (${certificates.length - 4})`}
          </button>
        )}
      </div>
      <hr className="border-slate mb-6" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(DOMAIN_MAP).map(([domain, config]) => {
          const domainCount = certificates.filter(cert => config.ids.includes(cert.id)).length
          const progressSegments = Math.min(domainCount, certificates.length)

          return (
            <div key={domain} tabIndex={0} className="card p-3 border border-slate focus-visible:outline focus-visible:outline-1">
              <i className={`${config.icon} text-base text-gray-300`}></i>
              <h3 className="font-heading text-base font-semibold mt-2">{domain}</h3>
              <p className="text-xs text-gray-500 mt-1">{domainCount} cert(s)</p>
              <div className="mt-3 h-1 bg-black/20 rounded overflow-hidden">
                {progressSegments === 0 ? (
                  <div className="h-full w-1 border-t border-primary" />
                ) : (
                  <div className="h-full flex">
                    {certificates.map((cert, index) => (
                      <div
                        key={`${domain}-${cert.id}-${index}`}
                        className={`h-full flex-1 ${index < progressSegments ? 'border-t border-primary' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-4">
        {Object.entries(groupedCerts).map(([id, groupCertificates]) => {
          const totalGroupCount = certificates.filter(cert => cert.id === id).length
          const isPartialGroup = !showAll && groupCertificates.length < totalGroupCount

          return (
            <div
              key={id}
              className="card border border-slate rounded-lg"
            >
              <div className="flex items-center gap-3 border-b border-slate p-3">
                <div className="w-8 h-8 flex items-center justify-center border border-slate rounded-md p-2 text-xs font-bold uppercase text-gray-300">
                  {id.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-heading text-base font-semibold">
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </h3>
                <div className="ml-auto border border-slate rounded px-2 py-1 text-xs text-gray-300">
                  {groupCertificates.length} certificate(s)
                </div>
              </div>

              {isPartialGroup && (
                <p className="text-xs text-gray-500 italic px-4 py-3 border-b border-slate">
                  Showing {groupCertificates.length} of {totalGroupCount} &mdash; expand to see all
                </p>
              )}

              <div>
                {groupCertificates.map(cert => (
                  <div
                    key={cert.name}
                    onClick={() => setSelectedCert(cert)}
                    tabIndex={0}
                    className="border-b border-slate last:border-b-0 hover:border-primary transition cursor-pointer py-3 px-4 group focus-visible:outline focus-visible:outline-1"
                  >
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full border border-primary mt-2 flex-none" />
                      <div>
                        <h4 className="font-heading text-base font-semibold group-hover:text-primary transition">{cert.name}</h4>
                        <p className="text-xs text-gray-300 mt-1">{cert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedCert && (
        <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </section>
  )
}

function CertificateModal({ certificate, onClose }) {
  const handleImageContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  const handleImageMouseDown = (e) => {
    if (e.button === 2) e.preventDefault()
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 overflow-y-auto p-4 user-select-none">
      <div className="max-w-3xl w-full mx-auto">
        <button
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-2 text-gray-300 hover:text-primary transition border border-slate hover:border-primary rounded-md px-2 py-1 text-sm"
        >
          <i className="fas fa-arrow-left"></i> Close
        </button>

        <div className="bg-black/40 rounded-lg p-6 backdrop-blur border border-slate">
          <div className="mb-3">
            <h2 className="text-2xl font-heading font-semibold text-white mb-2">{certificate.name}</h2>
            <p className="text-xs text-gray-300">{certificate.description}</p>
            <p className="text-xs text-gray-500 mt-2 italic">For privacy protection, this certificate cannot be downloaded or screenshotted.</p>
          </div>

          <div className="relative bg-black/20 rounded-lg overflow-hidden border border-slate">
            <div className="absolute inset-0 pointer-events-none user-select-none z-40" />

            <img
              src={`/${certificate.file}`}
              alt={certificate.name}
              className="w-full h-auto select-none pointer-events-none"
              onContextMenu={handleImageContextMenu}
              onMouseDown={handleImageMouseDown}
              draggable={false}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
            />
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">
              This certificate view is protected. Thank you for respecting privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
