'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'

const WHATSAPP_NUMBER = '918552084251'

const services = [
  'Web Development',
  'Mobile App Development',
  'POS / Billing System',
  'API Development',
  'UI/UX Design',
  'Other',
]

function EnquiryForm() {
  const searchParams = useSearchParams()
  const prefillCode = searchParams.get('code') || ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    details: '',
    referralCode: prefillCode,
  })
  const [showInfo, setShowInfo] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (prefillCode) {
      setForm(f => ({ ...f, referralCode: prefillCode }))
    }
  }, [prefillCode])

  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer || null }),
    }).catch(() => {})
  }, [])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.service) e.service = 'Select a service'
    if (!form.details.trim()) e.details = 'Please describe your project'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSending(true)

    const lines = [
      `*New Enquiry*`,
      ``,
      `*Name:* ${form.name.trim()}`,
      `*Email:* ${form.email.trim()}`,
    ]
    if (form.phone.trim()) lines.push(`*Phone:* ${form.phone.trim()}`)
    lines.push(`*Service:* ${form.service}`)
    lines.push(``, `*Project Details:*`, form.details.trim())
    if (form.referralCode.trim()) {
      lines.push(``, `*Referral Code:* ${form.referralCode.trim()}`)
    }
    lines.push(``, `_Sent from danieldeshmukh-portfolio.vercel.app/enquiry`)

    const msg = encodeURIComponent(lines.join('\n'))
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
      setSending(false)
    }, 300)
  }

  function field(label, key, type = 'text', opts = {}) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label} {opts.required && <span className="text-red-400">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            placeholder={opts.placeholder || ''}
            rows={4}
            className={`w-full bg-background border ${errors[key] ? 'border-red-500' : 'border-slate'} rounded-lg px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-primary transition-colors resize-none`}
          />
        ) : type === 'select' ? (
          <select
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className={`w-full bg-background border ${errors[key] ? 'border-red-500' : 'border-slate'} rounded-lg px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-primary transition-colors`}
          >
            <option value="">-- Select service --</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            placeholder={opts.placeholder || ''}
            className={`w-full bg-background border ${errors[key] ? 'border-red-500' : 'border-slate'} rounded-lg px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-primary transition-colors`}
          />
        )}
        {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">Get in Touch</h1>
          <p className="text-gray-400 text-sm mt-2">Tell me about your project and I&apos;ll get back to you shortly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {field('Full Name', 'name', 'text', { required: true, placeholder: 'Your full name' })}
          {field('Email', 'email', 'email', { required: true, placeholder: 'you@example.com' })}
          {field('Phone', 'phone', 'tel', { placeholder: '+91 XXXXX XXXXX' })}
          {field('Service Needed', 'service', 'select', { required: true })}
          {field('Project Details', 'details', 'textarea', { required: true, placeholder: 'Describe your project, requirements, timeline, budget...' })}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Referral Code
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                className="ml-1.5 w-4 h-4 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold inline-flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                i
              </button>
            </label>
            <input
              type="text"
              value={form.referralCode}
              onChange={e => setForm({ ...form, referralCode: e.target.value })}
              placeholder="Optional — e.g. babujichaay-ABC123-2609121530"
              className="w-full bg-background border border-slate rounded-lg px-4 py-3 text-gray-100 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
            />
            {prefillCode && (
              <p className="text-green-400 text-xs mt-1.5"><i className="fas fa-check-circle mr-1"></i>Referral code pre-filled from your link</p>
            )}
          </div>

          {showInfo && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50" onClick={() => setShowInfo(false)}>
              <div className="bg-[#1e293b] border border-slate rounded-2xl p-6 max-w-sm w-full shadow-2xl" style={{ backgroundColor: '#1e293b' }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-heading font-semibold text-white">Referral Code</h3>
                  <button type="button" onClick={() => setShowInfo(false)} className="w-7 h-7 rounded-full bg-slate/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>

                <div className="space-y-4 text-sm text-gray-300">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <p className="font-semibold text-primary mb-1"><i className="fas fa-tag mr-1.5"></i>Have a code?</p>
                    <p>Enter it above and you&apos;ll get <span className="text-green-400 font-semibold">50% off your first month&apos;s maintenance</span>.</p>
                  </div>

                  <div className="bg-background/50 rounded-xl p-4">
                    <p className="font-semibold text-gray-200 mb-1"><i className="fas fa-search mr-1.5"></i>Don&apos;t have a code?</p>
                    <p className="text-gray-400 mb-2">Ask an existing client for one. Each client has a limited number of referral codes to share.</p>
                    <a
                      href="/#clients"
                      onClick={() => setShowInfo(false)}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-xs"
                    >
                      <i className="fas fa-users"></i>Visit Clients page
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60"
          >
            {sending ? (
              <><i className="fas fa-spinner fa-spin"></i> Opening WhatsApp...</>
            ) : (
              <><i className="fab fa-whatsapp text-lg"></i> Send Enquiry on WhatsApp</>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your enquiry opens directly on WhatsApp. No data is stored on this website.
          </p>
        </form>
      </main>
    </div>
  )
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-400 flex items-center gap-3">
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    }>
      <EnquiryForm />
    </Suspense>
  )
}
