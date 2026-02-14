import React, {useState} from 'react'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const items = [
    ['Home','#home'],
    ['About','#about'],
    ['Skills','#skills'],
    ['Projects','#projects'],
    ['Resume','#resume'],
    ['Contact','#contact']
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur z-40">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-primary font-heading text-xl">Daniel Shashank Deshmukh</div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {items.map(([label,href])=> (
            <a key={label} href={href} className="text-gray-200 hover:text-primary transition">{label}</a>
          ))}
        </div>
        <button className="md:hidden text-xl" onClick={()=>setOpen(!open)} aria-label="menu"><i className="fas fa-bars"></i></button>
      </nav>
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {items.map(([label,href])=> (
            <a key={label} href={href} onClick={()=>setOpen(false)} className="block text-gray-200 py-2">{label}</a>
          ))}
        </div>
      )}
    </header>
  )
}
