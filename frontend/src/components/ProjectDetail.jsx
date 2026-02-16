import React, { useEffect, useState } from 'react'
import { loadProjects } from '../utils/loadData'

export default function ProjectDetail({ projectId, onClose }) {
  const [project, setProject] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    loadProjects().then(data => {
      const found = data.projects.find(p => p.id === projectId)
      setProject(found)
      
      if (found && found.images) {
        const processedImages = found.images.map(img => {
          if (typeof img === 'string') {
            return { file: img, caption: '' }
          }
          return img
        })
        setScreenshots(processedImages)
      }
    })
  }, [projectId])

  if (!project) return null

  const currentImage = screenshots[selectedImageIndex]
  const currentImageSrc = currentImage ? `/${currentImage.file}` : null

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <button
          onClick={onClose}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-primary transition border border-gray-600 hover:border-primary rounded-md px-3 py-1"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-heading text-white mb-4">{project.name}</h1>
            <div className="flex gap-4 flex-wrap">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md font-semibold hover:opacity-90 transition border border-primary"
                >
                  <i className="fab fa-github"></i> GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-md font-semibold hover:opacity-90 transition border border-accent"
                >
                  <i className="fas fa-globe"></i> Live Demo
                </a>
              )}
            </div>
            {(() => {
              const status = project.status ?? (project.live ? 'deployed' : 'under-development')
              const progress = typeof project.progress === 'number' ? project.progress : (project.live ? 100 : 0)
              const statusLabel = status === 'deployed' ? 'Deployed' : 'In progress'
              const statusClasses = status === 'deployed' ? 'bg-green-400 text-black' : 'bg-yellow-400 text-black'

              return (
                <div className="mt-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses} border border-gray-800`}>
                      {statusLabel}
                    </div>
                    <div className="text-sm text-gray-300">
                      {progress}%
                    </div>
                  </div>

                  <div className="w-full bg-gray-800 rounded h-3 overflow-hidden border border-gray-700">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    />
                  </div>
                </div>
              )
            })()}
          </div>

          <div>
            <h2 className="text-2xl font-heading mb-3">Overview</h2>
            <p className="text-gray-200 text-lg leading-relaxed">{project.description}</p>
          </div>

          {screenshots.length > 0 && (
            <div>
              <h2 className="text-2xl font-heading mb-4">Screenshots</h2>
              <div className="space-y-4">
                <div className="card p-0 overflow-hidden">
                  <div className="w-full bg-black/50">
                    <img
                      src={currentImageSrc}
                      alt={`${project.name} screenshot`}
                      className="w-full h-auto"
                    />
                  </div>
                  {currentImage?.caption && (
                    <div className="p-3 bg-secondary border-t border-gray-700">
                      <p className="text-gray-200 text-sm">{currentImage.caption}</p>
                    </div>
                  )}
                </div>

                {screenshots.length > 1 && (
                  <div className="flex gap-4 items-center justify-between">
                    <button
                      onClick={prevImage}
                      className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary hover:text-black transition border border-gray-600 hover:border-primary"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="text-gray-300">
                      {selectedImageIndex + 1} / {screenshots.length}
                    </span>
                    <button
                      onClick={nextImage}
                      className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary hover:text-black transition border border-gray-600 hover:border-primary"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}

                {screenshots.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {screenshots.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-full aspect-square rounded overflow-hidden border-2 transition ${
                          idx === selectedImageIndex
                            ? 'border-primary'
                            : 'border-gray-600 hover:border-primary'
                        }`}
                        title={img.caption}
                      >
                        <img
                          src={`/${img.file}`}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-heading mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech?.map((t) => (
                <span
                  key={t}
                  className="px-3 py-2 bg-secondary text-gray-200 rounded-md border border-gray-600 hover:border-primary transition"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
