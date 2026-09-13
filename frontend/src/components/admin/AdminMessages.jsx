'use client'
import { useState, useEffect } from 'react'

const WHATSAPP_NUMBER = '918552084251'

const templates = [
  {
    id: 'welcome',
    title: 'Welcome to Family',
    icon: 'fas fa-handshake',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    message: `Hi {name}, 🎉\n\nWelcome to the family! I'm Daniel, and I'll be handling your project ({project}).\n\nLooking forward to building something great together. If you have any questions, feel free to reach out anytime.\n\nBest,\nDaniel Deshmukh`,
  },
  {
    id: 'thankyou',
    title: 'Thank You',
    icon: 'fas fa-heart',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/30',
    message: `Hi {name},\n\nJust wanted to take a moment to say thank you for trusting me with your project ({project}). Your support means a lot.\n\nIf you ever need anything, I'm just a message away.\n\nWarm regards,\nDaniel Deshmukh`,
  },
  {
    id: 'referral-success',
    title: 'Referral Secured',
    icon: 'fas fa-check-circle',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    message: `Hi {name}, 🎉\n\nGreat news! The person you referred has officially become a client. Your referral code ({code}) has been successfully used.\n\nYour next month's maintenance bill will reflect the 50% discount. Keep them coming — you've got {remaining} referral slots left this year!\n\nThank you for spreading the word.\n\nBest,\nDaniel Deshmukh`,
  },
  {
    id: 'referral-reusable',
    title: 'Referral Still Active',
    icon: 'fas fa-rotate',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    message: `Hi {name},\n\nI wanted to update you about the person you referred. Unfortunately, they decided not to move forward with the project at this time.\n\nBut don't worry — your referral code ({code}) is still active and can be shared with someone else! You haven't lost anything.\n\nYou still have {remaining} referral slot(s) available this year. Feel free to share it with another potential client.\n\nBest,\nDaniel Deshmukh`,
  },
]

