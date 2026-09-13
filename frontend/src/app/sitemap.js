import { readFileSync } from 'fs'
import { join } from 'path'

const BASE_URL = 'https://danieldeshmukh-portfolio.vercel.app'

function getClients() {
  try {
    const data = readFileSync(join(process.cwd(), 'public', 'data', 'clients.json'), 'utf-8')
    return JSON.parse(data).clients || []
  } catch {
    return []
  }
}

export default function sitemap() {
  const clients = getClients()
  const now = new Date().toISOString()

  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/enquiry`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/refund`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const clientPages = clients.map(client => ({
    url: `${BASE_URL}/clients/${client.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...clientPages]
}
