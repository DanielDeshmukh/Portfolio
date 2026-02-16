import React from "react";

function Img({ src, alt }) {
  if (!src) return null;

  return (
    <div className="w-full h-48 rounded overflow-hidden bg-black/10">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function ProjectCard({ project, onClick }) {
  if (!project) return null;

  let imageSrc = null;
  if (project.images && project.images.length > 0) {
    const firstImage = project.images[0];
    imageSrc = typeof firstImage === 'string' ? `/${firstImage}` : `/${firstImage.file}`;
  }

  const status = project.status ?? (project.live ? 'deployed' : 'under-development')
  const statusLabel = status === 'deployed' ? 'Deployed' : 'In progress'
  const statusClasses = status === 'deployed' ? 'bg-green-400 text-black' : 'bg-yellow-400 text-black'

  return (
    <article onClick={onClick} className="relative card flex flex-col p-5 cursor-pointer border border-gray-700 hover:border-primary transition group">
      <div className="mb-4">
        <Img src={imageSrc} alt={project.name} />
      </div>

      <div className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full ${statusClasses} border border-gray-800`}>
        {statusLabel}
      </div>

      <h3 className="font-heading text-lg group-hover:text-primary transition">
        {project.name}
      </h3>

      <p className="text-sm text-gray-200 mt-2 flex-1">
        {project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech?.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-1 bg-background/40 rounded border border-gray-700 group-hover:border-primary transition"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-accent hover:text-primary border border-gray-700 hover:border-primary rounded-md px-2 py-1 transition"
          >
            <i className="fab fa-github"></i>
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-accent hover:text-primary border border-gray-700 hover:border-primary rounded-md px-2 py-1 transition"
          >
            Live
          </a>
        )}
      </div>
    </article>
  );
}

