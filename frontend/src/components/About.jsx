import React from 'react'

export default function About({profile}){
  if(!profile) return null
  return (
    <section id="about" className="mt-12">
      <h2 className="text-2xl font-heading font-semibold text-goldlight">About</h2>
      <div className="mt-4 card border border-slate hover:border-primary transition">
        <p className="text-gray-200 text-sm">{profile.bio}</p>
        <div className="mt-3 text-xs text-accent whitespace-pre-line">{profile.education}</div>
      </div>
    </section>
  )
}
