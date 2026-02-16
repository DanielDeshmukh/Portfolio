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

  useEffect(() => {
    loadCertificates().then(data => setCertificates(data.certificates || []))
  }, [])

  if (certificates.length === 0) return null

  return (
    <section id="certifications" className="mt-12">
      <h2 className="text-2xl font-heading">Certifications & Achievements</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {certificates.map(cert => (
          <div
            key={cert.id}
            onClick={() => setSelectedCert(cert)}
            className="card p-3 border border-gray-700 hover:border-primary transition cursor-pointer group"
          >
            <div className="w-full h-40 rounded overflow-hidden bg-black/20 mb-3">
              <img
                src={`/${cert.file}`}
                alt={cert.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onContextMenu={e => e.preventDefault()}
                draggable={false}
              />
            </div>
            <h3 className="font-heading text-base group-hover:text-primary transition">{cert.name}</h3>
            <p className="text-xs text-gray-300 mt-1">{cert.description}</p>
          </div>
        ))}
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center overflow-y-auto p-4 user-select-none">
      <div className="max-w-3xl w-full">
        <button
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-2 text-gray-300 hover:text-primary transition border border-gray-600 hover:border-primary rounded-md px-2 py-1 text-sm"
        >
          <i className="fas fa-arrow-left"></i> Close
        </button>

        <div className="bg-black/40 rounded-lg p-6 backdrop-blur border border-gray-700">
          <div className="mb-3">
            <h2 className="text-2xl font-heading text-white mb-2">{certificate.name}</h2>
            <p className="text-xs text-gray-300">{certificate.description}</p>
            <p className="text-xs text-gray-500 mt-2 italic">For privacy protection, this certificate cannot be downloaded or screenshotted.</p>
          </div>

          <div className="relative bg-black/20 rounded-lg overflow-hidden border border-gray-600">
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
