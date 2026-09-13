'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const items = [
    ['Home', '/'],
    ['About', '/#about'],
    ['Clients', '/#clients'],
    ['Skills', '/#skills'],
    ['Projects', '/#projects'],
    ['Certifications', '/#certifications'],
    ['Resume', '/#resume'],
    ['Enquiry', '/enquiry']
  ]

  const handleNavClick = (href) => {
    setOpen(false)
    if (href.startsWith('/#')) {
      const hash = href.slice(1)
      if (pathname === '/') {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        router.push('/')
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    } else if (href === '/') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        router.push('/')
      }
    } else {
      router.push(href)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/85 backdrop-blur z-40 border-b border-slate/70 hover:border-primary transition">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-primary font-heading text-xl font-semibold">Daniel Shashank Deshmukh</Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {items.map(([label,href])=> (
            <a key={label} href={href} onClick={(e) => {e.preventDefault(); handleNavClick(href)}} className="text-gray-200 hover:text-primary transition border border-transparent hover:border-primary rounded-md px-3 py-1">{label}</a>
          ))}
        </div>
        <button className="md:hidden text-xl text-primary" onClick={()=>setOpen(!open)} aria-label="menu"><i className="fas fa-bars"></i></button>
      </nav>
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {items.map(([label,href])=> (
            <a key={label} href={href} onClick={(e) => {e.preventDefault(); handleNavClick(href)}} className="block text-gray-200 py-2 border border-transparent hover:border-primary rounded-md px-3 transition">{label}</a>
          ))}
        </div>
      )}
    </header>
  )
}
