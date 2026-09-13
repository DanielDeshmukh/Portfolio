'use client'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: September 2026</p>

        <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">1. Development Services</h2>
            <div className="space-y-3">
              <p>
                <strong className="text-white">Advance Payment:</strong> An upfront advance is required before development work begins. This advance is non-refundable once work has started, as it covers initial planning, setup, and resource allocation.
              </p>
              <p>
                <strong className="text-white">Cancellation Before Work Starts:</strong> If you cancel the project before any development work has begun, the full advance will be refunded within 7 working days.
              </p>
              <p>
                <strong className="text-white">Cancellation During Development:</strong> If you cancel mid-development, the advance is non-refundable. You will receive all work completed up to the cancellation date. Any outstanding payments for completed work are due immediately.
              </p>
              <p>
                <strong className="text-white">Final Payment:</strong> The remaining payment (after advance) is due upon project delivery. Delayed payment beyond 15 days may result in suspension of support services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">2. Maintenance Services</h2>
            <div className="space-y-3">
              <p>
                <strong className="text-white">Monthly Billing:</strong> Maintenance is billed monthly, due at the beginning of each billing cycle.
              </p>
              <p>
                <strong className="text-white">Non-Refundable:</strong> Once a maintenance month has begun, the fee is non-refundable. This applies regardless of usage during the month.
              </p>
              <p>
                <strong className="text-white">Cancellation:</strong> You may cancel maintenance at any time. The cancellation takes effect from the next billing cycle. You will not be charged for the following month.
              </p>
              <p>
                <strong className="text-white">No Notice Period:</strong> There is no minimum lock-in period or notice period required. You are free to stop maintenance at the end of any paid month.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">3. Refund Processing</h2>
            <div className="space-y-3">
              <p>Eligible refunds (cancellation before work starts) are processed within <strong className="text-white">7 working days</strong> via the original payment method (UPI or Bank Transfer).</p>
              <p>You will receive a confirmation once the refund is initiated.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">4. Disputes</h2>
            <p>
              In case of any dispute regarding payments or services, please contact us directly at <a href="mailto:deshmukhdaniel2005@gmail.com" className="text-primary hover:underline">deshmukhdaniel2005@gmail.com</a> or call <a href="tel:8552084251" className="text-primary hover:underline">+91 8552084251</a>. We aim to resolve all disputes amicably within 15 working days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-white mb-3">5. Consumer Rights</h2>
            <p>
              This policy is governed by the <strong className="text-white">Consumer Protection Act, 2019</strong> and the <strong className="text-white">Indian Contract Act, 1872</strong>. You have the right to seek resolution through consumer forums if a dispute cannot be resolved directly.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
