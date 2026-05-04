import React, { useState, useEffect } from 'react'
import {
  Figma,
  Github,
  Vite,
  Groq,
  HttpieIcon as Httpie,
  Langchain,
  NetlifyIcon as Netlify,
  NodejsIcon as Nodejs,
  Postgresql,
  Python,
  SupabaseIcon as Supabase,
  TailwindIcon as Tailwind,
  Websocket,
} from '@dev.icons/react'

import { _React } from '@dev.icons/react'

const skillIconMap = {
  'Node.js': Nodejs,
  Supabase,
  Vite,
  TailwindCSS: Tailwind,
  Python,
  Groq,
  PostgreSQL: Postgresql,
  Netlify,
  Figma,
  _React,
  HTTPie: Httpie,
  Websocket,
  Websockets: Websocket,
  GitHub: Github,
  github: Github,
  LangChain: Langchain,
  Langchain,
}

const whiteBgIconSkills = new Set(['HTTPie', 'Websocket', 'Websockets', 'GitHub', 'github','Groq'])

export default function Skills({ profile, adminMode, onSave }) {
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || [])
    }
  }, [profile])

  function addSkill() {
    if (!newSkill.trim()) return

    const updatedSkills = [...skills, newSkill.trim()]
    setSkills(updatedSkills)
    setNewSkill('')

    if (onSave) {
      onSave({ ...profile, skills: updatedSkills })
    }
  }

  function deleteSkill(index) {
    const updatedSkills = skills.filter((_, i) => i !== index)
    setSkills(updatedSkills)

    if (onSave) {
      onSave({ ...profile, skills: updatedSkills })
    }
  }

  const visibleSkills = showAll ? skills : skills.slice(0, 8)

  return (
    <section id="skills" className="mt-12 scroll-mt-24">
      <div className="flex justify-between items-end gap-4">
        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-goldlight">
          Skills
        </h2>

        {skills.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors"
          >
            {showAll ? 'Show Less' : `View All (${skills.length})`}
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleSkills.map((skill, index) => {
          const IconComponent = skillIconMap[skill]
          const needsWhiteIconBg = whiteBgIconSkills.has(skill)

          return (
            <div
              key={skill + index}
              className="card flex items-center gap-4 p-3 rounded-lg bg-secondary hover:bg-slate/30 border border-slate hover:border-primary transition"
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                {IconComponent ? (
                  <div className={needsWhiteIconBg ? 'rounded-md bg-white p-1' : ''}>
                    <IconComponent size="32" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-background/60 rounded flex items-center justify-center text-[10px] text-accent">
                    {skill.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-gray-100">
                  {skill}
                </div>

                {adminMode && (
                  <div className="text-xs text-accent">
                    editable
                  </div>
                )}
              </div>

              {adminMode && (
                <button
                  onClick={() => deleteSkill(index)}
                  className="text-red-400 hover:text-red-300 transition flex-shrink-0"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {adminMode && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="New skill"
            className="px-4 py-2 bg-secondary rounded-md flex-1 outline-none border border-slate focus:border-primary transition"
          />

          <button
            onClick={addSkill}
            className="px-5 py-2 bg-primary text-background rounded-md hover:opacity-90 transition whitespace-nowrap border border-primary hover:border-goldlight"
          >
            Add Skill
          </button>
        </div>
      )}
    </section>
  )
}