export default function AdminMessages() {
  const [clients, setClients] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedClients, setSelectedClients] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetch('/api/clients', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
    })
      .then(r => r.json())
      .then(d => setClients(d.clients || []))
      .catch(() => {})
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function toggleClient(id) {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectAll) {
      setSelectedClients([])
    } else {
      setSelectedClients(clients.map(c => c.id))
    }
    setSelectAll(!selectAll)
  }

  function generateMessage(template, client) {
    return template.message
      .replace(/{name}/g, client.name)
      .replace(/{project}/g, client.projects?.[0]?.name || 'your project')
      .replace(/{code}/g, '_______________')
      .replace(/{remaining}/g, '3')
  }

  function generateBulkMessages() {
    if (!selectedTemplate || selectedClients.length === 0) {
      showToast('Select a template and at least one client')
      return
    }

    const template = templates.find(t => t.id === selectedTemplate)
    const selected = clients.filter(c => selectedClients.includes(c.id))

    selected.forEach((client, i) => {
      const phone = client.contact?.phone?.replace(/[^0-9]/g, '')
      const msg = generateMessage(template, client)
      const url = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(`[${client.name}] ${msg}`)}`

      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer')
      }, i * 500)
    })

    showToast(`Opening ${selected.length} WhatsApp chats...`)
  }

  function generateCustomBulk() {
    if (!customMessage.trim() || selectedClients.length === 0) {
      showToast('Write a message and select at least one client')
      return
    }

    const selected = clients.filter(c => selectedClients.includes(c.id))

    selected.forEach((client, i) => {
      const phone = client.contact?.phone?.replace(/[^0-9]/g, '')
      const msg = customMessage.replace(/{name}/g, client.name).replace(/{project}/g, client.projects?.[0]?.name || 'your project')
      const url = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(`[${client.name}] ${msg}`)}`

      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer')
      }, i * 500)
    })

    showToast(`Opening ${selected.length} WhatsApp chats...`)
  }

  function sendSingle(client) {
    const msg = selectedTemplate
      ? generateMessage(templates.find(t => t.id === selectedTemplate), client)
      : customMessage || `Hi ${client.name}, `

    const phone = client.contact?.phone?.replace(/[^0-9]/g, '')
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(`[${client.name}] ${msg}`)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <i className="fas fa-check-circle"></i>
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">Send messages to clients via WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">
              <i className="fas fa-file-alt mr-2 text-primary"></i>Templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(selectedTemplate === t.id ? null : t.id); setCustomMessage('') }}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedTemplate === t.id
                      ? `${t.bg} ring-1 ring-white/10`
                      : 'bg-background/50 border-slate/30 hover:border-slate/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`${t.icon} ${t.color} text-sm`}></i>
                    <span className="text-sm font-medium text-white">{t.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{t.message.split('\n')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">
              <i className="fas fa-edit mr-2 text-primary"></i>Custom Message
            </h2>
            <textarea
              value={customMessage}
              onChange={e => { setCustomMessage(e.target.value); setSelectedTemplate(null) }}
              placeholder="Type your custom message... Use {name} for client name, {project} for project name"
              rows={4}
              className="w-full bg-background border border-slate rounded-lg px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              <i className="fas fa-info-circle mr-1"></i>
              Placeholders: {'{name}'} = client name, {'{project}'} = project name
            </p>
          </div>

          {selectedTemplate && selectedClients.length > 0 && (
            <div className="bg-green-900/15 border border-green-500/20 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-green-300 mb-3">
                <i className="fas fa-eye mr-1"></i>Preview
              </h3>
              {clients.filter(c => selectedClients.includes(c.id)).slice(0, 2).map(c => (
                <div key={c.id} className="bg-background/50 rounded-lg p-3 mb-2 last:mb-0">
                  <p className="text-xs text-gray-500 mb-1">→ {c.name}</p>
                  <p className="text-xs text-gray-300 whitespace-pre-line">
                    {generateMessage(templates.find(t => t.id === selectedTemplate), c)}
                  </p>
                </div>
              ))}
              {selectedClients.length > 2 && (
                <p className="text-xs text-gray-500 mt-2">...and {selectedClients.length - 2} more</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 border border-slate/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-white">
                <i className="fas fa-users mr-2 text-primary"></i>Clients
              </h2>
              <span className="text-xs text-gray-400">{selectedClients.length} selected</span>
            </div>

            <label className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg mb-2 cursor-pointer hover:bg-background/80 transition-colors">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleAll}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-gray-300 font-medium">Select All</span>
            </label>

            <div className="space-y-1 max-h-80 overflow-y-auto">
              {clients.map(c => (
                <label
                  key={c.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    selectedClients.includes(c.id)
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-background/50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(c.id)}
                    onChange={() => toggleClient(c.id)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {c.contact?.phone ? (
                        <span><i className="fas fa-phone mr-1"></i>{c.contact.phone}</span>
                      ) : (
                        <span className="text-gray-600">No phone</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); sendSingle(c) }}
                    className="shrink-0 w-7 h-7 rounded-md bg-green-600/20 flex items-center justify-center text-green-400 hover:bg-green-600/40 transition-colors"
                    title={`Message ${c.name}`}
                  >
                    <i className="fab fa-whatsapp text-xs"></i>
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={generateBulkMessages}
              disabled={!selectedTemplate || selectedClients.length === 0}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="fab fa-whatsapp text-base"></i>
              Send Template to {selectedClients.length || ''} Client{selectedClients.length !== 1 ? 's' : ''}
            </button>
            <button
              onClick={generateCustomBulk}
              disabled={!customMessage.trim() || selectedClients.length === 0}
              className="w-full py-3 rounded-xl bg-primary/15 border border-primary/30 text-primary text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="fas fa-paper-plane text-sm"></i>
              Send Custom to {selectedClients.length || ''} Client{selectedClients.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
