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
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer || null }),
    }).catch(() => {})

    const local = localStorage.getItem('profile_override')
    if (local) {
      setProfile(JSON.parse(local))
    } else {
      loadProfile().then(setProfile)
    }
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const scrollTo = () => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    const t = setTimeout(scrollTo, 150)
    return () => clearTimeout(t)
  }, [profile])

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
