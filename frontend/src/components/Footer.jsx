import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-slate/30 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Services</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/pricing" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-code text-xs w-4 text-center text-gray-500"></i>
                  Pricing &amp; Services
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-paper-plane text-xs w-4 text-center text-gray-500"></i>
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/referral-program" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-gift text-xs w-4 text-center text-gray-500"></i>
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-file-contract text-xs w-4 text-center text-gray-500"></i>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-shield-halved text-xs w-4 text-center text-gray-500"></i>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-rotate-left text-xs w-4 text-center text-gray-500"></i>
                  Refund &amp; Cancellation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Connect</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="https://github.com/DanielDeshmukh" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fab fa-github text-xs w-4 text-center text-gray-500"></i>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/daniel-deshmukh-7b08602b2" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fab fa-linkedin text-xs w-4 text-center text-gray-500"></i>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/DeshmukhDa71837" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fab fa-x-twitter text-xs w-4 text-center text-gray-500"></i>
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:deshmukhdaniel2005@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-envelope text-xs w-4 text-center text-gray-500"></i>
                  <span className="break-all">deshmukhdaniel2005@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:8552084251" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fas fa-phone text-xs w-4 text-center text-gray-500"></i>
                  +91 8552084251
                </a>
              </li>
              <li>
                <a href="https://wa.me/918552084251" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <i className="fab fa-whatsapp text-xs w-4 text-center text-gray-500"></i>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate/30 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center">
              <span className="text-primary font-heading text-xs font-bold">D</span>
            </div>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Daniel Shashank Deshmukh
            </p>
          </div>
          <p className="text-xs text-gray-600">All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
