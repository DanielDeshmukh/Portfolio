import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div>
            <p className="text-sm font-medium text-gray-300 mb-1">Daniel Deshmukh</p>
            <p className="text-xs text-gray-500 mb-5">Full-Stack Developer</p>
            <div className="flex items-center gap-3">
              <a href="https://x.com/DeshmukhDa71837" target="_blank" rel="noreferrer" aria-label="X" className="w-9 h-9 rounded-full border border-slate/60 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                <i className="fab fa-x-twitter text-sm"></i>
              </a>
              <a href="https://github.com/DanielDeshmukh" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-full border border-slate/60 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                <i className="fab fa-github text-sm"></i>
              </a>
              <a href="https://www.linkedin.com/in/daniel-deshmukh-7b08602b2" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-slate/60 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4">Navigation</p>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/#about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/#projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/#clients" className="hover:text-white transition-colors">Clients</Link></li>
              <li><Link href="/enquiry" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4">Contact</p>
            <a href="mailto:deshmukhdaniel2005@gmail.com" className="text-sm text-gray-300 hover:text-primary transition-colors break-all">
              deshmukhdaniel2005@gmail.com
            </a>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500">Available for projects</span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4">Based In</p>
            <p className="text-sm text-gray-300">Mumbai, India</p>
            <p className="text-xs text-gray-500 mt-2">Remote-Friendly</p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Daniel Shashank Deshmukh. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-gray-400 transition-colors">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
