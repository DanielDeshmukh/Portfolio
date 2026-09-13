'use client'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: September 2026</p>

        <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">1. Information I Collect</h2>
            <div className="space-y-3">
              <p>I collect only the information necessary to provide my services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong className="text-white">Contact details:</strong> Name, email, phone number — provided by you during enquiry or project discussions</li>
                <li><strong className="text-white">Project information:</strong> Requirements, specifications, and related documents shared by you</li>
                <li><strong className="text-white">Payment information:</strong> UPI transaction IDs or bank transfer references — I do not store card numbers or banking credentials</li>
                <li><strong className="text-white">Login credentials:</strong> Admin panel credentials — stored securely and never shared with third parties</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">2. How I Use Your Information</h2>
            <div className="space-y-3">
              <p>Your information is used solely for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Communicating about your project and providing updates</li>
                <li>Delivering the agreed-upon development and maintenance services</li>
                <li>Processing payments and sending invoices</li>
                <li>Providing post-delivery support and maintenance</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">3. Data Storage &amp; Security</h2>
            <div className="space-y-3">
              <p>Project data and client information are stored on secure, encrypted platforms. I take reasonable steps to protect your data from unauthorized access, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encrypted database connections (TLS/SSL)</li>
                <li>Secure authentication for admin panels</li>
                <li>No storage of sensitive payment credentials</li>
              </ul>
              <p>However, no method of electronic transmission or storage is 100% secure. While I strive to protect your data, I cannot guarantee absolute security.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">4. Third-Party Services</h2>
            <div className="space-y-3">
              <p>I use the following third-party services to deliver my services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong className="text-white">Vercel:</strong> Website hosting and deployment</li>
                <li><strong className="text-white">Turso:</strong> Database hosting (encrypted)</li>
                <li><strong className="text-white">Cloudinary:</strong> Image hosting and CDN</li>
                <li><strong className="text-white">WhatsApp:</strong> Client communication</li>
              </ul>
              <p>Each third-party service has its own privacy policy. I do not control their data practices.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">5. Analytics</h2>
            <p>
              This website collects anonymous analytics data including page views, referral sources, and device types. This data is used to understand traffic patterns and improve the website. No personally identifiable information is collected through analytics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">6. Cookies</h2>
            <p>
              This website uses essential cookies for authentication (admin panel login) and basic functionality. No advertising or tracking cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">7. Data Retention</h2>
            <div className="space-y-3">
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong className="text-white">Project data:</strong> Retained for the duration of the project and for 12 months after completion, unless you request earlier deletion</li>
                <li><strong className="text-white">Maintenance data:</strong> Retained for the duration of the maintenance contract</li>
                <li><strong className="text-white">Communication records:</strong> Retained for 24 months for reference purposes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">8. Your Rights</h2>
            <div className="space-y-3">
              <p>Under the <strong className="text-white">Information Technology Act, 2000</strong> and the <strong className="text-white">Digital Personal Data Protection Act, 2023</strong>, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Request access to the personal data I hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing at any time</li>
              </ul>
              <p>To exercise these rights, contact me at <a href="mailto:deshmukhdaniel2005@gmail.com" className="text-primary hover:underline">deshmukhdaniel2005@gmail.com</a>.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              My services are not directed at individuals under 18 years of age. I do not knowingly collect personal information from minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              This privacy policy may be updated from time to time. The latest version will always be available at <a href="/privacy" className="text-primary hover:underline">danieldeshmukh-portfolio.vercel.app/privacy</a>. Material changes will be communicated via email to active clients.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">11. Contact</h2>
            <p>
              For privacy-related questions or requests, contact me at <a href="mailto:deshmukhdaniel2005@gmail.com" className="text-primary hover:underline">deshmukhdaniel2005@gmail.com</a> or call <a href="tel:8552084251" className="text-primary hover:underline">+91 8552084251</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
