'use client'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Pricing &amp; Services</h1>
        <p className="text-gray-400 text-sm mb-10">Transparent pricing for development and maintenance services.</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-code mr-2"></i>Development Services
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Every project is different. Development pricing is quoted individually after understanding your requirements, scope, and complexity. There are no hidden charges — the quoted price is the final price.
            </p>
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">What&apos;s Included in Development</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>UI/UX design and frontend development</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Backend development and database setup</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Testing and bug fixes before delivery</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Deployment to production (Vercel, Netlify, or your hosting)</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Source code ownership transferred to you</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-tools mr-2"></i>Maintenance Services
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              After project delivery, maintenance is billed monthly. The fee depends on the project type, complexity, and the level of support required. Maintenance fees are discussed and agreed upon before project handover.
            </p>
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">What&apos;s Covered Under Maintenance</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Bug fixes and issue resolution</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Security updates and dependency patches</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Minor content or data updates</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Uptime monitoring and server management</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                <i className="fas fa-info-circle mr-1"></i>
                Major feature additions or redesigns are quoted separately and not included in the maintenance plan.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-wallet mr-2"></i>Payment Terms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Development Payment</h3>
                <ul className="space-y-1.5 text-sm text-gray-300">
                  <li>• Upfront advance required before work begins</li>
                  <li>• Remaining amount due on project delivery</li>
                  <li>• Upfront advance is non-refundable</li>
                </ul>
              </div>
              <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Maintenance Payment</h3>
                <ul className="space-y-1.5 text-sm text-gray-300">
                  <li>• Billed monthly, due at the start of each month</li>
                  <li>• Payment accepted via UPI or Bank Transfer</li>
                  <li>• Monthly fee is non-refundable once the month begins</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-gift mr-2"></i>Referral Program
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Existing clients can earn maintenance discounts by referring new clients. Each client receives up to 3 referral codes per year. Discounts are applied automatically when a referred client signs up. Visit the <a href="/#clients" className="text-primary hover:underline">Clients</a> section for more details.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
