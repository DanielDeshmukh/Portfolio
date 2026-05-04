import React, {useEffect, useState} from 'react'
import ProjectCard from './ProjectCard'
import { loadProjects } from '../utils/loadData'

export default function Projects({onProjectClick}){
  const [data, setData] = useState(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(()=>{
    loadProjects().then(setData)
  },[])

  if(!data) return null
  const visibleProjects = showAll ? data.projects : data.projects.slice(0, 3)

  return (
    <section id="projects" className="mt-12">
      <div className="flex justify-between items-end gap-4">
        <h2 className="text-2xl font-heading font-semibold text-goldlight">Projects</h2>
        {data.projects.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors"
          >
            {showAll ? 'Show Less' : `Show More (${data.projects.length})`}
          </button>
        )}
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {visibleProjects.map(p=> <ProjectCard key={p.id} project={p} onClick={() => onProjectClick(p.id)} />)}
      </div>
    </section>
  )
}
