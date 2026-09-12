'use client'
import { use, useEffect, useState } from 'react'

export default function RefPage({ params }) {
  const { code } = use(params)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!code) return
    fetch(`/api/ref?code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) setData(d)
        else setError(d.error || 'Invalid code')
      })
      .catch(() => setError('Something went wrong'))
      .finally(() => setLoading(false))
  }, [code])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-400 flex items-center gap-3">
          <i className="fas fa-spinner fa-spin"></i>
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-times-circle text-red-400 text-2xl"></i>
          </div>
          <h1 className="text-xl font-heading font-bold text-white mb-2">Invalid Referral</h1>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link href="/" className="text-primary hover:underline text-sm">
            <i className="fas fa-arrow-left mr-1"></i>Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  const isUsed = data.status === 'used'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-primary hover:underline text-xs">
            <i className="fas fa-arrow-left mr-1"></i>Daniel Deshmukh
          </Link>
        </div>

        <div className="bg-secondary/50 border border-slate/50 rounded-2xl p-8 text-center">
          {data.logo && (
            <img src={data.logo} alt={data.client} className="w-16 h-16 rounded-xl object-contain mx-auto mb-4 bg-background p-2" />
          )}

          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isUsed
              ? 'bg-green-900/30 border border-green-500/30'
              : 'bg-primary/10 border border-primary/30'
          }`}>
            <i className={`text-2xl ${isUsed ? 'fas fa-check-circle text-green-400' : 'fas fa-gift text-primary'}`}></i>
          </div>

          <h1 className="text-xl font-heading font-bold text-white mb-2">
            {isUsed ? 'Referral Redeemed' : 'You Were Referred!'}
          </h1>

          {isUsed ? (
            <p className="text-gray-400 text-sm mb-6">This code has already been used.</p>
          ) : (
            <p className="text-gray-400 text-sm mb-6">
              <span className="text-gray-200 font-medium">{data.client}</span> referred you to Daniel for the project <span className="text-gray-200 font-medium">{data.project}</span>.
            </p>
          )}

          <div className="bg-background rounded-xl p-4 mb-6">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Your Referral Code</p>
            <div className="flex items-center justify-center gap-3">
              <code className="font-mono text-lg text-primary font-bold tracking-wide">{data.code}</code>
              {!isUsed && (
                <button
                  onClick={copyCode}
                  className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors"
                  title="Copy code"
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-sm`}></i>
                </button>
              )}
            </div>
            {copied && <p className="text-green-400 text-xs mt-2"><i className="fas fa-check-circle mr-1"></i>Copied to clipboard</p>}
          </div>

          {!isUsed && (
            <div className="bg-background/50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-300 font-medium mb-2"><i className="fas fa-info-circle mr-2 text-primary"></i>What to do next</p>
              <ol className="text-sm text-gray-400 space-y-1.5 list-decimal list-inside">
                <li>Contact Daniel via WhatsApp or email</li>
                <li>Mention this referral code: <span className="text-primary font-mono">{data.code}</span></li>
                <li>You&apos;ll get priority handling as a referred client</li>
              </ol>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <a
              href={`https://wa.me/918552084251?text=${encodeURIComponent('Hi Daniel, I was referred to you with code: ' + data.code)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              Contact on WhatsApp
            </a>
            <a
              href={`/enquiry?code=${encodeURIComponent(data.code)}`}
              className="w-full py-3 rounded-xl bg-primary/15 border border-primary/30 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/25 transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
              Fill Enquiry Form
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
