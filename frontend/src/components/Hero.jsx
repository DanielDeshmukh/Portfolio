import React from 'react'

export default function Hero({profile}){
  if(!profile) return <section id="home" className="py-20" />
  return (
    <section id="home" className="py-20 fade-up">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-heading leading-tight text-white">{profile.name}</h1>
          <p className="mt-4 text-accent max-w-xl">{profile.tagline}</p>
          <div className="mt-6 flex gap-4">
            <a href="#contact" className="px-4 py-2 bg-primary text-black rounded-md font-semibold hover:opacity-90 transition inline-flex items-center gap-2 border border-primary hover:border-primary"><i className="fas fa-envelope"></i> Contact</a>
            <a href="#projects" className="px-4 py-2 border border-accent text-accent rounded-md hover:bg-secondary transition hover:border-primary">View Projects</a>
          </div>
        </div>
      </div>
    </section>
  )
}
