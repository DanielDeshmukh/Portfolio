'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function RefPage() {
  const { code } = useParams()
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
        </div>
      </div>
    )
  }

  const isUsed = data.status === 'used'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-secondary/50 border border-slate/50 rounded-2xl p-8 text-center">
          {data.logo && (
            <img src={data.logo} alt={data.client} className="w-28 h-28 rounded-2xl object-contain mx-auto mb-6 bg-background p-3 border border-slate/30" />
          )}

          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            {isUsed ? 'Referral Redeemed' : 'You Were Referred!'}
          </h1>

          {isUsed ? (
            <p className="text-gray-400 text-sm mb-6">This code has already been used.</p>
          ) : (
            <p className="text-gray-400 text-sm mb-6">
              Contact Daniel to get going!
            </p>
          )}

          <div className="bg-background rounded-xl p-4 mb-6">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Your Referral Code</p>
            <div className="flex items-center justify-center gap-3">
              <code className="font-mono text-base sm:text-lg text-primary font-bold tracking-wide break-all">{data.code}</code>
              {!isUsed && (
                <button
                  onClick={copyCode}
                  className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors shrink-0"
                  title="Copy code"
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-sm`}></i>
                </button>
              )}
            </div>
            {copied && <p className="text-green-400 text-xs mt-2"><i className="fas fa-check-circle mr-1"></i>Copied to clipboard</p>}
          </div>

          {!isUsed && (
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
          )}

          {isUsed && (
            <p className="text-gray-500 text-xs mt-2">Contact Daniel directly for assistance.</p>
          )}
        </div>
      </div>
    </div>
  )
}
