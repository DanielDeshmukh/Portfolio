'use client'
import Navbar from '../../../components/Navbar'
import ProjectDetail from '../../../components/ProjectDetail'

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <ProjectDetail />
      </main>
    </div>
  )
}
