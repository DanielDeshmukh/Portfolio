import React, {useEffect, useState} from 'react'
import ProjectCard from './ProjectCard'

export default function Projects(){
  const [data, setData] = useState(null)
  useEffect(()=>{
    fetch('/src/data/projects.json').then(r=>r.json()).then(setData)
  },[])

  if(!data) return null
  return (
    <section id="projects" className="mt-12">
      <h2 className="text-2xl font-heading">Projects</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {data.projects.map(p=> <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  )
}
