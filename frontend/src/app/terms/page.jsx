'use client'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: September 2026</p>

        <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">1. Agreement</h2>
            <p>
              By engaging Daniel Shashank Deshmukh (&quot;the Freelancer&quot;, &quot;I&quot;, &quot;me&quot;) for development or maintenance services, you (&quot;the Client&quot;) agree to the terms outlined on this page and on the <a href="/pricing" className="text-primary hover:underline">Pricing &amp; Services</a> page. These terms form a binding agreement under the <strong className="text-white">Indian Contract Act, 1872</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">2. Scope of Work</h2>
            <div className="space-y-3">
              <p>The scope of each project is defined in the initial discussion and confirmed via WhatsApp or email before work begins. Any changes to the scope after confirmation may result in additional charges, which will be communicated and agreed upon before implementation.</p>
              <p>Deliverables, timelines, and milestones are documented in the project proposal sent to the Client. Both parties are expected to adhere to the agreed timeline.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">3. Intellectual Property</h2>
            <div className="space-y-3">
              <p>Upon full payment, the Client receives <strong className="text-white">full ownership</strong> of the source code, design files, and all deliverables created for the project.</p>
              <p>The Freelancer reserves the right to showcase the project in the portfolio and on social media, unless the Client requests otherwise in writing.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">4. Payments</h2>
            <div className="space-y-3">
              <p>All payments are to be made via <strong className="text-white">UPI or Bank Transfer</strong> to the account details provided in the invoice.</p>
              <p>Development payments: Advance (non-refundable) + final payment on delivery.</p>
              <p>Maintenance payments: Monthly, due at the start of each billing cycle. See the <a href="/refund" className="text-primary hover:underline">Refund &amp; Cancellation Policy</a> for details.</p>
              <p>GST is not applicable as the Freelancer is not registered under GST (annual turnover below the ₹20 lakh threshold as per the <strong className="text-white">CGST Act, 2017</strong>).</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <div className="space-y-3">
              <p>The Freelancer will use reasonable efforts to deliver quality work. However, the Freelancer is not liable for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Losses arising from third-party services (hosting providers, payment gateways, APIs)</li>
                <li>Data loss caused by the Client&apos;s own actions or negligence</li>
                <li>Business losses, lost profits, or consequential damages</li>
                <li>Issues caused by the Client modifying the delivered code without consultation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">6. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary information shared during the project. This includes business data, login credentials, API keys, and project-specific details. This obligation survives the termination of the agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">7. Termination</h2>
            <div className="space-y-3">
              <p>Either party may terminate the agreement with written notice. Upon termination:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All completed work is delivered to the Client</li>
                <li>Outstanding payments for completed work become due immediately</li>
                <li>Maintenance terminates at the end of the current paid month</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">8. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra. Relevant legislation includes the <strong className="text-white">Indian Contract Act, 1872</strong>, the <strong className="text-white">Information Technology Act, 2000</strong>, and the <strong className="text-white">Consumer Protection Act, 2019</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>
              These terms may be updated from time to time. The latest version will always be available at <a href="/terms" className="text-primary hover:underline">danieldeshmukh-portfolio.vercel.app/terms</a>. Continued engagement after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">10. Contact</h2>
            <p>
              For questions about these terms, contact me at <a href="mailto:deshmukhdaniel2005@gmail.com" className="text-primary hover:underline">deshmukhdaniel2005@gmail.com</a> or call <a href="tel:8552084251" className="text-primary hover:underline">+91 8552084251</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
