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
            <a href="#contact" className="px-4 py-2 bg-primary text-black rounded-md font-semibold hover:opacity-90 transition inline-flex items-center gap-2"><i className="fas fa-envelope"></i> Contact</a>
            <a href="#projects" className="px-4 py-2 border border-accent text-accent rounded-md hover:bg-secondary transition">View Projects</a>
          </div>
        </div>
        <div className="card">
          <h3 className="font-heading text-2xl">About</h3>
          <p className="mt-3 text-sm text-gray-200">{profile.bio}</p>
          <div className="mt-4 text-sm text-accent whitespace-pre-line">{profile.education}</div>
        </div>
      </div>
    </section>
  )
}
