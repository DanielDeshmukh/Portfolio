import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Clients from './components/Clients'
import Skills from './components/Skills'
import Projects from './components/Projects'
import ProjectDetail from './components/ProjectDetail'
import Certifications from './components/Certifications'
import Resume from './components/Resume'
import HireMe from './components/HireMe'
import Contact from './components/Contact'
import ClientDetail from './components/ClientDetail'
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminClients from './components/admin/AdminClients'
import AdminClientDetail from './components/admin/AdminClientDetail'
import AdminReferrals from './components/admin/AdminReferrals'
import AdminRoute from './components/admin/AdminRoute'
import { loadProfile } from './utils/loadData'

function HomePage({ profile, saveProfile }) {
  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Clients />
      <Skills profile={profile} onSave={saveProfile} />
      <Projects />
      <Certifications />
      <Resume />
      <Contact profile={profile} />
    </>
  )
}

export default function App(){
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
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="clients/:id" element={<AdminClientDetail />} />
          <Route path="referrals/:projectId" element={<AdminReferrals />} />
        </Route>
        <Route path="*" element={
          <>
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
              <Routes>
                <Route path="/" element={<HomePage profile={profile} saveProfile={saveProfile} />} />
                <Route path="/hire" element={<HireMe />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
              </Routes>
            </main>
          </>
        } />
      </Routes>
    </div>
  )
}
