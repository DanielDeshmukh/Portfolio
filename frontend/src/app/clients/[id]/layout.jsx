import { readFileSync } from 'fs'
import { join } from 'path'

function getClient(id) {
  try {
    const data = readFileSync(join(process.cwd(), 'public', 'data', 'clients.json'), 'utf-8')
    const clients = JSON.parse(data).clients
    return clients.find(c => c.id === id) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const client = getClient(id)

  if (!client) {
    return {
      title: 'Client Not Found',
      description: 'This client page could not be found.',
    }
  }

  const projectNames = client.projects?.map(p => p.name).join(', ') || 'custom software'
  const title = `${client.name} | Client Portfolio`
  const description = `${client.name} — ${client.description || projectNames}. Built by Daniel Shashank Deshmukh.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://danieldeshmukh-portfolio.vercel.app/clients/${client.id}`,
      images: client.logo ? [{ url: client.logo, width: 200, height: 200, alt: client.name }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: client.logo ? [client.logo] : undefined,
    },
  }
}

export default function ClientLayout({ children }) {
  return children
}
