import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Resume from './components/Resume'
import Contact from './components/Contact'
import AdminGate from './components/AdminGate'
import AdminPanel from './components/AdminPanel'
import { loadProfile } from './utils/loadData'

export default function App(){
  const [adminMode, setAdminMode] = useState(false)
  const [profile, setProfile] = useState(null)

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

  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <Hero profile={profile} />
        <Skills profile={profile} adminMode={adminMode} onSave={saveProfile} />
        <Projects />
        <Resume />
        <Contact profile={profile} />
      </main>
      <AdminGate onEnable={()=>setAdminMode(true)} />
      {adminMode && <AdminPanel profile={profile} onClose={()=>setAdminMode(false)} onSave={saveProfile} />}
    </div>
  )
}
