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

export default function ProjectCard({ project }) {
  if (!project) return null;

  // Vite serves public folder from root "/"
  const imageSrc =
    project.images && project.images.length > 0
      ? `/${project.images[0]}`
      : null;

  return (
    <article className="card flex flex-col p-5">
      {/* Image */}
      <div className="mb-4">
        <Img src={imageSrc} alt={project.name} />
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg">
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-200 mt-2 flex-1">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech?.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-1 bg-background/40 rounded"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="mt-4 flex items-center gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:text-primary"
          >
            <i className="fab fa-github"></i>
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:text-primary"
          >
            Live
          </a>
        )}
      </div>
    </article>
  );
}
