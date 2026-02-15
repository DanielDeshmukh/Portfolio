import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import ProjectDetail from './components/ProjectDetail'
import Certifications from './components/Certifications'
import Resume from './components/Resume'
import Contact from './components/Contact'
import AdminGate from './components/AdminGate'
import AdminPanel from './components/AdminPanel'
import { loadProfile } from './utils/loadData'

export default function App(){
  const [adminMode, setAdminMode] = useState(false)
  const [profile, setProfile] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  useEffect(()=>{
    const local = localStorage.getItem('profile_override')
    if(local){
      setProfile(JSON.parse(local))
    } else {
      loadProfile().then(setProfile)
    }
  },[])

  function saveProfile(updated){
    setProfile(updated)
    localStorage.setItem('profile_override', JSON.stringify(updated))
  }

  if(selectedProjectId) {
    return (
      <div className="min-h-screen bg-background text-gray-100">
        <Navbar />
        <ProjectDetail projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills profile={profile} adminMode={adminMode} onSave={saveProfile} />
        <Projects onProjectClick={setSelectedProjectId} />
        <Certifications />
        <Resume />
        <Contact profile={profile} />
      </main>
      <AdminGate onEnable={()=>setAdminMode(true)} />
      {adminMode && <AdminPanel profile={profile} onClose={()=>setAdminMode(false)} onSave={saveProfile} />}
    </div>
  )
}
