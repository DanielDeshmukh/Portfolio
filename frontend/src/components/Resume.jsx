import React from 'react'

export default function Resume(){
  return (
    <section id="resume" className="mt-12">
      <h2 className="text-2xl font-heading">Resume</h2>
      <div className="mt-4 card border border-gray-700 hover:border-primary transition">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <iframe title="resume" src="/resume/resume.pdf" className="w-full h-80 bg-black/10 rounded" />
          </div>
          <div className="w-full md:w-64 flex flex-col gap-3">
            <a href="/resume/resume.pdf" target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary text-black rounded-md inline-flex items-center gap-2 justify-center border border-primary hover:opacity-90 transition"><i className="fas fa-eye"></i> View Resume</a>
            <a href="/resume/resume.pdf" download className="px-4 py-2 border border-accent text-accent rounded-md inline-flex items-center gap-2 justify-center hover:border-primary hover:text-primary transition"><i className="fas fa-download"></i> Download Resume</a>
          </div>
        </div>
      </div>
    </section>
  )
}
