'use client'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Clients from '../components/Clients'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Certifications from '../components/Certifications'
import Resume from '../components/Resume'
import Contact from '../components/Contact'
import { loadProfile } from '../utils/loadData'

export default function HomePage() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const local = localStorage.getItem('profile_override')
    if (local) {
      setProfile(JSON.parse(local))
    } else {
      loadProfile().then(setProfile)
    }
  }, [])

  function saveProfile(updated) {
    setProfile(updated)
    localStorage.setItem('profile_override', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <Hero profile={profile} />
        <About profile={profile} />
        <Clients />
        <Skills profile={profile} onSave={saveProfile} />
        <Projects />
        <Certifications />
        <Resume />
        <Contact profile={profile} />
      </main>
    </div>
  )
}
