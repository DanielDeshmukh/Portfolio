'use client'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ReferralProgramPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Referral Program</h1>
        <p className="text-gray-400 text-sm mb-10">Refer clients, earn discounts. Here&apos;s how it works.</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-gift mr-2"></i>How It Works
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              As an existing client, you&apos;re eligible to receive referral codes. When someone you refer signs up for development or maintenance services, you get discounts on your monthly maintenance bill. The more people you refer, the more you save.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">50%</div>
                <div className="text-sm font-medium text-white mb-1">1st Referral</div>
                <p className="text-xs text-gray-400">50% off your next month&apos;s maintenance</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">50%</div>
                <div className="text-sm font-medium text-white mb-1">2nd Referral</div>
                <p className="text-xs text-gray-400">50% off the month after that</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">100%</div>
                <div className="text-sm font-medium text-white mb-1">3rd Referral</div>
                <p className="text-xs text-gray-400">That month is completely free</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mt-6">
              <p className="text-sm text-gray-300">
                <i className="fas fa-calculator text-primary mr-2"></i>
                <strong className="text-white">Total savings:</strong> If all 3 referrals sign up, you pay for <strong className="text-green-400">10 months instead of 12</strong> — saving 2 full months of maintenance every year.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-list-check mr-2"></i>Rules
            </h2>
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Each client receives <strong className="text-white">up to 3 referral codes per year</strong></li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Codes reset every <strong className="text-white">January 1st</strong> — new year, new 3 codes</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Each code can only be used <strong className="text-white">once</strong></li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>If a referred person doesn&apos;t sign up, the code remains <strong className="text-white">active and reusable</strong></li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Discounts apply to your <strong className="text-white">maintenance bill only</strong>, not development charges</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Discounts are <strong className="text-white">non-transferable</strong> between clients</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-400 mt-0.5 text-xs"></i>Discounts are applied <strong className="text-white">automatically</strong> when the referred client signs up</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-arrow-right mr-2"></i>Step-by-Step
            </h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Get Your Codes', desc: 'Visit the Clients section on this portfolio, find your name, and click "Ask for a Referral". Your codes will be sent to you via WhatsApp.' },
                { step: 2, title: 'Share With Someone', desc: 'Send your referral link or code to anyone who might need a website, app, or POS system built. They\'ll see your name on the referral page.' },
                { step: 3, title: 'They Enquire', desc: 'The referred person clicks your link, fills out the enquiry form (or contacts via WhatsApp), and mentions your referral code.' },
                { step: 4, title: 'They Sign Up', desc: 'Once the referred person confirms their project and starts development, your referral code is marked as used.' },
                { step: 5, title: 'You Get Discounted', desc: 'Your next maintenance bill (or the one after, depending on which referral tier) is automatically discounted. No action needed from you.' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-example mr-2"></i>Example
            </h2>
            <div className="bg-secondary/50 border border-slate/50 rounded-xl p-5 space-y-3 text-sm text-gray-300">
              <p>You&apos;re a client paying ₹8,000/month maintenance. You refer 3 people:</p>
              <ul className="space-y-1.5 ml-4">
                <li>• <strong className="text-white">January:</strong> Your friend Ravi signs up → February bill: <span className="text-green-400">₹4,000 (50% off)</span></li>
                <li>• <strong className="text-white">February:</strong> Your colleague Priya signs up → March bill: <span className="text-green-400">₹4,000 (50% off)</span></li>
                <li>• <strong className="text-white">March:</strong> Your cousin Amit signs up → April bill: <span className="text-green-400">₹0 (completely free)</span></li>
              </ul>
              <p className="pt-2 border-t border-slate/50">
                Total paid in 12 months: <strong className="text-white">₹80,000</strong> instead of ₹96,000. You saved <strong className="text-green-400">₹16,000</strong>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-circle-question mr-2"></i>Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I get my referral codes?',
                  a: 'Visit the Clients section on this portfolio, find your name, and click "Ask for a Referral" button. It opens WhatsApp with a pre-filled message. I\'ll send you your codes.',
                },
                {
                  q: 'Can I choose which month the discount applies to?',
                  a: 'No. The discount is applied automatically to the next billing cycle after the referred client signs up. You cannot delay or redirect it.',
                },
                {
                  q: 'What if the person I refer doesn\'t sign up?',
                  a: 'Your code stays active. You can share it with someone else. It only gets marked as "used" when someone actually signs up and starts their project.',
                },
                {
                  q: 'Can I refer someone for a development project (not maintenance)?',
                  a: 'Yes! The referral code works for any new client — development or maintenance. But your discount only applies to your maintenance bill, not the development cost.',
                },
                {
                  q: 'What if I have multiple projects with different maintenance fees?',
                  a: 'Your discount applies to your total maintenance bill across all projects, not per-project.',
                },
                {
                  q: 'Do unused codes carry over to next year?',
                  a: 'No. All codes reset on January 1st. Use them before the year ends or lose them.',
                },
                {
                  q: 'Can I refer someone who was previously a client?',
                  a: 'No. Referral codes are for new clients only. Former clients re-engaging are not eligible for referral discounts.',
                },
                {
                  q: 'How quickly is the discount applied after my referral signs up?',
                  a: 'The discount is applied within 24 hours of the referred client\'s project confirmation. You\'ll see it reflected in your next maintenance invoice.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-secondary/50 border border-slate/50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    <i className="fas fa-chevron-right text-primary text-xs mr-2"></i>{item.q}
                  </h3>
                  <p className="text-sm text-gray-400 pl-5">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              <i className="fas fa-link mr-2"></i>Your Referral Link
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your personal referral link is available on your client page. Visit the <a href="/#clients" className="text-primary hover:underline">Clients</a> section, find your name, and click on it to see your referral codes and share your link.
            </p>
            <a
              href="/#clients"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-background rounded-lg text-sm font-semibold hover:opacity-90 transition"
            >
              <i className="fas fa-users"></i> Go to Clients
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
