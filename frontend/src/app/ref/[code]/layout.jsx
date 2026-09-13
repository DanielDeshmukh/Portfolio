import { readFileSync } from 'fs'
import { join } from 'path'

function getClientByReferralCode(code) {
  try {
    const data = readFileSync(join(process.cwd(), 'public', 'data', 'clients.json'), 'utf-8')
    const clients = JSON.parse(data).clients
    const codeLower = code.toLowerCase()
    return clients.find(c => {
      const idClean = c.id.replace(/-/g, '').toLowerCase()
      const nameClean = c.name.replace(/\s+/g, '').toLowerCase()
      return codeLower.startsWith(idClean) || codeLower.startsWith(nameClean)
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
      title: 'Referral Link | Daniel Deshmukh',
      description: 'Use this referral link to get a discount on Daniel Deshmukh\'s development services.',
      openGraph: {
        title: 'Referral Link | Daniel Deshmukh',
        description: 'Use this referral link to get a discount on Daniel Deshmukh\'s development services.',
        url: `https://danieldeshmukh-portfolio.vercel.app/ref/${code}`,
        images: [{ url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Daniel Deshmukh' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Referral Link | Daniel Deshmukh',
        description: 'Use this referral link to get a discount on Daniel Deshmukh\'s development services.',
        images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
      },
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
      card: 'summary_large_image',
      title,
      description,
      images: [client.logo || 'https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
    },
  }
}

export default function RefLayout({ children }) {
  return children
}
