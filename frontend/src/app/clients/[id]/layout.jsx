import clientsData from '../../../../public/data/clients.json'

const clients = clientsData.clients || []

function getClient(id) {
  return clients.find(c => c.id === id) || null
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
  const title = client.name
  const description = `${client.description || projectNames} — Built by Daniel Shashank Deshmukh.`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title: `${client.name} | Daniel Deshmukh`,
      description,
      url: `https://danieldeshmukh-portfolio.vercel.app/clients/${client.id}`,
      images: [
        {
          url: client.logo || 'https://danieldeshmukh-portfolio.vercel.app/og-image.png',
          width: 200,
          height: 200,
          alt: client.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${client.name} | Daniel Deshmukh`,
      description,
      images: [client.logo || 'https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
    },
  }
}

export default function ClientLayout({ children }) {
  return children
}
