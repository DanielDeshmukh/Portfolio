'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadClients } from '../utils/loadData'

export default function Clients() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    loadClients().then(data => setClients(data.clients || []))
  }, [])

  if (clients.length === 0) return null

  return (
    <section id="clients" className="mt-12">
      <h2 className="text-2xl font-heading font-semibold text-goldlight">Clients</h2>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {clients.map(client => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="card flex flex-col items-center gap-3 p-5 border border-slate hover:border-primary transition group text-center"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src={`/${client.logo}`}
                alt={client.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-200 group-hover:text-primary transition">
              {client.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
