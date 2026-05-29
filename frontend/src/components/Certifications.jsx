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
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadCertificates().then(data => setCertificates(data.certificates || []))
  }, [])

  if (certificates.length === 0) return null

  const ids = new Set(certificates.map(c => c.id)).size

  const tabList = [
    { id: 'all', label: 'All' },
    ...Array.from(new Set(certificates.map(c => c.id))).map(id => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1)
    }))
  ]

  const sliced = showAll ? certificates : certificates.slice(0, ids)
  const visibleCertificates = activeTab === 'all'
    ? sliced
    : sliced.filter(c => c.id === activeTab)
  const hiddenCount = certificates.length - ids
  const grouped = visibleCertificates.reduce((acc, cert) => {
    if (!acc[cert.id]) acc[cert.id] = []
    acc[cert.id].push(cert)
    return acc
  }, {})

  return (
    <section id="certifications" className="mt-12">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-heading font-semibold text-goldlight">Certifications & Achievements</h2>
        {certificates.length > ids && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors"
          >
            {showAll ? 'Show Less' : `Show More (${hiddenCount} more)`}
          </button>
        )}
      </div>
      <hr className="border-slate mb-6" />

      <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
        {tabList.map(tab => {
          const totalCount = tab.id === 'all'
            ? certificates.length
            : certificates.filter(c => c.id === tab.id).length

          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors
                ${isActive
                  ? 'border-primary text-primary bg-transparent'
                  : 'border-slate text-gray-400 hover:border-gray-500 hover:text-gray-300 bg-transparent'
                }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full border
                ${isActive
                  ? 'border-primary text-primary'
                  : 'border-slate text-gray-500'
                }`}
              >
                {totalCount}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {Object.entries(grouped).map(([id, certs]) => {
          const totalInGroup = certificates.filter(c => c.id === id).length
          const isPartial = certs.length < totalInGroup && !showAll

          return (
            <div key={id} className="border border-slate rounded-lg overflow-hidden">
              {activeTab === 'all' && (
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate bg-black/20">
                  <div className="w-8 h-8 rounded-md border border-slate flex items-center justify-center text-xs font-bold text-gray-300 uppercase flex-shrink-0">
                    {id.slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-gray-200 capitalize flex-1">
                    {id}
                  </span>
                  <span className="text-xs text-gray-500 border border-slate rounded-full px-2 py-0.5">
                    {totalInGroup} certificate{totalInGroup !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {certs.map((cert, i) => (
                <div
                  key={cert.name}
                  onClick={() => setSelectedCert(cert)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:border-primary transition group
                    ${i < certs.length - 1 ? 'border-b border-slate' : ''}`}
                >
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-200 group-hover:text-primary transition">
                      {cert.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-600 text-xs mt-1 flex-shrink-0" />
                </div>
              ))}

              {isPartial && (
                <div className="px-4 py-2 border-t border-slate">
                  <p className="text-xs text-gray-500 italic">
                    Showing {certs.length} of {totalInGroup} — expand to see all
                  </p>
                </div>
              )}
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
