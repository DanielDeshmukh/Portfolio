import React from 'react'

export default function About({profile}){
  if(!profile) return null
  return (
    <section id="about" className="mt-12">
      <h2 className="text-2xl font-heading">About</h2>
      <div className="mt-4 card border border-gray-700 hover:border-primary transition">
        <p className="text-gray-200">{profile.bio}</p>
        <div className="mt-4 text-sm text-accent whitespace-pre-line">{profile.education}</div>
      </div>
    </section>
  )
}
