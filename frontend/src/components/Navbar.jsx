import React, {useState} from 'react'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const items = [
    ['Home','#home'],
    ['About','#about'],
    ['Skills','#skills'],
    ['Projects','#projects'],
    ['Certifications','#certifications'],
    ['Resume','#resume'],
    ['Contact','#contact']
  ]

  const handleNavClick = (href) => {
    setOpen(false)
    // Smooth scroll behavior
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur z-40 border-b border-gray-800/50 hover:border-gray-700 transition">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-primary font-heading text-xl">Daniel Shashank Deshmukh</div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {items.map(([label,href])=> (
            <a key={label} href={href} onClick={(e) => {e.preventDefault(); handleNavClick(href)}} className="text-gray-200 hover:text-primary transition border border-transparent hover:border-primary rounded-md px-3 py-1">{label}</a>
          ))}
        </div>
        <button className="md:hidden text-xl" onClick={()=>setOpen(!open)} aria-label="menu"><i className="fas fa-bars"></i></button>
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
