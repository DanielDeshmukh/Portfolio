import { readFileSync } from 'fs'
import { join } from 'path'

function getClientByReferralCode(code) {
  try {
    const data = readFileSync(join(process.cwd(), 'public', 'data', 'clients.json'), 'utf-8')
    const clients = JSON.parse(data).clients
    return clients.find(c => {
      const prefix = c.id.replace(/-/g, '')
      return code.toLowerCase().startsWith(prefix)
    }) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { code } = await params
  const client = getClientByReferralCode(code)

  if (!client) {
    return {
      title: 'Referral Link',
      description: 'Use this referral link to get a discount on Daniel Deshmukh\'s development services.',
    }
  }

  const title = `Referral from ${client.name} | Daniel Deshmukh`
  const description = `${client.name} referred you to Daniel Shashank Deshmukh. Use this referral code to get 50% off your first month's maintenance.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://danieldeshmukh-portfolio.vercel.app/ref/${code}`,
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
      card: 'summary',
      title,
      description,
      images: [client.logo || 'https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
    },
  }
}

export default function RefLayout({ children }) {
  return children
}
