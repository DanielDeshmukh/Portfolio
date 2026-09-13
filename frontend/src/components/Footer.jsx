import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate/50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing &amp; Services</Link></li>
              <li><Link href="/enquiry" className="hover:text-primary transition-colors">Get a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-primary transition-colors">Refund &amp; Cancellation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://github.com/DanielDeshmukh" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/daniel-deshmukh-7b08602b2" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="https://x.com/DeshmukhDa71837" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">X (Twitter)</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:deshmukhdaniel2005@gmail.com" className="hover:text-primary transition-colors">deshmukhdaniel2005@gmail.com</a></li>
              <li><a href="tel:8552084251" className="hover:text-primary transition-colors">+91 8552084251</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Daniel Shashank Deshmukh. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with Next.js &amp; deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
